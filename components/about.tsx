'use client'

import { motion } from 'framer-motion'
import { portfolioData } from '../data/portfolio'

export function About() {
  const { experience, education, skills } = portfolioData

  return (
    <section id="about" className="section">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-heading">About Me</h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-serif font-semibold mb-6 text-gray-900 dark:text-white">
                Experience
              </h3>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="border-l-4 border-primary-500 pl-6"
                  >
                    <div className="mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {exp.title}
                      </h4>
                      <p className="text-primary-600 dark:text-primary-400 font-medium">
                        {exp.company} • {exp.location}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </p>
                    </div>
                    <ul className="text-gray-600 dark:text-gray-300 space-y-1 mb-3">
                      {exp.description.map((desc, i) => (
                        <li key={i} className="text-sm">
                          • {desc}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1">
                      {exp.technologies.map((tech) => (
                        <span key={tech} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-serif font-semibold mb-6 text-gray-900 dark:text-white">
                Education
              </h3>
              <div className="space-y-6 mb-8">
                {education.map((edu, index) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="border-l-4 border-primary-500 pl-6"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {edu.degree}
                    </h4>
                    <p className="text-primary-600 dark:text-primary-400 font-medium">
                      {edu.school} • {edu.location}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {edu.startDate} - {edu.endDate || 'Present'}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </p>
                    {edu.achievements && (
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        {edu.achievements.map((achievement, i) => (
                          <li key={i}>• {achievement}</li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </div>

              <h3 className="text-2xl font-serif font-semibold mb-6 text-gray-900 dark:text-white">
                Skills
              </h3>
              <div className="space-y-4">
                {skills.map((skillGroup, index) => (
                  <motion.div
                    key={skillGroup.category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                      {skillGroup.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((skill) => (
                        <span key={skill} className="tech-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700 max-w-6xl mx-auto" />
    </section>
  )
}
