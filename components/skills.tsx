'use client'

import { motion } from 'framer-motion'
import { Code, Database, Cloud, Wrench, Palette, Terminal } from 'lucide-react'
import { portfolioData } from '../data/portfolio'
import type { Skill, Technology } from '../types'

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

// Category icons mapping
const categoryIcons = {
  'Programming Languages': Terminal,
  'Frontend Development': Palette,
  'Backend Development': Code,
  'Databases': Database,
  'DevOps & Cloud': Cloud,
  'Tools & Other': Wrench
}

// Get icon for category
const getCategoryIcon = (category: string) => {
  return categoryIcons[category as keyof typeof categoryIcons] || Code
}

// Get technology color by name
const getTechnologyColor = (techName: string): string => {
  const tech = portfolioData.technologies.find(t => t.name === techName)
  return tech?.color || '#6B7280'
}

// Individual skill category component
const SkillCategory = ({ skill }: { skill: Skill }) => {
  const IconComponent = getCategoryIcon(skill.category)

  return (
    <motion.div
      variants={itemVariants}
      className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Category header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
          <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {skill.category}
        </h3>
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {skill.items.map((item, index) => {
          const techColor = getTechnologyColor(item)
          return (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group/item"
            >
              {/* Color indicator */}
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: techColor }}
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                {item}
              </span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// Technologies showcase with colors
const TechnologiesShowcase = () => {
  const groupedTechnologies = portfolioData.technologies.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = []
    }
    acc[tech.category].push(tech)
    return acc
  }, {} as Record<string, Technology[]>)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-12"
    >
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Technology Stack
      </h3>
      
      <div className="space-y-6">
        {Object.entries(groupedTechnologies).map(([category, techs]) => (
          <div key={category} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            <div className="flex flex-wrap gap-3">
              {techs.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tech.color }}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export function Skills() {
  return (
    <section 
      id="skills" 
      className="py-20 bg-gray-50 dark:bg-gray-900"
      aria-labelledby="skills-heading"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 
            id="skills-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Skills & Technologies
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and the technologies I work with.
          </p>
        </motion.div>

        {/* Skills grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {portfolioData.skills.map((skill, index) => (
            <SkillCategory key={index} skill={skill} />
          ))}
        </motion.div>

        {/* Technologies showcase */}
        <TechnologiesShowcase />

        {/* Call-to-action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Always learning and staying up-to-date with the latest technologies and best practices.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Currently exploring: AI/ML, Web3, and Advanced DevOps practices
          </p>
        </motion.div>
      </div>
    </section>
  )
}
