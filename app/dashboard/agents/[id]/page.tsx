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
  X,
  Brain,
  File,
  FileText,
  Code,
  Square,
  CaretUpDown,
  DotsThree,
  Check,
  Spinner,
  GitBranch,
  ChatCircle
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
        <div className="lg:col-span-6 space-y-8">

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

            <Card className="p-5 bg-white/5 border border-[#333] rounded-2xl mb-4">
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

        {/* Right Column - Chat Interface */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="p-6 bg-gradient-to-b from-white/5 to-white/3 border border-[#333] rounded-2xl h-[600px] flex flex-col">
            <div className="flex items-center gap-2 mb-6 text-base">
              <Lightning weight="fill" size={20} />
              <h3 className="font-medium">Agent Chat</h3>
            </div>

            {/* Progress Header for Live Execution */}
            {liveExecution && (
              <ProgressHeader
                completed={liveExecution.actions.filter((a: any) => a.status === 'success').length}
                total={liveExecution.actions.length || 1}
                currentTask={liveExecution.actions.find((a: any) => a.status === 'running')?.type}
              />
            )}

            {/* Chat Messages Area - Timeline View */}
            <div className="flex-1 overflow-y-auto space-y-1 mb-4 custom-scrollbar">
              {liveExecution && (
                <div className="space-y-1">
                  {/* Live execution timeline */}
                  <TimelineStep
                    icon={<Robot size={16} className="text-white/80" />}
                    title="Agent started execution"
                    subtitle={liveExecution.id?.slice(-6)}
                    status="running"
                  />

                  {liveExecution.actions.map((action: any, idx: number) => (
                    <TimelineStep
                      key={idx}
                      icon={
                        action.type?.includes('search') ? <File size={16} className="text-white/60" /> :
                        action.type?.includes('code') ? <Code size={16} className="text-white/60" /> :
                        action.type?.includes('thought') ? <Brain size={16} className="text-white/60" /> :
                        <DotsThree size={16} className="text-white/60" />
                      }
                      title={
                        action.type?.includes('search') ? `Exploring ${action.type.split(' ').pop() || 'files'}` :
                        action.type?.includes('code') ? 'Modifying code' :
                        action.type?.includes('thought') ? 'Thinking through approach' :
                        action.type || 'Processing'
                      }
                      subtitle={action.type}
                      duration={action.durationMs}
                      status={action.status}
                    >
                      {/* Mock code diff for demonstration - in real app, this would come from the execution data */}
                      {action.type?.includes('code') && (
                        <CodeDiffView
                          filename="scraper.ts"
                          additions={46}
                          deletions={39}
                          diff={`@@ -15,7 +15,7 @@ import { chromium } from 'playwright';
 import { chromium } from 'playwright-core';
 
 export class WebScraper {
-  private browser: Browser | null = null;
+  private browser: Browser | null = null;
+  private timeout: number = 30000;
 
   async scrape(url: string): Promise<ScrapedData> {
     try {
       this.browser = await chromium.launch();
-      const page = await this.browser.newPage();
+      const page = await this.browser.newPage({ timeout: this.timeout });
       await page.goto(url);
       const content = await page.content();
       return { url, content, timestamp: new Date() };
     } catch (error) {
-      console.error('Scraping failed:', error);
+      console.error('Scraping failed:', error.message);
       throw error;
     } finally {
       await this.browser?.close();
@@ -35,6 +36,8 @@ export class WebScraper {
       await this.browser?.close();
     }
   }
+
+  // New method for batch scraping
+  async scrapeMultiple(urls: string[]): Promise<ScrapedData[]> {
+    return Promise.all(urls.map(url => this.scrape(url)));
+  }
 }`}
                        />
                      )}
                    </TimelineStep>
                  ))}

                  {!liveExecution.actions?.length && (
                    <TimelineStep
                      icon={<Clock size={16} className="text-white/40" />}
                      title="Waiting for first action..."
                      status="running"
                    />
                  )}
                </div>
              )}

              {/* Previous executions as collapsed timeline items */}
              {executions.slice(0, 5).reverse().map((exec: any) => (
                <TimelineStep
                  key={exec._id}
                  icon={<CheckCircle size={16} className="text-emerald-400" weight="fill" />}
                  title={exec.name || 'Manual Run'}
                  subtitle={`${exec.actionsExecuted?.length || 0} actions completed`}
                  duration={exec.startedAt && exec.finishedAt ?
                    new Date(exec.finishedAt).getTime() - new Date(exec.startedAt).getTime() : undefined}
                  status={exec.status === 'success' ? 'success' : exec.status === 'failed' ? 'failed' : undefined}
                />
              ))}

              {executions.length === 0 && !liveExecution && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-[#333]">
                    <Robot size={24} className="text-white/30" />
                  </div>
                  <h4 className="text-lg font-medium text-white/60 mb-2">No tasks run yet</h4>
                  <p className="text-white/40 text-sm max-w-xs">
                    Start a conversation with your agent by describing a task below.
                  </p>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="space-y-3">
              {/* Model Selector */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <select className="bg-black/40 border border-[#333] rounded-lg px-3 py-1.5 text-xs text-white/80 focus:outline-none focus:border-white/30">
                    <option value="grok-code">Grok Code</option>
                    <option value="claude">Claude</option>
                    <option value="gpt-4">GPT-4</option>
                  </select>
                  <div className="text-xs text-white/40">Model</div>
                </div>

                {running && (
                  <Button
                    onClick={() => {
                      // TODO: Implement stop functionality
                      console.log('Stop execution');
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-white/60 hover:text-white hover:bg-white/10 rounded-lg px-3 py-1.5 h-auto"
                  >
                    <Square size={12} className="mr-1.5" weight="fill" />
                    Stop
                  </Button>
                )}
              </div>

              {/* Input Area */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-black/60 backdrop-blur-xl border border-[#333] rounded-2xl p-1.5 shadow-2xl flex items-end gap-2 transition-all group-focus-within:border-white/20 group-focus-within:ring-1 group-focus-within:ring-white/10">
                  <Textarea
                    placeholder={running ? "Ask a follow-up question..." : "Describe a task for this agent..."}
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleRun();
                      }
                    }}
                    rows={3}
                    className="bg-transparent border-none text-white placeholder:text-white/30 resize-none focus-visible:ring-0 text-sm shadow-none flex-1 min-h-[60px] max-h-[120px]"
                  />
                  <Button
                    onClick={handleRun}
                    disabled={!taskInput.trim() || running}
                    className={`h-10 w-10 p-0 rounded-xl transition-all flex-shrink-0 ${
                      taskInput.trim()
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-white/5 text-white/20'
                    }`}
                  >
                    {running ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Lightning size={16} />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-white/30 text-center mt-2">
                  Press Enter to send • Agent will use available tools to complete tasks
                </p>
              </div>
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

        <div className="bg-black/20 border border-[#333] rounded-2xl overflow-hidden">
          {executions.length === 0 ? (
            <div className="p-8 text-center text-white/20">No history available.</div>
          ) : (
            <div className="divide-y divide-[#333]/50">
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
                      <div className="flex flex-col items-center">
                        <StatusIcon status={exec.status} />
                        <div className="w-px h-6 bg-[#333]/50 mt-1" />
                      </div>
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

// Timeline Step Components
function TimelineStep({
  icon,
  title,
  subtitle,
  duration,
  status,
  timestamp,
  metadata,
  children,
  isExpanded = false,
  onToggleExpand
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  duration?: number;
  status?: 'running' | 'success' | 'failed';
  timestamp?: number;
  metadata?: any;
  children?: React.ReactNode;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}) {
  const [localExpanded, setLocalExpanded] = useState(isExpanded);

  const handleToggle = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setLocalExpanded(!localExpanded);
    }
  };

  const expanded = onToggleExpand ? isExpanded : localExpanded;

  return (
    <div className="flex gap-3 group">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          status === 'running' ? 'bg-blue-500/20 border border-blue-500/30' :
          status === 'success' ? 'bg-emerald-500/20 border border-emerald-500/30' :
          status === 'failed' ? 'bg-red-500/20 border border-red-500/30' :
          'bg-white/10 border border-white/10'
        }`}>
          {status === 'running' ? <Spinner size={16} className="text-blue-400 animate-spin" /> :
           status === 'success' ? <Check size={16} className="text-emerald-400" /> :
           status === 'failed' ? <X size={16} className="text-red-400" /> :
           icon}
        </div>
        <div className="w-px h-full bg-white/10 mt-2" />
      </div>

      <div className="flex-1 space-y-2 pb-6">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-white/90">{title}</div>
          <div className="flex items-center gap-2">
            {timestamp && (
              <div className="text-xs text-white/40 font-mono">
                {new Date(timestamp).toLocaleTimeString()}
              </div>
            )}
            {duration && (
              <div className="text-xs text-white/40 font-mono">
                {(duration / 1000).toFixed(1)}s
              </div>
            )}
            {(metadata || children) && (
              <button
                onClick={handleToggle}
                className="text-xs text-white/40 hover:text-white/60 transition-colors"
              >
                <CaretUpDown size={12} className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        </div>
        {subtitle && (
          <div className="text-xs text-white/60">{subtitle}</div>
        )}

        {expanded && (
          <div className="space-y-3 mt-3">
            {metadata && (
              <MetadataDisplay metadata={metadata} />
            )}
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

function MetadataDisplay({ metadata }: { metadata: any }) {
  const renderValue = (value: any, key?: string): React.ReactNode => {
    if (value === null || value === undefined) return <span className="text-white/30">null</span>;
    if (typeof value === 'string') return <span className="text-emerald-300">"{value}"</span>;
    if (typeof value === 'number') return <span className="text-blue-300">{value}</span>;
    if (typeof value === 'boolean') return <span className="text-purple-300">{value.toString()}</span>;
    if (Array.isArray(value)) {
      return (
        <div className="ml-4">
          <div className="text-white/60">[</div>
          {value.map((item, idx) => (
            <div key={idx} className="ml-2">
              {renderValue(item)}
              {idx < value.length - 1 && <span className="text-white/40">,</span>}
            </div>
          ))}
          <div className="text-white/60">]</div>
        </div>
      );
    }
    if (typeof value === 'object') {
      return (
        <div className="ml-4 border-l border-white/10 pl-2">
          <div className="text-white/60">{'{'}</div>
          {Object.entries(value).map(([k, v], idx) => (
            <div key={k} className="ml-2">
              <span className="text-cyan-300">"{k}"</span>
              <span className="text-white/40">:</span> {renderValue(v, k)}
              {idx < Object.entries(value).length - 1 && <span className="text-white/40">,</span>}
            </div>
          ))}
          <div className="text-white/60">{'}'}</div>
        </div>
      );
    }
    return <span className="text-white/70">{String(value)}</span>;
  };

  return (
    <div className="bg-black/30 rounded-lg border border-white/10 p-3 font-mono text-xs overflow-x-auto max-h-96 overflow-y-auto">
      <div className="text-white/60 mb-2">Metadata:</div>
      <div className="text-white/80">
        {renderValue(metadata)}
      </div>
    </div>
  );
}

function FunctionCallDisplay({ functionCall }: { functionCall: any }) {
  return (
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <Code size={14} className="text-blue-400" />
        <span className="text-sm font-medium text-blue-300">Function Call</span>
        <span className="text-xs text-white/40 font-mono">{functionCall.id}</span>
      </div>
      <div className="space-y-1 text-xs">
        <div>
          <span className="text-white/60">Name:</span>
          <span className="text-cyan-300 ml-2">{functionCall.name}</span>
        </div>
        {functionCall.args && (
          <div>
            <span className="text-white/60">Args:</span>
            <MetadataDisplay metadata={functionCall.args} />
          </div>
        )}
      </div>
    </div>
  );
}

function FunctionResponseDisplay({ functionResponse }: { functionResponse: any }) {
  return (
    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle size={14} className="text-emerald-400" />
        <span className="text-sm font-medium text-emerald-300">Function Response</span>
        <span className="text-xs text-white/40 font-mono">{functionResponse.id}</span>
      </div>
      <div className="text-xs">
        <span className="text-white/60">Name:</span>
        <span className="text-cyan-300 ml-2">{functionResponse.name}</span>
      </div>
      {functionResponse.response && (
        <div className="mt-2">
          <span className="text-white/60">Response:</span>
          <MetadataDisplay metadata={functionResponse.response} />
        </div>
      )}
    </div>
  );
}

function UsageMetadataDisplay({ usageMetadata }: { usageMetadata: any }) {
  return (
    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <Brain size={14} className="text-purple-400" />
        <span className="text-sm font-medium text-purple-300">Usage Statistics</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-white/60">Prompt Tokens:</span>
          <span className="text-blue-300 ml-2">{usageMetadata.promptTokenCount}</span>
        </div>
        <div>
          <span className="text-white/60">Candidates Tokens:</span>
          <span className="text-emerald-300 ml-2">{usageMetadata.candidatesTokenCount}</span>
        </div>
        <div>
          <span className="text-white/60">Total Tokens:</span>
          <span className="text-purple-300 ml-2">{usageMetadata.totalTokenCount}</span>
        </div>
        <div>
          <span className="text-white/60">Finish Reason:</span>
          <span className="text-yellow-300 ml-2">{usageMetadata.finishReason || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}

function CodeDiffView({ filename, additions, deletions, diff }: {
  filename: string;
  additions: number;
  deletions: number;
  diff: string;
}) {
  const lines = diff.split('\n');

  return (
    <div className="mt-3 rounded-lg border border-[#333] bg-black/40 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-[#333]">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-white/40" />
          <span className="text-xs font-mono text-white/80">{filename}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {additions > 0 && (
            <span className="text-emerald-400 font-mono">+{additions}</span>
          )}
          {deletions > 0 && (
            <span className="text-red-400 font-mono">-{deletions}</span>
          )}
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto">
        <pre className="text-xs font-mono leading-relaxed">
          {lines.map((line, idx) => {
            const isAddition = line.startsWith('+');
            const isDeletion = line.startsWith('-');

            return (
              <div
                key={idx}
                className={`px-3 py-0.5 ${
                  isAddition ? 'bg-emerald-500/10 text-emerald-300' :
                  isDeletion ? 'bg-red-500/10 text-red-300' :
                  'text-white/60'
                }`}
              >
                {line}
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}

function ProgressHeader({ completed, total, currentTask }: {
  completed: number;
  total: number;
  currentTask?: string;
}) {
  const progress = (completed / total) * 100;

  return (
    <div className="rounded-lg border border-[#333] bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-white/90">
          {completed} of {total} To-dos Completed
        </div>
        <div className="text-xs text-white/60">
          {Math.round(progress)}%
        </div>
      </div>

      <div className="w-full bg-white/10 rounded-full h-2 mb-2">
        <div
          className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {currentTask && (
        <div className="text-xs text-white/70 flex items-center gap-2">
          <Spinner size={12} className="animate-spin" />
          {currentTask}
        </div>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'completed' || status === 'success') return <CheckCircle size={20} className="text-emerald-400" weight="fill" />;
  if (status === 'failed' || status === 'error') return <XCircle size={20} className="text-red-400" weight="fill" />;
  if (status === 'running') return <Lightning size={20} className="text-blue-400 animate-pulse" weight="fill" />;
  return <Clock size={20} className="text-white/20" weight="fill" />;
}
