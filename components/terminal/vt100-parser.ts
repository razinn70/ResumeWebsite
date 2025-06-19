/**
 * @fileoverview VT100/VT220 Terminal Escape Sequence Handler
 * Authentic terminal control sequences for colors, cursor movement, and formatting
 */

import { TerminalLineStyle } from './types'

export class VT100Parser {
  private static readonly ESC = '\x1b'
  private static readonly CSI = '\x1b['
  
  static parseEscapeSequences(text: string): { content: string; style: TerminalLineStyle }[] {
    const segments: { content: string; style: TerminalLineStyle }[] = []
    let currentStyle: TerminalLineStyle = {}
    let position = 0
    
    while (position < text.length) {
      const escapeIndex = text.indexOf(this.ESC, position)
      
      if (escapeIndex === -1) {
        // No more escape sequences
        if (position < text.length) {
          segments.push({
            content: text.substring(position),
            style: { ...currentStyle }
          })
        }
        break
      }
      
      // Add text before escape sequence
      if (escapeIndex > position) {
        segments.push({
          content: text.substring(position, escapeIndex),
          style: { ...currentStyle }
        })
      }
      
      // Parse escape sequence
      const result = this.parseEscapeSequence(text, escapeIndex)
      if (result) {
        currentStyle = { ...currentStyle, ...result.style }
        position = result.nextPosition
      } else {
        // Invalid sequence, treat as literal text
        segments.push({
          content: text.charAt(escapeIndex),
          style: { ...currentStyle }
        })
        position = escapeIndex + 1
      }
    }
    
    return segments
  }
  
  private static parseEscapeSequence(text: string, position: number): 
    { style: Partial<TerminalLineStyle>; nextPosition: number } | null {
    
    if (position >= text.length || text[position] !== this.ESC) {
      return null
    }
    
    // Check for CSI sequence
    if (position + 1 < text.length && text[position + 1] === '[') {
      return this.parseCSISequence(text, position)
    }
    
    // Single character escape sequences
    if (position + 1 < text.length) {
      const char = text[position + 1]
      switch (char) {
        case 'c': // Reset terminal
          return {
            style: this.resetStyle(),
            nextPosition: position + 2
          }
        case 'D': // Line feed
        case 'E': // New line
        case 'M': // Reverse line feed
          return {
            style: {},
            nextPosition: position + 2
          }
      }
    }
    
    return null
  }
  
  private static parseCSISequence(text: string, position: number): 
    { style: Partial<TerminalLineStyle>; nextPosition: number } | null {
    
    let current = position + 2 // Skip ESC[
    const params: number[] = []
    let paramStr = ''
    
    // Parse parameters
    while (current < text.length) {
      const char = text[current]
      
      if (char >= '0' && char <= '9') {
        paramStr += char
      } else if (char === ';') {
        params.push(paramStr ? parseInt(paramStr) : 0)
        paramStr = ''
      } else if (char >= 'A' && char <= 'Z' || char >= 'a' && char <= 'z') {
        // Final byte - end of sequence
        if (paramStr) {
          params.push(parseInt(paramStr))
        }
        
        const style = this.handleCSICommand(char, params)
        return {
          style,
          nextPosition: current + 1
        }
      } else {
        // Invalid character in CSI sequence
        return null
      }
      
      current++
    }
    
    return null
  }
  
  private static handleCSICommand(command: string, params: number[]): Partial<TerminalLineStyle> {
    switch (command) {
      case 'm': // SGR (Select Graphic Rendition)
        return this.handleSGR(params)
      case 'J': // Erase Display
        return this.handleEraseDisplay(params)
      case 'K': // Erase Line
        return this.handleEraseLine(params)
      case 'H': // Cursor Position
      case 'f': // Horizontal and Vertical Position
        return this.handleCursorPosition(params)
      case 'A': // Cursor Up
      case 'B': // Cursor Down
      case 'C': // Cursor Forward
      case 'D': // Cursor Backward
        return this.handleCursorMovement(command, params)
      default:
        return {}
    }
  }
  
