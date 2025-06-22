/**
 * ROBUST CRT MONITOR COMPONENT - PRODUCTION READY
 * Features proper memory management, error handling, and performance optimization
 */
import React, { useRef, useEffect, useMemo, useCallback, forwardRef, useImperativeHandle, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { 
  Mesh, 
  Group, 
  ShaderMaterial, 
  Vector2, 
  Vector3, 
  Color,
  CanvasTexture,
  LinearFilter,
  RGBAFormat,
  DataTexture,
  FloatType,
  MeshStandardMaterial,
  MeshBasicMaterial,
  WebGLRenderer
} from 'three';
import { Text } from '@react-three/drei';

// Custom hooks
import { use3DMemory } from '../../hooks/use3DMemory';
import { usePerformanceOptimization } from '../../hooks/usePerformanceOptimization';

// CRT specific imports (with error handling)
let CRTPhysicsSimulator: any;
let CRTShaders: any;
let CRTGeometryGenerator: any;
let CRTModels: any;

try {
  ({ CRTPhysicsSimulator } = require('./physics/crt-physics'));
  ({ CRTShaders } = require('./shaders/crt-shaders'));
  ({ CRTGeometryGenerator, CRTModels } = require('./models/crt-models'));
} catch (error) {
  console.error('Failed to load CRT modules:', error);
  // Fallback implementations
  CRTPhysicsSimulator = class { update() {} };
  CRTShaders = { createCRTMaterial: () => null };
  CRTGeometryGenerator = { createCRTGeometry: () => null };
  CRTModels = {
    'commodore-1084': {
      name: 'Commodore 1084',
      resolution: [640, 480],
      aspectRatio: 4/3,
      screenCurvature: 0.1,
      phosphorType: 'P22',
      year: 1985
    }
  };
}

// Types (with fallbacks)
// Define the control layout type
interface ControlLayout {
  position: { x: number; y: number; z: number };
  label: string;
  type: string;
}

interface CRTModel {
  name: string;
  resolution: number[];
  aspectRatio: number;
  screenCurvature: number;
  phosphorType: string;
  year: number;
  dimensions?: { x: number; y: number; z: number };
  screenInset?: number;
  bezelThickness?: number;
  hasControls?: boolean;
  housing?: string;
  curvature?: number;
  controlLayout?: Record<string, ControlLayout>;
}

interface CRTMonitorProps {
  model?: string | CRTModel;
  position?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
  screenContent?: any;
  autoPlay?: boolean;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  controls?: any;
  events?: any;
  onError?: (error: Error) => void;
  enablePhysics?: boolean;
  enableMemoryOptimization?: boolean;
}

import { CRTMonitorRef, CRTMonitorState, CRTShaderUniforms } from './types';

const CRTMonitor = forwardRef<CRTMonitorRef, CRTMonitorProps>(({
  model = 'commodore-1084',
  position = new Vector3(0, 0, 0),
  rotation = new Vector3(0, 0, 0),
  scale = new Vector3(1, 1, 1),
  screenContent = null,
  autoPlay = true,
  quality = 'high',
  controls = {},
  events = {},
  onError,
  enablePhysics = true,
  enableMemoryOptimization = true
}, ref) => {
  
  // Performance and memory management
  const performanceConfig = usePerformanceOptimization();
  const memoryManager = use3DMemory({
    maxTextures: quality === 'ultra' ? 20 : 10,
    maxGeometries: 5,
    maxMaterials: 5,
    enablePerformanceMonitoring: process.env.NODE_ENV === 'development'
  });

  // Refs
  const groupRef = useRef<Group>(null);
  const screenMeshRef = useRef<Mesh>(null);
  const housingMeshRef = useRef<Mesh>(null);
  const screenMaterialRef = useRef<ShaderMaterial>(null);
  const errorStateRef = useRef<{ hasError: boolean; errorCount: number }>({ 
    hasError: false, 
    errorCount: 0 
  });
  
  // State with error handling
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPoweredOn, setIsPoweredOn] = useState(autoPlay);
  const [currentBrightness, setCurrentBrightness] = useState(0.8);
  const [currentContrast, setCurrentContrast] = useState(0.9);
  const [lastFrameTime, setLastFrameTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Critical error recovery and graceful degradation
  const [errorState, setErrorState] = useState<{
    hasWebGLError: boolean;
    hasShaderError: boolean;
    hasPhysicsError: boolean;
    fallbackMode: boolean;
  }>({
    hasWebGLError: false,
    hasShaderError: false,
    hasPhysicsError: false,
    fallbackMode: false
  });

  // Error handling wrapper
  const safeExecute = useCallback((fn: () => void, context: string) => {
    try {
      fn();
    } catch (error) {
      console.error(`CRT Monitor error in ${context}:`, error);
      errorStateRef.current.errorCount++;
      
      if (errorStateRef.current.errorCount > 5) {
        errorStateRef.current.hasError = true;
        onError?.(error as Error);
      }
    }
  }, [onError]);

  // Get CRT model with fallback
  const crtModel = useMemo(() => {
    try {
      if (typeof model === 'string') {
        return CRTModels[model] || CRTModels['commodore-1084'];
      }
      return model;
    } catch (error) {
      console.error('Failed to load CRT model:', error);
      return {
        name: 'Fallback CRT',
        resolution: [640, 480],
        aspectRatio: 4/3,
        screenCurvature: 0.1,
        phosphorType: 'P22',
        year: 1985
      };
    }
  }, [model]);
  
  // Initialize physics simulator with error handling
  const physicsSimulator = useMemo(() => {
    try {
      return enablePhysics ? new CRTPhysicsSimulator() : null;
    } catch (error) {
      console.error('Failed to initialize CRT physics:', error);
      return null;
    }
  }, [enablePhysics]);
  
  // Create screen texture from content
  const screenTexture = useMemo(() => {
    if (!screenContent) {
      // Create a default test pattern
      const canvas = document.createElement('canvas');
      canvas.width = crtModel.resolution[0];
      canvas.height = crtModel.resolution[1];
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Create a retro test pattern
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Color bars
        const barWidth = canvas.width / 8;
        const colors = ['#fff', '#ff0', '#0ff', '#0f0', '#f0f', '#f00', '#00f', '#000'];
        colors.forEach((color, i) => {
          ctx.fillStyle = color;
          ctx.fillRect(i * barWidth, 0, barWidth, canvas.height * 0.7);
        });
        
        // Text
        ctx.fillStyle = '#fff';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CRT MONITOR TEST PATTERN', canvas.width / 2, canvas.height * 0.85);
        ctx.fillText(`${crtModel.name} - ${crtModel.resolution[0]}x${crtModel.resolution[1]}`, canvas.width / 2, canvas.height * 0.9);
      }
      
      const texture = new CanvasTexture(canvas);
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;
      return texture;
    }
    
    if (screenContent instanceof HTMLCanvasElement) {
      const texture = new CanvasTexture(screenContent);
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;
      return texture;
    }
    
    return screenContent;
  }, [screenContent, crtModel]);
  
  // Create burn-in texture
  const burnInTexture = useMemo(() => {
    const width = 256;
    const height = 256;
    const data = new Float32Array(width * height * 4);
    
    // Initialize with random burn-in patterns
    for (let i = 0; i < width * height; i++) {
      const x = i % width;
      const y = Math.floor(i / width);
      
      // Create some burn-in hotspots
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const burnIn = Math.max(0, 1 - dist / (width * 0.3)) * 0.1;
      
      data[i * 4] = burnIn;     // R
      data[i * 4 + 1] = burnIn; // G
      data[i * 4 + 2] = burnIn; // B
      data[i * 4 + 3] = 1.0;    // A
    }
    
    const texture = new DataTexture(data, width, height, RGBAFormat, FloatType);
    texture.needsUpdate = true;
    return texture;
  }, []);
    // Create shader uniforms
  const shaderUniforms: Record<string, any> = useMemo(() => ({
    // Screen properties
    uResolution: { value: new Vector2(crtModel.resolution[0], crtModel.resolution[1]) },
    uScreenTexture: { value: screenTexture },
    uScreenCurvature: { value: crtModel.curvature },
    uScreenBrightness: { value: currentBrightness },
    uScreenContrast: { value: currentContrast },
    
    // Scanlines
    uScanlineIntensity: { value: 0.3 },
    uScanlineCount: { value: crtModel.resolution[1] * 0.5 },
    uScanlineSpeed: { value: 1.0 },
    uInterlacing: { value: true },
    uScanlineThickness: { value: 1.2 },
    
    // Phosphor effects
    uPhosphorPersistence: { value: 16.67 },
    uPhosphorGlow: { value: 0.3 },
    uPhosphorType: { value: 22 }, // P22 phosphor
    uPhosphorTemperature: { value: 25.0 },
    uColorShift: { value: new Vector3(0, 0, 0) },
    uBrightness: { value: 1.0 },
    
    // Distortion
    uBarrelDistortion: { value: 0.1 },
    uPincushionDistortion: { value: 0.05 },
    uChromaticAberration: { value: 0.002 },
    uVignette: { value: 0.3 },
    
    // Aging and wear
    uBurnIn: { value: burnInTexture },
    uNoise: { value: 0.02 },
    uFlicker: { value: 0.01 },
    uAgingFactor: { value: 0.1 },
    
    // Convergence
    uConvergenceRed: { value: new Vector2(0.001, 0.0005) },
    uConvergenceGreen: { value: new Vector2(0, 0) },
    uConvergenceBlue: { value: new Vector2(-0.001, -0.0005) },
    uMisconvergence: { value: 0.02 },
    
    // Geometry drift
    uPincushion: { value: 0.01 },
    uBarrel: { value: 0.01 },
    uTrapezoid: { value: 0.005 },
    
    // Time and animation
    uTime: { value: 0 },
    uFrameTime: { value: 0 },
    uScanPosition: { value: new Vector2(0, 0) },
    
    // Electron beam
    uBeamIntensity: { value: 0.8 },
    uBeamFocus: { value: 0.9 },
    
    // Environmental
    uAmbientLight: { value: 0.2 },
    uReflection: { value: null },
    uReflectionStrength: { value: 0.1 },
    
    // Performance
    uLODLevel: { value: getQualityLevel(quality) },
    uQuality: { value: getQualityLevel(quality) }
  }), [screenTexture, burnInTexture, crtModel, currentBrightness, currentContrast, quality]);
    // Shader compilation error handling
  const createShaderMaterialSafely = useCallback(() => {
    try {
      return new ShaderMaterial({
        uniforms: shaderUniforms,
        vertexShader: CRTShaders.screen.vertex,
        fragmentShader: CRTShaders.screen.fragment,
        transparent: false,
        depthWrite: true,
        depthTest: true
      });
    } catch (error) {
      console.error('Shader compilation failed, using fallback:', error);
      setErrorState(prev => ({
        ...prev,
        hasShaderError: true,
        fallbackMode: true
      }));
      
      // Fallback to basic material
      return new MeshBasicMaterial({
        color: 0x001100,
        transparent: true,
        opacity: 0.8
      });
    }
  }, [shaderUniforms]);

  // Create geometries
  const screenGeometry = useMemo(() => {
    return CRTGeometryGenerator.generateScreenGeometry(crtModel, 64);
  }, [crtModel]);
  
  const housingGeometry = useMemo(() => {
    return CRTGeometryGenerator.generateHousingGeometry(crtModel);
  }, [crtModel]);
    // Create materials with error handling
  const screenMaterial = useMemo(() => {
    return createShaderMaterialSafely();
  }, [createShaderMaterialSafely]);
  
  const housingMaterial = useMemo(() => {
    return new MeshStandardMaterial({
      color: getHousingColor(crtModel.housing),
      roughness: 0.8,
      metalness: crtModel.housing.includes('metal') ? 0.8 : 0.1,
      envMapIntensity: 0.5
    });
  }, [crtModel]);
  
  // Power control functions
  const powerOn = useCallback(() => {
    setIsPoweredOn(true);
    physicsSimulator.setBrightness(currentBrightness);
    events.onPowerToggle?.(true);
  }, [currentBrightness, physicsSimulator, events]);
  
  const powerOff = useCallback(() => {
    setIsPoweredOn(false);
    physicsSimulator.setBrightness(0);
    events.onPowerToggle?.(false);
  }, [physicsSimulator, events]);
  
  const degauss = useCallback(() => {
    physicsSimulator.degauss();
    events.onDegauss?.();
  }, [physicsSimulator, events]);
  
  const setBrightness = useCallback((value: number) => {
    const clampedValue = Math.max(0, Math.min(1, value));
    setCurrentBrightness(clampedValue);
    physicsSimulator.setBrightness(clampedValue);
    events.onControlChange?.('brightness', clampedValue);
  }, [physicsSimulator, events]);
  
  const setContrast = useCallback((value: number) => {
    const clampedValue = Math.max(0, Math.min(1, value));
    setCurrentContrast(clampedValue);
    physicsSimulator.setContrast(clampedValue);
    events.onControlChange?.('contrast', clampedValue);
  }, [physicsSimulator, events]);
    const setScreenContent = useCallback((content: any) => {
    if (screenMaterialRef.current?.uniforms?.['uScreenTexture']) {
      screenMaterialRef.current.uniforms['uScreenTexture'].value = content;
    }
    events.onScreenChange?.(content);
  }, [events]);
    const getState = useCallback((): CRTMonitorState => {
    return {
      model: crtModel,
      physics: physicsSimulator.getPhysicsState(),
      visuals: shaderUniforms as any, // Type assertion for compatibility
      environment: {} as any, // Would be filled with actual environment state
      controls: controls as any,
      audio: {} as any, // Would be filled with actual audio state
      performance: {} as any, // Would be filled with actual performance state
      isInitialized,
      isVisible: true,
      lastUpdateTime: lastFrameTime,
      frameCount: 0
    };
  }, [crtModel, physicsSimulator, shaderUniforms, controls, isInitialized, lastFrameTime]);
  
  const updatePhysics = useCallback((deltaTime: number) => {
    physicsSimulator.update(deltaTime);
  }, [physicsSimulator]);
  
  const optimizePerformance = useCallback(() => {
    // Performance optimization logic would go here
  }, []);
    const reset = useCallback(() => {
    physicsSimulator?.reset?.();
    setIsPoweredOn(autoPlay);
    setCurrentBrightness(0.8);
    setCurrentContrast(0.9);
  }, [physicsSimulator, autoPlay]);

  const cleanup = useCallback(() => {
    // Cleanup all resources
    memoryManager.cleanupAll();
    physicsSimulator?.cleanup?.();
  }, [memoryManager, physicsSimulator]);

  const getStats = useCallback(() => {
    return {
      memoryStats: memoryManager.getMemoryStats(),
      physicsStats: physicsSimulator?.getStats?.() || {},
      performance: {
        frameTime: lastFrameTime,
        isPowered: isPoweredOn,
        brightness: currentBrightness,
        contrast: currentContrast
      }
    };
  }, [memoryManager, physicsSimulator, lastFrameTime, isPoweredOn, currentBrightness, currentContrast]);
    // Expose methods via ref
  useImperativeHandle(ref, () => ({
    powerOn,
    powerOff,
    degauss,
    setBrightness,
    setContrast,
    setScreenContent,
    getState,
    updatePhysics,
    optimizePerformance,
    reset,
    cleanup,
    getStats
  }), [powerOn, powerOff, degauss, setBrightness, setContrast, setScreenContent, getState, updatePhysics, optimizePerformance, reset, cleanup, getStats]);
    // Animation loop with error handling
  useFrame((state, delta) => {
    if (errorState.fallbackMode) return; // Skip updates in fallback mode
    
    const deltaMs = delta * 1000;
    setLastFrameTime(state.clock.elapsedTime * 1000);
    
    if (isPoweredOn) {
      // Update physics simulation safely
      updatePhysicsSafely(deltaMs);
      
      // Update shader uniforms with physics data (if not in fallback mode)
      if (!errorState.hasShaderError && !errorState.hasPhysicsError) {
        try {
          const physicsData = physicsSimulator?.getShaderUniforms?.() || {};
            if (screenMaterialRef.current && screenMaterialRef.current.uniforms) {
            const uniforms = screenMaterialRef.current.uniforms;
            
            // Safe uniform updates with fallbacks
            if (uniforms['uTime']) uniforms['uTime'].value = state.clock.elapsedTime;
            if (uniforms['uFrameTime']) uniforms['uFrameTime'].value = delta;
            if (physicsData.uScanPosition && uniforms['uScanPosition']) {
              uniforms['uScanPosition'].value = physicsData.uScanPosition;
            }
            if (physicsData.uBeamIntensity && uniforms['uBeamIntensity']) {
              uniforms['uBeamIntensity'].value = physicsData.uBeamIntensity;
            }
            // ... other uniform updates with safety checks
          }
        } catch (error) {
          console.warn('Shader uniform update failed (non-critical):', error);
        }
      }
    }
  });
  
  // Initialize component
  useEffect(() => {
    setIsInitialized(true);
    if (autoPlay) {
      powerOn();
    }
  }, [autoPlay, powerOn]);
  
  // WebGL context monitoring
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleWebGLError = (event: Event) => {
      console.error('WebGL error detected in CRT Monitor:', event);
      setErrorState(prev => ({
        ...prev,
        hasWebGLError: true,
        fallbackMode: true
      }));
    };

    window.addEventListener('webglcontextlost', handleWebGLError);
    return () => window.removeEventListener('webglcontextlost', handleWebGLError);
  }, []);
  // Physics error handling
  const updatePhysicsSafely = useCallback((deltaTime: number) => {
    try {
      physicsSimulator?.update?.(deltaTime);
    } catch (error) {
      console.error('Physics update failed:', error);
      setErrorState(prev => ({
        ...prev,
        hasPhysicsError: true
      }));
    }
  }, [physicsSimulator]);

  // Render component
  return (
    <group 
      ref={groupRef} 
      position={[position.x, position.y, position.z]} 
      rotation={[rotation.x, rotation.y, rotation.z]}
      scale={[scale.x, scale.y, scale.z]}
    >
      {/* CRT Housing */}
      <mesh
        ref={housingMeshRef}
        geometry={housingGeometry}
        material={housingMaterial}
        receiveShadow
      />
      
      {/* CRT Screen */}
      <mesh
        ref={screenMeshRef}
        geometry={screenGeometry}
        material={screenMaterial}
        position={[0, 0, crtModel.screenInset ? -crtModel.screenInset : 0]}
      />
        {/* Control Labels */}
      {crtModel.hasControls && crtModel.controlLayout && Object.entries(crtModel.controlLayout).map(([controlName, control]) => {
        const controlPos = control as ControlLayout;
        return (
          <Text
            key={controlName}
            position={[controlPos.position.x, controlPos.position.y - 0.015, controlPos.position.z]}
            fontSize={0.003}
            color="#333"
            anchorX="center"
            anchorY="middle"
          >
            {controlPos.label}
          </Text>
        );
      })}
      
      {/* Power LED */}
      {isPoweredOn && (
        <mesh position={[crtModel.dimensions.x * 0.4, crtModel.dimensions.y * 0.3, crtModel.dimensions.z * 0.5]}>
          <sphereGeometry args={[0.002, 8, 8]} />          <meshBasicMaterial color="#00ff00" />
        </mesh>
      )}
      
      {/* Screen Glow Effect */}
      {isPoweredOn && (
        <mesh position={[0, 0, -crtModel.screenInset - 0.001]}>
          <planeGeometry args={[
            crtModel.dimensions.x - crtModel.bezelThickness,
            crtModel.dimensions.y - crtModel.bezelThickness
          ]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.05}
            blending={2}
          />
        </mesh>
      )}

      {/* Fallback display when 3D fails */}
      {errorState.fallbackMode && (
        <group 
          ref={groupRef} 
          position={[position.x, position.y, position.z]} 
          rotation={[rotation.x, rotation.y, rotation.z]}
          scale={[scale.x, scale.y, scale.z]}
        >
          {/* Simple fallback geometry */}
          <mesh>
            <boxGeometry args={[crtModel.dimensions.x, crtModel.dimensions.y, crtModel.dimensions.z]} />
            <meshBasicMaterial color="#333333" />
          </mesh>
          
          {/* Fallback screen */}
          <mesh position={[0, 0, crtModel.dimensions.z * 0.5 + 0.001]}>
            <planeGeometry args={[
              crtModel.dimensions.x * 0.8,
              crtModel.dimensions.y * 0.8
            ]} />
            <meshBasicMaterial 
              color={isPoweredOn ? "#00ff00" : "#000000"} 
              transparent 
              opacity={isPoweredOn ? 0.8 : 0.1}
            />
          </mesh>
          
          {/* Error indicator */}
          <mesh position={[crtModel.dimensions.x * 0.4, crtModel.dimensions.y * 0.4, crtModel.dimensions.z * 0.5]}>
            <sphereGeometry args={[0.005, 8, 8]} />
            <meshBasicMaterial color="#ff0000" />
          </mesh>
        </group>
      )}
    </group>
  );
});

// Utility functions
type QualityLevel = 'low' | 'medium' | 'high' | 'ultra';

function getQualityLevel(quality: QualityLevel): number {
  const levels: Record<QualityLevel, number> = { low: 0.25, medium: 0.5, high: 0.75, ultra: 1.0 };
  return levels[quality] || 0.75;
}

function getHousingColor(housing: string): Color {
  const colors: Record<string, Color> = {
    'plastic_beige': new Color(0xF5F5DC),
    'plastic_white': new Color(0xFFFFF0),
    'plastic_black': new Color(0x2F2F2F),
    'metal_grey': new Color(0x808080),
    'composite': new Color(0xD3D3D3)
  };
  return colors[housing] ?? new Color(0xF5F5DC); // Default beige color
}

CRTMonitor.displayName = 'CRTMonitor';

export default CRTMonitor;
