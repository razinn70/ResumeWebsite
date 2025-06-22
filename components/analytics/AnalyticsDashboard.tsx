'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  Eye, 
  Clock, 
  MousePointer,
  Zap,
  Brain,
  Settings
} from 'lucide-react'
import { useUserJourneyTracker } from '@/lib/user-journey-tracker'
import { useABTest } from '@/lib/ab-test-manager'
import { usePsychologicalTriggers } from '@/lib/psychological-triggers'
import { useProgressiveDisclosure } from '@/lib/progressive-disclosure'

interface AnalyticsDashboardProps {
  isVisible: boolean
  onClose: () => void
  className?: string
}

export function AnalyticsDashboard({ isVisible, onClose, className = '' }: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'journey' | 'ab_tests' | 'triggers' | 'disclosure'>('overview')
  const [isMinimized, setIsMinimized] = useState(false)
  
  const { metrics, journey, session, actions, heatmapData } = useUserJourneyTracker()
  const { activeTriggers, getTriggerMetrics, analyzeTriggerEffectiveness } = usePsychologicalTriggers()
  const { getAllContent, cognitiveLoad, getRecommendations } = useProgressiveDisclosure()

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'journey', label: 'User Journey', icon: Target },
    { id: 'ab_tests', label: 'A/B Tests', icon: TrendingUp },
    { id: 'triggers', label: 'Psychological Triggers', icon: Brain },
    { id: 'disclosure', label: 'Progressive Disclosure', icon: Eye }
  ]

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={`fixed bottom-4 right-4 z-50 ${className}`}
      >
        <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 ${
          isMinimized ? 'w-80' : 'w-96 h-[600px]'
        } transition-all duration-300`}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                User Analytics
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                <Settings className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                ×
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="w-3 h-3" />
                    <span className="hidden sm:block">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-4 h-[500px] overflow-y-auto">
                {activeTab === 'overview' && (
                  <OverviewTab metrics={metrics} journey={journey} session={session} />
                )}
                {activeTab === 'journey' && (
                  <JourneyTab journey={journey} actions={actions} heatmapData={heatmapData} />
                )}
                {activeTab === 'ab_tests' && (
                  <ABTestsTab />
                )}
                {activeTab === 'triggers' && (
                  <TriggersTab 
                    activeTriggers={activeTriggers}
                    triggerMetrics={getTriggerMetrics()}
                    effectiveness={analyzeTriggerEffectiveness()}
                  />
                )}
                {activeTab === 'disclosure' && (
                  <DisclosureTab 
                    content={getAllContent()}
                    cognitiveLoad={cognitiveLoad}
                    recommendations={getRecommendations()}
                  />
                )}
              </div>
            </>
          )}

          {/* Minimized View */}
          {isMinimized && (
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {metrics?.engagementScore.toFixed(0) || '0'}
                  </div>
                  <div className="text-xs text-gray-500">Engagement</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {journey?.currentStage || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">Journey Stage</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Overview Tab Component
function OverviewTab({ metrics, journey, session }: any) {
  if (!metrics || !journey || !session) {
    return <div className="text-center text-gray-500">Loading analytics...</div>
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          icon={Clock}
          label="Time on Site"
          value={formatTime(metrics.timeOnSite)}
          trend={metrics.timeOnSite > 120000 ? 'up' : 'down'}
        />
        <MetricCard
          icon={Eye}
          label="Scroll Depth"
          value={`${metrics.scrollDepth}%`}
          trend={metrics.scrollDepth > 50 ? 'up' : 'down'}
        />
        <MetricCard
          icon={MousePointer}
          label="Interactions"
          value={metrics.interactionRate.toFixed(1)}
          trend={metrics.interactionRate > 5 ? 'up' : 'down'}
        />
        <MetricCard
          icon={Zap}
          label="Engagement"
          value={metrics.engagementScore.toFixed(0)}
          trend={metrics.engagementScore > 50 ? 'up' : 'down'}
        />
      </div>

      {/* Journey Progress */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">User Journey</h4>
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(metrics.conversionFunnelStep / 5) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {journey.currentStage}
          </span>
        </div>
      </div>

      {/* Device Info */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Session Info</h4>
        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <div>Device: {session.device.type}</div>
          <div>Browser: {session.device.browser}</div>
          <div>Screen: {session.device.screenSize.width}×{session.device.screenSize.height}</div>
        </div>
      </div>
    </div>
  )
}

// Journey Tab Component
function JourneyTab({ journey, actions, heatmapData }: any) {
  if (!journey) {
    return <div className="text-center text-gray-500">No journey data available</div>
  }

  return (
    <div className="space-y-4">
      {/* Psychological Profile */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          Psychological Profile
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-blue-700 dark:text-blue-300">Style:</span>
            <span className="ml-1 capitalize">{journey.psychologicalProfile.persuasionStyle}</span>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300">Attention:</span>
            <span className="ml-1 capitalize">{journey.psychologicalProfile.attentionSpan}</span>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300">Tech Level:</span>
            <span className="ml-1 capitalize">{journey.psychologicalProfile.techSavviness}</span>
          </div>
        </div>
      </div>

      {/* Recent Actions */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recent Actions</h4>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {actions.slice(-10).reverse().map((action: any, index: number) => (
            <div key={index} className="text-xs text-gray-600 dark:text-gray-400 flex justify-between">
              <span>{action.type}</span>
              <span>{action.section || 'unknown'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Interaction Heatmap</h4>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {heatmapData.length > 0 ? (
            <div>
              <div>Total interactions: {heatmapData.reduce((sum: number, data: any) => sum + data.interactions.length, 0)}</div>
              <div>Most active element: {heatmapData[0]?.element || 'None'}</div>
            </div>
          ) : (
            <div>No interaction data yet</div>
          )}
        </div>
      </div>
    </div>
  )
}

// A/B Tests Tab Component
function ABTestsTab() {
  const { activeVariant, getResults } = useABTest('hero_section_cta')

  return (
    <div className="space-y-4">
      <div className="text-center text-gray-500">
        <Target className="w-8 h-8 mx-auto mb-2" />
        <div>A/B Test Framework</div>
        <div className="text-xs mt-1">Ready for implementation</div>
      </div>
      
      {activeVariant && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
          <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
            Active Variant
          </h4>
          <div className="text-sm text-green-700 dark:text-green-300">
            {activeVariant.name}
          </div>
        </div>
      )}
      
      <button
        onClick={getResults}
        className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
      >
        Generate Test Results
      </button>
    </div>
  )
}

// Triggers Tab Component
function TriggersTab({ activeTriggers, triggerMetrics, effectiveness }: any) {
  return (
    <div className="space-y-4">
      {/* Active Triggers */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
        <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
          Active Triggers ({activeTriggers.length})
        </h4>
        {activeTriggers.length > 0 ? (
          activeTriggers.map((trigger: any, index: number) => (
            <div key={index} className="text-sm text-purple-700 dark:text-purple-300">
              {trigger.component}
            </div>
          ))
        ) : (
          <div className="text-sm text-purple-700 dark:text-purple-300">
            No active triggers
          </div>
        )}
      </div>

      {/* Trigger Performance */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          Trigger Performance
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {triggerMetrics.map((trigger: any, index: number) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{trigger.name}</span>
              <span className="text-gray-900 dark:text-white">
                {trigger.metrics.conversionRate.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {effectiveness.recommendations.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
          <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
            Recommendations
          </h4>
          <div className="space-y-1">
            {effectiveness.recommendations.map((rec: string, index: number) => (
              <div key={index} className="text-xs text-yellow-700 dark:text-yellow-300">
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Disclosure Tab Component
function DisclosureTab({ content, cognitiveLoad, recommendations }: any) {
  return (
    <div className="space-y-4">
      {/* Cognitive Load */}
      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
        <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">
          Cognitive Load
        </h4>
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-orange-200 dark:bg-orange-700 rounded-full h-2">
            <div 
              className="bg-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${cognitiveLoad}%` }}
            />
          </div>
          <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
            {cognitiveLoad}%
          </span>
        </div>
      </div>

      {/* Content Levels */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          Content Disclosure
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {content.map((item: any, index: number) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400 capitalize">
                {item.section}
              </span>
              <span className="text-gray-900 dark:text-white">
                Level {item.currentLevel}/{item.levels.length}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Optimization Tips
          </h4>
          <div className="space-y-1">
            {recommendations.map((rec: string, index: number) => (
              <div key={index} className="text-xs text-blue-700 dark:text-blue-300">
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Metric Card Component
function MetricCard({ icon: Icon, label, value, trend }: any) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <Icon className="w-4 h-4 text-gray-500" />
        <div className={`w-2 h-2 rounded-full ${
          trend === 'up' ? 'bg-green-500' : 'bg-red-500'
        }`} />
      </div>
      <div className="text-lg font-semibold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="text-xs text-gray-500">
        {label}
      </div>
    </div>
  )
}

export default AnalyticsDashboard
