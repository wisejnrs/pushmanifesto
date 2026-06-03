"use client";

import * as React from "react";
import Link from "next/link";
import { Github, BookOpen, Store, Menu, X } from "lucide-react";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { MobileMenu } from "@/components/mobile-menu";
import { cn } from "@/lib/utils";

type NavLink = {
  label: string;
  href: string;
  external?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
};

const NAV: NavLink[] = [
  { label: "Manifesto", href: "/#manifesto" },
  { label: "Blog", href: "/blog" },
  { label: "GitHub", href: "https://github.com/wisejnrs/pushmanifesto", external: true, icon: Github },
  { label: "Wiki", href: "https://github.com/wisejnrs/pushmanifesto/wiki", external: true, icon: BookOpen },
  { label: "Store", href: "https://wisejnrs.myshopify.com", external: true, icon: Store },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-colors duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-background/0",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          <img
            src="/assets/manifesto-ico.svg"
            alt=""
            aria-hidden
            className="h-8 w-8 transition-transform duration-300 group-hover:rotate-[8deg]"
          />
          <span className="font-display text-lg font-semibold tracking-tight">
            Push Manifesto
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
            >
              {item.label}
              {item.external && <span className="sr-only"> (opens in a new tab)</span>}
            </Link>
          ))}
          <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
          <ThemeSwitcher />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeSwitcher />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full border border-border/70 text-foreground transition-colors hover:bg-foreground/10 active:scale-95"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <MobileMenu open={open} onClose={() => setOpen(false)} nav={NAV} />
    </header>
  );
}
