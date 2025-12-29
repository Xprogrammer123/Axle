'use client';

import { Robot, ShareNetwork, ChartLineUp, ShieldCheck, Lightning, SquaresFour } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

const features = [
    {
        title: "Autonomous Agents",
        description: "Deploy AI agents that can browse the web, interact with APIs, and make decisions independently.",
        icon: <Robot size={32} className="text-green-400" />,
        className: "md:col-span-2 md:row-span-2",
    },
    {
        title: "Workflow Automation",
        description: "Chain multiple agents together to create complex, self-healing workflows.",
        icon: <ShareNetwork size={32} className="text-blue-400" />,
        className: "md:col-span-1 md:row-span-1",
    },
    {
        title: "Real-time Analytics",
        description: "Monitor agent performance and costs in real-time with granular dashboards.",
        icon: <ChartLineUp size={32} className="text-purple-400" />,
        className: "md:col-span-1 md:row-span-1",
    },
    {
        title: "Enterprise Security",
        description: "SOC2 compliant infrastructure with role-based access control and audit logs.",
        icon: <ShieldCheck size={32} className="text-yellow-400" />,
        className: "md:col-span-1 md:row-span-1",
    },
    {
        title: "Instant Scaling",
        description: "Scale from one to thousands of concurrent agents without managing infrastructure.",
        icon: <Lightning size={32} className="text-orange-400" />,
        className: "md:col-span-1 md:row-span-1",
    },
    {
        title: "400+ Integrations",
        description: "Connect to your favorite tools: Slack, GitHub, Linear, Notion, and more.",
        icon: <SquaresFour size={32} className="text-cyan-400" />,
        className: "md:col-span-2 md:row-span-1",
    },
];

export function FeatureGrid() {
    return (
        <section id="features" className="py-24 px-4 relative">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-unbounded)' }}>
                        Powering the Next Generation <br /> of <span className="text-green-500">Intelligent Work</span>
                    </h2>
                    <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
                        Everything you need to build, deploy, and scale autonomous AI agents in one unified platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 auto-rows-[minmax(180px,auto)]">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`group relative p-8 rounded-3xl bg-neutral-900/50 border border-white/5 overflow-hidden hover:border-white/10 transition-colors ${feature.className}`}
                        >
                            {/* Hover Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="mb-4 p-3 bg-white/5 w-fit rounded-xl border border-white/5">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                                <p className="text-neutral-400 text-sm leading-relaxed">{feature.description}</p>

                                {/* Decorative Elements for larger cards */}
                                {feature.className.includes('md:col-span-2') && (
                                    <div className="flex-1 mt-6 rounded-lg bg-black/40 border border-white/5 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-grid-white/[0.02]" />
                                        {/* Abstract UI shapes */}
                                        <div className="absolute top-4 left-4 w-3/4 h-2 bg-white/10 rounded-full" />
                                        <div className="absolute top-8 left-4 w-1/2 h-2 bg-white/5 rounded-full" />
                                        <div className="absolute top-12 left-4 w-1/4 h-2 bg-white/5 rounded-full" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
