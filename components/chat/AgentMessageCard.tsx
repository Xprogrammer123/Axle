"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ContentRenderer } from "./ContentRenderer";
import { ToolCallCard } from "./ToolCallCard";
import { ThinkingDropdown } from "./ThinkingDropdown";

interface ToolCall {
  type: string;
  description: string;
  params?: Record<string, any>;
  status?: "running" | "success" | "failed";
  result?: any;
  durationMs?: number;
}

interface AgentMessageCardProps {
  message: string;
  contentType?: "text" | "code" | "research" | "report";
  isLoading?: boolean;
  streamingContent?: string;
  thinking?: string;
  activeToolCalls?: ToolCall[];
  completedToolCalls?: ToolCall[]; // Tools that have completed
}

export const AgentMessageCard: React.FC<AgentMessageCardProps> = ({
  message,
  contentType = "text",
  isLoading = false,
  streamingContent,
  thinking,
  activeToolCalls = [],
  completedToolCalls = [],
}) => {
  const hasContent = message && message.trim().length > 0;
  const hasStreaming = streamingContent && streamingContent.trim().length > 0;
  const displayContent = hasContent
    ? message
    : hasStreaming
    ? streamingContent
    : "";
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Streaming animation effect - type out text character by character
  useEffect(() => {
    if (hasStreaming && !hasContent) {
      // For streaming, show text as it arrives (already streamed from backend)
      setDisplayedText(streamingContent || "");
      setIsTyping(true);
    } else if (hasContent) {
      // When final content arrives, show it immediately
      setDisplayedText(message);
      setIsTyping(false);
    } else {
      setDisplayedText("");
      setIsTyping(false);
    }
  }, [streamingContent, message, hasContent, hasStreaming]);

  if (!displayContent && !isLoading && activeToolCalls.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-start gap-3 w-full">
      <div className="bg-black p-2 rounded-full flex-shrink-0 mt-1 relative">
        <Image src="/logo.svg" alt={"Logo"} width={16} height={16} />
        {/* Thinking dropdown positioned next to logo */}
        {thinking && thinking.trim() && (
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 translate-x-full ml-2">
            <ThinkingDropdown thinking={thinking} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        {/* Inline tool text animations during execution */}
        {activeToolCalls.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-white/50 text-xs">
            {activeToolCalls.map((toolCall, index) => (
              <span
                key={`${toolCall.type}-${index}`}
                className="inline-flex items-center gap-1.5 fade-in"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationDuration: "0.2s",
                }}
              >
                <span className="inline-block w-1.5 h-1.5 bg-[#36B460] rounded-full animate-pulse" />
                <span className="text-white/60">{toolCall.description}</span>
              </span>
            ))}
          </div>
        )}

        {/* Streaming or final content */}
        {isLoading && !displayContent && activeToolCalls.length === 0 ? (
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <div className="flex gap-1">
              <span
                className="inline-block w-2 h-2 bg-white/40 rounded-full animate-pulse"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="inline-block w-2 h-2 bg-white/40 rounded-full animate-pulse"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="inline-block w-2 h-2 bg-white/40 rounded-full animate-pulse"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <span>Thinking...</span>
          </div>
        ) : displayContent ? (
          <div
            className="fade-in slide-in-from-bottom-2"
            style={{ animationDuration: "0.2s" }}
          >
            <ContentRenderer
              content={displayedText || displayContent}
              type={contentType}
              isStreaming={hasStreaming && !hasContent}
            />
            {console.log(displayedText)}
            {console.log(displayContent)}
            {console.log(contentType)}
          </div>
        ) : null}

        {/* Tool cards - show AFTER completion */}
        {completedToolCalls.length > 0 && !isLoading && (
          <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-white/5">
            {completedToolCalls.map((toolCall, index) => (
              <div
                key={`completed-${toolCall.type}-${index}`}
                className="fade-in slide-in-from-left-2"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationDuration: "0.2s",
                  animationFillMode: "both",
                }}
              >
                <ToolCallCard
                  toolName={toolCall.type}
                  status={toolCall.status || "success"}
                  params={toolCall.params}
                  result={toolCall.result}
                  duration={toolCall.durationMs}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
