'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ProgressiveDisclosure, UserJourney } from '@/types/analytics'

interface DisclosureLevel {
  level: number
  content: React.ReactNode
  triggerConditions: {
    timeThreshold?: number
    scrollThreshold?: number
    interactionCount?: number
    returningVisitor?: boolean
    sectionVisits?: number
  }
}

interface ProgressiveContent {
  id: string
  section: string
  levels: DisclosureLevel[]
  currentLevel: number
  userPreference: 'show_all' | 'progressive' | 'minimal'
}

class ProgressiveDisclosureManager {
  private content: Map<string, ProgressiveContent> = new Map()
  private userMetrics: {
    timeOnSite: number
    scrollDepth: number
    interactionCount: number
    sectionVisits: Map<string, number>
    returningVisitor: boolean
  } = {
    timeOnSite: 0,
    scrollDepth: 0,
    interactionCount: 0,
    sectionVisits: new Map(),
    returningVisitor: false
  }
  private cognitiveLoadScore: number = 0
  private maxCognitiveLoad: number = 100
  private onContentUpdate?: (contentId: string, level: number) => void

  constructor() {
    this.initializeDefaultContent()
    this.loadUserPreferences()
  }

  private initializeDefaultContent(): void {
    // Hero Section Progressive Disclosure
    this.addProgressiveContent({
      id: 'hero_description',
      section: 'hero',
      levels: [
        {
          level: 1,
          content: 'Full-Stack Developer & Computer Science Student',
          triggerConditions: {} // Always show
        },
        {
          level: 2,
          content: 'Passionate about building scalable web applications and automating workflows',
          triggerConditions: {
            timeThreshold: 10000, // 10 seconds
            scrollThreshold: 10
          }
        },
        {
          level: 3,
          content: 'Specializing in React, Node.js, Python, and DevOps technologies with 3+ years of experience',
          triggerConditions: {
            timeThreshold: 30000, // 30 seconds
            scrollThreshold: 20
          }
        },
        {
          level: 4,
          content: 'Currently pursuing BS in Computer Science while contributing to open-source projects and building innovative solutions',
          triggerConditions: {
            timeThreshold: 60000, // 1 minute
            scrollThreshold: 30,
            sectionVisits: 2
          }
        }
      ],
      currentLevel: 1,
      userPreference: 'progressive'
    })

    // About Section Progressive Disclosure
    this.addProgressiveContent({
      id: 'about_skills',
      section: 'about',
      levels: [
        {
          level: 1,
          content: 'Core Technologies: React, TypeScript, Node.js',
          triggerConditions: {}
        },
        {
          level: 2,
          content: 'Frontend: React, Next.js, TypeScript, Tailwind CSS, Framer Motion',
          triggerConditions: {
            timeThreshold: 20000,
            sectionVisits: 1
          }
        },
        {
          level: 3,
          content: 'Backend: Node.js, Express, Python, FastAPI, PostgreSQL, MongoDB',
          triggerConditions: {
            timeThreshold: 45000,
            scrollThreshold: 40
          }
        },
        {
          level: 4,
          content: 'DevOps: Docker, Kubernetes, AWS, GitHub Actions, Terraform, CI/CD',
          triggerConditions: {
            timeThreshold: 90000,
            interactionCount: 5
          }
        },
        {
          level: 5,
          content: 'Advanced: Microservices, Database Design, System Architecture, Performance Optimization',
          triggerConditions: {
            timeThreshold: 120000,
            returningVisitor: true
          }
        }
      ],
      currentLevel: 1,
      userPreference: 'progressive'
    })

    // Projects Section Progressive Disclosure
    this.addProgressiveContent({
      id: 'project_details',
      section: 'projects',
      levels: [
        {
          level: 1,
          content: 'Featured Projects Portfolio',
          triggerConditions: {}
        },
        {
          level: 2,
          content: 'Full-stack applications with modern tech stacks',
          triggerConditions: {
            timeThreshold: 15000,
            sectionVisits: 1
          }
        },
        {
          level: 3,
          content: 'Each project includes source code, live demos, and detailed documentation',
          triggerConditions: {
            timeThreshold: 45000,
            interactionCount: 3
          }
        },
        {
          level: 4,
          content: 'Focus on scalability, performance, and user experience with real-world applications',
          triggerConditions: {
            timeThreshold: 90000,
            scrollThreshold: 60
          }
        }
      ],
      currentLevel: 1,
      userPreference: 'progressive'
    })

    // Experience Section Progressive Disclosure
    this.addProgressiveContent({
      id: 'experience_details',
      section: 'experience',
      levels: [
        {
          level: 1,
          content: 'Professional Experience',
          triggerConditions: {}
        },
        {
          level: 2,
          content: 'Internships and freelance projects in software development',
          triggerConditions: {
            timeThreshold: 20000,
            sectionVisits: 1
          }
        },
        {
          level: 3,
          content: 'Led development teams, implemented CI/CD pipelines, and mentored junior developers',
          triggerConditions: {
            timeThreshold: 60000,
            interactionCount: 4
          }
        },
        {
          level: 4,
          content: 'Achieved 40% performance improvements, 95% code coverage, and 60% deployment time reduction',
          triggerConditions: {
            timeThreshold: 120000,
            scrollThreshold: 70
          }
        }
      ],
      currentLevel: 1,
      userPreference: 'progressive'
    })

    // Contact Section Progressive Disclosure
    this.addProgressiveContent({
      id: 'contact_methods',
      section: 'contact',
      levels: [
        {
          level: 1,
          content: 'Get in touch for collaboration opportunities',
          triggerConditions: {}
        },
        {
          level: 2,
          content: 'Available for full-time roles, freelance projects, and technical consulting',
          triggerConditions: {
            timeThreshold: 30000,
            sectionVisits: 1
          }
        },
        {
          level: 3,
          content: 'Response time: 24-48 hours | Preferred communication: Email or LinkedIn',
          triggerConditions: {
            timeThreshold: 90000,
            interactionCount: 6
          }
        },
        {
          level: 4,
          content: 'Open to discussing remote opportunities, technical challenges, and innovative projects',
          triggerConditions: {
            timeThreshold: 180000,
            returningVisitor: true
          }
        }
      ],
      currentLevel: 1,
      userPreference: 'progressive'
    })
  }

