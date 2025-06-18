'use client'

import { motion } from 'framer-motion'
import { portfolioData } from '@/data/portfolio'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4
    }
  }
}

const skillVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3
    }
  }
}

export default function Skills() {
  const { skills } = portfolioData

  // Error boundary fallback
  if (!skills || !Array.isArray(skills)) {
    return (
      <section 
        id="skills" 
        className="py-20 bg-gray-50 dark:bg-gray-900"
        aria-labelledby="skills-heading"
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>Skills data is temporarily unavailable.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section 
      id="skills" 
      className="py-20 bg-gray-50 dark:bg-gray-900"
      aria-labelledby="skills-heading"
    >
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Header */}
          <motion.div 
            variants={itemVariants}
            className="text-center mb-12"
          >
            <h2 
              id="skills-heading"
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Skills & Technologies
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Technologies and tools I work with, organized by category and expertise.
            </p>
          </motion.div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skillGroup, index) => (
              <motion.div
                key={`${skillGroup.category}-${index}`}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
                role="group"
                aria-labelledby={`skill-category-${index}`}
              >
                <h3 
                  id={`skill-category-${index}`}
                  className="text-xl font-semibold text-gray-900 dark:text-white mb-4"
                >
                  {skillGroup.category}
                </h3>
                <div 
                  className="flex flex-wrap gap-2"
                  role="list"
                  aria-label={`${skillGroup.category} skills`}
                >
                  {skillGroup.items.map((skill, skillIndex) => (
                    <motion.span
                      key={`${skill}-${skillIndex}`}
                      variants={skillVariants}
                      className="inline-block px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                      role="listitem"
                      tabIndex={0}
                      aria-label={`Skill: ${skill}`}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
