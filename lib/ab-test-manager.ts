'use client'

import { useState, useEffect, useCallback } from 'react'
import { ABTest, ABTestVariant } from '@/types/analytics'

interface ABTestConfig {
  testId: string
  variants: ABTestVariant[]
  targetMetric: 'conversion' | 'engagement' | 'bounce_rate' | 'time_on_page'
  trafficAllocation?: number // percentage of users to include in test
  segments?: {
    deviceTypes?: string[]
    countries?: string[]
    returningVisitors?: boolean
  }
}

class ABTestManager {
  private activeTests: Map<string, ABTest> = new Map()
  private userAssignments: Map<string, string> = new Map() // testId -> variantId
  private metrics: Map<string, any> = new Map()

  constructor() {
    this.loadStoredAssignments()
  }

  private loadStoredAssignments(): void {
    const stored = localStorage.getItem('ab_test_assignments')
    if (stored) {
      try {
        const assignments = JSON.parse(stored)
        this.userAssignments = new Map(Object.entries(assignments))
      } catch (error) {
        console.warn('Failed to load AB test assignments:', error)
      }
    }
  }

  private saveAssignments(): void {
    const assignments = Object.fromEntries(this.userAssignments)
    localStorage.setItem('ab_test_assignments', JSON.stringify(assignments))
  }

  public createTest(config: ABTestConfig): void {
    const test: ABTest = {
      id: config.testId,
      name: config.testId,
      description: `A/B test for ${config.targetMetric} optimization`,
      startDate: Date.now(),
      status: 'running',
      variants: config.variants.map(variant => ({
        ...variant,
        metrics: {
          visitors: 0,
          conversions: 0,
          bounceRate: 0,
          timeOnPage: 0,
          scrollDepth: 0
        }
      })),
      targetMetric: config.targetMetric,
      segments: config.segments
    }

    this.activeTests.set(config.testId, test)
  }

  public assignUserToVariant(testId: string, userId?: string): string | null {
    const test = this.activeTests.get(testId)
    if (!test || test.status !== 'running') return null

    // Check if user is already assigned
    const existingAssignment = this.userAssignments.get(testId)
    if (existingAssignment) return existingAssignment

    // Check if user meets segment criteria
    if (!this.userMeetsSegmentCriteria(test.segments)) return null

    // Assign user to variant based on traffic allocation
    const randomValue = Math.random() * 100
    let cumulativeTraffic = 0

    for (const variant of test.variants) {
      cumulativeTraffic += variant.traffic
      if (randomValue <= cumulativeTraffic) {
        this.userAssignments.set(testId, variant.id)
        this.saveAssignments()
        
        // Increment visitor count
        variant.metrics.visitors++
        
        return variant.id
      }
    }

    return null
  }

  private userMeetsSegmentCriteria(segments?: ABTest['segments']): boolean {
    if (!segments) return true

    // Check device type
    if (segments.deviceTypes) {
      const currentDevice = this.getCurrentDeviceType()
      if (!segments.deviceTypes.includes(currentDevice)) return false
    }

    // Check returning visitor status
    if (segments.returningVisitors !== undefined) {
      const isReturningVisitor = this.isReturningVisitor()
      if (segments.returningVisitors !== isReturningVisitor) return false
    }

    return true
  }

  private getCurrentDeviceType(): string {
    const width = window.innerWidth
    if (width <= 768) return 'mobile'
    if (width <= 1024) return 'tablet'
    return 'desktop'
  }

  private isReturningVisitor(): boolean {
    return localStorage.getItem('user_session') !== null
  }

  public trackConversion(testId: string, conversionType: string = 'default'): void {
    const test = this.activeTests.get(testId)
    const variantId = this.userAssignments.get(testId)
    
    if (!test || !variantId) return

    const variant = test.variants.find(v => v.id === variantId)
    if (variant) {
      variant.metrics.conversions++
    }
  }

  public trackMetric(testId: string, metricType: string, value: number): void {
    const test = this.activeTests.get(testId)
    const variantId = this.userAssignments.get(testId)
    
    if (!test || !variantId) return

    const variant = test.variants.find(v => v.id === variantId)
    if (!variant) return

    switch (metricType) {
      case 'bounce_rate':
        variant.metrics.bounceRate = value
        break
      case 'time_on_page':
        variant.metrics.timeOnPage = value
        break
      case 'scroll_depth':
        variant.metrics.scrollDepth = value
        break
    }
  }

  public getActiveVariant(testId: string): ABTestVariant | null {
    const test = this.activeTests.get(testId)
    const variantId = this.userAssignments.get(testId)
    
    if (!test || !variantId) return null

    return test.variants.find(v => v.id === variantId) || null
  }

  public getTestResults(testId: string): {
    test: ABTest
    statisticalSignificance: boolean
    winner?: ABTestVariant
    recommendation: string
  } | null {
    const test = this.activeTests.get(testId)
    if (!test) return null

    const controlVariant = test.variants.find(v => v.isControl)
    if (!controlVariant) return null

    // Calculate conversion rates
    test.variants.forEach(variant => {
      variant.metrics.conversions = variant.metrics.conversions || 0
      variant.metrics.visitors = variant.metrics.visitors || 1
    })

    // Simple statistical significance check (Z-test)
    const winner = this.findWinningVariant(test.variants)
    const isSignificant = this.checkStatisticalSignificance(test.variants)

    return {
      test,
      statisticalSignificance: isSignificant,
      winner: isSignificant ? winner : undefined,
      recommendation: this.generateRecommendation(test, winner, isSignificant)
    }
  }

