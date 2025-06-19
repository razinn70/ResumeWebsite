'use client'

/**
 * Advanced Cognitive Psychology & Neuroscience-Driven UX System
 * Implements neuroplasticity-based engagement and emotional resonance
 * 
 * SSR Safety: All browser APIs are checked before use
 */

import { UserSession, UserAction } from '@/types/analytics'

// SSR Safety check function
const isBrowser = typeof window !== 'undefined'

// Cognitive Load Theory Implementation
export interface CognitiveState {
  intrinsicLoad: number // Content complexity
  extraneousLoad: number // Interface complexity  
  germaneLoad: number // Learning/processing effort
  totalLoad: number // Combined cognitive load
  fatigueLevel: number // User fatigue indicator
  attentionCapacity: number // Available attention
}

// Dual-Process Theory (System 1 vs System 2 thinking)
export interface ProcessingMode {
  system1Active: boolean // Fast, intuitive thinking
  system2Active: boolean // Slow, deliberate thinking
  transitionTriggers: string[] // What causes mode switches
  preferredMode: 'intuitive' | 'analytical' | 'balanced'
}

// User Persona Detection based on behavior patterns
export interface UserPersona {
  type: 'recruiter' | 'developer' | 'client' | 'peer' | 'unknown'
  confidence: number
  behaviorSignals: {
    scanningPattern: 'fast-scan' | 'detailed-read' | 'targeted-search'
    interactionStyle: 'explorer' | 'goal-oriented' | 'researcher'
    technicalInterest: 'high' | 'medium' | 'low'
    decisionSpeed: 'fast' | 'deliberate' | 'cautious'
  }
  adaptationPreferences: {
    contentDepth: 'surface' | 'moderate' | 'deep'
    visualComplexity: 'minimal' | 'moderate' | 'rich'
    interactionDensity: 'sparse' | 'moderate' | 'dense'
  }
}

// Emotional State Tracking
export interface EmotionalState {
  valence: number // -1 to 1 (negative to positive)
  arousal: number // 0 to 1 (calm to excited)
  dominance: number // 0 to 1 (submissive to dominant)
  primaryEmotion: 'curiosity' | 'admiration' | 'trust' | 'excitement' | 'anxiety' | 'confusion'
  emotionalJourney: string[] // Sequence of emotions experienced
  resonanceScore: number // How well content matches emotional needs
}

// Attention Pattern Analysis
export interface AttentionPattern {
  focusPoints: { x: number, y: number, duration: number, intensity: number }[]
  scanPath: { x: number, y: number, timestamp: number }[]
  fixationClusters: { x: number, y: number, count: number }[]
  attentionHeatmap: number[][] // 2D array representing attention density
  dwellTime: { [elementId: string]: number }
  backtrackingFrequency: number // How often user revisits content
}

export class CognitivePsychologyEngine {
  private cognitiveState: CognitiveState
  private processingMode: ProcessingMode
  private userPersona: UserPersona
  private emotionalState: EmotionalState
  private attentionPattern: AttentionPattern
  private behaviorHistory: UserAction[]

  constructor() {
    this.cognitiveState = this.initializeCognitiveState()
    this.processingMode = this.initializeProcessingMode()
    this.userPersona = this.initializeUserPersona()
    this.emotionalState = this.initializeEmotionalState()
    this.attentionPattern = this.initializeAttentionPattern()
    this.behaviorHistory = []
  }

