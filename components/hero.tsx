'use client'

import { motion } from 'framer-motion'
import { portfolioData } from '../data/portfolio'

export function Hero() {
  const { personal } = portfolioData

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl mx-auto">
        {/* Intro text - small and elegant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4 font-light">
            Hi there, I'm
          </p>
          
          {/* Large name - Ed.dev style */}
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-white mb-8 leading-none">
            {personal.name.split(' ')[0]}
          </h1>
          
          {/* Role bullets - exactly like Ed's */}
          <div className="space-y-2 mb-12">
            {personal.roles.map((role, index) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center text-lg text-gray-700 dark:text-gray-300"
              >
                <span className="text-gray-400 mr-3">•</span>
                <span className="font-medium">{role}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bio section - large heading like Ed's */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
            Hi there
          </h2>
          
          <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              My name is {personal.name}, I'm a {personal.title.toLowerCase()} with a passion for building scalable web applications and automating workflows. Currently pursuing a BS in Computer Science with a focus on software engineering and cloud technologies.
            </p>
            <p>
              In addition to my love of technology and programming, I am also interested in open source development, DevOps practices, and creating tools that make developers' lives easier.
            </p>
            <p>
              Below are details of some of the projects I have developed throughout my journey in computer science and software development.
            </p>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex flex-col items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-6 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
            {personal.bio}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center space-x-6 mb-8"
        >
          {social.map((link, index) => {
            const Icon = iconMap[link.icon as keyof typeof iconMap] || ExternalLink
            return (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label={link.name}
              >
                <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </motion.a>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            View My Work
          </button>
          <a
            href={`mailto:${personal.email}`}
            className="btn-secondary"
          >
            Get In Touch
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full mx-auto flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
