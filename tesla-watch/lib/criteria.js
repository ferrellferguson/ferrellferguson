// Turns a raw Tesla inventory record into our normalized shape, and decides
// whether it's a "match" worth tracking/notifying on.
//
// NOTE ON DELIVERABILITY: earlier manual testing (see README) found that
// `AllDeliverableStates` can produce false negatives depending on the network
// location the request comes from — a genuinely orderable car was seen as
// "not deliverable" from one vantage point but was fine on tesla.com directly.
// So this does NOT hard-filter on deliverability. It's surfaced as informational
// only; always double-check a specific car's own order page before ruling it out.

const HW_LABELS = {
  HARDWARE_2_5: "HW2.5",
  "HARDWARE_2.5": "HW2.5",
  HARDWARE_3: "HW3",
  HARDWARE_4: "HW4",
};

function hwLabel(raw) {
  if (!raw) return null;
  return HW_LABELS[raw] || raw;
}

function normalize(raw) {
  return {
    vin: raw.VIN,
    price: raw.Price,
    trim: raw.TrimName || "",
    year: raw.Year,
    miles: raw.Odometer,
    city: raw.City || "",
    color: (raw.PAINT && raw.PAINT[0]) || "",
    hwVersionRaw: raw.AP_HARDWARE_VERSION || null,
    hwVersion: hwLabel(raw.AP_HARDWARE_VERSION),
    deliverableStates: raw.AllDeliverableStates || [],
  };
}

function isLongRangeAWD(trim) {
    return /long range/i.test(trim) && /(awd|dual)/i.test(trim);
}

/**
 * Returns a criterion label string if the car matches what we're watching for,
 * or null if it doesn't qualify. Tune the thresholds via env vars (see
 * .env.example) rather than hardcoding — these are placeholders, not gospel;
 * port over whatever exact thresholds you're actually using.
 */
function classify(car) {
  const maxPrice = Number(process.env.MAX_PRICE || 36000);
  const minYear = Number(process.env.MIN_YEAR || 2022);
  const requireLRAWD = process.env.REQUIRE_LONG_RANGE_AWD !== "false";

  if (car.price == null || car.price > maxPrice) return null;
  if (car.year != null && car.year < minYear) return null;
  if (requireLRAWD && !isLongRangeAWD(car.trim)) return null;

  if (car.hwVersion === "HW4") return "hw4_awd";
  return "lr_awd";
}

module.exports = { normalize, classify };
