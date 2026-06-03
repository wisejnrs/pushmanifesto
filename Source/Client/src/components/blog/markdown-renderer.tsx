"use client";

import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// @ts-ignore - remark-toc doesn't have types
import remarkToc from 'remark-toc';
import remarkEmoji from 'remark-emoji';
import remarkMath from 'remark-math';
import remarkGithubBlockquoteAlert from 'remark-github-blockquote-alert';
import remarkCustomAlerts from '@/lib/remark-custom-alerts';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Copy, Check, Play, Pause, Volume2, ExternalLink, Maximize, Info, Lightbulb, AlertTriangle, AlertCircle, Zap, Download, Music, BookOpen, Code2 } from 'lucide-react';
import Image from 'next/image';
import MermaidDiagram from './mermaid-diagram';
import 'katex/dist/katex.min.css';
import { usePlayback } from '@/app/music/playback-context';
import { Song } from '@/lib/types';

interface MarkdownRendererProps {
    content: string;
}

// GitHub Gist Embed Component
function GistEmbed({ user, gistId }: { user: string; gistId: string }) {
    React.useEffect(() => {
        const scriptId = `gist-${gistId}`;
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = `https://gist.github.com/${user}/${gistId}.js`;
            script.async = true;
            const container = document.getElementById(`gist-container-${gistId}`);
            if (container) {
                container.appendChild(script);
            }
        }
    }, [gistId, user]);

    return (
        <div className="my-6">
            <div id={`gist-container-${gistId}`} className="rounded-lg overflow-hidden border shadow-lg p-4 bg-card">
                <noscript>
                    <a href={`https://gist.github.com/${user}/${gistId}`} target="_blank" rel="noopener noreferrer">
                        View this gist on GitHub
                    </a>
                </noscript>
            </div>
        </div>
    );
}

