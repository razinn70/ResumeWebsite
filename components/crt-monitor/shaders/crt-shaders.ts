// CRT Screen Vertex Shader
export const crtScreenVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  uniform float uScreenCurvature;
  uniform vec3 uThermalExpansion;
  uniform float uTime;
  
  // Curvature function for CRT screen
  vec3 applyCurvature(vec3 pos, float curvature) {
    float x = pos.x;
    float y = pos.y;
    float z = pos.z;
    
    // Apply cylindrical curvature
    float curveX = x * x * curvature * 0.1;
    float curveY = y * y * curvature * 0.08;
    
    return vec3(x, y, z - curveX - curveY);
  }
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    // Apply thermal expansion
    vec3 expandedPosition = position * (1.0 + uThermalExpansion);
    
    // Apply screen curvature
    vec3 curvedPosition = applyCurvature(expandedPosition, uScreenCurvature);
    
    // Subtle screen vibration (very minimal)
    float vibration = sin(uTime * 60.0) * 0.0001;
    curvedPosition.z += vibration;
    
    vPosition = curvedPosition;
    vWorldPosition = (modelMatrix * vec4(curvedPosition, 1.0)).xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(curvedPosition, 1.0);
  }
`;

// CRT Screen Fragment Shader
export const crtScreenFragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  uniform vec2 uResolution;
  uniform sampler2D uScreenTexture;
  uniform float uTime;
  uniform float uFrameTime;
  
  // Screen properties
  uniform float uScreenBrightness;
  uniform float uScreenContrast;
  uniform float uScreenCurvature;
  
  // Scanlines
  uniform float uScanlineIntensity;
  uniform float uScanlineCount;
  uniform float uScanlineSpeed;
  uniform bool uInterlacing;
  uniform float uScanlineThickness;
  
  // Phosphor effects
  uniform float uPhosphorPersistence;
  uniform float uPhosphorGlow;
  uniform int uPhosphorType;
  uniform float uPhosphorTemperature;
  uniform vec3 uColorShift;
  uniform float uBrightness;
  
  // Distortion
  uniform float uBarrelDistortion;
  uniform float uPincushionDistortion;
  uniform float uChromaticAberration;
  uniform float uVignette;
  
  // Aging and wear
  uniform sampler2D uBurnIn;
  uniform float uNoise;
  uniform float uFlicker;
  uniform float uAgingFactor;
  
  // Convergence
  uniform vec2 uConvergenceRed;
  uniform vec2 uConvergenceGreen;
  uniform vec2 uConvergenceBlue;
  uniform float uMisconvergence;
  
  // Geometry drift
  uniform float uPincushion;
  uniform float uBarrel;
  uniform float uTrapezoid;
  
  // Environmental
  uniform float uAmbientLight;
  uniform sampler2D uReflection;
  uniform float uReflectionStrength;
  
  // Performance
  uniform float uLODLevel;
  uniform float uQuality;
  
  // Electron beam simulation
  uniform vec2 uScanPosition;
  uniform float uBeamIntensity;
  uniform float uBeamFocus;
  
  // Random function for noise
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  // Noise function
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  // Apply geometric distortions
  vec2 applyGeometricDistortion(vec2 uv) {
    vec2 centeredUV = uv - 0.5;
    
    // Barrel distortion
    float r2 = dot(centeredUV, centeredUV);
    float barrel = 1.0 + uBarrel * r2;
    centeredUV *= barrel;
    
    // Pincushion distortion
    float pincushion = 1.0 + uPincushion * r2;
    centeredUV /= pincushion;
    
    // Trapezoid distortion
    centeredUV.x *= 1.0 + uTrapezoid * centeredUV.y;
    
    return centeredUV + 0.5;
  }
  
  // Apply chromatic aberration with convergence errors
  vec3 sampleWithConvergence(sampler2D tex, vec2 uv) {
    vec2 redUV = uv + uConvergenceRed * uMisconvergence;
    vec2 greenUV = uv + uConvergenceGreen * uMisconvergence;
    vec2 blueUV = uv + uConvergenceBlue * uMisconvergence;
    
    // Apply chromatic aberration
    redUV += vec2(uChromaticAberration, 0.0);
    blueUV -= vec2(uChromaticAberration, 0.0);
    
    float red = texture2D(tex, redUV).r;
    float green = texture2D(tex, greenUV).g;
    float blue = texture2D(tex, blueUV).b;
    
    return vec3(red, green, blue);
  }
  
  // Scanline effect with proper interlacing
  float calculateScanlines(vec2 uv) {
    float scanline = sin(uv.y * uScanlineCount * 3.14159);
    
    if (uInterlacing) {
      float field = mod(uTime * 60.0, 2.0);
      scanline *= step(0.5, mod(uv.y * uScanlineCount * 0.5 + field, 1.0));
    }
    
    // Apply scanline thickness and intensity
    scanline = pow(abs(scanline), uScanlineThickness);
    return 1.0 - uScanlineIntensity * (1.0 - scanline);
  }
  
  // Phosphor persistence simulation
  vec3 applyPhosphorEffects(vec3 color, vec2 uv) {
    // Phosphor glow based on intensity
    float glowAmount = length(color) * uPhosphorGlow;
    vec3 glow = color * glowAmount;
    
    // Temperature-based color shift
    float tempFactor = (uPhosphorTemperature - 25.0) / 50.0;
    vec3 tempShift = vec3(tempFactor * 0.1, -tempFactor * 0.05, -tempFactor * 0.15);
    
    // Apply phosphor characteristics based on type
    vec3 phosphorColor = color;
    if (uPhosphorType == 1) { // P1 - Green
      phosphorColor *= vec3(0.8, 1.0, 0.8);
    } else if (uPhosphorType == 4) { // P4 - White
      phosphorColor *= vec3(1.0, 1.0, 1.0);
    } else if (uPhosphorType == 22) { // P22 - White (most common)
      phosphorColor *= vec3(1.0, 0.95, 0.8);
    }
    
    return (phosphorColor + glow + tempShift) * uBrightness;
  }
  
  // Electron beam scanning effect
  float calculateBeamEffect(vec2 uv) {
    vec2 beamDistance = abs(uv - uScanPosition);
    float beam = exp(-length(beamDistance) * 20.0 / uBeamFocus);
    return beam * uBeamIntensity;
  }
  
  // Vignette effect
  float calculateVignette(vec2 uv) {
    vec2 centeredUV = uv - 0.5;
    float dist = length(centeredUV);
    return 1.0 - smoothstep(0.0, 0.7, dist * uVignette);
  }
  
  // Flicker and aging effects
  vec3 applyAgingEffects(vec3 color, vec2 uv) {
    // Flicker simulation
    float flicker = 1.0 + sin(uTime * 123.0) * 0.02 * uFlicker;
    flicker += sin(uTime * 456.0) * 0.01 * uFlicker;
    
    // Age-related brightness reduction
    float ageBrightness = 1.0 - uAgingFactor * 0.3;
    
    // Random noise
    float noiseValue = noise(uv * 100.0 + uTime) * uNoise;
    
    return color * flicker * ageBrightness + vec3(noiseValue);
  }
  
  // Burn-in effect
  vec3 applyBurnIn(vec3 color, vec2 uv) {
    vec3 burnInMask = texture2D(uBurnIn, uv).rgb;
    return color * (1.0 - burnInMask * 0.3);
  }
  
  // Environmental reflections
  vec3 applyReflections(vec3 color, vec2 uv, vec3 normal) {
    vec3 reflection = texture2D(uReflection, uv).rgb;
    float fresnel = pow(1.0 - abs(dot(normal, vec3(0, 0, 1))), 2.0);
    return mix(color, reflection, fresnel * uReflectionStrength);
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Apply geometric distortions
    uv = applyGeometricDistortion(uv);
    
    // Check if UV is outside screen bounds after distortion
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }
    
    // Sample screen content with convergence
    vec3 screenColor = sampleWithConvergence(uScreenTexture, uv);
    
    // Apply phosphor effects
    screenColor = applyPhosphorEffects(screenColor, uv);
    
    // Apply color shift from aging/temperature
    screenColor += uColorShift;
    
    // Apply brightness and contrast
    screenColor = (screenColor - 0.5) * uScreenContrast + 0.5;
    screenColor *= uScreenBrightness;
    
    // Calculate scanlines
    float scanlineEffect = calculateScanlines(uv);
    screenColor *= scanlineEffect;
    
    // Apply electron beam effect (subtle)
    float beamEffect = calculateBeamEffect(uv);
    screenColor += vec3(beamEffect * 0.1);
    
    // Apply vignette
    float vignetteEffect = calculateVignette(uv);
    screenColor *= vignetteEffect;
    
    // Apply aging effects
    screenColor = applyAgingEffects(screenColor, uv);
    
    // Apply burn-in
    screenColor = applyBurnIn(screenColor, uv);
    
    // Apply environmental reflections
    screenColor = applyReflections(screenColor, uv, vNormal);
    
    // Final color adjustment and gamma correction
    screenColor = pow(clamp(screenColor, 0.0, 1.0), vec3(1.0 / 2.2));
    
    gl_FragColor = vec4(screenColor, 1.0);
  }
`;

