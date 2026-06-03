"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

type MagneticButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  /** How strongly the button leans toward the cursor (0–1). */
  strength?: number;
};

/**
 * A link that gently leans toward the cursor while hovered, then springs back.
 * Respects reduced-motion (renders a plain anchor with no tracking).
 */
export function MagneticButton({
  href,
  children,
  className,
  external,
  strength = 0.35,
}: MagneticButtonProps) {
  const ref = React.useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 16, mass: 0.4 });

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseMove={reduce ? undefined : onMove}
      onMouseLeave={reset}
      style={reduce ? undefined : { x, y }}
      className={className}
    >
      {children}
    </motion.a>
  );
}
