/**
 * @fileoverview Terminal Component Exports
 * Ultra-authentic terminal interface with complete UNIX emulation
 */

export { UltraTerminal as default } from './ultra-terminal'
export { UltraTerminal } from './ultra-terminal'
export { CommandRegistry } from './commands'
export { FileSystemSimulator } from './file-system'
export { VT100Parser } from './vt100-parser'
export type * from './types'

// Import styles
import './terminal.css'
