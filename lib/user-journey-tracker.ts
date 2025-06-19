'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  UserSession, 
  UserAction, 
  UserJourney, 
  EngagementMetrics, 
  HeatmapData,
  PsychologicalTrigger 
} from '@/types/analytics'

class UserJourneyTracker {
  private session: UserSession | null = null
  private actions: UserAction[] = []
  private journey: UserJourney | null = null
  private heatmapData: HeatmapData[] = []
  private startTime: number = Date.now()
  private lastActivity: number = Date.now()
  private isActive: boolean = true
  private scrollDepth: number = 0
  private maxScrollDepth: number = 0
  private interactionCount: number = 0
  private pageViews: number = 1
  private currentSection: string = 'hero'
  private psychologicalProfile: any = null

  constructor() {
    this.initializeSession()
    this.setupEventListeners()
    this.startJourneyTracking()
  }

  private initializeSession(): void {
    const sessionId = this.generateSessionId()
    
    this.session = {
      id: sessionId,
      startTime: this.startTime,
      lastActivity: this.lastActivity,
      device: this.getDeviceInfo(),
      location: this.getLocationInfo(),
      referrer: document.referrer || undefined,
      utmParams: this.getUTMParams()
    }

    // Store session in localStorage for persistence
    localStorage.setItem('user_session', JSON.stringify(this.session))
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }  private getDeviceInfo() {
    // SSR safety checks
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return {
        type: 'desktop' as 'mobile' | 'tablet' | 'desktop',
        browser: 'unknown',
        os: 'unknown',
        screenSize: { width: 1920, height: 1080 }
      }
    }

    const userAgent = navigator.userAgent
    const screen = window.screen
    
