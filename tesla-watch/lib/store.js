// State storage via Upstash Redis (Vercel's own "Vercel KV" was sunset — Upstash
// via the Vercel Marketplace integration is the direct successor and drop-in
// replacement pattern; see README for setup). One hash per VIN, plus a set that
// tracks every VIN we've ever seen so we can detect delistings.
//
// Older "Vercel KV"-style Marketplace connections inject KV_REST_API_URL /
// KV_REST_API_TOKEN instead of UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
// — both point at the same Upstash REST API, so fall back to whichever pair
// is actually present rather than requiring a specific integration flow.
const { Redis } = require("@upstash/redis");

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const redis = new Redis({ url, token });

const KNOWN_VINS_KEY = "tesla_watch:known_vins";

function carKey(vin) {
  return `tesla_watch:car:${vin}`;
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

module.exports = { getCar, saveCar, getAllKnownVins };
