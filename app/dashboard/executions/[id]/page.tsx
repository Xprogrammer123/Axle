'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  CaretLeft,
  CheckCircle,
  XCircle,
  Lightning,
  Clock,
  Brain,
  ListBullets,
  ArrowSquareOut,
  Info
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api, getToken } from '@/lib/api';
import { safeFormatDistanceToNow, safeFormat } from '@/lib/utils';
import { socketClient } from '@/lib/socket';

export default function ExecutionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [execution, setExecution] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTechnical, setShowTechnical] = useState(false);
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [axleLogs, setAxleLogs] = useState<any[]>([]);
  const [retrying, setRetrying] = useState(false);
  const [printedCount, setPrintedCount] = useState(0);
  const terminalRef = useRef<HTMLDivElement | null>(null);

  const [resultUi, setResultUi] = useState<any | null>(null);
  const [resultGenerating, setResultGenerating] = useState(false);
  const [showResultView, setShowResultView] = useState(false);

  async function loadExecution() {
    try {
      const data = await api.getExecution(params.id as string);
      setExecution(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (params.id) loadExecution();
  }, [params.id]);

  const handleRetry = async () => {
    if (!execution?._id || retrying) return;
    setRetrying(true);
    try {
      const res: any = await api.retryExecution(execution._id);
      const nextId = res?.newExecutionId || res?.executionId;
      if (nextId) {
        router.push(`/dashboard/executions/${nextId}`);
        return;
      }
      await loadExecution();
    } catch (e) {
      console.error(e);
    } finally {
      setRetrying(false);
    }
  };

  // Socket-driven updates with polling fallback
  useEffect(() => {
    if (!execution?._id || !execution.agentId) return;

    const token = getToken();
    socketClient.connect(token || undefined);

    const agentId = typeof execution.agentId === 'string' ? execution.agentId : execution.agentId._id;

    const unsubscribe = socketClient.subscribeToAgent(agentId, {
      onExecutionStarted: (data) => {
        if (data.executionId === execution._id) {
          setLiveEvents((prev) => [...prev, { type: 'started', ...data }]);
        }
      },
      onActionStarted: (data) => {
        setLiveEvents((prev) => [...prev, { type: 'action_started', ...data }]);
      },
      onActionCompleted: async (data) => {
        setLiveEvents((prev) => [...prev, { type: 'action_completed', ...data }]);
        // Refresh execution from API to pull full action details
        await loadExecution();
      },
      onExecutionCompleted: async (data) => {
        if (data.executionId === execution._id) {
          setLiveEvents((prev) => [...prev, { type: 'completed', ...data }]);
          await loadExecution();
        }
      },
      onExecutionEvent: (data) => {
        if (data.executionId !== execution._id) return;
        const evt = data.event;
        if (evt?.type === 'axle_log' && typeof evt.line === 'string') {
          setAxleLogs((prev) => {
            const next = [...prev, evt];
            // cap to avoid unbounded growth
            return next.length > 200 ? next.slice(-200) : next;
          });
        }
      },
    });

    // Polling fallback if socket not connected or status still running
    let interval: any;
    if (execution.status === 'running' || execution.status === 'pending') {
      interval = setInterval(loadExecution, 5000);
    }

    return () => {
      if (unsubscribe) unsubscribe();
      if (interval) clearInterval(interval);
    };
  }, [execution?._id, execution?.agentId, execution?.status]);

  const duration = execution?.startedAt && execution?.finishedAt
    ? (new Date(execution.finishedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000
    : 0;

  const agent = execution && typeof execution.agentId !== 'string' ? execution.agentId : null;

  const terminalLines = useMemo(() => {
    if (!execution) return [];
    const lines: string[] = [];
    const nowIso = new Date().toISOString();

    const persona =
      agent?.persona ||
      agent?.description ||
      (typeof agent?.instructions === 'string' && agent.instructions.trim()
        ? agent.instructions.trim().split('\n')[0]
        : undefined) ||
      'n/a';

    const scopesArr: string[] = Array.isArray(agent?.actions)
      ? agent.actions
      : Array.isArray(agent?.integrations)
        ? agent.integrations
        : [];

    const scopes = scopesArr.length ? scopesArr.join(', ') : 'n/a';
    const modelVersion = agent?.brain?.model || agent?.model || (execution as any)?.model || 'n/a';

    lines.push(`[INFO] ${nowIso} Booting Deployment Terminal…`);
    lines.push(`[INFO] ${nowIso} Agent Detail: Persona=${persona}`);
    lines.push(`[INFO] ${nowIso} Agent Detail: Scopes=${scopes}`);
    lines.push(`[INFO] ${nowIso} Agent Detail: Model=${modelVersion}`);

    lines.push(`[DEBUG] ${nowIso} Hydrating execution context (id=${String(execution._id).slice(-6)})`);
    lines.push(`[DEBUG] ${nowIso} Establishing event stream via Socket.io…`);

    // Live axle logs from the worker (MEM/TOOL/BILLING)
    for (const evt of axleLogs) {
      if (typeof evt?.line === 'string') {
        lines.push(evt.line);
      }
    }

    if (execution.status === 'pending') {
      lines.push(`[INFO] ${nowIso} Status=pending. Waiting for worker allocation…`);
    }

    if (execution.status === 'running') {
      lines.push(`[INFO] ${nowIso} Status=running. Initializing runtime…`);
      lines.push(`[DEBUG] ${nowIso} Loading integrations…`);
      lines.push(`[DEBUG] ${nowIso} Warming up model session…`);
    }

    for (const e of liveEvents) {
      if (e.type === 'started') {
        lines.push(`[INFO] ${nowIso} Execution started (id=${String(e.executionId).slice(-6)})`);
      }
      if (e.type === 'action_started') {
        lines.push(`[DEBUG] ${nowIso} Action started: ${e.actionType}`);
      }
      if (e.type === 'action_completed') {
        const status = e.success ? 'OK' : 'FAIL';
        const dur = e.durationMs ? ` (${(e.durationMs / 1000).toFixed(1)}s)` : '';
        lines.push(`[INFO] ${nowIso} Action completed: ${e.actionType} => ${status}${dur}`);
      }
      if (e.type === 'completed') {
        lines.push(`[INFO] ${nowIso} Execution completed: ${e.status}`);
      }
    }

    if (Array.isArray(execution.actionsExecuted) && execution.actionsExecuted.length > 0) {
      for (const action of execution.actionsExecuted) {
        const actionName = action.humanReadableStep || action.type;
        const dur = action.durationMs ? ` ${(action.durationMs / 1000).toFixed(1)}s` : '';
        if (action.error) {
          lines.push(`[ERROR] ${nowIso} ${actionName} failed${dur} :: ${action.error}`);
        } else {
          lines.push(`[INFO] ${nowIso} ${actionName} success${dur}`);
        }

        if (showTechnical) {
          try {
            lines.push(`[TRACE] ${nowIso} params=${JSON.stringify(action.params ?? {})}`);
          } catch {
            lines.push(`[TRACE] ${nowIso} params=[unserializable]`);
          }
          try {
            lines.push(`[TRACE] ${nowIso} result=${JSON.stringify(action.result ?? {})}`);
          } catch {
            lines.push(`[TRACE] ${nowIso} result=[unserializable]`);
          }
        }
      }
    } else {
      lines.push(`[INFO] ${nowIso} Awaiting first action…`);
    }

    if (execution.status === 'success' || execution.status === 'completed') {
      lines.push(`[INFO] ${nowIso} Deployment finished successfully.`);
    }

    if (execution.status === 'failed' || execution.status === 'error') {
      lines.push(`[ERROR] ${nowIso} Deployment failed. See error details in Outcome/Reasoning.`);
    }

    // De-dupe while preserving order to reduce noise when state refreshes.
    const seen = new Set<string>();
    return lines.filter((l) => {
      if (seen.has(l)) return false;
      seen.add(l);
      return true;
    });
  }, [agent, axleLogs, execution, liveEvents, showTechnical]);

  const logsComplete = printedCount >= terminalLines.length;
  const executionFinished = !!execution && (execution.status === 'success' || execution.status === 'failed' || execution.status === 'completed');

  // Stream a generative UI spec once logs are fully printed.
  useEffect(() => {
    if (!executionFinished) return;
    if (!logsComplete) return;
    if (resultGenerating || resultUi) return;

    let cancelled = false;

    const run = async () => {
      setResultGenerating(true);
      try {
        const res = await fetch('/api/execution-result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ execution }),
        });

        if (!res.ok) {
          throw new Error(`Failed to generate result UI (HTTP ${res.status})`);
        }

        if (!res.body) {
          const text = await res.text();
          try {
            const parsed = JSON.parse(text);
            if (!cancelled) setResultUi(parsed);
          } catch {
            if (!cancelled) setResultUi({
              message: 'Execution completed.',
              actions: [],
              markdownSummary: execution?.outputPayload?.result || execution?.outputPayload?.summary || 'No summary available.',
            });
          }
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Best-effort incremental parse (streamObject emits a JSON object progressively).
          try {
            const maybe = JSON.parse(buffer);
            if (!cancelled) setResultUi(maybe);
          } catch {
            // ignore until we have valid JSON
          }
        }

        // Final parse
        try {
          const finalParsed = JSON.parse(buffer);
          if (!cancelled) setResultUi(finalParsed);
        } catch {
          if (!cancelled) {
            setResultUi({
              message: 'Execution completed.',
              actions: [],
              markdownSummary: execution?.outputPayload?.result || execution?.outputPayload?.summary || 'No summary available.',
            });
          }
        }

        if (!cancelled) {
          // Smooth fade into result view after we have UI spec.
          setTimeout(() => {
            if (!cancelled) setShowResultView(true);
          }, 350);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setResultGenerating(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [execution, executionFinished, logsComplete, resultGenerating, resultUi]);

  const handleAction = (action: any) => {
    if (!action) return;
    if (action.type === 'open_url' && action.url) {
      window.open(action.url, '_blank', 'noopener,noreferrer');
      return;
    }
    if (action.type === 'bulk_open_urls' && Array.isArray(action.urls)) {
      for (const u of action.urls) {
        window.open(u, '_blank', 'noopener,noreferrer');
      }
      return;
    }
    if (action.type === 'bulk_github_star') {
      // Placeholder until we wire an authenticated bulk star endpoint.
      console.warn('bulk_github_star not wired yet', action);
    }
  };

  // Reset printing when execution changes.
  useEffect(() => {
    setPrintedCount(0);
  }, [execution?._id]);

  // Fast, technical log printing.
  useEffect(() => {
    if (!terminalLines.length) return;

    let cancelled = false;
    let timer: any;

    const tick = () => {
      setPrintedCount((prev) => {
        if (cancelled) return prev;
        if (prev >= terminalLines.length) return prev;
        return prev + 1;
      });
    };

    // Keep printing until we catch up to the latest lines.
    if (printedCount < terminalLines.length) {
      timer = setInterval(tick, 45);
    }

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [printedCount, terminalLines]);

  // Auto-scroll to bottom as new lines print.
  useEffect(() => {
    const el = terminalRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [printedCount]);

  // Render loading state AFTER hooks so hook order stays consistent.
  if (loading || !execution) {
    return (
      <div className="page-loader">
        <div className="loader-light" />
        <div className="page-loader-text">Initializing execution view…</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">

      {/* Header */}
      <div>
        <Link href={`/dashboard/agents/${execution.agentId?._id || execution.agentId}`} className="text-sm text-white/40 hover:text-white mb-4 flex items-center gap-1 transition-colors">
          <CaretLeft /> Back to Agent
        </Link>

        <div className="flex flex-col md:flex-row md:items-center gap-5 justify-between">
          <div className="flex items-center gap-4">
            <StatusLargeIcon status={execution.status} />
            <div>
              <h1 className="text-2xl font-light text-white tracking-tight">
                {execution.name || 'Untitled Execution'}
              </h1>
              <p className="text-white/40 mt-1">
                Started {safeFormatDistanceToNow(execution.createdAt, { addSuffix: true })}
                {duration > 0 && ` • Took ${duration.toFixed(1)}s`}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {execution.status === 'failed' && (
              <Button
                className="w-fit rounded-full text-sm px-5 py-2.5"
                onClick={handleRetry}
                disabled={retrying}
              >
                {retrying ? 'Retrying…' : 'Retry Execution'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Result Banner */}
      <Card className={`p-8 border rounded-2xl ${execution.status === 'completed' || execution.status === 'success'
        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-100'
        : execution.status === 'failed' || execution.status === 'error'
          ? 'bg-red-500/5 border-red-500/20 text-red-100'
          : 'bg-blue-500/5 border-blue-500/20 text-blue-100'
        }`}>
        <div className="flex gap-4">
          <Info size={24} weight="duotone" className="opacity-60 shrink-0" />
          <div className="space-y-2">
            <h3 className="font-medium text-lg">Outcome</h3>
            <p className="text-white/70 leading-relaxed">
              {execution.outputPayload?.summary ||
                execution.reasoning ||
                (execution.status === 'running'
                  ? 'Agent is currently processing instructions...'
                  : 'No summary provided for this execution.')}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: reasoning, Live events & Logs */}
        <div className="lg:col-span-2 space-y-8">

          {/* Reasoning */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-white/60">
              <Brain size={20} weight="duotone" />
              <h2 className="text-lg font-medium">AI Reasoning</h2>
            </div>
            <Card className="p-6 bg-base/[0.03] border-white/5 rounded-2xl">
              <div className="whitespace-pre-wrap text-white/50 text-sm leading-relaxed italic">
                {execution.reasoning || "The agent is formulating a plan based on your instructions..."}
              </div>
            </Card>
          </section>

          {/* Live events (socket-only, lightweight) */}
          {liveEvents.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-white/60">
                  <Lightning size={16} weight="duotone" />
                  <h2 className="text-sm font-medium">Live activity</h2>
                </div>
                <span className="text-[10px] text-white/30">
                  Streaming from Socket.io
                </span>
              </div>
              <div className="bg-black/40 border border-white/10 rounded-2xl p-3 max-h-40 overflow-y-auto text-[11px] text-white/70 space-y-1">
                {liveEvents.map((e, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {e.type === 'action_started' && `→ ${e.actionType} started`}
                      {e.type === 'action_completed' &&
                        `✓ ${e.actionType} ${e.success ? 'completed' : 'failed'}`}
                      {e.type === 'started' && 'Execution started'}
                      {e.type === 'completed' && `Execution ${e.status}`}
                    </span>
                    {e.durationMs && (
                      <span className="text-white/40">
                        {(e.durationMs / 1000).toFixed(1)}s
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Action Timeline */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-white/60">
                <ListBullets size={20} weight="duotone" />
                <h2 className="text-lg font-medium">Deployment Terminal</h2>
              </div>
              <button
                onClick={() => setShowTechnical(!showTechnical)}
                className="text-xs text-white/30 hover:text-white transition-colors"
              >
                {showTechnical ? 'Hide Technical Details' : 'Show Technical Details'}
              </button>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {!showResultView ? (
                <motion.div
                  key="terminal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card className="p-0 bg-black border border-white/10 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 text-[11px] text-white/70" style={{ fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          axle@deploy
                        </span>
                        <span className="text-[11px] text-white/30" style={{ fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
                          exec:{String(execution._id).slice(-6)}
                        </span>
                      </div>
                      <span className="text-[11px] text-white/40" style={{ fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
                        status={execution.status}
                      </span>
                    </div>

                    <div
                      ref={terminalRef}
                      className="px-4 py-3 max-h-[440px] overflow-y-auto"
                      style={{ fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
                    >
                      <div className="space-y-1">
                        <AnimatePresence initial={false}>
                          {terminalLines.slice(0, printedCount).map((line, idx) => (
                            <motion.div
                              key={`${idx}-${line}`}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.12, ease: 'easeOut' }}
                              className="text-[11px] leading-relaxed whitespace-pre-wrap"
                            >
                              <span
                                className={
                                  line.startsWith('[ERROR]')
                                    ? 'text-red-400'
                                    : line.startsWith('[BILLING]')
                                      ? 'text-fuchsia-300/90'
                                      : line.startsWith('[MEM]')
                                        ? 'text-amber-200/90'
                                        : line.startsWith('[RESEARCH]')
                                          ? 'text-cyan-300/90'
                                          : line.startsWith('[TRACE]')
                                            ? 'text-white/30'
                                            : line.startsWith('[DEBUG]')
                                              ? 'text-sky-300/80'
                                              : 'text-emerald-300/90'
                                }
                              >
                                {line}
                              </span>
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        <div className="text-[11px] text-white/40">
                          <span className="select-none">$</span>
                          <span className="ml-2 inline-block w-2 h-[14px] bg-white/40 align-middle animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Structured markdown summary under terminal once logs reach 100% */}
                  {executionFinished && logsComplete && (
                    <div className="mt-4">
                      <Card className="p-5 bg-base/[0.03] border-white/5 rounded-2xl">
                        <div className="text-xs text-white/40 mb-3">Execution Summary</div>
                        <div className="prose prose-invert prose-sm max-w-none text-white/80">
                          <ReactMarkdown>
                            {resultUi?.markdownSummary ||
                              execution?.outputPayload?.summary ||
                              execution?.outputPayload?.result ||
                              execution?.reasoning ||
                              'No summary available.'}
                          </ReactMarkdown>
                        </div>
                        {resultGenerating && (
                          <div className="mt-3 text-[11px] text-white/30">Generating result view…</div>
                        )}
                      </Card>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <Card className="p-6 bg-gradient-to-b from-white/5 to-white/3 border border-[#333] rounded-2xl">
                    <div className="text-xs text-white/40 mb-3">Conversational Result</div>

                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-[#36B460]/10 flex items-center justify-center flex-shrink-0">
                        <Lightning size={16} className="text-[#36B460]" />
                      </div>
                      <div className="flex-1">
                        <div className="inline-block px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sm text-white/80">
                          {resultUi?.message || 'Execution completed.'}
                        </div>

                        {Array.isArray(resultUi?.actions) && resultUi.actions.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {resultUi.actions.slice(0, 6).map((a: any) => (
                              <Button
                                key={a.id}
                                className="rounded-full text-sm px-4"
                                onClick={() => handleAction(a)}
                              >
                                {a.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </div>

        {/* Right: Metadata & Artifacts */}
        <div className="space-y-8">
          <Card className="p-6 bg-base/[0.02] border-white/5 rounded-2xl">
            <h3 className="text-sm font-medium text-white/60 mb-4">Execution Stats</h3>
            <div className="space-y-4 text-xs">
              <StatRow label="Trigger" value={execution.triggerType || 'manual'} />
              <StatRow label="Agent" value={execution.agentId?.name || 'Unknown'} />
              <StatRow label="Status" value={execution.status} />
              <StatRow label="Tokens" value={(execution.aiTokensUsed ?? 0).toLocaleString()} />
              <StatRow label="Credits used" value={(execution.creditsUsed ?? 0).toString()} />
              <StatRow
                label="Actions"
                value={(execution.actionsExecuted?.length ?? 0).toString()}
              />
              <StatRow
                label="Iterations"
                value={String(execution.outputPayload?.iterations ?? 1)}
              />
              <StatRow
                label="Mode"
                value={execution.outputPayload?.executionMode || 'one-shot'}
              />
              <StatRow
                label="Memory entries"
                value={Array.isArray(execution.memory) ? execution.memory.length.toString() : '0'}
              />
              <StatRow
                label="Approval"
                value={execution.approvalStatus || 'n/a'}
              />
              <StatRow label="Started" value={safeFormat(execution.createdAt, 'HH:mm:ss')} />
              {execution.finishedAt && (
                <StatRow label="Finished" value={safeFormat(execution.finishedAt, 'HH:mm:ss')} />
              )}
            </div>
          </Card>

          {/* Combined Artifacts List */}
          {execution.actionsExecuted?.some((a: any) => a.result?.webViewLink || a.result?.url) && (
            <section>
              <h3 className="text-sm font-medium text-white/60 mb-4">Produced Artifacts</h3>
              <div className="space-y-2">
                {execution.actionsExecuted.map((action: any, i: number) => {
                  const link = action.result?.webViewLink || action.result?.url;
                  if (!link) return null;
                  return (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-base/5 border border-white/5 rounded-xl hover:bg-base/10 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-base/5 rounded-lg text-white/40 group-hover:text-white transition-colors">
                          <ArrowSquareOut size={16} />
                        </div>
                        <span className="text-xs text-white/70 font-medium truncate max-w-[140px]">
                          {action.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <CaretLeft className="rotate-180 text-white/20" />
                    </a>
                  );
                })}
              </div>
            </section>
          )}
        </div>

      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-white/30">{label}</span>
      <span className="text-white/70 font-medium">{value}</span>
    </div>
  );
}

function StatusLargeIcon({ status }: { status: string }) {
  if (status === 'completed' || status === 'success') return <CheckCircle size={40} className="text-emerald-500" weight="duotone" />;
  if (status === 'failed' || status === 'error') return <XCircle size={40} className="text-red-500" weight="duotone" />;
  if (status === 'running') return <Lightning size={40} className="text-blue-500 animate-pulse" weight="duotone" />;
  return <Clock size={40} className="text-white/10" weight="duotone" />;
}
