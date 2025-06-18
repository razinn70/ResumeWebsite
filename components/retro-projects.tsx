'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github, Calendar, Code, Database, Smartphone, Globe } from 'lucide-react'
import { ScrollReveal } from './scroll-transition'

interface RetroProject {
  id: string
  name: string
  year: number
  description: string
  tech: string[]
  category: 'web' | 'mobile' | 'desktop' | 'data' | 'game'
  status: 'completed' | 'in-progress' | 'archived' | 'beta'
  demoUrl?: string
  githubUrl?: string
  featured?: boolean
}

interface RetroProjectsProps {
  projects?: RetroProject[]
  className?: string
}

const defaultProjects: RetroProject[] = [
  {
    id: 'PRJ001',
    name: 'TERMINAL.PORTFOLIO',
    year: 2025,
    description: 'A retro-inspired developer portfolio featuring authentic CRT aesthetics, Three.js 3D monitor simulation, and interactive terminal interface. Built with cutting-edge React 19.',
    tech: ['Next.js', 'React 19', 'Three.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GLSL Shaders'],
    category: 'web',
    status: 'completed',
    demoUrl: 'https://rajinuddin.dev',
    githubUrl: 'https://github.com/rajinuddin/retro-portfolio',
    featured: true
  },
  {
    id: 'PRJ002',
    name: 'E-COMMERCE.SYS',
    year: 2024,
    description: 'Full-stack e-commerce platform with modern UI, secure payment processing, inventory management, and real-time analytics dashboard.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe API', 'Redis', 'Docker'],
    category: 'web',
    status: 'completed',
    demoUrl: 'https://shop.example.com',
    githubUrl: 'https://github.com/rajinuddin/ecommerce-platform'
  },
  {
    id: 'PRJ003',
    name: 'TASK.MOBILE.APP',
    year: 2024,
    description: 'Cross-platform mobile application for team collaboration and task management with real-time synchronization and offline support.',
    tech: ['React Native', 'TypeScript', 'Firebase', 'Redux Toolkit', 'Expo'],
    category: 'mobile',
    status: 'beta',
    githubUrl: 'https://github.com/rajinuddin/task-mobile'
  },
  {
    id: 'PRJ004',
    name: 'DATA.VIZ.ENGINE',
    year: 2024,
    description: 'Interactive data visualization dashboard for business intelligence with real-time updates, custom chart builders, and export capabilities.',
    tech: ['D3.js', 'Python', 'FastAPI', 'PostgreSQL', 'WebSockets'],
    category: 'data',
    status: 'completed',
    demoUrl: 'https://analytics.example.com',
    githubUrl: 'https://github.com/rajinuddin/data-viz-engine'
  },
  {
    id: 'PRJ005',
    name: 'NEURAL.NET.TRAINER',
    year: 2023,
    description: 'Machine learning model training interface with visualization of neural network architectures and real-time training metrics.',
    tech: ['Python', 'TensorFlow', 'Flask', 'React', 'WebGL'],
    category: 'data',
    status: 'archived',
    githubUrl: 'https://github.com/rajinuddin/neural-trainer'
  },
  {
    id: 'PRJ006',
    name: 'PIXEL.ADVENTURE.GAME',
    year: 2023,
    description: 'Retro-style 2D platformer game with pixel art graphics, chiptune music, and classic gameplay mechanics built with modern web technologies.',
    tech: ['JavaScript', 'Canvas API', 'WebAudio API', 'Pixel Art'],
    category: 'game',
    status: 'completed',
    demoUrl: 'https://game.example.com',
    githubUrl: 'https://github.com/rajinuddin/pixel-adventure'
  }
]

