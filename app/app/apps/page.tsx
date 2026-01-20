"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components-beta/Button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import Image from "next/image";
import Logo from "@/components-beta/Logo";

const ALL_PROVIDERS = [
  {
    name: "GitHub",
    provider: "github",
    icon: "/beta/github.svg",
    category: "Development",
    description: "Access repositories, manage issues, and track commits.",
  },
  // {
  //   name: "Slack",
  //   provider: "slack",
  //   icon: "/slack.svg",
  //   category: "Communication",
  //   description: "Send messages and monitor channels.",
  // },
  {
    name: "Google",
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
         <div className="bg-white shadow-lg/3 shadow-dark rounded-full p-3">
         <Logo size={36}/>  
        </div>
        </div>
    </div>
    );
  }

  return (
    <div className="p-7 overflow-y-auto h-full mx-auto space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_PROVIDERS.map((app) => {
          const integration = integrations.find((i) => i.provider === app.provider);
          const healthItem = health?.integrations?.find(
            (h: any) => h.provider === app.provider
          );

          const isConnected = integration?.status === "connected";
          const isExpired = isConnected && healthItem?.status === "expired";

          return (
            <Card
              key={app.provider}
              className="p-6 bg-dark/3 shadow-lg shadow-dark/1 rounded-4xl flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-2.5 bg-dark/3 rounded-2xl text-dark/60 group-hover:text-dark transition-colors">
                    <Image
                      src={app.icon}
                      alt={app.name}
                      height={48}
                      width={48}
                      className="size-9"
                    />
                  </div>

                  {isConnected ? (
                    <div
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-bold tracking-wider uppercase ${
                        healthItem?.status === "expired"
                          ? "bg-red-500/10 text-red-300 border-red-500/30"
                          : healthItem?.status === "warning"
                          ? "bg-yellow-500/10 text-yellow-300 border-yellow-500/30"
                          : "bg-base/10 text-base border-base"
                      }`}
                    >
                      {healthItem?.status === "expired"
                        ? "Expired"
                        : healthItem?.status === "warning"
                        ? "Warning"
                        : "Connected"}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 text-dark/30 border border-white/5 text-[10px] font-bold tracking-wider uppercase">
                      Not connected
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-dark">{app.name}</h3>
                <p className="text-sm text-dark/40 leading-relaxed">{app.description}</p>
                {isConnected && healthItem?.message && (
                  <p className="text-[11px] text-dark/25 mt-3">{healthItem.message}</p>
                )}
              </div>

              <div className="pt-6">
                {isConnected ? (
                  <Button
                    onClick={() => handleConnect(app.provider)}
                    className={`cursor-pointer rounded-full px-4 w-full py-2.5 text-sm ${
                      isExpired
                        ? "bg-base text-dark hover:bg-base/90"
                        : "bg-dark border border-dark/10 text-white hover:bg-dark/90"
                    }`}
                    loading={connectingProvider === app.provider}
                  >
                    {isExpired ? "Reconnect" : "Reconnect"}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleConnect(app.provider)}
                    className="cursor-pointer rounded-full px-4 w-full py-2.5 text-sm"
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
