"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  DotsThreeVerticalIcon,
  ClockIcon,
  ChatsCircleIcon,
} from "@phosphor-icons/react";
import { AgentInput } from "@/components-beta/AgentInput";
import { MessageBubble } from "@/components-beta/chat/MessageBubble";
import { AgentMessageCard } from "@/components-beta/chat/AgentMessageCard";
import { ThinkingDropdown } from "@/components-beta/chat/ThinkingDropdown";
import { HistorySidebar } from "@/components-beta/chat/HistorySidebar";
import { EditAgentModal } from "@/components/ui/EditAgentModal";
import { api } from "@/lib/api";
import { socketClient } from "@/lib/socket";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  executionId?: string;
  contentType?: "text" | "code" | "research" | "report";
  streamingContent?: string; // For streaming text animation
  thinking?: string; // Agent reasoning/thinking text
  workingStatus?: string; // Inline "what I'm doing" status from execution:status
  activeToolCalls?: Array<{
    type: string;
    description: string;
    params?: Record<string, unknown>;
    status?: "running" | "success" | "failed";
    result?: unknown;
    durationMs?: number;
  }>; // For inline tool text during execution
  completedToolCalls?: Array<{
    type: string;
    description: string;
    params?: Record<string, unknown>;
    status?: "running" | "success" | "failed";
    result?: unknown;
    durationMs?: number;
  }>; // For tool cards after completion
}

const detectContentType = (
  content: string,
): "text" | "code" | "research" | "report" => {
  if (
    content.includes("```") ||
    /function\s+\w+|const\s+\w+\s*=|import\s+/.test(content)
  ) {
    return "code";
  }
  if (
    content.includes("Abstract") ||
    content.includes("Introduction") ||
    content.includes("References")
  ) {
    return "research";
  }
  if (
    content.includes("Overview") ||
    content.includes("Summary") ||
    content.match(/^\d+\./)
  ) {
    return "report";
  }
  return "text";
};

interface Agent {
  _id: string;
  name: string;
  description?: string;
}

