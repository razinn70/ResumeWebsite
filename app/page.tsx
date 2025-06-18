import { Suspense, lazy } from 'react'
import { Metadata } from 'next'
import { Hero } from '@/components/hero'
import { Navigation } from '@/components/navigation'
import { ErrorBoundary } from '@/components/error-boundary'

// Lazy load non-critical components for better performance
const Projects = lazy(() => import('@/components/projects'))
const About = lazy(() => import('@/components/about').then(m => ({ default: m.About })))
const Contact = lazy(() => import('@/components/contact').then(m => ({ default: m.Contact })))
const Footer = lazy(() => import('@/components/footer').then(m => ({ default: m.Footer })))
const Skills = lazy(() => import('../components/skills'))

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
      />

      <Navigation />
      
      <main id="main-content">
        {/* Hero loads immediately - critical above-the-fold content */}
        <ErrorBoundary fallback={<div>Error loading hero section</div>}>
          <Hero />
        </ErrorBoundary>        {/* Lazy load below-the-fold sections */}
        <ErrorBoundary fallback={<div>Error loading about section</div>}>
          <Suspense fallback={<SectionSkeleton />}>
            <About />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<div>Error loading skills section</div>}>
          <Suspense fallback={<SectionSkeleton />}>
            <Skills />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<div>Error loading projects section</div>}>
          <Suspense fallback={<SectionSkeleton />}>
            <Projects />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<div>Error loading contact section</div>}>
          <Suspense fallback={<SectionSkeleton />}>
            <Contact />
          </Suspense>
        </ErrorBoundary>
      </main>

      <ErrorBoundary fallback={<div>Error loading footer</div>}>
        <Suspense fallback={<SectionSkeleton />}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}
