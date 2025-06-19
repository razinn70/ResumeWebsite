'use client'

import dynamic from 'next/dynamic'
import React from 'react'

// Dynamically import the analytics provider with no SSR
const UserAnalyticsProvider = dynamic(
  () => import('./UserAnalyticsProvider').then(mod => ({ default: mod.UserAnalyticsProvider })),
  { 
    ssr: false,
    loading: () => <div>Loading analytics...</div>
  }
)

interface ClientOnlyAnalyticsProps {
  children: React.ReactNode
  enableAnalytics?: boolean
  enableDashboard?: boolean
  enableTriggers?: boolean
  enableProgressive?: boolean
  developmentMode?: boolean
}

export function ClientOnlyAnalytics({ children, ...props }: ClientOnlyAnalyticsProps) {
  return (
    <UserAnalyticsProvider {...props}>
      {children}
    </UserAnalyticsProvider>
  )
}
