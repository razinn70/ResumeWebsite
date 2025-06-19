'use client'

import { useState, useEffect } from 'react'

interface PerformanceConfig {
  enableAnimations: boolean
  enable3D: boolean
  enableParticles: boolean
  enableAdvancedEffects: boolean
  reducedMotion: boolean
}

export function usePerformanceOptimization(): PerformanceConfig {
  const [config, setConfig] = useState<PerformanceConfig>({
    enableAnimations: true,
    enable3D: true,
    enableParticles: true,
    enableAdvancedEffects: true,
    reducedMotion: false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Basic device capabilities detection
    const isLowEndDevice = () => {
      // Check available memory (if supported)
      const memory = (navigator as any).deviceMemory
      if (memory && memory < 4) return true

      // Check number of CPU cores (if supported)
      const cores = navigator.hardwareConcurrency
      if (cores && cores < 4) return true

      // Check connection type (if supported)
      const connection = (navigator as any).connection
      if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
        return true
      }

      // Check user agent for mobile devices
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      return isMobile
    }

    const lowEnd = isLowEndDevice()

    setConfig({
      enableAnimations: !prefersReducedMotion,
      enable3D: !lowEnd && !prefersReducedMotion,
      enableParticles: !lowEnd && !prefersReducedMotion,
      enableAdvancedEffects: !lowEnd && !prefersReducedMotion,
      reducedMotion: prefersReducedMotion
    })

    // Listen for changes in motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (e: MediaQueryListEvent) => {
      setConfig(prev => ({
        ...prev,
        enableAnimations: !e.matches,
        reducedMotion: e.matches
      }))
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return config
}
