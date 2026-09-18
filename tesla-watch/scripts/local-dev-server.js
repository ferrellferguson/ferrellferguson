// Minimal local server for manually testing the status page + Run Now button
// end-to-end (including the real /api/scan call) without `vercel dev`.
//
// Usage: node --env-file=.env.local scripts/local-dev-server.js

const http = require("http");
const url = require("url");
const statusHandler = require("../api/status.js");
const scanHandler = require("../api/scan.js");

function wrapRes(res) {
  res.status = function (code) {
    res.statusCode = code;
    return res;
  };
  res.json = function (body) {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(body));
  };
  res.send = function (body) {
    res.end(body);
  };
  return res;
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  req.query = parsed.query;
  wrapRes(res);

  try {
    if (parsed.pathname === "/api/scan") {
      await scanHandler(req, res);
    } else {
      await statusHandler(req, res);
    }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const PORT = 8931;
server.listen(PORT, () => console.log(`http://localhost:${PORT}`));
