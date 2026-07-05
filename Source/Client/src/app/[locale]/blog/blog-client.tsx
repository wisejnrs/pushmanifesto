"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { CalendarDays, Clock, Tag, User, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/blog";
import SearchComponent from "@/components/blog/search-component";
import { useSearch } from "@/hooks/use-search";
import { useRef } from "react";
import { useRouter } from "next/navigation";

interface BlogClientProps {
    initialPosts: BlogPost[];
    categories: string[];
    featuredPost: BlogPost | null;
    allTags: string[];
}

export default function BlogClient({ initialPosts, categories, featuredPost, allTags }: BlogClientProps) {
    const t = useTranslations("blog");

    const search = useSearch(initialPosts);
    const {
        searchResults,
        searchStats,
        addTagFilter,
        filters
    } = search;


    // Get posts to display (either search results or all posts)
    const displayPosts = searchStats.hasQuery || searchStats.hasFilters
        ? searchResults.map(result => result.item)
        : initialPosts;

    const regularPosts = displayPosts.filter(post => !post.featured);

    // Handle tag click
    const handleTagClick = (tag: string) => {
        // Only add tag if it's not already selected
        if (!filters.tags?.includes(tag)) {
            addTagFilter(tag);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        <span className="text-gradient-brand">Blog</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t("subtitle")}
                    </p>
                </motion.div>

                {/* Advanced Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mb-8 max-w-2xl mx-auto"
                >
                    <SearchComponent
                        posts={initialPosts}
                        placeholder={t("searchPlaceholder")}
                        showFilters={true}
                        maxResults={8}
                        autoFocus={true}
                        searchState={search}
                    />
                </motion.div>

                {/* Featured Post */}
                {featuredPost && !searchStats.hasQuery && !searchStats.hasFilters && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="mb-12"
                    >
                        <FeaturedPostCard post={featuredPost} onTagClick={handleTagClick} />
                    </motion.div>
                )}

                {/* Regular Posts Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {regularPosts.map((post, index) => (
                        <motion.div
                            key={post.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.5 }}
                        >
                            <PostCard post={post} onTagClick={handleTagClick} />
                        </motion.div>
                    ))}
                </motion.div>

                {displayPosts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                        role="status"
                        aria-live="polite"
                    >
                        <p className="text-muted-foreground text-lg">
                            {t("noResults")}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function FeaturedPostCard({ post, onTagClick }: { post: BlogPost; onTagClick: (tag: string) => void }) {
    const t = useTranslations("blog");
    return (
        <Card className="overflow-hidden shadow-2xl bg-background/20 dark:bg-background/15 backdrop-blur-md border border-white/10 dark:border-white/5 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-500">
            <div className="md:flex">
                <div className="md:w-1/2">
                    {post.coverImage && (
                        <div className="relative h-72 md:h-full bg-muted/20 overflow-hidden">
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover hover:scale-[1.02] transition-transform duration-700 ease-out"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    )}
                </div>
                <div className="md:w-1/2 p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                        <Badge className="bg-gradient-to-r from-[#e73c6f] to-[#eeaa52] text-white shadow-lg px-4 py-1.5 text-sm font-medium tracking-wide">FEATURED</Badge>
                        <Badge className="bg-background/30 backdrop-blur-xl text-foreground border-white/30 dark:border-slate-400/40 px-4 py-1.5 text-sm font-medium tracking-wide">{post.category}</Badge>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-[1.2] tracking-tight">
                        <Link href={`/blog/${post.slug}`} className="hover:opacity-90 transition-opacity">
                            <span className="bg-gradient-to-r from-[#eeaa52] via-[#e73c6f] to-[#2394d5] bg-clip-text text-transparent">
                                {post.title}
                            </span>
                        </Link>
                    </h2>
                    <p className="text-muted-foreground text-base mb-8 leading-[1.75] max-w-prose">
                        {post.excerpt}
                    </p>
                    <div className="flex items-center gap-6 mb-8 text-sm text-muted-foreground/80">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 opacity-70" />
                            <span className="font-medium">{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 opacity-70" />
                            <span className="font-medium">{t("minRead", { minutes: post.readingTime })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 opacity-70" />
                            <span className="font-medium">{post.author.name}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2.5 mb-8">
                        {post.tags.slice(0, 6).map(tag => (
                            <motion.div key={tag} whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05, y: -2 }}>
                                <Badge
                                    className="bg-background/25 backdrop-blur-xl text-foreground/90 border-white/20 dark:border-slate-400/30 hover:bg-background/35 dark:hover:bg-background/30 hover:border-white/30 cursor-pointer px-3 py-1.5 text-xs font-medium tracking-wide transition-all duration-200"
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => onTagClick(tag)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTagClick(tag); } }}
                                    aria-label={`Filter by tag: ${tag}`}
                                >
                                    {tag}
                                </Badge>
                            </motion.div>
                        ))}
                        {post.tags.length > 6 && (
                            <Badge className="bg-background/15 backdrop-blur-xl text-muted-foreground/70 border-white/15 cursor-default px-3 py-1.5 text-xs">
                                +{post.tags.length - 6}
                            </Badge>
                        )}
                    </div>
                    <motion.div whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }}>
                        <Button asChild variant="outline" className="h-11 px-6 font-semibold tracking-wide group/btn">
                            <Link href={`/blog/${post.slug}`}>{t("readArticle")}<motion.div
                                    whileHover={{ x: 3 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    className="inline-block"
                                >
                                    <ChevronRight className="h-5 w-5 ml-2" />
                                </motion.div>
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </Card>
    );
}

function PostCard({ post, onTagClick }: { post: BlogPost; onTagClick: (tag: string) => void }) {
    const t = useTranslations("blog");
    return (
        <Card className="h-full overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group flex flex-col focus-within:ring-2 focus-within:ring-[#e73c6f] focus-within:ring-offset-2 focus-within:ring-offset-background bg-background/20 dark:bg-background/15 backdrop-blur-md border border-white/10 dark:border-white/5 hover:border-white/20 dark:hover:border-white/10">
            {post.coverImage && (
                <div className="relative h-56 overflow-hidden bg-muted/20">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-[1.08] transition-transform duration-700 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
            )}
            <CardHeader className="pb-4 pt-6 px-6">
                <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-background/30 backdrop-blur-xl text-foreground/90 border-white/25 dark:border-slate-400/35 px-3 py-1 text-xs font-medium tracking-wide">
                        {post.category}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span className="font-medium">{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                </div>
                <h3 className="font-bold text-xl leading-[1.3] tracking-tight mb-3 group-hover:text-[#e73c6f] transition-colors duration-300">
                    <Link href={`/blog/${post.slug}`} className="hover:underline decoration-2 underline-offset-4 decoration-[#e73c6f]/50">
                        {post.title}
                    </Link>
                </h3>
            </CardHeader>
            <CardContent className="pt-0 px-6 pb-6 flex-grow flex flex-col">
                <p className="text-muted-foreground/90 text-sm mb-5 leading-[1.7] line-clamp-3 flex-grow">
                    {post.excerpt}
                </p>
                <div className="flex items-center gap-4 mb-5 text-xs text-muted-foreground/70">
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="font-medium">{t("minRead", { minutes: post.readingTime })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        <span className="font-medium">{post.author.name}</span>
                    </div>
                </div>
                {/* Tags at bottom of content area */}
                <div className="flex flex-wrap gap-2 mt-auto">
                    {post.tags.slice(0, 3).map(tag => (
                        <motion.div key={tag} whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05, y: -2 }}>
                            <Badge
                                className="bg-background/25 backdrop-blur-xl text-foreground/80 border-white/20 dark:border-slate-400/30 hover:bg-background/35 hover:border-[#e73c6f]/30 cursor-pointer px-2.5 py-1 text-xs font-medium tracking-wide transition-all duration-200"
                                role="button"
                                tabIndex={0}
                                onClick={() => onTagClick(tag)}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTagClick(tag); } }}
                                aria-label={`Filter by tag: ${tag}`}
                            >
                                {tag}
                            </Badge>
                        </motion.div>
                    ))}
                    {post.tags.length > 3 && (
                        <Badge className="bg-background/15 backdrop-blur-xl text-muted-foreground/60 border-white/15 cursor-default px-2.5 py-1 text-xs">
                            +{post.tags.length - 3}
                        </Badge>
                    )}
                </div>
            </CardContent>
            <CardFooter className="pt-0 px-6 pb-6">
                <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }} className="w-full">
                    <Button asChild variant="outline" className="w-full h-10 font-semibold tracking-wide group/btn">
                        <Link href={`/blog/${post.slug}`}>{t("readArticle")}<motion.div
                                whileHover={{ x: 3 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                className="inline-block"
                            >
                                <ChevronRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                            </motion.div>
                        </Link>
                    </Button>
                </motion.div>
            </CardFooter>
        </Card>
    );
}