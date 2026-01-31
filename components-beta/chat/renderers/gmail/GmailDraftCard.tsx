// components/chat/renderers/gmail/GmailDraftCard.tsx
'use client';

import React, { useState } from 'react';
import { Mail, Send, Paperclip, User, Clock, Edit3, Sparkles } from 'lucide-react';

interface GmailDraftCardProps {
  data: {
    to: string[];
    cc?: string[];
    subject: string;
    body: string;
    attachments?: string[];
    isDraft: boolean;
  };
  onSend?: (data: any) => void;
}

export default function GmailDraftCard({ data, onSend }: GmailDraftCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [subject, setSubject] = useState(data.subject);
  const [body, setBody] = useState(data.body);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!onSend) return;
    setSending(true);
    try {
      await onSend({ ...data, subject, body });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/40 via-gray-900 to-gray-950 shadow-2xl shadow-red-500/10 max-w-3xl backdrop-blur-xl">
      {/* Animated gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 animate-pulse" />
      
      {/* Gmail Header */}
      <div className="relative px-6 py-4 border-b border-red-500/20 bg-gradient-to-r from-red-950/60 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/30 blur-xl rounded-full" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/50">
                <Mail className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Gmail Draft</span>
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
              </div>
              <p className="text-xs text-red-300/70">AI-Generated Email</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="group relative px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-2">
              <Edit3 className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs font-medium text-red-300">
                {isEditing ? 'Preview' : 'Edit'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Recipients */}
      <div className="relative px-6 py-4 space-y-3 border-b border-gray-800/50">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20">
            <User className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-semibold text-red-400/70 uppercase tracking-wider mb-1.5">
              To
            </div>
            <div className="flex flex-wrap gap-2">
              {data.to.map((email, idx) => (
                <div
                  key={idx}
                  className="group relative px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 hover:border-red-500/50 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                  <span className="relative text-sm text-red-200 font-medium">{email}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {data.cc && data.cc.length > 0 && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/5 border border-red-500/10 flex items-center justify-center">
              <span className="text-[10px] font-bold text-red-400/70">Cc</span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2">
                {data.cc.map((email, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-red-500/5 border border-red-500/20 text-xs text-red-300/80">
                    {email}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subject */}
      <div className="relative px-6 py-4 border-b border-gray-800/50">
        {isEditing ? (
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full px-4 py-3 bg-black/40 border border-red-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
          />
        ) : (
          <div className="px-4 py-3 bg-red-500/5 rounded-xl border border-red-500/10">
            <div className="text-xs font-semibold text-red-400/70 uppercase tracking-wider mb-1">
              Subject
            </div>
            <h3 className="text-base font-semibold text-white">
              {subject || '(No subject)'}
            </h3>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="relative px-6 py-5">
        {isEditing ? (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={14}
            placeholder="Write your message..."
            className="w-full px-4 py-3 bg-black/40 border border-red-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all resize-none font-mono text-sm leading-relaxed"
          />
        ) : (
          <div className="px-4 py-3 min-h-[280px] bg-gradient-to-br from-black/20 to-black/40 rounded-xl border border-gray-800/50">
            <p className="text-sm text-gray-200 whitespace-pre-wrap leading-loose">
              {body}
            </p>
          </div>
        )}
      </div>

      {/* Attachments */}
      {data.attachments && data.attachments.length > 0 && (
        <div className="relative px-6 py-4 border-t border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Paperclip className="w-4 h-4 text-red-400" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-red-300/70 mb-1">
                {data.attachments.length} attachment{data.attachments.length !== 1 ? 's' : ''}
              </div>
              <div className="flex flex-wrap gap-2">
                {data.attachments.map((file, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-red-500/5 border border-red-500/20 text-xs text-red-300 font-mono">
                    {file}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      {data.isDraft && (
        <div className="relative px-6 py-4 border-t border-red-500/20 bg-gradient-to-r from-red-950/40 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-red-300/70">
              <Clock className="w-3.5 h-3.5" />
              <span>Draft ready • {body.length} characters</span>
            </div>
            
            <button
              onClick={handleSend}
              disabled={sending || !subject.trim() || !body.trim()}
              className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-700 disabled:to-gray-800 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 disabled:scale-100 disabled:shadow-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              <div className="relative flex items-center gap-2">
                <Send className="w-4 h-4 text-white" />
                <span className="text-sm font-bold text-white">
                  {sending ? 'Sending...' : 'Send Email'}
                </span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}