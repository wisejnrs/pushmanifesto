"use client";

import * as React from "react";
import { Palette, Check } from "lucide-react";

type Theme = {
  id: string;
  name: string;
  desc: string;
  swatches: [string, string, string];
};

const THEMES: Theme[] = [
  { id: "default", name: "Default", desc: "Brand glass", swatches: ["#e73c6f", "#2394d5", "#2af3b7"] },
  { id: "aqua", name: "Aqua", desc: "Ocean teals", swatches: ["#00abbd", "#0099dd", "#7fc7e0"] },
  { id: "tunnel-drive", name: "Tunnel Drive", desc: "Teal & orange", swatches: ["#4db8ac", "#008b8b", "#ff7f00"] },
  { id: "graphic-design", name: "Graphic Design", desc: "Blue & orange", swatches: ["#5a82c2", "#f28705", "#f24405"] },
  { id: "trek-warp", name: "Warp", desc: "Cyan & magenta", swatches: ["#0bd9d9", "#f20ccc", "#f20f62"] },
  { id: "illustration", name: "Illustration", desc: "Warm yellows", swatches: ["#f2e205", "#f2cb05", "#f24c3d"] },
  { id: "so", name: "So", desc: "Vintage rose", swatches: ["#f2d0d5", "#582e54", "#da93a7"] },
  { id: "oat-flat-white", name: "Oat Flat White", desc: "Earthy peach", swatches: ["#e3aa99", "#cd9f8f", "#dc7147"] },
  { id: "webber", name: "Webber", desc: "Racing colours", swatches: ["#0066ff", "#dc0000", "#ffd700"] },
  { id: "ember", name: "Ember", desc: "Amber & fire", swatches: ["#f97316", "#ef4444", "#f59e0b"] },
  { id: "verdant", name: "Verdant", desc: "Emerald & lime", swatches: ["#22c55e", "#84cc16", "#14b8a6"] },
  { id: "amethyst", name: "Amethyst", desc: "Violet & magenta", swatches: ["#8b5cf6", "#d946ef", "#a855f7"] },
  { id: "rose", name: "Rose", desc: "Rose & coral", swatches: ["#f43f5e", "#fb7185", "#ec4899"] },
];

const CLASSES = THEMES.filter((t) => t.id !== "default").map((t) => t.id);
const STORAGE_KEY = "pm-theme";

export function ThemeSwitcher() {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState("default");
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setActive(localStorage.getItem(STORAGE_KEY) || "default");
  }, []);

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

  function apply(id: string) {
    const root = document.documentElement;
    CLASSES.forEach((c) => root.classList.remove(c));
    if (id !== "default") root.classList.add(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {}
    setActive(id);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change colour theme"
        aria-haspopup="menu"
        aria-expanded={open}
        className="glass inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:text-foreground active:scale-95"
      >
        <Palette className="h-4 w-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="menu-scroll absolute right-0 z-50 mt-2 max-h-[min(70vh,24rem)] w-56 origin-top-right overflow-y-auto rounded-2xl border border-border/60 bg-card/95 p-1.5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        >
          <p className="px-2.5 pb-1 pt-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Palette
          </p>
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              role="menuitemradio"
              aria-checked={active === t.id}
              onClick={() => apply(t.id)}
              className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-foreground/5"
            >
              <span className="flex gap-1">
                {t.swatches.map((c, i) => (
                  <span
                    key={i}
                    className="h-3 w-3 rounded-full ring-1 ring-white/15"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </span>
              <span className="flex-1 leading-tight">
                <span className="block text-sm font-medium text-foreground">{t.name}</span>
                <span className="block text-[11px] text-muted-foreground">{t.desc}</span>
              </span>
              {active === t.id && <Check className="h-4 w-4 shrink-0 text-foreground" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
