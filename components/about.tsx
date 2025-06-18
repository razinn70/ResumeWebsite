'use client'

import { motion } from 'framer-motion'
import { ScrollReveal } from './scroll-transition'

interface TerminalAboutProps {
  className?: string
}

export function About({ className = "" }: TerminalAboutProps) {
  const aboutData = {
    name: "Rajin Uddin",
    title: "Full-Stack Developer & Digital Designer",
    bio: [
      "Hi there! I'm a passionate developer who loves creating beautiful",
      "and functional digital experiences. Currently pursuing Computer Science",
      "while building modern web applications and exploring new technologies."
    ],
    stats: {
      experience: "3+ years",
      projects: "25+ completed",
      technologies: "15+ mastered",
      commits: "1,200+ this year"
    },
    interests: [
      "🚀 Modern Web Development",
      "🎨 UI/UX Design", 
      "⚡ Performance Optimization",
      "🤖 AI Integration",
      "🌐 Open Source"
    ]
  }

  return (
    <section id="about" className={`py-20 bg-gradient-to-b from-gray-900 to-black ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Terminal Header */}
          <ScrollReveal>
            <div className="mb-12">
              <motion.div 
                className="bg-terminal-black/50 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
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
                
                <div className="font-terminal text-terminal-amber space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-terminal-green">$</span>
                    <span>cat about.txt</span>
                  </div>
                  <div className="text-xl font-bold text-terminal-orange">
                    About {aboutData.name}
                  </div>
                </div>
              </motion.div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Bio */}
            <ScrollReveal>
              <div className="space-y-6">
                <motion.div
                  className="bg-terminal-black/40 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-6"
                  whileHover={{ borderColor: 'rgba(255, 176, 0, 0.6)' }}
                >
                  <h3 className="font-terminal text-terminal-orange text-lg mb-4">
                    ~/personal_info.json
                  </h3>
                  
                  <div className="font-terminal text-terminal-amber space-y-2 text-sm">
                    <div className="text-terminal-green">{'{'}</div>
                    <div className="ml-4">
                      <span className="text-terminal-orange">"name"</span>
                      <span className="text-white">: </span>
                      <span className="text-terminal-amber">"{aboutData.name}"</span>,
                    </div>
                    <div className="ml-4">
                      <span className="text-terminal-orange">"title"</span>
                      <span className="text-white">: </span>
                      <span className="text-terminal-amber">"{aboutData.title}"</span>,
                    </div>
                    <div className="ml-4">
                      <span className="text-terminal-orange">"bio"</span>
                      <span className="text-white">: [</span>
                    </div>
                    {aboutData.bio.map((line, index) => (
                      <motion.div 
                        key={index}
                        className="ml-8 text-terminal-amber"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        "{line}"{index < aboutData.bio.length - 1 ? ',' : ''}
                      </motion.div>
                    ))}
                    <div className="ml-4 text-white">]</div>
                    <div className="text-terminal-green">{'}'}</div>
                  </div>
                </motion.div>

                {/* Interests */}
                <motion.div
                  className="bg-terminal-black/40 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-6"
                  whileHover={{ borderColor: 'rgba(255, 176, 0, 0.6)' }}
                >
                  <h3 className="font-terminal text-terminal-orange text-lg mb-4">
                    ~/interests.list
                  </h3>
                  
                  <div className="space-y-2">
                    {aboutData.interests.map((interest, index) => (
                      <motion.div
                        key={index}
                        className="font-terminal text-terminal-amber flex items-center space-x-2"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ x: 10 }}
                      >
                        <span className="text-terminal-green">+</span>
                        <span>{interest}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </ScrollReveal>

            {/* Right Column - Stats */}
            <ScrollReveal delay={0.2}>
              <div className="space-y-6">
                <motion.div
                  className="bg-terminal-black/40 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-6"
                  whileHover={{ borderColor: 'rgba(255, 176, 0, 0.6)' }}
                >
                  <h3 className="font-terminal text-terminal-orange text-lg mb-4">
                    ~/stats.sh --summary
                  </h3>
                  
                  <div className="space-y-4">
                    {Object.entries(aboutData.stats).map(([key, value], index) => (
                      <motion.div
                        key={key}
                        className="flex justify-between items-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <span className="font-terminal text-terminal-green">
                          {key.replace(/([A-Z])/g, '_$1').toLowerCase()}:
                        </span>
                        <motion.span 
                          className="font-terminal text-terminal-amber font-bold"
                          whileHover={{ scale: 1.1, textShadow: '0 0 20px currentColor' }}
                        >
                          {value}
                        </motion.span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Terminal Command Demo */}
                <motion.div
                  className="bg-terminal-black/40 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-6"
                  whileHover={{ borderColor: 'rgba(255, 176, 0, 0.6)' }}
                >
                  <h3 className="font-terminal text-terminal-orange text-lg mb-4">
                    ~/current_status.log
                  </h3>
                  
                  <div className="font-terminal text-terminal-amber space-y-2 text-sm">
                    <motion.div 
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="text-terminal-green">$</span>
                      <span>whoami</span>
                    </motion.div>
                    <motion.div 
                      className="text-terminal-amber ml-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      passionate_developer
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center space-x-2 mt-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1 }}
                    >
                      <span className="text-terminal-green">$</span>
                      <span>status --current</span>
                    </motion.div>
                    <motion.div 
                      className="text-terminal-green ml-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.5 }}
                    >
                      ● Available for new opportunities
                    </motion.div>
                    <motion.div 
                      className="text-terminal-orange ml-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 2 }}
                    >
                      ● Currently building amazing things
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </ScrollReveal>
          </div>

          {/* Terminal Prompt */}
          <ScrollReveal delay={0.5}>
            <motion.div 
              className="mt-12 bg-terminal-black/30 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-4"
              whileHover={{ borderColor: 'rgba(255, 176, 0, 0.6)' }}
            >
              <div className="font-terminal text-terminal-amber flex items-center space-x-2">
                <span className="text-terminal-green">user</span>
                <span className="text-white">:</span>
                <span className="text-blue-400">~/about</span>
                <span className="text-white">$</span>
                <span className="text-terminal-amber/80">
                  cd ../projects # Let's see some work
                </span>
                <motion.span
                  className="w-2 h-5 bg-terminal-amber ml-2"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                />
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>    </section>
  )
}