// CRT Housing Vertex Shader
export const crtHousingVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewPosition;
  
  uniform float uTime;
  uniform vec3 uThermalExpansion;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    // Apply thermal expansion to housing
    vec3 expandedPosition = position * (1.0 + uThermalExpansion * 0.5);
    
    vPosition = expandedPosition;
    vWorldPosition = (modelMatrix * vec4(expandedPosition, 1.0)).xyz;
    vViewPosition = (modelViewMatrix * vec4(expandedPosition, 1.0)).xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(expandedPosition, 1.0);
  }
`;

// CRT Housing Fragment Shader
export const crtHousingFragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewPosition;
  
  uniform vec3 uHousingColor;
  uniform float uRoughness;
  uniform float uMetallic;
  uniform float uAge;
  uniform float uDustAmount;
  uniform vec3 uAmbientLight;
  uniform vec3 uDirectionalLight;
  uniform vec3 uDirectionalLightDirection;
  uniform sampler2D uEnvironmentMap;
  uniform sampler2D uNormalMap;
  uniform sampler2D uRoughnessMap;
  
  // PBR lighting calculations
  vec3 calculatePBR(vec3 albedo, vec3 normal, vec3 viewDir, vec3 lightDir, vec3 lightColor, float roughness, float metallic) {
    float NdotL = max(dot(normal, lightDir), 0.0);
    float NdotV = max(dot(normal, viewDir), 0.0);
    
    vec3 halfVector = normalize(lightDir + viewDir);
    float NdotH = max(dot(normal, halfVector), 0.0);
    float VdotH = max(dot(viewDir, halfVector), 0.0);
    
    // Fresnel
    vec3 F0 = mix(vec3(0.04), albedo, metallic);
    vec3 F = F0 + (1.0 - F0) * pow(1.0 - VdotH, 5.0);
    
    // Distribution (GGX)
    float alpha = roughness * roughness;
    float alpha2 = alpha * alpha;
    float denom = NdotH * NdotH * (alpha2 - 1.0) + 1.0;
    float D = alpha2 / (3.14159 * denom * denom);
    
    // Geometry
    float k = (roughness + 1.0) * (roughness + 1.0) / 8.0;
    float G1L = NdotL / (NdotL * (1.0 - k) + k);
    float G1V = NdotV / (NdotV * (1.0 - k) + k);
    float G = G1L * G1V;
    
    // BRDF
    vec3 numerator = D * G * F;
    float denominator = 4.0 * NdotV * NdotL + 0.001;
    vec3 specular = numerator / denominator;
    
    vec3 kS = F;
    vec3 kD = vec3(1.0) - kS;
    kD *= 1.0 - metallic;
    
    return (kD * albedo / 3.14159 + specular) * lightColor * NdotL;
  }
  
  // Dust accumulation effect
  vec3 applyDust(vec3 color, vec2 uv, float dustAmount) {
    float dustPattern = sin(uv.x * 200.0) * sin(uv.y * 150.0) * 0.5 + 0.5;
    dustPattern += sin(uv.x * 50.0 + uv.y * 30.0) * 0.3;
    dustPattern = clamp(dustPattern, 0.0, 1.0);
    
    vec3 dustColor = vec3(0.8, 0.75, 0.7);
    return mix(color, dustColor, dustPattern * dustAmount * 0.3);
  }
  
  // Aging effects on housing
  vec3 applyAging(vec3 color, vec2 uv, float age) {
    // Yellowing of plastic
    vec3 yellowTint = vec3(1.0, 0.95, 0.8);
    color = mix(color, color * yellowTint, age * 0.5);
    
    // Surface scratches and wear
    float scratchPattern = sin(uv.x * 500.0 + age * 100.0) * 0.02;
    scratchPattern += sin(uv.y * 300.0 + age * 80.0) * 0.015;
    
    return color + vec3(scratchPattern * age);
  }
  
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(-vViewPosition);
    vec3 lightDir = normalize(-uDirectionalLightDirection);
    
    // Sample material maps
    vec3 normalFromMap = texture2D(uNormalMap, vUv).rgb * 2.0 - 1.0;
    normal = normalize(normal + normalFromMap * 0.5);
    
    float roughnessFromMap = texture2D(uRoughnessMap, vUv).r;
    float finalRoughness = uRoughness * roughnessFromMap;
    
    // Base housing color
    vec3 housingColor = uHousingColor;
    
    // Apply aging effects
    housingColor = applyAging(housingColor, vUv, uAge);
    
    // Apply dust accumulation
    housingColor = applyDust(housingColor, vUv, uDustAmount);
    
    // Calculate PBR lighting
    vec3 directLight = calculatePBR(
      housingColor,
      normal,
      viewDir,
      lightDir,
      uDirectionalLight,
      finalRoughness,
      uMetallic
    );
    
    // Add ambient lighting
    vec3 ambient = housingColor * uAmbientLight;
    
    // Environmental reflections
    vec3 reflectDir = reflect(-viewDir, normal);
    vec3 envReflection = textureCube(uEnvironmentMap, reflectDir).rgb;
    
    // Fresnel for environment reflection
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);
    vec3 finalReflection = envReflection * fresnel * (1.0 - finalRoughness);
    
    vec3 finalColor = ambient + directLight + finalReflection;
    
    // Gamma correction
    finalColor = pow(finalColor, vec3(1.0 / 2.2));
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Dust Particle Vertex Shader
export const dustParticleVertexShader = `
  attribute vec3 instancePosition;
  attribute float instanceScale;
  attribute float instanceAge;
  
  varying float vAge;
  varying vec3 vPosition;
  
  uniform float uTime;
  uniform vec3 uAirflow;
  uniform float uGravity;
  
  void main() {
    vAge = instanceAge;
    
    // Particle movement simulation
    vec3 pos = position * instanceScale;
    vec3 worldPos = instancePosition + pos;
    
    // Apply airflow and gravity
    float t = uTime * 0.001;
    worldPos += uAirflow * t + vec3(0, -uGravity * t * t, 0);
    
    // Brownian motion for small particles
    worldPos.x += sin(t * 10.0 + instancePosition.x) * 0.01;
    worldPos.z += cos(t * 8.0 + instancePosition.z) * 0.01;
    
    vPosition = worldPos;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPos, 1.0);
    gl_PointSize = instanceScale * 2.0;
  }
