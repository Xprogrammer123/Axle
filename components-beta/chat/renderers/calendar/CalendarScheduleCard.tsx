// components/chat/renderers/calendar/CalendarScheduleCard.tsx
'use client';

import React from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

interface TimeBlock {
  time: string;
  event?: {
    title: string;
    duration: string;
    color: string;
  };
  isFree: boolean;
}

interface CalendarScheduleCardProps {
  data: {
    date: string;
    schedule: TimeBlock[];
    conflicts?: number;
  };
}

export default function CalendarScheduleCard({ data }: CalendarScheduleCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 via-gray-900 to-gray-950 shadow-2xl shadow-blue-500/10 max-w-md">
      {/* Header */}
      <div className="relative px-5 py-4 border-b border-blue-500/20 bg-gradient-to-r from-blue-950/60 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{data.date}</h3>
              <p className="text-xs text-blue-300/70">Day Schedule</p>
            </div>
          </div>
          {data.conflicts && data.conflicts > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs font-semibold text-red-400">{data.conflicts} conflicts</span>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative p-5 space-y-2">
        {data.schedule.map((block, idx) => (
          <div key={idx} className="flex items-start gap-3">
            {/* Time */}
            <div className="w-16 pt-1 flex-shrink-0">
              <div className="text-xs font-mono text-blue-300/70">{block.time}</div>
            </div>

            {/* Event or Free */}
            <div className="flex-1">
              {block.event ? (
                <div className={`relative p-3 rounded-lg border ${block.event.color} backdrop-blur-sm`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white mb-0.5">{block.event.title}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{block.event.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-dashed border-gray-700/50 bg-gray-800/20">
                  <div className="text-xs text-gray-500 italic">Free</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}