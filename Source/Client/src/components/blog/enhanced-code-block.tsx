"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface EnhancedCodeBlockProps {
  children: React.ReactNode;
  filename?: string;
  language?: string;
  title?: string;
  className?: string;
  showLineNumbers?: boolean;
}


export function EnhancedCodeBlock({
  children,
  filename,
  language,
  title,
  className,
  showLineNumbers = true,
}: EnhancedCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    // Get the text content from the children
    let text = '';
    if (typeof children === 'string') {
      text = children;
    } else if (React.isValidElement(children)) {
      text = (children.props as any)?.children || '';
    } else if (Array.isArray(children)) {
      text = children.map(child =>
        typeof child === 'string' ? child :
        React.isValidElement(child) ? (child.props as any)?.children || '' : ''
      ).join('');
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const displayTitle = title || filename || language || 'Code';

  // Extract code text for line numbering
  const getCodeText = () => {
    if (typeof children === 'string') return children;
    if (React.isValidElement(children)) return (children.props as any)?.children || '';
    if (Array.isArray(children)) {
      return children.map(child =>
        typeof child === 'string' ? child :
        React.isValidElement(child) ? (child.props as any)?.children || '' : ''
      ).join('');
    }
    return '';
  };

  const codeText = getCodeText();
  const lines = codeText.split('\n');
  const lineCount = lines.length;

  return (
    <div className={cn("relative group my-6", className)}>
      {/* Header */}
      {(filename || language || title) && (
        <div className="flex items-center justify-between bg-muted/50 border border-b-0 rounded-t-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-muted-foreground">
              {displayTitle}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <AnimatePresence>
              {copied ? (
                <motion.div
                  key="copied"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center"
                >
                  <Check className="h-3 w-3 mr-1" />
                  <span className="text-xs">Copied</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  <span className="text-xs">Copy</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      )}

      {/* Code block */}
      <div className="relative">
        <pre
          className={cn(
            "relative overflow-x-auto bg-muted/30 border text-sm",
            filename || language || title ? "rounded-b-lg" : "rounded-lg",
            showLineNumbers ? "p-0" : "p-4"
          )}
        >
          {showLineNumbers ? (
            <div className="flex">
              {/* Line numbers */}
              <div className="select-none py-4 px-3 bg-muted/50 border-r text-muted-foreground font-mono text-xs leading-relaxed">
                {lines.map((_: string, i: number) => (
                  <div key={i} className="text-right">
                    {i + 1}
                  </div>
                ))}
              </div>
              {/* Code */}
              <code className="font-mono flex-1 py-4 px-4 block">{children}</code>
            </div>
          ) : (
            <code className="font-mono">{children}</code>
          )}
        </pre>

        {/* Copy button for blocks without header */}
        {!(filename || language || title) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="absolute top-2 right-2 h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
          >
            <AnimatePresence>
              {copied ? (
                <motion.div
                  key="copied-icon"
                  initial={{ scale: 0.5, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0.5, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="h-3 w-3 text-green-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy-icon"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Copy className="h-3 w-3" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        )}
      </div>
    </div>
  );
}