// Blog Audio Player Component - uses site-wide playback context and matches /music player styling
const BlogAudioPlayer = React.memo(({ src, size = 'medium', title = 'Podcast' }: {
    src: string;
    size?: 'small' | 'medium' | 'large';
    title?: string;
}) => {
    const { playTrack, currentTrack, isPlaying, togglePlayPause, currentTime, duration, audioRef } = usePlayback();

    // Size configurations
    const sizeConfig = {
        small: { maxWidth: 'max-w-md' },
        medium: { maxWidth: 'max-w-2xl' },
        large: { maxWidth: 'max-w-4xl' }
    };
    const config = sizeConfig[size];

    // Create a Song object for this audio
    const blogAudio: Song = React.useMemo(() => ({
        id: Date.now(), // Use timestamp as unique ID
        title: title,
        artist: 'Wise Jnrs',
        album: 'Blog Audio',
        track: 1,
        disc: 1,
        year: new Date().getFullYear(),
        url: src,
        duration: 0, // Will be set when audio loads
    }), [src, title]);

    const handlePlayPause = async () => {
        // If this audio is already playing, toggle pause
        if (currentTrack?.url === src) {
            togglePlayPause();
        } else {
            // Otherwise, play this audio (will hand off to global player)
            await playTrack(blogAudio);
        }
    };

    const handleSeek = (value: number[]) => {
        const audio = audioRef.current;
        if (!audio || value[0] === undefined) return;

        const time = (value[0] / 100) * duration;
        audio.currentTime = time;
    };

    // Check if this audio is currently playing
    const isThisTrackPlaying = currentTrack?.url === src;
    const isCurrentlyPlaying = isThisTrackPlaying && isPlaying;
    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="my-6 flex justify-center">
            <div className={`bg-background/30 dark:bg-background/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-lg p-3 sm:p-4 w-full ${config.maxWidth}`}>
                {/* Enhanced glassmorphic background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none rounded-lg" />

                <div className="relative flex items-center justify-between gap-3">
                    {/* Left: Track Info */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-white/[0.12] to-white/[0.04] flex items-center justify-center backdrop-blur-sm">
                            <Music className="h-5 w-5 text-muted-foreground/60" />
                            {isCurrentlyPlaying && (
                                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/30 to-transparent animate-pulse" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="font-semibold text-xs sm:text-sm truncate text-foreground mb-0.5">
                                {title}
                            </div>
                            <div className="text-xs text-muted-foreground/70 truncate">
                                Wise Jnrs
                            </div>
                        </div>
                    </div>

                    {/* Center: Player Controls */}
                    <div className="flex items-center gap-1">
                        <Button
                            size="icon"
                            onClick={handlePlayPause}
                            className={`h-9 w-9 rounded-full shadow-lg mx-1 backdrop-blur-md bg-white/[0.15] border border-white/[0.2] hover:bg-white/[0.25] hover:border-white/[0.3] text-foreground relative overflow-visible ${
                                isCurrentlyPlaying ? 'animate-pulse' : ''
                            }`}
                            aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
                        >
                            {isCurrentlyPlaying && (
                                <>
                                    <div className="absolute inset-0 rounded-full bg-primary/15 animate-ping scale-125" aria-hidden="true"></div>
                                    <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse scale-110" aria-hidden="true"></div>
                                </>
                            )}
                            {isCurrentlyPlaying ? (
                                <Pause className="h-4 w-4 relative z-10" />
                            ) : (
                                <Play className="h-4 w-4 ml-0.5 relative z-10" />
                            )}
                        </Button>
                    </div>

                    {/* Right: Progress Bar */}
                    {isThisTrackPlaying && (
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className="flex-1 min-w-0">
                                <Slider
                                    value={[progressPercentage]}
                                    onValueChange={handleSeek}
                                    className="w-full cursor-pointer"
                                    disabled={!duration}
                                    aria-label="Track progress"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

BlogAudioPlayer.displayName = 'BlogAudioPlayer';

// Blog Video Player Component - memoized to prevent flickering on scroll
const BlogVideoPlayer = React.memo(({ src, width, height }: {
    src: string;
    width?: number;
    height?: number;
}) => {
    const containerStyle = width && height
        ? { width: `${width}px`, height: `${height}px`, maxWidth: '100%' }
        : {};

    return (
        <div className="my-6 flex justify-center">
            <div
                className="rounded-lg overflow-hidden border shadow-2xl"
                style={width && height ? containerStyle : { width: '100%', maxWidth: '800px' }}
            >
                <video
                    key={src}
                    src={src}
                    controls
                    className="w-full h-auto m-0"
                    preload="metadata"
                    playsInline
                    style={{ display: 'block', margin: 0 }}
                >
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison to prevent re-renders
    return prevProps.src === nextProps.src &&
           prevProps.width === nextProps.width &&
           prevProps.height === nextProps.height;
});

BlogVideoPlayer.displayName = 'BlogVideoPlayer';

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
    // Pre-process content to handle custom components
    const processedContent = React.useMemo(() => {
        let processed = content;

        // Convert custom syntax to HTML/JSX that ReactMarkdown can handle

        // Video container (Microsoft Docs style) with optional sizing
        processed = processed.replace(
            /::: video(?:\s*=(\d+)x(\d+))?\s*\n([\s\S]*?)\n:::/g,
            (match, width, height, content) => {
                if (width && height) {
                    return `<div class="video-container" data-width="${width}" data-height="${height}">${content}</div>`;
                }
                return `<div class="video-container">${content}</div>`;
            }
        );

        // Mermaid diagrams (Microsoft Docs style)
        processed = processed.replace(
            /::: mermaid\s*\n([\s\S]*?)\n:::/g,
            (match, diagramCode) => {
                return `<div class="mermaid-container">\`\`\`mermaid\n${diagramCode.trim()}\n\`\`\`</div>`;
            }
        );

        // Table of Contents
        processed = processed.replace(/\[\[_TOC_\]\]/g, '<div class="toc-marker"></div>');

        // Collapsible sections are already supported via HTML

        // Tabs component
        processed = processed.replace(
            /`tabs:start`([\s\S]*?)`tabs:end`/g,
            (match, tabContent) => {
                const tabs = tabContent.match(/`tab:([^`]+)`([^`]*?)(?=`tab:|$)/g) || [];
                const tabItems = tabs.map((tab: string, index: number) => {
                    const [, title, content] = tab.match(/`tab:([^`]+)`([\s\S]*?)$/) || [];
                    return `
                        <div class="tab-item" data-tab="${index}" ${index === 0 ? 'data-active="true"' : ''}>
                            <div class="tab-title">${title?.trim()}</div>
                            <div class="tab-content">${content?.trim()}</div>
                        </div>
                    `;
                }).join('');

                return `<div class="tabs-container">${tabItems}</div>`;
            }
        );

        // Collapsible sections
        processed = processed.replace(
            /`collapse:([^`]+)`([\s\S]*?)`collapse:end`/g,
            '<div class="collapsible-section" data-title="$1"><div class="collapsible-content">$2</div></div>'
        );

        // Gallery
        processed = processed.replace(
            /`gallery:start`([\s\S]*?)`gallery:end`/g,
            '<div class="image-gallery">$1</div>'
        );

        // Picture embeds with enhanced options
        processed = processed.replace(
            /`picture:src="([^"]+)"(?:\s+alt="([^"]*)")?(?:\s+caption="([^"]*)")?(?:\s+size="([^"]*)")?(?:\s+position="([^"]*)")?`/g,
            '<div class="picture-embed" data-src="$1" data-alt="$2" data-caption="$3" data-size="$4" data-position="$5"></div>'
        );

        // Simple picture grid
        processed = processed.replace(
            /`picture-grid:start`([\s\S]*?)`picture-grid:end`/g,
            '<div class="picture-grid">$1</div>'
        );

        // Charts and visualizations
        processed = processed.replace(/`chart:spectrum`/g, '<div class="chart-spectrum"></div>');
        processed = processed.replace(/`waveform:([^`]+)`/g, '<div class="waveform" data-file="$1"></div>');

        // Note: Mermaid diagrams are now handled directly in the ReactMarkdown code component

        // Media embeds
        processed = processed.replace(/`youtube:([^`]+)`/g, '<div class="youtube-embed" data-id="$1"></div>');
        processed = processed.replace(/`vimeo:([^`]+)`/g, '<div class="vimeo-embed" data-id="$1"></div>');
        processed = processed.replace(/`soundcloud:([^`]+)`/g, '<div class="soundcloud-embed" data-id="$1"></div>');
        processed = processed.replace(/`spotify:([^`]+)`/g, '<div class="spotify-embed" data-id="$1"></div>');

        // PDF embeds with height option
        processed = processed.replace(
            /`pdf:src="([^"]+)"(?:\s+title="([^"]*)")?(?:\s+height="([^"]*)")?`/g,
            '<div class="pdf-embed" data-src="$1" data-title="$2" data-height="$3"></div>'
        );

        // Audio player
        processed = processed.replace(
            /`audio:src="([^"]+)"(?:\s+title="([^"]*)")?(?:\s+artist="([^"]*)")?`/g,
            '<div class="audio-player" data-src="$1" data-title="$2" data-artist="$3"></div>'
        );

        // Table styling options - much simpler approach
        // Replace table:style lines with HTML comments that contain the style info
        processed = processed.replace(
            /^table:((?:no-border|minimal|elevated|framed|striped|sticky)(?:\s+(?:no-border|minimal|elevated|framed|striped|sticky))*)\s*$/gm,
            '<!-- TABLE_STYLE:$1 -->'
        );

        // Social media embeds
        processed = processed.replace(/`twitter:([^`]+)`/g, '<div class="twitter-embed" data-id="$1"></div>');
        processed = processed.replace(/`instagram:([^`]+)`/g, '<div class="instagram-embed" data-id="$1"></div>');
        processed = processed.replace(/`linkedin:([^`]+)`/g, '<div class="linkedin-embed" data-id="$1"></div>');

        // Call-to-action buttons
        processed = processed.replace(
            /`cta:(primary|secondary) "([^"]+)" "([^"]+)"`/g,
            '<div class="cta-button" data-type="$1" data-text="$2" data-url="$3"></div>'
        );

        return processed;
    }, [content]);

    const components = {
        // Headers with custom styling
        h1: ({ children, ...props }: any) => (
            <h1
                className="text-3xl font-bold mt-6 mb-3 border-b border-muted/30 pb-2 [&_.anchor-link]:no-underline [&_.anchor-link:hover]:no-underline hover:[&_.anchor-link-icon]:opacity-100"
                style={{
                    background: 'linear-gradient(to right, #D247BF, hsl(var(--primary)), #FF6B35)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textFillColor: 'transparent',
                    filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))'
                }}
                {...props}
            >
                {children}
            </h1>
        ),
        h2: ({ children, ...props }: any) => (
            <h2 className="text-2xl font-semibold mt-6 mb-2.5 text-foreground relative pl-4 [&_.anchor-link]:no-underline [&_.anchor-link:hover]:no-underline hover:[&_.anchor-link-icon]:opacity-100" {...props}>
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#D247BF] to-[#FF6B35] rounded-full"></span>
                {children}
            </h2>
        ),
        h3: ({ children, ...props }: any) => (
            <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground [&_.anchor-link]:no-underline [&_.anchor-link:hover]:no-underline hover:[&_.anchor-link-icon]:opacity-100" {...props}>
                {children}
            </h3>
        ),
        h4: ({ children, ...props }: any) => (
            <h4 className="text-base font-semibold mt-3 mb-1.5 text-foreground [&_.anchor-link]:no-underline [&_.anchor-link:hover]:no-underline hover:[&_.anchor-link-icon]:opacity-100" {...props}>
                {children}
            </h4>
        ),
        h5: ({ children, ...props }: any) => (
            <h5 className="text-base font-medium mt-3 mb-1.5 text-foreground [&_.anchor-link]:no-underline [&_.anchor-link:hover]:no-underline hover:[&_.anchor-link-icon]:opacity-100" {...props}>
                {children}
            </h5>
        ),
        h6: ({ children, ...props }: any) => (
            <h6 className="text-sm font-medium mt-3 mb-1.5 text-muted-foreground [&_.anchor-link]:no-underline [&_.anchor-link:hover]:no-underline hover:[&_.anchor-link-icon]:opacity-100" {...props}>
                {children}
            </h6>
        ),

        // Links with proper light/dark mode styling
        a: ({ children, href, ...props }: any) => {
            // Decode URL first
            const decodedHref = href ? decodeURIComponent(href) : '';

            // Parse custom dimensions from href (e.g., youtube.com/watch?v=ID =800x450)
            let customWidth: number | undefined;
            let customHeight: number | undefined;
            let cleanHref = decodedHref;

            const dimensionMatch = decodedHref.match(/\s=(\d+)x(\d+)$/);
            if (!dimensionMatch) {
                const urlEncodedMatch = decodedHref.match(/%20=(\d+)x(\d+)$/);
                if (urlEncodedMatch && urlEncodedMatch[1] && urlEncodedMatch[2]) {
                    customWidth = parseInt(urlEncodedMatch[1], 10);
                    customHeight = parseInt(urlEncodedMatch[2], 10);
                    cleanHref = decodedHref.replace(/%20=\d+x\d+$/, '');
                }
            } else if (dimensionMatch[1] && dimensionMatch[2]) {
                customWidth = parseInt(dimensionMatch[1], 10);
                customHeight = parseInt(dimensionMatch[2], 10);
                cleanHref = decodedHref.replace(/\s=\d+x\d+$/, '');
            }

            // Check if this is a YouTube link
            const youtubeMatch = cleanHref.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);

            // If it's a YouTube link, render as embed
            if (youtubeMatch && youtubeMatch[1]) {
                const childArray = React.Children.toArray(children);
                const hasImageChild = childArray.some((child: any) => child?.type === 'img');
                const isPlainLink = typeof children === 'string' && children === cleanHref;

                // Render embed if it has thumbnail image OR if it's a plain link
                if (hasImageChild || isPlainLink) {
                    return <YouTubeEmbed id={youtubeMatch[1]} width={customWidth} height={customHeight} />;
                }
            }

            return (
                <a
                    href={cleanHref}
                    className="text-primary hover:text-primary/80 underline underline-offset-2 decoration-primary/50 hover:decoration-primary transition-colors font-medium"
                    target={cleanHref?.startsWith('http') ? '_blank' : undefined}
                    rel={cleanHref?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    {...props}
                >
                    {children}
                </a>
            );
        },

        // Paragraphs
        p: ({ children, ...props }: any) => {
            // Check if this is a callout block (starts with **Text**)
            const text = children?.toString() || '';
            if (text.startsWith('**') && text.includes('**:')) {
                return (
                    <div className="bg-muted/30 border-l-4 border-primary p-3 rounded-r-lg my-3">
                        <div className="font-semibold text-foreground" {...props}>
                            {children}
                        </div>
                    </div>
                );
            }

            // Check if this paragraph contains image elements
            const childArray = React.Children.toArray(children);

            // More robust image detection
            const containsImages = childArray.some((child: any) => {
                return child?.type === 'img' ||
                       child?.props?.src ||
                       child?.props?.alt ||
                       (child?.props?.children && typeof child.props.children === 'object' && child.props.children?.type === 'img');
            });

            // Check if this paragraph contains only images and whitespace
            const hasOnlyImages = containsImages && childArray.every((child: any) => {
                // Check if it's an image element, whitespace, or newline
                return child?.type === 'img' ||
                       child?.props?.src ||
                       child?.props?.alt ||
                       (typeof child === 'string' && (child.trim() === '' || child === '\n')) ||
                       (child?.props?.children && typeof child.props.children === 'object' && child.props.children?.type === 'img');
            });

            // Check for special image modifiers
            const hasFullWidthImage = childArray.some((child: any) => {
                return child?.props?.alt?.includes('[full-width]');
            });

            const hasNoSpacingImage = childArray.some((child: any) => {
                return child?.props?.alt?.includes('[no-spacing]');
            });

            // If paragraph contains only images, render as div to avoid nesting issues
            if (hasOnlyImages || hasFullWidthImage || hasNoSpacingImage) {
                return (
                    <div className={hasFullWidthImage ? "full-width-wrapper" : hasNoSpacingImage ? "my-0" : "my-3"} {...props}>
                        {children}
                    </div>
                );
            }

            return (
                <p className="text-muted-foreground leading-relaxed mb-0.5 mt-0" {...props}>
                    {children}
                </p>
            );
        },

        // Lists
        ul: ({ children, ...props }: any) => (
            <ul className="list-disc list-inside ml-6 text-foreground mb-2 space-y-0" {...props}>
                {children}
            </ul>
        ),
        ol: ({ children, ...props }: any) => (
            <ol className="list-decimal list-inside ml-6 text-foreground mb-2 space-y-0" {...props}>
                {children}
            </ol>
        ),
        li: ({ children, ...props }: any) => {
            // Check if this is a task list item
            const childArray = React.Children.toArray(children);
            const firstChild = childArray[0] as any;

            if (firstChild?.type === 'input' && firstChild?.props?.type === 'checkbox') {
                const isChecked = firstChild.props.checked || false;
                return (
                    <li className="leading-relaxed mb-0 flex items-start gap-2 list-none -ml-6" {...props}>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={firstChild.props.disabled || false}
                            className="mt-1 task-list-checkbox"
                            readOnly
                        />
                        <span className={`flex-1 ${isChecked ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                            {childArray.slice(1)}
                        </span>
                    </li>
                );
            }

            return (
                <li className="leading-relaxed mb-0 text-foreground" {...props}>
                    {children}
                </li>
            );
        },

        // Code blocks
        pre: ({ children, ...props }: any) => {
            const codeElement = React.Children.toArray(children)[0] as any;

            // Extract code content more carefully
            let code = '';
            let language = 'text';

            if (codeElement?.props?.children) {
                const codeContent = codeElement.props.children;
                if (Array.isArray(codeContent)) {
                    code = codeContent.map(item =>
                        typeof item === 'string' ? item : item?.toString?.() || ''
                    ).join('');
                } else if (typeof codeContent === 'string') {
                    code = codeContent;
                } else {
                    code = codeContent?.toString?.() || '';
                }
            }

            // Extract language from className
            const className = codeElement?.props?.className || '';
            if (className.includes('language-')) {
                language = className.replace(/.*language-([^\s]+).*/, '$1');
            }

            // Handle Mermaid diagrams
            if (language === 'mermaid') {
                // Parse optional dimensions from first line
                const lines = code.trim().split('\n');
                const firstLine = lines[0]?.trim();
                const dimensionMatch = firstLine?.match(/^=(\d+)x(\d+)$/);

                let customWidth, customHeight, mermaidCode;
                if (dimensionMatch && dimensionMatch[1] && dimensionMatch[2]) {
                    customWidth = parseInt(dimensionMatch[1], 10);
                    customHeight = parseInt(dimensionMatch[2], 10);
                    mermaidCode = lines.slice(1).join('\n').trim();
                } else {
                    mermaidCode = code.trim();
                }

                return <MermaidDiagram code={mermaidCode} width={customWidth} height={customHeight} />;
            }

            // Handle audio embeds with optional size
            if (language === 'audio') {
                const lines = code.trim().split('\n');
                let audioUrl = lines[0]?.trim() || '';
                let size: 'small' | 'medium' | 'large' = 'medium';

                // Check if first line is a size directive
                if (audioUrl.match(/^(small|medium|large)$/i)) {
                    size = audioUrl.toLowerCase() as 'small' | 'medium' | 'large';
                    audioUrl = lines[1]?.trim() || '';
                }

                return <BlogAudioPlayer src={audioUrl} size={size} />;
            }

            // Handle video embeds with native HTML5 video for external URLs
            if (language === 'video') {
                const lines = code.trim().split('\n');
                let videoUrl = lines[0]?.trim() || '';
                let width: number | undefined;
                let height: number | undefined;

                // Check if first line is dimensions (e.g., "800x600")
                const dimensionMatch = videoUrl.match(/^(\d+)x(\d+)$/);
                if (dimensionMatch && dimensionMatch[1] && dimensionMatch[2]) {
                    width = parseInt(dimensionMatch[1], 10);
                    height = parseInt(dimensionMatch[2], 10);
                    videoUrl = lines[1]?.trim() || '';
                }

                // Use memoized component for external URLs to prevent flickering
                if (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) {
                    return <BlogVideoPlayer src={videoUrl} width={width} height={height} />;
                } else {
                    // Use standard HTML5 video for local videos
                    const containerStyle = width && height
                        ? { width: `${width}px`, height: `${height}px`, maxWidth: '100%' }
                        : {};

                    return (
                        <div className="my-6 flex justify-center">
                            <div
                                className="rounded-lg overflow-hidden border shadow-2xl"
                                style={width && height ? containerStyle : { width: '100%', maxWidth: '800px' }}
                            >
                                <video
                                    src={videoUrl}
                                    controls
                                    className="w-full h-full"
                                    playsInline
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    );
                }
            }

            // Handle chart visualizations
            if (language === 'chart') {
                return <ChartWidget code={code.trim()} />;
            }

            // Handle timeline visualizations
            if (language === 'timeline') {
                return <TimelineWidget code={code.trim()} />;
            }

            // Handle progress bars
            if (language === 'progress') {
                return <ProgressWidget code={code.trim()} />;
            }

            // Handle YouTube embeds
            if (language === 'youtube') {
                const url = code.trim();
                const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
                if (videoIdMatch && videoIdMatch[1]) {
                    return <YouTubeEmbed id={videoIdMatch[1]} />;
                }
                return null;
            }

            // Handle Spotify embeds
            if (language === 'spotify') {
                const url = code.trim();
                const spotifyMatch = url.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
                if (spotifyMatch) {
                    const embedUrl = `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}`;
                    return (
                        <div className="my-6">
                            <div className="aspect-video rounded-lg overflow-hidden border shadow-2xl mx-auto max-w-full">
                                <iframe
                                    src={embedUrl}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"
                                    className="w-full h-full"
                                    title={`Spotify ${spotifyMatch[1]} player`}
                                />
                            </div>
                        </div>
                    );
                }
                return null;
            }

            // Handle CodePen embeds
            if (language === 'codepen') {
                const url = code.trim();
                const penMatch = url.match(/codepen\.io\/([^\/]+)\/pen\/([a-zA-Z0-9]+)/);
                if (penMatch) {
                    const [, user, penId] = penMatch;
                    return (
                        <div className="my-6">
                            <div className="rounded-lg overflow-hidden border shadow-2xl" style={{ height: '400px' }}>
                                <iframe
                                    src={`https://codepen.io/${user}/embed/${penId}?default-tab=result`}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    loading="lazy"
                                    allowFullScreen
                                    className="w-full h-full"
                                    title="CodePen interactive demo"
                                />
                            </div>
                        </div>
                    );
                }
                return null;
            }

            // Handle Twitter/X embeds
            if (language === 'twitter' || language === 'x') {
                const url = code.trim();
                const tweetMatch = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
                if (tweetMatch && tweetMatch[1]) {
                    return (
                        <div className="my-6 p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg border">
                            <div className="text-center">
                                <div className="text-2xl mb-2">𝕏</div>
                                <p className="text-sm text-muted-foreground mb-4">Tweet: {tweetMatch[1]}</p>
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    View on X/Twitter →
                                </a>
                            </div>
                        </div>
                    );
                }
                return null;
            }

            // Handle GitHub Gist embeds
            if (language === 'gist') {
                const url = code.trim();
                const gistMatch = url.match(/gist\.github\.com\/([^\/]+)\/([a-zA-Z0-9]+)/);
                if (gistMatch && gistMatch[1] && gistMatch[2]) {
                    const [, user, gistId] = gistMatch;
                    return <GistEmbed user={user} gistId={gistId} />;
                }
                return null;
            }

            // Handle Lottie animations
            if (language === 'lottie') {
                const url = code.trim();
                return (
                    <div className="my-6 flex justify-center">
                        <div className="w-full max-w-md aspect-square rounded-lg overflow-hidden border shadow-lg">
                            <iframe
                                src={`https://lottie.host/?file=${encodeURIComponent(url)}`}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                loading="lazy"
                                className="w-full h-full"
                                title="Lottie animation"
                            />
                        </div>
                    </div>
                );
            }

            // Handle Figma embeds
            if (language === 'figma') {
                const url = code.trim();
                const figmaMatch = url.match(/figma\.com\/(file|proto)\/([a-zA-Z0-9]+)/);
                if (figmaMatch) {
                    return (
                        <div className="my-6">
                            <div className="rounded-lg overflow-hidden border shadow-2xl" style={{ height: '500px' }}>
                                <iframe
                                    src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    loading="lazy"
                                    allowFullScreen
                                    className="w-full h-full"
                                    title="Figma design embed"
                                />
                            </div>
                        </div>
                    );
                }
                return null;
            }

            // Handle CodeSandbox embeds
            if (language === 'codesandbox') {
                const url = code.trim();
                const sandboxMatch = url.match(/codesandbox\.io\/s\/([a-zA-Z0-9-]+)/);
                if (sandboxMatch) {
                    const sandboxId = sandboxMatch[1];
                    return (
                        <div className="my-6">
                            <div className="rounded-lg overflow-hidden border shadow-2xl" style={{ height: '500px' }}>
                                <iframe
                                    src={`https://codesandbox.io/embed/${sandboxId}?fontsize=14&theme=dark`}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    loading="lazy"
                                    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                                    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                                    className="w-full h-full"
                                    title="CodeSandbox interactive editor"
                                />
                            </div>
                        </div>
                    );
                }
                return null;
            }

            // Handle StackBlitz embeds
            if (language === 'stackblitz') {
                const url = code.trim();
                const stackblitzMatch = url.match(/stackblitz\.com\/(edit|github)\/([a-zA-Z0-9-_/]+)/);
                if (stackblitzMatch) {
                    const projectPath = stackblitzMatch[2];
                    return (
                        <div className="my-6">
                            <div className="rounded-lg overflow-hidden border shadow-2xl" style={{ height: '500px' }}>
                                <iframe
                                    src={`https://stackblitz.com/${stackblitzMatch[1]}/${projectPath}?embed=1&file=index.html`}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    loading="lazy"
                                    className="w-full h-full"
                                    title="StackBlitz interactive editor"
                                />
                            </div>
                        </div>
                    );
                }
                return null;
            }

            // Handle Replit embeds
            if (language === 'replit') {
                const url = code.trim();
                const replitMatch = url.match(/replit\.com\/@([^\/]+)\/([^\/\?]+)/);
                if (replitMatch) {
                    const [, user, repl] = replitMatch;
                    return (
                        <div className="my-6">
                            <div className="rounded-lg overflow-hidden border shadow-2xl" style={{ height: '500px' }}>
                                <iframe
                                    src={`https://replit.com/@${user}/${repl}?embed=true`}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    loading="lazy"
                                    className="w-full h-full"
                                    title="Replit interactive editor"
                                />
                            </div>
                        </div>
                    );
                }
                return null;
            }

            // Handle Instagram embeds
            if (language === 'instagram') {
                const url = code.trim();
                const instaMatch = url.match(/instagram\.com\/(p|reel)\/([a-zA-Z0-9_-]+)/);
                if (instaMatch && instaMatch[2]) {
                    return (
                        <div className="my-6 p-6 bg-gradient-to-br from-pink-500/10 to-purple-500/5 rounded-lg border">
                            <div className="text-center">
                                <div className="text-2xl mb-2">📷</div>
                                <p className="text-sm text-muted-foreground mb-4">Instagram {instaMatch[1] === 'reel' ? 'Reel' : 'Post'}: {instaMatch[2]}</p>
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-pink-500 hover:underline"
                                >
                                    View on Instagram →
                                </a>
                            </div>
                        </div>
                    );
                }
                return null;
            }

            // Handle TikTok embeds
            if (language === 'tiktok') {
                const url = code.trim();
                const tiktokMatch = url.match(/tiktok\.com\/@[^\/]+\/video\/(\d+)/);
                if (tiktokMatch && tiktokMatch[1]) {
                    return (
                        <div className="my-6 p-6 bg-gradient-to-br from-black/10 to-black/5 rounded-lg border">
                            <div className="text-center">
                                <div className="text-2xl mb-2">🎵</div>
                                <p className="text-sm text-muted-foreground mb-4">TikTok Video: {tiktokMatch[1]}</p>
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-foreground hover:underline"
                                >
                                    View on TikTok →
                                </a>
                            </div>
                        </div>
                    );
                }
                return null;
            }

            // Handle Vimeo embeds
            if (language === 'vimeo') {
                const url = code.trim();
                const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
                if (vimeoMatch && vimeoMatch[1]) {
                    return (
                        <div className="my-6">
                            <div className="aspect-video rounded-lg overflow-hidden border shadow-2xl">
                                <iframe
                                    src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    loading="lazy"
                                    allowFullScreen
                                    className="w-full h-full"
                                    title="Vimeo video player"
                                />
                            </div>
                        </div>
                    );
                }
                return null;
            }

            // Handle SoundCloud embeds
            if (language === 'soundcloud') {
                const url = code.trim();
                return (
                    <div className="my-6">
                        <div className="rounded-lg overflow-hidden border shadow-lg">
                            <iframe
                                width="100%"
                                height="166"
                                scrolling="no"
                                frameBorder="no"
                                allow="autoplay"
                                src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23D247BF&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                                loading="lazy"
                                title="SoundCloud audio player"
                            />
                        </div>
                    </div>
                );
            }

            // Handle Map embeds
            if (language === 'map' || language === 'mapbox') {
                const lines = code.trim().split('\n');
                const locationMatch = lines[0]?.match(/^location:\s*(.+)$/);
                const zoomMatch = lines.find(l => l.match(/^zoom:\s*(\d+)$/))?.match(/^zoom:\s*(\d+)$/);

                if (locationMatch && locationMatch[1]) {
                    const location = encodeURIComponent(locationMatch[1]);
                    const zoom = zoomMatch ? zoomMatch[1] : '15';

                    return (
                        <div className="my-6">
                            <div className="rounded-lg overflow-hidden border shadow-2xl" style={{ height: '400px' }}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${location}&zoom=${zoom}`}
                                    allowFullScreen
                                    title="Google Maps location"
                                />
                            </div>
                        </div>
                    );
                }
                return null;
            }

            // Handle PDF embeds
            if (language === 'pdf') {
                const url = code.trim();
                return (
                    <div className="my-6">
                        <div className="rounded-lg overflow-hidden border shadow-2xl" style={{ height: '600px' }}>
                            <iframe
                                src={`${url}#view=FitH`}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                loading="lazy"
                                className="w-full h-full"
                                title="PDF document viewer"
                            />
                        </div>
                    </div>
                );
            }

            // Handle Google Slides embeds
            if (language === 'slides') {
                const url = code.trim();
                const slidesMatch = url.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9-_]+)/);
                if (slidesMatch && slidesMatch[1]) {
                    return (
                        <div className="my-6">
                            <div className="aspect-video rounded-lg overflow-hidden border shadow-2xl">
                                <iframe
                                    src={`https://docs.google.com/presentation/d/${slidesMatch[1]}/embed?start=false&loop=false&delayms=3000`}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    loading="lazy"
                                    allowFullScreen
                                    className="w-full h-full"
                                    title="Google Slides presentation"
                                />
                            </div>
                        </div>
                    );
                }
                return null;
            }

            return (
                <CodeBlock code={code.trim()} language={language} />
            );
        },
        code: ({ inline, children, className, ...props }: any) => {
            if (inline) {
                return (
                    <code className="bg-muted/30 px-2 py-1 rounded text-sm font-mono text-foreground" {...props}>
                        {children}
                    </code>
                );
            }
            return (
                <code className={`text-sm font-mono text-foreground ${className || ''}`} {...props}>
                    {children}
                </code>
            );
        },

        // Custom components
        div: ({ className, children, ...props }: any) => {
            // Tabs container
            if (className === 'tabs-container') {
                return <TabsComponent>{children}</TabsComponent>;
            }

            // Collapsible section
            if (className === 'collapsible-section') {
                return (
                    <div className="my-6 p-4 bg-muted/30 rounded-lg border">
                        <div className="text-center text-muted-foreground">
                            Collapsible section disabled for stability
                        </div>
                    </div>
                );
            }

            // Gallery
            if (className === 'image-gallery') {
                return <ImageGallery>{children}</ImageGallery>;
            }

            // Picture embed
            if (className === 'picture-embed') {
                const src = props['data-src'];
                const alt = props['data-alt'];
                const caption = props['data-caption'];
                const size = props['data-size'];
                const position = props['data-position'];
                return <PictureEmbed src={src} alt={alt} caption={caption} size={size} position={position} />;
            }

            // Picture grid
            if (className === 'picture-grid') {
                return <PictureGrid>{children}</PictureGrid>;
            }

            // Charts
            if (className === 'chart-spectrum') {
                return (
                    <div className="my-6 p-4 bg-muted/30 rounded-lg border">
                        <div className="text-center text-muted-foreground">
                            Spectrum chart disabled for stability
                        </div>
                    </div>
                );
            }

            if (className === 'waveform') {
                return (
                    <div className="my-6 p-4 bg-muted/30 rounded-lg border">
                        <div className="text-center text-muted-foreground">
                            Waveform display disabled for stability
                        </div>
                    </div>
                );
            }

            // Mermaid diagrams
            if (className === 'mermaid-diagram') {
                const diagramCode = props['data-code'];
                console.log('Rendering Mermaid div with code:', diagramCode);
                return <MermaidDiagram code={diagramCode} />;
            }

            // Media embeds
            if (className === 'youtube-embed') {
                const id = props['data-id'];
                return <YouTubeEmbed id={id} />;
            }

            if (className === 'soundcloud-embed') {
                return (
                    <div className="my-6 p-4 bg-muted/30 rounded-lg border">
                        <div className="text-center text-muted-foreground">
                            SoundCloud embed disabled for stability
                        </div>
                    </div>
                );
            }

            if (className === 'spotify-embed') {
                return (
                    <div className="my-6 p-4 bg-muted/30 rounded-lg border">
                        <div className="text-center text-muted-foreground">
                            Spotify embed disabled for stability
                        </div>
                    </div>
                );
            }

            if (className === 'vimeo-embed') {
                return (
                    <div className="my-6 p-4 bg-muted/30 rounded-lg border">
                        <div className="text-center text-muted-foreground">
                            Vimeo embed disabled for stability
                        </div>
                    </div>
                );
            }

            if (className === 'audio-player') {
                return (
                    <div className="my-6 p-4 bg-muted/30 rounded-lg border">
                        <div className="text-center text-muted-foreground">
                            Audio player disabled for stability
                        </div>
                    </div>
                );
            }

            // PDF embed
            if (className === 'pdf-embed') {
                const src = props['data-src'];
                const title = props['data-title'] || 'PDF Document';
                const height = props['data-height'] || '800px';
                return (
                    <div className="my-6 rounded-lg overflow-hidden border shadow-lg">
                        <div className="bg-muted/50 border-b px-4 py-2 flex items-center justify-between">
                            <span className="text-sm font-medium">{title}</span>
                            <a
                                href={src}
                                download
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                <Download className="h-3 w-3" />
                                Download
                            </a>
                        </div>
                        <iframe
                            src={`${src}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                            className="w-full"
                            style={{ height }}
                            title={title}
                        />
                    </div>
                );
            }

            // Social embeds
            if (className === 'twitter-embed') {
                const id = props['data-id'];
                return <TwitterEmbed id={id} />;
            }

            if (className === 'instagram-embed') {
                const id = props['data-id'];
                return <InstagramEmbed id={id} />;
            }

            // CTA buttons
            if (className === 'cta-button') {
                const type = props['data-type'];
                const text = props['data-text'];
                const url = props['data-url'];
                return <CTAButton type={type} text={text} url={url} />;
            }

            // Table style marker - invisible marker that sets style for next table
            if (className === 'table-style-marker') {
                const style = props['data-style'];
                return (
                    <div
                        className="table-style-marker"
                        data-style={style}
                        style={{ display: 'none' }}
                    >
                    </div>
                );
            }

            // Video container
            if (className === 'video-container') {
                const customWidth = props['data-width'];
                const customHeight = props['data-height'];

                if (customWidth && customHeight) {
                    return (
                        <div className="my-6">
                            <div
                                className="rounded-lg overflow-hidden border shadow-2xl mx-auto"
                                style={{ width: `${customWidth}px`, height: `${customHeight}px`, maxWidth: '100%' }}
                            >
                                <div className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0">
                                    {children}
                                </div>
                            </div>
                        </div>
                    );
                }

                return (
                    <div className="my-6">
                        <div className="aspect-video rounded-lg overflow-hidden border shadow-2xl mx-auto max-w-full">
                            <div className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0">
                                {children}
                            </div>
                        </div>
                    </div>
                );
            }

            // Mermaid container
            if (className === 'mermaid-container') {
                return <div className="my-4 shadow-2xl">{children}</div>;
            }

            // Table of Contents marker
            if (className === 'toc-marker') {
                return (
                    <div className="my-4 p-4 m-0 bg-muted/10 rounded border border-border">
                        <h2 className="text-xs font-semibold mt-2 mb-2 text-foreground">Table of Contents</h2>
                        <p className="text-xs text-muted-foreground leading-tight mb-2">
                            Add section headers to your document, and the TOC will automatically generate here.
                        </p>
                    </div>
                );
            }

            return <div className={className} {...props}>{children}</div>;
        },

        // HTML details/summary for collapsible sections
        details: ({ children, ...props }: any) => {
            return (
                <details className="my-4 p-4 border border-border rounded-lg bg-muted/10 hover:bg-muted/20 transition-all duration-200 group" {...props}>
                    {children}
                </details>
            );
        },
        summary: ({ children, ...props }: any) => {
            return (
                <summary className="font-semibold cursor-pointer select-none flex items-center gap-2 text-foreground hover:text-primary transition-colors list-none [&::-webkit-details-marker]:hidden" {...props}>
                    <svg
                        className="w-4 h-4 text-primary transition-transform duration-300 ease-in-out group-open:rotate-90"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {children}
                </summary>
            );
        },

        // Images
        img: ({ src, alt, title, className, ...props }: any) => {
            if (!src) return null;

            // Decode URL-encoded characters first
            let decodedSrc = decodeURIComponent(src);

            // Normalize placeholder URLs to use HTTPS
            let normalizedSrc = decodedSrc;
            if (decodedSrc.includes('placeholder.com') && decodedSrc.startsWith('http://')) {
                normalizedSrc = decodedSrc.replace('http://', 'https://');
            }

            // Parse custom dimensions from src (e.g., image.png =260x200)
            // Try multiple patterns: space, %20, or directly attached
            let customWidth: number | undefined;
            let customHeight: number | undefined;

            // Match only at the end with word boundary before =
            // This ensures we don't match "png=" but do match " =300x200" or "url =300x200"
            let dimensionMatch = normalizedSrc.match(/\s=(\d+)x(\d+)$/);
            if (!dimensionMatch) {
                // Try with %20
                dimensionMatch = normalizedSrc.match(/%20=(\d+)x(\d+)$/);
            }

            if (dimensionMatch && dimensionMatch[1] && dimensionMatch[2]) {
                customWidth = parseInt(dimensionMatch[1], 10);
                customHeight = parseInt(dimensionMatch[2], 10);
                normalizedSrc = normalizedSrc.replace(/\s=\d+x\d+$/, '').replace(/%20=\d+x\d+$/, '');
            }

            // Parse style modifiers from alt text
            const isInline = className?.includes('inline') || alt?.includes('[inline]');
            const isFullCard = className?.includes('full-card') || alt?.includes('[full-card]');
            const isNoBorder = className?.includes('no-border') || alt?.includes('[no-border]');
            const isNoSpacing = className?.includes('no-spacing') || alt?.includes('[no-spacing]');
            const isFullWidth = className?.includes('full-width') || alt?.includes('[full-width]');

            // Clean alt text by removing style indicators
            const cleanAlt = alt?.replace(/\[(inline|full-card|no-border|no-spacing|full-width)\]/g, '').trim() || '';

            // Inline style - flows with text, no card, no spacing
            if (isInline) {
                return (
                    <span className="inline-block align-middle mx-1">
                        <Image
                            src={normalizedSrc}
                            alt={cleanAlt}
                            width={200}
                            height={150}
                            className="rounded max-h-6 w-auto object-cover"
                            style={{ maxHeight: '1.5rem', width: 'auto' }}
                            unoptimized
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                    </span>
                );
            }

            // Full width style - breaks out completely with no spacing
            if (isFullWidth) {
                return (
                    <div className="full-width-image-container">
                        <div className="relative w-full overflow-hidden">
                            <Image
                                src={normalizedSrc}
                                alt={cleanAlt}
                                width={1200}
                                height={600}
                                className="w-full h-auto object-cover block"
                                style={{ maxWidth: '100%', height: 'auto', margin: 0, padding: 0, display: 'block' }}
                                unoptimized
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        </div>
                        {(title || cleanAlt) && (
                            <div className="text-sm text-muted-foreground text-center mt-2 px-4 md:px-6 italic">
                                {title || cleanAlt}
                            </div>
                        )}
                    </div>
                );
            }

            // Full card style - card extends full width with border
            if (isFullCard) {
                return (
                    <div className="my-6 -mx-4 md:-mx-6">
                        <div className="relative w-full overflow-hidden border-y md:border md:rounded-lg">
                            <Image
                                src={normalizedSrc}
                                alt={cleanAlt}
                                width={1200}
                                height={600}
                                className="w-full h-auto object-cover"
                                style={{ maxWidth: '100%', height: 'auto' }}
                                unoptimized
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        </div>
                        {(title || cleanAlt) && (
                            <div className="text-sm text-muted-foreground text-center mt-2 px-4 md:px-6 italic">
                                {title || cleanAlt}
                            </div>
                        )}
                    </div>
                );
            }

            // No border style - regular spacing but no border
            if (isNoBorder) {
                return (
                    <div className={isNoSpacing ? "no-spacing-image max-w-full" : "my-4 max-w-full"}>
                        <div className="relative w-full overflow-hidden rounded-lg">
                            <Image
                                src={normalizedSrc}
                                alt={cleanAlt}
                                width={800}
                                height={400}
                                className="w-full h-auto object-cover max-w-full"
                                style={{ maxWidth: '100%', height: 'auto' }}
                                unoptimized
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        </div>
                        {(title || cleanAlt) && !isNoSpacing && (
                            <div className="text-sm text-muted-foreground text-center mt-1 italic">
                                {title || cleanAlt}
                            </div>
                        )}
                    </div>
                );
            }

            // Default card style (existing behavior)
            return (
                <div className={isNoSpacing ? "no-spacing-image max-w-full mx-auto" : "my-4 max-w-full mx-auto"}>
                    <div className="relative w-fit mx-auto overflow-hidden rounded-lg border shadow-lg">
                        <Image
                            src={normalizedSrc}
                            alt={cleanAlt}
                            width={customWidth || 600}
                            height={customHeight || 400}
                            className="object-cover"
                            style={{
                                width: customWidth ? `${customWidth}px` : 'auto',
                                height: 'auto',
                                maxWidth: '100%'
                            }}
                            unoptimized
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                    </div>
                    {(title || cleanAlt) && !isNoSpacing && (
                        <div className="text-sm text-muted-foreground text-center mt-1 italic">
                            {title || cleanAlt}
                        </div>
                    )}
                </div>
            );
        },

        // Audio elements - custom player with site styling
        audio: ({ children, ...props }: any) => {
            // Extract audio source from children (source tags)
            let audioSrc: string | undefined;

            // Handle children being source elements
            if (children && Array.isArray(children)) {
                const sourceChild = children.find((child: any) =>
                    child?.props?.src || child?.type === 'source'
                );
                audioSrc = sourceChild?.props?.src;
            }

            // Fallback to props.src
            if (!audioSrc && props.src) {
                audioSrc = props.src;
            }

            if (!audioSrc) {
                return null;
            }

            // Use custom audio player component
            return <BlogAudioPlayer src={audioSrc} />;
        },

        // Video elements - use next-video for better performance
        video: ({ children, ...props }: any) => {
            // Extract video source from children (source tags)
            let videoSrc: string | undefined;

            // Handle children being source elements
            if (children && Array.isArray(children)) {
                const sourceChild = children.find((child: any) =>
                    child?.props?.src || child?.type === 'source'
                );
                videoSrc = sourceChild?.props?.src;
            }

            // Fallback to props.src
            if (!videoSrc && props.src) {
                videoSrc = props.src;
            }

            if (!videoSrc) {
                return null;
            }

            // Use standard HTML5 video element
            return (
                <div className="my-6">
                    <div className="rounded-lg overflow-hidden border shadow-2xl mx-auto max-w-full">
                        <video
                            src={videoSrc}
                            controls
                            className="w-full"
                            playsInline
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            );
        },

        // Strong/Bold text with variations
        strong: ({ children, ...props }: any) => {
            const text = children?.toString() || '';

            // Special styling for different types of emphasis
            if (text.includes('Pro tip') || text.includes('Reality check') || text.includes('From the trenches')) {
                return (
                    <strong className="text-foreground font-semibold bg-gradient-to-r from-[#D247BF] to-[#FF6B35] bg-clip-text text-transparent" {...props}>
                        {children}
                    </strong>
                );
            }

            if (text.includes('Before') || text.includes('After') || text.includes('Savings')) {
                return (
                    <strong className="text-foreground font-semibold px-2 py-0.5 bg-muted/30 rounded text-sm" {...props}>
                        {children}
                    </strong>
                );
            }

            return (
                <strong className="text-foreground font-semibold" {...props}>
                    {children}
                </strong>
            );
        },

        // Emphasis/Italic text
        em: ({ children, ...props }: any) => (
            <em className="italic" {...props}>
                {children}
            </em>
        ),

        // Strikethrough text
        del: ({ children, ...props }: any) => (
            <del className="line-through text-muted-foreground" {...props}>
                {children}
            </del>
        ),

        // Horizontal rule
        hr: ({ ...props }: any) => (
            <hr className="my-6 border-0 h-px bg-border" {...props} />
        ),

        // Blockquotes with elegant styling and alert callouts
        blockquote: ({ children, ...props }: any) => {
            // Check if this is an alert callout
            const childrenText = React.Children.toArray(children)
                .map((child: any) => {
                    if (typeof child === 'string') return child;
                    if (child?.props?.children) {
                        const text = React.Children.toArray(child.props.children)
                            .map((c: any) => typeof c === 'string' ? c : c?.props?.children || '')
                            .join('');
                        return text;
                    }
                    return '';
                })
                .join('');

            const alertMatch = childrenText.match(/^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION|REFERENCE|EXAMPLE)\]/);

            if (alertMatch && alertMatch[1]) {
                const type = alertMatch[1] as 'NOTE' | 'TIP' | 'WARNING' | 'IMPORTANT' | 'CAUTION' | 'REFERENCE' | 'EXAMPLE';
                const alertConfig: Record<'NOTE' | 'TIP' | 'WARNING' | 'IMPORTANT' | 'CAUTION' | 'REFERENCE' | 'EXAMPLE', { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; border: string; textColor: string }> = {
                    'NOTE': { icon: Info, color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-950/50', border: 'border-blue-500 dark:border-blue-400', textColor: 'text-foreground' },
                    'TIP': { icon: Lightbulb, color: 'text-green-700 dark:text-green-300', bg: 'bg-green-50 dark:bg-green-950/50', border: 'border-green-500 dark:border-green-400', textColor: 'text-foreground' },
                    'WARNING': { icon: AlertTriangle, color: 'text-yellow-700 dark:text-yellow-300', bg: 'bg-yellow-50 dark:bg-yellow-950/50', border: 'border-yellow-500 dark:border-yellow-400', textColor: 'text-foreground' },
                    'IMPORTANT': { icon: AlertCircle, color: 'text-red-700 dark:text-red-300', bg: 'bg-red-50 dark:bg-red-950/50', border: 'border-red-500 dark:border-red-400', textColor: 'text-foreground' },
                    'CAUTION': { icon: Zap, color: 'text-orange-700 dark:text-orange-300', bg: 'bg-orange-50 dark:bg-orange-950/50', border: 'border-orange-500 dark:border-orange-400', textColor: 'text-foreground' },
                    'REFERENCE': { icon: BookOpen, color: 'text-purple-700 dark:text-purple-300', bg: 'bg-purple-50 dark:bg-purple-950/50', border: 'border-purple-500 dark:border-purple-400', textColor: 'text-foreground' },
                    'EXAMPLE': { icon: Code2, color: 'text-cyan-700 dark:text-cyan-300', bg: 'bg-cyan-50 dark:bg-cyan-950/50', border: 'border-cyan-500 dark:border-cyan-400', textColor: 'text-foreground' }
                };

                const config = alertConfig[type] || alertConfig.NOTE;
                const IconComponent = config.icon;

                return (
                    <div className={`${config.bg} ${config.border} border-l-4 rounded-lg p-5 my-6 shadow-sm`} {...props}>
                        <div className="flex gap-3 items-start">
                            <div className={`${config.color} flex-shrink-0 mt-0.5`}>
                                <IconComponent className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <div className={`font-bold ${config.color} mb-2 text-base tracking-wide uppercase leading-none`}>
                                    {type}
                                </div>
                                <div className={`text-sm ${config.textColor} leading-relaxed`}>
                                    {React.Children.map(children, (child: any) => {
                                        if (typeof child === 'string') {
                                            return child.replace(/^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION|REFERENCE|EXAMPLE)\]\s*/, '');
                                        }
                                        if (child?.props?.children) {
                                            const newChildren = React.Children.map(child.props.children, (c: any) => {
                                                if (typeof c === 'string') {
                                                    return c.replace(/^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION|REFERENCE|EXAMPLE)\]\s*/, '');
                                                }
                                                return c;
                                            });
                                            return React.cloneElement(child, {}, newChildren);
                                        }
                                        return child;
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            // Regular blockquote
            return (
                <blockquote className="border-l-4 border-primary/70 dark:border-primary/50 pl-6 pr-4 py-4 my-6 text-lg italic text-foreground/90 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-r-lg relative shadow-sm" {...props}>
                    <div className="relative z-10 leading-relaxed">{children}</div>
                </blockquote>
            );
        },

        // Table components with enhanced styling options
        table: ({ children, className, ...props }: any) => {
            return <TableComponent className={className} {...props}>{children}</TableComponent>;
        },
        thead: ({ children, ...props }: any) => {
            // Get table style context from parent
            const tableElement = props.parentElement?.closest('table');
            const tableStyle = tableElement?.dataset?.style || tableElement?.className || '';
            const isNoBorder = tableStyle.includes('no-border');
            const isMinimal = tableStyle.includes('minimal');
            const isSticky = tableStyle.includes('sticky');

            let headerClasses = "bg-muted/30";
            if (isNoBorder) {
                headerClasses = "bg-muted/10";
            } else if (isMinimal) {
                headerClasses = "bg-muted/20";
            }

            // Add sticky positioning for sticky tables
            if (isSticky) {
                headerClasses += " sticky top-0 z-10 backdrop-blur-sm bg-muted/80 border-b border-border";
            }

            return (
                <thead className={headerClasses} {...props}>
                    {children}
                </thead>
            );
        },
        tbody: ({ children, ...props }: any) => (
            <tbody className="bg-background" {...props}>
                {children}
            </tbody>
        ),
        tr: ({ children, ...props }: any) => {
            // Enhanced row styling with context awareness
            let rowClasses = "border-b border-border hover:bg-muted/20 transition-colors";

            // Default styling for now - table styling will be handled via CSS classes
            return (
                <tr className={rowClasses} {...props}>
                    {children}
                </tr>
            );
        },
        th: ({ children, ...props }: any) => (
            <th className="px-3 py-2.5 text-left font-semibold text-foreground border-r border-border last:border-r-0 text-sm" {...props}>
                {children}
            </th>
        ),
        td: ({ children, ...props }: any) => {
            const text = children?.toString() || '';

            // Special styling for certain cell contents
            if (text.includes('$') || text.includes('tokens')) {
                return (
                    <td className="px-3 py-2.5 text-foreground font-medium border-r border-border last:border-r-0 align-top text-sm" {...props}>
                        {children}
                    </td>
                );
            }

            return (
                <td className="px-3 py-2.5 text-muted-foreground border-r border-border last:border-r-0 align-top text-sm" {...props}>
                    {children}
                </td>
            );
        },
    };

    return (
        <div className="blog-content prose prose-neutral dark:prose-invert max-w-none">
            <style jsx>{`
                /* Table styling variations */
                .table-no-border th,
                .table-no-border td {
                    border: none !important;
                }

                .table-no-border thead {
                    background: rgba(var(--muted) / 0.1) !important;
                }

                .table-no-border tr {
                    border-bottom: none !important;
                }

                .table-no-border tr:hover {
                    background: rgba(var(--muted) / 0.1) !important;
                }

                .table-minimal th,
                .table-minimal td {
                    border-color: rgba(var(--border) / 0.3) !important;
                }

                .table-minimal thead {
                    background: rgba(var(--muted) / 0.2) !important;
                }

                .table-minimal tr {
                    border-bottom-color: rgba(var(--border) / 0.3) !important;
                }

                .table-framed th {
                    padding: 1.5rem 1rem !important;
                }

                .table-framed td {
                    padding: 1.25rem 1rem !important;
                }

                .table-striped tbody tr:nth-child(even) {
                    background: rgba(var(--muted) / 0.05) !important;
                }

                .table-elevated {
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
                }

                /* Math notation styling */
                .katex-display,
                .katex-display > .katex,
                .katex,
                .katex-html,
                .katex-display .katex,
                .katex-display .base {
                    color: hsl(var(--foreground)) !important;
                }

                .katex *,
                .katex span,
                .katex .mord,
                .katex .mbin,
                .katex .mrel,
                .katex .mopen,
                .katex .mclose,
                .katex .mpunct,
                .katex .minner,
                .katex .mop,
                .katex .mspace,
                .katex .base,
                .katex .strut,
                .katex .frac-line,
                .katex .mfrac {
                    color: hsl(var(--foreground)) !important;
                }

                .katex-display {
                    background: transparent !important;
                    padding: 0.5rem 0 !important;
                }

                /* Light theme specific override */
                :root:not(.dark) .katex,
                :root:not(.dark) .katex * {
                    color: hsl(var(--foreground)) !important;
                }

                /* Task list checkbox styling */
                input[type="checkbox"].task-list-checkbox {
                    appearance: none;
                    -webkit-appearance: none;
                    width: 1rem;
                    height: 1rem;
                    border: 2px solid hsl(var(--input));
                    border-radius: 0.25rem;
                    background-color: hsl(var(--background));
                    cursor: pointer;
                    position: relative;
                    flex-shrink: 0;
                }

                input[type="checkbox"].task-list-checkbox:checked {
                    background-color: hsl(var(--primary));
                    border-color: hsl(var(--primary));
                }

                input[type="checkbox"].task-list-checkbox:checked::after {
                    content: '';
                    position: absolute;
                    left: 0.25rem;
                    top: 0.05rem;
                    width: 0.35rem;
                    height: 0.6rem;
                    border: solid white;
                    border-width: 0 2px 2px 0;
                    transform: rotate(45deg);
                }

                input[type="checkbox"].task-list-checkbox:focus {
                    outline: 2px solid hsl(var(--primary));
                    outline-offset: 2px;
                }

                /* Mermaid diagram styling */
                .mermaid * {
                    color: hsl(var(--foreground)) !important;
                }
                .mermaid .node rect,
                .mermaid .node circle,
                .mermaid .node ellipse,
                .mermaid .node polygon {
                    fill: hsl(var(--background)) !important;
                    stroke: hsl(var(--primary)) !important;
                }
                .mermaid .node .label,
                .mermaid .nodeLabel,
                .mermaid .edgeLabel {
                    color: hsl(var(--foreground)) !important;
                }
                .mermaid .edgePath .path {
                    stroke: hsl(var(--muted-foreground)) !important;
                }
                .mermaid .arrowheadPath {
                    fill: hsl(var(--muted-foreground)) !important;
                }
            `}</style>
            <ReactMarkdown
                remarkPlugins={[
                    remarkGfm,
                    remarkGithubBlockquoteAlert,
                    remarkCustomAlerts,
                    remarkEmoji,
                    remarkMath,
                    [remarkToc, { tight: true, maxDepth: 3 }]
                ]}
                rehypePlugins={[
                    rehypeRaw,
                    rehypeKatex,
                    rehypeSlug,
                    [rehypeAutolinkHeadings, {
                        behavior: 'append',
                        content: {
                            type: 'element',
                            tagName: 'span',
                            properties: {
                                className: ['anchor-link-icon'],
                                style: 'margin-left: 0.5rem; opacity: 0; transition: opacity 0.2s ease-in-out;'
                            },
                            children: [{ type: 'text', value: '🔗' }]
                        },
                        properties: {
                            className: ['anchor-link'],
                            ariaLabel: 'Link to section'
                        }
                    }]
                ]}
                components={components}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
}

// Table Component (to fix React Hooks issue)
function TableComponent({ children, className, ...props }: any) {
    // Extract table style from props or class
    let tableStyle = '';

    // Check for direct style attribute
    if (props['data-style']) {
        tableStyle = props['data-style'];
    } else if (className) {
        tableStyle = className;
    }

    // Use a ref to find the preceding style marker after render
    const tableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (tableRef.current && !tableStyle) {
            const prevElement = tableRef.current.previousElementSibling;
            if (prevElement && prevElement.hasAttribute('data-table-style')) {
                const style = prevElement.getAttribute('data-table-style') || '';
                // Update the table classes dynamically
                const table = tableRef.current.querySelector('table');
                if (table && style) {
                    applyTableStyle(table as HTMLTableElement, style);
                }
            }
        }
    }, [tableStyle]);

    const applyTableStyle = (table: HTMLTableElement, style: string) => {
        const container = table.parentElement;
        if (!container) return;

        const isNoBorder = style.includes('no-border');
        const isMinimal = style.includes('minimal');
        const isElevated = style.includes('elevated');
        const isFramed = style.includes('framed');
        const isStriped = style.includes('striped');
        const isSticky = style.includes('sticky');

        // Remove existing classes
        table.className = "w-full border-collapse";
        container.className = "my-6 overflow-x-auto";

        // Apply sticky header support
        if (isSticky) {
            container.className += " max-h-96 overflow-y-auto";
            table.className += " sticky-table";
        }

        // Apply styling based on options
        if (isNoBorder) {
            table.className += " table-no-border rounded-lg overflow-hidden";
        } else if (isMinimal) {
            table.className += " table-minimal border border-border/30 rounded-lg overflow-hidden shadow-sm";
        } else if (isElevated) {
            table.className += " table-elevated border border-border rounded-xl overflow-hidden shadow-lg";
            container.className += " shadow-2xl";
        } else if (isFramed) {
            table.className += " table-framed border-4 border-border rounded-lg overflow-hidden shadow-lg";
            container.className += " p-2 bg-muted/5 rounded-xl";
        } else if (isStriped) {
            table.className += " table-striped border border-border rounded-lg overflow-hidden shadow-sm";
        } else {
            table.className += " border border-border rounded-lg overflow-hidden shadow-sm";
        }
    };

    // Parse table styling options
    const isNoBorder = tableStyle.includes('no-border');
    const isMinimal = tableStyle.includes('minimal');
    const isElevated = tableStyle.includes('elevated');
    const isFramed = tableStyle.includes('framed');
    const isStriped = tableStyle.includes('striped');
    const isSticky = tableStyle.includes('sticky');

    // Build table classes based on style options
    let tableClasses = "w-full border-collapse border border-border";
    let containerClasses = "my-4 overflow-x-auto max-w-full rounded-lg shadow-md";

    // Add sticky header support
    if (isSticky) {
        containerClasses += " max-h-96 overflow-y-auto";
        tableClasses += " sticky-table";
    }

    if (isNoBorder) {
        // No border style - clean and minimal
        tableClasses += " table-no-border rounded-lg overflow-hidden";
    } else if (isMinimal) {
        // Minimal style - subtle borders only
        tableClasses += " table-minimal border border-border/30 rounded-lg overflow-hidden shadow-sm";
    } else if (isElevated) {
        // Elevated style - strong shadow and borders
        tableClasses += " table-elevated border border-border rounded-xl overflow-hidden shadow-lg";
        containerClasses += " shadow-2xl";
    } else if (isFramed) {
        // Framed style - thick border frame
        tableClasses += " table-framed border-4 border-border rounded-lg overflow-hidden shadow-lg";
        containerClasses += " p-2 bg-muted/5 rounded-xl";
    } else if (isStriped) {
        // Striped style - alternating row colors
        tableClasses += " table-striped border border-border rounded-lg overflow-hidden shadow-sm";
    } else {
        // Default style - compact and focused
        tableClasses += " border border-border rounded-lg overflow-hidden shadow-sm text-sm";
        containerClasses += " max-w-4xl mx-auto";
    }

    // Add data-style attribute to table for child components to access
    const enhancedProps = {
        ...props,
        'data-style': tableStyle,
        className: tableClasses
    };

    return (
        <div ref={tableRef} className={containerClasses}>
            <table {...enhancedProps}>
                {children}
            </table>
        </div>
    );
}

// Custom Components

// React-based syntax highlighting function
function highlightCode(code: string, language: string): React.ReactNode {
    if (!code || typeof code !== 'string') {
        return <span className="text-muted-foreground">No code content available</span>;
    }

    const cleanCode = code.trim();

    // Tokenize and highlight code using React elements
    const getHighlightedCode = (text: string, lang: string) => {
        const lines = text.split('\n');

        return lines.map((line, lineIndex) => {
            // Define regex patterns for different token types
            const tokens: { regex: RegExp; className: string }[] = [];

            switch (lang) {
                case 'javascript':
                case 'typescript':
                    tokens.push(
                        { regex: /(\/\/.*$|\/\*[\s\S]*?\*\/)/g, className: "text-green-500/80" },
                        { regex: /\b(const|let|var|function|class|if|else|for|while|return|import|export|from|default|async|await|try|catch|finally|throw|new|this|typeof|instanceof|interface|type|enum|namespace|declare|public|private|protected|readonly|static)\b/g, className: "text-purple-400" },
                        { regex: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`/g, className: "text-green-400" },
                        { regex: /\b\d+\.?\d*\b/g, className: "text-blue-400" },
                        { regex: /[{}[\]()]/g, className: "text-yellow-400" }
                    );
                    break;

                case 'css':
                    tokens.push(
                        { regex: /(\/\*[\s\S]*?\*\/)/g, className: "text-green-500/80" },
                        { regex: /([a-zA-Z-]+)\s*(?=:)/g, className: "text-purple-400" },
                        { regex: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: "text-green-400" },
                        { regex: /#[0-9a-fA-F]{3,6}\b|\b\d+\.?\d*(px|em|rem|%|vh|vw|fr)\b/g, className: "text-orange-400" }
                    );
                    break;

                case 'python':
                    tokens.push(
                        { regex: /(#.*$)/g, className: "text-green-500/80" },
                        { regex: /\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|raise|with|lambda|global|nonlocal|pass|break|continue|and|or|not|in|is)\b/g, className: "text-purple-400" },
                        { regex: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: "text-green-400" },
                        { regex: /\b\d+\.?\d*\b/g, className: "text-blue-400" }
                    );
                    break;

                case 'bash':
                    tokens.push(
                        { regex: /(#.*$)/g, className: "text-green-500/80" },
                        { regex: /\b(echo|cd|ls|mkdir|rm|mv|cp|grep|find|chmod|chown|sudo|apt|npm|yarn|git|docker|curl|wget|cat|head|tail|less|more|ps|kill|top|htop)\b/g, className: "text-purple-400" },
                        { regex: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: "text-green-400" },
                        { regex: /\$[a-zA-Z_][a-zA-Z0-9_]*/g, className: "text-orange-400" }
                    );
                    break;

                case 'json':
                    tokens.push(
                        { regex: /"([^"\\]|\\.)*"(?=\s*:)/g, className: "text-blue-400" },
                        { regex: /"([^"\\]|\\.)*"(?!\s*:)/g, className: "text-green-400" },
                        { regex: /\b\d+\.?\d*\b/g, className: "text-purple-400" },
                        { regex: /\b(true|false|null)\b/g, className: "text-orange-400" }
                    );
                    break;
            }

            // Tokenize the line
            if (tokens.length === 0) {
                return (
                    <React.Fragment key={lineIndex}>
                        {line}
                        {lineIndex < lines.length - 1 && '\n'}
                    </React.Fragment>
                );
            }

            // Find all matches for all token types
            const allMatches: { start: number; end: number; className: string; text: string }[] = [];

            tokens.forEach(({ regex, className }) => {
                let match;
                const globalRegex = new RegExp(regex.source, regex.flags);
                while ((match = globalRegex.exec(line)) !== null) {
                    allMatches.push({
                        start: match.index,
                        end: match.index + match[0].length,
                        className,
                        text: match[0]
                    });
                }
            });

            // Sort matches by start position
            allMatches.sort((a, b) => a.start - b.start);

            // Remove overlapping matches (keep the first one)
            const filteredMatches: { start: number; end: number; className: string; text: string }[] = [];
            let lastEnd = 0;
            for (const match of allMatches) {
                if (match.start >= lastEnd) {
                    filteredMatches.push(match);
                    lastEnd = match.end;
                }
            }

            // Build the highlighted line
            const elements: (string | React.ReactElement)[] = [];
            let currentPos = 0;

            filteredMatches.forEach((match, i) => {
                // Add text before the match
                if (match.start > currentPos) {
                    elements.push(line.slice(currentPos, match.start));
                }

                // Add the highlighted match
                elements.push(
                    <span key={`${lineIndex}-${i}`} className={match.className}>
                        {match.text}
                    </span>
                );

                currentPos = match.end;
            });

            // Add remaining text
            if (currentPos < line.length) {
                elements.push(line.slice(currentPos));
            }

            return (
                <React.Fragment key={lineIndex}>
                    {elements}
                    {lineIndex < lines.length - 1 && '\n'}
                </React.Fragment>
            );
        });
    };

    return <span className="text-foreground">{getHighlightedCode(cleanCode, language)}</span>;
}

