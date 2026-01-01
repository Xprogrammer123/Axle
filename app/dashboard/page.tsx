'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Robot,
  PlugsConnected,
  Lightning,
  Plus,
  CaretRight,
  CheckCircle,
  XCircle,
  Clock
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { safeFormat } from '@/lib/utils';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    activeAgents: 0,
    integrations: 0,
    executionsToday: 0
  });
  const [recentExecutions, setRecentExecutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [agentStats, integrationsData, executionsData] = await Promise.all([
          api.getAgentStats().catch(() => ({ activeAgents: 0, executionsToday: 0 })),
          api.getIntegrations().catch(() => ({ integrations: [] })),
          api.getExecutions({ limit: 5 }).catch(() => ({ executions: [] }))
        ]);

        setStats({
          activeAgents: agentStats.activeAgents || 0,
          integrations: integrationsData.integrations?.length || 0,
          executionsToday: agentStats.executionsToday || 0
        });

        setRecentExecutions(executionsData.executions || []);
      } catch (error) {
        console.error('Dashboard load failed:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-white/20 animate-pulse">Loading command center...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-white/40 mt-1">
            Your automated workforce is standing by.
          </p>
        </div>
        <Link href="/dashboard/agents/new">
          <Button className="bg-white text-black hover:bg-white/90 rounded-full px-6">
            <Plus weight="bold" className="mr-2" />
            Create Agent
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Active Agents"
          value={stats.activeAgents}
          icon={Robot}
        />
        <StatCard
          label="Connected Apps"
          value={stats.integrations}
          icon={PlugsConnected}
        />
        <StatCard
          label="Executions Today"
          value={stats.executionsToday}
          icon={Lightning}
          highlight
        />
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-white/80">Recent Executions</h2>
          <Link href="/dashboard/agents" className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1">
            View all <CaretRight />
          </Link>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
          {recentExecutions.length === 0 ? (
            <div className="p-8 text-center text-white/20">
              No executions yet. Run an agent to see activity here.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentExecutions.map((exec) => (
                <Link
                  key={exec._id}
                  href={`/dashboard/executions/${exec._id}`}
                  className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <StatusIcon status={exec.status} />
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                        {exec.executionName || 'Untitled Task'}
                      </div>
                      <div className="text-xs text-white/40">
                        {exec.agentName || 'Unknown Agent'} • {safeFormat(exec.startedAt || exec.createdAt, 'HH:mm:ss')}
                      </div>
                    </div>
                  </div>
                  <CaretRight className="text-white/20 group-hover:text-white/60" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

function StatCard({ label, value, icon: Icon, highlight = false }: any) {
  return (
    <Card className={`p-6 border-0 rounded-2xl flex flex-col justify-between h-32 transition-all hover:scale-[1.02] ${highlight ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 ring-1 ring-white/10' : 'bg-white/5'}`}>
      <div className="flex justify-between items-start">
        <span className="text-4xl font-light text-white">{value}</span>
        <Icon size={24} className="text-white/20" weight="duotone" />
      </div>
      <span className="text-sm font-medium text-white/50">{label}</span>
    </Card>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'completed' || status === 'success') return <CheckCircle size={20} className="text-emerald-400" weight="fill" />;
  if (status === 'failed' || status === 'error') return <XCircle size={20} className="text-red-400" weight="fill" />;
  if (status === 'running') return <Lightning size={20} className="text-blue-400 animate-pulse" weight="fill" />;
  return <Clock size={20} className="text-white/20" weight="fill" />;
}
