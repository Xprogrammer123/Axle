"use client";

import Image from "next/image";
import { CaretDownIcon } from "@phosphor-icons/react";

export const Header = () => {
  return (
    <header className="w-full px-16 pt-6 flex justify-between items-center">
      <p className="text-white text-2xl font-semibold">Welcome Back, Tayo!</p>

      <button className="flex items-center gap-2 px-4 py-3 rounded-full border border-white/4 hover:bg-white/5 transition-colors bg-white/4">
        <Image
          src="/logo.svg"
          width="22"
          height="22"
          alt="User avatar"
          className="rounded-full"
        />
        <span className="text-white/80 font-bold">Tayo</span>
        <CaretDownIcon size={20} className="text-white/60 ml-1" />
      </button>
    </header>
  );
};
