'use client'

import { ReactNode } from 'react'

interface MinimalAnalyticsProps {
  children: ReactNode
  enableAnalytics?: boolean
}

export function MinimalAnalytics({ children, enableAnalytics = false }: MinimalAnalyticsProps) {
  // Ultra-minimal analytics - just page views
  if (typeof window !== 'undefined' && enableAnalytics) {
    // Simple page view tracking
    try {
      if ('gtag' in window) {
        (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
          page_title: document.title,
          page_location: window.location.href,
        })
      }
    } catch (error) {
      console.warn('Analytics tracking failed:', error)
    }
  }

  return <>{children}</>
}
