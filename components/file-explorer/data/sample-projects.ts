import { ProjectStructure, FileSystemNode, GitRepository, ProjectMetrics, PackageJson } from '../types';

// Sample project contents for realistic demonstration
export const sampleProjects: ProjectStructure[] = [
  {
    id: 'portfolio-website',
    name: 'Portfolio Website',
    description: 'Personal portfolio website built with Next.js, TypeScript, and Tailwind CSS',
    type: 'next-js',
    technologies: [
      { name: 'Next.js', version: '15.3.3', type: 'framework', logo: '/icons/nextjs.svg' },
      { name: 'TypeScript', version: '5.0.0', type: 'language', logo: '/icons/typescript.svg' },
      { name: 'Tailwind CSS', version: '3.3.0', type: 'framework', logo: '/icons/tailwind.svg' },
      { name: 'Three.js', version: '0.177.0', type: 'library', logo: '/icons/threejs.svg' },
      { name: 'Framer Motion', version: '12.18.1', type: 'library', logo: '/icons/framer.svg' }
    ],
    root: createPortfolioFileStructure(),
    git: createPortfolioGitRepo(),
    gitRepository: createPortfolioGitRepo(),
    packageJson: createPortfolioPackageJson(),
    readme: createPortfolioReadme(),
    license: 'MIT',
    metrics: createPortfolioMetrics(),
    deployment: {
      platform: 'Vercel',
      url: 'https://rajin-portfolio.vercel.app',
      status: 'deployed',
      lastDeploy: new Date('2025-06-19T10:30:00Z'),
      deployments: [
        {
          id: 'dep-1',
          commit: 'a1b2c3d',
          message: 'Add CRT monitor component',
          status: 'success',
          date: new Date('2025-06-19T10:30:00Z'),
          duration: 120,
          url: 'https://rajin-portfolio.vercel.app',
          logs: [
            { timestamp: new Date('2025-06-19T10:28:00Z'), level: 'info', message: 'Build started' },
            { timestamp: new Date('2025-06-19T10:29:30Z'), level: 'info', message: 'Dependencies installed' },
            { timestamp: new Date('2025-06-19T10:30:00Z'), level: 'info', message: 'Build completed successfully' }
          ]
        }
      ],
      environment: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_URL: 'https://rajin-portfolio.vercel.app'
      }
    }
  },
  {
    id: 'react-dashboard',
    name: 'Analytics Dashboard',
    description: 'Real-time analytics dashboard with React, D3.js, and WebSocket integration',
    type: 'react-app',
    technologies: [
      { name: 'React', version: '18.2.0', type: 'framework' },
      { name: 'TypeScript', version: '5.0.0', type: 'language' },
      { name: 'D3.js', version: '7.8.5', type: 'library' },
      { name: 'Socket.io', version: '4.7.2', type: 'library' },
      { name: 'Material-UI', version: '5.14.5', type: 'framework' }
    ],
    root: createDashboardFileStructure(),
    git: createDashboardGitRepo(),
    gitRepository: createDashboardGitRepo(),
    packageJson: createDashboardPackageJson(),
    readme: createDashboardReadme(),
    license: 'MIT',
    metrics: createDashboardMetrics()
  },
  {
    id: 'node-api',
    name: 'REST API Server',
    description: 'RESTful API server with Node.js, Express, MongoDB, and JWT authentication',
    type: 'node-api',
    technologies: [
      { name: 'Node.js', version: '18.17.0', type: 'language' },
      { name: 'Express', version: '4.18.2', type: 'framework' },
      { name: 'MongoDB', version: '5.0.0', type: 'database' },
      { name: 'JWT', version: '9.0.2', type: 'library' },
      { name: 'Jest', version: '29.6.2', type: 'tool' }
    ],
    root: createAPIFileStructure(),
    git: createAPIGitRepo(),
    gitRepository: createAPIGitRepo(),
    packageJson: createAPIPackageJson(),
    readme: createAPIReadme(),
    license: 'MIT',
    metrics: createAPIMetrics()
  },
  {
    id: 'mobile-app',
    name: 'Social Media App',
    description: 'Cross-platform mobile app built with React Native and Firebase',
    type: 'mobile-app',
    technologies: [
      { name: 'React Native', version: '0.72.4', type: 'framework' },
      { name: 'TypeScript', version: '5.0.0', type: 'language' },
      { name: 'Firebase', version: '10.1.0', type: 'service' },
      { name: 'Expo', version: '49.0.0', type: 'tool' },
      { name: 'Redux', version: '4.2.1', type: 'library' }
    ],
    root: createMobileFileStructure(),
    git: createMobileGitRepo(),
    gitRepository: createMobileGitRepo(),
    packageJson: createMobilePackageJson(),
    readme: createMobileReadme(),
    license: 'MIT',
    metrics: createMobileMetrics()
  }
];

