"use client";

import { BellIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { api } from "@/lib/api";
import { NotificationDrawer } from "@/components-beta/NotificationDrawer";

/* =======================
   Types
======================= */

type NotificationCategory =
  | "messages"
  | "mentions"
  | "updates"
  | "reminders"
  | "alerts"
  | "system";

type NotificationPriority = "low" | "normal" | "high" | "urgent";

type HeaderNotification = {
  id: string;
  title: string;
  description: string;
  type: "info" | "warning" | "success" | "alert";
  category: NotificationCategory;
  priority: NotificationPriority;
  timestamp: string;
  sourceApp?: string;
  richContent?: any;
  actionButtons?: any[];
  deepLink?: string;
};

/* =======================
   Helpers
======================= */

const asRecord = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" ? (v as Record<string, unknown>) : {};

const normalizeNotifications = (raw: unknown[]): HeaderNotification[] =>
  (raw || []).map((n, idx) => {
    const r = asRecord(n);

    return {
      id: String(r.id ?? r._id ?? idx),
      title: String(r.title ?? "Notification"),
      description: String(r.snippet ?? r.description ?? r.message ?? ""),
      type: (r.type as any) ?? "info",
      category: (r.category as any) ?? "system",
      priority: (r.priority as any) ?? "normal",
      timestamp: String(
        r.timestamp ?? r.createdAt ?? new Date().toISOString(),
      ),
      sourceApp: String(r.source ?? r.sourceApp ?? ""),
      richContent: r.richContent,
      actionButtons: (r.actionButtons as any[]) || [],
      deepLink: String(r.deepLink ?? ""),
    };
  });

/* =======================
   Component
======================= */

const Header = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<HeaderNotification[]>([]);

  // Hide header on agent details page: /app/agents/[id]
  // This regex matches /app/agents/ followed by any non-empty string that doesn't contain another slash (to avoid matching sub-sub-routes if any, though usually fine)
  // It ensures we don't hide on /app/agents (the list)
  if (pathname?.match(/^\/app\/agents\/[^/]+$/)) {
    return null;
  }

  const openNotifications = async () => {
    setOpen(true);
    try {
      const res = (await api.syncNotifications()) as unknown;
      const rec = asRecord(res);
      setNotifications(
        normalizeNotifications((rec.notifications as unknown[]) || []),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const dismiss = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="top-2 z-50 w-fit rounded-full fixed right-0 flex justify-end p-3">
      <NotificationDrawer
        isOpen={open}
        onClose={() => setOpen(false)}
        notifications={notifications}
        onDismissAll={() => setNotifications([])}
        onMarkAsRead={dismiss}
        onArchive={dismiss}
        onSnooze={dismiss}
      />

      <button
        id="header-notifications-btn"
        onClick={openNotifications}
        aria-label="Open notifications"
        className="relative text-accent backdrop-blur-md cursor-pointer p-3 rounded-full bg-dark/5 dark:bg-white/5 transition"
      >
        <BellIcon size={20} weight="bold" />

        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-base text-[10px] font-semibold text-white flex items-center justify-center">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        )}
      </button>
    </div>
  );
};

export default Header;