interface ThreadSummary {
  _id: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

const Page = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const agentId = params.id as string;
  const [agent, setAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [recentThreads, setRecentThreads] = useState<ThreadSummary[]>([]);
  const [recentThreadsLoading, setRecentThreadsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentExecutionIdRef = useRef<string | null>(null);
  const socketUnsubscribeRef = useRef<(() => void) | null>(null);
  const didAutostartRef = useRef(false);

  const loadThreadIntoChat = React.useCallback(async (threadId: string) => {
    try {
      const thread = await api.getThread(threadId);
      if (thread.thread) {
        setCurrentThreadId(threadId);
        const threadMessages = thread.thread.metadata?.messages || [];
        const chatMessages: ChatMessage[] = threadMessages.map(
          (msg: any, idx: number) => ({
            id: `${threadId}-${idx}`,
            role: msg.role as "user" | "assistant",
            content: msg.content || "",
            timestamp: new Date(
              thread.thread.updatedAt || thread.thread.createdAt,
            ),
          }),
        );
        setMessages(chatMessages);
      }
    } catch (error) {
      console.error("Failed to load thread:", error);
    }
  }, []);

  const fetchRecentThreads = React.useCallback(async () => {
    if (!agentId) return;
    try {
      setRecentThreadsLoading(true);
      const data = await api.getThreads(agentId);
      setRecentThreads((data.threads || []) as ThreadSummary[]);
    } catch (error) {
      console.error("Failed to fetch threads:", error);
      setRecentThreads([]);
    } finally {
      setRecentThreadsLoading(false);
    }
  }, [agentId]);

  // Helper to get tool descriptions - declared early
  const getToolDescription = React.useCallback(
    (toolName: string, params?: Record<string, unknown>): string => {
      const toolLower = toolName.toLowerCase();

      if (toolLower.includes("search") || toolLower.includes("web")) {
        return "Searching web...";
      }
      if (
        toolLower.includes("email") ||
        (toolLower.includes("gmail") && toolLower.includes("send"))
      ) {
        return "Sending email...";
      }
      if (toolLower.includes("github")) {
        if (toolLower.includes("issue")) {
          const title = params?.title as string;
          return `Creating issue${
            title ? `: ${title.substring(0, 30)}...` : "..."
          }`;
        }
        if (toolLower.includes("repo")) {
          const name = params?.name as string;
          return `Creating repository${name ? `: ${name}` : "..."}`;
        }
        if (toolLower.includes("readme") || toolLower.includes("get")) {
          return "Reading repository...";
        }
        if (toolLower.includes("list")) {
          return "Listing repository data...";
        }
        return "Working with GitHub...";
      }
      if (
        toolLower.includes("twitter") ||
        toolLower.includes("post") ||
        toolLower.includes("tweet")
      ) {
        return "Posting to X...";
      }
      if (toolLower.includes("docs") && toolLower.includes("create")) {
        return "Creating document...";
      }
      if (toolLower.includes("calendar") && toolLower.includes("create")) {
        return "Creating calendar event...";
      }
      if (toolLower.includes("read") || toolLower.includes("get")) {
        return "Reading data...";
      }

      // Generic fallback
      return `${toolName.replace(/_/g, " ")}...`;
    },
    [],
  );

  const pollExecution = React.useCallback(
    async (executionId: string) => {
      try {
        const execution = await api.getExecution(executionId);

        // Update the last assistant message with execution data
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastAssistantIndex = newMessages.length - 1;

          if (
            lastAssistantIndex >= 0 &&
            newMessages[lastAssistantIndex].role === "assistant"
          ) {
            const lastMessage = newMessages[lastAssistantIndex];

            // Clean UI - no thoughts or tool calls displayed

            // Update content - always update if execution has aiResponse
            if (execution.aiResponse) {
              lastMessage.content = execution.aiResponse;
              lastMessage.contentType = detectContentType(execution.aiResponse);
              // Clear streaming when final content arrives, but keep tool calls for a moment
              lastMessage.streamingContent = undefined;
              // Don't clear tool calls immediately - let them fade naturally
            } else if (execution.outputPayload?.result) {
              // Fallback to outputPayload.result if aiResponse is not set
              lastMessage.content = execution.outputPayload.result;
              lastMessage.contentType = detectContentType(
                execution.outputPayload.result,
              );
              // Clear streaming when final content arrives
              lastMessage.streamingContent = undefined;
            } else if (execution.status === "failed" && execution.error) {
              // Show natural language error when no response content is present
              lastMessage.content = execution.error;
              lastMessage.contentType = "text";
              // Clear streaming on error
              lastMessage.streamingContent = undefined;
            }

            // After final content, fade out tool calls after a delay
            if (
              execution.status === "success" &&
              lastMessage.content &&
              lastMessage.activeToolCalls
            ) {
              setTimeout(() => {
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastIdx = updated.length - 1;
                  if (lastIdx >= 0 && updated[lastIdx].role === "assistant") {
                    updated[lastIdx].activeToolCalls = undefined;
                  }
                  return updated;
                });
              }, 3000); // Keep tool calls visible for 3 seconds after message
            }

            // Update status based on execution status
            if (execution.status === "running") {
              // Keep showing loading
            } else if (
              execution.status === "success" ||
              execution.status === "failed"
            ) {
              // Stop polling when done
              if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
              }
              setLoading(false);
            }
          }

          return newMessages;
        });

