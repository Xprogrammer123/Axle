"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  DotsThreeVerticalIcon,
  ClockIcon,
  ChatsCircleIcon,
  SlidersHorizontalIcon,
} from "@phosphor-icons/react";
import { AgentInput } from "@/components-beta/AgentInput";
import { MessageBubble } from "@/components-beta/chat/MessageBubble";
import { AgentMessageCard } from "@/components-beta/chat/AgentMessageCard";
import { ThinkingDropdown } from "@/components-beta/chat/ThinkingDropdown";
import { HistorySidebar } from "@/components-beta/chat/HistorySidebar";
import { EditAgentModal } from "@/components/ui/EditAgentModal";
import { api } from "@/lib/api";
import { socketClient } from "@/lib/socket";
import { AutomatedRunsBanner } from "@/components-beta/chat/AutomatedRunsBanner";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  executionId?: string;
  contentType?: "text" | "code" | "research" | "report";
  streamingContent?: string;
  thinking?: string;
  workingStatus?: string;
  activeToolCalls?: Array<{
    type: string;
    description: string;
    params?: Record<string, unknown>;
    status?: "running" | "success" | "failed";
    result?: unknown;
    durationMs?: number;
  }>;
  completedToolCalls?: Array<{
    type: string;
    description: string;
    params?: Record<string, unknown>;
    status?: "running" | "success" | "failed";
    result?: unknown;
    durationMs?: number;
  }>;
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
  instructions?: string;
  status?: string;
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
  const [profile, setProfile] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const displayName = useMemo(() => {
    if (!profile) return "there";
    const name = profile.name || profile.email;
    if (!name) return "there";
    const first = String(name).split("@")[0].split(" ")[0];
    return first || "there";
  }, [profile]);

  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [currentTime]);

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
          return `Creating issue${title ? `: ${title.substring(0, 30)}...` : "..."
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

      return `${toolName.replace(/_/g, " ")}...`;
    },
    [],
  );

  const pollExecution = React.useCallback(
    async (executionId: string) => {
      try {
        const execution = await api.getExecution(executionId);

        setMessages((prev) => {
          const newMessages = [...prev];
          const lastAssistantIndex = newMessages.length - 1;

          if (
            lastAssistantIndex >= 0 &&
            newMessages[lastAssistantIndex].role === "assistant"
          ) {
            const lastMessage = newMessages[lastAssistantIndex];

            if (execution.aiResponse) {
              lastMessage.content = execution.aiResponse;
              lastMessage.contentType = detectContentType(execution.aiResponse);
              lastMessage.streamingContent = undefined;
            } else if (execution.outputPayload?.result) {
              lastMessage.content = execution.outputPayload.result;
              lastMessage.contentType = detectContentType(
                execution.outputPayload.result,
              );
              lastMessage.streamingContent = undefined;
            } else if (execution.status === "failed" && execution.error) {
              lastMessage.content = execution.error;
              lastMessage.contentType = "text";
              lastMessage.streamingContent = undefined;
            }

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
              }, 3000);
            }

            if (execution.status === "running") {
            } else if (
              execution.status === "success" ||
              execution.status === "failed"
            ) {
              if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
              }
              setLoading(false);
            }
          }

          return newMessages;
        });

        if (execution.status === "success" || execution.status === "failed") {
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

                  (async () => {
                    try {
                      const thread = await api.getThread(currentThreadId!);
                      if (thread.thread) {
                        let threadTitle = thread.thread.title;
                        if (!threadTitle && allMessages.length >= 2) {
                          const firstUserMsg = allMessages.find(
                            (m) => m.role === "user",
                          );
                          if (firstUserMsg) {
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
    const fetchAgentAndProfile = async () => {
      try {
        const [agentData, profileData] = await Promise.all([
          api.getAgent(agentId),
          api.getProfile().catch(() => null)
        ]);
        setAgent(agentData.agent);
        if (profileData) {
          setProfile((profileData as any).user || (profileData as any).profile || profileData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    if (agentId) {
      fetchAgentAndProfile();
    }
  }, [agentId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

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
        if (data.executionId && data.type) {
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastAssistantIndex = newMessages.length - 1;
            if (
              lastAssistantIndex >= 0 &&
              newMessages[lastAssistantIndex].role === "assistant"
            ) {
              const lastMessage = newMessages[lastAssistantIndex];

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

                  if (!lastMessage.completedToolCalls) {
                    lastMessage.completedToolCalls = [];
                  }
                  lastMessage.completedToolCalls.push({
                    ...toolCall,
                    status: isError ? "failed" : "success",
                    result: result,
                    durationMs: data.durationMs,
                  });

                  lastMessage.activeToolCalls = lastMessage.activeToolCalls.filter(
                    (tc) => tc.type !== data.type,
                  );
                }
              }
            }
            return newMessages;
          });

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
                    : `${text.slice(0, maxChars)}\n...<truncated ${text.length - maxChars
                    } chars>`;

                const compactResult = (() => {
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
        if (data.executionId && data.delta) {
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastAssistantIndex = newMessages.length - 1;
            if (
              lastAssistantIndex >= 0 &&
              newMessages[lastAssistantIndex].role === "assistant"
            ) {
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
        if (data.executionId) {
          currentExecutionIdRef.current = null;
          setLoading(false);
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastAssistantIndex = newMessages.length - 1;
            if (
              lastAssistantIndex >= 0 &&
              newMessages[lastAssistantIndex].role === "assistant"
            ) {
              newMessages[lastAssistantIndex].streamingContent = undefined;
              newMessages[lastAssistantIndex].workingStatus = undefined;
            }
            return newMessages;
          });
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

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    // Smart auto-scroll
    const container = scrollContainerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    // Always scroll on initial load or if user is near bottom
    if (isNearBottom || messages.length <= 1) {
      scrollToBottom();
    }
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

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

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

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    setLoading(true);

    try {
      let contextualMessage = message;
      if (githubRepo) {
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

      const result = await api.runAgent(agentId, payload);

      if (result.success && result.executionId) {
        assistantMessage.executionId = result.executionId;

        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }

        pollingIntervalRef.current = setInterval(() => {
          pollExecution(result.executionId);
        }, 2000);

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
    <div className="flex max-w-[1400px] pt-0 mx-auto h-full md:rounded-l-lg overflow-hidden bg-gray-50 dark:bg-[#0f0f0f]">
      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 md:mt-0 mt-14 py-4 bg-white md:dark:bg-white/3 dark:bg-white/0 border-b border-gray-200 dark:border-white/5">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-medium text-gray-900 dark:text-white">
              {agent?.name || (agent === null ? "Assistant" : "Loading...")}
            </h1>
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 hover:bg-dark/5 dark:hover:bg-white/5 rounded-lg transition-colors md:hidden"
              title="View history"
            >
              <ClockIcon weight="bold" className="text-dark dark:text-white text-lg" />
            </button>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 hover:bg-dark/5 dark:hover:bg-white/5 cursor-pointer rounded-lg transition-colors"
            title="Options"
          >
            <SlidersHorizontalIcon className="text-dark/80 dark:text-white/80 text-xl" />
          </button>
        </div>

        {/* Automated Runs Banner (Schedule + Webhook) */}
        <AutomatedRunsBanner agentId={agentId} />

        {/* Messages Container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth"
        >
          <div className="md:px-6 mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center py-35 justify-center h-full">
                <p className="text-dark/50 dark:text-white/50 md:text-lg mb-3 font-medium">
                  {formattedDate}
                </p>
                <h2 className="font-bold text-2xl md:text-4xl bg-clip-text bg-linear-to-b text-transparent from-dark/50 dark:from-white/50 dark:to-white py-1 to-dark">
                  {getGreeting()}, {displayName}!
                </h2>
                <p className="text-dark/50 text-sm dark:text-white/50 md:text-md font-medium">How can I help you today?</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div key={message.id}>
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
        </div>

        {/* Input Container */}
        <div className="border-t border-gray-200 dark:border-white/5">
          <div className="">
            <AgentInput onSend={handleSendMessage} disabled={loading} />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden md:flex w-80 bg-white dark:bg-white/3 border-l border-gray-200 dark:border-white/5 flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-white/5">
          <h2 className="text-sm py-[7px] font-semibold text-gray-900 dark:text-white">
            Agent Chat History
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {recentThreadsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
                  <span
                    className="inline-block w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="inline-block w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            ) : recentThreads.length === 0 ? (
              <div className="text-gray-400 dark:text-gray-600 text-xs py-8 text-center">
                No conversations yet
              </div>
            ) : (
              recentThreads.map((t) => (
                <button
                  key={t._id}
                  onClick={() => loadThreadIntoChat(t._id)}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/3 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <ChatsCircleIcon className="text-white text-base" weight="fill" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {t.title || "Recent GitHub Activity Report"}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <HistorySidebar
        agentId={agentId}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectThread={async (threadId) => {
          await loadThreadIntoChat(threadId);
        }}
      />

      <EditAgentModal
        agent={agent}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={async () => {
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