'use client';

import React, { useState } from 'react';
import { Search, FileText, Code, Folder, X } from 'lucide-react';
import { ProjectStructure, FileSystemNode } from '../types';

interface SearchPanelProps {
  project: ProjectStructure;
  onFileSelect: (file: FileSystemNode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({ 
  project, 
  onFileSelect, 
  searchQuery, 
  onSearchChange 
}) => {
  const [searchResults, setSearchResults] = useState<FileSystemNode[]>([]);
  const [searchType, setSearchType] = useState<'all' | 'files' | 'code'>('all');

  const searchFiles = (query: string, type: 'all' | 'files' | 'code' = 'all') => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results: FileSystemNode[] = [];
    const searchInNode = (node: FileSystemNode) => {
      const matchesQuery = node.name.toLowerCase().includes(query.toLowerCase());
      const isFile = node.type === 'file';
      const isCodeFile = isFile && /\.(js|jsx|ts|tsx|py|go|rs|java|c|cpp|cs|php|rb|vue|svelte)$/i.test(node.name);
      
      let shouldInclude = false;
      if (type === 'all' && matchesQuery) shouldInclude = true;
      if (type === 'files' && isFile && matchesQuery) shouldInclude = true;
      if (type === 'code' && isCodeFile && matchesQuery) shouldInclude = true;

      if (shouldInclude) {
        results.push(node);
      }

      if (node.children) {
        node.children.forEach(searchInNode);
      }
    };

    searchInNode(project.root);
    setSearchResults(results.slice(0, 50)); // Limit results
  };
  const handleSearch = (query: string) => {
    onSearchChange(query);
    searchFiles(query, searchType);
  };

  const getFileIcon = (node: FileSystemNode) => {
    if (node.type === 'directory') return <Folder className="w-4 h-4 text-blue-400" />;
    
    const extension = node.name.split('.').pop()?.toLowerCase();
    if (['js', 'jsx', 'ts', 'tsx', 'py', 'go', 'rs', 'java', 'c', 'cpp'].includes(extension || '')) {
      return <Code className="w-4 h-4 text-green-400" />;
    }
    return <FileText className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex space-x-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'files', label: 'Files' },
            { id: 'code', label: 'Code' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setSearchType(type.id as 'all' | 'files' | 'code');
                searchFiles(searchQuery, type.id as 'all' | 'files' | 'code');
              }}
              className={`px-3 py-1 text-sm rounded ${
                searchType === type.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1 max-h-96 overflow-y-auto">
        {searchResults.length === 0 && searchQuery ? (
          <div className="text-gray-400 text-sm p-4 text-center">
            No results found for "{searchQuery}"
          </div>
        ) : (
          searchResults.map((file, index) => (
            <button
              key={`${file.path}-${index}`}
              onClick={() => onFileSelect(file)}
              className="w-full flex items-center space-x-2 p-2 hover:bg-gray-700 rounded text-left"
            >
              {getFileIcon(file)}
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white truncate">{file.name}</div>
                <div className="text-xs text-gray-400 truncate">{file.path}</div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
