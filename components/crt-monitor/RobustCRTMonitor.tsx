/**
 * PRODUCTION-READY CRT MONITOR COMPONENT
 * Enhanced 3D CRT monitor with robust error handling and performance optimization
 */
'use client'

import { Suspense, useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, useTexture } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

// Custom hooks
import { use3DMemory } from '../../hooks/use3DMemory'
import { usePerformanceOptimization } from '../../hooks/usePerformanceOptimization'
import { Enhanced3DErrorBoundary } from '../error-boundary/Enhanced3DErrorBoundary'

// Shaders
import { crtVertexShader, crtFragmentShader } from '../../shaders/crt-shaders'

interface CRTMonitorProps {
  className?: string
  content?: string
  showControls?: boolean
  quality?: 'low' | 'medium' | 'high'
  enableEffects?: boolean
  onError?: (error: Error) => void
}

interface CRTMaterial extends THREE.ShaderMaterial {
  uniforms: {
    tDiffuse: { value: THREE.Texture | null }
    time: { value: number }
    intensity: { value: number }
    curvature: { value: number }
    scanlineIntensity: { value: number }
    noiseIntensity: { value: number }
    glowIntensity: { value: number }
    glowColor: { value: THREE.Vector3 }
    resolution: { value: THREE.Vector2 }
    enableCurvature: { value: boolean }
    enableScanlines: { value: boolean }
    enableNoise: { value: boolean }
    enableGlow: { value: boolean }
  }
}

// CRT Screen Component
function CRTScreen({ 
  content, 
  quality = 'medium',
  enableEffects = true 
}: {
  content?: string | undefined
  quality: 'low' | 'medium' | 'high'
  enableEffects: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<CRTMaterial>(null)
  const memoryManager = use3DMemory()
  const { viewport } = useThree()
  
  // Quality settings
  const qualitySettings = useMemo(() => {
    switch (quality) {
      case 'low':
        return { segments: 32, textureSize: 512, enableAllEffects: false }
      case 'high':
        return { segments: 128, textureSize: 2048, enableAllEffects: true }
      default:
        return { segments: 64, textureSize: 1024, enableAllEffects: enableEffects }
    }
  }, [quality, enableEffects])

  // Create screen geometry
  const geometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(4, 3, qualitySettings.segments, qualitySettings.segments)
    return memoryManager.trackGeometry(geom)
  }, [qualitySettings.segments, memoryManager])

  // Create canvas texture for screen content
  const canvasTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = qualitySettings.textureSize
    canvas.height = qualitySettings.textureSize * 0.75 // 4:3 aspect ratio
    
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Failed to get 2D context')

    // Set up terminal background
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Terminal text styling
    ctx.fillStyle = '#00ff00'
    ctx.font = `${canvas.height * 0.04}px 'Courier New', monospace`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'

    // Draw terminal content
    const lines = (content || defaultTerminalContent).split('\n')
    const lineHeight = canvas.height * 0.05
    
    lines.forEach((line, index) => {
      const y = lineHeight * (index + 1)
      if (y < canvas.height) {
        ctx.fillText(line, canvas.width * 0.02, y)
      }
    })

    // Add cursor
    const cursorX = canvas.width * 0.02 + ctx.measureText('$ ').width
    const cursorY = lineHeight * (lines.length + 1)
    if (cursorY < canvas.height) {
      ctx.fillStyle = '#00ff00'
      ctx.fillRect(cursorX, cursorY, canvas.width * 0.02, lineHeight * 0.8)
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.format = THREE.RGBAFormat
    texture.generateMipmaps = quality !== 'low'
    texture.minFilter = quality === 'low' ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    
    return memoryManager.trackTexture(texture)
  }, [content, qualitySettings.textureSize, quality, memoryManager])

  // Create CRT shader material
  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: crtVertexShader,
      fragmentShader: crtFragmentShader,
      uniforms: {
        tDiffuse: { value: canvasTexture },
        time: { value: 0 },
        intensity: { value: 1.0 },
        curvature: { value: qualitySettings.enableAllEffects ? 6.0 : 10.0 },
        scanlineIntensity: { value: qualitySettings.enableAllEffects ? 0.3 : 0.1 },
        noiseIntensity: { value: qualitySettings.enableAllEffects ? 0.1 : 0.02 },
        glowIntensity: { value: qualitySettings.enableAllEffects ? 0.5 : 0.2 },
        glowColor: { value: new THREE.Vector3(0, 1, 0) },
        resolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
        enableCurvature: { value: qualitySettings.enableAllEffects },
        enableScanlines: { value: qualitySettings.enableAllEffects },
        enableNoise: { value: qualitySettings.enableAllEffects },
        enableGlow: { value: qualitySettings.enableAllEffects }
      },
      transparent: false,
      side: THREE.FrontSide
    }) as CRTMaterial
    
    return memoryManager.trackMaterial(mat)
  }, [canvasTexture, qualitySettings, viewport, memoryManager])

  // Animation
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
      
      // Subtle screen flicker
      if (qualitySettings.enableAllEffects) {
        const flicker = 1 + Math.sin(state.clock.elapsedTime * 60) * 0.01
        materialRef.current.uniforms.intensity.value = flicker
      }
    }
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[0, 0, 0.01]}
    >      <shaderMaterial
        ref={materialRef}
        attach="material"
        vertexShader={crtVertexShader}
        fragmentShader={crtFragmentShader}
        uniforms={(material as any).uniforms}
      />
    </mesh>
  )
}

