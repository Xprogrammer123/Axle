"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
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
  workingStatus?: string;
  activeToolCalls?: ToolCall[];
  completedToolCalls?: ToolCall[]; // Tools that have completed
}

// Gemini-style loader component
const GeminiLoader: React.FC = () => (
  <div className="absolute inset-0 z-10 flex items-center justify-center">
    <motion.div
      className="absolute inset-[-4px] rounded-full"
      style={{
        background:
          "conic-gradient(from 0deg, transparent, #36B460, #ffffff, transparent)",
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
    <motion.div
      className="absolute inset-[-4px] rounded-full opacity-50"
      style={{
        background:
          "conic-gradient(from 180deg, transparent, #ffffffff, #ffffffff, transparent)",
      }}
      animate={{ rotate: -360 }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      }}
    />
    <div className="bg-white z-50 rounded-full size-8"></div>
  </div>
);

// Typing animation hook
const useTypingAnimation = (
  text: string,
  isEnabled: boolean,
  speed: number = 15
) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const previousTextRef = useRef("");

  useEffect(() => {
    // Reset if text changes completely (new message)
    if (
      text !== previousTextRef.current &&
      !text.startsWith(previousTextRef.current)
    ) {
      indexRef.current = 0;
      setDisplayedText("");
      setIsComplete(false);
    }
    previousTextRef.current = text;

    if (!isEnabled || !text) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    if (indexRef.current >= text.length) {
      setIsComplete(true);
      return;
    }

    const timer = setInterval(() => {
      if (indexRef.current < text.length) {
        // Type multiple characters per tick for faster animation
        const charsToAdd = Math.min(3, text.length - indexRef.current);
        indexRef.current += charsToAdd;
        setDisplayedText(text.slice(0, indexRef.current));
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, isEnabled, speed]);

  return { displayedText, isComplete };
};

export const AgentMessageCard: React.FC<AgentMessageCardProps> = ({
  message,
  contentType = "text",
  isLoading = false,
  streamingContent,
  thinking,
  workingStatus,
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

  // Use typing animation for final content only (not streaming)
  const shouldAnimate = hasContent && !hasStreaming;
  const { displayedText, isComplete } = useTypingAnimation(
    displayContent,
    shouldAnimate,
    12 // Speed in ms per tick
  );

  // For streaming, show as-is; for final content, use animated text
  const textToShow = shouldAnimate ? displayedText : displayContent;

  if (!displayContent && !isLoading && activeToolCalls.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-start gap-3 w-full">
      <div className="bg-white p-2 rounded-full flex-shrink-0 mt-1 relative">
        {/* Gemini-style loader around logo */}
        {isLoading && <GeminiLoader />}
        <Image
          src="/beta/logo.svg"
          alt={"Logo"}
          width={16}
          height={16}
          className="relative z-20"
        />
        {/* Thinking dropdown positioned next to logo */}
        {thinking && thinking.trim() && (
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 translate-x-full ml-2">
            <ThinkingDropdown thinking={thinking} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        {/* Inline status text (what the agent is doing right now) */}
        {workingStatus && workingStatus.trim() && (
          <motion.div
            className="flex items-center gap-2 text-dark/50 text-xs"
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.span
              className="inline-block w-1.5 h-1.5 bg-[#36B460] rounded-full"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
            <span className="text-dark/60">{workingStatus}</span>
          </motion.div>
        )}

        {/* Inline tool text animations during execution */}
        {activeToolCalls.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-dark/50 text-xs">
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
                <span className="text-dark/60">{toolCall.description}</span>
              </span>
            ))}
          </div>
        )}

        {/* Streaming or final content */}
        {isLoading && !displayContent && activeToolCalls.length === 0 ? (
          <motion.div
            className="flex items-center gap-2 text-dark/50 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-dark/40">Thinking...</span>
          </motion.div>
        ) : textToShow ? (
          <motion.div
            className="fade-in"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ContentRenderer
              content={textToShow}
              type={contentType}
              isStreaming={hasStreaming && !hasContent}
            />
            {/* Typing cursor */}
            {shouldAnimate && !isComplete && (
              <motion.span
                className="inline-block w-0.5 h-4 bg-dark/60 ml-0.5 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </motion.div>
        ) : null}

        {/* Tool cards - show AFTER completion */}
        {completedToolCalls.length > 0 && !isLoading && (
          <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-white/5">
            {completedToolCalls.map((toolCall, index) => (
              <motion.div
                key={`completed-${toolCall.type}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.2,
                }}
              >
                <ToolCallCard
                  toolName={toolCall.type}
                  status={toolCall.status || "success"}
                  params={toolCall.params}
                  result={toolCall.result}
                  duration={toolCall.durationMs}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
