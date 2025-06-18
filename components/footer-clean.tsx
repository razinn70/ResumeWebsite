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
          {/* Copyright Terminal */}
          <motion.div 
            className="bg-terminal-black/30 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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

export default Footer
