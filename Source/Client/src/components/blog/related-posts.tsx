"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CoverImage } from '@/components/cover-image';
import { BlogPost } from '@/lib/blog';

interface RelatedPostsProps {
    currentPost: BlogPost;
    allPosts: BlogPost[];
    maxPosts?: number;
    showCategories?: boolean;
    showTags?: boolean;
}

// Calculate relatedness score between two posts
function calculateRelatedness(post1: BlogPost, post2: BlogPost): number {
    let score = 0;

    // Same category gets high score
    if (post1.category === post2.category) {
        score += 50;
    }

    // Common tags
    const commonTags = post1.tags.filter(tag => post2.tags.includes(tag));
    score += commonTags.length * 20;

    // Same author
    if (post1.author.name === post2.author.name) {
        score += 10;
    }

    // Recency bonus (newer posts get slight preference)
    const daysDiff = Math.abs(
        new Date(post1.publishedAt).getTime() - new Date(post2.publishedAt).getTime()
    ) / (1000 * 60 * 60 * 24);

    if (daysDiff < 30) score += 5;
    else if (daysDiff < 90) score += 2;

    return score;
}

export default function RelatedPosts({
    currentPost,
    allPosts,
    maxPosts = 3,
    showCategories = true,
    showTags = true
}: RelatedPostsProps) {
    // Find related posts
    const relatedPosts = allPosts
        .filter(post =>
            post.slug !== currentPost.slug &&
            post.status === 'published'
        )
        .map(post => ({
            post,
            score: calculateRelatedness(currentPost, post)
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxPosts)
        .map(({ post }) => post);

    // If no related posts, get recent posts from same category
    const fallbackPosts = relatedPosts.length === 0
        ? allPosts
            .filter(post =>
                post.slug !== currentPost.slug &&
                post.status === 'published' &&
                (post.category === currentPost.category ||
                 post.tags.some(tag => currentPost.tags.includes(tag)))
            )
            .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
            .slice(0, maxPosts)
        : [];

    const postsToShow = relatedPosts.length > 0 ? relatedPosts : fallbackPosts;

    if (postsToShow.length === 0) {
        return null;
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="mt-16 pt-12 border-t border-border/40">
            <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-[#D247BF] via-primary to-[#FF6B35] bg-clip-text text-transparent">
                        {relatedPosts.length > 0 ? 'Related Articles' : 'More from this Category'}
                    </span>
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {postsToShow.map((post, index) => (
                    <motion.div
                        key={post.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.15 }}
                    >
                        <Link href={`/blog/${post.slug}`}>
                            <Card className="h-full hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group bg-background/20 dark:bg-background/15 backdrop-blur-md border border-white/10 dark:border-white/5 hover:border-white/20 dark:hover:border-white/10 overflow-hidden">
                                <CardHeader className="p-0">
                                    <div className="relative h-48 overflow-hidden">
                                        <CoverImage
                                            src={post.coverImage || '/music/SocialsHeader-min.png'}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-[1.08] transition-transform duration-700 ease-out"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6">
                                    {/* Category and Tags */}
                                    <div className="flex items-center gap-2 mb-4">
                                        {showCategories && (
                                            <Badge className="bg-background/30 backdrop-blur-xl text-foreground/90 border-white/25 dark:border-slate-400/35 px-3 py-1 text-xs font-medium tracking-wide">
                                                {post.category}
                                            </Badge>
                                        )}
                                        {showTags && post.tags.some(t => t !== post.category) && (
                                            <Badge className="bg-background/20 backdrop-blur-xl text-foreground/80 border-white/20 dark:border-slate-400/30 px-2.5 py-1 text-xs font-medium tracking-wide">
                                                {post.tags.find(t => t !== post.category)}
                                            </Badge>
                                        )}
                                        {post.tags.length > 1 && (
                                            <span className="text-xs text-muted-foreground/60 font-medium">
                                                +{post.tags.length - 1}
                                            </span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h4 className="font-bold text-lg leading-[1.3] tracking-tight line-clamp-2 mb-3 group-hover:text-[#F97316] transition-colors duration-300">
                                        {post.title}
                                    </h4>

                                    {/* Excerpt */}
                                    <p className="text-sm text-muted-foreground/90 leading-[1.7] line-clamp-2 mb-4">
                                        {post.excerpt}
                                    </p>

                                    {/* Meta info */}
                                    <div className="flex items-center justify-between text-xs text-muted-foreground/70">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1.5">
                                                <CalendarDays className="h-3.5 w-3.5 opacity-70" />
                                                <span className="font-medium">{formatDate(post.publishedAt)}</span>
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5 opacity-70" />
                                                <span className="font-medium">{post.readingTime}m</span>
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5 opacity-70" />
                                            <span className="font-medium">{post.author.name}</span>
                                        </div>
                                    </div>

                                    {/* Read more indicator */}
                                    <div className="flex items-center justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-sm font-semibold flex items-center gap-1.5 bg-gradient-to-r from-[#D247BF] via-primary to-[#FF6B35] bg-clip-text text-transparent">
                                            Read Article
                                            <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Show relationship info if there are related posts */}
            {relatedPosts.length > 0 && (
                <div className="mt-4 text-center">
                    <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                        <TrendingUp className="h-3 w-3" />
                        Related by {currentPost.category && 'category'}
                        {currentPost.category && currentPost.tags.length > 0 && ' and '}
                        {currentPost.tags.length > 0 && 'shared tags'}
                    </div>
                </div>
            )}
        </div>
    );
}

// Hook for getting related posts data
export function useRelatedPosts(currentPost: BlogPost, allPosts: BlogPost[]) {
    const relatedPosts = React.useMemo(() => {
        return allPosts
            .filter(post =>
                post.slug !== currentPost.slug &&
                post.status === 'published'
            )
            .map(post => ({
                post,
                score: calculateRelatedness(currentPost, post)
            }))
            .filter(({ score }) => score > 0)
            .sort((a, b) => b.score - a.score);
    }, [currentPost, allPosts]);

    const relatedByCategory = React.useMemo(() => {
        return allPosts.filter(post =>
            post.slug !== currentPost.slug &&
            post.status === 'published' &&
            post.category === currentPost.category
        );
    }, [currentPost, allPosts]);

    const relatedByTags = React.useMemo(() => {
        return allPosts.filter(post =>
            post.slug !== currentPost.slug &&
            post.status === 'published' &&
            post.tags.some(tag => currentPost.tags.includes(tag))
        );
    }, [currentPost, allPosts]);

    return {
        relatedPosts: relatedPosts.map(r => r.post),
        relatedByCategory,
        relatedByTags,
        hasRelated: relatedPosts.length > 0
    };
}