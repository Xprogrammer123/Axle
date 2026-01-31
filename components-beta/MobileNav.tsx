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
      name: "Templates",
      href: "/app/templates",
      icons: CardsThreeIcon,
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
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-5.5 left-4 z-40 w-10 h-10 rounded-full bg-surface/60 dark:bg-white/5 backdrop-blur-md border border-border flex items-center justify-center text-accent shadow-0"
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
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-57 bg-surface dark:bg-[#0a0a0a] border-r border-border shadow-2xl z-50 md:hidden flex flex-col p-4.5"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex text-xl font-bold text-text items-center gap-1">
                  <Logo size={28} />
                  Axle
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted dark:text-white/35 hover:bg-surface transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-2">
                {navigation.map(({ name, href, icons: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={name}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={`
                          relative flex items-center gap-2 p-[9px] rounded-xl
                          font-semibold transition-all duration-300
                          glass
                          hover:inner-hover hover:scale-[0.99]
                          ${isActive
                          ? "bg-accent dark:bg-accent-dark dark:inner-pressed"
                          : "hover:bg-white/10 dark:hover:bg-white/[0.06]"
                        }
                        `}
                    >
                      <Icon
                        size={20}
                        weight={isActive ? "fill" : "bold"}
                        className={`shrink-0 dark:text-white text-dark/50 ${isActive ? "drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] text-white" : ""}`}
                      />
                      <p
                        className={`
                            text-sm dark:bg-clip-text text-dark/50 dark:text-transparent
                            dark:bg-linear-to-b dark:from-white dark:via-neutral-300 dark:to-neutral-500
                            ${isActive ? "text-white dark:text-white" : ""}
                          `}
                      >
                        {name}
                      </p>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicatorMobile"
                          className="absolute inset-0 bg-accent/10 dark:bg-white/5 rounded-xl -z-10"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Bottom Section */}
              <div className="flex flex-col py-4 gap-2 mt-auto">
                <Link
                  href="/app/billing"
                  onClick={() => setIsOpen(false)}
                  className="bg-dark/4 hover:bg-accent/15 hover:shadow-accent/15 transition-all duration-300 shadow-lg shadow-dark/0 hover:border-accent/35 hover:text-accent dark:bg-white/4 dark:text-white text-dark/50 flex gap-2 text-xs p-2.5 border-dark/5 dark:border-white/5 border rounded-xl items-center"
                >
                  <CreditCardIcon size={16} weight="bold" className="shrink-0" />
                  Billing
                </Link>
                <Link
                  href="/app/feedback"
                  onClick={() => setIsOpen(false)}
                  className="bg-dark/4 hover:bg-accent/15 hover:shadow-accent/15 transition-all duration-300 shadow-lg shadow-dark/0 hover:border-accent/35 hover:text-accent dark:bg-white/4 dark:text-white text-dark/50 flex gap-2 text-xs p-2.5 border-dark/5 dark:border-white/5 border rounded-xl items-center"
                >
                  <HandshakeIcon size={16} weight="bold" className="shrink-0" />
                  Feedback
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;
