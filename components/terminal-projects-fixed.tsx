'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { ScrollReveal } from './scroll-transition'

interface Project {
  id: string
  name: string
  description: string
  tech: string[]
  demoUrl?: string
  githubUrl?: string
  type: 'web' | 'mobile' | 'desktop' | 'data'
  status: 'completed' | 'in-progress' | 'archived'
}

interface TerminalProjectsProps {
  projects?: Project[]
  className?: string
}

const defaultProjects: Project[] = [
  {
    id: '001',
    name: 'portfolio-website',
    description: 'Personal portfolio with terminal aesthetics and smooth animations',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    demoUrl: 'https://rajinuddin.dev',
    githubUrl: 'https://github.com/rajinuddin/portfolio',
    type: 'web',
    status: 'completed'
  },
  {
    id: '002', 
    name: 'e-commerce-platform',
    description: 'Full-stack e-commerce solution with modern UI and payment integration',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    demoUrl: 'https://shop.example.com',
    githubUrl: 'https://github.com/rajinuddin/ecommerce',
    type: 'web',
    status: 'completed'
  },
  {
    id: '003',
    name: 'task-management-app',
    description: 'Cross-platform mobile app for team collaboration and task tracking',
    tech: ['React Native', 'Firebase', 'Redux'],
    githubUrl: 'https://github.com/rajinuddin/taskapp',
    type: 'mobile',
    status: 'in-progress'
  },
  {
    id: '004',
    name: 'data-visualization-dashboard',
    description: 'Interactive dashboard for analyzing business metrics and KPIs',
    tech: ['D3.js', 'Python', 'FastAPI', 'PostgreSQL'],
    demoUrl: 'https://analytics.example.com',
    githubUrl: 'https://github.com/rajinuddin/analytics',
    type: 'data',
    status: 'completed'
  }
]

export function TerminalProjects({ projects = defaultProjects, className = "" }: TerminalProjectsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-terminal-green'
      case 'in-progress': return 'text-terminal-orange' 
      case 'archived': return 'text-gray-500'
      default: return 'text-terminal-amber'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'web': return '🌐'
      case 'mobile': return '📱'
      case 'desktop': return '💻'
      case 'data': return '📊'
      default: return '📁'
    }
  }

  return (
    <section id="projects" className={`py-20 bg-gradient-to-b from-black to-gray-900 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Terminal Header */}
          <ScrollReveal>
            <div className="mb-12">
              <motion.div 
                className="bg-terminal-black/50 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="font-terminal text-terminal-amber/80 text-sm ml-4">
                    user@terminal: ~/projects
                  </span>
                </div>
                
                <div className="font-terminal text-terminal-amber space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-terminal-green">$</span>
                    <span>ls -la /projects/</span>
                  </div>
                  <div className="text-terminal-amber/80">
                    total {projects.length} projects
                  </div>
                  <div className="text-xl font-bold text-terminal-orange">
                    drwxr-xr-x  {projects.length} user staff  recent_projects/
                  </div>
                </div>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 0.1}>
                <motion.div
                  className="bg-terminal-black/40 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-6 hover:border-terminal-amber/60 transition-all duration-300 group"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 0 30px rgba(255, 176, 0, 0.2)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getTypeIcon(project.type)}</span>
                      <div>
                        <h3 className="font-terminal text-terminal-amber text-lg font-semibold">
                          {project.name}
                        </h3>
                        <span className={`font-terminal text-sm ${getStatusColor(project.status)}`}>
                          [{project.status.replace('-', ' ')}]
                        </span>
                      </div>
                    </div>
                    <span className="font-terminal text-terminal-amber/60 text-sm">
                      #{project.id}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="mb-6">
                    <div className="font-terminal text-terminal-green text-sm mb-2">
                      dependencies:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <motion.span
                          key={techIndex}
                          className="px-3 py-1 bg-terminal-amber/10 border border-terminal-amber/30 rounded-md text-terminal-amber text-sm font-terminal"
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
                  <div className="flex items-center space-x-4">
                    {project.demoUrl && (
                      <motion.a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 font-terminal text-terminal-orange hover:text-terminal-amber transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>demo</span>
                      </motion.a>
                    )}
                    
                    {project.githubUrl && (
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 font-terminal text-terminal-green hover:text-terminal-amber transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github className="w-4 h-4" />
                        <span>source</span>
                      </motion.a>
                    )}
                  </div>

                  {/* Terminal Footer */}
                  <div className="mt-6 pt-4 border-t border-terminal-amber/20">
                    <div className="font-terminal text-terminal-amber/60 text-xs">
                      last modified: {new Date().toLocaleDateString()} | size: {project.tech.length} modules
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          {/* Terminal Prompt */}
          <ScrollReveal delay={0.5}>
            <motion.div 
              className="mt-12 bg-terminal-black/30 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-4"
              whileHover={{ borderColor: 'rgba(255, 176, 0, 0.6)' }}
            >
              <div className="font-terminal text-terminal-amber flex items-center space-x-2">
                <span className="text-terminal-green">user</span>
                <span className="text-white">:</span>
                <span className="text-blue-400">~/projects</span>
                <span className="text-white">$</span>
                <span className="text-terminal-amber/80">
                  git status # Ready for collaboration
                </span>
                <motion.span
                  className="w-2 h-5 bg-terminal-amber ml-2"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                />
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

export default TerminalProjects
