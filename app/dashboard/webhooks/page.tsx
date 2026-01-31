'use client';

import { useEffect, useState } from 'react';
import { Webhook, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge, Skeleton, EmptyState } from '@/components/ui/utils';
import { useToast } from '@/components/ui/toast';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000';

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [providers, setProviders] = useState<{ provider: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      const [data, p] = await Promise.all([
        api.getWebhooks(),
        api.getWebhookProviders()
      ]);
      setWebhooks(data.webhooks || []);
      setProviders(p.providers || []);
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyWebhookUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('success', 'Webhook URL copied!');
  };

  const resolveWebhookUrl = (webhook: any) => {
    if (webhook?.url) return webhook.url;
    if (webhook?.relativeUrl) return `${API_BASE.replace(/\/$/, '')}${webhook.relativeUrl}`;
    if (webhook?.webhookPath) return `${API_BASE.replace(/\/$/, '')}/api/v1/webhooks/${webhook.webhookPath}`;
    return '';
  };

  const normalizeProvider = (source?: string) => {
    if (!source) return 'unknown';
    const s = String(source).toLowerCase();
    return s.includes('.') ? s.split('.')[0] : s;
  };

  const providerLabel = (provider: string) => {
    const match = providers.find((p) => p.provider === provider);
    return match?.label || provider;
  };

  const grouped = webhooks.reduce((acc: Record<string, any[]>, w: any) => {
    const p = normalizeProvider(w.source);
    acc[p] = acc[p] || [];
    acc[p].push(w);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Unbounded, sans-serif' }}>
          Webhooks
        </h1>
        <p className="text-[#8b8b8b]">
          Trigger agents via HTTP webhooks
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4">
          <div className="page-loader" style={{ minHeight: 140 }}>
            <div className="loader-light" />
            <div className="page-loader-text">Loading webhooks…</div>
          </div>
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
            </Card>
          ))}
        </div>
      ) : webhooks.length === 0 ? (
        <EmptyState
          icon={<Webhook size={48} />}
          title="No webhooks yet"
          description="Webhooks are created automatically when you set up webhook triggers for your agents"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="space-y-8"
        >
          {(providers.length ? providers : [
            { provider: 'github', label: 'GitHub' },
            { provider: 'google', label: 'Google' },
            { provider: 'slack', label: 'Slack' },
            { provider: 'twitter', label: 'X (Twitter)' },
            { provider: 'instagram', label: 'Instagram' },
          ]).map((p) => {
            const items = grouped[p.provider] || [];
            return (
              <section key={p.provider}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-semibold">{p.label}</h2>
                    <p className="text-sm text-[#8b8b8b]">{items.length} webhook(s)</p>
                  </div>
                </div>

                {items.length === 0 ? (
                  <Card className="p-6 bg-black/20 border border-black/40">
                    <div className="text-sm text-white/20">
                      No {p.label} webhooks yet.
                    </div>
                  </Card>
                ) : (
                  <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } }}
                    className="grid gap-4"
                  >
                    {items.map((webhook: any) => (
                      <motion.div
                        key={webhook._id}
                        variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                      >
                        <Card hover className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Webhook className="text-[#3ecf8e]" size={20} />
                                <h3 className="text-lg font-semibold">
                                  {webhook.agentId?.name || 'Unknown Agent'}
                                </h3>
                                <Badge variant={webhook.enabled ? 'active' : 'paused'}>
                                  {webhook.enabled ? 'Active' : 'Inactive'}
                                </Badge>
                                {webhook.source && (
                                  <span className="text-xs text-white/30">
                                    {String(webhook.source)}
                                  </span>
                                )}
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-[#8b8b8b]">URL:</span>
                                  <code className="text-xs bg-[#1a1a1a] px-2 py-1 rounded border border-[#2a2a2a] flex-1">
                                    {resolveWebhookUrl(webhook)}
                                  </code>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyWebhookUrl(resolveWebhookUrl(webhook))}
                                  >
                                    <Copy size={16} />
                                  </Button>
                                </div>

                                {webhook.lastCalledAt && (
                                  <p className="text-sm text-[#8b8b8b]">
                                    Last called: {new Date(webhook.lastCalledAt).toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <details className="mt-4">
                            <summary className="text-sm text-[#3ecf8e] cursor-pointer hover:text-[#33b376]">
                              Show example payload
                            </summary>
                            <pre className="mt-2 text-xs bg-[#1a1a1a] p-4 rounded border border-[#2a2a2a] overflow-x-auto">
                              {`POST ${resolveWebhookUrl(webhook)}
Content-Type: application/json

{
  "data": {
    "key": "value"
  }
}`}
                            </pre>
                          </details>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </section>
            );
          })}

          {Object.keys(grouped)
            .filter((k) => k !== 'unknown' && !providers.some((p) => p.provider === k))
            .map((k) => (
              <section key={k}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-semibold">{providerLabel(k)}</h2>
                    <p className="text-sm text-[#8b8b8b]">{(grouped[k] || []).length} webhook(s)</p>
                  </div>
                </div>
              </section>
            ))}
        </motion.div>
      )}

      {/* Info Card */}
      <Card variant="glass" className="p-6 mt-8">
        <div className="flex items-start gap-4">
          <CheckCircle className="text-[#3ecf8e] flex-shrink-0" size={24} />
          <div>
            <h3 className="font-semibold mb-2">How to use webhooks</h3>
            <ol className="text-sm text-[#8b8b8b] space-y-2 list-decimal list-inside">
              <li>Create a webhook trigger for an agent</li>
              <li>Copy the webhook URL from above</li>
              <li>Send POST requests to trigger the agent</li>
              <li>The payload will be available to the agent as input</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
}
