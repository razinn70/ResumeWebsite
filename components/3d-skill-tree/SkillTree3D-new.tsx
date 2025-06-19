'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { Suspense } from 'react'

// Import our custom components
import { CRTMonitor3D } from './CRTMonitor3D'
import { TerminalShell } from './TerminalShell'
import { 
  SkillNode3D as SkillNode3DComponent, 
  Connection3D as Connection3DComponent, 
  SkillTooltip3D as SkillTooltip3DComponent, 
  CategoryHeader3D as CategoryHeader3DComponent 
} from './SkillNodes3D'

// Import types
import type {
  SkillNode3D,
  SkillCategory3D,
  SkillConnection,
  Connection3DProcessed,
  SkillTreeData,
  SkillTreeConfig,
  SkillTreeJSON,
  GlobalStats
} from '../../types/skill-tree-3d'

// Import skill data
import skillTreeDataRaw from '../../data/skill-tree-3d.json'

interface SkillTree3DProps {
  className?: string
  showDebug?: boolean
}

/**
 * Extended skill type with category reference for rendering.
 */
type SkillWithCategory = SkillNode3D & { category: SkillCategory3D }

/**
 * 3D Scene Component that renders the skill tree in Three.js
 */
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
  skills: SkillWithCategory[]
  categories: SkillCategory3D[]
  connections: Connection3DProcessed[]
  selectedSkill: SkillNode3D | null
  hoveredSkill: SkillNode3D | null
  onSkillSelect: (skill: SkillNode3D) => void
  onSkillHover: (skill: SkillNode3D | null) => void
  scale: number
}) {
  const sceneRef = useRef<THREE.Group>(null!)
  
  /**
   * Camera animation component for smooth transitions
   */
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
      
      <group ref={sceneRef}>
        {/* Category Headers */}
        {categories.map((category) => (
          <CategoryHeader3DComponent
            key={category.id}
            category={category}
            scale={scale}
          />
        ))}
        
        {/* Skill Nodes */}
        {skills.map((skillWithCategory) => (
          <SkillNode3DComponent
            key={skillWithCategory.id}
            skill={skillWithCategory}
            category={skillWithCategory.category}
            isSelected={selectedSkill?.id === skillWithCategory.id}
            isHovered={hoveredSkill?.id === skillWithCategory.id}
            onSelect={onSkillSelect}
            onHover={onSkillHover}
            scale={scale}
          />
        ))}
        
        {/* Connections */}
        {connections.map((conn, index) => (
          <Connection3DComponent
            key={index}
            from={conn.from}
            to={conn.to}
            color={conn.color}
            isActive={conn.isActive}
            animationSpeed={conn.animationSpeed}
          />
        ))}
      </group>
      
      {/* Tooltip */}
      {hoveredSkill && (
        <SkillTooltip3DComponent
          skill={hoveredSkill}
          position={new THREE.Vector3(
            hoveredSkill.position.x * scale * 0.01,
            hoveredSkill.position.y * scale * 0.01,
            hoveredSkill.position.z * scale * 0.01
          )}
        />
      )}
    </>
  )
}

/**
 * Main SkillTree3D Component
 * Manages state and orchestrates the 3D skill tree display
 */
