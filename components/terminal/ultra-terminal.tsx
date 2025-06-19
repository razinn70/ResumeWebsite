/**
 * @fileoverview Ultra-Authentic Terminal Interface
 * Complete UNIX-like terminal emulator with advanced features
 */

'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TerminalState, TerminalLine, TerminalContext, TerminalConfig } from './types'
import { CommandRegistry } from './commands'
import { FileSystemSimulator } from './file-system'
import { VT100Parser } from './vt100-parser'

interface UltraTerminalProps {
  className?: string
  initialDirectory?: string
  config?: Partial<TerminalConfig>
  onCommand?: (command: string, result: any) => void
}

const DEFAULT_CONFIG: TerminalConfig = {
  fontSize: 14,
  fontFamily: '"IBM 3270", "VT323", "Courier New", monospace',
  theme: {
    name: 'retro-amber',
    background: '#0A0A0A',
    foreground: '#FFB000',
    cursor: '#FFB000',
    selection: 'rgba(255, 176, 0, 0.3)',
    black: '#000000',
    red: '#FF6B6B',
    green: '#00FF41',
    yellow: '#FFD700',
    blue: '#4FC3F7',
    magenta: '#FF69B4',
    cyan: '#00FFFF',
    white: '#FFFFFF',
    brightBlack: '#666666',
    brightRed: '#FF8A8A',
    brightGreen: '#69FF69',
    brightYellow: '#FFFF69',
    brightBlue: '#69B7FF',
    brightMagenta: '#FF8AFF',
    brightCyan: '#69FFFF',
    brightWhite: '#FFFFFF'
  },
  cursorStyle: 'block',
  cursorBlink: true,
  scrollback: 1000,
  tabSize: 4,
  showLineNumbers: false,
  enableBell: true,
  accessibility: {
    highContrast: false,
    reduceMotion: false,
    screenReaderMode: false,
    announceOutput: true,
    largeText: false
  }
}

