'use client';

import { useState, useCallback, useMemo } from 'react';
import { FileSystemNode, ProjectMetrics } from '../types';
import { sampleProjects } from '../data/sample-projects';

export const useFileExplorer = (initialProject?: string) => {
  const [currentProject, setCurrentProject] = useState<string>(
    initialProject || sampleProjects[0]?.id || ''
  );
  const [selectedFile, setSelectedFile] = useState<FileSystemNode | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');

  const project = useMemo(() => 
    sampleProjects.find(p => p.id === currentProject),
    [currentProject]
  );

  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  }, []);

  const getFileContent = useCallback((file: FileSystemNode): string => {
    if (file.content) {
      return file.content;
    }

    // Generate default content based on file type
    const extension = file.extension || file.name.split('.').pop() || '';
    
    switch (extension) {
      case 'tsx':
      case 'jsx':
        return generateReactComponent(file.name);
      case 'ts':
      case 'js':
        return generateJavaScriptModule(file.name);
      case 'css':
        return generateCSS(file.name);
      case 'json':
        return generateJSON(file.name);
      case 'md':
        return generateMarkdown(file.name);
      case 'py':
        return generatePython(file.name);
      case 'go':
        return generateGo(file.name);
      case 'rs':
        return generateRust(file.name);
      default:
        return `// ${file.name}\n// File content would be displayed here\n`;
    }
  }, []);

  const getProjectInsights = useCallback((): ProjectMetrics | null => {
    return project?.metrics || null;
  }, [project]);

  const searchFiles = useCallback((query: string): FileSystemNode[] => {
    if (!project || !query.trim()) return [];

    const searchInNode = (node: FileSystemNode): FileSystemNode[] => {
      const results: FileSystemNode[] = [];
      
      if (node.name.toLowerCase().includes(query.toLowerCase())) {
        results.push(node);
      }

      if (node.children) {
        for (const child of node.children) {
          results.push(...searchInNode(child));
        }
      }

      return results;
    };

    return searchInNode(project.root);
  }, [project]);

  return {
    currentProject,
    selectedFile,
    expandedFolders,
    searchQuery,
    project,
    setCurrentProject,
    setSelectedFile,
    toggleFolder,
    setSearchQuery,
    getFileContent,
    getProjectInsights,
    searchFiles
  };
};

// Content generators for different file types
const generateReactComponent = (filename: string): string => {
  const componentName = filename.replace(/\.(tsx|jsx)$/, '').split('-').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('');

  return `import React from 'react';

interface ${componentName}Props {
  className?: string;
}

export const ${componentName}: React.FC<${componentName}Props> = ({
  className = ''
}) => {
  return (
    <div className={\`${componentName.toLowerCase()} \${className}\`}>
      <h1>Welcome to ${componentName}</h1>
      <p>This is a sample component for demonstration purposes.</p>
    </div>
  );
};

export default ${componentName};
`;
};

const generateJavaScriptModule = (filename: string): string => {
  const moduleName = filename.replace(/\.(ts|js)$/, '');
  
  return `/**
 * ${moduleName} module
 * Generated for demonstration purposes
 */

export interface ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Config {
  enabled: boolean;
  options: Record<string, unknown>;
}

export class ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} {
  private config: ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Config;

  constructor(config: ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Config) {
    this.config = config;
  }

  public initialize(): void {
    console.log('Initializing ${moduleName}...');
  }

  public execute(): Promise<void> {
    return new Promise((resolve) => {
      // Implementation would go here
      setTimeout(resolve, 100);
    });
  }
}

export default ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)};
`;
};

const generateCSS = (filename: string): string => {
  return `/* ${filename} */
/* Generated stylesheet for demonstration */

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  padding: 1rem 0;
}

.content {
  padding: 2rem 0;
  min-height: 400px;
}

.footer {
  background-color: #f8f9fa;
  padding: 2rem 0;
  text-align: center;
  color: #6c757d;
}

@media (max-width: 768px) {
  .container {
    padding: 0 0.5rem;
  }
  
  .content {
    padding: 1rem 0;
  }
}
`;
};

const generateJSON = (filename: string): string => {
  if (filename === 'package.json') {
    return JSON.stringify({
      "name": "sample-project",
      "version": "1.0.0",
      "description": "A sample project for demonstration",
      "main": "index.js",
      "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint",
        "test": "jest"
      },
      "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "next": "^15.3.3"
      },
      "devDependencies": {
        "@types/react": "^18.2.0",
        "typescript": "^5.0.0",
        "eslint": "^8.0.0"
      }
    }, null, 2);
  }

  return JSON.stringify({
    "name": filename.replace('.json', ''),
    "description": "Sample configuration file",
    "version": "1.0.0",
    "settings": {
      "enabled": true,
      "debug": false,
      "timeout": 5000
    }
  }, null, 2);
};

const generateMarkdown = (filename: string): string => {
  if (filename.toLowerCase() === 'readme.md') {
    return `# Project Name

A brief description of what this project does and who it's for.

## Features

- ✨ Modern and responsive design
- 🚀 Fast performance
- 🔧 Easy to customize
- 📱 Mobile-friendly

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/username/project-name.git
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Run the development server
\`\`\`bash
npm run dev
\`\`\`

## Usage

Describe how to use your project here.

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

[MIT](https://choosealicense.com/licenses/mit/)
`;
  }

  return `# ${filename.replace('.md', '')}

This is a sample markdown file for demonstration purposes.

## Overview

This document contains information about the ${filename.replace('.md', '')} component.

## Usage

Instructions for using this component would go here.

## Examples

\`\`\`javascript
// Example code would be shown here
const example = true;
\`\`\`
`;
};

