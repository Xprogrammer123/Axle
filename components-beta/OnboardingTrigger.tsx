'use client'

import React, { useEffect, useState } from 'react'
import { useOnborda } from 'onborda'
import { cn } from '@/lib/utils'

export const OnboardingTrigger: React.FC = () => {
    const { startOnborda } = useOnborda()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!isMounted) return

        // Check if user has already seen the tour
        const hasSeenTour = localStorage.getItem('axle_onboarding_completed')

        if (!hasSeenTour) {
            // Longer delay for mobile to ensure everything is loaded and rendered
            // Also check if elements exist before starting
            const timer = setTimeout(() => {
                // Verify that key elements exist before starting tour
                const firstElement = document.querySelector('#dashboard-magic-input')

                if (firstElement) {
                    try {
                        startOnborda('main')
                    } catch (error) {
                        console.error('Error starting onboarding:', error)
                    }
                } else {
                    // Retry after a longer delay if elements not ready
                    setTimeout(() => {
                        try {
                            startOnborda('main')
                        } catch (error) {
                            console.error('Error starting onboarding (retry):', error)
                        }
                    }, 2000)
                }
            }, 1500)

            return () => clearTimeout(timer)
        }
    }, [startOnborda, isMounted])

    return null // This component doesn't render anything
}

// Optional: Add a manual trigger button for testing or allowing users to replay
export const ManualOnboardingTrigger: React.FC<{
    className?: string
    children?: React.ReactNode
}> = ({ className, children }) => {
    const { startOnborda } = useOnborda()

    const handleStart = () => {
        if (window.innerWidth < 1024) {
            localStorage.removeItem('axle_onboarding_completed')
            window.location.reload() // Simplest way to re-trigger the state-based onboarding in AppLayout
            return
        }
        try {
            startOnborda('main')
        } catch (error) {
            console.error('Error starting onboarding:', error)
        }
    }

    return (
        <button
            onClick={handleStart}
            className={cn(
                "px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-medium transition-all active:scale-95 shadow-lg shadow-accent/20",
                className
            )}
            aria-label="Start guided tour"
        >
            {children || '🎯 Start Tour'}
        </button>
    )
}