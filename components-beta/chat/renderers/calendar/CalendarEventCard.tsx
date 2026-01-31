// components/chat/renderers/calendar/CalendarEventCard.tsx
'use client';

import React from 'react';
import { Calendar, Clock, Video, MapPin, Users, Bell } from 'lucide-react';

interface CalendarEventCardProps {
  data: {
    title: string;
    date: string;
    time: string;
    duration: string;
    location?: string;
    meetLink?: string;
    attendees?: string[];
    description?: string;
    color: string;
  };
}

export default function CalendarEventCard({ data }: CalendarEventCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 via-gray-900 to-gray-950 shadow-2xl shadow-blue-500/10 max-w-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 animate-pulse" />
      
      {/* Colored accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${data.color}`} />
      
      {/* Header */}
      <div className="relative px-6 py-4 border-b border-blue-500/20">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-white mb-1">{data.title}</h3>
              <div className="flex items-center gap-2 text-xs text-blue-300/70">
                <Bell className="w-3 h-3" />
                <span>Calendar Event</span>
              </div>
            </div>
          </div>
          
          {data.meetLink && (
            <a
              href={data.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/30"
            >
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold text-white">Join</span>
              </div>
            </a>
          )}
        </div>
      </div>

      {/* Time Details */}
      <div className="relative px-6 py-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">{data.date}</div>
            <div className="text-xs text-blue-300/70">{data.time} • {data.duration}</div>
          </div>
        </div>

        {data.location && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-300">{data.location}</div>
            </div>
          </div>
        )}

        {data.attendees && data.attendees.length > 0 && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-blue-300/70 mb-2">{data.attendees.length} attendees</div>
              <div className="flex flex-wrap gap-2">
                {data.attendees.slice(0, 5).map((attendee, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                      {attendee[0].toUpperCase()}
                    </div>
                    <span className="text-xs text-blue-200">{attendee}</span>
                  </div>
                ))}
                {data.attendees.length > 5 && (
                  <div className="px-2.5 py-1 rounded-lg bg-blue-500/5 border border-blue-500/10">
                    <span className="text-xs text-blue-300/70">+{data.attendees.length - 5} more</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {data.description && (
          <div className="pt-3 border-t border-gray-800/50">
            <p className="text-sm text-gray-300 leading-relaxed">{data.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}