"use client";

import { motion } from "framer-motion";
import { LandingHeader } from "@/components-beta/LandingHeader";
import { Footer } from "@/components-beta/Footer";
import { BlurredOrb } from "@/components-beta/BlurredOrb";

export default function PrivacyPolicy() {
    return (
        <main className="overflow-x-hidden max-w-7xl relative mx-auto min-h-screen w-full flex flex-col items-center bg-background dark:bg-[#050505]">
            <LandingHeader />

            <div className="w-px h-full absolute left-0 top-0 bg-[rgba(55,50,47,0.12)] dark:bg-white/10 z-0"></div>
            <div className="w-px h-full absolute right-0 top-0 bg-[rgba(55,50,47,0.12)] dark:bg-white/10 z-0"></div>

            <section className="pt-40 pb-20 px-6 md:px-24 w-full relative z-10">
                <BlurredOrb width="600px" height="600px" color="bg-accent/10 dark:bg-accent-dark/10" className="-top-20 -left-20" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl"
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-dark dark:text-white mb-8 tracking-tight">
                        Privacy <span className="serif font-normal">Policy.</span>
                    </h1>

                    <div className="prose prose-invert max-w-none text-dark/70 dark:text-white/70 space-y-8 text-lg leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">1. Introduction</h2>
                            <p>
                                At Axle, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform to build and manage AI agents.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">2. Information We Collect</h2>
                            <p>
                                We collect information that you provide directly to us when you create an account, connect third-party integrations, or communicate with us.
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Account Information:</strong> Name, email address, and profile picture.</li>
                                <li><strong>Integration Data:</strong> OAuth tokens and metadata from services you connect (e.g., Google, Slack, GitHub) to enable your AI agents to perform tasks.</li>
                                <li><strong>Usage Data:</strong> Information about how you use the platform, including agent configurations and execution history.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">3. How We Use Your Information</h2>
                            <p>
                                We use the collected information to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Provide, maintain, and improve our services.</li>
                                <li>Enable authentication and secure access to your account.</li>
                                <li>Allow your AI agents to interact with your connected tools and workflows.</li>
                                <li>Process payments and manage subscriptions via Stripe.</li>
                                <li>Communicate with you about updates, security, and support.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">4. Data Security</h2>
                            <p>
                                We implement industry-standard security measures to protect your data. All sensitive information, including OAuth tokens, is encrypted using AES-256 before being stored in our database. We use secure HTTPS protocols for all data transmissions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">5. Third-Party Services</h2>
                            <p>
                                Axle integrates with various third-party services. When you connect these services, you are subject to their respective privacy policies. We only request the minimum permissions necessary for your agents to function as intended.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">6. Your Rights</h2>
                            <p>
                                You have the right to access, update, or delete your personal information at any time. You can disconnect integrations or delete your account through the settings dashboard, which will permanently remove your data from our active systems.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">7. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@heyaxle.com" className="text-accent underline">apps.nexia.axle@gmail.com</a>.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
