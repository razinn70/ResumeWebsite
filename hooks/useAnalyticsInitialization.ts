'use client'

import { useEffect } from 'react'
import { useProgressiveDisclosure } from '@/lib/progressive-disclosure'
import { progressiveContentConfig, abTestConfigs, triggerConfigs } from '@/data/progressive-content'

/**
 * Hook to initialize analytics content configurations
 * This should be called once at the app level to set up all progressive content
 */
export function useAnalyticsInitialization() {
  const disclosure = useProgressiveDisclosure()
  useEffect(() => {
    // Initialize progressive disclosure content using the manager
    Object.values(progressiveContentConfig).forEach(config => {
      // Convert the config to the format expected by the manager
      const progressiveContent = {
        id: config.id,
        section: config.section,
        levels: [
          {
            level: 1,
            content: config.content.basic,
            triggerConditions: {}
          },
          {
            level: 2,
            content: config.content.intermediate || config.content.basic,
            triggerConditions: {
              timeThreshold: config.triggers.timeThreshold,
              scrollThreshold: (config.triggers.scrollThreshold || 0.5) * 100
            }
          },
          {
            level: 3,
            content: config.content.advanced || config.content.intermediate || config.content.basic,
            triggerConditions: {
              timeThreshold: (config.triggers.timeThreshold || 0) * 1.5,
              scrollThreshold: (config.triggers.scrollThreshold || 0.6) * 100,
              interactionCount: config.triggers.interactionCount
            }
          },
          {
            level: 4,
            content: config.content.expert || config.content.advanced || config.content.intermediate || config.content.basic,
            triggerConditions: {
              timeThreshold: (config.triggers.timeThreshold || 0) * 2,
              scrollThreshold: (config.triggers.scrollThreshold || 0.8) * 100,
              interactionCount: (config.triggers.interactionCount || 0) + 2,
              returningVisitor: config.triggers.returningVisitor
            }
          }
        ],
        currentLevel: config.level,
        userPreference: config.userPreference || 'progressive'
      }
      
      disclosure.manager.addProgressiveContent(progressiveContent)
    })
  }, [disclosure.manager])

  // Return configuration objects for use in components
  return {
    progressiveContentConfig,
    abTestConfigs,
    triggerConfigs
  }
}
