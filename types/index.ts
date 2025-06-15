export interface PersonalInfo {
  name: string
  title: string
  roles: string[]
  email: string
  location: string
  bio: string
  avatar?: string
}

export interface SocialLink {
  name: string
  url: string
  icon: string
}

export interface Technology {
  name: string
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'language' | 'tool'
  color?: string
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  year: number
  featured?: boolean
  liveUrl?: string
  githubUrl?: string
  image?: string
  status: 'completed' | 'in-progress' | 'archived'
}

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate?: string
  description: string[]
  technologies: string[]
  type: 'internship' | 'job' | 'freelance' | 'volunteer'
}

export interface Education {
  id: string
  degree: string
  school: string
  location: string
  startDate: string
  endDate?: string
  gpa?: string
  relevant_coursework?: string[]
  achievements?: string[]
}

export interface Skill {
  category: string
  items: string[]
}

export interface PortfolioData {
  personal: PersonalInfo
  social: SocialLink[]
  technologies: Technology[]
  projects: Project[]
  experience: Experience[]
  education: Education[]
  skills: Skill[]
}
