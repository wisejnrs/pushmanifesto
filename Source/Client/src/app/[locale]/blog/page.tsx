import { getPublishedPostsServer, getAllCategoriesServer, getFeaturedPostServer } from "@/lib/blog-server";
import { constructMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import BlogClient from "./blog-client";

// Enable ISR with revalidation every hour
export const revalidate = 3600;

export const metadata = constructMetadata({
    title: "Blog - Technology, Music & Innovation",
    description: "Insights on AI healthcare, music production, technology leadership, and creative innovation from Michael Wise (WiseJNRS). Learn about intelligent systems, enterprise architecture, electronic music, and digital transformation from a CIO and producer in Brisbane, Australia.",
    keywords: [
        "technology blog",
        "music production blog",
        "AI healthcare insights",
        "enterprise architecture",
        "digital transformation",
        "Brisbane tech blog",
        "electronic music production",
        "CIO insights",
        "innovation blog",
        "WiseJNRS blog",
        "Michael Wise articles",
        "intelligent systems",
        "product strategy"
    ],
    url: `${siteConfig.url}/blog`
});

export default async function BlogPage() {
    // Load data server-side for better performance and SEO
    const posts = getPublishedPostsServer();
    const categories = getAllCategoriesServer();
    const featuredPost = getFeaturedPostServer();
    const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

    return (
        <BlogClient
            initialPosts={posts}
            categories={categories}
            featuredPost={featuredPost}
            allTags={allTags}
        />
    );
}

