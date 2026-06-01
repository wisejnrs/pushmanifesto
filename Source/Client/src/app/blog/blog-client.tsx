"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock, Search } from "lucide-react";

import type { BlogPost } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogClient({
  posts,
  categories,
  tags,
}: {
  posts: BlogPost[];
  categories: string[];
  tags: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [tag, setTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return posts.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (tag && !p.tags.includes(tag)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [posts, query, category, tag]);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Blog</h1>
        <p className="text-slate-500">
          Writing on creativity, delivery, and the Push philosophy.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            aria-label="Search posts"
            className="h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={
                "rounded-full border px-3 py-1 text-xs transition " +
                (category === c
                  ? "border-teal-500/50 bg-teal-50 text-teal-700"
                  : "border-slate-200 text-slate-500 hover:text-slate-900")
              }
            >
              {c}
            </button>
          ))}
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(tag === t ? null : t)}
                className={
                  "text-xs transition " +
                  (tag === t ? "text-teal-700" : "text-slate-400 hover:text-slate-600")
                }
              >
                #{t}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-500">No posts match your filters.</p>
      ) : (
        <div className="grid gap-6">
          {filtered.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="block rounded-xl border border-slate-200 bg-white p-6 transition hover:border-teal-300 hover:shadow-sm"
            >
              <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <Badge variant="secondary">{p.category}</Badge>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(p.publishedAt)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {p.readingTime} min read
                </span>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">{p.title}</h2>
              <p className="mt-2 text-slate-600">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
