"use client";
import {
  ActivityIcon,
  LightningIcon,
  PlusIcon,
  SlackLogoIcon,
  MicrophoneIcon,
  CaretDownIcon,
  PaperPlaneRight,
  Repeat,
} from "@phosphor-icons/react";
import React, { useState } from "react";
import Image from "next/image";

const Page = () => {
  const [askInput, setAskInput] = useState("");

  const automationUpdates = [
    {
      id: 1,
      initial: "A",
      name: "Agent Alpha",
      description: "Automation completed successfully",
    },
    {
      id: 2,
      initial: "B",
      name: "Agent Beta",
      description: "Task automation in progress",
    },
    {
      id: 3,
      initial: "G",
      name: "Agent Gamma",
      description: "Last updated 2 hours ago",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-dark">
      {/* Top Header Bar */}
      <div className="border-b border-white/5 px-8 py-6 flex justify-between items-center">
        <p className="text-white text-4xl font-semibold">Welcome Back, Tayo!</p>

        <button className="flex items-center gap-4 px-6 py-2 rounded-full border border-white/4 hover:bg-white/5 transition-colors bg-white/4">
          <Image
            src="/logo.svg"
            width="30"
            height="30"
            alt="User avatar"
            className="rounded-full"
          />
          <span className="text-white/80 font-bold">Tayo</span>
          <CaretDownIcon size={16} className="text-white/60" weight="fill" />
        </button>
      </div>

      {/* Main Section */}
      <div className="px-8 py-8">
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Running Agents */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <ActivityIcon size={20} className="text-white/60" />
              <h2 className="text-white text-sm font-semibold">
                Running Agents
              </h2>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/2 rounded-xl p-4 flex items-center justify-between border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 rounded-full bg-base/30 flex items-center justify-center text-base text-sm font-semibold shrink-0">
                      M
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">My Agent</p>
                      <p className="text-white/40 text-xs">
                        My agent is currently running here
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-base flex items-center justify-center text-white shrink-0">
                      <span className="text-xs">↗</span>
                    </div>
                    <button className="bg-base hover:bg-base/90 text-white px-6 py-2 rounded-full text-xs font-semibold transition-colors shrink-0">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Automation Updates */}
          <div className="bg-white/5 rounded-lg">
            <div className="flex items-center gap-2 mb-6">
              <Repeat size={30} className="text-white/60" />
              <h2 className="text-white text-md font-semibold">
                Automation Updates
              </h2>
            </div>

            <div className="space-y-4">
              {automationUpdates.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-white/2 rounded-xl p-4 flex items-center justify-between border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 rounded-full bg-base/30 flex items-center justify-center text-base text-sm font-semibold shrink-0">
                      {agent.initial}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">
                        {agent.name}
                      </p>
                      <p className="text-white/40 text-xs">
                        {agent.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-base flex items-center justify-center text-white shrink-0">
                      <span className="text-xs">✓</span>
                    </div>
                    <button className="bg-base hover:bg-base/90 text-white px-6 py-2 rounded-full text-xs font-semibold transition-colors shrink-0">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Create Agent Card */}
          <div className="bg-white/2 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-colors flex flex-col items-center justify-center text-center min-h-[280px]">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-white font-semibold mb-3">
              Have a thing task that you need to automate?
            </h3>
            <p className="text-white/50 text-sm mb-6">
              Create an agent today and watch your tasks being done in real
              time.
            </p>
            <button className="bg-base hover:bg-base/90 text-white px-8 py-2 rounded-full font-semibold text-sm transition-colors">
              Create an Agent
            </button>
          </div>

          {/* Axle Insights Card */}
          <div className="bg-white/2 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-6">
              <LightningIcon size={20} className="text-base" />
              <h2 className="text-white text-sm font-semibold">
                Axle Insights
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <LightningIcon size={18} className="text-base mt-1 shrink-0" />
                <p className="text-white/70 text-sm leading-relaxed">
                  Lorem ipsum dolor sit amet consectetur adipiscing elit.
                  Quisque
                </p>
              </div>
              <div className="flex items-start gap-3">
                <LightningIcon size={18} className="text-base mt-1 shrink-0" />
                <p className="text-white/70 text-sm leading-relaxed">
                  Lorem ipsum dolor sit amet consectetur adipiscing elit.
                  Quisque
                </p>
              </div>
              <div className="flex items-start gap-3">
                <LightningIcon size={18} className="text-base mt-1 shrink-0" />
                <p className="text-white/70 text-sm leading-relaxed">
                  Lorem ipsum dolor sit amet consectetur adipiscing elit.
                  Quisque
                </p>
              </div>
            </div>
          </div>

          {/* Slack Card */}
          <div className="bg-white/2 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-colors flex flex-col items-center justify-center text-center min-h-[280px]">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-white font-semibold mb-3">
              You've not connected your Slack
            </h3>
            <p className="text-white/50 text-sm mb-6">
              Connect your Slack today and automate your task being done in real
              time.
            </p>
            <button className="bg-base hover:bg-base/90 text-white px-8 py-2 rounded-full font-semibold text-sm transition-colors">
              Connect your Slack
            </button>
          </div>
        </div>

        {/* Ask Axle Input */}
        <div className="flex justify-center">
          <div className="bg-white/4 rounded-full flex items-center gap-4 px-6 py-3 hover:border-white/10 transition-colors w-[50%]">
            <Image src="/logo.svg" width="30" height="30" alt="" />
            <input
              type="text"
              value={askInput}
              onChange={(e) => setAskInput(e.target.value)}
              placeholder="Ask Axle..."
              className="flex-1 bg-transparent outline-none text-white placeholder:text-white/70 text-lg"
            />
            <button className="bg-base hover:bg-base/90 p-3 rounded-full text-white transition-colors shrink-0 active:scale-95">
              <PaperPlaneRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
