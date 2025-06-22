'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Brain, Zap, Shield, Star, Target } from 'lucide-react'
import { CognitivePsychologyEngine, EmotionalState, UserPersona } from '@/lib/cognitive-psychology'
import { useAnalytics } from '@/components/analytics'

interface EmotionalResonanceProps {
  section: string
  targetEmotion: 'curiosity' | 'admiration' | 'trust' | 'excitement' | 'confidence'
  children: React.ReactNode
  className?: string
}

interface EmotionalTrigger {
  id: string
  emotion: string
  trigger: 'story' | 'achievement' | 'vulnerability' | 'expertise' | 'vision'
  intensity: number
  timing: number
}

export function EmotionalResonanceProvider({ 
  section, 
  children, 
  className = '' 
}: EmotionalResonanceProps) {
  const analytics = useAnalytics()
  const [cognitiveEngine] = useState(() => new CognitivePsychologyEngine())
  const [emotionalState, setEmotionalState] = useState<EmotionalState>()
  const [userPersona, setUserPersona] = useState<UserPersona>()
  const [resonanceScore, setResonanceScore] = useState(0.5)
  const [activeEmotionalTriggers, setActiveEmotionalTriggers] = useState<EmotionalTrigger[]>([])

  // Emotional journey progression for different sections
  const emotionalJourneyMap: { [key: string]: string[] } = {
    'hero': ['curiosity', 'intrigue', 'interest'],
    'about': ['curiosity', 'understanding', 'connection', 'trust'],
    'projects': ['admiration', 'respect', 'desire', 'collaboration'],
    'contact': ['trust', 'confidence', 'commitment', 'action']
  }

  // Analyze user behavior and adjust emotional targeting
  const analyzeEmotionalResponse = useCallback(() => {
    if (!analytics?.session) return

    const userActions = analytics.session.actions || []
    const sectionActions = userActions.filter((action: any) => action.section === section)
    
    // Analyze behavior patterns
    const persona = cognitiveEngine.analyzeUserBehavior(sectionActions)
    const emotional = cognitiveEngine.analyzeEmotionalState(sectionActions, {})
    
    setUserPersona(persona)
    setEmotionalState(emotional)
    setResonanceScore(emotional.resonanceScore)

    // Trigger appropriate emotional responses based on analysis
    triggerEmotionalSequence(emotional, persona)
  }, [analytics?.session, section, cognitiveEngine])

  // Generate contextual emotional triggers
  const triggerEmotionalSequence = useCallback((emotional: EmotionalState, persona: UserPersona) => {
    const journey = emotionalJourneyMap[section] || ['curiosity']
    const triggers: EmotionalTrigger[] = []

    journey.forEach((emotion, index) => {
      const trigger: EmotionalTrigger = {
        id: `${section}-${emotion}-${index}`,
        emotion,
        trigger: getOptimalTriggerType(emotion, persona),
        intensity: calculateTriggerIntensity(emotional, persona, emotion),
        timing: index * 2000 + 1000 // Stagger triggers
      }
      triggers.push(trigger)
    })

    setActiveEmotionalTriggers(triggers)
  }, [section])

  // Determine optimal trigger type based on user persona and target emotion
  const getOptimalTriggerType = useCallback((emotion: string, persona: UserPersona): EmotionalTrigger['trigger'] => {
    if (persona.type === 'developer') {
      if (emotion === 'trust') return 'expertise'
      if (emotion === 'admiration') return 'achievement'
      return 'story'
    } else if (persona.type === 'recruiter') {
      if (emotion === 'confidence') return 'achievement'
      if (emotion === 'trust') return 'expertise'
      return 'story'
    } else if (persona.type === 'client') {
      if (emotion === 'trust') return 'vulnerability'
      if (emotion === 'admiration') return 'vision'
      return 'story'
    }
    return 'story'
  }, [])

  // Calculate trigger intensity based on user state
  const calculateTriggerIntensity = useCallback((
    emotional: EmotionalState, 
    persona: UserPersona, 
    targetEmotion: string
  ): number => {
    let baseIntensity = 0.6

    // Adjust based on current emotional state
    if (emotional.arousal < 0.3) baseIntensity += 0.2 // Need more activation
    if (emotional.valence < 0) baseIntensity += 0.3 // Need positive boost
    
    // Adjust based on persona
    if (persona.type === 'developer' && targetEmotion === 'admiration') baseIntensity += 0.2
    if (persona.type === 'client' && targetEmotion === 'trust') baseIntensity += 0.3
    
    return Math.min(1, baseIntensity)
  }, [])

  // Visual adaptations based on emotional state
  const getEmotionalVisualAdaptations = useCallback(() => {
    if (!emotionalState) return {}

    const adaptations = cognitiveEngine.generateContentAdaptations()
    
    return {
      colorTemperature: adaptations.colorTemperature,
      animationSpeed: adaptations.animationSpeed,
      visualIntensity: Math.max(0.3, emotionalState.arousal),
      contrast: emotionalState.dominance > 0.6 ? 'high' : 'normal',
      saturation: emotionalState.valence > 0.3 ? 'enhanced' : 'subdued'
    }
  }, [emotionalState, cognitiveEngine])

  useEffect(() => {
    analyzeEmotionalResponse()
    
    // Set up periodic analysis
    const interval = setInterval(analyzeEmotionalResponse, 5000)
    return () => clearInterval(interval)
  }, [analyzeEmotionalResponse])

  const visualAdaptations = getEmotionalVisualAdaptations()

  return (
    <motion.div
      className={`emotional-resonance-container ${className}`}
      style={{
        filter: `
          hue-rotate(${visualAdaptations.colorTemperature === 'warm' ? '10deg' : 
                     visualAdaptations.colorTemperature === 'cool' ? '-10deg' : '0deg'})
          contrast(${visualAdaptations.contrast === 'high' ? 1.1 : 1})
          saturate(${visualAdaptations.saturation === 'enhanced' ? 1.2 : 
                    visualAdaptations.saturation === 'subdued' ? 0.8 : 1})
        `
      }}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        transition: { 
          duration: 1 / (visualAdaptations.animationSpeed || 1)
        }
      }}
    >      {/* Emotional State Indicator (Development Mode) */}
      {process.env.NODE_ENV === 'development' && emotionalState && (
        <EmotionalStateIndicator 
          emotional={emotionalState}
          {...(userPersona && { persona: userPersona })}
          resonanceScore={resonanceScore}
          section={section}
        />
      )}

      {/* Emotional Triggers */}
      <AnimatePresence>
        {activeEmotionalTriggers.map((trigger) => (
          <EmotionalTriggerComponent
            key={trigger.id}
            trigger={trigger}
            delay={trigger.timing}
            intensity={trigger.intensity}
          />
        ))}
      </AnimatePresence>

      {/* Enhanced Content */}
      <motion.div
        animate={{
          scale: 1 + (emotionalState?.arousal || 0) * 0.02,
          transition: {
            duration: 2,
            ease: "easeInOut"
          }
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// Emotional State Development Indicator
function EmotionalStateIndicator({ 
  emotional, 
  persona, 
  resonanceScore, 
  section 
}: {
  emotional: EmotionalState
  persona?: UserPersona
  resonanceScore: number
  section: string
}) {
  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'curiosity': return <Target className="w-4 h-4" />
      case 'admiration': return <Star className="w-4 h-4" />
      case 'trust': return <Shield className="w-4 h-4" />
      case 'excitement': return <Zap className="w-4 h-4" />
      default: return <Heart className="w-4 h-4" />
    }
  }

  const getValenceColor = (valence: number) => {
    if (valence > 0.3) return 'text-green-500'
    if (valence < -0.3) return 'text-red-500'
    return 'text-yellow-500'
  }

  return (
    <motion.div
      className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg z-50 max-w-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center space-x-2 mb-2">
        <Brain className="w-5 h-5 text-blue-400" />
        <span className="text-sm font-medium">Emotional State - {section}</span>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center space-x-2">
          {getEmotionIcon(emotional.primaryEmotion)}
          <span className={getValenceColor(emotional.valence)}>
            {emotional.primaryEmotion} (v: {emotional.valence.toFixed(2)})
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>Arousal: {emotional.arousal.toFixed(2)}</div>
          <div>Control: {emotional.dominance.toFixed(2)}</div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span>Resonance:</span>
          <div className="flex-1 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${resonanceScore * 100}%` }}
            />
          </div>
          <span>{(resonanceScore * 100).toFixed(0)}%</span>
        </div>
        
        {persona && (
          <div className="text-gray-300">
            User: {persona.type} ({(persona.confidence * 100).toFixed(0)}%)
          </div>
        )}
        
        <div className="text-gray-400">
          Journey: {emotional.emotionalJourney.slice(-3).join(' → ')}
        </div>
      </div>
    </motion.div>
  )
}

