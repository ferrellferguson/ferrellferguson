const { getAllCars, getPriceHistory, getRunMeta, isTrue, isFalse } = require("../lib/store");

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function fmtMoney(n) {
  const num = Number(n);
  return Number.isFinite(num) ? `$${num.toLocaleString()}` : "?";
}

function fmtMiles(n) {
  const num = Number(n);
  return Number.isFinite(num) ? `${num.toLocaleString()} mi` : "?";
}

function fmtDate(iso) {
  if (!iso) return "?";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "?";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtRelative(iso) {
  if (!iso) return "never";
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms)) return "unknown";
  const mins = Math.round(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function priceHistoryLine(history) {
  if (!history.length) return "";
  return history
    .map((h) => `${fmtMoney(h.price)} <span class="hdate">(${fmtDate(h.at)})</span>`)
    .join(' <span class="arrow">&rarr;</span> ');
}

function summarizeError(raw) {
  if (!raw) return "";
  // Tesla's Akamai block page comes through as a full HTML document; strip
  // markup and collapse whitespace so the status card shows a readable line
  // instead of a wall of tags.
  const text = String(raw).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 160 ? `${text.slice(0, 160)}…` : text;
}

function orderUrl(vin) {
  return `https://www.tesla.com/m3/order/${encodeURIComponent(vin)}`;
}

function carCard(car, history, { delisted } = {}) {
  const title = `${esc(car.year)} Model 3 ${esc(car.trim)}`;
  const historyLine = priceHistoryLine(history);
  return `
    <div class="card${delisted ? " delisted" : ""}">
      <div class="card-top">
        <span class="price">${fmtMoney(car.price)}</span>
        ${car.hwVersion ? `<span class="badge">${esc(car.hwVersion)}</span>` : ""}
        ${delisted ? `<span class="badge badge-gone">No longer listed</span>` : ""}
      </div>
      <h3>${title}</h3>
      <p class="meta">${fmtMiles(car.miles)} &middot; ${esc(car.city) || "Unknown location"}</p>
      <p class="meta small">First seen ${fmtDate(car.firstSeenAt)}${
        delisted ? ` &middot; delisted ${fmtDate(car.delistedAt)}` : ` &middot; last checked ${fmtDate(car.lastSeenAt)}`
      }</p>
      ${historyLine ? `<p class="history">${historyLine}</p>` : ""}
      ${!delisted ? `<a class="order-link" href="${orderUrl(car.vin)}" target="_blank" rel="noreferrer">View on Tesla &rarr;</a>` : ""}
    </div>`;
}

module.exports = async function handler(req, res) {
  const [cars, runMetaRaw] = await Promise.all([getAllCars(), getRunMeta()]);
  // hgetall on a key that has never been written returns null, not {}.
  const runMeta = runMetaRaw || {};

  const withHistory = await Promise.all(
    cars.map(async (car) => ({ car, history: await getPriceHistory(car.vin) }))
  );

  const active = withHistory
    .filter(({ car }) => !isFalse(car.stillListed))
    .sort((a, b) => Number(a.car.price) - Number(b.car.price));
  const delisted = withHistory
    .filter(({ car }) => isFalse(car.stillListed))
    .sort((a, b) => new Date(b.car.delistedAt || 0) - new Date(a.car.delistedAt || 0));

  const statusOk = isTrue(runMeta.ok);
  const statusBlocked = isTrue(runMeta.blocked);
  const statusLabel = statusBlocked
    ? "Blocked by Tesla's bot detection"
    : statusOk
    ? "Running normally"
    : runMeta.error
    ? "Last run errored"
    : "No runs yet";
  const statusClass = statusBlocked || (!statusOk && runMeta.error) ? "status-bad" : statusOk ? "status-ok" : "status-unknown";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>tesla-watch status</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 0;
    background: #0a0a0f;
    color: #e5e5ea;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
  }
  .wrap { max-width: 920px; margin: 0 auto; padding: 48px 24px 80px; }
  header { margin-bottom: 32px; }
  header a.back { color: #8b8b96; text-decoration: none; font-size: 14px; }
  header a.back:hover { color: #e5e5ea; }
  h1 { font-size: 32px; margin: 12px 0 4px; }
  .tagline { color: #8b8b96; margin: 0 0 24px; }
  .status-card {
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    padding: 20px 24px;
    display: flex; flex-wrap: wrap; gap: 24px; align-items: center;
    background: rgba(255,255,255,0.03);
    margin-bottom: 40px;
  }
  .status-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 8px; }
  .status-ok .status-dot { background: #34d399; }
  .status-bad .status-dot { background: #f87171; }
  .status-unknown .status-dot { background: #8b8b96; }
  .status-label { font-weight: 600; }
  .stat { font-size: 13px; color: #8b8b96; }
  .stat b { color: #e5e5ea; font-weight: 600; }
  h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #8b8b96; margin: 40px 0 16px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
  .card {
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    padding: 18px;
    background: rgba(255,255,255,0.03);
  }
  .card.delisted { opacity: 0.55; }
  .card-top { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .price { font-size: 22px; font-weight: 700; }
  .badge {
    font-size: 11px; padding: 3px 8px; border-radius: 999px;
    background: rgba(139,92,246,0.15); color: #c4b5fd; font-weight: 600;
  }
  .badge-gone { background: rgba(248,113,113,0.15); color: #fca5a5; }
  .card h3 { margin: 4px 0; font-size: 16px; }
  .meta { margin: 2px 0; color: #b8b8c2; font-size: 13px; }
  .meta.small { color: #8b8b96; font-size: 12px; }
  .history { font-size: 12px; color: #b8b8c2; margin: 10px 0 0; line-height: 1.6; }
  .history .hdate { color: #6f6f7a; }
  .history .arrow { color: #6f6f7a; }
  .order-link {
    display: inline-block; margin-top: 12px; font-size: 13px; font-weight: 600;
    color: #a78bfa; text-decoration: none;
  }
  .order-link:hover { text-decoration: underline; }
  .empty { color: #8b8b96; font-size: 14px; }
  .run-now { margin-left: auto; display: flex; align-items: center; gap: 10px; }
  .run-now button {
    background: #7c3aed; color: white; border: none; border-radius: 8px;
    padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer;
  }
  .run-now button:hover { background: #8b5cf6; }
  .run-now button:disabled { opacity: 0.6; cursor: default; }
  .run-status { font-size: 12px; color: #8b8b96; min-width: 140px; }
</style>
</head>
<body>
  <div class="wrap">
    <header>
      <a class="back" href="https://ferrellferguson.com/#projects">&larr; ferrellferguson.com</a>
      <h1>tesla-watch</h1>
      <p class="tagline">Watching Tesla's used Model 3 inventory so I don't have to.</p>
    </header>

    <div class="status-card ${statusClass}">
      <div><span class="status-dot"></span><span class="status-label">${esc(statusLabel)}</span></div>
      <div class="stat">Last checked <b>${fmtRelative(runMeta.finishedAt)}</b></div>
      ${runMeta.totalScanned ? `<div class="stat"><b>${esc(runMeta.totalScanned)}</b> listings scanned</div>` : ""}
      <div class="stat"><b>${active.length}</b> current match${active.length === 1 ? "" : "es"}</div>
      ${runMeta.error ? `<div class="stat" style="color:#fca5a5">${esc(summarizeError(runMeta.error))}</div>` : ""}
      <div class="run-now">
        <span class="run-status" id="runStatus"></span>
        <button id="runNowBtn" type="button">Run Now</button>
      </div>
    </div>

    <h2>Current Matches</h2>
    ${
      active.length
        ? `<div class="grid">${active.map(({ car, history }) => carCard(car, history)).join("")}</div>`
        : `<p class="empty">Nothing matching your criteria right now.</p>`
    }

    ${
      delisted.length
        ? `<h2>Recently Delisted</h2><div class="grid">${delisted
            .slice(0, 12)
            .map(({ car, history }) => carCard(car, history, { delisted: true }))
            .join("")}</div>`
        : ""
    }
  </div>
  <script>
    (function () {
      var STORAGE_KEY = "tesla_watch_secret";
      var btn = document.getElementById("runNowBtn");
      var statusEl = document.getElementById("runStatus");

      function setStatus(text) {
        statusEl.textContent = text;
      }

      btn.addEventListener("click", function () {
        var secret = localStorage.getItem(STORAGE_KEY);
        if (!secret) {
          secret = window.prompt("Cron secret (remembered on this device only):") || "";
          if (!secret) return;
          localStorage.setItem(STORAGE_KEY, secret);
        }

        btn.disabled = true;
        setStatus("Running scan...");

        fetch("/api/scan?secret=" + encodeURIComponent(secret))
          .then(function (res) {
            if (res.status === 401) {
              localStorage.removeItem(STORAGE_KEY);
              throw new Error("Wrong secret — try again");
            }
            return res.json().then(function (body) {
              if (!res.ok) throw new Error(body.message || body.error || "Scan failed");
              return body;
            });
          })
          .then(function (body) {
            if (body.blocked) {
              setStatus("Blocked by Tesla — see status below");
            } else {
              setStatus("Done — reloading...");
            }
            setTimeout(function () {
              window.location.reload();
            }, 1200);
          })
          .catch(function (err) {
            btn.disabled = false;
            setStatus(err.message);
          });
      });
    })();
  </script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
};
