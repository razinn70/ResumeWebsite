/**
 * PRODUCTION-READY ANALYTICS SYSTEM
 * Lightweight, performant, and privacy-focused analytics
 */
'use client'

import { createContext, useContext, useEffect, useCallback, useRef, ReactNode } from 'react'

interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: number
  userId?: string
  sessionId?: string
}

interface AnalyticsConfig {
  enabled: boolean
  debug: boolean
  batchSize: number
  flushInterval: number
  endpoint?: string
  privacyMode: boolean
}

interface AnalyticsContextType {
  track: (eventName: string, properties?: Record<string, any>) => void
  identify: (userId: string, traits?: Record<string, any>) => void
  page: (name: string, properties?: Record<string, any>) => void
  isEnabled: boolean
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null)

// Default configuration
const DEFAULT_CONFIG: AnalyticsConfig = {
  enabled: typeof window !== 'undefined' && process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',
  batchSize: 10,
  flushInterval: 30000, // 30 seconds
  privacyMode: true
}

export function RobustAnalyticsProvider({ 
  children, 
  config = DEFAULT_CONFIG 
}: { 
  children: ReactNode
  config?: Partial<AnalyticsConfig> 
}) {  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  const eventQueue = useRef<AnalyticsEvent[]>([])
  const sessionId = useRef<string | undefined>(undefined)
  const userId = useRef<string | undefined>(undefined)
  const flushTimer = useRef<NodeJS.Timeout | undefined>(undefined)

  // Initialize session
  useEffect(() => {
    if (typeof window === 'undefined' || !finalConfig.enabled) return

    // Generate session ID
    sessionId.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Get user ID from localStorage if exists
    try {
      const storedUserId = localStorage.getItem('analytics_user_id')
      if (storedUserId) {
        userId.current = storedUserId
      } else {
        const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        userId.current = newUserId
        if (!finalConfig.privacyMode) {
          localStorage.setItem('analytics_user_id', newUserId)
        }
      }
    } catch (error) {
      if (finalConfig.debug) {
        console.warn('Analytics: Failed to access localStorage:', error)
      }
    }

    // Auto-flush timer
    flushTimer.current = setInterval(flushEvents, finalConfig.flushInterval)

    // Flush on page unload
    const handleUnload = () => flushEvents()
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      if (flushTimer.current) clearInterval(flushTimer.current)
      window.removeEventListener('beforeunload', handleUnload)
      flushEvents()
    }
  }, [finalConfig])

  // Flush events to storage/endpoint
  const flushEvents = useCallback(() => {
    if (eventQueue.current.length === 0) return

    const events = [...eventQueue.current]
    eventQueue.current = []

    if (finalConfig.debug) {
      console.log('Analytics: Flushing events:', events)
    }

    // Store in localStorage as backup
    try {
      const stored = localStorage.getItem('analytics_events') || '[]'
      const storedEvents = JSON.parse(stored)
      const allEvents = [...storedEvents, ...events].slice(-100) // Keep last 100 events
      localStorage.setItem('analytics_events', JSON.stringify(allEvents))
    } catch (error) {
      if (finalConfig.debug) {
        console.warn('Analytics: Failed to store events:', error)
      }
    }

    // Send to endpoint if configured
    if (finalConfig.endpoint) {
      sendToEndpoint(events).catch(error => {
        if (finalConfig.debug) {
          console.error('Analytics: Failed to send events:', error)
        }
      })
    }
  }, [finalConfig])
  // Send events to analytics endpoint
  const sendToEndpoint = async (events: AnalyticsEvent[]) => {
    if (!finalConfig.endpoint) return

    try {
      await fetch(finalConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events,
          sessionId: sessionId.current,
          timestamp: Date.now()
        })
      })
    } catch (error) {
      if (finalConfig.debug) {
        console.error('Analytics: Failed to send to endpoint:', error)
      }
    }
  }

  // Add event to queue
  const addEvent = useCallback((event: AnalyticsEvent) => {
    if (!finalConfig.enabled) return

    const enrichedEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId: sessionId.current || '',
      ...(userId.current && { userId: userId.current })
    }

    eventQueue.current.push(enrichedEvent)

    if (finalConfig.debug) {
      console.log('Analytics: Event tracked:', enrichedEvent)
    }

    // Auto-flush if batch size reached
    if (eventQueue.current.length >= finalConfig.batchSize) {
      flushEvents()
    }
  }, [finalConfig, flushEvents])

  // Track custom event
  const track = useCallback((eventName: string, properties?: Record<string, any>) => {
    addEvent({
      name: eventName,
      properties: {
        ...properties,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        timestamp: Date.now()
      }
    })
  }, [addEvent])

  // Identify user
  const identify = useCallback((newUserId: string, traits?: Record<string, any>) => {
    userId.current = newUserId
    
    if (!finalConfig.privacyMode) {
      try {
        localStorage.setItem('analytics_user_id', newUserId)
      } catch (error) {
        if (finalConfig.debug) {
          console.warn('Analytics: Failed to store user ID:', error)
        }
      }
    }

    addEvent({
      name: 'identify',
      properties: {
        userId: newUserId,
        traits
      }
    })
  }, [addEvent, finalConfig])

  // Track page view
  const page = useCallback((name: string, properties?: Record<string, any>) => {
    addEvent({
      name: 'page_view',
      properties: {
        page: name,
        ...properties,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined
      }
    })
  }, [addEvent])

  const value: AnalyticsContextType = {
    track,
    identify,
    page,
    isEnabled: finalConfig.enabled
  }

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

