"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Clock, ArrowLeft, Share, Type, Eye, Minus, Plus, Volume2, VolumeX, RotateCcw, Play, Pause, Square, Loader2, ChevronLeft, ChevronRight, Download, Printer, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/blog";
import MarkdownRenderer from "@/components/blog/markdown-renderer";
import RelatedPosts from "@/components/blog/related-posts";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { TextToSpeechService, TTSStatus } from "@/lib/text-to-speech";
import { useToast } from "@/hooks/use-toast";
import { BackToTop } from "@/components/ui/back-to-top";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface BlogPostClientProps {
    post: BlogPost;
    allPosts?: BlogPost[];
}

export default function BlogPostClient({ post, allPosts = [] }: BlogPostClientProps) {
    const [readingProgress, setReadingProgress] = useState(0);
    const [fontSize, setFontSize] = useState(16);
    const [highContrast, setHighContrast] = useState(false);
    const [ttsStatus, setTtsStatus] = useState<TTSStatus>({
        isPlaying: false,
        isLoading: false,
        currentTime: 0,
        duration: 0
    });
    const [ttsService] = useState(() => new TextToSpeechService((status) => setTtsStatus(status)));
    const [showTTSTip, setShowTTSTip] = useState(false);
    const { toast } = useToast();
    const tBlog = useTranslations("blog");
    const ttsTipShown = useRef(false);

    // Header settings come from post frontmatter (in-browser editor lives on the
    // authenticated site only; the public blog reads frontmatter directly).
    const previewSettings: Record<string, any> | null = null;

    // Get active settings (preview overrides post frontmatter)
    const activeSettings = previewSettings || {
        overlay: post.headerOverlay || "vignette",
        overlayIntensity: post.headerOverlayIntensity || 60,
        textShadow: post.titleTextShadow || "medium",
        textStroke: post.titleTextStroke || false,
        strokeWidth: post.titleTextStrokeWidth || 1,
        strokeColor: post.titleTextStrokeColor || "rgba(0, 0, 0, 0.8)",
        useWhiteText: post.titleUseWhiteText || false,
        backdrop: post.titleBackdrop || false,
        backdropOpacity: post.titleBackdropOpacity || 60,
    };

    // Generate header overlay class and inline style based on active settings
    const getHeaderOverlay = (): { className: string; style?: React.CSSProperties } => {
        const overlayType = activeSettings.overlay;
        const intensity = activeSettings.overlayIntensity;
        const opacityValue = intensity / 100;

        if (overlayType === "none") return { className: "" };

        switch (overlayType) {
            case "light":
                return { className: `bg-white/${Math.round(opacityValue * 100)}` };
            case "dark":
                return { className: `bg-black/${Math.round(opacityValue * 100)}` };
            case "vignette":
                return {
                    className: `bg-gradient-to-t from-black/${Math.round(opacityValue * 100)} via-black/${Math.round(opacityValue * 0.3 * 100)} to-transparent`
                };
            case "radial":
                return {
                    className: "",
                    style: {
                        background: `radial-gradient(circle at center, transparent 0%, transparent 20%, rgba(0, 0, 0, ${opacityValue * 0.4}) 50%, rgba(0, 0, 0, ${opacityValue}) 100%)`
                    }
                };
            default:
                return {
                    className: `bg-gradient-to-t from-black/${Math.round(opacityValue * 100)} via-black/${Math.round(opacityValue * 0.3 * 100)} to-transparent`
                };
        }
    };

    // Generate title text styling based on active settings
    const getTitleStyle = (): React.CSSProperties => {
        const style: React.CSSProperties = {};

        // Text shadow
        const shadowType = activeSettings.textShadow;
        if (shadowType !== "none") {
            const shadows: Record<string, string> = {
                soft: "0 2px 4px rgba(0, 0, 0, 0.3)",
                medium: "0 2px 8px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)",
                hard: "0 4px 6px rgba(0, 0, 0, 0.7), 0 2px 4px rgba(0, 0, 0, 0.9)",
                glow: "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 2px 4px rgba(0, 0, 0, 0.5)"
            };
            style.textShadow = shadows[shadowType];
        }

        // Text stroke
        if (activeSettings.textStroke) {
            const strokeWidth = activeSettings.strokeWidth;
            const strokeColor = activeSettings.strokeColor;
            style.WebkitTextStroke = `${strokeWidth}px ${strokeColor}`;
            style.paintOrder = "stroke fill";
        }

        return style;
    };

    // Find adjacent posts
    const currentIndex = allPosts.findIndex(p => p.slug === post.slug);
    const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrolled / maxHeight) * 100;
            setReadingProgress(Math.min(100, Math.max(0, progress)));
        };

        window.addEventListener('scroll', handleScroll);

        // Show TTS tip on first visit (ref guards against React strict mode double-fire)
        const hasSeenTTSTip = localStorage.getItem('hasSeenTTSTip');
        if (!hasSeenTTSTip && !ttsTipShown.current) {
            ttsTipShown.current = true;
            setTimeout(() => {
                toast({
                    title: "💡 Tip: Listen to articles!",
                    description: "Click the speaker icon above to have this article read aloud by our AI narrator. Perfect for multitasking!",
                    duration: 8000,
                });
                localStorage.setItem('hasSeenTTSTip', 'true');
            }, 3000); // Show after 3 seconds
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            // Clean up text-to-speech on unmount
            ttsService.stop();
        };
    }, [toast]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
            } catch (error) {
                console.error('Error copying to clipboard:', error);
            }
        }
    };

    const handleReadAloud = async () => {
        if (ttsStatus.isPlaying) {
            // Pause reading
            ttsService.pause();
        } else if (ttsStatus.currentTime > 0 && ttsStatus.duration > 0) {
            // Resume reading
            ttsService.play();
        } else {
            // Start reading with better TTS
            try {
                // Create a more natural text to read, focusing on the key content
                const titleText = post.title;
                const excerptText = post.excerpt;
                // Limit content to a reasonable length for TTS
                const contentPreview = post.content.substring(0, 3000);

                const textToRead = `${titleText}. ${excerptText}. ${contentPreview}${post.content.length > 3000 ? '...' : ''}`;

                console.log('Starting TTS with text length:', textToRead.length);

                await ttsService.speak(textToRead, {
                    speed: 0.9,
                    stability: 0.6
                });
            } catch (error) {
                console.error('Text-to-speech error:', error);
                // Show user-friendly error message
                alert('Unable to read article aloud. Please check your internet connection and try again.');
            }
        }
    };

    const handleStopReading = () => {
        ttsService.stop();
    };

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleDownloadMarkdown = () => {
        const markdown = `# ${post.title}\n\n${post.excerpt}\n\n${post.content}`;
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${post.slug}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadPDF = () => {
        window.print();
    };

    const handlePrint = () => {
        window.print();
    };


    // Apply dynamic CSS for font sizing
    useEffect(() => {
        const styleId = 'dynamic-font-styles';
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;

        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        styleElement.textContent = `
            .article-content p, .article-content li, .article-content span, .article-content code:not(pre code) {
                font-size: ${fontSize}px !important;
                line-height: ${fontSize < 16 ? '1.75' : fontSize < 18 ? '1.8' : '1.85'} !important;
            }
            .article-content p {
                margin-bottom: 1.5em !important;
            }
            .article-content h1 {
                font-size: ${Math.max(fontSize * 2.5, 36)}px !important;
                line-height: 1.2 !important;
                margin-top: 2em !important;
                margin-bottom: 0.75em !important;
                font-weight: 700 !important;
                letter-spacing: -0.02em !important;
            }
            .article-content h2 {
                font-size: ${Math.max(fontSize * 2, 28)}px !important;
                line-height: 1.3 !important;
                margin-top: 1.75em !important;
                margin-bottom: 0.65em !important;
                font-weight: 700 !important;
                letter-spacing: -0.01em !important;
            }
            .article-content h3 {
                font-size: ${Math.max(fontSize * 1.5, 24)}px !important;
                line-height: 1.4 !important;
                margin-top: 1.5em !important;
                margin-bottom: 0.6em !important;
                font-weight: 600 !important;
            }
            .article-content h4, .article-content h5, .article-content h6 {
                font-size: ${Math.max(fontSize * 1.25, 20)}px !important;
                line-height: 1.4 !important;
                margin-top: 1.25em !important;
                margin-bottom: 0.5em !important;
                font-weight: 600 !important;
            }
            .article-content ul, .article-content ol {
                margin-top: 1em !important;
                margin-bottom: 1.5em !important;
                padding-left: 1.75em !important;
            }
            .article-content li {
                margin-bottom: 0.5em !important;
            }
        `;

        return () => {
            if (styleElement) {
                styleElement.remove();
            }
        };
    }, [fontSize]);

    return (
        <div className="min-h-screen">
            <div aria-hidden="true" className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-muted/10 to-muted/30 z-50 shadow-sm">
                <motion.div
                    className="h-full bg-gradient-brand shadow-lg shadow-primary/20"
                    style={{ width: `${readingProgress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${readingProgress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                />
            </div>

            {/* Hero Section */}
            <div className="relative">
                <div className="relative h-56 md:h-72 overflow-hidden">
                    <Image
                        src={post.coverImage || "/img/space-bg.jpg"}
                        alt=""
                        fill
                        className="object-cover"
                        priority
                    />
                    {(() => {
                        const overlay = getHeaderOverlay();
                        return overlay.className || overlay.style ? (
                            <div className={`absolute inset-0 ${overlay.className}`} style={overlay.style} />
                        ) : null;
                    })()}
                </div>

                <div className="absolute inset-0 flex items-center">
                    <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                                {activeSettings.backdrop && (
                                    <span
                                        className="inline-block px-4 py-2 rounded"
                                        style={{
                                            backgroundColor: `rgba(0, 0, 0, ${activeSettings.backdropOpacity / 100})`
                                        }}
                                    >
                                        <span
                                            className={activeSettings.useWhiteText ? "text-white" : "text-gradient-brand"}
                                            style={getTitleStyle()}
                                        >
                                            {post.title}
                                        </span>
                                    </span>
                                )}
                                {!activeSettings.backdrop && (
                                    <span
                                        className={activeSettings.useWhiteText ? "text-white" : "text-gradient-brand"}
                                        style={getTitleStyle()}
                                    >
                                        {post.title}
                                    </span>
                                )}
                            </h1>

                            <div className="flex items-center gap-4 text-white/80 mb-2">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={post.author.avatar || "/assets/manifesto-ico.svg"}
                                        alt=""
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            if (target.src !== "/assets/manifesto-ico.svg") {
                                                target.src = "/assets/manifesto-ico.svg";
                                            }
                                        }}
                                    />
                                    <span className="font-medium">{post.author.name}</span>
                                </div>
                                <Separator orientation="vertical" className="h-4" />
                                <div className="flex items-center gap-1">
                                    <CalendarDays className="h-4 w-4" />
                                    {new Date(post.publishedAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {post.readingTime} min read
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <motion.div key={tag} whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05, y: -2 }}>
                                        <Badge className="bg-background/20 backdrop-blur-xl text-white dark:text-slate-200 border-white/30 dark:border-slate-400/40 hover:bg-background/30 dark:hover:bg-background/40 shadow-lg drop-shadow-lg px-3 py-1 transition-all duration-200">
                                            {tag}
                                        </Badge>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {post.aiTranslated && (
                <div className="mx-auto w-full max-w-7xl px-4 pt-4 md:px-6">
                    <p className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-600 dark:text-amber-200/90">
                        <Languages className="h-4 w-4 shrink-0" />
                        {tBlog("machineTranslated")}
                    </p>
                </div>
            )}

            {/* Navigation Toolbar */}
            <TooltipProvider>
            <div className="sticky top-16 md:top-16 z-30 border-y border-border/40 bg-muted/40 backdrop-blur-[20px] shadow-lg shadow-black/10 supports-[backdrop-filter]:bg-muted/40 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:pointer-events-none relative">
                <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <motion.div whileTap={{ scale: 0.95 }}>
                                <Button variant="ghost" size="sm" className="group" asChild>
                                    <Link href="/blog">
                                        <motion.div
                                            whileHover={{ x: -2 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                            className="inline-flex items-center"
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                        </motion.div>
                                        Back to Blog
                                    </Link>
                                </Button>
                            </motion.div>
                            <div className="hidden md:block text-sm font-normal text-muted-foreground truncate max-w-xs">
                                {post.title}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Previous/Next Navigation */}
                            <div className="hidden md:flex items-center gap-1">
                                {previousPost && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <motion.div whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                    aria-label={`Previous: ${previousPost.title}`}
                                                >
                                                    <Link href={`/blog/${previousPost.slug}`}>
                                                        <motion.div
                                                            whileHover={{ x: -2 }}
                                                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                            className="inline-flex items-center"
                                                        >
                                                            <ChevronLeft className="h-3 w-3 mr-1" aria-hidden="true" />
                                                        </motion.div>
                                                        <span className="hidden lg:inline">Previous</span>
                                                    </Link>
                                                </Button>
                                            </motion.div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs">Previous: {previousPost.title}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                                {nextPost && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <motion.div whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                    aria-label={`Next: ${nextPost.title}`}
                                                >
                                                    <Link href={`/blog/${nextPost.slug}`}>
                                                        <span className="hidden lg:inline">Next</span>
                                                        <motion.div
                                                            whileHover={{ x: 2 }}
                                                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                            className="inline-flex items-center"
                                                        >
                                                            <ChevronRight className="h-3 w-3 ml-1" aria-hidden="true" />
                                                        </motion.div>
                                                    </Link>
                                                </Button>
                                            </motion.div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs">Next: {nextPost.title}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </div>

                            {/* Separator */}
                            <Separator orientation="vertical" className="hidden md:block h-6" />

                            {/* Download & Print Controls */}
                            <div className="hidden sm:flex items-center gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <motion.div whileTap={{ scale: 0.9 }}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleDownloadMarkdown}
                                                aria-label="Download as Markdown"
                                            >
                                                <Download className="h-3 w-3" aria-hidden="true" />
                                                <span className="sr-only">Download Markdown</span>
                                            </Button>
                                        </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">Download Markdown</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <motion.div whileTap={{ scale: 0.9 }}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handlePrint}
                                                aria-label="Print or save as PDF"
                                            >
                                                <Printer className="h-3 w-3" aria-hidden="true" />
                                                <span className="sr-only">Print / Save as PDF</span>
                                            </Button>
                                        </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">Print / Save as PDF</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>

                            {/* Separator */}
                            <Separator orientation="vertical" className="hidden md:block h-6" />

                            {/* Font Size Controls */}
                            <div className="hidden md:flex items-center gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <motion.div whileTap={{ scale: 0.9 }}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                                                disabled={fontSize <= 12}
                                                aria-label="Decrease font size"
                                            >
                                                <Minus className="h-3 w-3" aria-hidden="true" />
                                                <span className="sr-only">Decrease font size</span>
                                            </Button>
                                        </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">Decrease font size</p>
                                    </TooltipContent>
                                </Tooltip>

                                {/* Font Size Display and Reset */}
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-muted-foreground px-1" aria-live="polite">{fontSize}px</span>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <motion.div whileTap={{ scale: 0.9 }}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setFontSize(16)}
                                                    disabled={fontSize === 16}
                                                    aria-label="Reset font size to default"
                                                >
                                                    <motion.div
                                                        key={fontSize}
                                                        initial={{ rotate: -180 }}
                                                        animate={{ rotate: 0 }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                                    >
                                                        <RotateCcw className="h-3 w-3" aria-hidden="true" />
                                                    </motion.div>
                                                    <span className="sr-only">Reset to default size (16px)</span>
                                                </Button>
                                            </motion.div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs">Reset to default (16px)</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <motion.div whileTap={{ scale: 0.9 }}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setFontSize(Math.min(28, fontSize + 1))}
                                                disabled={fontSize >= 28}
                                                aria-label="Increase font size"
                                            >
                                                <Plus className="h-3 w-3" aria-hidden="true" />
                                                <span className="sr-only">Increase font size</span>
                                            </Button>
                                        </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">Increase font size</p>
                                    </TooltipContent>
                                </Tooltip>

                                {/* Font Size Presets */}
                                <div className="flex items-center gap-1 ml-2" role="group" aria-label="Font size presets">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <motion.div whileTap={{ scale: 0.9 }}>
                                                <Button
                                                    variant={fontSize === 14 ? "secondary" : "ghost"}
                                                    size="sm"
                                                    onClick={() => setFontSize(14)}
                                                    aria-label="Set small text (14px)"
                                                    aria-pressed={fontSize === 14}
                                                    className="h-6 w-8 text-xs"
                                                >
                                                    S
                                                </Button>
                                            </motion.div>
                                        </TooltipTrigger>
                                        <TooltipContent><p className="text-xs">Small (14px)</p></TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <motion.div whileTap={{ scale: 0.9 }}>
                                                <Button
                                                    variant={fontSize === 16 ? "secondary" : "ghost"}
                                                    size="sm"
                                                    onClick={() => setFontSize(16)}
                                                    aria-label="Set medium text (16px)"
                                                    aria-pressed={fontSize === 16}
                                                    className="h-6 w-8 text-xs"
                                                >
                                                    M
                                                </Button>
                                            </motion.div>
                                        </TooltipTrigger>
                                        <TooltipContent><p className="text-xs">Medium (16px)</p></TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <motion.div whileTap={{ scale: 0.9 }}>
                                                <Button
                                                    variant={fontSize === 18 ? "secondary" : "ghost"}
                                                    size="sm"
                                                    onClick={() => setFontSize(18)}
                                                    aria-label="Set large text (18px)"
                                                    aria-pressed={fontSize === 18}
                                                    className="h-6 w-8 text-xs"
                                                >
                                                    L
                                                </Button>
                                            </motion.div>
                                        </TooltipTrigger>
                                        <TooltipContent><p className="text-xs">Large (18px)</p></TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <motion.div whileTap={{ scale: 0.9 }}>
                                                <Button
                                                    variant={fontSize === 22 ? "secondary" : "ghost"}
                                                    size="sm"
                                                    onClick={() => setFontSize(22)}
                                                    aria-label="Set extra large text (22px)"
                                                    aria-pressed={fontSize === 22}
                                                    className="h-6 w-8 text-xs"
                                                >
                                                    XL
                                                </Button>
                                            </motion.div>
                                        </TooltipTrigger>
                                        <TooltipContent><p className="text-xs">Extra Large (22px)</p></TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>

                            {/* Separator */}
                            <Separator orientation="vertical" className="hidden md:block h-6" />

                            {/* High Contrast Toggle */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <motion.div whileTap={{ scale: 0.9 }}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setHighContrast(!highContrast)}
                                            aria-label={highContrast ? "Disable high contrast" : "Enable high contrast"}
                                            aria-pressed={highContrast}
                                            className={highContrast ? "bg-foreground text-background hover:bg-foreground/90" : ""}
                                        >
                                            <motion.div
                                                key={highContrast ? 'on' : 'off'}
                                                initial={{ scale: 0.5, rotate: -90 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                            >
                                                <Eye className="h-3 w-3" aria-hidden="true" />
                                            </motion.div>
                                            <span className="sr-only">Toggle high contrast</span>
                                        </Button>
                                    </motion.div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-xs">{highContrast ? "Disable" : "Enable"} high contrast</p>
                                </TooltipContent>
                            </Tooltip>

                            {/* Separator */}
                            <Separator orientation="vertical" className="h-6" />

                            {/* TTS Controls */}
                            <div className="flex items-center gap-1" role="group" aria-label="Text-to-speech controls">
                                {/* Play/Pause Button */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <motion.div whileTap={{ scale: 0.9 }}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleReadAloud}
                                                disabled={ttsStatus.isLoading}
                                                aria-label={
                                                    ttsStatus.isLoading ? "Loading audio" :
                                                    ttsStatus.isPlaying ? "Pause reading" :
                                                    ttsStatus.currentTime > 0 ? "Resume reading" : "Read article aloud"
                                                }
                                                className={ttsStatus.isPlaying ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
                                            >
                                                <motion.div
                                                    key={ttsStatus.isPlaying ? 'playing' : 'paused'}
                                                    initial={{ scale: 0.5, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                                >
                                                    {ttsStatus.isLoading ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                                                    ) : ttsStatus.isPlaying ? (
                                                        <Pause className="h-3 w-3" aria-hidden="true" />
                                                    ) : ttsStatus.currentTime > 0 ? (
                                                        <Play className="h-3 w-3" aria-hidden="true" />
                                                    ) : (
                                                        <Volume2 className="h-3 w-3" aria-hidden="true" />
                                                    )}
                                                </motion.div>
                                                <span className="sr-only">
                                                    {ttsStatus.isLoading ? "Loading" :
                                                    ttsStatus.isPlaying ? "Pause" :
                                                    ttsStatus.currentTime > 0 ? "Resume" : "Listen"}
                                                </span>
                                            </Button>
                                        </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">
                                            {ttsStatus.isLoading ? "Loading audio..." :
                                            ttsStatus.isPlaying ? "Pause reading" :
                                            ttsStatus.currentTime > 0 ? "Resume reading" : "Listen to article"}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>

                                {/* Stop Button - only show when there's audio loaded */}
                                {(ttsStatus.currentTime > 0 || ttsStatus.isPlaying) && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <motion.div whileTap={{ scale: 0.9 }}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleStopReading}
                                                    aria-label="Stop reading"
                                                >
                                                    <Square className="h-3 w-3" aria-hidden="true" />
                                                    <span className="sr-only">Stop</span>
                                                </Button>
                                            </motion.div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs">Stop reading</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )}

                                {/* Progress indicator - only show when there's audio loaded */}
                                {ttsStatus.duration > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                                        <span>{formatTime(ttsStatus.currentTime)}</span>
                                        <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all duration-300"
                                                style={{ width: `${(ttsStatus.currentTime / ttsStatus.duration) * 100}%` }}
                                            />
                                        </div>
                                        <span>{formatTime(ttsStatus.duration)}</span>
                                    </div>
                                )}

                                {/* Error indicator */}
                                {ttsStatus.error && (
                                    <div className="text-xs text-destructive ml-2" title={ttsStatus.error}>
                                        Error
                                    </div>
                                )}
                            </div>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <motion.div whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="group"
                                            onClick={() => void handleShare()}
                                            aria-label="Share this article"
                                        >
                                            <Share className="h-3 w-3 mr-1" aria-hidden="true" />
                                            Share
                                        </Button>
                                    </motion.div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-xs">Share article</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
            </TooltipProvider>

            {/* Content */}
            <div className="py-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="w-full"
                >
                    <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
                        <div className="flex gap-8 relative">
                            {/* Table of Contents Sidebar */}
                            <aside className="hidden lg:block w-72 flex-shrink-0">
                                <div className="sticky top-24 space-y-4 will-change-transform transition-all duration-300">
                                    <TableOfContents className="bg-background/30 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl p-5 shadow-xl" />
                                </div>
                            </aside>

                            {/* Main Content */}
                            <article
                                className={`flex-1 min-w-0 max-w-3xl ${highContrast ? 'contrast-150 brightness-110' : ''}`}
                                style={{
                                    '--article-font-size': `${fontSize}px`,
                                    fontSize: `${fontSize}px`
                                } as React.CSSProperties}
                            >
                        <div className="bg-gradient-to-r from-muted/30 to-muted/10 border-l-4 border-primary p-8 rounded-r-lg mb-10 shadow-sm">
                            <p
                                className="text-xl md:text-2xl text-foreground leading-[1.7] font-medium italic mb-0"
                                style={{ fontSize: `${Math.max(fontSize * 1.3, 20)}px` }}
                            >
                                {post.excerpt}
                            </p>
                        </div>
                        <div
                            className="article-content prose prose-lg dark:prose-invert max-w-[68ch] [&>*:first-child]:mt-0"
                            style={{
                                fontSize: `${fontSize}px`,
                                lineHeight: fontSize < 18 ? '1.75' : '1.8'
                            }}
                        >
                            {useMemo(() => <MarkdownRenderer content={post.content} />, [post.content])}
                        </div>

                        {/* Related Posts */}
                        {allPosts.length > 0 && (
                            <RelatedPosts
                                currentPost={post}
                                allPosts={allPosts}
                                maxPosts={3}
                                showCategories={true}
                                showTags={true}
                            />
                        )}
                            </article>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Back to Top Button */}
            <BackToTop showAfter={400} />
        </div>
    );
}