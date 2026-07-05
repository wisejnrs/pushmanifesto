import type { CSSProperties } from "react";
import Image from "next/image";
import { CoverImage } from "@/components/cover-image";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/blog";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-AU", { year: "numeric", month: "short", day: "numeric" });
}

export function LatestArticles({ posts }: { posts: BlogPost[] }) {
  const latest = [...posts]
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, 6);

  if (!latest.length) return null;

  return (
    <section className="border-t border-border/60">
      <div className="container py-12 md:py-20">
        <Carousel opts={{ align: "start" }} aria-label="Latest articles">
        <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Latest Articles</h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Field notes on creativity, delivery, and ways of working.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <Link
              href="/blog"
              className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/70 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10"
            >
              View all articles
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <div className="flex items-center gap-2">
              <CarouselPrevious className="glass static h-11 w-11 translate-y-0 border-border/70" />
              <CarouselNext className="glass static h-11 w-11 translate-y-0 border-border/70" />
            </div>
          </div>
        </div>

        {/* pt-2 gives the hover lift headroom inside embla's overflow clip */}
        <CarouselContent className="-ml-5 pb-1 pt-2">
          {latest.map((p, i) => (
            <CarouselItem
              key={p.slug}
              aria-label={`${i + 1} of ${latest.length}`}
              style={{ "--reveal-i": i } as CSSProperties}
              className="reveal-up basis-[84%] pl-5 sm:basis-1/2 lg:basis-1/3"
            >
            <Link
              href={`/blog/${p.slug}`}
              className="gradient-ring glass group flex h-full flex-col overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1"
            >
              {p.coverImage && (
                <div className="relative aspect-[16/10] overflow-hidden bg-muted/30">
                  <CoverImage
                    src={p.coverImage}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(min-width: 768px) 30vw, 90vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/70 to-transparent" />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-2 p-5">
                <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-gradient-brand">
                  {p.category}
                </span>
                <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug tracking-tight text-foreground">
                  {p.title}
                </h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
                <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-muted-foreground/80">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(p.publishedAt)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {p.readingTime} min
                  </span>
                </div>
              </div>
            </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
