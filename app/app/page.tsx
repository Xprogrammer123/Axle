"use client";
import { Button } from "@/components-beta/Button";
import { api } from "@/lib/api";
import {
  ArrowUpIcon,
  CaretDownIcon,
  ChatsCircleIcon,
  CubeIcon,
  OpenAiLogoIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Logo from "@/components-beta/Logo";
import { StaggerContainer, StaggerItem, ScaleIn } from "@/components/ui/animations";

import { motion, AnimatePresence } from "framer-motion";


type UnknownRecord = Record<string, unknown>;
const asRecord = (value: unknown): UnknownRecord => {
  if (value && typeof value === "object") return value as UnknownRecord;
  return {};
};

type Agent = {
  _id: string;
  name: string;
  description?: string;
  instructions?: string;
};

type ThreadSummary = {
  _id: string;
  title?: string;
  agentId?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: unknown;
};

type Integration = {
  provider: string;
  status?: string;
};

const Page = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<unknown>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [agentDropdownOpen, setAgentDropdownOpen] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [
          profileRes,
          agentsRes,
          threadsRes,
          integrationsRes,
        ] = await Promise.all([
          (api.getProfile() as Promise<unknown>).catch(() => null),
          api.getAgents().catch(() => ({ agents: [] } as any)),
          api.getThreads().catch(() => ({ threads: [] } as any)),
          (api.getIntegrations() as Promise<{
            integrations?: Integration[];
          }>).catch(() => ({ integrations: [] })),
        ]);

        const profileRec = asRecord(profileRes);
        setProfile(profileRec.user ?? profileRec.profile ?? profileRes ?? null);
        const fetchedAgents = (agentsRes?.agents || []).filter(
          Boolean,
        ) as Agent[];
        setAgents(fetchedAgents);
        setThreads(
          (threadsRes?.threads || []).filter(Boolean) as ThreadSummary[],
        );
        setIntegrations((integrationsRes?.integrations || []).filter(Boolean));

        if (fetchedAgents.length && !selectedAgentId) {
          setSelectedAgentId(fetchedAgents[0]._id);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayName = useMemo(() => {
    const profileRec = asRecord(profile);
    const name = profileRec.name || profileRec.email;
    if (!name) return "there";
    const first = String(name).split("@")[0].split(" ")[0];
    return first || "there";
  }, [profile]);

  const selectedAgent = useMemo(() => {
    return agents.find((a) => a._id === selectedAgentId) || null;
  }, [agents, selectedAgentId]);

  const recentThreads = useMemo(() => {
    return (threads || []).slice(0, 6);
  }, [threads]);

  const onSend = async () => {
    if (!message.trim() || !selectedAgentId || sending) return;
    setSending(true);
    try {
      const initialMessage = message.trim();
      setMessage("");

      const threadRes = await api.createThread({
        agentId: selectedAgentId,
        metadata: {
          messages: [{ role: "user", content: initialMessage }],
        },
      });

      const threadId = threadRes?.thread?._id;

      const qp = new URLSearchParams();
      qp.set("message", initialMessage);
      if (threadId) qp.set("threadId", threadId);
      router.push(`/app/agents/${selectedAgentId}?${qp.toString()}`);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="p-7 pt-20 flex flex-col justify-center items-center h-[70%] w-full mx-auto space-y-8">
        <div className="page-loader animate-pulse" style={{ minHeight: 140 }}>
          <div className="bg-surface dark:bg-surface-dark shadow-lg/3 shadow-dark/10 dark:shadow-black/50 rounded-full p-3">
            <Logo size={36} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen md:w-full h-full overflow-y-auto p-4 md:p-7 md:pt-24 pt-24">
      <StaggerContainer>
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          <StaggerItem className="w-full lg:w-1/2 xl:w-[43%]">
            <div id="dashboard-agents-card" className="bg-dark/3 dark:bg-white/1.5 w-full h-72 overflow-hidden border-0 border-dark/3 dark:border-white/2 rounded-4xl p-3 shadow-lg shadow-dark/4 dark:shadow-black/1">
              <div className="flex w-full justify-between items-center">
                <div className="p-2.5 bg-accent dark:bg-accent-dark text-white rounded-full">
                  <CubeIcon size={24} />
                </div>
                <Link href="/app/agents">
                  <Button variant="primary" className="py-2.5 px-6 md:py-2.5">
                    See All
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col overflow-auto h-[80%] mt-7 pb-3 gap-1.5">
                {agents.length === 0 ? (
                  <div className="text-dark/50 flex flex-col justify-center mt-4 items-center gap-5 text-sm p-3">
                    <p className="text-dark/50 text-center dark:text-white/50">You have no agents yet, create an agent.</p>
                    <Link href="/app/agents/new"><Button className="mx-auto py-3">Create an agent</Button></Link>
                  </div>
                ) : (
                  agents.slice(0, 6).map((agent) => (
                    <div
                      key={agent._id}
                      className="bg-dark/3 dark:bg-white/5 justify-between flex items-center rounded-2xl p-2.5"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-2 bg-surface/60 dark:bg-surface-dark/60 rounded-full">
                          <OpenAiLogoIcon className="size-7" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h3 className="text-dark/75 dark:text-dark-light/90 font-semibold truncate">
                            {agent.name}
                          </h3>
                          <p className="text-sm text-dark/50 dark:text-dark-light/50 font-medium truncate">
                            {agent.description || agent.instructions || ""}
                          </p>
                        </div>
                      </div>
                      <Link href={`/app/agents/${agent._id}`}>
                        <Button
                          variant="primary"
                          className="py-2.5 px-6 md:py-2.5 text-sm"
                        >
                          View
                        </Button>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </StaggerItem>

          <StaggerItem className="w-full lg:w-1/2 xl:w-[57%]">
            <div className="bg-dark/3 dark:bg-white/1.5 w-full justify-between flex flex-col overflow-hidden h-72 border-0 border-dark/3 dark:border-white/2 rounded-4xl p-3 shadow-lg shadow-dark/4 dark:shadow-black/10">
              <div className="flex flex-col py-6 md:py-5 justify-center w-full items-center gap-0.5">
                <h2 className="font-bold text-dark dark:text-dark-light text-xl md:text-2xl text-center">
                  Hi {displayName}!
                </h2>
                <p className="serif text-dark/50 dark:text-dark-light/50 text-base md:text-lg text-center">
                  What do you want to do today?
                </p>
              </div>
              <ScaleIn>
                <div id="dashboard-magic-input" className="bg-surface/75 dark:bg-black/15 border border-white/5 w-full h-32 md:h-36 rounded-3xl p-3.5 flex flex-col justify-between">
                  <textarea
                    className="resize-none placeholder:text-dark/35 dark:placeholder:text-dark-light/35 p-1 w-full h-20 md:h-24 outline-none bg-transparent text-sm"
                    placeholder="Talk to me..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={sending}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <div className="relative flex-1">
                      <button
                        type="button"
                        onClick={() => setAgentDropdownOpen((v) => !v)}
                        className="bg-dark/3 dark:bg-white/5 gap-4 rounded-full p-2 flex items-center border-4 border-outer border-dark/1 dark:border-white/0 w-fit justify-between"
                      >
                        <div className="flex gap-1.5 text-sm text-dark dark:text-dark-light font-medium items-center min-w-0">
                          <SparkleIcon
                            size={18}
                            className="text-accent flex-shrink-0"
                          />
                          <span className="truncate">
                            {selectedAgent?.name || "Select agent"}
                          </span>
                        </div>
                        <CaretDownIcon
                          size={16}
                          className="text-dark dark:text-dark-light cursor-pointer flex-shrink-0"
                        />
                      </button>

                      <AnimatePresence>
                        {agentDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.98 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="absolute bottom-full left-0 mb-2 w-72 z-50
                      bg-white/5 dark:bg-dark/5 backdrop-blur-md
                      border border-border dark:border-white/3
                      rounded-3xl p-2
                      shadow-lg shadow-dark/10 dark:shadow-black/30
                      max-h-56 overflow-y-auto origin-bottom"
                          >
                            {agents.length === 0 ? (
                              /* EMPTY STATE */
                              <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="flex flex-col items-center justify-center gap-0.5 py-6 text-center"
                              >
                                <p className="text-md font-medium text-dark dark:text-dark-light">
                                  No agents yet
                                </p>
                                <p className="text-xs text-dark/50 mb-3 dark:text-dark-light/50">
                                  Create an agent to automate your work
                                </p>

                                <Button
                                  type="button"
                                  onClick={() => {
                                    setAgentDropdownOpen(false);
                                  }}
                                  className="py-2.5 text-xs"
                                >
                                  Create agent
                                </Button>
                              </motion.div>
                            ) : (
                              /* AGENT LIST */
                              <div className="flex flex-col gap-1">
                                {agents.map((a) => (
                                  <motion.button
                                    key={a._id}
                                    layout
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    type="button"
                                    onClick={() => {
                                      setSelectedAgentId(a._id);
                                      setAgentDropdownOpen(false);
                                    }}
                                    className={`w-full text-left text-sm p-2 rounded-xl transition-colors ${selectedAgentId === a._id
                                      ? "bg-dark/5 dark:bg-white/10 text-dark dark:text-dark-light"
                                      : "text-dark/70 dark:text-dark-light/70 hover:text-dark dark:hover:text-dark-light hover:bg-dark/5 dark:hover:bg-white/10"
                                      }`}
                                  >
                                    <p className="font-medium">{a.name}</p>

                                    {(a.description || a.instructions) && (
                                      <p className="text-xs text-dark/40 dark:text-dark-light/40 truncate">
                                        {a.description || a.instructions}
                                      </p>
                                    )}
                                  </motion.button>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <Button
                      variant="primary"
                      className="p-3 flex-shrink-0"
                      onClick={onSend}
                      loading={sending}
                      disabled={!message.trim() || !selectedAgentId}
                    >
                      <ArrowUpIcon
                        size={18}
                        weight="bold"
                        className="text-white md:w-5 md:h-5"
                      />
                    </Button>
                  </div>
                </div>
              </ScaleIn>
            </div>
          </StaggerItem>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 w-full mt-4">
          <StaggerItem className="w-full lg:w-1/2">
            <div id="dashboard-integrations-card" className="bg-dark/3 dark:bg-white/1.5 flex flex-col overflow-hidden h-72 border-0 border-dark/3 dark:border-white/10 rounded-4xl p-3 shadow-lg shadow-dark/4 dark:shadow-black/10">
              <div className="flex w-full justify-between items-center">
                <h2 className="text-base md:text-lg font-semibold text-dark dark:text-dark-light px-3 truncate">
                  Integrations
                </h2>
                <Link href="/app/apps">
                  <Button className="py-3 px-6 md:py-3 text-sm">See More</Button>
                </Link>
              </div>
              <div className="flex flex-col mt-5 gap-2 w-full">
                {["github", "twitter", "google"].map((provider) => {
                  const integration = integrations.find(
                    (i) => i.provider === provider,
                  );
                  const connected = integration?.status === "connected";

                  const icon =
                    provider === "github"
                      ? "/beta/github.svg"
                      : provider === "twitter"
                        ? "/twitter.svg"
                        : "/google.svg";

                  const label =
                    provider === "github"
                      ? "GitHub"
                      : provider === "twitter"
                        ? "X (Twitter)"
                        : "Google";

                  return (
                    <div
                      key={provider}
                      className="bg-dark/3 dark:bg-white/2 border border-white/3 justify-between flex items-center rounded-full p-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="bg-surface dark:bg-white relative flex items-center justify-center overflow-hidden hover:scale-105 transition-all cursor-pointer duration-300 rounded-full p-2.5 shadow-lg shadow-dark/3 dark:shadow-black/20">
                          <Image src={icon} className="z-10" alt={label} width={24} height={24} />
                          <div className="bg-white h-10 w-12 blur-md z-0 absolute -top-1"></div>
                          <div className="dark:bg-black bg-black/20 h-6 w-12 blur-lg z-0 absolute -bottom-1"></div>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h3 className="text-dark dark:text-dark-light font-semibold truncate">
                            {label}
                          </h3>
                          <p className="text-xs text-dark/40 dark:text-dark-light/40">
                            {connected ? "Connected" : "Not connected"}
                          </p>
                        </div>
                      </div>
                      <Link href="/app/apps">
                        <Button
                          variant="primary"
                          className="px-6 py-2.5 md:px-6 md:py-2.5 text-sm"
                        >
                          {connected ? "Manage" : "Connect"}
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </StaggerItem>

          <StaggerItem className="w-full lg:w-1/2">
            <div id="dashboard-recent-conversations" className="bg-dark/3 dark:bg-white/1.5 flex flex-col overflow-hidden h-72 border-0 border-dark/3 dark:border-white/10 rounded-4xl p-3 shadow-lg shadow-dark/4 dark:shadow-black/10">
              <div className="flex w-full justify-between items-center">
                <h2 className="text-base md:text-lg font-semibold text-dark dark:text-dark-light px-3 truncate">
                  Most recent conversations
                </h2>
                <Link href="/app/agents">
                  <Button className="py-3 px-5 md:py-3 text-sm">See More</Button>
                </Link>
              </div>
              <div className="flex flex-col mt-5 gap-2 w-full overflow-auto">
                {recentThreads.length === 0 ? (
                  <div className="text-dark/50 dark:text-dark-light/50 text-sm p-3">
                    No conversations yet
                  </div>
                ) : (
                  recentThreads.map((t) => (
                    <button
                      key={t._id}
                      type="button"
                      onClick={() => {
                        const agentId = (t as any).agentId;
                        if (agentId) {
                          router.push(`/app/agents/${agentId}?threadId=${t._id}`);
                        }
                      }}
                      className="bg-dark/3 dark:bg-white/2 border border-white/3 justify-between flex items-center rounded-2xl p-2.5 text-left"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-2 bg-accent text-white rounded-full">
                          <ChatsCircleIcon
                            size={16}
                            className="md:w-[18px] md:h-[18px]"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h3 className="text-dark/75 dark:text-dark-light/90 font-semibold truncate text-sm">
                            {t.title || "Untitled conversation"}
                          </h3>
                          <p className="text-xs text-dark/40 dark:text-dark-light/40 truncate">
                            {new Date(t.updatedAt || t.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="primary"
                        className="py-2.5 px-6 md:py-2.5 text-sm"
                      >
                        Open
                      </Button>
                    </button>
                  ))
                )}
              </div>
            </div>
          </StaggerItem>
        </div>
      </StaggerContainer>
    </div>
  );
};

export default Page;
