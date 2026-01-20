"use client";
import React from "react";
import { motion } from "framer-motion";

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser }) => {
  if (isUser) {
    return (
      <motion.div
        className="items-center flex gap-3.5 bg-white/75 border-2 border-white/5 rounded-2xl text-dark/75 p-3 w-fit ml-auto"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
          opacity: { duration: 0.2 }
        }}
      >
        {message}
      </motion.div>
    );
  }

  return (
    <div className="items-center flex gap-3.5 bg-white/75 border-2 border-white/5 rounded-2xl text-dark/75 p-3 w-fit">
      {message}
    </div>
  );
};

