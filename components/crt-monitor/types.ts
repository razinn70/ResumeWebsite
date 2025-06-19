import { Vector2, Vector3, Color, Texture } from 'three';

// CRT Monitor Model Types
export interface CRTModel {
  id: string;
  name: string;
  year: number;
  manufacturer: string;
  screenSize: number; // inches
  aspectRatio: [number, number];
  resolution: [number, number];
  refreshRate: number;
  curvature: number; // 0-1, amount of screen curvature
  phosphorType: PhosphorType;
  housing: HousingMaterial;
  weight: number; // kg
  dimensions: Vector3;
  bezelThickness: number;
  screenInset: number;
  hasControls: boolean;
  controlLayout: ControlLayout;
  powerConsumption: number; // watts
  degaussCoilStrength: number;
  electronGunType: 'single' | 'triple' | 'delta' | 'inline';
  shadowMaskType: 'aperture' | 'slot' | 'dot' | 'stripe';
}

export type PhosphorType = 
  | 'P1' | 'P4' | 'P7' | 'P11' | 'P22' | 'P24' | 'P31' | 'P38' | 'P43' | 'P45';

export type HousingMaterial = 
  | 'plastic_beige' | 'plastic_white' | 'plastic_black' | 'metal_grey' | 'composite';

export interface ControlLayout {
  brightness: ControlPosition;
  contrast: ControlPosition;
  horizontalHold: ControlPosition;
  verticalHold: ControlPosition;
  degauss: ControlPosition;
  power: ControlPosition;
}

export interface ControlPosition {
  position: Vector3;
  type: 'knob' | 'button' | 'slider';
  size: number;
  label: string;
}

// CRT Physics and Display Properties
export interface CRTPhysics {
  electronBeam: ElectronBeamState;
  phosphor: PhosphorState;
  magneticField: MagneticFieldState;
  thermal: ThermalState;
  aging: AgingState;
  scanlines: ScanlineState;
  convergence: ConvergenceState;
}

export interface ElectronBeamState {
  intensity: number; // 0-1
  focus: number; // 0-1
  scanRate: number; // Hz
  retrace: boolean;
  currentPosition: Vector2;
  velocity: Vector2;
  deflectionCoilStrength: Vector2;
  beamCurrent: number; // mA
}

export interface PhosphorState {
  persistence: number; // ms
  efficiency: number; // 0-1
  temperature: number; // Celsius
  burnIn: Map<string, number>; // pixel coordinates to burn-in level
  colorShift: Vector3; // RGB shift due to aging
  brightness: number; // 0-1
  lastExcitation: Map<string, number>; // timestamp of last excitation
}

export interface MagneticFieldState {
  earthField: Vector3;
  degaussStrength: number;
  purityCoils: Vector2;
  convergenceCoils: Vector3;
  externalInterference: Vector3;
  shielding: number; // 0-1
}

export interface ThermalState {
  ambientTemperature: number;
  screenTemperature: number;
  neckTemperature: number;
  fanSpeed: number; // RPM
  coolingEfficiency: number;
  thermalExpansion: Vector3;
}

export interface AgingState {
  totalHours: number;
  phosphorDegradation: number; // 0-1
  cathodeWear: number; // 0-1
  capacitorDrift: number; // 0-1
  colorBalance: Vector3;
  geometry: GeometryDrift;
}

export interface GeometryDrift {
  pincushion: number;
  barrel: number;
  trapezoid: number;
  parallelogram: number;
  rotation: number;
  size: Vector2;
}

export interface ScanlineState {
  visibility: number; // 0-1
  thickness: number; // pixels
  spacing: number; // pixels
  alternating: boolean;
  interlaced: boolean;
  fieldRate: number;
}

export interface ConvergenceState {
  red: Vector2;
  green: Vector2;
  blue: Vector2;
  center: Vector2;
  corner: Vector2;
  misconvergence: number; // 0-1
}

// Shader and Visual Effects
export interface CRTShaderUniforms {
  // Screen properties
  uResolution: { value: Vector2 };
  uScreenTexture: { value: Texture | null };
  uScreenCurvature: { value: number };
  uScreenBrightness: { value: number };
  uScreenContrast: { value: number };
  
