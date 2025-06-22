export interface UserSession {
  id: string
  startTime: number
  lastActivity: number
  device: {
    type: 'mobile' | 'tablet' | 'desktop'
    browser: string
    os: string
    screenSize: {
      width: number
      height: number
    }
  }
  location?: {
    country?: string
    region?: string
    timezone: string
  }
  referrer?: string
  utmParams?: {
    source?: string
    medium?: string
    campaign?: string
    content?: string
  }
}

export interface UserAction {
  id: string
  sessionId: string
  timestamp: number
  type: 'page_view' | 'scroll' | 'click' | 'hover' | 'focus' | 'form_interaction' | 'download' | 'contact_attempt'
  element?: string
  elementId?: string
  elementClass?: string
  elementText?: string
  section?: string
  value?: any
  coordinates?: { x: number; y: number }
  scrollDepth?: number
  timeOnPage?: number
  exitIntent?: boolean
}

export interface PsychologicalTrigger {
  id: string
  name: string
  type: 'scarcity' | 'social_proof' | 'authority' | 'reciprocity' | 'commitment' | 'liking' | 'trust'
  description: string
  implementation: string
  targetSection: string
  conditions?: {
    timeOnSite?: number
    scrollDepth?: number
    pageViews?: number
    deviceType?: string[]
    returningVisitor?: boolean
    currentSection?: string
    interactionCount?: number
    exitIntent?: boolean
  }
  metrics: {
    impressions: number
    conversions: number
    conversionRate: number
  }
}

export interface ABTestVariant {
  id: string
  name: string
  traffic: number // percentage 0-100
  component: React.ComponentType<any>
  isControl: boolean
  metrics: {
    visitors: number
    conversions: number
    bounceRate: number
    timeOnPage: number
    scrollDepth: number
  }
}

export interface ABTest {
  id: string
  name: string
  description: string
  startDate: number
  endDate?: number
  status: 'draft' | 'running' | 'paused' | 'completed'
  variants: ABTestVariant[]
  targetMetric: 'conversion' | 'engagement' | 'bounce_rate' | 'time_on_page'
  segments?: {
    deviceTypes?: string[]
    countries?: string[]
    referrers?: string[]
    returningVisitors?: boolean
  }
}

export interface UserJourneyStage {
  id: string
  name: string
  description: string
  triggers: string[] // psychological trigger IDs
  actions: UserAction[]
  conversionGoals: string[]
  dropOffRate: number
  averageTimeSpent: number
  nextStages: string[]
}

export interface UserJourney {
  id: string
  sessionId: string
  stages: UserJourneyStage[]
  currentStage: string
  startTime: number
  lastUpdated: number
  completed: boolean
  conversionType?: 'contact' | 'download' | 'social_follow' | 'project_view'
  totalEngagementScore: number
  psychologicalProfile: {
    motivators: string[]
    barriers: string[]
    persuasionStyle: 'logical' | 'emotional' | 'social' | 'visual'
    attentionSpan: 'short' | 'medium' | 'long'
    techSavviness: 'low' | 'medium' | 'high'
  }
}

export interface HeatmapData {
  sessionId: string
  element: string
  interactions: {
    type: 'click' | 'hover' | 'scroll_pause'
    timestamp: number
    coordinates: { x: number; y: number }
    duration?: number
  }[]
  visibility: {
    viewTime: number
    viewportPercentage: number
    scrollDepth: number
  }
}

export interface EngagementMetrics {
  sessionId: string
  pageViews: number
  timeOnSite: number
  scrollDepth: number
  interactionRate: number
  bounceRate: number
  conversionFunnelStep: number
  engagementScore: number
  attentionHeatmap: HeatmapData[]
  exitPoints: string[]
  conversionBarriers: string[]
}

export interface ProgressiveDisclosure {
  id: string
  section: string
  level: number // 1-5, 1 being most basic info
  content: {
    basic: string
    intermediate?: string
    advanced?: string
    expert?: string
  }
  triggers: {
    timeThreshold?: number
    scrollThreshold?: number
    interactionCount?: number
    returningVisitor?: boolean
  }
  userPreference?: 'show_all' | 'progressive' | 'minimal'
}

export interface ConversionFunnel {
  stages: {
    id: string
    name: string
    description: string
    visitors: number
    completions: number
    conversionRate: number
    averageTime: number
    dropOffReasons: string[]
    optimizationSuggestions: string[]
  }[]
  totalConversionRate: number
  bottleneckStage: string
  improvementOpportunities: {
    stage: string
    potentialIncrease: number
    difficulty: 'low' | 'medium' | 'high'
    suggestion: string
  }[]
}

export interface AnalyticsConfig {
  enableTracking: boolean
  enableHeatmaps: boolean
  enableABTesting: boolean
  enablePsychologicalTriggers: boolean
  enableProgressiveDisclosure: boolean
  dataRetentionDays: number
  privacyCompliant: boolean
  consentRequired: boolean
  anonymizeData: boolean
}
