'use client';

import { useState } from 'react';
import { X, ChevronDown, Bell, Calendar, Mail, FileText, CheckCircle, AlertTriangle, Info, Play, Github, Hash, MessageSquare, Clock, Tag, Archive, Eye, EyeOff, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from '@/components-beta/Button';

type NotificationCategory = "messages" | "mentions" | "updates" | "reminders" | "alerts" | "system";
type NotificationPriority = "low" | "normal" | "high" | "urgent";

interface Notification {
    id: string;
    title: string;
    description: string;
    type: 'info' | 'warning' | 'success' | 'alert';
    category: NotificationCategory;
    priority: NotificationPriority;
    timestamp: string;
    action?: string;
    actionUrl?: string;
    sourceApp?: string;
    sourceIcon?: string;
    icon?: string;
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
}

interface NotificationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    onDismissAll?: () => void;
    onMarkAsRead?: (notificationId: string) => void;
    onArchive?: (notificationId: string) => void;
    onSnooze?: (notificationId: string) => void;
}

// Notification grouping utilities
type GroupBy = 'none' | 'category' | 'source' | 'time';

interface NotificationGroup {
    id: string;
    title: string;
    notifications: Notification[];
    icon?: React.ReactNode;
    color?: string;
}

function groupNotifications(notifications: Notification[], groupBy: GroupBy): NotificationGroup[] {
    if (groupBy === 'none') {
        return [{
            id: 'all',
            title: 'All Notifications',
            notifications,
        }];
    }

    const groups: Record<string, Notification[]> = {};

    notifications.forEach(notification => {
        let groupKey: string;
        let groupTitle: string;

        switch (groupBy) {
            case 'category':
                groupKey = notification.category;
                groupTitle = notification.category.charAt(0).toUpperCase() + notification.category.slice(1);
                break;
            case 'source':
                groupKey = notification.sourceApp || 'system';
                groupTitle = notification.sourceApp?.charAt(0).toUpperCase() + notification.sourceApp?.slice(1) || 'System';
                break;
            case 'time':
                const now = new Date();
                const notifTime = new Date(notification.timestamp);
                const diffHours = (now.getTime() - notifTime.getTime()) / (1000 * 60 * 60);

                if (diffHours < 1) {
                    groupKey = 'recent';
                    groupTitle = 'Recent';
                } else if (diffHours < 24) {
                    groupKey = 'today';
                    groupTitle = 'Today';
                } else if (diffHours < 168) { // 7 days
                    groupKey = 'week';
                    groupTitle = 'This Week';
                } else {
                    groupKey = 'older';
                    groupTitle = 'Older';
                }
                break;
            default:
                groupKey = 'all';
                groupTitle = 'All';
        }

        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(notification);
    });

    return Object.entries(groups).map(([key, notifs]) => ({
        id: key,
        title: key === 'all' ? 'All Notifications' : Object.keys(groups).find(k => k === key) ? groups[key][0]?.category?.charAt(0).toUpperCase() + groups[key][0]?.category?.slice(1) || key : key,
        notifications: notifs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    }));
}

