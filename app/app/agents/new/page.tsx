'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CaretLeft, Sparkle, Lock, Plus, Trash, Crown } from '@phosphor-icons/react';
import { Button } from '@/components-beta/Button';
import { Input, Textarea } from '@/components/ui/input';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Dropdown } from '@/components/ui/dropdown';
import Link from 'next/link';
import { Suspense } from 'react';
import { getScheduleLimit, getScheduleLimitLabel, canUseWebhooks, getAgentLimitLabel, getNextTierName } from '@/lib/planLimits';

interface ScheduleConfig {
    id: string;
    frequency: 'hourly' | 'daily' | 'weekly';
    dayOfWeek: number;
    hour: number;
    amPm: 'AM' | 'PM';
    taskInstructions: string;
}

const defaultSchedule = (): ScheduleConfig => ({
    id: crypto.randomUUID(),
    frequency: 'daily',
    dayOfWeek: 1,
    hour: 9,
    amPm: 'AM',
    taskInstructions: '',
});

function CreateAgentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const templateId = searchParams.get('template');

    const [step, setStep] = useState<1 | 2>(1);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        instructions: ''
    });

    // ── Plan-gated state ──
    const [userPlan, setUserPlan] = useState<string>('free');
    const [planLoading, setPlanLoading] = useState(true);

    // ── Schedules (array of configs) ──
    const [scheduleEnabled, setScheduleEnabled] = useState(false);
    const [schedules, setSchedules] = useState<ScheduleConfig[]>([defaultSchedule()]);

    // ── Webhook ──
    const [webhookEnabled, setWebhookEnabled] = useState(false);
    const [webhookEvents, setWebhookEvents] = useState<any[]>([]);
    const [selectedWebhookEventId, setSelectedWebhookEventId] = useState<string>('github.push');
    const [webhookTaskInstructions, setWebhookTaskInstructions] = useState('');

    const [loading, setLoading] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [showWebhookUpgradeModal, setShowWebhookUpgradeModal] = useState(false);

    // ── Derived plan limits ──
    const scheduleLimit = useMemo(() => getScheduleLimit(userPlan), [userPlan]);
    const scheduleLimitLabel = useMemo(() => getScheduleLimitLabel(userPlan), [userPlan]);
    const webhooksAllowed = useMemo(() => canUseWebhooks(userPlan), [userPlan]);

    // Fetch user plan
    useEffect(() => {
        const loadPlan = async () => {
            try {
                const subData = await api.getSubscription();
                const sub = subData?.subscription || subData;
                const plan = sub?.plan || sub?.planName || 'free';
                setUserPlan(plan);
            } catch (e) {
                console.error('Failed to load subscription:', e);
                setUserPlan('free');
            } finally {
                setPlanLoading(false);
            }
        };
        loadPlan();
    }, []);

    useEffect(() => {
        const loadTemplate = async () => {
            try {
                const paramName = searchParams.get('name');
                const paramDesc = searchParams.get('description');
                const paramInstr = searchParams.get('instructions');

                if (paramName || paramDesc || paramInstr) {
                    setFormData({
                        name: paramName || '',
                        description: paramDesc || '',
                        instructions: paramInstr || ''
                    });
                    return;
                }

                if (!templateId) return;
                const data = await api.getTemplates();
                const templates = data.templates || [];
                const match = templates.find((t: any) => encodeURIComponent(t.name) === templateId);
                if (!match) return;

                const instructions = Array.isArray(match.actions)
                    ? `Use this action sequence as your playbook:\n\n${match.actions
                        .map((a: any, idx: number) => `${idx + 1}. ${a.type}`)
                        .join('\n')}`
                    : '';

                setFormData({
                    name: match.name || '',
                    description: match.description || '',
                    instructions
                });
            } catch (e) {
                console.error(e);
            }
        };
        loadTemplate();
    }, [templateId, searchParams]);

    useEffect(() => {
        const loadProviders = async () => {
            try {
                const res = await api.getWebhookEvents();
                const events = res.events || [];
                setWebhookEvents(events);
                if (events.length > 0) setSelectedWebhookEventId(events[0].id);
            } catch (e) {
                console.error(e);
            }
        };
        loadProviders();
    }, []);

    const to24Hour = (hour: number, ampm: 'AM' | 'PM') => {
        const h = Math.max(1, Math.min(12, hour));
        if (ampm === 'AM') return h === 12 ? 0 : h;
        return h === 12 ? 12 : h + 12;
    };

    const buildCron = (s: ScheduleConfig) => {
        if (s.frequency === 'hourly') return '0 * * * *';
        const hour24 = to24Hour(s.hour, s.amPm);
        if (s.frequency === 'daily') return `0 ${hour24} * * *`;
        return `0 ${hour24} * * ${s.dayOfWeek}`;
    };

    const dayLabels: { value: number; label: string }[] = [
        { value: 0, label: 'Sun' },
        { value: 1, label: 'Mon' },
        { value: 2, label: 'Tue' },
        { value: 3, label: 'Wed' },
        { value: 4, label: 'Thu' },
        { value: 5, label: 'Fri' },
        { value: 6, label: 'Sat' },
    ];

    const addSchedule = () => {
        if (schedules.length >= scheduleLimit) return;
        setSchedules(prev => [...prev, defaultSchedule()]);
    };

    const removeSchedule = (id: string) => {
        setSchedules(prev => prev.filter(s => s.id !== id));
    };

    const updateSchedule = (id: string, patch: Partial<ScheduleConfig>) => {
        setSchedules(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.instructions) return;

        setLoading(true);
        try {
            const { agent } = await api.createAgent({
                name: formData.name,
                description: formData.description,
                instructions: formData.instructions
            });

            const triggerCreates: Promise<any>[] = [];

            if (scheduleEnabled) {
                for (const s of schedules) {
                    const cron = buildCron(s);
                    if (cron) {
                        triggerCreates.push(
                            api.createTrigger({
                                agentId: agent._id,
                                type: 'schedule',
                                cronExpression: cron,
                                taskInstructions: s.taskInstructions || undefined,
                                enabled: true
                            })
                        );
                    }
                }
            }

            if (webhookEnabled && webhooksAllowed) {
                const selected = webhookEvents.find((e: any) => e.id === selectedWebhookEventId);
                const source = selected?.source || selected?.id;
                triggerCreates.push(
                    api.createTrigger({
                        agentId: agent._id,
                        type: 'webhook',
                        config: { source },
                        taskInstructions: webhookTaskInstructions || undefined,
                        enabled: true
                    })
                );
            }

            if (triggerCreates.length > 0) {
                await Promise.allSettled(triggerCreates);
            }

            router.push(`/app/agents/${agent._id}`);
        } catch (error: any) {
            console.error(error);
            setLoading(false);
            if (error.message && error.message.includes('Agent limit reached')) {
                setShowLimitModal(true);
            }
        }
    };

    const handleWebhookToggle = () => {
        if (!webhooksAllowed) {
            setShowWebhookUpgradeModal(true);
            return;
        }
        setWebhookEnabled(!webhookEnabled);
    };

    return (
        <div className="max-w-4xl pt-20 px-5 overflow-auto h-full w-full mx-auto">
            <div className="mb-6">
                <Link href="/app/agents" className="text-sm text-dark/40 dark:text-white/40 dark:hover:text-white hover:text-dark mb-4 flex items-center gap-1 transition-colors">
                    <CaretLeft /> Back to Agents
                </Link>
                <h1 className="md:text-3xl text-2xl font-semibold text-dark dark:text-white tracking-tight">Create New Agent</h1>
                <p className="text-dark/40 dark:text-white/40 mt-1">Describe the role and responsibilities. The Agent handles the rest.</p>
            </div>

            {step === 1 && (
                <Card className="py-3 bg-dark/0 dark:bg-white/0 border border-dark/0 dark:border-white/0 rounded-4xl space-y-6">
                    <Input
                        label="Agent Name"
                        placeholder="e.g. Research Assistant"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-dark/3 dark:bg-white/1 text-sm rounded-full py-3 border-dark/5 dark:border-white/2"
                    />

                    <Input
                        label="Short Description"
                        placeholder="What does this agent do?"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="bg-dark/3 dark:bg-white/1 text-sm rounded-full py-3 border-dark/5 dark:border-white/2"
                    />

                    <Textarea
                        label="Instructions"
                        placeholder="You are a helpful assistant. Your goal is to..."
                        helperText="Use natural language. No code or configuration needed."
                        rows={8}
                        value={formData.instructions}
                        onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                        className="bg-dark/3 dark:bg-white/1 rounded-3xl outline-white/5 p-5 border-dark/5 dark:border-white/2 text-sm"
                    />

                    <div className="flex justify-end gap-2">
                        <Button
                            onClick={() => setStep(2)}
                            disabled={!formData.name || !formData.instructions}
                            className="py-3"
                        >
                            Continue
                        </Button>
                    </div>
                </Card>
            )}

            {step === 2 && (
                <>
                    {/* ═══════════ SCHEDULE TRIGGER ═══════════ */}
                    <Card className="py-6 px-6 bg-dark/0 dark:bg-white/0 border border-dark/0 dark:border-white/0 rounded-4xl space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-dark dark:text-white font-semibold text-lg">Run on Schedule</h3>
                                <p className="text-dark/40 dark:text-white/40 text-sm">Automatically run this agent at specific times.</p>
                            </div>
                            <button
                                onClick={() => setScheduleEnabled(!scheduleEnabled)}
                                className={`w-14 h-8 rounded-full transition-colors relative ${scheduleEnabled ? 'bg-accent' : 'bg-dark/10 dark:bg-white/10'}`}
                            >
                                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${scheduleEnabled ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        {scheduleEnabled && (
                            <div className="space-y-4">
                                {/* Plan limit badge */}
                                <div className="flex items-center gap-2">
                                    <div className="bg-accent/10 text-accent text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                        <Crown weight="fill" size={14} />
                                        {scheduleLimitLabel}
                                    </div>
                                </div>

                                {schedules.map((s, idx) => (
                                    <div key={s.id} className="bg-dark/3 dark:bg-white/5 p-5 rounded-3xl space-y-4 relative">
                                        {/* Remove button (only if more than 1) */}
                                        {schedules.length > 1 && (
                                            <button
                                                onClick={() => removeSchedule(s.id)}
                                                className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-500/10 text-dark/30 dark:text-white/30 hover:text-red-500 transition-all"
                                                title="Remove schedule"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        )}

                                        {schedules.length > 1 && (
                                            <div className="text-dark/40 dark:text-white/40 text-xs font-semibold uppercase">
                                                Schedule {idx + 1}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className={s.frequency === 'weekly' ? 'col-span-1' : 'col-span-2'}>
                                                <label className="text-dark/60 dark:text-white/60 text-xs font-semibold uppercase mb-1.5 block">Frequency</label>
                                                <div className="flex bg-dark/5 dark:bg-white/5 p-1 rounded-xl">
                                                    <button
                                                        onClick={() => updateSchedule(s.id, { frequency: 'hourly' })}
                                                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${s.frequency === 'hourly' ? 'bg-white dark:bg-white/10 text-dark dark:text-white shadow-sm' : 'text-dark/40 dark:text-white/40'}`}
                                                    >
                                                        Hourly
                                                    </button>
                                                    <button
                                                        onClick={() => updateSchedule(s.id, { frequency: 'daily' })}
                                                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${s.frequency === 'daily' ? 'bg-white dark:bg-white/10 text-dark dark:text-white shadow-sm' : 'text-dark/40 dark:text-white/40'}`}
                                                    >
                                                        Daily
                                                    </button>
                                                    <button
                                                        onClick={() => updateSchedule(s.id, { frequency: 'weekly' })}
                                                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${s.frequency === 'weekly' ? 'bg-white dark:bg-white/10 text-dark dark:text-white shadow-sm' : 'text-dark/40 dark:text-white/40'}`}
                                                    >
                                                        Weekly
                                                    </button>
                                                </div>
                                            </div>

                                            {s.frequency === 'weekly' && (
                                                <div>
                                                    <Dropdown
                                                        label="Day"
                                                        value={s.dayOfWeek.toString()}
                                                        onChange={(val) => updateSchedule(s.id, { dayOfWeek: Number(val) })}
                                                        options={dayLabels.map(day => ({
                                                            id: day.value.toString(),
                                                            label: day.label,
                                                            value: day.value.toString()
                                                        }))}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {s.frequency !== 'hourly' && (
                                            <div>
                                                <label className="text-dark/60 dark:text-white/60 text-xs font-semibold uppercase mb-1.5 block">Time</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="12"
                                                        value={s.hour}
                                                        onChange={(e) => updateSchedule(s.id, { hour: Number(e.target.value) })}
                                                        className="w-full bg-dark/5 dark:bg-white/5 text-dark dark:text-white text-sm rounded-xl px-3 py-2.5 outline-none text-center font-medium"
                                                    />
                                                    <div className="flex bg-dark/5 dark:bg-white/5 p-1 rounded-xl w-32">
                                                        <button
                                                            onClick={() => updateSchedule(s.id, { amPm: 'AM' })}
                                                            className={`flex-1 text-xs font-bold rounded-lg transition-all ${s.amPm === 'AM' ? 'bg-white dark:bg-white/10 text-dark dark:text-white shadow-sm' : 'text-dark/40 dark:text-white/40'}`}
                                                        >
                                                            AM
                                                        </button>
                                                        <button
                                                            onClick={() => updateSchedule(s.id, { amPm: 'PM' })}
                                                            className={`flex-1 text-xs font-bold rounded-lg transition-all ${s.amPm === 'PM' ? 'bg-white dark:bg-white/10 text-dark dark:text-white shadow-sm' : 'text-dark/40 dark:text-white/40'}`}
                                                        >
                                                            PM
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Task instructions for this schedule */}
                                        <div>
                                            <label className="text-dark/60 dark:text-white/60 text-xs font-semibold uppercase mb-1.5 block">Task Instructions</label>
                                            <p className="text-dark/30 dark:text-white/25 text-[11px] mb-2">What should this agent do when this schedule runs?</p>
                                            <textarea
                                                placeholder="e.g. Write a blog post about the latest AI news from this week"
                                                rows={3}
                                                value={s.taskInstructions}
                                                onChange={(e) => updateSchedule(s.id, { taskInstructions: e.target.value })}
                                                className="w-full bg-dark/5 dark:bg-white/5 text-dark dark:text-white text-sm rounded-2xl px-4 py-3 outline-none resize-none placeholder:text-dark/25 dark:placeholder:text-white/20"
                                            />
                                        </div>
                                    </div>
                                ))}

                                {/* Add another schedule button */}
                                {schedules.length < scheduleLimit ? (
                                    <button
                                        onClick={addSchedule}
                                        className="w-full border-2 border-dashed flex gap-2 items-center justify-center border-dark/10 dark:border-white/10 rounded-2xl p-3.5 text-dark/50 dark:text-white/40 font-semibold text-sm hover:border-accent hover:text-accent transition-all"
                                    >
                                        <Plus size={16} weight="bold" /> Add Another Schedule
                                    </button>
                                ) : scheduleLimit !== Infinity && schedules.length >= scheduleLimit ? (
                                    <div className="flex items-center gap-2 bg-dark/3 dark:bg-white/5 rounded-2xl p-3.5">
                                        <Crown weight="fill" size={16} className="text-amber-500" />
                                        <p className="text-dark/50 dark:text-white/40 text-sm font-medium">
                                            Maximum {scheduleLimit} schedule{scheduleLimit > 1 ? 's' : ''} on your plan.{' '}
                                            <Link href="/app/billing" className="text-accent hover:underline font-semibold">Upgrade →</Link>
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </Card>

                    {/* ═══════════ WEBHOOK TRIGGER ═══════════ */}
                    <Card className="py-6 px-6 mt-4 bg-dark/0 dark:bg-white/0 border border-dark/0 dark:border-white/0 rounded-4xl space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div>
                                    <h3 className="text-dark dark:text-white font-semibold text-lg flex items-center gap-2">
                                        Run on Webhook
                                        {!webhooksAllowed && (
                                            <span className="bg-dark/5 dark:bg-white/5 text-dark/40 dark:text-white/40 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                                <Lock size={10} weight="bold" /> PRO
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-dark/40 dark:text-white/40 text-sm">Trigger this agent from external events.</p>
                                </div>
                            </div>
                            <button
                                onClick={handleWebhookToggle}
                                className={`w-14 h-8 rounded-full transition-colors relative ${!webhooksAllowed
                                    ? 'bg-dark/5 dark:bg-white/5 cursor-not-allowed'
                                    : webhookEnabled
                                        ? 'bg-accent'
                                        : 'bg-dark/10 dark:bg-white/10'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded-full absolute top-1 transition-all ${!webhooksAllowed
                                    ? 'bg-dark/20 dark:bg-white/20 left-1'
                                    : webhookEnabled
                                        ? 'bg-white left-7'
                                        : 'bg-white left-1'
                                    }`} />
                            </button>
                        </div>

                        {/* Upgrade prompt for free users */}
                        {!webhooksAllowed && (
                            <div className="bg-gradient-to-r from-accent/5 to-accent/10 dark:from-accent/10 dark:to-accent/5 border border-accent/20 rounded-2xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-accent/10 p-2 rounded-xl">
                                        <Lock size={18} className="text-accent" weight="fill" />
                                    </div>
                                    <div>
                                        <p className="text-dark dark:text-white text-sm font-semibold">Webhooks are a Pro feature</p>
                                        <p className="text-dark/50 dark:text-white/50 text-xs">Upgrade to Pro to trigger agents from external events like GitHub pushes, X posts, and more.</p>
                                    </div>
                                </div>
                                <Link href="/app/billing">
                                    <Button className="bg-accent text-white text-sm py-2 px-5 whitespace-nowrap">
                                        Upgrade
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {webhookEnabled && webhooksAllowed && (
                            <div className="bg-dark/3 dark:bg-white/5 p-5 rounded-3xl space-y-4">
                                <div>
                                    <Dropdown
                                        label="Event Source"
                                        value={selectedWebhookEventId}
                                        onChange={(val) => setSelectedWebhookEventId(val)}
                                        options={webhookEvents.map(event => ({
                                            id: event.id,
                                            label: `${event.label} (${event.source})`,
                                            value: event.id,
                                            icon: event.icon
                                        }))}
                                    />
                                </div>

                                {/* Task instructions for webhook */}
                                <div>
                                    <label className="text-dark/60 dark:text-white/60 text-xs font-semibold uppercase mb-1.5 block">Task Instructions</label>
                                    <p className="text-dark/30 dark:text-white/25 text-[11px] mb-2">What should this agent do when this webhook fires?</p>
                                    <textarea
                                        placeholder="e.g. Summarize the incoming data and send a Slack notification"
                                        rows={3}
                                        value={webhookTaskInstructions}
                                        onChange={(e) => setWebhookTaskInstructions(e.target.value)}
                                        className="w-full bg-dark/5 dark:bg-white/5 text-dark dark:text-white text-sm rounded-2xl px-4 py-3 outline-none resize-none placeholder:text-dark/25 dark:placeholder:text-white/20"
                                    />
                                </div>
                            </div>
                        )}
                    </Card>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            onClick={() => setStep(1)}
                            className="py-3 bg-transparent text-dark dark:text-white hover:bg-dark/5 dark:hover:bg-white/10"
                        >
                            Back
                        </Button>
                        <Button
                            onClick={() => handleSubmit()}
                            loading={loading}
                            className="py-3"
                        >
                            Create Agent
                        </Button>
                    </div>
                </>
            )}


            <Modal
                open={showLimitModal}
                onClose={() => setShowLimitModal(false)}
                size="md"
                className="bg-surface/70 dark:bg-white/5 border-2 border-border dark:border-white/5 shadow-lg shadow-dark/4 rounded-4xl"
            >
                <Modal.Header onClose={() => setShowLimitModal(false)}>
                    Plan Limit Reached
                </Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col gap-3">
                        <p className="text-dark dark:text-white">
                            You have reached the limit of {getAgentLimitLabel(userPlan)}.
                        </p>
                        <p className="text-sm text-dark/60 dark:text-white/60">
                            Upgrade to {getNextTierName(userPlan)} to create more agents, access faster models, and more.
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="bg-dark/5 py-2.5 dark:bg-white/10 text-dark dark:text-white hover:bg-dark/10 dark:hover:bg-white/20"
                        onClick={() => setShowLimitModal(false)}
                    >
                        Cancel
                    </Button>
                    <Link href="/app/billing">
                        <Button className="bg-accent py-2.5 text-white hover:bg-accent/90">
                            Upgrade Plan
                        </Button>
                    </Link>
                </Modal.Footer>
            </Modal>

            {/* Webhook upgrade modal */}
            <Modal
                open={showWebhookUpgradeModal}
                onClose={() => setShowWebhookUpgradeModal(false)}
                size="md"
                className="bg-surface/70 dark:bg-white/5 border-2 border-border dark:border-white/5 shadow-lg shadow-dark/4 rounded-4xl"
            >
                <Modal.Header onClose={() => setShowWebhookUpgradeModal(false)}>
                    Upgrade to Use Webhooks
                </Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col gap-3">
                        <p className="text-dark dark:text-white">
                            Webhook triggers are available on Pro, Premium, and Custom plans.
                        </p>
                        <p className="text-sm text-dark/60 dark:text-white/60">
                            Upgrade your plan to trigger agents from external events like GitHub pushes, Stripe payments, and more.
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="bg-dark/5 py-2.5 dark:bg-white/10 text-dark dark:text-white hover:bg-dark/10 dark:hover:bg-white/20"
                        onClick={() => setShowWebhookUpgradeModal(false)}
                    >
                        Cancel
                    </Button>
                    <Link href="/app/billing">
                        <Button className="bg-accent py-2.5 text-white hover:bg-accent/90">
                            Upgrade Plan
                        </Button>
                    </Link>
                </Modal.Footer>
            </Modal>
        </div >
    );
}

export default function CreateAgentPage() {
    return (
        <Suspense fallback={(
            <div className="page-loader">
                <div className="loader-light" />
                <div className="page-loader-text">Loading…</div>
            </div>
        )}>
            <CreateAgentContent />
        </Suspense>
    );
}
