'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'

interface PlanState {
    plan: string
    credits: number
    creditsLimit: number
    agentLimit: number
    subscriptionStatus: string
    subscriptionCurrentPeriodEnd?: string
    loading: boolean
    refresh: () => void
}

const PlanContext = createContext<PlanState>({
    plan: 'free',
    credits: 0,
    creditsLimit: 100,
    agentLimit: 2,
    subscriptionStatus: 'free',
    loading: true,
    refresh: () => { },
})

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<Omit<PlanState, 'refresh'>>({
        plan: 'free',
        credits: 0,
        creditsLimit: 100,
        agentLimit: 2,
        subscriptionStatus: 'free',
        loading: true,
    })

    const fetchBilling = useCallback(async () => {
        try {
            const data = await api.getBillingStatus()
            setState({
                plan: data.plan || 'free',
                credits: data.credits ?? 0,
                creditsLimit: data.creditsLimit ?? 100,
                agentLimit: data.agentLimit ?? 2,
                subscriptionStatus: data.subscriptionStatus || 'free',
                subscriptionCurrentPeriodEnd: data.subscriptionCurrentPeriodEnd,
                loading: false,
            })
        } catch {
            setState(prev => ({ ...prev, loading: false }))
        }
    }, [])

    useEffect(() => {
        fetchBilling()
    }, [fetchBilling])

    return (
        <PlanContext.Provider value={{ ...state, refresh: fetchBilling }}>
            {children}
        </PlanContext.Provider>
    )
}

export const usePlan = () => useContext(PlanContext)
