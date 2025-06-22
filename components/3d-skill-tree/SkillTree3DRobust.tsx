/**
 * ROBUST 3D SKILL TREE COMPONENT - PRODUCTION READY
 * Enhanced with comprehensive error handling, memory management, and performance optimization
 */
'use client'

import { useState, useEffect, useMemo, useRef, useCallback, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

// Custom hooks and utilities
import { use3DMemory } from '../../hooks/use3DMemory'
import { usePerformanceOptimization } from '../../hooks/usePerformanceOptimization'
import { Enhanced3DErrorBoundary } from '../error-boundary/Enhanced3DErrorBoundary'

// Import types with fallbacks
interface SkillNode3D {
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

interface SkillCategory3D {
  id: string;
  name: string;
  icon: string;
  color: string;
  glowIntensity: number;
  position: { x: number; y: number; z: number };
  description: string;
  skills: SkillNode3D[];
}

interface SkillTree3DProps {
  className?: string;
  showDebug?: boolean;
  quality?: 'low' | 'medium' | 'high';
  enablePhysics?: boolean;
  onError?: (error: Error) => void;
}

// Fallback skill data in case JSON fails to load
const FALLBACK_SKILLS: SkillCategory3D[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    icon: '🎨',
    color: '#61dafb',
    glowIntensity: 0.8,
    position: { x: -200, y: 0, z: 0 },
    description: 'Frontend technologies and frameworks',
    skills: [
      {
        id: 'react',
        name: 'React',
        level: 5,
        xp: 2500,
        maxXp: 3000,
        status: 'mastered',
        position: { x: -200, y: 50, z: 0 },
        glowColor: '#61dafb',
        particleEffect: 'blue-sparkle',
        description: 'Modern React development with hooks and context',
        projects: ['Portfolio', 'Dashboard'],
        certifications: [],
        linkedTo: ['typescript', 'nextjs']
      },
      {
        id: 'typescript',
        name: 'TypeScript',
        level: 4,
        xp: 2000,
        maxXp: 2500,
        status: 'learning',
        position: { x: -150, y: 100, z: 0 },
        glowColor: '#3178c6',
        particleEffect: 'blue-pulse',
        description: 'Type-safe JavaScript development',
        projects: ['Portfolio', 'API'],
        certifications: [],
        linkedTo: ['react', 'nodejs']
      }
    ]
  },
  {
    id: 'backend',
    name: 'Backend',
    icon: '⚙️',
    color: '#68a063',
    glowIntensity: 0.7,
    position: { x: 200, y: 0, z: 0 },
    description: 'Backend technologies and databases',
    skills: [
      {
        id: 'nodejs',
        name: 'Node.js',
        level: 4,
        xp: 1800,
        maxXp: 2500,
        status: 'learning',
        position: { x: 200, y: 50, z: 0 },
        glowColor: '#68a063',
        particleEffect: 'green-pulse',
        description: 'Server-side JavaScript development',
        projects: ['API', 'Bot'],
        certifications: [],
        linkedTo: ['typescript', 'database']
      }
    ]
  }
];

// Simple Skill Node Component
function SkillNode({ 
  skill, 
  isSelected, 
  isHovered, 
  onSelect, 
  onHover, 
  scale = 1 
}: {
  skill: SkillNode3D;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (skill: SkillNode3D) => void;
  onHover: (skill: SkillNode3D | null) => void;
  scale: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const memoryManager = use3DMemory();

  // Create geometry and material
  const geometry = useMemo(() => {
    const geom = new THREE.SphereGeometry(0.5, 16, 16);
    return memoryManager.trackGeometry(geom);
  }, [memoryManager]);

  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: skill.glowColor,
      emissive: skill.glowColor,
      emissiveIntensity: isSelected ? 0.8 : isHovered ? 0.5 : 0.2,
      roughness: 0.3,
      metalness: 0.7
    });
    return memoryManager.trackMaterial(mat);
  }, [skill.glowColor, isSelected, isHovered, memoryManager]);

  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (isHovered || isSelected) {
        const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.1 + 1;
        meshRef.current.scale.setScalar(pulse * scale);
      } else {
        meshRef.current.scale.setScalar(scale);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[
        skill.position.x * scale * 0.01,
        skill.position.y * scale * 0.01,
        skill.position.z * scale * 0.01
      ]}
      onClick={() => onSelect(skill)}
      onPointerOver={() => onHover(skill)}
      onPointerOut={() => onHover(null)}
    />
  );
}

