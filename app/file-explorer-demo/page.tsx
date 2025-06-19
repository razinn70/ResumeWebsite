'use client';

import React from 'react';
import { FileExplorer } from '../../components/file-explorer';

export default function FileExplorerDemo() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">File System Explorer</h1>
          <p className="text-gray-400">
            A fully functional file system interface that makes project exploration feel like actual code archaeology.
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <FileExplorer 
            initialProject="portfolio-website"
            className="h-full"
          />
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Features</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Tree view with expand/collapse</li>
              <li>• Syntax-highlighted code viewer</li>
              <li>• Git integration & history</li>
              <li>• Search functionality</li>
              <li>• Project insights & metrics</li>
              <li>• Terminal simulation</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">File Types Supported</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• TypeScript/JavaScript</li>
              <li>• React Components (TSX/JSX)</li>
              <li>• CSS/SCSS</li>
              <li>• JSON Configuration</li>
              <li>• Markdown</li>
              <li>• Python, Go, Rust</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Git Features</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Branch management</li>
              <li>• Commit history</li>
              <li>• File change tracking</li>
              <li>• Diff visualization</li>
              <li>• Status indicators</li>
              <li>• Author information</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Code metrics</li>
              <li>• Performance insights</li>
              <li>• Test coverage</li>
              <li>• Bundle analysis</li>
              <li>• Quality metrics</li>
              <li>• Technology stack</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
