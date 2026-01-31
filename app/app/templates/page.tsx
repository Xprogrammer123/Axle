"use client"
import React, { useState, useMemo } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import TemplateCard from '@/components-beta/TemplateCard'
import { templates } from './templates-data'

const TemplatesPage = () => {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredTemplates = useMemo(() => {
        const lowerQuery = searchQuery.toLowerCase()
        return templates.filter(template =>
            template.name.toLowerCase().includes(lowerQuery) ||
            template.description.toLowerCase().includes(lowerQuery) ||
            template.category.toLowerCase().includes(lowerQuery)
        )
    }, [searchQuery])

    return (
        <div className="h-full pt-20 overflow-y-auto gap-7 flex flex-col w-full p-5 md:p-10 max-w-7xl mx-auto custom-scrollbar">
            <div className="bg-dark/15 dark:bg-white/7 w-2/3 mx-auto absolute -top-20 rounded-full blur-[100px] left-0 right-0 h-32"></div>

            {/* Header Section */}
            <div className="flex flex-col gap-6 max-w-3xl">
                <div className='flex flex-col gap-1'>
                    <h1 className="text-[28px] font-semibold bg-clip-text bg-linear-to-b from-dark/50 to-dark dark:from-white dark:to-white/50 text-transparent">
                        Browse Templates
                    </h1>
                    <p className="text-sm max-w-lg font-medium text-dark/50 dark:text-white/50">
                        Jumpstart your agent creation with our curated library of real-world templates. customize them to fit your specific needs.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full">
                    <div className="p-2.5 w-full rounded-full bg-dark/5 group focus-within:ring-1 focus-within:ring-accent dark:bg-white/5 border border-dark/5 dark:border-white/5 flex items-center gap-1.5 transition-all">
                        <MagnifyingGlass className="size-4 text-dark/50 dark:text-white/50" />
                        <input
                            type="text"
                            placeholder="Search templates by name, description, or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 text-sm bg-transparent outline-none text-dark dark:text-white placeholder:text-dark/50 dark:placeholder:text-white/50"
                        />
                    </div>
                </div>
            </div>

            {/* Templates Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 pb-10'>
                {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                        <TemplateCard
                            key={template.id}
                            name={template.name}
                            description={template.description}
                            prompt={template.prompt}
                            category={template.category}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-dark/50 dark:text-white/50">
                        <p className="text-lg">No templates found matching "{searchQuery}"</p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-2 text-accent hover:underline"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TemplatesPage