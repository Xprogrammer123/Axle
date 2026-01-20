"use client";
import React from "react";
import Logo from "./Logo";
import {
  CardsThreeIcon,
  CreditCardIcon,
  CubeIcon,
  GearIcon,
  HouseIcon,
  SquaresFourIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Home",
      href: "/app",
      icons: HouseIcon,
    },
    {
      name: "Agents",
      href: "/app/agents",
      icons: CubeIcon,
    },
    {
      name: "Billing",
      href: "/app/billing",
      icons: CreditCardIcon,
    },
    {
      name: "Apps",
      href: "/app/apps",
      icons: SquaresFourIcon,
    },
    {
      name: "Settings",
      href: "/app/settings",
      icons: GearIcon,
    },
  ];

  return (
    <div className="bg-dark/4 hidden md:flex md:relative items-center flex-col justify-between p-4.5 w-64 lg:w-72 h-full">
      <div className="w-full">
        <div className="flex w-full text-xl font-bold text-dark items-center gap-1">
          <Logo size={28} />
          Axle
        </div>
        <nav className="flex w-full h-full flex-col pt-12 lg:pt-16 gap-2 py-4">
          {navigation.map(({ name, href, icons: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={name}
                href={href}
                className={`flex hover:bg-dark/5 hover:shadow-lg transition-all duration-300 shadow-dark/5 w-full text-dark/50 p-2.5 rounded-xl gap-2 lg:gap-1.5 items-center ${
                  isActive
                    ? "bg-accent hover:bg-accent text-white font-semibold"
                    : ""
                }`}
              >
                <Icon
                  size={18}
                  weight={isActive ? "fill" : "regular"}
                  className="flex shrink-0"
                />
                <p className="font-medium text-sm">{name}</p>
              </Link>
            );
          })}
        </nav>
      </div>
      
    </div>
  );
};

export default Sidebar;
