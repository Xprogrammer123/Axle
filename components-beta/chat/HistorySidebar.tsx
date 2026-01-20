"use client";
import React, { useState, useEffect } from "react";
import { ClockIcon, XIcon } from "@phosphor-icons/react";
import { api } from "@/lib/api";

interface Thread {
  _id: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    messages?: Array<{
      role: string;
      content: string;
    }>;
  };
}

interface HistorySidebarProps {
  agentId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectThread: (threadId: string) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  agentId,
  isOpen,
  onClose,
  onSelectThread,
}) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && agentId) {
      fetchHistory();
    }
  }, [isOpen, agentId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await api.getThreads(agentId);
      setThreads(data.threads || []);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getPreview = (thread: Thread) => {
    const messages = thread.metadata?.messages || [];
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      return (
        lastMessage.content.substring(0, 60) +
        (lastMessage.content.length > 60 ? "..." : "")
      );
    }
    return "No messages";
  };

  const getTitle = (thread: Thread) => {
    return thread.title || "Untitled conversation";
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0  z-40 animate-in fade-in"
        onClick={onClose}
      />
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm md:w-80 bg-dark/4 backdrop-blur-xl border-l-2 border-white/10 z-50 animate-in slide-in-from-right-2 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ClockIcon className="text-dark/70 text-lg" />
              <h2 className="text-lg font-semibold text-dark">History</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <XIcon className="text-dark/70 text-lg" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex gap-1">
                  <span className="inline-block w-2 h-2 bg-dark/4 rounded-full animate-pulse" />
                  <span
                    className="inline-block w-2 h-2 bg-dark/4 rounded-full animate-pulse"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="inline-block w-2 h-2 bg-dark/4 rounded-full animate-pulse"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            ) : threads.length === 0 ? (
              <div className="text-center py-8 text-dark/50 text-sm">
                No conversations yet
              </div>
            ) : (
              threads.map((thread) => (
                <button
                  key={thread._id}
                  onClick={() => {
                    onSelectThread(thread._id);
                    onClose();
                  }}
                  className="w-full text-left p-3 bg-dark/5 hover:bg-dark/10 border border-white/10 rounded-xl transition-all hover:scale-[1.02] hover:border-white/20 group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-dark group-hover:text-dark/90 transition-colors flex-1">
                      {getTitle(thread)}
                    </h3>
                    <span className="text-xs text-dark/40 group-hover:text-dark/60 transition-colors whitespace-nowrap ml-2">
                      {formatDate(thread.updatedAt)}
                    </span>
                  </div>
                  <p className="text-xs text-dark/60 group-hover:text-dark/70 transition-colors line-clamp-2 mt-1">
                    {getPreview(thread)}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
