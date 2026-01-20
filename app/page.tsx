"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRightIcon,
  BrainIcon,
  CaretDownIcon,
  ChartBarIcon,
  ChartLineUpIcon,
  CheckIcon,
  LightningIcon,
  PlugIcon,
  ShieldCheckIcon,
  SquaresFourIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components-beta/Button";
import { MarqueeDemo } from "../components-beta/Testimonials";
import { Footer } from "@/components-beta/Footer";
import { useState } from "react";

const faqs = [
  {
    question: "What is Axle?",
    answer:
      "Axle is a platform for creating, configuring, and controlling AI agents without code. You define behavior, connect tools, and deploy from one dashboard.",
  },
  {
    question: "Is Axle just another chatbot?",
    answer:
      "No. Axle agents take actions, follow rules, and run workflows across real tools. They’re autonomous systems, not chat-only bots.",
  },
  {
    question: "Do I need technical knowledge?",
    answer:
      "No. Axle is built for non-technical users. If you can explain what you want an agent to do, you can build one.",
  },
  {
    question: "What tools can agents connect to?",
    answer:
      "Agents can connect to tools like GitHub, Google, and X. You control permissions at all times.",
  },
  {
    question: "Can agents act without my control?",
    answer:
      "No. Every agent operates within boundaries you define. Nothing runs or takes action without permission.",
  },
  {
    question: "What happens if I cancel?",
    answer:
      "Cancel anytime. No lock-in. Your agents stop running and you keep control of your data.",
  },
]


