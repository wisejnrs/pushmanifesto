import { Fragment } from "react";
import Link from "next/link";
import Script from "next/script";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { QuotesMarquee, type Quote } from "@/components/quotes-marquee";

type Principle = { label: string; description: string };

const principles: Principle[] = [
  {
    label: "Push",
    description:
      "A logical unit of output that has a beginning, middle and end. ‘End’ generally represents an outcome, doesn’t need to immediately progress to the next, includes all work items, has value, and has an agreement of ‘Done’ — everybody gets something.",
  },
  {
    label: "Ambiguity & Cognitive Bias",
    description:
      "These kill projects. Offer high readability, clear mental models, support diverse audiences, adopt simple conventions, reduce complexity, take the least-cost route, seek clarity and always, always question. Take an agnostic approach.",
  },
  {
    label: "Risk",
    description:
      "Again, kills projects. You don’t get to space by crossing your fingers — continuously cite and counter risks. Pretty sure Babbage, Boole and Bayes knew Murphy.",
  },
  {
    label: "Check-ins, Waypoints & Reviews",
    description:
      "Whilst stand-ups are useful, prefer a low-ceremony, less-noisy follow-up on work items — top and bottom of the week, honesty and shared understanding. Your child’s report card should not be a surprise, by virtue of care and involvement.",
  },
  {
    label: "Identify & Remove Road Blocks",
    description: "Early identification is key, with an inclusive approach taken.",
  },
  {
    label: "Creating Shared Value",
    description:
      "An inclusive and humble approach, in recognition that your project — whilst having value and benefits — contributes to wider goals.",
  },
  {
    label: "Mise en place",
    description:
      "Don’t start a project without your mise en place done. Get those vegetables chopped.",
  },
  {
    label: "Work Items",
    description:
      "Work items, tasks and cards transform Assets. Link the work item to the asset. **Don’t** deposit results back into the task. Knowledge management is first-class.",
  },
  {
    label: "Getting it Wrong",
    description:
      "Being learned, critical thinking and taking a scientific approach will always help you climb those mountains.",
  },
  {
    label: "Go Find Out",
    description:
      "Engage. Engage early, and enough — even if to make friends. Get out of the chair and go find out. Do the work, and don’t repeat the obvious.",
  },
  {
    label: "Know when to Roll ’Em",
    description:
      "Manage your work effort, dial in your approach and don’t push your luck. Only kick a push if the conditions are favourable. If it can go wrong it will — Murphy’s law applies.",
  },
  {
    label: "Hypothesis",
    description:
      "Every great _idea_ starts with a test strategy. It doesn’t exist if it can’t be tested.",
  },
];

const quotes: Quote[] = [
  {
    author: "Michael Wise",
    quote:
      "I push the trolley around the supermarket. I push myself to exercise. I push my kids through school. Why is the creative process any different?",
  },
  { author: "Michael Wise", quote: "Small things more often." },
  {
    author: "Michael Wise",
    quote:
      "Shovelling dirt is still shovelling dirt. Doesn’t matter if you do it iteratively. Software development is complex, hard work — find a way to recognise that.",
  },
  {
    author: "Michael Wise",
    quote:
      "Programming: loops, sequences and decisions. Everything else is just abstraction from the truth.",
  },
  { author: "Michael Wise", quote: "I haven’t, but this is how I would work it out." },
  { author: "Michael Wise", quote: "Like building a cathedral out of a tornado." },
  { author: "Leon Bambrick", quote: "Keep the turbulence down." },
  { author: "Steve Rogers", quote: "Just get on with it." },
  {
    author: "Michael Wise",
    quote: "T-shirts are like ideas — you change them when they don’t fit.",
  },
  { author: "Michael Wise", quote: "No problem, let’s work it out together." },
  { author: "Michael Wise", quote: "Creativity has no timeline." },
  {
    author: "Michael Wise",
    quote:
      "People and data don’t change. Pretty sure there’s a cave painting out there with FNAME and LNAME on it.",
  },
  {
    author: "David Wise",
    quote:
      "Create habits. People, process, technology and habit. If you want people to do things, create habits.",
  },
  { author: "Dwight D. Eisenhower", quote: "No plan survives first encounter." },
  {
    author: "Julia Galef",
    quote:
      "Scout mindset: being able to see things as they are, not as you wish they were.",
  },
  { author: "Dennis Shortis", quote: "Perfect is the destroyer of good enough!" },
  {
    author: "Richard Feynman",
    quote:
      "You are under no obligation to remain the same person you were a year ago. You are here to create yourself, continuously.",
  },
];

const tweetHref = (text: string) =>
  "https://twitter.com/intent/tweet?text=" +
  encodeURIComponent(text + " — http://www.pushmanifesto.org");

/** Render the lightweight **bold** / _italic_ emphasis used in the source copy. */
function emphasise(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("_") && part.endsWith("_")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border/70 bg-background/50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </span>
  );
}

