import Link from "next/link";

import { principles, links } from "@/lib/manifesto";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">Push Manifesto</span>
          <nav className="flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <a href={links.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href={links.wiki} target="_blank" rel="noreferrer">
                Wiki
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href={links.store} target="_blank" rel="noreferrer">
                Store
              </a>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="border-b">
          <div className="container flex flex-col items-center gap-6 py-24 text-center sm:py-32">
            <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-7xl">
              A way to do <span className="text-muted-foreground">creativity</span>
            </h1>
            <p className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground">
              The Push Manifesto is a set of principles and values that guide
              organisations and individuals in the pursuit of innovation and
              progress — prioritising the journey over the milestone, and shared
              value over isolated output.
            </p>
            <Button size="lg" asChild>
              <a href="#manifesto">Read the manifesto</a>
            </Button>
          </div>
        </section>

        <section id="manifesto" className="container py-16 sm:py-24">
          <h2 className="mb-12 text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            The Manifesto
          </h2>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            {principles.map((p, i) => (
              <article
                key={p.title}
                className="rounded-lg border bg-card p-6 text-card-foreground"
              >
                <div className="mb-3 flex items-baseline gap-3">
                  <span className="text-sm font-mono text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight">{p.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <span>Push Manifesto — a WiseJNRS project.</span>
          <nav className="flex items-center gap-4">
            <Link href="https://twitter.com/wisejnrs" className="hover:text-foreground">
              Twitter
            </Link>
            <Link
              href="https://www.linkedin.com/company/wisejnrs"
              className="hover:text-foreground"
            >
              LinkedIn
            </Link>
            <a href={links.github} className="hover:text-foreground">
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
