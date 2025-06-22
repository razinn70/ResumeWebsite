'use client'

import { ReactNode, useEffect } from 'react'
import { useRobustAnalytics, VisibilityTracker } from './RobustAnalytics'

interface AnalyticsWrapperProps {
  children: ReactNode
  sectionName: string
  trackVisibility?: boolean
  trackInteractions?: boolean
}

export function AnalyticsWrapper({ 
  children, 
  sectionName, 
  trackVisibility = true,
  trackInteractions = false 
}: AnalyticsWrapperProps) {
  const analytics = useRobustAnalytics()

  useEffect(() => {
    // Track section load
    analytics.track('section_loaded', { section: sectionName })
  }, [analytics, sectionName])

  if (trackVisibility) {
    return (
      <VisibilityTracker 
        eventName="section_viewed" 
        properties={{ section: sectionName }}
        threshold={0.3}
      >
        <div 
          data-analytics-section={sectionName}
          onClick={trackInteractions ? () => analytics.track('section_clicked', { section: sectionName }) : undefined}
        >
          {children}
        </div>
      </VisibilityTracker>
    )
  }

  return (
    <div 
      data-analytics-section={sectionName}
      onClick={trackInteractions ? () => analytics.track('section_clicked', { section: sectionName }) : undefined}
    >
      {children}
    </div>
  )
}

// Higher-order component for easy wrapping
export function withAnalytics<P extends object>(
  Component: React.ComponentType<P>,
  sectionName: string,
  options: { trackVisibility?: boolean; trackInteractions?: boolean } = {}
) {
  return function AnalyticsWrappedComponent(props: P) {
    return (
      <AnalyticsWrapper sectionName={sectionName} {...options}>
        <Component {...props} />
      </AnalyticsWrapper>
    )
  }
}
