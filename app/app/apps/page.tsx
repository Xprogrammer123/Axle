"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  GoogleLogo,
  GithubLogo,
  SlackLogo,
  InstagramLogo,
  XLogo,
  ArrowClockwise,
  Plug,
} from "@phosphor-icons/react";
import { oauthAPI } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

type ProviderId = "google" | "github" | "slack" | "instagram" | "x";

type Integration = {
  _id: string;
  provider: ProviderId;
  status?: "connected" | "warning";
  message?: string;
};

const PROVIDER_META: Record<
  ProviderId,
  {
    label: string;
    Icon: React.ElementType;
    color: string;
  }
> = {
  google: { label: "Google", Icon: GoogleLogo, color: "text-blue-400" },
  github: { label: "GitHub", Icon: GithubLogo, color: "text-gray-400" },
  slack: { label: "Slack", Icon: SlackLogo, color: "text-purple-400" },
  instagram: {
    label: "Instagram",
    Icon: InstagramLogo,
    color: "text-pink-400",
  },
  x: { label: "X (Twitter)", Icon: XLogo, color: "text-white" },
};

const AppsPage = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState<ProviderId | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const data = await oauthAPI.listIntegrations();
      // Backend is expected to return { integrations: [...] }
      setIntegrations(data.integrations || []);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load integrations";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIntegrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = async (provider: ProviderId) => {
    try {
      setAuthLoading(provider);
      const data = await oauthAPI.getAuthUrl(provider);
      const url = data.url || data.authUrl || data.redirectUrl;
      if (!url) {
        showToast("No auth URL returned from server", "error");
        return;
      }
      window.location.href = url;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to start connection";
      showToast(message, "error");
    } finally {
      setAuthLoading(null);
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    if (
      !confirm(
        "Are you sure you want to disconnect this integration? Existing agents using it may stop working."
      )
    ) {
      return;
    }

    try {
      setDisconnectingId(integrationId);
      await oauthAPI.disconnect(integrationId);
      showToast("Integration disconnected", "success");
      loadIntegrations();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to disconnect";
      showToast(message, "error");
    } finally {
      setDisconnectingId(null);
    }
  };

  const isProviderConnected = (provider: ProviderId) =>
    integrations.some((i) => i.provider === provider);

  const getIntegrationForProvider = (provider: ProviderId) =>
    integrations.find((i) => i.provider === provider);

  return (
    <div className="bg-black p-10 grid grid-cols-1 md:grid-cols-3 gap-7">
      {loading ? (
        <div className="col-span-full flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <div className="loader-light" />
          </motion.div>
        </div>
      ) : (
        (Object.keys(PROVIDER_META) as ProviderId[]).map((provider) => {
          const { label, Icon, color } = PROVIDER_META[provider];
          const integration = getIntegrationForProvider(provider);
          const connected = Boolean(integration);
          const status =
            integration?.status || (connected ? "connected" : "disconnected");

          const statusText =
            status === "connected"
              ? "Connected"
              : status === "warning"
              ? integration?.message || "Connection requires attention"
              : "Not Connected";

          const statusColor =
            status === "connected"
              ? "text-[#00c776]"
              : status === "warning"
              ? "text-yellow-500"
              : "text-red-500";

          const primaryLabel = connected ? "Disconnect" : "Connect";

          return (
            <div
              key={provider}
              className="bg-white/4 rounded-4xl p-8 flex flex-col justify-between h-full border border-white/10"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Icon size={28} className={color} />
                  <h3 className="text-white text-2xl font-semibold">{label}</h3>
                </div>
                <div className="min-h-[56px] flex items-center mb-6 bg-white/5 px-4 rounded-2xl">
                  <p className={`${statusColor} text-sm font-medium`}>
                    {statusText}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto gap-4">
                <button
                  className="flex-1 bg-base hover:bg-base/90 text-white font-semibold py-3 rounded-full text-center transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() =>
                    connected && integration
                      ? handleDisconnect(integration._id)
                      : handleConnect(provider)
                  }
                  disabled={
                    authLoading === provider ||
                    disconnectingId === integration?._id
                  }
                >
                  {connected ? (
                    disconnectingId === integration?._id ? (
                      <>
                        <ArrowClockwise
                          size={18}
                          className="animate-spin text-white"
                        />
                        Disconnecting...
                      </>
                    ) : (
                      <>
                        <PlugDisconnect size={18} />
                        {primaryLabel}
                      </>
                    )
                  ) : authLoading === provider ? (
                    <>
                      <ArrowClockwise
                        size={18}
                        className="animate-spin text-white"
                      />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      <Plug size={18} />
                      {primaryLabel}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AppsPage;
