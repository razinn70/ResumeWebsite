/**
 * PRODUCTION-READY GLOBAL ERROR BOUNDARY
 * Handles all application errors with comprehensive logging and recovery
 */
'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home, Bug, Monitor } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  enableRetry?: boolean
  maxRetries?: number
  showErrorDetails?: boolean
}

interface State {
  hasError: boolean
  error?: Error | undefined
  errorInfo?: ErrorInfo | undefined
  isRetrying: boolean
  retryCount: number
  errorId: string
}

interface ErrorReport {
  errorId: string
  message: string
  stack?: string | undefined
  componentStack?: string | undefined
  userAgent: string
  url: string
  timestamp: string
  userId?: string | undefined
  sessionId?: string | undefined
  buildId?: string | undefined
  errorBoundary: string
}

export class GlobalErrorBoundary extends Component<Props, State> {
  private retryTimeout?: NodeJS.Timeout
  private maxRetries: number

  constructor(props: Props) {
    super(props)
    this.maxRetries = props.maxRetries || 3
    this.state = {
      hasError: false,
      isRetrying: false,
      retryCount: 0,
      errorId: this.generateErrorId()
    }
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorReport: ErrorReport = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack || undefined,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      timestamp: new Date().toISOString(),
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      buildId: process.env['NEXT_PUBLIC_BUILD_ID'],
      errorBoundary: 'GlobalErrorBoundary'
    }

    // Enhanced logging
    console.error('🚨 Global Application Error:', errorReport)

    this.setState({ error, errorInfo })
    
    // Report to error tracking service
    this.reportError(errorReport)
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo)
  }

  private getUserId(): string | undefined {
    try {
      return typeof window !== 'undefined' 
        ? localStorage.getItem('analytics_user_id') || undefined
        : undefined
    } catch {
      return undefined
    }
  }

  private getSessionId(): string | undefined {
    try {
      return typeof window !== 'undefined' 
        ? sessionStorage.getItem('session_id') || undefined
        : undefined
    } catch {
      return undefined
    }
  }

  private async reportError(errorReport: ErrorReport) {
    try {
      // In production, send to your error tracking service
      if (process.env.NODE_ENV === 'production') {
        await fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorReport)
        })
      }
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  private handleRetry = () => {
    if (this.state.retryCount >= this.maxRetries) {
      console.warn(`Max retries (${this.maxRetries}) exceeded`)
      return
    }

    this.setState({ isRetrying: true })
    
    this.retryTimeout = setTimeout(() => {      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        isRetrying: false,
        retryCount: this.state.retryCount + 1,
        errorId: this.generateErrorId()
      })
    }, 1000)
  }

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  private handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }
  override componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full bg-gray-800 border border-red-500/20 rounded-lg shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-red-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-white" />
                <h1 className="text-xl font-bold text-white">
                  Application Error
                </h1>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="text-center">
                <Monitor className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Something went wrong
                </h2>
                <p className="text-gray-300">
                  We're sorry, but an unexpected error occurred. Our team has been notified.
                </p>
              </div>

              {/* Error Details (Development only) */}
              {(process.env.NODE_ENV === 'development' || this.props.showErrorDetails) && (
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Bug className="h-4 w-4 text-red-400" />
                    <span className="font-medium text-red-400">Error Details</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Error ID:</span>
                      <span className="ml-2 font-mono text-green-400">{this.state.errorId}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Message:</span>
                      <span className="ml-2 text-white">{this.state.error?.message}</span>
                    </div>
                    {this.state.error?.stack && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-gray-400 hover:text-white">
                          Stack Trace
                        </summary>
                        <pre className="mt-2 p-3 bg-black border border-gray-700 rounded text-xs text-gray-300 overflow-auto max-h-40">
                          {this.state.error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {this.props.enableRetry !== false && this.state.retryCount < this.maxRetries && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={this.handleRetry}
                    disabled={this.state.isRetrying}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${this.state.isRetrying ? 'animate-spin' : ''}`} />
                    <span>
                      {this.state.isRetrying ? 'Retrying...' : `Try Again (${this.maxRetries - this.state.retryCount} left)`}
                    </span>
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={this.handleReload}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reload Page</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={this.handleGoHome}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Go Home</span>
                </motion.button>
              </div>

              {/* Support Information */}
              <div className="text-center text-sm text-gray-400">
                <p>
                  If this problem persists, please contact support with error ID:{' '}
                  <span className="font-mono text-green-400">{this.state.errorId}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}
