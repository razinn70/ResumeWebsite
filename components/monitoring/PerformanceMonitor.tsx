'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
  bundleSize: number
  renderTime: number
}

interface PerformanceMonitorProps {
  showMetrics?: boolean
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void
}

export function PerformanceMonitor({ 
  showMetrics = process.env.NODE_ENV === 'development',
  onMetricsUpdate 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({ ...prev, lcp: entry.startTime }))
        }
        
        if (entry.entryType === 'first-input') {
          setMetrics(prev => ({ ...prev, fid: (entry as any).processingStart - entry.startTime }))
        }
        
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          setMetrics(prev => ({ ...prev, cls: (prev.cls || 0) + (entry as any).value }))
        }
      })
    })

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })

    // Get navigation timing
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigationTiming) {
      setMetrics(prev => ({
        ...prev,
        fcp: navigationTiming.responseStart - navigationTiming.requestStart,
        ttfb: navigationTiming.responseStart - navigationTiming.requestStart,
        renderTime: navigationTiming.loadEventEnd - navigationTiming.responseStart
      }))
    }

    // Show metrics after delay
    const timer = setTimeout(() => setIsVisible(true), 2000)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (onMetricsUpdate && Object.keys(metrics).length > 0) {
      onMetricsUpdate(metrics as PerformanceMetrics)
    }
  }, [metrics, onMetricsUpdate])

  if (!showMetrics || !isVisible) return null

  const getScoreColor = (metric: string, value: number) => {
    const thresholds: Record<string, [number, number]> = {
      lcp: [2500, 4000], // Good < 2.5s, Needs Improvement < 4s
      fid: [100, 300],   // Good < 100ms, Needs Improvement < 300ms
      cls: [0.1, 0.25],  // Good < 0.1, Needs Improvement < 0.25
      fcp: [1800, 3000], // Good < 1.8s, Needs Improvement < 3s
      ttfb: [800, 1800]  // Good < 800ms, Needs Improvement < 1.8s
    }

    const [good, needsImprovement] = thresholds[metric] || [0, 0]
    
    if (value <= good) return 'text-green-400'
    if (value <= needsImprovement) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 bg-black border border-green-500 rounded-lg p-4 text-xs font-mono z-50 max-w-xs"
    >
      <div className="text-green-400 font-bold mb-2">⚡ Performance Metrics</div>
      
      <div className="space-y-1">
        {metrics.lcp && (
          <div className={`flex justify-between ${getScoreColor('lcp', metrics.lcp)}`}>
            <span>LCP:</span>
            <span>{Math.round(metrics.lcp)}ms</span>
          </div>
        )}
        
        {metrics.fid && (
          <div className={`flex justify-between ${getScoreColor('fid', metrics.fid)}`}>
            <span>FID:</span>
            <span>{Math.round(metrics.fid)}ms</span>
          </div>
        )}
        
        {metrics.cls !== undefined && (
          <div className={`flex justify-between ${getScoreColor('cls', metrics.cls)}`}>
            <span>CLS:</span>
            <span>{metrics.cls.toFixed(3)}</span>
          </div>
        )}
        
        {metrics.fcp && (
          <div className={`flex justify-between ${getScoreColor('fcp', metrics.fcp)}`}>
            <span>FCP:</span>
            <span>{Math.round(metrics.fcp)}ms</span>
          </div>
        )}
        
        {metrics.ttfb && (
          <div className={`flex justify-between ${getScoreColor('ttfb', metrics.ttfb)}`}>
            <span>TTFB:</span>
            <span>{Math.round(metrics.ttfb)}ms</span>
          </div>
        )}
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-600 text-gray-400">
        <div className="text-xs">Bundle: ~520KB</div>
        <div className="text-xs">Target: &lt;200KB</div>
      </div>
    </motion.div>
  )
}
