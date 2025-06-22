/**
 * ROBUST 3D ERROR BOUNDARY - PRODUCTION READY
 * Handles Three.js specific errors, memory leaks, and WebGL issues
 */
'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Monitor, Zap } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  section?: string
  onError?: ((error: Error, errorInfo: ErrorInfo) => void) | undefined
  enableRetry?: boolean
  maxRetries?: number
}

interface State {
  hasError: boolean
  error?: Error | undefined
  errorInfo?: ErrorInfo | undefined
  isRetrying: boolean
  retryCount: number
  webglSupported: boolean
}

export class Enhanced3DErrorBoundary extends Component<Props, State> {
  private retryTimeout?: NodeJS.Timeout
  private performanceObserver?: PerformanceObserver

  constructor(props: Props) {
    super(props)
    this.state = { 
      hasError: false, 
      isRetrying: false, 
      retryCount: 0,
      webglSupported: this.checkWebGLSupport()
    }
    
    // Monitor performance
    this.initPerformanceMonitoring()
  }

  private checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      return !!gl
    } catch {
      return false
    }
  }

  private initPerformanceMonitoring() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        this.performanceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (entry.name.includes('three') || entry.name.includes('webgl')) {
              console.warn('3D Performance Warning:', entry)
            }
          })
        })
        this.performanceObserver.observe({ entryTypes: ['measure', 'navigation'] })
      } catch (error) {
        console.warn('Performance monitoring not available:', error)
      }
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorDetails = {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      section: this.props.section,
      retryCount: this.state.retryCount,
      webglSupported: this.state.webglSupported,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    }

    // Enhanced logging for production debugging
    console.error(`🚨 3D Component Error in ${this.props.section || 'Unknown'}:`, errorDetails)

    this.setState({ error, errorInfo })
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo)

    // Auto-retry for recoverable errors
    if (this.shouldRetry(error) && this.props.enableRetry !== false) {
      this.scheduleRetry()
    }

    // Report to error tracking service (if available)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        tags: { component: '3d-error-boundary' },
        extra: errorDetails
      })
    }
  }

  private shouldRetry(error: Error): boolean {
    const maxRetries = this.props.maxRetries || 2
    if (this.state.retryCount >= maxRetries) return false

    const retryableErrors = [
      'webgl context lost',
      'failed to initialize webgl',
      'canvas is already in use',
      'memory allocation failed',
      'shader compilation failed',
      'texture creation failed',
      'buffer creation failed',
      'out of memory'
    ]
    
    return retryableErrors.some(msg => 
      error.message.toLowerCase().includes(msg.toLowerCase())
    )
  }

  private scheduleRetry = () => {
    this.setState({ isRetrying: true })
    
    // Clear any existing timeout
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }

    // Exponential backoff: 1s, 2s, 4s
    const delay = 1000 * Math.pow(2, this.state.retryCount)
    
    this.retryTimeout = setTimeout(() => {
      this.setState(prevState => ({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined,
        isRetrying: false,
        retryCount: prevState.retryCount + 1
      }))
    }, delay)
  }

  override componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }
    if (this.performanceObserver) {
      this.performanceObserver.disconnect()
    }
  }

  private handleManualRetry = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      isRetrying: false,
      retryCount: 0
    })
  }

  private handleFallbackMode = () => {
    // Set a flag to disable 3D features globally
    if (typeof window !== 'undefined') {
      localStorage.setItem('disable3D', 'true')
      window.location.reload()
    }
  }
  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full min-h-96 bg-gradient-to-br from-gray-900 to-gray-800 border border-red-500/50 rounded-lg flex items-center justify-center p-8"
        >
          <div className="text-center text-white max-w-lg">
            {/* Error Icon */}
            <div className="flex justify-center mb-4">
              {!this.state.webglSupported ? (
                <Monitor className="w-16 h-16 text-red-400" />
              ) : (
                <Zap className="w-16 h-16 text-yellow-400" />
              )}
            </div>

            {/* Error Title */}
            <h3 className="text-2xl font-bold mb-3 text-red-400">
              {!this.state.webglSupported ? 'WebGL Not Supported' : '3D Component Error'}
            </h3>
            
            {/* Error Description */}
            <p className="text-gray-300 mb-4">
              {!this.state.webglSupported 
                ? 'Your browser doesn\'t support WebGL, which is required for 3D features.'
                : `The 3D ${this.props.section || 'component'} encountered an error and couldn't load.`
              }
            </p>

            {/* Technical Details */}
            <div className="bg-black/30 rounded-lg p-4 mb-6 text-left">
              <h4 className="text-sm font-semibold text-yellow-400 mb-2">Technical Details:</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• WebGL Support: {this.state.webglSupported ? '✅ Available' : '❌ Not Available'}</li>
                <li>• Retry Count: {this.state.retryCount}/{this.props.maxRetries || 2}</li>
                <li>• Section: {this.props.section || 'Unknown'}</li>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <li>• Error: {this.state.error.message}</li>
                )}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {this.props.enableRetry !== false && (
                <button
                  onClick={this.handleManualRetry}
                  disabled={this.state.isRetrying}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 px-6 py-3 rounded-lg text-sm font-medium transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${this.state.isRetrying ? 'animate-spin' : ''}`} />
                  {this.state.isRetrying ? 'Retrying...' : 'Retry'}
                </button>
              )}
              
              <button
                onClick={this.handleFallbackMode}
                className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg text-sm font-medium transition-colors"
              >
                <Monitor className="w-4 h-4" />
                Use 2D Mode
              </button>
            </div>

            {/* Retry Status */}
            {this.state.isRetrying && (
              <p className="mt-4 text-sm text-yellow-400">
                Retrying in {1000 * Math.pow(2, this.state.retryCount)}ms...
              </p>
            )}

            {/* Development Info */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-blue-400 text-sm mb-2">
                  Debug Information
                </summary>
                <pre className="bg-black/50 p-3 rounded text-xs overflow-auto max-h-32 text-gray-300">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </motion.div>
      )
    }

    return this.props.children
  }
}
