"use client";
import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

interface ContentRendererProps {
  content: string;
  type?: "text" | "code" | "research" | "report";
  isStreaming?: boolean;
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1"
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

export const ContentRenderer: React.FC<ContentRendererProps> = memo(({
  content,
  type = "text",
  isStreaming = false,
}) => {
  return (
    <div className={`markdown-content w-full ${isStreaming ? "streaming" : ""}`}>
      <ReactMarkdown
        className="space-y-4 text-[15px] leading-relaxed text-white break-words"
        components={{
          // Headings
          h1: ({ children }) => <h1 className="text-xl font-bold mt-6 mb-3 text-white first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold mt-5 mb-2 text-white">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-semibold mt-4 mb-2 text-white">{children}</h3>,

          // Paragraphs
          p: ({ children }) => <p className="leading-7 mb-4 last:mb-0 text-white/90">{children}</p>,

          // Lists
          ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-4 text-white/90">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 mb-4 text-white/90">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,

          // Links
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

          // Code Blocks & Inline Code
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !String(children).includes("\n");

            if (isInline) {
              return (
                <code className="bg-white/10 px-1.5 py-0.5 rounded text-[13px] font-mono text-white/90 border border-white/5" {...props}>
                  {children}
                </code>
              );
            }

            const language = match ? match[1] : "text";
            const codeString = String(children).replace(/\n$/, "");

            return (
              <div className="rounded-xl overflow-hidden my-4 border border-white/10 bg-[#1e1e1e] shadow-sm group">
                <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-white/5">
                  <span className="text-xs text-white/50 font-mono lowercased select-none">{language}</span>
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

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-white/10 pl-4 py-1 my-4 italic text-white/70 bg-white/[0.02] rounded-r-lg">
              {children}
            </blockquote>
          ),

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-white/10">
              <table className="min-w-full divide-y divide-white/10 text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
          th: ({ children }) => <th className="px-3 py-2 text-left font-semibold text-white/80">{children}</th>,
          td: ({ children }) => <td className="px-3 py-2 border-t border-white/5 text-white/70">{children}</td>,

          // Horizontal Rules
          hr: () => <hr className="my-6 border-white/10" />
        }}
      >
        {content}
      </ReactMarkdown>

      {isStreaming && (
        <motion.span
          className="inline-block w-2 h-4 bg-white/20 ml-1 align-middle rounded-sm"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </div>
  );
});

ContentRenderer.displayName = "ContentRenderer";
