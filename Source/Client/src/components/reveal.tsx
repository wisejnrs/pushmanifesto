import * as React from "react";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Render as something other than a div (e.g. "li", "section"). */
  as?: React.ElementType;
};

// Entrance reveal driven by a pure-CSS animation (`.reveal-up` in globals.css),
// NOT a JS scroll-observer. Content is therefore never gated on hydration: if
// the JS bundle fails to load (e.g. a stale cache hitting 404'd chunks after a
// deploy) the page still shows — the CSS animation runs on load and ends
// visible. `delay` (seconds) staggers siblings via animation-delay; the
// prefers-reduced-motion rule collapses it to an instant show.
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const Comp = as;
  return (
    <Comp
      className={["reveal-up", className].filter(Boolean).join(" ")}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </Comp>
  );
}
