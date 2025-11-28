"use client";
import React, { useState } from "react";
import Image from "next/image";
import { PaperPlaneRight, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

const AskAxleChat = () => {
  const [askInput, setAskInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Ask Axle Input */}
      <div className="flex justify-center">
        <div
          onClick={() => setIsOpen(true)}
          className="bg-white/4 rounded-full flex items-center gap-4 px-6 py-3 hover:border-white/10 transition-colors w-[50%] cursor-pointer"
        >
          <Image src="/logo.svg" width="30" height="30" alt="" />
          <input
            type="text"
            value={askInput}
            onChange={(e) => setAskInput(e.target.value)}
            placeholder="Ask Axle..."
            className="flex-1 bg-transparent outline-none text-white placeholder:text-white/70 text-lg cursor-pointer"
            readOnly
          />
          <button className="bg-base hover:bg-base/90 p-3 rounded-full text-white transition-colors shrink-0 active:scale-95">
            <PaperPlaneRight size={18} />
          </button>
        </div>
      </div>

      {/* Chat Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed right-5 bottom-5 w-[400px] h-[80vh] rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Image src="/logo.svg" width="28" height="28" alt="Axle" />
                <h2 className="text-white font-semibold text-lg">Axle Chat</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div className="flex justify-end">
                <div className="bg-white/10 px-4 py-2 rounded-xl text-white text-sm">
                  Hey.
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-white/5 px-4 py-2 rounded-xl text-white/90 text-sm">
                  Hello! How may I help you today?
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-white/10 px-4 py-2 rounded-xl text-white text-sm">
                  Create an agent for me that posts on X when I create a new GitHub repo.
                </div>
              </div>

              <div className="bg-base/20 rounded-2xl p-4 mt-6">
                <p className="text-white text-sm font-semibold mb-2">
                  Creating a new Agent: “GitHub Update Agent”...
                </p>
                <div className="flex items-center justify-between text-white/80 text-sm mb-1">
                  <span>Fetching user details...</span>
                  <PaperPlaneRight size={16} />
                </div>
                <div className="flex items-center justify-between text-white/80 text-sm">
                  <span>Creating Agent...</span>
                  <PaperPlaneRight size={16} />
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-white/10 px-4 py-3 flex items-center gap-3 bg-white/5">
              <input
                type="text"
                placeholder="Ask Axle..."
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white/50 text-sm"
              />
              <button className="bg-base hover:bg-base/90 p-3 rounded-full text-white transition-transform active:scale-95">
                <PaperPlaneRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AskAxleChat;
