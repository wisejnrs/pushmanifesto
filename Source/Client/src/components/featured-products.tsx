import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

type Product = {
  title: string;
  price: string;
  image: string;
  href: string;
};

// Curated from the WiseJNRS store, leading with the Push Manifesto tee. Images
// are served locally (public/products) and optimised by next/image.
const PRODUCTS: Product[] = [
  { title: "Push Manifesto — Space Cowboy", price: "$26.00", image: "/products/push-manifesto.jpg", href: "https://wisejnrs.myshopify.com/products/push-manifesto" },
  { title: "Space Welders", price: "$26.00", image: "/products/space-welders.jpg", href: "https://wisejnrs.myshopify.com/products/space-welders" },
  { title: "Atomic Robot Dog", price: "$26.00", image: "/products/atomic-robot-dog.png", href: "https://wisejnrs.myshopify.com/products/atomic-robot-dog-oreo-in-another-dimension-official" },
  { title: "Disobedient — Album Cover", price: "$26.00", image: "/products/disobedient-album.jpg", href: "https://wisejnrs.myshopify.com/products/disobedient-album" },
];

const STORE_URL = "https://wisejnrs.myshopify.com";

export function FeaturedProducts() {
  return (
    <section className="container max-w-5xl px-6 py-16 md:py-24">
      <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Featured Products</h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Handpicked pieces from the WiseJNRS store. Quality merch for makers and the creatively restless.
          </p>
        </div>
        <a
          href={STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/70 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10"
        >
          View store
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {PRODUCTS.map((p, i) => (
          <a
            key={p.href}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ "--reveal-i": i } as CSSProperties}
            className="reveal-up gradient-ring glass group flex flex-col overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative aspect-square overflow-hidden bg-muted/30">
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-cover brightness-[0.92] saturate-[0.95] transition duration-500 group-hover:scale-105 group-hover:brightness-100 group-hover:saturate-100"
              />
              {/* Fade the photo into the card so warm product shots sit in the dark theme. */}
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/15 to-transparent" />
              {/* Brand-tinted glow on hover. */}
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            <div className="flex flex-1 flex-col gap-1 p-4">
              <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">{p.title}</h3>
              <span className="mt-auto pt-1 font-mono text-sm font-semibold text-gradient-brand">{p.price}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