export default function Home() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  return (
    <main className="overflow-x-hidden w-screen px-7 flex flex-col items-center bg-[#F1F1F1]">
      <div className="fixed flex justify-between z-50 border-4 border-dark/5 w-[90%] md:w-full max-w-5xl my-7 mx-7 bg-white/50 rounded-full p-2.5 pl-6 backdrop-blur-md inset-shadow-lg inset-shadow-dark shadow-lg shadow-dark/2">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/beta/logo.svg" alt="Logo" width={30} height={30} />
        </Link>
        <div className="md:flex hidden gap-5 font-medium items-center">
          <a
            className="transition-all duration-300 hover:text-accent text-dark/80"
            href="#"
          >
            Services
          </a>
          <a
            className="transition-all duration-300 hover:text-accent text-dark/80"
            href="#"
          >
            How It Works
          </a>
          <a
            className="transition-all duration-300 hover:text-accent text-dark/80"
            href="#"
          >
            Testimonials
          </a>
          <a
            className="transition-all duration-300 hover:text-accent text-dark/80"
            href="#"
          >
            Pricing
          </a>
          <a
            className="transition-all duration-300 hover:text-accent text-dark/80"
            href="#"
          >
            FAQ
          </a>
        </div>
        <Link href="/auth/signup">
          <Button className="py-3">Get Started</Button>
        </Link>
      </div>
      <section className="w-screen h-screen justify-center items-center relative flex flex-col">
        {/* <div className="absolute h-150 -top-105 md:w-350 w-[90%] blur-[120px] bg-radial rounded-full from-[#F3FBF3] from-0% to-[#07C010] from-0% to-100%"></div>
        <div className="absolute h-250 -top-30 -left-265 md:-left-200 w-250 blur-[120px] bg-radial rounded-full from-[#F3FBF3] from-0% to-[#07C010] from-0% to-100%"></div>
        <div className="absolute h-250 -top-30 -right-265 md:-right-200 w-250 blur-[120px] bg-radial rounded-full from-[#F3FBF3] from-0% to-[#07C010] from-0% to-100%"></div> */}
        <div className="flex flex-col z-30 items-center">
          {/* <div className="bg-dark/5 flex gap-1 p-3 pr-5 rounded-full backdrop-blur-3xl inset-shadow-sm inset-shadow-white/2">
            <div className="flex -space-x-3">
              <Image src="/tayo.png" alt="Logo" width={26} height={26} />
              <Image src="/tayo.png" alt="Logo" width={26} height={26} />
              <Image src="/tayo.png" alt="Logo" width={26} height={26} />
            </div>
            <p className="text-dark font-semibold">1K+ active users</p>
          </div> */}
          <div className="flex items-center justify-center mt-8 flex-col max-w-4xl text-center gap-4">
            <div className="text-dark/90 text-[26px] md:text-5xl font-bold tracking-tight leading-[0.95]">
              Automate Parts of Your Job <br />
              in Seconds,{" "}
              <span className="serif text-accent font-normal">With AI.</span>
            </div>
            <p className="text-dark/50 text-sm md:text-lg items-center md:px-30 mt-2 px-6">
              Axle lets you build powerful AI helpers by simply describing what
              you want. No code, no complex onboarding, just instant agents that
              automate repetitive work so you can focus on real impact.
            </p>
            <div className="flex gap-2 mt-4 items-center">
              <Link href="/auth/signup">
                <Button className="py-3.5 text-white">
                  Check it out
                  <ArrowUpRightIcon size={23} />
                </Button>
              </Link>
              <Button className="p-3.5 text-2xl bg-dark">
                <a href="https://x.com/heyaxle" target="_blank" className="">
                  <XLogoIcon />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="min-h-screen">
        <div className="flex -space-y-10 flex-col justify-center">
          {/* <Image src="/benefits.svg" alt="Logo" width={200} height={10} className="w-50 h-auto mx-auto" /> */}
          <div className="flex flex-col gap-2">
            <div className="text-balance text-center text-dark md:text-[2.5rem] text-3xl font-bold tracking-wide">
              Why Choose <span className="serif font-normal">Us?</span>
            </div>
            <p className="text-dark/50 mx-auto max-w-xs text-center">
              Everything you need to automate, optimize and scale.
            </p>
          </div>
        </div>
        <div className="mt-10 gap-4 max-w-280 w-full grid grid-cols-1 md:grid-cols-3">
          <div className="bg-white/50 hover:scale-105 transition-all duration-300  rounded-4xl justify-between border-4 shadow-lg flex flex-col items-start p-6 shadow-dark/3 border-dark/5 h-60 w-full relative overflow-hidden">
            <div className="h-14 w-14 text-2xl relative overflow-hidden rounded-[18px] bg-[#FE3C3C] z-10 border-4 border-white/50 text-white flex items-center justify-center">
              <LightningIcon className="z-20" weight="fill" />
              <div className="bg-white blur-xl w-24 h-10 absolute -top-10"></div>
              <div className="bg-dark blur-xl w-12 h-7 absolute -bottom-10"></div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-dark font-semibold text-xl">
                Build Agents in Minutes
              </h2>
              <p className="text-dark/50 text-sm md:text-md">
                Create production-ready AI agents in minutes using simple
                controls. If you can fill a form, you can ship an agent.
              </p>
            </div>
          </div>
          <div className="bg-white/50 hover:scale-105 transition-all duration-300  rounded-4xl justify-between border-4 shadow-lg flex flex-col items-start p-6 shadow-dark/3 border-dark/5 h-60 w-full relative overflow-hidden">
            <div className="h-14 w-14 text-2xl relative overflow-hidden rounded-[18px] bg-[#3F8FFF] z-10 border-4 border-white/50 text-white flex items-center justify-center">
              <BrainIcon className="z-20" weight="fill" />
              <div className="bg-white blur-xl w-24 h-10 absolute -top-10"></div>
              <div className="bg-dark blur-xl w-12 h-7 absolute -bottom-10"></div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-dark font-semibold text-xl">
                Real Autonomy, Not Chatbots
              </h2>
              <p className="text-dark/50 text-sm md:text-md">
                Axle agents don’t just respond, they take actions, follow
                instructions, and handle real workflows across your tools.
              </p>
            </div>
          </div>
          <div className="bg-white/50 hover:scale-105 transition-all duration-300  rounded-4xl justify-between border-4 shadow-lg flex flex-col items-start p-6 shadow-dark/3 border-dark/5 h-60 w-full relative overflow-hidden">
            <div className="h-14 w-14 text-2xl relative overflow-hidden rounded-[18px] bg-[#783FFF] z-10 border-4 border-white/50 text-white flex items-center justify-center">
              <PlugIcon className="z-20" weight="fill" />
              <div className="bg-white blur-xl w-24 h-10 absolute -top-10"></div>
              <div className="bg-dark blur-xl w-12 h-7 absolute -bottom-10"></div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-dark font-semibold text-xl">
                Plug Into Your Stack
              </h2>
              <p className="text-dark/50 text-sm md:text-md">
                Connect agents directly to the tools you already use. Axle fits
                into your workflow instead of forcing a new one.
              </p>
            </div>
          </div>
          <div className="bg-white/50 hover:scale-105 transition-all duration-300  rounded-4xl justify-between border-4 shadow-lg flex flex-col items-start p-6 shadow-dark/3 border-dark/5 h-60 w-full relative overflow-hidden">
            <div className="h-14 w-14 text-2xl relative overflow-hidden rounded-[18px] bg-[#34E44E] z-10 border-4 border-white/50 text-white flex items-center justify-center">
              <SquaresFourIcon className="z-20" weight="fill" />
              <div className="bg-white blur-xl w-24 h-10 absolute -top-10"></div>
              <div className="bg-dark blur-xl w-12 h-7 absolute -bottom-10"></div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-dark font-semibold text-xl">
                Full Control, Zero Complexity
              </h2>
              <p className="text-dark/50 text-sm md:text-md">
                Control behavior, permissions, memory, and actions from one
                clean dashboard. Powerful, but never overwhelming.
              </p>
            </div>
          </div>
          <div className="bg-white/50 hover:scale-105 transition-all duration-300  rounded-4xl justify-between border-4 shadow-lg flex flex-col items-start p-6 shadow-dark/3 border-dark/5 h-60 w-full relative overflow-hidden">
            <div className="h-14 w-14 text-2xl relative overflow-hidden rounded-[18px] bg-[#F4A21F] z-10 border-4 border-white/50 text-white flex items-center justify-center">
              <ChartLineUpIcon className="z-20" weight="fill" />
              <div className="bg-white blur-xl w-24 h-10 absolute -top-10"></div>
              <div className="bg-dark blur-xl w-12 h-7 absolute -bottom-10"></div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-dark font-semibold text-xl">
                Built to Scale With You
              </h2>
              <p className="text-dark/50 text-sm md:text-md">
                Start with one agent, grow to dozens. Axle handles scale,
                performance, and reliability behind the scenes.
              </p>
            </div>
          </div>
          <div className="bg-white/50 hover:scale-105 transition-all duration-300  rounded-4xl justify-between border-4 shadow-lg flex flex-col items-start p-6 shadow-dark/3 border-dark/5 h-60 w-full relative overflow-hidden">
            <div className="h-14 w-14 text-2xl relative overflow-hidden rounded-[18px] bg-[#F4661F] z-10 border-4 border-white/50 text-white flex items-center justify-center">
              <ShieldCheckIcon className="z-20" weight="fill" />
              <div className="bg-white blur-xl w-24 h-10 absolute -top-10"></div>
              <div className="bg-dark blur-xl w-12 h-7 absolute -bottom-10"></div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-dark font-semibold text-xl">
                Safe, Predictable, Transparent
              </h2>
              <p className="text-dark/50 text-sm md:text-md">
                Clear boundaries, defined actions, and visibility into what your
                agents can and can’t do, trust baked in by default.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className=" py-10 w-full">
        <div className="flex flex-col gap-2">
          <div className="text-balance text-center text-dark md:text-[2.5rem] text-3xl font-bold tracking-wide">
            Get Started With <span className="serif font-normal">Axle.</span>
          </div>
          <p className="text-dark/50 mx-auto max-w-xs text-center">
            Create powerful AI agents in minutes, connect your tools, and stay
            in control from day one.
          </p>
        </div>
        <div className="relative self-stretch border-t border-[#E0DEDB] border-b  flex justify-center items-start max-w-300 w-full mt-7 bg-dark/1 mx-auto">
          <div className="absolute left-0 self-stretch h-full">
            <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch h-full relative overflow-hidden">
              <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
              </div>
            </div>
          </div>
          <div className="md:mx-12 px-0 sm:px-2 md:px-0 grid md:grid-cols-3 grid-cols-1 justify-center items-stretch gap-0">
            <div className="w-full hover:bg-white/25 shadow-dark/5 hover:shadow-xl transition-all duration-300 md:flex-1 self-stretch px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 border-l-0 border-r-0 md:border border-[#E0DEDB]/80">
              <div className="size-12 text-xl flex items-center justify-center font-extrabold border-4 border-dark/10 shadow-md shadow-dark/18 rounded-full mb-3 bg-accent mix-blend-multiply">
                1
              </div>
              <div className="self-stretch flex justify-center flex-col text-dark text-md md:text-2xl font-semibold leading-6 md:leading-6">
                Create Your Agent
              </div>
              <div className="self-stretch text-dark/50 text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px]">
                Spin up an AI agent in minutes. Define its role, goals, and
                behaviorno code, no setup, no friction.
              </div>
            </div>
            <div className="w-full hover:bg-white/25 shadow-dark/5 hover:shadow-xl transition-all duration-300 md:flex-1 self-stretch px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 border-l-0 border-r-0 md:border border-[#E0DEDB]/80">
              <div className="size-12 text-xl flex items-center justify-center font-extrabold border-4 border-dark/10 shadow-md shadow-dark/18 rounded-full mb-3 bg-accent mix-blend-multiply">
                2
              </div>
              <div className="self-stretch flex justify-center flex-col text-dark text-md md:text-2xl font-semibold leading-6 md:leading-6">
                Connect Your Apps
              </div>
              <div className="self-stretch text-dark/50 text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px]">
                Link your favorite apps like GitHub, Google, and X. Your agent
                instantly understands your workflow and environment.
              </div>
            </div>
            <div className="w-full hover:bg-white/25 shadow-dark/5 hover:shadow-xl transition-all duration-300 md:flex-1 self-stretch px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 border-l-0 border-r-0 md:border border-[#E0DEDB]/80">
              <div className="size-12 text-xl flex items-center justify-center font-extrabold border-4 border-dark/10 shadow-md shadow-dark/18 rounded-full mb-3 bg-accent mix-blend-multiply">
                3
              </div>
              <div className="self-stretch flex justify-center flex-col text-dark text-md md:text-2xl font-semibold leading-6 md:leading-6">
                Control & Deploy
              </div>
              <div className="self-stretch text-dark/50 text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px]">
                Set permissions, monitor actions, and deploy with confidence.
                Your agent works autonomously, on your terms.
              </div>
            </div>
          </div>
          <div className="absolute right-0 self-stretch h-full">
            <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch h-full relative overflow-hidden">
              <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="flex flex-col gap-2 mb-5">
          <div className="text-balance text-center text-dark md:text-[2.5rem] text-3xl font-bold tracking-wide">
            What Our Users <span className="serif font-normal">Say.</span>
          </div>
          <p className="text-dark/50 mx-auto max-w-xs text-center">
            Real feedback from people using Axle to solve real problems, not
            demos, not theory.
          </p>
        </div>
        <MarqueeDemo />
      </section>

      <section className="min-h-screen px-6 w-screen">
        <div className="flex flex-col gap-2 mb-5">
          <div className="text-balance text-center text-dark md:text-[2.5rem] text-3xl font-bold tracking-wide">
            <span className="serif font-normal">Pricing.</span>
          </div>
          <p className="text-dark/50 mx-auto max-w-xs text-center">
            Simple, transparent plans designed to scale with you and your
            agents.
          </p>
        </div>
        <div className="max-w-6xl mt-16 gap-6 grid md:grid-cols-3 grid-cols-1 w-full mx-auto">
          <div className="bg-dark/3 p-4 border-4 border-dark/3 rounded-4xl shadow-lg shadow-dark/3">
            <div className="bg-dark/5 flex flex-col justify-between p-5 rounded-3xl h-40 w-full">
              <div className="bg-white/50 hover:bg-accent/25 hover:border-accent/15 hover:border border border-dark/5 hover:scale-105 shadow-accent/10 hover:shadow-lg transition-all duration-300 hover:text-accent cursor-pointer rounded-full py-1.5 px-5 text-dark font-semibold w-fit">
                Starter
              </div>
              <p className="text-4xl font-semibold text-dark">
                $19
                <span className="text-dark/75 text-lg font-medium">/month</span>
              </p>
            </div>
            {/* <p className="text-dark font-semibold mb-5">
            For individuals getting started with agents
            </p> */}

            <div className="flex flex-col mt-5 gap-1.5">
              <div className="flex items-center gap-2">
                <CheckIcon className="size-5 text-dark" />
                <span className="text-dark/75 text-md font-medium">
                  700 credits/month
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-5 text-dark" />
                <span className="text-dark/75 text-md font-medium">
                  Basic agent templates
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-5 text-dark" />
                <span className="text-dark/75 text-md font-medium">
                  7 Integrations
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-5 text-dark" />
                <span className="text-dark/75 text-md font-medium">
                  Core control & monitoring
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-5 text-dark" />
                <span className="text-dark/75 text-md font-medium">
                  Community support
                </span>
              </div>
            </div>
            <Button className="w-full mt-5 py-3.5 bg-dark">Get Started</Button>
          </div>
          <div className="bg-dark/3 scale-105 p-4 border-4 border-dark/3 rounded-4xl shadow-xl shadow-dark/7">
            <div className="bg-dark/5 flex flex-col justify-between p-5 rounded-3xl h-40 w-full">
              <div className="bg-white/50 hover:bg-accent/25 hover:border-accent/15 hover:border border border-dark/5 hover:scale-105 shadow-accent/10 hover:shadow-lg transition-all duration-300 hover:text-accent cursor-pointer rounded-full py-1.5 px-5 text-dark font-semibold w-fit">
                Pro
              </div>
              <p className="text-4xl font-semibold text-dark">
                $49
                <span className="text-dark/75 text-lg font-medium">/month</span>
              </p>
            </div>
            {/* <p className="text-dark font-semibold mb-5">
            For individuals getting started with agents
            </p> */}

            <div className="flex flex-col mt-5 gap-1.5">
              <div className="flex items-center gap-2">
                <CheckIcon className="size-5 text-dark" />
                <span className="text-dark/75 text-md font-medium">
                  2500 credits/month
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-5 text-dark" />
                <span className="text-dark/75 text-md font-medium">
                  Create up to 15 agents
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-5 text-dark" />
                <span className="text-dark/75 text-md font-medium">
                  All integrations unlocked
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-5 text-dark" />
                <span className="text-dark/75 text-md font-medium">
                  Email Support
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-5 text-dark" />
                <span className="text-dark/75 text-md font-medium">
                  Priority performance
                </span>
              </div>
            </div>
            <Button className="w-full mt-5 py-3.5 bg-accent">
              Get Started
            </Button>
          </div>
          <div className="bg-dark/3 p-4 border-4 border-dark/3 rounded-4xl shadow-lg shadow-dark/3">
            <div className="bg-dark/5 flex flex-col justify-between p-5 rounded-3xl h-40 w-full">
              <div className="bg-white/50 hover:bg-accent/25 hover:border-accent/15 hover:border border border-dark/5 hover:scale-105 shadow-accent/10 hover:shadow-lg transition-all duration-300 hover:text-accent cursor-pointer rounded-full py-1.5 px-5 text-dark font-semibold w-fit">
                Premium
              </div>
              <p className="text-4xl font-semibold text-dark">
                $99
                <span className="text-dark/75 text-lg font-medium">/month</span>
              </p>
            </div>
            {/* <p className="text-dark font-semibold mb-5">
            For individuals getting started with agents
            </p> */}

            <div className="flex flex-col mt-5 gap-1.5">
              <div className="flex items-center gap-2">
                <CheckIcon className="size-5 text-dark" />
                <span className="text-dark/75 text-md font-medium">
                  6000 credits/month
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-5 text-dark" />
                <span className="text-dark/75 text-md font-medium">
                  Unlimited agents
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-5 text-dark" />
                <span className="text-dark/75 text-md font-medium">
                  Custom integrations
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-5 text-dark" />
                <span className="text-dark/75 text-md font-medium">
                  Dedicated infrastructure
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="size-5 text-dark" />
                <span className="text-dark/75 text-md font-medium">
                  SLA & priority support
                </span>
              </div>
            </div>
            <Button className="w-full mt-5 py-3.5 bg-dark">Get Started</Button>
          </div>
        </div>
      </section>
      <section className="min-h-screen py-10 w-screen">
        <div className="flex-1 px-4 md:px-12 py-16 md:py-20 flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-12">
          {/* Left */}
          <div className="w-full lg:flex-1 flex flex-col justify-center items-start gap-3">
            <div className="w-full flex serif flex-col text-accent font-sans text-4xl tracking-tight">
              Common questions.
            </div>
            <div className="w-full text-dark/50 text-base font-normal font-sans">
              Everything you need to know about building and running agents with Axle.
            </div>
          </div>

          {/* Right */}
          {/* Right */}
          <div className="lg:flex-1">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index

              return (
                <div
                  key={index}
                  className="border-b border-[rgba(73,66,61,0.16)]"
                >
                  <button
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    className="w-full px-5 py-[18px] flex justify-between items-center text-left hover:bg-[rgba(73,66,61,0.02)] transition"
                  >
                    <span className="text-dark font-medium">
                      {faq.question}
                    </span>

                    <CaretDownIcon className="text-dark" open={isOpen} />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    <p className="px-5 pb-[18px] text-sm text-dark/50 leading-6">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
