'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Monitor, Smartphone, Settings } from 'lucide-react'

export function RetroThemeToggle() {
  const [theme, setTheme] = useState<'retro' | 'modern'>('retro')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('portfolio-retro-theme') as 'retro' | 'modern'
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    }
  }, [])

  const applyTheme = (newTheme: 'retro' | 'modern') => {
    const root = document.documentElement
    
    if (newTheme === 'retro') {
      root.style.setProperty('--font-primary', 'var(--font-retro)')
      root.style.setProperty('--bg-primary', 'var(--terminal-black)')
      root.style.setProperty('--text-primary', 'var(--terminal-amber)')
      root.classList.add('retro-mode')
      root.classList.remove('modern-mode')
    } else {
      root.style.setProperty('--font-primary', 'var(--font-sans)')
      root.style.setProperty('--bg-primary', '#ffffff')
      root.style.setProperty('--text-primary', '#1f2937')
      root.classList.add('modern-mode')
      root.classList.remove('retro-mode')
    }
  }

  const toggleTheme = (newTheme: 'retro' | 'modern') => {
    setTheme(newTheme)
    applyTheme(newTheme)
    localStorage.setItem('portfolio-retro-theme', newTheme)
    setIsOpen(false)
  }

  return (
    <div className="fixed top-6 right-6 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-terminal-black/80 backdrop-blur-sm border border-terminal-amber/30 rounded-lg text-terminal-amber hover:border-terminal-amber/60 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full right-0 mt-2 bg-terminal-black/90 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-4 min-w-[200px]"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="font-retro text-terminal-amber text-sm mb-3">
              DISPLAY MODE:
            </div>
            
            <div className="space-y-2">
              <motion.button
                onClick={() => toggleTheme('retro')}
                className={`
                  w-full flex items-center space-x-3 p-3 rounded-lg transition-all
                  ${theme === 'retro' 
                    ? 'bg-terminal-amber/20 border border-terminal-amber/50' 
                    : 'bg-terminal-amber/5 border border-terminal-amber/20 hover:bg-terminal-amber/10'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Monitor className="w-4 h-4 text-terminal-orange" />
                <div className="text-left">
                  <div className="font-retro text-terminal-amber text-sm">
                    RETRO CRT
                  </div>
                  <div className="font-retro text-terminal-amber/60 text-xs">
                    Authentic terminal
                  </div>
                </div>
                {theme === 'retro' && (
                  <div className="w-2 h-2 bg-terminal-green rounded-full ml-auto"></div>
                )}
              </motion.button>

              <motion.button
                onClick={() => toggleTheme('modern')}
                className={`
                  w-full flex items-center space-x-3 p-3 rounded-lg transition-all
                  ${theme === 'modern' 
                    ? 'bg-terminal-amber/20 border border-terminal-amber/50' 
                    : 'bg-terminal-amber/5 border border-terminal-amber/20 hover:bg-terminal-amber/10'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Smartphone className="w-4 h-4 text-terminal-blue" />
                <div className="text-left">
                  <div className="font-retro text-terminal-amber text-sm">
                    MODERN UI
                  </div>
                  <div className="font-retro text-terminal-amber/60 text-xs">
                    Clean & minimal
                  </div>
                </div>
                {theme === 'modern' && (
                  <div className="w-2 h-2 bg-terminal-green rounded-full ml-auto"></div>
                )}
              </motion.button>
            </div>

            <div className="mt-3 pt-3 border-t border-terminal-amber/20">
              <div className="font-retro text-terminal-amber/60 text-xs">
                EASTER EGG: Try typing "konami" in terminal!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RetroThemeToggle