  // Neuroplasticity-based behavior pattern recognition
  analyzeUserBehavior(actions: UserAction[]): UserPersona {
    this.behaviorHistory = [...this.behaviorHistory, ...actions]
    
    // Analyze scanning patterns
    const scrollActions = actions.filter(a => a.type === 'scroll')
    const hoverActions = actions.filter(a => a.type === 'hover')
    const clickActions = actions.filter(a => a.type === 'click')

    // Calculate behavior signals
    const avgScrollSpeed = this.calculateScrollVelocity(scrollActions)
    const hoverDuration = this.calculateAverageHoverTime(hoverActions)
    const clickHesitation = this.calculateClickHesitation(clickActions)
    const technicalContentEngagement = this.calculateTechnicalEngagement(actions)

    // Determine user type based on patterns
    let personaType: UserPersona['type'] = 'unknown'
    let confidence = 0

    if (avgScrollSpeed > 2000 && hoverDuration < 500) {
      personaType = 'recruiter'
      confidence = 0.8
    } else if (technicalContentEngagement > 0.7 && hoverDuration > 1500) {
      personaType = 'developer'
      confidence = 0.85
    } else if (clickHesitation > 2000 && this.hasProjectFocusBehavior(actions)) {
      personaType = 'client'
      confidence = 0.75
    } else if (technicalContentEngagement > 0.5 && avgScrollSpeed < 1000) {
      personaType = 'peer'
      confidence = 0.7
    }

    this.userPersona = {
      type: personaType,
      confidence,
      behaviorSignals: {
        scanningPattern: avgScrollSpeed > 1500 ? 'fast-scan' : avgScrollSpeed > 800 ? 'detailed-read' : 'targeted-search',
        interactionStyle: clickActions.length > scrollActions.length ? 'explorer' : 'goal-oriented',
        technicalInterest: technicalContentEngagement > 0.7 ? 'high' : technicalContentEngagement > 0.3 ? 'medium' : 'low',
        decisionSpeed: clickHesitation < 1000 ? 'fast' : clickHesitation < 3000 ? 'deliberate' : 'cautious'
      },
      adaptationPreferences: this.generateAdaptationPreferences(personaType, confidence)
    }

    return this.userPersona
  }

  // Cognitive Load Theory implementation
  calculateCognitiveLoad(section: string, interactions: UserAction[]): CognitiveState {
    const sectionComplexity = this.getSectionComplexity(section)
    const interfaceComplexity = this.calculateInterfaceComplexity(section)
    const userEffort = this.calculateUserEffort(interactions)

    const intrinsicLoad = sectionComplexity * 0.4
    const extraneousLoad = interfaceComplexity * 0.3
    const germaneLoad = userEffort * 0.3
    const totalLoad = intrinsicLoad + extraneousLoad + germaneLoad

    // Calculate fatigue based on session duration and load
    const sessionDuration = Date.now() - (interactions[0]?.timestamp || Date.now())
    const fatigueLevel = Math.min(1, (sessionDuration / 300000) * totalLoad) // 5 min baseline

    this.cognitiveState = {
      intrinsicLoad,
      extraneousLoad,
      germaneLoad,
      totalLoad,
      fatigueLevel,
      attentionCapacity: Math.max(0, 1 - totalLoad - fatigueLevel)
    }

    return this.cognitiveState
  }

  // Emotional Resonance System
  analyzeEmotionalState(interactions: UserAction[], mouseData: any): EmotionalState {
    // Analyze interaction patterns for emotional indicators
    const rapidClicking = this.detectRapidClicking(interactions)
    const hesitantBehavior = this.detectHesitantBehavior(interactions)
    const exploratoryBehavior = this.detectExploratoryBehavior(interactions)
    const backtracking = this.detectBacktracking(interactions)

    // Calculate emotional dimensions
    let valence = 0 // Start neutral
    let arousal = 0.3 // Slight baseline arousal
    let dominance = 0.5 // Neutral control

    // Adjust based on behavior patterns
    if (exploratoryBehavior) {
      valence += 0.3
      arousal += 0.2
      dominance += 0.2
    }

    if (rapidClicking) {
      arousal += 0.4
      valence -= 0.1
    }

    if (hesitantBehavior) {
      arousal -= 0.2
      dominance -= 0.3
    }

    if (backtracking) {
      valence -= 0.2
      arousal += 0.1
    }

    // Determine primary emotion
    let primaryEmotion: EmotionalState['primaryEmotion'] = 'curiosity'
    
    if (valence > 0.5 && arousal > 0.5) primaryEmotion = 'excitement'
    else if (valence > 0.3 && arousal < 0.3) primaryEmotion = 'trust'
    else if (valence > 0.2 && arousal > 0.3) primaryEmotion = 'admiration'
    else if (valence < -0.2) primaryEmotion = 'anxiety'
    else if (arousal < 0.2) primaryEmotion = 'confusion'

    // Calculate resonance score based on how well content matches user needs
    const resonanceScore = this.calculateEmotionalResonance(valence, arousal, dominance)

    this.emotionalState = {
      valence: Math.max(-1, Math.min(1, valence)),
      arousal: Math.max(0, Math.min(1, arousal)),
      dominance: Math.max(0, Math.min(1, dominance)),
      primaryEmotion,
      emotionalJourney: [...(this.emotionalState?.emotionalJourney || []), primaryEmotion],
      resonanceScore
    }

    return this.emotionalState
  }

