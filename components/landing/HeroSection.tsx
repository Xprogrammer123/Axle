'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Play, CheckCircle } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-4 overflow-hidden">

            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-green-500/20 rounded-full blur-[120px] -z-10 opacity-30 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -z-10 opacity-20 pointer-events-none" />

            <div className="max-w-6xl w-full flex flex-col items-center text-center z-10">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base/5 border border-white/10 text-sm text-neutral-300 mb-8 backdrop-blur-sm"
                >
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>Axle 2.0 is now live</span>
                    <ArrowRight size={14} className="ml-1" />
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
                    style={{ fontFamily: 'var(--font-unbounded), sans-serif' }}
                >
                    Where Strategy Meets <br />
                    <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                        Intelligent Automation
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-10 leading-relaxed"
                >
                    Deploy autonomous agents that understand your business context.
                    Automate complex workflows with human-like reasoning and
                    enterprise-grade security.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-16"
                >
                    <Button size="lg" className="h-14 px-8 rounded-full bg-base text-black hover:bg-base/90 text-lg font-semibold w-full sm:w-auto shadow-lg shadow-white/5 transition-all hover:scale-105">
                        Start Building Free
                        <ArrowRight size={20} className="ml-2" />
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/10 hover:bg-base/5 text-white text-lg w-full sm:w-auto backdrop-blur-md">
                        <Play size={20} className="mr-2" weight="fill" />
                        Watch Demo
                    </Button>
                </motion.div>

                {/* Social Proof Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-6 text-sm text-neutral-500 mb-12"
                >
                    <div className="flex items-center gap-2">
                        <CheckCircle weight="fill" className="text-green-500" />
                        <span>No credit card required</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle weight="fill" className="text-green-500" />
                        <span>14-day free trial</span>
                    </div>
                </motion.div>
            </div>

            {/* Hero UI Mockup */}
            <motion.div
                initial={{ opacity: 0, y: 100, rotateX: 20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="w-full max-w-5xl relative z-10 perspective-1000"
            >
                <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#0A0A0A] aspect-[16/9] group">
                    {/* Fake UI Header */}
                    <div className="absolute top-0 w-full h-10 bg-base/5 border-b border-white/5 flex items-center px-4 gap-2 z-20">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <div className="mx-auto w-64 h-5 rounded-md bg-base/5" />
                    </div>

                    {/* Mockup Content Placeholders - To be replaced by actual images or better CSS art */}
                    <div className="absolute inset-0 pt-10 flex">
                        {/* Sidebar */}
                        <div className="w-64 border-r border-white/5 bg-base/2 hidden md:block p-4 space-y-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-8 rounded-md bg-base/5 w-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                            ))}
                        </div>
                        {/* Main Content */}
                        <div className="flex-1 p-6 relative">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="h-32 rounded-lg bg-base/5 border border-white/5 p-4">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 mb-3" />
                                    <div className="h-4 w-24 bg-base/10 rounded mb-2" />
                                    <div className="h-3 w-16 bg-base/5 rounded" />
                                </div>
                                <div className="h-32 rounded-lg bg-base/5 border border-white/5 p-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 mb-3" />
                                    <div className="h-4 w-24 bg-base/10 rounded mb-2" />
                                    <div className="h-3 w-16 bg-base/5 rounded" />
                                </div>
                            </div>
                            <div className="h-64 rounded-lg bg-base/5 border border-white/5 w-full relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent" />
                            </div>
                        </div>
                    </div>

                    {/* Glass overlay on hover */}
                    <div className="absolute inset-0 bg-base/0 group-hover:bg-base/5 transition-colors duration-500 pointer-events-none" />
                </div>

                {/* Glow under the image */}
                <div className="absolute -inset-4 bg-green-500/20 blur-3xl -z-10 rounded-[3rem]" />
            </motion.div>

        </section>
    );
}
