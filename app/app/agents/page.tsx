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
} from "@phosphor-icons/react";
import { Button } from "@/components-beta/Button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
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
  const router = useRouter();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const data = await api.getAgents();
      setAgents((data.agents || []).filter(Boolean));
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

            <Link href="/app/agents/new">
              <Button className="cursor-pointer py-3 px-4 md:py-3 md:px-6 rounded-full text-sm w-full md:w-auto">
                <Plus weight="bold" className="size-4" />
                New Agent
              </Button>
            </Link>
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
                <Link href={`/app/agents/${agent._id}`} className="block h-full">
                  <div className="bg-white/50 shadow-dark/2 shadow-lg dark:bg-white/5 border border-dark/3 dark:border-white/5 p-5 rounded-4xl h-full flex flex-col justify-between hover:border-dark/10 dark:hover:border-white/10 transition-colors group relative overflow-hidden">
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
                    <div className="flex pt-5 mt-5 border-t border-dark/5 dark:border-white/5 items-center justify-between gap-2 w-full">
                      <Link className="w-[90%]" href={`/app/agents/${agent._id}`}>
                    <Button className="w-full p-3">View Agent</Button>
                    </Link>

                    <Button
                          onClick={(e) => handleDeleteAgent(e, agent._id)}
                          disabled={deletingId === agent._id}
                          className="p-3 bg-red-700 text-white dark:text-white transition-all rounded-full"
                          title="Delete agent"
                        >
                          <Trash size={20} />
                        </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}
