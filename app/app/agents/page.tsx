'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plus, Trash, Lightning, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { Button } from '@/components-beta/Button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { safeFormatDistanceToNow } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/utils';
import { RefreshCw } from 'lucide-react';
import Logo from '@/components-beta/Logo';

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
    <div className="p-7 w-full mx-auto overflow-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex flex-col md:flex-row md:items-end gap-4 md:gap-5 justify-between"
      >
        <div className="bg-dark/4 p-2.5 flex gap-2 items-center rounded-full w-full md:w-[85%]">
        <MagnifyingGlassIcon size={18} className="text-dark/35 flex-shrink-0" />
        <input type="text" className="w-full bg-transparent outline-0 text-sm md:text-base" placeholder="Search agents, descriptions..." />
        </div>
        <Link href="/app/agents/new">
          <Button className="cursor-pointer py-2 px-4 md:py-3 md:px-6 rounded-full text-sm md:text-base w-full md:w-auto">
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
            <Link href={`/app/agents/${agent._id}`} className="block group">
              <Card hover className="h-full bg-white/50 border border-black/3 shadow-dark/3 shadow-lg transition-all p-6 rounded-4xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-accent/5 rounded-full text-dark/80 group-hover:text-dark group-hover:scale-110 transition-all">
                      <Image src="/Sparkle.svg" alt="Sparkle" width={48} height={48} className="size-6" />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${agent.status === 'active'
                      ? 'bg-accent/10 text-accent border-accent/20'
                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                      {agent.status === 'active' ? 'Active' : 'Paused'}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-dark mb-2">{agent.name}</h3>
                  <p className="text-sm text-dark/50 line-clamp-2 h-10 ml-0.5">
                    {agent.instructions || "No description provided."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-dark/5 flex flex-col w-full justify-between">
                  <div className="flex mt-4 gap-2 w-full">
                    <Link href={`/app/agents/${agent._id}`} className="w-full">
                      <Button className="w-full py-2.5 md:py-3.5 text-sm md:text-base">View Agent</Button>
                    </Link>
                    <Button
                      onClick={(e) => handleDeleteAgent(e, agent._id)}
                      className="rounded-full p-2 md:p-3 px-3 md:px-4 bg-[#C04547] text-white flex-shrink-0"
                      title="Delete"
                      loading={deletingId === agent._id}
                    >
                      <Trash size={18} weight="fill" />
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}

        {/* Empty State / Add New Card */}
        <Link href="/app/agents/new" className="block group">
          <div className="h-full min-h-[240px] border-2 border-dashed border-accent/25 rounded-2xl flex flex-col items-center justify-center text-dark/20 hover:text-dark/40 hover:border-accent/50 transition-all bg-accent/2 hover:bg-accent/5">
            <Plus size={32} />
            <span className="mt-2 font-medium">Deploy New Agent</span>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