  private loadUserPreferences(): void {
    const stored = localStorage.getItem('progressive_disclosure_preferences')
    if (stored) {
      try {
        const preferences = JSON.parse(stored)
        for (const [id, content] of this.content) {
          if (preferences[id]) {
            content.userPreference = preferences[id].userPreference
            content.currentLevel = preferences[id].currentLevel
          }
        }
      } catch (error) {
        console.warn('Failed to load progressive disclosure preferences:', error)
      }
    }

    // Check if returning visitor
    this.userMetrics.returningVisitor = localStorage.getItem('user_session') !== null
  }

  private saveUserPreferences(): void {
    const preferences: any = {}
    for (const [id, content] of this.content) {
      preferences[id] = {
        userPreference: content.userPreference,
        currentLevel: content.currentLevel
      }
    }
    localStorage.setItem('progressive_disclosure_preferences', JSON.stringify(preferences))
  }

  public addProgressiveContent(content: ProgressiveContent): void {
    this.content.set(content.id, content)
  }

  public updateMetrics(metrics: {
    timeOnSite?: number
    scrollDepth?: number
    interactionCount?: number
    currentSection?: string
  }): void {
    if (metrics.timeOnSite !== undefined) {
      this.userMetrics.timeOnSite = metrics.timeOnSite
    }
    if (metrics.scrollDepth !== undefined) {
      this.userMetrics.scrollDepth = metrics.scrollDepth
    }
    if (metrics.interactionCount !== undefined) {
      this.userMetrics.interactionCount = metrics.interactionCount
    }
    if (metrics.currentSection) {
      const visits = this.userMetrics.sectionVisits.get(metrics.currentSection) || 0
      this.userMetrics.sectionVisits.set(metrics.currentSection, visits + 1)
    }

    this.checkAndUpdateDisclosureLevels()
    this.calculateCognitiveLoad()
  }

