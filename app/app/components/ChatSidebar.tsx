"use client";
import React, { useState } from "react";
import Image from "next/image";
import { PaperPlaneRight, CircleNotch } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

const AskAxleInput = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false); 
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      name: "Axle",
      image: "/axle.svg",
      text: "Hello Tayo, How may I help you today?",
      time: "12:36 PM",
      date: "12/03/25",
    },
  ]);
  const [aiTypingText, setAiTypingText] = useState(""); 
  const [showPostTypingLoader, setShowPostTypingLoader] = useState(false); 

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMsg = {
      sender: "user",
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
            sender: "ai",
            name: "Axle",
            image: "/axle.svg",
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
            setTimeout(() => setShowPostTypingLoader(false), 5000);
          }, 3000); 
        }
      }, 30); 
    }, 2500); 
  };

  return (
    <>
      <div className="flex fixed rounded-full z-50 bottom-10 backdrop-blur-2xl justify-center">
        <div
          onClick={() => setIsOpen(true)}
          className="relative bg-white/5 rounded-full flex items-center p-4 border-2 border-white/2  transition-colors w-[70%] md:w-[550px] cursor-pointer"
        >
          <Image src="/logo.svg" width={30} height={30} alt="Axle Logo" />
          <input
            type="text"
            placeholder="Ask Axle..."
            readOnly
            className="flex-1 bg-transparent outline-none text-white placeholder:text-white/70 text-lg px-3 pr-14 cursor-pointer"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
            className="absolute right-3 bg-base hover:bg-base/90 p-3 rounded-full text-white transition-transform active:scale-95"
          >
            <PaperPlaneRight size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar Chat */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
            />

            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed right-10 bottom-5 w-[550px] h-[90vh] rounded-[28px] bg-white/10 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden z-50 px-7 py-7"
            >
              {/* Chat Body */}
              <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 scrollbar-none">
                {messages.length === 0 && (
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
                    <p className="text-white/50 text-2xl">
                      Prompt Axle to get started
                    </p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      msg.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {msg.sender === "ai" && (
                        <Image
                          src={msg.image}
                          width={28}
                          height={28}
                          alt={msg.name}
                          className="rounded-full bg-white/4"
                        />
                      )}
                      <div className="text-white font-semibold text-md">
                        {msg.name}
                      </div>
                      {msg.sender === "user" && (
                        <Image
                          src={msg.image}
                          width={28}
                          height={28}
                          alt={msg.name}
                          className="rounded-full"
                        />
                      )}
                    </div>
                    <div className="text-white/50 text-xs mb-1">
                      {msg.time} • {msg.date}
                    </div>

                    <div
                      className={`px-4 py-2 rounded-2xl text-white text-md max-w-[80%] ${
                        msg.sender === "user" ? "bg-white/10" : "bg-white/5"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* AI Typing Indicator (side chat) */}
                {typing && (
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <Image
                        src="/axle.svg"
                        width={28}
                        height={28}
                        alt="Axle"
                        className="rounded-full bg-white/4"
                      />
                      <div className="text-white font-semibold text-md">
                        Axle is typing
                      </div>
                    </div>
                    <div className="px-4 py-2 rounded-2xl text-white text-sm max-w-[80%] bg-white/5 flex gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></span>
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></span>
                    </div>
                  </div>
                )}

                {/* AI Typing Text Effect */}
                {aiTypingText && (
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <Image
                        src="/axle.svg"
                        width={28}
                        height={28}
                        alt="Axle"
                        className="rounded-full bg-white/4"
                      />
                      <div className="text-white font-semibold text-md">
                        Axle
                      </div>
                    </div>
                    <div className="text-white/50 text-xs mb-1">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      • {new Date().toLocaleDateString()}
                    </div>
                    <div className="px-4 py-2 rounded-2xl text-white text-sm max-w-[80%] bg-white/5">
                      {aiTypingText}
                    </div>
                  </div>
                )}
              </div>

              {/* Loader Section (after AI finishes typing) */}
              <AnimatePresence>
                {showPostTypingLoader && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-[80px] left-7 right-7 bg-[#161616] rounded-t-2xl text-sm z-50"
                  >
                    <div className="text-white font-semibold mb-3 bg-base p-6 rounded-t-2xl text-md">
                      Creating a new Agent: “GitHub Update Agent”...
                    </div>
                    <div className="px-5">
                      <div className="flex items-center justify-between text-white/90 mb-2 bg-white/2 p-4 rounded-2xl">
                        <span>Fetching user details...</span>
                        <div className="bg-base w-5 h-5 p-4 rounded-full flex items-center justify-center text-white">
                          <CircleNotch
                            size={12}
                            className="text-white animate-spin"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-white/90 mb-2 bg-white/2 p-4 rounded-2xl">
                        <span>Creating Agent...</span>
                        <div className="bg-base w-5 h-5 p-4 rounded-full flex items-center justify-center text-white">
                          <CircleNotch
                            size={12}
                            className="text-white animate-spin"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input */}
              <div className="bg-[#151515] px-4 py-3 flex items-center gap-3 relative rounded-full">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask Axle..."
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-white/50 text-sm"
                  disabled={typing || showPostTypingLoader}
                />
                <button
                  onClick={handleSend}
                  className="bg-base hover:bg-base/90 p-3 rounded-full text-white transition-transform active:scale-95 disabled:opacity-50"
                  disabled={!input.trim() || typing || showPostTypingLoader}
                >
                  <PaperPlaneRight size={18} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AskAxleInput;
