'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  PerspectiveCamera, 
  Html, 
  Preload,
  Stats
} from '@react-three/drei'
import { 
  EffectComposer, 
  Bloom, 
  ChromaticAberration,
  Noise,
  Vignette 
} from '@react-three/postprocessing'
import * as THREE from 'three'
import { Suspense } from 'react'
import { 
  crtVertexShader, 
  crtFragmentShader,
  matrixRainVertexShader,
  matrixRainFragmentShader
} from '../../shaders/crt-shaders'

interface CRTMonitor3DProps {
  children?: React.ReactNode
  className?: string
  showStats?: boolean
  matrixMode?: boolean
  onTerminalReady?: () => void
}

interface CRTScreenProps {
  children: React.ReactNode
  matrixMode?: boolean
}

// CRT Monitor Geometry and Materials
function CRTMonitor({ children, matrixMode = false }: CRTScreenProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const screenRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const matrixRef = useRef<THREE.ShaderMaterial>(null!)
  
  // Create render target for screen content
  const renderTarget = useMemo(() => 
    new THREE.WebGLRenderTarget(1024, 768, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    }), []
  )
  
  // CRT Shader uniforms
  const crtUniforms = useMemo(() => ({
    tDiffuse: { value: renderTarget.texture },
    time: { value: 0 },
    intensity: { value: 1.0 },
    curvature: { value: 6.0 },
    scanlineIntensity: { value: 0.3 },
    noiseIntensity: { value: 0.1 },
    glowColor: { value: new THREE.Color('#ffbf00') }
  }), [renderTarget])
  
  // Matrix Rain uniforms (Easter Egg)
  const matrixUniforms = useMemo(() => ({
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(80, 60) },
    matrixColor: { value: new THREE.Color('#00ff41') }
  }), [])
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = time
    }
    
    if (matrixRef.current && matrixMode) {
      matrixRef.current.uniforms.time.value = time
    }
  })
  
  return (
    <group position={[0, 0, 0]}>
      {/* Monitor Housing */}
      <mesh ref={meshRef} position={[0, 0, -0.5]}>
        <boxGeometry args={[4.5, 3.5, 1]} />
        <meshStandardMaterial 
          color="#2a2a2a" 
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Monitor Bezel */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[4.2, 3.2, 0.2]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* CRT Screen */}
      <mesh ref={screenRef} position={[0, 0, 0]}>
        <planeGeometry args={[3.8, 2.8]} />
        {matrixMode ? (
          <shaderMaterial
            ref={matrixRef}
            vertexShader={matrixRainVertexShader}
            fragmentShader={matrixRainFragmentShader}
            uniforms={matrixUniforms}
            transparent
          />
        ) : (
          <shaderMaterial
            ref={materialRef}
            vertexShader={crtVertexShader}
            fragmentShader={crtFragmentShader}
            uniforms={crtUniforms}
            transparent={false}
          />
        )}
      </mesh>
      
      {/* Screen Content */}
      <Html
        transform
        occlude
        position={[0, 0, 0.01]}
        style={{
          width: '380px',
          height: '280px',
          background: 'rgba(0, 0, 0, 0.95)',
          border: '2px solid #ffbf00',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(255, 191, 0, 0.3)'
        }}
      >
        <div className="w-full h-full p-4 text-terminal-amber font-mono text-xs leading-relaxed">
          {children}
        </div>
      </Html>
      
      {/* Ambient screen glow */}
      <pointLight
        position={[0, 0, 1]}
        color="#ffbf00"
        intensity={0.5}
        decay={2}
        distance={10}
      />
    </group>
  )
}

// Ambient Environment
function AmbientEnvironment() {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.1} color="#0a0a0a" />
      
      {/* Key light */}
      <pointLight
        position={[5, 5, 5]}
        intensity={0.3}
        color="#ffbf00"
        decay={2}
      />
      
      {/* Fill light */}
      <pointLight
        position={[-3, -3, 3]}
        intensity={0.1}
        color="#00ff41"
        decay={2}
      />
      
      {/* Rim light */}
      <directionalLight
        position={[0, 0, -10]}
        intensity={0.2}
        color="#ff6b6b"
      />
      
      {/* Environment background */}
      <color args={['#050505']} attach="background" />
    </>  )
}

// Camera Controls
function CameraController() {
  const { camera } = useThree()
  
  useFrame((state) => {
    // Subtle camera movement for immersion
    const time = state.clock.elapsedTime
    camera.position.x = Math.sin(time * 0.1) * 0.2
    camera.position.y = Math.cos(time * 0.15) * 0.1
    camera.lookAt(0, 0, 0)
  })
  
  return null
}

// Main CRT Monitor Component
export function CRTMonitor3D({ 
  children, 
  className = "", 
  showStats = false,
  matrixMode = false,
  onTerminalReady 
}: CRTMonitor3DProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
      onTerminalReady?.()
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [onTerminalReady])
  
  return (
    <div className={`w-full h-full min-h-[600px] ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        {/* Stats for debugging */}
        {showStats && <Stats />}
        
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <CameraController />
        
        {/* Environment */}
        <AmbientEnvironment />
        
        {/* Main CRT Monitor */}
        <Suspense fallback={null}>
          <CRTMonitor matrixMode={matrixMode}>
            {isLoaded ? children : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-terminal-green text-xs mb-2">
                  SKILL-OS v2.1.0 BOOTING...
                </div>
                <div className="w-32 h-1 bg-terminal-black border border-terminal-amber">
                  <div 
                    className="h-full bg-terminal-amber transition-all duration-1000"
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="text-terminal-amber text-xs mt-2">
                  Loading complete.
                </div>
              </div>
            )}
          </CRTMonitor>
        </Suspense>
        
        {/* Post-processing effects */}
        <EffectComposer>
          <Bloom 
            intensity={0.3} 
            luminanceThreshold={0.2} 
            luminanceSmoothing={0.9}
          />
          <ChromaticAberration 
            offset={[0.001, 0.001]} 
          />
          <Noise 
            premultiply 
            opacity={0.05}
          />
          <Vignette 
            eskil={false} 
            offset={0.1} 
            darkness={0.3}
          />
        </EffectComposer>
        
        {/* Preload assets */}
        <Preload all />
      </Canvas>
    </div>
  )
}

export default CRTMonitor3D
