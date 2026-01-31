'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CaretRight, CaretLeft, Check } from '@phosphor-icons/react'
import { Button } from './Button'

const slides = [
    {
        id: 1,
        icon: "✨",
        title: "Welcome to Axle",
        description: "Your powerful AI command center. Build specialized agents to automate your workflow effortlessly.",
        color: "from-blue-500/20 to-indigo-500/20"
    },
    {
        id: 2,
        icon: "🤖",
        title: "AI Automation",
        description: "Ask Axle to perform complex tasks, from coding to content creation, using state-of-the-art AI models.",
        color: "from-purple-500/20 to-pink-500/20"
    },
    {
        id: 3,
        icon: "🔌",
        title: "Seamless Integrations",
        description: "Connect GitHub, Google, and X to give your agents access to your favorite tools and data.",
        color: "from-orange-500/20 to-red-500/20"
    },
    {
        id: 4,
        icon: "🚀",
        title: "Welcome to Axle",
        description: "You're all set! Start building your first agent and experience the future of productivity.",
        color: "from-emerald-500/20 to-teal-500/20",
        isLast: true
    }
]

interface MobileOnboardingProps {
    onComplete: () => void
}

const MobileOnboarding: React.FC<MobileOnboardingProps> = ({ onComplete }) => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [direction, setDirection] = useState(0)

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setDirection(1)
            setCurrentSlide(prev => prev + 1)
        } else {
            handleComplete()
        }
    }

    const handlePrev = () => {
        if (currentSlide > 0) {
            setDirection(-1)
            setCurrentSlide(prev => prev - 1)
        }
    }

    const handleComplete = () => {
        localStorage.setItem('axle_onboarding_completed', 'true')
        onComplete()
    }

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0
        })
    }

    return (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center p-6 sm:hidden">
            <div className="w-full max-w-sm relative h-[500px] flex flex-col">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentSlide}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="absolute inset-0 flex flex-col items-center text-center"
                    >
                        <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${slides[currentSlide].color} flex items-center justify-center text-6xl mb-8 border border-white/10 shadow-xl`}>
                            {slides[currentSlide].icon}
                        </div>

                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                            {slides[currentSlide].title}
                        </h2>

                        <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed px-4">
                            {slides[currentSlide].description}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="w-full max-w-md mt-12 flex flex-col items-center gap-8">
                {/* Dots */}
                <div className="flex gap-2">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-accent' : 'w-2 bg-neutral-200 dark:bg-neutral-800'
                                }`}
                        />
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex w-full gap-4">
                    {currentSlide > 0 && (
                        <button
                            onClick={handlePrev}
                            className="flex-1 py-4 px-6 rounded-2xl bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 font-semibold flex items-center justify-center gap-2"
                        >
                            <CaretLeft size={20} weight="bold" />
                            Back
                        </button>
                    )}
                    <Button
                        onClick={handleNext}
                        variant="primary"
                        className="flex-[2] py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2"
                    >
                        {slides[currentSlide].isLast ? (
                            <>
                                Get Started
                                <Check size={20} weight="bold" />
                            </>
                        ) : (
                            <>
                                Next
                                <CaretRight size={20} weight="bold" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default MobileOnboarding