// Code Block with Copy Button
function CodeBlock({ code, language }: { code: string; language: string }) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy code:', error);
        }
    };

    const highlightedCode = React.useMemo(() => {
        return highlightCode(code, language);
    }, [code, language]);

    return (
        <div className="not-prose my-4">
            <div className="relative overflow-hidden rounded-lg border border-border bg-muted/5 shadow-sm">
                <div className="flex items-center justify-between bg-muted/30 px-3 py-1.5 border-b border-border">
                    <span className="text-xs font-medium text-muted-foreground capitalize">
                        {language === 'text' ? 'code' : language}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        onClick={handleCopy}
                    >
                        {copied ? (
                            <>
                                <Check className="h-3 w-3 mr-1" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                            </>
                        )}
                    </Button>
                </div>
                <div className="relative">
                    <pre className="overflow-x-auto p-4 text-sm bg-gradient-to-br from-slate-900/50 to-slate-800/30 dark:from-slate-900/80 dark:to-slate-800/60">
                        <code className="font-mono block leading-relaxed whitespace-pre-wrap">
                            {highlightedCode}
                        </code>
                    </pre>
                </div>
            </div>
        </div>
    );
}

// Simplified Mermaid Diagram Component

function TabsComponent({ children }: { children: React.ReactNode }) {
    const [activeTab, setActiveTab] = React.useState(0);
    const [tabs, setTabs] = React.useState<Array<{title: string; content: string}>>([]);

    React.useEffect(() => {
        // Parse the HTML content to extract tab information
        if (typeof children === 'string') {
            const tabMatches = children.match(/<div class="tab-item"[^>]*>([\s\S]*?)<\/div>/g);
            if (tabMatches) {
                const parsedTabs = tabMatches.map(tabHtml => {
                    const titleMatch = tabHtml.match(/data-title="([^"]+)"/);
                    const contentMatch = tabHtml.match(/<div class="tab-content">([\s\S]*?)<\/div>/);

                    return {
                        title: titleMatch?.[1] || 'Tab',
                        content: contentMatch?.[1]?.trim() || ''
                    };
                });
                setTabs(parsedTabs);
            }
        } else {
            // Fallback to demo tabs if parsing fails
            setTabs([
                { title: 'Overview', content: 'Tab content goes here. This is the first tab with some sample content.' },
                { title: 'Details', content: 'This is the second tab with more detailed information.' },
                { title: 'Examples', content: 'Here are some examples and code snippets for the third tab.' }
            ]);
        }
    }, [children]);

    if (tabs.length === 0) {
        return (
            <div className="my-6 p-6 bg-muted/30 rounded-lg border border-dashed">
                <div className="text-center text-muted-foreground">
                    <div className="text-2xl mb-2">📑</div>
                    <p className="text-sm">No tabs content found</p>
                    <p className="text-xs mt-1 opacity-60">Use `tabs:start` and `tab:Title` syntax</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-5 border border-border rounded-lg overflow-hidden shadow-sm">
            {/* Tab Headers */}
            <div className="bg-muted/20 border-b border-border">
                <div className="flex overflow-x-auto">
                    {tabs.map((tab, index) => (
                        <Button
                            key={index}
                            size="sm"
                            variant="ghost"
                            className={`rounded-none border-b-2 transition-all px-4 py-3 ${
                                activeTab === index
                                    ? 'border-primary bg-background text-foreground shadow-sm'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                            }`}
                            onClick={() => setActiveTab(index)}
                        >
                            {tab.title}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 bg-background">
                <div
                    className="prose prose-neutral dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: tabs[activeTab]?.content || '' }}
                />
            </div>

            {/* Tab Indicator */}
            <div className="px-4 py-2 bg-muted/10 text-xs text-muted-foreground text-center">
                Tab {activeTab + 1} of {tabs.length}
            </div>
        </div>
    );
}

function CollapsibleSection({ title, children }: { title: string; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="my-6 border border-border rounded-lg overflow-hidden">
            <button
                className="w-full bg-muted/30 hover:bg-muted/50 p-4 text-left flex items-center justify-between transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-medium">{title}</span>
                <span className="text-muted-foreground transform transition-transform" style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>
                    ▼
                </span>
            </button>
            {isOpen && (
                <div className="p-4 border-t border-border">
                    <div className="text-muted-foreground text-sm">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}

function ImageGallery({ children }: { children: React.ReactNode }) {
    const [selectedImage, setSelectedImage] = React.useState<number | null>(null);
    const [images, setImages] = React.useState<string[]>([]);

    React.useEffect(() => {
        // Extract image URLs from children (if provided)
        // For now, show demo images
        setImages([
            '/music/SocialsHeader-min.png',
            '/apple-touch-icon.png',
            '/music/SocialsHeader-min.png'
        ]);
    }, [children]);

    const closeModal = () => setSelectedImage(null);

    return (
        <div className="my-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((src, i) => (
                    <div
                        key={i}
                        className="relative aspect-video bg-muted/30 rounded-lg overflow-hidden border cursor-pointer group hover:border-primary/50 transition-colors"
                        onClick={() => setSelectedImage(i)}
                    >
                        <Image
                            src={src}
                            alt={`Gallery image ${i + 1}`}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Maximize className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
                Click images to view in full size • Responsive image gallery
            </p>

            {/* Modal for full-size image */}
            {selectedImage !== null && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={closeModal}
                >
                    <div className="relative max-w-4xl max-h-full">
                        <Image
                            src={images[selectedImage] || ''}
                            alt={`Gallery image ${selectedImage + 1}`}
                            width={1200}
                            height={800}
                            className="w-auto h-auto max-w-full max-h-full object-contain"
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 text-white hover:bg-white/20"
                            onClick={closeModal}
                        >
                            ✕
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Enhanced Picture Embed Component
function PictureEmbed({
    src,
    alt = '',
    caption,
    size = 'medium',
    position = 'center'
}: {
    src: string;
    alt?: string;
    caption?: string;
    size?: string;
    position?: string;
}) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);

    if (!src || imageError) {
        return (
            <div className="my-6 p-6 bg-muted/30 rounded-lg border border-dashed">
                <div className="text-center text-muted-foreground">
                    <div className="text-2xl mb-2">🖼️</div>
                    <p className="text-sm">Image could not be loaded</p>
                    {src && <p className="text-xs mt-1 opacity-60">{src}</p>}
                </div>
            </div>
        );
    }

    // Size classes
    const sizeClasses = {
        small: 'max-w-sm',
        medium: 'max-w-2xl',
        large: 'max-w-4xl',
        full: 'w-full'
    };

    // Position classes
    const positionClasses = {
        left: 'mr-auto',
        center: 'mx-auto',
        right: 'ml-auto'
    };

    const sizeClass = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.medium;
    const positionClass = positionClasses[position as keyof typeof positionClasses] || positionClasses.center;

    return (
        <div className={`my-6 ${sizeClass} ${positionClass} max-w-full`}>
            <div className="relative group">
                <div className="relative overflow-hidden rounded-lg border border-border/40 shadow-lg bg-muted/5">
                    <Image
                        src={src}
                        alt={alt}
                        width={800}
                        height={600}
                        className="w-full h-auto object-cover cursor-pointer max-w-full"
                        style={{ maxWidth: '100%', height: 'auto' }}
                        onClick={() => setIsModalOpen(true)}
                        onError={() => setImageError(true)}
                    />

                    {/* Overlay with zoom icon */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Maximize className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Caption */}
                {caption && (
                    <div className="mt-3 text-center">
                        <div className="text-sm text-muted-foreground italic leading-relaxed">
                            {caption}
                        </div>
                    </div>
                )}
            </div>

            {/* Full-screen modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div className="relative max-w-7xl max-h-full">
                        <Image
                            src={src}
                            alt={alt}
                            width={1600}
                            height={1200}
                            className="w-auto h-auto max-w-full max-h-full object-contain"
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-4 right-4 text-white hover:bg-white/20 bg-black/40"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ✕
                        </Button>
                        {caption && (
                            <div className="absolute bottom-4 left-4 right-4 text-center">
                                <p className="text-white text-sm bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm">
                                    {caption}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Picture Grid Component
function PictureGrid({ children }: { children: React.ReactNode }) {
    // Extract image URLs from markdown content within the grid
    const [images, setImages] = React.useState<Array<{src: string; alt?: string; caption?: string}>>([]);
    const [selectedImage, setSelectedImage] = React.useState<number | null>(null);

    React.useEffect(() => {
        // Parse the children content to extract image information
        // For demo purposes, show sample images
        setImages([
            { src: '/music/SocialsHeader-min.png', alt: 'Sample Image 1', caption: 'First image in grid' },
            { src: '/apple-touch-icon.png', alt: 'Sample Image 2', caption: 'Second image in grid' },
            { src: '/music/SocialsHeader-min.png', alt: 'Sample Image 3', caption: 'Third image in grid' },
            { src: '/apple-touch-icon.png', alt: 'Sample Image 4', caption: 'Fourth image in grid' }
        ]);
    }, [children]);

    const closeModal = () => setSelectedImage(null);

    return (
        <div className="my-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {images.map((image, i) => (
                    <div
                        key={i}
                        className="relative aspect-square bg-muted/30 rounded-lg overflow-hidden border border-border/40 cursor-pointer group hover:border-primary/50 transition-colors duration-300 hover:shadow-lg will-change-transform"
                        onClick={() => setSelectedImage(i)}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt || `Grid image ${i + 1}`}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <div className="bg-white/90 text-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <Maximize className="h-4 w-4" />
                            </div>
                        </div>

                        {/* Small caption overlay */}
                        {image.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                <p className="text-white text-xs truncate">
                                    {image.caption}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                    Click any image to view in full size • {images.length} images in grid
                </p>
            </div>

            {/* Modal for full-size image */}
            {selectedImage !== null && images[selectedImage] && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={closeModal}
                >
                    <div className="relative max-w-4xl max-h-full">
                        <Image
                            src={images[selectedImage].src}
                            alt={images[selectedImage].alt || `Grid image ${selectedImage + 1}`}
                            width={1200}
                            height={800}
                            className="w-auto h-auto max-w-full max-h-full object-contain"
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-4 right-4 text-white hover:bg-white/20 bg-black/40"
                            onClick={closeModal}
                        >
                            ✕
                        </Button>
                        {images[selectedImage].caption && (
                            <div className="absolute bottom-4 left-4 right-4 text-center">
                                <p className="text-white text-sm bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm">
                                    {images[selectedImage].caption}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Audio Player Component
function AudioPlayer({ src, title, artist }: { src?: string; title?: string; artist?: string }) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [currentTime, setCurrentTime] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [volume, setVolume] = React.useState(0.8);
    const audioRef = React.useRef<HTMLAudioElement>(null);

    React.useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            void audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;

        const newTime = parseFloat(e.target.value);
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;

        const newVolume = parseFloat(e.target.value);
        audio.volume = newVolume;
        setVolume(newVolume);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!src) {
        return (
            <div className="my-6 p-6 bg-gradient-to-r from-purple-500/10 to-blue-600/10 rounded-lg border border-purple-500/20">
                <div className="text-center">
                    <div className="text-3xl mb-2">🎵</div>
                    <h4 className="font-medium mb-2">Audio Player</h4>
                    <p className="text-sm text-muted-foreground">
                        {title && artist ? `${title} by ${artist}` : 'Custom audio player component'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        Audio file would be loaded here
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-6 p-4 bg-gradient-to-r from-purple-500/5 to-blue-600/5 rounded-lg border">
            <audio ref={audioRef} src={src} preload="metadata" />

            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    className="flex-shrink-0"
                >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                <div className="flex-1">
                    {(title || artist) && (
                        <div className="mb-2">
                            <p className="text-sm font-medium">{title || 'Untitled'}</p>
                            {artist && <p className="text-xs text-muted-foreground">{artist}</p>}
                        </div>
                    )}

                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="flex-1 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                        />
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
}

function SpectrumChart() {
    return (
        <div className="my-6 p-6 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-lg border border-blue-500/20">
            <div className="text-center mb-4">
                <div className="text-3xl mb-2">📊</div>
                <h4 className="font-medium">Audio Spectrum Display</h4>
            </div>
            <div className="h-32 bg-black/20 rounded border flex items-end justify-center space-x-1 p-2">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-gradient-to-t from-blue-500 to-purple-600 rounded-sm"
                        style={{
                            height: `${Math.random() * 80 + 20}%`,
                            width: '8px'
                        }}
                    />
                ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
                Interactive frequency spectrum analyzer
            </p>
        </div>
    );
}

function WaveformDisplay({ file }: { file: string }) {
    return (
        <div className="my-6 p-6 bg-gradient-to-r from-green-500/10 to-blue-600/10 rounded-lg border border-green-500/20">
            <div className="text-center mb-4">
                <div className="text-3xl mb-2">🎵</div>
                <h4 className="font-medium">Waveform: {file}</h4>
            </div>
            <div className="h-24 bg-black/20 rounded border flex items-center justify-center">
                <svg className="w-full h-16" viewBox="0 0 400 64">
                    {Array.from({ length: 80 }).map((_, i) => (
                        <rect
                            key={i}
                            x={i * 5}
                            y={32 - Math.random() * 30}
                            width="3"
                            height={Math.random() * 60}
                            className="fill-green-500"
                        />
                    ))}
                </svg>
            </div>
            <div className="flex items-center justify-center mt-4 space-x-2">
                <Button size="sm" variant="outline">▶️</Button>
                <Button size="sm" variant="outline">⏸️</Button>
                <Button size="sm" variant="outline">⏹️</Button>
            </div>
        </div>
    );
}

function YouTubeEmbed({ id, width, height }: { id: string; width?: number; height?: number }) {
    const containerStyle = width && height
        ? { width: `${width}px`, height: `${height}px`, maxWidth: '100%' }
        : {};

    const containerClass = width && height
        ? "my-6 mx-auto"
        : "my-6";

    return (
        <div className={containerClass} style={containerStyle}>
            <div className={width && height ? "w-full h-full rounded-lg overflow-hidden border shadow-lg" : "aspect-video rounded-lg overflow-hidden border shadow-lg"}>
                <iframe
                    src={`https://www.youtube.com/embed/${id}?autoplay=0&rel=0&modestbranding=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    loading="lazy"
                />
            </div>
        </div>
    );
}

function VimeoEmbed({ id }: { id: string }) {
    return (
        <div className="my-6">
            <div className="aspect-video rounded-lg overflow-hidden border shadow-lg">
                <iframe
                    src={`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`}
                    title="Vimeo video player"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    loading="lazy"
                />
            </div>
        </div>
    );
}

function SoundCloudEmbed({ id }: { id: string }) {
    return (
        <div className="my-6">
            <div className="rounded-lg overflow-hidden border shadow-lg">
                <iframe
                    width="100%"
                    height="166"
                    scrolling="no"
                    frameBorder="no"
                    allow="autoplay"
                    src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/${id}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                    className="w-full"
                    loading="lazy"
                />
            </div>
        </div>
    );
}

function SpotifyEmbed({ id }: { id: string }) {
    // Parse the Spotify ID to determine type (track, album, playlist, etc.)
    const parts = id.split('/');
    const type = parts[0] || 'track';
    const spotifyId = parts[1] || id;

    return (
        <div className="my-6">
            <div className="rounded-lg overflow-hidden border shadow-lg">
                <iframe
                    src={`https://open.spotify.com/embed/${type}/${spotifyId}?utm_source=generator&theme=0`}
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="w-full"
                />
            </div>
        </div>
    );
}

function TwitterEmbed({ id }: { id: string }) {
    return (
        <div className="my-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="text-center">
                <div className="text-2xl mb-2">🐦</div>
                <p className="text-sm text-muted-foreground">Twitter Embed: {id}</p>
            </div>
        </div>
    );
}

function InstagramEmbed({ id }: { id: string }) {
    return (
        <div className="my-6 p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
            <div className="text-center">
                <div className="text-2xl mb-2">📷</div>
                <p className="text-sm text-muted-foreground">Instagram Post: {id}</p>
            </div>
        </div>
    );
}

function CTAButton({ type, text, url }: { type: string; text: string; url: string }) {
    return (
        <div className="my-6 text-center">
            <Button
                asChild
                size="lg"
                variant={type === 'primary' ? 'default' : 'outline'}
                className={type === 'primary' ? 'bg-gradient-to-r from-[#D247BF] to-[#FF6B35] hover:from-[#D247BF]/90 hover:to-[#FF6B35]/90' : ''}
            >
                <a href={url} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            </Button>
        </div>
    );
}

// Data Visualization Widgets

function ChartWidget({ code }: { code: string }) {
    const [config, setConfig] = React.useState<{
        type: 'bar' | 'line' | 'pie' | 'doughnut';
        data: number[];
        labels: string[];
        title?: string;
        colors?: string[];
    } | null>(null);
    const [EChartsReact, setEChartsReact] = React.useState<any>(null);

    // Load ECharts dynamically
    React.useEffect(() => {
        import('echarts-for-react').then((module) => {
            setEChartsReact(() => module.default);
        });
    }, []);

    React.useEffect(() => {
        try {
            const lines = code.split('\n');
            const parsed: any = {};

            lines.forEach(line => {
                const match = line.match(/^(\w+):\s*(.+)$/);
                if (match && match[1] && match[2]) {
                    const key = match[1];
                    const value = match[2];
                    if (key === 'data' || key === 'labels' || key === 'colors') {
                        parsed[key] = JSON.parse(value);
                    } else {
                        parsed[key] = value;
                    }
                }
            });

            setConfig({
                type: parsed.type || 'bar',
                data: parsed.data || [],
                labels: parsed.labels || [],
                title: parsed.title,
                colors: parsed.colors
            });
        } catch (e) {
            console.error('Failed to parse chart config:', e);
        }
    }, [code]);

    if (!config || !EChartsReact) return null;

    const defaultColors = ['#D247BF', '#FF6B35', '#4F46E5', '#10B981', '#F59E0B', '#EF4444'];
    const chartColors = config.colors || defaultColors;

    // Build ECharts option based on chart type
    const getOption = () => {
        const baseOption = {
            title: config.title ? {
                text: config.title,
                left: 'center',
                textStyle: {
                    fontSize: 18,
                    fontWeight: 600
                }
            } : undefined,
            tooltip: {
                trigger: config.type === 'pie' || config.type === 'doughnut' ? 'item' : 'axis',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: 'transparent',
                textStyle: {
                    color: '#fff'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: config.title ? '15%' : '10%',
                containLabel: true
            }
        };

        if (config.type === 'bar') {
            return {
                ...baseOption,
                xAxis: {
                    type: 'category',
                    data: config.labels
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: config.data,
                    type: 'bar',
                    itemStyle: {
                        color: (params: any) => chartColors[params.dataIndex % chartColors.length],
                        borderRadius: [4, 4, 0, 0]
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.3)'
                        }
                    }
                }]
            };
        }

        if (config.type === 'line') {
            return {
                ...baseOption,
                xAxis: {
                    type: 'category',
                    data: config.labels
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: config.data,
                    type: 'line',
                    smooth: true,
                    lineStyle: {
                        color: chartColors[0],
                        width: 3
                    },
                    itemStyle: {
                        color: chartColors[0]
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: chartColors[0] + '40'
                            }, {
                                offset: 1,
                                color: chartColors[0] + '00'
                            }]
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.3)'
                        }
                    }
                }]
            };
        }

        if (config.type === 'pie' || config.type === 'doughnut') {
            return {
                ...baseOption,
                legend: {
                    orient: 'vertical',
                    right: 10,
                    top: 'center'
                },
                series: [{
                    type: 'pie',
                    radius: config.type === 'doughnut' ? ['40%', '70%'] : '70%',
                    center: ['40%', '50%'],
                    data: config.data.map((value, i) => ({
                        value,
                        name: config.labels[i] || `Item ${i + 1}`,
                        itemStyle: {
                            color: chartColors[i % chartColors.length]
                        }
                    })),
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };
        }

        return baseOption;
    };

    return (
        <div className="my-6 p-6 bg-gradient-to-br from-muted/10 to-muted/5 rounded-lg border">
            <EChartsReact
                option={getOption()}
                style={{ height: '400px' }}
                opts={{ renderer: 'svg' }}
            />
        </div>
    );
}

function TimelineWidget({ code }: { code: string }) {
    const [items, setItems] = React.useState<Array<{ title: string; cardTitle: string; cardDetailedText?: string }>>([]);
    const [Chrono, setChrono] = React.useState<any>(null);

    // Load React-Chrono dynamically
    React.useEffect(() => {
        import('react-chrono').then((module) => {
            setChrono(() => module.Chrono);
        });
    }, []);

    React.useEffect(() => {
        const parsed = code.split('\n')
            .filter(line => line.trim().startsWith('-'))
            .map(line => {
                const match = line.match(/^-\s*(.+?):\s*(.+)$/);
                if (match && match[1] && match[2]) {
                    return {
                        title: match[1].trim(),
                        cardTitle: match[1].trim(),
                        cardDetailedText: match[2].trim()
                    };
                }
                return null;
            })
            .filter(Boolean) as Array<{ title: string; cardTitle: string; cardDetailedText?: string }>;

        setItems(parsed);
    }, [code]);

    if (!Chrono || items.length === 0) return null;

    return (
        <div className="my-6 p-6 bg-gradient-to-br from-muted/10 to-muted/5 rounded-lg border">
            <Chrono
                items={items}
                mode="VERTICAL"
                theme={{
                    primary: '#D247BF',
                    secondary: '#FF6B35',
                    cardBgColor: 'hsl(var(--muted) / 0.2)',
                    cardForeColor: 'hsl(var(--foreground))',
                    titleColor: 'hsl(var(--primary))',
                    titleColorActive: 'hsl(var(--primary))'
                }}
                cardHeight={100}
                hideControls
                disableClickOnCircle
                useReadMore={false}
                fontSizes={{
                    cardSubtitle: '0.85rem',
                    cardText: '0.9rem',
                    cardTitle: '1rem',
                    title: '0.9rem'
                }}
            />
        </div>
    );
}

function ProgressWidget({ code }: { code: string }) {
    const [bars, setBars] = React.useState<Array<{ label: string; value: number; color?: string }>>([]);

    React.useEffect(() => {
        const lines = code.split('\n');
        const parsed: Array<{ label: string; value: number; color?: string }> = [];

        let currentBar: any = {};
        lines.forEach(line => {
            const labelMatch = line.match(/^label:\s*(.+)$/);
            const valueMatch = line.match(/^value:\s*(\d+)$/);
            const colorMatch = line.match(/^color:\s*(.+)$/);

            if (labelMatch && labelMatch[1]) {
                if (currentBar.label) {
                    parsed.push(currentBar);
                }
                currentBar = { label: labelMatch[1], value: 0 };
            } else if (valueMatch && valueMatch[1] && currentBar.label) {
                currentBar.value = parseInt(valueMatch[1], 10);
            } else if (colorMatch && colorMatch[1] && currentBar.label) {
                currentBar.color = colorMatch[1];
            }
        });

        if (currentBar.label) {
            parsed.push(currentBar);
        }

        setBars(parsed);
    }, [code]);

    return (
        <div className="my-6 p-6 bg-gradient-to-br from-muted/10 to-muted/5 rounded-lg border space-y-6">
            {bars.map((bar, i) => (
                <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">{bar.label}</span>
                        <span className="text-sm font-bold text-primary">{bar.value}%</span>
                    </div>
                    <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{
                                width: `${bar.value}%`,
                                background: bar.color || 'linear-gradient(to right, #D247BF, #FF6B35)'
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}