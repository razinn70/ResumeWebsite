import * as THREE from 'three';

export interface SkillNode3D {
  id: string;
  label: string;
  level: number;
  category: string;
  position: [number, number, number];
  dependencies?: string[];
  description?: string;
  color?: string;
}

export interface Connection3DProcessed {
  from: string;
  to: string;
  strength?: number;
}

export interface SkillTreeData {
  nodes: SkillNode3D[];
  connections: Connection3DProcessed[];
  categories: string[];
}

export interface SkillInteraction {
  hoveredSkill: string | null;
  selectedSkill: string | null;
  animationProgress: number;
}

export interface SkillTreeProps {
  skillData?: SkillTreeData;
  onSkillSelect?: (skillId: string) => void;
  onSkillHover?: (skillId: string | null) => void;
  interactive?: boolean;
  showTooltips?: boolean;
}

// Three.js mesh ref type for skill nodes
export interface SkillMeshRef extends THREE.Mesh {
  userData: {
    skillId: string;
    category: string;
    level: number;
  };
}
