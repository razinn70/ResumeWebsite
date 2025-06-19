'use client'

import { useState, useEffect, useCallback } from 'react'
import { PsychologicalTrigger, UserJourney } from '@/types/analytics'

interface TriggerConditions {
  timeOnSite?: number
  scrollDepth?: number
  pageViews?: number
  deviceType?: string[]
  returningVisitor?: boolean
  currentSection?: string
  interactionCount?: number
  exitIntent?: boolean
}

interface TriggerEffect {
  id: string
  component: React.ComponentType<any>
  props?: any
  duration?: number
  priority: number
  cooldown?: number // Time before trigger can fire again
}

class PsychologicalTriggerEngine {
  private triggers: Map<string, PsychologicalTrigger> = new Map()
  private activeTriggers: Map<string, TriggerEffect> = new Map()
  private triggerHistory: Map<string, number[]> = new Map() // triggerid -> timestamps
  private onTriggerCallback?: (trigger: PsychologicalTrigger, effect: TriggerEffect) => void

  constructor() {
    this.initializeDefaultTriggers()
  }

  private initializeDefaultTriggers(): void {
    // Social Proof Triggers
    this.addTrigger({
      id: 'social_proof_github',
      name: 'GitHub Stars Social Proof',
      type: 'social_proof',
      description: 'Show GitHub stars and forks to build credibility',
      implementation: 'Floating notification showing recent GitHub activity',
      targetSection: 'projects',
      conditions: {
        timeOnSite: 30000, // 30 seconds
        scrollDepth: 40,
        currentSection: 'projects'
      },
      metrics: { impressions: 0, conversions: 0, conversionRate: 0 }
    })

    // Scarcity Triggers
    this.addTrigger({
      id: 'scarcity_limited_availability',
      name: 'Limited Availability for Collaboration',
      type: 'scarcity',
      description: 'Show limited availability for new projects',
      implementation: 'Notification about limited project slots',
      targetSection: 'contact',
      conditions: {
        timeOnSite: 120000, // 2 minutes
        scrollDepth: 70,
        currentSection: 'contact'
      },
      metrics: { impressions: 0, conversions: 0, conversionRate: 0 }
    })

    // Authority Triggers
    this.addTrigger({
      id: 'authority_certifications',
      name: 'Technical Certifications Badge',
      type: 'authority',
      description: 'Display relevant certifications and achievements',
      implementation: 'Floating badge showing credentials',
      targetSection: 'about',
      conditions: {
        timeOnSite: 45000, // 45 seconds
        scrollDepth: 20
      },
      metrics: { impressions: 0, conversions: 0, conversionRate: 0 }
    })

    // Reciprocity Triggers
    this.addTrigger({
      id: 'reciprocity_free_resources',
      name: 'Free Development Resources',
      type: 'reciprocity',
      description: 'Offer free code templates or resources',
      implementation: 'Modal offering free development templates',
      targetSection: 'projects',
      conditions: {
        timeOnSite: 180000, // 3 minutes
        scrollDepth: 60,
        pageViews: 3
      },
      metrics: { impressions: 0, conversions: 0, conversionRate: 0 }
    })

    // Trust Triggers
    this.addTrigger({
      id: 'trust_testimonials',
      name: 'Client Testimonials',
      type: 'trust',
      description: 'Show testimonials from previous collaborators',
      targetSection: 'experience',
      implementation: 'Sliding testimonial cards',
      conditions: {
        timeOnSite: 60000, // 1 minute
        scrollDepth: 50,
        currentSection: 'experience'
      },
      metrics: { impressions: 0, conversions: 0, conversionRate: 0 }
    })

    // Commitment Triggers
    this.addTrigger({
      id: 'commitment_project_timeline',
      name: 'Project Timeline Commitment',
      type: 'commitment',
      description: 'Show commitment to project deadlines and quality',
      implementation: 'Timeline visualization with guarantees',
      targetSection: 'contact',
      conditions: {
        timeOnSite: 90000, // 1.5 minutes
        scrollDepth: 80,
        currentSection: 'contact'
      },
      metrics: { impressions: 0, conversions: 0, conversionRate: 0 }
    })

    // Liking Triggers
    this.addTrigger({
      id: 'liking_shared_interests',
      name: 'Shared Interests Highlight',
      type: 'liking',
      description: 'Highlight common interests and technologies',
      implementation: 'Animated highlight of matching technologies',
      targetSection: 'about',
      conditions: {
        timeOnSite: 75000, // 1.25 minutes
        scrollDepth: 30
      },
      metrics: { impressions: 0, conversions: 0, conversionRate: 0 }
    })

    // Exit Intent Triggers
    this.addTrigger({
      id: 'exit_intent_contact',
      name: 'Exit Intent Contact Offer',
      type: 'scarcity',
      description: 'Last chance to connect before leaving',
      implementation: 'Exit intent modal with contact form',
      targetSection: 'any',
      conditions: {
        exitIntent: true,
        timeOnSite: 30000 // Must have spent at least 30 seconds
      },
      metrics: { impressions: 0, conversions: 0, conversionRate: 0 }
    })
  }

