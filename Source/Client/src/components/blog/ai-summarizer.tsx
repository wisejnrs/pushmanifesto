"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, AlertCircle, X } from "lucide-react";
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

interface AISummarizerProps {
    content: string;
    title: string;
}

export function AISummarizer({ content, title }: AISummarizerProps) {
    const [summary, setSummary] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);

    async function handleSummarize() {
        setLoading(true);
        setError("");
        setSummary("");

        try {
            // Lazy-load transformers only when needed
            const { pipeline } = await import("@xenova/transformers");

            // Use DistilBART for summarization (smaller, faster)
            const summarizer = await pipeline("summarization", "Xenova/distilbart-cnn-6-6");

            // Strip HTML tags and limit content
            const plainText = content
                .replace(/<[^>]*>/g, " ")
                .replace(/\s+/g, " ")
                .trim()
                .slice(0, 8000); // Limit to 8000 chars for performance

            // Generate summary
            const result = await summarizer(plainText, {
                max_new_tokens: 150,
                min_length: 40,
                do_sample: false,
            });

            const summaryText = Array.isArray(result)
                ? (result[0] as any)?.summary_text || ""
                : (result as any).summary_text || "";

            setSummary(summaryText);
            setIsOpen(true);
        } catch (e: any) {
            console.error("Summarization error:", e);
            setError("Could not generate summary. Your browser may not support this feature or the article is too short.");
            setIsOpen(true);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Button
                onClick={handleSummarize}
                disabled={loading}
                variant="outline"
                size="sm"
                className="w-full group"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        <span className="text-xs">Summarizing...</span>
                    </>
                ) : (
                    <>
                        <Sparkles className="h-3 w-3 mr-2 group-hover:text-primary transition-colors" />
                        <span className="text-xs">Summarize</span>
                    </>
                )}
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            AI-Generated Summary
                        </DialogTitle>
                        <DialogDescription>
                            Summary generated locally in your browser using DistilBART
                        </DialogDescription>
                    </DialogHeader>

                    {error ? (
                        <div className="flex items-start gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    ) : summary ? (
                        <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg">
                            <p className="text-base leading-relaxed text-foreground">
                                {summary}
                            </p>
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>
        </>
    );
}
