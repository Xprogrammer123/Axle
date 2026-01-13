'use client';

import { useState } from 'react';
import { X, ChevronDown, Bell, Calendar, Mail, FileText, CheckCircle, AlertTriangle, Info, Play, Github, Hash, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from '@/components/ui/button';

interface Notification {
    id: string;
    title: string;
    description: string;
    type: 'info' | 'warning' | 'success' | 'alert';
    timestamp: string;
    action?: string;
    actionUrl?: string;
    sourceApp?: string;
    sourceIcon?: string;
    icon?: string;
}

interface NotificationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    onDismissAll?: () => void;
}

export function NotificationDrawer({ isOpen, onClose, notifications, onDismissAll }: NotificationDrawerProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (!isOpen) return null;

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getSourceIcon = (app?: string) => {
        switch (app?.toLowerCase()) {
            case 'gmail': return <Mail size={14} className="text-red-400" />;
            case 'calendar': return <Calendar size={14} className="text-blue-400" />;
            case 'drive':
            case 'google_docs': return <FileText size={14} className="text-blue-500" />;
            case 'github': return <Github size={14} className="text-white" />;
            case 'slack': return <Hash size={14} className="text-purple-400" />;
            case 'axle': return <Bell size={14} className="text-orange-400" />;
            default: return <MessageSquare size={14} className="text-white/50" />;
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
        <div className="fixed inset-0 z-50 flex justify-end items-start md:items-center p-4 bg-black/20">
            <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full max-w-[420px] h-[85vh] md:h-[95vh] bg-[#0A0A0A] border border-white/10 rounded-[32px] shadow-2xl flex flex-col overflow-hidden relative"
            >
                {/* Header */}
                <div className="px-6 py-5 flex justify-between items-center border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                            <Bell size={16} className="text-white/80" />
                        </div>
                        <h2 className="text-lg font-bold text-white tracking-wide">Inbox</h2>
                        {notifications.length > 0 && (
                            <span className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/20">
                                {notifications.length}
                            </span>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-white/20 gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                                <CheckCircle size={32} />
                            </div>
                            <p className="text-sm font-medium">All caught up!</p>
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <motion.div
                                layout
                                key={notif.id}
                                onClick={() => toggleExpand(notif.id)}
                                className={`group rounded-[20px] p-4 cursor-pointer border transition-all duration-300 relative overflow-hidden
                            ${expandedId === notif.id
                                        ? 'bg-white/[0.08] border-white/10 shadow-lg'
                                        : 'bg-[#121212] border-white/5 hover:bg-white/[0.06] hover:border-white/10'
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
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#121212] flex items-center justify-center ring-2 ring-[#0A0A0A]">
                                            <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center">
                                                {getSourceIcon(notif.sourceApp)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content - Middle */}
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className={`font-semibold text-[15px] leading-tight transition-colors ${expandedId === notif.id ? 'text-white' : 'text-white/90'}`}>
                                                {notif.title}
                                            </h3>
                                            <span className="shrink-0 text-[10px] font-medium text-white/30 pt-0.5">
                                                {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        {!expandedId && (
                                            <p className="text-xs text-white/50 line-clamp-1 mt-1 font-medium">{notif.description}</p>
                                        )}
                                    </div>

                                    {/* Chevron - Right */}
                                    <div className={`mt-1 text-white/20 transition-transform duration-300 ${expandedId === notif.id ? 'rotate-180 text-white/50' : ''}`}>
                                        <ChevronDown size={16} />
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
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-white/30">Details</span>
                                                    <div className="h-px bg-white/10 flex-1" />
                                                </div>

                                                <p className="text-sm text-white/80 leading-relaxed mb-4 font-light">
                                                    {notif.description}
                                                </p>

                                                {/* Action Card Mockup */}
                                                <div className="bg-black/40 rounded-xl p-3 border border-white/10">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        {getSourceIcon(notif.sourceApp)}
                                                        <span className="text-xs font-semibold text-white/50 capitalize tracking-wide">{notif.sourceApp || 'System'}</span>
                                                    </div>

                                                    <h4 className="font-semibold text-white text-sm mb-1 truncate">{notif.title}</h4>

                                                    {/* Context metadata based on source */}
                                                    {notif.sourceApp === 'calendar' && (
                                                        <div className="text-xs text-white/40 mb-3 flex items-center gap-1.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                            Happening soon
                                                        </div>
                                                    )}

                                                    {notif.actionUrl ? (
                                                        <Button
                                                            className="w-full rounded-lg h-9 text-sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                window.open(notif.actionUrl, '_blank', 'noopener,noreferrer');
                                                            }}
                                                        >
                                                            {notif.action || "View"}
                                                        </Button>
                                                    ) : (
                                                        <Button disabled className="w-full rounded-lg h-9 text-sm">No Action Available</Button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Bottom Actions Bar */}
                <div className="p-4 border-t border-white/5 bg-[#0A0A0A]/90 backdrop-blur-xl">
                    {/* <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Assistant Ready</span>
                        </div> */}
                    <div className="flex w-full">
                        <Button
                            className="w-full rounded-full text-sm font-semibold px-3"
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
