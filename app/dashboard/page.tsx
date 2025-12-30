"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  SparkleIcon
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { api } from "@/lib/api";
import { safeFormatDistanceToNow } from "@/lib/utils";

export default function DashboardPage() {
  const [live, setLive] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const data = await api.getLiveDashboardData();
        setLive(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLive();
  }, []);

  const activeExecutions = live?.activeExecutions || [];
  const recentActivity = live?.recentActivity || [];
  const agents = live?.agents || [];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
        Welcome back.
      </h1>

      <div className="flex flex-col gap-4 w-full">
        {/* Top row: Recently Run + Live Tracker */}
        <div className="flex flex-col lg:flex-row gap-3 w-full">
          {/* Recently Run */}
          <div className="bg-black/20 h-80 flex flex-col gap-4 border border-black/40 overflow-hidden rounded-3xl p-4 flex-1">
            <div className="bg-white/5 border border-white/10 w-fit text-xs md:text-sm rounded-full px-4 md:px-5 py-2.5 text-white/60">
              Recently Run
            </div>
            <div className="bg-black/20 overflow-y-auto flex flex-col gap-2.5 border border-black/40 rounded-xl p-2.5">
              {loading ? (
                <div className="p-4 text-white/20 text-sm">Loading activity…</div>
              ) : recentActivity.length === 0 ? (
                <div className="p-4 text-white/20 text-sm">
                  No recent executions yet. Run an agent to see activity here.
                </div>
              ) : recentActivity.slice(0, 6).map((item: any) => (
                <div
                  key={item._id || item.timestamp}
                  className="bg-background rounded-xl flex justify-between items-center p-2.5"
                >
                  <div className="flex gap-3.5 items-start">
                    <div className="p-2.5 h-fit rounded-xl bg-white/5 border border-white/10 w-fit">
                      <SparkleIcon size={22} className="text-base" weight="fill" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h3 className="text-[15px] font-semibold line-clamp-1">
                        {item.description || item.actionType}
                      </h3>
                      <p className="text-[11px] text-white/50 line-clamp-2">
                        {item.timestampHuman || (item.timestamp && safeFormatDistanceToNow(item.timestamp, { addSuffix: true }))}
                      </p>
                    </div>
                  </div>
                  {item.params?.agentId && (
                    <Link href={`/dashboard/agents/${item.params.agentId}`}>
                      <Button
                        variant="primary"
                        size="sm"
                        className="font-medium rounded-full px-5 cursor-pointer py-2"
                      >
                        View
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Live Tracker */}
          <div className="bg-black/20 h-80 flex flex-col gap-4 border border-black/40 overflow-hidden rounded-3xl p-6 lg:w-[32%]">
            <h3 className="text-lg font-semibold flex items-center justify-between">
              Live Tracker
              <span className="text-xs text-white/40">
                {activeExecutions.length} running
              </span>
            </h3>
            <div className="h-full w-full flex flex-col gap-2 overflow-y-auto">
              {activeExecutions.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-white/20 text-sm text-center px-4">
                    There are no running agents right now. Kick off a run from the Agents page.
                  </p>
                </div>
              ) : activeExecutions.map((exec: any) => (
                <Link
                  key={exec._id}
                  href={`/dashboard/executions/${exec._id}`}
                  className="p-3 rounded-xl bg-background flex items-center justify-between border border-white/5 hover:border-white/20 transition-colors"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">
                      {exec.agentName || (exec.agentId as any)?.name || 'Agent'}
                    </span>
                    <span className="text-xs text-white/40">
                      Running for {exec.duration}s
                    </span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row: Agents snapshot + Integrations snapshot */}
        <div className="flex flex-col lg:flex-row gap-3 w-full mb-4">
          {/* Agents snapshot / empty box content */}
          <div className="bg-black/20 h-80 flex flex-col gap-4 border border-black/40 overflow-hidden rounded-3xl p-4 flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white/80">
                Agents overview
              </h3>
              <Link href="/dashboard/agents">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-white/50 hover:text-white bg-base rounded-full py-2 px-5 cursor-pointer"
                >
                  View all
                </Button>
              </Link>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-white/20 text-sm">Loading agents…</div>
              ) : agents.length === 0 ? (
                <div className="p-4 text-white/20 text-sm">
                  No agents yet. Create your first one from the Agents page.
                </div>
              ) : agents.slice(0, 5).map((agent: any) => (
                <Link
                  key={agent._id}
                  href={`/dashboard/agents/${agent._id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-background border border-white/3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 h-fit rounded-xl bg-white/5 border border-white/10 w-fit">
                    <SparkleIcon size={22} className="text-base" weight="fill" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{agent.name}</span>
                      <span className="text-[11px] pr-5 text-white/40 line-clamp-1">
                        {agent.instructions || agent.description || 'No description'}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide ${
                    agent.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {agent.status}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Integrations & channels snapshot */}
          <div className="bg-black/20 h-80 flex flex-col gap-4 border border-black/40 overflow-hidden rounded-3xl p-4 flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white/80">
                Connected Apps
              </h3>
              <Link href="/dashboard/integrations">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-white/50 hover:text-white bg-base rounded-full py-2 px-5 cursor-pointer"
                >
                  Manage
                </Button>
              </Link>
            </div>
            <div className="bg-black/20 overflow-y-auto flex flex-col gap-2.5 border border-black/40 rounded-xl p-2.5">
              {(live?.integrations || []).slice(0, 6).map((int: any) => (
                <div
                  key={int.provider}
                  className="bg-background rounded-xl flex justify-between items-center p-2.5"
                >
                  <div className="flex gap-3.5 items-center">
                    <div className="p-2 h-fit rounded-xl bg-white/5 border border-white/10 w-fit">
                      <Image
                        src={`/${int.provider}.svg`}
                        alt={`${int.provider} Icon`}
                        height={32}
                        width={32}
                        className="size-7"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h3 className="text-[15px] font-semibold capitalize">
                        {int.provider}
                      </h3>
                      <p className="text-[11px] text-white/50">
                        {int.status === 'connected' ? 'Connected' : int.status}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRightIcon className="size-4 text-white/30" />
                </div>
              ))}
              {(!live?.integrations || live.integrations.length === 0) && !loading && (
                <div className="p-4 text-white/20 text-sm">
                  No integrations yet. Connect Slack, GitHub, Google and more.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
