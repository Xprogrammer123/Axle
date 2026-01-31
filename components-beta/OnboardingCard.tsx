'use client'

import React from 'react'
import { CardComponentProps, useOnborda } from 'onborda'
import { X, CaretRight, CaretLeft } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Button } from './Button'
import { useUI } from '@/context/UIContext'
import { useEffect } from 'react'
import { steps } from '@/lib/onboarding/steps'
import { api } from '@/lib/api'

const OnboardingCard: React.FC<CardComponentProps> = ({
    step,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    arrow
}) => {
    const { closeOnborda } = useOnborda()
    const { setSidebarOpen } = useUI()

    const tourSteps = steps[0].steps

    // Mobile optimization: Open sidebar automatically when navigation step is reached
    useEffect(() => {
        if (step.selector === '#sidebar-nav' && window.innerWidth < 768) {
            setSidebarOpen(true)
        }
    }, [step.selector, setSidebarOpen])

    const handleClose = async () => {
        setSidebarOpen(false)
        closeOnborda()
        try {
            await api.updateProfile({ hasCompletedOnboarding: true })
        } catch (e) {
            console.error("Failed to update onboarding status:", e)
        }
    }

    const handleFinish = async () => {
        setSidebarOpen(false)
        closeOnborda()
        try {
            await api.updateProfile({ hasCompletedOnboarding: true })
        } catch (e) {
            console.error("Failed to update onboarding status:", e)
        }
    }

    const onNext = () => {
        const nextStepIndex = currentStep + 1;

        if (nextStepIndex < totalSteps && tourSteps[nextStepIndex].selector === '#sidebar-nav' && window.innerWidth < 768) {
            setSidebarOpen(true)
        }

        if (step.selector === '#sidebar-nav' && window.innerWidth < 768) {
            setSidebarOpen(false)
        }

        if (currentStep === totalSteps - 1) {
            handleFinish()
        } else {
            nextStep()
        }
    }

    const onPrev = () => {
        const prevStepIndex = currentStep - 1;

        if (prevStepIndex >= 0 && tourSteps[prevStepIndex].selector === '#sidebar-nav' && window.innerWidth < 768) {
            setSidebarOpen(true)
        }

        if (step.selector === '#sidebar-nav' && window.innerWidth < 768) {
            setSidebarOpen(false)
        }

        prevStep()
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative w-[min(90vw,340px)] sm:w-[360px]
                       bg-white dark:bg-neutral-900 
                       border border-neutral-200 dark:border-neutral-700 
                       rounded-2xl 
                       p-5
                       shadow-2xl shadow-black/20 dark:shadow-black/60"
        >
            {/* Close Button */}
            <button
                onClick={handleClose}
                className="absolute top-3 right-3 
                           p-1.5 rounded-lg 
                           text-neutral-400 hover:text-neutral-600 
                           dark:text-neutral-500 dark:hover:text-neutral-300
                           hover:bg-neutral-100 dark:hover:bg-neutral-800
                           transition-colors
                           z-10"
                aria-label="Close onboarding"
            >
                <X size={16} weight="bold" />
            </button>

            {/* Header */}
            <div className="mb-4 pr-6">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="w-10 h-10 flex-shrink-0
                                  rounded-xl 
                                  bg-gradient-to-br from-accent/10 to-base/10
                                  dark:from-accent/20 dark:to-base/20
                                  border border-accent/20 dark:border-accent/30
                                  flex items-center justify-center 
                                  text-xl">
                        {step.icon as string || "✨"}
                    </div>

                    {/* Title and Step Counter */}
                    <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-semibold 
                                     text-neutral-400 dark:text-neutral-500 
                                     uppercase tracking-wide mb-0.5">
                            {currentStep + 1} of {totalSteps}
                        </div>
                        <h2 className="text-base font-bold 
                                     text-neutral-900 dark:text-white 
                                     leading-snug">
                            {step.title}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mb-5">
                <p className="text-[14px] leading-relaxed 
                            text-neutral-600 dark:text-neutral-400">
                    {step.content as string}
                </p>
            </div>

            {/* Footer / Controls */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                {/* Progress Dots */}
                <div className="flex gap-1 flex-shrink-0">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-300 
                                ${i === currentStep
                                    ? 'w-5 bg-accent'
                                    : 'w-1 bg-neutral-300 dark:bg-neutral-700'
                                }`}
                        />
                    ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-1.5 flex-shrink-0">
                    {currentStep > 0 && (
                        <button
                            onClick={onPrev}
                            className="p-2 rounded-lg 
                                     text-neutral-500 dark:text-neutral-400 
                                     hover:bg-neutral-100 dark:hover:bg-neutral-800
                                     transition-colors"
                            aria-label="Previous step"
                        >
                            <CaretLeft size={16} weight="bold" />
                        </button>
                    )}
                    <Button
                        onClick={onNext}
                        variant="primary"
                        className="px-4 py-2 text-sm font-medium"
                        aria-label={currentStep === totalSteps - 1 ? 'Finish onboarding' : 'Next step'}
                    >
                        {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
                        {currentStep !== totalSteps - 1 && (
                            <CaretRight size={14} weight="bold" className="ml-1" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Arrow - Hidden on small screens for cleaner look */}
            {arrow && (
                <div className="absolute -z-10 hidden sm:block">
                    {arrow}
                </div>
            )}
        </motion.div>
    )
}

export default OnboardingCard