  public addTrigger(trigger: PsychologicalTrigger): void {
    this.triggers.set(trigger.id, trigger)
  }

  public checkTriggers(conditions: TriggerConditions): TriggerEffect[] {
    const effects: TriggerEffect[] = []

    for (const [id, trigger] of this.triggers) {
      if (this.shouldTrigger(trigger, conditions)) {
        const effect = this.createTriggerEffect(trigger)
        if (effect) {
          effects.push(effect)
          this.recordTriggerFired(id)
          trigger.metrics.impressions++
        }
      }
    }

    // Sort by priority (higher priority first)
    return effects.sort((a, b) => b.priority - a.priority)
  }

  private shouldTrigger(trigger: PsychologicalTrigger, conditions: TriggerConditions): boolean {
    // Check if trigger is on cooldown
    if (this.isOnCooldown(trigger.id)) return false

    // Check if trigger has already been fired too many times
    const history = this.triggerHistory.get(trigger.id) || []
    if (history.length >= 3) return false // Max 3 times per session

    // Check all trigger conditions
    const triggerConditions = trigger.conditions || {}

    if (triggerConditions.timeOnSite && (!conditions.timeOnSite || conditions.timeOnSite < triggerConditions.timeOnSite)) {
      return false
    }

    if (triggerConditions.scrollDepth && (!conditions.scrollDepth || conditions.scrollDepth < triggerConditions.scrollDepth)) {
      return false
    }

    if (triggerConditions.pageViews && (!conditions.pageViews || conditions.pageViews < triggerConditions.pageViews)) {
      return false
    }

    if (triggerConditions.currentSection && conditions.currentSection !== triggerConditions.currentSection) {
      return false
    }

    if (triggerConditions.deviceType && conditions.deviceType && !triggerConditions.deviceType.includes(conditions.deviceType[0])) {
      return false
    }

    if (triggerConditions.returningVisitor !== undefined && conditions.returningVisitor !== triggerConditions.returningVisitor) {
      return false
    }

    if (triggerConditions.interactionCount && (!conditions.interactionCount || conditions.interactionCount < triggerConditions.interactionCount)) {
      return false
    }

    if (triggerConditions.exitIntent && !conditions.exitIntent) {
      return false
    }

    return true
  }

  private isOnCooldown(triggerId: string): boolean {
    const history = this.triggerHistory.get(triggerId) || []
    if (history.length === 0) return false

    const lastTriggered = history[history.length - 1]
    const cooldownPeriod = 300000 // 5 minutes default cooldown

    return Date.now() - lastTriggered < cooldownPeriod
  }

  private createTriggerEffect(trigger: PsychologicalTrigger): TriggerEffect | null {
    // Map trigger types to components and effects
    const effectMap = {
      'social_proof': {
        component: 'SocialProofNotification',
        priority: 8,
        duration: 5000
      },
      'scarcity': {
        component: 'ScarcityNotification',
        priority: 9,
        duration: 7000
      },
      'authority': {
        component: 'AuthorityBadge',
        priority: 6,
        duration: 6000
      },
      'reciprocity': {
        component: 'ReciprocityModal',
        priority: 7,
        duration: 0 // Modal stays until dismissed
      },
      'trust': {
        component: 'TrustTestimonials',
        priority: 5,
        duration: 8000
      },
      'commitment': {
        component: 'CommitmentTimeline',
        priority: 4,
        duration: 6000
      },
      'liking': {
        component: 'LikingHighlight',
        priority: 3,
        duration: 4000
      }
    }

    const effectConfig = effectMap[trigger.type]
    if (!effectConfig) return null

    return {
      id: `effect_${trigger.id}_${Date.now()}`,
      component: effectConfig.component as any,
      props: {
        trigger,
        onClose: () => this.dismissTrigger(trigger.id),
        onConversion: () => this.recordConversion(trigger.id)
      },
      duration: effectConfig.duration,
      priority: effectConfig.priority
    }
  }

