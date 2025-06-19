import { Vector2, Vector3, Color, MathUtils } from 'three';
import {
  CRTPhysics,
  PhosphorType
} from '../types';

export class CRTPhysicsSimulator {
  private physics: CRTPhysics;
  private lastUpdateTime: number = 0;
  private frameCount: number = 0;
  private scanBuffer: Float32Array;
  private phosphorBuffer: Float32Array;
  private burnInMap: Map<string, number> = new Map();

  constructor(initialState?: Partial<CRTPhysics>) {
    this.physics = this.initializePhysics(initialState);
    this.scanBuffer = new Float32Array(1024 * 768 * 4); // RGBA buffer
    this.phosphorBuffer = new Float32Array(1024 * 768 * 3); // RGB phosphor state
  }

  private initializePhysics(initialState?: Partial<CRTPhysics>): CRTPhysics {
    return {
      electronBeam: {
        intensity: 0.8,
        focus: 0.9,
        scanRate: 60,
        retrace: false,
        currentPosition: new Vector2(0, 0),
        velocity: new Vector2(1, 0),
        deflectionCoilStrength: new Vector2(1, 1),
        beamCurrent: 0.5,
        ...initialState?.electronBeam
      },
      phosphor: {
        persistence: 16.67, // ~1 frame at 60fps
        efficiency: 0.85,
        temperature: 25,
        burnIn: new Map(),
        colorShift: new Vector3(0, 0, 0),
        brightness: 1.0,
        lastExcitation: new Map(),
        ...initialState?.phosphor
      },
      magneticField: {
        earthField: new Vector3(0.000025, -0.000040, 0.000015), // Earth's magnetic field
        degaussStrength: 0,
        purityCoils: new Vector2(0, 0),
        convergenceCoils: new Vector3(0, 0, 0),
        externalInterference: new Vector3(0, 0, 0),
        shielding: 0.95,
        ...initialState?.magneticField
      },
      thermal: {
        ambientTemperature: 22,
        screenTemperature: 35,
        neckTemperature: 45,
        fanSpeed: 1200,
        coolingEfficiency: 0.8,
        thermalExpansion: new Vector3(0, 0, 0),
        ...initialState?.thermal
      },
      aging: {
        totalHours: 0,
        phosphorDegradation: 0,
        cathodeWear: 0,
        capacitorDrift: 0,
        colorBalance: new Vector3(1, 1, 1),
        geometry: {
          pincushion: 0,
          barrel: 0,
          trapezoid: 0,
          parallelogram: 0,
          rotation: 0,
          size: new Vector2(1, 1)
        },
        ...initialState?.aging
      },
      scanlines: {
        visibility: 0.7,
        thickness: 1.2,
        spacing: 2.0,
        alternating: true,
        interlaced: true,
        fieldRate: 59.94,
        ...initialState?.scanlines
      },
      convergence: {
        red: new Vector2(0, 0),
        green: new Vector2(0, 0),
        blue: new Vector2(0, 0),
        center: new Vector2(0, 0),
        corner: new Vector2(0.5, 0.5),
        misconvergence: 0.02,
        ...initialState?.convergence
      }
    };
  }

  public update(deltaTime: number): void {
    const currentTime = performance.now();
    this.lastUpdateTime = currentTime;
    this.frameCount++;

    this.updateElectronBeam(deltaTime);
    this.updatePhosphor(deltaTime);
    this.updateMagneticField(deltaTime);
    this.updateThermal(deltaTime);
    this.updateAging(deltaTime);
    this.updateScanlines();
    this.updateConvergence();
  }

  private updateElectronBeam(deltaTime: number): void {
    const beam = this.physics.electronBeam;
    
    // Update scan position based on scan rate
    const scanSpeed = beam.scanRate / 1000; // Convert Hz to per-ms
    beam.currentPosition.x += beam.velocity.x * scanSpeed * deltaTime;
    
    // Handle horizontal retrace
    if (beam.currentPosition.x >= 1.0) {
      beam.currentPosition.x = 0;
      beam.currentPosition.y += scanSpeed * deltaTime * 525 / 480; // 525 total lines, 480 visible
      beam.retrace = true;
      
      // Handle vertical retrace
      if (beam.currentPosition.y >= 1.0) {
        beam.currentPosition.y = 0;
      }
    } else {
      beam.retrace = false;
    }

    // Apply magnetic field effects
    const magneticInfluence = this.calculateMagneticInfluence();
    beam.currentPosition.add(magneticInfluence.multiplyScalar(deltaTime * 0.001));

    // Update beam intensity based on thermal and aging
    const thermalFactor = 1.0 - (this.physics.thermal.screenTemperature - 25) * 0.001;
    const agingFactor = 1.0 - this.physics.aging.cathodeWear * 0.3;
    beam.intensity = MathUtils.clamp(beam.intensity * thermalFactor * agingFactor, 0, 1);

    // Beam focus degradation with heat and age
    const focusDegradation = (this.physics.thermal.screenTemperature - 25) * 0.002 + 
                            this.physics.aging.cathodeWear * 0.1;
    beam.focus = MathUtils.clamp(0.9 - focusDegradation, 0.1, 1.0);
  }

