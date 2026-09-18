export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  href: string;
  linkLabel: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "tesla-watch",
    title: "tesla-watch",
    tagline: "A serverless watcher for Tesla's used-inventory listings",
    description:
      "Scans Tesla's public inventory API on a schedule, tracks matches in Redis, and pings me on Telegram/email the moment a used Model 3 matching my price, year, and trim criteria shows up — or drops in price. Built after a browser-based approach hit a wall because a scheduled task couldn't reach tesla.com without an active browser session.",
    tags: ["Node.js", "Vercel Functions", "Upstash Redis", "Vercel Cron", "GitHub Actions"],
    href: "https://github.com/ferrellferguson/ferrellferguson/tree/main/tesla-watch",
    linkLabel: "View on GitHub",
    featured: true,
  },
  {
    slug: "txtoughtrailers",
    title: "TX Tough Trailers",
    tagline: "A peer-to-peer trailer rental marketplace for Texas",
    description:
      "Browse and book trailers from owners across Texas, with Stripe checkout, calendar sync for availability, automated reminders, and an admin panel for listing management.",
    tags: ["Next.js", "Supabase", "Stripe", "TypeScript"],
    href: "https://txtoughtrailers.com",
    linkLabel: "Visit Site",
  },
  {
    slug: "unmanufactured",
    title: "unmanufactured.org",
    tagline: "A narrative drift tracker for AI models",
    description:
      "Polls multiple AI models — Claude, GPT-4o, Grok, Gemini — about the same news event over time and detects when their narratives shift without any new evidence behind the change.",
    tags: ["Next.js", "Neon Postgres", "Inngest", "Vercel AI SDK"],
    href: "https://github.com/ferrellferguson/unmanufactured",
    linkLabel: "View on GitHub",
  },
  {
    slug: "ubft-band",
    title: "Underwater Bingo for Teens",
    tagline: "Band website with shows, gallery, and contact",
    description:
      "A dark rock-aesthetic site for the band — upcoming show dates, a photo gallery, and a contact form so fans can keep up with what's next.",
    tags: ["Next.js", "Tailwind CSS"],
    href: "https://github.com/ferrellferguson/ubftBand",
    linkLabel: "View on GitHub",
  },
];
