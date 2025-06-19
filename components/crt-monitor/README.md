# Photorealistic 3D CRT Monitor System

## Overview

This is a comprehensive WebGL/Three.js system that creates photorealistic 3D CRT monitors indistinguishable from real hardware. The system features authentic CRT physics, advanced shaders, environmental integration, and interactive controls.

## Features

### 🖥️ Authentic CRT Physics
- **Electron Beam Simulation**: Real-time electron beam scanning with visible retrace blanking
- **Phosphor Persistence**: Authentic RGB subpixel rendering with phosphor decay simulation
- **Magnetic Field Effects**: Distortion from speakers, degaussing coils, and external interference
- **Temperature Simulation**: Color shift based on phosphor temperature and aging
- **Convergence Errors**: Realistic RGB misconvergence at screen edges

### 🎨 Advanced Shader Pipeline
- **Fragment Shaders**: Scanlines with proper interlacing and thickness variation
- **Vertex Shaders**: Screen curvature and corner distortion based on real CRT geometry
- **Post-Processing**: HDR bloom, chromatic aberration, and vignetting effects
- **Real-time Effects**: Dynamic scanline generation with aging considerations
- **Quality Levels**: LOD system with performance optimization

### 🏠 Environmental Integration
- **Dust Particle System**: Realistic dust accumulation and airflow simulation
- **Dynamic Lighting**: Proper interaction with room environment and shadows
- **Surface Reflections**: Screen content reflection on nearby surfaces
- **Material Simulation**: Accurate plastic, metal, and glass materials with aging

### 🎛️ Interactive Controls
- **Power Management**: Realistic startup/shutdown sequences with warmup time
- **Degaussing**: Visual and magnetic field reset effects
- **Brightness/Contrast**: Hardware-accurate adjustment ranges
- **Model Selection**: Multiple authentic CRT monitors from different eras
- **Quality Settings**: Performance optimization with visual quality trade-offs

### 📺 Monitor Models

#### IBM 5151 (1983)
- 11" monochrome display
- Green phosphor (P39)
- 720x350 resolution
- Beige plastic housing

#### Commodore 1084 (1987)
- 13" color display
- White phosphor (P22)
- 640x200 resolution
- RGB inputs

#### Sony PVM-20L5 (1991)
- 20" professional monitor
- High-quality aperture grille
- 800x600 resolution
- Metal housing

#### Apple Studio Display (1998)
- 17" Trinitron tube
- 1024x768 resolution
- Modern control interface
- White plastic design

#### Dell P1130 (2000)
- 21" high-resolution
- 2048x1536 maximum
- 85Hz refresh rate
- Black housing

## Technical Implementation

### Physics Engine
```typescript
// Real-time physics simulation
const physicsSimulator = new CRTPhysicsSimulator({
  electronBeam: {
    intensity: 0.8,
    focus: 0.9,
    scanRate: 60
  },
  phosphor: {
    persistence: 16.67, // ms
    efficiency: 0.85,
    temperature: 25
  },
  magneticField: {
    earthField: new Vector3(0.000025, -0.000040, 0.000015),
    degaussStrength: 0,
    shielding: 0.95
  }
});
```

### Shader System
```glsl
// Advanced CRT screen fragment shader
uniform float uScanlineIntensity;
uniform float uPhosphorPersistence;
uniform vec2 uConvergenceRed;
uniform vec2 uConvergenceBlue;
uniform float uChromaticAberration;

// Apply convergence errors and chromatic aberration
vec3 sampleWithConvergence(sampler2D tex, vec2 uv) {
  vec2 redUV = uv + uConvergenceRed;
  vec2 blueUV = uv + uConvergenceBlue;
  
  float red = texture2D(tex, redUV + vec2(uChromaticAberration, 0.0)).r;
  float green = texture2D(tex, uv).g;
  float blue = texture2D(tex, blueUV - vec2(uChromaticAberration, 0.0)).b;
  
  return vec3(red, green, blue);
}
```

### Environmental Effects
```typescript
// Dust particle system with realistic physics
const dustSystem = {
  count: 500,
  airflow: new Vector3(0.05, 0.01, 0.02),
  gravity: 0.001,
  brownianMotion: true,
  accumulation: true
};
```

