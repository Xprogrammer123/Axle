"use client";

import React from "react";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaperPlaneRight } from "@phosphor-icons/react";
import Image from "next/image";

const Home = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center text-center bg-black text-white relative overflow-hidden">
        <Header />

        <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-5 py-3 rounded-full mb-6 shadow-md">
          <div className="flex -space-x-2">
            {[...Array(4)].map((_, i) => (
              <Image
                key={i}
                src="/logo.svg"
                alt="user"
                width={40}
                height={40}
                className="rounded-full border-2 border-black"
              />
            ))}
          </div>
          <span className="text-lg text-neutral-400 ">
            Join the world’s best agent community today
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight max-w-8xl">
          Where Strategy <br /> Meets Automation to Drive Results.
        </h1>
        <p className="text-neutral-400 mt-4 text-2xl max-w-5xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat,
          aliquid dignissimos! Beatae quibusdam vitae quas reiciendis, error
          dolor velit.
        </p>

        <div className="relative flex flex-col bg-white/5 border border-white/10 mt-8 rounded-4xl px-6 py-5 h-44 w-[90%] md:w-[800px] mb-28">
          <Input
            placeholder="Ask Axle..."
            className="bg-transparent text-xl border-none text-white px-4 pt-2 focus:outline-none focus:ring-0 focus-visible:ring-0 placeholder:text-xl placeholder:text-white/50"
          />

          <Button className="absolute bottom-3 right-3 bg-green-500 hover:bg-green-400 rounded-full p-4">
            <PaperPlaneRight size={30} className="text-white" />
          </Button>
        </div>

        <div className="">
          <Image
            width={1400}
            height={1400}
            src="/stuff.svg"
            alt="user"
            className="rounded-full border-2 border-black"
          />
        </div>
      </div>
    </>
  );
};

export default Home;
