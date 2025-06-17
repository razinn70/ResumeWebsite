'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { portfolioData } from '../data/portfolio'
import type { Project } from '../types'

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

// Project status colors
const statusColors = {
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  archived: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

// Individual project card component
const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <motion.div
      layout
      variants={itemVariants}
      className={`group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-lg transition-all duration-300 ${
        project.featured ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
      }`}
    >
      {/* Project header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {project.featured && (
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs font-medium rounded-full">
              <Star className="h-3 w-3" />
              Featured
            </div>
          )}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[project.status]}`}>
            {project.status.replace('-', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4" />
          <span>{project.year}</span>
        </div>
      </div>

      {/* Project title and description */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {project.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
        {project.description}
      </p>
      
      {/* Technologies */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {tech}
          </span>
        ))}
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center gap-4">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Live Demo
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Github className="h-4 w-4" />
            View Code
          </a>
        )}
      </div>
    </motion.div>
  )
}

export function Projects() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('all')

  const { projects } = portfolioData

  // Get unique years and statuses for filters
  const years = [...new Set(projects.map(p => p.year))].sort((a, b) => b - a)
  const statuses = [...new Set(projects.map(p => p.status))]

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus
    const matchesYear = selectedYear === 'all' || project.year.toString() === selectedYear
    
    return matchesSearch && matchesStatus && matchesYear
  })

  // Separate featured and non-featured projects
  const featuredProjects = filteredProjects.filter(p => p.featured)
  const otherProjects = filteredProjects.filter(p => !p.featured)

  return (
    <section 
      id="projects" 
      className="py-20 bg-white dark:bg-gray-800"
      aria-labelledby="projects-heading"
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
            id="projects-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Featured Projects
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A collection of projects that showcase my skills and passion for building innovative solutions.
          </p>
        </motion.div>

        {/* Search and filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Filter by:</span>
            </div>
            
            {/* Status filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.replace('-', ' ')}
                </option>
              ))}
            </select>

            {/* Year filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Years</option>
              {years.map(year => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        </motion.div>

        {/* Featured projects section */}
        {featuredProjects.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Featured Work
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <AnimatePresence mode="wait">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Other projects section */}
        {otherProjects.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Other Projects
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="wait">
                {otherProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* No results message */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No projects found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedStatus('all')
                setSelectedYear('all')
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
