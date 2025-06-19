/**
 * @fileoverview Terminal Integration Example
 * Shows how to integrate the ultra-authentic terminal into your existing portfolio
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { UltraTerminal } from './terminal'
import { ScrollReveal } from './scroll-transition'

export function TerminalSection() {
  return (
    <section id="terminal" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <ScrollReveal>
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-terminal-amber mb-4 font-retro">
                INTERACTIVE TERMINAL
              </h2>
              <p className="text-terminal-amber/80 text-lg max-w-2xl mx-auto">
                Experience an authentic UNIX terminal with real commands, file system simulation, 
                and VT100 escape sequences. Try navigating my projects and skills!
              </p>
            </motion.div>
          </ScrollReveal>

          {/* Terminal Interface */}
          <ScrollReveal delay={0.2}>
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* CRT Monitor Effect */}
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl">
                {/* Monitor Bezel */}
                <div className="relative bg-black p-6 rounded-lg overflow-hidden border-2 border-gray-700">
                  
                  {/* Monitor Controls */}
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full opacity-50"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-50"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>

                  {/* Terminal Component */}
                  <div className="h-96">
                    <UltraTerminal
                      initialDirectory="/home/rajin"
                      config={{
                        fontSize: 14,
                        cursorBlink: true,
                        theme: {
                          name: 'retro-amber',
                          background: '#0A0A0A',
                          foreground: '#FFB000',
                          cursor: '#FFB000',
                          selection: 'rgba(255, 176, 0, 0.3)',
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
                        // Analytics or logging
                        console.log('Terminal command:', command, result)
                      }}
                    />
                  </div>
                </div>

                {/* Monitor Stand */}
                <div className="w-20 h-6 bg-gradient-to-b from-gray-700 to-gray-800 mx-auto mt-4 rounded-b-lg"></div>
                <div className="w-32 h-4 bg-gradient-to-b from-gray-800 to-gray-900 mx-auto mt-2 rounded-full"></div>
              </div>

              {/* Ambient Lighting Effect */}
              <div className="absolute inset-0 bg-terminal-amber/5 rounded-2xl blur-3xl -z-10"></div>
            </motion.div>
          </ScrollReveal>

          {/* Terminal Features */}
          <ScrollReveal delay={0.4}>
            <motion.div 
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {[
                {
                  title: "Real Commands",
                  description: "Over 30 authentic UNIX commands with proper flags and behavior",
                  icon: "💻",
                  commands: ["ls -la", "cd projects", "cat README.md"]
                },
                {
                  title: "File System",
                  description: "Complete directory structure with actual project files and code",
                  icon: "📁",
                  commands: ["find . -name '*.tsx'", "grep -r 'function'", "tree"]
                },
                {
                  title: "Advanced Features",
                  description: "Tab completion, command history, pipes, and VT100 escape sequences",
                  icon: "⚡",
                  commands: ["history", "echo $PATH", "ps aux"]
                }
              ].map((feature) => (
                <motion.div
                  key={feature.title}
                  className="bg-terminal-black/40 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-6"
                  whileHover={{ 
                    borderColor: 'rgba(255, 176, 0, 0.6)',
                    boxShadow: '0 0 30px rgba(255, 176, 0, 0.2)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-terminal-amber font-retro text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-terminal-amber/70 mb-4 text-sm">
                    {feature.description}
                  </p>
                  <div className="space-y-1">
                    {feature.commands.map((cmd, cmdIndex) => (
                      <div key={cmdIndex} className="font-mono text-xs">
                        <span className="text-terminal-green">$ </span>
                        <span className="text-terminal-amber/80">{cmd}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </ScrollReveal>

          {/* Quick Start Guide */}
          <ScrollReveal delay={0.6}>
            <motion.div 
              className="mt-12 bg-terminal-black/30 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-terminal-amber font-retro text-lg mb-4">
                🚀 Quick Start Guide
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="text-terminal-orange font-mono mb-2">Navigation:</h4>
                  <ul className="space-y-1 font-mono text-terminal-amber/80">
                    <li>• <code>ls</code> - List files and directories</li>
                    <li>• <code>cd [dir]</code> - Change directory</li>
                    <li>• <code>pwd</code> - Show current directory</li>
                    <li>• <code>cd ~</code> - Go to home directory</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-terminal-orange font-mono mb-2">Portfolio:</h4>
                  <ul className="space-y-1 font-mono text-terminal-amber/80">
                    <li>• <code>portfolio</code> - Main portfolio menu</li>
                    <li>• <code>skills</code> - View technical skills</li>
                    <li>• <code>projects</code> - List all projects</li>
                    <li>• <code>contact</code> - Contact information</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-3 bg-terminal-amber/5 border border-terminal-amber/20 rounded">
                <p className="text-terminal-amber/70 text-xs">
                  💡 <strong>Pro tip:</strong> Use Tab for auto-completion and ↑/↓ arrow keys for command history!
                </p>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

export default TerminalSection
