import { getAllPosts, generateRSSFeed } from "@/lib/blog";

export const revalidate = 3600;

export function GET() {
  const xml = generateRSSFeed(getAllPosts());
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
