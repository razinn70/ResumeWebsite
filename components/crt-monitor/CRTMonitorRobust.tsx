/**
 * ROBUST CRT MONITOR COMPONENT - SIMPLIFIED & PRODUCTION READY
 * Focus on reliability over advanced features
 */
'use client'

import React, { useRef, useEffect, useMemo, useCallback, forwardRef, useImperativeHandle, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  Mesh, 
  Group, 
  ShaderMaterial, 
  Vector3, 
  CanvasTexture,
  LinearFilter,
  RGBAFormat,
  MeshStandardMaterial,
  PlaneGeometry,
  BoxGeometry
} from 'three';

// Custom hooks
import { use3DMemory } from '../../hooks/use3DMemory';
import { usePerformanceOptimization } from '../../hooks/usePerformanceOptimization';

interface CRTMonitorProps {
  model?: string;
  position?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
  screenContent?: string;
  autoPlay?: boolean;
  quality?: 'low' | 'medium' | 'high';
  onError?: (error: Error) => void;
}

interface CRTMonitorRef {
  powerOn: () => void;
  powerOff: () => void;
  setBrightness: (value: number) => void;
  setContrast: (value: number) => void;
  cleanup: () => void;
  getStats: () => any;
}

const CRTMonitor = forwardRef<CRTMonitorRef, CRTMonitorProps>(({
  model = 'commodore-1084',
  position = new Vector3(0, 0, 0),
  rotation = new Vector3(0, 0, 0),
  scale = new Vector3(1, 1, 1),
  screenContent = 'CRT Monitor Test Pattern',
  autoPlay = true,
  quality = 'high',
  onError
}, ref) => {
  
  // Performance and memory management
  const performanceConfig = usePerformanceOptimization();
  const memoryManager = use3DMemory({
    maxTextures: 5,
    maxGeometries: 3,
    maxMaterials: 3,
    enablePerformanceMonitoring: process.env.NODE_ENV === 'development'
  });

  // Refs
  const groupRef = useRef<Group>(null);
  const screenMeshRef = useRef<Mesh>(null);
  const housingMeshRef = useRef<Mesh>(null);
  const screenMaterialRef = useRef<MeshStandardMaterial>(null);
  
  // State
  const [isPoweredOn, setIsPoweredOn] = useState(autoPlay);
  const [currentBrightness, setCurrentBrightness] = useState(0.8);
  const [currentContrast, setCurrentContrast] = useState(0.9);
  const [isLoading, setIsLoading] = useState(true);

  // Error handling wrapper
  const safeExecute = useCallback((fn: () => void, context: string) => {
    try {
      fn();
    } catch (error) {
      console.error(`CRT Monitor error in ${context}:`, error);
      onError?.(error as Error);
    }
  }, [onError]);

  // Create screen texture with safe execution
  const screenTexture = useMemo(() => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Could not get 2D context');
      
      // Create retro CRT screen content
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (isPoweredOn) {
        // Color bars
        const barWidth = canvas.width / 8;
        const colors = ['#fff', '#ff0', '#0ff', '#0f0', '#f0f', '#f00', '#00f', '#000'];
        colors.forEach((color, i) => {
          ctx.fillStyle = color;
          ctx.fillRect(i * barWidth, 0, barWidth, canvas.height * 0.6);
        });
        
        // Text content
        ctx.fillStyle = '#0f0';
        ctx.font = 'bold 32px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(screenContent, canvas.width / 2, canvas.height * 0.75);
        
        ctx.font = '16px monospace';
        ctx.fillText(`${model.toUpperCase()} - 640x480`, canvas.width / 2, canvas.height * 0.85);
        
        // Scanlines effect
        for (let y = 0; y < canvas.height; y += 4) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.fillRect(0, y, canvas.width, 2);
        }
      }
      
      const texture = new CanvasTexture(canvas);
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;
      texture.format = RGBAFormat;
      
      return memoryManager.trackTexture(texture);
    } catch (error) {
      console.error('Failed to create screen texture:', error);
      onError?.(error as Error);
      return null;
    }
  }, [screenContent, model, isPoweredOn, memoryManager, onError]);

  // Create geometries
  const screenGeometry = useMemo(() => {
    const geometry = new PlaneGeometry(1.6, 1.2);
    return memoryManager.trackGeometry(geometry);
  }, [memoryManager]);

  const housingGeometry = useMemo(() => {
    const geometry = new BoxGeometry(2, 1.5, 1);
    return memoryManager.trackGeometry(geometry);
  }, [memoryManager]);

  // Create materials
  const screenMaterial = useMemo(() => {
    const material = new MeshStandardMaterial({
      map: screenTexture,
      emissive: isPoweredOn ? '#004400' : '#000000',
      emissiveIntensity: isPoweredOn ? 0.3 : 0,
      roughness: 0.1,
      metalness: 0.1
    });
    return memoryManager.trackMaterial(material);
  }, [screenTexture, isPoweredOn, memoryManager]);

  const housingMaterial = useMemo(() => {
    const material = new MeshStandardMaterial({
      color: '#2a2a2a',
      roughness: 0.8,
      metalness: 0.2
    });
    return memoryManager.trackMaterial(material);
  }, [memoryManager]);

  // Update material properties
  useEffect(() => {
    if (screenMaterialRef.current) {
      safeExecute(() => {
        if (screenMaterialRef.current) {
          screenMaterialRef.current.emissive.setHex(isPoweredOn ? 0x004400 : 0x000000);
          screenMaterialRef.current.emissiveIntensity = isPoweredOn ? currentBrightness * 0.5 : 0;
          screenMaterialRef.current.needsUpdate = true;
        }
      }, 'material update');
    }
  }, [isPoweredOn, currentBrightness, safeExecute]);

  // Animation frame
  useFrame((state, delta) => {
    if (performanceConfig.enableAnimations && isPoweredOn) {
      safeExecute(() => {
        // Subtle screen flicker
        if (screenMaterialRef.current) {
          const flicker = 0.95 + Math.sin(state.clock.elapsedTime * 60) * 0.05;
          screenMaterialRef.current.emissiveIntensity = currentBrightness * 0.5 * flicker;
        }
      }, 'animation frame');
    }
  });

  // Control functions
  const powerOn = useCallback(() => {
    setIsPoweredOn(true);
  }, []);

  const powerOff = useCallback(() => {
    setIsPoweredOn(false);
  }, []);

  const setBrightness = useCallback((value: number) => {
    setCurrentBrightness(Math.max(0, Math.min(1, value)));
  }, []);

  const setContrast = useCallback((value: number) => {
    setCurrentContrast(Math.max(0, Math.min(1, value)));
  }, []);

  const cleanup = useCallback(() => {
    memoryManager.cleanupAll();
  }, [memoryManager]);

  const getStats = useCallback(() => {
    return {
      ...memoryManager.getMemoryStats(),
      isPoweredOn,
      brightness: currentBrightness,
      contrast: currentContrast,
      model
    };
  }, [memoryManager, isPoweredOn, currentBrightness, currentContrast, model]);

  // Expose API through ref
  useImperativeHandle(ref, () => ({
    powerOn,
    powerOff,
    setBrightness,
    setContrast,
    cleanup,
    getStats
  }), [powerOn, powerOff, setBrightness, setContrast, cleanup, getStats]);

  // Loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !screenTexture) {
    return (
      <group ref={groupRef} position={position.toArray()} rotation={rotation.toArray()} scale={scale.toArray()}>
        <mesh>
          <boxGeometry args={[2, 1.5, 1]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
    );
  }

  return (
    <group 
      ref={groupRef} 
      position={position.toArray()} 
      rotation={rotation.toArray()} 
      scale={scale.toArray()}
    >
      {/* CRT Housing */}
      <mesh ref={housingMeshRef} material={housingMaterial} geometry={housingGeometry}>
      </mesh>
      
      {/* CRT Screen */}
      <mesh 
        ref={screenMeshRef} 
        material={screenMaterial} 
        geometry={screenGeometry}
        position={[0, 0, 0.51]}
      >
      </mesh>
      
      {/* Power LED */}
      <mesh position={[0.8, -0.6, 0.51]}>
        <sphereGeometry args={[0.02]} />
        <meshStandardMaterial 
          color={isPoweredOn ? '#00ff00' : '#330000'} 
          emissive={isPoweredOn ? '#004400' : '#000000'}
          emissiveIntensity={isPoweredOn ? 1 : 0}
        />
      </mesh>
    </group>
  );
});

CRTMonitor.displayName = 'CRTMonitor';

export default CRTMonitor;
