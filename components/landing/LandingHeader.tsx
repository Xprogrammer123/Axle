'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { List, X } from '@phosphor-icons/react';
import { useState } from 'react';
import Image from 'next/image';

export function LandingHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4">
            <div className="glass-card flex items-center justify-between w-full max-w-4xl pl-6 pr-3 py-3 rounded-full border border-white/5 shadow-xl backdrop-blur-md">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="Axle" width={32} height={32} className="rounded-lg size-7.5" />
                    {/* <span cl/>assName="font-medium text-lg tracking-tight text-white">Axle</span> */}
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
                    <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                    <Link href="#solutions" className="hover:text-white transition-colors">Solutions</Link>
                    <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
                    <Link href="#resources" className="hover:text-white transition-colors">Resources</Link>
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/auth">
                        <Button className="bg-base text-black hover:bg-base/90 rounded-full px-6 font-medium">
                            Start Free
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <List size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-20 left-4 right-4 glass-card p-6 rounded-3xl border border-white/5 md:hidden flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
                    <Link href="#features" className="text-lg text-neutral-300 py-2 border-b border-white/5">Features</Link>
                    <Link href="#solutions" className="text-lg text-neutral-300 py-2 border-b border-white/5">Solutions</Link>
                    <Link href="#pricing" className="text-lg text-neutral-300 py-2 border-b border-white/5">Pricing</Link>
                    <div className="flex flex-col gap-3 mt-4">
                        <Button variant="ghost" className="w-full justify-start text-neutral-300">Log in</Button>
                        <Button className="w-full bg-white text-black rounded-full">Start Free</Button>
                    </div>
                </div>
            )}
        </nav>
    );
}
