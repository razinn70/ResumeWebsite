'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Text } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { 
  skillNodeVertexShader, 
  skillNodeFragmentShader,
  connectionLineVertexShader,
  connectionLineFragmentShader
} from '../../shaders/crt-shaders'

interface Skill {
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

interface SkillCategory {
  id: string
  name: string
  icon: string
  color: string
  glowIntensity: number
  position: { x: number; y: number; z: number }
  skills: Skill[]
}

interface SkillNode3DProps {
  skill: Skill
  category: SkillCategory
  isSelected: boolean
  isHovered: boolean
  onSelect: (skill: Skill) => void
  onHover: (skill: Skill | null) => void
  scale: number
}

interface Connection3DProps {
  from: THREE.Vector3
  to: THREE.Vector3
  color: string
  isActive: boolean
  animationSpeed: number
}

interface SkillTooltip3DProps {
  skill: Skill
  position: THREE.Vector3
}

// 3D Skill Node Component
export function SkillNode3D({ 
  skill, 
  category, 
  isSelected, 
  isHovered,
  onSelect, 
  onHover, 
  scale 
}: SkillNode3DProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const particlesRef = useRef<THREE.Points>(null!)
  
  // Position from skill data
  const position = new THREE.Vector3(
    skill.position.x * scale * 0.01,
    skill.position.y * scale * 0.01,
    skill.position.z * scale * 0.01
  )
  
  // Shader uniforms for node appearance
  const nodeUniforms = useMemo(() => ({
    time: { value: 0 },
    nodeColor: { value: new THREE.Color(skill.glowColor) },
    glowIntensity: { value: category.glowIntensity },
    pulseSpeed: { value: 2.0 + skill.level * 0.5 },
    selected: { value: isSelected ? 1.0 : 0.0 },
    hovered: { value: isHovered ? 1.0 : 0.0 }
  }), [skill, category, isSelected, isHovered])
  
  // Particle system for visual effects
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(skill.level * 10 * 3)
    
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2
      positions[i + 1] = (Math.random() - 0.5) * 2
      positions[i + 2] = (Math.random() - 0.5) * 2
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [skill.level])
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = time
      materialRef.current.uniforms.selected.value = isSelected ? 1.0 : 0.0
      materialRef.current.uniforms.hovered.value = isHovered ? 1.0 : 0.0
    }
    
    // Rotate particles based on skill type
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.1
      particlesRef.current.rotation.x = Math.sin(time * 0.1) * 0.1
    }
    
    // Floating animation
    if (meshRef.current) {
      meshRef.current.position.y = position.y + Math.sin(time + skill.level) * 0.02
    }
  })
  
  return (
    <group position={position}>
      {/* Main node sphere */}
      <mesh
        ref={meshRef}
        onClick={() => onSelect(skill)}
        onPointerEnter={() => onHover(skill)}
        onPointerLeave={() => onHover(null)}
      >
        <sphereGeometry args={[0.15 + skill.level * 0.02, 32, 32]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={skillNodeVertexShader}
          fragmentShader={skillNodeFragmentShader}
          uniforms={nodeUniforms}
          transparent
        />
      </mesh>
      
      {/* Particle system */}
      <points ref={particlesRef}>
        <primitive object={particleGeometry} />
        <pointsMaterial
          color={skill.glowColor}
          size={0.01}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Level indicator ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.25, 32]} />
        <meshBasicMaterial 
          color={skill.glowColor} 
          transparent 
          opacity={0.3}
        />
      </mesh>
      
      {/* Skill name label */}
      <Html position={[0, -0.35, 0]} center>
        <div className="text-xs font-mono text-terminal-amber bg-black/80 px-2 py-1 rounded border border-terminal-amber/30 whitespace-nowrap">
          {skill.name}
        </div>
      </Html>
      
      {/* Level text */}      <Text
        position={[0, 0.3, 0]}
        fontSize={0.08}
        color={skill.glowColor}
        anchorX="center"
        anchorY="middle"
      >
        L{skill.level}
      </Text>
    </group>
  )
}

