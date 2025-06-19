import { 
  BufferGeometry, 
  Vector3, 
  Float32BufferAttribute,
  Uint16BufferAttribute
} from 'three';
import { CRTModel, PhosphorType } from '../types';

// Predefined CRT monitor models based on real vintage monitors
export const CRTModels: Record<string, CRTModel> = {
  'ibm-5151': {
    id: 'ibm-5151',
    name: 'IBM 5151 Monochrome',
    year: 1983,
    manufacturer: 'IBM',
    screenSize: 11,
    aspectRatio: [4, 3],
    resolution: [720, 350],
    refreshRate: 50,
    curvature: 0.15,
    phosphorType: 'P39' as PhosphorType,
    housing: 'plastic_beige',
    weight: 12.7,
    dimensions: new Vector3(0.35, 0.32, 0.38),
    bezelThickness: 0.025,
    screenInset: 0.015,
    hasControls: true,
    controlLayout: {
      brightness: { position: new Vector3(0.15, -0.12, 0.18), type: 'knob', size: 0.008, label: 'BRIGHTNESS' },
      contrast: { position: new Vector3(0.15, -0.08, 0.18), type: 'knob', size: 0.008, label: 'CONTRAST' },
      horizontalHold: { position: new Vector3(0.15, -0.04, 0.18), type: 'knob', size: 0.006, label: 'H-HOLD' },
      verticalHold: { position: new Vector3(0.15, 0.0, 0.18), type: 'knob', size: 0.006, label: 'V-HOLD' },
      degauss: { position: new Vector3(0.15, 0.04, 0.18), type: 'button', size: 0.01, label: 'DEGAUSS' },
      power: { position: new Vector3(0.15, 0.08, 0.18), type: 'button', size: 0.012, label: 'POWER' }
    },
    powerConsumption: 65,
    degaussCoilStrength: 0.8,
    electronGunType: 'single',
    shadowMaskType: 'dot'
  },

  'commodore-1084': {
    id: 'commodore-1084',
    name: 'Commodore 1084',
    year: 1987,
    manufacturer: 'Commodore',
    screenSize: 13,
    aspectRatio: [4, 3],
    resolution: [640, 200],
    refreshRate: 60,
    curvature: 0.12,
    phosphorType: 'P22',
    housing: 'plastic_beige',
    weight: 15.2,
    dimensions: new Vector3(0.38, 0.35, 0.42),
    bezelThickness: 0.022,
    screenInset: 0.012,
    hasControls: true,
    controlLayout: {
      brightness: { position: new Vector3(0.16, -0.14, 0.20), type: 'knob', size: 0.01, label: 'BRIGHTNESS' },
      contrast: { position: new Vector3(0.16, -0.10, 0.20), type: 'knob', size: 0.01, label: 'CONTRAST' },
      horizontalHold: { position: new Vector3(0.16, -0.06, 0.20), type: 'knob', size: 0.008, label: 'H-HOLD' },
      verticalHold: { position: new Vector3(0.16, -0.02, 0.20), type: 'knob', size: 0.008, label: 'V-HOLD' },
      degauss: { position: new Vector3(0.16, 0.02, 0.20), type: 'button', size: 0.012, label: 'DEGAUSS' },
      power: { position: new Vector3(0.16, 0.06, 0.20), type: 'button', size: 0.014, label: 'POWER' }
    },
    powerConsumption: 85,
    degaussCoilStrength: 1.0,
    electronGunType: 'triple',
    shadowMaskType: 'aperture'
  },

  'sony-pvm-20l5': {
    id: 'sony-pvm-20l5',
    name: 'Sony PVM-20L5',
    year: 1991,
    manufacturer: 'Sony',
    screenSize: 20,
    aspectRatio: [4, 3],
    resolution: [800, 600],
    refreshRate: 60,
    curvature: 0.08,
    phosphorType: 'P22',
    housing: 'metal_grey',
    weight: 28.5,
    dimensions: new Vector3(0.48, 0.42, 0.52),
    bezelThickness: 0.018,
    screenInset: 0.008,
    hasControls: true,
    controlLayout: {
      brightness: { position: new Vector3(0.20, -0.16, 0.25), type: 'knob', size: 0.012, label: 'BRIGHTNESS' },
      contrast: { position: new Vector3(0.20, -0.12, 0.25), type: 'knob', size: 0.012, label: 'CONTRAST' },
      horizontalHold: { position: new Vector3(0.20, -0.08, 0.25), type: 'knob', size: 0.01, label: 'H-HOLD' },
      verticalHold: { position: new Vector3(0.20, -0.04, 0.25), type: 'knob', size: 0.01, label: 'V-HOLD' },
      degauss: { position: new Vector3(0.20, 0.0, 0.25), type: 'button', size: 0.014, label: 'DEGAUSS' },
      power: { position: new Vector3(0.20, 0.04, 0.25), type: 'button', size: 0.016, label: 'POWER' }
    },
    powerConsumption: 120,
    degaussCoilStrength: 1.2,
    electronGunType: 'inline',
    shadowMaskType: 'aperture'
  },

  'apple-studio-display': {
    id: 'apple-studio-display',
    name: 'Apple Studio Display',
    year: 1998,
    manufacturer: 'Apple',
    screenSize: 17,
    aspectRatio: [4, 3],
    resolution: [1024, 768],
    refreshRate: 75,
    curvature: 0.05,
    phosphorType: 'P22',
    housing: 'plastic_white',
    weight: 22.1,
    dimensions: new Vector3(0.42, 0.38, 0.48),
    bezelThickness: 0.015,
    screenInset: 0.005,
    hasControls: true,
    controlLayout: {
      brightness: { position: new Vector3(0.18, -0.15, 0.23), type: 'button', size: 0.008, label: 'BRIGHTNESS' },
      contrast: { position: new Vector3(0.18, -0.11, 0.23), type: 'button', size: 0.008, label: 'CONTRAST' },
      horizontalHold: { position: new Vector3(0.18, -0.07, 0.23), type: 'button', size: 0.006, label: 'H-SIZE' },
      verticalHold: { position: new Vector3(0.18, -0.03, 0.23), type: 'button', size: 0.006, label: 'V-SIZE' },
      degauss: { position: new Vector3(0.18, 0.01, 0.23), type: 'button', size: 0.01, label: 'DEGAUSS' },
      power: { position: new Vector3(0.18, 0.05, 0.23), type: 'button', size: 0.012, label: 'POWER' }
    },
    powerConsumption: 95,
    degaussCoilStrength: 1.1,
    electronGunType: 'inline',
    shadowMaskType: 'aperture'
  },

  'dell-p1130': {
    id: 'dell-p1130',
    name: 'Dell P1130',
    year: 2000,
    manufacturer: 'Dell',
    screenSize: 21,
    aspectRatio: [4, 3],
    resolution: [2048, 1536],
    refreshRate: 85,
    curvature: 0.03,
    phosphorType: 'P22',
    housing: 'plastic_black',
    weight: 35.8,
    dimensions: new Vector3(0.52, 0.46, 0.56),
    bezelThickness: 0.012,
    screenInset: 0.003,
    hasControls: true,
    controlLayout: {
      brightness: { position: new Vector3(0.22, -0.18, 0.27), type: 'button', size: 0.006, label: 'BRIGHTNESS' },
      contrast: { position: new Vector3(0.22, -0.14, 0.27), type: 'button', size: 0.006, label: 'CONTRAST' },
      horizontalHold: { position: new Vector3(0.22, -0.10, 0.27), type: 'button', size: 0.006, label: 'H-SIZE' },
      verticalHold: { position: new Vector3(0.22, -0.06, 0.27), type: 'button', size: 0.006, label: 'V-SIZE' },
      degauss: { position: new Vector3(0.22, -0.02, 0.27), type: 'button', size: 0.008, label: 'DEGAUSS' },
      power: { position: new Vector3(0.22, 0.02, 0.27), type: 'button', size: 0.01, label: 'POWER' }
    },
    powerConsumption: 140,
    degaussCoilStrength: 1.3,
    electronGunType: 'inline',
    shadowMaskType: 'aperture'
  }
};

