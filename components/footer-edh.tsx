'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, ExternalLink } from 'lucide-react'
import { portfolioData } from '../data/portfolio'

export function FooterEdh() {
  const { personal, social } = portfolioData
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 px-4 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          {/* Attribution text - like Ed's */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Developed + Designed by {personal.name}.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Inspired by the clean design of edh.dev.
            </p>
          </div>

          {/* Social links */}
          <div className="flex justify-center gap-6">
            {social.map((link) => {
              let IconComponent = ExternalLink
              if (link.icon === 'linkedin') IconComponent = Linkedin
              if (link.icon === 'github') IconComponent = Github
              
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  aria-label={link.name}
                >
                  <IconComponent className="h-5 w-5" />
                </a>
              )
            })}
          </div>

          {/* Navigation links */}
          <nav className="flex justify-center gap-6" aria-label="Footer navigation">
            <a
              href="#home"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Home
            </a>
            <a
              href="#projects"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Projects
            </a>
            <a
              href="#contact"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Copyright */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              COPYRIGHT © {currentYear} {personal.name.toUpperCase()}.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
