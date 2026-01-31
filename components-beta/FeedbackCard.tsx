'use client'

import React from 'react'
import { Lightbulb, Bug, Sparkle } from '@phosphor-icons/react'

export type FeedbackStatus = 'under-review' | 'planned' | 'in-progress' | 'completed'
export type FeedbackType = 'suggestion' | 'bug' | 'feature'

interface FeedbackCardProps {
    type: FeedbackType
    date: string
    title: string
    description: string
    status: FeedbackStatus
}

const FeedbackCard = ({ type, date, title, description, status }: FeedbackCardProps) => {
    const getTypeConfig = (type: FeedbackType) => {
        switch (type) {
            case 'suggestion':
                return {
                    icon: Lightbulb,
                    label: 'Suggestion',
                    color: 'text-rose-500',
                    bg: 'bg-rose-50 dark:bg-rose-500/10',
                }
            case 'bug':
                return {
                    icon: Bug,
                    label: 'Bug Report',
                    color: 'text-red-500',
                    bg: 'bg-red-50 dark:bg-red-500/10',
                }
            case 'feature':
                return {
                    icon: Sparkle,
                    label: 'Feature Request',
                    color: 'text-purple-500',
                    bg: 'bg-purple-50 dark:bg-purple-500/10',
                }
        }
    }

    const getStatusConfig = (status: FeedbackStatus) => {
        switch (status) {
            case 'under-review':
                return { label: 'Under Review', bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400' }
            case 'planned':
                return { label: 'Planned', bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' }
            case 'in-progress':
                return { label: 'In Progress', bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400' }
            case 'completed':
                return { label: 'Completed', bg: 'bg-green-50 dark:bg-green-500/10', text: 'text-green-600 dark:text-green-400' }
        }
    }

    const typeConfig = getTypeConfig(type)
    const statusConfig = getStatusConfig(status)
    const Icon = typeConfig.icon

    return (
        <div className='bg-white/75 dark:bg-neutral-900 border border-dark/5 dark:border-white/5 rounded-2xl p-5 hover:border-dark/10 dark:hover:border-white/10 transition-colors shadow-0'>
            <div className='flex items-center justify-between mb-3'>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${typeConfig.bg} ${typeConfig.color}`}>
                    <Icon size={14} weight="fill" />
                    {typeConfig.label}
                </span>
                <span className='text-xs text-gray-400 dark:text-neutral-500 font-medium'>
                    {date}
                </span>
            </div>

            <h4 className='text-sm font-medium text-gray-900 dark:text-white mb-4 line-clamp-2'>
                {description || 'Community Insight'}
            </h4>

            <div>
                <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                    {statusConfig.label}
                </span>
            </div>
        </div>
    )
}

export default FeedbackCard
