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
import { api } from '@/lib/api';
import { safeFormatDistanceToNow } from '@/lib/utils';

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

  // Trigger creation state
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState<'daily' | 'weekly'>('daily');
  const [scheduleDayOfWeek, setScheduleDayOfWeek] = useState<number>(1);
  const [scheduleHour, setScheduleHour] = useState<number>(9);
  const [scheduleAmPm, setScheduleAmPm] = useState<'AM' | 'PM'>('AM');
  const [webhookEnabled, setWebhookEnabled] = useState(false);
  const [selectedWebhookEventId, setSelectedWebhookEventId] = useState<string>('github.push');
  const [savingTriggers, setSavingTriggers] = useState(false);

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
    if (!taskInput.trim()) return;
    setRunning(true);
    try {
      await api.runAgent(agent._id, { task: taskInput });
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

  if (loading || !agent) {
    return (
      <div className="page-loader">
        <div className="loader-light" />
        <div className="page-loader-text">Loading agent details…</div>
      </div>
    );
  }

  const scheduleTriggers = triggers.filter((t: any) => t.type === 'schedule');
  const webhookTriggers = triggers.filter((t: any) => t.type === 'webhook');

  const dayLabels: { value: number; label: string; full: string }[] = [
    { value: 0, label: 'Sun', full: 'Sunday' },
    { value: 1, label: 'Mon', full: 'Monday' },
    { value: 2, label: 'Tue', full: 'Tuesday' },
    { value: 3, label: 'Wed', full: 'Wednesday' },
    { value: 4, label: 'Thu', full: 'Thursday' },
    { value: 5, label: 'Fri', full: 'Friday' },
    { value: 6, label: 'Sat', full: 'Saturday' },
  ];

  const to24Hour = (hour: number, ampm: 'AM' | 'PM') => {
    const h = Math.max(1, Math.min(12, hour));
    if (ampm === 'AM') return h === 12 ? 0 : h;
    return h === 12 ? 12 : h + 12;
  };

  const from24Hour = (hour24: number): { hour: number; ampm: 'AM' | 'PM' } => {
    const h = Math.max(0, Math.min(23, hour24));
    if (h === 0) return { hour: 12, ampm: 'AM' };
    if (h === 12) return { hour: 12, ampm: 'PM' };
    if (h > 12) return { hour: h - 12, ampm: 'PM' };
    return { hour: h, ampm: 'AM' };
  };

  const buildCron = () => {
    const hour24 = to24Hour(scheduleHour, scheduleAmPm);
    if (scheduleFrequency === 'daily') return `0 ${hour24} * * *`;
    return `0 ${hour24} * * ${scheduleDayOfWeek}`;
  };

  const cronToLabel = (cron?: string) => {
    if (!cron) return 'Schedule';

    const daily = /^0\s+(\d{1,2})\s+\*\s+\*\s+\*$/.exec(cron.trim());
    if (daily) {
      const hour24 = parseInt(daily[1], 10);
      const t = from24Hour(hour24);
      return `Every day at ${t.hour}:00 ${t.ampm}`;
    }

    const weekly = /^0\s+(\d{1,2})\s+\*\s+\*\s+(\d)$/.exec(cron.trim());
    if (weekly) {
      const hour24 = parseInt(weekly[1], 10);
      const dow = parseInt(weekly[2], 10);
      const t = from24Hour(hour24);
      const day = dayLabels.find((d) => d.value === dow)?.full || 'day';
      return `Weekly on ${day} at ${t.hour}:00 ${t.ampm}`;
    }

    return `Cron: ${cron}`;
  };

  const webhookSourceToLabel = (source?: string) => {
    if (!source) return 'Webhook event';
    const match = webhookEvents.find((e: any) => e.source === source || e.id === source);
    return match?.label || source;
  };

  const webhookSourceToDescription = (source?: string) => {
    if (!source) return '';
    const match = webhookEvents.find((e: any) => e.source === source || e.id === source);
    return match?.description || '';
  };

  const handleCreateSelectedTriggers = async () => {
    if (!agent?._id || savingTriggers) return;
    const selectedCron = buildCron();
    const selectedEvent = webhookEvents.find((e: any) => e.id === selectedWebhookEventId);
    const selectedSource = selectedEvent?.source || selectedEvent?.id;

    const creates: Promise<any>[] = [];
    if (scheduleEnabled && selectedCron) {
      creates.push(api.createTrigger({ agentId: agent._id, type: 'schedule', cronExpression: selectedCron, enabled: true }));
    }
    if (webhookEnabled && selectedSource) {
      creates.push(api.createTrigger({ agentId: agent._id, type: 'webhook', config: { source: selectedSource }, enabled: true }));
    }

    if (creates.length === 0) return;

    setSavingTriggers(true);
    try {
      await Promise.allSettled(creates);
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingTriggers(false);
    }
  };

  const handleToggleTrigger = async (t: any) => {
    try {
      await api.updateTrigger(t._id, { enabled: !t.enabled });
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTrigger = async (t: any) => {
    try {
      await api.deleteTrigger(t._id);
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">

      {/* Back & Header */}
      <div>
        <Link href="/dashboard/agents" className="text-sm text-white/40 hover:text-white mb-4 flex items-center gap-1 transition-colors">
          <CaretLeft /> Back to Team
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-light text-white tracking-tight">{agent.name}</h1>
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium border ${agent.status === 'active'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                }`}>
                {agent.status === 'active' ? 'Active' : 'Paused'}
              </div>
            </div>
            <p className="text-white/40 mt-1 max-w-xl">{agent.description || "No description provided."}</p>
          </div>

          <div className="flex gap-2">
          <div className="flex gap-2">
            <Button
              className="rounded-full mt-4"
              onClick={handleToggleStatus}
            >
              {agent.status === 'active' ? <Pause weight="fill" className="mr-2" /> : <Play weight="fill" className="mr-2" />}
              {agent.status === 'active' ? 'Pause Agent' : 'Resume Agent'}
              {agent.status === 'active' ? <Pause weight="fill" className="mr-2" /> : <Play weight="fill" className="mr-2" />}
              {agent.status === 'active' ? 'Pause Agent' : 'Resume Agent'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Instructions & Tools */}
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

        </div>

        {/* Right Column: Run Panel */}
        <div className="lg:col-span-1">
          <Card className="p-6 bg-gradient-to-b from-blue-900/10 to-transparent border border-white/10 rounded-2xl sticky top-6">
            <div className="flex items-center gap-2 mb-4 text-blue-300">
              <Lightning weight="fill" size={20} />
              <h3 className="font-medium">Run Task</h3>
            </div>

            <div className="space-y-4">
              <Textarea
                placeholder="Describe a task for this agent..."
                rows={4}
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                className="bg-black/20 border-white/10 resize-none text-sm"
              />
              <Button
                className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-6"
                onClick={handleRun}
                disabled={!taskInput.trim() || running}
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
      <section className="pt-8 border-t border-white/5">
        <h2 className="text-lg font-medium text-white/80 mb-6">Execution History</h2>

        <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
          {executions.length === 0 ? (
            <div className="p-8 text-center text-white/20">No history available.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {executions.map((exec) => (
                <Link
                  key={exec._id}
                  href={`/dashboard/executions/${exec._id}`}
                  className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <StatusIcon status={exec.status} />
                    <div>
                      <div className="text-sm font-medium text-white">
                        {exec.executionName || 'Manual Run'}
                      </div>
                      <div className="text-xs text-white/40">
                        {safeFormatDistanceToNow(exec.startedAt || exec.createdAt, { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-white/30 font-mono">
                      {exec.duration ? `${(exec.duration / 1000).toFixed(1)}s` : ''}
                    </span>
                    <CaretLeft className="rotate-180 text-white/20 group-hover:text-white/60 transition-colors" />
                  </div>
                </Link>
              ))}
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
