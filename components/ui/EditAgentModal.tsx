"use client";
import React, { useState, useEffect } from "react";
import { XIcon } from "@phosphor-icons/react";
import { api } from "@/lib/api";

interface Agent {
  _id: string;
  name: string;
  description?: string;
  instructions?: string;
  status?: string;
}

interface EditAgentModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const EditAgentModal: React.FC<EditAgentModalProps> = ({
  agent,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [status, setStatus] = useState<"active" | "paused">("active");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (agent && isOpen) {
      setName(agent.name || "");
      setDescription(agent.description || "");
      setInstructions(agent.instructions || "");
      setStatus((agent.status as "active" | "paused") || "active");
    }
  }, [agent, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent) return;

    try {
      setLoading(true);
      await api.updateAgent(agent._id, {
        name,
        description,
        instructions,
        status,
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to update agent:", error);
      alert("Failed to update agent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (isOpen && !agent) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
        <div className="bg-black/50 fixed inset-0 backdrop-blur-sm" onClick={onClose} />
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl relative z-10">
          <p className="text-gray-500 dark:text-gray-400">Loading agent data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-[100] animate-in fade-in"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
        <div
          className="bg-white dark:bg-black/80 backdrop-blur-xl border-2 border-gray-200 dark:border-white/10 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Agent</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              <XIcon className="text-gray-500 dark:text-white/70 text-xl" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:border-[#36B460] transition-colors"
                placeholder="Agent name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:border-[#36B460] transition-colors resize-none"
                placeholder="What does this agent do?"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">
                Instructions
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:border-[#36B460] transition-colors resize-none font-mono text-sm"
                placeholder="System instructions for the agent..."
                rows={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">
                Status
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "active" | "paused")}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#36B460] transition-colors appearance-none"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-white/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-transparent dark:border-white/10 rounded-xl text-gray-900 dark:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-b from-[#36B460] to-[#049C20] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};


