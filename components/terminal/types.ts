/**
 * @fileoverview Terminal interface types and definitions
 * Complete type system for authentic UNIX-like terminal emulation
 */

export interface TerminalCommand {
  name: string
  description: string
  usage: string
  aliases?: string[]
  options?: CommandOption[]
  execute: (args: string[], context: TerminalContext) => Promise<CommandResult>
}

export interface CommandOption {
  flag: string
  description: string
  requiresValue?: boolean
}

export interface CommandResult {
  output: string[]
  exitCode: number
  error?: string
  backgroundProcess?: BackgroundProcess
}

export interface BackgroundProcess {
  pid: number
  command: string
  status: 'running' | 'stopped' | 'completed'
  startTime: number
  output?: string[]
}

export interface TerminalContext {
  currentDirectory: string
  environment: Record<string, string>
  user: string
  hostname: string
  processes: BackgroundProcess[]
  history: string[]
  fileSystem: FileSystemNode
  pipes?: PipeOperation[]
}

export interface FileSystemNode {
  name: string
  type: 'file' | 'directory' | 'symlink'
  size: number
  permissions: string
  owner: string
  group: string
  modified: Date
  content?: string
  children?: Record<string, FileSystemNode>
  target?: string // for symlinks
}

export interface PipeOperation {
  type: 'pipe' | 'redirect_out' | 'redirect_append' | 'redirect_in'
  target: string
}

export interface TerminalState {
  lines: TerminalLine[]
  currentInput: string
  cursorPosition: number
  scrollPosition: number
  isInMultiLineMode: boolean
  multiLineBuffer: string[]
  currentPrompt: string
  selectedText?: TextSelection
  commandHistory: string[]
  historyIndex: number
  context: TerminalContext
  config: TerminalConfig
}

export interface TerminalLine {
  id: string
  type: 'output' | 'input' | 'error' | 'system' | 'prompt'
  content: string
  timestamp: Date
  color?: string
  style?: TerminalLineStyle
}

export interface TerminalLineStyle {
  bold?: boolean
  dim?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  inverse?: boolean
  foreground?: string
  background?: string
}

export interface TextSelection {
  startLine: number
  startColumn: number
  endLine: number
  endColumn: number
}

export interface TerminalConfig {
  fontSize: number
  fontFamily: string
  theme: TerminalTheme
  cursorStyle: 'block' | 'underline' | 'bar'
  cursorBlink: boolean
  scrollback: number
  tabSize: number
  showLineNumbers: boolean
  enableBell: boolean
  accessibility: AccessibilityConfig
}

export interface AccessibilityConfig {
  highContrast: boolean
  reduceMotion: boolean
  screenReaderMode: boolean
  announceOutput: boolean
  largeText: boolean
}

export interface TerminalTheme {
  name: string
  background: string
  foreground: string
  cursor: string
  selection: string
  black: string
  red: string
  green: string
  yellow: string
  blue: string
  magenta: string
  cyan: string
  white: string
  brightBlack: string
  brightRed: string
  brightGreen: string
  brightYellow: string
  brightBlue: string
  brightMagenta: string
  brightCyan: string
  brightWhite: string
}

export interface VT100Command {
  sequence: string
  description: string
  handler: (params: string[]) => void
}

export interface GitStatus {
  branch: string
  ahead: number
  behind: number
  staged: number
  unstaged: number
  untracked: number
  clean: boolean
}

export interface SystemInfo {
  uptime: string
  loadAverage: [number, number, number]
  memoryUsage: {
    total: number
    used: number
    free: number
    percentage: number
  }
  processes: number
  currentTime: Date
}
