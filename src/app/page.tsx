import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/projects";

export default function Home() {
  const featured = projects.find((p) => p.featured) ?? projects[0];

  return (
    <div className="mx-auto max-w-4xl px-6">
      <section className="py-24 sm:py-32">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Hi, I&rsquo;m Ferrell.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          I&rsquo;m a husband, father, and software engineer. Outside of work
          I like building small, useful tools — the kind that solve one
          real problem in my own life and end up worth sharing.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/projects" className={buttonVariants({ size: "lg" })}>
            See my projects
          </Link>
          <Link
            href="/about"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            About me
          </Link>
        </div>
      </section>

      <section className="pb-24">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Latest project
          </h2>
          <Link
            href="/projects"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all &rarr;
          </Link>
        </div>
        <ProjectCard project={featured} />
      </section>
    </div>
  );
}
