// Runs the scan handler directly, in-process, for local testing or for
// scheduling from a machine with a normal (non-datacenter) IP if Tesla's
// edge network ends up blocking Vercel's serverless IP ranges.
//
// Usage: node --env-file=.env.local scripts/local-scan.js

const handler = require("../api/scan.js");

function fakeReqRes() {
  const req = {
    headers: {},
    query: { secret: process.env.CRON_SECRET },
  };
  const res = {
    _status: 200,
    status(code) {
      this._status = code;
      return this;
    },
    json(body) {
      console.log(`HTTP ${this._status}`);
      console.log(JSON.stringify(body, null, 2));
    },
  };
  return { req, res };
}

(async () => {
  const { req, res } = fakeReqRes();
  await handler(req, res);
})();
