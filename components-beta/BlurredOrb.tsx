"use client";

import { motion } from "framer-motion";

interface BlurredOrbProps {
    delay?: number;
    width?: string;
    height?: string;
    color?: string;
    className?: string;
}

export function BlurredOrb({
    delay = 0,
    width = "500px",
    height = "500px",
    color = "bg-accent/20",
    className = ""
}: BlurredOrbProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [0.9, 1.1, 0.9],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay,
            }}
            className={`absolute rounded-full pointer-events-none blur-[100px] md:blur-[120px] ${color} ${className}`}
            style={{ width, height }}
        />
    );
}
