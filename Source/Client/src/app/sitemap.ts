import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getPublishedPostsServer } from "@/lib/blog-server";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  let posts: MetadataRoute.Sitemap = [];
  try {
    posts = getPublishedPostsServer().map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "monthly",
      priority: p.featured ? 0.8 : 0.6,
    }));
  } catch {}

  return [...staticRoutes, ...posts];
}
