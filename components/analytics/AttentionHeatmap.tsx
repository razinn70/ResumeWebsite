'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Eye, Crosshair, Activity } from 'lucide-react'
import { CognitivePsychologyEngine, AttentionPattern } from '@/lib/cognitive-psychology'
import { useAnalytics } from '@/components/analytics'

interface AttentionHeatmapProps {
  enabled?: boolean
  showVisualization?: boolean
  sensitivity?: number
  className?: string
}

interface AttentionPoint {
  x: number
  y: number
  intensity: number
  timestamp: number
  duration: number
  elementId?: string
}

interface HeatmapData {
  points: AttentionPoint[]
  clusters: { x: number, y: number, strength: number }[]
  scanPath: { x: number, y: number, order: number }[]
  dwellTimes: { [elementId: string]: number }
}

export function AttentionHeatmapTracker({ 
  enabled = true, 
  showVisualization = false,
  sensitivity = 1.0,
  className = '' 
}: AttentionHeatmapProps) {
  const analytics = useAnalytics()
  const containerRef = useRef<HTMLDivElement>(null)
  const [heatmapData, setHeatmapData] = useState<HeatmapData>({
    points: [],
    clusters: [],
    scanPath: [],
    dwellTimes: {}
  })
  const [isTracking, setIsTracking] = useState(false)
  const [currentFocus, setCurrentFocus] = useState<{ x: number, y: number } | null>(null)
  const mousePositionRef = useRef<{ x: number, y: number, timestamp: number }>({ x: 0, y: 0, timestamp: 0 })
  const focusHistoryRef = useRef<AttentionPoint[]>([])

  // Simulate eye-tracking using advanced mouse tracking and scroll behavior
  const trackAttention = useCallback((event: MouseEvent) => {
    if (!enabled || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height

    // Only track if within container bounds
    if (x < 0 || x > 1 || y < 0 || y > 1) return

    const now = Date.now()
    const prevPosition = mousePositionRef.current

    // Calculate attention intensity based on movement patterns
    const velocity = prevPosition.timestamp > 0 
      ? Math.sqrt(
          Math.pow(x - prevPosition.x, 2) + 
          Math.pow(y - prevPosition.y, 2)
        ) / (now - prevPosition.timestamp) * 1000
      : 0

    // Higher intensity for slower movement (indicates focus)
    const intensity = Math.max(0.1, Math.min(1, 1 - velocity * sensitivity))

    // Estimate dwell time based on movement patterns
    const dwellTime = velocity < 0.001 ? now - prevPosition.timestamp : 0

    // Get element at this position
    const elementAtPoint = document.elementFromPoint(event.clientX, event.clientY)
    const elementId = elementAtPoint?.id || elementAtPoint?.className || 'unknown'

    const attentionPoint: AttentionPoint = {
      x: x * rect.width,
      y: y * rect.height,
      intensity,
      timestamp: now,
      duration: dwellTime,
      elementId
    }

    focusHistoryRef.current.push(attentionPoint)

    // Keep only recent history (last 1000 points)
    if (focusHistoryRef.current.length > 1000) {
      focusHistoryRef.current = focusHistoryRef.current.slice(-1000)
    }

    mousePositionRef.current = { x, y, timestamp: now }
    setCurrentFocus({ x: x * rect.width, y: y * rect.height })

    // Update heatmap data periodically
    if (focusHistoryRef.current.length % 10 === 0) {
      updateHeatmapData()
    }
  }, [enabled, sensitivity])

  // Track scroll-based attention patterns
  const trackScrollAttention = useCallback(() => {
    if (!enabled || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const viewportCenter = {
      x: rect.width / 2,
      y: Math.max(0, Math.min(rect.height, window.innerHeight / 2 - rect.top))
    }

    // Assume attention at viewport center during scroll
    const attentionPoint: AttentionPoint = {
      x: viewportCenter.x,
      y: viewportCenter.y,
      intensity: 0.6,
      timestamp: Date.now(),
      duration: 100,
      elementId: 'viewport-center'
    }

    focusHistoryRef.current.push(attentionPoint)
  }, [enabled])

  // Update heatmap visualization data
  const updateHeatmapData = useCallback(() => {
    const points = focusHistoryRef.current
    if (points.length === 0) return

    // Generate attention clusters using simple clustering
    const clusters = generateAttentionClusters(points)
    
    // Generate scan path (sequence of major focus points)
    const scanPath = generateScanPath(points)
    
    // Calculate dwell times per element
    const dwellTimes = calculateDwellTimes(points)

    setHeatmapData({
      points: points.slice(-200), // Show recent points
      clusters,
      scanPath,
      dwellTimes
    })

    // Update analytics with attention pattern
    const attentionPattern: AttentionPattern = {
      focusPoints: points.map(p => ({
        x: p.x,
        y: p.y,
        duration: p.duration,
        intensity: p.intensity
      })),
      scanPath: scanPath.map(p => ({
        x: p.x,
        y: p.y,
        timestamp: Date.now()
      })),
      fixationClusters: clusters.map(c => ({
        x: c.x,
        y: c.y,
        count: c.strength
      })),
      attentionHeatmap: generateHeatmapGrid(points),
      dwellTime: dwellTimes,
      backtrackingFrequency: calculateBacktrackingFrequency(points)
    }

    // Update cognitive engine with attention data
    // This would integrate with the analytics system
    if (analytics?.session) {
      analytics.trackAction({
        type: 'attention_pattern',
        timestamp: Date.now(),
        data: attentionPattern,
        section: 'heatmap'
      })
    }
  }, [analytics])

  // Generate attention clusters using density-based clustering
  const generateAttentionClusters = (points: AttentionPoint[]) => {
    const clusters: { x: number, y: number, strength: number }[] = []
    const gridSize = 50
    const grid: { [key: string]: AttentionPoint[] } = {}

    // Group points into grid cells
    points.forEach(point => {
      const gridX = Math.floor(point.x / gridSize)
      const gridY = Math.floor(point.y / gridSize)
      const key = `${gridX},${gridY}`
      
      if (!grid[key]) grid[key] = []
      grid[key].push(point)
    })

    // Find high-density clusters
    Object.entries(grid).forEach(([key, cellPoints]) => {      if (cellPoints.length >= 5) { // Minimum points for a cluster
        const [gridX, gridY] = key.split(',').map(Number)
        if (gridX !== undefined && gridY !== undefined) {
          const avgIntensity = cellPoints.reduce((sum, p) => sum + p.intensity, 0) / cellPoints.length
          
          clusters.push({
            x: gridX * gridSize + gridSize / 2,
            y: gridY * gridSize + gridSize / 2,
            strength: cellPoints.length * avgIntensity
          })
        }
      }
    })

    return clusters.sort((a, b) => b.strength - a.strength).slice(0, 10)
  }

  // Generate scan path showing major attention movements
  const generateScanPath = (points: AttentionPoint[]) => {
    const scanPath: { x: number, y: number, order: number }[] = []
    const minDistance = 100 // Minimum distance between scan points
    
    let order = 0
    points.forEach(point => {
      const isSignificant = scanPath.length === 0 || 
        scanPath.every(sp => 
          Math.sqrt(Math.pow(sp.x - point.x, 2) + Math.pow(sp.y - point.y, 2)) > minDistance
        )
      
      if (isSignificant && point.intensity > 0.3) {
        scanPath.push({
          x: point.x,
          y: point.y,
          order: order++
        })
      }
    })

    return scanPath.slice(0, 20) // Limit scan path length
  }

  // Calculate dwell times per element
  const calculateDwellTimes = (points: AttentionPoint[]) => {
    const dwellTimes: { [elementId: string]: number } = {}
    
    points.forEach(point => {
      if (point.elementId && point.duration > 0) {
        dwellTimes[point.elementId] = (dwellTimes[point.elementId] || 0) + point.duration
      }
    })

    return dwellTimes
  }

  // Generate 2D heatmap grid
  const generateHeatmapGrid = (points: AttentionPoint[]) => {
    const gridWidth = 20
    const gridHeight = 20
    const grid = Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(0))

    if (!containerRef.current) return grid

    const rect = containerRef.current.getBoundingClientRect()
    
    points.forEach(point => {
      const gridX = Math.floor((point.x / rect.width) * gridWidth)
      const gridY = Math.floor((point.y / rect.height) * gridHeight)
        if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        if (grid[gridY] && grid[gridY][gridX] !== undefined) {
          grid[gridY][gridX] += point.intensity
        }
      }
    })

    return grid
  }

  // Calculate backtracking frequency
  const calculateBacktrackingFrequency = (points: AttentionPoint[]) => {
    let backtrackCount = 0
      for (let i = 2; i < points.length; i++) {
      const current = points[i]
      const previous = points[i - 1]
      const beforePrevious = points[i - 2]
      
      if (current && previous && beforePrevious) {
        // Check if current position is closer to before-previous than previous
        const distToPrev = Math.sqrt(
          Math.pow(current.x - previous.x, 2) + Math.pow(current.y - previous.y, 2)
        )
        const distToBeforePrev = Math.sqrt(
          Math.pow(current.x - beforePrevious.x, 2) + Math.pow(current.y - beforePrevious.y, 2)
        )
        
        if (distToBeforePrev < distToPrev * 0.7) {
          backtrackCount++
        }
      }
    }
    
    return points.length > 0 ? backtrackCount / points.length : 0
  }

  useEffect(() => {
    if (!enabled) return

    const handleMouseMove = (e: MouseEvent) => trackAttention(e)
    const handleScroll = () => trackScrollAttention()

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('scroll', handleScroll)

    setIsTracking(true)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('scroll', handleScroll)
      setIsTracking(false)
    }
  }, [enabled, trackAttention, trackScrollAttention])

  return (
    <div ref={containerRef} className={`attention-heatmap-container relative ${className}`}>
      {/* Tracking Status Indicator */}
      {isTracking && (
        <motion.div
          className="fixed top-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg z-50 flex items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-xs">Attention Tracking Active</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </motion.div>
      )}

      {/* Current Focus Indicator */}
      {showVisualization && currentFocus && (
        <motion.div
          className="absolute pointer-events-none z-30"
          style={{
            left: currentFocus.x - 10,
            top: currentFocus.y - 10
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Crosshair className="w-5 h-5 text-blue-400" />
        </motion.div>
      )}      {/* Attention Heatmap Visualization */}
      {showVisualization && containerRef.current && (
        <AttentionHeatmapVisualization 
          data={heatmapData}
          containerRef={containerRef}
        />
      )}

      {/* Dwell Time Overlay */}
      {showVisualization && process.env.NODE_ENV === 'development' && (
        <DwellTimeOverlay dwellTimes={heatmapData.dwellTimes} />
      )}
    </div>
  )
}

// Heatmap Visualization Component
function AttentionHeatmapVisualization({ 
  data, 
  containerRef 
}: {
  data: HeatmapData
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Attention Points */}
      {data.points.map((point, index) => (
        <motion.div
          key={`point-${index}`}
          className="absolute rounded-full bg-blue-400"
          style={{
            left: point.x - 2,
            top: point.y - 2,
            width: 4,
            height: 4,
            opacity: point.intensity * 0.6
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      ))}

      {/* Attention Clusters */}
      {data.clusters.map((cluster, index) => (
        <motion.div
          key={`cluster-${index}`}
          className="absolute rounded-full border-2 border-red-400"
          style={{
            left: cluster.x - cluster.strength * 2,
            top: cluster.y - cluster.strength * 2,
            width: cluster.strength * 4,
            height: cluster.strength * 4,
            opacity: Math.min(0.8, cluster.strength * 0.1)
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Scan Path */}
      <svg className="absolute inset-0 w-full h-full">        {data.scanPath.slice(0, -1).map((point, index) => {
          const nextPoint = data.scanPath[index + 1]
          if (!nextPoint) return null
          
          return (
            <motion.line
              key={`path-${index}`}
              x1={point.x}
              y1={point.y}
              x2={nextPoint.x}
              y2={nextPoint.y}
              stroke="rgba(34, 197, 94, 0.6)"
              strokeWidth="2"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
          )
        })}
        
        {/* Scan Path Points */}
        {data.scanPath.map((point, index) => (
          <motion.circle
            key={`scan-point-${index}`}
            cx={point.x}
            cy={point.y}
            r="6"
            fill="rgba(34, 197, 94, 0.8)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          />
        ))}
      </svg>
    </div>
  )
}

// Dwell Time Development Overlay
function DwellTimeOverlay({ dwellTimes }: { dwellTimes: { [elementId: string]: number } }) {
  const topDwellTimes = Object.entries(dwellTimes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  if (topDwellTimes.length === 0) return null

  return (
    <motion.div
      className="fixed bottom-20 right-4 bg-black/90 text-white p-4 rounded-lg z-50 max-w-xs"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-center space-x-2 mb-2">
        <Eye className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium">Top Dwell Times</span>
      </div>
      
      <div className="space-y-1 text-xs">
        {topDwellTimes.map(([elementId, time]) => (
          <div key={elementId} className="flex justify-between">
            <span className="truncate max-w-32">{elementId}</span>
            <span className="text-blue-400">{(time / 1000).toFixed(1)}s</span>
          </div>
        ))}
      </div>    </motion.div>
  )
}
