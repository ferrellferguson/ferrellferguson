import Link from "next/link";
import { getAllPosts, getAllCategories } from "@/lib/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thoughts on learning, cycling, dev life, and parenting from Ferrell Ferguson.",
};

const categoryColors: Record<string, string> = {
  Learning: "from-blue-500 to-cyan-500",
  Cycling: "from-emerald-500 to-teal-500",
  Parenting: "from-purple-500 to-pink-500",
  "Dev Life": "from-orange-500 to-amber-500",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <main className="relative">
      {/* Hero area */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "var(--hero-bg)" }}
        />
        <div className="relative mx-auto max-w-4xl px-6 py-16 md:py-20">
          <span className="tag-gradient mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-medium text-accent">
            Blog
          </span>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            All Posts
          </h1>
          <p className="mb-8 text-lg text-muted">
            Thoughts on learning, cycling, dev life, and parenting.
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="btn-glow rounded-full px-4 py-1.5 text-xs font-medium text-white">
              All ({posts.length})
            </span>
            {categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent/30 hover:text-accent"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Post list */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="gradient-border group flex flex-col gap-3 overflow-hidden p-6 transition-all duration-300 hover:shadow-[var(--card-shadow-hover)] hover:-translate-y-0.5 sm:flex-row sm:items-center sm:gap-6"
            >
              {/* Color indicator */}
              <div
                className={`hidden h-10 w-1 shrink-0 rounded-full bg-gradient-to-b sm:block ${categoryColors[post.category] || "from-blue-500 to-purple-500"}`}
              />
              <div className="min-w-0 flex-1">
                <h2 className="mb-1 text-base font-semibold text-foreground transition-colors group-hover:text-accent">
                  {post.title}
                </h2>
                <p className="text-sm text-muted line-clamp-1">
                  {post.excerpt}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="tag-gradient rounded-full px-2.5 py-0.5 text-xs text-accent">
                  {post.category}
                </span>
                <span className="text-xs text-muted tabular-nums">
                  {post.readingTime}
                </span>
                <time className="text-xs text-muted tabular-nums">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-muted">No posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </main>
  );
}