// 3D Connection Line Component
export function Connection3D({ from, to, color, isActive, animationSpeed }: Connection3DProps) {
  const lineRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  
  // Create line geometry
  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(6) // 2 points * 3 coordinates
    const progress = new Float32Array(2)   // Progress attribute for animation
    
    positions[0] = from.x
    positions[1] = from.y
    positions[2] = from.z
    positions[3] = to.x
    positions[4] = to.y
    positions[5] = to.z
    
    progress[0] = 0.0
    progress[1] = 1.0
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('progress', new THREE.BufferAttribute(progress, 1))
    
    return geometry
  }, [from, to])
  
  // Connection uniforms
  const connectionUniforms = useMemo(() => ({
    time: { value: 0 },
    lineColor: { value: new THREE.Color(color) },
    animationSpeed: { value: animationSpeed },
    opacity: { value: isActive ? 1.0 : 0.3 }
  }), [color, animationSpeed, isActive])
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
      materialRef.current.uniforms.opacity.value = isActive ? 1.0 : 0.3
    }
  })
  return (
    <mesh ref={lineRef}>
      <primitive object={geometry} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={connectionLineVertexShader}
        fragmentShader={connectionLineFragmentShader}
        uniforms={connectionUniforms}
        transparent
      />
    </mesh>
  )
}

// 3D Skill Tooltip
export function SkillTooltip3D({ skill, position }: SkillTooltip3DProps) {
  const progressBars = '█'.repeat(skill.level) + 
                      '▓'.repeat(Math.floor((skill.xp / skill.maxXp) * 10) - skill.level) + 
                      '░'.repeat(10 - Math.floor((skill.xp / skill.maxXp) * 10))

  return (
    <Html
      position={[position.x + 0.5, position.y, position.z]}
      style={{ pointerEvents: 'none' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-black/95 border border-terminal-amber/50 rounded-lg p-4 min-w-64 backdrop-blur-sm"
      >
        <div className="text-terminal-amber font-mono">
          <div className="text-lg font-bold mb-2 flex items-center">
            {skill.name}
            <span className="ml-2 text-sm bg-terminal-amber/20 px-2 py-1 rounded">
              L{skill.level}
            </span>
          </div>
          
          <div className="text-sm mb-2 text-terminal-cream">
            {skill.description}
          </div>
          
          <div className="space-y-1 text-xs">
            <div>XP: <span className="text-terminal-green">{skill.xp}/{skill.maxXp}</span></div>
            <div>Progress: <span className="font-mono text-terminal-amber">{progressBars}</span></div>
            <div>Status: <span className={`${
              skill.status === 'mastered' ? 'text-terminal-amber' :
              skill.status === 'learning' ? 'text-terminal-green' : 'text-gray-400'
            }`}>{skill.status.toUpperCase()}</span></div>
          </div>
          
          {skill.projects.length > 0 && (
            <div className="mt-3">
              <div className="text-terminal-green text-xs mb-1">Recent Projects:</div>
              {skill.projects.slice(0, 3).map((project, index) => (
                <div key={index} className="text-xs text-terminal-cream">
                  • {project}
                </div>
              ))}
            </div>
          )}
          
          {skill.certifications.length > 0 && (
            <div className="mt-2">
              <div className="text-terminal-green text-xs mb-1">Certifications:</div>
              {skill.certifications.map((cert, index) => (
                <div key={index} className="text-xs text-terminal-amber">
                  🏆 {cert}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </Html>
  )
}

// Category Header 3D
export function CategoryHeader3D({ category, scale }: { category: SkillCategory; scale: number }) {
  const position = new THREE.Vector3(
    category.position.x * scale * 0.01,
    category.position.y * scale * 0.01 - 0.5,
    category.position.z * scale * 0.01
  )
  
  return (
    <Html position={position} center>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <div 
          className="text-2xl font-mono font-bold mb-2"
          style={{ color: category.color }}
        >
          {category.icon} {category.name}
        </div>
        <div className="text-xs text-terminal-cream bg-black/80 px-3 py-1 rounded border border-terminal-amber/30">
          {category.skills.length} skills
        </div>
      </motion.div>
    </Html>
  )
}

const SkillNodes3DComponents = { SkillNode3D, Connection3D, SkillTooltip3D, CategoryHeader3D }

export default SkillNodes3DComponents
