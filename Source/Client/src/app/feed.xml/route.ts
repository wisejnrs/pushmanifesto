import { getPublishedPostsServer, generateRSSFeedServer } from "@/lib/blog-server";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

export function GET() {
  const xml = generateRSSFeedServer(getPublishedPostsServer(), siteConfig);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