  private checkAndUpdateDisclosureLevels(): void {
    for (const [id, content] of this.content) {
      if (content.userPreference === 'show_all') {
        content.currentLevel = content.levels.length
        continue
      }
      
      if (content.userPreference === 'minimal') {
        content.currentLevel = 1
        continue
      }

      // Progressive disclosure logic
      for (let i = content.currentLevel; i < content.levels.length; i++) {
        const level = content.levels[i]
        if (this.shouldRevealLevel(level, content.section)) {
          content.currentLevel = i + 1
          this.onContentUpdate?.(id, content.currentLevel)
        } else {
          break
        }
      }
    }

    this.saveUserPreferences()
  }

  private shouldRevealLevel(level: DisclosureLevel, section: string): boolean {
    const conditions = level.triggerConditions

    // Check cognitive load first
    if (this.cognitiveLoadScore >= this.maxCognitiveLoad) {
      return false
    }

    if (conditions.timeThreshold && this.userMetrics.timeOnSite < conditions.timeThreshold) {
      return false
    }

    if (conditions.scrollThreshold && this.userMetrics.scrollDepth < conditions.scrollThreshold) {
      return false
    }

    if (conditions.interactionCount && this.userMetrics.interactionCount < conditions.interactionCount) {
      return false
    }

    if (conditions.returningVisitor && !this.userMetrics.returningVisitor) {
      return false
    }

    if (conditions.sectionVisits) {
      const visits = this.userMetrics.sectionVisits.get(section) || 0
      if (visits < conditions.sectionVisits) {
        return false
      }
    }

    return true
  }

  private calculateCognitiveLoad(): void {
    // Calculate cognitive load based on various factors
    let load = 0

    // Base load from current content levels
    for (const content of this.content.values()) {
      load += content.currentLevel * 5 // 5 points per level
    }

    // Adjust for user behavior
    if (this.userMetrics.interactionCount > 20) {
      load += 20 // High interaction indicates possible confusion
    }

    if (this.userMetrics.scrollDepth > 80) {
      load -= 10 // Deep scrolling indicates engagement
    }

    if (this.userMetrics.timeOnSite > 300000) { // 5 minutes
      load -= 15 // Long time on site indicates interest
    }

    this.cognitiveLoadScore = Math.max(0, Math.min(100, load))
  }

  public getContent(contentId: string): ProgressiveContent | null {
    return this.content.get(contentId) || null
  }

  public getCurrentContent(contentId: string): React.ReactNode | null {
    const content = this.content.get(contentId)
    if (!content) return null

    const level = content.levels[content.currentLevel - 1]
    return level ? level.content : null
  }

  public getAllContent(): ProgressiveContent[] {
    return Array.from(this.content.values())
  }

  public setUserPreference(contentId: string, preference: 'show_all' | 'progressive' | 'minimal'): void {
    const content = this.content.get(contentId)
    if (content) {
      content.userPreference = preference
      
      // Immediately adjust level based on preference
      if (preference === 'show_all') {
        content.currentLevel = content.levels.length
      } else if (preference === 'minimal') {
        content.currentLevel = 1
      }
      
      this.saveUserPreferences()
      this.onContentUpdate?.(contentId, content.currentLevel)
    }
  }

  public getCognitiveLoadScore(): number {
    return this.cognitiveLoadScore
  }

