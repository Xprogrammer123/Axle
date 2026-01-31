
// components/chat/renderers/drive/DriveFileCard.tsx
'use client';

import React from 'react';
import { File, FileText, Image, Video, Music, Archive, Link, Download, Share2 } from 'lucide-react';

interface DriveFileCardProps {
  data: {
    name: string;
    type: string;
    size: string;
    mimeType: string;
    modifiedTime: string;
    webViewLink?: string;
    downloadLink?: string;
  };
  onShare?: () => void;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.includes('image')) return Image;
  if (mimeType.includes('video')) return Video;
  if (mimeType.includes('audio')) return Music;
  if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText;
  if (mimeType.includes('zip') || mimeType.includes('compressed')) return Archive;
  return File;
};

const getFileColor = (mimeType: string) => {
  if (mimeType.includes('image')) return { from: 'from-pink-500', to: 'to-pink-600', border: 'border-pink-500/20', bg: 'bg-pink-500/10' };
  if (mimeType.includes('video')) return { from: 'from-purple-500', to: 'to-purple-600', border: 'border-purple-500/20', bg: 'bg-purple-500/10' };
  if (mimeType.includes('document')) return { from: 'from-blue-500', to: 'to-blue-600', border: 'border-blue-500/20', bg: 'bg-blue-500/10' };
  return { from: 'from-gray-500', to: 'to-gray-600', border: 'border-gray-500/20', bg: 'bg-gray-500/10' };
};

export default function DriveFileCard({ data, onShare }: DriveFileCardProps) {
  const FileIcon = getFileIcon(data.mimeType);
  const colors = getFileColor(data.mimeType);

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${colors.border} bg-gradient-to-br from-gray-900 via-gray-950 to-black shadow-2xl max-w-md`}>
      {/* Header */}
      <div className={`relative px-5 py-4 border-b ${colors.border}`}>
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className={`absolute inset-0 ${colors.bg} blur-xl rounded-2xl`} />
            <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center shadow-lg`}>
              <FileIcon className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white truncate mb-1">{data.name}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{data.type}</span>
              <span>•</span>
              <span>{data.size}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="relative px-5 py-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Modified</span>
          <span className="text-gray-300 font-medium">{data.modifiedTime}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Type</span>
          <span className="text-gray-300 font-mono text-[10px]">{data.mimeType.split('/')[1]}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="relative px-5 py-4 border-t border-gray-800/50 flex gap-2">
        {data.webViewLink && (
          <a
            href={data.webViewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all"
          >
            <Link className="w-4 h-4 text-gray-300" />
            <span className="text-sm font-medium text-gray-300">View</span>
          </a>
        )}
        {data.downloadLink && (
          <a
            href={data.downloadLink}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all"
          >
            <Download className="w-4 h-4 text-gray-300" />
            <span className="text-sm font-medium text-gray-300">Download</span>
          </a>
        )}
        {onShare && (
          <button
            onClick={onShare}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r ${colors.from} ${colors.to} hover:opacity-90 transition-all`}
          >
            <Share2 className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Share</span>
          </button>
        )}
      </div>
    </div>
  );
}