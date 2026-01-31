'use client';

import React, { useState } from 'react';
import { Mail, ChevronDown, ChevronUp, User, Clock } from 'lucide-react';

interface Message {
  from: string;
  date: string;
  snippet: string;
  body?: string;
}

interface GmailThreadCardProps {
  data: {
    subject: string;
    messages: Message[];
    totalMessages: number;
  };
}

export default function GmailThreadCard({ data }: GmailThreadCardProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/40 via-gray-900 to-gray-950 shadow-2xl shadow-red-500/10 max-w-3xl">
      {/* Header */}
      <div className="relative px-6 py-4 border-b border-red-500/20 bg-gradient-to-r from-red-950/60 to-transparent">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/30 blur-xl rounded-full" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white mb-0.5">{data.subject}</h3>
            <p className="text-xs text-red-300/70">{data.totalMessages} messages in thread</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="relative divide-y divide-gray-800/50">
        {data.messages.slice(0, 3).map((msg, idx) => (
          <div key={idx} className="group">
            <button
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              className="w-full px-6 py-4 hover:bg-red-500/5 transition-colors text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {msg.from[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-white">{msg.from}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-red-300/70">
                        <Clock className="w-3 h-3" />
                        <span>{msg.date}</span>
                      </div>
                      {expandedIdx === idx ? (
                        <ChevronUp className="w-4 h-4 text-red-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-1">{msg.snippet}</p>
                </div>
              </div>
            </button>
            
            {expandedIdx === idx && msg.body && (
              <div className="px-6 pb-4">
                <div className="ml-12 p-4 rounded-xl bg-black/40 border border-gray-800/50">
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{msg.body}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {data.totalMessages > 3 && (
        <div className="px-6 py-3 border-t border-gray-800/50 bg-red-950/20 text-center">
          <span className="text-xs text-red-300/70">
            + {data.totalMessages - 3} more messages
          </span>
        </div>
      )}
    </div>
  );
}