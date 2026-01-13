"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRightIcon,
  SparkleIcon
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { api, getToken } from "@/lib/api";
import { safeFormatDistanceToNow } from "@/lib/utils";
import { socketClient } from "@/lib/socket";

export default function DashboardPage() {
  const [live, setLive] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [execTimelines, setExecTimelines] = useState<Record<string, any>>({});
  const [execLogs, setExecLogs] = useState<Record<string, string[]>>({});
  const unsubRef = useRef<Map<string, () => void>>(new Map());
  const router = useRouter();

  useEffect(() => {
    const fetchLive = async () => {
      try {
        setError(null);
        const data = await api.getLiveDashboardData();
        setLive(data);
      } catch (e) {
        console.error(e);
        const msg = e instanceof Error ? e.message : 'Failed to load dashboard';
        setError(msg);
        if (msg.toLowerCase().includes('unauthorized') || msg.includes('401')) {
          router.replace('/auth');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLive();
  }, [router]);

  const activeExecutions = (live?.activeExecutions || []).filter(Boolean);
  const recentExecutions = (live?.recentExecutions || []).filter(Boolean);
  const agents = (live?.agents || []).filter(Boolean);

  const activeAgentIds = useMemo(() => {
    const ids = new Set<string>();
    for (const e of activeExecutions) {
      const agentId = typeof e.agentId === 'string' ? e.agentId : e.agentId?._id;
      if (agentId) ids.add(agentId);
    }
    return Array.from(ids);
  }, [activeExecutions]);

  const triggerLabel = (t: any) => {
    if (!t) return 'Manual run';
    if (t === 'schedule') return 'Scheduled';
    if (t === 'webhook') return 'Webhook';
    return String(t);
  };

  useEffect(() => {
    if (!activeAgentIds.length) return;

    const token = getToken();
    socketClient.connect(token || undefined);

    // Subscribe to each active agent's room to receive execution/action updates.
    for (const agentId of activeAgentIds) {
      if (unsubRef.current.has(agentId)) continue;

      const unsub = socketClient.subscribeToAgent(agentId, {
        onExecutionStarted: (data: any) => {
          setExecTimelines((prev) => {
            const next = { ...prev };
            next[data.executionId] = {
              executionId: data.executionId,
              agentId,
              status: data.status || 'running',
              startedAt: new Date().toISOString(),
              actions: [],
            };
            return next;
          });

          setExecLogs((prev) => {
            const next = { ...prev };
            if (!next[data.executionId]) next[data.executionId] = [];
            return next;
          });
        },
        onActionStarted: (data: any) => {
          setExecTimelines((prev) => {
            // Best effort: update the latest running execution for this agent.
            const entries = Object.values(prev).filter((x: any) => x?.agentId === agentId);
            const running = entries.find((x: any) => x.status === 'running') || entries[0];
            if (!running?.executionId) return prev;

            const next = { ...prev };
            const ex = { ...(next[running.executionId] || running) };
            ex.actions = [
              ...(ex.actions || []),
              {
                type: data.actionType,
                label: data.humanReadableStep || data.actionType,
                status: 'running',
                startedAt: new Date().toISOString(),
              },
            ];
            next[running.executionId] = ex;
            return next;
          });
        },
        onActionCompleted: (data: any) => {
          setExecTimelines((prev) => {
            const entries = Object.values(prev).filter((x: any) => x?.agentId === agentId);
            const running = entries.find((x: any) => x.status === 'running') || entries[0];
            if (!running?.executionId) return prev;

            const next = { ...prev };
            const ex = { ...(next[running.executionId] || running) };
            ex.actions = [
              ...(ex.actions || []),
              {
                type: data.actionType,
                label: data.humanReadableStep || data.actionType,
                status: data.success ? 'success' : 'failed',
                durationMs: data.durationMs,
              },
            ];
            next[running.executionId] = ex;
            return next;
          });
        },
        onExecutionCompleted: (data: any) => {
          setExecTimelines((prev) => {
            const ex = prev[data.executionId];
            if (!ex) return prev;
            return {
              ...prev,
              [data.executionId]: {
                ...ex,
                status: data.status || 'completed',
                finishedAt: new Date().toISOString(),
              },
            };
          });
        },

        onExecutionEvent: (data: any) => {
          const evt = data?.event;
          const executionId = data?.executionId;
          if (!executionId) return;
          if (evt?.type !== 'axle_log' || typeof evt?.line !== 'string') return;

          setExecLogs((prev) => {
            const next = { ...prev };
            const existing = next[executionId] || [];
            const appended = [...existing, evt.line];
            next[executionId] = appended.length > 120 ? appended.slice(-120) : appended;
            return next;
          });
        },
      });

      unsubRef.current.set(agentId, unsub);
    }

    // Unsubscribe from agent rooms that are no longer active.
    for (const [agentId, unsub] of Array.from(unsubRef.current.entries())) {
      if (!activeAgentIds.includes(agentId)) {
        try {
          unsub();
        } catch {
          // ignore
        }
        unsubRef.current.delete(agentId);
      }
    }
  }, [activeAgentIds]);

  useEffect(() => {
    return () => {
      for (const [, unsub] of Array.from(unsubRef.current.entries())) {
        try {
          unsub();
        } catch {
          // ignore
        }
      }
      unsubRef.current.clear();
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
        Welcome back.
      </h1>

      <div className="flex flex-col gap-4 w-full">
        {/* Top row: Recently Run + Live Tracker */}
        <div className="flex flex-col lg:flex-row gap-3 w-full">
          {/* Recently Run */}
          <div className="bg-black/20 h-80 flex flex-col gap-4 border border-black/40 overflow-hidden rounded-3xl p-4 flex-1">
            <div className="bg-white/5 border border-white/10 w-fit text-xs md:text-sm rounded-full px-4 md:px-5 py-2.5 text-white/60">
              Recently Run
            </div>
            <div className="bg-black/20 overflow-y-auto flex flex-col gap-2.5 border border-black/40 rounded-xl p-2.5">
              {loading ? (
                <div className="page-loader" style={{ minHeight: 120 }}>
                  <div className="loader-light" />
                  <div className="page-loader-text">Loading activity…</div>
                </div>
              ) : error ? (
                <div className="p-4 text-white/30 text-sm">
                  {error}
                </div>
              ) : recentExecutions.length === 0 ? (
                <div className="p-4 text-white/20 text-sm">
                  No recent executions yet. Run an agent to see activity here.
                </div>
              ) : recentExecutions.slice(0, 6).map((item: any) => (
                <div
                  key={item._id}
                  className="bg-background rounded-xl flex justify-between items-center p-2.5"
                >
                  <div className="flex gap-3.5 items-start">
                    <div className="p-2.5 h-fit rounded-xl bg-white/5 border border-white/10 w-fit">
                      <SparkleIcon size={22} className="text-base" weight="fill" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h3 className="text-[15px] font-semibold line-clamp-1">
                        {item.agentName || (item.agentId as any)?.name || 'Agent'}
                      </h3>
                      <p className="text-[11px] text-white/50 line-clamp-2">
                        {item.summary || '—'}
                      </p>
                      <p className="text-[11px] text-white/40 line-clamp-1">
                        {triggerLabel(item.triggerType)}
                        {item.createdAt ? ` • ${safeFormatDistanceToNow(item.createdAt, { addSuffix: true })}` : ''}
                      </p>
                    </div>
                  </div>
                  <Link href={`/dashboard/executions/${item._id}`}>
                    <Button
                      variant="primary"
                      size="sm"
                      className="font-medium rounded-full px-5 cursor-pointer py-2"
                    >
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Live Tracker */}
          <div className="bg-black/20 h-80 flex flex-col gap-4 border border-black/40 overflow-hidden rounded-3xl p-6 lg:w-[32%]">
            <h3 className="text-lg font-semibold flex items-center justify-between">
              Deployment Logs
              <span className="text-xs text-white/40">
                {activeExecutions.length} running
              </span>
            </h3>

            <div className="h-full w-full flex flex-col gap-3 overflow-y-auto">
              {loading ? (
                <div className="page-loader" style={{ minHeight: 120 }}>
                  <div className="loader-light" />
                  <div className="page-loader-text">Loading live runs…</div>
                </div>
              ) : error ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-white/30 text-sm text-center px-4">{error}</p>
                </div>
              ) : activeExecutions.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-white/20 text-sm text-center px-4">
                    There are no running agents right now. Kick off a run from the Agents page.
                  </p>
                </div>
              ) : (
                activeExecutions.map((exec: any) => {
                  const lines = execLogs?.[exec._id] || [];
                  return (
                    <Link
                      key={exec._id}
                      href={`/dashboard/executions/${exec._id}`}
                      className="rounded-2xl bg-black border border-white/10 overflow-hidden hover:border-white/20 transition-colors"
                    >
                      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate text-white/90">
                            {exec.agentName || (exec.agentId as any)?.name || 'Agent'}
                          </div>
                          <div className="text-[11px] text-white/40">
                            {triggerLabel(exec.triggerType)}
                            {typeof exec.duration === 'number' ? ` • ${exec.duration}s` : ''}
                          </div>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>

                      <div
                        className="px-4 py-3 max-h-[170px] overflow-y-auto text-[11px] whitespace-pre-wrap"
                        style={{ fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
                      >
                        {lines.length ? (
                          lines.slice(-16).map((l: string, idx: number) => (
                            <div
                              key={idx}
                              className={
                                l.startsWith('[ERROR]')
                                  ? 'text-red-400'
                                  : l.startsWith('[BILLING]')
                                    ? 'text-fuchsia-300/90'
                                    : l.startsWith('[MEM]')
                                      ? 'text-amber-200/90'
                                      : l.startsWith('[RESEARCH]')
                                        ? 'text-cyan-300/90'
                                        : l.startsWith('[DEBUG]')
                                          ? 'text-sky-300/80'
                                          : 'text-emerald-300/90'
                              }
                            >
                              {l}
                            </div>
                          ))
                        ) : (
                          <div className="text-white/30">Waiting for logs…</div>
                        )}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Bottom row: Agents snapshot + Integrations snapshot */}
        <div className="flex flex-col lg:flex-row gap-3 w-full mb-4">
          {/* Agents snapshot / empty box content */}
          <div className="bg-black/20 h-80 flex flex-col gap-4 border border-black/40 overflow-hidden rounded-3xl p-4 flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white/80">
                Agents overview
              </h3>
              <Link href="/dashboard/agents">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-white/50 hover:text-white bg-base rounded-full py-2 px-5 cursor-pointer"
                >
                  View all
                </Button>
              </Link>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-white/20 text-sm">Loading agents…</div>
              ) : agents.length === 0 ? (
                <div className="p-4 text-white/20 text-sm">
                  No agents yet. Create your first one from the Agents page.
                </div>
              ) : agents.slice(0, 5).map((agent: any) => (
                <Link
                  key={agent._id}
                  href={`/dashboard/agents/${agent._id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-background border border-white/3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 h-fit rounded-xl bg-white/5 border border-white/10 w-fit">
                      <SparkleIcon size={22} className="text-base" weight="fill" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{agent.name}</span>
                      <span className="text-[11px] pr-5 text-white/40 line-clamp-1">
                        {agent.instructions || agent.description || 'No description'}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide ${agent.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                    }`}>
                    {agent.status}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Integrations & channels snapshot */}
          <div className="bg-black/20 h-80 flex flex-col gap-4 border border-black/40 overflow-hidden rounded-3xl p-4 flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white/80">
                Connected Apps
              </h3>
              <Link href="/dashboard/integrations">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-white/50 hover:text-white bg-base rounded-full py-2 px-5 cursor-pointer"
                >
                  Manage
                </Button>
              </Link>
            </div>
            <div className="bg-black/20 overflow-y-auto flex flex-col gap-2.5 border border-black/40 rounded-xl p-2.5">
              {(live?.integrations || []).filter(Boolean).slice(0, 6).map((int: any) => (
                <div
                  key={int.provider}
                  className="bg-background rounded-xl flex justify-between items-center p-2.5"
                >
                  <div className="flex gap-3.5 items-center">
                    <div className="p-2 h-fit rounded-xl bg-white/5 border border-white/10 w-fit">
                      <Image
                        src={`/${int.provider}.svg`}
                        alt={`${int.provider} Icon`}
                        height={32}
                        width={32}
                        className="size-7"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h3 className="text-[15px] font-semibold capitalize">
                        {int.provider}
                      </h3>
                      <p className="text-[11px] text-white/50">
                        {int.status === 'connected' ? 'Connected' : int.status}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRightIcon className="size-4 text-white/30" />
                </div>
              ))}
              {(!live?.integrations || live.integrations.length === 0) && !loading && (
                <div className="p-4 text-white/20 text-sm">
                  No integrations yet. Connect Slack, GitHub, Google and more.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
