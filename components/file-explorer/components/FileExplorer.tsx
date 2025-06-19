'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, 
  File, 
  GitBranch, 
  Search, 
  Menu, 
  X,
  Terminal,
  BarChart3
} from 'lucide-react';
import { TreeView } from './TreeView';
import { CodeViewer } from './CodeViewer';
import { GitPanel } from './GitPanel';
import { ProjectInsights } from './ProjectInsights';
import { TerminalPanel } from './TerminalPanel';
import { SearchPanel } from './SearchPanel';
import { useFileExplorer } from '../hooks/useFileExplorer';
import { useResponsive } from '../hooks/useResponsive';
import { FileSystemNode, ExplorerTab } from '../types';
import { sampleProjects } from '../data/sample-projects';

interface FileExplorerProps {
  initialProject?: string;
  className?: string;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  initialProject = 'portfolio-website',
  className = ''
}) => {
  const {
    currentProject,
    selectedFile,
    expandedFolders,
    searchQuery,
    setCurrentProject,
    setSelectedFile,
    toggleFolder,
    setSearchQuery,
    getFileContent,
    getProjectInsights
  } = useFileExplorer(initialProject);
  const { isMobile } = useResponsive();
  
  const [activeTab, setActiveTab] = useState<ExplorerTab>('files');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const project = sampleProjects.find(p => p.id === currentProject);

  const tabs: { id: ExplorerTab; label: string; icon: React.ReactNode }[] = [
    { id: 'files', label: 'Files', icon: <Folder className="w-4 h-4" /> },
    { id: 'git', label: 'Git', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'search', label: 'Search', icon: <Search className="w-4 h-4" /> },
    { id: 'insights', label: 'Insights', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'terminal', label: 'Terminal', icon: <Terminal className="w-4 h-4" /> }
  ];

  const handleFileSelect = useCallback((file: FileSystemNode) => {
    setSelectedFile(file);
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [setSelectedFile, isMobile]);

  const renderTabContent = () => {
    if (!project) return null;

    switch (activeTab) {
      case 'files':
        return (
          <TreeView
            project={project}
            expandedFolders={expandedFolders}
            selectedFile={selectedFile}
            onToggleFolder={toggleFolder}
            onFileSelect={handleFileSelect}
            searchQuery={searchQuery}
          />
        );
      
      case 'git':
        return (
          <GitPanel
            repository={project.gitRepository}
            onFileSelect={handleFileSelect}
          />
        );
      
      case 'search':
        return (
          <SearchPanel
            project={project}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFileSelect={handleFileSelect}
          />
        );
      
      case 'insights':
        return (
          <ProjectInsights
            project={project}
            insights={getProjectInsights()}
          />
        );
      
      case 'terminal':        return (
          <TerminalPanel
            project={project}
            height={300}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`flex h-screen bg-gray-900 text-white ${className}`}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg shadow-lg"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <motion.div
            initial={isMobile ? { x: -320 } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -320 } : undefined}
            transition={{ type: 'spring', damping: 20 }}
            className={`
              ${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'relative'}
              w-80 bg-gray-800 border-r border-gray-700 flex flex-col
            `}
          >
            {/* Project Selector */}
            <div className="p-4 border-b border-gray-700">
              <select
                value={currentProject}
                onChange={(e) => setCurrentProject(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
              >
                {sampleProjects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-700">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-3 px-2 text-xs
                    ${activeTab === tab.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }
                    transition-colors duration-200
                  `}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              {renderTabContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedFile ? (
          <CodeViewer
            file={selectedFile}
            content={getFileContent(selectedFile)}
            project={project}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <File className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No file selected</p>
              <p className="text-sm">Select a file from the explorer to view its contents</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
