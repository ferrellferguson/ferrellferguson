import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--hero-bg)" }}
      />
      <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] opacity-30"
        style={{
          background: "radial-gradient(circle at center, var(--gradient-end), transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] opacity-20"
        style={{
          background: "radial-gradient(circle at center, var(--gradient-mid), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pt-6 pb-14 md:pt-8 md:pb-16">
        <h1 className="animate-fade-in-up mb-4 text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">
          Hi, I&apos;m{" "}
          <span className="gradient-text">Ferrell Ferguson</span>
        </h1>

        <p className="animate-fade-in-up animate-delay-100 mb-4 text-xl text-muted md:text-2xl">
          Developer. Cyclist. Dad. Builder of things.
        </p>

        <p className="animate-fade-in-up animate-delay-200 mb-8 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          Software engineer with 25+ years of experience — from ColdFusion to
          modern JavaScript. Currently diving into Next.js, training for
          triathlons, and raising two amazing kids. I believe in{" "}
          <span className="font-medium text-foreground">
            starting small and iterating fast
          </span>
          .
        </p>

        <div className="animate-fade-in-up animate-delay-300 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="btn-glow rounded-xl px-7 py-3.5 text-sm font-medium text-white"
          >
            View Projects
          </a>
          <Link
            href="/blog"
            className="rounded-xl border border-border px-7 py-3.5 text-sm font-medium text-foreground transition-all hover:border-accent/30 hover:bg-accent/5"
          >
            Read Blog
          </Link>
          <a
            href="#contact"
            className="rounded-xl border border-border px-7 py-3.5 text-sm font-medium text-foreground transition-all hover:border-accent/30 hover:bg-accent/5"
          >
            Contact
          </a>
        </div>
      </div>
    </section>
  );
}

function FamilyProjects() {
  const projects = [
    {
      name: "Chloeosis.com",
      url: "https://chloeosis.com",
      description:
        "Documenting Chloe's scoliosis journey — from diagnosis through treatment and recovery. Built to help other families navigating the same path.",
      emoji: "💜",
    },
    {
      name: "MrsFerguson.com",
      url: "https://mrsferguson.com",
      description:
        "My wife's dyslexia tutoring practice. Helping students build confidence and develop reading skills through evidence-based methods.",
      emoji: "📚",
    },
  ];

  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12">
        <span className="tag-gradient mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-medium text-accent">
          Family Projects
        </span>
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
          Built with Purpose
        </h2>
        <p className="max-w-xl text-muted">
          Some of the most meaningful things I&apos;ve built aren&apos;t for
          clients — they&apos;re for family.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <a
            key={project.name}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-border group overflow-hidden p-8 transition-all duration-300 hover:shadow-[var(--card-shadow-hover)] hover:-translate-y-1"
          >
            <div className="mb-5 flex items-start justify-between">
              <span className="text-3xl">{project.emoji}</span>
              <svg
                className="h-5 w-5 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 17L17 7M17 7H7M17 7V17"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground transition-colors group-hover:text-accent">
              {project.name}
            </h3>
            <p className="text-sm leading-relaxed text-muted">
              {project.description}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}

function SideProjects() {
  const projects = [
    {
      name: "ferrellferguson.com",
      tech: ["Next.js", "Tailwind CSS", "TypeScript"],
      description:
        "This site! My personal portfolio and blog, built as a learning project for modern web development.",
      status: "Live",
    },
    {
      name: "Cycling Stats Dashboard",
      tech: ["React", "Strava API", "Chart.js"],
      description:
        "A personal dashboard for tracking cycling metrics, training progress, and ride history. Pulls data from Strava.",
      status: "In Progress",
    },
    {
      name: "Markdown Note Sync",
      tech: ["Node.js", "CLI", "File System"],
      description:
        "A simple CLI tool for syncing markdown notes across devices. Built because I wanted something lightweight.",
      status: "Idea",
    },
  ];

  const statusColors: Record<string, string> = {
    Live: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "In Progress": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Idea: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  };

  return (
    <section className="border-y border-border/50 bg-muted-bg/50">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12">
          <span className="tag-gradient mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-medium text-accent">
            Side Projects
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Things I&apos;m Building
          </h2>
          <p className="max-w-xl text-muted">
            Side projects where I learn new tech, scratch an itch, or just build
            something fun.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.name}
              className="gradient-border group flex flex-col overflow-hidden p-6 transition-all duration-300 hover:shadow-[var(--card-shadow-hover)] hover:-translate-y-1"
            >
              <div className="mb-4 flex items-center justify-between">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${statusColors[project.status]}`}
                >
                  {project.status}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {project.name}
              </h3>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-muted">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-muted-bg border border-border/50 px-2.5 py-1 text-xs text-muted font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogPreview() {
  const posts = getAllPosts().slice(0, 3);

  if (posts.length === 0) return null;

  const categoryColors: Record<string, string> = {
    Learning: "from-blue-500 to-cyan-500",
    Cycling: "from-emerald-500 to-teal-500",
    Parenting: "from-purple-500 to-pink-500",
    "Dev Life": "from-orange-500 to-amber-500",
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12">
        <span className="tag-gradient mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-medium text-accent">
          Blog
        </span>
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
          Latest Writing
        </h2>
        <p className="max-w-xl text-muted">
          Thoughts on learning, cycling, dev life, and parenting.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="gradient-border group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-[var(--card-shadow-hover)] hover:-translate-y-1"
          >
            {/* Top gradient bar */}
            <div
              className={`h-1 bg-gradient-to-r ${categoryColors[post.category] || "from-blue-500 to-purple-500"}`}
            />
            <div className="flex flex-1 flex-col p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="tag-gradient rounded-full px-3 py-1 text-xs font-medium text-accent">
                  {post.category}
                </span>
                <span className="text-xs text-muted">{post.readingTime}</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-accent">
                {post.title}
              </h3>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-muted line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <span className="text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  Read more →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-xl border border-border px-7 py-3.5 text-sm font-medium text-foreground transition-all hover:border-accent/30 hover:bg-accent/5"
        >
          View All Posts
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}

function About() {
  const skills = [
    { name: "JavaScript / TypeScript", level: "25+ years" },
    { name: "React / Next.js", level: "Learning" },
    { name: "Node.js", level: "Experienced" },
    { name: "ColdFusion", level: "Veteran" },
    { name: "SQL / Databases", level: "Experienced" },
    { name: "HTML / CSS / Tailwind", level: "Experienced" },
    { name: "Git / GitHub", level: "Daily driver" },
    { name: "REST APIs", level: "Experienced" },
    { name: "AI Tools / Claude Code", level: "Exploring" },
  ];

  return (
    <section id="about" className="border-y border-border/50 bg-muted-bg/50">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12">
          <span className="tag-gradient mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-medium text-accent">
            About
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            A Bit More About Me
          </h2>
        </div>
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-5 text-muted leading-relaxed">
            <p className="text-lg">
              I&apos;ve been building things on the web for over{" "}
              <span className="font-medium text-foreground">25 years</span>.
              Started with ColdFusion in the late &apos;90s, rode the jQuery
              wave, survived the Angular years, and landed in the React
              ecosystem.
            </p>
            <p>
              These days I&apos;m diving deep into Next.js and exploring how AI
              tools like Claude Code are changing the way we build software.
              It&apos;s a wild time to be a developer, and I&apos;m here for it.
            </p>
            <p>
              Outside of code, I&apos;m a cyclist working toward my first
              triathlon. There&apos;s something about endurance sports that
              mirrors software development — it&apos;s all about consistency,
              patience, and showing up even when you don&apos;t feel like it.
            </p>
            <p>
              I&apos;m also a dad to Chloe and Ferrell Jr., both of whom have
              navigated scoliosis journeys that taught our whole family about
              resilience, advocacy, and the power of community. My wife runs a
              dyslexia tutoring practice, so we&apos;re a family that believes
              in meeting challenges head-on.
            </p>
            <blockquote className="border-l-2 border-accent pl-4 text-lg font-medium text-foreground italic">
              &ldquo;Start small, iterate fast, ship it.&rdquo;
            </blockquote>
          </div>
          <div className="lg:col-span-2 space-y-6">
            {/* Photo placeholder */}
            <div className="gradient-border overflow-hidden">
              <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-muted-bg to-card-bg">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-mid)]">
                    <span className="text-2xl font-bold text-white">FF</span>
                  </div>
                  <p className="text-xs text-muted">Photo coming soon</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="gradient-border overflow-hidden p-6">
              <h3 className="mb-4 text-xs font-semibold tracking-widest text-accent uppercase">
                Tech &amp; Tools
              </h3>
              <div className="space-y-2.5">
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-foreground">{skill.name}</span>
                    <span className="rounded-md bg-muted-bg border border-border/50 px-2 py-0.5 text-xs text-muted font-mono">
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Currently */}
            <div className="gradient-border overflow-hidden p-6">
              <h3 className="mb-4 text-xs font-semibold tracking-widest text-accent uppercase">
                Currently
              </h3>
              <ul className="space-y-3">
                {[
                  { icon: "🔨", text: "Learning Next.js & TypeScript" },
                  { icon: "🚴", text: "Training for sprint triathlon" },
                  { icon: "🤖", text: "Building with Claude Code" },
                  { icon: "✍️", text: "Writing about the journey" },
                ].map((item) => (
                  <li
                    key={item.text}
                    className="flex items-center gap-3 text-sm text-muted"
                  >
                    <span>{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden">
      {/* Background accent */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--gradient-start), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12">
          <span className="tag-gradient mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-medium text-accent">
            Contact
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Let&apos;s Connect
          </h2>
          <p className="max-w-xl text-muted">
            Whether you want to talk tech, cycling, or just say hi — I&apos;d
            love to hear from you.
          </p>
        </div>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="gradient-border overflow-hidden p-8">
            <form
              action="https://formspree.io/f/your-form-id"
              method="POST"
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                  placeholder="What's on your mind?"
                />
              </div>
              <button
                type="submit"
                className="btn-glow w-full rounded-xl px-7 py-3.5 text-sm font-medium text-white"
              >
                Send Message
              </button>
            </form>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-xs font-semibold tracking-widest text-accent uppercase">
                Find Me Online
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "GitHub",
                    href: "https://github.com/ferrellferguson",
                    desc: "Code & open source",
                    icon: (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    ),
                  },
                  {
                    label: "LinkedIn",
                    href: "https://linkedin.com/in/ferrellferguson",
                    desc: "Professional network",
                    icon: (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Strava",
                    href: "https://www.strava.com/",
                    desc: "Cycling & training",
                    icon: (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                      </svg>
                    ),
                  },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gradient-border group flex items-center gap-4 overflow-hidden p-4 transition-all duration-300 hover:shadow-[var(--card-shadow-hover)]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted-bg text-muted transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                      {link.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {link.label}
                      </p>
                      <p className="text-xs text-muted">{link.desc}</p>
                    </div>
                    <svg
                      className="h-4 w-4 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            <div className="gradient-border overflow-hidden p-5">
              <p className="text-sm text-muted">
                Prefer email? Reach me at{" "}
                <a
                  href="mailto:ferrell@ferrellferguson.com"
                  className="font-medium text-accent transition-colors hover:text-accent-hover"
                >
                  ferrell@ferrellferguson.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <Hero />
      <FamilyProjects />
      <SideProjects />
      <BlogPreview />
      <About />
      <Contact />
    </main>
  );
}
