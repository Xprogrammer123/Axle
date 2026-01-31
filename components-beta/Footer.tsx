"use client";

import Image from "next/image";
import Link from "next/link";
import {
    FacebookLogoIcon,
    InstagramLogoIcon,
    LinkedinLogoIcon,
    PaperPlaneTiltIcon,
    XLogoIcon,
} from "@phosphor-icons/react";
import { Button } from "./Button";
import { useState } from "react";
import { api } from "@/lib/api";
// Actually page.tsx didn't show sonner. I'll use simple state for now or check package.json later.
// I'll stick to a simple fetch for now.

export function Footer() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubscribe = async () => {
        if (!email) return;

        setLoading(true);
        setStatus("idle");

        try {
            const response = await fetch(`${api.getBaseUrl()}/newsletter/subscribe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setStatus("success");
                setEmail("");
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error(error);
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="w-full flex flex-col items-center">
            {/* Main Footer */}
            <div className="w-full bg-[#FAFAFA] dark:bg-black pt-32 pb-10 px-6 md:px-20 mt-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 md:gap-24">

                    {/* Logo & Desc */}
                    <div className="flex flex-col gap-6 max-w-sm">
                        <div className="flex items-center gap-2">
                            {/* Using existing logo logic from page.tsx */}
                            <Image src="/beta/logo.svg" alt="Logo" width={24} height={24} />
                            <span className="font-bold dark:text-white text-xl text-dark">Axle</span>
                        </div>
                        <p className="text-dark/60 dark:text-white/60 leading-relaxed">
                            If you can think it, you can build it.
                        </p>
                        <div className="flex gap-4 text-dark/60 dark:text-white/60">
                            {/* <a href="#" className="hover:text-accent transition-colors"><FacebookLogoIcon size={24} weight="fill" /></a> */}
                            {/* <a href="#" className="hover:text-accent transition-colors"><LinkedinLogoIcon size={24} weight="fill" /></a> */}
                            {/* <a href="#" className="hover:text-accent transition-colors"><InstagramLogoIcon size={24} weight="fill" /></a> */}
                            <a href="#" className="hover:text-accent transition-colors"><XLogoIcon size={24} /></a>
                        </div>
                    </div>
                    {/* 
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-20">
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-dark text-lg">Company</h4>
                            <Link href="#" className="text-dark/60 dark:text-white/60 hover:text-accent transition-colors">Home</Link>
                            <Link href="#" className="text-dark/60 dark:text-white/60 hover:text-accent transition-colors">About us</Link>
                            <Link href="#" className="text-dark/60 dark:text-white/60 hover:text-accent transition-colors">Pricing</Link>
                            <Link href="#" className="text-dark/60 dark:text-white/60 hover:text-accent transition-colors">Blog</Link>
                            <Link href="#" className="text-dark/60 dark:text-white/60 hover:text-accent transition-colors">Blog Details</Link>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-dark text-lg">Product</h4>
                            <Link href="#" className="text-dark/60 hover:text-accent transition-colors">Features</Link>
                            <Link href="#" className="text-dark/60 hover:text-accent transition-colors">Careers</Link>
                            <Link href="#" className="text-dark/60 hover:text-accent transition-colors">How it works</Link>
                            <Link href="#" className="text-dark/60 hover:text-accent transition-colors">Contact</Link>
                        </div>
                    </div> */}

                    {/* Newsletter */}
                    <div className="flex flex-col gap-4 max-w-md">
                        <h4 className="font-bold text-dark dark:text-white text-lg">Newsletter</h4>
                        <p className="text-dark/60 dark:text-white/60">
                            Get tips, product updates, and insights on working smarter with AI.
                        </p>
                        <div className="relative">
                            <div className="flex bg-white dark:bg-white/5 border border-dark/10 dark:border-white/5 rounded-full p-1.5 pl-5 focus-within:border-accent/50 transition-colors">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="bg-transparent outline-none w-full text-dark dark:text-white placeholder:text-dark/40 dark:placeholder:text-white/40"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Button
                                    onClick={handleSubscribe}
                                    disabled={loading}
                                    className="py-3 px-8 rounded-full"
                                    loading={loading}
                                >
                                    {loading ? "" : "Subscribe"}
                                </Button>
                            </div>
                            {status === "success" && <p className="text-green-600 text-sm mt-2 ml-2">Subscribed successfully!</p>}
                            {status === "error" && <p className="text-red-500 text-sm mt-2 ml-2">Something went wrong, please try again later.</p>}
                        </div>
                    </div>

                </div>

                <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-dark/5 flex flex-col md:flex-row justify-between items-center text-dark/40 dark:text-white/40 text-sm gap-4">
                    <p>© 2026 Axle. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy-policy" className="hover:text-dark dark:hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-dark dark:hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-dark dark:hover:text-white transition-colors">Security</Link>
                        <Link href="#" className="hover:text-dark dark:hover:text-white transition-colors">Cookie</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
