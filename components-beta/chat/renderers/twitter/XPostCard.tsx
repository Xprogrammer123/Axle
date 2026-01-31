// components/chat/renderers/x/XPostCard.tsx
'use client';

import React, { useState } from 'react';
import { Twitter, Image as ImageIcon, Send, BarChart3 } from 'lucide-react';

interface XPostCardProps {
  data: {
    text: string;
    images?: string[];
    characterCount: number;
    scheduledFor?: string;
  };
  onPost?: (data: any) => void;
}

export default function XPostCard({ data, onPost }: XPostCardProps) {
  const [text, setText] = useState(data.text);
  const maxChars = 280;
  const remaining = maxChars - text.length;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-950/40 via-gray-900 to-black shadow-2xl shadow-blue-500/10 max-w-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 animate-pulse" />
      
      {/* Header */}
      <div className="relative px-5 py-4 border-b border-blue-400/20 bg-gradient-to-r from-blue-950/60 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400/40 blur-xl rounded-full" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <Twitter className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Post to X</h3>
              <p className="text-xs text-blue-300/70">Draft Tweet</p>
            </div>
          </div>
          
          <div className={`flex items-center justify-center w-12 h-12 rounded-full ${remaining < 0 ? 'bg-red-500/20 border-2 border-red-500' : remaining < 20 ? 'bg-yellow-500/20 border-2 border-yellow-500' : 'bg-blue-500/20 border-2 border-blue-500/50'}`}>
            <span className={`text-sm font-bold ${remaining < 0 ? 'text-red-400' : remaining < 20 ? 'text-yellow-400' : 'text-blue-400'}`}>
              {remaining}
            </span>
          </div>
        </div>
      </div>

      {/* Tweet Content */}
      <div className="relative px-5 py-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening?"
          rows={6}
          className="w-full px-4 py-3 bg-black/40 border border-blue-400/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-base leading-relaxed"
        />
      </div>

      {/* Images */}
      {data.images && data.images.length > 0 && (
        <div className="relative px-5 pb-4">
          <div className={`grid ${data.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
            {data.images.map((img, idx) => (
              <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-blue-400/20 bg-gray-800/50">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-blue-400/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Info */}
      {data.scheduledFor && (
        <div className="relative px-5 py-3 border-t border-blue-400/10 bg-blue-950/20">
          <div className="flex items-center gap-2 text-xs text-blue-300/70">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Scheduled for {data.scheduledFor}</span>
          </div>
        </div>
      )}

      {/* Post Button */}
      <div className="relative px-5 py-4 border-t border-blue-400/20 bg-gradient-to-r from-blue-950/40 to-transparent">
        <button
          onClick={() => onPost?.({ text })}
          disabled={text.length === 0 || text.length > maxChars}
          className="w-full group relative px-5 py-3 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-800 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:shadow-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
          <div className="relative flex items-center justify-center gap-2">
            <Send className="w-4 h-4 text-white" />
            <span className="text-sm font-bold text-white">Post</span>
          </div>
        </button>
      </div>
    </div>
  );
}