export function UltraTerminal({ 
  className = '', 
  initialDirectory = '/home/rajin',
  config: configOverride = {},
  onCommand
}: UltraTerminalProps) {
  const config = useMemo(() => ({ ...DEFAULT_CONFIG, ...configOverride }), [configOverride])
  
  // Core state
  const [state, setState] = useState<TerminalState>(() => {
    const fileSystem = new FileSystemSimulator()
    // const commandRegistry = new CommandRegistry(fileSystem) // TODO: Use command registry
    
    return {
      lines: [{
        id: 'welcome',
        type: 'system',
        content: 'Ultra-Authentic Terminal v2.0.0 - Type "help" for commands',
        timestamp: new Date(),
        color: config.theme.green
      }],
      currentInput: '',
      cursorPosition: 0,
      scrollPosition: 0,
      isInMultiLineMode: false,
      multiLineBuffer: [],
      currentPrompt: '',
      commandHistory: [],
      historyIndex: -1,
      context: {
        currentDirectory: initialDirectory,
        environment: {
          PATH: '/usr/local/bin:/usr/bin:/bin',
          USER: 'rajin',
          HOME: '/home/rajin',
          PWD: initialDirectory,
          SHELL: '/bin/bash',
          TERM: 'xterm-256color',
          EDITOR: 'vim',
          LANG: 'en_US.UTF-8'
        },
        user: 'rajin',
        hostname: 'dev-machine',
        processes: [],
        history: [],
        fileSystem: fileSystem
      },
      config
    }
  })
  
  // Refs
  // const terminalRef = useRef<HTMLDivElement>(null) // TODO: Use terminal ref for scrolling
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Command registry
  const commandRegistry = useMemo(() => 
    new CommandRegistry(state.context.fileSystem), 
    [state.context.fileSystem]
  )
  
  // Generate prompt
  const generatePrompt = useCallback(() => {
    const { user, hostname, currentDirectory, environment } = state.context
    const gitBranch = '' // TODO: Implement git branch detection
    const shortPath = currentDirectory.replace(environment.HOME, '~')
    
    return `${user}@${hostname}:${shortPath}${gitBranch}$ `
  }, [state.context])
  
  // Handle command execution
  const executeCommand = useCallback(async (input: string) => {
    const trimmedInput = input.trim()
    
    if (trimmedInput === '') return
    
    // Add to history
    const newHistory = [...state.context.history, trimmedInput]
    
    // Parse command with pipes and redirections
    const commands = parseCommandLine(trimmedInput)
    
    // Add input line to terminal
    const inputLine: TerminalLine = {
      id: `input-${Date.now()}`,
      type: 'input',
      content: generatePrompt() + trimmedInput,
      timestamp: new Date()
    }
    
    setState(prev => ({
      ...prev,
      lines: [...prev.lines, inputLine],
      currentInput: '',
      cursorPosition: 0,
      historyIndex: -1,
      context: {
        ...prev.context,
        history: newHistory
      }
    }))
    
    // Execute command(s)
    try {
      for (const command of commands) {
        const result = await executeCommandWithPipes(command, state.context, commandRegistry)
        
        // Add output lines
        if (result.output.length > 0) {
          const outputLines: TerminalLine[] = result.output.map((line, index) => ({
            id: `output-${Date.now()}-${index}`,
            type: result.exitCode === 0 ? 'output' : 'error',
            content: line,
            timestamp: new Date(),
            color: result.exitCode === 0 ? undefined : config.theme.red
          }))
          
          setState(prev => ({
            ...prev,
            lines: [...prev.lines, ...outputLines]
          }))
        }
        
        // Handle background processes
        if (result.backgroundProcess) {
          setState(prev => ({
            ...prev,
            context: {
              ...prev.context,
              processes: [...prev.context.processes, result.backgroundProcess!]
            }
          }))
        }
        
        // Notify parent component
        if (onCommand) {
          onCommand(trimmedInput, result)
        }
      }
    } catch (error) {
      const errorLine: TerminalLine = {
        id: `error-${Date.now()}`,
        type: 'error',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        color: config.theme.red
      }
      
      setState(prev => ({
        ...prev,
        lines: [...prev.lines, errorLine]
      }))
    }
    
    // Auto-scroll to bottom
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }, 50)
  }, [state.context, commandRegistry, generatePrompt, onCommand, config.theme])
  
  // Keyboard event handlers
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const { key, ctrlKey, altKey } = e
    
    // Ctrl+C - Interrupt current command
    if (ctrlKey && key === 'c') {
      e.preventDefault()
      setState(prev => ({
        ...prev,
        currentInput: '',
        cursorPosition: 0,
        isInMultiLineMode: false,
        multiLineBuffer: []
      }))
      
      const interruptLine: TerminalLine = {
        id: `interrupt-${Date.now()}`,
        type: 'system',
        content: '^C',
        timestamp: new Date()
      }
      
      setState(prev => ({
        ...prev,
        lines: [...prev.lines, interruptLine]
      }))
      return
    }
    
    // Ctrl+L - Clear screen
    if (ctrlKey && key === 'l') {
      e.preventDefault()
      setState(prev => ({
        ...prev,
        lines: []
      }))
      return
    }
    
    // Ctrl+D - EOF
    if (ctrlKey && key === 'd') {
      e.preventDefault()
      if (state.currentInput === '') {
        // Exit terminal
        const exitLine: TerminalLine = {
          id: `exit-${Date.now()}`,
          type: 'system',
          content: 'logout',
          timestamp: new Date()
        }
        
        setState(prev => ({
          ...prev,
          lines: [...prev.lines, exitLine]
        }))
      }
      return
    }
    
    // Enter - Execute command
    if (key === 'Enter') {
      e.preventDefault()
      
      if (state.isInMultiLineMode) {
        // Handle multi-line input
        if (state.currentInput.trim() === '') {
          // Empty line - execute multi-line command
          const fullCommand = state.multiLineBuffer.join('\n')
          setState(prev => ({
            ...prev,
            isInMultiLineMode: false,
            multiLineBuffer: [],
            currentInput: ''
          }))
          executeCommand(fullCommand)
        } else {
          // Add line to buffer
          setState(prev => ({
            ...prev,
            multiLineBuffer: [...prev.multiLineBuffer, prev.currentInput],
            currentInput: ''
          }))
        }
      } else {
        executeCommand(state.currentInput)
      }
      return
    }
    
    // Arrow keys - History navigation
    if (key === 'ArrowUp') {
      e.preventDefault()
      const newIndex = Math.min(state.historyIndex + 1, state.context.history.length - 1)
      if (newIndex >= 0 && newIndex < state.context.history.length) {
        const historyCommand = state.context.history[state.context.history.length - 1 - newIndex]
        setState(prev => ({
          ...prev,
          currentInput: historyCommand,
          cursorPosition: historyCommand.length,
          historyIndex: newIndex
        }))
      }
      return
    }
    
    if (key === 'ArrowDown') {
      e.preventDefault()
      const newIndex = Math.max(state.historyIndex - 1, -1)
      if (newIndex === -1) {
        setState(prev => ({
          ...prev,
          currentInput: '',
          cursorPosition: 0,
          historyIndex: -1
        }))
      } else {
        const historyCommand = state.context.history[state.context.history.length - 1 - newIndex]
        setState(prev => ({
          ...prev,
          currentInput: historyCommand,
          cursorPosition: historyCommand.length,
          historyIndex: newIndex
        }))
      }
      return
    }
    
    // Tab completion
    if (key === 'Tab') {
      e.preventDefault()
      const completions = commandRegistry.getTabCompletions(state.currentInput, state.context)
      
      if (completions.length === 1) {
        // Single completion - auto-complete
        setState(prev => ({
          ...prev,
          currentInput: completions[0],
          cursorPosition: completions[0].length
        }))
      } else if (completions.length > 1) {
        // Multiple completions - show options
        const completionLine: TerminalLine = {
          id: `completion-${Date.now()}`,
          type: 'output',
          content: completions.join('  '),
          timestamp: new Date()
        }
        
        setState(prev => ({
          ...prev,
          lines: [...prev.lines, completionLine]
        }))
      }
      return
    }
    
    // Home/End keys
    if (key === 'Home') {
      e.preventDefault()
      setState(prev => ({ ...prev, cursorPosition: 0 }))
      return
    }
    
    if (key === 'End') {
      e.preventDefault()
      setState(prev => ({ ...prev, cursorPosition: prev.currentInput.length }))
      return
    }
    
    // Left/Right arrow keys
    if (key === 'ArrowLeft') {
      e.preventDefault()
      setState(prev => ({
        ...prev,
        cursorPosition: Math.max(0, prev.cursorPosition - 1)
      }))
      return
    }
    
    if (key === 'ArrowRight') {
      e.preventDefault()
      setState(prev => ({
        ...prev,
        cursorPosition: Math.min(prev.currentInput.length, prev.cursorPosition + 1)
      }))
      return
    }
    
    // Backspace
    if (key === 'Backspace') {
      e.preventDefault()
      if (state.cursorPosition > 0) {
        const newInput = state.currentInput.slice(0, state.cursorPosition - 1) + 
                         state.currentInput.slice(state.cursorPosition)
        setState(prev => ({
          ...prev,
          currentInput: newInput,
          cursorPosition: prev.cursorPosition - 1
        }))
      }
      return
    }
    
    // Delete
    if (key === 'Delete') {
      e.preventDefault()
      if (state.cursorPosition < state.currentInput.length) {
        const newInput = state.currentInput.slice(0, state.cursorPosition) + 
                         state.currentInput.slice(state.cursorPosition + 1)
        setState(prev => ({
          ...prev,
          currentInput: newInput
        }))
      }
      return
    }
    
    // Regular character input
    if (key.length === 1 && !ctrlKey && !altKey) {
      e.preventDefault()
      const newInput = state.currentInput.slice(0, state.cursorPosition) + 
                       key + 
                       state.currentInput.slice(state.cursorPosition)
      setState(prev => ({
        ...prev,
        currentInput: newInput,
        cursorPosition: prev.cursorPosition + 1
      }))
    }
  }, [state, commandRegistry, executeCommand])
  
  // Focus management
  const focusTerminal = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])
  
  useEffect(() => {
    focusTerminal()
  }, [focusTerminal])
  
  // Render terminal line with VT100 support
  const renderLine = useCallback((line: TerminalLine) => {
    if (line.content.includes('\x1b')) {
      // Parse VT100 escape sequences
      const segments = VT100Parser.parseEscapeSequences(line.content)
      
      return (
        <div key={line.id} className="terminal-line">
          {segments.map((segment, index) => (
            <span
              key={index}
              className={getStyleClasses(segment.style)}
              style={getStyleProps(segment.style, config.theme)}
            >
              {segment.content}
            </span>
          ))}
        </div>
      )
    }
    
    return (
      <div
        key={line.id}
        className={`terminal-line ${line.type}`}
        style={{ color: line.color }}
      >
        {line.content}
      </div>
    )
  }, [config.theme])
  
  return (
    <div 
      className={`ultra-terminal ${className}`}
      style={{
        fontFamily: config.fontFamily,
        fontSize: `${config.fontSize}px`,
        backgroundColor: config.theme.background,
        color: config.theme.foreground
      }}
      onClick={focusTerminal}
    >
      {/* Terminal Output */}
      <div 
        ref={scrollRef}
        className="terminal-output"
        style={{ height: '400px', overflowY: 'auto', padding: '16px' }}
      >
        <AnimatePresence>
          {state.lines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              {renderLine(line)}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Current Input Line */}
        <div className="terminal-input-line">
          <span className="terminal-prompt">
            {generatePrompt()}
          </span>
          <div className="terminal-input-container">
            <span className="terminal-input-text">
              {state.currentInput.slice(0, state.cursorPosition)}
            </span>
            <span 
              className={`terminal-cursor ${config.cursorBlink ? 'blink' : ''}`}
              style={{
                backgroundColor: config.theme.cursor,
                width: config.cursorStyle === 'block' ? '0.6em' : '2px',
                height: config.cursorStyle === 'underline' ? '2px' : '1.2em'
              }}
            />
            <span className="terminal-input-text">
              {state.currentInput.slice(state.cursorPosition)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Hidden input for keyboard handling */}
      <input
        ref={inputRef}
        className="terminal-hidden-input"
        style={{
          position: 'absolute',
          left: '-9999px',
          opacity: 0
        }}
        value=""
        onChange={() => {}} // Handled by onKeyDown
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </div>
  )
}

