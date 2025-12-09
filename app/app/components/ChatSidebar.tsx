"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  PaperPlaneRight,
  CircleNotch,
  X,
  ArrowsOut,
  SidebarSimple,
  Sparkle,
  CheckCircle,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

type ViewMode = "sidebar" | "centered";

const AskAxleInput = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("sidebar");
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      name: "Axle",
      image: "/logo.svg",
      text: "Hello Tayo, How may I help you today?",
      time: "12:36 PM",
      date: "12/03/25",
    },
  ]);

  const [aiTypingText, setAiTypingText] = useState("");
  const [showPostTypingLoader, setShowPostTypingLoader] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, aiTypingText, showPostTypingLoader]);

  // Save view mode preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("axle-chat-view-mode");
      if (saved) setViewMode(saved as ViewMode);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("axle-chat-view-mode", viewMode);
    }
  }, [viewMode]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "user" as const,
      name: "Tayo",
      image: "/circle.svg",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toLocaleDateString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const aiFullText =
        "Alright, let me build your agent that creates a post on X whenever you create a new GitHub repo.";
      setAiTypingText("");

      let index = 0;
      const interval = setInterval(() => {
        setAiTypingText((prev) => prev + aiFullText[index]);
        index++;
        if (index === aiFullText.length) {
          clearInterval(interval);

          const aiMsg = {
            id: Date.now() + 1,
            sender: "ai" as const,
            name: "Axle",
            image: "/logo.svg",
            text: aiFullText,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            date: new Date().toLocaleDateString(),
          };
          setMessages((prev) => [...prev, aiMsg]);
          setAiTypingText("");

          setTimeout(() => {
            setShowPostTypingLoader(true);
            setCompletedSteps([]);

            // Simulate step completion
            setTimeout(() => {
              setCompletedSteps(["Fetching user details..."]);
            }, 1000);

            setTimeout(() => {
              setCompletedSteps([
                "Fetching user details...",
                "Creating Agent...",
              ]);
            }, 2500);

            setTimeout(() => {
              setShowPostTypingLoader(false);
              setCompletedSteps([]);
            }, 5000);
          }, 3000);
        }
      }, 30);
    }, 2500);
  };

  const steps = [
    "Fetching user details...",
    "Creating Agent...",
    "Setting up integrations...",
  ];

  return (
    <>
      {/* Bottom Input Trigger */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="flex fixed rounded-full z-50 bottom-10 backdrop-blur-2xl justify-center"
      >
        <motion.div
          // whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="relative bg-white/5 rounded-full flex items-center p-4 border-2 border-white/10 hover:border-white/20 transition-all duration-300 w-[70%] md:w-[550px] cursor-pointer shadow-lg shadow-black/20"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Image
              src="/logo.svg"
              width={30}
              height={30}
              alt="Axle Logo"
              className="drop-shadow-lg"
            />
          </motion.div>
          <input
            type="text"
            placeholder="Ask Axle..."
            readOnly
            className="flex-1 bg-transparent outline-none text-white placeholder:text-white/70 text-lg px-3 pr-14 cursor-pointer"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
            className="absolute right-3 bg-base hover:bg-base/90 p-3 rounded-full text-white transition-all shadow-lg shadow-base/30"
          >
            <PaperPlaneRight size={20} />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className={`inset-0 bg-black/60 backdrop-blur-md z-40 ${viewMode === "sidebar" ? "hidden" : "fixed"}`}
            />

            {/* Chat Container */}
            <motion.div
              initial={
                viewMode === "sidebar"
                  ? { x: "100%", opacity: 0, scale: 0.9 }
                  : { x: "-50%", y: "-50%", opacity: 0, scale: 0.9 }
              }
              animate={
                viewMode === "sidebar"
                  ? { x: 0, opacity: 1, scale: 1 }
                  : { x: "-0%", y: "-0%", opacity: 1, scale: 1 }
              }
              exit={
                viewMode === "sidebar"
                  ? { x: "100%", opacity: 0, scale: 0.9 }
                  : { x: "-50%", y: "-50%", opacity: 0, scale: 0.9 }
              }
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
                duration: 0.4,
              }}
              className={`fixed z-50 rounded-[28px] bg-white/10 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden border border-white/10 ${
                viewMode === "sidebar"
                  ? "right-10 bottom-5 w-[550px] h-[90vh]"
                  : "left-1/2 top-1/2 w-[800px] h-[85vh] -translate-x-1/2 -translate-y-1/2"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-7 pt-7 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="relative"
                  >
                    <Image
                      src="/logo.svg"
                      width={32}
                      height={32}
                      alt="Axle"
                      className="rounded-full bg-white/10 p-1.5"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-base rounded-full border-2 border-white/10"
                    />
                  </motion.div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Axle AI</h3>
                    <p className="text-white/50 text-xs">Always here to help</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* View Toggle */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      setViewMode(
                        viewMode === "sidebar" ? "centered" : "sidebar"
                      )
                    }
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
                    title={`Switch to ${
                      viewMode === "sidebar" ? "centered" : "sidebar"
                    } view`}
                  >
                    {viewMode === "sidebar" ? (
                      <ArrowsOut size={18} />
                    ) : (
                      <SidebarSimple size={18} />
                    )}
                  </motion.button>
                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              </div>

              {/* Chat Body */}
              <div
                ref={chatBodyRef}
                className="flex-1 overflow-y-auto px-7 py-6 space-y-6 scrollbar-none"
              >
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-0 flex flex-col justify-center items-center text-center px-8"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Sparkle size={48} className="text-base mb-4" />
                    </motion.div>
                    <p className="text-white/50 text-2xl font-medium">
                      Prompt Axle to get started
                    </p>
                    <p className="text-white/30 text-sm mt-2">
                      Ask me anything about your agents or automations
                    </p>
                  </motion.div>
                )}

                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.05,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className={`flex flex-col ${
                        msg.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-2 mb-1"
                      >
                        {msg.sender === "ai" && (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="relative"
                          >
                            <Image
                              src={msg.image}
                              width={28}
                              height={28}
                              alt={msg.name}
                              className="rounded-full bg-white/10 p-1"
                            />
                          </motion.div>
                        )}
                        <span className="text-white font-semibold text-sm">
                          {msg.name}
                        </span>
                        {msg.sender === "user" && (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="relative"
                          >
                            <Image
                              src={msg.image}
                              width={28}
                              height={28}
                              alt={msg.name}
                              className="rounded-full"
                            />
                          </motion.div>
                        )}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="text-white/50 text-xs mb-2"
                      >
                        {msg.time} • {msg.date}
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`px-4 py-3 rounded-2xl text-white text-sm max-w-[80%] shadow-lg ${
                          msg.sender === "user"
                            ? "bg-base/20 border border-base/30"
                            : "bg-white/5 border border-white/10"
                        }`}
                      >
                        {msg.text}
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* AI Typing Indicator */}
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-start"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Image
                          src="/logo.svg"
                          width={28}
                          height={28}
                          alt="Axle"
                          className="rounded-full bg-white/10 p-1"
                        />
                      </motion.div>
                      <span className="text-white font-semibold text-sm">
                        Axle is typing
                      </span>
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 flex gap-1.5 items-center">
                      <motion.span
                        className="w-2 h-2 bg-base rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0,
                        }}
                      />
                      <motion.span
                        className="w-2 h-2 bg-base rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                      />
                      <motion.span
                        className="w-2 h-2 bg-base rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* AI Typing Text Effect */}
                {aiTypingText && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-start"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Image
                        src="/logo.svg"
                        width={28}
                        height={28}
                        alt="Axle"
                        className="rounded-full bg-white/10 p-1"
                      />
                      <span className="text-white font-semibold text-sm">
                        Axle
                      </span>
                    </div>
                    <div className="text-white/50 text-xs mb-2">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      • {new Date().toLocaleDateString()}
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm max-w-[80%]"
                    >
                      {aiTypingText}
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="ml-1"
                      >
                        |
                      </motion.span>
                    </motion.div>
                  </motion.div>
                )}

                {/* Loader Section */}
                <AnimatePresence>
                  {showPostTypingLoader && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      transition={{ duration: 0.4, type: "spring" }}
                      className="absolute bottom-[100px] left-7 right-7 bg-[#161616] rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        className="absolute top-0 left-0 h-1 bg-linear-to-r from-base to-base/50"
                      />
                      <div className="text-white font-semibold mb-4 bg-base/20 p-6 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <CircleNotch size={20} className="text-base" />
                          </motion.div>
                          <span className="text-base">
                            Creating a new Agent: &quot;GitHub Update
                            Agent&quot;...
                          </span>
                        </div>
                      </div>
                      <div className="px-6 pb-6 space-y-3">
                        {steps.map((step, index) => {
                          const isCompleted = completedSteps.includes(step);
                          const isActive =
                            !isCompleted &&
                            (index === 0 ||
                              completedSteps.includes(steps[index - 1]));

                          return (
                            <motion.div
                              key={step}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{
                                opacity: isCompleted || isActive ? 1 : 0.5,
                                x: 0,
                              }}
                              transition={{ delay: index * 0.2 }}
                              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                                isCompleted
                                  ? "bg-base/10 border-base/30"
                                  : isActive
                                  ? "bg-white/5 border-white/10"
                                  : "bg-white/2 border-white/5"
                              }`}
                            >
                              <span
                                className={`text-sm font-medium ${
                                  isCompleted
                                    ? "text-base"
                                    : isActive
                                    ? "text-white/90"
                                    : "text-white/50"
                                }`}
                              >
                                {step}
                              </span>
                              {isCompleted ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 200,
                                  }}
                                >
                                  <CheckCircle
                                    size={20}
                                    className="text-base"
                                    weight="fill"
                                  />
                                </motion.div>
                              ) : isActive ? (
                                <div className="bg-base/20 w-5 h-5 rounded-full flex items-center justify-center">
                                  <CircleNotch
                                    size={12}
                                    className="text-base animate-spin"
                                  />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-7 pb-7 pt-4 border-t border-white/10">
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="bg-[#151515] px-4 py-3 flex items-center gap-3 rounded-full border border-white/10 focus-within:border-base/50 transition-all shadow-lg"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && handleSend()
                    }
                    placeholder="Ask Axle..."
                    className="flex-1 bg-transparent outline-none text-white placeholder:text-white/50 text-sm"
                    disabled={typing || showPostTypingLoader}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSend}
                    disabled={!input.trim() || typing || showPostTypingLoader}
                    className="bg-base hover:bg-base/90 p-3 rounded-full text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-base/30"
                  >
                    <PaperPlaneRight size={18} weight="fill" />
                  </motion.button>
                </motion.div>
                <p className="text-white/50 text-xs mt-2 text-center">
                  Press Enter to send • Shift+Enter for new line
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AskAxleInput;
