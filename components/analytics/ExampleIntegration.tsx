'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  UserAnalyticsProvider, 
  AnalyticsEnhancedSection, 
  ABTestVariant,
  ProgressiveDisclosureWrapper,
  ProgressiveText,
  CognitiveLoadIndicator,
  useAnalytics
} from '@/components/analytics'

// Example Hero Section with A/B Testing
function HeroSectionControl() {
  const analytics = useAnalytics()
  
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Full-Stack Developer</h1>
      <p className="text-xl text-gray-600 mb-8">
        Building modern web applications with passion and precision
      </p>
      <button 
        onClick={() => analytics.trackConversion('contact')}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
      >
        Get In Touch
      </button>
    </div>
  )
}

function HeroSectionVariant() {
  const analytics = useAnalytics()
  
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4 text-gradient">
        🚀 Elite Full-Stack Developer
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Transform your ideas into powerful digital solutions - Limited availability!
      </p>
      <button 
        onClick={() => analytics.trackConversion('contact')}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
      >
        🔥 Start Your Project Now
      </button>
    </div>
  )
}

// Example About Section with Progressive Disclosure
function AboutSectionExample() {
  return (
    <ProgressiveDisclosureWrapper
      contentId="about_skills"
      section="about"
      title="Skills & Technologies"
      showControls={true}
    >
      <ProgressiveText
        basic="I'm a full-stack developer with expertise in modern web technologies."
        intermediate="I specialize in React, Node.js, and Python, with experience in building scalable applications."
        advanced="My tech stack includes React, Next.js, TypeScript, Node.js, Express, Python, FastAPI, PostgreSQL, MongoDB, Docker, and AWS."
        expert="I have deep expertise in microservices architecture, system design, performance optimization, and DevOps practices including CI/CD, monitoring, and infrastructure as code."
        className="text-gray-700 dark:text-gray-300"
      />
    </ProgressiveDisclosureWrapper>
  )
}

// Main Portfolio Page with Analytics Integration
function AnalyticsEnabledPortfolio() {
  return (
    <UserAnalyticsProvider
      enableAnalytics={true}
      enableDashboard={true}
      enableTriggers={true}
      enableProgressive={true}
      developmentMode={process.env.NODE_ENV === 'development'}
    >
      <div className="min-h-screen bg-white dark:bg-gray-900">
        
        {/* Cognitive Load Indicator (visible in dev mode) */}
        <CognitiveLoadIndicatorWrapper />
        
        {/* Hero Section with A/B Testing */}
        <AnalyticsEnhancedSection 
          id="hero" 
          className="py-20 px-4"
          enableProgressive={false}
        >
          <div className="max-w-4xl mx-auto">
            <ABTestVariant
              testId="hero_section_cta"
              controlComponent={HeroSectionControl}
              variantComponents={{
                'variant_urgent': HeroSectionVariant
              }}
            />
          </div>
        </AnalyticsEnhancedSection>

        {/* About Section with Progressive Disclosure */}
        <AnalyticsEnhancedSection 
          id="about" 
          className="py-20 px-4 bg-gray-50 dark:bg-gray-800"
          enableProgressive={true}
          progressiveContentId="about_skills"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">About Me</h2>
            <AboutSectionExample />
          </div>
        </AnalyticsEnhancedSection>

        {/* Projects Section */}
        <AnalyticsEnhancedSection 
          id="projects" 
          className="py-20 px-4"
          enableProgressive={true}
          progressiveContentId="project_details"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
            <ProjectsWithAnalytics />
          </div>
        </AnalyticsEnhancedSection>

        {/* Experience Section */}
        <AnalyticsEnhancedSection 
          id="experience" 
          className="py-20 px-4 bg-gray-50 dark:bg-gray-800"
          enableProgressive={true}
          progressiveContentId="experience_details"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Experience</h2>
            <ExperienceWithAnalytics />
          </div>
        </AnalyticsEnhancedSection>

        {/* Contact Section */}
        <AnalyticsEnhancedSection 
          id="contact" 
          className="py-20 px-4"
          enableProgressive={true}
          progressiveContentId="contact_methods"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
            <ContactWithAnalytics />
          </div>
        </AnalyticsEnhancedSection>
      </div>
    </UserAnalyticsProvider>
  )
}