function createPortfolioFileStructure(): FileSystemNode {
  return {
    id: 'root',
    name: 'portfolio-website',
    type: 'directory',
    path: '/',
    lastModified: new Date('2025-06-19T10:00:00Z'),
    created: new Date('2025-01-15T09:00:00Z'),
    permissions: { read: true, write: true, execute: true, owner: 'rajin', group: 'dev', mode: '755' },
    children: [
      {
        id: 'package-json',
        name: 'package.json',
        type: 'file',
        path: '/package.json',
        size: 2048,
        lastModified: new Date('2025-06-19T09:30:00Z'),
        created: new Date('2025-01-15T09:00:00Z'),
        extension: 'json',
        language: 'json',
        permissions: { read: true, write: true, execute: false, owner: 'rajin', group: 'dev', mode: '644' },
        content: JSON.stringify(createPortfolioPackageJson(), null, 2),
        gitStatus: { status: 'clean', staged: false, conflicted: false, ahead: 0, behind: 0 }
      },
      {
        id: 'readme',
        name: 'README.md',
        type: 'file',
        path: '/README.md',
        size: 4096,
        lastModified: new Date('2025-06-18T15:20:00Z'),
        created: new Date('2025-01-15T09:05:00Z'),
        extension: 'md',
        language: 'markdown',
        permissions: { read: true, write: true, execute: false, owner: 'rajin', group: 'dev', mode: '644' },
        content: createPortfolioReadme(),
        gitStatus: { status: 'clean', staged: false, conflicted: false, ahead: 0, behind: 0 }
      },
      {
        id: 'next-config',
        name: 'next.config.js',
        type: 'file',
        path: '/next.config.js',
        size: 512,
        lastModified: new Date('2025-06-15T11:00:00Z'),
        created: new Date('2025-01-15T09:10:00Z'),
        extension: 'js',
        language: 'javascript',
        permissions: { read: true, write: true, execute: false, owner: 'rajin', group: 'dev', mode: '644' },
        content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig`,
        gitStatus: { status: 'clean', staged: false, conflicted: false, ahead: 0, behind: 0 }
      },
      {
        id: 'app-dir',
        name: 'app',
        type: 'directory',
        path: '/app',
        lastModified: new Date('2025-06-19T10:00:00Z'),
        created: new Date('2025-01-15T09:15:00Z'),
        permissions: { read: true, write: true, execute: true, owner: 'rajin', group: 'dev', mode: '755' },
        children: [
          {
            id: 'layout-tsx',
            name: 'layout.tsx',
            type: 'file',
            path: '/app/layout.tsx',
            size: 1024,
            lastModified: new Date('2025-06-19T09:45:00Z'),
            created: new Date('2025-01-15T09:20:00Z'),
            extension: 'tsx',
            language: 'typescript',
            permissions: { read: true, write: true, execute: false, owner: 'rajin', group: 'dev', mode: '644' },
            content: `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rajin Uddin - Full Stack Developer',
  description: 'Personal portfolio showcasing projects and skills',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}`,
            gitStatus: { status: 'modified', staged: false, conflicted: false, ahead: 0, behind: 0 }
          },
          {
            id: 'page-tsx',
            name: 'page.tsx',
            type: 'file',
            path: '/app/page.tsx',
            size: 3072,
            lastModified: new Date('2025-06-19T10:00:00Z'),
            created: new Date('2025-01-15T09:25:00Z'),
            extension: 'tsx',
            language: 'typescript',
            permissions: { read: true, write: true, execute: false, owner: 'rajin', group: 'dev', mode: '644' },
            content: `import Hero from '@/components/hero'
import About from '@/components/about'
import Projects from '@/components/projects'
import Skills from '@/components/skills'
import Contact from '@/components/contact'
import { CRTMonitorSection } from '@/components/crt-monitor'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <CRTMonitorSection />
      <Projects />
      <Contact />
    </main>
  )
}`,
            gitStatus: { status: 'modified', staged: true, conflicted: false, ahead: 0, behind: 0 }
          }
        ]
      },
      {
        id: 'components-dir',
        name: 'components',
        type: 'directory',
        path: '/components',
        lastModified: new Date('2025-06-19T10:00:00Z'),
        created: new Date('2025-01-15T10:00:00Z'),
        permissions: { read: true, write: true, execute: true, owner: 'rajin', group: 'dev', mode: '755' },
        children: [
          {
            id: 'crt-monitor-dir',
            name: 'crt-monitor',
            type: 'directory',
            path: '/components/crt-monitor',
            lastModified: new Date('2025-06-19T10:00:00Z'),
            created: new Date('2025-06-19T08:00:00Z'),
            permissions: { read: true, write: true, execute: true, owner: 'rajin', group: 'dev', mode: '755' },
            children: [
              {
                id: 'crt-monitor-tsx',
                name: 'CRTMonitor.tsx',
                type: 'file',
                path: '/components/crt-monitor/CRTMonitor.tsx',
                size: 8192,
                lastModified: new Date('2025-06-19T10:00:00Z'),
                created: new Date('2025-06-19T08:30:00Z'),
                extension: 'tsx',
                language: 'typescript',
                permissions: { read: true, write: true, execute: false, owner: 'rajin', group: 'dev', mode: '644' },
                content: `import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { CRTPhysicsSimulator } from './physics/crt-physics';

interface CRTMonitorProps {
  model?: string;
  screenContent?: HTMLCanvasElement | null;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
}

export const CRTMonitor: React.FC<CRTMonitorProps> = ({
  model = 'commodore-1084',
  screenContent = null,
  quality = 'high'
}) => {
  const meshRef = useRef();
  const physicsSimulator = useMemo(() => new CRTPhysicsSimulator(), []);

  useFrame((state, delta) => {
    physicsSimulator.update(delta * 1000);
  });

  return (
    <mesh ref={meshRef}>
      {/* CRT monitor implementation */}
    </mesh>
  );
};

export default CRTMonitor;`,
                gitStatus: { status: 'added', staged: true, conflicted: false, ahead: 0, behind: 0 }
              }
            ]
          }
        ]
      },
      {
        id: 'public-dir',
        name: 'public',
        type: 'directory',
        path: '/public',
        lastModified: new Date('2025-06-18T14:00:00Z'),
        created: new Date('2025-01-15T10:30:00Z'),
        permissions: { read: true, write: true, execute: true, owner: 'rajin', group: 'dev', mode: '755' },
        children: [
          {
            id: 'favicon',
            name: 'favicon.ico',
            type: 'file',
            path: '/public/favicon.ico',
            size: 1150,
            lastModified: new Date('2025-01-15T10:30:00Z'),
            created: new Date('2025-01-15T10:30:00Z'),
            extension: 'ico',
            permissions: { read: true, write: true, execute: false, owner: 'rajin', group: 'dev', mode: '644' },
            gitStatus: { status: 'clean', staged: false, conflicted: false, ahead: 0, behind: 0 }
          }
        ]
      },
      {
        id: 'gitignore',
        name: '.gitignore',
        type: 'file',
        path: '/.gitignore',
        size: 512,
        lastModified: new Date('2025-01-15T09:00:00Z'),
        created: new Date('2025-01-15T09:00:00Z'),
        extension: 'gitignore',
        permissions: { read: true, write: true, execute: false, owner: 'rajin', group: 'dev', mode: '644' },
        content: `# Dependencies
node_modules/
.pnp
.pnp.js

# Production build
.next/
out/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*`,
        gitStatus: { status: 'clean', staged: false, conflicted: false, ahead: 0, behind: 0 }
      }
    ]
  };
}

function createPortfolioGitRepo(): GitRepository {
  return {
    name: 'portfolio-website',
    url: 'https://github.com/rajin-uddin/portfolio-website.git',
    branch: 'main',
    branches: [
      { name: 'main', current: true, remote: 'origin/main', ahead: 2, behind: 0, lastCommit: 'a1b2c3d' },
      { name: 'feature/crt-monitor', current: false, remote: 'origin/feature/crt-monitor', ahead: 0, behind: 1, lastCommit: 'e4f5g6h' },
      { name: 'develop', current: false, remote: 'origin/develop', ahead: 0, behind: 3, lastCommit: 'i7j8k9l' }
    ],
    commits: [
      {
        hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
        shortHash: 'a1b2c3d',
        message: 'Add photorealistic CRT monitor component with authentic physics',
        author: { name: 'Rajin Uddin', email: 'rajin@example.com' },
        date: new Date('2025-06-19T10:00:00Z'),
        files: [
          { path: 'components/crt-monitor/CRTMonitor.tsx', status: 'added', additions: 150, deletions: 0, binary: false },
          { path: 'app/page.tsx', status: 'modified', additions: 5, deletions: 2, binary: false }
        ],
        stats: { additions: 155, deletions: 2, files: 2 },
        parents: ['b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1']
      },
      {
        hash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1',
        shortHash: 'b2c3d4e',
        message: 'Implement terminal emulator with UNIX command support',
        author: { name: 'Rajin Uddin', email: 'rajin@example.com' },
        date: new Date('2025-06-18T16:30:00Z'),
        files: [
          { path: 'components/terminal/ultra-terminal.tsx', status: 'added', additions: 200, deletions: 0, binary: false }
        ],
        stats: { additions: 200, deletions: 0, files: 1 },
        parents: ['c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2']
      }
    ],
    remotes: [
      { name: 'origin', url: 'https://github.com/rajin-uddin/portfolio-website.git', type: 'fetch' }
    ],
    status: {
      clean: false,
      staged: [
        { path: 'app/page.tsx', status: 'modified', additions: 1, deletions: 0, binary: false },
        { path: 'components/crt-monitor/CRTMonitor.tsx', status: 'added', additions: 150, deletions: 0, binary: false }
      ],
      unstaged: [
        { path: 'app/layout.tsx', status: 'modified', additions: 2, deletions: 1, binary: false }
      ],
      untracked: ['temp.log'],
      conflicted: [],
      ahead: 2,
      behind: 0
    },
    config: {
      user: { name: 'Rajin Uddin', email: 'rajin@example.com' },
      remote: { origin: { url: 'https://github.com/rajin-uddin/portfolio-website.git', fetch: '+refs/heads/*:refs/remotes/origin/*' } }
    }
  };
}

function createPortfolioPackageJson(): PackageJson {
  return {
    name: 'portfolio-website',
    version: '1.0.0',
    description: 'Personal portfolio website showcasing projects and skills',
    main: 'app/page.tsx',
    scripts: {
      'dev': 'next dev',
      'build': 'next build',
      'start': 'next start',
      'lint': 'next lint',
      'type-check': 'tsc --noEmit'
    },
    dependencies: {
      'next': '^15.3.3',
      'react': '^19.1.0',
      'react-dom': '^19.1.0',
      '@react-three/fiber': '^9.1.2',
      '@react-three/drei': '^10.3.0',
      'three': '^0.177.0',
      'framer-motion': '^12.18.1',
      'tailwindcss': '^3.3.0'
    },
    devDependencies: {
      '@types/node': '^20.0.0',
      '@types/react': '^19.1.8',
      '@types/react-dom': '^19.1.6',
      '@types/three': '^0.177.0',
      'typescript': '^5.0.0',
      'eslint': '^8.0.0',
      'eslint-config-next': '^14.0.0'
    },
    keywords: ['portfolio', 'react', 'next.js', 'typescript', 'three.js'],
    author: {
      name: 'Rajin Uddin',
      email: 'rajin@example.com',
      url: 'https://rajin-portfolio.vercel.app'
    },
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'https://github.com/rajin-uddin/portfolio-website.git'
    },
    homepage: 'https://rajin-portfolio.vercel.app'
  };
}

function createPortfolioReadme(): string {
  return `# Portfolio Website

A modern, interactive portfolio website built with Next.js, TypeScript, and Three.js.

## Features

- 🎨 Modern, responsive design
- 🖥️ Photorealistic CRT monitor simulation
- 💻 Interactive terminal emulator
- 🎯 3D skill visualization
- 📱 Mobile-optimized experience
- ⚡ Server-side rendering with Next.js
- 🎭 Dark/light theme support

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js, React Three Fiber
- **Animation**: Framer Motion
- **Deployment**: Vercel

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

## Project Structure

\`\`\`
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── crt-monitor/    # CRT monitor simulation
│   ├── terminal/       # Terminal emulator
│   └── ...
├── public/             # Static assets
└── ...
\`\`\`

## License

MIT License - see LICENSE file for details.`;
}