  private updatePhosphor(deltaTime: number): void {
    const phosphor = this.physics.phosphor;
    const currentTime = this.lastUpdateTime;

    // Update phosphor temperature based on beam intensity and ambient
    const beamHeating = this.physics.electronBeam.intensity * 0.5;
    const targetTemp = this.physics.thermal.ambientTemperature + beamHeating * 15;
    phosphor.temperature = MathUtils.lerp(phosphor.temperature, targetTemp, deltaTime * 0.001);

    // Calculate phosphor efficiency based on temperature and aging
    const tempFactor = 1.0 - Math.abs(phosphor.temperature - 25) * 0.002;
    const agingFactor = 1.0 - this.physics.aging.phosphorDegradation * 0.4;
    phosphor.efficiency = MathUtils.clamp(tempFactor * agingFactor, 0.1, 1.0);

    // Update phosphor decay for persistence effect
    for (const [coords, lastTime] of phosphor.lastExcitation.entries()) {
      const timeSinceExcitation = currentTime - lastTime;
      if (timeSinceExcitation > phosphor.persistence * 5) {
        phosphor.lastExcitation.delete(coords);
      }
    }

    // Update burn-in accumulation
    const beamPos = this.physics.electronBeam.currentPosition;
    const pixelCoord = `${Math.floor(beamPos.x * 1024)},${Math.floor(beamPos.y * 768)}`;
    
    if (this.physics.electronBeam.intensity > 0.8) {
      const currentBurnIn = phosphor.burnIn.get(pixelCoord) || 0;
      const burnInIncrease = deltaTime * 0.00001 * this.physics.electronBeam.intensity;
      phosphor.burnIn.set(pixelCoord, Math.min(currentBurnIn + burnInIncrease, 1.0));
    }

    // Color shift due to aging and temperature
    const tempShift = (phosphor.temperature - 25) * 0.001;
    const ageShift = this.physics.aging.phosphorDegradation * 0.1;
    phosphor.colorShift.set(
      tempShift * 0.8 + ageShift * 0.5,  // Red shift
      -tempShift * 0.4 - ageShift * 0.3, // Green shift
      -tempShift * 0.6 - ageShift * 0.8  // Blue shift (most affected)
    );

    // Overall brightness degradation
    phosphor.brightness = 1.0 - this.physics.aging.phosphorDegradation * 0.3 - 
                         Math.max(0, phosphor.temperature - 40) * 0.002;
  }

  private updateMagneticField(deltaTime: number): void {
    const field = this.physics.magneticField;
    
    // Degauss effect decay
    if (field.degaussStrength > 0) {
      field.degaussStrength = Math.max(0, field.degaussStrength - deltaTime * 0.002);
    }

    // Simulate external interference (power lines, electronics)
    const interferenceFreq = 0.001 * this.frameCount;
    field.externalInterference.set(
      Math.sin(interferenceFreq * 60) * 0.00001,     // 60Hz power line
      Math.sin(interferenceFreq * 15.734) * 0.000005, // 15.734kHz horizontal sync
      Math.sin(interferenceFreq * 31.468) * 0.000003  // 31.468kHz high freq
    );

    // Purity coil adjustments for convergence
    const convergenceError = this.physics.convergence.misconvergence;
    field.purityCoils.x = Math.sin(interferenceFreq * 0.1) * convergenceError * 0.1;
    field.purityCoils.y = Math.cos(interferenceFreq * 0.1) * convergenceError * 0.1;
  }

  private updateThermal(deltaTime: number): void {
    const thermal = this.physics.thermal;
    
    // Heat sources: electron beam, deflection coils, power supply
    const beamHeat = this.physics.electronBeam.intensity * this.physics.electronBeam.beamCurrent * 10;
    const coilHeat = Math.pow(this.physics.electronBeam.deflectionCoilStrength.length(), 2) * 5;
    const baseHeat = 15; // Base power consumption heating

    const totalHeat = beamHeat + coilHeat + baseHeat;
    
    // Cooling: fan efficiency and ambient convection
    const fanCooling = thermal.fanSpeed / 1200 * thermal.coolingEfficiency * 20;
    const naturalCooling = (thermal.screenTemperature - thermal.ambientTemperature) * 0.1;
    
    const netHeating = totalHeat - fanCooling - naturalCooling;
    
    // Update temperatures with thermal mass considerations
    thermal.screenTemperature += netHeating * deltaTime * 0.0001;
    thermal.neckTemperature = thermal.screenTemperature + 10; // Neck is always hotter
    
    // Thermal expansion affects geometry
    const expansionFactor = (thermal.screenTemperature - 20) * 0.00001;
    thermal.thermalExpansion.set(expansionFactor, expansionFactor, expansionFactor);

    // Fan speed control based on temperature
    if (thermal.screenTemperature > 45) {
      thermal.fanSpeed = Math.min(2000, thermal.fanSpeed + deltaTime * 0.1);
    } else if (thermal.screenTemperature < 35) {
      thermal.fanSpeed = Math.max(800, thermal.fanSpeed - deltaTime * 0.05);
    }
  }

