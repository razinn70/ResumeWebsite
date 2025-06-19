'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Eye, EyeOff, Settings, Info } from 'lucide-react'
import { useProgressiveDisclosure } from '@/lib/progressive-disclosure'

interface ProgressiveDisclosureWrapperProps {
  contentId: string
  section: string
  children?: React.ReactNode
  className?: string
  showControls?: boolean
  title?: string
}

export function ProgressiveDisclosureWrapper({
  contentId,
  section,
  children,
  className = '',
  showControls = true,
  title
}: ProgressiveDisclosureWrapperProps) {
  const { content, currentContent, setUserPreference } = useProgressiveDisclosure(contentId)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)

  if (!content) return <>{children}</>

  const canExpand = content.currentLevel < content.levels.length
  const canCollapse = content.currentLevel > 1

  return (
    <div className={`progressive-disclosure-wrapper ${className}`}>
      {/* Control Bar */}
      {showControls && (
        <div className="flex items-center justify-between mb-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2">
            {title && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {title}
              </span>
            )}
            <span className="text-xs text-gray-500">
              Level {content.currentLevel}/{content.levels.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Expand/Collapse Controls */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                disabled={!canExpand}
                className={`p-1 rounded ${
                  canExpand 
                    ? 'text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                title={canExpand ? 'Show more content' : 'All content visible'}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="p-1 rounded text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Disclosure preferences"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Panel */}
      <AnimatePresence>
        {showPreferences && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Content Display Preference
            </h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`preference-${contentId}`}
                  value="progressive"
                  checked={content.userPreference === 'progressive'}
                  onChange={() => setUserPreference('progressive')}
                  className="text-blue-600"
                />
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  Progressive (Reveal content gradually)
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`preference-${contentId}`}
                  value="show_all"
                  checked={content.userPreference === 'show_all'}
                  onChange={() => setUserPreference('show_all')}
                  className="text-blue-600"
                />
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  Show All (Display all content immediately)
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`preference-${contentId}`}
                  value="minimal"
                  checked={content.userPreference === 'minimal'}
                  onChange={() => setUserPreference('minimal')}
                  className="text-blue-600"
                />
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  Minimal (Show only essential information)
                </span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Display */}
      <div className="progressive-content">
        {content.userPreference === 'show_all' ? (
          // Show all levels when preference is set to show_all
          <div className="space-y-3">
            {content.levels.map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${index === 0 ? '' : 'pl-4 border-l-2 border-blue-200 dark:border-blue-800'}`}
              >
                {level.content}
              </motion.div>
            ))}
          </div>
        ) : content.userPreference === 'minimal' ? (
          // Show only the first level for minimal preference
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {content.levels[0]?.content}
          </motion.div>
        ) : (
          // Progressive disclosure
          <div className="space-y-3">
            {content.levels.slice(0, content.currentLevel).map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${
                  index === 0 ? '' : 'pl-4 border-l-2 border-blue-200 dark:border-blue-800'
                } ${
                  index === content.currentLevel - 1 ? 'bg-blue-50 dark:bg-blue-900/10 p-2 rounded' : ''
                }`}
              >
                {level.content}
                {index === content.currentLevel - 1 && index < content.levels.length - 1 && (
                  <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 flex items-center">
                    <Info className="w-3 h-3 mr-1" />
                    More content will appear as you explore
                  </div>
                )}
              </motion.div>
            ))}
            
            {/* Expanded content (manual expansion) */}
            <AnimatePresence>
              {isExpanded && content.levels.length > content.currentLevel && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  {content.levels.slice(content.currentLevel).map((level, index) => (
                    <motion.div
                      key={content.currentLevel + index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="pl-4 border-l-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-2 rounded"
                    >
                      <div className="text-xs text-gray-500 mb-1">
                        Preview Level {content.currentLevel + index + 1}
                      </div>
                      {level.content}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        
        {/* Fallback children if no progressive content is defined */}
        {!currentContent && children}
      </div>
    </div>
  )
}

// Specialized Progressive Disclosure Components
interface ProgressiveTextProps {
  basic: string
  intermediate?: string
  advanced?: string
  expert?: string
  className?: string
}

export function ProgressiveText({ 
  basic, 
  intermediate, 
  advanced, 
  expert, 
  className = '' 
}: ProgressiveTextProps) {
  const contentId = `progressive-text-${Math.random().toString(36).substr(2, 9)}`
  const { currentContent } = useProgressiveDisclosure(contentId)

  // This would be set up through the manager, but for demo purposes:
  const levels = [basic, intermediate, advanced, expert].filter(Boolean)
  
  return (
    <div className={className}>
      {levels.map((text, index) => (
        <motion.p
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.5 }}
          className={index > 0 ? 'mt-2 text-gray-600 dark:text-gray-400' : ''}
        >
          {text}
        </motion.p>
      ))}
    </div>
  )
}

interface ProgressiveListProps {
  items: {
    basic: string[]
    intermediate?: string[]
    advanced?: string[]
    expert?: string[]
  }
  className?: string
}

export function ProgressiveList({ items, className = '' }: ProgressiveListProps) {
  const [currentLevel, setCurrentLevel] = useState<'basic' | 'intermediate' | 'advanced' | 'expert'>('basic')
  const [visibleItems, setVisibleItems] = useState(items.basic || [])

  useEffect(() => {
    const allItems = [
      ...(items.basic || []),
      ...(currentLevel !== 'basic' ? items.intermediate || [] : []),
      ...(currentLevel === 'advanced' || currentLevel === 'expert' ? items.advanced || [] : []),
      ...(currentLevel === 'expert' ? items.expert || [] : [])
    ]
    setVisibleItems(allItems)
  }, [currentLevel, items])

  return (
    <div className={className}>
      <ul className="space-y-2">
        <AnimatePresence>
          {visibleItems.map((item, index) => (
            <motion.li
              key={`${item}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-2"
            >
              <span className="text-blue-500 mt-1">•</span>
              <span>{item}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      
      {/* Level controls */}
      <div className="mt-4 flex space-x-2">
        {(['basic', 'intermediate', 'advanced', 'expert'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setCurrentLevel(level)}
            disabled={!items[level]?.length}
            className={`px-2 py-1 text-xs rounded ${
              currentLevel === level
                ? 'bg-blue-600 text-white'
                : items[level]?.length
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}

// Cognitive Load Indicator
interface CognitiveLoadIndicatorProps {
  load: number
  className?: string
}

export function CognitiveLoadIndicator({ load, className = '' }: CognitiveLoadIndicatorProps) {
  const getLoadColor = (load: number) => {
    if (load < 40) return 'bg-green-500'
    if (load < 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getLoadLabel = (load: number) => {
    if (load < 40) return 'Optimal'
    if (load < 70) return 'Moderate'
    return 'High'
  }

  return (
    <div className={`cognitive-load-indicator ${className}`}>
      <div className="flex items-center space-x-2 text-sm">
        <Brain className="w-4 h-4 text-gray-500" />
        <span className="text-gray-600 dark:text-gray-400">Cognitive Load:</span>
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 min-w-[60px]">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getLoadColor(load)}`}
            style={{ width: `${Math.min(100, load)}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${
          load < 40 ? 'text-green-600' : load < 70 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {getLoadLabel(load)} ({load}%)
        </span>
      </div>
    </div>
  )
}

// Export all components
export default ProgressiveDisclosureWrapper
