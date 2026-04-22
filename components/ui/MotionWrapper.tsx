'use client'

import { motion, HTMLMotionProps, Variants } from 'framer-motion'
import { ReactNode } from 'react'

interface MotionWrapperProps extends HTMLMotionProps<'div'> {
    children: ReactNode
    variant?: 'fadeIn' | 'slideUp' | 'scaleUp' | 'none'
    delay?: number
    duration?: number
    viewportOnce?: boolean
    animate?: boolean
}

const variants: Record<string, Variants> = {
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
    },
    slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
    },
    scaleUp: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
    },
    none: {
        initial: {},
        animate: {},
    }
}

export function MotionWrapper({
    children,
    variant = 'fadeIn',
    delay = 0,
    duration = 0.5,
    viewportOnce = true,
    animate = false,
    className,
    ...props
}: MotionWrapperProps) {
    return (
        <motion.div
            initial={animate ? "animate" : "initial"}
            whileInView={animate ? undefined : "animate"}
            animate={animate ? "animate" : undefined}
            viewport={{ once: viewportOnce, margin: "0px" }}
            variants={variants[variant]}
            transition={{
                duration: duration,
                delay: delay,
                ease: [0.21, 0.47, 0.32, 0.98] // Premium cubic bezier
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}
