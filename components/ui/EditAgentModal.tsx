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

  if (!isOpen || !agent) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-black/80 backdrop-blur-xl border-2 border-white/10 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Edit Agent</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <XIcon className="text-white/70 text-xl" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#36B460] transition-colors"
                placeholder="Agent name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#36B460] transition-colors resize-none"
                placeholder="What does this agent do?"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Instructions
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#36B460] transition-colors resize-none font-mono text-sm"
                placeholder="System instructions for the agent..."
                rows={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "active" | "paused")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#36B460] transition-colors"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors"
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


