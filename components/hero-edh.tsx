'use client'

import { motion } from 'framer-motion'
import { portfolioData } from '../data/portfolio'

export function HeroEdh() {
  const { personal } = portfolioData

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl mx-auto">
        {/* Intro text - small and elegant with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-gray-600 dark:text-gray-400 mb-4 font-light"
          >
            Hi there, I'm
          </motion.p>
          
          {/* Large name - Ed.dev style with enhanced entrance */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-white mb-8 leading-none"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
            >
              {personal.name.split(' ')[0]}
            </motion.span>
          </motion.h1>
          
          {/* Role bullets - exactly like Ed's with enhanced stagger */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="space-y-2 mb-12"
          >
            {personal.roles.map((role, index) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 1.2 + index * 0.15, 
                  duration: 0.6,
                  ease: "easeOut" 
                }}
                className="flex items-center text-lg text-gray-700 dark:text-gray-300"
              >
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 1.2 + index * 0.15 + 0.3, 
                    duration: 0.3,
                    type: "spring",
                    stiffness: 200
                  }}
                  className="text-gray-400 mr-3"
                >
                  •
                </motion.span>
                <span className="font-medium">{role}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bio section - large heading like Ed's with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight"
          >
            Hi there
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
          >
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4, duration: 0.6 }}
            >
              My name is {personal.name}, I'm a {personal.title.toLowerCase()} with a passion for building scalable web applications and automating workflows. Currently pursuing a BS in Computer Science with a focus on software engineering and cloud technologies.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6, duration: 0.6 }}
            >
              In addition to my love of technology and programming, I am also interested in open source development, DevOps practices, and creating tools that make developers' lives easier.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8, duration: 0.6 }}
            >
              Below are details of some of the projects I have developed throughout my journey in computer science and software development.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Enhanced scroll indicator with smooth animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.0, duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex flex-col items-center">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.2, duration: 0.4 }}
              className="text-sm text-gray-500 dark:text-gray-400 mb-2"
            >
              Scroll to explore
            </motion.span>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3.4, duration: 0.4 }}
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut",
                  repeatDelay: 0.5
                }}
                className="w-6 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center"
              >
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    ease: "easeInOut",
                    repeatDelay: 0.5
                  }}
                  className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
