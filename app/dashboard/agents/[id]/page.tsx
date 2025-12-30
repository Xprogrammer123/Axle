'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CaretLeft,
  Play,
  Pause,
  Trash,
  CheckCircle,
  XCircle,
  Lightning,
  Clock,
  Robot,
  PencilSimple,
  FloppyDisk,
  X
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea, Input } from '@/components/ui/input';
import { api, getToken } from '@/lib/api';
import { safeFormatDistanceToNow } from '@/lib/utils';
import { socketClient } from '@/lib/socket';

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [agent, setAgent] = useState<any>(null);
  const [executions, setExecutions] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editInstructions, setEditInstructions] = useState('');

  // Run State
  const [taskInput, setTaskInput] = useState('');
  const [running, setRunning] = useState(false);
  const [liveExecution, setLiveExecution] = useState<any | null>(null);

  async function loadData() {
    try {
      const [agentData, executionsData, integrationsData] = await Promise.all([
        api.getAgent(params.id as string),
        api.getExecutions({ agentId: params.id as string, limit: 5 }),
        api.getIntegrations()
      ]);

      setAgent(agentData.agent);
      setExecutions(executionsData.executions || []);
      setIntegrations(integrationsData.integrations || []);
      setEditInstructions(agentData.agent.instructions || '');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (params.id) loadData();
  }, [params.id]);

  // Socket-driven live status for this agent
  useEffect(() => {
    if (!agent?._id) return;

    // Connect socket with auth token if available
    const token = getToken();
    socketClient.connect(token || undefined);

    const unsubscribe = socketClient.subscribeToAgent(agent._id, {
      onExecutionStarted: (data) => {
        setLiveExecution({
          id: data.executionId,
          status: data.status,
          actions: [],
          startedAt: new Date().toISOString(),
        });
      },
      onActionStarted: (data) => {
        setLiveExecution((prev: any) =>
          prev
            ? {
                ...prev,
                actions: [
                  ...prev.actions,
                  {
                    type: data.actionType,
                    status: 'running',
                    startedAt: new Date().toISOString(),
                  },
                ],
              }
            : prev
        );
      },
      onActionCompleted: (data) => {
        setLiveExecution((prev: any) =>
          prev
            ? {
                ...prev,
                actions: [
                  ...(prev.actions || []),
                  {
                    type: data.actionType,
                    status: data.success ? 'success' : 'failed',
                    durationMs: data.durationMs,
                  },
                ],
              }
            : prev
        );
      },
      onExecutionCompleted: (data) => {
        // Refresh executions list when a run completes
        loadData();
        setLiveExecution((prev: any) =>
          prev && prev.id === data.executionId ? { ...prev, status: data.status } : prev
        );
      },
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [agent?._id]);

  const handleSaveInstructions = async () => {
    try {
      await api.updateAgent(agent._id, { instructions: editInstructions });
      setIsEditing(false);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = agent.status === 'active' ? 'paused' : 'active';
    await api.updateAgent(agent._id, { status: newStatus });
    setAgent({ ...agent, status: newStatus });
  };

  const handleRun = async () => {
    if (!taskInput.trim()) return;
    setRunning(true);
    try {
      await api.runAgent(agent._id, { task: taskInput });
      setTaskInput('');
      // Refresh executions after a delay
      setTimeout(loadData, 1000);
      setTimeout(loadData, 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  if (loading || !agent) return <div className="p-8 text-white/20 animate-pulse">Loading agent details...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">

      {/* Back & Header */}
      <div>
        <Link href="/dashboard/agents" className="text-sm text-white/40 hover:text-white mb-4 flex items-center gap-1 transition-colors">
          <CaretLeft /> Back to Agents
        </Link>

        <div className="flex flex-col items-start justify-between">
          <div>
            <div className="flex justify-between items-center gap-3">
              <h1 className="md:text-3xl text-2xl font-semibold text-white tracking-tight">{agent.name}</h1>
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium border ${agent.status === 'active'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                }`}>
                {agent.status === 'active' ? 'Active' : 'Paused'}
              </div>
            </div>
            <p className="text-white/40 mt-0.5 max-w-xl">{agent.description || "No description provided."}</p>
          </div>

          <div className="flex gap-2">
            <Button
              className="bg-white/5 rounded-full mt-4 hover:bg-white/10 text-white border border-white/5"
              onClick={handleToggleStatus}
            >
              {agent.status === 'active' ? <Pause weight="fill" className="mr-2" /> : <Play weight="fill" className="mr-2" />}
              {agent.status === 'active' ? 'Pause Agent' : 'Resume Agent'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Instructions, Tools & Live status */}
        <div className="lg:col-span-2 space-y-8">

          {/* Instructions */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-white/80">Instructions</h2>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="text-xs text-white/40 hover:text-white flex items-center gap-1">
                  <PencilSimple /> Edit
                </button>
              )}
            </div>

            <Card className="p-4 bg-white/5 border border-white/5 rounded-2xl relative group">
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={editInstructions}
                    onChange={(e) => setEditInstructions(e.target.value)}
                    rows={8}
                    className="bg-black/20 font-mono text-sm border-white/10"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button size="sm" onClick={handleSaveInstructions} className="bg-white text-black hover:bg-white/90">Save</Button>
                  </div>
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-white/70 font-mono text-sm leading-relaxed p-2">
                  {agent.instructions}
                </div>
              )}
            </Card>
          </section>

          {/* Connected Integrations */}
          <section>
            <h2 className="text-lg font-medium text-white/80 mb-4">Available Tools</h2>
            <div className="flex gap-3 flex-wrap">
              {integrations.length === 0 ? (
                <span className="text-sm text-white/20">No active integrations.</span>
              ) : (
                integrations.map((int: any) => (
                  <div key={int.provider} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-sm text-white/70">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="capitalize">{int.provider}</span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Live Run (socket-driven) */}
          {liveExecution && (
            <section>
              <h2 className="text-lg font-medium text-white/80 mb-2">Live run</h2>
              <Card className="p-4 bg-black/40 border border-emerald-500/30 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/80">
                    Execution {liveExecution.id?.slice(-6)}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {liveExecution.status}
                  </span>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto text-xs text-white/60">
                  {(liveExecution.actions || []).map((a: any, idx: number) => (
                    <div key={idx} className="flex justify-between">
                      <span>{a.type}</span>
                      <span className="text-[10px]">
                        {a.status}
                        {a.durationMs ? ` • ${(a.durationMs / 1000).toFixed(1)}s` : ''}
                      </span>
                    </div>
                  ))}
                  {!liveExecution.actions?.length && (
                    <p className="text-white/30 text-xs">Waiting for first action…</p>
                  )}
                </div>
              </Card>
            </section>
          )}

        </div>

        {/* Right Column: Run Panel */}
        <div className="lg:col-span-1">
          <Card className="p-6 bg-gradient-to-b from-base/10 to-transparent border border-white/10 rounded-2xl sticky top-6">
            <div className="flex items-center gap-2 mb-4 text-base">
              <Lightning weight="fill" size={20} />
              <h3 className="font-medium">Run Task</h3>
            </div>

            <div className="space-y-4">
              <Textarea
                placeholder="Describe a task for this agent..."
                rows={4}
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                className="bg-black/40 border-black/60 resize-none text-sm"
              />
              <Button
                className="w-full bg-base text-white rounded-full py-3"
                onClick={handleRun}
                disabled={!taskInput.trim() || running}
              >
                {running ? 'Starting...' : 'Run Agent'}
              </Button>
              <p className="text-xs text-white/30 text-center">
                Agent will use available tools to accept the task.
              </p>
            </div>
          </Card>
        </div>

      </div>

      {/* Execution History */}
      <section className="pt-8 border-t border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-white/80">Execution History</h2>
          {executions.length > 0 && (
            <div className="flex gap-4 text-xs text-white/40">
              <span>
                Runs: <span className="text-white/80">{executions.length}</span>
              </span>
              <span>
                Success:{' '}
                <span className="text-emerald-400">
                  {executions.filter((e: any) => e.status === 'success').length}
                </span>
              </span>
              <span>
                Failed:{' '}
                <span className="text-red-400">
                  {executions.filter((e: any) => e.status === 'failed').length}
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
          {executions.length === 0 ? (
            <div className="p-8 text-center text-white/20">No history available.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {executions.map((exec: any) => {
                const started = exec.startedAt || exec.createdAt;
                const finished = exec.finishedAt;
                const durationMs = started && finished
                  ? new Date(finished).getTime() - new Date(started).getTime()
                  : undefined;
                const actionsCount = exec.actionsExecuted?.length ?? 0;

                return (
                  <Link
                    key={exec._id}
                    href={`/dashboard/executions/${exec._id}`}
                    className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <StatusIcon status={exec.status} />
                      <div>
                        <div className="text-sm font-medium text-white">
                          {exec.name || 'Manual Run'}
                        </div>
                        <div className="text-xs text-white/40">
                          {started &&
                            safeFormatDistanceToNow(started, { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span className="font-mono">
                        {durationMs ? `${(durationMs / 1000).toFixed(1)}s` : ''}
                      </span>
                      <span>{actionsCount} actions</span>
                      {typeof exec.creditsUsed === 'number' && (
                        <span>{exec.creditsUsed} credits</span>
                      )}
                      <CaretLeft className="rotate-180 text-white/20 group-hover:text-white/60 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'completed' || status === 'success') return <CheckCircle size={20} className="text-emerald-400" weight="fill" />;
  if (status === 'failed' || status === 'error') return <XCircle size={20} className="text-red-400" weight="fill" />;
  if (status === 'running') return <Lightning size={20} className="text-blue-400 animate-pulse" weight="fill" />;
  return <Clock size={20} className="text-white/20" weight="fill" />;
}
