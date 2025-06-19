'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Code, Globe } from 'lucide-react'

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingStage, setLoadingStage] = useState(0)
  const [progress, setProgress] = useState(0)

  const loadingStages = [
    { text: 'Initializing system...', icon: Terminal },
    { text: 'Loading 3D components...', icon: Code },
    { text: 'Connecting analytics...', icon: Globe },
    { text: 'Optimizing performance...', icon: Terminal },
    { text: 'Ready!', icon: Code }
  ]

  useEffect(() => {
    // Simulate loading stages
    const stageInterval = setInterval(() => {
      setLoadingStage(prev => {
        if (prev < loadingStages.length - 1) {
          return prev + 1
        } else {
          clearInterval(stageInterval)
          setTimeout(() => setIsLoading(false), 500)
          return prev
        }
      })
    }, 1000)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + Math.random() * 15
        } else {
          clearInterval(progressInterval)
          return 100
        }
      })
    }, 200)

    return () => {
      clearInterval(stageInterval)
      clearInterval(progressInterval)
    }
  }, [])

  const CurrentIcon = loadingStages[loadingStage]?.icon || Terminal

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        >
          <div className="text-center max-w-md px-8">
            {/* Logo/Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    transition: { duration: 2, repeat: Infinity, ease: "linear" }
                  }}
                  className="w-16 h-16 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-4"
                />
                <CurrentIcon className="w-8 h-8 text-green-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </motion.div>

            {/* Loading Text */}
            <motion.h1
              key={loadingStage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-green-400 mb-4 font-mono"
            >
              Portfolio Loading...
            </motion.h1>

            {/* Stage Text */}
            <motion.p
              key={loadingStage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-300 mb-6 font-mono text-sm"
            >
              {loadingStages[loadingStage]?.text}
            </motion.p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3 }}
                className="bg-green-400 h-2 rounded-full"
              />
            </div>

            {/* Progress Text */}
            <p className="text-green-300 text-xs font-mono">
              {Math.round(Math.min(progress, 100))}%
            </p>

            {/* Terminal-style dots */}
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-green-400 text-xl mt-4 font-mono"
            >
              {'> '}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                _
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
