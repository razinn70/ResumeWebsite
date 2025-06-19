import { ProgressiveDisclosure } from '@/types/analytics'

/**
 * Progressive disclosure content configuration for portfolio sections
 * This defines how content is progressively revealed based on user engagement
 */

export const progressiveContentConfig: Record<string, ProgressiveDisclosure> = {
  'about-content': {
    id: 'about-content',
    section: 'about',
    level: 1,
    content: {
      basic: "Full-stack developer with expertise in modern web technologies. Computer Science student passionate about creating impactful solutions.",
      intermediate: "Proficient in JavaScript, TypeScript, React, Next.js, and Node.js. Experience with Python, databases, and cloud platforms. Strong background in UI/UX design.",
      advanced: "Active contributor to open-source projects. Believer in clean, maintainable code and user-centered design. Advocate for accessibility and inclusive technology.",
      expert: "Focus on delivering measurable business value through technology. Continuous learner exploring emerging technologies. Collaborative team player with strong communication skills."
    },
    triggers: {
      timeThreshold: 10000, // 10 seconds
      scrollThreshold: 0.5, // 50% of section viewed
      interactionCount: 2,
      returningVisitor: true
    },
    userPreference: 'progressive'
  },

  'projects-content': {
    id: 'projects-content',
    section: 'projects',
    level: 1,
    content: {
      basic: "Innovative web applications built with cutting-edge technologies. Focus on user experience, performance, and scalability.",
      intermediate: "Advanced React applications with complex state management. Full-stack solutions with modern backend architectures. 3D visualizations and interactive interfaces.",
      advanced: "Performance-optimized applications with advanced analytics. Comprehensive documentation and code architecture details.",
      expert: "Technical challenges overcome and lessons learned. Future enhancement roadmap and scalability considerations. User research findings and iterative design process."
    },
    triggers: {
      timeThreshold: 15000, // 15 seconds
      scrollThreshold: 0.6, // 60% of section viewed
      interactionCount: 3,
      returningVisitor: false
    },
    userPreference: 'progressive'
  }
}

/**
 * A/B Test configurations for different sections
 */
export const abTestConfigs = {
  'hero_section_layout': {
    id: 'hero_section_layout',
    name: 'Hero Section Layout Test',
    description: 'Testing different hero section layouts for engagement',
    variants: {
      control: { weight: 0.4, name: 'Standard Terminal' },
      variant_a: { weight: 0.3, name: 'Animated Boot Sequence' },
      variant_b: { weight: 0.3, name: 'Interactive Command Line' }
    },
    conversionGoal: 'scroll_past_hero',
    enabled: true
  },

  'projects_display': {
    id: 'projects_display',
    name: 'Projects Display Format Test',
    description: 'Testing different ways to showcase projects',
    variants: {
      control: { weight: 0.5, name: 'Grid Layout' },
      variant_a: { weight: 0.5, name: 'Carousel Format' }
    },
    conversionGoal: 'project_click',
    enabled: true
  },

  'contact_cta': {
    id: 'contact_cta',
    name: 'Contact CTA Test',
    description: 'Testing different contact call-to-action approaches',
    variants: {
      control: { weight: 0.4, name: 'Standard Form' },
      variant_a: { weight: 0.3, name: 'Interactive Terminal' },
      variant_b: { weight: 0.3, name: 'Quick Connect Options' }
    },
    conversionGoal: 'contact_initiation',
    enabled: true
  }
}

/**
 * Psychological trigger configurations for different sections
 */
export const triggerConfigs = {
  about: {
    social_proof: {
      enabled: true,
      threshold: 10,
      content: "Join 500+ developers who've connected"
    },
    authority: {
      enabled: true,
      threshold: 15,
      content: "Trusted by startups and established companies"
    }
  },
  projects: {
    social_proof: {
      enabled: true,
      threshold: 20,
      content: "Projects viewed by 1000+ professionals"
    },
    scarcity: {
      enabled: true,
      threshold: 30,
      content: "Limited availability for new projects"
    }
  },
  contact: {
    reciprocity: {
      enabled: true,
      threshold: 5,
      content: "Free consultation for serious inquiries"
    },
    commitment: {
      enabled: true,
      threshold: 25,
      content: "Let's build something amazing together"
    }
  }
}