  // Dynamic Content Adaptation
  generateContentAdaptations(): {
    visualHierarchy: string[]
    contentDepth: 'minimal' | 'moderate' | 'detailed'
    animationSpeed: number
    informationDensity: number
    colorTemperature: 'warm' | 'neutral' | 'cool'
    interactionComplexity: 'simple' | 'moderate' | 'complex'
  } {
    const persona = this.userPersona
    const cognitive = this.cognitiveState
    const emotional = this.emotionalState

    // Adapt visual hierarchy based on user type
    let visualHierarchy: string[] = ['hero', 'about', 'projects', 'contact']
    
    if (persona.type === 'recruiter') {
      visualHierarchy = ['hero', 'projects', 'about', 'contact']
    } else if (persona.type === 'developer') {
      visualHierarchy = ['projects', 'about', 'hero', 'contact']
    } else if (persona.type === 'client') {
      visualHierarchy = ['hero', 'about', 'projects', 'contact']
    }

    // Adapt content depth based on cognitive load
    let contentDepth: 'minimal' | 'moderate' | 'detailed' = 'moderate'
    if (cognitive.totalLoad > 0.8 || cognitive.fatigueLevel > 0.6) {
      contentDepth = 'minimal'
    } else if (persona.behaviorSignals.technicalInterest === 'high' && cognitive.totalLoad < 0.5) {
      contentDepth = 'detailed'
    }

    // Adjust animation speed based on processing mode and fatigue
    let animationSpeed = 1.0
    if (this.processingMode.system1Active) {
      animationSpeed = 1.2 // Faster for intuitive processing
    } else if (cognitive.fatigueLevel > 0.5) {
      animationSpeed = 0.7 // Slower when fatigued
    }

    // Adjust information density
    const informationDensity = Math.max(0.3, 1 - cognitive.totalLoad)

    // Color temperature based on emotional state
    let colorTemperature: 'warm' | 'neutral' | 'cool' = 'neutral'
    if (emotional.valence > 0.3) {
      colorTemperature = 'warm'
    } else if (emotional.arousal > 0.7) {
      colorTemperature = 'cool'
    }

    // Interaction complexity based on user capability
    let interactionComplexity: 'simple' | 'moderate' | 'complex' = 'moderate'
    if (cognitive.attentionCapacity < 0.3 || persona.behaviorSignals.technicalInterest === 'low') {
      interactionComplexity = 'simple'
    } else if (persona.type === 'developer' && cognitive.attentionCapacity > 0.7) {
      interactionComplexity = 'complex'
    }

    return {
      visualHierarchy,
      contentDepth,
      animationSpeed,
      informationDensity,
      colorTemperature,
      interactionComplexity
    }
  }

  // Helper methods
  private initializeCognitiveState(): CognitiveState {
    return {
      intrinsicLoad: 0.3,
      extraneousLoad: 0.2,
      germaneLoad: 0.1,
      totalLoad: 0.6,
      fatigueLevel: 0,
      attentionCapacity: 0.4
    }
  }

  private initializeProcessingMode(): ProcessingMode {
    return {
      system1Active: true,
      system2Active: false,
      transitionTriggers: [],
      preferredMode: 'balanced'
    }
  }