  private updateAging(deltaTime: number): void {
    const aging = this.physics.aging;
    
    // Accumulate operating hours
    aging.totalHours += deltaTime / (1000 * 3600); // Convert ms to hours

    // Phosphor degradation (gradual over thousands of hours)
    aging.phosphorDegradation = Math.min(1.0, aging.totalHours / 10000);

    // Cathode wear (slower degradation)
    aging.cathodeWear = Math.min(1.0, aging.totalHours / 15000);

    // Capacitor drift (affects geometry and color)
    aging.capacitorDrift = Math.min(1.0, aging.totalHours / 8000);

    // Color balance shift due to uneven phosphor aging
    const blueAging = aging.phosphorDegradation * 1.2; // Blue ages fastest
    const greenAging = aging.phosphorDegradation * 0.8;
    const redAging = aging.phosphorDegradation * 0.6;
    
    aging.colorBalance.set(
      1.0 - redAging * 0.2,
      1.0 - greenAging * 0.15,
      1.0 - blueAging * 0.3
    );

    // Geometry drift due to capacitor aging and thermal cycles
    const driftFactor = aging.capacitorDrift * 0.02;
    aging.geometry.pincushion = Math.sin(aging.totalHours * 0.001) * driftFactor;
    aging.geometry.barrel = Math.cos(aging.totalHours * 0.0008) * driftFactor;
    aging.geometry.trapezoid = Math.sin(aging.totalHours * 0.0012) * driftFactor * 0.5;
    aging.geometry.parallelogram = Math.cos(aging.totalHours * 0.0015) * driftFactor * 0.3;
    aging.geometry.rotation = Math.sin(aging.totalHours * 0.0005) * driftFactor * 0.1;
    
    const sizeDrift = 1.0 + Math.sin(aging.totalHours * 0.001) * driftFactor * 0.01;
    aging.geometry.size.set(sizeDrift, sizeDrift);
  }

  private updateScanlines(): void {
    // const _deltaTime = 0; // Unused in current implementation
    const scanlines = this.physics.scanlines;
    
    // Interlacing simulation
    if (scanlines.interlaced) {
      scanlines.fieldRate = 59.94; // NTSC field rate
      scanlines.alternating = (this.frameCount % 2) === 0;
    } else {
      scanlines.fieldRate = 60.0;
      scanlines.alternating = false;
    }

    // Scanline visibility affected by aging and convergence
    const agingFactor = 1.0 - this.physics.aging.phosphorDegradation * 0.2;
    const convergenceFactor = 1.0 - this.physics.convergence.misconvergence;
    
    scanlines.visibility = MathUtils.clamp(
      0.7 * agingFactor * convergenceFactor,
      0.1,
      1.0
    );

    // Dynamic scanline thickness based on focus and resolution
    const basThickness = 1.2;
    const focusFactor = this.physics.electronBeam.focus;
    scanlines.thickness = basThickness / focusFactor;
  }

  private updateConvergence(): void {
    // const _deltaTime = 0; // Unused in current implementation
    const convergence = this.physics.convergence;
    const magnetic = this.physics.magneticField;
    
    // Base misconvergence affected by magnetic fields and aging
    const magneticInfluence = magnetic.externalInterference.length() * 1000;
    const agingInfluence = this.physics.aging.capacitorDrift * 0.05;
    const thermalInfluence = Math.abs(this.physics.thermal.screenTemperature - 25) * 0.0002;
    
    convergence.misconvergence = 0.02 + magneticInfluence + agingInfluence + thermalInfluence;

    // Degauss effect temporarily improves convergence
    const degaussEffect = magnetic.degaussStrength * 0.8;
    convergence.misconvergence = Math.max(0.001, convergence.misconvergence - degaussEffect);

    // Color-specific convergence errors (red typically worse at edges)
    const edgeFactor = 1.5;
    convergence.red.set(
      convergence.misconvergence * edgeFactor * 0.8,
      convergence.misconvergence * edgeFactor * 0.6
    );
    convergence.green.set(
      convergence.misconvergence * 0.4,
      convergence.misconvergence * 0.3
    );
    convergence.blue.set(
      convergence.misconvergence * edgeFactor * 1.2,
      convergence.misconvergence * edgeFactor * 0.9
    );

    // Purity coil adjustments
    convergence.center.copy(magnetic.purityCoils).multiplyScalar(0.1);
  }