const generatePython = (filename: string): string => {
  const moduleName = filename.replace('.py', '');
  
  return `"""
${moduleName}.py
Generated Python module for demonstration
"""

import sys
import os
from typing import Dict, List, Optional


class ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}:
    """
    A sample Python class for demonstration purposes.
    """
    
    def __init__(self, config: Optional[Dict] = None):
        self.config = config or {}
        self._initialized = False
    
    def initialize(self) -> None:
        """Initialize the ${moduleName} instance."""
        print(f"Initializing {moduleName}...")
        self._initialized = True
    
    def process(self, data: List) -> List:
        """
        Process the given data and return results.
        
        Args:
            data: List of items to process
            
        Returns:
            Processed data as a list
        """
        if not self._initialized:
            self.initialize()
        
        # Sample processing logic
        return [item for item in data if item is not None]
    
    def __str__(self) -> str:
        return f"${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}(initialized={self._initialized})"


def main():
    """Main function for demonstration."""
    instance = ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}()
    instance.initialize()
    
    sample_data = [1, 2, None, 4, 5]
    result = instance.process(sample_data)
    print(f"Processed data: {result}")


if __name__ == "__main__":
    main()
`;
};

const generateGo = (filename: string): string => {
  const packageName = filename.replace('.go', '');
  
  return `package ${packageName}

import (
    "fmt"
    "log"
    "time"
)

// ${packageName.charAt(0).toUpperCase() + packageName.slice(1)}Config represents configuration options
type ${packageName.charAt(0).toUpperCase() + packageName.slice(1)}Config struct {
    Enabled bool
    Timeout time.Duration
    Options map[string]interface{}
}

// ${packageName.charAt(0).toUpperCase() + packageName.slice(1)} represents the main service
type ${packageName.charAt(0).toUpperCase() + packageName.slice(1)} struct {
    config *${packageName.charAt(0).toUpperCase() + packageName.slice(1)}Config
    initialized bool
}

// New${packageName.charAt(0).toUpperCase() + packageName.slice(1)} creates a new instance
func New${packageName.charAt(0).toUpperCase() + packageName.slice(1)}(config *${packageName.charAt(0).toUpperCase() + packageName.slice(1)}Config) *${packageName.charAt(0).toUpperCase() + packageName.slice(1)} {
    return &${packageName.charAt(0).toUpperCase() + packageName.slice(1)}{
        config: config,
        initialized: false,
    }
}

// Initialize sets up the service
func (s *${packageName.charAt(0).toUpperCase() + packageName.slice(1)}) Initialize() error {
    if s.initialized {
        return fmt.Errorf("service already initialized")
    }
    
    log.Printf("Initializing %s service...", "${packageName}")
    s.initialized = true
    
    return nil
}

// Process handles the main business logic
func (s *${packageName.charAt(0).toUpperCase() + packageName.slice(1)}) Process(data []interface{}) ([]interface{}, error) {
    if !s.initialized {
        if err := s.Initialize(); err != nil {
            return nil, err
        }
    }
    
    var result []interface{}
    for _, item := range data {
        if item != nil {
            result = append(result, item)
        }
    }
    
    return result, nil
}

// Close cleans up resources
func (s *${packageName.charAt(0).toUpperCase() + packageName.slice(1)}) Close() error {
    s.initialized = false
    log.Printf("${packageName.charAt(0).toUpperCase() + packageName.slice(1)} service closed")
    return nil
}
`;
};

const generateRust = (filename: string): string => {
  const moduleName = filename.replace('.rs', '');
  
  return `//! ${moduleName} module
//! Generated Rust code for demonstration purposes

use std::collections::HashMap;
use std::fmt;

#[derive(Debug, Clone)]
pub struct ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Config {
    pub enabled: bool,
    pub timeout_ms: u64,
    pub options: HashMap<String, String>,
}

impl Default for ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Config {
    fn default() -> Self {
        Self {
            enabled: true,
            timeout_ms: 5000,
            options: HashMap::new(),
        }
    }
}

pub struct ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} {
    config: ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Config,
    initialized: bool,
}

impl ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} {
    /// Creates a new instance with the given configuration
    pub fn new(config: ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Config) -> Self {
        Self {
            config,
            initialized: false,
        }
    }

    /// Initializes the service
    pub fn initialize(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        if self.initialized {
            return Err("Service already initialized".into());
        }

        println!("Initializing {} service...", "${moduleName}");
        self.initialized = true;
        
        Ok(())
    }

    /// Processes the given data
    pub fn process<T>(&mut self, data: Vec<Option<T>>) -> Result<Vec<T>, Box<dyn std::error::Error>> {
        if !self.initialized {
            self.initialize()?;
        }

        let result: Vec<T> = data.into_iter().filter_map(|item| item).collect();
        Ok(result)
    }

    /// Returns whether the service is initialized
    pub fn is_initialized(&self) -> bool {
        self.initialized
    }
}

impl fmt::Display for ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}(initialized={})", self.initialized)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_initialization() {
        let config = ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Config::default();
        let mut service = ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}::new(config);
        
        assert!(!service.is_initialized());
        assert!(service.initialize().is_ok());
        assert!(service.is_initialized());
    }

    #[test]
    fn test_process() {
        let config = ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Config::default();
        let mut service = ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}::new(config);
        
        let data = vec![Some(1), None, Some(3), Some(4)];
        let result = service.process(data).unwrap();
        
        assert_eq!(result, vec![1, 3, 4]);
    }
}
`;
};
