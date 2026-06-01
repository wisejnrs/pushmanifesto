"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy } from "lucide-react";

import "katex/dist/katex.min.css";
import "highlight.js/styles/github.css";
import { MermaidDiagram } from "./mermaid-diagram";

function CodeBlock({ className, children }: { className?: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const text = String(children).replace(/\n$/, "");
  const lang = /language-(\w+)/.exec(className || "")?.[1];

  if (lang === "mermaid") return <MermaidDiagram chart={text} />;
  if (lang === "audio") {
    return <audio controls preload="none" src={text.trim()} className="my-6 w-full" />;
  }
  if (lang === "video") {
    return (
      <video controls preload="none" src={text.trim()} className="my-6 w-full rounded-lg" />
    );
  }

  const onCopy = () => {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group relative">
      <button
        onClick={onCopy}
        aria-label="Copy code"
        className="absolute right-2 top-2 rounded-md border border-slate-200 bg-white/80 p-1.5 text-slate-500 opacity-0 transition hover:text-slate-900 group-hover:opacity-100"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
      <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-a:text-teal-700 prose-pre:bg-transparent prose-pre:p-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, [remarkToc, { tight: true, maxDepth: 3 }]]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSlug,
          [rehypeAutolinkHeadings, { properties: { className: ["anchor"] } }],
          rehypeKatex,
          rehypeHighlight,
        ]}
        components={{
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children, ...props }) => {
            const isBlock = /language-/.test(className || "");
            if (!isBlock) {
              return (
                <code
                  className="rounded bg-teal-50 px-1.5 py-0.5 text-[0.85em] text-teal-800"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return <CodeBlock className={className}>{children}</CodeBlock>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
