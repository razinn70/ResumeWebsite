'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface LazySectionProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  rootMargin?: string
  threshold?: number
  className?: string
}

export function LazySection({ 
  children, 
  fallback = null, 
  rootMargin = '100px',
  threshold = 0.1,
  className = ''
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !hasBeenVisible) {
          setIsVisible(true)
          setHasBeenVisible(true)
        }
      },
      {
        rootMargin,
        threshold
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [rootMargin, threshold, hasBeenVisible])

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {children}
        </motion.div>
      ) : (
        fallback || (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-pulse h-8 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-64 mx-auto"></div>
              <div className="animate-pulse h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mx-auto"></div>
            </div>
          </div>
        )
      )}
    </div>
  )
}
