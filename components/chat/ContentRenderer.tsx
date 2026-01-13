"use client";
import React from "react";

interface ContentRendererProps {
  content: string;
  type: "text" | "code" | "research" | "report";
  isStreaming?: boolean;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  type,
  isStreaming = false,
}) => {
  if (type === "code") {
    // Detect code blocks
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(
          <p key={`text-${key++}`} className="font-medium text-white">
            {content.substring(lastIndex, match.index)}
          </p>
        );
      }

      // Add code block
      const language = match[1] || "text";
      const code = match[2].trim();
      parts.push(
        <div
          key={`code-${key++}`}
          className="bg-black/30 border border-white/10 rounded-xl p-4 my-2 overflow-x-auto"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50 font-mono">{language}</span>
            <button
              onClick={() => navigator.clipboard.writeText(code)}
              className="text-xs text-white/50 hover:text-white transition-colors"
            >
              Copy
            </button>
          </div>
          <pre className="text-sm text-white/90 font-mono whitespace-pre-wrap">
            <code>{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(
        <p key={`text-${key++}`} className="font-medium text-white">
          {content.substring(lastIndex)}
        </p>
      );
    }

    return <div className="flex flex-col gap-2">{parts}</div>;
  }

  if (type === "research") {
    // Research paper format
    const sections = content.split(/\n(?=\d+\.|\#|##)/);
    return (
      <div className="bg-black/10 border border-white/5 rounded-2xl p-6 space-y-4">
        {sections.map((section, index) => {
          const isHeader = /^(#|##|\d+\.)/.test(section.trim());
          return (
            <div key={index} className={isHeader ? "mb-4" : ""}>
              {isHeader ? (
                <h3 className="text-lg font-bold text-white mb-2">
                  {section.trim()}
                </h3>
              ) : (
                <p className="text-white/90 leading-relaxed">
                  {section.trim()}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (type === "report") {
    // Overview report format
    const lines = content.split("\n");
    return (
      <div className="bg-black/10 border border-white/5 rounded-2xl p-6 space-y-3">
        {lines.map((line, index) => {
          if (line.trim() === "") return <br key={index} />;
          if (line.startsWith("#")) {
            return (
              <h2
                key={index}
                className="text-xl font-bold text-white mt-4 mb-2"
              >
                {line.replace(/^#+\s*/, "")}
              </h2>
            );
          }
          if (line.startsWith("-") || line.startsWith("*")) {
            return (
              <li key={index} className="text-white/90 ml-4 list-disc">
                {line.substring(1).trim()}
              </li>
            );
          }
          return (
            <p key={index} className="text-white/90 leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>
    );
  }

  // Default text rendering - clean and simple like Cursor AI with streaming cursor
  return (
    <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
      {content}
      {isStreaming && (
        <span className="inline-block w-0.5 h-4 bg-white/80 ml-0.5 animate-pulse align-middle" />
      )}
    </div>
  );
};
