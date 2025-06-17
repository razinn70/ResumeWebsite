'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { portfolioData } from '../data/portfolio'
import type { Project } from '../types'

// Animation variants with enhanced timing
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
}

// Individual project card component - Ed.dev style
const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <motion.div
      layout
      variants={itemVariants}
      className="group mb-16 last:mb-0"
    >
      {/* Project title and year - exactly like Ed's */}
      <div className="mb-8">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {project.title}
        </h3>
        <div className="text-lg text-gray-600 dark:text-gray-400 font-light">
          {project.year}
        </div>
      </div>

      {/* Tech stack - horizontal layout like Ed's */}
      <div className="flex flex-wrap gap-3 mb-8">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Project description - large paragraphs like Ed's */}
      <div className="mb-8">
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
          {project.description}
        </p>
        
        {/* Additional project details if available */}
        {project.featured && (
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            This project represents one of my most significant technical achievements, showcasing advanced skills in {project.technologies.slice(0, 3).join(', ')} and modern development practices.
          </p>
        )}
      </div>

      {/* Links - simple text links like Ed's */}
      <div className="flex flex-wrap gap-6">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline text-lg transition-colors"
          >
            {project.liveUrl.replace(/^https?:\/\//, '')}
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>View Code</span>
          </a>
        )}
      </div>
    </motion.div>
  )
}

export function Projects() {
  const { projects } = portfolioData

  // Sort projects by year (newest first) then by featured status
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year
    }
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1
    }
    return 0
  })

  return (
    <section 
      id="projects" 
      className="py-20 px-4"
      aria-labelledby="projects-heading"
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
            id="projects-heading"
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight"
          >
            Projects
          </h2>
        </motion.div>

        {/* Projects list */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {sortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>

        {/* Footer note - like Ed's */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700"
        >
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            This represents just a selection of the projects I have worked on over the years. I have many more pieces of personal, university and open source work.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
