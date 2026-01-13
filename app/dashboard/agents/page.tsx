'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plus, Trash, Lightning } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { safeFormatDistanceToNow } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/utils';
import { RefreshCw } from 'lucide-react';

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const data = await api.getAgents();
      setAgents((data.agents || []).filter(Boolean));
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setRunningId(id);
      await api.runAgent(id, {});
      setTimeout(fetchAgents, 800);
    } catch (e) {
      console.error(e);
    } finally {
      setRunningId(null);
    }
  };

  const handleDeleteAgent = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    // const ok = window.confirm('Delete this agent? This will also delete all its triggers and executions.');
    // if (!ok) return;

    try {
      setDeletingId(id);
      await api.deleteAgent(id);
      setAgents((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStatus = async (e: React.MouseEvent, agent: any) => {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = agent.status === 'active' ? 'paused' : 'active';
    await api.updateAgent(agent._id, { status: newStatus });
    setAgents(agents.map(a => a._id === agent._id ? { ...a, status: newStatus } : a));
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="page-loader" style={{ minHeight: 140 }}>
          <div className="loader-light" />
          <div className="page-loader-text">Loading workforce…</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-full bg-black/30 border border-black/50 p-6 rounded-4xl">
              <Skeleton className="h-10 w-10 rounded-full mb-4" />
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex flex-col md:flex-row md:items-end gap-5 justify-between"
      >
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Your Agents</h1>
          <p className="text-white/40 mt-0.5">Manage and monitor your AI agents.</p>
        </div>
        <Link href="/dashboard/agents/new">
          <Button className="cursor-pointer py-2.5 rounded-full px-6">
            <Plus weight="bold" className="size-4" />
            New Agent
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.05 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {agents.map((agent) => (
          <motion.div
            key={agent._id}
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          >
            <Link href={`/dashboard/agents/${agent._id}`} className="block group">
              <Card hover className="h-full bg-black/30 border border-black/50 transition-all p-6 rounded-4xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-base/5 rounded-full text-white/80 group-hover:text-white group-hover:scale-110 transition-all">
                      <Image src="/Sparkle.svg" alt="Sparkle" width={48} height={48} className="size-6" />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${agent.status === 'active'
                      ? 'bg-base/10 text-base border-base/20'
                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                      {agent.status === 'active' ? 'Active' : 'Paused'}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">{agent.name}</h3>
                  <p className="text-sm text-white/50 line-clamp-2 h-10 ml-0.5">
                    {agent.instructions || "No description provided."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex flex-col w-full justify-between">
                  <span className="text-xs text-white/30">
                    {agent.lastRunAt ? `Ran ${safeFormatDistanceToNow(agent.lastRunAt, { addSuffix: true })}` : 'Never ran'}
                  </span>

                  <div className="flex mt-4 gap-2 w-full">
                    <Button
                      onClick={(e) => handleRun(e, agent._id)}
                      className="p-2.5 px-3.5 rounded-full bg-base/10 text-white/80 hover:text-white transition-colors"
                      title="Run now"
                      loading={runningId === agent._id}
                    >
                      <RefreshCw size={16} weight="fill" />
                    </Button>
                    <Button
                      onClick={(e) => handleDeleteAgent(e, agent._id)}
                      className="p-2.5 px-3.5 hover:bg-red-500/5 rounded-full bg-red-500/10 text-red-200 hover:text-red-100 border border-red-500/20"
                      title="Delete"
                      loading={deletingId === agent._id}
                    >
                      <Trash size={16} weight="fill" />
                    </Button>
                    <Link href={`/dashboard/agents/${agent._id}`} className="p-2.5 items-center justify-center flex font-semibold bg-base rounded-full text-white w-full transition-colors">
                      View Agent
                    </Link>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}

        {/* Empty State / Add New Card */}
        <Link href="/dashboard/agents/new" className="block group">
          <div className="h-full min-h-[240px] border border-dashed border-base/25 rounded-2xl flex flex-col items-center justify-center text-white/20 hover:text-white/40 hover:border-base/50 transition-all bg-base/2 hover:bg-base/5">
            <Plus size={32} />
            <span className="mt-2 font-medium">Deploy New Agent</span>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
