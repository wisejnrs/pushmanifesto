"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Github, BookOpen, Store, Menu, X } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileMenu } from "@/components/mobile-menu";

export type NavItem = {
  key: string;
  href: string;
  external?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
};

export const NAV: NavItem[] = [
  { key: "manifesto", href: "/#manifesto" },
  { key: "blog", href: "/blog" },
  { key: "github", href: "https://github.com/wisejnrs/pushmanifesto", external: true, icon: Github },
  { key: "wiki", href: "https://github.com/wisejnrs/pushmanifesto/wiki", external: true, icon: BookOpen },
  { key: "store", href: "https://wisejnrs.myshopify.com", external: true, icon: Store },
];

export function SiteHeader() {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);

  const navLinkClass =
    "rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:bg-foreground/10 hover:text-foreground";

  const logo = (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5">
      <img
        src="/assets/manifesto-ico.svg"
        alt=""
        aria-hidden
        className="h-8 w-8 shrink-0 transition-transform duration-300 group-hover:rotate-[8deg]"
      />
      <span className="whitespace-nowrap font-display text-lg font-semibold tracking-tight">
        Push Manifesto
      </span>
    </Link>
  );

  const navLinks = NAV.map((item) =>
    item.external ? (
      <a
        key={item.key}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={navLinkClass}
      >
        {t(`nav.${item.key}`)}
        <span className="sr-only"> {t("common.newTab")}</span>
      </a>
    ) : (
      <Link key={item.key} href={item.href} className={navLinkClass}>
        {t(`nav.${item.key}`)}
      </Link>
    ),
  );

  const controls = (
    <>
      <LanguageSwitcher />
      <ThemeSwitcher />
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/20 shadow-lg shadow-black/5 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20 relative before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent">
      {/* Mobile / tablet (< lg): logo left, controls + menu right */}
      <div className="container flex h-16 items-center justify-between gap-2 lg:hidden">
        {logo}
        <div className="flex items-center gap-1.5">
          {controls}
          <button
            type="button"
            aria-label={open ? t("common.closeMenu") : t("common.openMenu")}
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

      {/* Desktop (lg+): logo left · centered nav · controls right */}
      <div className="container hidden h-16 grid-cols-3 items-center gap-2 lg:grid">
        <div className="flex items-center justify-start">{logo}</div>
        <nav aria-label="Primary" className="flex items-center justify-center gap-1">
          {navLinks}
        </nav>
        <div className="flex items-center justify-end gap-1">
          <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
          {controls}
        </div>
      </div>

      <MobileMenu open={open} onClose={() => setOpen(false)} nav={NAV} />
    </header>
  );
}
