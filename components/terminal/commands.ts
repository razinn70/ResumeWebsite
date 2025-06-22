/**
 * @fileoverview Terminal Commands Implementation
 * Complete UNIX command set with authentic behavior and output
 */

import { TerminalCommand, CommandResult, TerminalContext, SystemInfo } from './types'
import { FileSystemSimulator } from './file-system'

export class CommandRegistry {
  private commands: Map<string, TerminalCommand> = new Map()
  private aliases: Map<string, string> = new Map()
  private fileSystem: FileSystemSimulator

  constructor(fileSystem: FileSystemSimulator) {
    this.fileSystem = fileSystem
    this.registerCommands()
    this.registerAliases()
  }

  private registerCommands() {
    // Core navigation commands
    this.registerCommand({
      name: 'ls',
      description: 'List directory contents',
      usage: 'ls [OPTION]... [FILE]...',
      options: [
        { flag: '-l', description: 'Use long listing format' },
        { flag: '-a', description: 'Show hidden files' },
        { flag: '-h', description: 'Human readable sizes' },
        { flag: '-t', description: 'Sort by modification time' },
        { flag: '-r', description: 'Reverse order' }
      ],
      execute: this.lsCommand.bind(this)
    })

    this.registerCommand({
      name: 'cd',
      description: 'Change directory',
      usage: 'cd [DIRECTORY]',
      execute: this.cdCommand.bind(this)
    })

    this.registerCommand({
      name: 'pwd',
      description: 'Print working directory',
      usage: 'pwd',
      execute: this.pwdCommand.bind(this)
    })

    // File operations
    this.registerCommand({
      name: 'cat',
      description: 'Display file contents',
      usage: 'cat [FILE]...',
      execute: this.catCommand.bind(this)
    })

    this.registerCommand({
      name: 'less',
      description: 'View file contents page by page',
      usage: 'less [FILE]',
      execute: this.lessCommand.bind(this)
    })

    this.registerCommand({
      name: 'head',
      description: 'Display first lines of file',
      usage: 'head [-n NUM] [FILE]',
      options: [
        { flag: '-n', description: 'Number of lines to show', requiresValue: true }
      ],
      execute: this.headCommand.bind(this)
    })

    this.registerCommand({
      name: 'tail',
      description: 'Display last lines of file',
      usage: 'tail [-n NUM] [-f] [FILE]',
      options: [
        { flag: '-n', description: 'Number of lines to show', requiresValue: true },
        { flag: '-f', description: 'Follow file changes' }
      ],
      execute: this.tailCommand.bind(this)
    })

    this.registerCommand({
      name: 'touch',
      description: 'Create empty file or update timestamp',
      usage: 'touch [FILE]...',
      execute: this.touchCommand.bind(this)
    })

    this.registerCommand({
      name: 'mkdir',
      description: 'Create directories',
      usage: 'mkdir [OPTION]... DIRECTORY...',
      options: [
        { flag: '-p', description: 'Create parent directories as needed' }
      ],
      execute: this.mkdirCommand.bind(this)
    })

    this.registerCommand({
      name: 'rm',
      description: 'Remove files and directories',
      usage: 'rm [OPTION]... FILE...',
      options: [
        { flag: '-r', description: 'Remove directories recursively' },
        { flag: '-f', description: 'Force removal without prompts' }
      ],
      execute: this.rmCommand.bind(this)
    })

    // Text processing
    this.registerCommand({
      name: 'grep',
      description: 'Search text patterns',
      usage: 'grep [OPTION]... PATTERN [FILE]...',
      options: [
        { flag: '-i', description: 'Case insensitive search' },
        { flag: '-n', description: 'Show line numbers' },
        { flag: '-r', description: 'Recursive search' },
        { flag: '-v', description: 'Invert match' }
      ],
      execute: this.grepCommand.bind(this)
    })

    this.registerCommand({
      name: 'wc',
      description: 'Word, line, character, and byte count',
      usage: 'wc [OPTION]... [FILE]...',
      options: [
        { flag: '-l', description: 'Count lines' },
        { flag: '-w', description: 'Count words' },
        { flag: '-c', description: 'Count bytes' }
      ],
      execute: this.wcCommand.bind(this)
    })

    // System information
    this.registerCommand({
      name: 'ps',
      description: 'Display running processes',
      usage: 'ps [OPTION]...',
      options: [
        { flag: '-aux', description: 'Show all processes with details' },
        { flag: '-ef', description: 'Full format listing' }
      ],
      execute: this.psCommand.bind(this)
    })

    this.registerCommand({
      name: 'top',
      description: 'Display system processes in real-time',
      usage: 'top',
      execute: this.topCommand.bind(this)
    })

    this.registerCommand({
      name: 'df',
      description: 'Display filesystem disk space usage',
      usage: 'df [OPTION]... [FILE]...',
      options: [
        { flag: '-h', description: 'Human readable format' }
      ],
      execute: this.dfCommand.bind(this)
    })

    this.registerCommand({
      name: 'free',
      description: 'Display memory usage',
      usage: 'free [-h]',
      options: [
        { flag: '-h', description: 'Human readable format' }
      ],
      execute: this.freeCommand.bind(this)
    })

    this.registerCommand({
      name: 'uptime',
      description: 'Show system uptime and load',
      usage: 'uptime',
      execute: this.uptimeCommand.bind(this)
    })

    // Git commands
    this.registerCommand({
      name: 'git',
      description: 'Git version control system',
      usage: 'git [COMMAND] [OPTIONS]',
      execute: this.gitCommand.bind(this)
    })

    // Developer tools
    this.registerCommand({
      name: 'node',
      description: 'Node.js JavaScript runtime',
      usage: 'node [OPTIONS] [SCRIPT]',
      execute: this.nodeCommand.bind(this)
    })

    this.registerCommand({
      name: 'npm',
      description: 'Node Package Manager',
      usage: 'npm [COMMAND] [OPTIONS]',
      execute: this.npmCommand.bind(this)
    })

    // Network tools
    this.registerCommand({
      name: 'ping',
      description: 'Send ICMP echo requests',
      usage: 'ping [OPTIONS] HOST',
      options: [
        { flag: '-c', description: 'Count of packets to send', requiresValue: true }
      ],
      execute: this.pingCommand.bind(this)
    })

    this.registerCommand({
      name: 'curl',
      description: 'Transfer data from servers',
      usage: 'curl [OPTIONS] URL',
      execute: this.curlCommand.bind(this)
    })

    // Terminal utilities
    this.registerCommand({
      name: 'clear',
      description: 'Clear terminal screen',
      usage: 'clear',
      execute: this.clearCommand
    })

    this.registerCommand({
      name: 'history',
      description: 'Show command history',
      usage: 'history [n]',
      execute: this.historyCommand.bind(this)
    })

    this.registerCommand({
      name: 'echo',
      description: 'Display text',
      usage: 'echo [TEXT]...',
      execute: this.echoCommand.bind(this)
    })

    this.registerCommand({
      name: 'export',
      description: 'Set environment variables',
      usage: 'export [VAR=VALUE]...',
      execute: this.exportCommand.bind(this)
    })

    this.registerCommand({
      name: 'env',
      description: 'Display environment variables',
      usage: 'env',
      execute: this.envCommand.bind(this)
    })

    this.registerCommand({
      name: 'which',
      description: 'Locate command',
      usage: 'which COMMAND',
      execute: this.whichCommand.bind(this)
    })

    this.registerCommand({
      name: 'man',
      description: 'Display manual pages',
      usage: 'man [SECTION] PAGE',
      execute: this.manCommand.bind(this)
    })

    // Job control
    this.registerCommand({
      name: 'jobs',
      description: 'List background jobs',
      usage: 'jobs',
      execute: this.jobsCommand.bind(this)
    })

    this.registerCommand({
      name: 'bg',
      description: 'Put job in background',
      usage: 'bg [JOB]',
      execute: this.bgCommand.bind(this)
    })

    this.registerCommand({
      name: 'fg',
      description: 'Bring job to foreground',
      usage: 'fg [JOB]',
      execute: this.fgCommand.bind(this)
    })

    this.registerCommand({
      name: 'kill',
      description: 'Terminate processes',
      usage: 'kill [-SIGNAL] PID...',
      execute: this.killCommand.bind(this)
    })

    // Portfolio-specific commands
    this.registerCommand({
      name: 'portfolio',
      description: 'Portfolio management commands',
      usage: 'portfolio [COMMAND]',
      execute: this.portfolioCommand.bind(this)
    })

    this.registerCommand({
      name: 'skills',
      description: 'Display technical skills',
      usage: 'skills [CATEGORY]',
      execute: this.skillsCommand.bind(this)
    })

    this.registerCommand({
      name: 'projects',
      description: 'List projects',
      usage: 'projects [FILTER]',
      execute: this.projectsCommand.bind(this)
    })

    this.registerCommand({
      name: 'contact',
      description: 'Display contact information',
      usage: 'contact',
      execute: this.contactCommand.bind(this)
    })
  }

