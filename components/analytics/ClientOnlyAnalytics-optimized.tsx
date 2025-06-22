'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Lightweight analytics loader
const UserAnalyticsProvider = dynamic(
  () => import('./UserAnalyticsProvider').then(mod => ({ default: mod.UserAnalyticsProvider })),
  { 
    ssr: false,
    loading: () => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-4 right-4 bg-gray-800 border border-green-500 rounded-lg p-2 text-xs text-green-400"
      >
        Loading analytics...
      </motion.div>
    )
  }
)

interface ClientOnlyAnalyticsProps {
  children: React.ReactNode
  enableAnalytics?: boolean
  enableDashboard?: boolean
  enableTriggers?: boolean
  developmentMode?: boolean
}

export function ClientOnlyAnalytics({
  children,
  enableAnalytics = true,
  enableDashboard = false,
  enableTriggers = true,
  developmentMode = false
}: ClientOnlyAnalyticsProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [shouldLoadAnalytics, setShouldLoadAnalytics] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Delay analytics loading to improve initial page load
    const timer = setTimeout(() => {
      setShouldLoadAnalytics(true)
    }, 3000) // Load analytics after 3 seconds

    return () => clearTimeout(timer)
  }, [])

  if (!isMounted) {
    return <div>{children}</div>
  }

  if (!enableAnalytics || !shouldLoadAnalytics) {
    return <div>{children}</div>
  }

  return (
    <UserAnalyticsProvider
      enableAnalytics={enableAnalytics}
      enableDashboard={enableDashboard}
      enableTriggers={enableTriggers}
      developmentMode={developmentMode}
    >
      {children}
    </UserAnalyticsProvider>
  )
}

export default ClientOnlyAnalytics
