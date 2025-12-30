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
    name: "Instagram",
    provider: "instagram",
    icon: "/insta.svg",
    category: "Social",
    description: "Manage posts and engagement.",
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
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const data = await api.getIntegrations();
      setIntegrations(data.integrations || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleConnect = async (provider: string) => {
    const { url } = await api.connectIntegration(provider);
    window.location.href = url;
  };

  if (loading)
    return (
      <div className="p-8 text-white/20 animate-pulse">
        Scanning connected apps...
      </div>
    );

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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_PROVIDERS.map((app) => {
          const isConnected = integrations.some(
            (i) => i.provider === app.provider
          );
          const iData = integrations.find((i) => i.provider === app.provider);

          return (
            <Card
              key={app.name}
              className="p-6 bg-black/20 border border-black/40 rounded-4xl flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-2.5 bg-white/5 rounded-2xl text-white/60 group-hover:text-white transition-colors">
                    <Image src={app.icon} alt={app.name} height={48} width={48} className="size-9" />
                  </div>
                  {isConnected ? (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-base/10 text-base border border-base text-[10px] font-bold tracking-wider uppercase">
                      Connected
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
              </div>

              <div className="pt-6 flex items-center justify-between">
                {isConnected ? (
                  <button className="text-xs text-white/40 hover:text-white flex items-center gap-1 transition-colors">
                    Connected
                  </button>
                ) : (
                  <Button
                    onClick={() => handleConnect(app.provider)}
                    className="bg-base cursor-pointer text-black hover:bg-base/90 rounded-full px-4 w-full py-2.5 text-sm"
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
