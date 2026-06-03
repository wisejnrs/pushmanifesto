"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Languages, Check } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, LOCALE_NAMES, type Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function choose(next: Locale) {
    setOpen(false);
    if (next !== locale) router.replace(pathname, { locale: next });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("changeLanguage")}
        aria-haspopup="menu"
        aria-expanded={open}
        className="glass inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground active:scale-95"
      >
        <Languages className="h-4 w-4" />
        <span className="font-medium uppercase">{locale}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="glass absolute right-0 z-50 mt-2 w-44 origin-top-right rounded-2xl p-1.5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)]"
        >
          <p className="px-2.5 pb-1 pt-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {t("changeLanguage")}
          </p>
          {routing.locales.map((l) => (
            <button
              key={l}
              type="button"
              role="menuitemradio"
              aria-checked={l === locale}
              onClick={() => choose(l)}
              className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition-colors hover:bg-foreground/5"
            >
              <span className="w-7 shrink-0 text-[11px] font-semibold uppercase text-muted-foreground">
                {l}
              </span>
              <span className="flex-1 text-foreground">{LOCALE_NAMES[l]}</span>
              {l === locale && <Check className="h-4 w-4 shrink-0 text-foreground" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