// Hook to use analytics
export function useRobustAnalytics() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useRobustAnalytics must be used within RobustAnalyticsProvider')
  }
  return context
}

// HOC for automatic page tracking
export function withPageTracking<P extends object>(
  Component: React.ComponentType<P>,
  pageName?: string
) {
  return function WrappedComponent(props: P) {
    const analytics = useRobustAnalytics()

    useEffect(() => {
      const name = pageName || Component.displayName || Component.name || 'Unknown'
      analytics.page(name)
    }, [analytics])

    return <Component {...props} />
  }
}

// Performance tracking hook
export function usePerformanceTracking() {
  const analytics = useRobustAnalytics()
  useEffect(() => {
    if (typeof window === 'undefined' || !analytics.isEnabled) return
    
    // Track Core Web Vitals using native Performance API
    const trackWebVitals = () => {
      try {
        // Use Performance Observer for basic metrics
        if ('PerformanceObserver' in window) {          // Track LCP (Largest Contentful Paint)
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries()
            const lastEntry = entries[entries.length - 1]
            if (lastEntry) {
              analytics.track('web_vital_lcp', { value: lastEntry.startTime })
            }
          })
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })          // Track FCP (First Contentful Paint)
          const fcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries()
            const firstEntry = entries[0]
            if (firstEntry) {
              analytics.track('web_vital_fcp', { value: firstEntry.startTime })
            }
          })
          fcpObserver.observe({ entryTypes: ['paint'] })
        }
      } catch (error) {
        console.warn('Web Vitals tracking failed:', error)
      }
    }

    trackWebVitals()    // Track performance navigation timing
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      if (navEntries.length > 0) {
        const entry = navEntries[0]
        if (entry) {
          analytics.track('page_performance', {
            loadTime: entry.loadEventEnd - entry.loadEventStart,
            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            firstByte: entry.responseStart - entry.requestStart
          })
        }
      }
    }
  }, [analytics])
}

// Error tracking hook
export function useErrorTracking() {
  const analytics = useRobustAnalytics()

  useEffect(() => {
    if (typeof window === 'undefined' || !analytics.isEnabled) return

    const handleError = (event: ErrorEvent) => {
      analytics.track('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      analytics.track('unhandled_promise_rejection', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [analytics])
}

// Component for tracking element visibility
export function VisibilityTracker({ 
  children, 
  eventName, 
  properties = {},
  threshold = 0.5 
}: {
  children: ReactNode
  eventName: string
  properties?: Record<string, any>
  threshold?: number
}) {
  const analytics = useRobustAnalytics()
  const ref = useRef<HTMLDivElement>(null)
  const hasTracked = useRef(false)
  useEffect(() => {
    if (!ref.current || !analytics.isEnabled) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting && !hasTracked.current) {
          analytics.track(eventName, {
            ...properties,
            visibilityRatio: entry.intersectionRatio
          })
          hasTracked.current = true
        }
      },
      { threshold }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [analytics, eventName, properties, threshold])

  return <div ref={ref}>{children}</div>
}