function createPortfolioMetrics(): ProjectMetrics {
  return {
    totalFiles: 47,
    totalLines: 3420,
    codeLines: 2890,
    commentLines: 380,
    blankLines: 150,
    languages: [
      { language: 'TypeScript', files: 23, lines: 2100, percentage: 61.4, bytes: 84000 },
      { language: 'CSS', files: 8, lines: 650, percentage: 19.0, bytes: 26000 },
      { language: 'JavaScript', files: 6, lines: 420, percentage: 12.3, bytes: 16800 },
      { language: 'JSON', files: 5, lines: 180, percentage: 5.3, bytes: 7200 },
      { language: 'Markdown', files: 5, lines: 70, percentage: 2.0, bytes: 2800 }
    ],
    complexity: {
      cyclomatic: 15.2,
      cognitive: 12.8,
      maintainability: 78.5,
      technical_debt: 2.5,
      code_smells: 8
    },
    dependencies: {
      total: 234,
      direct: 15,
      dev: 12,
      outdated: 3,
      vulnerable: 0,
      size: 45600000,
      gzipSize: 8900000
    },
    performance: {
      bundleSize: 1240000,
      chunkSizes: {
        'main': 450000,
        'framework': 380000,
        'commons': 280000,
        'runtime': 130000
      },
      loadTime: 1.2,
      buildTime: 42.3,
      testTime: 8.7,
      lighthouse: {
        performance: 95,
        accessibility: 98,
        bestPractices: 92,
        seo: 96,
        pwa: 85
      }
    },
    coverage: {
      lines: 87.5,
      functions: 82.3,
      branches: 76.8,
      statements: 85.9,
      files: 92.1,
      uncoveredFiles: ['src/utils/legacy.ts', 'src/components/experimental.tsx']
    },
    quality: {
      bugs: 2,
      vulnerabilities: 0,
      codeSmells: 8,
      duplicatedLines: 23,
      rating: 'A',
      technicalDebt: '2h 30min'
    }
  };
}

