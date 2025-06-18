'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ReactNode } from 'react'

interface ScrollTransitionProps {
  children: ReactNode
  className?: string
}

export function ScrollTransition({ children, className = "" }: ScrollTransitionProps) {
  const { scrollYProgress } = useScroll()
  
  // Transform values based on scroll
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -100])
  
  return (
    <motion.div
      className={className}
      style={{
        opacity,
        scale,
        y,
      }}
    >
      {children}
    </motion.div>
  )
}

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  )
}

export default ScrollTransition