  private initializeUserPersona(): UserPersona {
    return {
      type: 'unknown',
      confidence: 0,
      behaviorSignals: {
        scanningPattern: 'detailed-read',
        interactionStyle: 'explorer',
        technicalInterest: 'medium',
        decisionSpeed: 'deliberate'
      },
      adaptationPreferences: {
        contentDepth: 'moderate',
        visualComplexity: 'moderate',
        interactionDensity: 'moderate'
      }
    }
  }

  private initializeEmotionalState(): EmotionalState {
    return {
      valence: 0,
      arousal: 0.3,
      dominance: 0.5,
      primaryEmotion: 'curiosity',
      emotionalJourney: [],
      resonanceScore: 0.5
    }
  }

  private initializeAttentionPattern(): AttentionPattern {
    return {
      focusPoints: [],
      scanPath: [],
      fixationClusters: [],
      attentionHeatmap: [],
      dwellTime: {},
      backtrackingFrequency: 0
    }
  }

  private calculateScrollVelocity(scrollActions: UserAction[]): number {
    if (scrollActions.length < 2) return 0
    
    let totalDistance = 0
    let totalTime = 0
    
    for (let i = 1; i < scrollActions.length; i++) {
      const prev = scrollActions[i - 1]
      const curr = scrollActions[i]
        if (prev.value?.scrollY && curr.value?.scrollY) {
        totalDistance += Math.abs(curr.value.scrollY - prev.value.scrollY)
        totalTime += curr.timestamp - prev.timestamp
      }
    }
    
    return totalTime > 0 ? totalDistance / totalTime : 0
  }

  private calculateAverageHoverTime(hoverActions: UserAction[]): number {
    if (hoverActions.length === 0) return 0
      const hoverDurations = hoverActions
      .filter(action => action.value?.duration)
      .map(action => action.value.duration)
    
    return hoverDurations.length > 0
      ? hoverDurations.reduce((sum, duration) => sum + duration, 0) / hoverDurations.length
      : 0
  }

  private calculateClickHesitation(clickActions: UserAction[]): number {
    // Calculate time between hover and click events
    const hesitationTimes: number[] = []
      clickActions.forEach(click => {
      if (click.value?.hesitationTime) {
        hesitationTimes.push(click.value.hesitationTime)
      }
    })
    
    return hesitationTimes.length > 0
      ? hesitationTimes.reduce((sum, time) => sum + time, 0) / hesitationTimes.length
      : 0
  }

  private calculateTechnicalEngagement(actions: UserAction[]): number {
    const technicalSections = ['projects', 'skills', 'experience']
    const technicalActions = actions.filter(action => 
      technicalSections.some(section => action.section?.includes(section))
    )
    
    const totalTime = actions.length > 0 
      ? actions[actions.length - 1].timestamp - actions[0].timestamp 
      : 1
    
    const technicalTime = technicalActions.length > 0
      ? technicalActions[technicalActions.length - 1].timestamp - technicalActions[0].timestamp
      : 0
    
    return technicalTime / totalTime
  }

  private hasProjectFocusBehavior(actions: UserAction[]): boolean {
    const projectActions = actions.filter(action => action.section?.includes('project'))
    return projectActions.length > actions.length * 0.4
  }

  private generateAdaptationPreferences(type: UserPersona['type'], confidence: number): UserPersona['adaptationPreferences'] {
    const basePreferences = {
      contentDepth: 'moderate' as const,
      visualComplexity: 'moderate' as const,
      interactionDensity: 'moderate' as const
    }

    if (confidence < 0.5) return basePreferences

    switch (type) {
      case 'recruiter':
        return {
          contentDepth: 'surface',
          visualComplexity: 'minimal',
          interactionDensity: 'sparse'
        }
      case 'developer':
        return {
          contentDepth: 'deep',
          visualComplexity: 'rich',
          interactionDensity: 'dense'
        }
      case 'client':
        return {
          contentDepth: 'moderate',
          visualComplexity: 'moderate',
          interactionDensity: 'moderate'
        }
      case 'peer':
        return {
          contentDepth: 'deep',
          visualComplexity: 'moderate',
          interactionDensity: 'moderate'
        }
      default:
        return basePreferences
    }
  }