// Similar functions for other projects would be created here...
// For brevity, I'll create simplified versions

function createDashboardFileStructure(): FileSystemNode {
  return {
    id: 'dashboard-root',
    name: 'analytics-dashboard',
    type: 'directory',
    path: '/',
    lastModified: new Date('2025-06-15T14:00:00Z'),
    created: new Date('2025-02-01T10:00:00Z'),
    permissions: { read: true, write: true, execute: true, owner: 'rajin', group: 'dev', mode: '755' },
    children: [
      {
        id: 'dashboard-package',
        name: 'package.json',
        type: 'file',
        path: '/package.json',
        size: 1800,
        lastModified: new Date('2025-06-15T14:00:00Z'),
        created: new Date('2025-02-01T10:00:00Z'),
        extension: 'json',
        language: 'json',
        permissions: { read: true, write: true, execute: false, owner: 'rajin', group: 'dev', mode: '644' },
        content: JSON.stringify(createDashboardPackageJson(), null, 2),
        gitStatus: { status: 'clean', staged: false, conflicted: false, ahead: 0, behind: 0 }
      }
    ]
  };
}

function createDashboardPackageJson(): PackageJson {
  return {
    name: 'analytics-dashboard',
    version: '2.1.0',
    description: 'Real-time analytics dashboard with WebSocket integration',
    main: 'src/index.tsx',
    scripts: {
      'start': 'react-scripts start',
      'build': 'react-scripts build',
      'test': 'react-scripts test',
      'lint': 'eslint src --ext .ts,.tsx'
    },
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      'd3': '^7.8.5',
      'socket.io-client': '^4.7.2',
      '@mui/material': '^5.14.5'
    },
    devDependencies: {
      '@types/react': '^18.2.0',
      '@types/d3': '^7.4.0',
      'typescript': '^5.0.0'
    },
    author: 'Rajin Uddin',
    license: 'MIT'
  };
}