  private findWinningVariant(variants: ABTestVariant[]): ABTestVariant {
    return variants.reduce((best, current) => {
      const currentRate = current.metrics.conversions / current.metrics.visitors
      const bestRate = best.metrics.conversions / best.metrics.visitors
      return currentRate > bestRate ? current : best
    })
  }

  private checkStatisticalSignificance(variants: ABTestVariant[]): boolean {
    // Simplified significance check - in production, use proper statistical tests
    const totalVisitors = variants.reduce((sum, v) => sum + v.metrics.visitors, 0)
    const minSampleSize = 100 // Minimum sample size per variant
    
    return variants.every(v => v.metrics.visitors >= minSampleSize) && totalVisitors >= 500
  }

  private generateRecommendation(test: ABTest, winner: ABTestVariant, isSignificant: boolean): string {
    if (!isSignificant) {
      return 'Continue test until statistical significance is reached. Consider increasing traffic or running longer.'
    }

    const controlVariant = test.variants.find(v => v.isControl)
    if (!controlVariant || winner.id === controlVariant.id) {
      return 'Control variant is performing best. Consider testing more dramatic changes.'
    }

    const improvement = ((winner.metrics.conversions / winner.metrics.visitors) - 
                        (controlVariant.metrics.conversions / controlVariant.metrics.visitors)) / 
                        (controlVariant.metrics.conversions / controlVariant.metrics.visitors) * 100

    return `Implement variant ${winner.name} - shows ${improvement.toFixed(1)}% improvement over control.`
  }

  public getAllTests(): ABTest[] {
    return Array.from(this.activeTests.values())
  }

  public stopTest(testId: string): void {
    const test = this.activeTests.get(testId)
    if (test) {
      test.status = 'completed'
      test.endDate = Date.now()
    }
  }

  public pauseTest(testId: string): void {
    const test = this.activeTests.get(testId)
    if (test) {
      test.status = 'paused'
    }
  }

  public resumeTest(testId: string): void {
    const test = this.activeTests.get(testId)
    if (test) {
      test.status = 'running'
    }
  }
}

// React hook for A/B testing
export function useABTest(testId: string) {
  const [manager] = useState(() => new ABTestManager())
  const [activeVariant, setActiveVariant] = useState<ABTestVariant | null>(null)
  const [testResults, setTestResults] = useState<any>(null)

  useEffect(() => {
    const variantId = manager.assignUserToVariant(testId)
    if (variantId) {
      const variant = manager.getActiveVariant(testId)
      setActiveVariant(variant)
    }
  }, [manager, testId])

  const trackConversion = useCallback((conversionType?: string) => {
    manager.trackConversion(testId, conversionType)
  }, [manager, testId])

  const trackMetric = useCallback((metricType: string, value: number) => {
    manager.trackMetric(testId, metricType, value)
  }, [manager, testId])

  const getResults = useCallback(() => {
    const results = manager.getTestResults(testId)
    setTestResults(results)
    return results
  }, [manager, testId])

  return {
    activeVariant,
    trackConversion,
    trackMetric,
    getResults,
    testResults,
    manager
  }
}

// Helper function to create common A/B tests
export function createHeroSectionTest(): ABTestConfig {
  return {
    testId: 'hero_section_cta',
    targetMetric: 'conversion',
    variants: [
      {
        id: 'control',
        name: 'Original CTA',
        traffic: 50,
        isControl: true,
        component: () => null, // Original component
        metrics: { visitors: 0, conversions: 0, bounceRate: 0, timeOnPage: 0, scrollDepth: 0 }
      },
      {
        id: 'variant_urgent',
        name: 'Urgent CTA',
        traffic: 50,
        isControl: false,
        component: () => null, // Variant component
        metrics: { visitors: 0, conversions: 0, bounceRate: 0, timeOnPage: 0, scrollDepth: 0 }
      }
    ]
  }
}

export function createProjectLayoutTest(): ABTestConfig {
  return {
    testId: 'project_layout',
    targetMetric: 'engagement',
    variants: [
      {
        id: 'grid_layout',
        name: 'Grid Layout',
        traffic: 33,
        isControl: true,
        component: () => null,
        metrics: { visitors: 0, conversions: 0, bounceRate: 0, timeOnPage: 0, scrollDepth: 0 }
      },
      {
        id: 'carousel_layout',
        name: 'Carousel Layout', 
        traffic: 33,
        isControl: false,
        component: () => null,
        metrics: { visitors: 0, conversions: 0, bounceRate: 0, timeOnPage: 0, scrollDepth: 0 }
      },
      {
        id: 'masonry_layout',
        name: 'Masonry Layout',
        traffic: 34,
        isControl: false,
        component: () => null,
        metrics: { visitors: 0, conversions: 0, bounceRate: 0, timeOnPage: 0, scrollDepth: 0 }
      }
    ]
  }
}

export default ABTestManager