    return {
      type: this.getDeviceType(),
      browser: this.getBrowser(userAgent),
      os: this.getOS(userAgent),
      screenSize: {
        width: screen.width,
        height: screen.height
      }
    }
  }
  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    // SSR safety check
    if (typeof window === 'undefined') {
      return 'desktop' // Default fallback for SSR
    }
    
    const width = window.innerWidth
    if (width <= 768) return 'mobile'
    if (width <= 1024) return 'tablet'
    return 'desktop'
  }

  private getBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Unknown'
  }

  private getOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('iOS')) return 'iOS'
    return 'Unknown'
  }

  private getLocationInfo() {
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  }

  private getUTMParams() {
    const urlParams = new URLSearchParams(window.location.search)
    return {
      source: urlParams.get('utm_source') || undefined,
      medium: urlParams.get('utm_medium') || undefined,
      campaign: urlParams.get('utm_campaign') || undefined,
      content: urlParams.get('utm_content') || undefined
    }
  }

  private setupEventListeners(): void {
    // Track scroll behavior
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true })
    
    // Track clicks
    document.addEventListener('click', this.handleClick.bind(this))
    
    // Track mouse movements for heatmap
    document.addEventListener('mousemove', this.handleMouseMove.bind(this))
    
    // Track focus events
    document.addEventListener('focus', this.handleFocus.bind(this), true)
    
    // Track page visibility
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this))
    
    // Track form interactions
    document.addEventListener('input', this.handleFormInteraction.bind(this))
    
    // Track exit intent
    document.addEventListener('mouseout', this.handleExitIntent.bind(this))
    
    // Track keyboard navigation
    document.addEventListener('keydown', this.handleKeyDown.bind(this))
  }

  private handleScroll(): void {
    const scrollTop = window.pageYOffset
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    this.scrollDepth = Math.round((scrollTop / docHeight) * 100)
    this.maxScrollDepth = Math.max(this.maxScrollDepth, this.scrollDepth)
    
    this.updateActivity()
    this.trackCurrentSection()
    
    this.recordAction({
      type: 'scroll',
      scrollDepth: this.scrollDepth,
      section: this.currentSection
    })
  }

  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement
    this.interactionCount++
    this.updateActivity()
    
    this.recordAction({
      type: 'click',
      element: target.tagName.toLowerCase(),
      elementId: target.id || undefined,
      elementClass: target.className || undefined,
      elementText: target.textContent?.slice(0, 100) || undefined,
      coordinates: { x: event.clientX, y: event.clientY },
      section: this.currentSection
    })

    // Track heatmap data
    this.recordHeatmapInteraction(target, 'click', event.clientX, event.clientY)
  }

  private handleMouseMove(event: MouseEvent): void {
    // Throttle mouse move events
    if (Date.now() - this.lastActivity > 100) {
      this.updateActivity()
    }
  }

  private handleFocus(event: FocusEvent): void {
    const target = event.target as HTMLElement
    this.recordAction({
      type: 'focus',
      element: target.tagName.toLowerCase(),
      elementId: target.id || undefined,
      section: this.currentSection
    })
  }

  private handleVisibilityChange(): void {
    this.isActive = !document.hidden
    if (this.isActive) {
      this.updateActivity()
    }
  }

  private handleFormInteraction(event: Event): void {
    const target = event.target as HTMLElement
    this.recordAction({
      type: 'form_interaction',
      element: target.tagName.toLowerCase(),
      elementId: target.id || undefined,
      section: this.currentSection
    })
  }

  private handleExitIntent(event: MouseEvent): void {
    if (event.clientY <= 0) {
      this.recordAction({
        type: 'hover',
        exitIntent: true,
        section: this.currentSection
      })
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      this.recordAction({
        type: 'focus',
        element: 'keyboard_navigation',
        section: this.currentSection
      })
    }
  }

  private trackCurrentSection(): void {
    const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'contact']
    
    for (const section of sections) {
      const element = document.getElementById(section)
      if (element) {
        const rect = element.getBoundingClientRect()
        if (rect.top <= 100 && rect.bottom >= 100) {
          if (this.currentSection !== section) {
            this.currentSection = section
            this.recordAction({
              type: 'page_view',
              section: section
            })
          }
          break
        }
      }
    }
  }

  private recordAction(actionData: Partial<UserAction>): void {
    if (!this.session) return

    const action: UserAction = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId: this.session.id,
      timestamp: Date.now(),
      timeOnPage: Date.now() - this.startTime,
      ...actionData
    } as UserAction

    this.actions.push(action)
    this.updateJourneyStage(action)
    
    // Limit stored actions to prevent memory issues
    if (this.actions.length > 1000) {
      this.actions = this.actions.slice(-500)
    }
  }

  private recordHeatmapInteraction(
    element: HTMLElement, 
    type: 'click' | 'hover', 
    x: number, 
    y: number
  ): void {
    const elementSelector = this.getElementSelector(element)
    
    let heatmapEntry = this.heatmapData.find(entry => entry.element === elementSelector)
    
    if (!heatmapEntry) {
      heatmapEntry = {
        sessionId: this.session!.id,
        element: elementSelector,
        interactions: [],
        visibility: {
          viewTime: 0,
          viewportPercentage: 0,
          scrollDepth: this.scrollDepth
        }
      }
      this.heatmapData.push(heatmapEntry)
    }
    
    heatmapEntry.interactions.push({
      type,
      timestamp: Date.now(),
      coordinates: { x, y }
    })
  }

  private getElementSelector(element: HTMLElement): string {
    if (element.id) return `#${element.id}`
    if (element.className) return `.${element.className.split(' ')[0]}`
    return element.tagName.toLowerCase()
  }

  private updateActivity(): void {
    this.lastActivity = Date.now()
    if (this.session) {
      this.session.lastActivity = this.lastActivity
    }
  }

  private startJourneyTracking(): void {
    if (!this.session) return

    this.journey = {
      id: `journey_${this.session.id}`,
      sessionId: this.session.id,
      stages: [],
      currentStage: 'awareness',
      startTime: this.startTime,
      lastUpdated: Date.now(),
      completed: false,
      totalEngagementScore: 0,
      psychologicalProfile: {
        motivators: [],
        barriers: [],
        persuasionStyle: 'logical',
        attentionSpan: 'medium',
        techSavviness: 'medium'
      }
    }

    this.analyzePsychologicalProfile()
  }

  private updateJourneyStage(action: UserAction): void {
    if (!this.journey) return

    const stages = {
      'awareness': ['hero', 'about'],
      'interest': ['skills', 'projects'],
      'consideration': ['experience', 'projects'],
      'intent': ['contact'],
      'action': ['contact']
    }

    for (const [stage, sections] of Object.entries(stages)) {
      if (sections.includes(action.section || '')) {
        if (this.journey.currentStage !== stage) {
          this.journey.currentStage = stage
          this.journey.lastUpdated = Date.now()
        }
        break
      }
    }

    this.calculateEngagementScore()
  }

  private analyzePsychologicalProfile(): void {
    if (!this.journey) return

    // Analyze device and behavior patterns
    const deviceType = this.session?.device.type
    const timeOfDay = new Date().getHours()
    
    // Determine tech savviness based on device and browser
    if (deviceType === 'desktop' && this.session?.device.browser !== 'Unknown') {
      this.journey.psychologicalProfile.techSavviness = 'high'
    }
    
    // Determine persuasion style based on interaction patterns
    if (this.interactionCount > 10) {
      this.journey.psychologicalProfile.persuasionStyle = 'visual'
    } else if (this.maxScrollDepth > 80) {
      this.journey.psychologicalProfile.persuasionStyle = 'logical'
    }
    
    // Determine attention span based on time and scroll behavior
    const timeOnSite = Date.now() - this.startTime
    if (timeOnSite > 300000 && this.maxScrollDepth > 70) { // 5 minutes+, 70%+ scroll
      this.journey.psychologicalProfile.attentionSpan = 'long'
    } else if (timeOnSite < 30000 || this.maxScrollDepth < 20) { // <30s or <20% scroll
      this.journey.psychologicalProfile.attentionSpan = 'short'
    }
  }

  private calculateEngagementScore(): void {
    if (!this.journey) return

    const timeOnSite = Date.now() - this.startTime
    const scrollScore = this.maxScrollDepth / 100 * 25
    const interactionScore = Math.min(this.interactionCount * 2, 25)
    const timeScore = Math.min(timeOnSite / 60000 * 10, 25) // 1 point per minute, max 25
    const sectionScore = this.pageViews * 5 // 5 points per section viewed

    this.journey.totalEngagementScore = scrollScore + interactionScore + timeScore + sectionScore
  }

  // Public methods for external access
  public getSession(): UserSession | null {
    return this.session
  }

  public getActions(): UserAction[] {
    return [...this.actions]
  }

  public getJourney(): UserJourney | null {
    return this.journey
  }

  public getEngagementMetrics(): EngagementMetrics | null {
    if (!this.session || !this.journey) return null

    return {
      sessionId: this.session.id,
      pageViews: this.pageViews,
      timeOnSite: Date.now() - this.startTime,
      scrollDepth: this.maxScrollDepth,
      interactionRate: this.interactionCount / (Date.now() - this.startTime) * 60000, // interactions per minute
      bounceRate: this.pageViews === 1 && Date.now() - this.startTime < 30000 ? 1 : 0,
      conversionFunnelStep: this.getConversionFunnelStep(),
      engagementScore: this.journey.totalEngagementScore,
      attentionHeatmap: this.heatmapData,
      exitPoints: this.getExitPoints(),
      conversionBarriers: this.getConversionBarriers()
    }
  }

  public getHeatmapData(): HeatmapData[] {
    return [...this.heatmapData]
  }

  private getConversionFunnelStep(): number {
    const stageMap = {
      'awareness': 1,
      'interest': 2,
      'consideration': 3,
      'intent': 4,
      'action': 5
    }
    return stageMap[this.journey?.currentStage as keyof typeof stageMap] || 1
  }

  private getExitPoints(): string[] {
    // Analyze where users tend to stop scrolling or leave
    return this.actions
      .filter(action => action.type === 'scroll')
      .map(action => action.section)
      .filter((section): section is string => !!section)
  }

  private getConversionBarriers(): string[] {
    const barriers: string[] = []
    
    if (this.maxScrollDepth < 30) {
      barriers.push('Low initial engagement - users not scrolling past hero')
    }
    
    if (this.interactionCount < 3 && Date.now() - this.startTime > 60000) {
      barriers.push('Low interaction rate - content may not be engaging')
    }
    
    if (this.journey?.currentStage === 'awareness' && Date.now() - this.startTime > 120000) {
      barriers.push('Stuck in awareness stage - value proposition may be unclear')
    }
    
    return barriers
  }

  public destroy(): void {
    // Clean up event listeners
    window.removeEventListener('scroll', this.handleScroll.bind(this))
    document.removeEventListener('click', this.handleClick.bind(this))
    document.removeEventListener('mousemove', this.handleMouseMove.bind(this))
    document.removeEventListener('focus', this.handleFocus.bind(this))
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this))
    document.removeEventListener('input', this.handleFormInteraction.bind(this))
    document.removeEventListener('mouseout', this.handleExitIntent.bind(this))
    document.removeEventListener('keydown', this.handleKeyDown.bind(this))
  }
}

// React hook for using the user journey tracker
export function useUserJourneyTracker() {
  const [tracker] = useState(() => new UserJourneyTracker())
  const [metrics, setMetrics] = useState<EngagementMetrics | null>(null)
  const [journey, setJourney] = useState<UserJourney | null>(null)
  
  const updateMetrics = useCallback(() => {
    const currentMetrics = tracker.getEngagementMetrics()
    const currentJourney = tracker.getJourney()
    
    setMetrics(currentMetrics)
    setJourney(currentJourney)
  }, [tracker])
  
  useEffect(() => {
    const interval = setInterval(updateMetrics, 5000) // Update every 5 seconds
    
    return () => {
      clearInterval(interval)
      tracker.destroy()
    }
  }, [tracker, updateMetrics])
  
  return {
    tracker,
    metrics,
    journey,
    session: tracker.getSession(),
    actions: tracker.getActions(),
    heatmapData: tracker.getHeatmapData()
  }
}

export default UserJourneyTracker