function createDashboardGitRepo(): GitRepository {
  return {
    name: 'analytics-dashboard',
    url: 'https://github.com/rajin-uddin/analytics-dashboard.git',
    branch: 'main',
    branches: [{ name: 'main', current: true, remote: 'origin/main', ahead: 0, behind: 0, lastCommit: 'abc123' }],
    commits: [],
    remotes: [{ name: 'origin', url: 'https://github.com/rajin-uddin/analytics-dashboard.git', type: 'fetch' }],
    status: { clean: true, staged: [], unstaged: [], untracked: [], conflicted: [], ahead: 0, behind: 0 },
    config: { user: { name: 'Rajin Uddin', email: 'rajin@example.com' }, remote: { origin: { url: '', fetch: '' } } }
  };
}

function createDashboardReadme(): string {
  return `# Analytics Dashboard\n\nReal-time analytics dashboard built with React and D3.js`;
}

function createDashboardMetrics(): ProjectMetrics {
  return {
    totalFiles: 35,
    totalLines: 2800,
    codeLines: 2400,
    commentLines: 300,
    blankLines: 100,
    languages: [
      { language: 'TypeScript', files: 20, lines: 1800, percentage: 64.3, bytes: 72000 },
      { language: 'CSS', files: 10, lines: 600, percentage: 21.4, bytes: 24000 },
      { language: 'JavaScript', files: 5, lines: 400, percentage: 14.3, bytes: 16000 }
    ],
    complexity: { cyclomatic: 12.5, cognitive: 10.2, maintainability: 82.1, technical_debt: 1.8, code_smells: 5 },
    dependencies: { total: 180, direct: 12, dev: 8, outdated: 2, vulnerable: 0, size: 35000000, gzipSize: 6800000 },
    performance: { bundleSize: 980000, chunkSizes: {}, loadTime: 0.9, buildTime: 28.5, testTime: 12.3 },
    coverage: { lines: 85.2, functions: 80.1, branches: 78.5, statements: 83.7, files: 90.0, uncoveredFiles: [] },
    quality: { bugs: 1, vulnerabilities: 0, codeSmells: 5, duplicatedLines: 15, rating: 'A', technicalDebt: '1h 45min' }
  };
}

