import { Suspense, lazy } from 'react'
import { Metadata } from 'next'
import { Hero } from '@/components/hero'
import NavigationEdh from '@/components/navigation-edh'
import { ErrorBoundary } from '../components/error-boundary'

// Lazy load non-critical components for better performance
const Projects = lazy(() => import('@/components/projects-edh').then(m => ({ default: m.Projects })))
const AboutEdh = lazy(() => import('@/components/about-edh').then(m => ({ default: m.AboutEdh })))
const ContactEdh = lazy(() => import('@/components/contact-edh').then(m => ({ default: m.ContactEdh })))
const FooterEdh = lazy(() => import('@/components/footer-edh').then(m => ({ default: m.FooterEdh })))

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
      </a>

      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <NavigationEdh />
      
      <main id="main-content">
        {/* Hero loads immediately - critical above-the-fold content */}
        <ErrorBoundary fallback={<div>Error loading hero section</div>}>
          <Hero />
        </ErrorBoundary>

        {/* Lazy load below-the-fold sections */}
        <ErrorBoundary fallback={<div>Error loading about section</div>}>
          <Suspense fallback={<SectionSkeleton />}>
            <AboutEdh />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<div>Error loading projects section</div>}>
          <Suspense fallback={<SectionSkeleton />}>
            <Projects />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<div>Error loading contact section</div>}>
          <Suspense fallback={<SectionSkeleton />}>
            <ContactEdh />
          </Suspense>
        </ErrorBoundary>
      </main>

      <ErrorBoundary fallback={<div>Error loading footer</div>}>
        <Suspense fallback={<SectionSkeleton />}>
          <FooterEdh />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}
