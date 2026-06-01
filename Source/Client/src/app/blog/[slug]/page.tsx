import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";

import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { RelatedPosts } from "@/components/blog/related-posts";

export const revalidate = 3600;

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  const url = `${siteConfig.url}/blog/${slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      siteName: siteConfig.name,
      publishedTime: new Date(post.publishedAt).toISOString(),
      tags: post.tags,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
  };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const related = getRelatedPosts(post);

  return (
    <article>
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" /> All posts
      </Link>

      <header className="mt-6 space-y-4">
        <Badge variant="secondary">{post.category}</Badge>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">{post.title}</h1>
        <p className="text-lg text-slate-600">{post.excerpt}</p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            {formatDate(post.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readingTime} min read
          </span>
          <span>by {post.author.name}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t} className="text-xs text-slate-400">
              #{t}
            </span>
          ))}
        </div>
      </header>

      <Separator className="my-8 bg-slate-200" />

      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
        <div className="min-w-0">
          <MarkdownRenderer content={post.content} />
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents content={post.content} />
          </div>
        </aside>
      </div>

      <RelatedPosts posts={related} />
    </article>
  );
}