// Simplified implementations for API and Mobile projects...
function createAPIFileStructure(): FileSystemNode { 
  return { id: 'api-root', name: 'node-api', type: 'directory', path: '/', lastModified: new Date(), created: new Date(), permissions: { read: true, write: true, execute: true, owner: 'rajin', group: 'dev', mode: '755' }, children: [] };
}

function createAPIGitRepo(): GitRepository {
  return { name: 'node-api', url: '', branch: 'main', branches: [], commits: [], remotes: [], status: { clean: true, staged: [], unstaged: [], untracked: [], conflicted: [], ahead: 0, behind: 0 }, config: { user: { name: '', email: '' }, remote: { origin: { url: '', fetch: '' } } } };
}

function createAPIPackageJson(): PackageJson {
  return { name: 'node-api', version: '1.0.0', description: '', scripts: {}, dependencies: {}, devDependencies: {}, license: 'MIT' };
}

function createAPIReadme(): string {
  return '# Node.js API\n\nRESTful API server with Express and MongoDB';
}

function createAPIMetrics(): ProjectMetrics {
  return { totalFiles: 25, totalLines: 1800, codeLines: 1500, commentLines: 200, blankLines: 100, languages: [], complexity: { cyclomatic: 8.5, cognitive: 7.2, maintainability: 85.0, technical_debt: 1.2, code_smells: 3 }, dependencies: { total: 95, direct: 8, dev: 6, outdated: 1, vulnerable: 0, size: 25000000, gzipSize: 4500000 }, performance: { bundleSize: 650000, chunkSizes: {}, loadTime: 0.6, buildTime: 15.2, testTime: 8.9 }, coverage: { lines: 92.3, functions: 88.7, branches: 85.1, statements: 90.5, files: 95.0, uncoveredFiles: [] }, quality: { bugs: 0, vulnerabilities: 0, codeSmells: 3, duplicatedLines: 8, rating: 'A', technicalDebt: '1h 10min' } };
}

