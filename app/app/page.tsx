"use client";
import {
  Repeat,
  ArrowUpRight,
  Sparkle,
  CircleNotch,
} from "@phosphor-icons/react";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AxleInput from "./components/ChatSidebar";
import { agentsAPI } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { CreateAgentModal } from "@/components/agents/CreateAgentModal";

interface Agent {
  _id: string;
  name: string;
  description?: string;
  schedule?: {
    enabled: boolean;
  };
  lastRunAt?: string;
  tools?: string[];
}

const Page = () => {
  const { showToast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const data = await agentsAPI.list();
      const resData = data.agents!;
      setAgents(resData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load agents";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const runningAgents = agents.filter((agent) => agent.schedule?.enabled);
  const recentAgents = agents
    .sort((a, b) => {
      const aTime = a.lastRunAt ? new Date(a.lastRunAt).getTime() : 0;
      const bTime = b.lastRunAt ? new Date(b.lastRunAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 3);

  const getToolIcon = (tools?: string[]) => {
    if (!tools || tools.length === 0) return "/logo.svg";
    const tool = tools[0].toLowerCase();
    if (tool.includes("github")) return "/github.svg";
    if (tool.includes("slack")) return "/slack.svg";
    if (tool.includes("gmail") || tool.includes("google")) return "/gmail.svg";
    return "/logo.svg";
  };

  const formatLastRun = (lastRunAt?: string) => {
    if (!lastRunAt) return "Never run";
    const date = new Date(lastRunAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="w-full min-h-screen bg-[#000]">
      <div className="px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Running Agents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/4 rounded-4xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-6">
              <Repeat size={30} className="text-base" />
              <h2 className="text-white text-xl font-semibold">
                Running Agents
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="loader-light"></div>
              </div>
            ) : runningAgents.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                <p className="mb-2">No running agents</p>
                <p className="text-sm">Create an agent to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {runningAgents.slice(0, 3).map((agent) => (
                  <Link
                    key={agent._id}
                    href={`/app/agents/${agent._id}`}
                    className="block"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 rounded-2xl px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Image
                          src={getToolIcon(agent.tools)}
                          alt="logo"
                          width={30}
                          height={30}
                        />
                        <div className="flex-1">
                          <p className="text-white text-md font-medium">
                            {agent.name}
                          </p>
                          <p className="text-white/40 text-xs">
                            {formatLastRun(agent.lastRunAt)}
                          </p>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-base flex items-center justify-center text-white shrink-0">
                        <ArrowUpRight size={20} />
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/4 rounded-4xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-6">
              <Repeat size={30} className="text-base" />
              <h2 className="text-white text-xl font-semibold">
                Recent Activity
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
               <div className="loader-light"></div>
              </div>
            ) : recentAgents.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                <p className="mb-2">No recent activity</p>
                <p className="text-sm">Agents will appear here after running</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAgents.map((agent) => (
                  <Link
                    key={agent._id}
                    href={`/app/agents/${agent._id}`}
                    className="block"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 rounded-2xl px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Image
                          src={getToolIcon(agent.tools)}
                          alt="logo"
                          width={30}
                          height={30}
                        />
                        <div className="flex-1">
                          <p className="text-white text-md font-medium">
                            {agent.name}
                          </p>
                          <p className="text-white/40 text-xs">
                            {formatLastRun(agent.lastRunAt)}
                          </p>
                        </div>
                      </div>
                      <button className="bg-base hover:bg-base/90 text-white px-6 py-2 rounded-full text-xs font-semibold transition-colors shrink-0">
                        View
                      </button>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Agent Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-white/4 rounded-4xl px-8 py-10 flex flex-col items-center justify-center text-center border border-white/10 hover:border-base/50 transition-all cursor-pointer"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-4"
            >
              <Sparkle size={48} className="text-base" weight="fill" />
            </motion.div>
            <h3 className="text-white font-semibold mb-3 text-2xl">
              Have a task that you need to automate?
            </h3>
            <p className="text-white/50 text-sm mb-6 max-w-md">
              Create an agent today and watch your tasks being done in real
              time.
            </p>
            <button className="bg-base hover:bg-base/90 text-white px-8 py-3 rounded-full font-semibold text-sm transition-colors">
              Create an Agent
            </button>
          </motion.div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/4 rounded-4xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-5">
              <Sparkle size={26} className="text-base" weight="fill" />
              <h2 className="text-white text-xl font-semibold">
                Axle Insights
              </h2>
            </div>

            <div className="space-y-2">
              {agents.length === 0 ? (
                <div className="text-center py-8 text-white/40 text-sm">
                  Create your first agent to see insights
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-4 bg-white/5 py-4 px-3 rounded-2xl">
                    <Image
                      src="/logo.svg"
                      width={28}
                      height={28}
                      alt="Insight"
                    />
                    <p className="text-white/80 text-sm">
                      You have {agents.length} agent
                      {agents.length !== 1 ? "s" : ""} configured
                    </p>
                  </div>
                  <div className="flex items-start gap-4 bg-white/5 py-4 px-3 rounded-2xl">
                    <Image
                      src="/logo.svg"
                      width={28}
                      height={28}
                      alt="Insight"
                    />
                    <p className="text-white/80 text-sm">
                      {runningAgents.length} agent
                      {runningAgents.length !== 1 ? "s are" : " is"} currently
                      running
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Connect Integration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/4 rounded-4xl px-8 py-10 flex flex-col items-center justify-center text-center border border-white/10"
          >
            <h3 className="text-white font-semibold mb-3 text-2xl">
              Connect Integrations
            </h3>
            <p className="text-white/50 text-sm mb-6 max-w-md">
              Connect your favorite tools to unlock more automation
              possibilities.
            </p>
            <Link
              href="/app/apps"
              className="bg-base hover:bg-base/90 text-white px-8 py-3 rounded-full font-semibold text-sm transition-colors"
            >
              Browse Integrations
            </Link>
          </motion.div>
        </div>

        {/* Ask Axle Input */}
        <div className="flex justify-center mt-8">
          <AxleInput />
        </div>
      </div>

      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadAgents}
      />
    </div>
  );
};

export default Page;
