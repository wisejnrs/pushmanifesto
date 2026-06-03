import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPost } from "./blog";

const ROOT = path.join(process.cwd(), "src/content/blog");
const DEFAULT_LOCALE = "en";

function enDir(): string {
  return path.join(ROOT, DEFAULT_LOCALE);
}

function ensureContentDirectory() {
  if (!fs.existsSync(enDir())) fs.mkdirSync(enDir(), { recursive: true });
}

function extractSlugFromFilename(fileName: string): string {
  const nameWithoutExt = fileName.replace(/\.md$/, "");
  const match = nameWithoutExt.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
  return match && match[2] ? match[2] : nameWithoutExt;
}

function findFileForSlug(dir: string, slug: string): string | null {
  if (!fs.existsSync(dir)) return null;
  const fileNames = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  if (fileNames.includes(`${slug}.md`)) return `${slug}.md`;
  return fileNames.find((f) => extractSlugFromFilename(f) === slug) || null;
}

function parsePost(fullPath: string, slug: string, aiTranslated: boolean): BlogPost | null {
  if (!fs.existsSync(fullPath)) return null;
  const { data, content } = matter(fs.readFileSync(fullPath, "utf8"));

  let publishedAt = data.publishedAt;
  if (!publishedAt) {
    const m = path.basename(fullPath).replace(/\.md$/, "").match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
    publishedAt = m ? m[1] : new Date().toISOString().split("T")[0];
  }

  return {
    slug,
    title: data.title || "",
    excerpt: data.excerpt || "",
    content,
    publishedAt,
    updatedAt: data.updatedAt,
    readingTime: data.readingTime || calculateReadingTime(content),
    tags: data.tags || [],
    author: data.author || {
      name: "Michael Wise",
      avatar: "/assets/manifesto-ico.svg",
      bio: "",
    },
    coverImage: data.coverImage,
    featured: data.featured || false,
    category: data.category || "General",
    status: data.status || "published",
    aiTranslated: aiTranslated || data.aiTranslated || false,
  };
}

// Read a post in the requested locale, falling back to English when the
// locale has no translation of that slug.
function readLocalized(slug: string, locale: string): BlogPost | null {
  if (locale && locale !== DEFAULT_LOCALE) {
    const dir = path.join(ROOT, locale);
    const f = findFileForSlug(dir, slug);
    if (f) return parsePost(path.join(dir, f), slug, true);
  }
  const ef = findFileForSlug(enDir(), slug);
  return ef ? parsePost(path.join(enDir(), ef), slug, false) : null;
}

export function getAllPostSlugs(): string[] {
  try {
    ensureContentDirectory();
    return fs
      .readdirSync(enDir())
      .filter((f) => f.endsWith(".md"))
      .map(extractSlugFromFilename);
  } catch {
    return [];
  }
}

export function getPostBySlugServer(slug: string, locale: string = DEFAULT_LOCALE): BlogPost | null {
  try {
    ensureContentDirectory();
    return readLocalized(slug, locale);
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllPostsServer(locale: string = DEFAULT_LOCALE): BlogPost[] {
  try {
    ensureContentDirectory();
    return getAllPostSlugs()
      .map((slug) => readLocalized(slug, locale))
      .filter((p): p is BlogPost => p !== null)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return [];
  }
}

export function getPublishedPostsServer(locale: string = DEFAULT_LOCALE): BlogPost[] {
  return getAllPostsServer(locale).filter((p) => p.status === "published");
}

export function getFeaturedPostServer(locale: string = DEFAULT_LOCALE): BlogPost | null {
  return getPublishedPostsServer(locale).find((p) => p.featured) || null;
}

export function getPostsByCategoryServer(category: string, locale: string = DEFAULT_LOCALE): BlogPost[] {
  return getPublishedPostsServer(locale).filter((p) => p.category === category);
}

export function getPostsByTagServer(tag: string, locale: string = DEFAULT_LOCALE): BlogPost[] {
  return getPublishedPostsServer(locale).filter((p) => p.tags.includes(tag));
}

export function getAllCategoriesServer(locale: string = DEFAULT_LOCALE): string[] {
  return [...new Set(getPublishedPostsServer(locale).map((p) => p.category))].sort();
}

export function getAllTagsServer(locale: string = DEFAULT_LOCALE): string[] {
  return [...new Set(getPublishedPostsServer(locale).flatMap((p) => p.tags))].sort();
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const clean = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/#{1,6}\s/g, "")
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, "$1")
    .replace(/\n/g, " ")
    .trim();
  // CJK has no spaces — approximate by character count for those scripts.
  const cjk = (clean.match(/[　-鿿가-힯]/g) || []).length;
  const words = clean.split(/\s+/).filter((w) => w.length > 0).length;
  return Math.max(1, Math.ceil((words + cjk / 2.5) / wordsPerMinute));
}

export function generateRSSFeedServer(posts: BlogPost[], siteConfig: { url: string; name: string; description: string; [k: string]: unknown }): string {
  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteConfig.url}/blog/${post.slug}</link>
      <guid>${siteConfig.url}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`,
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>${siteConfig.name}</title>
  <link>${siteConfig.url}/blog</link>
  <description>${siteConfig.description}</description>
  ${items}
</channel></rss>`;
}
