'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Copy, 
  Download, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Minimize2,
  FileText,
  GitBranch,
  Clock
} from 'lucide-react';
import { FileSystemNode, ProjectStructure } from '../types';

interface CodeViewerProps {
  file: FileSystemNode;
  content: string;
  project?: ProjectStructure;
}

interface CodeViewerState {
  fontSize: number;
  lineNumbers: boolean;
  wordWrap: boolean;
  highlightedLines: number[];
  searchTerm: string;
  searchMatches: SearchMatch[];
  currentMatch: number;
  isFullscreen: boolean;
  showMinimap: boolean;
}

interface SearchMatch {
  line: number;
  start: number;
  end: number;
  text: string;
}

const getLanguageFromExtension = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'jsx',
    'ts': 'typescript',
    'tsx': 'tsx',
    'py': 'python',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'cs': 'csharp',
    'php': 'php',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'json': 'json',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml',
    'md': 'markdown',
    'sql': 'sql',
    'sh': 'bash',
    'bash': 'bash',
    'zsh': 'bash',
    'ps1': 'powershell',
    'dockerfile': 'dockerfile',
    'makefile': 'makefile'
  };

  return languageMap[extension] || 'text';
};

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '';
  
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const CodeViewer: React.FC<CodeViewerProps> = ({ file, content }) => {
  const [state, setState] = useState<CodeViewerState>({
    fontSize: 14,
    lineNumbers: true,
    wordWrap: false,
    highlightedLines: [],
    searchTerm: '',
    searchMatches: [],
    currentMatch: 0,
    isFullscreen: false,
    showMinimap: false
  });

  const language = useMemo(() => getLanguageFromExtension(file.name), [file.name]);
  const lines = useMemo(() => content.split('\n'), [content]);

  // Search functionality
  const searchMatches = useMemo(() => {
    if (!state.searchTerm) return [];
    
    const matches: SearchMatch[] = [];
    const searchRegex = new RegExp(state.searchTerm, 'gi');
    
    lines.forEach((line, lineIndex) => {
      let match;
      while ((match = searchRegex.exec(line)) !== null) {
        matches.push({
          line: lineIndex + 1,
          start: match.index,
          end: match.index + match[0].length,
          text: match[0]
        });
      }
    });
    
    return matches;
  }, [state.searchTerm, lines]);

  useEffect(() => {
    setState(prev => ({ ...prev, searchMatches, currentMatch: 0 }));
  }, [searchMatches]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      // Show success notification
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const adjustFontSize = (delta: number) => {
    setState(prev => ({
      ...prev,
      fontSize: Math.max(8, Math.min(24, prev.fontSize + delta))
    }));
  };

  const toggleLineNumbers = () => {
    setState(prev => ({ ...prev, lineNumbers: !prev.lineNumbers }));
  };

  const toggleWordWrap = () => {
    setState(prev => ({ ...prev, wordWrap: !prev.wordWrap }));
  };

  const navigateSearch = (direction: 'next' | 'prev') => {
    if (searchMatches.length === 0) return;
    
    setState(prev => {
      let newMatch = prev.currentMatch;
      if (direction === 'next') {
        newMatch = (prev.currentMatch + 1) % searchMatches.length;
      } else {
        newMatch = prev.currentMatch === 0 ? searchMatches.length - 1 : prev.currentMatch - 1;
      }
      return { ...prev, currentMatch: newMatch };
    });
  };

  const renderLineNumbers = () => {
    if (!state.lineNumbers) return null;
    
    return (
      <div className="select-none text-right pr-4 text-gray-500 text-sm leading-6 font-mono">
        {lines.map((_, index) => (
          <div key={index + 1} className="px-2">
            {index + 1}
          </div>
        ))}
      </div>
    );
  };
  const customStyle = {
    fontSize: `${state.fontSize}px`,
    lineHeight: '1.5',
    margin: 0,
    padding: '1rem',
    overflow: state.wordWrap ? 'hidden' : 'auto',
    whiteSpace: state.wordWrap ? 'pre-wrap' : 'pre',
    wordBreak: state.wordWrap ? 'break-word' : 'normal',
    backgroundColor: '#1a1a1a',
    color: '#e5e5e5'
  } as React.CSSProperties;

  return (
    <div className={`h-full flex flex-col bg-gray-900 ${state.isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-lg font-medium text-white">{file.name}</h2>
              <p className="text-sm text-gray-400">{file.path}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }))}
              className="p-2 rounded hover:bg-gray-700 transition-colors"
              title={state.isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {state.isFullscreen ? 
                <Minimize2 className="w-4 h-4" /> : 
                <Maximize2 className="w-4 h-4" />
              }
            </button>
          </div>
        </div>

        {/* File Info */}
        <div className="flex items-center space-x-6 text-sm text-gray-400">
          <span className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Modified: {formatDate(file.lastModified)}</span>
          </span>
          {file.size && (
            <span>{formatFileSize(file.size)}</span>
          )}
          <span>{lines.length} lines</span>
          <span className="capitalize">{language}</span>
          {file.gitStatus && (
            <span className="flex items-center space-x-1">
              <GitBranch className="w-4 h-4" />
              <span className="capitalize">{file.gitStatus.status}</span>
            </span>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="flex items-center space-x-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search in file..."
                value={state.searchTerm}
                onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="pl-8 pr-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {searchMatches.length > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-400">
                  {state.currentMatch + 1} of {searchMatches.length}
                </span>
                <button
                  onClick={() => navigateSearch('prev')}
                  className="p-1 rounded hover:bg-gray-700"
                  disabled={searchMatches.length === 0}
                >
                  ↑
                </button>
                <button
                  onClick={() => navigateSearch('next')}
                  className="p-1 rounded hover:bg-gray-700"
                  disabled={searchMatches.length === 0}
                >
                  ↓
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Font size controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => adjustFontSize(-1)}
              className="p-1 rounded hover:bg-gray-700"
              title="Decrease font size"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-400 w-8 text-center">{state.fontSize}</span>
            <button
              onClick={() => adjustFontSize(1)}
              className="p-1 rounded hover:bg-gray-700"
              title="Increase font size"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* View options */}
          <button
            onClick={toggleLineNumbers}
            className={`p-1 rounded transition-colors ${
              state.lineNumbers ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
            }`}
            title="Toggle line numbers"
          >
            123
          </button>

          <button
            onClick={toggleWordWrap}
            className={`p-1 rounded transition-colors ${
              state.wordWrap ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
            }`}
            title="Toggle word wrap"
          >
            ↩
          </button>

          {/* Actions */}
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-gray-700"
            title="Copy to clipboard"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            className="p-1 rounded hover:bg-gray-700"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-hidden bg-gray-900">
        <div className="h-full flex">
          {/* Line numbers */}
          {renderLineNumbers()}
            {/* Code */}
          <div className="flex-1 overflow-auto">
            <div className="relative">
              <pre 
                className="text-gray-300 p-4 overflow-auto"
                style={customStyle}
              >
                <code className={`language-${language}`}>
                  {content.split('\n').map((line, index) => {
                    const lineNumber = index + 1;
                    let className = '';
                    
                    // Highlight search matches
                    if (searchMatches.length > 0) {
                      const lineMatches = searchMatches.filter(match => match.line === lineNumber);
                      if (lineMatches.length > 0) {
                        className += ' bg-yellow-900 bg-opacity-30';
                      }
                      
                      // Highlight current match
                      const currentMatchLine = searchMatches[state.currentMatch]?.line;
                      if (lineNumber === currentMatchLine) {
                        className += ' bg-yellow-600 bg-opacity-50';
                      }
                    }
                    
                    // Highlight selected lines
                    if (state.highlightedLines.includes(lineNumber)) {
                      className += ' bg-blue-600 bg-opacity-20';
                    }
                    
                    return (
                      <div key={lineNumber} className={className}>
                        {line || ' '}
                      </div>
                    );
                  })}
                </code>
              </pre>
            </div>
          </div>

          {/* Minimap */}
          {state.showMinimap && (
            <div className="w-24 bg-gray-800 border-l border-gray-700 overflow-hidden">
              <div className="text-xs text-gray-400 p-2 border-b border-gray-700">
                Minimap
              </div>
              <div className="h-full overflow-hidden relative">
                <div 
                  className="text-xs font-mono leading-none text-gray-600"
                  style={{ fontSize: '2px', lineHeight: '3px' }}
                >
                  {lines.map((line, index) => (
                    <div key={index} className="whitespace-nowrap overflow-hidden">
                      {line || ' '}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-3 py-1 text-sm text-gray-400 flex justify-between">
        <div className="flex items-center space-x-4">
          <span>Line 1, Column 1</span>
          <span>{language}</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center space-x-4">
          {file.metadata?.complexity && (
            <span>Complexity: {file.metadata.complexity}</span>
          )}
          {file.metadata?.testCoverage && (
            <span>Coverage: {file.metadata.testCoverage}%</span>
          )}
        </div>
      </div>
    </div>
  );
};
