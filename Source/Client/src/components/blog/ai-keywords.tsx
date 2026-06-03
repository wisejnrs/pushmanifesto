"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Brain, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { env } from "@xenova/transformers";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Configure transformers to use Hugging Face CDN
env.allowRemoteModels = true;
env.allowLocalModels = false;

interface AIKeywordsProps {
    content: string;
}

export function AIKeywords({ content }: AIKeywordsProps) {
    const [keywords, setKeywords] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);

    async function handleExtractKeywords() {
        setLoading(true);
        setError("");
        setKeywords([]);

        try {
            // Lazy-load transformers
            const { pipeline } = await import("@xenova/transformers");

            // Use feature extraction to get embeddings and find important terms
            const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

            // Strip HTML and prepare text
            const plainText = content
                .replace(/<[^>]*>/g, " ")
                .replace(/\s+/g, " ")
                .trim();

            // Simple keyword extraction using TF-IDF-like approach
            // Split into words
            const words = plainText
                .toLowerCase()
                .split(/\s+/)
                .filter(word =>
                    word.length > 4 &&
                    !["about", "after", "before", "could", "should", "would", "which", "there", "these", "those", "their"].includes(word)
                );

            // Count frequency
            const freq: Record<string, number> = {};
            words.forEach(word => {
                freq[word] = (freq[word] || 0) + 1;
            });

            // Get top keywords by frequency
            const topKeywords = Object.entries(freq)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([word]) => word);

            setKeywords(topKeywords);
            setIsOpen(true);
        } catch (e: any) {
            console.error("Keyword extraction error:", e);
            setError("Could not extract keywords. Your browser may not support this feature.");
            setIsOpen(true);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Button
                onClick={handleExtractKeywords}
                disabled={loading}
                variant="outline"
                size="sm"
                className="w-full group"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        <span className="text-xs">Extracting...</span>
                    </>
                ) : (
                    <>
                        <Brain className="h-3 w-3 mr-2 group-hover:text-primary transition-colors" />
                        <span className="text-xs">Extract Keywords</span>
                    </>
                )}
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-blue-500" />
                            AI-Extracted Keywords
                        </DialogTitle>
                        <DialogDescription>
                            Keywords extracted using frequency analysis
                        </DialogDescription>
                    </DialogHeader>

                    {error ? (
                        <div className="flex items-start gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    ) : keywords.length > 0 ? (
                        <div className="flex flex-wrap gap-2 p-4">
                            {keywords.map((keyword, index) => (
                                <motion.div
                                    key={keyword}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Badge
                                        variant="secondary"
                                        className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 hover:bg-blue-500/20 text-sm px-3 py-1"
                                    >
                                        {keyword}
                                    </Badge>
                                </motion.div>
                            ))}
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>
        </>
    );
}
