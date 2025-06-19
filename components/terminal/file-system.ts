/**
 * @fileoverview File System Simulator
 * Complete UNIX-like file system simulation with realistic directory structures
 */

import { FileSystemNode, TerminalContext } from './types'

export class FileSystemSimulator {
  private root: FileSystemNode
  
  constructor() {
    this.root = this.createFileSystem()
  }

  private createFileSystem(): FileSystemNode {
    const now = new Date()
    
    return {
      name: '',
      type: 'directory',
      size: 4096,
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      modified: now,
      children: {
        'home': {
          name: 'home',
          type: 'directory',
          size: 4096,
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          modified: now,
          children: {
            'rajin': {
              name: 'rajin',
              type: 'directory',
              size: 4096,
              permissions: 'drwxr-xr-x',
              owner: 'rajin',
              group: 'rajin',
              modified: now,
              children: {
                'projects': {
                  name: 'projects',
                  type: 'directory',
                  size: 4096,
                  permissions: 'drwxrwxr-x',
                  owner: 'rajin',
                  group: 'rajin',
                  modified: now,
                  children: {
                    'portfolio-site': {
                      name: 'portfolio-site',
                      type: 'directory',
                      size: 4096,
                      permissions: 'drwxrwxr-x',
                      owner: 'rajin',
                      group: 'rajin',
                      modified: now,
                      children: {
                        'package.json': {
                          name: 'package.json',
                          type: 'file',
                          size: 2048,
                          permissions: '-rw-rw-r--',
                          owner: 'rajin',
                          group: 'rajin',
                          modified: now,
                          content: JSON.stringify({
                            name: "portfolio-site",
                            version: "1.0.0",
                            dependencies: {
                              "next": "^15.3.3",
                              "react": "^19.1.0",
                              "three": "^0.177.0",
                              "framer-motion": "^12.18.1"
                            }
                          }, null, 2)
                        },
                        'README.md': {
                          name: 'README.md',
                          type: 'file',
                          size: 1024,
                          permissions: '-rw-rw-r--',
                          owner: 'rajin',
                          group: 'rajin',
                          modified: now,
                          content: `# Portfolio Site

A retro-inspired developer portfolio featuring:
- 3D CRT monitor simulation
- Interactive terminal interface
- WebGL shaders and effects
- Full accessibility support

## Tech Stack
- Next.js 15
- React 19
- Three.js
- Framer Motion
- TypeScript`
                        },
                        'src': {
                          name: 'src',
                          type: 'directory',
                          size: 4096,
                          permissions: 'drwxrwxr-x',
                          owner: 'rajin',
                          group: 'rajin',
                          modified: now,
                          children: {
                            'components': {
                              name: 'components',
                              type: 'directory',
                              size: 4096,
                              permissions: 'drwxrwxr-x',
                              owner: 'rajin',
                              group: 'rajin',
                              modified: now,
                              children: {
                                'terminal.tsx': {
                                  name: 'terminal.tsx',
                                  type: 'file',
                                  size: 8192,
                                  permissions: '-rw-rw-r--',
                                  owner: 'rajin',
                                  group: 'rajin',
                                  modified: now,
                                  content: `// Ultra-authentic terminal component
export function Terminal() {
  // Implementation details...
}`
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    'machine-learning': {
                      name: 'machine-learning',
                      type: 'directory',
                      size: 4096,
                      permissions: 'drwxrwxr-x',
                      owner: 'rajin',
                      group: 'rajin',
                      modified: new Date('2024-12-15'),
                      children: {
                        'neural-network.py': {
                          name: 'neural-network.py',
                          type: 'file',
                          size: 4096,
                          permissions: '-rw-rw-r--',
                          owner: 'rajin',
                          group: 'rajin',
                          modified: new Date('2024-12-15'),
                          content: `import numpy as np
import tensorflow as tf

class NeuralNetwork:
    def __init__(self, layers):
        self.layers = layers
        self.weights = []
        self.biases = []
        
    def forward(self, x):
        # Implementation...
        pass`
                        }
                      }
                    }
                  }
                },
                'documents': {
                  name: 'documents',
                  type: 'directory',
                  size: 4096,
                  permissions: 'drwxrwxr-x',
                  owner: 'rajin',
                  group: 'rajin',
                  modified: now,
                  children: {
                    'resume.pdf': {
                      name: 'resume.pdf',
                      type: 'file',
                      size: 524288,
                      permissions: '-rw-rw-r--',
                      owner: 'rajin',
                      group: 'rajin',
                      modified: now,
                      content: 'PDF content (binary file)'
                    },
                    'cover-letter.txt': {
                      name: 'cover-letter.txt',
                      type: 'file',
                      size: 2048,
                      permissions: '-rw-rw-r--',
                      owner: 'rajin',
                      group: 'rajin',
                      modified: now,
                      content: `Dear Hiring Manager,

I am excited to apply for the Software Engineer position...

Best regards,
Rajin Uddin`
                    }
                  }
                },
                '.bashrc': {
                  name: '.bashrc',
                  type: 'file',
                  size: 1024,
                  permissions: '-rw-rw-r--',
                  owner: 'rajin',
                  group: 'rajin',
                  modified: now,
                  content: `# ~/.bashrc: executed by bash(1) for non-login shells

# Aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias grep='grep --color=auto'

# Environment variables
export EDITOR=vim
export PATH=$PATH:~/bin

# Custom prompt
PS1='\\u@\\h:\\w\\$ '`
                },
                '.vimrc': {
                  name: '.vimrc',
                  type: 'file',
                  size: 512,
                  permissions: '-rw-rw-r--',
                  owner: 'rajin',
                  group: 'rajin',
                  modified: now,
                  content: `" Vim configuration
set number
set tabstop=2
set shiftwidth=2
set expandtab
syntax on
set hlsearch`
                }
              }
            }
          }
        },
        'etc': {
          name: 'etc',
          type: 'directory',
          size: 4096,
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          modified: now,
          children: {
            'passwd': {
              name: 'passwd',
              type: 'file',
              size: 512,
              permissions: '-rw-r--r--',
              owner: 'root',
              group: 'root',
              modified: now,
              content: `root:x:0:0:root:/root:/bin/bash
rajin:x:1000:1000:Rajin Uddin,,,:/home/rajin:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin`
            },
            'hosts': {
              name: 'hosts',
              type: 'file',
              size: 256,
              permissions: '-rw-r--r--',
              owner: 'root',
              group: 'root',
              modified: now,
              content: `127.0.0.1	localhost
127.0.1.1	rajin-dev
::1		localhost ip6-localhost ip6-loopback`
            }
          }
        },
        'var': {
          name: 'var',
          type: 'directory',
          size: 4096,
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          modified: now,
          children: {
            'log': {
              name: 'log',
              type: 'directory',
              size: 4096,
              permissions: 'drwxrwxr-x',
              owner: 'root',
              group: 'root',
              modified: now,
              children: {
                'system.log': {
                  name: 'system.log',
                  type: 'file',
                  size: 16384,
                  permissions: '-rw-r--r--',
                  owner: 'root',
                  group: 'root',
                  modified: now,
                  content: `Jun 19 10:30:45 rajin-dev kernel: [    0.000000] Linux version 5.15.0
Jun 19 10:30:45 rajin-dev kernel: [    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz
Jun 19 10:30:46 rajin-dev systemd[1]: Started Session c1 of user rajin.
Jun 19 10:31:00 rajin-dev portfolio[1234]: Terminal interface initialized
Jun 19 10:31:05 rajin-dev portfolio[1234]: WebGL context created successfully`
                }
              }
            }
          }
        },
        'usr': {
          name: 'usr',
          type: 'directory',
          size: 4096,
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          modified: now,
          children: {
            'bin': {
              name: 'bin',
              type: 'directory',
              size: 4096,
              permissions: 'drwxr-xr-x',
              owner: 'root',
              group: 'root',
              modified: now,
              children: {
                'node': {
                  name: 'node',
                  type: 'file',
                  size: 49152,
                  permissions: '-rwxr-xr-x',
                  owner: 'root',
                  group: 'root',
                  modified: now,
                  content: 'Binary executable'
                },
                'npm': {
                  name: 'npm',
                  type: 'file',
                  size: 8192,
                  permissions: '-rwxr-xr-x',
                  owner: 'root',
                  group: 'root',
                  modified: now,
                  content: 'Binary executable'
                }
              }
            }
          }
        }
      }
    }
  }

  resolvePath(path: string, currentDir: string): string {
    if (path.startsWith('/')) {
      return path
    }
    
    if (path.startsWith('~')) {
      return path.replace('~', '/home/rajin')
    }
    
    if (path === '.') {
      return currentDir
    }
    
    if (path === '..') {
      const parts = currentDir.split('/').filter(p => p)
      parts.pop()
      return '/' + parts.join('/')
    }
    
    if (currentDir === '/') {
      return '/' + path
    }
    
    return currentDir + '/' + path
  }

  getNode(path: string): FileSystemNode | null {
    const normalizedPath = this.normalizePath(path)
    
    if (normalizedPath === '' || normalizedPath === '/') {
      return this.root
    }
    
    const parts = normalizedPath.split('/').filter(p => p)
    let current = this.root
    
    for (const part of parts) {
      if (!current.children || !current.children[part]) {
        return null
      }
      current = current.children[part]
    }
    
    return current
  }

  listDirectory(path: string): FileSystemNode[] | null {
    const node = this.getNode(path)
    
    if (!node || node.type !== 'directory') {
      return null
    }
    
    if (!node.children) {
      return []
    }
    
    return Object.values(node.children)
  }

  exists(path: string): boolean {
    return this.getNode(path) !== null
  }

  isDirectory(path: string): boolean {
    const node = this.getNode(path)
    return node?.type === 'directory' || false
  }

  isFile(path: string): boolean {
    const node = this.getNode(path)
    return node?.type === 'file' || false
  }

  readFile(path: string): string | null {
    const node = this.getNode(path)
    
    if (!node || node.type !== 'file') {
      return null
    }
    
    return node.content || ''
  }

  writeFile(path: string, content: string, context: TerminalContext): boolean {
    const dir = this.getDirectoryPath(path)
    const filename = this.getFilename(path)
    const dirNode = this.getNode(dir)
    
    if (!dirNode || dirNode.type !== 'directory') {
      return false
    }
    
    if (!dirNode.children) {
      dirNode.children = {}
    }
    
    dirNode.children[filename] = {
      name: filename,
      type: 'file',
      size: content.length,
      permissions: '-rw-rw-r--',
      owner: context.user,
      group: context.user,
      modified: new Date(),
      content
    }
    
    return true
  }

  createDirectory(path: string, context: TerminalContext): boolean {
    const dir = this.getDirectoryPath(path)
    const dirname = this.getFilename(path)
    const dirNode = this.getNode(dir)
    
    if (!dirNode || dirNode.type !== 'directory') {
      return false
    }
    
    if (!dirNode.children) {
      dirNode.children = {}
    }
    
    if (dirNode.children[dirname]) {
      return false
    }
    
    dirNode.children[dirname] = {
      name: dirname,
      type: 'directory',
      size: 4096,
      permissions: 'drwxrwxr-x',
      owner: context.user,
      group: context.user,
      modified: new Date(),
      children: {}
    }
    
    return true
  }

  deleteFile(path: string): boolean {
    const dir = this.getDirectoryPath(path)
    const filename = this.getFilename(path)
    const dirNode = this.getNode(dir)
    
    if (!dirNode || dirNode.type !== 'directory' || !dirNode.children) {
      return false
    }
    
    if (!dirNode.children[filename]) {
      return false
    }
    
    delete dirNode.children[filename]
    return true
  }

  private normalizePath(path: string): string {
    return path.replace(/\/+/g, '/').replace(/\/$/, '')
  }

  private getDirectoryPath(path: string): string {
    const parts = path.split('/')
    parts.pop()
    return parts.join('/') || '/'
  }

  private getFilename(path: string): string {
    const parts = path.split('/')
    return parts[parts.length - 1]
  }

  getPermissionsString(node: FileSystemNode): string {
    return node.permissions
  }

  formatSize(size: number): string {
    if (size < 1024) return `${size}B`
    if (size < 1024 * 1024) return `${Math.round(size / 1024)}K`
    if (size < 1024 * 1024 * 1024) return `${Math.round(size / (1024 * 1024))}M`
    return `${Math.round(size / (1024 * 1024 * 1024))}G`
  }

  formatDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[date.getMonth()]
    const day = date.getDate().toString().padStart(2, ' ')
    const year = date.getFullYear()
    const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    
    return `${month} ${day} ${year < new Date().getFullYear() ? year : time}`
  }
}
