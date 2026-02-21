"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button";

export function LandingHeader() {
    return (
        <div className="fixed flex backdrop-blur-xl justify-between z-50 max-w-[79.5rem] md:w-full w-[90%] md:px-24 py-5 left-1/2 -translate-x-1/2 px-6 bg-transparent">
            <div className="w-full h-0 absolute left-0 top-20.5 border-t border-[rgba(55,50,47,0.12)] dark:border-white/10 shadow-[0px_1px_0px_white] dark:shadow-none"></div>
            <Link href="/" className="flex items-center gap-2">
                <Image src="/beta/logo.svg" alt="Logo" width={30} height={30} />
                <h1 className="text-xl font-bold dark:text-white text-dark">Axle</h1>
            </Link>
            <div className="md:flex hidden gap-8 text-[15px] items-center">
                <Link
                    className="transition-all duration-300 hover:text-accent text-dark/50 dark:hover:text-white dark:text-white/35"
                    href="/#services"
                >
                    Services
                </Link>
                <Link
                    className="transition-all duration-300 hover:text-accent text-dark/50 dark:hover:text-white dark:text-white/35"
                    href="/#how-it-works"
                >
                    How It Works
                </Link>
                <Link
                    className="transition-all duration-300 hover:text-accent text-dark/50 dark:hover:text-white dark:text-white/35"
                    href="/#testimonials"
                >
                    Testimonials
                </Link>
                <Link
                    className="transition-all duration-300 hover:text-accent text-dark/50 dark:hover:text-white dark:text-white/35"
                    href="/#pricing"
                >
                    Pricing
                </Link>
                <Link
                    className="transition-all duration-300 hover:text-accent text-dark/50 dark:hover:text-white dark:text-white/35"
                    href="/#faq"
                >
                    FAQ
                </Link>
            </div>
            <Link href="/auth/login">
                <Button className="py-3">Get Started</Button>
            </Link>
        </div>
    );
}
