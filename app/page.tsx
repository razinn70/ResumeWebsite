'use client'

import { Suspense, lazy, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Core components that must load immediately
import { TerminalNavigation } from '@/components/terminal-navigation'
import { RetroThemeToggle } from '@/components/retro-theme-toggle'

// Lazy load ALL heavy components for aggressive bundle reduction
const RetroBootHero = lazy(() => import('@/components/retro-boot-hero'))
const RetroProjects = lazy(() => import('@/components/retro-projects'))
const TerminalAbout = lazy(() => import('@/components/terminal-about'))
const TerminalSection = lazy(() => import('@/components/terminal-section'))
const TerminalFooter = lazy(() => import('@/components/terminal-footer'))
const Contact = lazy(() => import('@/components/contact').then(m => ({ default: m.Contact })))

// Dynamic imports with loading states (no SSR)
const CRTMonitorSection = dynamic(() => import('@/components/crt-monitor/CRTMonitorSection'), {
  ssr: false,
  loading: () => <div className="h-96 bg-black flex items-center justify-center text-green-400">Loading 3D Monitor...</div>
})

const SkillTree3D = dynamic(() => import('@/components/3d-skill-tree/SkillTree3DRobust'), {
  ssr: false,
  loading: () => <div className="h-96 bg-black flex items-center justify-center text-green-400">Loading 3D Skills...</div>
})

// Analytics - Load only when needed
const RobustAnalyticsProvider = dynamic(() => 
  import('@/components/analytics/RobustAnalytics').then(mod => ({ default: mod.RobustAnalyticsProvider })), 
  { ssr: false }
)

const AnalyticsTrackers = dynamic(() => 
  import('@/components/analytics/RobustAnalytics').then(mod => ({
    default: function AnalyticsTrackers() {
      const { usePerformanceTracking, useErrorTracking } = mod
      usePerformanceTracking()
      useErrorTracking()
      return null
    }
  })), 
  { ssr: false }
)

const AnalyticsWrapper = dynamic(() => 
  import('@/components/analytics/AnalyticsWrapper').then(mod => ({ default: mod.AnalyticsWrapper })), 
  { ssr: false }
)

// Transitions - Load only when needed
const ScrollTransition = dynamic(() => 
  import('@/components/scroll-transition').then(mod => ({ default: mod.ScrollTransition })), 
  { ssr: false }
)

const ScrollReveal = dynamic(() => 
  import('@/components/scroll-transition').then(mod => ({ default: mod.ScrollReveal })), 
  { ssr: false }
)

// Minimal loading component
const MinimalLoader = () => (
  <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-pulse text-2xl mb-4">Loading...</div>
      <div className="w-32 h-1 bg-green-400 animate-pulse"></div>
    </div>
  </div>
)

// SEO structured data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Rajin Uddin",
  "jobTitle": "Computer Science Student & Full-Stack Developer",
  "url": "https://rajinuddin.dev",
  "sameAs": [
    "https://github.com/rajinuddin",
    "https://linkedin.com/in/rajinuddin"
  ],
  "knowsAbout": ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python"]
}

export default function Home() {
  const [enableAnalytics, setEnableAnalytics] = useState(false)
  const [enable3D, setEnable3D] = useState(false)
  const [enableAdvanced, setEnableAdvanced] = useState(false)
  const isDev = process.env.NODE_ENV === 'development'

  // Progressive feature enablement based on user interaction
  useEffect(() => {
    const timer1 = setTimeout(() => setEnableAnalytics(true), 1000)
    const timer2 = setTimeout(() => setEnable3D(true), 2000)
    const timer3 = setTimeout(() => setEnableAdvanced(true), 3000)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <>
      {/* SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Skip navigation */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>
      
      {/* Core navigation - loads immediately */}
      <TerminalNavigation />
      <RetroThemeToggle />
        {/* Analytics Provider - loads after 1s */}
      {enableAnalytics && (
        <Suspense>
          <RobustAnalyticsProvider 
            config={{ 
              enabled: true, 
              debug: isDev,
              privacyMode: true 
            }}
          >
            <AnalyticsTrackers />
          </RobustAnalyticsProvider>
        </Suspense>
      )}

      <main id="main-content">
        {/* Hero Section - Load first */}
        <Suspense fallback={<MinimalLoader />}>
          {enableAdvanced ? (
            <ScrollTransition>
              <RetroBootHero 
                name="Rajin Uddin"
                roles={["Software Engineer", "Digital Designer", "Full-Stack Developer"]}
                systemName="rajin-linux"
              />
            </ScrollTransition>
          ) : (
            <div className="min-h-screen flex items-center justify-center bg-black text-green-400">
              <div className="text-center max-w-2xl px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-pulse">Rajin Uddin</h1>
                <p className="text-xl md:text-2xl mb-8">Software Engineer & Full-Stack Developer</p>
                <div className="text-left font-mono text-sm md:text-base">
                  <p>$ whoami</p>
                  <p className="text-green-300">rajin-uddin</p>
                  <p>$ cat skills.txt</p>
                  <p className="text-green-300">JavaScript, TypeScript, React, Next.js, Node.js, Python...</p>
                </div>
              </div>
            </div>
          )}
        </Suspense>

        {/* About Section */}
        <Suspense fallback={<div className="h-96 bg-gray-900"></div>}>
          {enableAdvanced ? (
            <ScrollReveal>
              <TerminalAbout />
            </ScrollReveal>
          ) : (
            <TerminalAbout />
          )}
        </Suspense>        {/* Skills Section - 3D loads after 2s */}
        {enable3D && enableAnalytics && (
          <Suspense fallback={<div className="h-96 bg-black flex items-center justify-center text-green-400">Loading 3D Skills...</div>}>
            <AnalyticsWrapper sectionName="skill-tree-3d" trackVisibility={true}>
              <SkillTree3D />
            </AnalyticsWrapper>
          </Suspense>
        )}
        {enable3D && !enableAnalytics && (
          <Suspense fallback={<div className="h-96 bg-black flex items-center justify-center text-green-400">Loading 3D Skills...</div>}>
            <SkillTree3D />
          </Suspense>
        )}

        {/* Projects Section */}
        <Suspense fallback={<div className="h-96 bg-gray-900"></div>}>
          <RetroProjects />
        </Suspense>

        {/* Terminal Section */}
        <Suspense fallback={<div className="h-96 bg-black"></div>}>
          <TerminalSection />
        </Suspense>        {/* CRT Monitor - 3D loads after 2s */}
        {enable3D && enableAnalytics && (
          <Suspense fallback={<div className="h-96 bg-black flex items-center justify-center text-green-400">Loading CRT Monitor...</div>}>
            <AnalyticsWrapper sectionName="crt-monitor-3d" trackVisibility={true}>
              <CRTMonitorSection />
            </AnalyticsWrapper>
          </Suspense>
        )}
        {enable3D && !enableAnalytics && (
          <Suspense fallback={<div className="h-96 bg-black flex items-center justify-center text-green-400">Loading CRT Monitor...</div>}>
            <CRTMonitorSection />
          </Suspense>
        )}

        {/* Contact Section */}
        <Suspense fallback={<div className="h-96 bg-gray-900"></div>}>
          <Contact />
        </Suspense>

        {/* Footer */}
        <Suspense fallback={<div className="h-32 bg-black"></div>}>
          <TerminalFooter />
        </Suspense>
      </main>
    </>
  )
}
