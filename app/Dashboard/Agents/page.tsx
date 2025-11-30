"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

interface Agent {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  enabled: boolean;
}

const AgentsGrid = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 1,
      title: "GitHub Agent",
      subtitle: "Agent for GitHub and X.",
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quaerat, aliquid dignissimos! Beatae quibusdam vitae quas reiciendis, error dolor velit.",
      enabled: true,
    },
    {
      id: 2,
      title: "GitHub Agent",
      subtitle: "Agent for GitHub and X.",
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quaerat, aliquid dignissimos! Beatae quibusdam vitae quas reiciendis, error dolor velit.",
      enabled: false,
    },
    {
      id: 3,
      title: "GitHub Agent",
      subtitle: "Agent for GitHub and X.",
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quaerat, aliquid dignissimos! Beatae quibusdam vitae quas reiciendis, error dolor velit.",
      enabled: true,
    },
    {
      id: 4,
      title: "GitHub Agent",
      subtitle: "Agent for GitHub and X.",
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quaerat, aliquid dignissimos! Beatae quibusdam vitae quas reiciendis, error dolor velit.",
      enabled: true,
    },
    {
      id: 5,
      title: "GitHub Agent",
      subtitle: "Agent for GitHub and X.",
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quaerat, aliquid dignissimos! Beatae quibusdam vitae quas reiciendis, error dolor velit.",
      enabled: false,
    },
  ]);

  // ✅ Typed parameter
  const toggleAgent = (id: number) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-10 bg-[#000] min-h-screen">
      {/* Create Agent Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/4 rounded-4xl px-16 py-10 flex flex-col items-center justify-center text-center "
      >
        <h3 className="text-white font-semibold mb-3 text-2xl ">
          Have a thing task that you need to automate?
        </h3>
        <p className="text-white/50 text-sm mb-6 max-w-mb">
          Create an agent today and <br /> watch your tasks being done in real
          time.
        </p>
        <button className="bg-base hover:bg-base/90 text-white px-8 py-3 rounded-full font-semibold text-sm transition-colors">
          Create an Agent
        </button>
      </motion.div>

      
      {agents.map((agent) => (
        <motion.div
          whileHover={{ scale: 1.02 }}
          key={agent.id}
          className="bg-[#0b0b0b] rounded-3xl p-8 flex flex-col justify-between border border-white/10"
        >
          <div>
            <h3 className="text-white text-lg font-semibold mb-1">
              {agent.title}
            </h3>
            <p className="text-white/60 text-sm mb-4">{agent.subtitle}</p>
            <p className="text-white/40 text-sm leading-relaxed bg-white/5 p-4 rounded-xl">
              {agent.description}
            </p>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button className="bg-[#00c776] hover:bg-[#00e186] transition-all text-black font-semibold px-6 py-2 rounded-full">
              View Agent
            </button>

            <div className="flex items-center gap-2">
              <span className="text-white/60 text-xs">Enable/Disable</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={agent.enabled}
                  onChange={() => toggleAgent(agent.id)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:bg-[#00c776] transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AgentsGrid;
