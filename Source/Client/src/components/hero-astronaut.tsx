"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/**
 * The Push Manifesto "space cowboy" — drifts continuously (CSS float),
 * parallax-shifts and rotates gently as the hero scrolls away, and rides a
 * blue/teal glow. Transforms are split across nested elements so the scroll
 * parallax and the continuous float never fight over `transform`.
 */
export function HeroAstronaut() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 7]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.4]);

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, rgba(35,148,213,0.55), rgba(42,243,183,0.28) 45%, transparent 70%)",
        }}
      />
      <motion.div style={reduce ? undefined : { y, rotate, opacity }}>
        <div className="animate-float-slow">
          <img
            src="/img/manifesto.png"
            alt="The Push Manifesto astronaut, drifting through space"
            className="mx-auto w-[200px] drop-shadow-2xl sm:w-[300px] lg:w-[480px] dark:invert"
          />
        </div>
      </motion.div>
    </div>
  );
}
