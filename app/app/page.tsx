"use client";
import { PaperPlaneRightIcon, TerminalWindowIcon, ClockCounterClockwiseIcon, GitBranchIcon, GitPullRequestIcon } from "@phosphor-icons/react";
import React, { useState } from "react";

const page = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full flex flex-col gap-6 items-center justify-center p-6 bg-bg rounded-t-2xl">
      <div className="max-w-4xl flex flex-col gap-6 w-full">
        <div className="w-full flex-flex-col gap-2">
          <h2 className="text-2xl font-semibold text-dark">Hey Tayo.</h2>
          <h1 className="text-3xl font-semibold text-dark/50">
            What are you building today?
          </h1>
        </div>
        <div className="w-full bg-card p-4 rounded-2xl flex flex-col gap-6">
          <input
            type="text"
            placeholder="Type a command here..."
            className="outline-0 w-full"
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
      <div className="max-w-4xl grid grid-cols-4 gap-6 w-full">
        <div className="flex flex-col bg-card hover:scale-105 transition-all duration-300 rounded-2xl p-4 gap-2">
            <TerminalWindowIcon className="h-5 w-5 text-dark/50" />
          <p className="text-dark">
            Write me a script that allows me to push to
            multiple repos at once.
          </p>
        </div>
        <div className="flex flex-col bg-card hover:scale-105 transition-all duration-300 rounded-2xl p-4 gap-2">
            <ClockCounterClockwiseIcon className="h-5 w-5 text-dark/50" />
          <p className="text-dark">
            Write me a script that allows me to push to
            multiple repos at once.
          </p>
        </div>
        <div className="flex flex-col bg-card hover:scale-105 transition-all duration-300 rounded-2xl p-4 gap-2">
            <GitBranchIcon className="h-5 w-5 text-dark/50" />
          <p className="text-dark">
            Write me a script that allows me to push to
            multiple repos at once.
          </p>
        </div>
        <div className="flex flex-col bg-card hover:scale-105 transition-all duration-300 rounded-2xl p-4 gap-2">
            <GitPullRequestIcon className="h-5 w-5 text-dark/50" />
          <p className="text-dark">
            Write me a script that allows me to push to
            multiple repos at once.
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