  // Scanlines
  uScanlineIntensity: { value: number };
  uScanlineCount: { value: number };
  uScanlineSpeed: { value: number };
  uInterlacing: { value: boolean };
  
  // Phosphor effects
  uPhosphorPersistence: { value: number };
  uPhosphorGlow: { value: number };
  uPhosphorType: { value: number };
  
  // Distortion
  uBarrelDistortion: { value: number };
  uPincushionDistortion: { value: number };
  uChromaticAberration: { value: number };
  uVignette: { value: number };
  
  // Aging and wear
  uBurnIn: { value: Texture | null };
  uNoise: { value: number };
  uFlicker: { value: number };
  uColorShift: { value: Vector3 };
  
  // Time and animation
  uTime: { value: number };
  uFrameTime: { value: number };
  uScanPosition: { value: Vector2 };
  
  // Environmental
  uAmbientLight: { value: number };
  uReflection: { value: Texture | null };
  uReflectionStrength: { value: number };
  
  // Performance
  uLODLevel: { value: number };
  uQuality: { value: number };
}

export interface CRTPostProcessingEffects {
  bloom: BloomEffect;
  chromaticAberration: ChromaticAberrationEffect;
  filmGrain: FilmGrainEffect;
  vignette: VignetteEffect;
  colorCorrection: ColorCorrectionEffect;
}

export interface BloomEffect {
  enabled: boolean;
  intensity: number;
  threshold: number;
  radius: number;
  smoothness: number;
}

export interface ChromaticAberrationEffect {
  enabled: boolean;
  offset: Vector2;
  radialDistortion: boolean;
}

export interface FilmGrainEffect {
  enabled: boolean;
  intensity: number;
  size: number;
  animated: boolean;
}

export interface VignetteEffect {
  enabled: boolean;
  intensity: number;
  smoothness: number;
  roundness: number;
}

export interface ColorCorrectionEffect {
  enabled: boolean;
  exposure: number;
  gamma: number;
  saturation: number;
  temperature: number;
  tint: number;
}

// Performance and LOD
export interface CRTPerformanceConfig {
  lodLevels: LODLevel[];
  frustumCulling: boolean;
  occlusion: boolean;
  instancedRendering: boolean;
  textureAtlasing: boolean;
  shaderOptimization: ShaderOptLevel;
  targetFPS: number;
  adaptiveQuality: boolean;
  webglFallback: boolean;
}

export interface LODLevel {
  distance: number;
  shaderComplexity: number;
  meshResolution: number;
  textureResolution: number;
  effectsEnabled: string[];
  updateFrequency: number;
}

export type ShaderOptLevel = 'low' | 'medium' | 'high' | 'ultra';

// Environmental Integration
export interface CRTEnvironment {
  lighting: EnvironmentalLighting;
  dust: DustParticles;
  reflections: EnvironmentalReflections;
  ambientOcclusion: boolean;
  shadows: ShadowConfig;
  room: RoomProperties;
}

export interface EnvironmentalLighting {
  ambientColor: Color;
  ambientIntensity: number;
  directionalLight: {
    color: Color;
    intensity: number;
    direction: Vector3;
    castShadows: boolean;
  };
  pointLights: PointLightConfig[];
  environmentMap: Texture | null;
}

export interface PointLightConfig {
  position: Vector3;
  color: Color;
  intensity: number;
  distance: number;
  decay: number;
  castShadows: boolean;
}

export interface DustParticles {
  enabled: boolean;
  count: number;
  size: Vector2;
  velocity: Vector3;
  opacity: number;
  color: Color;
  accumulation: boolean;
  cleaningEffect: boolean;
}

export interface EnvironmentalReflections {
  enabled: boolean;
  intensity: number;
  roughness: number;
  environmentMap: Texture | null;
  realTimeReflections: boolean;
  screenReflections: boolean;
}

