'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Folder, 
  FolderOpen,
  File,
  FileText,
  FileCode,
  Image,
  Settings,
  Package,
  GitBranch,
  Database,
  Globe,
  Lock,
  Eye,
  EyeOff,
  MoreHorizontal
} from 'lucide-react';
import { Project, FileSystemNode } from '../types';

interface TreeViewProps {
  project: Project;
  expandedFolders: Set<string>;
  selectedFile: FileSystemNode | null;
  searchQuery: string;
  onToggleFolder: (folderId: string) => void;
  onFileSelect: (file: FileSystemNode) => void;
}

interface TreeNodeProps {
  node: FileSystemNode;
  level: number;
  isExpanded: boolean;
  isSelected: boolean;
  searchQuery: string;
  onToggle: () => void;
  onSelect: () => void;
  onContextMenu: (e: React.MouseEvent, node: FileSystemNode) => void;
}

const getFileIcon = (node: FileSystemNode) => {
  if (node.type === 'directory') {
    return node.isExpanded ? 
      <FolderOpen className="w-4 h-4 text-blue-400" /> : 
      <Folder className="w-4 h-4 text-blue-400" />;
  }

  const extension = node.extension || node.name.split('.').pop()?.toLowerCase() || '';
  const name = node.name.toLowerCase();

  // Special files
  if (name === 'package.json') return <Package className="w-4 h-4 text-green-400" />;
  if (name === 'readme.md') return <FileText className="w-4 h-4 text-blue-400" />;
  if (name === '.gitignore' || name === '.gitattributes') return <GitBranch className="w-4 h-4 text-orange-400" />;
  if (name.includes('config') || name.includes('.env')) return <Settings className="w-4 h-4 text-gray-400" />;
  if (name.includes('lock')) return <Lock className="w-4 h-4 text-yellow-400" />;

  // By extension
  switch (extension) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return <FileCode className="w-4 h-4 text-yellow-400" />;
    case 'css':
    case 'scss':
    case 'sass':
    case 'less':
      return <FileCode className="w-4 h-4 text-blue-400" />;
    case 'html':
    case 'htm':
      return <Globe className="w-4 h-4 text-orange-400" />;
    case 'json':
      return <FileCode className="w-4 h-4 text-green-400" />;
    case 'md':
    case 'mdx':
      return <FileText className="w-4 h-4 text-blue-400" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'webp':
      return <Image className="w-4 h-4 text-purple-400" aria-label="Image file" />;
    case 'sql':
    case 'db':
      return <Database className="w-4 h-4 text-blue-400" />;
    case 'py':
      return <FileCode className="w-4 h-4 text-blue-400" />;
    case 'go':
      return <FileCode className="w-4 h-4 text-cyan-400" />;
    case 'rs':
      return <FileCode className="w-4 h-4 text-orange-400" />;
    case 'java':
      return <FileCode className="w-4 h-4 text-red-400" />;
    case 'php':
      return <FileCode className="w-4 h-4 text-purple-400" />;
    case 'rb':
      return <FileCode className="w-4 h-4 text-red-400" />;
    default:
      return <File className="w-4 h-4 text-gray-400" />;
  }
};

