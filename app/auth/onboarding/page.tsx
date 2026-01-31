"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    CaretRight,
    Check,
    UploadSimple,
    User,
    ArrowRight
} from "@phosphor-icons/react";
import { api } from "@/lib/api";
import Logo from "@/components-beta/Logo";
import { Button } from "@/components-beta/Button";
import Image from "next/image";
import { StaggerContainer, StaggerItem } from "@/components/ui/animations";


export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        avatar: "",
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Fetch initial profile data (e.g., name from auth)
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await api.getProfile();
                if (profile && (profile as any).name) {
                    setFormData(prev => ({ ...prev, name: (profile as any).name }));
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };
        fetchProfile();
    }, []);

    const handleNext = () => {
        setStep(prev => prev + 1);
    };

    const handleComplete = async () => {
        try {
            setLoading(true);

            // Update profile
            await api.updateProfile({
                name: formData.name,
                // Only send avatar if it was changed/set
                ...(formData.avatar ? { avatar: formData.avatar } : {})
            });

            // Redirect to app
            router.push("/app");
        } catch (error) {
            console.error("Failed to complete onboarding:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create preview URL
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);

            // Convert to base64 for API
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    };

    return (
        <div className="min-h-screen w-full flex bg-background dark:bg-[#0f0f0f] text-dark dark:text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-accent/5 to-transparent pointer-events-none rounded-full blur-3xl opacity-50" />
            </div>

            <div className="w-full max-w-2xl mx-auto flex flex-col justify-center items-center p-6 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 flex flex-col items-center gap-4"
                >
                    <Logo size={48} />
                    {/* Progress Indicators */}
                    <div className="flex gap-2 mt-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`transition-all duration-300 rounded-full h-1.5 ${step >= i ? "w-8 bg-accent" : "w-2 bg-dark/10 dark:bg-white/10"
                                    }`}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Content Wizard */}
                <div className="w-full max-w-md">
                    <AnimatePresence mode="wait" custom={1}>
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                custom={1}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="flex flex-col items-center text-center space-y-6"
                            >
                                <div className="space-y-4">
                                    <h1 className="text-4xl font-bold tracking-tight">
                                        Welcome to <span className="text-accent">Axle</span>
                                    </h1>
                                    <p className="text- text-dark/70 dark:text-white/70 leading-relaxed">
                                        Your intelligent AI agent platform. Automate tasks, research effectively, and build powerful workflows.
                                    </p>
                                </div>

                                <StaggerContainer className="grid grid-cols-2 gap-4 w-full mt-8">
                                    <StaggerItem>
                                        <div className="bg-white/50 dark:bg-white/5 p-4 rounded-2xl border border-dark/5 dark:border-white/5 backdrop-blur-sm h-full">
                                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-3 mx-auto text-accent">
                                                <ArrowRight weight="bold" size={20} />
                                            </div>
                                            <h3 className="font-semibold mb-1">Automate</h3>
                                            <p className="text-xs text-dark/60 dark:text-white/60">Streamline repetitive tasks instantly</p>
                                        </div>
                                    </StaggerItem>
                                    <StaggerItem>
                                        <div className="bg-white/50 dark:bg-white/5 p-4 rounded-2xl border border-dark/5 dark:border-white/5 backdrop-blur-sm h-full">
                                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-3 mx-auto text-accent">
                                                <Check weight="bold" size={20} />
                                            </div>
                                            <h3 className="font-semibold mb-1">Create</h3>
                                            <p className="text-xs text-dark/60 dark:text-white/60">Build custom agents for any need</p>
                                        </div>
                                    </StaggerItem>
                                </StaggerContainer>

                                <Button
                                    onClick={handleNext}
                                    className="mt-8 gap-1 group relative w-full items-center flex justify-center py-3.5"
                                >
                                    Get Started
                                    <CaretRight className="size-4 animate-pulse" weight="bold" />
                                </Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                custom={1}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="flex flex-col items-center text-center space-y-8 w-full"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold">What should we call you?</h2>
                                    <p className="text-dark/60 dark:text-white/60">
                                        This is how your agents will address you.
                                    </p>
                                </div>

                                <div className="w-full">
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40 dark:text-white/40 text-xl" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Your Name"
                                            autoFocus
                                            className="w-full bg-white dark:bg-white/5 border border-dark/10 dark:border-white/10 rounded-full py-3.5 pl-12 pr-4 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-dark/30 dark:placeholder:text-white/30"
                                            onKeyDown={(e) => e.key === "Enter" && formData.name && handleNext()}
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={handleNext}
                                    disabled={!formData.name.trim()}
                                    className="w-full items-center gap-1 flex justify-center py-3.5"
                                >
                                    Continue
                                    <CaretRight className="size-4" weight="bold" />
                                </Button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                custom={1}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="flex flex-col items-center text-center space-y-8 w-full"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold">Add a photo</h2>
                                    <p className="text-dark/60 dark:text-white/60">
                                        Add a photo to your profile
                                    </p>
                                </div>

                                <div className="relative group cursor-pointer w-40 h-40">
                                    <div className={`w-full h-full rounded-full overflow-hidden border-3 ${previewUrl ? 'border-accent' : 'border-dashed border-dark/20 dark:border-white/20'} bg-dark/5 dark:bg-white/5 flex items-center justify-center relative transition-colors group-hover:border-accent/50`}>
                                        {previewUrl ? (
                                            <Image
                                                src={previewUrl}
                                                alt="Profile preview"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <UploadSimple className="text-4xl text-dark/30 dark:text-white/30" />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        {/* Hover overlay hint */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium backdrop-blur-[1px]">
                                            {previewUrl ? 'Change Photo' : 'Upload Photo'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 w-full">
                                    <Button
                                        onClick={handleComplete}
                                        disabled={loading}
                                        className="w-full items-center gap-1 flex justify-center py-3"
                                        loading={loading}
                                    >
                                        {loading ? (
                                            <span className="" />
                                        ) : (
                                            "Complete Setup"
                                        )}
                                    </Button>
                                    <button
                                        onClick={handleComplete}
                                        disabled={loading}
                                        className="text-sm text-dark/50 dark:text-white/50 hover:text-dark dark:hover:text-white transition-colors"
                                    >
                                        Skip for now
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
