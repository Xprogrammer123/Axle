"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRightIcon,
  BrainIcon,
  ClockIcon,
  LightningIcon,
  PlugIcon,
  PlugsIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  SquaresFourIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components-beta/Button";
import { MarqueeDemo } from "../components-beta/Testimonials";
import { Footer } from "@/components-beta/Footer";
import StarField from "@/components-beta/StarField";
import { FAQ } from "@/components-beta/FAQ";
import { motion } from "framer-motion";
import { BlurredOrb } from "@/components-beta/BlurredOrb";
import { LandingHeader } from "@/components-beta/LandingHeader";


export default function Home() {
  return (
    <main className="overflow-x-hidden gap-20 max-w-7xl relative mx-2 md:mx-auto min-h-screen md:w-full flex flex-col items-center bg-background dark:bg-[#050505]">
      <div className="w-px h-full absolute left-0 top-0 bg-[rgba(55,50,47,0.12)] dark:bg-white/10 shadow-[1px_0px_0px_white] dark:shadow-[1px_0px_0px_black] z-0"></div>
      <div className="w-px h-full absolute right-0 top-0 bg-[rgba(55,50,47,0.12)] dark:bg-white/10 shadow-[1px_0px_0px_white] dark:shadow-[1px_0px_0px_black] z-0"></div>
      <div className="w-240 h-160 rounded-full bg-white/10 blur-[200px] absolute -top-135"></div>
      <LandingHeader />
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full min-h-screen justify-center items-center relative flex flex-col"
      >
        <BlurredOrb width="600px" height="600px" color="bg-accent/10 dark:bg-accent-dark/10" className="-top-20 -left-20" />
        <BlurredOrb width="500px" height="500px" color="bg-blue-500/10 dark:bg-blue-400/5" className="top-40 -right-20" delay={2} />

        <Image src="/a.png" alt="Logo" width={60} height={60} className="hidden md:block dark:opacity-65 absolute left-10" />
        <Image src="/b.png" alt="Logo" width={60} height={60} className="hidden md:block dark:opacity-65 absolute right-10" />
        <Image src="/c.png" alt="Logo" width={60} height={60} className="hidden md:block dark:opacity-65 absolute top-30 left-30" />
        <Image src="/d.png" alt="Logo" width={60} height={60} className="hidden md:block dark:opacity-65 absolute bottom-10" />
        <Image src="/e.png" alt="Logo" width={60} height={60} className="hidden md:block dark:opacity-65 absolute right-30 bottom-20" />
        <Image src="/f.png" alt="Logo" width={60} height={60} className="hidden md:block dark:opacity-65 absolute bottom-30 left-40" />
        <Image src="/g.png" alt="Logo" width={60} height={60} className="hidden md:block dark:opacity-65 absolute top-30 right-10" />
        <div className="flex flex-col z-30 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/50 dark:bg-white/1 border border-dark/5 dark:border-white/3 flex gap-1 p-3 pr-5 rounded-full backdrop-blur-3xl inset-shadow-sm inset-shadow-white/2"
          >
            <div className="flex -space-x-3">
              <Image src="/tayo.png" alt="Logo" width={26} height={26} />
              <Image src="/tayo.png" alt="Logo" width={26} height={26} />
              <Image src="/tayo.png" alt="Logo" width={26} height={26} />
            </div>
            <p className="text-dark/50 dark:text-white/50 font-medium">Trusted by users worldwide.</p>
          </motion.div>
          <div className="flex items-center justify-center mt-8 flex-col max-w-4xl text-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-dark/90 dark:text-white text-[26px] md:text-6xl font-bold tracking-tight leading-[1.3]"
            >
              Automate Parts of Your Job <br />
              in Seconds,{" "}
              <span className="text-accent dark:text-accent-dark bg-accent/25 px-2 dark:bg-accent-dark/25 dark:border-accent-dark border-r-4 border-accent">With AI.</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-dark/50 dark:text-white/50 text-sm md:text-[17px] items-center md:px-40 mt-2 px-6"
            >
              Build powerful AI helpers by simply describing what
              you want. No code, no complex onboarding.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-2 mt-4 items-center"
            >
              <Link href="/auth/signup">
                <Button className="py-3.5 text-white">
                  Check it out
                  <ArrowUpRightIcon size={23} />
                </Button>
              </Link>
              <Button className="p-3.5 text-2xl bg-dark dark:bg-white dark:text-accent-dark">
                <a href="https://x.com/heyaxle" target="_blank" className="">
                  <XLogoIcon />
                </a>
              </Button>
            </motion.div>

          </div>
        </div>
      </motion.section>

      {/* <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-dark/2 flex flex-col justify-center items-center border-y-2 border-dark/3 dark:border-white/3 dark:bg-white/3 py-5 px-3 md:py-10 md:px-10 w-full"
      >
        <h3 className="text-lg font-semibold text-dark dark:text-white">Trusted by employees in:</h3>
      </motion.section> */}

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="w-full relative"
      >
        <BlurredOrb width="700px" height="700px" color="bg-accent/5 dark:bg-accent-dark/5" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="py-10 px-3 pt-24 w-full relative z-10">
          <div className="flex flex-col gap-2">
            <div className="text-balance text-center text-dark dark:text-white md:text-[2.5rem] text-3xl font-bold tracking-wide">
              What we <span className="serif font-normal">Offer.</span>
            </div>
            <p className="text-dark/50 dark:text-white/50 mx-auto max-w-xs text-center">
              Build AI agents in minutes. Plug into your stack. Stay fully in control.
            </p>
          </div>
          <div className="grid gap-6 md:p-10 py-8 px-3 grid-cols-1 md:grid-cols-3">
            {[
              {
                icon: ClockIcon,
                title: "Build Fast",
                desc: "Create powerful AI agents in minutes with a streamlined setup that removes boilerplate, reduces friction, and lets you focus on solving real problems instead of wiring infrastructure."
              },
              {
                icon: PlugsIcon,
                title: "Connect Your Stack",
                desc: "Seamlessly connect the tools, APIs, databases, and services you already rely on, so your agents fit naturally into your existing workflow without forcing migrations or lock-in."
              },
              {
                icon: SlidersHorizontalIcon,
                title: "Stay in Control",
                desc: "Set clear rules, permissions, and guardrails that define exactly what your agents can access and do, giving you full control and predictable behavior from day one."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-7 rounded-4xl border border-dark/5 border-white/3 hover:scale-105 transition-all duration-300 bg-white/60 dark:bg-white/3 p-7 flex-col gap-2"
              >
                <div className="p-2.5 w-fit rounded-2xl border border-dark/3 dark:border-white/3 dark:bg-white/3 bg-dark/3">
                  <item.icon className="size-10 text-accent dark:text-accent-dark" weight="fill" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-2xl bg-linear-to-b font-bold bg-clip-text from-dark/50 to-dark dark:from-white/50 dark:to-white text-transparent">{item.title}</h3>
                  <p className="text-dark/50 dark:text-white/50 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className=" py-10 w-full"
      >
        <div className="flex flex-col gap-2">
          <div className="text-balance text-center text-dark dark:text-white md:text-[2.5rem] text-3xl font-bold tracking-wide">
            Get Started With <span className="serif font-normal">Axle.</span>
          </div>
          <p className="text-dark/50 dark:text-white/50 mx-auto max-w-xs text-center">
            Create powerful AI agents in minutes, connect your tools, and stay
            in control from day one.
          </p>
        </div>
        <div className="relative self-stretch border-t border-border dark:border-white/5 border-b flex justify-center items-start max-w-300 w-full mt-7 bg-dark/1 dark:bg-white/3 mx-auto">
          <div className="absolute left-0 self-stretch h-full">
            <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch h-full relative overflow-hidden">
              <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
              </div>
            </div>
          </div>
          <div className="md:mx-12 px-0 sm:px-2 md:px-0 grid md:grid-cols-3 grid-cols-1 justify-center items-stretch gap-0">
            <div className="w-full hover:bg-surface/40 dark:hover:bg-accent-dark/10 shadow-dark/5 dark:shadow-accent/15 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 md:flex-1 self-stretch hover:scale-101.5 px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 border-l-0 border-r-0 md:border border-border dark:border-white/10">
              <div className="size-12 text-xl flex dark:bg-accent-dark items-center justify-center font-extrabold border-4 border-dark/10 dark:border-white/10 shadow-md shadow-dark/18 dark:shadow-white/10 rounded-full mb-3 bg-accent">
                1
              </div>
              <div className="self-stretch flex justify-center flex-col text-dark dark:text-white text-md md:text-2xl font-semibold leading-6 md:leading-6">
                Create Your Agent
              </div>
              <div className="self-stretch text-dark/50 dark:text-white/50 text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px]">
                Spin up an AI agent in minutes. Define its role, goals, and
                behaviorno code, no setup, no friction.
              </div>
            </div>
            <div className="w-full hover:bg-surface/40 dark:hover:bg-accent-dark/10 shadow-dark/5 dark:shadow-accent/15 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 md:flex-1 self-stretch hover:scale-101.5 px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 border-l-0 border-r-0 md:border border-border dark:border-white/10">
              <div className="size-12 text-xl flex items-center justify-center font-extrabold border-4 border-dark/10 dark:border-white/10 shadow-md shadow-dark/18 dark:shadow-white/10 rounded-full mb-3 bg-accent dark:bg-accent-dark">
                2
              </div>
              <div className="self-stretch flex justify-center flex-col text-dark dark:text-white text-md md:text-2xl font-semibold leading-6 md:leading-6">
                Connect Your Apps
              </div>
              <div className="self-stretch text-dark/50 dark:text-white/50 text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px]">
                Link your favorite apps like GitHub, Google, and X. Your agent
                instantly understands your workflow and environment.
              </div>
            </div>
            <div className="w-full hover:bg-surface/40 dark:hover:bg-accent-dark/10 shadow-dark/5 dark:shadow-accent/15 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 md:flex-1 self-stretch hover:scale-101.5 px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 border-l-0 border-r-0 md:border border-border dark:border-white/10">
              <div className="size-12 text-xl flex items-center justify-center font-extrabold border-4 border-dark/10 dark:border-white/10 shadow-md shadow-dark/18 dark:shadow-white/10 rounded-full mb-3 bg-accent dark:bg-accent-dark">
                3
              </div>
              <div className="self-stretch flex justify-center flex-col text-dark dark:text-white text-md md:text-2xl font-semibold leading-6 md:leading-6">
                Control & Deploy
              </div>
              <div className="self-stretch text-dark/50 dark:text-white/50 text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px]">
                Set permissions, monitor actions, and deploy with confidence.
                Your agent works autonomously, on your terms.
              </div>
            </div>
          </div>
          <div className="absolute right-0 self-stretch h-full">
            <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch h-full relative overflow-hidden">
              <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
                <div className="self-stretch h-3 sm:h-4 -rotate-45 origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] dark:outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"></div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-16"
      >
        <div className="flex flex-col gap-2 mb-5">
          <div className="text-balance text-center text-dark dark:text-white md:text-[2.5rem] text-3xl font-bold tracking-wide">
            What Our Users <span className="serif font-normal">Say.</span>
          </div>
          <p className="text-dark/50 dark:text-white/50 mx-auto max-w-xs text-center">
            Real feedback from people using Axle to solve real problems, not
            demos, not theory.
          </p>
        </div>
        <MarqueeDemo />
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full relative"
      >
        <BlurredOrb width="600px" height="600px" color="bg-accent/5 dark:bg-accent-dark/5" className="top-0 left-1/2 -translate-x-1/2" />
        <FAQ />
      </motion.div>

      <Footer />
    </main>
  );
}
