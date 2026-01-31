'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

// --- FadeIn ---
interface FadeInProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    delay?: number;
    duration?: number;
}

export function FadeIn({ children, delay = 0, duration = 0.5, className, ...props }: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration, delay, ease: 'easeOut' }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

// --- SlideIn ---
interface SlideInProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    offset?: number;
}

export function SlideIn({
    children,
    delay = 0,
    duration = 0.5,
    direction = 'up',
    offset = 20,
    className,
    ...props
}: SlideInProps) {
    const getInitial = () => {
        switch (direction) {
            case 'up': return { opacity: 0, y: offset };
            case 'down': return { opacity: 0, y: -offset };
            case 'left': return { opacity: 0, x: offset };
            case 'right': return { opacity: 0, x: -offset };
            default: return { opacity: 0, y: offset };
        }
    };

    return (
        <motion.div
            initial={getInitial()}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration, delay, ease: 'easeOut' }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

// --- scaleIn ---
export function ScaleIn({ children, delay = 0, duration = 0.4, className, ...props }: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration, delay, ease: 'easeOut' }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

// --- Stagger ---
interface StaggerContainerProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    delay?: number;
    staggerDelay?: number;
}

export const StaggerContainer = ({ children, delay = 0, staggerDelay = 0.1, className, ...props }: StaggerContainerProps) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        delayChildren: delay,
                        staggerChildren: staggerDelay
                    }
                }
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

export const StaggerItem = ({ children, className, ...props }: HTMLMotionProps<'div'>) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 15 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeOut" }
                }
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}
