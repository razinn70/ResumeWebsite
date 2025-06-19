'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Smartphone, Monitor, Cpu, X } from 'lucide-react'

export function PerformanceNotice() {
  const [showNotice, setShowNotice] = useState(false)
  const [isLowPerformance, setIsLowPerformance] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check if this is likely a low-performance device
    const checkPerformance = () => {
      const memory = (navigator as any).deviceMemory
      const cores = navigator.hardwareConcurrency
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      const lowMemory = memory && memory < 4
      const lowCores = cores && cores < 4
      
      return lowMemory || lowCores || isMobile
    }

    const isLowPerf = checkPerformance()
    setIsLowPerformance(isLowPerf)
    
    // Show notice if user hasn't dismissed it and it's a low-performance device
    const dismissed = localStorage.getItem('performance-notice-dismissed')
    if (isLowPerf && !dismissed) {
      setShowNotice(true)
    }
  }, [])

  const dismissNotice = () => {
    setShowNotice(false)
    localStorage.setItem('performance-notice-dismissed', 'true')
  }

  if (!showNotice || !isLowPerformance) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="fixed top-4 left-4 right-4 z-50 bg-yellow-900 border border-yellow-700 rounded-lg p-4 shadow-lg"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <Smartphone className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="text-sm font-medium text-yellow-100 mb-1">
              Performance Mode Active
            </h3>
            <p className="text-xs text-yellow-200 mb-2">
              Some 3D features have been disabled for better performance on your device.
            </p>
            <div className="flex items-center gap-4 text-xs text-yellow-300">
              <div className="flex items-center gap-1">
                <Monitor className="w-3 h-3" />
                <span>2D Mode</span>
              </div>
              <div className="flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                <span>Optimized</span>
              </div>
            </div>
          </div>
          <button
            onClick={dismissNotice}
            className="flex-shrink-0 text-yellow-400 hover:text-yellow-300 transition-colors"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