// Helper functions
function parseCommandLine(input: string): string[] {
  // TODO: Implement proper command line parsing with pipes, redirections, etc.
  return [input]
}

async function executeCommandWithPipes(command: string, context: TerminalContext, registry: CommandRegistry) {
  // TODO: Implement pipe and redirection handling
  const parts = command.trim().split(/\s+/)
  const commandName = parts[0]
  const args = parts.slice(1)
  
  const cmd = registry.getCommand(commandName)
  if (cmd) {
    return await cmd.execute(args, context)
  } else {
    return {
      output: [`${commandName}: command not found`],
      exitCode: 127,
      error: 'Command not found'
    }
  }
}

function getStyleClasses(style: any): string {
  const classes = []
  
  if (style.bold) classes.push('font-bold')
  if (style.dim) classes.push('opacity-60')
  if (style.italic) classes.push('italic')
  if (style.underline) classes.push('underline')
  if (style.strikethrough) classes.push('line-through')
  if (style.inverse) classes.push('terminal-inverse')
  
  return classes.join(' ')
}

function getStyleProps(style: any, theme: any): React.CSSProperties {
  const props: React.CSSProperties = {}
  
  if (style.foreground) {
    props.color = theme[style.foreground] || style.foreground
  }
  
  if (style.background) {
    props.backgroundColor = theme[style.background] || style.background
  }
  
  return props
}

export default UltraTerminal
