"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Render as something other than a div (e.g. "li", "section"). */
  as?: keyof typeof motion;
};

export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;

  // Reduced motion: render static, fully-visible content (no enter animation).
  if (reduce) {
    const Plain = as as React.ElementType;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
