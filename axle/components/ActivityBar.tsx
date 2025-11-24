"use client";
import { GithubLogoIcon, GitlabLogoIcon } from "@phosphor-icons/react";
import React from "react";
import ActivityCard from "./ActivityCard";

const ActivityBar = () => {
  return (
    <div className="w-108 h-full flex flex-col">
      <div className="flex gap-3 flex-col items-center">
        <div className="h-20 w-20 bg-linear-to-br from-neutral-800 to-neutral-950 rounded-full object-cover"></div>
        <div className="flex flex-col text-center">
          <h1 className="text-2xl font-semibold text-dark">Tayo</h1>
          <p className="text-dark/50">Software Engineer</p>
        </div>
        <div className="flex gap-3">
          <div className="p-3 bg-dark/5 text-dark hover:text-white transition-all duration-300 hover:bg-base rounded-full w-hug">
            <GithubLogoIcon className="w-6 h-6" />
          </div>
          <div className="p-3 bg-dark/5 text-dark hover:text-white transition-all duration-300 hover:bg-base rounded-full w-hug">
            <GitlabLogoIcon className="w-6 h-6" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 p-7">
        <h1 className="text-xl font-medium text-dark">Activities</h1>
        <div className="flex scroll flex-col h-85.5 overflow-auto gap-2 w-full">
        <ActivityCard />
        <ActivityCard />
        <ActivityCard />
        <ActivityCard />
        <ActivityCard />
        <ActivityCard />
        <ActivityCard />
        <ActivityCard />
        <ActivityCard />
        <ActivityCard />
        <ActivityCard />    
        <ActivityCard />    
        <ActivityCard />    
        <ActivityCard />    
        <ActivityCard />    
        <ActivityCard />    
        <ActivityCard />    
        <ActivityCard />    
        <ActivityCard />    
        <ActivityCard />    
        <ActivityCard />    
        <ActivityCard />    
        </div>
      </div>
    </div>
  );
};

export default ActivityBar;
