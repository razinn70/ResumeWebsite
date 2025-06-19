import { Suspense, lazy } from 'react'
import { ErrorBoundary } from '@/components/error-boundary'
import RetroBootHero from '@/components/retro-boot-hero'
import { TerminalNavigation } from '@/components/terminal-navigation'
import { ScrollTransition, ScrollReveal } from '@/components/scroll-transition'
import { RetroThemeToggle } from '@/components/retro-theme-toggle'
import TerminalSection from '@/components/terminal-section'
import CRTMonitorSection from '@/components/crt-monitor/CRTMonitorSection'

// Analytics Components
import { 
  AnalyticsEnhancedSection,
  ABTestVariant,
  ProgressiveDisclosureWrapper,
  EmotionalResonanceProvider,
  AttentionHeatmapTracker
} from '@/components/analytics'
import { ClientOnlyAnalytics } from '@/components/analytics/ClientOnlyAnalytics'

// Lazy load non-critical components for better performance
const RetroProjects = lazy(() => import('@/components/retro-projects'))
const TerminalAbout = lazy(() => import('@/components/terminal-about'))
const TerminalFooter = lazy(() => import('@/components/terminal-footer'))
const Contact = lazy(() => import('@/components/contact').then(m => ({ default: m.Contact })))
const SkillTree3D = lazy(() => import('@/components/3d-skill-tree').then(m => ({ default: m.SkillTree3D })))

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

export default function Home() {  return (
    <ClientOnlyAnalytics
      enableAnalytics={true}
      enableDashboard={process.env.NODE_ENV === 'development'}      enableTriggers={true}
      enableProgressive={true}
      developmentMode={process.env.NODE_ENV === 'development'}
    >
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
      
      <TerminalNavigation />
      
      {/* Retro Theme Toggle */}
      <RetroThemeToggle />      <main id="main-content">
        {/* Attention Heatmap Tracker */}
        <AttentionHeatmapTracker 
          enabled={true}
          showVisualization={process.env.NODE_ENV === 'development'}
          sensitivity={1.2}
          className="fixed inset-0 pointer-events-none z-40"
        />

        {/* Terminal Hero Section - loads immediately */}
        <ScrollTransition>
          <ErrorBoundary fallback={<div>Error loading terminal</div>}>
            <EmotionalResonanceProvider
              section="hero"
              targetEmotion="curiosity"
              className="section-hero"
            >
              <RetroBootHero 
                name="Rajin Uddin"
                roles={["Software Engineer", "Digital Designer", "Full-Stack Developer"]}
                systemName="rajin-linux"
              />
            </EmotionalResonanceProvider>
          </ErrorBoundary>
        </ScrollTransition>        {/* About Section with Analytics */}
        <ScrollReveal>
          <ErrorBoundary fallback={<div>Error loading about section</div>}>
            <AnalyticsEnhancedSection
              id="about"
              className="section-about"
              enableProgressive={true}
              progressiveContentId="about-content"
            >
              <EmotionalResonanceProvider
                section="about"
                targetEmotion="trust"
                className="section-about-emotional"
              >
                <ProgressiveDisclosureWrapper
                  contentId="about-content"
                  section="about"
                  title="About Me"
                  showControls={process.env.NODE_ENV === 'development'}
                >
                  <Suspense fallback={<SectionSkeleton />}>
                    <TerminalAbout />
                  </Suspense>
                </ProgressiveDisclosureWrapper>
              </EmotionalResonanceProvider>
            </AnalyticsEnhancedSection>
          </ErrorBoundary>
        </ScrollReveal>        {/* Skills Section with A/B Testing */}
        <ScrollReveal delay={0.1}>
          <ErrorBoundary fallback={<div>Error loading skills section</div>}>
            <AnalyticsEnhancedSection
              id="skills"
              className="section-skills"
              enableProgressive={false}
            >
              <EmotionalResonanceProvider
                section="skills"
                targetEmotion="admiration"
                className="section-skills-emotional"
              >
                <Suspense fallback={<SectionSkeleton />}>
                  <SkillTree3D />
                </Suspense>
              </EmotionalResonanceProvider>
            </AnalyticsEnhancedSection>
          </ErrorBoundary>
        </ScrollReveal>{/* CRT Monitor Section - Advanced 3D CRT simulation with Analytics */}
        <ScrollReveal delay={0.15}>
          <ErrorBoundary fallback={<div>Error loading CRT monitor section</div>}>
            <AnalyticsEnhancedSection
              id="crt-experience"
              className="section-crt"
              enableProgressive={false}
            >
              <Suspense fallback={<SectionSkeleton />}>
                <CRTMonitorSection
                  title="Photorealistic CRT Monitor Experience"
                  description="Experience the most advanced CRT monitor simulation ever created. Features authentic physics, real phosphor persistence, magnetic field effects, and environmental integration."
                  showControls={true}
                  height="800px"
                  className="py-20 bg-gradient-to-b from-gray-900 to-black"
                />
              </Suspense>
            </AnalyticsEnhancedSection>
          </ErrorBoundary>
        </ScrollReveal>

        {/* Terminal Section - integrated into the main page structure */}
        <Suspense fallback={<div className="h-96 bg-gray-900 animate-pulse" />}>
          <TerminalSection />
        </Suspense>        {/* Projects Section with Analytics */}
        <ScrollReveal delay={0.2}>
          <ErrorBoundary fallback={<div>Error loading projects section</div>}>
            <AnalyticsEnhancedSection
              id="projects"
              className="section-projects"
              enableProgressive={true}
              progressiveContentId="projects-content"
            >
              <EmotionalResonanceProvider
                section="projects"
                targetEmotion="admiration"
                className="section-projects-emotional"
              >
                <ProgressiveDisclosureWrapper
                  contentId="projects-content"
                  section="projects"
                  title="Featured Projects"
                  showControls={process.env.NODE_ENV === 'development'}
                >
                  <Suspense fallback={<SectionSkeleton />}>
                    <RetroProjects />
                  </Suspense>
                </ProgressiveDisclosureWrapper>
              </EmotionalResonanceProvider>
            </AnalyticsEnhancedSection>
          </ErrorBoundary>
        </ScrollReveal>

        {/* Contact Section with Analytics */}
        <ScrollReveal delay={0.3}>
          <ErrorBoundary fallback={<div>Error loading contact section</div>}>
            <AnalyticsEnhancedSection
              id="contact"
              className="section-contact"
              enableProgressive={false}
            >
              <EmotionalResonanceProvider
                section="contact"
                targetEmotion="confidence"
                className="section-contact-emotional"
              >
                <Suspense fallback={<SectionSkeleton />}>
                  <Contact />
                </Suspense>
              </EmotionalResonanceProvider>
            </AnalyticsEnhancedSection>
          </ErrorBoundary>
        </ScrollReveal></main>      
      
      <ErrorBoundary fallback={<div>Error loading footer</div>}>
        <Suspense fallback={<SectionSkeleton />}>
          <TerminalFooter />        </Suspense>
      </ErrorBoundary>
    </ClientOnlyAnalytics>
  )
}
