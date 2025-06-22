/**
 * PRODUCTION-READY CRT SHADERS
 * Optimized for performance and compatibility across devices
 */

// CRT Monitor Vertex Shader
export const crtVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// CRT Monitor Fragment Shader with enhanced effects
export const crtFragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  
  uniform sampler2D tDiffuse;
  uniform float time;
  uniform float intensity;
  uniform float curvature;
  uniform float scanlineIntensity;
  uniform float noiseIntensity;
  uniform float glowIntensity;
  uniform vec3 glowColor;
  uniform vec2 resolution;
  uniform bool enableCurvature;
  uniform bool enableScanlines;
  uniform bool enableNoise;
  uniform bool enableGlow;
  
  varying vec2 vUv;
  
  // Safe CRT curvature function with bounds checking
  vec2 curveUV(vec2 uv) {
    if (!enableCurvature) return uv;
    
    uv = uv * 2.0 - 1.0;
    vec2 offset = abs(uv.yx) / max(curvature, 0.1); // Prevent division by zero
    uv = uv + uv * offset * offset;
    uv = uv * 0.5 + 0.5;
    
    // Clamp to prevent texture sampling outside bounds
    return clamp(uv, 0.0, 1.0);
  }
  
  // Optimized random function
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  // Enhanced scanline effect
  float scanline(vec2 uv) {
    if (!enableScanlines) return 0.0;
    
    float scanlines = sin(uv.y * resolution.y * 0.8) * 0.04 * scanlineIntensity;
    float horizontal = sin(uv.x * resolution.x * 0.1) * 0.01 * scanlineIntensity;
    return scanlines + horizontal;
  }
  
  // Phosphor glow effect with better performance
  vec3 phosphorGlow(vec3 color, vec2 uv) {
    if (!enableGlow) return color;
    
    float dist = distance(uv, vec2(0.5));
    float glow = 1.0 - smoothstep(0.0, 0.7, dist);
    glow = pow(glow, 2.0);
    return color + glowColor * glow * glowIntensity * 0.3;
  }
  
  // Chromatic aberration effect
  vec3 chromaticAberration(sampler2D tex, vec2 uv) {
    vec2 offset = (uv - 0.5) * 2.0;
    float aberration = length(offset) * 0.01;
    
    float r = texture2D(tex, uv + offset * aberration).r;
    float g = texture2D(tex, uv).g;
    float b = texture2D(tex, uv - offset * aberration).b;
    
    return vec3(r, g, b);
  }
  
  void main() {
    vec2 curvedUV = curveUV(vUv);
    
    // Check bounds for curved display
    if (enableCurvature && (curvedUV.x < 0.0 || curvedUV.x > 1.0 || curvedUV.y < 0.0 || curvedUV.y > 1.0)) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }
    
    // Sample with chromatic aberration
    vec3 color = chromaticAberration(tDiffuse, curvedUV);
    
    // Add scanlines
    if (enableScanlines) {
      float scanlines = scanline(curvedUV);
      color -= scanlines;
    }
    
    // Add noise/static with time variance
    if (enableNoise) {
      float noise = random(curvedUV + sin(time * 0.1) * 0.01) * noiseIntensity;
      color += noise * 0.05;
    }
    
    // Add phosphor glow
    if (enableGlow) {
      color = phosphorGlow(color, curvedUV);
    }
    
    // Vignette effect
    float vignette = 1.0 - distance(curvedUV, vec2(0.5));
    vignette = smoothstep(0.3, 0.7, vignette);
    color *= vignette;
    
    // Brightness adjustment
    color *= intensity;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Terminal Glow Effect Shader
export const terminalGlowVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const terminalGlowFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float time;
  uniform vec3 glowColor;
  uniform float glowIntensity;
  
  varying vec2 vUv;
  
  void main() {
    vec4 color = texture2D(tDiffuse, vUv);
    
    // Text glow effect
    float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    vec3 glow = glowColor * luminance * glowIntensity;
    
    // Flicker effect
    float flicker = 0.95 + 0.05 * sin(time * 60.0 + vUv.y * 100.0);
    color.rgb *= flicker;
    
    // Add glow
    color.rgb += glow;
    
    gl_FragColor = color;
  }
`;

// Matrix Rain Effect Shader (Easter Egg)
export const matrixRainVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const matrixRainFragmentShader = `
  uniform float time;
  uniform vec2 resolution;
  uniform vec3 matrixColor;
  
  varying vec2 vUv;
  
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  void main() {
    vec2 uv = vUv * resolution;
    
    // Create matrix columns
    float column = floor(uv.x / 20.0);
    float row = floor(uv.y / 20.0);
    
    // Random character changes
    float charTime = time * 3.0 + column * 1.3;
    float char = step(0.5, random(vec2(column, floor(charTime))));
    
    // Rain effect
    float rain = fract(charTime * 0.5);
    rain = smoothstep(0.0, 0.1, rain) * smoothstep(1.0, 0.8, rain);
    
    // Distance from rain
    float distFromRain = abs(row - rain * 30.0);
    float intensity = exp(-distFromRain * 0.1) * char;
    
    vec3 color = matrixColor * intensity;
    
    gl_FragColor = vec4(color, intensity);
  }
`;

// Skill Node Glow Shader
export const skillNodeVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const skillNodeFragmentShader = `
  uniform float time;
  uniform vec3 nodeColor;
  uniform float glowIntensity;
  uniform float pulseSpeed;
  uniform float selected;
  uniform float hovered;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vec2 center = vec2(0.5);
    float dist = distance(vUv, center);
    
    // Pulse effect
    float pulse = sin(time * pulseSpeed) * 0.5 + 0.5;
    
    // Node ring
    float ring = smoothstep(0.4, 0.45, dist) * smoothstep(0.5, 0.45, dist);
    
    // Glow
    float glow = exp(-dist * 3.0) * glowIntensity;
    
    // Selection highlight
    float highlight = selected * 0.5 + hovered * 0.3;
    
    vec3 color = nodeColor * (ring + glow * pulse + highlight);
    float alpha = ring + glow * 0.5 + highlight;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

// Connection Line Shader
export const connectionLineVertexShader = `
  attribute float progress;
  varying float vProgress;
  
  void main() {
    vProgress = progress;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const connectionLineFragmentShader = `
  uniform float time;
  uniform vec3 lineColor;
  uniform float animationSpeed;
  uniform float opacity;
  
  varying float vProgress;
  
  void main() {
    // Animated flow effect
    float flow = fract(vProgress + time * animationSpeed);
    float intensity = exp(-abs(flow - 0.5) * 4.0);
    
    vec3 color = lineColor * intensity;
    float alpha = intensity * opacity;
    
    gl_FragColor = vec4(color, alpha);
  }
`;
