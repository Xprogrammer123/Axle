"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lightning, ChatCircle, MagnifyingGlass, Bell } from "@phosphor-icons/react";
import Logo from "@/components-beta/Logo";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Notification {
    id: string;
    source: string;
    title: string;
    description: string;
    timestamp: string;
    suggestedActions?: string[];
    metadata?: any;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SOURCE_LABELS: Record<string, string> = {
    twitter: "X (Twitter)",
    github: "GitHub",
    google: "Google",
    figma: "Figma",
    notion: "Notion",
    slack: "Slack",
    linear: "Linear",
    discord: "Discord",
    jira: "Jira",
    system: "System",
};

function getSourceIcon(source: string, size = 18) {
    switch (source) {
        case "twitter": return <Image src="/twitter.svg" alt="X" width={size} height={size} />;
        case "github": return <Image src="/beta/github.svg" alt="GitHub" width={size} height={size} />;
        case "google": return <Image src="/google.svg" alt="Google" width={size} height={size} />;
        case "figma": return <Image src="/figma2.svg" alt="Figma" width={size} height={size} />;
        case "notion": return <Image src="/notion2.svg" alt="Notion" width={size} height={size} />;
        case "slack": return <Image src="/slack.svg" alt="Slack" width={size} height={size} />;
        case "linear": return <Lightning size={size} className="text-orange-500" />;
        case "discord": return <ChatCircle size={size} className="text-indigo-500" />;
        case "jira": return <Lightning size={size} className="text-blue-500" />;
        default: return <Bell size={size} className="text-gray-400" />;
    }
}

const asRecord = (v: unknown): Record<string, unknown> =>
    v && typeof v === "object" ? (v as Record<string, unknown>) : {};

function normalizeNotifications(raw: unknown[]): Notification[] {
    return (raw || []).map((n, idx) => {
        const r = asRecord(n);
        const rawSource = String(r.source ?? r.sourceApp ?? "").toLowerCase();
        let source = "system";
        if (rawSource.includes("twitter") || rawSource.includes("x")) source = "twitter";
        else if (rawSource.includes("github")) source = "github";
        else if (rawSource.includes("google") || rawSource.includes("gmail") || rawSource.includes("calendar")) source = "google";
        else if (rawSource.includes("figma")) source = "figma";
        else if (rawSource.includes("notion")) source = "notion";
        else if (rawSource.includes("slack")) source = "slack";
        else if (rawSource.includes("linear")) source = "linear";
        else if (rawSource.includes("discord")) source = "discord";
        else if (rawSource.includes("jira")) source = "jira";
        else source = rawSource || "system";

        const apiActions = (r.actionButtons as any[]) || [];
        let suggestedActions = apiActions.map((a: any) => a.label || a.text || "View");
        if (suggestedActions.length === 0) {
            if (source === "twitter") suggestedActions = ["Reply", "View Post"];
            else if (source === "github") suggestedActions = ["Review", "Open Repo"];
            else if (source === "google") suggestedActions = ["View Details", "Open App"];
            else if (source === "figma") suggestedActions = ["View File", "Reply"];
            else if (source === "notion") suggestedActions = ["View Page", "Comment"];
            else if (source === "slack") suggestedActions = ["Reply", "Open Channel"];
            else if (source === "linear") suggestedActions = ["View Issue", "Change Status"];
            else if (source === "discord") suggestedActions = ["Reply", "View Channel"];
            else if (source === "jira") suggestedActions = ["View Ticket", "Comment"];
            else suggestedActions = ["View", "Dismiss"];
        }

        return {
            id: String(r.id ?? r._id ?? idx),
            title: String(r.title ?? "Notification"),
            description: String(r.snippet ?? r.description ?? r.message ?? ""),
            timestamp: String(r.timestamp ?? r.createdAt ?? new Date().toISOString()),
            source,
            suggestedActions: suggestedActions.slice(0, 2),
            metadata: r,
        };
    });
}

const ALL_SOURCES = ["all", "github", "google", "twitter", "slack", "notion", "figma", "linear", "discord", "jira", "system"];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterSource, setFilterSource] = useState("all");

    useEffect(() => {
        (api.syncNotifications() as Promise<any>)
            .catch(() => ({ notifications: [] }))
            .then((res) => {
                const normalized = normalizeNotifications(res?.notifications || []);
                normalized.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                // Cache every notification so the detail page can find them reliably
                normalized.forEach((n) => {
                    sessionStorage.setItem(`axle_notif_${n.id}`, JSON.stringify(n));
                });
                setNotifications(normalized);
            })
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        return notifications.filter((n) => {
            const matchesSource = filterSource === "all" || n.source === filterSource;
            const q = search.toLowerCase();
            const matchesSearch = !q || n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q);
            return matchesSource && matchesSearch;
        });
    }, [notifications, search, filterSource]);

    const presentSources = useMemo(() => {
        const set = new Set(notifications.map((n) => n.source));
        return ALL_SOURCES.filter((s) => s === "all" || set.has(s));
    }, [notifications]);

    const handleNotificationClick = (n: Notification) => {
        sessionStorage.setItem(`axle_notif_${n.id}`, JSON.stringify(n));
        router.push(`/app/notifications/${n.id}`);
    };

    if (loading) {
        return (
            <div className="p-7 pt-20 flex flex-col justify-center items-center h-[70%] w-full">
                <div className="page-loader animate-pulse" style={{ minHeight: 140 }}>
                    <div className="bg-surface dark:bg-black/20 shadow-lg/3 shadow-dark rounded-full p-3">
                        <Logo size={36} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-5 md:p-7 pt-20 md:pt-24 h-full overflow-y-auto w-full">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-1">
                <h1 className="text-2xl md:text-3xl font-bold text-dark dark:text-white">Notifications</h1>
                <p className="text-sm text-dark/50 dark:text-white/50">
                    {notifications.length} total · sorted by most recent
                </p>
            </div>

            {/* Search + Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1 flex items-center gap-2 bg-dark/5 dark:bg-white/5 border border-dark/5 dark:border-white/5 rounded-2xl px-4 py-2.5">
                    <MagnifyingGlass size={16} className="text-dark/40 dark:text-white/40 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search notifications…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent outline-none text-sm flex-1 text-dark dark:text-white placeholder:text-dark/30 dark:placeholder:text-white/30"
                    />
                </div>

                {/* Source filter chips */}
                <div className="flex gap-1.5 overflow-x-auto pb-0.5 shrink-0">
                    {presentSources.map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterSource(s)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filterSource === s
                                    ? "bg-accent text-white"
                                    : "bg-dark/5 dark:bg-white/5 text-dark/60 dark:text-white/60 hover:bg-dark/10 dark:hover:bg-white/10"
                                }`}
                        >
                            {s === "all" ? "All" : SOURCE_LABELS[s] ?? s}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                    <div className="w-14 h-14 rounded-full bg-dark/5 dark:bg-white/5 flex items-center justify-center">
                        <Bell size={24} className="text-dark/30 dark:text-white/30" />
                    </div>
                    <p className="text-dark/50 dark:text-white/50 text-sm">
                        {search || filterSource !== "all" ? "No notifications match your filters." : "No notifications yet."}
                    </p>
                </div>
            ) : (
                <AnimatePresence initial={false}>
                    <div className="flex flex-col gap-2">
                        {filtered.map((n, i) => (
                            <motion.button
                                key={n.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: i * 0.03 }}
                                onClick={() => handleNotificationClick(n)}
                                className="group text-left flex items-start gap-4 bg-dark/3 dark:bg-white/2 hover:bg-dark/5 dark:hover:bg-white/4 border border-dark/5 dark:border-white/5 hover:border-accent/20 dark:hover:border-accent/20 rounded-2xl p-4 transition-all w-full"
                            >
                                <div className="p-2.5 rounded-xl bg-surface dark:bg-white/5 shrink-0 group-hover:scale-105 transition-transform">
                                    {getSourceIcon(n.source)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-sm text-dark/90 dark:text-white/90 truncate">{n.title}</h3>
                                        <span className="text-[10px] text-dark/30 dark:text-white/30 whitespace-nowrap pt-0.5 shrink-0">
                                            {new Date(n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            <span className="hidden sm:inline"> · {new Date(n.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                                        </span>
                                    </div>
                                    <p className="text-xs text-dark/50 dark:text-white/50 truncate mt-0.5">{n.description}</p>
                                    <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-dark/5 dark:bg-white/5 text-dark/40 dark:text-white/40">
                                        {SOURCE_LABELS[n.source] ?? n.source}
                                    </span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </AnimatePresence>
            )}
        </div>
    );
}
