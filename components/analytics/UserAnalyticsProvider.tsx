'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Brain, Target, Eye, Settings } from 'lucide-react'

// Import all analytics modules
import { useUserJourneyTracker } from '@/lib/user-journey-tracker'
import { useABTest, createHeroSectionTest, createProjectLayoutTest } from '@/lib/ab-test-manager'
import { usePsychologicalTriggers } from '@/lib/psychological-triggers'
import { useProgressiveDisclosure } from '@/lib/progressive-disclosure'

// Import components
import AnalyticsDashboard from './AnalyticsDashboard'
import { PsychologicalTriggerRenderer } from './PsychologicalTriggers'
import { ProgressiveDisclosureWrapper, CognitiveLoadIndicator } from './ProgressiveDisclosure'

interface UserAnalyticsProviderProps {
  children: React.ReactNode
  enableAnalytics?: boolean
  enableDashboard?: boolean
  enableTriggers?: boolean
  enableProgressive?: boolean
  developmentMode?: boolean
}

export function UserAnalyticsProvider({
  children,
  enableAnalytics = true,
  enableDashboard = false,
  enableTriggers = true,
  enableProgressive = true,
  developmentMode = false
}: UserAnalyticsProviderProps) {
  const [isDashboardVisible, setIsDashboardVisible] = useState(developmentMode)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Always call hooks (Rules of Hooks compliance)
  const journeyTracker = useUserJourneyTracker()
  const heroTest = useABTest('hero_section_cta')
  const projectTest = useABTest('project_layout')
  const triggerEngine = usePsychologicalTriggers()
  const progressiveDisclosure = useProgressiveDisclosure()

  // Ensure client-side mounting
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // State for active triggers and analytics
  const [activeTriggers, setActiveTriggers] = useState<any[]>([])
  const [currentMetrics, setCurrentMetrics] = useState<any>(null)
  // Initialize A/B tests
  useEffect(() => {
    if (!enableAnalytics || !isMounted || !heroTest || !projectTest) return

    // Set up A/B tests
    heroTest.manager.createTest(createHeroSectionTest())
    projectTest.manager.createTest(createProjectLayoutTest())

    setIsInitialized(true)
  }, [enableAnalytics, isMounted, heroTest?.manager, projectTest?.manager])

  // Update metrics and check triggers
  const updateAnalytics = useCallback(() => {
    if (!enableAnalytics || !isInitialized || !isMounted || !journeyTracker || !progressiveDisclosure || !triggerEngine) return

    const metrics = journeyTracker.metrics
    const journey = journeyTracker.journey

    if (!metrics || !journey) return

    setCurrentMetrics(metrics)

    // Update progressive disclosure
    progressiveDisclosure.updateMetrics({
      timeOnSite: metrics.timeOnSite,
      scrollDepth: metrics.scrollDepth,
      interactionCount: metrics.interactionRate * (metrics.timeOnSite / 60000), // Rough interaction count
      currentSection: getCurrentSection()
    })

    // Personalize systems based on user journey
    if (journey.psychologicalProfile) {
      triggerEngine.engine.personalizeTriggersForUser(journey)
      progressiveDisclosure.manager.personalizeForUser(journey)
    }

    // Check psychological triggers
    if (enableTriggers) {
      const triggerConditions = {
        timeOnSite: metrics.timeOnSite,
        scrollDepth: metrics.scrollDepth,
        pageViews: metrics.pageViews,
        deviceType: [journeyTracker.session?.device.type || 'desktop'],
        returningVisitor: journeyTracker.session?.referrer ? false : true,
        currentSection: getCurrentSection(),
        interactionCount: Math.floor(metrics.interactionRate * (metrics.timeOnSite / 60000)),
        exitIntent: false // This would be set by exit intent detection
      }

      const triggers = triggerEngine.checkTriggers(triggerConditions)
      setActiveTriggers(triggers)
    }    // Track A/B test metrics
    if (heroTest) {
      heroTest.trackMetric('time_on_page', metrics.timeOnSite)
      heroTest.trackMetric('scroll_depth', metrics.scrollDepth)
      heroTest.trackMetric('bounce_rate', metrics.bounceRate)
    }

    if (projectTest) {
      projectTest.trackMetric('time_on_page', metrics.timeOnSite)
      projectTest.trackMetric('scroll_depth', metrics.scrollDepth)
    }

  }, [
    enableAnalytics,
    enableTriggers,
    isInitialized,
    journeyTracker,
    progressiveDisclosure,
    triggerEngine,
    heroTest,
    projectTest
  ])

  // Helper function to get current section
  const getCurrentSection = useCallback(() => {
    const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'contact']
    
    for (const section of sections) {
      const element = document.getElementById(section)
      if (element) {
        const rect = element.getBoundingClientRect()
        if (rect.top <= 100 && rect.bottom >= 100) {
          return section
        }
      }
    }
    return 'hero'
  }, [])

  // Update analytics periodically
  useEffect(() => {
    if (!enableAnalytics) return

    const interval = setInterval(updateAnalytics, 2000) // Update every 2 seconds
    
    return () => clearInterval(interval)
  }, [enableAnalytics, updateAnalytics])

  // Handle keyboard shortcuts for development
  useEffect(() => {
    if (!developmentMode) return

    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + A to toggle analytics dashboard
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
        event.preventDefault()
        setIsDashboardVisible(!isDashboardVisible)
      }      // Ctrl/Cmd + Shift + T to trigger test psychological trigger
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T' && triggerEngine) {
        event.preventDefault()
        const testTriggers = triggerEngine.checkTriggers({
          timeOnSite: 30000,
          scrollDepth: 50,
          currentSection: 'projects',
          interactionCount: 5
        })
        setActiveTriggers(testTriggers)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [developmentMode, isDashboardVisible, triggerEngine])
  // Track conversion events
  const trackConversion = useCallback((type: 'contact' | 'download' | 'social_follow' | 'project_view') => {
    if (!enableAnalytics) return

    // Track in A/B tests
    if (heroTest) heroTest.trackConversion(type)
    if (projectTest) projectTest.trackConversion(type)

    // Track in triggers
    activeTriggers.forEach(trigger => {
      if (trigger.props?.onConversion) {
        trigger.props.onConversion()
      }
    })    // Update journey
    if (journeyTracker?.journey) {
      journeyTracker.journey.conversionType = type
      journeyTracker.journey.completed = true
    }
  }, [enableAnalytics, heroTest, projectTest, activeTriggers, journeyTracker])

  // Provide analytics context to children
  const analyticsContext = {
    metrics: currentMetrics,
    journey: journeyTracker?.journey || null,
    session: journeyTracker?.session || null,
    trackConversion,
    getABTestVariant: (testId: string) => {
      if (testId === 'hero_section_cta') return heroTest?.activeVariant || null
      if (testId === 'project_layout') return projectTest?.activeVariant || null
      return null
    },
    cognitiveLoad: progressiveDisclosure?.cognitiveLoad || 0,
    isDashboardVisible,
    setIsDashboardVisible
  }

  if (!enableAnalytics) {
    return <>{children}</>
  }

  return (
    <AnalyticsContext.Provider value={analyticsContext}>
      <div className="user-analytics-provider">
        {children}

        {/* Psychological Triggers */}
        {enableTriggers && (
          <PsychologicalTriggerRenderer triggers={activeTriggers} />
        )}

        {/* Analytics Dashboard */}
        {enableDashboard && (
          <AnalyticsDashboard
            isVisible={isDashboardVisible}
            onClose={() => setIsDashboardVisible(false)}
          />
        )}        {/* Development Mode Controls */}
        {developmentMode && triggerEngine && progressiveDisclosure && (
          <DevelopmentControls
            onToggleDashboard={() => setIsDashboardVisible(!isDashboardVisible)}
            onTriggerTest={() => {
              const testTriggers = triggerEngine.checkTriggers({
                timeOnSite: 60000,
                scrollDepth: 70,
                currentSection: 'contact',
                interactionCount: 10
              })
              setActiveTriggers(testTriggers)
            }}
            cognitiveLoad={progressiveDisclosure.cognitiveLoad}
            engagementScore={currentMetrics?.engagementScore || 0}
          />
        )}
      </div>
    </AnalyticsContext.Provider>
  )
}

