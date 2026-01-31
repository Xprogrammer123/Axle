// components/chat/renderers/web/CronScheduleCard.tsx
'use client';

import React from 'react';
import { Clock, Calendar, Zap, Play } from 'lucide-react';

interface CronScheduleCardProps {
  data: {
    schedule: string;
    nextRun: string;
    timezone: string;
    description: string;
    enabled: boolean;
  };
  onToggle?: () => void;
}

export default function CronScheduleCard({ data, onToggle }: CronScheduleCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-950/30 via-gray-900 to-black shadow-2xl max-w-lg">
      {/* Header */}
      <div className="relative px-5 py-4 border-b border-orange-500/20 bg-gradient-to-r from-orange-950/60 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full animate-pulse" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Scheduled Task</h3>
              <p className="text-xs text-orange-300/70">Automated Run</p>
            </div>
          </div>
          
          <button
            onClick={onToggle}
            className={`relative px-4 py-2 rounded-lg transition-all ${
              data.enabled
                ? 'bg-orange-500/20 border-orange-500/30 text-orange-300'
                : 'bg-gray-800 border-gray-700 text-gray-400'
            } border`}
          >
            <span className="text-xs font-semibold">{data.enabled ? 'Enabled' : 'Disabled'}</span>
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="relative px-5 py-4 space-y-4">
        <div>
          <div className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-2">Description</div>
          <p className="text-sm text-gray-300">{data.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs font-semibold text-orange-400 uppercase tracking-wide">Schedule</span>
            </div>
            <div className="text-sm font-mono text-white">{data.schedule}</div>
          </div>

          <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs font-semibold text-orange-400 uppercase tracking-wide">Next Run</span>
            </div>
            <div className="text-sm font-semibold text-white">{data.nextRun}</div>
          </div>
        </div>

        <div className="text-xs text-gray-400">
          Timezone: <span className="text-gray-300 font-medium">{data.timezone}</span>
        </div>
      </div>

      {/* Run Now Button */}
      <div className="relative px-5 py-4 border-t border-orange-500/20">
        <button className="w-full group relative px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg">
          <div className="relative flex items-center justify-center gap-2">
            <Play className="w-4 h-4 text-white" />
            <span className="text-sm font-bold text-white">Run Now</span>
          </div>
        </button>
      </div>
    </div>
  );
}