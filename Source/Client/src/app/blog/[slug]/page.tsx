import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlugServer, getAllPostSlugs, getAllPostsServer } from "@/lib/blog-server";
import BlogPostClient from "./blog-post-client";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";
import { StructuredData } from "@/components/seo/structured-data";

// Generate dynamic metadata for blog posts
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlugServer(slug);

    if (!post) {
        return {
            title: "Post Not Found",
            description: "The requested blog post could not be found.",
        };
    }

    const ogImage = post.coverImage || `${siteConfig.url}/og-image.jpg`;
    const publishedTime = new Date(post.publishedAt).toISOString();

    return {
        title: post.title,
        description: post.excerpt,
        authors: [{ name: post.author.name }],
        openGraph: {
            type: "article",
            locale: "en_AU",
            url: `${siteConfig.url}/blog/${slug}`,
            title: post.title,
            description: post.excerpt,
            siteName: siteConfig.name,
            publishedTime,
            authors: [post.author.name],
            tags: post.tags,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                    type: "image/jpeg",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            site: siteConfig.social.handles.x,
            creator: siteConfig.social.handles.x,
            images: [ogImage],
        },
        keywords: post.tags,
        category: post.category,
    };
}

// Generate static params for all blog posts
export async function generateStaticParams() {
    const slugs = getAllPostSlugs();
    return slugs.map((slug) => ({
        slug,
    }));
}

// Enable ISR with revalidation every hour
export const revalidate = 3600;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlugServer(slug);
    const allPosts = getAllPostsServer();

    if (!post) {
        notFound();
    }

    const articleStructuredData = {
        title: post.title,
        description: post.excerpt,
        datePublished: new Date(post.publishedAt).toISOString(),
        dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date(post.publishedAt).toISOString(),
        image: post.coverImage || `${siteConfig.url}/og-image.jpg`,
        url: `${siteConfig.url}/blog/${slug}`,
        keywords: post.tags.join(', '),
        articleSection: post.category,
        wordCount: post.content.split(/\s+/).length,
    };

    return (
        <>
            <StructuredData type="article" data={articleStructuredData} />
            <BlogPostClient post={post} allPosts={allPosts} />
        </>
    );
}