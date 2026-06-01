"use client";

import { useEffect, useMemo, useState } from "react";

type Heading = { id: string; text: string; level: number };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function TableOfContents({ content }: { content: string }) {
  const headings = useMemo<Heading[]>(() => {
    const out: Heading[] = [];
    const lines = content.split("\n");
    let inFence = false;
    for (const line of lines) {
      if (/^```/.test(line)) inFence = !inFence;
      if (inFence) continue;
      const m = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
      if (m) out.push({ level: m[1].length, text: m[2], id: slugify(m[2]) });
    }
    return out;
  }, [content]);

  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-3 font-semibold text-slate-900">On this page</p>
      <ul className="space-y-2">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? "0.75rem" : "0" }}>
            <a
              href={`#${h.id}`}
              className={
                "block border-l-2 pl-3 transition-colors " +
                (active === h.id
                  ? "border-teal-600 text-teal-700"
                  : "border-slate-200 text-slate-500 hover:text-slate-900")
              }
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
