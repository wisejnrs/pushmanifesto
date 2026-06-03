import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    publishedAt: string;
    updatedAt?: string;
    readingTime: number;
    tags: string[];
    author: {
        name: string;
        avatar: string;
        bio: string;
    };
    coverImage?: string;
    featured: boolean;
    category: string;
    status: string;
    // Header display options
    headerOverlay?: "light" | "dark" | "vignette" | "radial" | "none";
    headerOverlayIntensity?: number; // 0-100, default 60
    // Title styling options
    titleTextShadow?: "none" | "soft" | "medium" | "hard" | "glow";
    titleTextStroke?: boolean;
    titleTextStrokeWidth?: number; // 0-3, default 1
    titleTextStrokeColor?: string; // CSS color value, default: "rgba(0, 0, 0, 0.8)"
    titleUseWhiteText?: boolean; // Use white text instead of gradient
    titleBackdrop?: boolean; // Add semi-transparent dark backdrop box
    titleBackdropOpacity?: number; // 0-100, default 60
}

// Server-side functions - only use in API routes or server components
export function getAllPosts(): BlogPost[] {
    if (typeof window !== 'undefined') {
        // Client-side fallback to mock data
        return mockPosts.filter(post => post.status === 'published');
    }

    try {
        const blogDir = path.join(process.cwd(), 'src/content/blog');

        if (!fs.existsSync(blogDir)) {
            console.warn('Blog directory not found, using mock data');
            return mockPosts.filter(post => post.status === 'published');
        }

        const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));

        const posts: BlogPost[] = files.map(file => {
            const slug = file.replace('.md', '');
            const filePath = path.join(blogDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const { data, content } = matter(fileContent);

            return {
                slug,
                title: data.title || 'Untitled',
                excerpt: data.excerpt || '',
                content: content,
                publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
                updatedAt: data.updatedAt,
                readingTime: data.readingTime || calculateReadingTime(content),
                tags: data.tags || [],
                author: data.author || {
                    name: 'WiseJNRS',
                    avatar: '/apple-touch-icon.png',
                    bio: 'Music producer, audio engineer, and technology enthusiast.'
                },
                coverImage: data.coverImage,
                featured: data.featured || false,
                category: data.category || 'Uncategorized',
                status: data.status || 'published',
                headerOverlay: data.headerOverlay,
                headerOverlayIntensity: data.headerOverlayIntensity,
                titleTextShadow: data.titleTextShadow,
                titleTextStroke: data.titleTextStroke,
                titleTextStrokeWidth: data.titleTextStrokeWidth,
                titleTextStrokeColor: data.titleTextStrokeColor,
                titleUseWhiteText: data.titleUseWhiteText,
                titleBackdrop: data.titleBackdrop,
                titleBackdropOpacity: data.titleBackdropOpacity
            };
        });

        return posts.filter(post => post.status === 'published');
    } catch (error) {
        console.error('Error reading blog posts from files:', error);
        return mockPosts.filter(post => post.status === 'published');
    }
}

export function getPostBySlug(slug: string): BlogPost | null {
    const posts = getAllPosts();
    return posts.find(post => post.slug === slug) || null;
}

export function getPublishedPosts(): BlogPost[] {
    return getAllPosts().filter(post => post.status === 'published');
}

export function getFeaturedPost(): BlogPost | null {
    const posts = getPublishedPosts();
    return posts.find(post => post.featured) || null;
}

export function getPostsByCategory(category: string): BlogPost[] {
    return getPublishedPosts().filter(post => post.category === category);
}

export function getPostsByTag(tag: string): BlogPost[] {
    return getPublishedPosts().filter(post => post.tags.includes(tag));
}

export function getAllCategories(): string[] {
    const posts = getPublishedPosts();
    const categories = [...new Set(posts.map(post => post.category))];
    return categories.sort();
}

export function getAllTags(): string[] {
    const posts = getPublishedPosts();
    const tags = [...new Set(posts.flatMap(post => post.tags))];
    return tags.sort();
}

function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