  private static handleSGR(params: number[]): Partial<TerminalLineStyle> {
    const style: Partial<TerminalLineStyle> = {}
    
    if (params.length === 0) {
      params = [0] // Default to reset
    }
    
    for (const param of params) {
      switch (param) {
        case 0: // Reset
          return this.resetStyle()
        case 1: // Bold
          style.bold = true
          break
        case 2: // Dim
          style.dim = true
          break
        case 3: // Italic
          style.italic = true
          break
        case 4: // Underline
          style.underline = true
          break
        case 7: // Inverse
          style.inverse = true
          break
        case 9: // Strikethrough
          style.strikethrough = true
          break
        case 22: // Normal intensity
          style.bold = false
          style.dim = false
          break
        case 23: // Not italic
          style.italic = false
          break
        case 24: // Not underlined
          style.underline = false
          break
        case 27: // Not inverse
          style.inverse = false
          break
        case 29: // Not strikethrough
          style.strikethrough = false
          break
        // Foreground colors
        case 30: style.foreground = 'black'; break
        case 31: style.foreground = 'red'; break
        case 32: style.foreground = 'green'; break
        case 33: style.foreground = 'yellow'; break
        case 34: style.foreground = 'blue'; break
        case 35: style.foreground = 'magenta'; break
        case 36: style.foreground = 'cyan'; break
        case 37: style.foreground = 'white'; break
        case 39: style.foreground = undefined; break // Default
        // Bright foreground colors
        case 90: style.foreground = 'brightBlack'; break
        case 91: style.foreground = 'brightRed'; break
        case 92: style.foreground = 'brightGreen'; break
        case 93: style.foreground = 'brightYellow'; break
        case 94: style.foreground = 'brightBlue'; break
        case 95: style.foreground = 'brightMagenta'; break
        case 96: style.foreground = 'brightCyan'; break
        case 97: style.foreground = 'brightWhite'; break
        // Background colors
        case 40: style.background = 'black'; break
        case 41: style.background = 'red'; break
        case 42: style.background = 'green'; break
        case 43: style.background = 'yellow'; break
        case 44: style.background = 'blue'; break
        case 45: style.background = 'magenta'; break
        case 46: style.background = 'cyan'; break
        case 47: style.background = 'white'; break
        case 49: style.background = undefined; break // Default
        // Bright background colors
        case 100: style.background = 'brightBlack'; break
        case 101: style.background = 'brightRed'; break
        case 102: style.background = 'brightGreen'; break
        case 103: style.background = 'brightYellow'; break
        case 104: style.background = 'brightBlue'; break
        case 105: style.background = 'brightMagenta'; break
        case 106: style.background = 'brightCyan'; break
        case 107: style.background = 'brightWhite'; break
      }
    }
    
    return style
  }
    private static handleEraseDisplay(_params: number[]): Partial<TerminalLineStyle> {
    // Clear screen commands don't affect text style
    return {}
  }
  
  private static handleEraseLine(_params: number[]): Partial<TerminalLineStyle> {
    // Clear line commands don't affect text style
    return {}
  }
    private static handleCursorPosition(_params: number[]): Partial<TerminalLineStyle> {
    // Cursor positioning doesn't affect text style
    return {}
  }
  
  private static handleCursorMovement(_command: string, _params: number[]): Partial<TerminalLineStyle> {
    // Cursor movement doesn't affect text style
    return {}
  }
  
  private static resetStyle(): TerminalLineStyle {
    return {
      bold: false,
      dim: false,
      italic: false,
      underline: false,
      strikethrough: false,
      inverse: false,
      foreground: undefined,
      background: undefined
    }
  }
  
  // Generate escape sequences
  static generateColorSequence(color: string, bright: boolean = false): string {
    const colorMap: Record<string, number> = {
      black: 30,
      red: 31,
      green: 32,
      yellow: 33,
      blue: 34,
      magenta: 35,
      cyan: 36,
      white: 37
    }
    
    const code = colorMap[color.toLowerCase()]
    if (code !== undefined) {
      return `${this.CSI}${bright ? code + 60 : code}m`
    }
    
    return ''
  }
  
  static generateBackgroundColorSequence(color: string, bright: boolean = false): string {
    const colorMap: Record<string, number> = {
      black: 40,
      red: 41,
      green: 42,
      yellow: 43,
      blue: 44,
      magenta: 45,
      cyan: 46,
      white: 47
    }
    
    const code = colorMap[color.toLowerCase()]
    if (code !== undefined) {
      return `${this.CSI}${bright ? code + 60 : code}m`
    }
    
    return ''
  }
  
  static generateStyleSequence(style: Partial<TerminalLineStyle>): string {
    const codes: number[] = []
    
    if (style.bold) codes.push(1)
    if (style.dim) codes.push(2)
    if (style.italic) codes.push(3)
    if (style.underline) codes.push(4)
    if (style.inverse) codes.push(7)
    if (style.strikethrough) codes.push(9)
    
    if (style.foreground) {
      const colorCode = this.getColorCode(style.foreground, false)
      if (colorCode) codes.push(colorCode)
    }
    
    if (style.background) {
      const colorCode = this.getColorCode(style.background, true)
      if (colorCode) codes.push(colorCode)
    }
    
    return codes.length > 0 ? `${this.CSI}${codes.join(';')}m` : ''
  }
  
  private static getColorCode(color: string, background: boolean): number | null {
    const colorMap: Record<string, number> = {
      black: background ? 40 : 30,
      red: background ? 41 : 31,
      green: background ? 42 : 32,
      yellow: background ? 43 : 33,
      blue: background ? 44 : 34,
      magenta: background ? 45 : 35,
      cyan: background ? 46 : 36,
      white: background ? 47 : 37,
      brightBlack: background ? 100 : 90,
      brightRed: background ? 101 : 91,
      brightGreen: background ? 102 : 92,
      brightYellow: background ? 103 : 93,
      brightBlue: background ? 104 : 94,
      brightMagenta: background ? 105 : 95,
      brightCyan: background ? 106 : 96,
      brightWhite: background ? 107 : 97
    }
    
    return colorMap[color] || null
  }
  
  static reset(): string {
    return `${this.CSI}0m`
  }
  
  static clearScreen(): string {
    return `${this.CSI}2J${this.CSI}H`
  }
  
  static clearLine(): string {
    return `${this.CSI}2K`
  }
  
  static moveCursor(row: number, col: number): string {
    return `${this.CSI}${row};${col}H`
  }
  
  static saveCursor(): string {
    return `${this.ESC}7`
  }
  
  static restoreCursor(): string {
    return `${this.ESC}8`
  }
}