  private registerAliases() {
    this.setAlias('ll', 'ls -l')
    this.setAlias('la', 'ls -la')
    this.setAlias('l', 'ls')
    this.setAlias('..', 'cd ..')
    this.setAlias('...', 'cd ../..')
    this.setAlias('~', 'cd ~')
  }

  private registerCommand(command: TerminalCommand) {
    this.commands.set(command.name, command)
    if (command.aliases) {
      command.aliases.forEach(alias => {
        this.setAlias(alias, command.name)
      })
    }
  }

  private setAlias(alias: string, command: string) {
    this.aliases.set(alias, command)
  }
  getCommand(name: string): TerminalCommand | undefined {
    const aliasedCommand = this.aliases.get(name)
    if (aliasedCommand) {
      name = aliasedCommand.split(' ')[0] || ''
    }
    return this.commands.get(name)
  }

  getAllCommands(): TerminalCommand[] {
    return Array.from(this.commands.values())
  }

  getTabCompletions(partial: string, context: TerminalContext): string[] {
    const completions: string[] = []
    
    // Command completions
    for (const [name] of this.commands) {
      if (name.startsWith(partial)) {
        completions.push(name)
      }
    }
    
    // File/directory completions
    const parts = partial.split('/')
    const lastPart = parts[parts.length - 1]
    const dirPath = parts.length > 1 ? parts.slice(0, -1).join('/') : '.'
    
    const resolvedPath = this.fileSystem.resolvePath(dirPath, context.currentDirectory)
    const files = this.fileSystem.listDirectory(resolvedPath)
    
    if (files) {
      for (const file of files) {
        if (file.name.startsWith(lastPart)) {
          const completion = parts.length > 1 
            ? parts.slice(0, -1).join('/') + '/' + file.name
            : file.name
          completions.push(completion + (file.type === 'directory' ? '/' : ''))
        }
      }
    }
    
    return completions.sort()
  }

