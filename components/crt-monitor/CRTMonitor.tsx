import React, { useRef, useEffect, useMemo, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
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
  MeshStandardMaterial
} from 'three';
import { Text } from '@react-three/drei';

import { CRTPhysicsSimulator } from './physics/crt-physics';
import { CRTShaders } from './shaders/crt-shaders';
import { CRTGeometryGenerator, CRTModels } from './models/crt-models';
import { 
  CRTMonitorProps, 
  CRTMonitorRef, 
  CRTMonitorState, 
  CRTShaderUniforms,
  CRTModel,
  ShaderOptLevel
} from './types';

const CRTMonitor = forwardRef<CRTMonitorRef, CRTMonitorProps>(({
  model = 'commodore-1084',
  position = new Vector3(0, 0, 0),
  rotation = new Vector3(0, 0, 0),  scale = new Vector3(1, 1, 1),
  screenContent = null,
  autoPlay = true,
  quality = 'high',
  // environmentPreset = 'default', // TODO: Implement environment presets
  controls = {},
  events = {}
  // className, // TODO: Implement styling
  // style // TODO: Implement custom styles
}, ref) => {
  
  // Refs
  const groupRef = useRef<Group>(null);
  const screenMeshRef = useRef<Mesh>(null);
  const housingMeshRef = useRef<Mesh>(null);
  const screenMaterialRef = useRef<ShaderMaterial>(null);
  // const housingMaterialRef = useRef<MeshStandardMaterial>(null); // TODO: Implement housing material updates
  
  // State
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [isPoweredOn, setIsPoweredOn] = React.useState(autoPlay);
  const [currentBrightness, setCurrentBrightness] = React.useState(0.8);
  const [currentContrast, setCurrentContrast] = React.useState(0.9);
  const [lastFrameTime, setLastFrameTime] = React.useState(0);
  
  // Get CRT model
  const crtModel: CRTModel = useMemo(() => {
    if (typeof model === 'string') {
      return CRTModels[model] || CRTModels['commodore-1084'];
    }
    return model;
  }, [model]);
  
  // Initialize physics simulator
  const physicsSimulator = useMemo(() => {
    return new CRTPhysicsSimulator();
  }, []);
  
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
  
  // Create geometries
  const screenGeometry = useMemo(() => {
    return CRTGeometryGenerator.generateScreenGeometry(crtModel, 64);
  }, [crtModel]);
  
  const housingGeometry = useMemo(() => {
    return CRTGeometryGenerator.generateHousingGeometry(crtModel);
  }, [crtModel]);
  
  // Create materials
  const screenMaterial = useMemo(() => {
    return new ShaderMaterial({
      uniforms: shaderUniforms,
      vertexShader: CRTShaders.screen.vertex,
      fragmentShader: CRTShaders.screen.fragment,
      transparent: false,
      depthWrite: true,
      depthTest: true
    });
  }, [shaderUniforms]);
  
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
    if (screenMaterialRef.current) {
      screenMaterialRef.current.uniforms.uScreenTexture.value = content;
    }
    events.onScreenChange?.(content);
  }, [events]);
  
  const getState = useCallback((): CRTMonitorState => {
    return {
      model: crtModel,
      physics: physicsSimulator.getPhysicsState(),
      visuals: shaderUniforms as CRTShaderUniforms,
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
    physicsSimulator.reset();
    setIsPoweredOn(autoPlay);
    setCurrentBrightness(0.8);
    setCurrentContrast(0.9);
  }, [physicsSimulator, autoPlay]);
  
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
    reset
  }), [powerOn, powerOff, degauss, setBrightness, setContrast, setScreenContent, getState, updatePhysics, optimizePerformance, reset]);
  
  // Animation loop
  useFrame((state, delta) => {
    const deltaMs = delta * 1000;
    setLastFrameTime(state.clock.elapsedTime * 1000);
    
    if (isPoweredOn) {
      // Update physics simulation
      physicsSimulator.update(deltaMs);
      
      // Update shader uniforms with physics data
      const physicsData = physicsSimulator.getShaderUniforms();
      
      if (screenMaterialRef.current) {
        const uniforms = screenMaterialRef.current.uniforms;
        
        uniforms.uTime.value = state.clock.elapsedTime;
        uniforms.uFrameTime.value = delta;
        uniforms.uScanPosition.value = physicsData.uScanPosition;
        uniforms.uBeamIntensity.value = physicsData.uBeamIntensity;
        uniforms.uBeamFocus.value = physicsData.uBeamFocus;
        uniforms.uColorShift.value = physicsData.uColorShift;
        uniforms.uBrightness.value = physicsData.uBrightness;
        uniforms.uConvergenceRed.value = physicsData.uConvergenceRed;
        uniforms.uConvergenceGreen.value = physicsData.uConvergenceGreen;
        uniforms.uConvergenceBlue.value = physicsData.uConvergenceBlue;
        uniforms.uMisconvergence.value = physicsData.uMisconvergence;
        uniforms.uPincushion.value = physicsData.uGeometryDrift.pincushion;
        uniforms.uBarrel.value = physicsData.uGeometryDrift.barrel;
        uniforms.uTrapezoid.value = physicsData.uGeometryDrift.trapezoid;
        uniforms.uAgingFactor.value = physicsData.uAgingFactor;
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
  
  return (
    <group 
      ref={groupRef}      position={position}
      rotation={[rotation.x, rotation.y, rotation.z]}
      scale={scale}
    >
      {/* CRT Housing */}
      <mesh
        ref={housingMeshRef}
        geometry={housingGeometry}
        material={housingMaterial}
        castShadow
        receiveShadow
      />
      
      {/* CRT Screen */}
      <mesh
        ref={screenMeshRef}
        geometry={screenGeometry}
        material={screenMaterial}
        position={[0, 0, -crtModel.screenInset]}
      />
      
      {/* Control Labels */}
      {crtModel.hasControls && Object.entries(crtModel.controlLayout).map(([controlName, control]) => (        <Text
          key={controlName}
          position={[control.position.x, control.position.y - 0.015, control.position.z]}
          fontSize={0.003}
          color="#333"
          anchorX="center"
          anchorY="middle"
        >
          {control.label}
        </Text>
      ))}
      
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
    </group>
  );
});

// Utility functions
function getQualityLevel(quality: ShaderOptLevel): number {
  const levels = { low: 0.25, medium: 0.5, high: 0.75, ultra: 1.0 };
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
  return colors[housing] || colors['plastic_beige'];
}

CRTMonitor.displayName = 'CRTMonitor';

export default CRTMonitor;
