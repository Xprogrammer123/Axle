"use client";
import React from "react";

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser }) => {
  if (isUser) {
    return (
      <div className="items-center flex gap-3.5 bg-white/3 border-2 border-white/5 rounded-2xl text-white/50 p-3 w-fit ml-auto">
        {message}
      </div>
    );
  }

  return (
    <div className="items-center flex gap-3.5 bg-white/3 border-2 border-white/5 rounded-2xl text-white/50 p-3 w-fit">
      {message}
    </div>
  );
};

