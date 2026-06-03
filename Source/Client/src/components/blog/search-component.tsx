"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, Calendar, Tag, Hash, Clock, User, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/blog';
import { useSearch, useSearchHighlight, SearchResult } from '@/hooks/use-search';

type SearchState = ReturnType<typeof useSearch>;

interface SearchComponentProps {
    posts: BlogPost[];
    onResultSelect?: (post: BlogPost) => void;
    placeholder?: string;
    showFilters?: boolean;
    maxResults?: number;
    compact?: boolean;
    autoFocus?: boolean;
    searchState?: SearchState;
}

export default function SearchComponent({
    posts,
    onResultSelect,
    placeholder = "Search articles...",
    showFilters = true,
    maxResults = 5,
    compact = false,
    autoFocus = false,
    searchState
}: SearchComponentProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const internalSearch = useSearch(posts);
    const {
        query,
        setQuery,
        filters,
        searchResults,
        searchStats,
        availableCategories,
        availableTags,
        clearSearch,
        addTagFilter,
        removeTagFilter,
        setCategoryFilter,
        setDateRangeFilter
    } = searchState || internalSearch;

    const { highlightMatches } = useSearchHighlight();

    // Close search when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setShowAdvancedFilters(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close search on escape
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                setShowAdvancedFilters(false);
                setQuery('');
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [setQuery]);

    const handleResultClick = (post: BlogPost) => {
        setIsOpen(false);
        setQuery('');
        onResultSelect?.(post);
    };

    const displayResults = searchResults.slice(0, maxResults);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div ref={searchRef} className={`relative ${compact ? 'w-64' : 'w-full max-w-2xl'}`}>
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    autoFocus={autoFocus}
                    className="pl-10 pr-12"
                />

                {/* Clear/Filter buttons */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    {(query || searchStats.hasFilters) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                clearSearch();
                                setIsOpen(false);
                            }}
                            className="h-6 w-6 p-0"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}

                    {showFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className={`h-6 w-6 p-0 ${searchStats.hasFilters ? 'text-primary' : ''}`}
                        >
                            <Filter className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Active Filters Display */}
            {searchStats.hasFilters && (
                <div className="flex flex-wrap gap-1 mt-2">
                    {filters.category && (
                        <Badge variant="secondary" className="text-xs">
                            <Hash className="h-3 w-3 mr-1" />
                            {filters.category}
                            <X
                                className="h-3 w-3 ml-1 cursor-pointer"
                                onClick={() => setCategoryFilter(undefined)}
                            />
                        </Badge>
                    )}
                    {filters.tags?.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                            <X
                                className="h-3 w-3 ml-1 cursor-pointer"
                                onClick={() => removeTagFilter(tag)}
                            />
                        </Badge>
                    ))}
                </div>
            )}

            {/* Search Results Dropdown */}
            <AnimatePresence>
                {isOpen && (query || searchStats.hasFilters) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
                    >
                        {/* Search Statistics */}
                        <div className="p-3 border-b bg-muted/5">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>
                                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                                    {searchStats.hasQuery && ` for "${query}"`}
                                </span>
                                <span className="flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    {searchStats.filteredPosts} of {searchStats.totalPosts} posts
                                </span>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="max-h-80 overflow-y-auto">
                            {displayResults.length > 0 ? (
                                displayResults.map((result: SearchResult, index) => (
                                    <motion.div
                                        key={result.item.slug}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                    >
                                        <Link
                                            href={`/blog/${result.item.slug}`}
                                            onClick={() => handleResultClick(result.item)}
                                            className="block p-3 hover:bg-muted/50 transition-colors border-b last:border-b-0"
                                        >
                                            <div className="flex gap-3">
                                                {/* Thumbnail */}
                                                <div className="flex-shrink-0">
                                                    <Image
                                                        src={result.item.coverImage || '/music/SocialsHeader-min.png'}
                                                        alt={result.item.title}
                                                        width={60}
                                                        height={40}
                                                        className="rounded object-cover"
                                                    />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-grow min-w-0">
                                                    <h4
                                                        className="font-semibold text-sm mb-1 line-clamp-1"
                                                        dangerouslySetInnerHTML={{
                                                            __html: highlightMatches(
                                                                result.item.title,
                                                                result.matches?.filter(m => m.key === 'title')
                                                            )
                                                        }}
                                                    />
                                                    <p
                                                        className="text-xs text-muted-foreground line-clamp-2 mb-2"
                                                        dangerouslySetInnerHTML={{
                                                            __html: highlightMatches(
                                                                result.item.excerpt,
                                                                result.matches?.filter(m => m.key === 'excerpt')
                                                            )
                                                        }}
                                                    />

                                                    {/* Meta info */}
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {formatDate(result.item.publishedAt)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {result.item.readingTime}m
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <User className="h-3 w-3" />
                                                            {result.item.author.name}
                                                        </span>
                                                        {result.score && (
                                                            <span className="ml-auto text-primary">
                                                                {Math.round((1 - result.score) * 100)}% match
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Tags */}
                                                    {result.item.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {result.item.tags.slice(0, 3).map(tag => (
                                                                <Badge key={tag} variant="outline" className="text-xs">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                            {result.item.tags.length > 3 && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    +{result.item.tags.length - 3} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-muted-foreground">
                                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No articles found</p>
                                    {query && (
                                        <p className="text-xs mt-1">
                                            Try adjusting your search terms or filters
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* View All Results */}
                        {searchResults.length > maxResults && (
                            <div className="p-3 border-t bg-muted/5">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => setIsOpen(false)}
                                >
                                    View all {searchResults.length} results
                                </Button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
                {showAdvancedFilters && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-40 p-4"
                    >
                        <h4 className="font-semibold text-sm mb-3">Advanced Filters</h4>

                        {/* Categories */}
                        <div className="mb-4">
                            <label className="text-xs font-medium text-muted-foreground mb-2 block">
                                Category
                            </label>
                            <div className="flex flex-wrap gap-1">
                                <Button
                                    variant={!filters.category ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCategoryFilter(undefined)}
                                    className="text-xs h-6"
                                >
                                    All
                                </Button>
                                {availableCategories.map(category => (
                                    <Button
                                        key={category}
                                        variant={filters.category === category ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCategoryFilter(category)}
                                        className="text-xs h-6"
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mb-4">
                            <label className="text-xs font-medium text-muted-foreground mb-2 block">
                                Tags ({availableTags.length})
                            </label>
                            <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto scrollbar-thin">
                                {availableTags.map(tag => (
                                    <Button
                                        key={tag}
                                        variant={filters.tags?.includes(tag) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => {
                                            if (filters.tags?.includes(tag)) {
                                                removeTagFilter(tag);
                                            } else {
                                                addTagFilter(tag);
                                            }
                                        }}
                                        className="text-xs h-6"
                                    >
                                        {tag}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Separator className="my-3" />

                        <div className="flex justify-between items-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearSearch}
                                className="text-xs"
                            >
                                Clear all filters
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowAdvancedFilters(false)}
                                className="text-xs"
                            >
                                Apply filters
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}