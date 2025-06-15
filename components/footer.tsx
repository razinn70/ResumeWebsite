'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const bootMessages = [
  'Initializing...',
  'Loading portfolio data...',
  'Connecting to social networks...',
  'Booting up creativity engine...',
  'Ready to explore!',
]

export function Footer() {
  const [messageIndex, setMessageIndex] = useState(0)
  const [isBooting, setIsBooting] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev < bootMessages.length - 1) {
          return prev + 1
        } else {
          setIsBooting(false)
          clearInterval(interval)
          return prev
        }
      })
    }, 800)

    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="inline-block">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                  {isBooting ? bootMessages[messageIndex] : 'System ready'}
                </span>
              </div>
              
              {/* Retro computer ASCII art */}
              <div className="font-mono text-xs text-gray-500 dark:text-gray-400 mb-6">
                <pre className="leading-tight">
{`    ╭─────────────────╮
    │  ◉ ○ ○  [ █ ]  │
    │                 │
    │  > Building the  │
    │    future, one   │
    │    commit at a   │
    │    time...       │
    │                 │
    ╰─────────────────╯
         ║ ║ ║ ║
         ╚═╧═╧═╧═╝`}
                </pre>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Built with Next.js, TypeScript, and ❤️ by Alex Johnson
            </p>
            
            <p className="text-xs text-gray-500 dark:text-gray-500">
              © {new Date().getFullYear()} Alex Johnson. All rights reserved.
            </p>
            
            <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
              <p>
                Acknowledgment: This site was built on the traditional territory of indigenous peoples.
              </p>
              <p>
                Inspired by the open-source community and powered by curiosity.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-center items-center space-x-6 text-xs text-gray-400 dark:text-gray-500">
              <span>Made with sustainability in mind</span>
              <span>•</span>
              <span>Optimized for performance</span>
              <span>•</span>
              <span>Accessible to all</span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
