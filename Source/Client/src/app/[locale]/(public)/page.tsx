import { Fragment } from "react";
import Script from "next/script";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/reveal";
import { FeaturedProducts } from "@/components/featured-products";
import { LatestArticles } from "@/components/latest-articles";
import { getPublishedPostsServer } from "@/lib/blog-server";
import { siteConfig } from "@/lib/site";
import { QuotesMarquee, type Quote } from "@/components/quotes-marquee";
import { HeroAstronaut } from "@/components/hero-astronaut";
import { MagneticButton } from "@/components/magnetic-button";

const PRINCIPLE_KEYS = [
  "push",
  "ambiguity",
  "risk",
  "checkins",
  "roadblocks",
  "sharedValue",
  "miseEnPlace",
  "workItems",
  "gettingItWrong",
  "goFindOut",
  "rollEm",
  "hypothesis",
] as const;

// Personal quotes are intentionally kept in their original language.
const quotes: Quote[] = [
  { author: "Michael Wise", quote: "I push the trolley around the supermarket. I push myself to exercise. I push my kids through school. Why is the creative process any different?" },
  { author: "Michael Wise", quote: "Small things more often." },
  { author: "Michael Wise", quote: "Shovelling dirt is still shovelling dirt. Doesn’t matter if you do it iteratively. Software development is complex, hard work — find a way to recognise that." },
  { author: "Michael Wise", quote: "Programming: loops, sequences and decisions. Everything else is just abstraction from the truth." },
  { author: "Michael Wise", quote: "I haven’t, but this is how I would work it out." },
  { author: "Michael Wise", quote: "Like building a cathedral out of a tornado." },
  { author: "Leon Bambrick", quote: "Keep the turbulence down." },
  { author: "Steve Rogers", quote: "Just get on with it." },
  { author: "Michael Wise", quote: "T-shirts are like ideas — you change them when they don’t fit." },
  { author: "Michael Wise", quote: "No problem, let’s work it out together." },
  { author: "Michael Wise", quote: "Creativity has no timeline." },
  { author: "Michael Wise", quote: "People and data don’t change. Pretty sure there’s a cave painting out there with FNAME and LNAME on it." },
  { author: "David Wise", quote: "Create habits. People, process, technology and habit. If you want people to do things, create habits." },
  { author: "Dwight D. Eisenhower", quote: "No plan survives first encounter." },
  { author: "Julia Galef", quote: "Scout mindset: being able to see things as they are, not as you wish they were." },
  { author: "Dennis Shortis", quote: "Perfect is the destroyer of good enough!" },
  { author: "Richard Feynman", quote: "You are under no obligation to remain the same person you were a year ago. You are here to create yourself, continuously." },
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
    <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand" />
      {children}
    </span>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const posts = getPublishedPostsServer(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        inLanguage: "en",
      },
      {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/assets/manifesto-ico.svg`,
        description: siteConfig.description,
        founder: { "@type": "Person", name: siteConfig.creator.name, url: siteConfig.creator.linkedin },
        sameAs: [siteConfig.links.github, siteConfig.links.linkedin, siteConfig.links.x].filter(Boolean),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          style={{ background: "radial-gradient(circle at center, rgba(231,60,111,0.42), transparent 60%)" }}
        />
        <div
          className="pointer-events-none absolute top-40 left-[-10%] h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle at center, rgba(238,170,82,0.45), transparent 60%)" }}
        />

        <img src="/assets/layers-hex.svg" alt="" aria-hidden className="pointer-events-none absolute left-[8%] top-44 hidden h-8 w-8 animate-float-slow opacity-60 dark:invert md:block" />
        <img src="/assets/layers-c.svg" alt="" aria-hidden className="pointer-events-none absolute right-[14%] top-72 hidden h-7 w-7 animate-float-slower opacity-60 dark:invert lg:block" />
        <img src="/assets/layers-rect.svg" alt="" aria-hidden className="pointer-events-none absolute left-[16%] bottom-16 hidden h-6 w-6 animate-float-slower opacity-50 dark:invert lg:block" />

        <div className="container relative grid min-h-[calc(100dvh-3.5rem)] content-center items-center gap-1 py-6 md:min-h-[72vh] md:gap-6 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-0">
          <div className="relative z-10">
            <Reveal>
              <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 max-w-2xl font-display text-[clamp(2.25rem,7vw,6rem)] font-bold leading-[0.95] tracking-[-0.03em] md:mt-6">
                {t("hero.titleLead")}{" "}
                <span className="text-gradient-brand">{t("hero.titleHighlight")}</span>.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:mt-7 md:text-xl">
                {t("hero.lede")}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-7 flex flex-wrap items-center gap-3 md:mt-10">
                <MagneticButton
                  href="#manifesto"
                  className="group inline-flex items-center gap-3 rounded-full bg-gradient-brand py-3 pl-6 pr-3 text-sm font-medium text-white shadow-lg shadow-[#e73c6f]/25 transition-transform duration-300 active:scale-[0.97]"
                >
                  {t("hero.readManifesto")}
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white/25 transition-transform duration-300 group-hover:translate-y-0.5">
                    <ArrowDown className="h-4 w-4" />
                  </span>
                </MagneticButton>
                <Link
                  href="/blog"
                  className="group glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-foreground transition-colors duration-300 hover:bg-foreground/5"
                >
                  {t("hero.readBlog")}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="pointer-events-none relative z-0 -mt-6 lg:-ml-28 lg:mt-0 xl:-ml-44">
            <HeroAstronaut />
          </div>
        </div>
      </section>

      {/* ─────────────────── The Manifesto intro ─────────────────── */}
      <section id="manifesto" className="scroll-mt-20 border-t border-border/60">
        <div className="container grid gap-8 py-12 md:grid-cols-[1fr_2fr] md:py-16">
          <Reveal>
            <div className="md:sticky md:top-28">
              <Eyebrow>{t("manifesto.eyebrow")}</Eyebrow>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                {t("manifesto.heading")}
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="glass space-y-6 rounded-3xl p-8 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.5)] md:p-12">
              <p className="text-xl leading-relaxed text-foreground/90 md:text-2xl">
                {t("manifesto.body1")}
              </p>
              <div className="h-px bg-gradient-to-r from-border via-border/40 to-transparent" />
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t("manifesto.body2")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────── Principles ───────────────────── */}
      <section className="border-t border-border/60">
        <div className="container py-12 md:py-20">
          <Reveal>
            <Eyebrow>{t("principles.eyebrow")}</Eyebrow>
            <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {t("principles.heading")}
            </h2>
          </Reveal>

          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLE_KEYS.map((key, i) => {
              const label = t(`principles.items.${key}.label`);
              const description = t(`principles.items.${key}.description`);
              return (
                <Reveal as="li" key={key} delay={(i % 3) * 0.08}>
                  <a
                    href={tweetHref(`${label}: ${description.replace(/[*_]/g, "")}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group glass gradient-ring relative isolate flex h-full flex-col gap-3 overflow-hidden rounded-2xl p-6 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_34px_70px_-22px_rgba(231,60,111,0.55)]"
                  >
                    {/* brand wash glows up from the bottom on hover */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(120% 90% at 50% 120%, rgba(231,60,111,0.16), transparent 70%)",
                      }}
                    />
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm tabular-nums text-muted-foreground/70 transition-all duration-300 group-hover:scale-125 group-hover:text-[#e73c6f]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:scale-110 group-hover:text-[#e73c6f]" />
                    </div>
                    <h3 className="font-display text-lg font-semibold tracking-tight transition-colors duration-300 group-hover:text-foreground">
                      {label}
                    </h3>
                    <p className="text-[14px] leading-relaxed text-muted-foreground">
                      {emphasise(description)}
                    </p>
                  </a>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ───────────────────── Voices / quotes ───────────────────── */}
      <section className="border-y border-border/60 bg-muted/50 py-12 md:py-16">
        <div className="container">
          <Reveal>
            <Eyebrow>{t("voices.eyebrow")}</Eyebrow>
            <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {t("voices.heading")}
            </h2>
          </Reveal>
        </div>
        <Reveal className="mt-8 md:mt-10">
          <QuotesMarquee quotes={quotes} />
        </Reveal>
      </section>

      {/* ─────────────────── Latest articles ─────────────────── */}
      <LatestArticles posts={posts} />

      {/* ─────────────────── Featured products (store) ─────────────────── */}
      <FeaturedProducts />

      {/* ───────────────────── Closing CTA ───────────────────── */}
      <section className="border-t border-border/60">
        <div className="container py-16 text-center md:py-24">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-5xl">
              {t("cta.headingLead")}{" "}
              <span className="text-gradient-brand">{t("cta.headingHighlight")}</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">{t("cta.lede")}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-brand py-3 pl-6 pr-3 text-sm font-medium text-white shadow-lg shadow-[#e73c6f]/20 transition-transform duration-300 active:scale-[0.98]"
              >
                {t("cta.readBlog")}
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <a
                href="https://github.com/wisejnrs/pushmanifesto"
                target="_blank"
                rel="noopener noreferrer"
                className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-foreground transition-colors duration-300 hover:bg-foreground/5"
              >
                {t("cta.viewGithub")}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
