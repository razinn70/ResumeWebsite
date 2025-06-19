// Main CRT Monitor Components
export { default as CRTMonitor } from './CRTMonitor';
export { default as CRTMonitorDemo } from './CRTMonitorDemo';
export { default as CRTMonitorSection } from './CRTMonitorSection';
export { CRTEnvironment, DustParticleSystem, EnvironmentalLighting, RoomEnvironment } from './CRTEnvironment';

// Physics and Simulation
export { CRTPhysicsSimulator, getPhosphorCharacteristics } from './physics/crt-physics';

// Shaders
export { CRTShaders } from './shaders/crt-shaders';

// Models and Geometry
export { CRTGeometryGenerator, CRTModels } from './models/crt-models';

// Types
export type {
  CRTModel,
  CRTMonitorProps,
  CRTMonitorRef,
  CRTMonitorState,
  CRTPhysics,
  CRTShaderUniforms,
  CRTEnvironment as CRTEnvironmentType,
  CRTControls,
  CRTAudioSystem,
  CRTPerformanceConfig,
  CRTEvents,
  CRTError,
  PhosphorType,
  HousingMaterial,
  ShaderOptLevel,
  ElectronBeamState,
  PhosphorState,
  MagneticFieldState,
  ThermalState,
  AgingState,
  ScanlineState,
  ConvergenceState
} from './types';

// Import for utility functions
import { CRTModels } from './models/crt-models';
import type { CRTModel } from './types';

// Utility functions
export const CRTUtils = {
  // Get available monitor models
  getAvailableModels: () => Object.values(CRTModels),
    // Get model by manufacturer
  getModelsByManufacturer: (manufacturer: string) => 
    Object.values(CRTModels).filter((model: CRTModel) => 
      model.manufacturer.toLowerCase() === manufacturer.toLowerCase()
    ),
  
  // Get models by year range
  getModelsByYearRange: (startYear: number, endYear: number) => 
    Object.values(CRTModels).filter((model: CRTModel) => 
      model.year >= startYear && model.year <= endYear
    ),
  
  // Get models by screen size
  getModelsByScreenSize: (minSize: number, maxSize: number) => 
    Object.values(CRTModels).filter((model: CRTModel) => 
      model.screenSize >= minSize && model.screenSize <= maxSize
    ),
  
  // Quality presets
  qualityPresets: {
    low: {
      shaderComplexity: 0.25,
      particleCount: 100,
      shadowResolution: 512,
      antialiasing: false,
      postProcessing: false
    },
    medium: {
      shaderComplexity: 0.5,
      particleCount: 200,
      shadowResolution: 1024,
      antialiasing: true,
      postProcessing: true
    },
    high: {
      shaderComplexity: 0.75,
      particleCount: 400,
      shadowResolution: 2048,
      antialiasing: true,
      postProcessing: true
    },
    ultra: {
      shaderComplexity: 1.0,
      particleCount: 800,
      shadowResolution: 4096,
      antialiasing: true,
      postProcessing: true
    }
  },
  
  // Phosphor characteristics
  phosphorTypes: {
    'P1': { name: 'Green', persistence: 'Medium', efficiency: 'Low' },
    'P4': { name: 'White', persistence: 'Short', efficiency: 'High' },
    'P7': { name: 'Blue/Yellow', persistence: 'Long', efficiency: 'Medium' },
    'P11': { name: 'Blue', persistence: 'Medium', efficiency: 'High' },
    'P22': { name: 'White', persistence: 'Medium', efficiency: 'High' },
    'P24': { name: 'Green/White', persistence: 'Short', efficiency: 'High' },
    'P31': { name: 'Green', persistence: 'Long', efficiency: 'High' },
    'P38': { name: 'Orange', persistence: 'Very Short', efficiency: 'Medium' },
    'P43': { name: 'White', persistence: 'Medium', efficiency: 'High' },
    'P45': { name: 'White', persistence: 'Medium', efficiency: 'High' }
  },
  
  // Era presets for realistic aging
  eraPresets: {
    '1970s': {
      agingFactor: 0.8,
      phosphorDegradation: 0.6,
      colorShift: { r: 0.3, g: -0.1, b: -0.4 },
      convergence: 0.15,
      burnIn: 0.4
    },
    '1980s': {
      agingFactor: 0.6,
      phosphorDegradation: 0.4,
      colorShift: { r: 0.2, g: -0.05, b: -0.2 },
      convergence: 0.08,
      burnIn: 0.3
    },
    '1990s': {
      agingFactor: 0.3,
      phosphorDegradation: 0.2,
      colorShift: { r: 0.1, g: 0, b: -0.1 },
      convergence: 0.04,
      burnIn: 0.15
    },
    '2000s': {
      agingFactor: 0.1,
      phosphorDegradation: 0.05,
      colorShift: { r: 0.05, g: 0, b: -0.02 },
      convergence: 0.02,
      burnIn: 0.05
    },
    'new': {
      agingFactor: 0.0,
      phosphorDegradation: 0.0,
      colorShift: { r: 0, g: 0, b: 0 },
      convergence: 0.01,
      burnIn: 0.0
    }
  }
};

// Default configurations
export const CRTDefaults = {
  monitor: {
    model: 'commodore-1084',
    quality: 'high' as const,
    autoPlay: true,
    brightness: 0.8,
    contrast: 0.9
  },
  
  environment: {
    dustEnabled: true,
    dustCount: 300,
    roomSize: [8, 6, 8] as const,
    airflow: [0.05, 0.01, 0.02] as const,
    showWalls: true
  },
  
  lighting: {
    ambientIntensity: 0.3,
    directionalIntensity: 0.8,
    castShadows: true
  },
  
  performance: {
    targetFPS: 60,
    adaptiveQuality: true,
    frustumCulling: true,
    instancedRendering: true
  }
};

// Version information
export const CRTVersion = {
  version: '1.0.0',
  build: 'production',
  features: [
    'Authentic CRT Physics Simulation',
    'Real-time Phosphor Persistence',
    'Magnetic Field Distortion',
    'Temperature-based Color Shift',
    'Advanced Shader Pipeline',
    'Multiple CRT Models',
    'Environmental Integration',
    'Performance Optimization',
    'Interactive Controls',
    'Dust Particle System'
  ]
};
