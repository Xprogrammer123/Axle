"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SquaresFour, Cpu, Plugs, Faders } from "@phosphor-icons/react";

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  id: string;
}

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: <SquaresFour size={20} weight="bold" />,
    href: "/app",
    id: "app",
  },
  {
    label: "Agents",
    icon: <Cpu size={20} weight="bold" />,
    href: "/app/agents",
    id: "agents",
  },
  {
    label: "Apps",
    icon: <Plugs size={20} weight="bold" />,
    href: "/app/apps",
    id: "apps",
  },
  {
    label: "Settings",
    icon: <Faders size={20} weight="bold" />,
    href: "/app/settings",
    id: "settings",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  // ✅ Fix: Match exact route (case-insensitive)
  const isActive = (href: string) => pathname === href;

  return (
    <div className="w-70 h-screen fixed left-0 top-0 flex flex-col p-6">
      {/* Logo */}
      <div className="flex items-center mb-12">
        <Image
          src="/logo.svg"
          alt="Axle Logo"
          width={28}
          height={28}
          className="w-8 h-8"
        />
        <span className="text-white text-3xl font-bold">xle</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-5 flex-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200 ${
              isActive(item.href)
                ? "bg-base text-white"
                : "text-white/60 hover:text-white/80 hover:bg-white/5"
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
