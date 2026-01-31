"use client"
import { Button } from '@/components-beta/Button'
import FeedbackCard, { FeedbackStatus, FeedbackType } from '@/components-beta/FeedbackCard'
import FeedbackModal from '@/components-beta/FeedbackModal'
import { api } from '@/lib/api'
import { getUploadSignature } from '@/lib/api'
import { Modal } from '@/components/ui/modal'
import { MagnifyingGlassIcon, CheckCircle } from '@phosphor-icons/react'
import React, { useState } from 'react'

const page = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [feedbacks, setFeedbacks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [successModalOpen, setSuccessModalOpen] = useState(false)


    const fetchFeedbacks = React.useCallback(async () => {
        try {
            setLoading(true)
            const data = await api.getFeedbacks()
            setFeedbacks(data.feedbacks || [])
            console.log(data.feedbacks)
        } catch (error) {
            console.error("Failed to fetch feedbacks:", error)
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchFeedbacks()
    }, [fetchFeedbacks])

    const handleCreateFeedback = async (data: { type: string, title: string, message: string }) => {
        try {
            await api.createFeedback({
                type: data.type,
                title: data.title,
                description: data.message
            })
            await fetchFeedbacks()
            setIsModalOpen(false)
            setSuccessModalOpen(true)
        } catch (error) {
            console.error("Failed to create feedback:", error)
        }
    }

    const filteredFeedbacks = feedbacks.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <>
            <div className="h-full pt-20 w-screen md:w-full overflow-y-auto gap-7 flex flex-col p-5 md:p-10 max-w-5xl mx-auto">
                <div className="bg-dark/15 dark:bg-white/7 w-2/3 mx-auto absolute -top-20 rounded-full blur-[100px] left-0 right-0 h-32"></div>

                {/* Header Section */}
                <div className="flex flex-col gap-6">
                    <div className='flex flex-col w-full gap-2'>
                        <h3 className="text-[28px] font-semibold bg-clip-text bg-linear-to-b from-dark/50 to-dark dark:from-white dark:to-white/50 text-transparent">
                            Give us feedback
                        </h3>
                        <p className="text-[15px] font-medium text-dark/50 dark:text-white/50">
                            We'd love to hear your thoughts, suggestions, or any issues you've encountered.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-3 w-full">
                        <div className="p-2.5 flex-1 w-full md:w-auto rounded-full bg-dark/5 group focus-within:ring-1 focus-within:ring-accent dark:bg-white/5 border border-dark/5 dark:border-white/5 flex items-center gap-2 transition-all">
                            <MagnifyingGlassIcon className="size-4 text-dark/50 dark:text-white/50" />
                            <input
                                type="text"
                                placeholder="Search feedback..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 text-sm bg-transparent outline-none text-dark dark:text-white placeholder:text-dark/50 dark:placeholder:text-white/50"
                            />
                        </div>
                        <Button
                            className='py-[11px] w-full md:w-auto md:flex-shrink-0 px-6 whitespace-nowrap'
                            onClick={() => setIsModalOpen(true)}
                        >
                            New Feedback
                        </Button>
                    </div>
                </div>

                {/* Feedback Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10'>
                    {loading ? (
                        <div className="col-span-full py-10 text-center text-dark/50 dark:text-white/50">Loading feedback...</div>
                    ) : filteredFeedbacks.length === 0 ? (
                        <div className="col-span-full py-10 text-center text-dark/50 dark:text-white/50">No feedback found. Be the first to share your thoughts!</div>
                    ) : (
                        filteredFeedbacks.map((item) => (
                            <FeedbackCard
                                key={item._id || item.id}
                                type={item.type}
                                date={new Date(item.createdAt || item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                title={item.title}
                                status={item.status || 'under-review'}
                                description={item.description}
                            />
                        ))
                    )}
                </div>
            </div>

            <FeedbackModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateFeedback}
            />

            <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
                <Modal.Body className='flex flex-col items-center justify-center p-10 text-center gap-4'>
                    <div className='bg-green-500/10 p-4 rounded-full text-green-500 mb-2'>
                        <CheckCircle size={48} weight='fill' />
                    </div>
                    <div className='space-y-2'>
                        <h3 className='text-xl font-bold text-dark dark:text-white'>Feedback Submitted!</h3>
                        <p className='text-dark/60 dark:text-white/60 max-w-[250px] mx-auto'>
                            Thank you for sharing your thoughts with the community. We'll review it shortly.
                        </p>
                    </div>
                    <Button
                        className='bg-dark dark:bg-white text-white dark:text-black mt-4 px-8'
                        onClick={() => setSuccessModalOpen(false)}
                    >
                        Awesome
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default page