'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react'

interface TerminalFooterProps {
  className?: string
}

export function Footer({ className = "" }: TerminalFooterProps) {
  const currentYear = new Date().getFullYear()
  
  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/rajinuddin',
      icon: Github,
      command: 'git clone github.com/rajinuddin'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/rajinuddin',
      icon: Linkedin,
      command: 'curl linkedin.com/in/rajinuddin'
    },
    {
      name: 'Email',
      url: 'mailto:rajin@example.com',
      icon: Mail,
      command: 'mail rajin@example.com'
    }
  ]

  const quickLinks = [
    { name: 'about', href: '#about', command: 'cd /about' },
    { name: 'projects', href: '#projects', command: 'ls /projects' },
    { name: 'skills', href: '#skills', command: 'cat /skills.txt' },
    { name: 'contact', href: '#contact', command: 'ping contact@' },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className={`bg-terminal-black border-t border-terminal-amber/30 ${className}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Terminal Header */}
          <motion.div 
            className="bg-terminal-black/50 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-6 mb-8"
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
                user@terminal: ~/footer
              </span>
            </div>
            
            <div className="font-terminal text-terminal-amber space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-terminal-green">$</span>
                <span>cat footer.txt</span>
              </div>
              <div className="text-lg font-bold text-terminal-orange">
                System Information & Links
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Navigation Links */}
            <motion.div
              className="bg-terminal-black/40 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ borderColor: 'rgba(255, 176, 0, 0.6)' }}
            >
              <h3 className="font-terminal text-terminal-orange text-lg mb-4">
                ~/navigation.sh
              </h3>
              
              <div className="space-y-2">
                {quickLinks.map((link, index) => (
                  <motion.button
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    className="block w-full text-left font-terminal text-terminal-amber/80 hover:text-terminal-amber py-1 px-2 rounded hover:bg-terminal-amber/10 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-terminal-green">$</span>
                      <span className="text-sm">{link.command}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="bg-terminal-black/40 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ borderColor: 'rgba(255, 176, 0, 0.6)' }}
            >
              <h3 className="font-terminal text-terminal-orange text-lg mb-4">
                ~/social.links
              </h3>
              
              <div className="space-y-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 font-terminal text-terminal-amber/80 hover:text-terminal-amber py-2 px-2 rounded hover:bg-terminal-amber/10 transition-colors group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ x: 10, scale: 1.02 }}
                  >
                    <social.icon className="w-4 h-4 text-terminal-green" />
                    <div className="flex-1">
                      <div className="text-sm">{social.command}</div>
                      <div className="text-xs text-terminal-amber/60">
                        # {social.name}
                      </div>
                    </div>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* System Info */}
            <motion.div
              className="bg-terminal-black/40 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ borderColor: 'rgba(255, 176, 0, 0.6)' }}
            >
              <h3 className="font-terminal text-terminal-orange text-lg mb-4">
                ~/system.info
              </h3>
              
              <div className="font-terminal text-terminal-amber space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-terminal-green">$</span>
                  <span>uname -a</span>
                </div>
                <div className="text-terminal-amber/80 ml-4 text-xs">
                  Portfolio-OS v{currentYear} LTS
                </div>
                
                <div className="flex items-center space-x-2 mt-3">
                  <span className="text-terminal-green">$</span>
                  <span>uptime</span>
                </div>
                <div className="text-terminal-amber/80 ml-4 text-xs">
                  Built with Next.js & ❤️
                </div>
                
                <div className="flex items-center space-x-2 mt-3">
                  <span className="text-terminal-green">$</span>
                  <span>echo $STATUS</span>
                </div>
                <motion.div 
                  className="text-terminal-green ml-4 text-xs"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ● AVAILABLE FOR WORK
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Copyright Terminal */}
          <motion.div 
            className="bg-terminal-black/30 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ borderColor: 'rgba(255, 176, 0, 0.6)' }}
          >
            <div className="font-terminal text-terminal-amber flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
              <div className="flex items-center space-x-2">
                <span className="text-terminal-green">user@portfolio</span>
                <span className="text-white">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-white">$</span>
                <span className="text-terminal-amber/80 text-sm">
                  © {currentYear} Rajin Uddin. All rights reserved.
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-terminal-amber/60">
                  Made with terminal vibes
                </span>
                <motion.span
                  className="w-2 h-4 bg-terminal-amber"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

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
