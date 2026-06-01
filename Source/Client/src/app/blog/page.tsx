import type { Metadata } from "next";

import { getAllPosts, getAllCategories, getAllTags } from "@/lib/blog";
import { siteConfig } from "@/lib/site";
import BlogClient from "./blog-client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description: `Writing from ${siteConfig.name} — creativity, delivery, and the Push philosophy.`,
  alternates: {
    canonical: `${siteConfig.url}/blog`,
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();
  return <BlogClient posts={posts} categories={categories} tags={tags} />;
}