export interface ShadowConfig {
  enabled: boolean;
  type: 'basic' | 'pcf' | 'pcss' | 'vsm';
  resolution: number;
  bias: number;
  radius: number;
  softness: number;
}

export interface RoomProperties {
  size: Vector3;
  wallColor: Color;
  floorColor: Color;
  ceilingColor: Color;
  ambientNoise: number;
  temperature: number;
  humidity: number;
  airflow: Vector3;
}

// Interactive Features
export interface CRTControls {
  powerButton: PowerButtonState;
  brightnessKnob: KnobState;
  contrastKnob: KnobState;
  degaussButton: ButtonState;
  menuSystem: MenuSystemState;
  remoteControl: RemoteControlState;
}

export interface PowerButtonState {
  isOn: boolean;
  position: Vector3;
  size: number;
  glowColor: Color;
  clickSound: string;
  warmupTime: number;
  shutdownTime: number;
}

export interface KnobState {
  value: number; // 0-1
  position: Vector3;
  rotation: number;
  size: number;
  detents: number;
  resistance: number;
  label: string;
}

export interface ButtonState {
  pressed: boolean;
  position: Vector3;
  size: number;
  travelDistance: number;
  clickSound: string;
  label: string;
  cooldown: number;
}

export interface MenuSystemState {
  visible: boolean;
  currentMenu: string;
  selectedItem: number;
  overlay: boolean;
  opacity: number;
  items: MenuItemConfig[];
}

export interface MenuItemConfig {
  id: string;
  label: string;
  type: 'value' | 'toggle' | 'submenu' | 'action';
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  action?: () => void;
}

export interface RemoteControlState {
  connected: boolean;
  battery: number;
  signal: number;
  lastCommand: string;
  distance: number;
  angle: number;
}

// Audio System
export interface CRTAudioSystem {
  powerHum: AudioConfig;
  fanNoise: AudioConfig;
  degaussSound: AudioConfig;
  staticNoise: AudioConfig;
  electronBeamWhine: AudioConfig;
  buttonClicks: AudioConfig;
  startup: AudioConfig;
  shutdown: AudioConfig;
}

export interface AudioConfig {
  enabled: boolean;
  volume: number;
  frequency: number;
  loop: boolean;
  spatial: boolean;
  falloffDistance: number;
  rolloffFactor: number;
  dopplerFactor: number;
}

// Component State Management
export interface CRTMonitorState {
  model: CRTModel;
  physics: CRTPhysics;
  visuals: CRTShaderUniforms;
  environment: CRTEnvironment;
  controls: CRTControls;
  audio: CRTAudioSystem;
  performance: CRTPerformanceConfig;
  isInitialized: boolean;
  isVisible: boolean;
  lastUpdateTime: number;
  frameCount: number;
}

// Event System
export interface CRTEvents {
  onPowerToggle: (isOn: boolean) => void;
  onDegauss: () => void;
  onControlChange: (control: string, value: number) => void;
  onResolutionChange: (resolution: [number, number]) => void;
  onError: (error: CRTError) => void;
  onPerformanceChange: (fps: number, quality: string) => void;
  onScreenChange: (content: Texture | HTMLCanvasElement) => void;
}

export interface CRTError {
  type: 'shader' | 'performance' | 'webgl' | 'audio' | 'model';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  recoverable: boolean;
}

// API Interfaces
export interface CRTMonitorProps {
  model?: string | CRTModel;
  position?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
  screenContent?: Texture | HTMLCanvasElement | null;
  autoPlay?: boolean;
  quality?: ShaderOptLevel;
  environmentPreset?: string;
  controls?: Partial<CRTControls>;
  events?: Partial<CRTEvents>;
  className?: string;
  style?: React.CSSProperties;
}

export interface CRTMonitorRef {
  powerOn: () => void;
  powerOff: () => void;
  degauss: () => void;
  setBrightness: (value: number) => void;
  setContrast: (value: number) => void;
  setScreenContent: (content: Texture | HTMLCanvasElement) => void;
  getState: () => CRTMonitorState;
  updatePhysics: (deltaTime: number) => void;
  optimizePerformance: () => void;
  reset: () => void;
}