export default function HomePage() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-VZ3GBPF421"
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-VZ3GBPF421');`}
      </Script>

      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-[0.5] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div
          className="pointer-events-none absolute -top-24 right-[-10%] h-[36rem] w-[36rem] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at center, rgba(210,71,191,0.45), transparent 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute top-40 left-[-10%] h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,107,53,0.45), transparent 60%)",
          }}
        />

        {/* floating geometric marks from the original brand */}
        <img
          src="/assets/layers-hex.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-[8%] top-44 hidden h-8 w-8 animate-float-slow opacity-60 dark:invert md:block"
        />
        <img
          src="/assets/layers-c.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-[14%] top-72 hidden h-7 w-7 animate-float-slower opacity-60 dark:invert lg:block"
        />
        <img
          src="/assets/layers-rect.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-[16%] bottom-16 hidden h-6 w-6 animate-float-slower opacity-50 dark:invert lg:block"
        />

        <div className="container relative flex min-h-[88vh] flex-col justify-center py-24 md:py-32">
          <Reveal>
            <Eyebrow>The Push Manifesto</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.02em]">
              A way to do{" "}
              <span className="text-gradient-brand">creativity</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              A set of principles for innovation and progress — vision,
              collaboration, inclusive behaviour, and a pragmatic, evidence-based
              mindset. It prioritises <em>the journey</em>, using waypoints over
              milestones, targeting shared value for everyone involved.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="#manifesto"
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#D247BF] to-[#FF6B35] py-3 pl-6 pr-3 text-sm font-medium text-white shadow-lg shadow-[#D247BF]/15 transition-transform duration-300 active:scale-[0.98]"
              >
                Read the manifesto
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0.5">
                  <ArrowDown className="h-4 w-4" />
                </span>
              </Link>
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors duration-300 hover:bg-muted"
              >
                Read the blog
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── The Manifesto intro ─────────────────── */}
      <section id="manifesto" className="scroll-mt-20 border-t border-border/60">
        <div className="container grid gap-10 py-24 md:grid-cols-[1fr_2fr] md:py-32">
          <Reveal>
            <div className="md:sticky md:top-28">
              <Eyebrow>The Manifesto</Eyebrow>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                Prioritise the journey.
              </h2>
            </div>
          </Reveal>
          <div className="space-y-6">
            <Reveal delay={0.05}>
              <p className="text-xl leading-relaxed text-foreground/90 md:text-2xl">
                <strong className="font-semibold">Push Manifesto</strong> is about
                vision, collaboration, inclusive behaviours, determination,
                communication, governance, and learning — and above all it
                prioritises <em>the journey</em>: using <em>waypoints</em> over
                iterations and milestones, balancing the desire for
                fit-for-purpose with shared value outcomes for users and
                stakeholders.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-muted-foreground">
                It feeds the Maturity Model and an evidence-based mindset,
                supporting the scientific approach — daring to explore the latent
                space, with a pragmatic world-view.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────────────── Principles ───────────────────── */}
      <section className="border-t border-border/60">
        <div className="container py-24 md:py-32">
          <Reveal>
            <Eyebrow>Principles</Eyebrow>
            <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-4xl">
              The building blocks of a push.
            </h2>
          </Reveal>

          <ol className="mt-14 grid gap-x-12 gap-y-px sm:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal as="li" key={p.label} delay={(i % 2) * 0.05}>
                <a
                  href={tweetHref(`${p.label}: ${p.description.replace(/[*_]/g, "")}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-5 border-t border-border/60 py-7 transition-colors duration-300 hover:border-foreground/30"
                >
                  <span className="font-mono text-sm tabular-nums text-muted-foreground/70 transition-colors group-hover:text-[#D247BF]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="space-y-2">
                    <h3 className="flex items-center gap-1.5 font-display text-xl font-medium tracking-tight">
                      {p.label}
                      <ArrowUpRight className="h-4 w-4 -translate-y-px text-muted-foreground/0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
                    </h3>
                    <p className="text-[15px] leading-relaxed text-muted-foreground">
                      {emphasise(p.description)}
                    </p>
                  </div>
                </a>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────────────────── Voices / quotes ───────────────────── */}
      <section className="border-t border-border/60 bg-muted/30">
        <div className="container py-24 md:py-28">
          <Reveal>
            <Eyebrow>Voices</Eyebrow>
            <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Small things, more often.
            </h2>
          </Reveal>
        </div>
        <Reveal className="pb-24 md:pb-28">
          <QuotesMarquee quotes={quotes} />
        </Reveal>
      </section>

      {/* ───────────────────── Closing CTA ───────────────────── */}
      <section className="border-t border-border/60">
        <div className="container py-24 text-center md:py-32">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-5xl">
              Get out of the chair and{" "}
              <span className="text-gradient-brand">go find out</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              Read the long-form thinking behind the manifesto on the blog, or
              dig into the source on GitHub.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#D247BF] to-[#FF6B35] py-3 pl-6 pr-3 text-sm font-medium text-white shadow-lg shadow-[#D247BF]/15 transition-transform duration-300 active:scale-[0.98]"
              >
                Read the blog
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <a
                href="https://github.com/wisejnrs/pushmanifesto"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors duration-300 hover:bg-muted"
              >
                View on GitHub
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
