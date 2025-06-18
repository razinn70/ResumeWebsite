import { Suspense, lazy } from 'react'
import { ErrorBoundary } from '@/components/error-boundary'
import { RetroBootHero } from '@/components/retro-boot-hero'
import { TerminalNavigation } from '@/components/terminal-navigation'
import { ScrollTransition, ScrollReveal } from '@/components/scroll-transition'
import { RetroThemeToggle } from '@/components/retro-theme-toggle'

// Lazy load non-critical components for better performance
const RetroProjects = lazy(() => import('@/components/retro-projects'))
const TerminalAbout = lazy(() => import('@/components/terminal-about'))
const TerminalFooter = lazy(() => import('@/components/terminal-footer'))
const Contact = lazy(() => import('@/components/contact').then(m => ({ default: m.Contact })))
const Skills = lazy(() => import('@/components/skills-fixed'))

// Structured data for SEO
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
  "knowsAbout": ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python"],
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "University Name"
  }
}

// Loading fallback component
const SectionSkeleton = () => (
  <div className="py-20 px-4" role="status" aria-label="Loading content">
    <div className="max-w-2xl mx-auto animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  </div>
)

export default function Home() {
  return (
    <>
      {/* Skip navigation for accessibility */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />      <TerminalNavigation />
      
      {/* Retro Theme Toggle */}
      <RetroThemeToggle />
      
      <main id="main-content">
        {/* Terminal Hero Section - loads immediately */}
        <ScrollTransition>
          <ErrorBoundary fallback={<div>Error loading terminal</div>}>
            <RetroBootHero 
              name="Rajin Uddin"
              roles={["Software Engineer", "Digital Designer", "Full-Stack Developer"]}
              systemName="rajin-linux"
            />
          </ErrorBoundary>
        </ScrollTransition>

        {/* Lazy load below-the-fold sections */}        <ScrollReveal>
          <ErrorBoundary fallback={<div>Error loading about section</div>}>
            <Suspense fallback={<SectionSkeleton />}>
              <TerminalAbout />
            </Suspense>
          </ErrorBoundary>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <ErrorBoundary fallback={<div>Error loading skills section</div>}>
            <Suspense fallback={<SectionSkeleton />}>
              <Skills />
            </Suspense>
          </ErrorBoundary>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <ErrorBoundary fallback={<div>Error loading projects section</div>}>
            <Suspense fallback={<SectionSkeleton />}>
              <RetroProjects />
            </Suspense>
          </ErrorBoundary>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <ErrorBoundary fallback={<div>Error loading contact section</div>}>
            <Suspense fallback={<SectionSkeleton />}>
              <Contact />
            </Suspense>
          </ErrorBoundary>
        </ScrollReveal>
      </main>      <ErrorBoundary fallback={<div>Error loading footer</div>}>
        <Suspense fallback={<SectionSkeleton />}>
          <TerminalFooter />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}
