"use client";
import React, { useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";

interface ThinkingDropdownProps {
  thinking: string;
}

export const ThinkingDropdown: React.FC<ThinkingDropdownProps> = ({ thinking }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!thinking || !thinking.trim()) return null;

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-dark/40 hover:text-dark/60 transition-colors group"
        style={{ fontSize: '9px' }}
      >
        <span className="inline-block w-1 h-1 bg-white/30 rounded-full animate-pulse" />
        <span className="text-[9px]">Thought</span>
        <CaretDownIcon
          className={`text-[7px] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-1.5 w-72 max-w-[85vw] bg-black/80 backdrop-blur-xl border border-white/15 rounded-lg p-2.5 text-dark/70 z-50 fade-in slide-in-from-bottom-2 shadow-xl" style={{ fontSize: '10px', lineHeight: '1.4' }}>
          <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <p className="whitespace-pre-wrap font-normal">{thinking}</p>
          </div>
        </div>
      )}
    </div>
  );
};

