import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { siteConfig } from "./site";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  tags: string[];
  author: { name: string; avatar: string; bio: string };
  coverImage?: string;
  featured: boolean;
  category: string;
  status: string;
}

const contentDirectory = path.join(process.cwd(), "src/content/blog");

export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function parsePost(fileName: string): BlogPost | null {
  try {
    const slug = fileName.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(contentDirectory, fileName), "utf8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title || "Untitled",
      excerpt: data.excerpt || "",
      content,
      publishedAt: data.publishedAt || new Date().toISOString().split("T")[0],
      updatedAt: data.updatedAt,
      readingTime: data.readingTime || calculateReadingTime(content),
      tags: data.tags || [],
      author: data.author || {
        name: siteConfig.author.name,
        avatar: siteConfig.author.avatar,
        bio: siteConfig.author.bio,
      },
      coverImage: data.coverImage,
      featured: data.featured || false,
      category: data.category || "Uncategorized",
      status: data.status || "published",
    };
  } catch {
    return null;
  }
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(contentDirectory)) return [];
  return fs
    .readdirSync(contentDirectory)
    .filter((f) => f.endsWith(".md"))
    .map(parsePost)
    .filter((p): p is BlogPost => p !== null && p.status === "published")
    .sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export function getPostBySlug(slug: string): BlogPost | null {
  const post = parsePost(`${slug}.md`);
  return post && post.status === "published" ? post : null;
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(getAllPosts().map((p) => p.category))).sort();
}

export function getAllTags(): string[] {
  return Array.from(new Set(getAllPosts().flatMap((p) => p.tags))).sort();
}

export function getFeaturedPost(): BlogPost | null {
  const posts = getAllPosts();
  return posts.find((p) => p.featured) ?? posts[0] ?? null;
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      post: p,
      score:
        p.tags.filter((t) => post.tags.includes(t)).length +
        (p.category === post.category ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.post);
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateRSSFeed(posts: BlogPost[]): string {
  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${siteConfig.url}/blog/${p.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/blog/${p.slug}</guid>
      <description>${escapeXml(p.excerpt)}</description>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      ${p.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("")}
    </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} Blog</title>
    <link>${siteConfig.url}/blog</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}
