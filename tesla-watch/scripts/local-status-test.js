// One-off: seeds fake test data, renders the status page to a local HTML
// file for visual review, then deletes the fake data. Doesn't touch real
// tracked cars (uses a distinct VIN prefix).
//
// Usage: node --env-file=.env.local scripts/local-status-test.js

const fs = require("fs");
const path = require("path");
const { saveCar, appendPriceHistory, saveRunMeta } = require("../lib/store");
const statusHandler = require("../api/status.js");

const TEST_VINS = ["TESTVIN0000000001", "TESTVIN0000000002", "TESTVIN0000000003"];

async function seed() {
  await saveRunMeta({
    startedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    finishedAt: new Date().toISOString(),
    ok: "true",
    blocked: "false",
    error: "",
    pagesFetched: 4,
    totalScanned: 812,
    matchesThisRun: 2,
    newMatchCount: 0,
    priceDropCount: 1,
  });

  await saveCar(TEST_VINS[0], {
    vin: TEST_VINS[0], price: 33990, trim: "Long Range AWD", year: 2023,
    miles: 18240, city: "Houston, TX", color: "White", hwVersion: "HW4",
    criterion: "hw4_awd", firstSeenAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    lastSeenAt: new Date().toISOString(), stillListed: "true",
  });
  await appendPriceHistory(TEST_VINS[0], 35990);
  await appendPriceHistory(TEST_VINS[0], 34490);
  await appendPriceHistory(TEST_VINS[0], 33990);

  await saveCar(TEST_VINS[1], {
    vin: TEST_VINS[1], price: 35500, trim: "Long Range AWD", year: 2022,
    miles: 24100, city: "Austin, TX", color: "Black", hwVersion: "HW3",
    criterion: "lr_awd", firstSeenAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    lastSeenAt: new Date().toISOString(), stillListed: "true",
  });
  await appendPriceHistory(TEST_VINS[1], 35500);

  await saveCar(TEST_VINS[2], {
    vin: TEST_VINS[2], price: 32000, trim: "Long Range AWD", year: 2023,
    miles: 15000, city: "San Antonio, TX", color: "Blue", hwVersion: "HW4",
    criterion: "hw4_awd", firstSeenAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    lastSeenAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    stillListed: "false", delistedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  });
  await appendPriceHistory(TEST_VINS[2], 33500);
  await appendPriceHistory(TEST_VINS[2], 32000);
}

async function render() {
  const req = {};
  let captured = "";
  const res = {
    setHeader() {},
    status() { return this; },
    send(html) { captured = html; },
  };
  await statusHandler(req, res);
  const outPath = path.join(__dirname, "..", "status-preview.html");
  fs.writeFileSync(outPath, captured);
  console.log("Wrote", outPath);
}

async function cleanup() {
  const { Redis } = require("@upstash/redis");
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
  });
  for (const vin of TEST_VINS) {
    await redis.del(`tesla_watch:car:${vin}`);
    await redis.del(`tesla_watch:price_history:${vin}`);
    await redis.srem("tesla_watch:known_vins", vin);
  }
  // The seeded run meta overwrites the real one wholesale (it's a single
  // shared key, not per-VIN), so it has to go too, not just the test cars.
  await redis.del("tesla_watch:last_run");
  console.log("Cleaned up test VINs and seeded run meta");
}

(async () => {
  const mode = process.argv[2];
  if (mode === "cleanup") {
    await cleanup();
  } else {
    await seed();
    await render();
  }
})();
