'use client'

import { Suspense, lazy, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Critical path components (load immediately)
import { TerminalNavigation } from '@/components/terminal-navigation'
import { ScrollTransition } from '@/components/scroll-transition'

// Performance-optimized lazy loading
const RetroBootHero = lazy(() => import('@/components/retro-boot-hero'))
const TerminalSection = lazy(() => import('@/components/terminal-section'))
const TerminalAbout = lazy(() => import('@/components/terminal-about'))
const RetroProjects = lazy(() => import('@/components/retro-projects'))
const Contact = lazy(() => import('@/components/contact').then(m => ({ default: m.Contact })))
const TerminalFooter = lazy(() => import('@/components/terminal-footer'))

// Heavy 3D components - load only when needed
const SkillTree3D = lazy(() => import('@/components/3d-skill-tree').then(m => ({ default: m.SkillTree3D })))
const CRTMonitorSection = lazy(() => import('@/components/crt-monitor/CRTMonitorSection'))

// Analytics - load last
const ClientOnlyAnalytics = lazy(() => import('@/components/analytics/ClientOnlyAnalytics').then(m => ({ default: m.ClientOnlyAnalytics })))

// Performance loading states
const HeroSkeleton = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="text-green-400 font-mono text-xl"
    >
      Initializing system...
    </motion.div>
  </div>
)

const SectionSkeleton = () => (
  <div className="py-20 px-4">
    <div className="max-w-2xl mx-auto">
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="space-y-4"
      >
        <div className="h-8 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </motion.div>
    </div>
  </div>
)

const Heavy3DSkeleton = () => (
  <div className="py-20 px-4">
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="space-y-4"
      >
        <div className="h-12 bg-gray-700 rounded mb-8"></div>
        <div className="h-64 bg-gray-800 rounded-lg border border-gray-600 flex items-center justify-center">
          <div className="text-green-400 font-mono">Loading 3D Experience...</div>
        </div>
      </motion.div>
    </div>
  </div>
)

export default function HomePage() {
  const [loadPhase, setLoadPhase] = useState(1)
  const [isVisible, setIsVisible] = useState(false)

  // Progressive loading strategy
  useEffect(() => {
    setIsVisible(true)
    
    // Phase 2: Load secondary content after hero
    const timer1 = setTimeout(() => setLoadPhase(2), 2000)
    
    // Phase 3: Load heavy 3D content
    const timer2 = setTimeout(() => setLoadPhase(3), 4000)
    
    // Phase 4: Load analytics last
    const timer3 = setTimeout(() => setLoadPhase(4), 6000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="min-h-screen bg-black text-terminal-amber">
      {/* Phase 4: Analytics Wrapper */}
      {loadPhase >= 4 ? (
        <Suspense fallback={<div>Loading analytics...</div>}>
          <ClientOnlyAnalytics
            enableAnalytics={true}
            enableDashboard={process.env.NODE_ENV === 'development'}
            enableTriggers={true}
            developmentMode={process.env.NODE_ENV === 'development'}
          >
            <MainContent loadPhase={loadPhase} />
          </ClientOnlyAnalytics>
        </Suspense>
      ) : (
        <MainContent loadPhase={loadPhase} />
      )}
    </div>
  )
}

function MainContent({ loadPhase }: { loadPhase: number }) {
  return (
    <>
      {/* Critical Navigation - Always load first */}
      <TerminalNavigation />

      {/* Phase 1: Hero Section */}
      <ScrollTransition>
        <Suspense fallback={<HeroSkeleton />}>
          <RetroBootHero 
            name="Rajin Uddin"
            roles={["Software Engineer", "Digital Designer", "Full-Stack Developer"]}
            systemName="rajin-linux"
          />
        </Suspense>
      </ScrollTransition>

      {/* Phase 2: Core Content */}
      {loadPhase >= 2 && (
        <>
          <Suspense fallback={<SectionSkeleton />}>
            <TerminalAbout />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <TerminalSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <RetroProjects />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <Contact />
          </Suspense>
        </>
      )}

      {/* Phase 3: Heavy 3D Content */}
      {loadPhase >= 3 && (
        <>
          <Suspense fallback={<Heavy3DSkeleton />}>
            <SkillTree3D />
          </Suspense>

          <Suspense fallback={<Heavy3DSkeleton />}>
            <CRTMonitorSection
              title="Photorealistic CRT Monitor Experience"
              description="Experience the most advanced CRT monitor simulation ever created."
              showControls={true}
              height="800px"
              className="py-20 bg-gradient-to-b from-gray-900 to-black"
            />
          </Suspense>
        </>
      )}

      {/* Footer */}
      {loadPhase >= 2 && (
        <Suspense fallback={<SectionSkeleton />}>
          <TerminalFooter />
        </Suspense>
      )}
    </>
  )
}
