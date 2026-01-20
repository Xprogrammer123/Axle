"use client";

import { useState } from "react";
import {
  List,
  X,
  HouseIcon,
  CubeIcon,
  CardsThreeIcon,
  SquaresFourIcon,
  GearIcon,
  CreditCardIcon,
  HandshakeIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { motion, AnimatePresence } from "framer-motion";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  const secondaryNavigation = [
    {
      name: "Billing",
      href: "/app/billing",
      icons: CreditCardIcon,
    },
    // {
    //   name: "Feedback",
    //   href: "/app/feedback",
    //   icons: HandshakeIcon,
    // },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-accent shadow-lg"
        aria-label="Open menu"
      >
        <List size={20} />
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl border-r border-dark/10 shadow-2xl z-50 md:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-dark/5">
                <div className="flex items-center gap-2 text-xl font-bold text-dark">
                  <Logo size={28} />
                  Axle
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-dark/60 hover:bg-dark/5 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto">
                <nav className="p-4 space-y-2">
                  {navigation.map(({ name, href, icons: Icon }) => {
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={name}
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-accent text-white shadow-lg"
                            : "text-dark/70 hover:bg-dark/5 hover:text-dark"
                        }`}
                      >
                        <Icon
                          size={20}
                          weight={isActive ? "fill" : "regular"}
                          className="flex-shrink-0"
                        />
                        <span className="font-medium">{name}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Secondary Navigation */}
                {/* <div className="p-4 border-t border-dark/5 mt-4">
                  <div className="space-y-2">
                    {secondaryNavigation.map(({ name, href, icons: Icon }) => (
                      <Link
                        key={name}
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl text-dark/70 hover:bg-dark/5 hover:text-dark transition-all duration-200"
                      >
                        <Icon size={18} className="flex-shrink-0" />
                        <span className="font-medium text-sm">{name}</span>
                      </Link>
                    ))}
                  </div>
                </div> */}  
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;
