'use client';

import { motion } from 'framer-motion';

const companies = [
    "Acme Corp", "Globex", "Initech", "Umbrella", "Cyberdyne", "Soylent", "Massive Dynamic"
];

export function SocialProof() {
    return (
        <section className="py-10 border-y border-white/5 bg-white/[0.01]">
            <div className="max-w-6xl mx-auto px-4">
                <p className="text-center text-sm font-medium text-neutral-500 mb-8 uppercase tracking-wider">
                    Trusted by forward-thinking engineering teams
                </p>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Simple typography logos for now, as we don't have SVGs */}
                    {companies.map((company) => (
                        <span key={company} className="text-xl font-bold text-white/40 hover:text-white transition-colors cursor-default">
                            {company}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
