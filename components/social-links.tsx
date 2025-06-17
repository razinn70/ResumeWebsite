'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, ExternalLink } from 'lucide-react'
import { portfolioData } from '../data/portfolio'
import type { SocialLink } from '../types'

// Icon mapping for social platforms
const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
  email: Mail
}

// Get icon component for social platform
const getIcon = (iconName: string) => {
  const Icon = iconMap[iconName.toLowerCase() as keyof typeof iconMap]
  return Icon || ExternalLink
}

// Individual social link component
const SocialLinkItem = ({ social, index }: { social: SocialLink; index: number }) => {
  const IconComponent = getIcon(social.icon)
  
  return (
    <motion.a
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
      aria-label={`Visit my ${social.name} profile`}
    >
      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
        <IconComponent className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {social.name}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {social.url.replace(/^https?:\/\//, '')}
        </p>
      </div>
      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors opacity-0 group-hover:opacity-100" />
    </motion.a>
  )
}

// Compact social links for header/footer
export function SocialLinksCompact() {
  return (
    <div className="flex items-center gap-2">
      {portfolioData.social.map((social, index) => {
        const IconComponent = getIcon(social.icon)
        return (
          <motion.a
            key={social.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
            aria-label={`Visit my ${social.name} profile`}
          >
            <IconComponent className="h-5 w-5" />
          </motion.a>
        )
      })}
    </div>
  )
}

// Full social links section
export function SocialLinks() {
  return (
    <section 
      id="social" 
      className="py-12 bg-gray-50 dark:bg-gray-900"
      aria-labelledby="social-heading"
    >
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 
            id="social-heading"
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Connect With Me
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Find me on these platforms and let's connect!
          </p>
        </motion.div>

        {/* Social links grid */}
        <div className="space-y-3">
          {portfolioData.social.map((social, index) => (
            <SocialLinkItem key={social.name} social={social} index={index} />
          ))}
        </div>

        {/* Additional contact info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Prefer email?
          </p>
          <a
            href={`mailto:${portfolioData.personal.email}`}
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            <Mail className="h-4 w-4" />
            {portfolioData.personal.email}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
