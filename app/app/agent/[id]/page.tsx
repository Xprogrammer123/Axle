"use client";
import ModelMessageCard from "@/components/ModelMessageCard";
import UserMessageCard from "@/components/UserMessageCard";
import { PaperPlaneRightIcon } from "@phosphor-icons/react";
import React, { useState } from "react";

const page = () => {

    const [loading, setLoading] = useState(false);
    const [val, setVal] = useState("");

    const conversation = [
        {
            id: 1,
            role: "user",
            message: "Connect to Axle Api repo in my github.",
            time: "12:35 PM 12/01/26"
        },
        {
            id: 2,
            role: "model",
            message: "Alright! let me get your details to create a secure connection.",
            taskCompleted: "Connected to https://github.com/therealteejay25/Axle-Api",
            icon: null,
            time: "12:35 PM 12/01/26"
        },
    ];

    const handleSubmit = () => {
      const objModel = {
            id: conversation.length + 2,
            role: "user",
            message: val,
            time: Date.now()
      }
    }

  return (
    <div className='w-full flex flex-col gap-6 items-center p-6 bg-bg rounded-t-2xl'>
      
        <div className="h-115 overflow-auto scroll max-w-4xl w-full">
        <UserMessageCard />
        <ModelMessageCard />
        <UserMessageCard />
        </div>
        <div className="max-w-4xl w-full bg-card p-4 rounded-2xl flex flex-col gap-6">
          <input
            type="text"
            placeholder="Type a command here..."
            className="outline-0 w-full"
            onChange={(e) => {
              setVal(e.target.value)
            }}
          />
          <div className="flex justify-between outline-0 items-center">
            <select className="p-2 rounded-lg bg-dark/3">
              <option value="script">Script</option>
              <option value="script">Cron Job</option>
              <option value="script">CI/CD</option>
              <option value="script">PR Summaries</option>
            </select>
            <div
              onClick={() => setLoading(true)}
              className="bg-base p-2 rounded-lg cursor-pointer"
            >
              {loading ? (
                <div className="loader-light"></div>
              ) : (
                <PaperPlaneRightIcon className="h-5 w-5 text-white" />
              )}
            </div>
          </div>
        </div>
    </div>
  )
}

export default page