  // Command implementations
  private async lsCommand(args: string[], context: TerminalContext): Promise<CommandResult> {
    const flags = args.filter(arg => arg.startsWith('-'))
    const paths = args.filter(arg => !arg.startsWith('-'))
    
    const longFormat = flags.includes('-l')
    const showHidden = flags.includes('-a')
    const humanReadable = flags.includes('-h')
    const sortByTime = flags.includes('-t')
    const reverse = flags.includes('-r')
    
    const targetPath = paths[0] || context.currentDirectory
    const resolvedPath = this.fileSystem.resolvePath(targetPath, context.currentDirectory)
    
    if (!this.fileSystem.exists(resolvedPath)) {
      return {
        output: [`ls: cannot access '${targetPath}': No such file or directory`],
        exitCode: 2,
        error: 'File not found'
      }
    }
    
    if (this.fileSystem.isFile(resolvedPath)) {
      const node = this.fileSystem.getNode(resolvedPath)!
      if (longFormat) {
        const size = humanReadable ? this.fileSystem.formatSize(node.size) : node.size.toString()
        const date = this.fileSystem.formatDate(node.modified)
        return {
          output: [`${node.permissions} 1 ${node.owner} ${node.group} ${size.padStart(8)} ${date} ${node.name}`],
          exitCode: 0
        }
      } else {
        return {
          output: [node.name],
          exitCode: 0
        }
      }
    }
    
    let files = this.fileSystem.listDirectory(resolvedPath)!
    
    if (!showHidden) {
      files = files.filter(file => !file.name.startsWith('.'))
    }
    
    if (sortByTime) {
      files.sort((a, b) => b.modified.getTime() - a.modified.getTime())
    } else {
      files.sort((a, b) => a.name.localeCompare(b.name))
    }
    
    if (reverse) {
      files.reverse()
    }
    
    if (longFormat) {
      // let totalBlocks = 0 // TODO: Implement block counting
      const output = [`total ${Math.ceil(files.reduce((sum, f) => sum + f.size, 0) / 1024)}`]
      
      for (const file of files) {
        const size = humanReadable ? this.fileSystem.formatSize(file.size) : file.size.toString()
        const date = this.fileSystem.formatDate(file.modified)
        const linkCount = file.type === 'directory' ? '2' : '1'
        output.push(`${file.permissions} ${linkCount} ${file.owner} ${file.group} ${size.padStart(8)} ${date} ${file.name}`)
      }
      
      return { output, exitCode: 0 }
    } else {
      const names = files.map(f => f.name + (f.type === 'directory' ? '/' : ''))
      const columns = Math.max(1, Math.floor(80 / 20)) // Assume 80 char width, 20 char columns
      const output: string[] = []
      
      for (let i = 0; i < names.length; i += columns) {
        const row = names.slice(i, i + columns)
        output.push(row.map(name => name.padEnd(20)).join('').trimEnd())
      }
      
      return { output, exitCode: 0 }
    }
  }

