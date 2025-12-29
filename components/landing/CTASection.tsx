'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

export function CTASection() {
    return (
        <section className="py-32 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-green-500/5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-bold mb-6 text-white"
                    style={{ fontFamily: 'var(--font-unbounded)' }}
                >
                    Ready to Automate Your Future?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto"
                >
                    Join thousands of developers building the next generation of intelligent applications with Axle.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <Button size="lg" className="h-16 px-10 rounded-full bg-green-500 hover:bg-green-400 text-black text-xl font-bold transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(74,222,128,0.5)]">
                        Get Started for Free
                        <ArrowRight size={24} className="ml-2" weight="bold" />
                    </Button>
                    <p className="mt-4 text-sm text-neutral-500">
                        No credit card required. Cancel anytime.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