// Geometry generation functions
export class CRTGeometryGenerator {
  
  static generateScreenGeometry(model: CRTModel, segments: number = 64): BufferGeometry {
    const geometry = new BufferGeometry();
    const screenWidth = model.dimensions.x - (model.bezelThickness * 2);
    const screenHeight = model.dimensions.y - (model.bezelThickness * 2);
    
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    
    // Generate curved screen surface
    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const u = i / segments;
        const v = j / segments;
        
        // Map UV to screen coordinates
        const x = (u - 0.5) * screenWidth;
        const y = (v - 0.5) * screenHeight;
        
        // Apply curvature
        const curvatureX = Math.pow(x / (screenWidth * 0.5), 2) * model.curvature * 0.02;
        const curvatureY = Math.pow(y / (screenHeight * 0.5), 2) * model.curvature * 0.015;
        const z = -(curvatureX + curvatureY);
        
        vertices.push(x, y, z);
        uvs.push(u, 1 - v); // Flip V for correct orientation
        
        // Calculate normal for curved surface
        const normalX = -2 * (x / (screenWidth * 0.5)) * model.curvature * 0.02 / (screenWidth * 0.5);
        const normalY = -2 * (y / (screenHeight * 0.5)) * model.curvature * 0.015 / (screenHeight * 0.5);
        const normalZ = 1;
        const length = Math.sqrt(normalX * normalX + normalY * normalY + normalZ * normalZ);
        
        normals.push(normalX / length, normalY / length, normalZ / length);
      }
    }
    
    // Generate indices for triangles
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j;
        const b = a + segments + 1;
        const c = a + 1;
        const d = b + 1;
        
        indices.push(a, b, c);
        indices.push(c, b, d);
      }
    }
    
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
    geometry.setIndex(new Uint16BufferAttribute(indices, 1));
    
    return geometry;
  }
  
  static generateHousingGeometry(model: CRTModel): BufferGeometry {
    const geometry = new BufferGeometry();
    const dim = model.dimensions;
    
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    
    // Housing is a complex shape - we'll create a rounded rectangular prism
    // with appropriate proportions for a CRT monitor
      const width = dim.x;
    const height = dim.y;
    // const depth = dim.z; // TODO: Use depth for 3D housing geometry
    
    // Front face (with screen cutout)
    const frontVertices = this.generateFrontFace(width, height, model.bezelThickness, model.screenInset);
    const frontNormals = frontVertices.map(() => [0, 0, 1]).flat();
    const frontUVs = this.generateFrontFaceUVs(frontVertices.length / 3);
    
    // Add front face
    const vertexOffset = vertices.length / 3;
    vertices.push(...frontVertices);
    normals.push(...frontNormals);
    uvs.push(...frontUVs);
    
    // Generate indices for front face
    const frontIndices = this.generateFrontFaceIndices(vertexOffset);
    indices.push(...frontIndices);
      // Side faces
    // this.addSideFaces(vertices, normals, uvs, indices, width, height, depth); // TODO: Implement
    
    // Back face
    // this.addBackFace(vertices, normals, uvs, indices, width, height, depth); // TODO: Implement
    
    // Top and bottom faces
    // this.addTopBottomFaces(vertices, normals, uvs, indices, width, height, depth); // TODO: Implement
    
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
    geometry.setIndex(new Uint16BufferAttribute(indices, 1));
    
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    
    return geometry;
  }
  
  private static generateFrontFace(width: number, height: number, bezelThickness: number, screenInset: number): number[] {
    const vertices: number[] = [];
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    
    const outerRadius = 0.02; // Rounded corners
    const innerRadius = 0.01;
    
    // Outer rectangle vertices (with rounded corners)
    const outerCorners = [
      [-halfWidth + outerRadius, -halfHeight, 0],
      [halfWidth - outerRadius, -halfHeight, 0],
      [halfWidth, -halfHeight + outerRadius, 0],
      [halfWidth, halfHeight - outerRadius, 0],
      [halfWidth - outerRadius, halfHeight, 0],
      [-halfWidth + outerRadius, halfHeight, 0],
      [-halfWidth, halfHeight - outerRadius, 0],
      [-halfWidth, -halfHeight + outerRadius, 0]
    ];
    
    // Inner rectangle (screen opening)
    const screenWidth = width - (bezelThickness * 2);
    const screenHeight = height - (bezelThickness * 2);
    const halfScreenWidth = screenWidth * 0.5;
    const halfScreenHeight = screenHeight * 0.5;
    
    const innerCorners = [
      [-halfScreenWidth + innerRadius, -halfScreenHeight, -screenInset],
      [halfScreenWidth - innerRadius, -halfScreenHeight, -screenInset],
      [halfScreenWidth, -halfScreenHeight + innerRadius, -screenInset],
      [halfScreenWidth, halfScreenHeight - innerRadius, -screenInset],
      [halfScreenWidth - innerRadius, halfScreenHeight, -screenInset],
      [-halfScreenWidth + innerRadius, halfScreenHeight, -screenInset],
      [-halfScreenWidth, halfScreenHeight - innerRadius, -screenInset],
      [-halfScreenWidth, -halfScreenHeight + innerRadius, -screenInset]
    ];
    
    // Add vertices for both outer and inner shapes
    outerCorners.forEach(corner => vertices.push(...corner));
    innerCorners.forEach(corner => vertices.push(...corner));
    
    return vertices;
  }
  
  private static generateFrontFaceUVs(vertexCount: number): number[] {
    const uvs: number[] = [];
    
    // Simple UV mapping for front face
    for (let i = 0; i < vertexCount; i++) {
      uvs.push(Math.random(), Math.random()); // Placeholder - would be more sophisticated in production
    }
    
    return uvs;
  }
  
  private static generateFrontFaceIndices(offset: number): number[] {
    // Simplified triangulation for demonstration
    // In a real implementation, this would properly triangulate the front face with screen cutout
    return [
      offset, offset + 1, offset + 8,
      offset + 1, offset + 9, offset + 8,
      // ... more triangles for complete face
    ];
  }
  private static addSideFaces(): void {
    // TODO: Implementation for side faces
    // This would add the left, right, top, and bottom faces of the housing
    // Each face would have proper UV mapping and normal calculation
  }
  
  private static addBackFace(): void {
    // TODO: Implementation for back face with ventilation grilles, ports, etc.
  }
  
  private static addTopBottomFaces(): void {
    // Implementation for top and bottom faces
  }
    static generateControlGeometry(controlType: 'knob' | 'button' | 'slider', size: number): BufferGeometry {
    // const geometry = new BufferGeometry(); // TODO: Implement base geometry for controls
    
    switch (controlType) {
      case 'knob':
        return this.generateKnobGeometry(size);
      case 'button':        return this.generateButtonGeometry();
      case 'slider':
        return this.generateSliderGeometry();
      default:
        return new BufferGeometry();
    }
  }
  
  private static generateKnobGeometry(size: number): BufferGeometry {
    const geometry = new BufferGeometry();
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    
    const segments = 16;
    const radius = size;
    const height = size * 0.5;
    
    // Generate cylinder for knob
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Top vertex
      vertices.push(x, height, z);
      normals.push(0, 1, 0);
      uvs.push(i / segments, 1);
      
      // Bottom vertex
      vertices.push(x, 0, z);
      normals.push(0, -1, 0);
      uvs.push(i / segments, 0);
      
      // Side normals
      const sideNormalX = Math.cos(angle);
      const sideNormalZ = Math.sin(angle);
      
      // Add side vertices
      vertices.push(x, height, z);
      normals.push(sideNormalX, 0, sideNormalZ);
      uvs.push(i / segments, 1);
      
      vertices.push(x, 0, z);
      normals.push(sideNormalX, 0, sideNormalZ);
      uvs.push(i / segments, 0);
    }
    
    // Generate indices
    for (let i = 0; i < segments; i++) {
      const base = i * 4;
      const next = ((i + 1) % segments) * 4;
      
      // Side faces
      indices.push(base + 2, next + 2, base + 3);
      indices.push(base + 3, next + 2, next + 3);
    }
    
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
    geometry.setIndex(new Uint16BufferAttribute(indices, 1));
    
    return geometry;
  }  
  private static generateButtonGeometry(): BufferGeometry {
    const geometry = new BufferGeometry();
    // TODO: Similar implementation for button - rounded rectangle with travel
    return geometry;
  }
  
  private static generateSliderGeometry(): BufferGeometry {
    const geometry = new BufferGeometry();
    // TODO: Implementation for slider control
    return geometry;
  }
  
  // Utility function to get model by ID
  static getModel(id: string): CRTModel | undefined {
    return CRTModels[id];
  }
  
  // Get all available models
  static getAllModels(): CRTModel[] {
    return Object.values(CRTModels);
  }
  
  // Get models by manufacturer
  static getModelsByManufacturer(manufacturer: string): CRTModel[] {
    return Object.values(CRTModels).filter(model => 
      model.manufacturer.toLowerCase() === manufacturer.toLowerCase()
    );
  }
  
  // Get models by year range
  static getModelsByYearRange(startYear: number, endYear: number): CRTModel[] {
    return Object.values(CRTModels).filter(model => 
      model.year >= startYear && model.year <= endYear
    );
  }
  
  // Get models by screen size
  static getModelsByScreenSize(minSize: number, maxSize: number): CRTModel[] {
    return Object.values(CRTModels).filter(model => 
      model.screenSize >= minSize && model.screenSize <= maxSize
    );
  }
}
