"use client"

import Image from "next/image";
import { useState } from "react";
import { GodAgentDrawer } from "./god-mode/GodAgentDrawer";

export const Axle = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <>
            <div
                onClick={() => setIsChatOpen(true)}
                className="group z-50 flex absolute md:bottom-6 bottom-22 items-center w-fit text-white font-semibold border-2 border-base/12 text-lg gap-3 py-3 px-6 rounded-full bg-black cursor-pointer backdrop-blur-md shadow-xl shadow-black/6  transition-all"
            >
                <Image src="/logo.svg" alt="Logo" width={48} height={48} className="size-5.5 group-hover:rotate-12 transition-all duration-300" />
                Ask Axle
            </div>

            <GodAgentDrawer
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
            />
        </>
    )
}

export default Axle;