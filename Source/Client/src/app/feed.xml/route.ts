import { getAllPosts, generateRSSFeed } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

export function GET() {
  const xml = generateRSSFeed(getAllPosts(), siteConfig);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
