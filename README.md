# ferrellferguson.com

Personal site for Ferrell Ferguson — built with Next.js (App Router), Tailwind CSS, and shadcn/ui.

## Structure

This repo holds two independently-deployed Vercel projects:

- **`/`** — the personal site (this Next.js app). Home, `/projects`, `/about`.
- **`/tesla-watch`** — a separate serverless project (plain Node, no framework) that
  watches Tesla's used-inventory API and notifies on matches. See
  `tesla-watch/README.md` for its own setup and deploy steps.

Each is its own Vercel project pointed at this one GitHub repo, with a different
**Root Directory** setting (`/` and `tesla-watch` respectively) — they build
and deploy independently even though they share history.

## Content

- `src/lib/site.ts` — name, tagline, email, and social links used across the site.
- `src/lib/projects.ts` — the project cards shown on `/` and `/projects`. Add a
  new project by adding an entry here.
- `src/app/about/page.tsx` — bio copy.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying

Push to GitHub, then import the repo into Vercel twice:

1. **ferrellferguson.com** — Root Directory: `/` (default).
2. **tesla-watch** — Root Directory: `tesla-watch`. See `tesla-watch/README.md`
   for its required environment variables (Upstash Redis, Telegram/Resend, etc).
