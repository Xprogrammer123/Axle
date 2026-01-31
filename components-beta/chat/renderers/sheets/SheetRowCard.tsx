// components/chat/renderers/sheets/SheetsRowCard.tsx
'use client';

import React from 'react';
import { Table, ArrowRight, CheckCircle } from 'lucide-react';

interface SheetsRowCardProps {
  data: {
    sheetName: string;
    rowNumber: number;
    oldValues: Record<string, any>;
    newValues: Record<string, any>;
    columns: string[];
  };
  onApply?: () => void;
}

export default function SheetsRowCard({ data, onApply }: SheetsRowCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-950/30 via-gray-900 to-black shadow-2xl max-w-3xl">
      {/* Header */}
      <div className="relative px-5 py-4 border-b border-green-500/20 bg-gradient-to-r from-green-950/60 to-transparent">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/30 blur-xl rounded-full" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Table className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{data.sheetName}</h3>
            <p className="text-xs text-green-300/70">Row {data.rowNumber} Update</p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="relative px-5 py-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Column</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Old Value</th>
                <th className="w-8"></th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">New Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {data.columns.map((col, idx) => {
                const hasChanged = data.oldValues[col] !== data.newValues[col];
                return (
                  <tr key={idx} className={hasChanged ? 'bg-green-500/5' : ''}>
                    <td className="py-3 px-3 font-mono text-xs text-green-400">{col}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-lg ${hasChanged ? 'bg-red-500/10 text-red-300 line-through' : 'bg-gray-800/50 text-gray-300'} text-sm`}>
                        {data.oldValues[col] || '-'}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      {hasChanged && <ArrowRight className="w-4 h-4 text-green-400" />}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-lg ${hasChanged ? 'bg-green-500/10 text-green-300 font-semibold' : 'bg-gray-800/50 text-gray-300'} text-sm`}>
                        {data.newValues[col] || '-'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Button */}
      {onApply && (
        <div className="relative px-5 py-4 border-t border-green-500/20 bg-gradient-to-r from-green-950/40 to-transparent">
          <button
            onClick={onApply}
            className="w-full group relative px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
          >
            <div className="relative flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white">Apply Changes</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}