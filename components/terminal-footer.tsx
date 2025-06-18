'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Terminal, Heart } from 'lucide-react'

interface TerminalFooterProps {
  className?: string
}

export function TerminalFooter({ className = "" }: TerminalFooterProps) {
  const currentYear = new Date().getFullYear()
  
  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/rajinuddin',
      icon: Github,
      command: 'git clone'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/rajinuddin',
      icon: Linkedin,
      command: 'connect --professional'
    },
    {
      name: 'Email',
      url: 'mailto:rajin@example.com',
      icon: Mail,
      command: 'mail -s "Hello"'
    }
  ]

  return (
    <footer className={`bg-gradient-to-t from-black to-gray-900 border-t border-terminal-amber/20 ${className}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Terminal Window */}
          <motion.div 
            className="bg-terminal-black/50 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-6 mb-8"
            initial={{ opacity: 0, y: 30 }}
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
                user@terminal: ~/footer
              </span>
            </div>
            
            <div className="font-terminal text-terminal-amber space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-terminal-green">$</span>
                <span>ls -la /social/</span>
              </div>
              
              {/* Social Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-terminal-black/30 border border-terminal-amber/30 rounded-lg p-4 hover:border-terminal-amber/60 transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: '0 0 20px rgba(255, 176, 0, 0.2)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <link.icon className="w-5 h-5 text-terminal-orange group-hover:text-terminal-amber transition-colors" />
                      <div>
                        <div className="font-terminal text-terminal-amber text-sm font-semibold">
                          {link.command}
                        </div>
                        <div className="text-terminal-amber/60 text-xs">
                          {link.name}
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
              
              {/* Terminal Command */}
              <div className="mt-8 pt-4 border-t border-terminal-amber/20">
                <div className="flex items-center space-x-2">
                  <span className="text-terminal-green">$</span>
                  <span className="text-terminal-amber/80">
                    echo "Thanks for visiting my terminal!"
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Copyright & Credits */}
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-center space-x-2 text-terminal-amber/80 font-terminal text-sm">
              <Terminal className="w-4 h-4" />
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>using Next.js, TypeScript & Terminal aesthetics</span>
            </div>
            
            <div className="font-terminal text-terminal-amber/60 text-xs">
              © {currentYear} Rajin Uddin. All rights reserved.
              <br />
              Inspired by the retro terminal era • Powered by modern web technologies
            </div>
            
            <motion.div 
              className="mt-6 font-terminal text-terminal-green text-xs"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              user@terminal:~$ █
            </motion.div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

export default TerminalFooter
