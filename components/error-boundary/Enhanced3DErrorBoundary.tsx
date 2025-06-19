'use client'

import React, { Component, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  section?: string
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: string
}

export class Enhanced3DErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Component Error:', error, errorInfo)
    this.setState({
      error,
      errorInfo: errorInfo.componentStack || undefined
    })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full h-96 bg-gray-900 border border-red-500 rounded-lg flex items-center justify-center p-8"
        >
          <div className="text-center text-white max-w-md">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">3D Component Error</h3>
            <p className="text-gray-300 mb-4 text-sm">
              The 3D {this.props.section || 'component'} failed to load. This might be due to:
            </p>
            <ul className="text-left text-gray-400 text-xs mb-6 space-y-1">
              <li>• WebGL not supported</li>
              <li>• Insufficient graphics memory</li>
              <li>• Browser compatibility issues</li>
            </ul>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </motion.div>
      )
    }

    return this.props.children
  }
}
