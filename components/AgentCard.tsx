import React from "react";
import { CheckCircle } from "@phosphor-icons/react";

interface AgentCardProps {
  title: string;
  description: string;
  status?: "running" | "success" | "pending";
}

export const AgentCard: React.FC<AgentCardProps> = ({
  title,
  description,
  status = "running",
}) => {
  const statusColor =
    status === "success"
      ? "bg-base"
      : status === "running"
      ? "bg-base"
      : "bg-dark/20";

  return (
    <div className="flex items-center justify-between bg-card/40 hover:bg-card/60 transition-all duration-300 rounded-xl p-4 gap-4 border border-white/5">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 rounded-full bg-dark/40 flex items-center justify-center shrink-0">
          <div className="w-6 h-6 rounded-full bg-base/30"></div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-white text-sm font-medium">{title}</p>
          <p className="text-white/40 text-xs">{description}</p>
        </div>
      </div>
      <div
        className={`${statusColor} px-4 py-2 rounded-full text-white text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity`}
      >
        Review 
      </div>
    </div>
  );
};
