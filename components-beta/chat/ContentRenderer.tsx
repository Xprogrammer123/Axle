"use client";
import React, { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import remarkGfm from "remark-gfm";

interface ContentRendererProps {
  content: string;
  type?: "text" | "code" | "research" | "report";
  isStreaming?: boolean;
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs font-medium text-dark/50 hover:font-medium text-dark transition-colors flex items-center gap-1"
    >
      {copied ? (
        <>
          <span className="inline-block w-3 h-3 text-green-500">✓</span> Copied
        </>
      ) : (
        "Copy completion"
      )}
    </button>
  );
};

export const ContentRenderer: React.FC<ContentRendererProps> = memo(
  ({ content, type = "text", isStreaming = false }) => {
    // stronger Markdown normalizer for streaming content
    const normalizeMarkdown = (text: string) => {
      return text
        // Ensure paragraph breaks after sentences
        .replace(/([.!?])\s*(\* |- |\d+\.)/g, "$1\n\n$2")
        // Ensure lists always start after blank line
        .replace(/([^\n])\n(\s*[-*+]\s+)/g, "$1\n\n$2")
        // Collapse 3+ newlines → 2
        .replace(/\n{3,}/g, "\n\n");
    };

    return (
      <div className={`markdown-content w-full ${isStreaming ? "streaming" : ""}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className="space-y-4 text-[15px] leading-relaxed font-medium text-dark break-words"
          components={{
            h1: ({ children }) => (
              <h1 className="text-xl font-bold mt-6 mb-3 font-medium text-dark first:mt-0">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg font-bold mt-5 mb-2 font-medium text-dark">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-semibold mt-4 mb-2 font-medium text-dark">{children}</h3>
            ),
            p: ({ children }) => <p className="leading-7 mb-4 last:mb-0 font-medium text-dark/90">{children}</p>,
            ul: ({ children }) => (
              <ul className="list-disc pl-4 space-y-1 mb-4 font-medium text-dark/90">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-4 space-y-1 mb-4 font-medium text-dark/90">{children}</ol>
            ),
            li: ({ children }) => <li className="pl-1">{children}</li>,
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors font-medium break-all"
              >
                {children}
              </a>
            ),
            code: ({ node, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              const isInline = !match && !String(children).includes("\n");

              if (isInline) {
                return (
                  <code
                    className="bg-white/10 px-1.5 py-0.5 rounded text-[13px] font-mono font-medium text-dark/90 border border-white/5"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              const language = match ? match[1] : "text";
              const codeString = String(children).replace(/\n$/, "");

              return (
                <div className="rounded-xl overflow-hidden my-4 border border-white/10 bg-[#1e1e1e] shadow-sm group">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-white/5">
                    <span className="text-xs font-medium text-dark/50 font-mono lowercase select-none">{language}</span>
                    <CopyButton text={codeString} />
                  </div>
                  <div className="overflow-x-auto p-4">
                    <pre className="text-sm font-mono leading-relaxed text-[#d4d4d4] m-0 min-w-full">
                      <code>{children}</code>
                    </pre>
                  </div>
                </div>
              );
            },
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-white/10 pl-4 py-1 my-4 italic font-medium text-dark/70 bg-white/[0.02] rounded-r-lg">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-4 rounded-lg border border-white/10">
                <table className="min-w-full divide-y divide-white/10 text-sm">{children}</table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
            th: ({ children }) => <th className="px-3 py-2 text-left font-semibold font-medium text-dark/80">{children}</th>,
            td: ({ children }) => <td className="px-3 py-2 border-t border-white/5 font-medium text-dark/70">{children}</td>,
            hr: () => <hr className="my-6 border-white/10" />,
          }}
        >
          {normalizeMarkdown(content)}
        </ReactMarkdown>

        {isStreaming && (
          <motion.span
            className="inline-block w-2 h-4 bg-white/20 ml-1 align-middle rounded-sm"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 1.0, repeat: Infinity }}
          />
        )}
      </div>
    );
  }
);

ContentRenderer.displayName = "ContentRenderer";
