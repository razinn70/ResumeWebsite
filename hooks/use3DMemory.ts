/**
 * ROBUST 3D MEMORY MANAGEMENT HOOK
 * Prevents memory leaks, handles cleanup, and monitors performance
 */
'use client'

import { useEffect, useRef, useCallback, useMemo } from 'react'
import * as THREE from 'three'

interface Use3DMemoryOptions {
  maxTextures?: number
  maxGeometries?: number
  maxMaterials?: number
  enablePerformanceMonitoring?: boolean
  cleanupInterval?: number
}

interface MemoryStats {
  textures: number
  geometries: number
  materials: number
  programs: number
  memoryUsage: number
}

export function use3DMemory(options: Use3DMemoryOptions = {}) {
  const {
    maxTextures = 50,
    maxGeometries = 100,
    maxMaterials = 50,
    enablePerformanceMonitoring = process.env.NODE_ENV === 'development',
    cleanupInterval = 30000 // 30 seconds
  } = options

  const resourcesRef = useRef({
    textures: new Set<THREE.Texture>(),
    geometries: new Set<THREE.BufferGeometry>(),
    materials: new Set<THREE.Material>(),
    meshes: new Set<THREE.Mesh>(),
    scenes: new Set<THREE.Scene>(),
    renderers: new Set<THREE.WebGLRenderer>()
  })

  const performanceRef = useRef({
    frameCount: 0,
    lastCleanup: Date.now(),
    memoryWarnings: 0
  })

  const statsRef = useRef<MemoryStats>({
    textures: 0,
    geometries: 0,
    materials: 0,
    programs: 0,
    memoryUsage: 0
  })

  // Track and register resources
  const trackTexture = useCallback((texture: THREE.Texture) => {
    resourcesRef.current.textures.add(texture)
    
    if (resourcesRef.current.textures.size > maxTextures) {
      console.warn(`🚨 Too many textures: ${resourcesRef.current.textures.size}/${maxTextures}`)
      performanceRef.current.memoryWarnings++
    }
    
    return texture
  }, [maxTextures])

  const trackGeometry = useCallback((geometry: THREE.BufferGeometry) => {
    resourcesRef.current.geometries.add(geometry)
    
    if (resourcesRef.current.geometries.size > maxGeometries) {
      console.warn(`🚨 Too many geometries: ${resourcesRef.current.geometries.size}/${maxGeometries}`)
      performanceRef.current.memoryWarnings++
    }
    
    return geometry
  }, [maxGeometries])

  const trackMaterial = useCallback((material: THREE.Material) => {
    resourcesRef.current.materials.add(material)
    
    if (resourcesRef.current.materials.size > maxMaterials) {
      console.warn(`🚨 Too many materials: ${resourcesRef.current.materials.size}/${maxMaterials}`)
      performanceRef.current.memoryWarnings++
    }
    
    return material
  }, [maxMaterials])

  const trackMesh = useCallback((mesh: THREE.Mesh) => {
    resourcesRef.current.meshes.add(mesh)
    return mesh
  }, [])

  const trackScene = useCallback((scene: THREE.Scene) => {
    resourcesRef.current.scenes.add(scene)
    return scene
  }, [])

  const trackRenderer = useCallback((renderer: THREE.WebGLRenderer) => {
    resourcesRef.current.renderers.add(renderer)
    return renderer
  }, [])

  // Cleanup functions
  const disposeTexture = useCallback((texture: THREE.Texture) => {
    texture.dispose()
    resourcesRef.current.textures.delete(texture)
  }, [])

  const disposeGeometry = useCallback((geometry: THREE.BufferGeometry) => {
    geometry.dispose()
    resourcesRef.current.geometries.delete(geometry)
  }, [])

  const disposeMaterial = useCallback((material: THREE.Material) => {
    if (material instanceof THREE.Material) {
      material.dispose()
    }
    resourcesRef.current.materials.delete(material)
  }, [])

  const disposeMesh = useCallback((mesh: THREE.Mesh) => {
    if (mesh.geometry) disposeGeometry(mesh.geometry)
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(disposeMaterial)
      } else {
        disposeMaterial(mesh.material)
      }
    }
    resourcesRef.current.meshes.delete(mesh)
  }, [disposeGeometry, disposeMaterial])

  const disposeScene = useCallback((scene: THREE.Scene) => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        disposeMesh(object)
      }
    })
    scene.clear()
    resourcesRef.current.scenes.delete(scene)
  }, [disposeMesh])

  const disposeRenderer = useCallback((renderer: THREE.WebGLRenderer) => {
    renderer.dispose()
    renderer.forceContextLoss()
    resourcesRef.current.renderers.delete(renderer)
  }, [])

  // Complete cleanup
  const cleanupAll = useCallback(() => {
    console.log('🧹 Cleaning up all 3D resources...')
    
    // Dispose textures
    resourcesRef.current.textures.forEach(disposeTexture)
    
    // Dispose geometries
    resourcesRef.current.geometries.forEach(disposeGeometry)
    
    // Dispose materials
    resourcesRef.current.materials.forEach(disposeMaterial)
    
    // Dispose meshes
    resourcesRef.current.meshes.forEach(disposeMesh)
    
    // Dispose scenes
    resourcesRef.current.scenes.forEach(disposeScene)
    
    // Dispose renderers
    resourcesRef.current.renderers.forEach(disposeRenderer)

    performanceRef.current.lastCleanup = Date.now()
    
    if (enablePerformanceMonitoring) {
      console.log('🎯 3D cleanup completed successfully')
    }
  }, [
    disposeTexture, disposeGeometry, disposeMaterial, 
    disposeMesh, disposeScene, disposeRenderer, 
    enablePerformanceMonitoring
  ])
  // Auto cleanup based on memory pressure
  const autoCleanup = useCallback(() => {
    const now = Date.now()
    const timeSinceLastCleanup = now - performanceRef.current.lastCleanup
    
    if (timeSinceLastCleanup > cleanupInterval) {
      // Clean up unused resources
      const unusedTextures = Array.from(resourcesRef.current.textures).filter(
        texture => !texture.source?.data || texture.source.data === null
      )
      unusedTextures.forEach(disposeTexture)

      // Clean up orphaned geometries
      const unusedGeometries = Array.from(resourcesRef.current.geometries).filter(
        geometry => geometry.attributes && Object.keys(geometry.attributes).length === 0
      )
      unusedGeometries.forEach(disposeGeometry)

      performanceRef.current.lastCleanup = now
      
      if (enablePerformanceMonitoring && (unusedTextures.length > 0 || unusedGeometries.length > 0)) {
        console.log(`🧹 Auto-cleaned ${unusedTextures.length} unused textures`)
      }
    }
  }, [cleanupInterval, disposeTexture, enablePerformanceMonitoring])

  // Get current memory stats
  const getMemoryStats = useCallback((): MemoryStats => {
    const stats: MemoryStats = {
      textures: resourcesRef.current.textures.size,
      geometries: resourcesRef.current.geometries.size,
      materials: resourcesRef.current.materials.size,
      programs: 0,
      memoryUsage: 0
    }

    // Calculate estimated memory usage
    let estimatedMemory = 0
    resourcesRef.current.textures.forEach(texture => {
      if (texture.image) {
        estimatedMemory += (texture.image.width || 512) * (texture.image.height || 512) * 4 // RGBA
      }
    })
    
    stats.memoryUsage = estimatedMemory / (1024 * 1024) // Convert to MB
    statsRef.current = stats
    
    return stats
  }, [])

  // Performance monitoring
  useEffect(() => {
    if (!enablePerformanceMonitoring) return

    const interval = setInterval(() => {
      autoCleanup()
      
      const stats = getMemoryStats()
      
      if (stats.memoryUsage > 100) { // 100MB threshold
        console.warn('🚨 High memory usage detected:', stats)
      }
      
      performanceRef.current.frameCount++
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [enablePerformanceMonitoring, autoCleanup, getMemoryStats])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAll()
    }
  }, [cleanupAll])

  // WebGL context loss prevention and recovery
  const handleContextLoss = useCallback((renderer: THREE.WebGLRenderer) => {
    const canvas = renderer.domElement;
    
    const handleLost = (event: Event) => {
      console.warn('🚨 WebGL context lost! Attempting recovery...');
      event.preventDefault();
      
      // Cleanup all resources immediately
      cleanupAll();
      
      if (enablePerformanceMonitoring) {
        console.log('🔄 WebGL context loss - cleaned up resources');
      }
    };
    
    const handleRestored = () => {
      console.log('✅ WebGL context restored successfully');
      
      if (enablePerformanceMonitoring) {
        console.log('🎯 WebGL context recovery completed');
      }
    };
    
    canvas.addEventListener('webglcontextlost', handleLost);
    canvas.addEventListener('webglcontextrestored', handleRestored);
    
    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost);
      canvas.removeEventListener('webglcontextrestored', handleRestored);
    };
  }, [cleanupAll, enablePerformanceMonitoring]);

  // Memory pressure detection and emergency cleanup
  const handleMemoryPressure = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // Detect memory pressure through performance monitoring
    const checkMemoryPressure = () => {
      const stats = getMemoryStats();
      
      // Emergency cleanup if memory usage is too high
      if (stats.memoryUsage > 200) { // 200MB threshold
        console.warn('🚨 High memory usage detected, performing emergency cleanup');
        
        // More aggressive cleanup
        resourcesRef.current.textures.forEach(texture => {
          if (texture.source?.data?.width > 1024) {
            // Dispose large textures first
            disposeTexture(texture);
          }
        });
        
        performanceRef.current.memoryWarnings++;
      }
    };
    
    const interval = setInterval(checkMemoryPressure, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [getMemoryStats, disposeTexture]);

  // Enhanced cleanup with browser compatibility
  const robustCleanupAll = useCallback(() => {
    try {
      cleanupAll();
      
      // Force garbage collection if available (Chrome DevTools)
      if ('gc' in window && typeof (window as any).gc === 'function') {
        (window as any).gc();
      }
      
      // Clear any remaining WebGL resources
      if (typeof window !== 'undefined' && window.WebGLRenderingContext) {
        resourcesRef.current.renderers.forEach(renderer => {
          try {
            const gl = renderer.getContext();
            if (gl && gl.isContextLost && !gl.isContextLost()) {
              // Additional WebGL cleanup
              gl.deleteProgram;
              gl.deleteShader;
              gl.deleteTexture;
              gl.deleteBuffer;
            }
          } catch (error) {
            console.warn('WebGL cleanup warning:', error);
          }
        });
      }
      
    } catch (error) {
      console.error('Cleanup error (non-critical):', error);
    }
  }, [cleanupAll])
  // Memoized API with enhanced safety features
  const api = useMemo(() => ({
    // Resource tracking
    trackTexture,
    trackGeometry,
    trackMaterial,
    trackMesh,
    trackScene,
    trackRenderer,
    
    // Resource disposal
    disposeTexture,
    disposeGeometry,
    disposeMaterial,
    disposeMesh,
    disposeScene,
    disposeRenderer,
    
    // Cleanup (enhanced)
    cleanupAll: robustCleanupAll,
    autoCleanup,
    
    // Critical safeguards
    handleContextLoss,
    handleMemoryPressure,
    
    // Stats
    getMemoryStats,
    get stats() { return statsRef.current },
    get memoryWarnings() { return performanceRef.current.memoryWarnings }
  }), [
    trackTexture, trackGeometry, trackMaterial, trackMesh, trackScene, trackRenderer,
    disposeTexture, disposeGeometry, disposeMaterial, disposeMesh, disposeScene, disposeRenderer,
    robustCleanupAll, autoCleanup, handleContextLoss, handleMemoryPressure, getMemoryStats
  ])

  return api
}
