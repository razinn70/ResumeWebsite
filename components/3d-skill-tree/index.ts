// Export all 3D Skill Tree components
export { SkillTree3D } from './SkillTree3D'
export { CRTMonitor3D } from './CRTMonitor3D'
export { TerminalShell } from './TerminalShell'
export { SkillNode3D, Connection3D, SkillTooltip3D, CategoryHeader3D } from './SkillNodes3D'

// Type definitions
export interface Skill3D {
  id: string
  name: string
  level: number
  xp: number
  maxXp: number
  status: 'mastered' | 'learning' | 'planned'
  position: { x: number; y: number; z: number }
  glowColor: string
  particleEffect: string
  description: string
  projects: string[]
  certifications: string[]
  linkedTo: string[]
}

export interface SkillCategory3D {
  id: string
  name: string
  icon: string
  color: string
  glowIntensity: number
  position: { x: number; y: number; z: number }
  skills: Skill3D[]
  description: string
}
