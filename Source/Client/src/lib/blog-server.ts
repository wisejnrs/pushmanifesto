import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from './blog';

const contentDirectory = path.join(process.cwd(), 'src/content/blog');

// Build-time cache for blog posts
const BLOG_POSTS_CACHE = new Map<string, BlogPost>();
const ALL_POSTS_CACHE: BlogPost[] | null = null;
let CACHE_INITIALIZED = false;

// Ensure content directory exists
function ensureContentDirectory() {
    if (!fs.existsSync(contentDirectory)) {
        fs.mkdirSync(contentDirectory, { recursive: true });
    }
}

export function getAllPostsServer(): BlogPost[] {
    try {
        ensureContentDirectory();
        const fileNames = fs.readdirSync(contentDirectory);
        const allPostsData = fileNames
            .filter(fileName => fileName.endsWith('.md'))
            .map(fileName => {
                const slug = extractSlugFromFilename(fileName);
                return getPostBySlugServer(slug, fileName);
            })
            .filter((post): post is BlogPost => post !== null);

        return allPostsData.sort((a, b) => {
            return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });
    } catch (error) {
        console.error('Error reading blog posts:', error);
        return [];
    }
}

// Extract slug from filename, supporting both old and new formats
function extractSlugFromFilename(fileName: string): string {
    const nameWithoutExt = fileName.replace(/\.md$/, '');

    // Check if it matches the new format: YYYY-MM-DD-post-slug
    const datePattern = /^(\d{4}-\d{2}-\d{2})-(.+)$/;
    const match = nameWithoutExt.match(datePattern);

    if (match && match[2]) {
        return match[2]; // Return the slug part after the date
    }

    // Return as-is for old format
    return nameWithoutExt;
}

// Find actual filename for a given slug
function findFileForSlug(slug: string): string | null {
    try {
        const fileNames = fs.readdirSync(contentDirectory);

        // First try exact match (old format)
        if (fileNames.includes(`${slug}.md`)) {
            return `${slug}.md`;
        }

        // Then try new format: find any file ending with -slug.md
        const newFormatFile = fileNames.find(fileName => {
            const nameWithoutExt = fileName.replace(/\.md$/, '');
            const datePattern = /^(\d{4}-\d{2}-\d{2})-(.+)$/;
            const match = nameWithoutExt.match(datePattern);
            return match && match[2] === slug;
        });

        return newFormatFile || null;
    } catch (error) {
        return null;
    }
}

export function getPostBySlugServer(slug: string, fileName?: string): BlogPost | null {
    try {
        ensureContentDirectory();

        // Use provided filename or find it
        const actualFileName = fileName || findFileForSlug(slug);
        if (!actualFileName) {
            return null;
        }

        const fullPath = path.join(contentDirectory, actualFileName);
        if (!fs.existsSync(fullPath)) {
            return null;
        }

        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        // Extract date from filename if using new format
        let publishedAt = data.publishedAt;
        if (!publishedAt) {
            const nameWithoutExt = actualFileName.replace(/\.md$/, '');
            const datePattern = /^(\d{4}-\d{2}-\d{2})-(.+)$/;
            const match = nameWithoutExt.match(datePattern);
            if (match) {
                publishedAt = match[1];
            } else {
                publishedAt = new Date().toISOString().split('T')[0];
            }
        }

        // Calculate reading time
        const readingTime = data.readingTime || calculateReadingTime(content);

        return {
            slug,
            title: data.title || '',
            excerpt: data.excerpt || '',
            content: content, // Keep as markdown for our custom renderer
            publishedAt,
            updatedAt: data.updatedAt,
            readingTime,
            tags: data.tags || [],
            author: data.author || {
                name: 'WiseJNRS',
                avatar: '/apple-touch-icon.png',
                bio: 'Music producer, audio engineer, and technology enthusiast.'
            },
            coverImage: data.coverImage,
            featured: data.featured || false,
            category: data.category || 'General',
            status: data.status || 'published'
        };
    } catch (error) {
        console.error(`Error reading post ${slug}:`, error);
        return null;
    }
}

export function getPublishedPostsServer(): BlogPost[] {
    // Use cache if already initialized
    if (CACHE_INITIALIZED && BLOG_POSTS_CACHE.size > 0) {
        return Array.from(BLOG_POSTS_CACHE.values())
            .filter(post => post.status === 'published')
            .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }

    // First time: populate cache
    const posts = getAllPostsServer().filter(post => post.status === 'published');
    posts.forEach(post => BLOG_POSTS_CACHE.set(post.slug, post));
    CACHE_INITIALIZED = true;

    return posts;
}

export function getFeaturedPostServer(): BlogPost | null {
    const posts = getPublishedPostsServer();
    return posts.find(post => post.featured) || null;
}

