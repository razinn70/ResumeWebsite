/**
 * @fileoverview RetroBootHero - Interactive terminal-style hero component with 3D CRT monitor
 * 
 * Features:
 * - Authentic BIOS boot sequence animation
 * - Interactive terminal shell with commands
 * - 3D CRT monitor with custom shaders
 * - ASCII art avatar display
 * - Responsive design with mobile optimization
 * - Full accessibility support
 * 
 * @author Senior Frontend Engineer
 * @version 2.0.0
 * @since 2025-06-18
 */

'use client'

import { useState, useEffect, useRef, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CRTMonitor3D } from './crt-monitor-3d'
import { ErrorBoundary } from './error-boundary'

/**
 * Props interface for RetroBootHero component
 * @interface RetroBootHeroProps
 */
interface RetroBootHeroProps {
  /** Developer name displayed in terminal and avatar */
  name?: string
  /** Array of professional roles/titles */
  roles?: string[]
  /** System name shown in terminal prompt */
  systemName?: string
}

/**
 * RetroBootHero Component
 * 
 * An interactive terminal-style hero section featuring:
 * - Animated boot sequence with authentic BIOS messages
 * - 3D CRT monitor with custom WebGL shaders
 * - Interactive shell with custom commands
 * - ASCII art avatar and system information
 * - Mobile-responsive design with touch support
 * 
 * @component
 * @param {RetroBootHeroProps} props - Component props
 * @returns {JSX.Element} Rendered RetroBootHero component
 * 
 * @example
 * ```tsx
 * <RetroBootHero 
 *   name="John Doe"
 *   roles={["Full-Stack Developer", "UI Designer"]}
 *   systemName="dev-machine"
 * />
 * ```
 */