export function RetroProjects({ projects = defaultProjects, className = "" }: RetroProjectsProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web': return Globe
      case 'mobile': return Smartphone
      case 'data': return Database
      case 'desktop': return Code
      case 'game': return Code
      default: return Code
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-terminal-green'
      case 'in-progress': return 'text-terminal-orange'
      case 'beta': return 'text-terminal-blue' 
      case 'archived': return 'text-gray-500'
      default: return 'text-terminal-amber'
    }
  }

  const getStatusSymbol = (status: string) => {
    switch (status) {
      case 'completed': return '✓'
      case 'in-progress': return '⚡'
      case 'beta': return 'β'
      case 'archived': return '📦'
      default: return '•'
    }
  }

  // Group projects by year
  const projectsByYear = projects.reduce((acc, project) => {
    if (!acc[project.year]) {
      acc[project.year] = []
    }
    acc[project.year].push(project)
    return acc
  }, {} as Record<number, RetroProject[]>)

  const years = Object.keys(projectsByYear).map(Number).sort((a, b) => b - a)

  return (
    <section id="projects" className={`py-20 bg-gradient-to-b from-black to-gray-900 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Retro Header */}
          <ScrollReveal>
            <div className="mb-16 text-center">
              <motion.div 
                className="bg-terminal-black/50 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-8 mb-8"
                whileHover={{ 
                  borderColor: 'rgba(255, 176, 0, 0.6)',
                  boxShadow: '0 0 30px rgba(255, 176, 0, 0.2)'
                }}
              >
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="font-retro text-terminal-amber/80 text-sm ml-4">
                    FILE_MANAGER.EXE - PROJECT_ARCHIVE/
                  </span>
                </div>
                
                <div className="font-retro text-terminal-amber space-y-4">
                  <div className="text-2xl text-terminal-green font-bold">
                    === PROJECT REPOSITORY ===
                  </div>
                  <div className="text-terminal-amber/80">
                    DIRECTORY LISTING: /home/rajin/projects/*
                  </div>
                  <div className="text-terminal-orange">
                    TOTAL FILES: {projects.length} | DISK USAGE: ∞ CREATIVITY
                  </div>
                  
                  {/* ASCII Divider */}
                  <div className="font-pixel text-terminal-amber/40 text-xs py-4">
                    ═══════════════════════════════════════════════════════════
                  </div>
                </div>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Projects by Year */}
          {years.map((year, yearIndex) => (
            <ScrollReveal key={year} delay={yearIndex * 0.1}>
              <div className="mb-12">
                {/* Year Header */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: yearIndex * 0.1 }}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <Calendar className="w-6 h-6 text-terminal-orange" />
                    <h2 className="font-pixel text-2xl text-terminal-orange">
                      {year}.LOG
                    </h2>
                    <div className="flex-1 h-px bg-terminal-amber/30"></div>
                    <span className="font-retro text-terminal-amber/60 text-sm">
                      {projectsByYear[year].length} PROJECTS
                    </span>
                  </div>
                </motion.div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {projectsByYear[year].map((project, index) => {
                    const CategoryIcon = getCategoryIcon(project.category)
                    
                    return (
                      <motion.div
                        key={project.id}
                        className={`
                          bg-terminal-black/40 backdrop-blur-sm border border-terminal-amber/30 
                          rounded-lg p-6 hover:border-terminal-amber/60 transition-all duration-300 group
                          ${project.featured ? 'ring-2 ring-terminal-orange/50' : ''}
                        `}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: '0 0 40px rgba(255, 176, 0, 0.2)'
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Project Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <CategoryIcon className="w-5 h-5 text-terminal-orange" />
                            <div>
                              <h3 className="font-retro text-terminal-amber text-lg font-semibold">
                                {project.name}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`font-retro text-sm ${getStatusColor(project.status)}`}>
                                  {getStatusSymbol(project.status)} {project.status.toUpperCase()}
                                </span>
                                {project.featured && (
                                  <span className="font-pixel text-xs text-terminal-orange px-2 py-1 bg-terminal-orange/10 rounded">
                                    FEATURED
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="font-retro text-terminal-amber/60 text-sm">
                            #{project.id}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                          {project.description}
                        </p>

                        {/* Tech Stack */}
                        <div className="mb-6">
                          <div className="font-retro text-terminal-green text-xs mb-3">
                            DEPENDENCIES.TXT:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.tech.map((tech, techIndex) => (
                              <motion.span
                                key={techIndex}
                                className="px-2 py-1 bg-terminal-amber/10 border border-terminal-amber/30 rounded text-terminal-amber text-xs font-retro"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: techIndex * 0.05 }}
                                whileHover={{ 
                                  scale: 1.05,
                                  backgroundColor: 'rgba(255, 176, 0, 0.2)'
                                }}
                              >
                                {tech}
                              </motion.span>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {project.demoUrl && (
                              <motion.a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 font-retro text-terminal-orange hover:text-terminal-amber transition-colors text-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>DEMO</span>
                              </motion.a>
                            )}
                            
                            {project.githubUrl && (
                              <motion.a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 font-retro text-terminal-green hover:text-terminal-amber transition-colors text-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Github className="w-4 h-4" />
                                <span>SOURCE</span>
                              </motion.a>
                            )}
                          </div>
                          
                          <div className="font-retro text-terminal-amber/60 text-xs">
                            {project.year}
                          </div>
                        </div>

                        {/* File Info Footer */}
                        <div className="mt-6 pt-4 border-t border-terminal-amber/20">
                          <div className="font-retro text-terminal-amber/40 text-xs">
                            MODIFIED: {new Date().toLocaleDateString()} | SIZE: {project.tech.length} MODULES
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </ScrollReveal>
          ))}

          {/* Terminal Footer */}
          <ScrollReveal delay={0.5}>
            <motion.div 
              className="mt-16 bg-terminal-black/30 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-6"
              whileHover={{ borderColor: 'rgba(255, 176, 0, 0.6)' }}
            >
              <div className="font-retro text-terminal-amber space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-terminal-green">user@portfolio</span>
                  <span className="text-white">:</span>
                  <span className="text-blue-400">~/projects</span>
                  <span className="text-white">$</span>
                  <span className="text-terminal-amber/80">
                    git status # Ready for your next collaboration
                  </span>
                  <motion.span
                    className="w-2 h-5 bg-terminal-amber ml-2"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                  />
                </div>
                <div className="text-terminal-amber/60 text-sm">
                  END OF DIRECTORY LISTING • PRESS ANY KEY TO CONTINUE
                </div>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

export default RetroProjects
