"use client";
import React, { useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";

interface ThoughtDropdownProps {
  thought: string;
  duration: number; // in seconds
  isStreaming?: boolean;
}

export const ThoughtDropdown: React.FC<ThoughtDropdownProps> = ({ thought, duration, isStreaming = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex text-dark/35 text-[13px] items-center gap-1 cursor-pointer hover:text-dark/50 transition-colors"
      >
        {isStreaming ? (
          <>
            <span className="inline-block w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse mr-1" />
            Thinking...
          </>
        ) : (
          <>Thought{duration > 0 ? ` for ${duration}s` : ""}</>
        )}
        <CaretDownIcon 
          className={`text-[15px] text-dark/35 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      {isOpen && (
        <div className="bg-black/20 border border-white/5 rounded-xl p-3 mt-1 max-h-64 overflow-y-auto">
          <p className="text-dark/70 text-sm whitespace-pre-wrap">{thought}</p>
          {isStreaming && (
            <span className="inline-block w-1 h-4 bg-white/50 ml-1 animate-pulse" />
          )}
        </div>
      )}
    </div>
  );
};

