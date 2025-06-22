/**
 * PRODUCTION-READY PERFORMANCE MONITORING HOOK
 * Tracks Core Web Vitals, memory usage, and 3D performance metrics
 */
'use client'

import { useEffect, useRef, useCallback } from 'react'

interface PerformanceMetrics {
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  ttfb?: number // Time to First Byte
  memoryUsage?: number
  jsHeapSize?: number
  frameRate?: number
  renderTime?: number
}

interface PerformanceConfig {
  trackCoreWebVitals?: boolean
  trackMemoryUsage?: boolean
  trackFrameRate?: boolean
  reportInterval?: number
  enableConsoleLogging?: boolean
  onMetric?: (metric: string, value: number) => void
}

const DEFAULT_CONFIG: PerformanceConfig = {
  trackCoreWebVitals: true,
  trackMemoryUsage: true,
  trackFrameRate: true,
  reportInterval: 30000, // 30 seconds
  enableConsoleLogging: process.env.NODE_ENV === 'development'
}

export function usePerformanceMonitoring(config: PerformanceConfig = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  const metricsRef = useRef<PerformanceMetrics>({})
  const frameCountRef = useRef(0)
  const lastFrameTimeRef = useRef(performance.now())
  const observersRef = useRef<PerformanceObserver[]>([])

  // Report metrics to analytics
  const reportMetric = useCallback((name: string, value: number) => {
    if (finalConfig.enableConsoleLogging) {
      console.log(`📊 Performance Metric - ${name}:`, value)
    }
    
    finalConfig.onMetric?.(name, value)
    
    // Send to analytics (replace with your analytics service)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: value,
        custom_parameter: 'core_web_vitals'
      })
    }
  }, [finalConfig])

  // Track Core Web Vitals
  const trackCoreWebVitals = useCallback(() => {
    if (!finalConfig.trackCoreWebVitals || typeof window === 'undefined') return

    try {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            metricsRef.current.fcp = entry.startTime
            reportMetric('fcp', entry.startTime)
          }
        })
      })
      fcpObserver.observe({ entryTypes: ['paint'] })
      observersRef.current.push(fcpObserver)

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          metricsRef.current.lcp = lastEntry.startTime
          reportMetric('lcp', lastEntry.startTime)
        }
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      observersRef.current.push(lcpObserver)      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (entry.processingStart && entry.startTime) {
            const fid = entry.processingStart - entry.startTime
            metricsRef.current.fid = fid
            reportMetric('fid', fid)
          }
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
      observersRef.current.push(fidObserver)

      // Cumulative Layout Shift
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        }
        metricsRef.current.cls = clsValue
        reportMetric('cls', clsValue)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      observersRef.current.push(clsObserver)

      // Time to First Byte
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      if (navigationEntries.length > 0 && navigationEntries[0]) {
        const nav = navigationEntries[0]
        const ttfb = nav.responseStart - nav.requestStart
        metricsRef.current.ttfb = ttfb
        reportMetric('ttfb', ttfb)
      }

    } catch (error) {
      console.warn('Failed to set up Core Web Vitals tracking:', error)
    }
  }, [finalConfig.trackCoreWebVitals, reportMetric])

  // Track memory usage
  const trackMemoryUsage = useCallback(() => {
    if (!finalConfig.trackMemoryUsage || typeof window === 'undefined') return

    try {
      const memory = (performance as any).memory
      if (memory) {
        const memoryUsage = memory.usedJSHeapSize / 1024 / 1024 // MB
        const heapSize = memory.totalJSHeapSize / 1024 / 1024 // MB
        
        metricsRef.current.memoryUsage = memoryUsage
        metricsRef.current.jsHeapSize = heapSize
        
        reportMetric('memory_usage_mb', memoryUsage)
        reportMetric('js_heap_size_mb', heapSize)

        // Warning for high memory usage
        if (memoryUsage > 100) {
          console.warn(`🚨 High memory usage detected: ${memoryUsage.toFixed(2)}MB`)
        }
      }
    } catch (error) {
      console.warn('Failed to track memory usage:', error)
    }
  }, [finalConfig.trackMemoryUsage, reportMetric])

  // Track frame rate
  const trackFrameRate = useCallback(() => {
    if (!finalConfig.trackFrameRate || typeof window === 'undefined') return

    const measureFrameRate = () => {
      const currentTime = performance.now()
      frameCountRef.current++

      if (currentTime - lastFrameTimeRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (currentTime - lastFrameTimeRef.current))
        metricsRef.current.frameRate = fps
        reportMetric('frame_rate', fps)

        // Warning for low frame rate
        if (fps < 30) {
          console.warn(`🚨 Low frame rate detected: ${fps}fps`)
        }

        frameCountRef.current = 0
        lastFrameTimeRef.current = currentTime
      }

      requestAnimationFrame(measureFrameRate)
    }

    requestAnimationFrame(measureFrameRate)
  }, [finalConfig.trackFrameRate, reportMetric])

  // Track long tasks
  const trackLongTasks = useCallback(() => {
    if (typeof window === 'undefined') return

    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          reportMetric('long_task_duration', entry.duration)
          
          if (entry.duration > 100) {
            console.warn(`🚨 Long task detected: ${entry.duration.toFixed(2)}ms`)
          }
        })
      })
      longTaskObserver.observe({ entryTypes: ['longtask'] })
      observersRef.current.push(longTaskObserver)
    } catch (error) {
      console.warn('Long task tracking not supported:', error)
    }
  }, [reportMetric])

  // Track navigation timing
  const trackNavigationTiming = useCallback(() => {
    if (typeof window === 'undefined') return

    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        const metrics = {
          dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp_connection: navigation.connectEnd - navigation.connectStart,
          request_response: navigation.responseEnd - navigation.requestStart,
          dom_parsing: navigation.domInteractive - navigation.responseEnd,
          dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          load_complete: navigation.loadEventEnd - navigation.loadEventStart
        }

        Object.entries(metrics).forEach(([name, value]) => {
          if (value > 0) {
            reportMetric(`navigation_${name}`, value)
          }
        })
      }
    } catch (error) {
      console.warn('Failed to track navigation timing:', error)
    }
  }, [reportMetric])

  // Get current metrics
  const getCurrentMetrics = useCallback((): PerformanceMetrics => {
    return { ...metricsRef.current }
  }, [])

  // Cleanup function
  const cleanup = useCallback(() => {
    observersRef.current.forEach(observer => {
      try {
        observer.disconnect()
      } catch (error) {
        console.warn('Failed to disconnect performance observer:', error)
      }
    })
    observersRef.current = []
  }, [])
  // Initialize tracking
  useEffect(() => {
    if (typeof window === 'undefined') return

    const initDelay = setTimeout(() => {
      trackCoreWebVitals()
      trackLongTasks()
      trackNavigationTiming()
    }, 1000) // Delay to ensure page has loaded

    // Set up periodic memory tracking
    let memoryInterval: NodeJS.Timeout | undefined
    if (finalConfig.trackMemoryUsage) {
      trackMemoryUsage()
      memoryInterval = setInterval(trackMemoryUsage, finalConfig.reportInterval)
    }

    // Set up frame rate tracking
    if (finalConfig.trackFrameRate) {
      trackFrameRate()
    }

    return () => {
      clearTimeout(initDelay)
      if (memoryInterval) {
        clearInterval(memoryInterval)
      }
      cleanup()
    }
  }, [
    trackCoreWebVitals,
    trackMemoryUsage,
    trackFrameRate,
    trackLongTasks,
    trackNavigationTiming,
    cleanup,
    finalConfig.trackMemoryUsage,
    finalConfig.trackFrameRate,
    finalConfig.reportInterval
  ])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  return {
    getCurrentMetrics,
    reportMetric,
    cleanup
  }
}

// Utility function to get device capabilities
export function getDeviceCapabilities() {
  if (typeof window === 'undefined') return null

  const capabilities = {
    // Device memory
    deviceMemory: (navigator as any).deviceMemory || 'unknown',
    
    // Hardware concurrency
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
    
    // Connection information
    connection: (navigator as any).connection ? {
      effectiveType: (navigator as any).connection.effectiveType,
      downlink: (navigator as any).connection.downlink,
      rtt: (navigator as any).connection.rtt
    } : 'unknown',
    
    // User agent
    userAgent: navigator.userAgent,
    
    // Screen information
    screen: {
      width: screen.width,
      height: screen.height,
      pixelRatio: window.devicePixelRatio
    },
    
    // Performance timing support
    performanceObserverSupported: 'PerformanceObserver' in window,
    intersectionObserverSupported: 'IntersectionObserver' in window
  }

  return capabilities
}

// Global type declaration for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}
