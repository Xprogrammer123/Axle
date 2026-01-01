'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge, Skeleton, EmptyState } from '@/components/ui/utils';
import { api } from '@/lib/api';
import { formatDateTime, formatDuration } from '@/lib/utils';
import type { Execution } from '@/types';

export default function ExecutionsPage() {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchExecutions();
  }, [statusFilter]);

  const fetchExecutions = async () => {
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const data = await api.getExecutions(params);
      setExecutions(data.executions);
    } catch (error) {
      console.error('Failed to fetch executions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExecutions = executions.filter(exec => {
    const searchLower = searchTerm.toLowerCase();
    return (
      exec.agentName?.toLowerCase().includes(searchLower) ||
      exec.summary?.toLowerCase().includes(searchLower) ||
      exec._id.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Unbounded, sans-serif' }}>
          Executions
        </h1>
        <p className="text-muted-foreground">
          View and monitor all agent execution runs
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search by agent name, summary, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e: any) => setStatusFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'success', label: 'Success' },
            { value: 'failed', label: 'Failed' },
            { value: 'running', label: 'Running' },
            { value: 'pending', label: 'Pending' },
          ]}
        />
      </div>

      {/* Executions List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredExecutions.length === 0 ? (
        <EmptyState
          icon={<FileText size={48} className="text-muted-foreground" />}
          title="No executions found"
          description={searchTerm ? 'Try a different search term' : 'Run an agent to see executions here'}
        />
      ) : (
        <div className="space-y-4">
          {filteredExecutions.map((execution) => (
            <Link key={execution._id} href={`/dashboard/executions/${execution._id}`}>
              <Card hover className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {execution.agentName || 'Unknown Agent'}
                      </h3>
                      <Badge variant={execution.status}>{execution.status}</Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {execution.summary || execution.statusExplained}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>{execution.createdAtHuman || formatDateTime(execution.createdAt)}</span>
                  {execution.durationHuman && (
                    <span>• Duration: {execution.durationHuman}</span>
                  )}
                  <span>• {execution.actionsExecuted?.length || 0} actions</span>
                  {execution.creditsUsed && (
                    <span>• {execution.creditsUsed} credits</span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
