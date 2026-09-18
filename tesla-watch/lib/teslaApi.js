// Tesla's undocumented public used-inventory REST API.
// This query shape and pagination approach were validated live over several days
// of manual polling before being ported here — see README for details.

const BASE_URL = "https://www.tesla.com/inventory/api/v4/inventory-results";

const PAGE_SIZE = 24;        // Tesla caps each response at 24 results no matter what `count` says
const MAX_PAGES = 30;        // safety cap: 30 * 24 = 720 results, comfortably above what one model/region returns
const PAGE_DELAY_MS = 400;   // small gap between page requests — be a polite citizen, not a hammer

function buildQuery(offset) {
  return {
    query: {
      model: "m3",
      condition: "used",
      options: {},
      arrangeby: "Price",
      order: "asc",
      market: "US",
      language: "en",
      super_region: "north america",
      lng: Number(process.env.TESLA_LNG || -95.13),
      lat: Number(process.env.TESLA_LAT || 29.51),
      zip: process.env.TESLA_ZIP || "77573",
      range: Number(process.env.TESLA_RANGE || 200),
      region: process.env.TESLA_REGION || "TX",
    },
    offset: 0,
    count: 100,
    outsideOffset: offset,
    outsideSearch: true,
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetches one page of results. Returns { results, blocked } —
 * blocked=true means Tesla's bot-detection (429 + cpr_chlge) kicked in.
 * We NEVER attempt to work around that; callers must back off and stop.
 */
async function fetchPage(offset) {
  const url = `${BASE_URL}?query=${encodeURIComponent(JSON.stringify(buildQuery(offset)))}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
      Accept: "application/json",
    },
  });

  if (res.status === 429) {
    let body = {};
    try {
      body = await res.json();
    } catch {
      /* ignore parse errors on the error path */
    }
    return { results: [], blocked: true, challenge: body };
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Tesla API returned HTTP ${res.status}: ${body.slice(0, 500)}`);
  }

  const data = await res.json();
  return { results: data.results || [], blocked: false };
}

/**
 * Pages through the full nationwide used Model 3 result set.
 * Stops on: an empty page, hitting MAX_PAGES, or a bot-detection block.
 * Returns { cars, blocked, pagesFetched }.
 */
async function fetchAllUsedModel3s() {
  const cars = [];
  let offset = 0;
  let pagesFetched = 0;

  for (let page = 0; page < MAX_PAGES; page++) {
    const { results, blocked } = await fetchPage(offset);
    pagesFetched++;

    if (blocked) {
      return { cars, blocked: true, pagesFetched };
    }
    if (!results.length) {
      break;
    }

    cars.push(...results);
    offset += PAGE_SIZE;

    if (results.length < PAGE_SIZE) break; // short page == last page

    await sleep(PAGE_DELAY_MS);
  }

  return { cars, blocked: false, pagesFetched };
}

module.exports = { fetchAllUsedModel3s };
