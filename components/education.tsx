'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Calendar, MapPin, Award, BookOpen } from 'lucide-react'
import { portfolioData } from '../data/portfolio'
import type { Education as EducationType } from '../types'

// Animation variants
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

// Individual education card component
const EducationCard = ({ education }: { education: EducationType }) => {
  const isCurrentlyEnrolled = !education.endDate || new Date(education.endDate) > new Date()

  return (
    <motion.div
      variants={itemVariants}
      className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Education header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {education.degree}
            </h3>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {education.school}
            </p>
          </div>
        </div>
        
        {/* Current enrollment badge */}
        {isCurrentlyEnrolled && (
          <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium rounded-full">
            Current
          </span>
        )}
      </div>

      {/* Location and dates */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span>{education.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDate(education.startDate)} - {education.endDate ? formatDate(education.endDate) : 'Present'}
          </span>
        </div>
        {education.gpa && (
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            <span>GPA: {education.gpa}</span>
          </div>
        )}
      </div>

      {/* Relevant Coursework */}
      {education.relevant_coursework && education.relevant_coursework.length > 0 && (
        <div className="mb-4">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
            <BookOpen className="h-4 w-4" />
            Relevant Coursework
          </h4>
          <div className="flex flex-wrap gap-2">
            {education.relevant_coursework.map((course, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-md font-medium"
              >
                {course}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {education.achievements && education.achievements.length > 0 && (
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
            <Award className="h-4 w-4" />
            Achievements & Honors
          </h4>
          <ul className="space-y-1" role="list">
            {education.achievements.map((achievement, index) => (
              <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                <span className="text-yellow-500 mt-1.5 block w-1 h-1 rounded-full bg-current flex-shrink-0" aria-hidden="true" />
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  )
}

export function Education() {
  return (
    <section 
      id="education" 
      className="py-20 bg-white dark:bg-gray-800"
      aria-labelledby="education-heading"
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
            id="education-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Education
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            My academic journey and the foundations that shaped my technical expertise.
          </p>
        </motion.div>

        {/* Education timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >
          {portfolioData.education.map((education) => (
            <EducationCard key={education.id} education={education} />
          ))}
        </motion.div>

        {/* Fun fact or additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <p className="text-gray-700 dark:text-gray-300 italic">
            "Education is the most powerful weapon which you can use to change the world." - Nelson Mandela
          </p>
        </motion.div>
      </div>
    </section>
  )
}
