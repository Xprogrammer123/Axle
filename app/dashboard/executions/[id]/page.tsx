'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
  const [execution, setExecution] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTechnical, setShowTechnical] = useState(false);
  const [liveEvents, setLiveEvents] = useState<any[]>([]);

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

  if (loading || !execution) return <div className="p-8 text-white/20 animate-pulse">Initializing execution view...</div>;

  const duration = execution.startedAt && execution.finishedAt
    ? (new Date(execution.finishedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000
    : 0;

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
              <Button className="bg-base text-black w-fit hover:bg-base/90 rounded-full text-sm px-5 py-2.5">
                Retry Execution
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
                <h2 className="text-lg font-medium">Activity Log</h2>
              </div>
              <button
                onClick={() => setShowTechnical(!showTechnical)}
                className="text-xs text-white/30 hover:text-white transition-colors"
              >
                {showTechnical ? 'Hide Technical Details' : 'Show Technical Details'}
              </button>
            </div>

            <div className="space-y-4">
              {(!execution.actionsExecuted || execution.actionsExecuted.length === 0) ? (
                <div className="p-12 text-center text-white/10 border border-dashed border-white/5 rounded-2xl">
                  Waiting for actions to begin...
                </div>
              ) : (
                execution.actionsExecuted.map((action: any, i: number) => (
                  <div key={i} className="group">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${action.error ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-base/5 border-white/10 text-white/40'
                          }`}>
                          {i + 1}
                        </div>
                        {i < execution.actionsExecuted.length - 1 && (
                          <div className="w-px h-full bg-base/5 my-1" />
                        )}
                      </div>

                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-white/80">
                            {action.humanReadableStep || action.type}
                          </span>
                          <span className="text-xs text-white/20 font-mono">
                            {action.durationMs ? `${(action.durationMs / 1000).toFixed(1)}s` : ''}
                          </span>
                        </div>

                        {action.error ? (
                          <p className="text-sm text-red-400/80 mb-2">{action.error}</p>
                        ) : action.resultSummary ? (
                          <p className="text-sm text-white/40 leading-relaxed mb-2">{action.resultSummary}</p>
                        ) : null}

                        {/* Artifact Link if any */}
                        {action.result?.webViewLink && (
                          <a
                            href={action.result.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400 hover:bg-blue-500/20 transition-all mt-1"
                          >
                            <ArrowSquareOut size={14} />
                            View Output
                          </a>
                        )}

                        {action.outputValidation && (
                          <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-white/60">
                            <span className={`px-2 py-0.5 rounded-full border ${
                              action.outputValidation.valid
                                ? 'border-emerald-400/40 text-emerald-300'
                                : 'border-amber-400/40 text-amber-200'
                            }`}>
                              Schema {action.outputValidation.valid ? 'valid' : 'needs attention'}
                            </span>
                            {Array.isArray(action.toolsCalled) && action.toolsCalled.length > 0 && (
                              <span className="px-2 py-0.5 rounded-full border border-white/10">
                                Tools: {action.toolsCalled.join(', ')}
                              </span>
                            )}
                            {typeof action.verified === 'boolean' && (
                              <span className="px-2 py-0.5 rounded-full border border-white/10">
                                Verified: {action.verified ? 'yes' : 'no'}
                              </span>
                            )}
                          </div>
                        )}

                        {showTechnical && (
                          <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5 overflow-hidden space-y-2">
                            <pre className="text-[10px] text-white/20 font-mono overflow-x-auto">
                              {JSON.stringify(action.params, null, 2)}
                            </pre>
                            <div className="h-px bg-base/5" />
                            <pre className="text-[10px] text-emerald-500/30 font-mono overflow-x-auto">
                              {JSON.stringify(action.result, null, 2)}
                            </pre>
                            {action.outputValidation && (
                              <>
                                <div className="h-px bg-base/5" />
                                <pre className="text-[10px] text-amber-300/60 font-mono overflow-x-auto">
                                  {JSON.stringify(action.outputValidation, null, 2)}
                                </pre>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
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
