// Main Analytics Provider
export { default as UserAnalyticsProvider, useAnalytics, AnalyticsEnhancedSection, ABTestVariant } from './UserAnalyticsProvider'

// Dashboard and Visualization
export { default as AnalyticsDashboard } from './AnalyticsDashboard'

// Psychological Triggers
export { 
  PsychologicalTriggerRenderer,
  SocialProofNotification,
  ScarcityNotification,
  AuthorityBadge,
  ReciprocityModal,
  TrustTestimonials,
  CommitmentTimeline,
  LikingHighlight
} from './PsychologicalTriggers'

// Progressive Disclosure
export { 
  default as ProgressiveDisclosureWrapper,
  ProgressiveText,
  ProgressiveList,
  CognitiveLoadIndicator
} from './ProgressiveDisclosure'

// Advanced Cognitive Psychology Components
export { EmotionalResonanceProvider } from './EmotionalResonance'
export { AttentionHeatmapTracker } from './AttentionHeatmap'

// Core Libraries (re-exported for convenience)
export { useUserJourneyTracker } from '@/lib/user-journey-tracker'
export { useABTest, createHeroSectionTest, createProjectLayoutTest } from '@/lib/ab-test-manager'
export { usePsychologicalTriggers } from '@/lib/psychological-triggers'
export { useProgressiveDisclosure } from '@/lib/progressive-disclosure'

// Types
export type {
  UserSession,
  UserAction,
  UserJourney,
  EngagementMetrics,
  HeatmapData,
  PsychologicalTrigger,
  ABTest,
  ABTestVariant as ABTestVariantType,
  ProgressiveDisclosure,
  ConversionFunnel,
  AnalyticsConfig
} from '@/types/analytics'