// Individual Emotional Trigger Component
function EmotionalTriggerComponent({ 
  trigger, 
  delay, 
  intensity 
}: {
  trigger: EmotionalTrigger
  delay: number
  intensity: number
}) {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(true)
      
      // Auto-deactivate after duration based on intensity
      const duration = intensity * 3000 + 2000
      setTimeout(() => setIsActive(false), duration)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay, intensity])

  const getTriggerContent = () => {
    switch (trigger.trigger) {
      case 'story':
        return {
          message: "Every project tells a story of problem-solving and innovation",
          icon: <Heart className="w-4 h-4" />,
          color: 'text-rose-400'
        }
      case 'achievement':
        return {
          message: "Proven track record of delivering exceptional results",
          icon: <Star className="w-4 h-4" />,
          color: 'text-yellow-400'
        }
      case 'vulnerability':
        return {
          message: "Honest about challenges and committed to continuous growth",
          icon: <Shield className="w-4 h-4" />,
          color: 'text-blue-400'
        }
      case 'expertise':
        return {
          message: "Deep technical knowledge backed by real-world experience",
          icon: <Brain className="w-4 h-4" />,
          color: 'text-purple-400'
        }
      case 'vision':
        return {
          message: "Building technology that makes a meaningful difference",
          icon: <Target className="w-4 h-4" />,
          color: 'text-green-400'
        }
    }
  }

  const content = getTriggerContent()

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-6 py-3 rounded-full z-40 max-w-md text-center"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ 
            opacity: intensity,
            scale: 1,
            y: 0,
            transition: {
              duration: 0.5,
              ease: "easeOut"
            }
          }}
          exit={{ 
            opacity: 0,
            scale: 0.8,
            y: -20,
            transition: {
              duration: 0.3
            }
          }}
        >
          <div className="flex items-center space-x-2">
            <span className={content.color}>{content.icon}</span>
            <span className="text-sm">{content.message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