// Monitor Housing Component
function MonitorHousing({ quality }: { quality: 'low' | 'medium' | 'high' }) {
  const memoryManager = use3DMemory()
  
  const geometry = useMemo(() => {
    const segments = quality === 'low' ? 8 : quality === 'medium' ? 16 : 32
    const geom = new THREE.BoxGeometry(5, 4, 2, segments, segments, segments)
    return memoryManager.trackGeometry(geom)
  }, [quality, memoryManager])

  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.8,
      metalness: 0.2,
      envMapIntensity: 0.5
    })
    return memoryManager.trackMaterial(mat)
  }, [memoryManager])

  return (
    <mesh geometry={geometry} material={material} position={[0, 0, -1]}>
      {/* Screen bezel */}
      <mesh position={[0, 0, 1]}>
        <ringGeometry args={[2.2, 2.5, 32]} />
        <meshStandardMaterial color={0x1a1a1a} />
      </mesh>
    </mesh>
  )
}

// Default terminal content
const defaultTerminalContent = `Welcome to RajinOS v2.1.0
Last login: ${new Date().toLocaleString()}

$ whoami
rajin-uddin

$ cat about.txt
Full-Stack Developer & CS Student
Specializing in React, TypeScript, Node.js

$ ls -la skills/
drwxr-xr-x  5 rajin staff   160 Dec 22 10:30 frontend/
drwxr-xr-x  4 rajin staff   128 Dec 22 10:30 backend/
drwxr-xr-x  3 rajin staff    96 Dec 22 10:30 devops/
drwxr-xr-x  6 rajin staff   192 Dec 22 10:30 databases/

$ system-status
● System Status: ONLINE
● CPU Usage: 23%
● Memory: 6.2GB / 16GB
● Projects: 12 active
● Coffee Level: ████████░░ 80%

$ _`

// Loading fallback
function CRTMonitorFallback() {
  return (
    <div className="h-96 bg-gray-900 border-2 border-gray-700 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-green-400 font-mono">Initializing CRT Monitor...</p>
      </div>
    </div>
  )
}

// Main CRT Monitor Component
export default function RobustCRTMonitor({
  className = '',
  content,
  showControls = true,
  quality = 'medium',
  enableEffects = true,
  onError
}: CRTMonitorProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const performanceConfig = usePerformanceOptimization()
  
  const finalQuality = useMemo(() => {
    if (!performanceConfig.enable3D) return 'low'
    if (!performanceConfig.enableAdvancedEffects) return 'medium'
    return quality
  }, [quality, performanceConfig])

  const finalEnableEffects = useMemo(() => {
    return enableEffects && performanceConfig.enableAdvancedEffects
  }, [enableEffects, performanceConfig])

  const handleSceneReady = useCallback(() => {
    setIsLoaded(true)
  }, [])

  if (!performanceConfig.enable3D) {
    return (
      <div className={`${className} p-8`}>
        <div className="bg-black border-4 border-gray-600 rounded-lg p-6 font-mono text-green-400">
          <div className="whitespace-pre-line">{content || defaultTerminalContent}</div>
        </div>
      </div>
    )
  }

  return (    <Enhanced3DErrorBoundary
      section="CRTMonitor"
      onError={onError || undefined}
      enableRetry={true}
      maxRetries={2}
    >
      <div className={`${className} h-96 relative`}>
        <Suspense fallback={<CRTMonitorFallback />}>
          <Canvas
            camera={{ position: [0, 0, 6], fov: 50 }}
            dpr={finalQuality === 'low' ? 1 : window.devicePixelRatio}
            performance={{ min: 0.5 }}
            onCreated={handleSceneReady}
            gl={{
              antialias: finalQuality !== 'low',
              alpha: false,
              powerPreference: 'high-performance'
            }}
          >
            <PerspectiveCamera makeDefault position={[0, 0, 6]} />
            
            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <pointLight position={[-5, -5, 5]} intensity={0.5} color="#00ff00" />
            
            {/* Environment */}
            <Environment preset="studio" />
            
            {/* CRT Monitor */}
            <group>
              <MonitorHousing quality={finalQuality} />              <CRTScreen 
                content={content || undefined}
                quality={finalQuality}
                enableEffects={finalEnableEffects}
              />
            </group>
            
            {/* Controls */}
            {showControls && (
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                maxDistance={10}
                minDistance={3}
                autoRotate={false}
                autoRotateSpeed={0.5}
              />
            )}
          </Canvas>
        </Suspense>
        
        {/* Loading indicator */}
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          >
            <div className="text-green-400 font-mono text-center">
              <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p>Loading 3D Monitor...</p>
            </div>
          </motion.div>
        )}
      </div>
    </Enhanced3DErrorBoundary>
  )
}