  private calculateMagneticInfluence(): Vector2 {
    const field = this.physics.magneticField;
    
    // Combine all magnetic influences
    const earthField = field.earthField.clone();
    const external = field.externalInterference.clone();
    const degauss = new Vector3(0, 0, field.degaussStrength);
    
    const totalField = earthField.add(external).add(degauss);
    
    // Apply shielding
    totalField.multiplyScalar(1.0 - field.shielding);
    
    // Convert to screen space deflection
    return new Vector2(totalField.x * 1000, totalField.y * 1000);
  }

  public degauss(): void {
    this.physics.magneticField.degaussStrength = 1.0;
    
    // Reset some magnetic-related states
    this.physics.convergence.misconvergence = Math.max(0.001, 
      this.physics.convergence.misconvergence * 0.1
    );
    
    // Clear some burn-in temporarily
    for (const [coord, burnIn] of this.physics.phosphor.burnIn.entries()) {
      if (burnIn < 0.3) {
        this.physics.phosphor.burnIn.delete(coord);
      } else {
        this.physics.phosphor.burnIn.set(coord, burnIn * 0.8);
      }
    }
  }

  public setBrightness(value: number): void {
    this.physics.electronBeam.intensity = MathUtils.clamp(value, 0, 1);
  }

  public setContrast(value: number): void {
    // Contrast affects the beam current modulation
    this.physics.electronBeam.beamCurrent = MathUtils.clamp(value * 0.8, 0.1, 1.0);
  }

  public getPhysicsState(): CRTPhysics {
    return { ...this.physics };
  }

  public reset(): void {
    this.physics = this.initializePhysics();
    this.frameCount = 0;
    this.lastUpdateTime = 0;
    this.burnInMap.clear();
    this.scanBuffer.fill(0);
    this.phosphorBuffer.fill(0);
  }

  // Utility methods for shader uniforms
  public getShaderUniforms(): Record<string, any> {
    return {
      uScanPosition: this.physics.electronBeam.currentPosition,
      uBeamIntensity: this.physics.electronBeam.intensity,
      uBeamFocus: this.physics.electronBeam.focus,
      uPhosphorPersistence: this.physics.phosphor.persistence,
      uPhosphorTemperature: this.physics.phosphor.temperature,
      uColorShift: this.physics.phosphor.colorShift,
      uBrightness: this.physics.phosphor.brightness,
      uScanlineVisibility: this.physics.scanlines.visibility,
      uScanlineThickness: this.physics.scanlines.thickness,
      uInterlacing: this.physics.scanlines.interlaced,
      uConvergenceRed: this.physics.convergence.red,
      uConvergenceGreen: this.physics.convergence.green,
      uConvergenceBlue: this.physics.convergence.blue,
      uMisconvergence: this.physics.convergence.misconvergence,
      uThermalExpansion: this.physics.thermal.thermalExpansion,
      uDegaussStrength: this.physics.magneticField.degaussStrength,
      uAgingFactor: this.physics.aging.phosphorDegradation,
      uGeometryDrift: {
        pincushion: this.physics.aging.geometry.pincushion,
        barrel: this.physics.aging.geometry.barrel,
        trapezoid: this.physics.aging.geometry.trapezoid
      }
    };
  }
}

// Utility functions for phosphor types
export function getPhosphorCharacteristics(type: PhosphorType) {
  const characteristics = {
    'P1': { persistence: 0.05, efficiency: 0.15, color: new Color(0.8, 1.0, 0.8) },
    'P4': { persistence: 0.1, efficiency: 0.85, color: new Color(1.0, 1.0, 1.0) },
    'P7': { persistence: 50, efficiency: 0.4, color: new Color(0.6, 0.8, 1.0) },
    'P11': { persistence: 16.67, efficiency: 0.7, color: new Color(0.6, 0.9, 1.0) },
    'P22': { persistence: 5, efficiency: 0.9, color: new Color(1.0, 0.95, 0.8) },
    'P24': { persistence: 8.33, efficiency: 0.8, color: new Color(0.9, 1.0, 0.9) },
    'P31': { persistence: 25, efficiency: 0.75, color: new Color(0.9, 1.0, 0.7) },
    'P38': { persistence: 1.2, efficiency: 0.6, color: new Color(1.0, 0.6, 0.4) },
    'P43': { persistence: 16.67, efficiency: 0.85, color: new Color(1.0, 1.0, 0.95) },
    'P45': { persistence: 12, efficiency: 0.8, color: new Color(1.0, 0.9, 1.0) }
  };
  
  return characteristics[type] || characteristics['P22']; // Default to P22 (white)
}