// Analytics Context
const AnalyticsContext = React.createContext<any>(null)

export function useAnalytics() {
  const context = React.useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within UserAnalyticsProvider')
  }
  return context
}

// Development Controls Component
function DevelopmentControls({ 
  onToggleDashboard, 
  onTriggerTest, 
  cognitiveLoad, 
  engagementScore 
}: {
  onToggleDashboard: () => void
  onTriggerTest: () => void
  cognitiveLoad: number
  engagementScore: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 z-40 bg-gray-900 text-white rounded-lg p-3 shadow-lg"
    >
      <div className="text-xs font-medium mb-2">Analytics Dev Controls</div>
      
      <div className="space-y-2">
        <button
          onClick={onToggleDashboard}
          className="flex items-center space-x-2 text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
        >
          <BarChart3 className="w-3 h-3" />
          <span>Toggle Dashboard</span>
        </button>
        
        <button
          onClick={onTriggerTest}
          className="flex items-center space-x-2 text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded"
        >
          <Brain className="w-3 h-3" />
          <span>Test Triggers</span>
        </button>
        
        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span>Engagement:</span>
            <span className="font-mono">{engagementScore.toFixed(0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Cognitive Load:</span>
            <span className="font-mono">{cognitiveLoad}%</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-400 mt-2">
          Shortcuts: Ctrl+Shift+A (Dashboard), Ctrl+Shift+T (Triggers)
        </div>
      </div>
    </motion.div>
  )
}

// Enhanced components with analytics integration
export function AnalyticsEnhancedSection({ 
  id, 
  children, 
  enableProgressive = true,
  progressiveContentId,
  className = '' 
}: {
  id: string
  children: React.ReactNode
  enableProgressive?: boolean
  progressiveContentId?: string
  className?: string
}) {
  const analytics = useAnalytics()

  const handleSectionView = useCallback(() => {
    // Track section view
    if (analytics.trackConversion) {
      // This could trigger micro-conversions for section views
    }
  }, [analytics])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleSectionView()
          }
        })
      },
      { threshold: 0.5 }
    )

    const element = document.getElementById(id)
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [id, handleSectionView])

  if (enableProgressive && progressiveContentId) {
    return (
      <section id={id} className={className}>
        <ProgressiveDisclosureWrapper
          contentId={progressiveContentId}
          section={id}
          showControls={analytics.isDashboardVisible}
        >
          {children}
        </ProgressiveDisclosureWrapper>
      </section>
    )
  }

  return (
    <section id={id} className={className}>
      {children}
    </section>
  )
}

// A/B Test Component Wrapper
export function ABTestVariant({ 
  testId, 
  controlComponent, 
  variantComponents,
  children 
}: {
  testId: string
  controlComponent: React.ComponentType<any>
  variantComponents: { [key: string]: React.ComponentType<any> }
  children?: React.ReactNode
}) {
  const analytics = useAnalytics()
  const variant = analytics.getABTestVariant(testId)

  if (!variant) {
    return <>{children || React.createElement(controlComponent)}</>
  }

  const VariantComponent = variantComponents[variant.id] || controlComponent
  return <VariantComponent />
}

export default UserAnalyticsProvider
