"use client";

import { useEffect, useState, cloneElement } from "react";
import {
  PuzzlePiece,
  GithubLogo,
  SlackLogo,
  GoogleLogo,
  InstagramLogo,
  TwitterLogo,
  CheckCircle,
  Warning,
  Lightning,
  XCircle,
  CaretRight,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import Image from "next/image";

const ALL_PROVIDERS = [
  {
    name: "GitHub",
    provider: "github",
    icon: "/github.svg",
    category: "Development",
    description: "Access repositories, manage issues, and track commits.",
  },
  {
    name: "Slack",
    provider: "slack",
    icon: "/slack.svg",
    category: "Communication",
    description: "Send messages and monitor channels.",
  },
  {
    name: "Google Drive",
    provider: "google",
    icon: "/google.svg",
    category: "Productivity",
    description: "Create and read documents.",
  },
   {
    name: "X (Twitter)",
    provider: "twitter",
    icon: "/twitter.svg",
    category: "Social",
    description: "Post updates and track mentions.",
  },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [health, setHealth] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
  const [disconnectingProvider, setDisconnectingProvider] = useState<string | null>(null);
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
  const [disconnectingProvider, setDisconnectingProvider] = useState<string | null>(null);

  async function loadData() {
    try {
      const [data, healthData] = await Promise.all([
        api.getIntegrations(),
        api.getIntegrationHealth(),
      ]);
      setIntegrations(data.integrations || []);
      setHealth(healthData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleConnect = async (provider: string) => {
    try {
      setConnectingProvider(provider);
      const res: any = await api.connectIntegration(provider);
      const authUrl = res?.authUrl || res?.url;
      if (!authUrl) {
        console.error('Missing authUrl from backend', res);
        return;
      }
      window.location.href = authUrl;
    } finally {
      setConnectingProvider(null);
    }
  };

  const handleDisconnect = async (provider: string) => {
    const ok = window.confirm(`Disconnect ${provider}? You'll need to reconnect to use it again.`);
    if (!ok) return;

    try {
      setDisconnectingProvider(provider);
      await api.disconnectIntegration(provider);
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setDisconnectingProvider(null);
    }
    try {
      setConnectingProvider(provider);
      const res: any = await api.connectIntegration(provider);
      const authUrl = res?.authUrl || res?.url;
      if (!authUrl) {
        console.error('Missing authUrl from backend', res);
        return;
      }
      window.location.href = authUrl;
    } finally {
      setConnectingProvider(null);
    }
  };

  const handleDisconnect = async (provider: string) => {
    const ok = window.confirm(`Disconnect ${provider}? You'll need to reconnect to use it again.`);
    if (!ok) return;

    try {
      setDisconnectingProvider(provider);
      await api.disconnectIntegration(provider);
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setDisconnectingProvider(null);
    }
  };

  if (loading) {
    return (
      <div className="page-loader">
        <div className="loader-light" />
        <div className="page-loader-text">Scanning connected apps…</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl pb-28 mx-auto space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">
            Integrations
          </h1>
          <p className="text-white/40 mt-1">
            Connect the tools your agents will use to act.
          </p>
          {health?.summary && (
            <p className="text-white/20 text-xs mt-3">
              {health.summary.healthy} healthy • {health.summary.warnings} warnings • {health.summary.expired} expired
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {ALL_PROVIDERS.map((app) => {
    const integration = integrations.find(
      i => i.provider === app.provider
    );

    const healthItem = health?.integrations?.find((h: any) => h.provider === app.provider);

    const isConnected = integration?.status === "connected";
    const isExpired = isConnected && healthItem?.status === 'expired';
    const isExpired = isConnected && healthItem?.status === 'expired';

    return (
      <Card
        key={app.provider}
        className="p-6 bg-black/20 border border-black/40 rounded-4xl flex flex-col justify-between transition-all group"
      >
        <div>
          <div className="flex justify-between items-start mb-6">
            <div className="p-2.5 bg-white/5 rounded-2xl text-white/60 group-hover:text-white transition-colors">
              <Image
                src={app.icon}
                alt={app.name}
                height={48}
                width={48}
                className="size-9"
              />
            </div>

            {isConnected ? (
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-bold tracking-wider uppercase ${
                healthItem?.status === 'expired'
                  ? 'bg-red-500/10 text-red-300 border-red-500/30'
                  : healthItem?.status === 'warning'
                  ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
                  : 'bg-base/10 text-base border-base'
              }`}>
                {healthItem?.status === 'expired' ? 'Expired' : healthItem?.status === 'warning' ? 'Warning' : 'Connected'}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 text-white/30 border border-white/5 text-[10px] font-bold tracking-wider uppercase">
                Not connected
              </div>
            )}
          </div>

          <h3 className="text-xl font-semibold text-white">
            {app.name}
          </h3>
          <p className="text-sm text-white/40 leading-relaxed">
            {app.description}
          </p>
          {isConnected && healthItem?.message && (
            <p className="text-[11px] text-white/25 mt-3">
              {healthItem.message}
            </p>
          )}
        </div>

        <div className="pt-6 flex items-center justify-between">
          {isConnected ? (
            <div className="flex w-full items-center gap-2">
              <Button
                onClick={() => handleConnect(app.provider)}
                className={
                  isExpired
                    ? "cursor-pointer rounded-full px-4 w-full py-2.5 text-sm bg-base text-white hover:bg-base/90"
                    : "cursor-pointer rounded-full px-4 w-full py-2.5 text-sm bg-white/5 border border-white/10 text-white hover:bg-white/10"
                }
                loading={connectingProvider === app.provider}
              >
                {isExpired ? 'Reconnect' : 'Reconnect'}
              </Button>
              <Button
                onClick={() => handleDisconnect(app.provider)}
                variant="ghost"
                className="cursor-pointer rounded-full px-4 py-2.5 text-sm bg-red-500/10 text-red-200 hover:text-red-100 border border-red-500/20 hover:bg-red-500/15"
                loading={disconnectingProvider === app.provider}
              >
                Disconnect
              </Button>
            </div>
            <div className="flex w-full items-center gap-2">
              <Button
                onClick={() => handleConnect(app.provider)}
                className={
                  isExpired
                    ? "cursor-pointer rounded-full px-4 w-full py-2.5 text-sm bg-base text-white hover:bg-base/90"
                    : "cursor-pointer rounded-full px-4 w-full py-2.5 text-sm bg-white/5 border border-white/10 text-white hover:bg-white/10"
                }
                loading={connectingProvider === app.provider}
              >
                {isExpired ? 'Reconnect' : 'Reconnect'}
              </Button>
              <Button
                onClick={() => handleDisconnect(app.provider)}
                variant="ghost"
                className="cursor-pointer rounded-full px-4 py-2.5 text-sm bg-red-500/10 text-red-200 hover:text-red-100 border border-red-500/20 hover:bg-red-500/15"
                loading={disconnectingProvider === app.provider}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => handleConnect(app.provider)}
              className="cursor-pointer rounded-full px-4 w-full py-2.5 text-sm"
              loading={connectingProvider === app.provider}
              loading={connectingProvider === app.provider}
            >
              Connect
            </Button>
          )}
        </div>
      </Card>
    );
  })}
</div>

    </div>
  );
}
