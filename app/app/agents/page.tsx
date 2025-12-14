"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { agentsAPI } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { CreateAgentModal } from "@/components/agents/CreateAgentModal";
import { CircleNotch, Trash } from "@phosphor-icons/react";

interface Agent {
  _id: string;
  name: string;
  description?: string;
  schedule?: {
    enabled: boolean;
    intervalMinutes?: number;
  };
  lastRunAt?: string;
  tools?: string[];
  createdAt?: string;
}

const AgentsGrid = () => {
  const { showToast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      // ✅ agentsAPI.list() now directly returns Agent[]
      const data = await agentsAPI.list();
      const resData = data.agents!
      setAgents(resData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load agents";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this agent?")) return;

    try {
      setDeletingId(id);
      await agentsAPI.delete(id);
      showToast("Agent deleted successfully", "success");
      loadAgents();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete agent";
      showToast(message, "error");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleAgent = async (
    id: string,
    enabled: boolean,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await agentsAPI.update(id, {
        schedule: {
          enabled,
          intervalMinutes: 5,
        },
      });
      showToast(enabled ? "Agent enabled" : "Agent disabled", "success");
      loadAgents();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update agent";
      showToast(message, "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#000]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="loader-light"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-10 bg-[#000]">
        {/* Create Agent Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-white/4 rounded-4xl px-8 py-10 flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed border-white/10 hover:border-base/50 transition-all"
        >
          <motion.div
            // animate={{ scale: [1, 1.1, 1] }}
            // transition={{ duration: 2, repeat: Infinity }}
            className="mb-4"
          >
            <div className="w-16 h-16 rounded-full bg-base/20 flex items-center justify-center">
              <span className="text-3xl text-base">+</span>
            </div>
          </motion.div>
          <h3 className="text-white font-semibold mb-3 text-2xl">
            Have a task that you need to automate?
          </h3>
          <p className="text-white/50 text-sm mb-6 max-w-md">
            Create an agent today and watch your tasks being done in real time.
          </p>
          <button className="bg-base hover:bg-base/90 text-white px-12 py-4 rounded-full font-semibold text-sm transition-colors">
            Create an Agent
          </button>
        </motion.div>

        {/* Agent Cards */}
        {agents.map((agent, index) => {
          const isEnabled = agent.schedule?.enabled ?? false;
          const lastRun = agent.lastRunAt
            ? new Date(agent.lastRunAt).toLocaleDateString()
            : "Never";

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              key={agent._id}
              className="bg-white/4 rounded-4xl p-8 flex flex-col justify-between border border-white/10 hover:border-base/30 transition-all relative group"
            >
              {/* Delete Button */}
              <button
                onClick={(e) => handleDelete(agent._id, e)}
                disabled={deletingId === agent._id}
                className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                {deletingId === agent._id ? (
                  <CircleNotch size={16} className="animate-spin" />
                ) : (
                  <Trash size={16} />
                )}
              </button>

              <div className="mb-5">
                <h3 className="text-white text-2xl font-semibold mb-1">
                  {agent.name}
                </h3>
                {/* <p className="text-white/60 text-sm mb-2">
                  {agent.tools?.length
                    ? `Tools: ${agent.tools.join(", ")}`
                    : "No tools configured"}
                </p> */}
                <p className="text-white/40 text-sm bg-white/5 p-3 rounded-2xl min-h-[60px] overflow-y-hidden">
                  {agent.description || "No description provided"}
                </p>
                <p className="text-white/30 text-xs mt-2">
                  Last run: {lastRun}
                </p>
              </div>

              {/* Bottom Section */}
              <div className="flex items-end justify-between gap-3">
                {/* View Button */}
                <Link
                  href={`/app/agents/${agent._id}`}
                  className="bg-base hover:bg-base/90 transition-all text-white font-semibold py-3.5 rounded-full flex-1 text-center"
                >
                  View Agent
                </Link>

                {/* Toggle Section */}
                <div className="flex flex-col items-end">
                  <span className="text-white/60 text-[12px] mb-1">
                    {isEnabled ? "Enabled" : "Disabled"}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={(e) =>
                        toggleAgent(agent._id, e.target.checked, e)
                      }
                      className="sr-only peer"
                    />

                    <div className="w-12 h-6 bg-white/10 rounded-full peer peer-checked:bg-[#00c776] transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:after:translate-x-5"></div>
                  </label>
                </div>
              </div>
            </motion.div>
          );
        })}

        {agents.length === 0 && (
          <div className="col-span-full text-center py-20">
            <p className="text-white/50 text-lg mb-4">No agents yet</p>
            <p className="text-white/30 text-sm">
              Create your first agent to get started
            </p>
          </div>
        )}
      </div>

      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadAgents}
      />
    </>
  );
};

export default AgentsGrid;
