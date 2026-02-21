"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Image from "next/image";
import { Lightning, ChatCircle, Bell, ArrowLeft, Robot, Clock } from "@phosphor-icons/react";
import { Button } from "@/components-beta/Button";
import Logo from "@/components-beta/Logo";
import { motion } from "framer-motion";

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

function getSourceIcon(source: string, size = 24) {
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
            if (source === "twitter") suggestedActions = ["Reply", "Quote Tweet"];
            else if (source === "github") suggestedActions = ["Review PR", "Comment"];
            else if (source === "google") suggestedActions = ["Reply", "Mark as Read"];
            else if (source === "figma") suggestedActions = ["Reply", "View File"];
            else if (source === "notion") suggestedActions = ["Comment", "Mark Done"];
            else if (source === "slack") suggestedActions = ["Reply", "React"];
            else if (source === "linear") suggestedActions = ["Comment", "Change Status"];
            else if (source === "discord") suggestedActions = ["Reply", "React"];
            else if (source === "jira") suggestedActions = ["Comment", "Update Status"];
            else suggestedActions = ["Reply"];
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

// Keys that are already surfaced elsewhere in the UI — don't show them again in details
const HIDDEN_META_KEYS = new Set([
    "id", "_id", "source", "sourceApp", "title", "snippet",
    "description", "message", "timestamp", "createdAt", "actionButtons",
]);

function formatMetaKey(key: string) {
    return key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").toLowerCase();
}

function formatMetaValue(value: unknown): string {
    if (value === null || value === undefined) return "—";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const notificationId = params?.id as string;

    const [notification, setNotification] = useState<Notification | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        // Try the sessionStorage cache first (written when the user clicks from the list / card)
        const cached = sessionStorage.getItem(`axle_notif_${notificationId}`);
        if (cached) {
            try {
                setNotification(JSON.parse(cached));
                setLoading(false);
                return;
            } catch {
                // corrupted cache — fall through to API
            }
        }

        // Fallback: fetch all and find the matching one
        (api.syncNotifications() as Promise<any>)
            .catch(() => ({ notifications: [] }))
            .then((res) => {
                const all = normalizeNotifications(res?.notifications || []);
                all.forEach((n) => sessionStorage.setItem(`axle_notif_${n.id}`, JSON.stringify(n)));
                const found = all.find((n) => n.id === notificationId);
                if (found) setNotification(found);
                else setNotFound(true);
            })
            .finally(() => setLoading(false));
    }, [notificationId]);

    const handleAction = (action: string) => {
        if (!notification) return;
        const msg = encodeURIComponent(`${action}: "${notification.title}" — ${notification.description}`);
        router.push(`/app/agents?message=${msg}`);
    };

    // ── Loading ──
    if (loading) {
        return (
            <div className="p-7 pt-20 flex flex-col justify-center items-center h-[70%] w-full">
                <div className="page-loader animate-pulse" style={{ minHeight: 140 }}>
                    <div className="bg-surface dark:bg-black/20 shadow-lg/3 shadow-dark/10 dark:shadow-black/50 rounded-full p-3">
                        <Logo size={36} />
                    </div>
                </div>
            </div>
        );
    }

    // ── Not found ──
    if (notFound || !notification) {
        return (
            <div className="p-7 pt-24 flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-dark/5 dark:bg-white/5 flex items-center justify-center">
                    <Bell size={28} className="text-dark/30 dark:text-white/30" />
                </div>
                <h2 className="text-lg font-semibold text-dark dark:text-white">Notification not found</h2>
                <p className="text-sm text-dark/50 dark:text-white/50">This notification may have expired or doesn't exist.</p>
                <Button onClick={() => router.push("/app/notifications")} className="mt-2">
                    Back to Notifications
                </Button>
            </div>
        );
    }

    const date = new Date(notification.timestamp);

    // All extra fields from the raw API response
    const metaEntries = Object.entries(notification.metadata || {}).filter(
        ([k, v]) => !HIDDEN_META_KEYS.has(k) && v !== undefined && v !== null && v !== ""
    );

    // ── Detail ──
    return (
        <div className="p-5 md:p-7 pt-20 md:pt-24 h-full overflow-y-auto w-full max-w-3xl mx-auto">

            {/* Back */}
            <button
                onClick={() => router.push("/app/notifications")}
                className="flex items-center gap-1.5 text-sm text-dark/50 dark:text-white/50 hover:text-dark dark:hover:text-white transition-colors mb-6"
            >
                <ArrowLeft size={16} weight="bold" />
                All notifications
            </button>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
            >
                {/* ── Main card ── */}
                <div className="bg-dark/3 dark:bg-white/2 border border-dark/5 dark:border-white/5 rounded-3xl p-5 md:p-7 flex flex-col gap-5">

                    {/* Source + timestamp row */}
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-surface dark:bg-white/5 shrink-0">
                            {getSourceIcon(notification.source)}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold text-dark/50 dark:text-white/50 uppercase tracking-widest">
                                {SOURCE_LABELS[notification.source] ?? notification.source}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-dark/30 dark:text-white/30">
                                <Clock size={11} />
                                <span>
                                    {date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                                    {" at "}
                                    {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-xl md:text-2xl font-bold text-dark dark:text-white leading-snug">
                        {notification.title}
                    </h1>

                    {/* Full message body */}
                    <div className="bg-dark/3 dark:bg-white/3 rounded-2xl p-4">
                        <p className="text-sm md:text-base text-dark/80 dark:text-white/80 leading-relaxed whitespace-pre-wrap">
                            {notification.description || "No message body available for this notification."}
                        </p>
                    </div>

                    {/* All raw metadata fields */}
                    {metaEntries.length > 0 && (
                        <div className="flex flex-col gap-2 border-t border-dark/5 dark:border-white/5 pt-4">
                            <p className="text-xs font-semibold text-dark/40 dark:text-white/40 uppercase tracking-widest mb-1">Details</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                                {metaEntries.map(([key, value]) => (
                                    <div key={key} className="flex flex-col gap-0.5">
                                        <span className="text-[10px] font-medium text-dark/35 dark:text-white/35 uppercase tracking-wide">
                                            {formatMetaKey(key)}
                                        </span>
                                        <span className="text-sm text-dark/75 dark:text-white/75 break-all font-mono leading-relaxed">
                                            {formatMetaValue(value)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action buttons — only actionable ones (Reply, Review, Comment…), no generic View/Open */}
                    {notification.suggestedActions && notification.suggestedActions.length > 0 && (
                        <div className="flex flex-wrap gap-2 border-t border-dark/5 dark:border-white/5 pt-4">
                            {notification.suggestedActions.map((action, idx) => (
                                <Button
                                    key={idx}
                                    variant={idx === 0 ? "primary" : undefined}
                                    className={idx !== 0 ? "py-2.5 px-6 bg-dark/5 dark:bg-white/10 text-dark dark:text-white border-0 hover:bg-dark/10 dark:hover:bg-white/20" : "py-2.5 px-6"}
                                    onClick={() => handleAction(action)}
                                >
                                    <Robot size={14} className="mr-1.5 opacity-70" />
                                    {action} with Agent
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
