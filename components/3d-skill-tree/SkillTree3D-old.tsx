'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { Suspense } from 'react'

// Import our custom components
import { CRTMonitor3D } from './CRTMonitor3D'
import { TerminalShell } from './TerminalShell'
import { CategoryHeader3D } from './CategoryHeader3D'
import { SkillTooltip3D } from './SkillTooltip3D'

// Import skill data
import skillTreeData from '../../data/skill-tree-3d.json'

interface SkillTree3DProps {
  className?: string
  showDebug?: boolean
}

interface Skill3D {
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

interface SkillCategory3D {
  id: string
  name: string
  icon: string
  color: string
  glowIntensity: number
  position: { x: number; y: number; z: number }
  skills: Skill3D[]
}

interface Connection3D {
  from: string
  to: string
  type: string
  strength: number
  color: string
  isActive?: boolean
  animationSpeed?: number
}

interface Connection3DProcessed {
  from: THREE.Vector3
  to: THREE.Vector3
  color: string
  isActive: boolean
  animationSpeed: number
}

// 3D Scene Component
function SkillTreeScene({ 
  skills, 
  categories, 
  connections,
  selectedSkill,
  hoveredSkill,
  onSkillSelect,
  onSkillHover,
  scale 
}: {
  skills: (Skill3D & { category: SkillCategory3D })[]
  categories: SkillCategory3D[]
  connections: Connection3DProcessed[]
  selectedSkill: Skill3D | null
  hoveredSkill: Skill3D | null
  onSkillSelect: (skill: Skill3D) => void
  onSkillHover: (skill: Skill3D | null) => void
  scale: number
}) {
  const sceneRef = useRef<THREE.Group>(null!)
  
  // Camera animation
  function CameraAnimation() {
    const { camera } = useThree()
    
    useFrame(() => {
      if (selectedSkill) {
        // Focus camera on selected skill
        const targetPos = new THREE.Vector3(
          selectedSkill.position.x * scale * 0.01,
          selectedSkill.position.y * scale * 0.01,
          selectedSkill.position.z * scale * 0.01 + 2
        )
        camera.position.lerp(targetPos, 0.02)
        camera.lookAt(
          selectedSkill.position.x * scale * 0.01,
          selectedSkill.position.y * scale * 0.01,
          selectedSkill.position.z * scale * 0.01
        )
      }
    })
    
    return null
  }
  
  return (
    <>
      <CameraAnimation />
      
      <group ref={sceneRef}>        {/* Category Headers */}
        {categories.map((category) => (
          <CategoryHeader3D
            key={category.id}
            category={category.name}
            position={[category.position.x * 0.01, category.position.y * 0.01, category.position.z * 0.01]}
            color={category.color}
          />
        ))}
          {/* Skill Nodes - Simplified implementation */}
        {skills.map((skillWithCategory) => (
          <mesh
            key={skillWithCategory.id}
            position={[skillWithCategory.position.x * 0.01, skillWithCategory.position.y * 0.01, skillWithCategory.position.z * 0.01]}
            onClick={() => onSkillSelect(skillWithCategory)}
            onPointerOver={() => onSkillHover(skillWithCategory)}
            onPointerOut={() => onSkillHover(null)}
          >
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial 
              color={skillWithCategory.glowColor} 
              emissive={selectedSkill?.id === skillWithCategory.id ? skillWithCategory.glowColor : '#000000'}
              emissiveIntensity={selectedSkill?.id === skillWithCategory.id ? 0.5 : 0}
            />
          </mesh>
        ))}
          {/* Connections - Simplified implementation */}
        {connections.map((conn, index) => (
          <group key={index}>
            {/* TODO: Implement line geometry for connections */}
          </group>
        ))}
      </group>
        {/* Tooltip */}
      {hoveredSkill && (
        <SkillTooltip3D
          skill={{
            id: hoveredSkill.id,
            label: hoveredSkill.name,
            description: hoveredSkill.description,
            level: hoveredSkill.level,
            category: hoveredSkill.id // Simplified for now
          }}
          position={[
            hoveredSkill.position.x * 0.01,
            hoveredSkill.position.y * 0.01 + 1,
            hoveredSkill.position.z * 0.01
          ]}
          visible={true}
        />
      )}
    </>
  )
}

// Main SkillTree3D Component
export function SkillTree3D({ className = "", showDebug = false }: SkillTree3DProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill3D | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<Skill3D | null>(null)
  const [matrixMode, setMatrixMode] = useState(false)
  const [scale, setScale] = useState(1.0)
  const [bootComplete, setBootComplete] = useState(false)
  // Use unknown first, then cast properly
  const skillData = skillTreeData as unknown
  const categories = (skillData as { skillTree: { categories: SkillCategory3D[] } }).skillTree.categories
  const rawGlobalStats = (skillData as { skillTree: { globalStats: { totalXP: number; masteredSkills: number; learningSkills: number; completionRate: number } } }).skillTree.globalStats
  const terminalCommands = (skillData as { skillTreeConfig: { terminalCommands: { basic: { cmd: string; desc: string; category: string }[]; advanced: { cmd: string; desc: string; category: string }[]; system: { cmd: string; desc: string; category: string }[] } } }).skillTreeConfig.terminalCommands
  const bootSequence = (skillData as { skillTreeConfig: { bootSequence: string[] } }).skillTreeConfig.bootSequence
  // Flatten skills from categories
  const allSkills = useMemo<(Skill3D & { category: SkillCategory3D })[]>(() => {
    const skills: (Skill3D & { category: SkillCategory3D })[] = []
    categories.forEach((category: SkillCategory3D) => {
      category.skills.forEach((skill: Skill3D) => {
        skills.push({ ...skill, category })
      })
    })
    return skills
  }, [categories])
  // Generate connections between skills
  const connections = useMemo<Connection3DProcessed[]>(() => {
    const rawConnections = (skillData as { skillTree: { connections: Connection3D[] } }).skillTree.connections || []
    return rawConnections.map((connection: Connection3D) => {
      const fromSkill = allSkills.find((s) => s.id === connection.from)
      const toSkill = allSkills.find((s) => s.id === connection.to)
      return {
        from: fromSkill ? new THREE.Vector3(
          fromSkill.position.x * scale * 0.01,
          fromSkill.position.y * scale * 0.01,
          fromSkill.position.z * scale * 0.01
        ) : new THREE.Vector3(),
        to: toSkill ? new THREE.Vector3(
          toSkill.position.x * scale * 0.01,
          toSkill.position.y * scale * 0.01,
          toSkill.position.z * scale * 0.01
        ) : new THREE.Vector3(),
        color: connection.color ?? '#ffbf00',
        isActive: !!(
          hoveredSkill?.id === connection.from ||
          hoveredSkill?.id === connection.to ||
          selectedSkill?.id === connection.from ||
          selectedSkill?.id === connection.to
        ),
        animationSpeed: connection.strength ?? 1.0,
      }
    })
  }, [allSkills, skillData, hoveredSkill, selectedSkill, scale])

  // Terminal command handler
  const handleTerminalCommand = useCallback((command: string) => {
    const cmd = command.toLowerCase().trim()
    
    switch (cmd) {
      case 'tree':
        // eslint-disable-next-line no-console
        console.log('📊 Skill Tree Structure:')
        categories.forEach((cat: SkillCategory3D) => {
          console.log(`${cat.icon} ${cat.name}:`)
          cat.skills.forEach((skill: Skill3D) => {
            console.log(`  ├─ ${skill.name} (L${skill.level})`)
          })
        })
        break
        
      case 'map':
        console.log('🗺️ Interactive node map activated')
        setScale(1.2)
        break
        
      case 'stats':
        const stats = rawGlobalStats
        console.log(`📈 System Statistics:`)
        console.log(`Total XP: ${stats.totalXP}`)
        console.log(`Mastered Skills: ${stats.masteredSkills}`)
        console.log(`Learning Skills: ${stats.learningSkills}`)
        console.log(`Completion Rate: ${stats.completionRate}%`)
        break
        
      case 'reboot':
        console.log('🔄 Rebooting skill tree...')
        setSelectedSkill(null)
        setHoveredSkill(null)
        setScale(1.0)
        setTimeout(() => {
          console.log('✅ Reboot complete.')
        }, 1000)
        break
        
      case 'export skills.pdf':
        console.log('📄 Generating resume snapshot...')
        setTimeout(() => {
          console.log('✅ skills.pdf exported successfully!')
          // In a real app, this would trigger a PDF download
        }, 1500)
        break
        
      case 'version':
        console.log('SKILL-OS v2.1.0')
        console.log('Build: neural-pathways-enhanced')
        console.log('Runtime: Three.js + React Fiber')
        break
        
      default:
        // Handle inspect commands
        if (cmd.startsWith('inspect ')) {          const skillName = cmd.replace('inspect ', '')
          const skill = allSkills.find((s: Skill3D) => 
            s.name.toLowerCase().includes(skillName) ||
            s.id.toLowerCase().includes(skillName)
          )
          
          if (skill) {
            setSelectedSkill(skill)
            console.log(`🔍 Inspecting ${skill.name}...`)
          } else {
            console.log(`❌ Skill '${skillName}' not found.`)
          }
        }        // Handle unlock commands
        else if (cmd.startsWith('unlock ')) {          const categoryName = cmd.replace('unlock ', '')
          const category = categories.find((c: SkillCategory3D) => 
            c.name.toLowerCase().includes(categoryName) ||
            c.id.toLowerCase().includes(categoryName)
          )
          
          if (category && category.skills.length > 0) {
            setSelectedSkill(category.skills[0] as Skill3D)
            console.log(`🔓 Unlocked ${category.name} category`)
          } else {
            console.log(`❌ Category '${categoryName}' not found.`)
          }
        }
        else {
          console.log(`❌ Unknown command: '${command}'. Type 'help' for available commands.`)
        }
        break
    }
  }, [allSkills, skillData])
  
  // Handle matrix mode toggle
  const handleMatrixModeToggle = useCallback(() => {
    setMatrixMode(prev => !prev)
    console.log(matrixMode ? '🔧 Matrix mode disabled' : '🤖 Matrix mode enabled')
  }, [matrixMode])
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setBootComplete(true)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <section className={`py-20 bg-gradient-to-b from-gray-900 to-black min-h-screen ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-terminal-amber mb-4 font-mono">
              {matrixMode ? '🤖 AI-ENHANCED' : '🧠'} SKILL MATRIX
            </h2>
            <p className="text-terminal-cream max-w-2xl mx-auto">
              {matrixMode 
                ? 'Neural pathways enhanced. Welcome to the machine.'
                : 'Interactive 3D visualization of technical expertise and learning journey'
              }
            </p>
          </motion.div>
          
          {/* Main 3D CRT Interface */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <CRTMonitor3D
              className="w-full h-[600px]"
              showStats={showDebug}
              matrixMode={matrixMode}
              onTerminalReady={() => {/* Terminal ready handler removed */}}
            >
              {bootComplete ? (
                <div className="w-full h-full flex">
                  {/* Terminal Shell */}
                  <div className="w-1/2 border-r border-terminal-amber/30">
                    <TerminalShell
                      commands={[                        ...terminalCommands.basic,
                        ...terminalCommands.advanced,
                        ...terminalCommands.system
                      ]}
                      onCommand={handleTerminalCommand}
                      bootSequence={bootSequence}
                      matrixMode={matrixMode}
                      onMatrixModeToggle={handleMatrixModeToggle}
                    />
                  </div>
                  
                  {/* 3D Skill Tree Viewport */}
                  <div className="w-1/2 h-full relative">
                    <Canvas
                      camera={{ position: [0, 0, 5], fov: 50 }}
                      style={{ background: 'transparent' }}
                    >
                      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                      <OrbitControls 
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        maxDistance={10}
                        minDistance={2}
                      />
                      
                      {/* Lighting */}
                      <ambientLight intensity={0.3} />
                      <pointLight 
                        position={[5, 5, 5]} 
                        intensity={0.5} 
                        color="#ffbf00" 
                      />
                      
                      <Suspense fallback={null}>
                        <SkillTreeScene
                          skills={allSkills}
                          categories={categories}
                          connections={connections}
                          selectedSkill={selectedSkill}
                          hoveredSkill={hoveredSkill}
                          onSkillSelect={setSelectedSkill}
                          onSkillHover={setHoveredSkill}
                          scale={scale}
                        />
                      </Suspense>
                    </Canvas>
                    
                    {/* Overlay controls */}
                    <div className="absolute top-2 right-2 space-y-2">
                      <button
                        onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
                        className="block w-8 h-8 bg-terminal-amber/20 border border-terminal-amber/50 text-terminal-amber text-xs hover:bg-terminal-amber/30 transition-colors"
                      >
                        +
                      </button>
                      <button
                        onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
                        className="block w-8 h-8 bg-terminal-amber/20 border border-terminal-amber/50 text-terminal-amber text-xs hover:bg-terminal-amber/30 transition-colors"
                      >
                        -
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-terminal-green text-lg mb-4 font-mono">
                      INITIALIZING SKILL MATRIX...
                    </div>
                    <div className="w-48 h-2 bg-terminal-black border border-terminal-amber mb-4">
                      <motion.div
                        className="h-full bg-terminal-amber"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2 }}
                      />
                    </div>
                    <div className="text-terminal-amber text-sm">
                      Loading neural pathways...
                    </div>
                  </div>
                </div>
              )}
            </CRTMonitor3D>
          </motion.div>
          
          {/* Selected Skill Details Panel */}
          <AnimatePresence>
            {selectedSkill && (
              <motion.div
                className="mt-8 bg-terminal-black/70 border border-terminal-amber/30 rounded-lg p-6 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-mono font-bold text-terminal-amber mb-2 flex items-center">
                      {selectedSkill.name}
                      <span className="ml-3 text-sm bg-terminal-amber/20 px-3 py-1 rounded">
                        Level {selectedSkill.level}
                      </span>
                    </h3>
                    <p className="text-terminal-cream mb-4 text-lg">
                      {selectedSkill.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="text-terminal-amber hover:text-terminal-orange transition-colors text-xl"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Stats */}
                  <div>
                    <h4 className="text-terminal-green font-mono mb-3">Statistics</h4>
                    <div className="space-y-2 font-mono text-sm">
                      <div>XP: <span className="text-terminal-amber">{selectedSkill.xp}/{selectedSkill.maxXp}</span></div>
                      <div>Status: <span className={`${
                        selectedSkill.status === 'mastered' ? 'text-terminal-amber' :
                        selectedSkill.status === 'learning' ? 'text-terminal-green' : 'text-gray-400'
                      }`}>{selectedSkill.status.toUpperCase()}</span></div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-terminal-amber to-terminal-orange h-2 rounded-full transition-all"
                          style={{ width: `${(selectedSkill.xp / selectedSkill.maxXp) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Projects */}
                  {selectedSkill.projects.length > 0 && (
                    <div>
                      <h4 className="text-terminal-green font-mono mb-3">Recent Projects</h4>
                      <div className="space-y-1">
                        {selectedSkill.projects.map((project: string, index: number) => (
                          <div key={index} className="text-sm text-terminal-cream">
                            • {project}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Certifications */}
                  {selectedSkill.certifications.length > 0 && (
                    <div>
                      <h4 className="text-terminal-green font-mono mb-3">Certifications</h4>
                      <div className="space-y-1">
                        {selectedSkill.certifications.map((cert: string, index: number) => (
                          <div key={index} className="text-sm text-terminal-amber flex items-center">
                            🏆 {cert}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* System Stats */}
          {bootComplete && (
            <motion.div
              className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >              {[                { label: 'Total XP', value: rawGlobalStats.totalXP.toLocaleString() },
                { label: 'Mastered', value: rawGlobalStats.masteredSkills },
                { label: 'Learning', value: rawGlobalStats.learningSkills },
                { label: 'Completion', value: `${rawGlobalStats.completionRate}%` }
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-terminal-black/50 border border-terminal-amber/30 rounded-lg p-4 text-center"
                >
                  <div className="text-2xl font-bold text-terminal-amber font-mono">
                    {stat.value}
                  </div>
                  <div className="text-sm text-terminal-green">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

export default SkillTree3D
