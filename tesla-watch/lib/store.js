// State storage via Upstash Redis (Vercel's own "Vercel KV" was sunset — Upstash
// via the Vercel Marketplace integration is the direct successor and drop-in
// replacement pattern; see README for setup). One hash per VIN, plus a set that
// tracks every VIN we've ever seen so we can detect delistings.

const { Redis } = require("@upstash/redis");

const redis = Redis.fromEnv();

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
