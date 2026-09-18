const { fetchAllUsedModel3s } = require("../lib/teslaApi");
const { normalize, classify } = require("../lib/criteria");
const { getCar, saveCar, getAllKnownVins } = require("../lib/store");
const { notifyNewMatch, notifyPriceDrop } = require("../lib/notify");

module.exports = async function handler(req, res) {
  // Vercel's own native Cron Jobs send `Authorization: Bearer <CRON_SECRET>`
  // automatically once CRON_SECRET is set as an env var. External schedulers
  // (GitHub Actions, etc.) pass ?secret=<CRON_SECRET> instead.
  const expected = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization;
  const querySecret = req.query && req.query.secret;
  const authorized =
    !expected || authHeader === `Bearer ${expected}` || querySecret === expected;

  if (!authorized) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  const startedAt = new Date().toISOString();

  let cars, blocked, pagesFetched;
  try {
    ({ cars, blocked, pagesFetched } = await fetchAllUsedModel3s());
  } catch (err) {
    console.error("Tesla API fetch failed:", err);
    res.status(502).json({ error: "tesla_fetch_failed", message: String(err) });
    return;
  }

  if (blocked) {
    // Tesla's bot-detection kicked in. Per policy: never try to work around
    // this. Just report it and let the next scheduled run try again later.
    console.warn("Tesla API returned a bot-detection challenge — backing off.");
    res.status(200).json({
      startedAt,
      blocked: true,
      message: "Tesla bot-detection challenge hit; skipped this run without retrying.",
    });
    return;
  }

  const seenThisRun = new Set();
  const newMatches = [];
  const priceDrops = [];

  for (const raw of cars) {
    const car = normalize(raw);
    if (!car.vin) continue;

    const criterion = classify(car);
    if (!criterion) continue; // doesn't meet our watch criteria — ignore

    seenThisRun.add(car.vin);

    const existing = await getCar(car.vin);
    const nowIso = new Date().toISOString();

    if (!existing || !existing.vin) {
      // Brand new match
      await saveCar(car.vin, {
        vin: car.vin,
        price: car.price,
        trim: car.trim,
        year: car.year,
        miles: car.miles,
        city: car.city,
        color: car.color,
        hwVersion: car.hwVersion || "",
        criterion,
        firstSeenAt: nowIso,
        lastSeenAt: nowIso,
        stillListed: "true",
      });
      newMatches.push(car);
      await notifyNewMatch(car);
    } else {
      const oldPrice = Number(existing.price);
      const updates = {
        price: car.price,
        miles: car.miles,
        lastSeenAt: nowIso,
        stillListed: "true",
      };
      await saveCar(car.vin, updates);

      if (!Number.isNaN(oldPrice) && car.price != null && car.price < oldPrice) {
        priceDrops.push({ car, oldPrice });
        await notifyPriceDrop(car, oldPrice);
      }
    }
  }

  // Anything previously tracked but not seen this run = delisted (sold, or
  // fell outside our filters — either way, mark it rather than deleting so
  // history isn't lost).
  const knownVins = await getAllKnownVins();
  const nowIso = new Date().toISOString();
  for (const vin of knownVins) {
    if (seenThisRun.has(vin)) continue;
    const existing = await getCar(vin);
    if (existing && existing.stillListed === "true") {
      await saveCar(vin, { stillListed: "false", delistedAt: nowIso });
    }
  }

  res.status(200).json({
    startedAt,
    finishedAt: nowIso,
    pagesFetched,
    totalScanned: cars.length,
    matchesThisRun: seenThisRun.size,
    newMatches: newMatches.map((c) => c.vin),
    priceDrops: priceDrops.map((d) => ({ vin: d.car.vin, from: d.oldPrice, to: d.car.price })),
  });
};
