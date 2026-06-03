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
            aria-hidden={i >= quotes.length ? "true" : undefined}
            className="glass flex w-[320px] shrink-0 flex-col justify-between gap-4 rounded-2xl p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_16px_40px_-20px_rgba(16,24,40,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_2px_6px_rgba(16,24,40,0.06),0_28px_56px_-24px_rgba(16,24,40,0.45)]"
          >
            <blockquote className="font-display text-[17px] leading-snug text-foreground/90">
              “{q.quote}”
            </blockquote>
            <figcaption className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand" />
              {q.author}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
