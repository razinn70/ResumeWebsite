'use client'

import { motion } from 'framer-motion'
import { ScrollReveal } from './scroll-transition'

interface TerminalAboutProps {
  className?: string
}

export function About({ className = "" }: TerminalAboutProps) {
  return (
    <section id="about" className={`py-20 bg-gradient-to-b from-gray-900 to-black ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* CRT Monitor with ASCII Portrait */}
            <ScrollReveal>
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                {/* CRT Monitor Frame */}
                <div className="crt-monitor">
                  <div className="terminal-screen flex items-center justify-center">
                    {/* ASCII Art Portrait */}
                    <div className="font-terminal text-terminal-amber text-xs leading-none">
                      <pre className="text-center">
{`    ████████████    
  ██            ██  
██                ██
██      ████      ██
██    ██    ██    ██
██      ████      ██
██                ██
██    ▄▄▄▄▄▄▄▄    ██
██   ████████████ ██
  ██            ██  
    ████████████    `}
                      </pre>
                      <div className="text-center mt-4 text-terminal-green">
                        <div className="terminal-highlight inline-block px-2 py-1">
                          RAJIN_UDDIN.exe
                        </div>
                        <div className="text-terminal-amber/80 mt-2 text-sm">
                          Status: [ONLINE] | Mode: [CREATIVE]
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>

            {/* Terminal Content */}
            <ScrollReveal delay={0.3}>
              <div className="space-y-6">
                {/* Terminal Window */}
                <motion.div 
                  className="bg-terminal-black/50 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-6"
                  whileHover={{ borderColor: 'rgba(255, 176, 0, 0.6)' }}
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="font-terminal text-terminal-amber/80 text-sm ml-4">
                      user@terminal: ~/about
                    </span>
                  </div>
                  
                  <div className="font-terminal text-terminal-amber space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-terminal-green">$</span>
                      <span>cat about.txt</span>
                    </div>
                    
                    <motion.div 
                      className="space-y-4 text-gray-300"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    >
                      <p className="leading-relaxed">
                        <span className="text-terminal-orange">Hi there! I'm </span>
                        <span className="terminal-highlight">Rajin Uddin</span>
                        <span className="text-terminal-orange">, a passionate full-stack developer 
                        who loves crafting digital experiences that matter.</span>
                      </p>
                      
                      <p className="leading-relaxed">
                        I specialize in modern web technologies and have a keen eye for design. 
                        Whether it's building scalable applications, creating smooth user interfaces, 
                        or solving complex problems, I approach each project with creativity and precision.
                      </p>
                      
                      <p className="leading-relaxed">
                        <span className="text-terminal-green">Currently focused on:</span>
                      </p>
                      
                      <ul className="space-y-2 ml-4">
                        <li className="flex items-center space-x-2">
                          <span className="text-terminal-amber">▸</span>
                          <span>Building scalable web applications with React & Next.js</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="text-terminal-amber">▸</span>
                          <span>Exploring modern backend technologies and APIs</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="text-terminal-amber">▸</span>
                          <span>Creating beautiful, accessible user interfaces</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="text-terminal-amber">▸</span>
                          <span>Learning and experimenting with new tech stacks</span>
                        </li>
                      </ul>
                    </motion.div>
                    
                    <div className="mt-6 pt-4 border-t border-terminal-amber/20">
                      <div className="flex items-center space-x-2">
                        <span className="text-terminal-green">$</span>
                        <span className="text-terminal-amber/80">
                          echo "Let's build something amazing together!"
                        </span>
                        <motion.span
                          className="w-2 h-5 bg-terminal-amber ml-2"
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div 
                  className="grid grid-cols-2 gap-4"
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <div className="bg-terminal-black/30 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-4 text-center">
                    <div className="font-terminal text-2xl text-terminal-green font-bold">3+</div>
                    <div className="font-terminal text-terminal-amber/80 text-sm">Years Coding</div>
                  </div>
                  <div className="bg-terminal-black/30 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-4 text-center">
                    <div className="font-terminal text-2xl text-terminal-orange font-bold">15+</div>
                    <div className="font-terminal text-terminal-amber/80 text-sm">Projects Built</div>
                  </div>
                </motion.div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
