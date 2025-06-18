/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RetroBootHero } from '@/components/retro-boot-hero'

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock the 3D CRT Monitor component
jest.mock('@/components/crt-monitor-3d', () => ({
  CRTMonitor3D: ({ children }: any) => (
    <div data-testid="crt-monitor">{children}</div>
  ),
}))

describe('RetroBootHero', () => {
  const defaultProps = {
    name: 'Test User',
    roles: ['Developer', 'Designer'],
    systemName: 'test-system',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with default props', () => {
    render(<RetroBootHero {...defaultProps} />)
    
    expect(screen.getByTestId('crt-monitor')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('displays boot sequence correctly', async () => {
    render(<RetroBootHero {...defaultProps} />)
    
    // Boot sequence should start automatically
    await waitFor(() => {
      expect(screen.getByText(/RETRO-OS/)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('handles terminal commands correctly', async () => {
    render(<RetroBootHero {...defaultProps} />)
    
    // Wait for interactive mode
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Type a command/i)
      expect(input).toBeInTheDocument()
    }, { timeout: 5000 })

    const input = screen.getByPlaceholderText(/Type a command/i)
    
    // Test help command
    fireEvent.change(input, { target: { value: 'help' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(screen.getByText(/Available commands/i)).toBeInTheDocument()
    })
  })

  it('handles clear command', async () => {
    render(<RetroBootHero {...defaultProps} />)
    
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Type a command/i)
      expect(input).toBeInTheDocument()
    }, { timeout: 5000 })

    const input = screen.getByPlaceholderText(/Type a command/i)
    
    // Add some history first
    fireEvent.change(input, { target: { value: 'help' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(screen.getByText(/Available commands/i)).toBeInTheDocument()
    })

    // Clear the terminal
    fireEvent.change(input, { target: { value: 'clear' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(screen.queryByText(/Available commands/i)).not.toBeInTheDocument()
    })
  })

  it('is accessible', () => {
    render(<RetroBootHero {...defaultProps} />)
    
    // Check for proper semantic structure
    expect(screen.getByRole('region')).toBeInTheDocument()
    
    // Check for input accessibility
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-label')
  })

  it('handles mobile responsiveness', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })

    render(<RetroBootHero {...defaultProps} />)
    
    // Should render without errors on mobile
    expect(screen.getByTestId('crt-monitor')).toBeInTheDocument()
  })
})