`;

// Dust Particle Fragment Shader
export const dustParticleFragmentShader = `
  varying float vAge;
  varying vec3 vPosition;
  
  uniform float uOpacity;
  uniform vec3 uColor;
  uniform vec3 uLightDirection;
  
  void main() {
    // Circular particle shape
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    if (dist > 0.5) discard;
    
    // Age-based opacity
    float ageOpacity = 1.0 - vAge;
    
    // Simple lighting
    float lighting = max(0.3, dot(normalize(vPosition), -uLightDirection));
    
    vec3 finalColor = uColor * lighting;
    float finalOpacity = uOpacity * ageOpacity * (1.0 - dist * 2.0);
    
    gl_FragColor = vec4(finalColor, finalOpacity);
  }
`;

// Post-processing shaders for bloom and other effects
export const bloomVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const bloomFragmentShader = `
  varying vec2 vUv;
  
  uniform sampler2D uTexture;
  uniform float uThreshold;
  uniform float uIntensity;
  uniform vec2 uResolution;
  
  void main() {
    vec3 color = texture2D(uTexture, vUv).rgb;
    
    // Extract bright areas
    float brightness = dot(color, vec3(0.299, 0.587, 0.114));
    float bloom = smoothstep(uThreshold, uThreshold + 0.1, brightness);
    
    gl_FragColor = vec4(color * bloom * uIntensity, 1.0);
  }
