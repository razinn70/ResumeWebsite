/**
 * COMPREHENSIVE TEST SUITE FOR ERROR BOUNDARIES
 * Tests all error scenarios and edge cases
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { GlobalErrorBoundary } from '../../components/error-boundary/GlobalErrorBoundary'
import { Enhanced3DErrorBoundary } from '../../components/error-boundary/Enhanced3DErrorBoundary'

// Mock console methods to test error logging
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeEach(() => {
  console.error = jest.fn()
  console.warn = jest.fn()
})

afterEach(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
})

// Component that throws an error for testing
function ThrowError({ shouldThrow = false, errorMessage = 'Test error' }) {
  if (shouldThrow) {
    throw new Error(errorMessage)
  }
  return <div>No error</div>
}

// Async component that throws after a delay
function AsyncError({ shouldThrow = false, delay = 100 }) {
  const [error, setError] = React.useState(false)
  
  React.useEffect(() => {
    if (shouldThrow) {
      setTimeout(() => setError(true), delay)
    }
  }, [shouldThrow, delay])
  
  if (error) {
    throw new Error('Async error')
  }
  
  return <div>No async error</div>
}

describe('GlobalErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <GlobalErrorBoundary>
        <div data-testid="child">Child component</div>
      </GlobalErrorBoundary>
    )
    
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('displays error UI when child component throws', () => {
    render(
      <GlobalErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GlobalErrorBoundary>
    )
    
    expect(screen.getByText('Application Error')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('calls custom error handler when provided', () => {
    const mockErrorHandler = jest.fn()
    
    render(
      <GlobalErrorBoundary onError={mockErrorHandler}>
        <ThrowError shouldThrow={true} errorMessage="Custom error" />
      </GlobalErrorBoundary>
    )
    
    expect(mockErrorHandler).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Custom error' }),
      expect.any(Object)
    )
  })

  it('shows retry button and handles retry', async () => {
    let shouldThrow = true
    
    function RetryableComponent() {
      if (shouldThrow) {
        throw new Error('Retryable error')
      }
      return <div data-testid="success">Success!</div>
    }
    
    const { rerender } = render(
      <GlobalErrorBoundary enableRetry={true} maxRetries={3}>
        <RetryableComponent />
      </GlobalErrorBoundary>
    )
    
    expect(screen.getByText('Try Again (3 left)')).toBeInTheDocument()
    
    // Mock successful retry
    shouldThrow = false
    fireEvent.click(screen.getByText('Try Again (3 left)'))
    
    await waitFor(() => {
      rerender(
        <GlobalErrorBoundary enableRetry={true} maxRetries={3}>
          <RetryableComponent />
        </GlobalErrorBoundary>
      )
    })
  })

  it('disables retry after max attempts', () => {
    render(
      <GlobalErrorBoundary enableRetry={true} maxRetries={0}>
        <ThrowError shouldThrow={true} />
      </GlobalErrorBoundary>
    )
    
    expect(screen.queryByText(/Try Again/)).not.toBeInTheDocument()
  })
  it('shows error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true,
      configurable: true,
    })
    
    render(
      <GlobalErrorBoundary showErrorDetails={true}>
        <ThrowError shouldThrow={true} errorMessage="Detailed error" />
      </GlobalErrorBoundary>
    )
    
    expect(screen.getByText('Error Details')).toBeInTheDocument()
    expect(screen.getByText('Detailed error')).toBeInTheDocument()
    
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      writable: true,
      configurable: true,
    })
  })

  it('handles reload button click', () => {
    const mockReload = jest.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    })
    
    render(
      <GlobalErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GlobalErrorBoundary>
    )
    
    fireEvent.click(screen.getByText('Reload Page'))
    expect(mockReload).toHaveBeenCalled()
  })

  it('handles go home button click', () => {
    const mockAssign = jest.fn()
    Object.defineProperty(window, 'location', {
      value: { href: '', assign: mockAssign },
      writable: true
    })
    
    render(
      <GlobalErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GlobalErrorBoundary>
    )
    
    fireEvent.click(screen.getByText('Go Home'))
    expect(window.location.href).toBe('/')
  })

  it('generates unique error IDs', () => {
    const { rerender } = render(
      <GlobalErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GlobalErrorBoundary>
    )
    
    const firstErrorId = screen.getByText(/error_/).textContent
    
    rerender(
      <GlobalErrorBoundary>
        <ThrowError shouldThrow={true} errorMessage="Second error" />
      </GlobalErrorBoundary>
    )
    
    const secondErrorId = screen.getByText(/error_/).textContent
    expect(firstErrorId).not.toBe(secondErrorId)
  })
})

describe('Enhanced3DErrorBoundary', () => {
  it('handles WebGL context errors', () => {
    // Mock WebGL context loss
    const mockCanvas = document.createElement('canvas')
    const mockContext = {
      getExtension: jest.fn().mockReturnValue(null),
      isContextLost: jest.fn().mockReturnValue(true)
    }
    
    jest.spyOn(mockCanvas, 'getContext').mockReturnValue(mockContext as any)
    jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas)
    
    render(
      <Enhanced3DErrorBoundary section="3D-Test">
        <ThrowError shouldThrow={true} errorMessage="WebGL context lost" />
      </Enhanced3DErrorBoundary>
    )
    
    expect(screen.getByText(/3D Component Error/)).toBeInTheDocument()
  })
  it('tracks performance warnings', () => {
    // Mock PerformanceObserver
    const mockObserver = {
      observe: jest.fn(),
      disconnect: jest.fn()
    }
    
    const MockPerformanceObserver = jest.fn().mockImplementation((callback) => {
      // Simulate performance entry
      setTimeout(() => {
        callback({
          getEntries: () => [{ name: 'three-performance-warning', duration: 100 }]
        })
      }, 0)
      return mockObserver    })
    
    // Add required supportedEntryTypes property
    Object.defineProperty(MockPerformanceObserver, 'supportedEntryTypes', {
      value: ['measure', 'navigation', 'resource'],
      writable: false,
      configurable: true
    })
    
    global.PerformanceObserver = MockPerformanceObserver as any
    
    render(
      <Enhanced3DErrorBoundary section="Performance-Test">
        <div>3D Component</div>
      </Enhanced3DErrorBoundary>
    )
    
    expect(mockObserver.observe).toHaveBeenCalledWith({
      entryTypes: ['measure', 'navigation']
    })
  })

  it('provides section-specific error information', () => {
    render(
      <Enhanced3DErrorBoundary section="SkillTree3D">
        <ThrowError shouldThrow={true} errorMessage="3D skill tree error" />
      </Enhanced3DErrorBoundary>
    )
    
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('SkillTree3D'),
      expect.any(Object)
    )
  })

  it('auto-retries recoverable errors', async () => {
    let attemptCount = 0
    
    function RecoverableComponent() {
      attemptCount++
      if (attemptCount === 1) {
        throw new Error('Recoverable error')
      }
      return <div data-testid="recovered">Recovered!</div>
    }
    
    render(
      <Enhanced3DErrorBoundary enableRetry={true}>
        <RecoverableComponent />
      </Enhanced3DErrorBoundary>
    )
    
    // Wait for auto-retry
    await waitFor(() => {
      expect(screen.getByTestId('recovered')).toBeInTheDocument()
    }, { timeout: 2000 })
  })
})

describe('Error Boundary Integration', () => {
  it('handles nested error boundaries correctly', () => {
    render(
      <GlobalErrorBoundary>
        <div>
          <Enhanced3DErrorBoundary section="Nested">
            <ThrowError shouldThrow={true} errorMessage="Nested error" />
          </Enhanced3DErrorBoundary>
        </div>
      </GlobalErrorBoundary>
    )
    
    // Should be caught by the inner boundary
    expect(screen.getByText(/3D Component Error/)).toBeInTheDocument()
    expect(screen.queryByText('Application Error')).not.toBeInTheDocument()
  })

  it('falls back to parent boundary when child boundary fails', () => {
    // Mock the Enhanced3DErrorBoundary to throw during render
    jest.spyOn(Enhanced3DErrorBoundary.prototype, 'render').mockImplementation(() => {
      throw new Error('Error boundary failure')
    })
    
    render(
      <GlobalErrorBoundary>
        <Enhanced3DErrorBoundary section="Failing">
          <div>Content</div>
        </Enhanced3DErrorBoundary>
      </GlobalErrorBoundary>
    )
    
    expect(screen.getByText('Application Error')).toBeInTheDocument()
    
    // Restore the mock
    jest.restoreAllMocks()
  })

  it('handles async errors in useEffect', async () => {
    render(
      <GlobalErrorBoundary>
        <AsyncError shouldThrow={true} delay={50} />
      </GlobalErrorBoundary>
    )
    
    // Initially no error
    expect(screen.getByText('No async error')).toBeInTheDocument()
    
    // Wait for async error
    await waitFor(() => {
      expect(screen.getByText('Application Error')).toBeInTheDocument()
    })
  })
})

describe('Error Reporting', () => {
  it('sends error reports to API endpoint', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    })
    global.fetch = mockFetch
    
    render(
      <GlobalErrorBoundary>
        <ThrowError shouldThrow={true} errorMessage="API test error" />
      </GlobalErrorBoundary>
    )
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/errors',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('API test error')
        })
      )
    })
  })

  it('handles API reporting failures gracefully', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'))
    global.fetch = mockFetch
    
    render(
      <GlobalErrorBoundary>
        <ThrowError shouldThrow={true} errorMessage="Network test error" />
      </GlobalErrorBoundary>
    )
    
    // Should still show error UI even if reporting fails
    expect(screen.getByText('Application Error')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Failed to report error:',
        expect.any(Error)
      )
    })
  })
})

// Test utilities
export function createErrorBoundaryTestUtils() {
  const mockErrorHandler = jest.fn()
  const mockFetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ success: true })
  })
  
  beforeEach(() => {
    global.fetch = mockFetch
    mockErrorHandler.mockClear()
    mockFetch.mockClear()
  })
  
  return {
    mockErrorHandler,
    mockFetch,
    renderWithErrorBoundary: (children: React.ReactNode, props = {}) =>
      render(
        <GlobalErrorBoundary onError={mockErrorHandler} {...props}>
          {children}
        </GlobalErrorBoundary>
      )
  }
}