export function SkillTree3D({ className = "", showDebug = false }: SkillTree3DProps) {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode3D | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<SkillNode3D | null>(null)
  const [matrixMode, setMatrixMode] = useState(false)
  const [scale, setScale] = useState(1.0)
  const [bootComplete, setBootComplete] = useState(false)
  
  // Type the imported JSON data
  const skillTreeData = skillTreeDataRaw as SkillTreeJSON
  const config: SkillTreeConfig = skillTreeData.skillTreeConfig
  const data: SkillTreeData = skillTreeData.skillTree
  
  /**
   * Flatten skills with category references for rendering
   */
  const allSkills = useMemo<SkillWithCategory[]>(() => {
    return data.categories.flatMap((category: SkillCategory3D) => 
      category.skills.map((skill: SkillNode3D) => ({ ...skill, category }))
    )
  }, [data])
  
  /**
   * Generate connections between skills with 3D positions
   */
  const connections = useMemo<Connection3DProcessed[]>(() => {
    const conns: Connection3DProcessed[] = []
    
    data.connections.forEach((connection: SkillConnection) => {
      const fromSkill = allSkills.find((s: SkillWithCategory) => s.id === connection.from)
      const toSkill = allSkills.find((s: SkillWithCategory) => s.id === connection.to)
      
      if (fromSkill && toSkill) {
        conns.push({
          from: new THREE.Vector3(
            fromSkill.position.x * scale * 0.01,
            fromSkill.position.y * scale * 0.01,
            fromSkill.position.z * scale * 0.01
          ),
          to: new THREE.Vector3(
            toSkill.position.x * scale * 0.01,
            toSkill.position.y * scale * 0.01,
            toSkill.position.z * scale * 0.01
          ),
          color: connection.color || '#ffbf00',
          isActive: !!(
            hoveredSkill?.id === fromSkill.id || 
            hoveredSkill?.id === toSkill.id ||
            selectedSkill?.id === fromSkill.id ||
            selectedSkill?.id === toSkill.id
          ),
          animationSpeed: connection.strength || 1.0
        })
      }
    })
    
    return conns
  }, [allSkills, data.connections, hoveredSkill, selectedSkill, scale])
  
  /**
   * Terminal command handler with strict typing
   */
  const handleTerminalCommand = useCallback((command: string): void => {
    const cmd = command.toLowerCase().trim()
    
    switch (cmd) {
      case 'tree':
        console.log('📊 Skill Tree Structure:')
        data.categories.forEach((cat: SkillCategory3D) => {
          console.log(`${cat.icon} ${cat.name}:`)
          cat.skills.forEach((skill: SkillNode3D) => {
            console.log(`  ├─ ${skill.name} (L${skill.level})`)
          })
        })
        break
        
      case 'map':
        console.log('🗺️ Interactive node map activated')
        setScale(1.2)
        break
        
      case 'stats':
        const stats: GlobalStats = data.globalStats
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
        if (cmd.startsWith('inspect ')) {
          const skillName = cmd.replace('inspect ', '')
          const skill = allSkills.find((s: SkillWithCategory) => 
            s.name.toLowerCase().includes(skillName) ||
            s.id.toLowerCase().includes(skillName)
          )
          
          if (skill) {
            setSelectedSkill(skill)
            console.log(`🔍 Inspecting ${skill.name}...`)
          } else {
            console.log(`❌ Skill '${skillName}' not found.`)
          }
        }
        // Handle unlock commands
        else if (cmd.startsWith('unlock ')) {
          const categoryName = cmd.replace('unlock ', '')
          const category = data.categories.find((c: SkillCategory3D) => 
            c.name.toLowerCase().includes(categoryName) ||
            c.id.toLowerCase().includes(categoryName)
          )
          
          if (category && category.skills.length > 0) {
            setSelectedSkill(category.skills[0])
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
  }, [allSkills, data.categories, data.globalStats])
  
  /**
   * Handle matrix mode toggle
   */
  const handleMatrixModeToggle = useCallback((): void => {
    setMatrixMode(prev => !prev)
    console.log(matrixMode ? '🔧 Matrix mode disabled' : '🤖 Matrix mode enabled')
  }, [matrixMode])
  
  /**
   * Boot sequence effect
   */  useEffect(() => {
    const timer = setTimeout(() => {
      setBootComplete(true)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className={`relative w-full min-h-screen bg-terminal-black overflow-hidden ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-terminal-black via-gray-900 to-terminal-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,191,0,0.1)_0%,transparent_50%)]" />
      
      {/* Main Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Panel - Terminal */}
        <div className="flex flex-col border-r border-terminal-amber/30">
          <div className="flex-1 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="h-full"
            >
              <TerminalShell
                commands={[
                  ...config.terminalCommands.basic,
                  ...config.terminalCommands.advanced,
                  ...config.terminalCommands.system
                ]}
                onCommand={handleTerminalCommand}
                bootSequence={config.bootSequence}
                className="h-full"
                matrixMode={matrixMode}
                onMatrixModeToggle={handleMatrixModeToggle}
              />
            </motion.div>
          </div>
        </div>
        
        {/* Right Panel - 3D Skill Tree */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full"
          >
            <CRTMonitor3D matrixMode={matrixMode}>
              <div className="w-full h-full">
                {bootComplete ? (
                  <Canvas
                    camera={{ position: [0, 0, 5], fov: 75 }}
                    style={{ background: 'transparent' }}
                  >
                    {/* Lighting */}
                    <ambientLight intensity={0.3} />
                    <pointLight 
                      position={[5, 5, 5]} 
                      intensity={0.5} 
                      color="#ffbf00" 
                    />
                    <pointLight 
                      position={[-5, -5, 5]} 
                      intensity={0.3} 
                      color="#00ff88" 
                    />
                    
                    {/* 3D Scene */}
                    <Suspense fallback={null}>
                      <SkillTreeScene
                        skills={allSkills}
                        categories={data.categories}
                        connections={connections}
                        selectedSkill={selectedSkill}
                        hoveredSkill={hoveredSkill}
                        onSkillSelect={setSelectedSkill}
                        onSkillHover={setHoveredSkill}
                        scale={scale}
                      />
                    </Suspense>
                    
                    {/* Controls */}
                    <OrbitControls
                      enablePan={true}
                      enableZoom={true}
                      enableRotate={true}
                      minDistance={2}
                      maxDistance={20}
                      maxPolarAngle={Math.PI / 2}
                    />
                    
                    {showDebug && <axesHelper args={[5]} />}
                  </Canvas>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-terminal-amber font-mono text-lg mb-4">
                        INITIALIZING NEURAL PATHWAYS...
                      </div>
                      <div className="flex space-x-1 justify-center">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-terminal-amber rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CRTMonitor3D>
          </motion.div>
        </div>
      </div>
      
      {/* Skill Details Panel */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 right-4 w-80 bg-black/95 border border-terminal-amber/50 rounded-lg p-6 backdrop-blur-sm z-50"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-terminal-amber font-mono text-lg">
                {selectedSkill.name}
              </h3>
              <button
                onClick={() => setSelectedSkill(null)}
                className="text-terminal-cream hover:text-terminal-amber transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Level and XP */}
              <div>
                <div className="flex justify-between text-sm text-terminal-cream mb-1">
                  <span>Level {selectedSkill.level}</span>
                  <span>{selectedSkill.xp}/{selectedSkill.maxXp} XP</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-terminal-amber h-2 rounded-full"
                    style={{ width: `${(selectedSkill.xp / selectedSkill.maxXp) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Status */}
              <div className="flex items-center space-x-2">
                <span className="text-terminal-cream">Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-mono ${
                  selectedSkill.status === 'mastered' ? 'bg-green-500/20 text-green-400' :
                  selectedSkill.status === 'learning' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {selectedSkill.status.toUpperCase()}
                </span>
              </div>
              
              {/* Description */}
              <div>
                <p className="text-terminal-cream text-sm leading-relaxed">
                  {selectedSkill.description}
                </p>
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
    </div>
  )
}

export default SkillTree3D