function createMobileFileStructure(): FileSystemNode {
  return { id: 'mobile-root', name: 'social-app', type: 'directory', path: '/', lastModified: new Date(), created: new Date(), permissions: { read: true, write: true, execute: true, owner: 'rajin', group: 'dev', mode: '755' }, children: [] };
}

function createMobileGitRepo(): GitRepository {
  return { name: 'social-app', url: '', branch: 'main', branches: [], commits: [], remotes: [], status: { clean: true, staged: [], unstaged: [], untracked: [], conflicted: [], ahead: 0, behind: 0 }, config: { user: { name: '', email: '' }, remote: { origin: { url: '', fetch: '' } } } };
}

function createMobilePackageJson(): PackageJson {
  return { name: 'social-app', version: '1.0.0', description: '', scripts: {}, dependencies: {}, devDependencies: {}, license: 'MIT' };
}

function createMobileReadme(): string {
  return '# Social Media App\n\nCross-platform mobile app with React Native';
}

function createMobileMetrics(): ProjectMetrics {
  return { totalFiles: 42, totalLines: 3200, codeLines: 2700, commentLines: 350, blankLines: 150, languages: [], complexity: { cyclomatic: 18.2, cognitive: 15.8, maintainability: 75.3, technical_debt: 3.2, code_smells: 12 }, dependencies: { total: 210, direct: 18, dev: 14, outdated: 4, vulnerable: 1, size: 65000000, gzipSize: 12000000 }, performance: { bundleSize: 2100000, chunkSizes: {}, loadTime: 2.1, buildTime: 68.5, testTime: 15.7 }, coverage: { lines: 78.9, functions: 75.2, branches: 70.8, statements: 77.1, files: 85.0, uncoveredFiles: [] }, quality: { bugs: 3, vulnerabilities: 1, codeSmells: 12, duplicatedLines: 45, rating: 'B', technicalDebt: '4h 15min' } };
}
