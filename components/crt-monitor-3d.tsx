'use client'

import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, PerspectiveCamera } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

interface CRTMonitorProps {
  children: React.ReactNode
  className?: string
}

// CRT Screen Material with custom shaders
const CRTScreenMaterial = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
  
  const fragmentShader = `
    uniform float time;
    uniform vec3 color;
    uniform float scanlineIntensity;
    uniform float curvature;
    uniform float vignette;
    varying vec2 vUv;
    
    vec2 curveScreen(vec2 uv) {
      uv = uv * 2.0 - 1.0;
      vec2 offset = abs(uv.yx) / vec2(curvature, curvature);
      uv = uv + uv * offset * offset;
      uv = uv * 0.5 + 0.5;
      return uv;
    }
    
    void main() {
      vec2 screenPos = curveScreen(vUv);
      
      // Vignette effect
      float dist = distance(screenPos, vec2(0.5));
      float vignetteEffect = smoothstep(vignette, vignette * 0.5, dist);
      
      // Scanlines
      float scanline = sin(screenPos.y * 800.0) * 0.04 * scanlineIntensity;
      
      // Flicker
      float flicker = 0.98 + 0.02 * sin(time * 60.0);
      
      // Phosphor glow
      vec3 phosphor = color * (0.95 + 0.05 * sin(time * 10.0));
      
      gl_FragColor = vec4(phosphor * vignetteEffect * flicker + scanline, 1.0);
    }
  `
  
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    color: { value: new THREE.Color(0xFFB000) },
    scanlineIntensity: { value: 0.5 },
    curvature: { value: 6.0 },
    vignette: { value: 0.8 }
  }), [])
    useFrame((state) => {
    if (materialRef.current?.uniforms?.['time']) {
      materialRef.current.uniforms['time'].value = state.clock.elapsedTime
    }
  })
  
  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      transparent
    />
  )
}

// 3D CRT Monitor Geometry
const CRTMonitor = ({ children }: { children: React.ReactNode }) => {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.01
    }
  })
  
  return (
    <group ref={groupRef}>
      {/* Monitor Housing */}
      <mesh position={[0, 0, -0.5]}>
        <boxGeometry args={[4.2, 3.2, 1]} />
        <meshPhysicalMaterial 
          color="#2a2a2a" 
          roughness={0.3} 
          metalness={0.7}
          clearcoat={0.3}
        />
      </mesh>
      
      {/* Screen Bezel */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[4, 3, 0.1]} />
        <meshPhysicalMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
        {/* CRT Screen with Curvature */}
      <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2, 2, 0.05, 32]} />
        <CRTScreenMaterial />
      </mesh>
      
      {/* Screen Content */}
      <Html
        transform
        distanceFactor={1}
        position={[0, 0, 0.1]}
        style={{
          width: '380px',
          height: '285px',
          background: 'transparent',
          overflow: 'hidden'
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          {children}
        </div>
      </Html>
      
      {/* Monitor Stand */}
      <mesh position={[0, -2, -0.3]}>
        <cylinderGeometry args={[0.3, 0.5, 0.8]} />
        <meshPhysicalMaterial color="#333" roughness={0.4} metalness={0.6} />
      </mesh>
      
      {/* Base */}
      <mesh position={[0, -2.5, -0.3]}>
        <cylinderGeometry args={[1, 1, 0.2]} />
        <meshPhysicalMaterial color="#444" roughness={0.5} metalness={0.5} />
      </mesh>
    </group>
  )
}

export function CRTMonitor3D({ children, className = "" }: CRTMonitorProps) {
  return (
    <div className={`w-full h-full min-h-[600px] ${className}`}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
        
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#FFB000" />
        <spotLight 
          position={[0, 10, 0]} 
          intensity={0.5} 
          color="#4FC3F7"
          castShadow
        />
          {/* Environment */}
        {/* <Environment preset="night" /> */}
        <color args={['#0a0a0a']} attach="background" />
        
        <Suspense fallback={null}>
          <CRTMonitor>
            {children}
          </CRTMonitor>
        </Suspense>
        
        {/* Post Processing Effects */}
        <EffectComposer>
          <Bloom 
            intensity={0.8} 
            luminanceThreshold={0.2} 
            luminanceSmoothing={0.9}
            blendFunction={BlendFunction.ADD}
          />
          <Noise 
            opacity={0.05} 
            blendFunction={BlendFunction.MULTIPLY}
          />
          <Vignette 
            eskil={false} 
            offset={0.1} 
            darkness={0.3}
          />
          <ChromaticAberration 
            offset={[0.001, 0.001]} 
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default CRTMonitor3D
