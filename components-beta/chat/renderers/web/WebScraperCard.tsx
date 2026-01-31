
'use client';

import React from 'react';
import { Globe, ExternalLink, Clock, FileText } from 'lucide-react';

interface WebScraperCardProps {
  data: {
    url: string;
    title: string;
    extractedText: string;
    wordCount: number;
    scrapedAt: string;
  };
}

export default function WebScraperCard({ data }: WebScraperCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 via-gray-900 to-black shadow-2xl max-w-3xl">
      {/* Header */}
      <div className="relative px-5 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/60 to-transparent">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-full" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white mb-1 truncate">{data.title}</h3>
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-400 hover:text-cyan-300 truncate block"
              >
                {data.url}
              </a>
            </div>
          </div>
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-all"
          >
            <ExternalLink className="w-4 h-4 text-cyan-400" />
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="relative px-5 py-3 border-b border-gray-800/50 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 text-cyan-300/70">
          <FileText className="w-3.5 h-3.5" />
          <span>{data.wordCount.toLocaleString()} words</span>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-300/70">
          <Clock className="w-3.5 h-3.5" />
          <span>{data.scrapedAt}</span>
        </div>
      </div>

      {/* Extracted Content */}
      <div className="relative px-5 py-4">
        <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/10 max-h-80 overflow-y-auto">
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
            {data.extractedText}
          </p>
        </div>
      </div>
    </div>
  );
}