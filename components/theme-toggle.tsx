'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Loader2 } from 'lucide-react'

// Constants for better maintainability and performance
const ANIMATION_VARIANTS = {
  button: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2, ease: 'easeInOut' }
  },
  icon: {
    initial: { opacity: 0, rotate: -90, scale: 0 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 90, scale: 0 },
    transition: { duration: 0.2, ease: 'easeInOut' }
  }
} as const

// Type-safe theme validation
type ThemeType = 'light' | 'dark' | 'system' | undefined

function isValidTheme(theme: string | undefined): theme is 'light' | 'dark' {
  return theme === 'light' || theme === 'dark'
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  // Memoized theme state for performance
  const currentTheme = useMemo(() => {
    return resolvedTheme || theme
  }, [resolvedTheme, theme])

  const isDark = useMemo(() => {
    return currentTheme === 'dark'
  }, [currentTheme])

  // Safe theme toggle with error handling
  const handleThemeToggle = useCallback(async () => {
    if (isTransitioning) return // Prevent rapid clicks
    
    try {
      setIsTransitioning(true)
      const newTheme = isDark ? 'light' : 'dark'
      setTheme(newTheme)
      
      // Announce theme change to screen readers
      const announcement = `Theme switched to ${newTheme} mode`
      const announcer = document.createElement('div')
      announcer.setAttribute('aria-live', 'polite')
      announcer.setAttribute('aria-atomic', 'true')
      announcer.className = 'sr-only'
      announcer.textContent = announcement
      document.body.appendChild(announcer)
      
      // Clean up announcer after announcement
      setTimeout(() => {
        document.body.removeChild(announcer)
      }, 1000)
      
    } catch (error) {
      console.error('Failed to toggle theme:', error)
      // Optionally show user-facing error
    } finally {
      // Reset transition state after animation completes
      setTimeout(() => setIsTransitioning(false), 300)
    }
  }, [isDark, setTheme, isTransitioning])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleThemeToggle()
    }
  }, [handleThemeToggle])

  // Safe mounting check with cleanup
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100) // Slight delay for smoother hydration
    return () => clearTimeout(timer)
  }, [])

  // Memoized aria-label for security and performance
  const ariaLabel = useMemo(() => {
    if (!mounted || !isValidTheme(currentTheme)) {
      return 'Toggle theme'
    }
    const nextTheme = isDark ? 'light' : 'dark'
    return `Switch to ${nextTheme} mode`
  }, [mounted, currentTheme, isDark])

  // Loading state during hydration
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 transition-colors"
        aria-label="Loading theme toggle"
        disabled
        tabIndex={-1}
      >
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </button>
    )
  }

  return (
    <motion.button
      onClick={handleThemeToggle}
      onKeyDown={handleKeyDown}
      disabled={isTransitioning}
      className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={ariaLabel}
      role="switch"
      aria-checked={isDark}
      tabIndex={0}
      {...ANIMATION_VARIANTS.button}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'dark' : 'light'} // More reliable key
          {...ANIMATION_VARIANTS.icon}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Sun 
              className="w-5 h-5 text-yellow-500" 
              aria-hidden="true"
              role="img"
              aria-label="Sun icon"
            />
          ) : (
            <Moon 
              className="w-5 h-5 text-gray-700 dark:text-gray-300" 
              aria-hidden="true"
              role="img"
              aria-label="Moon icon"
            />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Loading indicator overlay */}
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg"
        >
          <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
        </motion.div>
      )}
    </motion.button>
  )
}
