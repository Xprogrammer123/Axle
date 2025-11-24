"use client"
import React from "react";
import Logo from "./Logo";
import { ClockCounterClockwiseIcon, GitBranchIcon, GitPullRequestIcon, PlugsIcon, SquaresFourIcon, TerminalWindowIcon } from "@phosphor-icons/react";

const sidebarData = [
  { id: 1, icon: SquaresFourIcon, name: "Dashboard" },
  { id: 2, icon: TerminalWindowIcon, name: "Scripts" },
  { id: 3, icon: ClockCounterClockwiseIcon, name: "Cron Jobs" },
  { id: 4, icon: GitBranchIcon, name: "CI/CD Configs" },
  { id: 5, icon: GitPullRequestIcon, name: "PR Summary" },
  { id: 6, icon: PlugsIcon, name: "Integrations" },
];

const Sidebar = () => {
  return (
    <aside className="w-auto p-4 h-full">
      <nav className="flex flex-col gap-3">
        {sidebarData.map(({ id, icon: Icon }) => (
          <div
            key={id}
            className="flex items-center gap-3 hover:bg-base text-dark transition-all duration-300 cursor-pointer p-3 hover:text-white rounded-xl w-full"
          >
            {Icon && <Icon className="w-6 h-6" />}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
