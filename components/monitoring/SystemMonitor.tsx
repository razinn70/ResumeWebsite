'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Wifi, Battery, Cpu } from 'lucide-react'

interface SystemStatus {
  memory: number | null
  cores: number | null
  connection: string | null
  online: boolean
  webgl: boolean
  performance: 'high' | 'medium' | 'low'
}

export function SystemMonitor() {
  const [status, setStatus] = useState<SystemStatus>({
    memory: null,
    cores: null,
    connection: null,
    online: true,
    webgl: false,
    performance: 'medium'
  })
  const [showDetails, setShowDetails] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkSystemStatus = () => {
      try {
        // Check memory
        const memory = (navigator as any).deviceMemory || null
        
        // Check CPU cores
        const cores = navigator.hardwareConcurrency || null
        
        // Check connection
        const connection = (navigator as any).connection
        const connectionType = connection ? connection.effectiveType : null
        
        // Check online status
        const online = navigator.onLine
        
        // Check WebGL support
        const canvas = document.createElement('canvas')
        const webgl = !!(
          canvas.getContext('webgl') || 
          canvas.getContext('experimental-webgl') ||
          canvas.getContext('webgl2')
        )
        
        // Determine performance level
        let performance: SystemStatus['performance'] = 'medium'
        if (memory && memory >= 8 && cores && cores >= 8) {
          performance = 'high'
        } else if (memory && memory < 4 || cores && cores < 4) {
          performance = 'low'
        }
        
        setStatus({
          memory,
          cores,
          connection: connectionType,
          online,
          webgl,
          performance
        })
        
        // Check for potential issues
        const newErrors: string[] = []
        if (!webgl) newErrors.push('WebGL not supported')
        if (!online) newErrors.push('Offline mode')
        if (memory && memory < 2) newErrors.push('Low memory')
        if (connectionType === 'slow-2g' || connectionType === '2g') {
          newErrors.push('Slow connection')
        }
        
        setErrors(newErrors)
        
      } catch (error) {
        console.warn('System monitoring error:', error)
      }
    }

    checkSystemStatus()
    
    // Listen for online/offline events
    const handleOnline = () => setStatus(prev => ({ ...prev, online: true }))
    const handleOffline = () => setStatus(prev => ({ ...prev, online: false }))
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Only show in development mode or if there are errors
  const shouldShow = process.env.NODE_ENV === 'development' || errors.length > 0

  if (!shouldShow) return null

  const getPerformanceColor = () => {
    switch (status.performance) {
      case 'high': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setShowDetails(!showDetails)}
        className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-2 hover:bg-gray-800 transition-colors"
      >
        <Activity className={`w-5 h-5 ${getPerformanceColor()}`} />
        {errors.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {errors.length}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute top-12 right-0 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-4 min-w-[200px] text-white text-sm"
          >
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              System Status
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Cpu className="w-3 h-3" />
                  Performance
                </span>
                <span className={getPerformanceColor()}>
                  {status.performance}
                </span>
              </div>
              
              {status.memory && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Battery className="w-3 h-3" />
                    Memory
                  </span>
                  <span>{status.memory}GB</span>
                </div>
              )}
              
              {status.cores && (
                <div className="flex items-center justify-between">
                  <span>CPU Cores</span>
                  <span>{status.cores}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Wifi className="w-3 h-3" />
                  Connection
                </span>
                <span className={status.online ? 'text-green-400' : 'text-red-400'}>
                  {status.online ? (status.connection || 'Online') : 'Offline'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>WebGL</span>
                <span className={status.webgl ? 'text-green-400' : 'text-red-400'}>
                  {status.webgl ? 'Supported' : 'Not Available'}
                </span>
              </div>
            </div>
            
            {errors.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <h4 className="text-red-400 font-medium mb-2">Issues:</h4>
                <ul className="text-xs text-gray-300 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
