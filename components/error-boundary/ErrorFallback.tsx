'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, RefreshCw } from 'lucide-react'

interface ErrorFallbackProps {
  error?: Error
  resetError?: () => void
  componentName?: string
}

export function ErrorFallback({ error, resetError, componentName = 'Component' }: ErrorFallbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[200px] bg-gray-900 border border-red-500/50 rounded-lg flex items-center justify-center p-8 m-4"
    >
      <div className="text-center text-white max-w-md">
        <div className="mb-4">
          <Lightbulb className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-red-400">Oops! Something went wrong</h3>
        </div>
        
        <p className="text-gray-300 mb-4 text-sm">
          The {componentName} couldn't load properly. Don't worry - the rest of the site is still working!
        </p>
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left text-xs text-gray-400 mb-4 p-2 bg-gray-800 rounded">
            <summary className="cursor-pointer mb-2">Error Details</summary>
            <pre className="whitespace-pre-wrap">{error.message}</pre>
          </details>
        )}
        
        {resetError && (
          <button
            onClick={resetError}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </motion.div>
  )
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallbackProps?: Partial<ErrorFallbackProps>
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={<ErrorFallback {...fallbackProps} />}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}
