'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

const navItems = [
  { name: 'Home', href: '#home', ariaLabel: 'Navigate to home section' },
  { name: 'About', href: '#about', ariaLabel: 'Navigate to about section' },
  { name: 'Projects', href: '#projects', ariaLabel: 'Navigate to projects section' },
  { name: 'Contact', href: '#contact', ariaLabel: 'Navigate to contact section' },
] as const

type SectionId = 'home' | 'about' | 'projects' | 'contact'

// Debounce hook for performance optimization
/**
 * Custom hook that debounces a callback function
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced version of the callback
 */
function useDebounce<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  // Use null as initial value for timeout reference
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // Clear existing timeout if it exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      // Set new timeout
      timeoutRef.current = setTimeout(() => callback(...args), delay)
    },
    [callback, delay]
  )
  
  // Cleanup function for useEffect compatibility
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  
  return debouncedCallback as T
}

export function Navigation() {
  const [activeSection, setActiveSection] = useState<SectionId>('home')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)
    
    const handleChange = (event: MediaQueryListEvent) => {
      setIsReducedMotion(event.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Debounced scroll handler for better performance
  const debouncedScrollHandler = useDebounce(() => {
    const scrollY = window.scrollY
    setIsScrolled(scrollY > 20)

    // Update active section based on scroll position with intersection observer fallback
    const sections = navItems.map(item => item.href.slice(1) as SectionId)
    
    for (const sectionId of sections) {
      const element = document.getElementById(sectionId)
      if (element) {
        const rect = element.getBoundingClientRect()
        const isInView = rect.top <= 100 && rect.bottom >= 100
        
        if (isInView) {
          setActiveSection(sectionId)
          break
        }
      }
    }
  }, 16) // ~60fps

  useEffect(() => {
    // Use passive event listener for better performance
    window.addEventListener('scroll', debouncedScrollHandler, { passive: true })
    return () => window.removeEventListener('scroll', debouncedScrollHandler)
  }, [debouncedScrollHandler])

  // Handle section navigation with error handling
  const scrollToSection = useCallback((href: string) => {
    try {
      const sectionId = href.slice(1)
      const element = document.getElementById(sectionId)
      
      if (element) {
        // Close mobile menu if open
        setIsMobileMenuOpen(false)
        
        // Use smooth scrolling with fallback for older browsers
        if ('scrollBehavior' in document.documentElement.style) {
          element.scrollIntoView({ 
            behavior: isReducedMotion ? 'auto' : 'smooth', 
            block: 'start',
            inline: 'nearest'
          })
        } else {
          // Fallback for older browsers
          const elementPosition = element.offsetTop - 80 // Account for header height
          window.scrollTo({
            top: elementPosition,
            left: 0,
            behavior: isReducedMotion ? 'auto' : 'smooth'
          })
        }
        
        // Update URL hash without scrolling
        if (history.replaceState) {
          history.replaceState(null, '', href)
        }
        
        // Update active section immediately for better UX
        setActiveSection(sectionId as SectionId)
      }
    } catch (error) {
      console.warn('Navigation error:', error)
    }
  }, [isReducedMotion])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent, href: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      scrollToSection(href)
    }
  }, [scrollToSection])

  // Toggle mobile menu
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev: boolean) => !prev)
  }, [])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const motionSettings = isReducedMotion ? { initial: false, animate: false } : {}

  return (
    <motion.nav
      {...motionSettings}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-200/20 dark:border-gray-700/20'
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div
            {...motionSettings}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-serif font-bold text-gray-900 dark:text-white"
          >
            <a 
              href="#home" 
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('#home')
              }}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1"
              aria-label="Go to homepage"
            >
              AJ
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                {...motionSettings}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => scrollToSection(item.href)}
                onKeyDown={(e) => handleKeyDown(e, item.href)}
                className={`nav-link focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-3 py-2 ${
                  activeSection === item.href.slice(1) ? 'active' : ''
                }`}
                aria-label={item.ariaLabel}
                aria-current={activeSection === item.href.slice(1) ? 'page' : undefined}
              >
                {item.name}
              </motion.button>
            ))}
          </div>

          {/* Desktop Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <motion.div
              {...motionSettings}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ThemeToggle />
            </motion.div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X size={24} aria-hidden="true" />
              ) : (
                <Menu size={24} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            {...motionSettings}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  onKeyDown={(e) => handleKeyDown(e, item.href)}
                  className={`block w-full text-left px-3 py-3 text-base font-medium transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    activeSection === item.href.slice(1)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  aria-label={item.ariaLabel}
                  aria-current={activeSection === item.href.slice(1) ? 'page' : undefined}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
