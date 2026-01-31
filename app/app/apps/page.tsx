"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components-beta/Button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import Image from "next/image";
import Logo from "@/components-beta/Logo";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

const ALL_PROVIDERS = [
  {
    name: "GitHub",
    provider: "github",
    icon: "/beta/github.svg",
    category: "Development",
    description: "Access repositories, manage issues, commits.",
  },
  {
    name: "Slack",
    provider: "slack",
    icon: "/slack.svg",
    category: "Communication",
    description: "Send messages and monitor channels.",
  },
  {
    name: "Google Workspace",
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

type Integration = {
  provider: string;
  status?: string;
};

type IntegrationHealthItem = {
  provider: string;
  status?: string;
  message?: string;
};

type IntegrationHealthResponse = {
  integrations?: IntegrationHealthItem[];
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [health, setHealth] = useState<IntegrationHealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);

  async function loadData() {
    try {
      const [data, healthData] = await Promise.all([
        api.getIntegrations() as Promise<{ integrations?: Integration[] }>,
        api.getIntegrationHealth() as Promise<IntegrationHealthResponse>,
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
      const res = (await api.connectIntegration(provider)) as { authUrl?: string; url?: string };
      const authUrl = res.authUrl || res.url;
      if (!authUrl) {
        console.error("Missing authUrl from backend", res);
        return;
      }
      window.location.href = authUrl;
    } finally {
      setConnectingProvider(null);
    }
  };

  if (loading) {
    return (
      <div className="p-7 flex flex-col justify-center items-center h-[70%] w-full mx-auto space-y-8">
        <div className="page-loader animate-pulse" style={{ minHeight: 140 }}>
          <div className="bg-surface dark:bg-black/20 shadow-lg/3 shadow-dark rounded-full p-3">
            <Logo size={36} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-7 pt-20 relative overflow-y-auto h-full mx-auto space-y-12">
      <div className="bg-dark/15 dark:bg-white/7 w-2/3 mx-auto absolute -top-20 rounded-full blur-[100px] left-0 right-0 h-32"></div>
      <div className="flex text-center flex-col">
        <h3 className="text-[28px] font-semibold bg-clip-text bg-linear-to-b from-dark/50 to-dark dark:from-white dark:to-white/50 text-transparent">
          Connect your apps
        </h3>
        <p className="text-[15px] font-medium text-dark/50 dark:text-white/50">
          Connect the tools you want to use with Axle.
        </p>
        <div className="max-w-2xl p-2.5 mx-auto w-full mt-5 rounded-full bg-dark/5 group group:focus-ring-1 focus-ring-accent dark:bg-white/5 border border-dark/5 dark:border-white/5 flex items-center gap-2">
          <MagnifyingGlassIcon className="size-4 text-dark/50 dark:text-white/50" />
          <input type="text" placeholder="Search apps..." className="flex-1 text-sm bg-transparent outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl w-full gap-4">
  {ALL_PROVIDERS.map((app) => {
    const integration = integrations.find(
      (i) => i.provider === app.provider,
    );
    const healthItem = health?.integrations?.find(
      (h) => h.provider === app.provider,
    );

    const isConnected = integration?.status === "connected";
    const isExpired = isConnected && healthItem?.status === "expired";

    return (
      <Card
        key={app.provider}
        className="p-3 flex items-center justify-between gap-4 bg-dark/5 dark:bg-linear-to-b from-white/3 to-white/1 border border-dark/3 dark:border-white/3 shadow-lg shadow-dark/2 rounded-[20px]"
      >
        {/* Left: Icon + Text */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div className="relative flex-shrink-0 bg-white rounded-xl overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-10 bg-white/60 blur-md" />
            <div className="absolute inset-x-0 -bottom-4 h-8 bg-black/15 dark:bg-black blur-xl" />

            <div className="relative z-10 p-2.5">
              <Image
                src={app.icon}
                alt={app.name}
                width={48}
                height={48}
                className="size-5"
              />
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col min-w-0 pr-4">
            <h3 className="text-sm font-semibold text-dark dark:text-white truncate">
              {app.name}
            </h3>

            <p className="text-[11px] text-dark/40 dark:text-white/40 truncate">
              {app.description}
            </p>

            {isConnected && healthItem?.message && (
              <p className="text-[11px] text-dark/25 mt-1 truncate">
                {healthItem.message}
              </p>
            )}
          </div>
        </div>

        {/* Right: Button */}
        <div className="flex-shrink-0">
          <Button
            onClick={() => handleConnect(app.provider)}
            className={`rounded-full px-4 py-2 text-xs ${
              isConnected
                ? isExpired
                  ? "bg-base text-dark hover:bg-base/90"
                  : "bg-dark text-white hover:bg-dark/90"
                : ""
            }`}
            loading={connectingProvider === app.provider}
          >
            {isConnected ? "Reconnect" : "Connect"}
          </Button>
        </div>
      </Card>
    );
  })}
</div>
    </div>
  );
}
