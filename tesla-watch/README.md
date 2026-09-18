# tesla-watch

A small serverless watcher for Tesla's used-inventory listings. It scans Tesla's
public (undocumented) inventory API, tracks matches in Redis, and pings you on
Telegram/email when something new shows up or a tracked car's price drops.

This exists because a browser-tab-based approach (a Claude Artifact dashboard
with a scheduled task) hit a wall: the scheduled task never got bound to a
browser session, so it could never actually reach tesla.com. This project fixes
that by doing the fetch from a real server with its own network access instead
of depending on a browser tab existing.

## What's in here

- `api/scan.js` — the actual scan job. Fetches all pages of used Model 3
  listings, classifies each against your criteria, diffs against stored state,
  and notifies on anything new or repriced.
- `lib/teslaApi.js` — the Tesla API query shape and pagination, validated by
  hand over several days before being ported here. `outsideSearch: true` +
  paging `outsideOffset` by 24 is what unlocks nationwide results — each page
  caps at 24 regardless of the `count` param.
- `lib/criteria.js` — what counts as a "match." Tune via env vars, see
  `.env.example`. Deliverability (`AllDeliverableStates`) is deliberately **not**
  a hard filter — testing found it can false-negative a genuinely orderable car
  depending on the requester's network location, so treat it as informational
  and always check a specific VIN's own order page before ruling it out.
- `lib/store.js` — Redis-backed state (Upstash, via Vercel's Marketplace
  integration — Vercel's own "Vercel KV" product was sunset, Upstash is the
  direct successor).
- `lib/notify.js` — Telegram + email (Resend) notification, either/both
  optional.
- `vercel.json` — a once-daily native Vercel Cron Job as a backstop.
- `.github/workflows/scan.yml` — a free GitHub Actions workflow that calls the
  deployed endpoint every 30 minutes, which is how you actually get faster
  than daily checks without paying for Vercel Pro (see "On cron frequency" below).

## Deploy steps

1. **Push this to a GitHub repo** (new, empty repo is fine).

2. **Import it into Vercel**: vercel.com → Add New → Project → pick the repo.
   No build settings needed, it's just serverless functions.

3. **Add storage**: in the Vercel project → Storage tab → Marketplace →
   Upstash → create a Redis database and connect it to this project. Vercel
   injects `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` automatically
   once connected — you don't need to copy/paste them yourself.

4. **Set environment variables** (Project → Settings → Environment Variables).
   Copy the list from `.env.example`. At minimum set:
   - `CRON_SECRET` — make up any random string
   - `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` (see `.env.example` for the
     2-minute BotFather setup), and/or the `RESEND_*` / `NOTIFY_EMAIL_*` vars
     for email instead
   - `MAX_PRICE`, `MIN_YEAR`, `REQUIRE_LONG_RANGE_AWD` — your actual criteria
   - Location vars default to League City, TX / 77573 already

5. **Deploy.** Then test it manually by visiting:
   `https://<your-project>.vercel.app/api/scan?secret=<your CRON_SECRET>`
   in a browser. You should get back JSON with `totalScanned` and (if
   anything currently matches) `newMatches`, and a Telegram/email ping.

6. **Wire up the faster external schedule** (see below) by adding two repo
   secrets — `VERCEL_APP_URL` and `CRON_SECRET` — in GitHub → your repo →
   Settings → Secrets and variables → Actions. The included workflow will
   then run every 30 minutes on its own.

## On cron frequency (read this before you're surprised)

Vercel's **Hobby (free) plan caps native Cron Jobs at once per day** —
sub-daily schedules on `vercel.json` get silently rejected or ignored on that
plan. Vercel Pro removes that cap. Since paying $20/mo just to reschedule a
cron job is overkill for this, this repo defaults to the free workaround:
`vercel.json` keeps a once-a-day cron as a backstop, and the included GitHub
Actions workflow calls the same endpoint every 30 minutes for free (GitHub's
scheduler is best-effort and can drift by a few minutes, which doesn't matter
here). If you'd rather just pay for Vercel Pro and use native cron at whatever
frequency you want, delete the GitHub Actions file and change the schedule in
`vercel.json` instead — same endpoint either way.

## On Tesla's bot detection

Tesla rate-limits/blocks aggressive polling — you'll see it as an HTTP 429
with a `cpr_chlge` field in the body. `lib/teslaApi.js` detects this and backs
off rather than retrying, by design — never try to work around it. Requests
from cloud/datacenter IP ranges (which is what this will run from) are
generally more likely to trip this than a real browser session, so keep the
polling interval reasonable — every 15–30 minutes is plenty for a use case
like "don't miss a new listing," you don't need every-minute polling.

## Adjusting match criteria

`lib/criteria.js` currently matches on price ceiling, minimum year, and
"Long Range AWD" in the trim name, and separately tags HW4 (Highland) cars via
`AP_HARDWARE_VERSION`. If you were tracking more specific/different criteria on
the dashboard, port the exact logic over here — the `classify()` function is
the only place that needs to change.

## Handing this to Claude Code

This repo is a working starting point, not a finished, polished product —
hand it to Claude Code with something like:

> Review this tesla-watch repo. Get it deployed to my Vercel account (I'm
> already logged in / help me log in), set up the Upstash Redis integration,
> and walk me through setting the environment variables and the Telegram bot.
> Then verify a real scan runs end-to-end and I get a notification.

From there it can also help you adjust `lib/criteria.js` to match your exact
thresholds, or extend it to text/push instead of Telegram/email.
