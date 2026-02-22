'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Clock,
    Lightning,
    CaretDown,
    CaretUp,
    CheckCircle,
    XCircle,
    Spinner,
    X,
    ArrowRight,
    Link as LinkIcon,
} from '@phosphor-icons/react';
import { api } from '@/lib/api';

/* ─── Types ─── */

interface Trigger {
    _id: string;
    type: string; // 'schedule' | 'webhook'
    cronExpression?: string;
    config?: { source?: string };
    enabled: boolean;
}

interface AutomatedExecution {
    _id: string;
    status: 'running' | 'success' | 'failed' | 'queued';
    triggerType?: string;
    triggerSource?: string;
    aiResponse?: string;
    outputPayload?: { result?: string };
    error?: string;
    createdAt: string;
    completedAt?: string;
}

/* ─── Helpers ─── */

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function getResultPreview(exec: AutomatedExecution): string {
    if (exec.status === 'failed') return exec.error || 'Execution failed';
    if (exec.status === 'running' || exec.status === 'queued') return 'Running...';
    const text = exec.aiResponse || exec.outputPayload?.result || '';
    if (!text) return 'Completed';
    const clean = text.replace(/[#*_`~>\[\]]/g, '').replace(/\n+/g, ' ').trim();
    return clean.length > 80 ? clean.slice(0, 77) + '...' : clean;
}

function getFullResult(exec: AutomatedExecution): string {
    if (exec.status === 'failed') return exec.error || 'Execution failed';
    return exec.aiResponse || exec.outputPayload?.result || 'No output';
}

function describeCron(cron: string): string {
    const parts = cron.split(' ');
    if (parts.length < 5) return cron;
    const [, hour, , , dayOfWeek] = parts;
    if (hour === '*') return 'Every hour';
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    if (dayOfWeek !== '*') {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return `${days[parseInt(dayOfWeek)] || dayOfWeek} at ${h12} ${ampm}`;
    }
    return `Daily at ${h12} ${ampm}`;
}

/* ─── Component ─── */

interface AutomatedRunsBannerProps {
    agentId: string;
}

export function AutomatedRunsBanner({ agentId }: AutomatedRunsBannerProps) {
    const [triggers, setTriggers] = useState<Trigger[]>([]);
    const [executions, setExecutions] = useState<AutomatedExecution[]>([]);
    const [loading, setLoading] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            // Fetch triggers for this agent
            const triggerData = await api.getTriggers(agentId);
            const agentTriggers = (triggerData.triggers || []) as Trigger[];
            const automatedTriggers = agentTriggers.filter(
                (t) => t.type === 'schedule' || t.type === 'webhook'
            );
            setTriggers(automatedTriggers);

            // Only fetch executions if there are automated triggers
            if (automatedTriggers.length > 0) {
                try {
                    const execData = await api.getExecutions({ agentId, limit: 10 });
                    const allExecs = (execData.executions || []) as AutomatedExecution[];
                    // Only show executions that were triggered by schedule or webhook
                    // Exclude manual runs (triggerType missing, undefined, or 'manual')
                    const automatedExecs = allExecs.filter((e) => {
                        const t = e.triggerType?.toLowerCase();
                        return t === 'schedule' || t === 'webhook' || t === 'cron';
                    });
                    setExecutions(automatedExecs);
                } catch {
                    setExecutions([]);
                }
            }
        } catch (e) {
            console.error('Failed to fetch trigger data:', e);
            setTriggers([]);
        } finally {
            setLoading(false);
        }
    }, [agentId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Don't render if loading or no automated triggers configured
    if (loading || triggers.length === 0) return null;

    const scheduleTriggers = triggers.filter((t) => t.type === 'schedule');
    const webhookTriggers = triggers.filter((t) => t.type === 'webhook');
    const expandedExec = expandedId
        ? executions.find((e) => e._id === expandedId)
        : null;

    return (
        <div className="border-b border-gray-200 dark:border-white/5">
            {/* ─── Expanded execution view ─── */}
            {expandedExec ? (
                <div className="bg-gray-50 dark:bg-white/[0.02] px-6 py-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Clock weight="bold" size={14} className="text-orange-400" />
                            <span className="text-xs font-semibold text-dark/60 dark:text-white/60 uppercase tracking-wider">
                                Automated Run · {timeAgo(expandedExec.createdAt)}
                            </span>
                            {expandedExec.status === 'success' && (
                                <CheckCircle weight="fill" size={14} className="text-emerald-500" />
                            )}
                            {expandedExec.status === 'failed' && (
                                <XCircle weight="fill" size={14} className="text-red-500" />
                            )}
                        </div>
                        <button
                            onClick={() => setExpandedId(null)}
                            className="p-1.5 rounded-lg hover:bg-dark/5 dark:hover:bg-white/5 transition-colors"
                        >
                            <X size={14} className="text-dark/40 dark:text-white/40" />
                        </button>
                    </div>
                    <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-2xl p-4 max-h-64 overflow-y-auto">
                        <div className="text-sm text-dark dark:text-white/90 whitespace-pre-wrap leading-relaxed">
                            {getFullResult(expandedExec)}
                        </div>
                    </div>
                </div>
            ) : (
                /* ─── Collapsed banner with trigger info + executions ─── */
                <div className="bg-gray-50 dark:bg-white/[0.02] px-6 py-3">
                    {/* Title row */}
                    <div className="flex items-center justify-between mb-2">
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="flex items-center gap-2 group"
                        >
                            <Lightning weight="fill" size={14} className="text-amber-500" />
                            <span className="text-xs font-semibold text-dark/70 dark:text-white/60 uppercase tracking-wider group-hover:text-dark dark:group-hover:text-white transition-colors">
                                Automated Runs
                            </span>
                            {collapsed ? (
                                <CaretDown size={12} className="text-dark/30 dark:text-white/30" />
                            ) : (
                                <CaretUp size={12} className="text-dark/30 dark:text-white/30" />
                            )}
                        </button>
                    </div>

                    {!collapsed && (
                        <div className="space-y-3">
                            {/* ── Active triggers summary ── */}
                            <div className="flex flex-wrap gap-2">
                                {scheduleTriggers.map((t) => (
                                    <div
                                        key={t._id}
                                        className="flex items-center gap-1.5 bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/10 dark:border-orange-500/20 rounded-lg px-2.5 py-1.5"
                                    >
                                        <Clock weight="bold" size={12} className="text-orange-400" />
                                        <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-300">
                                            {t.cronExpression ? describeCron(t.cronExpression) : 'Schedule'}
                                        </span>
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full ${t.enabled ? 'bg-emerald-500' : 'bg-gray-400'
                                                }`}
                                        />
                                    </div>
                                ))}
                                {webhookTriggers.map((t) => (
                                    <div
                                        key={t._id}
                                        className="flex items-center gap-1.5 bg-violet-500/5 dark:bg-violet-500/10 border border-violet-500/10 dark:border-violet-500/20 rounded-lg px-2.5 py-1.5"
                                    >
                                        <LinkIcon weight="bold" size={12} className="text-violet-400" />
                                        <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-300">
                                            {t.config?.source || 'Webhook'}
                                        </span>
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full ${t.enabled ? 'bg-emerald-500' : 'bg-gray-400'
                                                }`}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* ── Past executions row ── */}
                            {executions.length > 0 ? (
                                <div>
                                    <p className="text-[10px] font-semibold text-dark/30 dark:text-white/25 uppercase tracking-wider mb-1.5">
                                        Recent runs
                                    </p>
                                    <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
                                        {executions.map((exec) => (
                                            <button
                                                key={exec._id}
                                                onClick={() => setExpandedId(exec._id)}
                                                className="flex-shrink-0 group bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-xl p-3 w-48 text-left hover:border-accent/30 dark:hover:border-accent/20 hover:bg-accent/[0.02] transition-all duration-200"
                                            >
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-[10px] font-bold text-dark/40 dark:text-white/30">
                                                        {timeAgo(exec.createdAt)}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        {exec.status === 'success' && (
                                                            <CheckCircle weight="fill" size={12} className="text-emerald-500" />
                                                        )}
                                                        {exec.status === 'failed' && (
                                                            <XCircle weight="fill" size={12} className="text-red-500" />
                                                        )}
                                                        {(exec.status === 'running' || exec.status === 'queued') && (
                                                            <Spinner weight="bold" size={12} className="text-amber-500 animate-spin" />
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-dark/70 dark:text-white/60 line-clamp-2 leading-relaxed mb-1.5">
                                                    {getResultPreview(exec)}
                                                </p>
                                                <div className="flex justify-end">
                                                    <ArrowRight
                                                        size={10}
                                                        className="text-dark/20 dark:text-white/15 group-hover:text-accent transition-colors"
                                                    />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-dark/30 dark:text-white/25 italic">
                                    No runs yet — this agent will execute automatically based on the triggers above.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