        // Stop polling if execution is complete, but ensure we update the UI first
        if (execution.status === "success" || execution.status === "failed") {
          // Force update the messages one more time to ensure we have the latest data
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastAssistantIndex = newMessages.length - 1;
            if (
              lastAssistantIndex >= 0 &&
              newMessages[lastAssistantIndex].role === "assistant"
            ) {
              const lastMessage = newMessages[lastAssistantIndex];
              if (execution.aiResponse && !lastMessage.content) {
                lastMessage.content = execution.aiResponse;
                lastMessage.contentType = detectContentType(
                  execution.aiResponse,
                );
              } else if (
                execution.outputPayload?.result &&
                !lastMessage.content
              ) {
                lastMessage.content = execution.outputPayload.result;
                lastMessage.contentType = detectContentType(
                  execution.outputPayload.result,
                );
              }
            }
            return newMessages;
          });

          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          setLoading(false);

          // Save messages to thread and generate name
          if (
            currentThreadId &&
            (execution.status === "success" || execution.status === "failed")
          ) {
            setTimeout(async () => {
              try {
                setMessages((currentMsgs) => {
                  const allMessages = currentMsgs
                    .filter((m) => m.role === "user" || m.role === "assistant")
                    .map((m) => ({
                      role: m.role,
                      content: m.content || "",
                    }));

                  // Save to thread asynchronously
                  (async () => {
                    try {
                      const thread = await api.getThread(currentThreadId!);
                      if (thread.thread) {
                        // Generate thread name if it doesn't have one
                        let threadTitle = thread.thread.title;
                        if (!threadTitle && allMessages.length >= 2) {
                          const firstUserMsg = allMessages.find(
                            (m) => m.role === "user",
                          );
                          if (firstUserMsg) {
                            // Simple heuristic: use first few words of first message
                            const words = firstUserMsg.content
                              .split(" ")
                              .slice(0, 5);
                            threadTitle = words.join(" ");
                            if (threadTitle.length > 50) {
                              threadTitle =
                                threadTitle.substring(0, 47) + "...";
                            }
                          }
                        }

                        await api.updateThread(currentThreadId!, {
                          title: threadTitle,
                          metadata: {
                            ...thread.thread.metadata,
                            messages: allMessages,
                          },
                        });
                      }
                    } catch (error) {
                      console.error("Failed to update thread:", error);
                    }
                  })();

                  return currentMsgs;
                });
              } catch (error) {
                console.error("Failed to save messages to thread:", error);
              }
            }, 500);
          }
        }
      } catch (error) {
        console.error("Failed to poll execution:", error);
      }
    },
    [currentThreadId],
  );

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const data = await api.getAgent(agentId);
        setAgent(data.agent);
      } catch (error) {
        console.error("Failed to fetch agent:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load agent";
        if (
          errorMessage.includes("Invalid agent ID") ||
          errorMessage.includes("400")
        ) {
          // Invalid ID format - could show error message to user
          setAgent(null);
        }
      }
    };
    if (agentId) {
      fetchAgent();
    }
  }, [agentId]);

  useEffect(() => {
    if (agentId) {
      fetchRecentThreads();
    }
  }, [agentId, fetchRecentThreads]);

  useEffect(() => {
    const qpThreadId = searchParams.get("threadId");
    if (!qpThreadId) return;
    loadThreadIntoChat(qpThreadId);
  }, [searchParams, loadThreadIntoChat]);

  // Setup socket listeners for real-time updates
  useEffect(() => {
    if (!agentId) return;

    const token = localStorage.getItem("token");
    socketClient.connect(token || undefined);

    const unsubscribe = socketClient.subscribeToAgent(agentId, {
      onExecutionStarted: (data) => {
        if (data.executionId) {
          currentExecutionIdRef.current = data.executionId;
        }
      },
      onStatus: (data) => {
        if (!data?.executionId) return;
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastAssistantIndex = newMessages.length - 1;
          if (
            lastAssistantIndex >= 0 &&
            newMessages[lastAssistantIndex].role === "assistant"
          ) {
            const msg = data.message || data.status;
            if (typeof msg === "string" && msg.trim()) {
              newMessages[lastAssistantIndex].workingStatus = msg;
            }
          }
          return newMessages;
        });
      },
      onActionStarted: (data) => {
        // Add tool call indicator when action starts - use tool cards
        console.log("[SOCKET] Action started:", data);
        if (data.executionId && data.type) {
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastAssistantIndex = newMessages.length - 1;
            if (
              lastAssistantIndex >= 0 &&
              newMessages[lastAssistantIndex].role === "assistant"
            ) {
              if (!newMessages[lastAssistantIndex].activeToolCalls) {
                newMessages[lastAssistantIndex].activeToolCalls = [];
              }
              const params = data.params || data.functionCall?.args || {};
              const toolDescription = getToolDescription(data.type, params);
              // Check if already exists
              const existingIndex = newMessages[
                lastAssistantIndex
              ].activeToolCalls!.findIndex((tc) => tc.type === data.type);
              if (existingIndex === -1) {
                newMessages[lastAssistantIndex].activeToolCalls!.push({
                  type: data.type,
                  description: toolDescription,
                  params: params,
                  status: "running",
                });
                console.log(
                  "[UI] Added tool call:",
                  data.type,
                  newMessages[lastAssistantIndex].activeToolCalls,
                );
              } else {
                // Update existing
                newMessages[lastAssistantIndex].activeToolCalls![
                  existingIndex
                ].status = "running";
              }
            }
            return newMessages;
          });
        }
      },
      onActionCompleted: (data) => {
        // Move tool from active to completed when action completes
        if (data.executionId && data.type) {
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastAssistantIndex = newMessages.length - 1;
            if (
              lastAssistantIndex >= 0 &&
              newMessages[lastAssistantIndex].role === "assistant"
            ) {
              const lastMessage = newMessages[lastAssistantIndex];

              // Remove from activeToolCalls and move to completedToolCalls
              if (lastMessage.activeToolCalls) {
                const toolIndex = lastMessage.activeToolCalls.findIndex(
                  (tc) => tc.type === data.type,
                );
                if (toolIndex >= 0) {
                  const toolCall = lastMessage.activeToolCalls[toolIndex];
                  const result =
                    data.result ||
                    data.functionResponse?.response ||
                    data.output;
                  const isError =
                    data.error ||
                    (result &&
                      typeof result === "object" &&
                      result.success === false);

                  // Move to completedToolCalls
                  if (!lastMessage.completedToolCalls) {
                    lastMessage.completedToolCalls = [];
                  }
                  lastMessage.completedToolCalls.push({
                    ...toolCall,
                    status: isError ? "failed" : "success",
                    result: result,
                    durationMs: data.durationMs,
                  });

                  // Remove from active
                  lastMessage.activeToolCalls = lastMessage.activeToolCalls.filter(
                    (tc) => tc.type !== data.type,
                  );
                }
              }
            }
            return newMessages;
          });

          // Persist tool output into thread metadata as a tool message so the next run can use it.
          // Fire-and-forget: should not block UI.
          if (currentThreadId) {
            setTimeout(async () => {
              try {
                const result =
                  data.result || data.functionResponse?.response || data.output;

                const MAX_TOOL_MESSAGE_CHARS = 8000;
                const safeStringify = (value: unknown) => {
                  try {
                    return JSON.stringify(value, null, 2);
                  } catch {
                    return JSON.stringify(
                      { note: "Unserializable tool result" },
                      null,
                      2,
                    );
                  }
                };

                const truncate = (text: string, maxChars: number) =>
                  text.length <= maxChars
                    ? text
                    : `${text.slice(0, maxChars)}\n...<truncated ${
                        text.length - maxChars
                      } chars>`;

                const compactResult = (() => {
                  // Prefer keeping clear error shape if present.
                  if (
                    result &&
                    typeof result === "object" &&
                    (result as any).success === false
                  ) {
                    return {
                      success: false,
                      error: (result as any).error,
                      needsReauth: (result as any).needsReauth,
                    };
                  }
                  return result;
                })();

                const thread = await api.getThread(currentThreadId);
                const existingMessages =
                  (thread.thread?.metadata?.messages as any[]) || [];

                const serialized = safeStringify({
                  type: data.type,
                  result: compactResult,
                  durationMs: data.durationMs,
                  executionId: data.executionId,
                });

                const toolMessage = {
                  role: "tool",
                  content: truncate(serialized, MAX_TOOL_MESSAGE_CHARS),
                };

                await api.updateThread(currentThreadId, {
                  metadata: {
                    ...thread.thread?.metadata,
                    messages: [...existingMessages, toolMessage],
                  },
                });
              } catch (error) {
                console.error(
                  "Failed to persist tool message to thread:",
                  error,
                );
              }
            }, 0);
          }
        }
      },
      onPlanDelta: (data) => {
        // Handle reasoning/thinking deltas
        if (data.executionId && data.delta) {
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastAssistantIndex = newMessages.length - 1;
            if (
              lastAssistantIndex >= 0 &&
              newMessages[lastAssistantIndex].role === "assistant"
            ) {
              // Check if this is reasoning/thinking (from execution:reasoning_delta)
              // The event name itself indicates reasoning_delta
              const isReasoning =
                data.type === "reasoning" ||
                (data as any).eventType === "reasoning_delta" ||
                (data as any).eventName?.includes("reasoning");

              if (isReasoning) {
                const currentThinking =
                  newMessages[lastAssistantIndex].thinking || "";
                newMessages[lastAssistantIndex].thinking =
                  currentThinking + data.delta;
              } else {
                // Regular text streaming
                const currentStreaming =
                  newMessages[lastAssistantIndex].streamingContent || "";
                newMessages[lastAssistantIndex].streamingContent =
                  currentStreaming + data.delta;
              }
            }
            return newMessages;
          });
        }
      },
      onExecutionCompleted: (data) => {
        // Final update when execution completes
        if (data.executionId) {
          currentExecutionIdRef.current = null;
          setLoading(false);
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          // Clear streaming content but keep tool calls visible for a bit
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastAssistantIndex = newMessages.length - 1;
            if (
              lastAssistantIndex >= 0 &&
              newMessages[lastAssistantIndex].role === "assistant"
            ) {
              newMessages[lastAssistantIndex].streamingContent = undefined;
              newMessages[lastAssistantIndex].workingStatus = undefined;
              // Keep tool calls visible, they'll fade out naturally or be cleared by polling
            }
            return newMessages;
          });
          // Final poll to ensure we have all data
          pollExecution(data.executionId);
        }
      },
    });

    socketUnsubscribeRef.current = unsubscribe || null;

    return () => {
      if (socketUnsubscribeRef.current) {
        socketUnsubscribeRef.current();
        socketUnsubscribeRef.current = null;
      }
    };
  }, [agentId, getToolDescription, pollExecution]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const qpMessage = searchParams.get("message");
    if (!qpMessage) return;
    if (didAutostartRef.current) return;
    didAutostartRef.current = true;
    const decoded = (() => {
      try {
        return decodeURIComponent(qpMessage);
      } catch {
        return qpMessage;
      }
    })();
    setTimeout(() => {
      handleSendMessage(decoded);
    }, 0);
  }, [searchParams]);

  const handleSendMessage = async (
    message: string,
    githubRepo?: { owner: string; repo: string },
  ) => {
    if (!message.trim() || loading) return;

    // Create thread if this is the first message
    let threadId = currentThreadId;
    if (!threadId) {
      try {
        const threadResult = await api.createThread({
          agentId,
          metadata: {
            messages: [],
            githubRepo: githubRepo
              ? { owner: githubRepo.owner, repo: githubRepo.repo }
              : undefined,
          },
        });
        threadId = threadResult.thread._id;
        setCurrentThreadId(threadId);
      } catch (error) {
        console.error("Failed to create thread:", error);
      }
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Save user message to thread (async, don't block)
    if (threadId) {
      setTimeout(async () => {
        try {
          setMessages((currentMsgs) => {
            const currentMessages = currentMsgs
              .filter((m) => m.role === "user" || m.role === "assistant")
              .map((m) => ({
                role: m.role,
                content: m.content || "",
              }));

            // Save to thread asynchronously
            (async () => {
              try {
                await api.updateThread(threadId!, {
                  metadata: {
                    messages: [
                      ...currentMessages,
                      { role: "user", content: message },
                    ],
                  },
                });
              } catch (error) {
                console.error("Failed to save message to thread:", error);
              }
            })();

            return currentMsgs;
          });
        } catch (error) {
          console.error("Failed to save message to thread:", error);
        }
      }, 100);
    }

    // Add placeholder assistant message
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    setLoading(true);

    try {
      // Prepare payload - include repo context in message if repo is selected
      let contextualMessage = message;
      if (githubRepo) {
        // Add repo context to help agent understand which repo to use
        contextualMessage = `${message}\n\n[Context: Working with repository ${githubRepo.owner}/${githubRepo.repo}]`;
      }

      let baseHistory: Array<{ role: string; content: string }> = [];
      if (threadId) {
        try {
          const thread = await api.getThread(threadId);
          const threadMsgs = (thread.thread?.metadata?.messages as any[]) || [];
          baseHistory = threadMsgs
            .filter(
              (m) =>
                (m?.role === "user" ||
                  m?.role === "assistant" ||
                  m?.role === "tool") &&
                typeof m?.content === "string",
            )
            .map((m) => ({ role: m.role, content: m.content }));
        } catch (e) {
          // Fall back to local UI state if thread fetch fails
          baseHistory = messages
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map((m) => ({ role: m.role, content: m.content || "" }));
        }
      }

      const historyMessages = [
        ...baseHistory,
        { role: "user", content: contextualMessage },
      ];

      const payload: Record<string, unknown> = {
        message: contextualMessage,
        task: contextualMessage,
        threadId: threadId,
        messages: historyMessages,
      };

      if (githubRepo) {
        payload.githubRepo = githubRepo;
      }

      // Send to agent
      const result = await api.runAgent(agentId, payload);

      if (result.success && result.executionId) {
        assistantMessage.executionId = result.executionId;

        // Start polling for execution updates
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }

        pollingIntervalRef.current = setInterval(() => {
          pollExecution(result.executionId);
        }, 2000); // Poll every 2 seconds

        // Initial poll
        pollExecution(result.executionId);
      } else {
        setLoading(false);
        assistantMessage.content = "Failed to start agent execution.";
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setLoading(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.";
      assistantMessage.content = errorMessage;
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        if (lastIndex >= 0) {
          newMessages[lastIndex] = assistantMessage;
        }
        return newMessages;
      });
    }
  };

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex md:max-w-300 mx-auto h-full overflow-y-auto py-5 w-full">
      <div className="bg-dark/2 flex flex-col justify-between w-full mx-4 md:mx-0 overflow-hidden border border-dark/6 md:w-2/3 h-120 md:h-162 rounded-4xl">
        <div className="bg-dark/3 flex justify-between items-center w-full p-5">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">
              {agent?.name || (agent === null ? "Agent Name" : "Loading...")}
            </h1>
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 cursor-pointer hover:bg-dark/5 rounded-lg transition-colors"
              title="View history"
            >
              <ClockIcon className="text-dark/70 text-lg" />
            </button>
            {loading && currentExecutionIdRef.current && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span
                    className="inline-block w-2 h-2 bg-[#36B460] rounded-full animate-pulse"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="inline-block w-2 h-2 bg-[#36B460] rounded-full animate-pulse"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="inline-block w-2 h-2 bg-[#36B460] rounded-full animate-pulse"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
                <button
                  onClick={async () => {
                    if (currentExecutionIdRef.current) {
                      try {
                        await api.cancelExecution(
                          currentExecutionIdRef.current,
                        );
                        setLoading(false);
                        currentExecutionIdRef.current = null;
                        if (pollingIntervalRef.current) {
                          clearInterval(pollingIntervalRef.current);
                          pollingIntervalRef.current = null;
                        }
                        // Update last message to show cancellation
                        setMessages((prev) => {
                          const updated = [...prev];
                          const lastIdx = updated.length - 1;
                          if (
                            lastIdx >= 0 &&
                            updated[lastIdx].role === "assistant"
                          ) {
                            updated[lastIdx].content =
                              "Execution cancelled by user.";
                          }
                          return updated;
                        });
                      } catch (error) {
                        console.error("Failed to cancel execution:", error);
                      }
                    }
                  }}
                  className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium rounded-lg transition-colors"
                >
                  Stop
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-dark/5 hover:bg-dark/7 cursor-pointer rounded-full p-3 transition-colors"
            title="Edit agent"
          >
            <DotsThreeVerticalIcon className="text-lg text-dark" />
          </button>
        </div>
        <div className="flex gap-4 md:gap-5 h-full overflow-y-scroll p-4 md:p-6 flex-col">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-dark/50">
                Start a conversation with your agent...
              </p>
            </div>
          )}
          {messages.map((message, index) => (
            <div key={message.id} className="mb-4">
              {message.role === "user" ? (
                <MessageBubble message={message.content} isUser={true} />
              ) : (
                <AgentMessageCard
                  message={message.content}
                  contentType={
                    message.contentType || detectContentType(message.content)
                  }
                  isLoading={loading && index === messages.length - 1}
                  streamingContent={message.streamingContent}
                  thinking={message.thinking}
                  workingStatus={message.workingStatus}
                  activeToolCalls={message.activeToolCalls}
                  completedToolCalls={message.completedToolCalls}
                />
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="">
          <AgentInput onSend={handleSendMessage} disabled={loading} />
        </div>
      </div>
      <div className="md:w-1/3 w-0 hidden px-5 md:flex flex-col gap-4 h-162">
        <div className="bg-dark/2 p-5 flex flex-col justify-between overflow-hidden border border-dark/6 w-full h-full rounded-4xl">
          <h2 className="text-dark font-semibold text-xl">
            Agent Chat History
          </h2>
          <div className="flex flex-col overflow-y-auto mt-4 gap-1.5 w-full">
            {recentThreadsLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="flex gap-1">
                  <span className="inline-block w-2 h-2 bg-dark/30 rounded-full animate-pulse" />
                  <span
                    className="inline-block w-2 h-2 bg-dark/30 rounded-full animate-pulse"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="inline-block w-2 h-2 bg-dark/30 rounded-full animate-pulse"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            ) : recentThreads.length === 0 ? (
              <div className="text-dark/50 text-sm py-6 text-center">
                No conversations yet
              </div>
            ) : (
              recentThreads.map((t) => (
                <button
                  key={t._id}
                  onClick={() => loadThreadIntoChat(t._id)}
                  className="bg-dark/4 hover:bg-dark/6 w-full p-2.5 rounded-2xl flex gap-2 items-center text-left transition-colors"
                >
                  <div className="p-2 bg-accent text-white rounded-full">
                    <ChatsCircleIcon />
                  </div>
                  <h2 className="text-dark font-medium line-clamp-1">
                    {t.title || "Untitled conversation"}
                  </h2>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* History Sidebar */}
      <HistorySidebar
        agentId={agentId}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectThread={async (threadId) => {
          await loadThreadIntoChat(threadId);
        }}
      />

      {/* Edit Agent Modal */}
      <EditAgentModal
        agent={agent}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={async () => {
          // Refresh agent data
          try {
            const data = await api.getAgent(agentId);
            setAgent(data.agent);
          } catch (error) {
            console.error("Failed to refresh agent:", error);
          }
        }}
      />
    </div>
  );
};

export default Page;
