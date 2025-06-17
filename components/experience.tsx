'use client'

import { motion } from 'framer-motion'
import { CalendarDays, MapPin, ExternalLink, Briefcase } from 'lucide-react'
import { portfolioData } from '../data/portfolio'
import type { Experience as ExperienceType } from '../types'

// Animation variants for container and items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

// Format date for display
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short' 
  })
}

// Calculate duration between dates
const calculateDuration = (startDate: string, endDate?: string): string => {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()
  
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
  
  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`
  } else {
    const years = Math.floor(diffMonths / 12)
    const months = diffMonths % 12
    return `${years} year${years !== 1 ? 's' : ''} ${months > 0 ? `${months} month${months !== 1 ? 's' : ''}` : ''}`
  }
}

// Individual experience card component
const ExperienceCard = ({ experience }: { experience: ExperienceType }) => {
  const typeColors = {
    internship: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    job: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    freelance: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    volunteer: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  }

  return (
    <motion.div
      variants={itemVariants}
      className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Experience type badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[experience.type]}`}>
            {experience.type.charAt(0).toUpperCase() + experience.type.slice(1)}
          </span>
        </div>
      </div>

      {/* Job title and company */}
      <div className="mb-3">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {experience.title}
        </h3>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mt-1">
          {experience.company}
        </p>
      </div>

      {/* Location and dates */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span>{experience.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          <span>
            {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Present'}
          </span>
        </div>
        <div className="text-gray-500 dark:text-gray-500">
          ({calculateDuration(experience.startDate, experience.endDate)})
        </div>
      </div>

      {/* Job description */}
      <div className="mb-4">
        <ul className="space-y-2" role="list">
          {experience.description.map((item, index) => (
            <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
              <span className="text-blue-500 mt-2 block w-1 h-1 rounded-full bg-current flex-shrink-0" aria-hidden="true" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Technologies used */}
      <div className="flex flex-wrap gap-2">
        {experience.technologies.map((tech) => (
          <span
            key={tech}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md font-medium"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export function Experience() {
  return (
    <section 
      id="experience" 
      className="py-20 bg-gray-50 dark:bg-gray-900"
      aria-labelledby="experience-heading"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 
            id="experience-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Professional Experience
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            My journey through various roles in software development and technology.
          </p>
        </motion.div>

        {/* Experience timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >
          {portfolioData.experience.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </motion.div>

        {/* Call-to-action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Want to know more about my work experience?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Get in touch
            <ExternalLink className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
