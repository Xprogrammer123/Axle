"use client";
import {
  CaretDownIcon,
  PaperPlaneRight,
  Repeat,
  ArrowUpRight,
} from "@phosphor-icons/react";
import React, { useState } from "react";
import Image from "next/image";
import AxleInput from "./components/ChatSidebar"

const Page = () => {
  const [askInput, setAskInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const automationUpdates = [
    {
      id: 1,
      image: "/gmail.svg",
      name: "My Agent",
      description: "Automation completed successfully",
    },
    {
      id: 2,
      image: "/slack.svg",
      name: "My Agent",
      description: "Task automation in progress",
    },
    {
      id: 3,
      image: "/gmail.svg",
      name: "My Agent",
      description: "Last updated 2 hours ago",
    },
  ];

  const Runningautomation = [
    {
      id: 1,
      image: "/gmail.svg",
      name: "My Agent",
      description: "Automation completed successfully",
    },
    {
      id: 2,
      image: "/slack.svg",
      name: "My Agent",
      description: "Task automation in progress",
    },
    {
      id: 3,
      image: "/gmail.svg",
      name: "My Agent",
      description: "Last updated 2 hours ago",
    },
  ];

  const Axleinsights = [
    {
      id: 1,
      image: "/logo.svg",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, aliquid dignissimos!",
    },
    {
      id: 2,
      image: "/logo.svg",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, aliquid dignissimos!",
    },
    {
      id: 3,
      image: "/logo.svg",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, aliquid dignissimos!",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-dark">
      {/* Top Header Bar */}
    
      {/* Main Section */}
      <div className="px-8 py-8">
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-white/2 rounded-4xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Repeat size={30} className="text-white" />
              <h2 className="text-white text-md font-semibold">
                Running Agents
              </h2>
            </div>

            <div className="space-y-4">
              {automationUpdates.map((running) => (
                <div
                  key={running.id}
                  className="bg-white/3 rounded-2xl px-4 py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="">
                      <Image
                        src={running.image}
                        alt="logo"
                        width="30"
                        height="30"
                      />
                    </div>
                    <div className="flex-1 gap-1">
                      <p className="text-white text-md font-medium">
                        {" "}
                        {running.name}
                      </p>
                      <p className="text-white/40 text-xs">
                        {running.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-base flex items-center justify-center text-white shrink-0">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        
          <div className="bg-white/2 rounded-4xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Repeat size={30} className="text-white" />
              <h2 className="text-white text-md font-semibold">
                Automation Updates
              </h2>
            </div>

            <div className="space-y-4">
              {Runningautomation.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-white/3 rounded-2xl px-4 py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="">
                      <Image
                        src={agent.image}
                        alt="logo"
                        width="30"
                        height="30"
                      />
                    </div>
                    <div className="flex-1 gap-1">
                      <p className="text-white text-md font-medium">
                        {agent.name}
                      </p>
                      <p className="text-white/40 text-xs">
                        {agent.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="bg-base hover:bg-base/90 text-white px-8 py-3 rounded-full text-xs font-semibold transition-colors shrink-0">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      
        <div className="grid grid-cols-3 gap-6">
         
          <div className="bg-white/2 rounded-4xl px-8 py-10 flex flex-col items-center justify-center text-center ">
            <h3 className="text-white font-semibold mb-3 text-2xl ">
              Have a thing task that you need to automate?
            </h3>
            <p className="text-white/50 text-sm mb-6 max-w-mb">
              Create an agent today and <br /> watch your tasks being done in
              real time.
            </p>
            <button className="bg-base hover:bg-base/90 text-white px-8 py-3 rounded-full font-semibold text-sm transition-colors">
              Create an Agent
            </button>
          </div>

          
          <div className="bg-white/2 rounded-4xl p-8 md:py-6 md:px-6">
          
            <div className="flex items-center gap-3 mb-5">
              <Repeat size={26} className="text-white" />
              <h2 className="text-white text-xl font-semibold">
                Axle Insights
              </h2>
            </div>

            {/* Insights List */}
            <div className="space-y-2">
              {Axleinsights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white/2 py-4 px-3 rounded-2xl"
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={insight.image}
                      width={28}
                      height={28}
                      alt="Insight logo"
                      className=""
                    />
                  </div>
                  <p className="text-white/80 text-base text-xs">
                    {insight.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

         
          <div className="bg-white/2 rounded-4xl px-16 py-10 flex flex-col items-center justify-center text-center">
            <h3 className="text-white font-semibold mb-3 text-2xl ">
              You've not connected your Slack
            </h3>
            <p className="text-white/50 text-sm mb-6 max-w-mb">
              Connect your Slack today and automate your task being done in real
              time.
            </p>
            <button className="bg-base hover:bg-base/90 text-white px-8 py-3 rounded-full font-semibold text-sm transition-colors">
              Connect your Slack
            </button>
          </div>
        </div>

        {/* Ask Axle Input */}
        <div className="flex justify-center">
        <AxleInput/>
        </div>
      </div>
    </div>
  );
};

export default Page;
