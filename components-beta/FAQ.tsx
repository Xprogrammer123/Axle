"use client";

import { useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";

const faqs = [
    {
        question: "What is Axle?",
        answer:
            "Axle is a platform for creating, configuring, and controlling AI agents without code. You define behavior, connect tools, and deploy from one dashboard.",
    },
    {
        question: "Is Axle just another chatbot?",
        answer:
            "No. Axle agents take actions, follow rules, and run workflows across real tools. They’re autonomous systems, not chat-only bots.",
    },
    {
        question: "Do I need technical knowledge?",
        answer:
            "No. Axle is built for non-technical users. If you can explain what you want an agent to do, you can build one.",
    },
    {
        question: "What tools can agents connect to?",
        answer:
            "Agents can connect to tools like GitHub, Google, and X. You control permissions at all times.",
    },
    {
        question: "Can agents act without my control?",
        answer:
            "No. Every agent operates within boundaries you define. Nothing runs or takes action without permission.",
    },
    {
        question: "What happens if I cancel?",
        answer:
            "Cancel anytime. No lock-in. Your agents stop running and you keep control of your data.",
    },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-24 px-4 w-full flex flex-col items-center">
            <div className="flex flex-col gap-2 mb-12 text-center">
                <div className="text-balance text-dark dark:text-white md:text-[2.5rem] text-3xl font-bold tracking-wide">
                    Frequently Asked <span className="serif font-normal">Questions.</span>
                </div>
                <p className="text-dark/50 dark:text-white/50 mx-auto max-w-sm">
                    Everything you need to know about Axle and how it works.
                </p>
            </div>

            <div className="max-w-3xl w-full flex flex-col gap-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="w-full border border-dark/3 dark:border-white/5 bg-white/60 dark:bg-white/3 rounded-3xl overflow-hidden transition-all duration-300 hover:border-dark/10 dark:hover:border-white/10"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex items-center justify-between p-6 text-left"
                        >
                            <h3 className="text-lg font-semibold text-dark dark:text-white">
                                {faq.question}
                            </h3>
                            <CaretDownIcon
                                className={`size-5 text-dark/50 dark:text-white/50 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        <div
                            className={`grid transition-[grid-template-rows] duration-300 ease-out ${openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                }`}
                        >
                            <div className="overflow-hidden">
                                <p className="pb-6 px-6 text-dark/60 dark:text-white/60 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
