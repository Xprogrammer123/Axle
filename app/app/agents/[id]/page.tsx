"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  CheckCircleIcon,
  Trash,
  CircleNotch,
} from "@phosphor-icons/react";
import Link from "next/link";
import { agentsAPI } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
interface Agent {
  _id: string;
  name: string;
  description?: string;
  systemPrompt?: string;
  schedule?: {
    enabled: boolean;
    intervalMinutes?: number;
  };
  lastRunAt?: string;
  createdAt?: string;
  tools?: string[];
  logs?: Array<{ message: string; createdAt: string }>;
}

const AgentDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const agentId = params?.id as string;
  console.log(agentId)

  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    systemPrompt: "",
  });

  useEffect(() => {
    if (agentId) {
      loadAgent();
    }
  }, [agentId,]);

  const loadAgent = async () => {
    try {
      setLoading(true);
      const data = await agentsAPI.get(agentId); // returns Agent with _id
      console.log(data)
      setAgent(data);
      setFormData({
        name: data.name || "",
        description: data.description || "",
        systemPrompt: data.systemPrompt || "",
      });
    } catch (error) {
      showToast((error as Error).message || "Failed to load agent", "error");
      router.push("/app/agents");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!agent) return;

    setIsSaving(true);
    try {
      await agentsAPI.update(agent._id, {
        name: formData.name,
        description: formData.description,
        systemPrompt: formData.systemPrompt,
      });
      showToast("Agent updated successfully", "success");
      setIsEditing(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update agent";
      showToast(message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (agent) {
      setFormData({
        name: agent.name || "",
        description: agent.description || "",
        systemPrompt: agent.systemPrompt || "",
      });
    }
    setIsEditing(false);
  };

  const toggleEnabled = async () => {
    if (!agent) return;

    try {
      await agentsAPI.update(agent._id, {
        schedule: {
          enabled: !agent.schedule?.enabled,
          intervalMinutes: agent.schedule?.intervalMinutes || 5,
        },
      });
      showToast(
        !agent.schedule?.enabled ? "Agent enabled" : "Agent disabled",
        "success"
      );
      // reload to reflect state
      loadAgent();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update agent";
      showToast(message, "error");
    }
  };

  const handleRun = async () => {
    if (!agent) return;

    setIsRunning(true);
    try {
      await agentsAPI.run(agent._id);
      showToast("Agent run started", "success");
      setTimeout(() => {
        loadAgent();
      }, 2000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to run agent";
      showToast(message, "error");
    } finally {
      setIsRunning(false);
    }
  };

  const handleDelete = async () => {
    if (!agent) return;
    if (!confirm("Are you sure you want to delete this agent?")) return;

    try {
      await agentsAPI.delete(agent._id);
      showToast("Agent deleted successfully", "success");
      router.push("/app/agents");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete agent";
      showToast(message, "error");
    }
  };

  const getStatusColor = () => {
    if (!agent) return "bg-white/20";
    const isEnabled = agent.schedule?.enabled ?? false;
    return isEnabled ? "bg-[#00c776]" : "bg-white/20";
  };

  const getStatusText = () => {
    if (!agent) return "Unknown";
    const isEnabled = agent.schedule?.enabled ?? false;
    return isEnabled ? "Active" : "Inactive";
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

  if (!agent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#000]">
        <p className="text-white/50">Agent not found</p>
      </div>
    );
  }

  const logs = agent.logs || [];
  const lastRun = agent.lastRunAt
    ? new Date(agent.lastRunAt).toLocaleString()
    : "Never";
  const createdAt = agent.createdAt
    ? new Date(agent.createdAt).toLocaleDateString()
    : "Unknown";
    
  return (
    <div className="min-h-screen bg-[#000]">
      <div className="max-w-7xl mx-auto p-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Link
            href="/app/agents"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Agents</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
              <span className="text-white/80 text-sm font-medium">
                {getStatusText()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-sm">Enable/Disable</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={agent.schedule?.enabled ?? false}
                  onChange={toggleEnabled}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-white/10 rounded-full peer peer-checked:bg-[#00c776] transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Agent Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/4 rounded-4xl p-8 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-white text-4xl font-bold">Agent Details</h1>
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-full bg-base hover:bg-base/90 text-white text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSaving ? (
                          <>
                            <CircleNotch size={16} className="animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon size={16} />
                            Save Changes
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-2">
                    Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-base transition-all"
                    />
                  ) : (
                    <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white">
                      {agent.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white/60 text-sm font-medium mb-2">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-base transition-all resize-none"
                    />
                  ) : (
                    <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white min-h-[100px]">
                      {agent.description || "No description provided"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white/60 text-sm font-medium mb-2">
                    Instructions / System Prompt
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.systemPrompt}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          systemPrompt: e.target.value,
                        }))
                      }
                      rows={6}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-base transition-all resize-none"
                    />
                  ) : (
                    <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white min-h-[150px]">
                      {agent.systemPrompt || "No instructions provided"}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Logs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/4 rounded-4xl p-8 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-2xl font-bold">Logs</h2>
                <button
                  onClick={handleRun}
                  disabled={isRunning || !agent.schedule?.enabled}
                  className="px-4 py-2 rounded-full bg-base hover:bg-base/90 text-white text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunning ? (
                    <>
                      <CircleNotch size={16} className="animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      Run Agent
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-none">
                {logs.length === 0 ? (
                  <div className="text-center py-12 text-white/40">
                    No logs available
                  </div>
                ) : (
                  logs
                    .slice()
                    .reverse()
                    .map((log, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white/5 rounded-2xl p-4 flex items-start gap-3 hover:bg-white/10 transition-colors"
                      >
                        <Clock size={16} className="text-white/40 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-white text-sm mb-1">
                            {log.message}
                          </p>
                          <p className="text-white/40 text-xs">
                            {new Date(log.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/4 rounded-4xl p-6 border border-white/10"
            >
              <h3 className="text-white text-xl font-bold mb-4">Agent Info</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-white/60 text-xs mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusColor()}`}
                    />
                    <p className="text-white font-medium">{getStatusText()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-white/60 text-xs mb-1">Last Run</p>
                  <p className="text-white font-medium">{lastRun}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs mb-1">Created</p>
                  <p className="text-white font-medium">{createdAt}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs mb-1">Tools</p>
                  <p className="text-white font-medium">
                    {agent.tools?.length || 0} configured
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/4 rounded-4xl p-6 border border-white/10"
            >
              <h3 className="text-white text-xl font-bold mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleRun}
                  disabled={isRunning || !agent.schedule?.enabled}
                  className="w-full px-4 py-3 rounded-full bg-base hover:bg-base/90 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunning ? (
                    <>
                      <CircleNotch size={18} className="animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play size={18} />
                      Run Agent
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                >
                  {isEditing ? "Cancel Edit" : "Edit Agent"}
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-3 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Trash size={18} />
                  Delete Agent
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailPage;
