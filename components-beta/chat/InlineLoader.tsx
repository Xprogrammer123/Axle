"use client";
import React from "react";

export const InlineLoader = () => {
  return (
    <div className="flex items-center gap-1">
      <div
        className="w-1.5 h-1.5 bg-text/40 rounded-full animate-pulse"
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className="w-1.5 h-1.5 bg-text/40 rounded-full animate-pulse"
        style={{ animationDelay: "150ms" }}
      ></div>
      <div
        className="w-1.5 h-1.5 bg-text/40 rounded-full animate-pulse"
        style={{ animationDelay: "300ms" }}
      ></div>
    </div>
  );
};
