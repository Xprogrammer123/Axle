"use client";

import { Lightning, ChatCircle, Robot, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components-beta/Button";
import Link from "next/link";
import Image from "next/image";
import { Notification } from "./DailyDigestModal";

interface DailyDigestCardProps {
    notifications: Notification[];
}

export function DailyDigestCard({ notifications }: DailyDigestCardProps) {
    const getSourceIcon = (source: string) => {
        switch (source) {
            case "twitter":
                return <Image src="/twitter.svg" alt="Twitter" width={18} height={18} />;
            case "github":
                return <Image src="/beta/github.svg" alt="GitHub" width={18} height={18} />;
            case "google":
                return <Image src="/google.svg" alt="Google" width={18} height={18} />;
            case "figma":
                return <Image src="/figma.svg" alt="Figma" width={18} height={18} />;
            case "notion":
                return <Image src="/notion.svg" alt="Notion" width={18} height={18} />;
            case "slack":
                return <Image src="/slack.svg" alt="Slack" width={18} height={18} />;
            case "linear":
                return <Lightning size={18} className="text-orange-500" />;
            case "discord":
                return <ChatCircle size={18} className="text-indigo-500" />;
            case "jira":
                return <Lightning size={18} className="text-blue-500" />;
            default:
                return <Lightning size={18} className="text-gray-500" />;
        }
    };

    return (
        <div id="dashboard-daily-digest-card" className="bg-dark/3 dark:bg-white/1.5 flex flex-col overflow-hidden h-72 border-0 border-dark/3 dark:border-white/10 rounded-4xl p-3 shadow-lg shadow-dark/4 dark:shadow-black/10">
            <div className="flex w-full justify-between items-center px-2 pt-2">
                <h2 className="text-base md:text-lg font-semibold text-dark dark:text-dark-light px-1 truncate bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
                    Daily Digest
                </h2>
                <Link href="/app/notifications">
                    <Button className="py-2.5 px-5 md:py-2.5 text-xs bg-dark/5 dark:bg-white/5 hover:bg-dark/10 dark:hover:bg-white/10 text-dark dark:text-white border-0">
                        View All
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col mt-4 gap-2 w-full overflow-auto px-1 pb-2 custom-scrollbar">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                        <p className="text-dark/50 dark:text-dark-light/50 text-sm">
                            No new notifications.
                        </p>
                        <p className="text-xs text-dark/30 dark:text-dark-light/30 mt-1">
                            You are all caught up.
                        </p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="group bg-dark/3 dark:bg-white/2 border border-white/3 hover:border-accent/20 dark:hover:border-accent/20 flex flex-col rounded-2xl p-3 text-left transition-all hover:bg-dark/5 dark:hover:bg-white/5 cursor-default gap-2"
                        >
                            <div className="flex items-start justify-between gap-3 min-w-0">
                                <div className="flex items-start gap-3 min-w-0">
                                    <div className="p-2 bg-surface dark:bg-white/5 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                                        {getSourceIcon(notification.source)}
                                    </div>
                                    <div className="flex flex-col min-w-0 gap-0.5">
                                        <h3 className="text-dark/90 dark:text-dark-light/90 font-medium truncate text-sm">
                                            {notification.title}
                                        </h3>
                                        <p className="text-xs text-dark/50 dark:text-dark-light/50 truncate max-w-[200px]">
                                            {notification.description}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-[10px] items-center text-dark/30 dark:text-dark-light/30 whitespace-nowrap hidden sm:flex pt-1">
                                    {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            {/* Action Buttons for Card */}
                            {notification.suggestedActions && notification.suggestedActions.length > 0 && (
                                <div className="flex gap-2 pl-[44px]">
                                    {notification.suggestedActions.slice(0, 2).map((action, idx) => (
                                        <Button
                                            key={idx}
                                            className="py-1 px-3 text-[10px] bg-dark/5 dark:bg-white/10 hover:bg-dark/10 dark:hover:bg-white/20 text-dark dark:text-white border-0 h-auto"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                console.log(`Action: ${action} for ${notification.id}`);
                                            }}
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
    );
}
