'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Copy, 
  RotateCcw, 
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { ProjectStructure } from '../types';

interface TerminalPanelProps {
  project: ProjectStructure;
  height: number;
}

interface TerminalSession {
  id: string;
  name: string;
  isActive: boolean;
  output: TerminalOutput[];
  currentDirectory: string;
  isRunning: boolean;
  pid?: number;
}

interface TerminalOutput {
  id: string;
  type: 'command' | 'output' | 'error' | 'info' | 'success' | 'warning';
  content: string;
  timestamp: Date;
  exitCode?: number;
}

interface Command {
  command: string;
  description: string;
  category: 'git' | 'npm' | 'build' | 'test' | 'deploy' | 'file';
}

const PREDEFINED_COMMANDS: Command[] = [
  { command: 'npm install', description: 'Install dependencies', category: 'npm' },
  { command: 'npm run dev', description: 'Start development server', category: 'npm' },
  { command: 'npm run build', description: 'Build for production', category: 'build' },
  { command: 'npm test', description: 'Run tests', category: 'test' },
  { command: 'npm run lint', description: 'Run linter', category: 'npm' },
  { command: 'git status', description: 'Check git status', category: 'git' },
  { command: 'git add .', description: 'Stage all changes', category: 'git' },
  { command: 'git commit -m "Update"', description: 'Commit changes', category: 'git' },
  { command: 'git push', description: 'Push to remote', category: 'git' },
  { command: 'git pull', description: 'Pull from remote', category: 'git' },
  { command: 'ls -la', description: 'List files (detailed)', category: 'file' },
  { command: 'pwd', description: 'Show current directory', category: 'file' },
  { command: 'tree', description: 'Show directory tree', category: 'file' }
];