// Category Header Component
function CategoryHeader({ 
  category, 
  scale = 1 
}: {
  category: SkillCategory3D;
  scale: number;
}) {
  return (
    <group 
      position={[
        category.position.x * scale * 0.01,
        (category.position.y - 100) * scale * 0.01,
        category.position.z * scale * 0.01
      ]}
    >
      <mesh>
        <boxGeometry args={[2, 0.5, 0.2]} />
        <meshStandardMaterial 
          color={category.color} 
          emissive={category.color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

// 3D Scene Component
function SkillTreeScene({ 
  skills, 
  categories, 
  selectedSkill, 
  hoveredSkill, 
  onSkillSelect, 
  onSkillHover, 
  scale,
  onError 
}: {
  skills: SkillNode3D[];
  categories: SkillCategory3D[];
  selectedSkill: SkillNode3D | null;
  hoveredSkill: SkillNode3D | null;
  onSkillSelect: (skill: SkillNode3D) => void;
  onSkillHover: (skill: SkillNode3D | null) => void;
  scale: number;
  onError: (error: Error) => void;
}) {
  const sceneRef = useRef<THREE.Group>(null);

  // Error handling wrapper
  const safeExecute = useCallback((fn: () => void, context: string) => {
    try {
      fn();
    } catch (error) {
      console.error(`Skill Tree Scene error in ${context}:`, error);
      onError(error as Error);
    }
  }, [onError]);

  // Camera animation
  function CameraAnimation() {
    const { camera } = useThree();
    
    useFrame(() => {
      safeExecute(() => {
        if (selectedSkill && camera) {
          const targetPos = new THREE.Vector3(
            selectedSkill.position.x * scale * 0.01,
            selectedSkill.position.y * scale * 0.01,
            selectedSkill.position.z * scale * 0.01 + 3
          );
          camera.position.lerp(targetPos, 0.02);
          camera.lookAt(
            selectedSkill.position.x * scale * 0.01,
            selectedSkill.position.y * scale * 0.01,
            selectedSkill.position.z * scale * 0.01
          );
        }
      }, 'camera animation');
    });
    
    return null;
  }

  return (
    <>
      <CameraAnimation />
      
      <group ref={sceneRef}>
        {/* Category Headers */}
        {categories.map((category) => (
          <CategoryHeader
            key={category.id}
            category={category}
            scale={scale}
          />
        ))}
        
        {/* Skill Nodes */}
        {skills.map((skill) => (
          <SkillNode
            key={skill.id}
            skill={skill}
            isSelected={selectedSkill?.id === skill.id}
            isHovered={hoveredSkill?.id === skill.id}
            onSelect={onSkillSelect}
            onHover={onSkillHover}
            scale={scale}
          />
        ))}
      </group>
      
      {/* Skill Info Panel */}
      {hoveredSkill && (
        <group position={[0, -2, 0]}>
          <mesh>
            <planeGeometry args={[4, 1]} />
            <meshBasicMaterial color="#000000" opacity={0.8} transparent />
          </mesh>
        </group>
      )}
    </>
  );
}

// Main SkillTree3D Component
export default function SkillTree3D({ 
  className = "", 
  showDebug = false,
  quality = 'high',
  enablePhysics = true,
  onError
}: SkillTree3DProps) {
  // Performance and memory management
  const performanceConfig = usePerformanceOptimization();
  const memoryManager = use3DMemory({
    maxTextures: quality === 'high' ? 20 : 10,
    maxGeometries: 50,
    maxMaterials: 30,
    enablePerformanceMonitoring: showDebug
  });

  // State
  const [selectedSkill, setSelectedSkill] = useState<SkillNode3D | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<SkillNode3D | null>(null);
  const [scale, setScale] = useState(1.0);
  const [skillData, setSkillData] = useState<SkillCategory3D[]>(FALLBACK_SKILLS);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Error handler
  const handleError = useCallback((error: Error) => {
    console.error('SkillTree3D Error:', error);
    setHasError(true);
    onError?.(error);
  }, [onError]);

  // Load skill data
  useEffect(() => {
    const loadSkillData = async () => {
      try {
        // Try to load the JSON data
        const { default: skillTreeDataRaw } = await import('../../data/skill-tree-3d.json');        if (skillTreeDataRaw?.skillTree?.categories) {
          // Type-safe conversion with validation
          const convertedCategories: SkillCategory3D[] = skillTreeDataRaw.skillTree.categories.map((category: any) => ({
            ...category,
            skills: category.skills?.map((skill: any) => ({
              ...skill,
              status: ['mastered', 'learning', 'planned'].includes(skill.status) 
                ? skill.status as 'mastered' | 'learning' | 'planned'
                : 'planned' as const,
              projects: skill.projects || [],
              certifications: skill.certifications || [],
              linkedTo: skill.linkedTo || [],
              glowColor: skill.glowColor || '#00ff00',
              particleEffect: skill.particleEffect || 'spark'
            })) || []
          }));
          setSkillData(convertedCategories);
        }
      } catch (error) {
        console.warn('Failed to load skill data, using fallback:', error);
        // Keep using FALLBACK_SKILLS
      } finally {
        setIsLoading(false);
      }
    };

    loadSkillData();
  }, []);

  // Get all skills from categories
  const allSkills = useMemo(() => {
    return skillData.flatMap(category => category.skills);
  }, [skillData]);

  // Control handlers
  const handleSkillSelect = useCallback((skill: SkillNode3D) => {
    setSelectedSkill(skill);
  }, []);

  const handleSkillHover = useCallback((skill: SkillNode3D | null) => {
    setHoveredSkill(skill);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className={`w-full h-96 bg-gray-900 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-400">Loading 3D Skill Tree...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className={`w-full h-96 bg-gray-900 border border-red-500/50 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-white max-w-md p-8">
          <div className="text-6xl mb-4">🌳</div>
          <h3 className="text-xl font-bold mb-2 text-red-400">3D Skill Tree Error</h3>
          <p className="text-gray-300 mb-4">
            The 3D skill tree failed to load. Using fallback 2D display.
          </p>
          <button
            onClick={() => {
              setHasError(false);
              window.location.reload();
            }}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-96 bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      <Enhanced3DErrorBoundary
        section="3D Skill Tree"
        onError={handleError}
        enableRetry={true}
        maxRetries={3}
      >
        <Canvas
          gl={{ 
            antialias: quality !== 'low', 
            alpha: false,
            powerPreference: 'high-performance'
          }}
          dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, quality === 'high' ? 2 : 1)}
          performance={{ min: 0.5 }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            maxDistance={10}
            minDistance={2}
            autoRotate={performanceConfig.enableAnimations}
            autoRotateSpeed={0.5}
          />
          
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, 5]} intensity={0.5} color="#0088ff" />
          
          <Environment preset="city" />
          
          <Suspense fallback={null}>
            <SkillTreeScene
              skills={allSkills}
              categories={skillData}
              selectedSkill={selectedSkill}
              hoveredSkill={hoveredSkill}
              onSkillSelect={handleSkillSelect}
              onSkillHover={handleSkillHover}
              scale={scale}
              onError={handleError}
            />
          </Suspense>
        </Canvas>
        
        {/* Info Panel */}
        {(selectedSkill || hoveredSkill) && (
          <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-4 rounded-lg">
            <h3 className="font-bold text-lg text-blue-400">
              {(selectedSkill || hoveredSkill)?.name}
            </h3>
            <p className="text-sm text-gray-300 mt-1">
              {(selectedSkill || hoveredSkill)?.description}
            </p>
            <div className="flex gap-4 mt-2 text-xs">
              <span>Level: {(selectedSkill || hoveredSkill)?.level}/5</span>
              <span>Status: {(selectedSkill || hoveredSkill)?.status}</span>
              <span>XP: {(selectedSkill || hoveredSkill)?.xp}/{(selectedSkill || hoveredSkill)?.maxXp}</span>
            </div>
          </div>
        )}

        {/* Debug Info */}
        {showDebug && (
          <div className="absolute top-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
            <p>Skills: {allSkills.length}</p>
            <p>Categories: {skillData.length}</p>
            <p>Memory: {memoryManager.stats.memoryUsage.toFixed(1)}MB</p>
            <p>Scale: {scale.toFixed(2)}</p>
          </div>
        )}
      </Enhanced3DErrorBoundary>
    </div>
  );
}