export function getPostsByCategoryServer(category: string): BlogPost[] {
    return getPublishedPostsServer().filter(post => post.category === category);
}

export function getPostsByTagServer(tag: string): BlogPost[] {
    return getPublishedPostsServer().filter(post => post.tags.includes(tag));
}

export function getAllCategoriesServer(): string[] {
    const posts = getPublishedPostsServer();
    const categories = [...new Set(posts.map(post => post.category))];
    return categories.sort();
}

export function getAllTagsServer(): string[] {
    const posts = getPublishedPostsServer();
    const tags = [...new Set(posts.flatMap(post => post.tags))];
    return tags.sort();
}

function calculateReadingTime(content: string): number {
    // More accurate reading time calculation
    const wordsPerMinute = 200;

    // Remove markdown syntax for more accurate word count
    const cleanContent = content
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/`[^`]*`/g, '') // Remove inline code
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // Remove images
        .replace(/\[[^\]]*\]\([^)]*\)/g, '') // Remove links
        .replace(/#{1,6}\s/g, '') // Remove headers
        .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1') // Remove emphasis
        .replace(/\n/g, ' ') // Replace newlines with spaces
        .trim();

    const words = cleanContent.split(/\s+/).filter(word => word.length > 0).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}


export function generateRSSFeedServer(posts: BlogPost[], siteConfig: any): string {
    const now = new Date();
    const buildDate = now.toUTCString();

    const rssItems = posts
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .map(post => {
            const postUrl = `${siteConfig.url}/blog/${post.slug}`;
            const pubDate = new Date(post.publishedAt).toUTCString();

            return `
        <item>
            <title><![CDATA[${post.title}]]></title>
            <description><![CDATA[${post.excerpt}]]></description>
            <content:encoded><![CDATA[${post.content}]]></content:encoded>
            <link>${postUrl}</link>
            <guid isPermaLink="true">${postUrl}</guid>
            <pubDate>${pubDate}</pubDate>
            <author>${siteConfig.creator.email} (${post.author.name})</author>
            ${post.tags.map(tag => `<category><![CDATA[${tag}]]></category>`).join('\n            ')}
        </item>`;
        }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title><![CDATA[${siteConfig.name} Blog]]></title>
        <description><![CDATA[${siteConfig.description}]]></description>
        <link>${siteConfig.url}/blog</link>
        <language>en-US</language>
        <managingEditor>${siteConfig.creator.email} (${siteConfig.creator.name})</managingEditor>
        <webMaster>${siteConfig.creator.email} (${siteConfig.creator.name})</webMaster>
        <lastBuildDate>${buildDate}</lastBuildDate>
        <pubDate>${buildDate}</pubDate>
        <generator>WiseJNRS Website</generator>
        <ttl>60</ttl>
        <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
        <image>
            <url>${siteConfig.ogImage}</url>
            <title><![CDATA[${siteConfig.name} Blog]]></title>
            <link>${siteConfig.url}/blog</link>
        </image>${rssItems}
    </channel>
</rss>`;
}

// Function to create/update a blog post
export function createOrUpdatePost(slug: string, postData: Partial<BlogPost>, content: string): void {
    try {
        ensureContentDirectory();
        const fullPath = path.join(contentDirectory, `${slug}.md`);

        const frontMatter = {
            title: postData.title || '',
            excerpt: postData.excerpt || '',
            publishedAt: postData.publishedAt || new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
            tags: postData.tags || [],
            author: postData.author || {
                name: 'WiseJNRS',
                avatar: '/apple-touch-icon.png',
                bio: 'Music producer, audio engineer, and technology enthusiast.'
            },
            coverImage: postData.coverImage,
            featured: postData.featured || false,
            category: postData.category || 'General',
            status: postData.status || 'published'
        };

        const fileContent = matter.stringify(content, frontMatter);
        fs.writeFileSync(fullPath, fileContent, 'utf8');
    } catch (error) {
        console.error(`Error creating/updating post ${slug}:`, error);
        throw error;
    }
}

// Function to delete a blog post
export function deletePost(slug: string): boolean {
    try {
        const fullPath = path.join(contentDirectory, `${slug}.md`);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error deleting post ${slug}:`, error);
        return false;
    }
}

// Function to get all post slugs for static generation
export function getAllPostSlugs(): string[] {
    try {
        ensureContentDirectory();
        const fileNames = fs.readdirSync(contentDirectory);
        return fileNames
            .filter(fileName => fileName.endsWith('.md'))
            .map(fileName => fileName.replace(/\.md$/, ''));
    } catch (error) {
        console.error('Error getting post slugs:', error);
        return [];
    }
}