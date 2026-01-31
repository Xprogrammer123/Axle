'use client'

import React, { useState } from 'react'
import { X, Lightbulb, Bug, Sparkle, PaperPlaneTilt } from '@phosphor-icons/react'
import { Button } from '@/components-beta/Button'

type FeedbackType = 'suggestion' | 'bug' | 'feature'

interface FeedbackModalProps {
    isOpen?: boolean
    onClose?: () => void
    onSubmit?: (data: { type: FeedbackType; title: string; message: string }) => void
}

const FeedbackModal = ({ isOpen = true, onClose, onSubmit }: FeedbackModalProps) => {
    const [selectedType, setSelectedType] = useState<FeedbackType>('suggestion')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const feedbackTypes = [
        {
            type: 'suggestion' as FeedbackType,
            icon: Lightbulb,
            label: 'Suggestion',
            description: 'Share ideas to improve',
            color: 'text-rose-500',
            bgColor: 'bg-rose-50',
            borderColor: 'border-rose-200',
        },
        {
            type: 'bug' as FeedbackType,
            icon: Bug,
            label: 'Bug Report',
            description: 'Help us fix issues',
            color: 'text-gray-600',
            bgColor: 'bg-gray-50',
            borderColor: 'border-gray-200',
        },
        {
            type: 'feature' as FeedbackType,
            icon: Sparkle,
            label: 'Feature Request',
            description: 'Request new functionality',
            color: 'text-gray-600',
            bgColor: 'bg-gray-50',
            borderColor: 'border-gray-200',
        },
    ]

    const handleSubmit = () => {
        setLoading(true)
        if (message.trim() && onSubmit) {
            onSubmit({ type: selectedType, title: '', message })
            setMessage('')
            setSelectedType('suggestion')
        }
        setLoading(false)
    }

    if (!isOpen) return null

    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
            <div className='bg-white dark:bg-neutral-900 w-full max-w-xl rounded-3xl shadow-2xl'>
                {/* Header */}
                <div className='flex items-center justify-between p-6 pb-4'>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>Create Feedback</h2>
                    <button
                        onClick={onClose}
                        className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors'
                    >
                        <X size={20} className='text-gray-500 dark:text-gray-400' />
                    </button>
                </div>

                {/* Feedback Type Selection */}
                <div className='px-6 pb-4'>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                        {feedbackTypes.map((item) => {
                            const Icon = item.icon
                            const isSelected = selectedType === item.type

                            return (
                                <button
                                    key={item.type}
                                    onClick={() => setSelectedType(item.type)}
                                    className={`
                    p-4 rounded-2xl border transition-all duration-200 text-center
                    ${isSelected
                                            ? 'border-accent border-2 bg-accent/10 dark:bg-accent/10 dark:border-accent/50'
                                            : 'border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 hover:border-gray-300 dark:hover:border-neutral-600'
                                        }
                  `}
                                >
                                    <div className='flex flex-col items-center gap-2'>
                                        <Icon
                                            size={24}
                                            weight={isSelected ? 'fill' : 'regular'}
                                            className={isSelected ? 'text-accent' : 'text-gray-500 dark:text-gray-400'}
                                        />
                                        <span className={`text-sm font-medium ${isSelected ? 'text-accent dark:text-accent' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {item.label}
                                        </span>
                                        <span className='text-xs text-gray-500 dark:text-gray-400'>
                                            {item.description}
                                        </span>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Title Input */}
                <div className='px-6 pb-4'>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder='Describe your feedback in detail...'
                        className='w-full h-48 p-4 rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-0 dark:focus:border-0 transition-all'
                    />
                </div>

                {/* Submit Button */}
                <div className='px-6 pb-6 flex justify-end'>
                    <Button
                        onClick={handleSubmit}
                        disabled={!message.trim()}
                        className='flex items-center gap-2 px-5 py-2.5 text-white rounded-full font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                        loading={loading}
                    >
                        <PaperPlaneTilt size={18} weight='fill' />
                        Submit Feedback
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default FeedbackModal