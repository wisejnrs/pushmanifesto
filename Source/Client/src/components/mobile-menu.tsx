"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Twitter, Linkedin, Github, Globe } from "lucide-react";

export type MobileNavLink = {
  label: string;
  href: string;
  external?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
};

const socials = [
  { label: "X / Twitter", href: "https://www.twitter.com/michael_wise", icon: Twitter },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/michaelleahywise/", icon: Linkedin },
  { label: "GitHub", href: "https://github.com/wisejnrs/pushmanifesto", icon: Github },
  { label: "wisejnrs.net", href: "https://www.wisejnrs.net", icon: Globe },
];

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu({
  open,
  onClose,
  nav,
}: {
  open: boolean;
  onClose: () => void;
  nav: MobileNavLink[];
}) {
  const [mounted, setMounted] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  React.useEffect(() => setMounted(true), []);

  // Lock body scroll, trap focus, restore focus on close, close on Escape.
  React.useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Focus the first focusable element in the panel.
    const focusFirst = () => {
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      nodes?.[0]?.focus();
    };
    const t = window.setTimeout(focusFirst, 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="pointer-events-none fixed inset-0 z-[101] flex items-start justify-center p-4 pt-20 md:hidden">
            <motion.div
              ref={panelRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.94, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: -8 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="glass pointer-events-auto w-full max-w-sm overflow-hidden rounded-3xl p-5 shadow-[0_30px_70px_-24px_rgba(0,0,0,0.7)]"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2.5">
                  <img src="/assets/manifesto-ico.svg" alt="" aria-hidden className="h-7 w-7" />
                  <span className="font-display text-base font-semibold tracking-tight">
                    Push Manifesto
                  </span>
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground active:scale-95"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav aria-label="Mobile" className="flex flex-col">
                {nav.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium text-foreground/90 transition-colors hover:bg-foreground/5"
                  >
                    {item.icon ? (
                      <item.icon className="h-[18px] w-[18px] text-muted-foreground" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand" />
                    )}
                    <span className="flex-1">{item.label}</span>
                    {item.external && (
                      <span className="sr-only">(opens in a new tab)</span>
                    )}
                  </Link>
                ))}
              </nav>

              <div className="mt-3 flex items-center justify-center gap-1.5 border-t border-border/60 pt-4">
                {socials.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    aria-label={`${s.label} (opens in a new tab)`}
                    className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                  >
                    <s.icon className="h-[18px] w-[18px]" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
