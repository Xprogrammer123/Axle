"use client";

import { BellIcon, GearIcon } from "@phosphor-icons/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { NotificationDrawer } from "@/components-beta/NotificationDrawer";

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
  action?: string;
  actionUrl?: string;
  sourceApp?: string;
  richContent?: {
    author?: {
      name: string;
      avatar?: string;
      handle?: string;
    };
    threadId?: string;
    threadTitle?: string;
    repository?: {
      owner: string;
      name: string;
      url: string;
    };
    eventDetails?: {
      startTime: string;
      endTime?: string;
      location?: string;
      attendees?: string[];
    };
    attachments?: Array<{
      name: string;
      type: string;
      url: string;
    }>;
    labels?: string[];
    isRead: boolean;
  };
  actionButtons?: Array<{
    label: string;
    action: "OPEN_URL" | "REPLY" | "ARCHIVE" | "MARK_READ" | "SNOOZE";
    url?: string;
    payload?: any;
  }>;
};

const normalizeNotificationType = (raw: any): HeaderNotification["type"] => {
  const t = String(raw ?? "info").toLowerCase();
  if (t === "warning") return "warning";
  if (t === "success") return "success";
  if (t === "alert" || t === "error" || t === "danger") return "alert";
  return "info";
};

const normalizeNotifications = (raw: any[]): HeaderNotification[] => {
  return (raw || []).map((n, idx) => {
    const timestamp =
      n?.timestamp || n?.createdAt || n?.created_at || new Date().toISOString();

    // Determine category based on source and content
    const determineCategory = (notification: any): NotificationCategory => {
      const source = String(
        notification?.sourceApp || notification?.source || "",
      ).toLowerCase();
      const title = String(notification?.title || "").toLowerCase();
      const desc = String(
        notification?.description || notification?.snippet || "",
      ).toLowerCase();

      if (
        source === "x" ||
        title.includes("mention") ||
        desc.includes("mentioned you")
      ) {
        return "mentions";
      }
      if (
        source === "calendar" ||
        title.includes("meeting") ||
        title.includes("reminder")
      ) {
        return "reminders";
      }
      if (
        source === "gmail" &&
        (title.includes("re:") || desc.includes("reply"))
      ) {
        return "messages";
      }
      if (
        source === "github" &&
        (title.includes("issue") ||
          title.includes("pr") ||
          title.includes("pull"))
      ) {
        return "updates";
      }
      if (notification?.type === "alert" || notification?.severity === "high") {
        return "alerts";
      }
      return "system";
    };

    // Determine priority
    const determinePriority = (notification: any): NotificationPriority => {
      const type = normalizeNotificationType(
        notification?.severity ?? notification?.level ?? notification?.type,
      );
      if (type === "alert") return "urgent";
      if (type === "warning") return "high";
      if (
        notification?.category === "mentions" ||
        notification?.category === "messages"
      )
        return "high";
      return "normal";
    };

    const category = determineCategory(n);
    const priority = determinePriority(n);

    return {
      id: String(n?.id ?? n?._id ?? idx),
      title: String(n?.title ?? n?.name ?? n?.type ?? "Notification"),
      description: String(n?.description ?? n?.message ?? n?.snippet ?? ""),
      type: normalizeNotificationType(n?.severity ?? n?.level ?? n?.type),
      category,
      priority,
      timestamp: String(timestamp),
      action: n?.action,
      actionUrl: n?.actionUrl ?? n?.url ?? n?.deepLink,
      sourceApp: n?.sourceApp ?? n?.provider ?? n?.source,
      richContent: n?.richContent
        ? {
            author: n.richContent.author,
            threadId: n.richContent.threadId,
            threadTitle: n.richContent.threadTitle,
            repository: n.richContent.repository,
            eventDetails: n.richContent.eventDetails,
            attachments: n.richContent.attachments,
            labels: n.richContent.labels,
            isRead: n.richContent.isRead ?? false,
          }
        : {
            isRead: false,
          },
      actionButtons:
        n?.actionButtons ||
        (n?.deepLink
          ? [
              {
                label: n?.action || "View",
                action: "OPEN_URL" as const,
                url: n.deepLink,
              },
            ]
          : []),
    };
  });
};

const Header = () => {
  const [profile, setProfile] = useState<any | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<HeaderNotification[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res: any = await api.getProfile();
        setProfile(res?.user || res?.profile || res);
      } catch (e) {
        console.error(e);
      }
    };
    loadProfile();
  }, []);

  const openNotifications = async () => {
    setNotificationsOpen(true);
    try {
      const res: any = await api.syncNotifications();
      setNotifications(normalizeNotifications(res?.notifications || []));
    } catch (e) {
      console.error(e);
    }
  };

  const displayName = profile?.name || profile?.email || "Account";

  const handleMarkAsRead = (notificationId: string) => {
    // TODO: Implement API call to mark notification as read
    console.log("Mark as read:", notificationId);
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const handleArchive = (notificationId: string) => {
    // TODO: Implement API call to archive notification
    console.log("Archive:", notificationId);
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const handleSnooze = (notificationId: string) => {
    // TODO: Implement API call to snooze notification
    console.log("Snooze:", notificationId);
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  return (
    <div className="flex p-3 md:p-6 justify-end w-full">
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onDismissAll={() => setNotifications([])}
        onMarkAsRead={handleMarkAsRead}
        onArchive={handleArchive}
        onSnooze={handleSnooze}
      />

      <div className="flex items-center gap-4 md:gap-16 p-2 rounded-full bg-dark/3 border border-dark/4 shadow shadow-dark/5 max-w-full">
        <div className="flex items-center pl-3 text-dark/80 font-semibold gap-2.5 min-w-0">
          {/* <Image
            src="/tayo.png"
            alt="Avatar"
            width={32}
            height={32}
            className="rounded-full"
          /> */}
          <span className="truncate hidden sm:block">{displayName}</span>
          <span className="truncate sm:hidden">
            {displayName.split(" ")[0] || displayName}
          </span>
        </div>

        <div className="bg-dark/3 text-dark/75 rounded-full flex items-center gap-1 md:gap-1.5 p-1 md:p-1.5 shrink-0">
          <button
            type="button"
            onClick={openNotifications}
            className="hover:text-black relative p-1"
            aria-label="Open notifications"
          >
            <BellIcon size={20} className="md:w-6 md:h-6" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-3 min-w-3 md:h-4 md:min-w-4 px-0.5 md:px-1 rounded-full bg-base text-[9px] md:text-[10px] font-semibold text-white flex items-center justify-center">
                {notifications.length > 9 ? "9+" : notifications.length}
              </span>
            )}
          </button>

          <Link
            href="/app/settings"
            aria-label="Settings"
            className="hover:text-black p-1"
          >
            <GearIcon size={20} className="md:w-6 md:h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
