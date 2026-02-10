'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CaretLeft, Sparkle } from '@phosphor-icons/react';
import { Button } from '@/components-beta/Button';
import { Input, Textarea } from '@/components/ui/input';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Dropdown } from '@/components/ui/dropdown';
import Link from 'next/link';
import { Suspense } from 'react';

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

    const [scheduleEnabled, setScheduleEnabled] = useState(false);
    const [scheduleFrequency, setScheduleFrequency] = useState<'daily' | 'weekly'>('daily');
    const [scheduleDayOfWeek, setScheduleDayOfWeek] = useState<number>(1);
    const [scheduleHour, setScheduleHour] = useState<number>(9);
    const [scheduleAmPm, setScheduleAmPm] = useState<'AM' | 'PM'>('AM');

    const [webhookEnabled, setWebhookEnabled] = useState(false);
    const [webhookEvents, setWebhookEvents] = useState<any[]>([]);
    const [selectedWebhookEventId, setSelectedWebhookEventId] = useState<string>('github.push');

    const [loading, setLoading] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);

    useEffect(() => {
        const loadTemplate = async () => {
            try {
                // Check for direct query params first (from Templates page)
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

    const buildCron = () => {
        const hour24 = to24Hour(scheduleHour, scheduleAmPm);
        if (scheduleFrequency === 'daily') return `0 ${hour24} * * *`;
        return `0 ${hour24} * * ${scheduleDayOfWeek}`;
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
            const selectedCron = buildCron();
            if (scheduleEnabled && selectedCron) {
                triggerCreates.push(
                    api.createTrigger({
                        agentId: agent._id,
                        type: 'schedule',
                        cronExpression: selectedCron,
                        enabled: true
                    })
                );
            }

            if (webhookEnabled) {
                const selected = webhookEvents.find((e: any) => e.id === selectedWebhookEventId);
                const source = selected?.source || selected?.id;
                triggerCreates.push(
                    api.createTrigger({
                        agentId: agent._id,
                        type: 'webhook',
                        config: { source },
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
                            <div className="bg-dark/3 dark:bg-white/5 p-5 rounded-3xl space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-dark/60 dark:text-white/60 text-xs font-semibold uppercase mb-1.5 block">Frequency</label>
                                        <div className="flex bg-dark/5 dark:bg-white/5 p-1 rounded-xl">
                                            <button
                                                onClick={() => setScheduleFrequency('daily')}
                                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${scheduleFrequency === 'daily' ? 'bg-white dark:bg-white/10 text-dark dark:text-white shadow-sm' : 'text-dark/40 dark:text-white/40'}`}
                                            >
                                                Daily
                                            </button>
                                            <button
                                                onClick={() => setScheduleFrequency('weekly')}
                                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${scheduleFrequency === 'weekly' ? 'bg-white dark:bg-white/10 text-dark dark:text-white shadow-sm' : 'text-dark/40 dark:text-white/40'}`}
                                            >
                                                Weekly
                                            </button>
                                        </div>
                                    </div>

                                    {scheduleFrequency === 'weekly' && (
                                        <div>
                                            <Dropdown
                                                label="Day"
                                                value={scheduleDayOfWeek.toString()}
                                                onChange={(val) => setScheduleDayOfWeek(Number(val))}
                                                options={dayLabels.map(day => ({
                                                    id: day.value.toString(),
                                                    label: day.label,
                                                    value: day.value.toString()
                                                }))}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="text-dark/60 dark:text-white/60 text-xs font-semibold uppercase mb-1.5 block">Time</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            min="1"
                                            max="12"
                                            value={scheduleHour}
                                            onChange={(e) => setScheduleHour(Number(e.target.value))}
                                            className="w-full bg-dark/5 dark:bg-white/5 text-dark dark:text-white text-sm rounded-xl px-3 py-2.5 outline-none text-center font-medium"
                                        />
                                        <div className="flex bg-dark/5 dark:bg-white/5 p-1 rounded-xl w-32">
                                            <button
                                                onClick={() => setScheduleAmPm('AM')}
                                                className={`flex-1 text-xs font-bold rounded-lg transition-all ${scheduleAmPm === 'AM' ? 'bg-white dark:bg-white/10 text-dark dark:text-white shadow-sm' : 'text-dark/40 dark:text-white/40'}`}
                                            >
                                                AM
                                            </button>
                                            <button
                                                onClick={() => setScheduleAmPm('PM')}
                                                className={`flex-1 text-xs font-bold rounded-lg transition-all ${scheduleAmPm === 'PM' ? 'bg-white dark:bg-white/10 text-dark dark:text-white shadow-sm' : 'text-dark/40 dark:text-white/40'}`}
                                            >
                                                PM
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card className="py-6 px-6 bg-dark/0 dark:bg-white/0 border border-dark/0 dark:border-white/0 rounded-4xl space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-dark dark:text-white font-semibold text-lg">Run on Webhook</h3>
                                <p className="text-dark/40 dark:text-white/40 text-sm">Trigger this agent from external events.</p>
                            </div>
                            <button
                                onClick={() => setWebhookEnabled(!webhookEnabled)}
                                className={`w-14 h-8 rounded-full transition-colors relative ${webhookEnabled ? 'bg-accent' : 'bg-dark/10 dark:bg-white/10'}`}
                            >
                                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${webhookEnabled ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        {webhookEnabled && (
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
                            You have reached the limit of 2 agents on the Free plan.
                        </p>
                        <p className="text-sm text-dark/60 dark:text-white/60">
                            Upgrade to Pro to create unlimited agents, access faster models, and more.
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