export const TerminalPanel: React.FC<TerminalPanelProps> = ({ project, height }) => {
  const [sessions, setSessions] = useState<TerminalSession[]>([
    {
      id: 'main',
      name: 'Main',
      isActive: true,
      output: [],
      currentDirectory: `/projects/${project.name}`,
      isRunning: false
    }
  ]);
  
  const [activeSessionId, setActiveSessionId] = useState('main');
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  useEffect(() => {
    // Auto-scroll to bottom when new output is added
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [activeSession?.output]);

  const addOutput = useCallback((
    sessionId: string, 
    content: string, 
    type: TerminalOutput['type'] = 'output',
    exitCode?: number
  ) => {    setSessions(prev => prev.map(session => 
      session.id === sessionId
        ? {
            ...session,
            output: [...session.output, {
              id: `${Date.now()}-${Math.random()}`,
              type,
              content,
              timestamp: new Date(),
              ...(exitCode !== undefined && { exitCode })
            }]
          }
        : session
    ));
  }, []);

  const executeCommand = useCallback(async (command: string) => {
    if (!activeSession || !command.trim()) return;

    // Add command to history
    setCommandHistory(prev => [...prev.filter(cmd => cmd !== command), command]);
    setHistoryIndex(-1);

    // Add command to output
    addOutput(activeSessionId, `$ ${command}`, 'command');

    // Mark session as running
    setSessions(prev => prev.map(session => 
      session.id === activeSessionId
        ? { ...session, isRunning: true }
        : session
    ));

    // Simulate command execution
    try {
      const result = await simulateCommand(command, activeSession.currentDirectory);
      
      // Add output
      if (result.output) {
        addOutput(activeSessionId, result.output, result.success ? 'output' : 'error', result.exitCode);
      }

      // Update current directory if changed
      if (result.newDirectory) {
        setSessions(prev => prev.map(session => 
          session.id === activeSessionId
            ? { ...session, currentDirectory: result.newDirectory! }
            : session
        ));
      }

      // Add success/error indicator
      if (result.exitCode === 0) {
        addOutput(activeSessionId, '✓ Command completed successfully', 'success');
      } else if (result.exitCode !== undefined && result.exitCode > 0) {
        addOutput(activeSessionId, `✗ Command failed with exit code ${result.exitCode}`, 'error');
      }

    } catch (error) {
      addOutput(activeSessionId, `Error: ${error}`, 'error', 1);
    }

    // Mark session as not running
    setSessions(prev => prev.map(session => 
      session.id === activeSessionId
        ? { ...session, isRunning: false }
        : session
    ));

    setCurrentCommand('');
  }, [activeSession, activeSessionId, addOutput]);

  const simulateCommand = async (command: string, currentDir: string): Promise<{
    output?: string;
    success: boolean;
    exitCode?: number;
    newDirectory?: string;
  }> => {
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    const cmd = command.trim().toLowerCase();

    // Git commands
    if (cmd.startsWith('git status')) {
      return {
        output: `On branch ${project.git.branch}\nYour branch is up to date with 'origin/${project.git.branch}'.\n\nChanges not staged for commit:\n  modified:   src/components/FileExplorer.tsx\n  modified:   README.md\n\nno changes added to commit (use "git add <file>..." to update what will be committed)`,
        success: true,
        exitCode: 0
      };
    }

    if (cmd.startsWith('git add')) {
      return {
        output: 'Changes staged for commit.',
        success: true,
        exitCode: 0
      };
    }

    if (cmd.startsWith('git commit')) {
      const commitMessage = command.match(/-m ["'](.+)["']/)?.[1] || 'Update';
      return {
        output: `[${project.git.branch} a1b2c3d] ${commitMessage}\n 2 files changed, 45 insertions(+), 12 deletions(-)`,
        success: true,
        exitCode: 0
      };
    }

    if (cmd.startsWith('git push')) {
      return {
        output: `Enumerating objects: 8, done.\nCounting objects: 100% (8/8), done.\nDelta compression using up to 8 threads\nCompressing objects: 100% (4/4), done.\nWriting objects: 100% (4/4), 1.23 KiB | 1.23 MiB/s, done.\nTotal 4 (delta 2), reused 0 (delta 0), pack-reused 0\nTo https://github.com/user/${project.name}.git\n   f1e2d3c..a1b2c3d  ${project.git.branch} -> ${project.git.branch}`,
        success: true,
        exitCode: 0
      };
    }

    // NPM commands
    if (cmd.startsWith('npm install')) {
      return {
        output: `npm notice created a lockfile as package-lock.json. You should commit this file.\nnpm WARN ${project.name}@1.0.0 No repository field.\n\nadded 1342 packages from 1247 contributors and audited 1342 packages in 23.456s\n\nfound 0 vulnerabilities`,
        success: true,
        exitCode: 0
      };
    }

    if (cmd.startsWith('npm run dev')) {
      return {
        output: `> ${project.name}@1.0.0 dev\n> next dev\n\nready - started server on 0.0.0.0:3000, url: http://localhost:3000\ninfo  - Using webpack 5. Reason: Enabled by default https://nextjs.org/docs/messages/webpack5\nevent - compiled client and server successfully in 2.3s (173 modules)\nwait  - compiling...\nevent - compiled client and server successfully in 142 ms (173 modules)`,
        success: true,
        exitCode: 0
      };
    }

    if (cmd.startsWith('npm run build')) {
      return {
        output: `> ${project.name}@1.0.0 build\n> next build\n\ninfo  - Checking validity of types...\ninfo  - Creating an optimized production build...\ninfo  - Compiled successfully\ninfo  - Collecting page data...\ninfo  - Generating static pages (4/4)\ninfo  - Finalizing page optimization...\n\nPage                                       Size     First Load JS\n┌ ○ /                                      2.67 kB        87.2 kB\n├   └ css/ae0e3e027412e072.css             707 B\n├ ○ /404                                   194 B          84.8 kB\n└ ○ /about                                 1.23 kB        86.1 kB\n+ First Load JS shared by all              84.6 kB\n  ├ chunks/framework-2c79e2a64abdb08b.js   45.2 kB\n  ├ chunks/main-8d8dfa2c4a1df0ba.js        26.8 kB\n  ├ chunks/pages/_app-74cce5a1d4982051.js  10.9 kB\n  └ chunks/webpack-ee7e63bc15b31913.js     1.68 kB\n\n○  (Static)  automatically rendered as static HTML (uses no initial props)`,
        success: true,
        exitCode: 0
      };
    }

    if (cmd.startsWith('npm test')) {
      return {
        output: `> ${project.name}@1.0.0 test\n> jest\n\n PASS  src/components/__tests__/FileExplorer.test.tsx\n PASS  src/utils/__tests__/helpers.test.ts\n PASS  src/hooks/__tests__/useFileExplorer.test.ts\n\nTest Suites: 3 passed, 3 total\nTests:       24 passed, 24 total\nSnapshots:   0 total\nTime:        3.421 s\nRan all test suites.`,
        success: true,
        exitCode: 0
      };
    }

    // File system commands
    if (cmd === 'pwd') {
      return {
        output: currentDir,
        success: true,
        exitCode: 0
      };
    }

    if (cmd === 'ls' || cmd === 'ls -la') {
      const files = project.root.children?.map(child => {
        if (cmd === 'ls -la') {
          const perms = child.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--';
          const size = child.size || 4096;
          const date = child.lastModified.toLocaleDateString();
          return `${perms}  1 user user ${size.toString().padStart(8)} ${date} ${child.name}`;
        }
        return child.name;
      }) || [];
      
      return {
        output: files.join('\n'),
        success: true,
        exitCode: 0
      };
    }

    if (cmd === 'tree') {
      const generateTree = (node: any, prefix = '', isLast = true): string => {
        const connector = isLast ? '└── ' : '├── ';
        let result = prefix + connector + node.name + '\n';
        
        if (node.children) {
          const children = node.children.slice(0, 10); // Limit for demo
          children.forEach((child: any, index: number) => {
            const isLastChild = index === children.length - 1;
            const newPrefix = prefix + (isLast ? '    ' : '│   ');
            result += generateTree(child, newPrefix, isLastChild);
          });
        }
        
        return result;
      };

      return {
        output: generateTree(project.root).trim(),
        success: true,
        exitCode: 0
      };
    }

    // Default for unknown commands
    return {
      output: `bash: ${command.split(' ')[0]}: command not found`,
      success: false,
      exitCode: 127
    };
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        const command = commandHistory[commandHistory.length - 1 - newIndex];
        setCurrentCommand(command || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        const command = commandHistory[commandHistory.length - 1 - newIndex];
        setCurrentCommand(command || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setShowSuggestions(!showSuggestions);
    }
  };

  const clearTerminal = () => {
    setSessions(prev => prev.map(session => 
      session.id === activeSessionId
        ? { ...session, output: [] }
        : session
    ));
  };

  const copyOutput = () => {
    if (activeSession) {
      const output = activeSession.output
        .map(item => `${item.type === 'command' ? '' : ''}${item.content}`)
        .join('\n');
      navigator.clipboard.writeText(output);
    }
  };

  const getOutputIcon = (type: TerminalOutput['type']) => {
    switch (type) {
      case 'command':
        return <ChevronRight className="w-4 h-4 text-blue-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info':
        return <Clock className="w-4 h-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const getOutputColor = (type: TerminalOutput['type']) => {
    switch (type) {
      case 'command':
        return 'text-blue-400';
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-gray-300';
    }
  };

  const filteredSuggestions = PREDEFINED_COMMANDS.filter(cmd =>
    cmd.command.toLowerCase().includes(currentCommand.toLowerCase()) ||
    cmd.description.toLowerCase().includes(currentCommand.toLowerCase())
  );

  return (
    <div className={`bg-gray-900 text-white font-mono text-sm ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium">Terminal</span>
          </div>
          
          {/* Session tabs */}
          <div className="flex space-x-1">
            {sessions.map(session => (
              <button
                key={session.id}
                onClick={() => setActiveSessionId(session.id)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  session.id === activeSessionId
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {session.name}
                {session.isRunning && (
                  <span className="ml-1 inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={clearTerminal}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
            title="Clear terminal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={copyOutput}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
            title="Copy output"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Command suggestions */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gray-800 border-b border-gray-700 p-2 max-h-32 overflow-auto"
          >
            <div className="text-xs text-gray-400 mb-2">Suggestions:</div>
            <div className="space-y-1">
              {filteredSuggestions.slice(0, 5).map((cmd, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentCommand(cmd.command);
                    setShowSuggestions(false);
                    inputRef.current?.focus();
                  }}
                  className="w-full text-left p-2 rounded hover:bg-gray-700 transition-colors"
                >
                  <div className="text-green-400">{cmd.command}</div>
                  <div className="text-xs text-gray-400">{cmd.description}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal content */}
      <div 
        className="flex-1 overflow-auto p-4 space-y-1"
        style={{ height: isFullscreen ? 'calc(100vh - 120px)' : `${height - 120}px` }}
        ref={terminalRef}
      >
        {activeSession?.output.map((item) => (
          <div key={item.id} className="flex items-start space-x-2">
            <div className="flex-shrink-0 mt-0.5">
              {getOutputIcon(item.type)}
            </div>
            <div className={`flex-1 ${getOutputColor(item.type)}`}>
              <pre className="whitespace-pre-wrap break-words">{item.content}</pre>
            </div>
            <div className="text-xs text-gray-500 flex-shrink-0">
              {item.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        
        {/* Current input line */}
        <div className="flex items-center space-x-2">
          <span className="text-green-400">$</span>
          <span className="text-blue-400">{activeSession?.currentDirectory}</span>
          <span className="text-gray-500">›</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white"
            placeholder="Type a command..."
            disabled={activeSession?.isRunning}
          />
          {activeSession?.isRunning && (
            <div className="text-yellow-400 animate-pulse">Running...</div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-1 text-xs text-gray-400 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span>Directory: {activeSession?.currentDirectory}</span>
          <span>History: {commandHistory.length} commands</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Press Tab for suggestions</span>
          <span>↑↓ for history</span>
        </div>
      </div>
    </div>
  );
};