## Usage

### Basic Implementation
```tsx
import { CRTMonitor } from '@/components/crt-monitor';

function MyComponent() {
  return (
    <Canvas>
      <CRTMonitor
        model="commodore-1084"
        screenContent={myCanvas}
        quality="high"
        autoPlay={true}
      />
    </Canvas>
  );
}
```

### Advanced Configuration
```tsx
import { CRTMonitorDemo, CRTEnvironment } from '@/components/crt-monitor';

function AdvancedDemo() {
  return (
    <Canvas shadows>
      <CRTEnvironment
        dustEnabled={true}
        dustCount={400}
        roomSize={new Vector3(8, 6, 8)}
        lighting={{
          ambientIntensity: 0.3,
          directionalIntensity: 0.8
        }}
      >
        <CRTMonitor
          model="sony-pvm-20l5"
          quality="ultra"
          events={{
            onPowerToggle: (isOn) => console.log('Power:', isOn),
            onDegauss: () => console.log('Degaussing'),
            onControlChange: (control, value) => 
              console.log(`${control}: ${value}`)
          }}
        />
      </CRTEnvironment>
    </Canvas>
  );
}
```

### Portfolio Integration
```tsx
import { CRTMonitorSection } from '@/components/crt-monitor';

function Portfolio() {
  return (
    <section>
      <CRTMonitorSection
        title="Photorealistic CRT Experience"
        description="Advanced WebGL simulation with authentic physics"
        showControls={true}
        height="800px"
      />
    </section>
  );
}
```

## Performance Optimization

### Quality Levels
- **Low**: Simplified shaders, 100 particles, 512px shadows
- **Medium**: Standard effects, 200 particles, 1024px shadows
- **High**: Full effects, 400 particles, 2048px shadows
- **Ultra**: Maximum quality, 800 particles, 4096px shadows

### Optimization Features
- **LOD System**: Distance-based quality reduction
- **Frustum Culling**: Off-screen object elimination
- **Instanced Rendering**: Efficient multi-monitor support
- **Texture Atlasing**: Reduced memory usage
- **Adaptive Quality**: Automatic performance adjustment

### Browser Compatibility
- **Modern Browsers**: Full WebGL 2.0 support with all features
- **Older Browsers**: WebGL 1.0 fallback with reduced effects
- **Mobile Devices**: Optimized shaders and reduced particle counts
- **Low-end Hardware**: Automatic quality reduction

## File Structure

```
components/crt-monitor/
├── index.ts                    # Main exports
├── types.ts                    # TypeScript definitions
├── CRTMonitor.tsx             # Main component
├── CRTMonitorDemo.tsx         # Interactive demo
├── CRTMonitorSection.tsx      # Portfolio integration
├── CRTEnvironment.tsx         # Environmental effects
├── crt-monitor.css            # Styling
├── physics/
│   └── crt-physics.ts         # Physics simulation
├── shaders/
│   └── crt-shaders.ts         # WebGL shaders
└── models/
    └── crt-models.ts          # Monitor definitions
```

## Dependencies

### Required
- `three`: 3D graphics library
- `@react-three/fiber`: React Three.js renderer
- `@react-three/drei`: Three.js helpers
- `@react-three/postprocessing`: Post-processing effects

### Optional
- `leva`: Development controls
- `stats.js`: Performance monitoring

## Browser Support

| Browser | Version | WebGL 2.0 | Full Features |
|---------|---------|-----------|---------------|
| Chrome  | 56+     | ✅        | ✅            |
| Firefox | 51+     | ✅        | ✅            |
| Safari  | 15+     | ✅        | ✅            |
| Edge    | 79+     | ✅        | ✅            |
| Mobile  | Varies  | ⚠️        | ⚠️            |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Update documentation
5. Submit pull request

## License

MIT License - See LICENSE file for details

## Credits

Inspired by real CRT monitor specifications and the retro computing community's dedication to authentic hardware emulation.

---

*Built with ❤️ for the retro computing community*
