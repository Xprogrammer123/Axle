"use client";

import { motion } from "framer-motion";
import { LandingHeader } from "@/components-beta/LandingHeader";
import { Footer } from "@/components-beta/Footer";
import { BlurredOrb } from "@/components-beta/BlurredOrb";

export default function TermsOfService() {
    return (
        <main className="overflow-x-hidden max-w-7xl relative mx-auto min-h-screen w-full flex flex-col items-center bg-background dark:bg-[#050505]">
            <LandingHeader />

            <div className="w-px h-full absolute left-0 top-0 bg-[rgba(55,50,47,0.12)] dark:bg-white/10 z-0"></div>
            <div className="w-px h-full absolute right-0 top-0 bg-[rgba(55,50,47,0.12)] dark:bg-white/10 z-0"></div>

            <section className="pt-40 pb-20 px-6 md:px-24 w-full relative z-10">
                <BlurredOrb width="700px" height="700px" color="bg-blue-500/5 dark:bg-blue-400/5" className="top-1/2 -right-40" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl"
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-dark dark:text-white mb-8 tracking-tight">
                        Terms of <span className="serif font-normal">Service.</span>
                    </h1>

                    <div className="prose prose-invert max-w-none text-dark/70 dark:text-white/70 space-y-8 text-lg leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using Axle, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">2. Description of Service</h2>
                            <p>
                                Axle provides a platform for creating, configuring, and deploying AI agents that can interact with third-party applications and automate workflows.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">3. User Accounts</h2>
                            <p>
                                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating an account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">4. Acceptable Use</h2>
                            <p>
                                You agree not to use Axle for any illegal or unauthorized purpose. You are solely responsible for the behavior of the AI agents you create and must ensure they comply with the terms of use of any connected third-party services.
                            </p>
                            <p>Prohibited activities include but are not limited to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Spamming or sending unsolicited communications.</li>
                                <li>Accessing data you are not authorized to access.</li>
                                <li>Interfering with the platform's security or performance.</li>
                                <li>Developing agents for malicious or deceptive purposes.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">5. Credits and Billing</h2>
                            <p>
                                Axle uses a credit-based system for agent executions. Credits are allocated based on your subscription plan and reset monthly. Unused credits do not roll over. All billing is handled securely through Stripe.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">6. Intellectual Property</h2>
                            <p>
                                You retain ownership of the content and configurations you create on Axle. Axle owns the platform, including its software, trademarks, and design elements.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">7. Limitation of Liability</h2>
                            <p>
                                Axle is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the platform or the actions of AI agents deployed through our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">8. Termination</h2>
                            <p>
                                We reserve the right to suspend or terminate your account if you violate these terms or for any other reason at our sole discretion.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">9. Changes to Terms</h2>
                            <p>
                                We may update these terms from time to time. We will notify you of any significant changes by posting the new terms on this page.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
