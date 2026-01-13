"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRightIcon, XLogoIcon } from "@phosphor-icons/react";

export default function Home() {
  return (
    <main className="overflow-x-hidden w-screen px-7 flex flex-col items-center bg-[#000B04]">
      <div className="fixed flex justify-between z-50 w-full max-w-5xl my-7 mx-7 bg-white/5 rounded-full p-3.5 pl-6 backdrop-blur-[300px] inset-shadow-sm inset-shadow-white/2">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={30} height={30} />
        </Link>
        <div className="md:flex hidden gap-5 items-center">
          <a className="transition-all duration-300 hover:text-white text-white/70" href="#">Services</a>
          <a className="transition-all duration-300 hover:text-white text-white/70" href="#">How It Works</a>
          <a className="transition-all duration-300 hover:text-white text-white/70" href="#">Testimonials</a>
          <a className="transition-all duration-300 hover:text-white text-white/70" href="#">Pricing</a>
          <a className="transition-all duration-300 hover:text-white text-white/70" href="#">FAQ</a>
        </div>
        <Link href="/auth" className="py-2.5 px-7 rounded-full text-white font-semibold bg-linear-to-b from-[#36B460] hover:scale-105 transition-all duration-300 cursor-pointer to-[#049C20]">
          Get Started
        </Link>
      </div>
      <section className="w-screen h-screen items-center relative flex flex-col">
        <div className="absolute h-150 -top-105 md:w-350 w-[90%] blur-[120px] bg-radial rounded-full from-[#F3FBF3] from-0% to-[#07C010] from-0% to-100%"></div>
        <div className="absolute h-250 -top-30 -left-265 md:-left-200 w-250 blur-[120px] bg-radial rounded-full from-[#F3FBF3] from-0% to-[#07C010] from-0% to-100%"></div>
        <div className="absolute h-250 -top-30 -right-265 md:-right-200 w-250 blur-[120px] bg-radial rounded-full from-[#F3FBF3] from-0% to-[#07C010] from-0% to-100%"></div>
        <div className="flex flex-col z-30 mt-36 items-center">
          <div className="bg-white/5 flex gap-1 p-3 pr-5 rounded-full backdrop-blur-3xl inset-shadow-sm inset-shadow-white/2">
            <div className="flex -space-x-3">
              <Image src="/tayo.png" alt="Logo" width={26} height={26} />
              <Image src="/tayo.png" alt="Logo" width={26} height={26} />
              <Image src="/tayo.png" alt="Logo" width={26} height={26} />
            </div>
            <p className="text-white font-semibold">1K+ active users</p>
          </div>
          <div className="flex items-center justify-center mt-8 flex-col max-w-4xl text-center gap-4">
            <div className="bg-clip-text text-balance text-center text-transparent bg-linear-to-b from-white to-[#8FB39B] text-6xl font-extrabold tracking-wide leading-[0.95]">
              Automate Parts of Your Job in<br />
              Seconds, <span className="serif font-normal">With AI.</span>
            </div>
            <p className="text-white/50 text-lg items-center px-10">Axle lets you build powerful AI helpers by simply describing what you want. No code, no complex onboarding, just instant agents that automate repetitive work so you can focus on real impact.</p>
            <div className="flex gap-3 mt-4 items-center">
              <Link href="/auth" className="py-3.5 items-center flex gap-1.5 px-8 rounded-full text-white font-medium bg-linear-to-b from-[#36B460] hover:scale-105 transition-all duration-300 cursor-pointer to-[#049C20]">
                Check it out
                <ArrowUpRightIcon size={23} />
              </Link>
              <button className="items-center flex gap-1.5 p-[1.2px] rounded-full text-white font-medium bg-linear-to-b from-[#36B460] hover:scale-105 transition-all duration-300 cursor-pointer to-[#049C20]">
                <a href="https://x.com/heyaxle" target="_blank" className="p-3 bg-[#19231d] rounded-full">
                  <Image src="/xlogo.svg" alt="Logo" width={26} height={26} />
                </a>
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* <section className="min-h-screen">
        <div className="flex -space-y-10 flex-col justify-center">
          <Image src="/benefits.svg" alt="Logo" width={200} height={10} className="w-50 h-auto mx-auto" />
          <div className="flex flex-col -space-y-1">
            <div className="text-balance text-center text-white text-[2.5rem] font-bold tracking-wide">
              Why Choose <span className="serif font-normal">Us?</span>
            </div>
            <p className="text-white/50 text-center">Everything you need to automate, optimize and scale.</p>
          </div>
        </div>
        <div className="grid max-w-5xl mx-6 md:grid-cols-3 grid-cols-1">
          <div className="bg-white/5 h-72 w-72 border-2 relative overflow-hidden border-white/10">
          
          </div>
        </div>
      </section> */}
    </main>
  );
}
