'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TerminalHeroProps {
  name?: string
  roles?: string[]
  systemName?: string
}

export function TerminalHero({ 
  name = "Rajin Uddin", 
  roles = ["Software Engineer", "Digital Designer", "Full-Stack Developer"],
  systemName = "rajin-linux"
}: TerminalHeroProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [terminalHistory, setTerminalHistory] = useState<string[]>([])
  const [isInteractive, setIsInteractive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const bootSequence = [
    "Initializing system...",
    "Loading kernel modules...",
    "Starting network services...",
    "Mounting filesystems...",
    "Starting display manager...",
    `Welcome to ${systemName} 1.0 LTS`,
    "",
    "Hi there.",
    `I'm ${name}`,
    "",
    ...roles,
    "",
    "System ready. Type 'help' for available commands.",
    "user:~$ "
  ]

  const commands = {
    help: [
      "Available commands:",
      "  about     - Learn more about me",
      "  projects  - View my work",
      "  skills    - See my technical skills", 
      "  contact   - Get in touch",
      "  clear     - Clear terminal",
      "  exit      - Close terminal"
    ],
    about: [
      "About me:",
      "I'm a passionate developer who loves creating",
      "beautiful and functional digital experiences.",
      "Currently focused on modern web technologies",
      "and user-centered design."
    ],
    projects: [
      "Recent Projects:",
      "• Portfolio Website - React/Next.js",
      "• E-commerce Platform - MERN Stack", 
      "• Mobile App - React Native",
      "• Data Visualization - D3.js"
    ],
    skills: [
      "Technical Skills:",
      "• Frontend: React, Next.js, TypeScript",
      "• Backend: Node.js, Python, PostgreSQL",
      "• Design: Figma, Adobe Creative Suite",
      "• Tools: Git, Docker, AWS"
    ],
    contact: [
      "Get in touch:",
      "• Email: rajin@example.com",
      "• LinkedIn: linkedin.com/in/rajinuddin",
      "• GitHub: github.com/rajinuddin"
    ],
    clear: [],
  }
  useEffect(() => {
    if (currentStep < bootSequence.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1)
      }, currentStep < 6 ? 300 : 800) // Faster for boot messages, slower for intro
      
      return () => clearTimeout(timer)
    }
    
    // Handle case when boot sequence is complete
    if (!isInteractive) {
      setIsInteractive(true)
    }
    
    return undefined // Explicit return for completed sequence
  }, [currentStep, bootSequence.length, isInteractive])

  const handleCommand = (input: string) => {
    const command = input.toLowerCase().trim()
    const newHistory = [...terminalHistory, `user:~$ ${input}`]
    
    if (command === 'clear') {
      setTerminalHistory([])
    } else if (command === 'exit') {
      setIsInteractive(false)
      setCurrentStep(0)
      setTerminalHistory([])
    } else if (commands[command as keyof typeof commands]) {
      setTerminalHistory([...newHistory, ...commands[command as keyof typeof commands], ""])
    } else if (command === '') {
      setTerminalHistory([...newHistory, ""])
    } else {
      setTerminalHistory([...newHistory, `bash: ${input}: command not found`, ""])
    }
    
    setUserInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(userInput)
    }
  }

  const focusInput = () => {
    if (isInteractive && inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <motion.div 
        className="crt-monitor max-w-4xl w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div 
          className="terminal-screen cursor-pointer" 
          onClick={focusInput}
        >
          <div className="space-y-1 mb-4">
            {/* Boot Sequence */}
            <AnimatePresence mode="wait">
              {bootSequence.slice(0, currentStep).map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`terminal-text ${
                    line.includes(name) ? 'text-xl font-bold' : ''
                  } ${
                    roles.includes(line) ? 'terminal-orange text-lg' : ''
                  } ${
                    line.includes('Welcome') ? 'terminal-green' : ''
                  }`}
                >
                  {line.includes(name) ? (
                    <>
                      I'm <span className="terminal-highlight">{name}</span>
                    </>
                  ) : line.includes('user:~$') ? (
                    <span className="flex items-center">
                      <span className="terminal-green">user</span>
                      <span className="text-white">:</span>
                      <span className="text-blue-400">~</span>
                      <span className="text-white">$ </span>
                      {!isInteractive && <span className="cursor"></span>}
                    </span>
                  ) : (
                    line
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Terminal History */}
          {terminalHistory.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="terminal-text"
            >
              {line.includes('user:~$') ? (
                <span className="flex items-center">
                  <span className="terminal-green">user</span>
                  <span className="text-white">:</span>
                  <span className="text-blue-400">~</span>
                  <span className="text-white">$ {line.replace('user:~$ ', '')}</span>
                </span>
              ) : (
                line
              )}
            </motion.div>
          ))}

          {/* Interactive Input */}
          {isInteractive && (
            <motion.div 
              className="flex items-center mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="terminal-green">user</span>
              <span className="text-white">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-white">$ </span>
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="terminal-input flex-1 ml-1"
                placeholder="Type 'help' for commands..."
                autoFocus
              />
              <span className="cursor ml-1"></span>
            </motion.div>
          )}

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-4 right-4 text-terminal-amber/50 text-sm"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ↓ Scroll to explore
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default TerminalHero