export function NotificationDrawer({
    isOpen,
    onClose,
    notifications,
    onDismissAll,
    onMarkAsRead,
    onArchive,
    onSnooze
}: NotificationDrawerProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [groupBy, setGroupBy] = useState<GroupBy>('category');
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    if (!isOpen) return null;

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleQuickAction = (action: string, notificationId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        switch (action) {
            case 'mark_read':
                onMarkAsRead?.(notificationId);
                break;
            case 'archive':
                onArchive?.(notificationId);
                break;
            case 'snooze':
                onSnooze?.(notificationId);
                break;
        }
    };

    const getSourceIcon = (app?: string) => {
        switch (app?.toLowerCase()) {
            case 'gmail': return <Mail size={14} className="text-red-400" />;
            case 'calendar': return <Calendar size={14} className="text-blue-400" />;
            case 'drive':
            case 'google_docs': return <FileText size={14} className="text-blue-500" />;
            case 'github': return <Github size={14} className="text-dark" />;
            case 'slack': return <Hash size={14} className="text-purple-400" />;
            case 'axle': return <Bell size={14} className="text-orange-400" />;
            default: return <MessageSquare size={14} className="text-dark/50" />;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'warning': return <AlertTriangle size={20} className="text-yellow-400" />;
            case 'success': return <CheckCircle size={20} className="text-emerald-400" />;
            case 'alert': return <AlertTriangle size={20} className="text-red-400" />;
            default: return <Info size={20} className="text-blue-400" />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end items-start md:items-center p-2 md:p-4 bg-white/0">
            <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full max-w-[420px] h-[90vh] md:h-[95vh] bg-white/25 border border-dark/10 backdrop-blur-xl rounded-[24px] md:rounded-[32px] shadow-2xl flex flex-col overflow-hidden relative"
            >
                {/* Header */}
                <div className="px-4 md:px-6 py-4 md:py-5 flex justify-between items-center border-b border-dark/5 bg-white/25 backdrop-blur-xl z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-dark/5">
                            <Bell size={16} className="text-dark/80" />
                        </div>
                        <h2 className="text-lg font-bold text-dark tracking-wide">Inbox</h2>
                        {notifications.length > 0 && (
                            <span className="bg-accent/20 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/20">
                                {notifications.length}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Group By Selector */}
                        <select
                            value={groupBy}
                            onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                            className="text-xs bg-white/10 border border-dark/10 rounded-lg px-2 py-1 text-dark/70 focus:outline-none focus:ring-1 focus:ring-accent/50"
                        >
                            <option value="category">By Category</option>
                            <option value="source">By Source</option>
                            <option value="time">By Time</option>
                            <option value="none">All</option>
                        </select>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-dark/40 hover:bg-white/10 hover:text-dark transition-colors"
                    >
                        <X size={18} />
                    </button>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 md:p-3 space-y-4">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-dark/20 gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                                <CheckCircle size={32} />
                            </div>
                            <p className="text-sm font-medium">All caught up!</p>
                        </div>
                    ) : (
                        (() => {
                            const groups = groupNotifications(notifications, groupBy);
                            return groups.map((group) => (
                                <div key={group.id} className="space-y-2">
                                    {/* Group Header */}
                                    {groupBy !== 'none' && (
                                        <div className="flex items-center gap-2 px-2 py-1">
                                            <div className="h-px bg-dark/10 flex-1" />
                                            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full">
                                                {groupBy === 'category' && (
                                                    <>
                                                        {group.id === 'mentions' && <MessageSquare size={12} className="text-blue-500" />}
                                                        {group.id === 'messages' && <Mail size={12} className="text-green-500" />}
                                                        {group.id === 'updates' && <Info size={12} className="text-purple-500" />}
                                                        {group.id === 'reminders' && <Clock size={12} className="text-orange-500" />}
                                                        {group.id === 'alerts' && <AlertTriangle size={12} className="text-red-500" />}
                                                        {group.id === 'system' && <Bell size={12} className="text-gray-500" />}
                                                    </>
                                                )}
                                                {groupBy === 'source' && (
                                                    <>
                                                        {group.id === 'gmail' && <Mail size={12} className="text-red-500" />}
                                                        {group.id === 'github' && <Github size={12} className="text-gray-800" />}
                                                        {group.id === 'calendar' && <Calendar size={12} className="text-blue-500" />}
                                                        {group.id === 'x' && <Hash size={12} className="text-blue-400" />}
                                                    </>
                                                )}
                                                {groupBy === 'time' && <Clock size={12} className="text-gray-500" />}
                                                <span className="text-xs font-semibold text-dark/70 uppercase tracking-wider">
                                                    {group.title}
                                                </span>
                                                <span className="text-xs text-dark/40 bg-white/10 px-2 py-0.5 rounded-full">
                                                    {group.notifications.length}
                                                </span>
                                            </div>
                                            <div className="h-px bg-dark/10 flex-1" />
                                        </div>
                                    )}

                                    {/* Group Notifications */}
                                    {group.notifications.map((notif) => (
                            <motion.div
                                layout
                                key={notif.id}
                                onClick={() => toggleExpand(notif.id)}
                                onMouseEnter={() => setHoveredId(notif.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className={`group rounded-[20px] p-4 cursor-pointer border transition-all duration-300 relative overflow-hidden
                            ${expandedId === notif.id
                                        ? 'bg-white/[0.08] border-dark/10 shadow-lg'
                                        : 'bg-white/75 border-dark/5 hover:bg-white/[0.06] hover:border-dark/10'
                                    }
                        `}
                            >
                                {/* Summary View */}
                                <div className="flex items-start gap-4">
                                    {/* Avatar/Icon - Left Side */}
                                    <div className="relative shrink-0 mt-0.5">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${expandedId === notif.id ? 'bg-white/10' : 'bg-white/5'}`}>
                                            {getTypeIcon(notif.type)}
                                        </div>
                                        {/* Badge */}
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white/75 flex items-center justify-center ring-2 ring-white/25">
                                            <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center">
                                                {getSourceIcon(notif.sourceApp)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content - Middle */}
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className={`font-semibold text-[15px] leading-tight transition-colors truncate ${expandedId === notif.id ? 'text-dark' : 'text-dark/90'}`}>
                                                {notif.title}
                                            </h3>
                                                    {/* Priority indicator */}
                                                    {notif.priority === 'urgent' && (
                                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                                                    )}
                                                    {notif.priority === 'high' && (
                                                        <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                                                    )}
                                                </div>
                                                {/* Author and context info */}
                                                <div className="flex items-center gap-2 text-xs text-dark/50 mb-1">
                                                    {notif.richContent?.author?.name && (
                                                        <span className="truncate">{notif.richContent.author.name}</span>
                                                    )}
                                                    {notif.richContent?.repository && (
                                                        <span className="truncate">
                                                            {notif.richContent.repository.owner}/{notif.richContent.repository.name}
                                                        </span>
                                                    )}
                                                    {notif.richContent?.eventDetails && (
                                                        <span className="truncate">
                                                            📅 {new Date(notif.richContent.eventDetails.startTime).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="shrink-0 text-[10px] font-medium text-dark/30 pt-0.5">
                                                {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        {!expandedId && (
                                            <p className="text-xs text-dark/50 line-clamp-1 font-medium">{notif.description}</p>
                                        )}
                                    </div>

                                    {/* Quick Actions - Right */}
                                    <div className="flex items-center gap-1 mt-1">
                                        {/* Quick action buttons on hover */}
                                        <AnimatePresence>
                                            {hoveredId === notif.id && !expandedId && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    className="flex items-center gap-1"
                                                >
                                                    <button
                                                        onClick={(e) => handleQuickAction('mark_read', notif.id, e)}
                                                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                                        title="Mark as read"
                                                    >
                                                        <Eye size={12} className="text-dark/60" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleQuickAction('archive', notif.id, e)}
                                                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                                        title="Archive"
                                                    >
                                                        <Archive size={12} className="text-dark/60" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleQuickAction('snooze', notif.id, e)}
                                                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                                        title="Snooze"
                                                    >
                                                        <Clock size={12} className="text-dark/60" />
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Chevron */}
                                        <div className={`text-dark/20 transition-transform duration-300 ${expandedId === notif.id ? 'rotate-180 text-dark/50' : ''}`}>
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                <AnimatePresence>
                                    {expandedId === notif.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-4 pl-[56px] pr-2">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="h-px bg-white/10 w-4" />
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-dark/30">Details</span>
                                                    <div className="h-px bg-white/10 flex-1" />
                                                </div>

                                                <p className="text-sm text-dark/80 leading-relaxed mb-4 font-light">
                                                    {notif.description}
                                                </p>

                                                {/* Rich Content Card */}
                                                <div className="bg-white/40 rounded-xl p-4 border border-dark/10 space-y-3">
                                                    {/* Header with source and priority */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                        {getSourceIcon(notif.sourceApp)}
                                                            <span className="text-xs font-semibold text-dark/50 capitalize tracking-wide">
                                                                {notif.sourceApp || 'System'}
                                                            </span>
                                                        </div>
                                                        <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                            notif.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                                            notif.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                                            notif.priority === 'normal' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {notif.priority}
                                                        </div>
                                                    </div>

                                                    {/* Author information */}
                                                    {notif.richContent?.author && (
                                                        <div className="flex items-center gap-2 p-2 bg-white/20 rounded-lg">
                                                            {notif.richContent.author.avatar && (
                                                                <img
                                                                    src={notif.richContent.author.avatar}
                                                                    alt={notif.richContent.author.name}
                                                                    className="w-6 h-6 rounded-full"
                                                                />
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium text-dark truncate">
                                                                    {notif.richContent.author.name}
                                                                </div>
                                                                {notif.richContent.author.handle && (
                                                                    <div className="text-xs text-dark/50 truncate">
                                                                        {notif.richContent.author.handle}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Repository/Project info */}
                                                    {notif.richContent?.repository && (
                                                        <div className="flex items-center gap-2 p-2 bg-white/20 rounded-lg">
                                                            <Github size={14} className="text-gray-600" />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium text-dark truncate">
                                                                    {notif.richContent.repository.owner}/{notif.richContent.repository.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Event details */}
                                                    {notif.richContent?.eventDetails && (
                                                        <div className="p-2 bg-white/20 rounded-lg space-y-1">
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Clock size={12} className="text-gray-500" />
                                                                <span className="text-dark/70">
                                                                    {new Date(notif.richContent.eventDetails.startTime).toLocaleString()}
                                                                </span>
                                                            </div>
                                                            {notif.richContent.eventDetails.location && (
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                                                                    <span className="text-dark/70">{notif.richContent.eventDetails.location}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Labels/Tags */}
                                                    {notif.richContent?.labels && notif.richContent.labels.length > 0 && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {notif.richContent.labels.slice(0, 3).map((label, idx) => (
                                                                <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                                    {label}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Action buttons */}
                                                    <div className="flex gap-2 pt-2">
                                                        {notif.actionButtons && notif.actionButtons.length > 0 ? (
                                                            notif.actionButtons.slice(0, 2).map((actionBtn, idx) => (
                                                                <Button
                                                                    key={idx}
                                                                    className="flex-1 h-8 text-xs"
                                                                    variant={idx === 0 ? "default" : "outline"}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (actionBtn.action === 'OPEN_URL' && actionBtn.url) {
                                                                            window.open(actionBtn.url, '_blank', 'noopener,noreferrer');
                                                                        }
                                                                        // TODO: Handle other actions like REPLY, ARCHIVE, etc.
                                                                    }}
                                                                >
                                                                    {actionBtn.label}
                                                                </Button>
                                                            ))
                                                        ) : notif.actionUrl ? (
                                                        <Button
                                                                className="w-full h-8 text-xs"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                window.open(notif.actionUrl, '_blank', 'noopener,noreferrer');
                                                            }}
                                                        >
                                                            {notif.action || "View"}
                                                        </Button>
                                                    ) : (
                                                            <Button disabled className="w-full h-8 text-xs">No Action Available</Button>
                                                    )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                                        ))}
                                </div>
                            ));
                        })()
                    )}
                </div>

                {/* Bottom Actions Bar */}
                <div className="p-3 md:p-4 border-t border-dark/5 bg-white/25/90 backdrop-blur-xl">
                    {/* <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] text-dark/40 font-semibold uppercase tracking-wider">Assistant Ready</span>
                        </div> */}
                    <div className="flex w-full">
                        <Button
                            className="w-full rounded-full text-sm font-semibold p-3"
                            onClick={() => onDismissAll?.()}
                        >
                            Dismiss All
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