const RetroBootHero = memo(function RetroBootHero({ 
  name = "Rajin Uddin", 
  roles = ["Software Engineer", "Digital Designer", "Full-Stack Developer"],
  systemName = "rajin-linux"
}: RetroBootHeroProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [terminalHistory, setTerminalHistory] = useState<string[]>([])
  const [isInteractive, setIsInteractive] = useState(false)
  const [showAvatar, setShowAvatar] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  // Authentic BIOS/Boot sequence
  const bootSequence = useMemo(() => [
    "RETRO-OS Boot Loader v2.1",
    "Copyright (C) 2025 Digital Craftsman Industries",
    "",
    "Detecting hardware...",
    "CPU: Intel 80486DX2-66 (emulated)",
    "Memory: 640KB conventional, 7936KB extended",
    "Graphics: VGA Compatible, 256 colors",
    "",
    "Loading system files...",
    "AUTOEXEC.BAT processed",
    "CONFIG.SYS processed", 
    "",
    `Welcome to ${systemName} v1.0 LTS`,
    "Terminal ready.",
    "",
    "Hi there.",
    `I'm ${name}`,
    "",
    ...roles,
    "",
    "System initialized. Type 'help' for available commands.",
    "user@retro:~$ "
  ], [name, roles, systemName])

  // Enhanced command system
  const commands = {
    help: [
      "Available commands:",
      "  about     - Personal information",
      "  projects  - View portfolio projects", 
      "  skills    - Technical capabilities",
      "  contact   - Get in touch",
      "  whoami    - Display current user",
      "  date      - Show current date/time",
      "  fortune   - Random tech quote",
      "  hello     - Greeting message",
      "  clear     - Clear terminal",
      "  exit      - Close session"
    ],
    about: [
      "PERSONAL PROFILE",
      "================",
      "Name: " + name,
      "Status: Available for opportunities",
      "Location: Ready for remote/hybrid work",
      "Passion: Creating digital experiences that matter",
      "",
      "I specialize in modern web technologies with",
      "a focus on user experience and clean code.",
      "Always learning, always building."
    ],
    projects: [
      "PROJECT REPOSITORY",
      "==================",
      "1. Terminal Portfolio - React/Next.js/Three.js",
      "   Status: [ACTIVE] Retro-inspired developer showcase",
      "",
      "2. E-commerce Platform - MERN Stack",
      "   Status: [DEPLOYED] Full-stack shopping solution",
      "",
      "3. Mobile Task App - React Native",
      "   Status: [BETA] Cross-platform productivity tool",
      "",
      "4. Data Viz Dashboard - D3.js/Python",
      "   Status: [PRODUCTION] Real-time analytics",
      "",
      "Type 'cd projects' for detailed view."
    ],
    skills: [
      "TECHNICAL SPECIFICATIONS",
      "========================",
      "Frontend: React.js, Next.js, TypeScript, Vue.js",
      "Backend: Node.js, Python, Express, FastAPI",
      "Database: PostgreSQL, MongoDB, Redis",
      "Cloud: AWS, Vercel, Docker, Kubernetes",
      "Design: Figma, Adobe Suite, Blender",
      "3D/Graphics: Three.js, WebGL, GLSL shaders",
      "",
      "Specialization: Full-stack development",
      "Experience: 3+ years professional coding"
    ],
    contact: [
      "CONTACT INFORMATION", 
      "===================",
      "Email: rajin.uddin@example.com",
      "LinkedIn: linkedin.com/in/rajinuddin",
      "GitHub: github.com/rajinuddin",
      "Portfolio: rajinuddin.dev",
      "",
      "Available for:",
      "• Full-time opportunities",
      "• Freelance projects", 
      "• Technical consultations",
      "• Open source collaboration"
    ],
    whoami: ["rajin_uddin"],
    date: [new Date().toLocaleString()],
    fortune: [
      "\"Programs must be written for people to read,",
      "and only incidentally for machines to execute.\"",
      "- Harold Abelson"    ],
    hello: ["Hello, World! Welcome to my terminal."],
    clear: [],
  }
  useEffect(() => {
    if (currentStep < bootSequence.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1)
        // Show avatar after name introduction
        if (bootSequence[currentStep]?.includes(name)) {
          setTimeout(() => setShowAvatar(true), 1000)
        }
      }, currentStep < 12 ? 200 : 600) // Faster boot, slower intro
      
      return () => clearTimeout(timer)
    }
    
    // Handle case when boot sequence is complete
    if (!isInteractive) {
      setIsInteractive(true)
    }
    
    return undefined // Explicit return for completed boot sequence
  }, [currentStep, bootSequence.length, name, bootSequence, isInteractive])

  const handleCommand = (input: string) => {
    const command = input.toLowerCase().trim()
    const newHistory = [...terminalHistory, `user@retro:~$ ${input}`]
    
    if (command === 'clear') {
      setTerminalHistory([])
    } else if (command === 'exit') {
      setIsInteractive(false)
      setCurrentStep(0)
      setTerminalHistory([])
      setShowAvatar(false)
    } else if (commands[command as keyof typeof commands]) {
      setTerminalHistory([...newHistory, ...commands[command as keyof typeof commands], ""])
    } else if (command === '') {
      setTerminalHistory([...newHistory, ""])
    } else {
      setTerminalHistory([...newHistory, `bash: ${input}: command not found`, `Try 'help' for available commands.`, ""])
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

  // ASCII Art Avatar
  const avatarArt = `
    ░░░░░░░░░░░░░░░░░░░░
    ░░██████████████░░░░
    ░░██▒▒▒▒▒▒▒▒▒▒██░░░░
    ░░██▒▒██▒▒██▒▒██░░░░
    ░░██▒▒▒▒▒▒▒▒▒▒██░░░░
    ░░██▒▒██████▒▒██░░░░
    ░░██▒▒▒▒▒▒▒▒▒▒██░░░░
    ░░██████████████░░░░
    ░░░░░░░░░░░░░░░░░░░░
  `

  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* 3D CRT Monitor */}
        <motion.div
          className="order-2 lg:order-1"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}        >
          {/* 3D CRT Monitor with Error Boundary for WebGL fallback */}
          <ErrorBoundary 
            fallback={
              <div className="w-full h-[600px] bg-gradient-to-br from-gray-900 to-black border-2 border-terminal-amber/30 rounded-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-terminal-amber font-retro mb-4">
                    ⚠️ 3D RENDERING UNAVAILABLE
                  </div>
                  <div className="text-terminal-amber/60 text-sm">
                    WebGL not supported. Displaying fallback interface.
                  </div>
                </div>
              </div>
            }
          >
            <CRTMonitor3D>
            <div className="terminal-screen w-full h-full p-6 cursor-pointer" onClick={focusInput}>
              <div className="space-y-1 text-sm">
                {/* Boot Sequence */}
                <AnimatePresence mode="wait">
                  {bootSequence.slice(0, currentStep).map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`font-retro text-terminal-amber ${
                        line.includes('RETRO-OS') ? 'text-terminal-green font-bold' : ''
                      } ${
                        line.includes('Copyright') ? 'text-terminal-amber/60 text-xs' : ''
                      } ${
                        line.includes(name) ? 'text-lg font-bold text-terminal-orange' : ''
                      } ${
                        roles.includes(line) ? 'text-terminal-amber text-base' : ''
                      } ${
                        line.includes('Welcome') ? 'text-terminal-green' : ''
                      }`}
                    >
                      {line.includes(name) ? (
                        <>
                          I'm <span className="terminal-highlight px-1">{name}</span>
                        </>
                      ) : line.includes('user@retro') ? (
                        <span className="flex items-center">
                          <span className="text-terminal-green">user</span>
                          <span className="text-white">@</span>
                          <span className="text-terminal-orange">retro</span>
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

                {/* Terminal History */}
                {terminalHistory.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-retro text-terminal-amber text-sm"
                  >
                    {line.includes('user@retro') ? (
                      <span className="flex items-center">
                        <span className="text-terminal-green">user</span>
                        <span className="text-white">@</span>
                        <span className="text-terminal-orange">retro</span>
                        <span className="text-white">:</span>
                        <span className="text-blue-400">~</span>
                        <span className="text-white">$ {line.replace('user@retro:~$ ', '')}</span>
                      </span>
                    ) : (
                      <pre className="whitespace-pre-wrap">{line}</pre>
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
                    <span className="text-terminal-green font-retro">user</span>
                    <span className="text-white">@</span>
                    <span className="text-terminal-orange">retro</span>
                    <span className="text-white">:</span>
                    <span className="text-blue-400">~</span>
                    <span className="text-white">$ </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="terminal-input flex-1 ml-1 font-retro text-sm"
                      placeholder="Type 'help' for commands..."
                      autoFocus                    />
                    <span className="cursor ml-1"></span>
                  </motion.div>
                )}
              </div>
            </div>
          </CRTMonitor3D>
          </ErrorBoundary>
        </motion.div>

        {/* ASCII Avatar & Info Panel */}
        <motion.div 
          className="order-1 lg:order-2 space-y-6"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          {/* ASCII Avatar */}
          <AnimatePresence>
            {showAvatar && (
              <motion.div
                className="bg-terminal-black/50 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-6"
                initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                <pre className="font-pixel text-terminal-amber text-xs leading-tight mb-4 text-center">
                  {avatarArt}
                </pre>
                <div className="text-center">
                  <div className="terminal-highlight inline-block px-3 py-1 mb-2 font-retro">
                    {name.toUpperCase()}.EXE
                  </div>
                  <div className="text-terminal-green font-retro text-sm">
                    [ONLINE] • [CREATIVE_MODE] • [READY]
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* System Info */}
          <motion.div 
            className="bg-terminal-black/30 backdrop-blur-sm border border-terminal-amber/30 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <div className="font-retro text-terminal-amber space-y-2">
              <div className="text-terminal-green font-bold mb-3">SYSTEM STATUS</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-terminal-orange">UPTIME</div>
                  <div>3+ years</div>
                </div>
                <div>
                  <div className="text-terminal-orange">PROJECTS</div>
                  <div>15+ deployed</div>
                </div>
                <div>
                  <div className="text-terminal-orange">STATUS</div>
                  <div className="text-terminal-green">AVAILABLE</div>
                </div>
                <div>
                  <div className="text-terminal-orange">MODE</div>
                  <div className="text-terminal-green">CREATIVE</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="text-center text-terminal-amber/50 font-retro text-sm"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ↓ SCROLL FOR FULL EXPERIENCE ↓
          </motion.div>        </motion.div>
      </div>
    </section>
  )
})

// Display name for debugging
RetroBootHero.displayName = 'RetroBootHero'

export default RetroBootHero
