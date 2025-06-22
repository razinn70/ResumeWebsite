'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TerminalCommand {
  cmd: string
  desc: string
  category: string
  hidden?: boolean
}

interface TerminalLine {
  id: string
  type: 'command' | 'output' | 'system' | 'error'
  content: string
  timestamp: number
}

interface TerminalShellProps {
  commands: TerminalCommand[]
  onCommand: (command: string) => void
  bootSequence?: string[]
  className?: string
  matrixMode?: boolean
  onMatrixModeToggle?: () => void
}

export function TerminalShell({ 
  commands, 
  onCommand, 
  bootSequence = [],
  className = "",
  matrixMode = false,
  onMatrixModeToggle
}: TerminalShellProps) {  const [lines, setLines] = useState<TerminalLine[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [isBooting, setIsBooting] = useState(true)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [autoComplete, setAutoComplete] = useState<string[]>([])
  const [showAutoComplete, setShowAutoComplete] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  // Boot sequence animation
  useEffect(() => {
    if (bootSequence.length === 0) {
      setIsBooting(false)
      return
    }
    
    let currentIndex = 0
    const bootLines: TerminalLine[] = []
    
    const bootInterval = setInterval(() => {
      if (currentIndex < bootSequence.length) {        const newLine: TerminalLine = {
          id: `boot-${currentIndex}`,
          type: 'system',
          content: bootSequence[currentIndex] || '',
          timestamp: Date.now()
        }
        bootLines.push(newLine)
        setLines([...bootLines])
        currentIndex++
      } else {
        clearInterval(bootInterval)
        setIsBooting(false)
        // Add welcome message
        const welcomeLine: TerminalLine = {
          id: 'welcome',
          type: 'system',
          content: "Type 'help' for available commands.",
          timestamp: Date.now()
        }
        setLines([...bootLines, welcomeLine])
      }
    }, 800)
    
    return () => clearInterval(bootInterval)
  }, [bootSequence])
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])
    // Focus input when clicking terminal
  useEffect(() => {
    const terminal = terminalRef.current
    if (terminal) {
      const handleClick = () => inputRef.current?.focus()
      terminal.addEventListener('click', handleClick)
      return () => terminal.removeEventListener('click', handleClick)
    }
    return undefined // explicit return for when terminal is null
  }, [])
  
  // Play typing sound
  const playTypingSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {}) // Silent fail for audio
    }
  }, [])
  
  // Handle auto-completion
  const updateAutoComplete = useCallback((input: string) => {
    if (input.length < 2) {
      setShowAutoComplete(false)
      return
    }
    
    const matches = commands
      .filter(cmd => cmd.cmd.toLowerCase().startsWith(input.toLowerCase()))
      .map(cmd => cmd.cmd)
      .slice(0, 5)
    
    setAutoComplete(matches)
    setShowAutoComplete(matches.length > 0)
  }, [commands])
  
  // Command execution with typing effect
  const executeCommand = useCallback((cmd: string) => {
    const trimmedCmd = cmd.trim()
    if (!trimmedCmd) return
    
    // Add command to history
    setCommandHistory(prev => [...prev, trimmedCmd])
    setHistoryIndex(-1)
    
    // Add command line
    const commandLine: TerminalLine = {
      id: `cmd-${Date.now()}`,
      type: 'command',
      content: `> ${trimmedCmd}`,
      timestamp: Date.now()
    }
    
    setLines(prev => [...prev, commandLine])
    setCurrentInput('')
    setShowAutoComplete(false)
    
    // Handle special commands
    if (trimmedCmd === 'clear') {
      setTimeout(() => setLines([]), 100)
      return
    }
    
    if (trimmedCmd === 'sudo ai-mode') {
      const aiLines = [
        '🤖 AI Mode Activated...',
        'Scanning developer capabilities...',
        'Neural networks: ONLINE',
        'Creativity modules: ENHANCED',
        'Easter egg unlocked: Matrix rain effect enabled',
        'Welcome to the machine, Neo.'
      ]
      
      aiLines.forEach((line, index) => {
        setTimeout(() => {
          const aiLine: TerminalLine = {
            id: `ai-${Date.now()}-${index}`,
            type: 'system',
            content: line,
            timestamp: Date.now()
          }
          setLines(prev => [...prev, aiLine])
          
          if (index === aiLines.length - 1) {
            onMatrixModeToggle?.()
          }
        }, index * 500)
      })
      return
    }
    
    if (trimmedCmd === 'help') {
      const helpOutput = [
        '=== SKILL-OS v2.1.0 Command Reference ===',
        '',
        'NAVIGATION:',
        '  tree              - Display skill tree structure',
        '  map               - Show interactive node map',
        '  unlock <category> - Focus on skill category',
        '',
        'ANALYSIS:',
        '  inspect <skill>   - Deep dive into skill details',
        '  connect <s1> <s2> - Show skill relationships',
        '  stats             - Display system diagnostics',
        '',
        'SYSTEM:',
        '  clear             - Clear terminal output',
        '  reboot            - Restart skill tree animation',
        '  export skills.pdf - Generate resume snapshot',
        '  sudo ai-mode      - 🤖 Activate secret mode',
        '',
        'UTILITIES:',
        '  whoami            - Display user information',
        '  version           - Show OS version',
        '',
        'Use TAB for auto-completion. Use ↑/↓ for command history.'
      ]
      
      helpOutput.forEach((line, index) => {
        setTimeout(() => {
          const helpLine: TerminalLine = {
            id: `help-${Date.now()}-${index}`,
            type: 'output',
            content: line,
            timestamp: Date.now()
          }
          setLines(prev => [...prev, helpLine])
        }, index * 50)
      })
      return
    }
    
    if (trimmedCmd === 'whoami') {
      const userInfo = [
        'User: Rajin Uddin',
        'Role: Full-Stack Developer & Digital Designer',
        'Location: /home/rajin/skills',
        'Shell: skill-bash v2.1.0',
        'Uptime: 3+ years of coding',
        'Load Average: High creativity, Medium coffee levels'
      ]
      
      userInfo.forEach((line, index) => {
        setTimeout(() => {
          const infoLine: TerminalLine = {
            id: `info-${Date.now()}-${index}`,
            type: 'output',
            content: line,
            timestamp: Date.now()
          }
          setLines(prev => [...prev, infoLine])
        }, index * 100)
      })
      return
    }
    
    // Pass command to parent handler
    onCommand(trimmedCmd)
  }, [onCommand, onMatrixModeToggle])
  
  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    playTypingSound()
    
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        executeCommand(currentInput)
        break
          case 'Tab':
        e.preventDefault()
        if (autoComplete.length > 0 && autoComplete[0]) {
          setCurrentInput(autoComplete[0])
          setShowAutoComplete(false)
        }
        break
        
      case 'ArrowUp':
        e.preventDefault()
        if (commandHistory.length > 0) {          const newIndex = historyIndex === -1 
            ? commandHistory.length - 1 
            : Math.max(0, historyIndex - 1)
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex] || '')
        }
        break
        
      case 'ArrowDown':
        e.preventDefault()
        if (historyIndex !== -1) {
          const newIndex = historyIndex < commandHistory.length - 1 
            ? historyIndex + 1 
            : -1
          setHistoryIndex(newIndex)
          setCurrentInput(newIndex === -1 ? '' : commandHistory[newIndex] || '')
        }
        break
        
      case 'Escape':
        setShowAutoComplete(false)
        break
    }
  }
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCurrentInput(value)
    updateAutoComplete(value)
  }
  
  // Matrix mode styling
  const terminalClasses = matrixMode 
    ? "bg-black text-green-400 border-green-400" 
    : "bg-terminal-black text-terminal-amber border-terminal-amber/30"
  
  return (    <div className={`w-full h-full ${className}`}>
      {/* Hidden audio for typing sounds - disabled for now */}
      {/* <audio ref={audioRef} preload="auto">
        <source src="/audio/keystroke.mp3" type="audio/mpeg" />
      </audio> */}
      
      <div 
        ref={terminalRef}
        className={`w-full h-full p-4 font-mono text-sm overflow-y-auto scrollbar-thin scrollbar-thumb-terminal-amber/30 scrollbar-track-transparent ${terminalClasses}`}
        style={{ 
          minHeight: '280px',
          maxHeight: '280px',
          fontFamily: 'VT323, "Courier New", monospace',
          lineHeight: '1.4'
        }}
      >
        {/* Terminal Output */}
        <AnimatePresence>
          {lines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`
                ${line.type === 'command' && 'text-terminal-green'}
                ${line.type === 'output' && 'text-terminal-cream'}
                ${line.type === 'system' && 'text-terminal-amber'}
                ${line.type === 'error' && 'text-red-400'}
                ${matrixMode && 'text-green-400'}
              `}
            >
              {line.content}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Command Input */}
        {!isBooting && (
          <div className="flex items-center mt-2">
            <span className={matrixMode ? 'text-green-400' : 'text-terminal-green'}>
              {'> '}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-inherit font-mono"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className={`ml-1 ${matrixMode ? 'text-green-400' : 'text-terminal-amber'}`}
            >
              ▊
            </motion.span>
          </div>
        )}
        
        {/* Auto-completion dropdown */}
        <AnimatePresence>
          {showAutoComplete && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={`mt-2 p-2 rounded border ${
                matrixMode 
                  ? 'bg-black/90 border-green-400/50 text-green-400' 
                  : 'bg-terminal-black/90 border-terminal-amber/50 text-terminal-amber'
              }`}
            >
              <div className="text-xs mb-1">Suggestions:</div>
              {autoComplete.map((suggestion) => (
                <div
                  key={suggestion}
                  className="text-xs cursor-pointer hover:bg-terminal-amber/20 px-2 py-1 rounded"
                  onClick={() => {
                    setCurrentInput(suggestion)
                    setShowAutoComplete(false)
                    inputRef.current?.focus()
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TerminalShell
