
// components/chat/renderers/slack/SlackUserCard.tsx
'use client';

import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, MessageCircle, UserPlus, Settings } from 'lucide-react';

interface SlackUserCardProps {
  data: {
    id: string;
    name: string;
    realName: string;
    email?: string;
    phone?: string;
    title?: string;
    timezone?: string;
    status?: {
      emoji?: string;
      text?: string;
    };
    isBot?: boolean;
    isAdmin?: boolean;
    profileImage?: string;
  };
  onMessage?: () => void;
  onInvite?: () => void;
}

export default function SlackUserCard({ data, onMessage, onInvite }: SlackUserCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 via-gray-900 to-black shadow-2xl shadow-purple-500/10 max-w-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 animate-pulse" />
      
      {/* Header with Avatar */}
      <div className="relative px-6 py-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-950/60 to-transparent">
        <div className="flex items-start gap-4">
          {/* Large Avatar */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-purple-500/40 blur-2xl rounded-full" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-xl">
              {data.profileImage ? (
                <img src={data.profileImage} alt={data.name} className="w-full h-full rounded-2xl" />
              ) : (
                <span className="text-white font-bold text-2xl">
                  {data.name[0].toUpperCase()}
                </span>
              )}
            </div>
            
            {/* Status Indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-4 border-gray-900 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <h3 className="text-lg font-bold text-white mb-0.5">{data.realName}</h3>
                <p className="text-sm text-purple-300/70">@{data.name}</p>
              </div>
              
              {/* Badges */}
              <div className="flex flex-col gap-1">
                {data.isBot && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                    Bot
                  </span>
                )}
                {data.isAdmin && (
                  <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px] font-bold text-yellow-300 uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>
            </div>

            {data.title && (
              <p className="text-sm text-gray-300 mb-2">{data.title}</p>
            )}

            {/* Status */}
            {data.status && (data.status.emoji || data.status.text) && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                {data.status.emoji && <span className="text-base">{data.status.emoji}</span>}
                {data.status.text && <span className="text-xs text-purple-300">{data.status.text}</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="relative px-6 py-4 space-y-3">
        {data.email && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/30 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-semibold text-purple-400/70 uppercase tracking-wider mb-0.5">
                Email
              </div>
              <a href={`mailto:${data.email}`} className="text-sm text-white hover:text-purple-300 transition-colors truncate block">
                {data.email}
              </a>
            </div>
          </div>
        )}

        {data.phone && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/30 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-semibold text-purple-400/70 uppercase tracking-wider mb-0.5">
                Phone
              </div>
              <a href={`tel:${data.phone}`} className="text-sm text-white hover:text-purple-300 transition-colors">
                {data.phone}
              </a>
            </div>
          </div>
        )}

        {data.timezone && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-semibold text-purple-400/70 uppercase tracking-wider mb-0.5">
                Timezone
              </div>
              <div className="text-sm text-white">{data.timezone}</div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="relative px-6 py-4 border-t border-purple-500/20 bg-gradient-to-r from-purple-950/40 to-transparent">
        <div className="grid grid-cols-2 gap-3">
          {onMessage && (
            <button
              onClick={onMessage}
              className="group relative px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-500/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              <div className="relative flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4 text-white" />
                <span className="text-sm font-bold text-white">Message</span>
              </div>
            </button>
          )}
          
          {onInvite && (
            <button
              onClick={onInvite}
              className="relative px-4 py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-bold text-purple-300">Invite</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}