  private getSectionComplexity(section: string): number {
    const complexityMap: { [key: string]: number } = {
      'hero': 0.2,
      'about': 0.4,
      'projects': 0.8,
      'skills': 0.6,
      'experience': 0.7,
      'contact': 0.3
    }
    return complexityMap[section] || 0.5
  }

  private calculateInterfaceComplexity(section: string): number {
    // This would analyze DOM complexity, number of interactive elements, etc.
    // For now, return a baseline based on section type
    const interfaceMap: { [key: string]: number } = {
      'hero': 0.3,
      'about': 0.4,
      'projects': 0.9,
      'skills': 0.7,
      'experience': 0.6,
      'contact': 0.5
    }
    return interfaceMap[section] || 0.5
  }

  private calculateUserEffort(interactions: UserAction[]): number {
    // Calculate based on interaction frequency, variety, and complexity
    const effortScore = interactions.length * 0.1 + 
                       new Set(interactions.map(i => i.type)).size * 0.2
    return Math.min(1, effortScore)
  }

  private detectRapidClicking(interactions: UserAction[]): boolean {
    const clicks = interactions.filter(i => i.type === 'click')
    if (clicks.length < 3) return false
    
    const rapidClicks = clicks.filter((click, index) => {
      if (index === 0) return false
      return click.timestamp - clicks[index - 1].timestamp < 500
    })
    
    return rapidClicks.length > clicks.length * 0.3
  }

  private detectHesitantBehavior(interactions: UserAction[]): boolean {
    const avgTimeBetweenActions = this.calculateAverageTimeBetweenActions(interactions)
    return avgTimeBetweenActions > 3000 // More than 3 seconds between actions
  }

  private detectExploratoryBehavior(interactions: UserAction[]): boolean {
    const uniqueSections = new Set(interactions.map(i => i.section))
    const sectionVariety = uniqueSections.size
    const actionVariety = new Set(interactions.map(i => i.type)).size
    
    return sectionVariety > 3 && actionVariety > 2
  }

  private detectBacktracking(interactions: UserAction[]): boolean {
    const scrollActions = interactions.filter(i => i.type === 'scroll')
    let backtrackCount = 0
    
    for (let i = 1; i < scrollActions.length; i++) {
      const prev = scrollActions[i - 1]
      const curr = scrollActions[i]
        if (prev.value?.scrollY && curr.value?.scrollY) {
        if (curr.value.scrollY < prev.value.scrollY - 100) {
          backtrackCount++
        }
      }
    }
    
    return backtrackCount > scrollActions.length * 0.2
  }

  private calculateAverageTimeBetweenActions(interactions: UserAction[]): number {
    if (interactions.length < 2) return 0
    
    let totalTime = 0
    for (let i = 1; i < interactions.length; i++) {
      totalTime += interactions[i].timestamp - interactions[i - 1].timestamp
    }
    
    return totalTime / (interactions.length - 1)
  }

  private calculateEmotionalResonance(valence: number, arousal: number, dominance: number): number {
    // Calculate how well the current emotional state matches ideal engagement
    const idealValence = 0.4 // Slightly positive
    const idealArousal = 0.6 // Moderately aroused
    const idealDominance = 0.7 // Feeling in control
    
    const valenceDistance = Math.abs(valence - idealValence)
    const arousalDistance = Math.abs(arousal - idealArousal)
    const dominanceDistance = Math.abs(dominance - idealDominance)
    
    const totalDistance = (valenceDistance + arousalDistance + dominanceDistance) / 3
    return Math.max(0, 1 - totalDistance)
  }

  // Public getters
  getCognitiveState(): CognitiveState {
    return this.cognitiveState
  }

  getProcessingMode(): ProcessingMode {
    return this.processingMode
  }

  getUserPersona(): UserPersona {
    return this.userPersona
  }

  getEmotionalState(): EmotionalState {
    return this.emotionalState
  }

  getAttentionPattern(): AttentionPattern {
    return this.attentionPattern
  }
}
