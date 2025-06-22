'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  Clock, 
  Users, 
  Award, 
  Gift,
  CheckCircle,
  ArrowRight,
  X
} from 'lucide-react'

interface TriggerProps {
  trigger: any
  onClose?: () => void
  onConversion?: () => void
}

// Social Proof Notification Component
export function SocialProofNotification({ onClose, onConversion }: TriggerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed top-20 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Star className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              GitHub Activity
            </p>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            My projects have received 150+ stars from developers worldwide
          </p>
          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center text-xs text-gray-500">
              <Star className="w-3 h-3 mr-1" />
              150+ stars
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Users className="w-3 h-3 mr-1" />
              50+ forks
            </div>
          </div>
          <button
            onClick={() => {
              onConversion?.()
              window.open('https://github.com/rajinuddin', '_blank')
            }}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
          >
            View on GitHub
            <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Scarcity Notification Component
export function ScarcityNotification({ onClose, onConversion }: TriggerProps) {
  const [timeLeft, setTimeLeft] = React.useState(24 * 60 * 60) // 24 hours in seconds

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-lg p-4 max-w-md"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span className="font-semibold">Limited Availability</span>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-sm mb-3">
        I'm currently accepting only <strong>2 new projects</strong> this month due to high demand.
      </p>
      <div className="flex items-center justify-between">
        <div className="text-xs">
          Next availability: {formatTime(timeLeft)}
        </div>
        <button
          onClick={() => {
            onConversion?.()
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="bg-white text-orange-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
        >
          Contact Now
        </button>
      </div>
    </motion.div>
  )
}

// Authority Badge Component
export function AuthorityBadge({ onClose, onConversion }: TriggerProps) {
  const credentials = [
    'AWS Certified',
    'React Expert',
    'CS Degree',
    '3+ Years Experience'
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed bottom-20 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-xs"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-yellow-600" />
          <span className="font-semibold text-gray-900 dark:text-white">Credentials</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        {credentials.map((credential, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-gray-700 dark:text-gray-300">{credential}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          onConversion?.()
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="mt-3 w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
      >
        View Full Profile
      </button>
    </motion.div>
  )
}

// Reciprocity Modal Component
export function ReciprocityModal({ onClose, onConversion }: TriggerProps) {
  const freeResources = [
    'React Component Library',
    'API Best Practices Guide',
    'Deployment Automation Scripts',
    'Database Schema Templates'
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md mx-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Gift className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Free Developer Resources
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            As a thank you for visiting my portfolio, here are some free resources I've created:
          </p>
          
          <div className="space-y-3 mb-6">
            {freeResources.map((resource, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{resource}</span>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => {
                onConversion?.()
                // In a real implementation, this would trigger a download or redirect
                alert('Resources would be available for download!')
              }}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded font-medium hover:bg-green-700"
            >
              Download Free
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Maybe Later
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Trust Testimonials Component
export function TrustTestimonials({ onClose, onConversion }: TriggerProps) {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager',
      content: 'Rajin delivered exceptional results on our e-commerce platform. Highly recommended!',
      rating: 5
    },
    {
      name: 'Mike Rodriguez',
      role: 'Tech Lead',
      content: 'Outstanding problem-solving skills and attention to detail. Great to work with.',
      rating: 5
    }
  ]

  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 dark:text-white">Client Feedback</h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}        >
          <div className="mb-3">
            <div className="flex items-center mb-2">
              {testimonials[currentIndex] && [...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              "{testimonials[currentIndex]?.content}"
            </p>
          </div>
          <div className="text-xs">
            <div className="font-medium text-gray-900 dark:text-white">
              {testimonials[currentIndex]?.name}
            </div>
            <div className="text-gray-500">
              {testimonials[currentIndex]?.role}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <button
        onClick={() => {
          onConversion?.()
          document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="mt-3 w-full text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center"
      >
        View All Testimonials
        <ArrowRight className="w-3 h-3 ml-1" />
      </button>
    </motion.div>
  )
}

// Commitment Timeline Component
export function CommitmentTimeline({ onClose, onConversion }: TriggerProps) {
  const commitments = [
    { phase: 'Discovery', duration: '1-2 weeks', description: 'Requirements & planning' },
    { phase: 'Development', duration: '4-8 weeks', description: 'Building & testing' },
    { phase: 'Delivery', duration: '1 week', description: 'Deployment & handover' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 max-w-md"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900 dark:text-white">Project Timeline</h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-4 mb-6">
        {commitments.map((commitment, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">{index + 1}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-gray-900 dark:text-white">{commitment.phase}</h5>
                <span className="text-sm text-blue-600 font-medium">{commitment.duration}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{commitment.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-800 dark:text-green-200">
            100% On-Time Delivery Guarantee
          </span>
        </div>
      </div>
      
      <button
        onClick={() => {
          onConversion?.()
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700"
      >
        Start Your Project
      </button>
    </motion.div>
  )
}

// Liking Highlight Component
export function LikingHighlight({ onClose, onConversion }: TriggerProps) {
  const sharedInterests = [
    'Clean Code',
    'System Design',
    'Open Source',
    'Continuous Learning'
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      className="fixed top-1/3 left-4 z-50 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow-lg p-4 max-w-xs"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">We Share Similar Values!</h4>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-sm mb-3 text-white/90">
        I noticed you're interested in quality development. We both value:
      </p>
      
      <div className="space-y-1 mb-4">
        {sharedInterests.map((interest, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">{interest}</span>
          </motion.div>
        ))}
      </div>
      
      <button
        onClick={() => {
          onConversion?.()
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="w-full bg-white text-purple-600 py-2 rounded font-medium hover:bg-gray-100"
      >
        Let's Connect!
      </button>
    </motion.div>
  )
}

// Main Psychological Trigger Renderer
export function PsychologicalTriggerRenderer({ triggers }: { triggers: any[] }) {
  const renderTrigger = (effect: any) => {
    const componentMap: Record<string, React.ComponentType<TriggerProps>> = {
      'SocialProofNotification': SocialProofNotification,
      'ScarcityNotification': ScarcityNotification,
      'AuthorityBadge': AuthorityBadge,
      'ReciprocityModal': ReciprocityModal,
      'TrustTestimonials': TrustTestimonials,
      'CommitmentTimeline': CommitmentTimeline,
      'LikingHighlight': LikingHighlight
    }
    
    const TriggerComponent = componentMap[effect.component]

    if (!TriggerComponent) return null

    return (
      <TriggerComponent
        key={effect.id}
        trigger={effect.props.trigger}
        onClose={effect.props.onClose}
        onConversion={effect.props.onConversion}
      />
    )
  }

  return (
    <div>
      {triggers.map(renderTrigger)}
    </div>
  )
}