// Legacy functions for backward compatibility
export const mockPosts: BlogPost[] = [
    {
        slug: "modern-music-production-techniques",
        title: "Modern Music Production Techniques: Bridging Analog and Digital",
        excerpt: "Exploring how contemporary producers blend traditional analog warmth with cutting-edge digital precision to create unique sonic landscapes.",
        content: "Exploring how contemporary producers blend traditional analog warmth with cutting-edge digital precision to create unique sonic landscapes. This comprehensive guide covers the essential techniques and tools that define modern music production.",
        publishedAt: "2025-09-15",
        readingTime: 8,
        tags: ["Music Production", "Audio Engineering", "Technology"],
        author: {
            name: "WiseJNRS",
            avatar: "/apple-touch-icon.png",
            bio: "Music producer, audio engineer, and technology enthusiast."
        },
        coverImage: undefined,
        featured: true,
        category: "Music Production",
        status: "published"
    },
    {
        slug: "building-scalable-audio-applications",
        title: "Building Scalable Audio Applications with Web Technologies",
        excerpt: "A deep dive into creating performant audio processing applications using Web Audio API, WebAssembly, and modern JavaScript frameworks.",
        content: "A comprehensive deep dive into creating performant audio processing applications using Web Audio API, WebAssembly, and modern JavaScript frameworks. Learn the fundamentals and advanced techniques for building professional-grade audio software for the web.",
        publishedAt: "2025-08-10",
        readingTime: 12,
        tags: ["Web Development", "Audio Programming", "JavaScript"],
        author: {
            name: "WiseJNRS",
            avatar: "/apple-touch-icon.png",
            bio: "Music producer, audio engineer, and technology enthusiast."
        },
        coverImage: undefined,
        featured: false,
        category: "Technology",
        status: "published"
    },
    {
        slug: "the-future-of-collaborative-music",
        title: "The Future of Collaborative Music Creation",
        excerpt: "How cloud-based DAWs and real-time collaboration tools are revolutionizing the way musicians create together across distances.",
        content: "How cloud-based DAWs and real-time collaboration tools are revolutionizing the way musicians create together across distances. Discover the technologies and platforms that are reshaping music collaboration in the digital age.",
        publishedAt: "2025-07-05",
        readingTime: 6,
        tags: ["Collaboration", "Music Technology", "Cloud Computing"],
        author: {
            name: "WiseJNRS",
            avatar: "/apple-touch-icon.png",
            bio: "Music producer, audio engineer, and technology enthusiast."
        },
        featured: false,
        category: "Technology",
        status: "published"
    },
    {
        slug: "machine-learning-in-audio-mastering",
        title: "Machine Learning in Audio Mastering: Tools and Techniques",
        excerpt: "Examining AI-powered mastering tools and their impact on the audio engineering workflow, from LANDR to specialized neural networks.",
        content: "Examining AI-powered mastering tools and their impact on the audio engineering workflow, from LANDR to specialized neural networks. This article explores how artificial intelligence is transforming audio mastering and what it means for audio engineers.",
        publishedAt: "2025-06-28",
        readingTime: 10,
        tags: ["Machine Learning", "Audio Mastering", "AI"],
        author: {
            name: "WiseJNRS",
            avatar: "/apple-touch-icon.png",
            bio: "Music producer, audio engineer, and technology enthusiast."
        },
        featured: false,
        category: "Technology",
        status: "published"
    }
];

export async function getBlogPosts(): Promise<BlogPost[]> {
    try {
        return getPublishedPosts();
    } catch (error) {
        console.error('Error getting blog posts:', error);
        // Fallback to mock data if markdown files fail
        return mockPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
        return getPostBySlug(slug);
    } catch (error) {
        console.error(`Error getting blog post ${slug}:`, error);
        // Fallback to mock data
        return mockPosts.find(post => post.slug === slug) ?? null;
    }
}

export function generateRSSFeed(posts: BlogPost[], siteConfig: any): string {
    const now = new Date();
    const buildDate = now.toUTCString();

    const rssItems = posts
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .map(post => {
            const postUrl = `${siteConfig.url}/blog/${post.slug}`;
            const pubDate = new Date(post.publishedAt).toUTCString();
            const coverImage = post.coverImage || siteConfig.ogImage;

            // Calculate word count for reading time
            const wordCount = post.content.split(/\s+/).length;

            return `
        <item>
            <title><![CDATA[${post.title}]]></title>
            <description><![CDATA[${post.excerpt}]]></description>
            <content:encoded><![CDATA[${post.content}]]></content:encoded>
            <link>${postUrl}</link>
            <guid isPermaLink="true">${postUrl}</guid>
            <pubDate>${pubDate}</pubDate>
            <dc:creator><![CDATA[${post.author.name}]]></dc:creator>
            <author>${siteConfig.creator.email} (${post.author.name})</author>
            ${post.tags.map(tag => `<category><![CDATA[${tag}]]></category>`).join('\n            ')}
            ${post.coverImage ? `<enclosure url="${coverImage}" type="image/png" length="0"/>` : ''}
            <media:content url="${coverImage}" medium="image" type="image/png">
                <media:title type="plain">${post.title}</media:title>
                <media:description type="plain">${post.excerpt}</media:description>
            </media:content>
            <slash:comments>0</slash:comments>
        </item>`;
        }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
    <channel>
        <title><![CDATA[${siteConfig.name} Blog - Technology, Music & Innovation]]></title>
        <description><![CDATA[${siteConfig.description} - Insights on AI, intelligent systems, music production, and technology leadership from Brisbane, Australia.]]></description>
        <link>${siteConfig.url}/blog</link>
        <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
        <language>en-AU</language>
        <copyright>Copyright ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.</copyright>
        <managingEditor>${siteConfig.creator.email} (${siteConfig.creator.name})</managingEditor>
        <webMaster>${siteConfig.creator.email} (${siteConfig.creator.name})</webMaster>
        <lastBuildDate>${buildDate}</lastBuildDate>
        <pubDate>${buildDate}</pubDate>
        <generator>WiseJNRS Website - Next.js 15</generator>
        <docs>https://www.rssboard.org/rss-specification</docs>
        <ttl>60</ttl>
        <image>
            <url>${siteConfig.ogImage}</url>
            <title><![CDATA[${siteConfig.name} Blog]]></title>
            <link>${siteConfig.url}/blog</link>
            <width>500</width>
            <height>500</height>
            <description><![CDATA[${siteConfig.name} - Electronic Music Producer & Technology Leader]]></description>
        </image>
        <category><![CDATA[Technology]]></category>
        <category><![CDATA[Music Production]]></category>
        <category><![CDATA[AI & Machine Learning]]></category>
        <category><![CDATA[Electronic Music]]></category>
        <category><![CDATA[Innovation]]></category>${rssItems}
    </channel>
</rss>`;
}