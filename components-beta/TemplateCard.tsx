'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Notebook } from '@phosphor-icons/react'
import { Button } from './Button'

interface TemplateCardProps {
    name: string
    description: string
    prompt: string
    category?: string
}

const TemplateCard = ({ name, description, prompt, category }: TemplateCardProps) => {
    // Create URLSearchParams to pass data to the new agent page
    const params = new URLSearchParams({
        name: name,
        description: description,
        instructions: prompt,
    })

    return (
        <div className='bg-white/75 dark:bg-white/3 border border-gray-200 dark:border-white/5 rounded-3xl p-6 flex flex-col h-full hover:border-gray-300 dark:hover:border-white/10 transition-colors shadow-0'>
            <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white">
                    <Notebook size={24} weight="duotone" />
                </div>
                {category && (
                    <span className='px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400'>
                        {category}
                    </span>
                )}
            </div>

            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1'>
                {name}
            </h3>

            <p className='text-sm text-gray-500 dark:text-gray-400 mb-6 flex-grow line-clamp-3'>
                {description}
            </p>

            <div className='mt-auto pt-4 border-t border-gray-100 dark:border-white/5'>
                <Button className='py-3 w-full'>
                    <Link
                    href={`/app/agents/new?${params.toString()}`}
                    className='flex items-center gap-1.5'
                >
                    Use Template
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                </Button>
            </div>
        </div>
    )
}

export default TemplateCard
