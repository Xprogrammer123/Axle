// components/chat/renderers/github/GitHubPRCard.tsx
'use client';

import React from 'react';
import { GitPullRequest, GitMerge, Plus, Minus, FileCode, ExternalLink, GitBranch, CheckCircle2 } from 'lucide-react';

interface GitHubPRCardProps {
  data: {
    repo: string;
    number: number;
    title: string;
    author: string;
    status: 'open' | 'merged' | 'closed';
    filesChanged: number;
    additions: number;
    deletions: number;
    branch: string;
    targetBranch: string;
    url: string;
  };
  onMerge?: () => void;
}

export default function GitHubPRCard({ data, onMerge }: GitHubPRCardProps) {
  const statusConfig = {
    open: { color: 'from-green-500 to-green-600', borderColor: 'border-green-500/20', bgColor: 'bg-green-500/10', textColor: 'text-green-400' },
    merged: { color: 'from-purple-500 to-purple-600', borderColor: 'border-purple-500/20', bgColor: 'bg-purple-500/10', textColor: 'text-purple-400' },
    closed: { color: 'from-red-500 to-red-600', borderColor: 'border-red-500/20', bgColor: 'bg-red-500/10', textColor: 'text-red-400' },
  };

  const config = statusConfig[data.status];

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${config.borderColor} bg-gradient-to-br from-gray-900 via-gray-950 to-black shadow-2xl max-w-3xl`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${config.color} opacity-5`} />
      
      {/* Header */}
      <div className={`relative px-6 py-4 border-b ${config.borderColor}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="relative">
              <div className={`absolute inset-0 ${config.bgColor} blur-xl rounded-full`} />
              <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg`}>
                {data.status === 'merged' ? (
                  <GitMerge className="w-6 h-6 text-white" />
                ) : (
                  <GitPullRequest className="w-6 h-6 text-white" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-white truncate">{data.title}</h3>
                <span className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
                  {data.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="font-mono">#{data.number}</span>
                <span>•</span>
                <span>by @{data.author}</span>
                <span>•</span>
                <span className="text-gray-500">{data.repo}</span>
              </div>
            </div>
          </div>

          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-300">View</span>
          </a>
        </div>
      </div>

      {/* Branch Info */}
      <div className={`relative px-6 py-3 border-b ${config.borderColor} bg-black/20`}>
        <div className="flex items-center gap-2 text-xs">
          <GitBranch className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-mono text-gray-300">{data.branch}</span>
          <span className="text-gray-600">→</span>
          <span className="font-mono text-gray-300">{data.targetBranch}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="relative px-6 py-4 grid grid-cols-3 gap-3">
        <div className={`p-3 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
          <div className="flex items-center gap-2 mb-1">
            <FileCode className={`w-4 h-4 ${config.textColor}`} />
            <span className={`text-xs font-semibold ${config.textColor} uppercase tracking-wide`}>Files</span>
          </div>
          <div className="text-2xl font-bold text-white">{data.filesChanged}</div>
        </div>

        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Plus className="w-4 h-4 text-green-400" />
            <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">Added</span>
          </div>
          <div className="text-2xl font-bold text-green-400">+{data.additions}</div>
        </div>

        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Minus className="w-4 h-4 text-red-400" />
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">Removed</span>
          </div>
          <div className="text-2xl font-bold text-red-400">-{data.deletions}</div>
        </div>
      </div>

      {/* Merge Button */}
      {data.status === 'open' && onMerge && (
        <div className={`relative px-6 py-4 border-t ${config.borderColor} bg-gradient-to-r ${config.color} bg-opacity-5`}>
          <button
            onClick={onMerge}
            className={`w-full group relative px-5 py-3 rounded-xl bg-gradient-to-r ${config.color} hover:scale-[1.02] transition-all duration-300 shadow-lg`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            <div className="relative flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span className="text-sm font-bold text-white">Merge Pull Request</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}