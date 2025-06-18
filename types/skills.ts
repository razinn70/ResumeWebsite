export interface Skill {
  id: string;
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  status: 'mastered' | 'learning' | 'planned';
  learnedVia: string;
  position: { x: number; y: number };
  description: string;
  linkedTo: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  position: { x: number; y: number };
  skills: Skill[];
}

export interface SkillTreeData {
  categories: SkillCategory[];
  terminalOutput: string[];
}

export interface SkillNodeProps {
  skill: Skill;
  isSelected: boolean;
  onSelect: (skill: Skill) => void;
  scale: number;
}

export interface SkillTooltipProps {
  skill: Skill;
  position: { x: number; y: number };
  isVisible: boolean;
}

export interface SkillConnectionProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  status: 'mastered' | 'learning' | 'planned';
  isActive: boolean;
}
