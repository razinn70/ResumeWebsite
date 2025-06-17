'use client'

import { motion } from 'framer-motion'
import { portfolioData } from '../data/portfolio'

export function AboutEdh() {
  const { personal, skills } = portfolioData

  return (
    <section id="about" className="section px-4">
      <div className="max-w-2xl mx-auto">
        {/* Section heading - Ed.dev style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
            About
          </h2>
        </motion.div>

        {/* Bio paragraphs - large text like Ed's */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-8 mb-16"
        >
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            I'm a {personal.title.toLowerCase()} with a passion for building scalable web applications 
            and automating workflows. Currently pursuing a BS in Computer Science with a focus on 
            software engineering and cloud technologies.
          </p>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            My journey in technology began with curiosity about how websites work, which led me to 
            dive deep into full-stack development. I love the challenge of solving complex problems 
            and creating efficient, user-friendly solutions.
          </p>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            When I'm not coding, I enjoy exploring open source projects, contributing to developer 
            communities, and staying up-to-date with the latest technology trends. I believe in 
            continuous learning and sharing knowledge with others.
          </p>
        </motion.div>

        {/* Skills section - Ed.dev style with simple layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Skills & Technologies
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skillCategory, index) => (
              <motion.div
                key={skillCategory.category}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {skillCategory.category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skillCategory.items.map((skill) => (
                    <span
                      key={skill}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Current focus - Ed.dev style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Currently
          </h3>
          <div className="space-y-3 text-gray-600 dark:text-gray-300">
            <p>• Pursuing BS in Computer Science</p>
            <p>• Building full-stack applications with modern frameworks</p>
            <p>• Exploring cloud technologies and DevOps practices</p>
            <p>• Contributing to open source projects</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