// Cognitive Load Indicator Wrapper
function CognitiveLoadIndicatorWrapper() {
  const analytics = useAnalytics()
  
  if (!analytics.isDashboardVisible) return null
  
  return (
    <div className="fixed top-4 right-4 z-30">
      <CognitiveLoadIndicator 
        load={analytics.cognitiveLoad} 
        className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg"
      />
    </div>
  )
}

// Projects with Analytics Tracking
function ProjectsWithAnalytics() {
  const analytics = useAnalytics()
  
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with real-time inventory management',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
      demoUrl: 'https://demo.example.com',
      githubUrl: 'https://github.com/example/project'
    },
    {
      id: 2,
      title: 'DevOps Automation Suite',
      description: 'CI/CD pipeline automation with infrastructure as code',
      tech: ['Python', 'Terraform', 'AWS', 'Docker'],
      githubUrl: 'https://github.com/example/devops'
    }
  ]

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded"
              >
                {tech}
              </span>
            ))}
          </div>
          
          <div className="flex space-x-4">
            {project.demoUrl && (
              <button
                onClick={() => {
                  analytics.trackConversion('project_view')
                  window.open(project.demoUrl, '_blank')
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Live Demo
              </button>
            )}
            <button
              onClick={() => {
                analytics.trackConversion('project_view')
                window.open(project.githubUrl, '_blank')
              }}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              GitHub
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Experience with Analytics
function ExperienceWithAnalytics() {
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-2">Software Engineering Intern</h3>
        <p className="text-blue-600 mb-2">TechCorp • San Francisco, CA</p>
        <p className="text-gray-500 mb-4">June 2024 - August 2024</p>
        
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li>• Developed microservices architecture serving 100k+ users</li>
          <li>• Implemented CI/CD pipelines reducing deployment time by 60%</li>
          <li>• Built automated testing suite achieving 95% code coverage</li>
        </ul>
      </div>
    </div>
  )
}

// Contact with Analytics
function ContactWithAnalytics() {
  const analytics = useAnalytics()
  
  return (
    <div className="max-w-md mx-auto">
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Ready to work together? Let's create something amazing!
      </p>
      
      <div className="space-y-4">
        <button
          onClick={() => {
            analytics.trackConversion('contact')
            window.location.href = 'mailto:your@email.com'
          }}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Send Email
        </button>
        
        <button
          onClick={() => {
            analytics.trackConversion('social_follow')
            window.open('https://linkedin.com/in/yourprofile', '_blank')
          }}
          className="w-full border border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          Connect on LinkedIn
        </button>
      </div>
    </div>
  )
}

// Usage Example Component
export function UserJourneyAnalyticsExample() {
  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">User Journey Analytics Demo</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            This page demonstrates the comprehensive user journey analysis system with:
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="font-semibold text-blue-600 mb-2">📊 Journey Tracking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Real-time user behavior analysis and psychological profiling
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="font-semibold text-purple-600 mb-2">🧠 Psychological Triggers</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Smart triggers based on user behavior and psychology
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="font-semibold text-green-600 mb-2">👁️ Progressive Disclosure</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cognitive load management with adaptive content revelation
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="font-semibold text-orange-600 mb-2">🔬 A/B Testing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Built-in experimentation framework for optimization
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">How to Use</h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p><strong>Development Mode:</strong> Press Ctrl+Shift+A to toggle analytics dashboard</p>
            <p><strong>Trigger Testing:</strong> Press Ctrl+Shift+T to test psychological triggers</p>
            <p><strong>Progressive Content:</strong> Scroll and interact to see content disclosure in action</p>
            <p><strong>A/B Testing:</strong> Different users will see different versions of content</p>
          </div>
        </div>
      </div>
      
      <AnalyticsEnabledPortfolio />
    </div>
  )
}

export default AnalyticsEnabledPortfolio