  public getEngagementRecommendations(): string[] {
    const recommendations: string[] = []

    if (this.cognitiveLoadScore > 80) {
      recommendations.push('Consider reducing information density to improve user comprehension')
    }

    if (this.userMetrics.interactionCount < 3 && this.userMetrics.timeOnSite > 60000) {
      recommendations.push('Content may not be engaging enough - consider adding interactive elements')
    }

    if (this.userMetrics.scrollDepth < 30 && this.userMetrics.timeOnSite > 30000) {
      recommendations.push('Users are not scrolling - hero section may need optimization')
    }

    // Analyze content level progression
    for (const [id, content] of this.content) {
      if (content.currentLevel === 1 && this.userMetrics.timeOnSite > 120000) {
        recommendations.push(`Consider reducing trigger thresholds for ${content.section} section`)
      }
    }

    return recommendations
  }

  public setContentUpdateCallback(callback: (contentId: string, level: number) => void): void {
    this.onContentUpdate = callback
  }

  // Personalization based on user journey
  public personalizeForUser(journey: UserJourney): void {
    const profile = journey.psychologicalProfile

    // Adjust disclosure timing based on attention span
    const timeMultiplier = profile.attentionSpan === 'short' ? 0.5 : 
                          profile.attentionSpan === 'long' ? 1.5 : 1.0

    // Adjust cognitive load threshold
    if (profile.techSavviness === 'high') {
      this.maxCognitiveLoad = 120
    } else if (profile.techSavviness === 'low') {
      this.maxCognitiveLoad = 60
    }

    // Adjust trigger conditions for all content
    for (const content of this.content.values()) {
      for (const level of content.levels) {
        if (level.triggerConditions.timeThreshold) {
          level.triggerConditions.timeThreshold = Math.round(
            level.triggerConditions.timeThreshold * timeMultiplier
          )
        }
      }
    }
  }

  // A/B testing support
  public getOptimalDisclosureStrategy(): {
    strategy: 'immediate' | 'progressive' | 'delayed'
    reasoning: string
  } {
    const avgTimeToEngage = this.userMetrics.timeOnSite / Math.max(1, this.userMetrics.interactionCount)
    
    if (avgTimeToEngage < 30000) { // 30 seconds
      return {
        strategy: 'immediate',
        reasoning: 'Users engage quickly - show more content upfront'
      }
    } else if (avgTimeToEngage > 120000) { // 2 minutes
      return {
        strategy: 'delayed',
        reasoning: 'Users take time to engage - gradual content revelation works better'
      }
    } else {
      return {
        strategy: 'progressive',
        reasoning: 'Balanced engagement pattern - current progressive strategy is optimal'
      }
    }
  }
}

// React hook for progressive disclosure
export function useProgressiveDisclosure(contentId?: string) {
  const [manager] = useState(() => new ProgressiveDisclosureManager())
  const [content, setContent] = useState<ProgressiveContent | null>(
    contentId ? manager.getContent(contentId) : null
  )
  const [cognitiveLoad, setCognitiveLoad] = useState(0)

  const updateMetrics = useCallback((metrics: any) => {
    manager.updateMetrics(metrics)
    setCognitiveLoad(manager.getCognitiveLoadScore())
    
    if (contentId) {
      setContent(manager.getContent(contentId))
    }
  }, [manager, contentId])

  const setUserPreference = useCallback((preference: 'show_all' | 'progressive' | 'minimal') => {
    if (contentId) {
      manager.setUserPreference(contentId, preference)
      setContent(manager.getContent(contentId))
    }
  }, [manager, contentId])

  const getCurrentContent = useCallback(() => {
    if (!contentId) return null
    return manager.getCurrentContent(contentId)
  }, [manager, contentId])

  useEffect(() => {
    manager.setContentUpdateCallback((id, level) => {
      if (contentId === id) {
        setContent(manager.getContent(id))
      }
    })
  }, [manager, contentId])

  return {
    content,
    currentContent: getCurrentContent(),
    cognitiveLoad,
    updateMetrics,
    setUserPreference,
    getRecommendations: () => manager.getEngagementRecommendations(),
    getAllContent: () => manager.getAllContent(),
    manager
  }
}

export default ProgressiveDisclosureManager
