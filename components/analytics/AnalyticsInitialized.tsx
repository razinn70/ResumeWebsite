'use client'

import React from 'react'
import { useAnalyticsInitialization } from '@/hooks/useAnalyticsInitialization'

interface AnalyticsInitializedProps {
  children: React.ReactNode
}

export function AnalyticsInitialized({ children }: AnalyticsInitializedProps) {
  useAnalyticsInitialization()
  return <>{children}</>
}
