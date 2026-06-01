import Link from "next/link";

import type { BlogPost } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";

export function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;
  return (
    <section className="mt-16">
      <h2 className="mb-6 text-xl font-semibold text-slate-900">Related posts</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="block rounded-lg border border-slate-200 bg-white p-5 transition hover:border-teal-300 hover:shadow-sm"
          >
            <Badge variant="secondary" className="mb-2">
              {p.category}
            </Badge>
            <h3 className="font-semibold text-slate-900">{p.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-slate-500">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
