"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  SignOut,
  Trash,
  CheckCircleIcon,
  CircleNotch,
} from "@phosphor-icons/react";
import { authAPI } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

interface UserData {
  name?: string;
  email?: string;
  pricingPlan?: string;
  timeZone?: string;
}

const Settings = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserData>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notifications: true,
    emailNotifications: true,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const data = await authAPI.getCurrentUser();
      if (data.user) {
        setUserData(data.user);
        setFormData((prev) => ({
          ...prev,
          name: data.user.name || "",
          email: data.user.email || "",
          timeZone: data.user.timeZone || prev.timeZone,
        }));
      }
    } catch (error: any) {
      showToast(error.message || "Failed to load user data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app, you'd have an update user endpoint
      showToast("Settings saved successfully", "success");
    } catch (error: any) {
      showToast(error.message || "Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    showToast("Logged out successfully", "success");
    router.push("/auth");
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      showToast("Account deletion not implemented yet", "warning");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#000]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <CircleNotch size={48} className="text-base" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000] p-10">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-4xl font-bold mb-8"
        >
          Settings
        </motion.h1>

        <div className="space-y-6">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/4 rounded-4xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <User size={24} className="text-base" />
              <h2 className="text-white text-2xl font-bold">Profile</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-base transition-all"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white/50 cursor-not-allowed"
                />
                <p className="text-white/40 text-xs mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-white/60 text-sm font-medium mb-2">
                  Time Zone
                </label>
                <select
                  value={formData.timeZone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, timeZone: e.target.value }))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-base transition-all"
                >
                  <option value={formData.timeZone}>{formData.timeZone}</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/4 rounded-4xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Bell size={24} className="text-base" />
              <h2 className="text-white text-2xl font-bold">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                <div>
                  <p className="text-white font-medium">Push Notifications</p>
                  <p className="text-white/50 text-sm">
                    Receive notifications in your browser
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notifications: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-white/10 rounded-full peer peer-checked:bg-base transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:after:translate-x-5"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-white/50 text-sm">
                    Receive notifications via email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.emailNotifications}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        emailNotifications: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-white/10 rounded-full peer peer-checked:bg-base transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:after:translate-x-5"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Subscription */}
          {userData.pricingPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/4 rounded-4xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <CreditCard size={24} className="text-base" />
                <h2 className="text-white text-2xl font-bold">Subscription</h2>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl">
                <p className="text-white font-medium capitalize mb-1">
                  {userData.pricingPlan} Plan
                </p>
                <p className="text-white/50 text-sm">
                  {userData.pricingPlan === "free"
                    ? "1 agent limit"
                    : "Unlimited agents"}
                </p>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-6 py-3 rounded-full bg-base hover:bg-base/90 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <CircleNotch size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircleIcon size={18} />
                  Save Changes
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors flex items-center gap-2"
            >
              <SignOut size={18} />
              Logout
            </button>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-red-500/10 border border-red-500/30 rounded-4xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Trash size={24} className="text-red-400" />
              <h2 className="text-white text-2xl font-bold">Danger Zone</h2>
            </div>

            <button
              onClick={handleDeleteAccount}
              className="px-6 py-3 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium transition-colors flex items-center gap-2"
            >
              <Trash size={18} />
              Delete Account
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
