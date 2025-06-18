'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, ExternalLink } from 'lucide-react'
import { portfolioData } from '../data/portfolio'
import type { SocialLink } from '../types'
import { useMemo, useCallback } from 'react'

// Icon mapping for social platforms
const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
  email: Mail
} as const

// Utility functions
const sanitizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return '#'
  
  try {
    const urlObj = new URL(url)
    // Only allow safe protocols
    if (!['http:', 'https:', 'mailto:'].includes(urlObj.protocol)) {
      console.warn(`Unsafe URL protocol detected: ${urlObj.protocol}`)
      return '#'
    }
    return url
  } catch {
    console.warn(`Invalid URL detected: ${url}`)
    return '#'
  }
}

const sanitizeText = (text: string): string => {
  if (typeof text !== 'string') return ''
  return text.replace(/[<>]/g, '').trim().slice(0, 100)
}

// Get icon component for social platform
const getIcon = (iconName: string) => {
  const Icon = iconMap[iconName.toLowerCase() as keyof typeof iconMap]
  return Icon || ExternalLink
}

// Get platform display name
const getPlatformDisplayName = (url: string): string => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url.replace(/^https?:\/\//, '').replace('www.', '')
  }
}

// Individual social link component
interface SocialLinkItemProps {
  social: SocialLink
  index: number
  variant?: 'full' | 'compact'
}

const SocialLinkItem = ({ social, index, variant = 'full' }: SocialLinkItemProps) => {
  const IconComponent = getIcon(social.icon)
  const sanitizedUrl = sanitizeUrl(social.url)
  const sanitizedName = sanitizeText(social.name)
  const isMailto = sanitizedUrl.startsWith('mailto:')
  const displayUrl = getPlatformDisplayName(sanitizedUrl)
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (sanitizedUrl === '#') {
      e.preventDefault()
      console.warn('Invalid social link clicked')
    }
  }, [sanitizedUrl])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (sanitizedUrl === '#') {
        e.preventDefault()
        console.warn('Invalid social link activated')
      }
    }
  }, [sanitizedUrl])
  
  if (variant === 'compact') {
    return (
      <motion.a
        key={`${sanitizedName}-${index}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        href={sanitizedUrl}
        target={isMailto ? '_self' : '_blank'}
        rel={isMailto ? undefined : 'noopener noreferrer nofollow'}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        aria-label={`Visit my ${sanitizedName} profile${isMailto ? '' : ' (opens in new tab)'}`}
      >
        <IconComponent className="h-5 w-5" aria-hidden="true" />
      </motion.a>
    )
  }
  
  return (
    <motion.a
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      href={sanitizedUrl}
      target={isMailto ? '_self' : '_blank'}
      rel={isMailto ? undefined : 'noopener noreferrer nofollow'}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label={`Visit my ${sanitizedName} profile${isMailto ? '' : ' (opens in new tab)'}`}
    >
      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
        <IconComponent 
          className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200" 
          aria-hidden="true"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {sanitizedName}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {displayUrl}
        </p>
      </div>
      {!isMailto && (
        <ExternalLink 
          className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors opacity-0 group-hover:opacity-100" 
          aria-hidden="true"
        />
      )}
    </motion.a>
  )
}

// Compact social links for header/footer
export function SocialLinksCompact() {
  const validatedSocial = useMemo(() => {
    if (!Array.isArray(portfolioData.social)) return []
    
    return portfolioData.social
      .filter((social): social is SocialLink => {
        return (
          social &&
          typeof social.name === 'string' &&
          typeof social.url === 'string' &&
          typeof social.icon === 'string' &&
          social.name.length > 0 &&
          social.url.length > 0
        )
      })
      .filter(social => sanitizeUrl(social.url) !== '#')
  }, [])

  if (validatedSocial.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2" role="list" aria-label="Social media links">
      {validatedSocial.map((social, index) => (
        <div key={`${social.name}-${index}`} role="listitem">
          <SocialLinkItem social={social} index={index} variant="compact" />
        </div>
      ))}
    </div>
  )
}

// Full social links section
export function SocialLinks() {
  const validatedSocial = useMemo(() => {
    if (!Array.isArray(portfolioData.social)) return []
    
    return portfolioData.social
      .filter((social): social is SocialLink => {
        return (
          social &&
          typeof social.name === 'string' &&
          typeof social.url === 'string' &&
          typeof social.icon === 'string' &&
          social.name.length > 0 &&
          social.url.length > 0
        )
      })
      .filter(social => sanitizeUrl(social.url) !== '#')
  }, [])

  const sanitizedEmail = useMemo(() => {
    if (!portfolioData.personal?.email) return null
    return sanitizeUrl(`mailto:${portfolioData.personal.email}`)
  }, [])

  if (validatedSocial.length === 0 && !sanitizedEmail) {
    return (
      <section 
        id="social" 
        className="py-12 bg-gray-50 dark:bg-gray-900"
        aria-labelledby="social-heading"
      >
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>Social links are temporarily unavailable.</p>
          </div>
        </div>
      </section>
    )
  }

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
        {validatedSocial.length > 0 && (
          <div 
            className="space-y-3"
            role="list"
            aria-label="Social media profiles"
          >
            {validatedSocial.map((social, index) => (
              <div key={`${social.name}-${index}`} role="listitem">
                <SocialLinkItem social={social} index={index} variant="full" />
              </div>
            ))}
          </div>
        )}

        {/* Additional contact info */}
        {sanitizedEmail && sanitizedEmail !== '#' && (
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
              href={sanitizedEmail}
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded px-2 py-1"
              aria-label={`Send email to ${portfolioData.personal.email}`}
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {portfolioData.personal.email}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  )
}
