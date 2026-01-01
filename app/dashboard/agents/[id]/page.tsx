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
  const [integrationHealth, setIntegrationHealth] = useState<any | null>(null);
  const [triggers, setTriggers] = useState<any[]>([]);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [webhookEvents, setWebhookEvents] = useState<any[]>([]);
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
      const [agentData, executionsData, integrationsData, triggersData, webhooksData, healthData, webhookEventsData] = await Promise.all([
        api.getAgent(params.id as string),
        api.getExecutions({ agentId: params.id as string, limit: 5 }),
        api.getIntegrations(),
        api.getTriggers(params.id as string),
        api.getWebhooks(),
        api.getIntegrationHealth(),
        api.getWebhookEvents()
      ]);

      setAgent(agentData.agent);
      setExecutions(executionsData.executions || []);
      setIntegrations(integrationsData.integrations || []);
      setTriggers(triggersData.triggers || []);
      setWebhooks((webhooksData.webhooks || []).filter((w: any) => {
        const agentId = typeof w.agentId === 'string' ? w.agentId : w.agentId?._id;
        return agentId === (params.id as string);
      }));
      setIntegrationHealth(healthData);
      setWebhookEvents(webhookEventsData?.events || []);
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
    <div className="max-w-6xl mx-auto space-y-8 pb-20">

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
              className="rounded-full mt-4"
              onClick={handleToggleStatus}
            >
              {agent.status === 'active' ? <Pause weight="fill" className="mr-2" /> : <Play weight="fill" className="mr-2" />}
              {agent.status === 'active' ? 'Pause Agent' : 'Resume Agent'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">

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
                    <Button size="sm" onClick={handleSaveInstructions}>Save</Button>
                  </div>
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-white/70 font-mono text-sm leading-relaxed p-2">
                  {agent.instructions}
                </div>
              )}
            </Card>
          </section>

          {/* Triggers */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-white/80">Triggers</h2>
            </div>

            <Card className="p-5 bg-white/5 border border-white/5 rounded-2xl mb-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-white/80">Add triggers</div>
                  <div className="text-xs text-white/30">Choose how this agent should start running.</div>
                </div>
                <Button
                  onClick={handleCreateSelectedTriggers}
                  disabled={savingTriggers || (!scheduleEnabled && !webhookEnabled)}
                  className="rounded-full"
                >
                  {savingTriggers ? 'Saving…' : 'Add selected'}
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white/80">Schedule</div>
                      <div className="text-xs text-white/30">Run automatically on a cadence.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setScheduleEnabled(!scheduleEnabled)}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${scheduleEnabled ? 'bg-emerald-500/20' : 'bg-white/10'}`}
                      aria-label="Toggle schedule trigger"
                    >
                      <div className={`w-4 h-4 rounded-full transition-all ${scheduleEnabled ? 'bg-emerald-400 ml-auto' : 'bg-white/20'}`} />
                    </button>
                  </div>
                  {scheduleEnabled && (
                    <div className="mt-3 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setScheduleFrequency('daily')}
                          className={`px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                            scheduleFrequency === 'daily'
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                              : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                          }`}
                        >
                          Daily
                        </button>
                        <button
                          type="button"
                          onClick={() => setScheduleFrequency('weekly')}
                          className={`px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                            scheduleFrequency === 'weekly'
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                              : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                          }`}
                        >
                          Weekly
                        </button>
                      </div>

                      {scheduleFrequency === 'weekly' && (
                        <div className="grid grid-cols-7 gap-1">
                          {dayLabels.map((d) => (
                            <button
                              key={d.value}
                              type="button"
                              onClick={() => setScheduleDayOfWeek(d.value)}
                              className={`px-2 py-2 rounded-xl border text-[11px] font-medium transition-colors ${
                                scheduleDayOfWeek === d.value
                                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                                  : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                              }`}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <div className="text-xs text-white/30">Time</div>
                        <select
                          value={scheduleHour}
                          onChange={(e) => setScheduleHour(parseInt(e.target.value, 10))}
                          className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/80"
                        >
                          {Array.from({ length: 12 }).map((_, i) => {
                            const h = i + 1;
                            return (
                              <option key={h} value={h}>{h}:00</option>
                            );
                          })}
                        </select>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setScheduleAmPm('AM')}
                            className={`px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                              scheduleAmPm === 'AM'
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                                : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                          >
                            AM
                          </button>
                          <button
                            type="button"
                            onClick={() => setScheduleAmPm('PM')}
                            className={`px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                              scheduleAmPm === 'PM'
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                                : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                          >
                            PM
                          </button>
                        </div>
                      </div>

                      <div className="text-[11px] text-white/30">
                        Will run: {scheduleFrequency === 'daily' ? 'Every day' : `Weekly on ${dayLabels.find(d => d.value === scheduleDayOfWeek)?.label || 'day'}`} at {scheduleHour}:00 {scheduleAmPm}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white/80">Webhook event</div>
                      <div className="text-xs text-white/30">Run when an external event happens.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setWebhookEnabled(!webhookEnabled)}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${webhookEnabled ? 'bg-emerald-500/20' : 'bg-white/10'}`}
                      aria-label="Toggle webhook trigger"
                    >
                      <div className={`w-4 h-4 rounded-full transition-all ${webhookEnabled ? 'bg-emerald-400 ml-auto' : 'bg-white/20'}`} />
                    </button>
                  </div>

                  {webhookEnabled && (
                    <div className="mt-3 grid grid-cols-1 gap-2 max-h-56 overflow-y-auto">
                      {(webhookEvents.length ? webhookEvents : [{ id: 'github.push', label: 'New commit pushed', description: 'Triggers when code is pushed to a repository.' }]).map((ev: any) => (
                        <button
                          key={ev.id}
                          type="button"
                          onClick={() => setSelectedWebhookEventId(ev.id)}
                          className={`text-left px-3 py-2 rounded-xl border transition-colors ${
                            selectedWebhookEventId === ev.id
                              ? 'border-emerald-500/30 bg-emerald-500/10'
                              : 'border-white/10 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className={`text-xs font-medium ${selectedWebhookEventId === ev.id ? 'text-emerald-200' : 'text-white/80'}`}>
                            {ev.label || ev.id}
                          </div>
                          <div className="text-[11px] text-white/30 line-clamp-2">{ev.description || ''}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-5 bg-white/5 border border-white/5 rounded-2xl">
                <div className="text-xs uppercase tracking-widest text-white/30 mb-2">Schedules</div>
                {scheduleTriggers.length === 0 ? (
                  <div className="text-sm text-white/30">No schedule triggers yet.</div>
                ) : (
                  <div className="space-y-2">
                    {scheduleTriggers.map((t: any) => (
                      <div key={t._id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-black/20 border border-white/5">
                        <div className="min-w-0">
                          <div className="text-sm text-white/80 truncate">{cronToLabel(t.cronExpression || t.config?.cron)}</div>
                          <div className="text-[11px] text-white/30">
                            {t.enabled ? 'Enabled' : 'Disabled'}
                            {t.lastTriggeredAt ? ` • Last: ${safeFormatDistanceToNow(t.lastTriggeredAt, { addSuffix: true })}` : ''}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleTrigger(t)}
                            className={`text-[10px] px-2 py-0.5 rounded-full border ${t.enabled ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10' : 'border-white/10 text-white/30 bg-white/5'}`}
                          >
                            {t.enabled ? 'ON' : 'OFF'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTrigger(t)}
                            className="text-[10px] px-2 py-0.5 rounded-full border border-red-500/20 text-red-300 bg-red-500/10"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-5 bg-white/5 border border-white/5 rounded-2xl">
                <div className="text-xs uppercase tracking-widest text-white/30 mb-2">Webhooks</div>
                {webhookTriggers.length === 0 ? (
                  <div className="text-sm text-white/30">No webhook triggers yet.</div>
                ) : (
                  <div className="space-y-2">
                    {webhookTriggers.map((t: any) => {
                      const match = webhooks.find((w: any) => w.webhookPath === (t.webhookPath || t.config?.webhookPath));
                      const url = match?.url || match?.relativeUrl || t.webhookUrl;
                      const source = (t.source || t.config?.source) as string | undefined;
                      return (
                        <div key={t._id} className="p-3 rounded-xl bg-black/20 border border-white/5">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-sm text-white/80 truncate">
                              {webhookSourceToLabel(source)}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleTrigger(t)}
                                className={`text-[10px] px-2 py-0.5 rounded-full border ${t.enabled ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10' : 'border-white/10 text-white/30 bg-white/5'}`}
                              >
                                {t.enabled ? 'ON' : 'OFF'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteTrigger(t)}
                                className="text-[10px] px-2 py-0.5 rounded-full border border-red-500/20 text-red-300 bg-red-500/10"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          {webhookSourceToDescription(source) && (
                            <div className="mt-1 text-[11px] text-white/30 line-clamp-2">
                              {webhookSourceToDescription(source)}
                            </div>
                          )}
                          <div className="mt-2 text-[11px] text-white/30 break-all font-mono">
                            {url || '—'}
                          </div>
                          {url && (
                            <div className="mt-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => copyText(url)}
                                className="text-[11px] text-white/40 hover:text-white transition-colors"
                              >
                                Copy URL
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
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

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 bg-white/3 border-2 border-white/3 rounded-2xl top-6">
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
                Agent will use available tools to run the task.
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
