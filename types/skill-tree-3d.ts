import * as THREE from 'three';

/**
 * A single skill node in the 3D skill tree.
 */
export interface SkillNode3D {
  id: string;
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  status: 'mastered' | 'learning' | 'planned';
  position: { x: number; y: number; z: number };
  glowColor: string;
  particleEffect: string;
  description: string;
  projects: string[];
  certifications: string[];
  linkedTo: string[];
}

/**
 * A skill category containing multiple skills.
 */
export interface SkillCategory3D {
  id: string;
  name: string;
  icon: string;
  color: string;
  glowIntensity: number;
  position: { x: number; y: number; z: number };
  description: string;
  skills: SkillNode3D[];
}

/**
 * A connection between two skills (by id).
 */
export interface SkillConnection {
  from: string;
  to: string;
  type: string;
  strength: number;
  color?: string;
}

/**
 * A processed connection for rendering (with 3D positions).
 */
export interface Connection3DProcessed {
  from: THREE.Vector3;
  to: THREE.Vector3;
  color: string;
  isActive: boolean;
  animationSpeed: number;
}

/**
 * Global statistics for the skill tree.
 */
export interface GlobalStats {
  totalXP: number;
  masteredSkills: number;
  learningSkills: number;
  completionRate: number;
}

/**
 * Terminal command definition.
 */
export interface TerminalCommand {
  cmd: string;
  desc: string;
  category: string;
}

/**
 * Terminal commands organized by category.
 */
export interface TerminalCommands {
  basic: TerminalCommand[];
  advanced: TerminalCommand[];
  system: TerminalCommand[];
}

/**
 * Configuration for the skill tree.
 */
export interface SkillTreeConfig {
  metadata: {
    version: string;
    lastUpdated: string;
    totalNodes: number;
    maxDepth: number;
    bootSequence: string;
  };
  terminalCommands: TerminalCommands;
  bootSequence: string[];  aiModeSecrets: {
    trigger: string;
    responses: string[];
    effects: string[];
  };
}

/**
 * The main skill tree data structure.
 */
export interface SkillTreeData {
  categories: SkillCategory3D[];
  connections: SkillConnection[];
  globalStats: GlobalStats;
}

/**
 * The complete skill tree JSON structure.
 */
export interface SkillTreeJSON {
  skillTreeConfig: SkillTreeConfig;
  skillTree: SkillTreeData;
}
