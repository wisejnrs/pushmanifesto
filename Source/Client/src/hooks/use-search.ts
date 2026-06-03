"use client";

import { useState, useEffect, useMemo } from 'react';
import Fuse, { FuseResult, FuseResultMatch } from 'fuse.js';
import { BlogPost } from '@/lib/blog';

export interface SearchFilters {
    category?: string;
    tags?: string[];
    dateRange?: {
        start?: string;
        end?: string;
    };
}

export interface SearchResult {
    item: BlogPost;
    score?: number;
    matches?: readonly FuseResultMatch[];
}

export interface UseSearchOptions {
    threshold?: number;
    includeScore?: boolean;
    includeMatches?: boolean;
    minMatchCharLength?: number;
}

const defaultFuseOptions = {
    keys: [
        { name: 'title', weight: 3 },
        { name: 'excerpt', weight: 2 },
        { name: 'content', weight: 1 },
        { name: 'tags', weight: 2 },
        { name: 'category', weight: 1.5 },
        { name: 'author.name', weight: 0.5 }
    ],
    threshold: 0.3,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
    shouldSort: true,
    ignoreLocation: true,
    findAllMatches: true
};

export function useSearch(posts: BlogPost[], options?: UseSearchOptions) {
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState<SearchFilters>({});
    const [isSearching, setIsSearching] = useState(false);

    // Create Fuse instance
    const fuse = useMemo(() => {
        const fuseOptions = { ...defaultFuseOptions, ...options };
        return new Fuse(posts, fuseOptions);
    }, [posts, options]);

    // Filter posts based on filters
    const filteredPosts = useMemo(() => {
        let filtered = posts;

        // Filter by category
        if (filters.category) {
            filtered = filtered.filter(post =>
                post.category.toLowerCase() === filters.category?.toLowerCase()
            );
        }

        // Filter by tags
        if (filters.tags && filters.tags.length > 0) {
            filtered = filtered.filter(post =>
                filters.tags?.some(tag =>
                    post.tags.some(postTag =>
                        postTag.toLowerCase().includes(tag.toLowerCase())
                    )
                )
            );
        }

        // Filter by date range
        if (filters.dateRange) {
            filtered = filtered.filter(post => {
                const postDate = new Date(post.publishedAt);
                const startDate = filters.dateRange?.start ? new Date(filters.dateRange.start) : null;
                const endDate = filters.dateRange?.end ? new Date(filters.dateRange.end) : null;

                if (startDate && postDate < startDate) return false;
                if (endDate && postDate > endDate) return false;
                return true;
            });
        }

        return filtered;
    }, [posts, filters]);

    // Search results
    const searchResults = useMemo(() => {
        setIsSearching(true);

        let results: SearchResult[] = [];

        if (query.trim()) {
            // Create a new Fuse instance with filtered posts for search
            const searchFuse = new Fuse(filteredPosts, { ...defaultFuseOptions, ...options });
            const fuseResults = searchFuse.search(query);

            results = fuseResults.map((result: FuseResult<BlogPost>) => ({
                item: result.item,
                score: result.score,
                matches: result.matches
            }));
        } else {
            // No query, return filtered posts
            results = filteredPosts.map(post => ({ item: post }));
        }

        setIsSearching(false);
        return results;
    }, [query, filteredPosts, options]);

    // Get unique categories and tags for filter options
    const availableCategories = useMemo(() => {
        const categories = [...new Set(posts.map(post => post.category))];
        return categories.sort();
    }, [posts]);

    const availableTags = useMemo(() => {
        const tags = [...new Set(posts.flatMap(post => post.tags))];
        return tags.sort();
    }, [posts]);

    // Search statistics
    const searchStats = useMemo(() => {
        return {
            totalPosts: posts.length,
            filteredPosts: filteredPosts.length,
            searchResults: searchResults.length,
            hasQuery: query.trim().length > 0,
            hasFilters: Object.keys(filters).some(key => {
                const value = filters[key as keyof SearchFilters];
                if (Array.isArray(value)) return value.length > 0;
                if (typeof value === 'object' && value) return Object.keys(value).length > 0;
                return Boolean(value);
            })
        };
    }, [posts.length, filteredPosts.length, searchResults.length, query, filters]);

    // Helper functions
    const clearSearch = () => {
        setQuery('');
        setFilters({});
    };

    const addTagFilter = (tag: string) => {
        setFilters(prev => ({
            ...prev,
            tags: prev.tags ? [...prev.tags, tag] : [tag]
        }));
    };

    const removeTagFilter = (tag: string) => {
        setFilters(prev => ({
            ...prev,
            tags: prev.tags?.filter(t => t !== tag)
        }));
    };

    const setCategoryFilter = (category: string | undefined) => {
        setFilters(prev => ({
            ...prev,
            category
        }));
    };

    const setDateRangeFilter = (dateRange: SearchFilters['dateRange']) => {
        setFilters(prev => ({
            ...prev,
            dateRange
        }));
    };

    return {
        // Search state
        query,
        setQuery,
        filters,
        setFilters,
        isSearching,

        // Results
        searchResults,
        searchStats,

        // Available options
        availableCategories,
        availableTags,

        // Helper functions
        clearSearch,
        addTagFilter,
        removeTagFilter,
        setCategoryFilter,
        setDateRangeFilter
    };
}

// Hook for highlighting search matches
export function useSearchHighlight() {
    const highlightMatches = (text: string, matches?: readonly FuseResultMatch[]): string => {
        if (!matches || matches.length === 0) return text;

        let highlightedText = text;
        const sortedMatches = matches
            .filter(match => match.value && match.indices)
            .sort((a, b) => (b.indices?.[0]?.[0] || 0) - (a.indices?.[0]?.[0] || 0));

        for (const match of sortedMatches) {
            if (match.indices && match.value) {
                for (const [start, end] of match.indices) {
                    const before = match.value.substring(0, start);
                    const highlighted = match.value.substring(start, end + 1);
                    const after = match.value.substring(end + 1);

                    highlightedText = highlightedText.replace(
                        match.value,
                        `${before}<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${highlighted}</mark>${after}`
                    );
                }
            }
        }

        return highlightedText;
    };

    return { highlightMatches };
}