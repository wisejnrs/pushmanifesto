"use client";

export type Quote = { author: string; quote: string };

export function QuotesMarquee({ quotes }: { quotes: Quote[] }) {
  // Duplicate the list so the -50% translate loops seamlessly.
  const row = [...quotes, ...quotes];

  return (
    <div
      className="group relative flex overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div className="flex w-max animate-marquee gap-4 pr-4 group-hover:[animation-play-state:paused]">
        {row.map((q, i) => (
          <figure
            key={i}
            className="flex w-[320px] shrink-0 flex-col justify-between gap-4 rounded-2xl border border-border/70 bg-background/40 p-6 transition-colors duration-300 hover:border-border"
          >
            <blockquote className="font-display text-[17px] leading-snug text-foreground/90">
              “{q.quote}”
            </blockquote>
            <figcaption className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {q.author}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
