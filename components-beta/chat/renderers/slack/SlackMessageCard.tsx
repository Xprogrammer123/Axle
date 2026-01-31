// components/chat/renderers/slack/SlackMessageCard.tsx
'use client';

import React, { useState } from 'react';
import { Hash, Send, AtSign, MessageSquare, Clock, Users, Lock } from 'lucide-react';

interface SlackMessageCardProps {
  data: {
    channel: string;
    channelName: string;
    message: string;
    mentions?: string[];
    isThread?: boolean;
    threadTs?: string;
    isPrivate?: boolean;
  };
  onSend?: (data: any) => void;
}

export default function SlackMessageCard({ data, onSend }: SlackMessageCardProps) {
  const [message, setMessage] = useState(data.message);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!onSend || !message.trim()) return;
    setSending(true);
    try {
      await onSend({
        channel: data.channel,
        message,
        thread_ts: data.threadTs,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 via-gray-900 to-black shadow-2xl shadow-purple-500/10 max-w-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 animate-pulse" />
      
      {/* Header */}
      <div className="relative px-6 py-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-950/60 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/40 blur-xl rounded-full" />
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                {data.isPrivate ? (
                  <Lock className="w-5 h-5 text-white" />
                ) : (
                  <Hash className="w-5 h-5 text-white" />
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  {data.isPrivate ? '🔒 ' : '#'}{data.channelName}
                </h3>
                {data.isThread && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                    Thread
                  </span>
                )}
              </div>
              <p className="text-xs text-purple-300/70">Slack Message</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-purple-300/70">
            <Clock className="w-3.5 h-3.5" />
            <span>just now</span>
          </div>
        </div>
      </div>

      {/* Message Preview */}
      <div className="relative px-6 py-5">
        <div className="flex gap-4 mb-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-bold text-white text-sm">AI Agent</span>
              <span className="text-xs text-purple-300/70">just now</span>
            </div>
            
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="Write your message..."
              className="w-full px-4 py-3 bg-black/40 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none text-sm leading-relaxed"
            />
          </div>
        </div>

        {/* Mentions */}
        {data.mentions && data.mentions.length > 0 && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
              <AtSign className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider mb-2">
                Mentions
              </div>
              <div className="flex flex-wrap gap-2">
                {data.mentions.map((mention, idx) => (
                  <div
                    key={idx}
                    className="group relative px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:border-purple-500/50 transition-all"
                  >
                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                    <span className="relative text-xs font-medium text-purple-300">@{mention}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative px-6 py-4 border-t border-purple-500/20 bg-gradient-to-r from-purple-950/40 to-transparent">
        <div className="flex items-center justify-between">
          <div className="text-xs text-purple-300/70">
            {message.length} characters
          </div>
          
          <button
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-800 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 disabled:scale-100 disabled:shadow-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            <div className="relative flex items-center gap-2">
              <Send className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white">
                {sending ? 'Sending...' : 'Send Message'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}