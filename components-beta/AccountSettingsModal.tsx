"use client";
import { SignOutIcon, UserCircleIcon, WalletIcon } from "@phosphor-icons/react";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { api, clearToken } from "@/lib/api";
import { useRouter } from "next/navigation";

type ProfileData = {
  name?: string;
  email?: string;
  avatar?: string;
  plan?: string;
  tokensUsed?: number;
  tokensTotal?: number;
  tokensPurchased?: number;
};

type AccountSettingsModalProps = {
  profile: ProfileData | null;
  loading: boolean;
  onClose: () => void;
};

const AccountSettingsModal = ({ profile, loading: initialLoading, onClose }: AccountSettingsModalProps) => {
  const router = useRouter();
  const [subscription, setSubscription] = React.useState<any>(null);
  const [fetching, setFetching] = React.useState(true);

  const loading = initialLoading || fetching;

  React.useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setFetching(true);
        const data = await api.getBillingStatus();
        setSubscription(data);
      } catch (error) {
        console.error("Failed to fetch billing status:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchSubscription();
  }, []);

  const credits = subscription?.credits ?? profile?.tokensUsed ?? 0;
  const creditsLimit = subscription?.creditsLimit ?? profile?.tokensTotal ?? 1000;
  const plan = subscription?.plan || profile?.plan || "Free";
  const usedPercentage = creditsLimit > 0 ? ((creditsLimit - credits) / creditsLimit) * 100 : 0;

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearToken();
      router.push("/auth/login");
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="bg-white/35 dark:bg-black/35 p-3 shadow-xl shadow-dark/16 dark:shadow-black/1 rounded-2xl backdrop-blur-md absolute bottom-18 left-0 right-0 z-50"
    >
      <div className="border border-dark/7 dark:border-white/2 rounded-xl w-full p-3 h-full">
        <div className="flex flex-col gap-2.5">
          {/* Token usage section */}
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex justify-between items-center">
              <p className="text-xs dark:text-white/60 text-dark/60 font-medium">Credits Available</p>
              {loading ? (
                <div className="w-16 h-3 bg-dark/10 dark:bg-white/10 rounded animate-pulse" />
              ) : (
                <p className="text-xs text-accent font-bold">
                  {credits.toLocaleString()}/{creditsLimit.toLocaleString()}
                </p>
              )}
            </div>
            <div className="h-2 w-full mt-2 rounded-full bg-dark/6 dark:bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: loading ? "50%" : `${100 - usedPercentage}%` }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              />
            </div>
            <div className="flex text-xs text-dark/50 dark:text-white/50 items-center mt-1.5">
              {loading ? (
                <div className="w-32 h-3 bg-dark/10 dark:bg-white/10 rounded animate-pulse" />
              ) : (
                <>Plan: <span className="capitalize ml-1 mr-1">{plan}</span> • {subscription?.subscriptionCurrentPeriodEnd ? `Resets: ${new Date(subscription.subscriptionCurrentPeriodEnd).toLocaleDateString()}` : "Free Plan"}</>
              )}
            </div>
          </motion.div>

          {/* Menu items */}
          <div className="flex flex-col gap-1 mt-1">
            <motion.div
              custom={0}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                href="/app/settings"
                onClick={onClose}
                className="flex gap-1 p-2 hover:bg-accent/10 cursor-pointer dark:text-white/60 text-dark/60 rounded-lg transition-all duration-300 hover:text-accent items-center"
              >
                <UserCircleIcon size={18} weight="regular" />
                <p className="text-sm font-medium">Profile</p>
              </Link>
            </motion.div>

            <motion.div
              custom={1}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                href="/app/billing"
                onClick={onClose}
                className="flex gap-1 p-2 hover:bg-accent/10 cursor-pointer dark:text-white/60 text-dark/60 rounded-lg transition-all duration-300 hover:text-accent items-center"
              >
                <WalletIcon size={18} weight="regular" />
                <p className="text-sm font-medium">Billing</p>
              </Link>
            </motion.div>

            <motion.div
              custom={2}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="h-px w-full dark:bg-white/10 bg-dark/10 my-1 rounded-full" />
            </motion.div>

            <motion.div
              custom={3}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
            >
              <button
                onClick={handleLogout}
                className="flex gap-1 p-2 hover:bg-red-600/10 cursor-pointer dark:text-red-500 text-red-600 rounded-lg transition-all duration-300 items-center w-full"
              >
                <SignOutIcon size={18} weight="regular" />
                <p className="text-sm font-medium">Logout</p>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AccountSettingsModal;
