
'use client';

import React, { useState } from 'react';
import { CircleDot, Tag, MessageSquare, Send } from 'lucide-react';

interface GitHubIssueCardProps {
  data: {
    repo: string;
    number: number;
    title: string;
    author: string;
    status: 'open' | 'closed';
    labels: string[];
    comments: number;
  };
  onComment?: (comment: string) => void;
}

export default function GitHubIssueCard({ data, onComment }: GitHubIssueCardProps) {
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);

  const handleSubmit = () => {
    if (onComment && comment.trim()) {
      onComment(comment);
      setComment('');
      setShowCommentBox(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-950/30 via-gray-900 to-gray-950 shadow-2xl max-w-2xl">
      {/* Header */}
      <div className="relative px-6 py-4 border-b border-green-500/20">
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/30 blur-xl rounded-full" />
            <div className={`relative w-10 h-10 rounded-xl ${data.status === 'open' ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-purple-500 to-purple-600'} flex items-center justify-center`}>
              <CircleDot className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-bold text-white">{data.title}</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${data.status === 'open' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                {data.status}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              #{data.number} • opened by @{data.author} • {data.repo}
            </div>
          </div>
        </div>
      </div>

      {/* Labels */}
      {data.labels.length > 0 && (
        <div className="relative px-6 py-3 border-b border-gray-800/50">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-gray-400" />
            {data.labels.map((label, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-300">
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="relative px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MessageSquare className="w-4 h-4" />
            <span>{data.comments} comments</span>
          </div>
          {!showCommentBox && (
            <button
              onClick={() => setShowCommentBox(true)}
              className="px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-xs font-medium text-green-400 transition-all"
            >
              Add Comment
            </button>
          )}
        </div>

        {showCommentBox && (
          <div className="space-y-3">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              rows={4}
              className="w-full px-4 py-3 bg-black/40 border border-green-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={!comment.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-700 disabled:to-gray-800 text-white text-sm font-medium transition-all"
              >
                <Send className="w-4 h-4" />
                Comment
              </button>
              <button
                onClick={() => {
                  setShowCommentBox(false);
                  setComment('');
                }}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}