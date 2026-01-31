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

        // OnboardingTrigger is only rendered by AppLayout if !user?.hasCompletedOnboarding
        const timer = setTimeout(() => {
            const firstElement = document.querySelector('#dashboard-magic-input')

            if (firstElement) {
                try {
                    startOnborda('main')
                } catch (error) {
                    console.error('Error starting onboarding:', error)
                }
            } else {
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
    }, [startOnborda, isMounted])

    return null
}

export const ManualOnboardingTrigger: React.FC<{
    className?: string
    children?: React.ReactNode
}> = ({ className, children }) => {
    const { startOnborda } = useOnborda()

    const handleStart = () => {
        if (window.innerWidth < 1024) {
            // For mobile, we reload to trigger the state-based onboarding in AppLayout
            // We should ideally have a way to reset the DB flag if we want manual re-trigger
            window.location.reload()
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