import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: site.description,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">About</h1>
      <div className="mt-8 space-y-5 text-lg leading-8 text-muted-foreground">
        <p>
          I&rsquo;m Ferrell &mdash; a husband, father, and software engineer.
          Most of my day is spent building software professionally, but the
          projects on this site are the ones I build for myself: something
          annoyed me, or I was curious, so I made a small tool to fix it.
        </p>
        <p>
          I care about software that does one thing well and stays out of
          the way &mdash; whether that&rsquo;s a serverless job that watches
          for a good used car, or a full product with real users.
        </p>
        <p>
          When I&rsquo;m not building things, I&rsquo;m with my family &mdash;
          that&rsquo;s the whole point.
        </p>
      </div>
      <div className="mt-10 flex gap-4">
        <a
          href={site.linkedin}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ size: "lg" })}
        >
          Connect on LinkedIn
        </a>
        <a
          href={`mailto:${site.email}`}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Email me
        </a>
      </div>
    </div>
  );
}