  private async cdCommand(args: string[], context: TerminalContext): Promise<CommandResult> {
    const targetPath = args[0] || '/home/' + context.user
    const resolvedPath = this.fileSystem.resolvePath(targetPath, context.currentDirectory)
    
    if (!this.fileSystem.exists(resolvedPath)) {
      return {
        output: [`cd: ${targetPath}: No such file or directory`],
        exitCode: 1,
        error: 'Directory not found'
      }
    }
    
    if (!this.fileSystem.isDirectory(resolvedPath)) {
      return {
        output: [`cd: ${targetPath}: Not a directory`],
        exitCode: 1,
        error: 'Not a directory'
      }
    }
      context.currentDirectory = resolvedPath
    context.environment['PWD'] = resolvedPath
    
    return { output: [], exitCode: 0 }
  }

  private async pwdCommand(args: string[], context: TerminalContext): Promise<CommandResult> {
    return {
      output: [context.currentDirectory],
      exitCode: 0
    }
  }

  private async catCommand(args: string[], context: TerminalContext): Promise<CommandResult> {
    if (args.length === 0) {
      return {
        output: ['cat: missing file operand'],
        exitCode: 1,
        error: 'Missing operand'
      }
    }
    
    const output: string[] = []
    
    for (const arg of args) {
      const resolvedPath = this.fileSystem.resolvePath(arg, context.currentDirectory)
      
      if (!this.fileSystem.exists(resolvedPath)) {
        output.push(`cat: ${arg}: No such file or directory`)
        continue
      }
      
      if (!this.fileSystem.isFile(resolvedPath)) {
        output.push(`cat: ${arg}: Is a directory`)
        continue
      }
      
      const content = this.fileSystem.readFile(resolvedPath)
      if (content !== null) {
        output.push(...content.split('\n'))
      }
    }
    
    return { output, exitCode: 0 }
  }  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async clearCommand(_args: string[], _context: TerminalContext): Promise<CommandResult> {
    return {
      output: ['\x1b[2J\x1b[H'], // VT100 clear screen and move cursor to home
      exitCode: 0
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async echoCommand(args: string[], _context: TerminalContext): Promise<CommandResult> {
    return {
      output: [args.join(' ')],
      exitCode: 0
    }
  }

  private async historyCommand(args: string[], context: TerminalContext): Promise<CommandResult> {
    const count = args[0] ? parseInt(args[0]) : context.history.length
    const start = Math.max(0, context.history.length - count)
    
    const output = context.history
      .slice(start)
      .map((cmd, index) => `${(start + index + 1).toString().padStart(5)} ${cmd}`)
    
    return { output, exitCode: 0 }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async skillsCommand(args: string[], _context: TerminalContext): Promise<CommandResult> {
    const category = args[0]?.toLowerCase()
    
    const skills = {
      frontend: ['React', 'Next.js', 'TypeScript', 'Three.js', 'Framer Motion', 'Tailwind CSS'],
      backend: ['Node.js', 'Python', 'Express', 'FastAPI', 'PostgreSQL', 'MongoDB'],
      tools: ['Git', 'Docker', 'AWS', 'Vercel', 'Figma', 'VS Code'],
      languages: ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'SQL']
    }
    
    if (category && skills[category as keyof typeof skills]) {
      return {
        output: [
          `${category.toUpperCase()} SKILLS:`,
          '=' + '='.repeat(category.length + 7),
          ...skills[category as keyof typeof skills].map(skill => `• ${skill}`)
        ],
        exitCode: 0
      }
    }
    
    const output = [
      'TECHNICAL SKILLS OVERVIEW',
      '========================',
      ''
    ]
    
    Object.entries(skills).forEach(([cat, skillList]) => {
      output.push(`${cat.toUpperCase()}:`)
      output.push(...skillList.map(skill => `  • ${skill}`))
      output.push('')
    })
    
    return { output, exitCode: 0 }
  }
  // Additional command implementations
  private async lessCommand(args: string[], context: TerminalContext): Promise<CommandResult> {
    if (args.length === 0) {
      return { output: ['less: missing file operand'], exitCode: 1 }
    }
    
    const content = this.fileSystem.readFile(this.fileSystem.resolvePath(args[0], context.currentDirectory))
    if (!content) {
      return { output: [`less: ${args[0]}: No such file or directory`], exitCode: 1 }
    }
    
    const lines = content.split('\n')
    return { output: lines.slice(0, 25).concat(['-- More --']), exitCode: 0 }
  }

  private async headCommand(args: string[], context: TerminalContext): Promise<CommandResult> {
    const numLines = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10
    const file = args.find(arg => !arg.startsWith('-') && arg !== args[args.indexOf('-n') + 1])
    
    if (!file) {
      return { output: ['head: missing file operand'], exitCode: 1 }
    }
    
    const content = this.fileSystem.readFile(this.fileSystem.resolvePath(file, context.currentDirectory))
    if (!content) {
      return { output: [`head: ${file}: No such file or directory`], exitCode: 1 }
    }
    
    return { output: content.split('\n').slice(0, numLines), exitCode: 0 }
  }

  private async tailCommand(args: string[], context: TerminalContext): Promise<CommandResult> {
    const numLines = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10
    const file = args.find(arg => !arg.startsWith('-') && arg !== args[args.indexOf('-n') + 1])
    
    if (!file) {
      return { output: ['tail: missing file operand'], exitCode: 1 }
    }
    
    const content = this.fileSystem.readFile(this.fileSystem.resolvePath(file, context.currentDirectory))
    if (!content) {
      return { output: [`tail: ${file}: No such file or directory`], exitCode: 1 }
    }
    
    const lines = content.split('\n')
    return { output: lines.slice(-numLines), exitCode: 0 }
  }

  private async touchCommand(args: string[], context: TerminalContext): Promise<CommandResult> {
    if (args.length === 0) {
      return { output: ['touch: missing file operand'], exitCode: 1 }
    }
    
    for (const file of args) {
      const path = this.fileSystem.resolvePath(file, context.currentDirectory)
      if (!this.fileSystem.exists(path)) {
        this.fileSystem.writeFile(path, '', context)
      }
    }
    
    return { output: [], exitCode: 0 }
  }

  private async mkdirCommand(args: string[], context: TerminalContext): Promise<CommandResult> {
    if (args.length === 0) {
      return { output: ['mkdir: missing operand'], exitCode: 1 }
    }
    
    // const createParents = args.includes('-p') // TODO: Implement parent directory creation
    const dirs = args.filter(arg => !arg.startsWith('-'))
    
    for (const dir of dirs) {
      const path = this.fileSystem.resolvePath(dir, context.currentDirectory)
      if (!this.fileSystem.createDirectory(path, context)) {
        return { output: [`mkdir: cannot create directory '${dir}': File exists or parent directory missing`], exitCode: 1 }
      }
    }
    
    return { output: [], exitCode: 0 }
  }

  private async rmCommand(args: string[], context: TerminalContext): Promise<CommandResult> {
    if (args.length === 0) {
      return { output: ['rm: missing operand'], exitCode: 1 }
    }
    
    const files = args.filter(arg => !arg.startsWith('-'))
    
    for (const file of files) {
      const path = this.fileSystem.resolvePath(file, context.currentDirectory)
      if (!this.fileSystem.deleteFile(path)) {
        return { output: [`rm: cannot remove '${file}': No such file or directory`], exitCode: 1 }
      }
    }
    
    return { output: [], exitCode: 0 }
  }

  private async grepCommand(args: string[], context: TerminalContext): Promise<CommandResult> {
    if (args.length < 2) {
      return { output: ['grep: missing pattern or file'], exitCode: 1 }
    }
    
    const pattern = args[0]
    const file = args[1]
    const content = this.fileSystem.readFile(this.fileSystem.resolvePath(file, context.currentDirectory))
    
    if (!content) {
      return { output: [`grep: ${file}: No such file or directory`], exitCode: 1 }
    }
    
    const matches = content.split('\n').filter(line => line.includes(pattern))
    return { output: matches, exitCode: matches.length > 0 ? 0 : 1 }
  }

  private async wcCommand(args: string[], context: TerminalContext): Promise<CommandResult> {
    const file = args.find(arg => !arg.startsWith('-'))
    if (!file) {
      return { output: ['wc: missing file operand'], exitCode: 1 }
    }
    
    const content = this.fileSystem.readFile(this.fileSystem.resolvePath(file, context.currentDirectory))
    if (!content) {
      return { output: [`wc: ${file}: No such file or directory`], exitCode: 1 }
    }
    
    const lines = content.split('\n').length
    const words = content.split(/\s+/).length
    const chars = content.length
    
    return { output: [`${lines} ${words} ${chars} ${file}`], exitCode: 0 }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async psCommand(_args: string[], _context: TerminalContext): Promise<CommandResult> {
    const processes = [
      'PID TTY          TIME CMD',
      '1234 pts/0    00:00:01 bash',
      '5678 pts/0    00:00:00 portfolio',
      '9012 pts/0    00:00:00 ps'
    ]
    return { output: processes, exitCode: 0 }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async topCommand(_args: string[], _context: TerminalContext): Promise<CommandResult> {
    const systemInfo = this.getSystemInfo()
    return {
      output: [
        `top - ${new Date().toLocaleTimeString()} up ${systemInfo.uptime}, 1 user, load average: ${systemInfo.loadAverage.join(', ')}`,
        'Tasks: 3 total, 1 running, 2 sleeping, 0 stopped, 0 zombie',
        `%Cpu(s): 5.0 us, 2.0 sy, 0.0 ni, 93.0 id, 0.0 wa, 0.0 hi, 0.0 si, 0.0 st`,
        `MiB Mem : ${systemInfo.memoryUsage.total} total, ${systemInfo.memoryUsage.free} free, ${systemInfo.memoryUsage.used} used`,
        '',
        'PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND',
        '1234 rajin     20   0  123456  12345   1234 S   2.0   1.5   0:01.23 portfolio',
        '5678 rajin     20   0   54321   5432    543 S   0.5   0.8   0:00.45 node',
        '9012 rajin     20   0   12345   1234    123 R   0.1   0.2   0:00.01 top'
      ],
      exitCode: 0
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async dfCommand(args: string[], _context: TerminalContext): Promise<CommandResult> {
    const humanReadable = args.includes('-h')
    const header = 'Filesystem      Size  Used Avail Use% Mounted on'
    const filesystem = humanReadable 
      ? '/dev/sda1        20G  8.5G   11G  45% /'
      : '/dev/sda1    20971520 8912896 11534336  45% /'
    
    return { output: [header, filesystem], exitCode: 0 }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async freeCommand(args: string[], _context: TerminalContext): Promise<CommandResult> {
    const humanReadable = args.includes('-h')
    const systemInfo = this.getSystemInfo()
    
    if (humanReadable) {
      return {
        output: [
          '              total        used        free      shared  buff/cache   available',
          `Mem:           ${this.formatBytes(systemInfo.memoryUsage.total)}        ${this.formatBytes(systemInfo.memoryUsage.used)}        ${this.formatBytes(systemInfo.memoryUsage.free)}         0B        512M        ${this.formatBytes(systemInfo.memoryUsage.free)}`,
          'Swap:            0B          0B          0B'
        ],
        exitCode: 0
      }
    }
    
    return {
      output: [
        '              total        used        free      shared  buff/cache   available',
        `Mem:        ${systemInfo.memoryUsage.total}     ${systemInfo.memoryUsage.used}     ${systemInfo.memoryUsage.free}           0      524288     ${systemInfo.memoryUsage.free}`,
        'Swap:             0           0           0'
      ],
      exitCode: 0
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async uptimeCommand(_args: string[], _context: TerminalContext): Promise<CommandResult> {
    const systemInfo = this.getSystemInfo()
    return {
      output: [`${new Date().toLocaleTimeString()} up ${systemInfo.uptime}, 1 user, load average: ${systemInfo.loadAverage.join(', ')}`],
      exitCode: 0
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async gitCommand(args: string[], _context: TerminalContext): Promise<CommandResult> {
    if (args.length === 0) {
      return { output: ['usage: git [--version] [--help] [-C <path>] [-c <name>=<value>] [<command> [<args>]]'], exitCode: 0 }
    }
    
    const subcommand = args[0]
    
    switch (subcommand) {
      case 'status':
        return {
          output: [
            'On branch main',
            'Your branch is up to date with \'origin/main\'.',
            '',
            'Changes not staged for commit:',
            '  (use "git add <file>..." to update what will be committed)',
            '  (use "git restore <file>..." to discard changes in working directory)',
            '\tmodified:   components/terminal.tsx',
            '',
            'no changes added to commit (use "git add" or "git commit -a")'
          ],
          exitCode: 0
        }
      case 'log':
        return {
          output: [
            'commit a1b2c3d4e5f6789012345678901234567890abcd (HEAD -> main, origin/main)',
            'Author: Rajin Uddin <rajin.uddin@example.com>',
            'Date:   Wed Jun 19 10:30:00 2025 +0000',
            '',
            '    Add ultra-authentic terminal interface',
            '',
            'commit 9876543210fedcba0987654321098765432109876',
            'Author: Rajin Uddin <rajin.uddin@example.com>',
            'Date:   Tue Jun 18 15:45:00 2025 +0000',
            '',
            '    Initial commit with CRT monitor component'
          ],
          exitCode: 0
        }
      default:
        return { output: [`git: '${subcommand}' is not a git command. See 'git --help'.`], exitCode: 1 }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async nodeCommand(args: string[], _context: TerminalContext): Promise<CommandResult> {
    if (args.includes('--version') || args.includes('-v')) {
      return { output: ['v18.17.0'], exitCode: 0 }
    }
    
    return { output: ['Welcome to Node.js v18.17.0.', 'Type ".help" for more information.'], exitCode: 0 }  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async npmCommand(args: string[], _context: TerminalContext): Promise<CommandResult> {
    if (args.includes('--version') || args.includes('-v')) {
      return { output: ['9.6.7'], exitCode: 0 }
    }
    
    if (args[0] === 'list' || args[0] === 'ls') {
      return {
        output: [
          'portfolio-site@1.0.0 /home/rajin/projects/portfolio-site',
          '├── next@15.3.3',
          '├── react@19.1.0',
          '├── three@0.177.0',
          '└── framer-motion@12.18.1'
        ],
        exitCode: 0
      }
    }
    
    return { output: ['Usage: npm <command>', '', 'where <command> is one of:', '    install, list, version, ...'], exitCode: 0 }  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async pingCommand(args: string[], _context: TerminalContext): Promise<CommandResult> {
    const host = args.find(arg => !arg.startsWith('-')) || 'localhost'
    const count = args.includes('-c') ? parseInt(args[args.indexOf('-c') + 1]) || 4 : 4
    
    const output = [`PING ${host} (127.0.0.1): 56 data bytes`]
    
    for (let i = 1; i <= count; i++) {
      const time = (Math.random() * 5 + 0.1).toFixed(3)
      output.push(`64 bytes from 127.0.0.1: icmp_seq=${i} ttl=64 time=${time} ms`)
    }
    
    output.push('', `--- ${host} ping statistics ---`)
    output.push(`${count} packets transmitted, ${count} received, 0% packet loss`)
    
    return { output, exitCode: 0 }  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async curlCommand(args: string[], _context: TerminalContext): Promise<CommandResult> {
    const url = args[0]
    if (!url) {
      return { output: ['curl: try \'curl --help\' for more information'], exitCode: 2 }
    }
    
    return {
      output: [
        '<!DOCTYPE html>',
        '<html>',
        '<head><title>Mock Response</title></head>',
        '<body><h1>Hello from ' + url + '</h1></body>',
        '</html>'
      ],
      exitCode: 0
    }
  }

  private async exportCommand(args: string[], context: TerminalContext): Promise<CommandResult> {
    for (const arg of args) {
      const [key, value] = arg.split('=')
      if (key && value) {
        context.environment[key] = value
      }
    }
    return { output: [], exitCode: 0 }
  }

  private async envCommand(args: string[], context: TerminalContext): Promise<CommandResult> {
    const output = Object.entries(context.environment).map(([key, value]) => `${key}=${value}`)
    return { output, exitCode: 0 }
  }

  private async whichCommand(args: string[], _context: TerminalContext): Promise<CommandResult> {
    const command = args[0]
    if (!command) {
      return { output: ['which: missing argument'], exitCode: 1 }
    }
    
    const paths = ['/usr/bin', '/bin', '/usr/local/bin']
    const foundPath = paths.find(path => this.fileSystem.exists(`${path}/${command}`))
    
    if (foundPath) {
      return { output: [`${foundPath}/${command}`], exitCode: 0 }
    }
    
    return { output: [], exitCode: 1 }
  }

  private async manCommand(args: string[], _context: TerminalContext): Promise<CommandResult> {
    const page = args[0]
    if (!page) {
      return { output: ['What manual page do you want?'], exitCode: 1 }
    }
    
    const command = this.getCommand(page)
    if (command) {
      return {
        output: [
          `${page.toUpperCase()}(1)                    User Commands                    ${page.toUpperCase()}(1)`,
          '',
          'NAME',
          `       ${page} - ${command.description}`,
          '',
          'SYNOPSIS',
          `       ${command.usage}`,
          '',
          'DESCRIPTION',
          `       ${command.description}`,
          '',
          ...(command.options ? [
            'OPTIONS',
            ...command.options.map(opt => `       ${opt.flag}  ${opt.description}`)
          ] : [])
        ],
        exitCode: 0
      }
    }
    
    return { output: [`No manual entry for ${page}`], exitCode: 1 }
  }

  private async jobsCommand(args: string[], context: TerminalContext): Promise<CommandResult> {
    const output = context.processes.map((proc, index) => 
      `[${index + 1}]+ ${proc.status.padEnd(10)} ${proc.command}`
    )
    return { output, exitCode: 0 }
  }
  private async bgCommand(_args: string[], _context: TerminalContext): Promise<CommandResult> {
    return { output: ['bg: no current job'], exitCode: 1 }
  }

  private async fgCommand(_args: string[], _context: TerminalContext): Promise<CommandResult> {
    return { output: ['fg: no current job'], exitCode: 1 }
  }

  private async killCommand(args: string[], context: TerminalContext): Promise<CommandResult> {
    const pid = parseInt(args[0])
    if (!pid) {
      return { output: ['kill: usage: kill [-s sigspec | -signum] pid ...'], exitCode: 1 }
    }
    
    const processIndex = context.processes.findIndex(p => p.pid === pid)
    if (processIndex >= 0) {
      context.processes.splice(processIndex, 1)
      return { output: [], exitCode: 0 }
    }
    
    return { output: [`kill: (${pid}): No such process`], exitCode: 1 }
  }

  private async portfolioCommand(args: string[], _context: TerminalContext): Promise<CommandResult> {
    return {
      output: [
        'PORTFOLIO MANAGEMENT SYSTEM',
        '===========================',
        '',
        'Available commands:',
        '  portfolio skills    - Display technical skills',
        '  portfolio projects  - List all projects',
        '  portfolio contact   - Show contact information',
        '  portfolio about     - Personal information',
        '',
        'Navigate to specific sections:',
        '  cd ~/projects       - View project files',
        '  cat ~/documents/resume.pdf  - View resume',
        '  ls -la              - List all files'
      ],
      exitCode: 0
    }
  }

  private async projectsCommand(_args: string[], _context: TerminalContext): Promise<CommandResult> {
    return {
      output: [
        'PROJECT PORTFOLIO',
        '=================',
        '',
        '1. TERMINAL PORTFOLIO (2025)',
        '   Tech: Next.js, React 19, Three.js, TypeScript',
        '   Status: Production | URL: rajinuddin.dev',
        '',
        '2. E-COMMERCE PLATFORM (2024)',
        '   Tech: MERN Stack, Stripe, AWS',
        '   Status: Production | Users: 1000+',
        '',
        '3. MACHINE LEARNING DASHBOARD (2024)',
        '   Tech: Python, FastAPI, D3.js, TensorFlow',
        '   Status: Beta | Accuracy: 94.2%',
        '',
        '4. MOBILE TASK APP (2023)',
        '   Tech: React Native, Node.js, MongoDB',
        '   Status: Live | Downloads: 5K+',
        '',
        'Use: cd ~/projects/[project-name] for source code'
      ],
      exitCode: 0
    }
  }

  private async contactCommand(_args: string[], _context: TerminalContext): Promise<CommandResult> {
    return {
      output: [
        'CONTACT INFORMATION',
        '==================',
        '',
        'Name: Rajin Uddin',
        'Email: rajin.uddin@example.com',
        'LinkedIn: linkedin.com/in/rajinuddin',
        'GitHub: github.com/rajinuddin',
        'Website: rajinuddin.dev',
        '',
        'Available for:',
        '• Full-time opportunities',
        '• Freelance projects',
        '• Technical consultations',
        '• Open source collaboration'      ],
      exitCode: 0
    }
  }

  // Helper methods
  private getSystemInfo(): SystemInfo {
    return {
      uptime: '2 days, 3:45',
      loadAverage: [0.15, 0.25, 0.18],
      memoryUsage: {
        total: 8192000,
        used: 3686400,
        free: 4505600,
        percentage: 45
      },
      processes: 127,
      currentTime: new Date()
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes < 1024) return bytes + 'B'
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + 'K'
    if (bytes < 1024 * 1024 * 1024) return Math.round(bytes / (1024 * 1024)) + 'M'
    return Math.round(bytes / (1024 * 1024 * 1024)) + 'G'
  }
}
