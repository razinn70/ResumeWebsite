'use client'

import { motion } from 'framer-motion'
import { Mail, Linkedin, Github, ExternalLink } from 'lucide-react'
import { portfolioData } from '../data/portfolio'

// Icon mapping for social platforms
const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: ExternalLink,
  mail: Mail,
  email: Mail
}

// Get icon component for social platform
const getIcon = (iconName: string) => {
  const Icon = iconMap[iconName.toLowerCase() as keyof typeof iconMap]
  return Icon || ExternalLink
}

export function ContactEdh() {
  const { personal, social } = portfolioData

  return (
    <section 
      id="contact" 
      className="py-20 px-4"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-2xl mx-auto">
        {/* Section header - Ed.dev style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 
            id="contact-heading"
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight"
          >
            Contact
          </h2>
        </motion.div>

        {/* Simple contact message - like Ed's */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            Reach out on{' '}
            <a
              href={social.find(s => s.name === 'LinkedIn')?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline transition-colors"
            >
              LinkedIn
            </a>
          </p>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Or send me an email at{' '}
            <a
              href={`mailto:${personal.email}`}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline transition-colors"
            >
              {personal.email}
            </a>
          </p>
        </motion.div>

        {/* Social links - simple and clean */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-6"
        >
          {social.map((link, index) => {
            const IconComponent = getIcon(link.icon)
            return (
              <motion.a
                key={link.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                aria-label={`Visit my ${link.name} profile`}
              >
                <IconComponent className="h-5 w-5" />
                <span className="text-lg">{link.name}</span>
              </motion.a>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