`;

export const gaussianBlurFragmentShader = `
  varying vec2 vUv;
  
  uniform sampler2D uTexture;
  uniform vec2 uDirection;
  uniform vec2 uResolution;
  
  void main() {
    vec2 texelSize = 1.0 / uResolution;
    vec3 result = vec3(0.0);
    
    // Gaussian blur kernel
    float weights[5] = float[](0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);
    
    result += texture2D(uTexture, vUv).rgb * weights[0];
    
    for(int i = 1; i < 5; ++i) {
      vec2 offset = float(i) * texelSize * uDirection;
      result += texture2D(uTexture, vUv + offset).rgb * weights[i];
      result += texture2D(uTexture, vUv - offset).rgb * weights[i];
    }
    
    gl_FragColor = vec4(result, 1.0);
  }
`;

// Export all shaders
export const CRTShaders = {
  screen: {
    vertex: crtScreenVertexShader,
    fragment: crtScreenFragmentShader
  },
  housing: {
    vertex: crtHousingVertexShader,
    fragment: crtHousingFragmentShader
  },
  dustParticles: {
    vertex: dustParticleVertexShader,
    fragment: dustParticleFragmentShader
  },
  postProcessing: {
    bloom: {
      vertex: bloomVertexShader,
      fragment: bloomFragmentShader
    },
    gaussianBlur: {
      vertex: bloomVertexShader,
      fragment: gaussianBlurFragmentShader
    }
  }
};


