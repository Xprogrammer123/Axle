"use client";

import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";
import { Lightning, ChatCircle, Robot } from "@phosphor-icons/react";
import { Button } from "@/components-beta/Button";
import Image from "next/image";

export interface Notification {
    id: string;
    source: "twitter" | "github" | "google" | "system";
    title: string;
    description: string;
    timestamp: string;
    suggestedActions?: string[];
    metadata?: any;
}

interface DailyDigestModalProps {
    open: boolean;
    onClose: () => void;
    notifications: Notification[];
}

export function DailyDigestModal({ open, onClose, notifications }: DailyDigestModalProps) {

    const getSourceIcon = (source: string) => {
        switch (source) {
            case "twitter":
                return <Image src="/twitter.svg" alt="Twitter" width={20} height={20} />;
            case "github":
                return <Image src="/beta/github.svg" alt="GitHub" width={20} height={20} />;
            case "google":
                return <Image src="/google.svg" alt="Google" width={20} height={20} />;
            case "figma":
                return <Image src="/figma.svg" alt="Figma" width={20} height={20} />;
            case "notion":
                return <Image src="/notion.svg" alt="Notion" width={20} height={20} />;
            case "slack":
                return <Image src="/slack.svg" alt="Slack" width={20} height={20} />;
            // For others like Linear, Discord etc we might not have icons yet, so we can use generic or specific if available
            // Assuming we might have them or fall back
            case "linear":
                return <Lightning size={20} className="text-orange-500" />; // Fallback or use specific if added
            case "discord":
                return <ChatCircle size={20} className="text-indigo-500" />;
            case "jira":
                return <Lightning size={20} className="text-blue-500" />;
            default:
                return <Lightning size={20} className="text-gray-500" />;
        }
    };

    return (
        <Modal open={open} onClose={onClose} size="lg" className="bg-surface/90 dark:bg-[#1a1a1a]/95 backdrop-blur-md border border-border dark:border-white/10 shadow-2xl rounded-3xl">
            <Modal.Header onClose={onClose}>
                <div className="flex items-center justify-between w-full pr-8">
                    <span className="text-xl font-bold text-white">Daily Digest</span>
                </div>
            </Modal.Header>
            <Modal.Body className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="flex flex-col gap-4">
                    <p className="text-dark/70 dark:text-white/70 text-sm">
                        Here are your latest notifications from connected apps.
                    </p>

                    <div className="space-y-3 mt-2">
                        {notifications.length === 0 ? (
                            <div className="text-center py-8 text-dark/40 dark:text-white/40 italic">
                                No new notifications. All caught up!
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div key={notification.id} className="flex flex-col gap-3 p-4 rounded-2xl bg-dark/3 dark:bg-white/5 border border-dark/5 dark:border-white/5 transition-all hover:bg-dark/5 dark:hover:bg-white/10">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 rounded-full bg-white dark:bg-black shadow-sm shrink-0">
                                            {getSourceIcon(notification.source)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-dark dark:text-white truncate">{notification.title}</h4>
                                            <p className="text-sm text-dark/60 dark:text-white/60 line-clamp-2">{notification.description}</p>
                                            <span className="text-xs text-dark/30 dark:text-white/30 mt-1 block">
                                                {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {notification.suggestedActions && notification.suggestedActions.length > 0 && (
                                        <div className="flex gap-2 ml-[52px]">
                                            {notification.suggestedActions.slice(0, 2).map((action, idx) => (
                                                <Button
                                                    key={idx}
                                                    className="py-1.5 px-4 text-xs bg-dark/5 dark:bg-white/10 hover:bg-dark/10 dark:hover:bg-white/20 text-dark dark:text-white border-0 h-auto"
                                                    onClick={() => console.log(`Action: ${action} for ${notification.id}`)}
                                                >
                                                    {action}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onClose} className="w-full py-3 bg-dark dark:bg-white text-white dark:text-black hover:opacity-90">
                    Got it, thanks!
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