  private recordTriggerFired(triggerId: string): void {
    const history = this.triggerHistory.get(triggerId) || []
    history.push(Date.now())
    this.triggerHistory.set(triggerId, history)
  }

  private dismissTrigger(triggerId: string): void {
    this.activeTriggers.delete(triggerId)
  }

  private recordConversion(triggerId: string): void {
    const trigger = this.triggers.get(triggerId)
    if (trigger) {
      trigger.metrics.conversions++
      trigger.metrics.conversionRate = trigger.metrics.conversions / trigger.metrics.impressions * 100
    }
  }

  public getActiveTriggers(): TriggerEffect[] {
    return Array.from(this.activeTriggers.values())
  }

  public getTriggerMetrics(): PsychologicalTrigger[] {
    return Array.from(this.triggers.values())
  }

  public setTriggerCallback(callback: (trigger: PsychologicalTrigger, effect: TriggerEffect) => void): void {
    this.onTriggerCallback = callback
  }

  // Advanced trigger analysis
  public analyzeTriggerEffectiveness(): {
    topPerformers: PsychologicalTrigger[]
    underPerformers: PsychologicalTrigger[]
    recommendations: string[]
  } {
    const triggers = Array.from(this.triggers.values())
    const sorted = triggers.sort((a, b) => b.metrics.conversionRate - a.metrics.conversionRate)
    
    const topPerformers = sorted.slice(0, 3)
    const underPerformers = sorted.slice(-3)
    
    const recommendations: string[] = []
    
    if (topPerformers[0]?.metrics.conversionRate > 5) {
      recommendations.push(`${topPerformers[0].name} is performing excellently. Consider expanding this approach.`)
    }
    
    underPerformers.forEach(trigger => {
      if (trigger.metrics.impressions > 10 && trigger.metrics.conversionRate < 1) {
        recommendations.push(`${trigger.name} needs optimization. Consider adjusting conditions or implementation.`)
      }
    })
    
    return { topPerformers, underPerformers, recommendations }
  }

  // Personalization based on user journey
  public personalizeTriggersForUser(journey: UserJourney): void {
    const profile = journey.psychologicalProfile
    
    // Adjust trigger priorities based on user's persuasion style
    for (const [id, trigger] of this.triggers) {
      if (profile.persuasionStyle === 'logical' && trigger.type === 'authority') {
        // Boost authority triggers for logical users
        trigger.conditions = { ...trigger.conditions, timeOnSite: (trigger.conditions?.timeOnSite || 60000) * 0.7 }
      } else if (profile.persuasionStyle === 'emotional' && trigger.type === 'liking') {
        // Boost liking triggers for emotional users
        trigger.conditions = { ...trigger.conditions, scrollDepth: (trigger.conditions?.scrollDepth || 50) * 0.8 }
      } else if (profile.persuasionStyle === 'social' && trigger.type === 'social_proof') {
        // Boost social proof for social users
        trigger.conditions = { ...trigger.conditions, timeOnSite: (trigger.conditions?.timeOnSite || 60000) * 0.5 }
      }
    }
    
    // Adjust for attention span
    if (profile.attentionSpan === 'short') {
      // Fire triggers sooner for users with short attention spans
      for (const trigger of this.triggers.values()) {
        if (trigger.conditions?.timeOnSite) {
          trigger.conditions.timeOnSite *= 0.6
        }
      }
    }
  }
}

// React hook for psychological triggers
export function usePsychologicalTriggers() {
  const [engine] = useState(() => new PsychologicalTriggerEngine())
  const [activeTriggers, setActiveTriggers] = useState<TriggerEffect[]>([])

  const checkTriggers = useCallback((conditions: TriggerConditions) => {
    const effects = engine.checkTriggers(conditions)
    setActiveTriggers(effects)
    return effects
  }, [engine])

  const recordConversion = useCallback((triggerId: string) => {
    engine['recordConversion'](triggerId)
  }, [engine])

  const getTriggerMetrics = useCallback(() => {
    return engine.getTriggerMetrics()
  }, [engine])

  const analyzeTriggerEffectiveness = useCallback(() => {
    return engine.analyzeTriggerEffectiveness()
  }, [engine])

  return {
    activeTriggers,
    checkTriggers,
    recordConversion,
    getTriggerMetrics,
    analyzeTriggerEffectiveness,
    engine
  }
}

export default PsychologicalTriggerEngine
