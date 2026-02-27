"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash,
  Lightning,
  MagnifyingGlassIcon,
  Clock,
  Link as LinkIcon,
  Crown,
  X,
} from "@phosphor-icons/react";
import { Button } from "@/components-beta/Button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { getAgentLimit, getNextTierName } from "@/lib/planLimits";
import { safeFormatDistanceToNow } from "@/lib/utils";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/utils";
import { RefreshCw } from "lucide-react";
import Logo from "@/components-beta/Logo";

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [agentTriggers, setAgentTriggers] = useState<Record<string, any[]>>({});
  const [userPlan, setUserPlan] = useState<string>('free');
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAgents();
    api.getBillingStatus().then((subData) => {
      setUserPlan(subData?.plan || 'free');
    }).catch(() => setUserPlan('free'));
  }, []);

  const fetchAgents = async () => {
    try {
      const data = await api.getAgents();
      const allAgents = (data.agents || []).filter(Boolean);
      setAgents(allAgents);

      // Fetch all triggers across all agents in one request
      try {
        const triggerData = await api.getTriggers();
        const allTriggers = triggerData.triggers || [];

        const triggersMap: Record<string, any[]> = {};
        allTriggers.forEach((t: any) => {
          if (t.type === 'schedule' || t.type === 'webhook') {
            // Depending on the backend schema, the agent ID field could be agentId or agent
            const agentId = t.agentId || t.agent;
            if (agentId) {
              if (!triggersMap[agentId]) {
                triggersMap[agentId] = [];
              }
              triggersMap[agentId].push(t);
            }
          }
        });
        setAgentTriggers(triggersMap);
      } catch (err) {
        console.error("Failed to fetch triggers:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setRunningId(id);
      await api.runAgent(id, {});
      setTimeout(fetchAgents, 800);
    } catch (e) {
      console.error(e);
    } finally {
      setRunningId(null);
    }
  };

  const paths = [
    // OUTGOING
    "M140 100 C140 40, 40 40, 40 20",
    "M140 100 C200 60, 240 80, 260 40",
    "M140 100 C160 140, 220 160, 260 180",

    // INCOMING
    "M40 180 C60 140, 100 140, 140 100",
    "M20 100 C60 100, 100 100, 140 100",
    "M260 100 C220 100, 180 100, 140 100",
  ];


  function WorkflowAnimation() {
    return (
      <div className="relative w-[280px] h-[200px] flex items-center justify-center">
        {/* Center Logo */}
        <div className="z-10 scale-90">
          <Logo size={36} />
        </div>

        {/* SVG Layer */}
        <svg
          className="absolute inset-0"
          viewBox="0 0 280 200"
          fill="none"
        >
          {/* STATIC PATHS */}
          {paths.map((p, i) => (
            <path
              key={`base-${i}`}
              d={p}
              stroke="rgba(34,197,94,0.2)" // green-500 soft
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}

          {/* FLOWING PULSES */}
          {paths.map((p, i) => (
            <motion.path
              className="blur-[2px]"
              key={`flow-${i}`}
              d={p}
              stroke="rgba(34,197,94,0.85)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="18 160"
              initial={{ strokeDashoffset: 160 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.25,
              }}
            />
          ))}
        </svg>
      </div>
    );
  }


  const handleDeleteAgent = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    // const ok = window.confirm('Delete this agent? This will also delete all its triggers and executions.');
    // if (!ok) return;

    try {
      setDeletingId(id);
      await api.deleteAgent(id);
      setAgents((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStatus = async (e: React.MouseEvent, agent: any) => {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = agent.status === "active" ? "paused" : "active";
    await api.updateAgent(agent._id, { status: newStatus });
    setAgents(
      agents.map((a) =>
        a._id === agent._id ? { ...a, status: newStatus } : a,
      ),
    );
  };


  const handleCreateClick = () => {
    const limit = getAgentLimit(userPlan);
    if (agents.length >= limit) {
      setShowLimitModal(true);
      return;
    }
    setShowCreateDropdown(!showCreateDropdown);
  };

  if (loading) {
    return (
      <div className="p-7 flex flex-col justify-center items-center h-[70%] w-full mx-auto space-y-8">
        <div className="page-loader animate-pulse" style={{ minHeight: 140 }}>
          <div className="bg-surface dark:bg-black/20 shadow-lg/3 shadow-dark rounded-full p-3">
            <Logo size={36} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-7 pt-20 w-full mx-auto overflow-auto space-y-8">
        {agents.length === 0 ? (
          /* ================= EMPTY STATE ================= */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center justify-center gap-8 py-16"
          >
            {/* Workflow Animation */}
            <WorkflowAnimation />

            {/* Copy */}
            <div className="text-center max-w-md">
              <h2 className="text-xl font-semibold text-dark dark:text-white">
                No agents yet
              </h2>
              <p className="text-sm text-dark/50 dark:text-white/50 mt-2">
                Agents automate work across your tools. <br /> Create one to get started.
              </p>
            </div>

            {/* CTA */}
            <Link href="/app/agents/new">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button className="rounded-full px-6 py-3 text-sm">
                  <Plus weight="bold" className="size-4" />
                  Create your first agent
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          /* ================= AGENTS LIST ================= */
          <>
            {/* Top Bar */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-col md:flex-row md:items-end gap-4 md:gap-5 justify-between"
            >
              <div className="bg-dark/4 dark:bg-white/2 border border-white/3 p-2.5 flex gap-2 items-center rounded-full w-full md:w-[85%]">
                <MagnifyingGlassIcon
                  size={18}
                  className="text-dark/35 dark:text-white/35 flex-shrink-0"
                />
                <input
                  type="text"
                  className="w-full bg-transparent outline-0 text-sm dark:text-white/80"
                  placeholder="Search agents, descriptions…"
                />
              </div>

              <div className="bg-dark/4 dark:bg-white/2 border border-dark/5 dark:border-white/5 rounded-full py-2.5 px-5 flex items-center gap-2 text-sm font-semibold text-dark/60 dark:text-white/50 whitespace-nowrap">
                <Lightning weight="fill" size={14} className="text-accent" />
                {agents.length} / {getAgentLimit(userPlan) === Infinity ? '∞' : getAgentLimit(userPlan)} Agents
              </div>
            </motion.div>

            {/* Cards */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.06 } },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {agents.map((agent) => (
                <motion.div
                  key={agent._id}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <div onClick={() => router.push(`/app/agents/${agent._id}`)} className="block h-full cursor-pointer">
                    <div className="bg-white/50 shadow-dark/2 shadow-lg dark:bg-white/5 border border-dark/3 dark:border-white/5 p-5 rounded-4xl h-full flex flex-col justify-between hover:border-dark/10 dark:hover:border-white/10 transition-colors group relative overflow-hidden">
                      <div className="absolute top-5 right-5 flex flex-col items-end gap-1.5 z-10">
                        <div className="bg-dark/5 dark:bg-white/5 border border-dark/10 dark:border-white/10 rounded-full px-2.5 py-1 flex items-center gap-1.5">
                          <Lightning weight="fill" size={12} className="text-accent" />
                          <span className="text-[10px] font-bold text-dark/70 dark:text-white/70">
                            {agent.runs || 0} Runs
                          </span>
                        </div>
                        {agentTriggers[agent._id] && agentTriggers[agent._id].length > 0 && (
                          <div className="flex flex-wrap gap-1.5 justify-end">
                            {agentTriggers[agent._id].filter((t: any) => t.type === 'schedule').length > 0 && (
                              <div className="flex items-center gap-1 bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/10 dark:border-orange-500/20 rounded-full px-2 py-1">
                                <Clock weight="bold" size={11} className="text-orange-400" />
                                <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-300">
                                  {agentTriggers[agent._id].filter((t: any) => t.type === 'schedule').length} Schedule{agentTriggers[agent._id].filter((t: any) => t.type === 'schedule').length > 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                            {agentTriggers[agent._id].filter((t: any) => t.type === 'webhook').length > 0 && (
                              <div className="flex items-center gap-1 bg-violet-500/5 dark:bg-violet-500/10 border border-violet-500/10 dark:border-violet-500/20 rounded-full px-2 py-1">
                                <LinkIcon weight="bold" size={11} className="text-violet-400" />
                                <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-300">
                                  Webhook
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {/* Status Indicator */}
                      {/* <div className="absolute top-5 right-5 flex gap-2">
                      <button
                        onClick={(e) => toggleStatus(e, agent)}
                        className={`h-2.5 w-2.5 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'} ring-4 ring-white/5 dark:ring-white/5 hover:scale-125 transition-transform`}
                        title={agent.status === 'active' ? 'Active' : 'Paused'}
                      />
                    </div> */}

                      <div>
                        <div className="size-12 rounded-4xl relative overflow-hidden bg-accent/10 dark:bg-accent/10 flex items-center justify-center text-dark dark:text-white mb-4">
                          <Image src="/Sparkle.svg" alt="Sparkle" width={100} height={100} className="size-6 z-20 text-accent" />
                          {/* <div className="bg-dark/30 z-10 blur-xl w-15 h-6 absolute -bottom-5"></div> */}
                        </div>

                        <h3 className="text-xl font-bold text-dark dark:text-white">{agent.name}</h3>

                        {agent.description ? (
                          <p className="text-sm text-dark/50 dark:text-white/50 line-clamp-2 leading-relaxed">
                            {agent.description}
                          </p>
                        ) : (
                          <p className="text-sm text-dark/30 dark:text-white/30 italic">
                            No description
                          </p>
                        )}
                      </div>

                      {/* Trigger badges moved to top right */}
                      <div className="flex pt-5 mt-5 border-t border-dark/5 dark:border-white/5 items-center justify-between gap-2 w-full">
                        <div className="w-[90%]" onClick={(e) => { e.stopPropagation(); router.push(`/app/agents/${agent._id}`); }}>
                          <Button className="w-full p-3">View Agent</Button>
                        </div>

                        <Button
                          onClick={(e) => handleDeleteAgent(e, agent._id)}
                          disabled={deletingId === agent._id}
                          variant="destructive"
                          className="p-3 transition-all rounded-full"
                          title="Delete agent"
                        >
                          <Trash size={20} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Create New Agent Card */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <div className="relative h-full">
                  <button
                    onClick={handleCreateClick}
                    className="w-full h-full min-h-[200px] border-2 border-dashed border-dark/10 dark:border-white/10 rounded-4xl flex flex-col items-center justify-center gap-3 hover:border-accent dark:hover:border-accent hover:bg-accent/[0.02] transition-all cursor-pointer group"
                  >
                    <div className="size-12 rounded-full bg-dark/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                      <Plus weight="bold" size={22} className="text-dark/30 dark:text-white/30 group-hover:text-accent transition-colors" />
                    </div>
                    <span className="text-sm font-semibold text-dark/40 dark:text-white/40 group-hover:text-accent transition-colors">
                      Create New Agent
                    </span>
                  </button>

                  {/* Dropdown */}
                  {showCreateDropdown && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-[#1a1a1a] border border-dark/10 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-black/40 p-2 min-w-[220px] animate-in fade-in zoom-in-95 duration-150">
                      <button
                        onClick={() => { setShowCreateDropdown(false); router.push('/app/templates'); }}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-dark/5 dark:hover:bg-white/5 transition-colors flex items-center gap-3 group/item"
                      >
                        <div className="size-8 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Lightning weight="fill" size={16} className="text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-dark dark:text-white">Use a Template</p>
                          <p className="text-[11px] text-dark/40 dark:text-white/40">Start from a pre-built agent</p>
                        </div>
                      </button>
                      <button
                        onClick={() => { setShowCreateDropdown(false); router.push('/app/agents/new'); }}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-dark/5 dark:hover:bg-white/5 transition-colors flex items-center gap-3 group/item"
                      >
                        <div className="size-8 rounded-lg bg-dark/5 dark:bg-white/5 flex items-center justify-center">
                          <Plus weight="bold" size={16} className="text-dark/50 dark:text-white/50" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-dark dark:text-white">Start Fresh</p>
                          <p className="text-[11px] text-dark/40 dark:text-white/40">Build your own from scratch</p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </div>

      {/* Upgrade modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowLimitModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#1a1a1a] border border-dark/10 dark:border-white/10 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setShowLimitModal(false)} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-dark/5 dark:hover:bg-white/5">
              <X size={16} className="text-dark/40 dark:text-white/40" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="size-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <Crown weight="fill" size={28} className="text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-dark dark:text-white mb-2">Agent Limit Reached</h3>
              <p className="text-sm text-dark/50 dark:text-white/50 mb-6">
                You&apos;ve reached the maximum of <strong>{getAgentLimit(userPlan)}</strong> agent{getAgentLimit(userPlan) > 1 ? 's' : ''} on your current plan. Upgrade to {getNextTierName(userPlan)} to create more.
              </p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setShowLimitModal(false)} className="flex-1 py-3 rounded-full border border-dark/10 dark:border-white/10 text-sm font-semibold text-dark/60 dark:text-white/50 hover:bg-dark/5 dark:hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <Link href="/app/billing" className="flex-1">
                  <Button className="w-full py-3 rounded-full text-sm">
                    <Crown weight="fill" size={14} />
                    Upgrade Plan
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Click-outside handler for dropdown */}
      {showCreateDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowCreateDropdown(false)} />
      )}
    </>
  );
}
