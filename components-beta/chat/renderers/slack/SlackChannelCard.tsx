
// components/chat/renderers/slack/SlackChannelCard.tsx
'use client';

import React, { useState } from 'react';
import { Hash, Lock, Users, Plus, Settings, Bell, CheckCircle2 } from 'lucide-react';

interface SlackChannelCardProps {
  data: {
    channelName: string;
    description?: string;
    isPrivate: boolean;
    members?: string[];
    purpose?: string;
  };
  onCreate?: (data: any) => void;
}

export default function SlackChannelCard({ data, onCreate }: SlackChannelCardProps) {
  const [channelName, setChannelName] = useState(data.channelName);
  const [description, setDescription] = useState(data.description || '');
  const [isPrivate, setIsPrivate] = useState(data.isPrivate);
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!onCreate || !channelName.trim()) return;
    setCreating(true);
    try {
      await onCreate({
        name: channelName,
        description,
        is_private: isPrivate,
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 via-gray-900 to-black shadow-2xl shadow-purple-500/10 max-w-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 animate-pulse" />
      
      {/* Header */}
      <div className="relative px-6 py-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-950/60 to-transparent">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/40 blur-xl rounded-full" />
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Create Slack Channel</h3>
            <p className="text-xs text-purple-300/70">New workspace channel</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="relative px-6 py-5 space-y-4">
        {/* Channel Name */}
        <div>
          <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">
            Channel Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              {isPrivate ? (
                <Lock className="w-4 h-4 text-purple-400" />
              ) : (
                <Hash className="w-4 h-4 text-purple-400" />
              )}
            </div>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
              placeholder="channel-name"
              className="w-full pl-11 pr-4 py-3 bg-black/40 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all font-mono"
            />
          </div>
          <p className="text-xs text-purple-300/50 mt-1.5">
            Use lowercase letters, numbers, hyphens, and underscores
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this channel about?"
            rows={3}
            className="w-full px-4 py-3 bg-black/40 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none text-sm"
          />
        </div>

        {/* Privacy Toggle */}
        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {isPrivate ? (
                  <Lock className="w-4 h-4 text-purple-400" />
                ) : (
                  <Hash className="w-4 h-4 text-purple-400" />
                )}
                <span className="text-sm font-semibold text-white">
                  {isPrivate ? 'Private Channel' : 'Public Channel'}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {isPrivate 
                  ? 'Only invited members can view and join this channel'
                  : 'Anyone in the workspace can view and join this channel'
                }
              </p>
            </div>
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                isPrivate 
                  ? 'bg-purple-500' 
                  : 'bg-gray-700'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300 ${
                  isPrivate ? 'left-8' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Members Preview */}
        {data.members && data.members.length > 0 && (
          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                Initial Members ({data.members.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.members.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                    {member[0].toUpperCase()}
                  </div>
                  <span className="text-xs text-purple-200">{member}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative px-6 py-4 border-t border-purple-500/20 bg-gradient-to-r from-purple-950/40 to-transparent">
        <button
          onClick={handleCreate}
          disabled={creating || !channelName.trim()}
          className="w-full group relative px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-800 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 disabled:shadow-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
          <div className="relative flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span className="text-sm font-bold text-white">
              {creating ? 'Creating Channel...' : 'Create Channel'}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}