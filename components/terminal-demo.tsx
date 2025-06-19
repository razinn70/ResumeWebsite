/**
 * @fileoverview Terminal Demo Component
 * Showcases the ultra-authentic terminal interface
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { UltraTerminal } from './terminal'

interface TerminalDemoProps {
  className?: string
}

export function TerminalDemo({ className = '' }: TerminalDemoProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [theme, setTheme] = useState<'amber' | 'green' | 'blue'>('amber')

  const themeConfig = {
    amber: {
      background: '#0A0A0A',
      foreground: '#FFB000',
      cursor: '#FFB000'
    },
    green: {
      background: '#001100',
      foreground: '#00FF41',
      cursor: '#00FF41'
    },
    blue: {
      background: '#000B1A',
      foreground: '#4FC3F7',
      cursor: '#4FC3F7'
    }
  }

  return (
    <section className={`terminal-demo ${className}`}>
      {/* Demo Header */}
      <motion.div 
        className="demo-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-terminal-amber mb-2">
              Ultra-Authentic Terminal Interface
            </h2>
            <p className="text-terminal-amber/80">
              Complete UNIX emulation with VT100/VT220 escape sequences, file system simulation, and advanced features
            </p>
          </div>
          
          {/* Theme Selector */}
          <div className="flex items-center space-x-4">
            <span className="text-terminal-amber/60 text-sm">Theme:</span>
            {(['amber', 'green', 'blue'] as const).map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => setTheme(themeOption)}
                className={`
                  px-3 py-1 rounded-md text-xs font-mono uppercase transition-all
                  ${theme === themeOption 
                    ? 'bg-terminal-amber/20 text-terminal-amber border border-terminal-amber/50' 
                    : 'bg-terminal-amber/5 text-terminal-amber/60 border border-terminal-amber/20 hover:bg-terminal-amber/10'
                  }
                `}
              >
                {themeOption}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Terminal Container */}
      <motion.div
        className={`
          terminal-container relative
          ${isFullscreen ? 'fixed inset-4 z-50' : 'h-96'}
        `}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* CRT Monitor Frame */}
        <div className="crt-monitor-frame">
          {/* Monitor Chrome */}
          <div className="monitor-chrome">
            <div className="monitor-bezel">
              {/* Traffic Light Buttons */}
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1"></div>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-terminal-amber/60 hover:text-terminal-amber text-xs"
                >
                  {isFullscreen ? 'EXIT FULLSCREEN' : 'FULLSCREEN'}
                </button>
              </div>

              {/* Terminal Title Bar */}
              <div className="terminal-title-bar">
                <span className="font-mono text-xs text-terminal-amber/80">
                  rajin@dev-machine: ~
                </span>
              </div>
            </div>

            {/* Terminal Interface */}
            <div className="terminal-screen">
              <UltraTerminal
                config={{
                  theme: {
                    name: theme,
                    background: themeConfig[theme].background,
                    foreground: themeConfig[theme].foreground,
                    cursor: themeConfig[theme].cursor,
                    selection: `${themeConfig[theme].foreground}33`,
                    black: '#000000',
                    red: '#FF6B6B',
                    green: '#00FF41',
                    yellow: '#FFD700',
                    blue: '#4FC3F7',
                    magenta: '#FF69B4',
                    cyan: '#00FFFF',
                    white: '#FFFFFF',
                    brightBlack: '#666666',
                    brightRed: '#FF8A8A',
                    brightGreen: '#69FF69',
                    brightYellow: '#FFFF69',
                    brightBlue: '#69B7FF',
                    brightMagenta: '#FF8AFF',
                    brightCyan: '#69FFFF',
                    brightWhite: '#FFFFFF'
                  }
                }}
                onCommand={(command, result) => {
                  console.log('Command executed:', command, result)
                }}
              />
            </div>
          </div>

          {/* Monitor Stand */}
          <div className="monitor-stand"></div>
        </div>

        {/* Feature Highlights */}
        {!isFullscreen && (
          <motion.div
            className="feature-highlights mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="feature-card">
              <h3 className="text-terminal-amber font-mono mb-2">Real Commands</h3>
              <p className="text-terminal-amber/70 text-sm">
                Full UNIX command set: ls, cd, cat, grep, git, npm, and more with authentic behavior
              </p>
            </div>
            
            <div className="feature-card">
              <h3 className="text-terminal-amber font-mono mb-2">File System</h3>
              <p className="text-terminal-amber/70 text-sm">
                Complete directory structure simulation with real file contents and permissions
              </p>
            </div>
            
            <div className="feature-card">
              <h3 className="text-terminal-amber font-mono mb-2">VT100 Support</h3>
              <p className="text-terminal-amber/70 text-sm">
                Authentic terminal escape sequences for colors, cursor control, and formatting
              </p>
            </div>
          </motion.div>
        )}

        {/* Command Examples */}
        {!isFullscreen && (
          <motion.div
            className="command-examples mt-6 p-4 bg-terminal-black/30 border border-terminal-amber/20 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-terminal-amber font-mono mb-3">Try these commands:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-mono">
              <div><span className="text-terminal-green">$</span> <span className="text-terminal-amber/80">ls -la</span></div>
              <div><span className="text-terminal-green">$</span> <span className="text-terminal-amber/80">cd projects</span></div>
              <div><span className="text-terminal-green">$</span> <span className="text-terminal-amber/80">cat README.md</span></div>
              <div><span className="text-terminal-green">$</span> <span className="text-terminal-amber/80">git status</span></div>
              <div><span className="text-terminal-green">$</span> <span className="text-terminal-amber/80">skills frontend</span></div>
              <div><span className="text-terminal-green">$</span> <span className="text-terminal-amber/80">portfolio</span></div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}

export default TerminalDemo
