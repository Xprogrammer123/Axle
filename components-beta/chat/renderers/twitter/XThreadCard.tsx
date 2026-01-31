
'use client';

import React from 'react';
import { Twitter, MessageCircle } from 'lucide-react';

interface XThreadCardProps {
  data: {
    tweets: string[];
    totalCharacters: number;
  };
  onPost?: () => void;
}

export default function XThreadCard({ data, onPost }: XThreadCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-950/40 via-gray-900 to-black shadow-2xl max-w-xl">
      {/* Header */}
      <div className="relative px-5 py-4 border-b border-blue-400/20 bg-gradient-to-r from-blue-950/60 to-transparent">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400/40 blur-xl rounded-full" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Thread Preview</h3>
            <p className="text-xs text-blue-300/70">{data.tweets.length} tweets • {data.totalCharacters} chars</p>
          </div>
        </div>
      </div>

      {/* Thread */}
      <div className="relative px-5 py-4 space-y-3">
        {data.tweets.map((tweet, idx) => (
          <div key={idx} className="relative">
            {/* Connection Line */}
            {idx < data.tweets.length - 1 && (
              <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-blue-500/30" />
            )}

            <div className="flex gap-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm border-2 border-gray-900">
                  AI
                </div>
              </div>

              {/* Tweet Content */}
              <div className="flex-1 p-4 rounded-xl bg-blue-500/5 border border-blue-400/20 hover:border-blue-400/40 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-bold text-white">AI Agent</span>
                    <span className="text-xs text-blue-300/70 ml-2">@ai_agent</span>
                  </div>
                  <span className="text-xs text-blue-400/70 font-mono">{idx + 1}/{data.tweets.length}</span>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{tweet}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-blue-400/70">
                  <span>{tweet.length} chars</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Thread Button */}
      <div className="relative px-5 py-4 border-t border-blue-400/20 bg-gradient-to-r from-blue-950/40 to-transparent">
        <button
          onClick={onPost}
          className="w-full group relative px-5 py-3 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/30"
        >
          <div className="relative flex items-center justify-center gap-2">
            <Twitter className="w-4 h-4 text-white" />
            <span className="text-sm font-bold text-white">Post Thread</span>
          </div>
        </button>
      </div>
    </div>
  );
}

