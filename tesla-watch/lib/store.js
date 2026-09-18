// State storage via Upstash Redis (Vercel's own "Vercel KV" was sunset — Upstash
// via the Vercel Marketplace integration is the direct successor and drop-in
// replacement pattern; see README for setup). One hash per VIN, plus a set that
// tracks every VIN we've ever seen so we can detect delistings, plus a list per
// VIN recording every price we've observed for it (for the status page's price
// history), plus one hash recording the outcome of the most recent scan.
//
// Older "Vercel KV"-style Marketplace connections inject KV_REST_API_URL /
// KV_REST_API_TOKEN instead of UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
// — both point at the same Upstash REST API, so fall back to whichever pair
// is actually present rather than requiring a specific integration flow.
const { Redis } = require("@upstash/redis");

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const redis = new Redis({ url, token });

// @upstash/redis auto-deserializes "true"/"false" string values back into
// real booleans on read, so callers must not rely on strict `=== "true"`
// string comparisons against hash fields that were written as those strings.
function isTrue(v) {
  return v === true || v === "true";
}
function isFalse(v) {
  return v === false || v === "false";
}

const KNOWN_VINS_KEY = "tesla_watch:known_vins";
const LAST_RUN_KEY = "tesla_watch:last_run";
const MAX_HISTORY_ENTRIES = 200;

function carKey(vin) {
  return `tesla_watch:car:${vin}`;
}

function priceHistoryKey(vin) {
  return `tesla_watch:price_history:${vin}`;
}

async function getCar(vin) {
  return redis.hgetall(carKey(vin));
}

async function saveCar(vin, fields) {
  await redis.hset(carKey(vin), fields);
  await redis.sadd(KNOWN_VINS_KEY, vin);
}

async function getAllKnownVins() {
  return redis.smembers(KNOWN_VINS_KEY);
}

async function getAllCars() {
  const vins = await getAllKnownVins();
  const cars = await Promise.all(vins.map((vin) => getCar(vin)));
  return cars.filter((c) => c && c.vin);
}

// Appends a {price, at} entry to a VIN's price history and trims it to the
// most recent MAX_HISTORY_ENTRIES so it can't grow unbounded over time.
async function appendPriceHistory(vin, price) {
  const entry = JSON.stringify({ price, at: new Date().toISOString() });
  await redis.rpush(priceHistoryKey(vin), entry);
  await redis.ltrim(priceHistoryKey(vin), -MAX_HISTORY_ENTRIES, -1);
}

async function getPriceHistory(vin) {
  const raw = await redis.lrange(priceHistoryKey(vin), 0, -1);
  return raw.map((entry) => (typeof entry === "string" ? JSON.parse(entry) : entry));
}

async function saveRunMeta(meta) {
  await redis.hset(LAST_RUN_KEY, meta);
}

async function getRunMeta() {
  return redis.hgetall(LAST_RUN_KEY);
}

module.exports = {
  getCar,
  saveCar,
  getAllKnownVins,
  getAllCars,
  appendPriceHistory,
  getPriceHistory,
  saveRunMeta,
  getRunMeta,
  isTrue,
  isFalse,
};