const getFileSize = (size?: number): string => {
  if (!size) return '';
  
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)}MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)}GB`;
};

const getGitStatusIndicator = (status?: string) => {
  switch (status) {
    case 'modified':
      return <div className="w-2 h-2 bg-yellow-400 rounded-full" />;
    case 'added':
      return <div className="w-2 h-2 bg-green-400 rounded-full" />;
    case 'deleted':
      return <div className="w-2 h-2 bg-red-400 rounded-full" />;
    case 'renamed':
      return <div className="w-2 h-2 bg-blue-400 rounded-full" />;
    case 'untracked':
      return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    default:
      return null;
  }
};

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  level,
  isExpanded,
  isSelected,
  searchQuery,
  onToggle,
  onSelect,
  onContextMenu
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const isHighlighted = searchQuery && 
    node.name.toLowerCase().includes(searchQuery.toLowerCase());
  
  const hasChildren = node.children && node.children.length > 0;
  
  const paddingLeft = level * 16 + 8;

  return (
    <div>
      <motion.div
        className={`
          flex items-center py-1 px-2 cursor-pointer group relative
          ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}
          ${isHighlighted ? 'bg-yellow-900 bg-opacity-30' : ''}
        `}
        style={{ paddingLeft }}
        onClick={node.type === 'directory' ? onToggle : onSelect}
        onContextMenu={(e) => onContextMenu(e, node)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ x: 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Expand/collapse icon for directories */}
        <div className="w-4 h-4 flex items-center justify-center mr-1">
          {hasChildren && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-3 h-3 text-gray-400" />
            </motion.div>
          )}
        </div>

        {/* File/folder icon */}
        <div className="mr-2">
          {getFileIcon({ ...node, isExpanded })}
        </div>

        {/* File name */}
        <span className="text-sm truncate flex-1 min-w-0">
          {searchQuery ? (
            <HighlightedText text={node.name} highlight={searchQuery} />
          ) : (
            node.name
          )}
        </span>

        {/* Git status indicator */}
        {node.gitStatus && (
          <div className="ml-2">
            {getGitStatusIndicator(node.gitStatus.status)}
          </div>
        )}

        {/* File size (only show on hover for files) */}
        {node.type === 'file' && isHovered && node.size && (
          <span className="ml-2 text-xs text-gray-400 tabular-nums">
            {getFileSize(node.size)}
          </span>
        )}

        {/* Context menu button */}
        {isHovered && (
          <button
            className="ml-2 p-1 rounded hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onContextMenu(e, node);
            }}
          >
            <MoreHorizontal className="w-3 h-3" />
          </button>
        )}
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {node.type === 'directory' && isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            {node.children!.map((child) => (
              <TreeNodeContainer
                key={child.id}
                node={child}
                level={level + 1}
                searchQuery={searchQuery}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Container component to handle the connection to the parent state
const TreeNodeContainer: React.FC<{
  node: FileSystemNode;
  level: number;
  searchQuery: string;
}> = ({ node, level, searchQuery }) => {
  // This would connect to the parent's state management
  // For now, we'll use local state
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSelect = () => {
    setIsSelected(true);
    // This would call the parent's onFileSelect
  };

  const handleContextMenu = (e: React.MouseEvent, node: FileSystemNode) => {
    e.preventDefault();
    // Handle context menu
    console.log('Context menu for:', node.name);
  };

  return (
    <TreeNode
      node={node}
      level={level}
      isExpanded={isExpanded}
      isSelected={isSelected}
      searchQuery={searchQuery}
      onToggle={handleToggle}
      onSelect={handleSelect}
      onContextMenu={handleContextMenu}
    />
  );
};

const HighlightedText: React.FC<{ text: string; highlight: string }> = ({
  text,
  highlight
}) => {
  if (!highlight) return <>{text}</>;

  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  
  return (
    <>
      {parts.map((part, index) => (
        <span
          key={index}
          className={
            part.toLowerCase() === highlight.toLowerCase()
              ? 'bg-yellow-400 text-black px-1 rounded'
              : ''
          }
        >
          {part}
        </span>
      ))}
    </>
  );
};

export const TreeView: React.FC<TreeViewProps> = ({
  project,
  expandedFolders,
  selectedFile,
  searchQuery,
  onToggleFolder,
  onFileSelect
}) => {
  const [showHidden, setShowHidden] = useState(false);

  const filteredNodes = useMemo(() => {
    const filterNode = (node: FileSystemNode): FileSystemNode | null => {
      // Hide hidden files unless explicitly shown
      if (!showHidden && node.name.startsWith('.') && node.name !== '.env') {
        return null;
      }

      if (node.type === 'directory' && node.children) {
        const filteredChildren = node.children
          .map(child => filterNode(child))
          .filter(Boolean) as FileSystemNode[];

        return {
          ...node,
          children: filteredChildren
        };
      }

      return node;
    };

    return project.root.children
      ?.map(child => filterNode(child))
      .filter(Boolean) as FileSystemNode[] || [];
  }, [project.root.children, showHidden]);

  const handleContextMenu = (e: React.MouseEvent, node: FileSystemNode) => {
    e.preventDefault();
    // Context menu implementation would go here
    console.log('Context menu for:', node.name);
  };

  const renderNode = (node: FileSystemNode, level: number = 0): React.ReactNode => {
    const isExpanded = expandedFolders.has(node.id);
    const isSelected = selectedFile?.id === node.id;

    return (
      <TreeNode
        key={node.id}
        node={node}
        level={level}
        isExpanded={isExpanded}
        isSelected={isSelected}
        searchQuery={searchQuery}
        onToggle={() => onToggleFolder(node.id)}
        onSelect={() => onFileSelect(node)}
        onContextMenu={handleContextMenu}
      />
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-2 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-300">{project.name}</h3>
        <button
          onClick={() => setShowHidden(!showHidden)}
          className="p-1 rounded hover:bg-gray-700 transition-colors"
          title={showHidden ? 'Hide hidden files' : 'Show hidden files'}
        >
          {showHidden ? 
            <EyeOff className="w-4 h-4 text-gray-400" /> : 
            <Eye className="w-4 h-4 text-gray-400" />
          }
        </button>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-auto">
        <div className="py-1">
          {filteredNodes.map(node => renderNode(node))}
        </div>
      </div>

      {/* Stats */}
      <div className="p-2 border-t border-gray-700 text-xs text-gray-400">
        {project.metrics && (
          <div className="space-y-1">            <div className="flex justify-between">
              <span>Files:</span>
              <span>{project.metrics.totalFiles}</span>
            </div>
            <div className="flex justify-between">
              <span>Lines:</span>
              <span>{project.metrics.totalLines.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Size:</span>
              <span>{getFileSize(project.metrics.languages.reduce((sum, lang) => sum + lang.bytes, 0))}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
