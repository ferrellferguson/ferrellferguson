import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { MobileNav } from "./components/mobile-nav";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ferrell Ferguson - Developer. Cyclist. Dad. Builder of things.",
    template: "%s | Ferrell Ferguson",
  },
  description:
    "Personal site of Ferrell Ferguson — software engineer with 25+ years of experience, cyclist, dad, and builder of things.",
  metadataBase: new URL("https://ferrellferguson.com"),
};

const navLinks = [
  { href: "/#projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/fitness", label: "Fitness" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl">
      <div className="gradient-line" />
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-mid)] text-sm font-bold text-white transition-transform group-hover:scale-105">
            FF
          </span>
          <span className="hidden text-sm font-semibold text-foreground sm:block">
            Ferrell Ferguson
          </span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm text-muted transition-colors hover:bg-muted-bg hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <MobileNav links={navLinks} />
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-mid)] text-xs font-bold text-white">
                FF
              </span>
              <span className="font-semibold text-foreground">
                Ferrell Ferguson
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              Developer. Cyclist. Dad.
              <br />
              Builder of things.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-semibold tracking-widest text-muted uppercase">
              Navigation
            </h3>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-semibold tracking-widest text-muted uppercase">
              Connect
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/ferrellferguson"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/ferrellferguson/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                LinkedIn
              </a>
              <a
                href="https://www.strava.com/athletes/28016965"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                Strava
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Ferrell Ferguson
          </p>
          <p className="text-xs text-muted">
            Built with Next.js, Tailwind CSS &amp; Claude Code
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
