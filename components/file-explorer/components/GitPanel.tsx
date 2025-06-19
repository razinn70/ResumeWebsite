'use client';

import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  GitMerge, 
  Clock,
  User,
  FileText,
  Plus,
  Minus,
  RotateCcw
} from 'lucide-react';
import { ProjectStructure, GitCommit as GitCommitType } from '../types';

interface GitPanelProps {
  project: ProjectStructure;
}

export const GitPanel: React.FC<GitPanelProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState<'commits' | 'branches' | 'status'>('commits');

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'modified': return 'text-yellow-400';
      case 'added': return 'text-green-400';
      case 'deleted': return 'text-red-400';
      case 'renamed': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'modified': return <RotateCcw className="w-3 h-3" />;
      case 'added': return <Plus className="w-3 h-3" />;
      case 'deleted': return <Minus className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  const renderCommits = () => (
    <div className="space-y-3">
      {project.git?.commits?.slice(0, 20).map((commit: GitCommitType) => (
        <div key={commit.hash} className="border-l-2 border-gray-600 pl-4 pb-4">
          <div className="flex items-start space-x-3">
            <div className="bg-gray-700 rounded-full p-1 -ml-6 mt-1">
              <GitCommit className="w-3 h-3 text-gray-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-white truncate">
                  {commit.message}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {commit.hash.substring(0, 7)}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{commit.author.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(commit.date)}</span>
                </div>
                <div className="flex space-x-2">
                  <span className="text-green-400">+{commit.stats?.additions || 0}</span>
                  <span className="text-red-400">-{commit.stats?.deletions || 0}</span>
                </div>
              </div>
              {commit.files && commit.files.length > 0 && (
                <div className="mt-2 space-y-1">
                  {commit.files.slice(0, 3).map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      <span className={getStatusColor(file.status || 'modified')}>
                        {getStatusIcon(file.status || 'modified')}
                      </span>
                      <span className="text-gray-300 truncate">{file.path}</span>
                    </div>
                  ))}
                  {commit.files.length > 3 && (
                    <div className="text-xs text-gray-400">
                      +{commit.files.length - 3} more files
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderBranches = () => (
    <div className="space-y-2">
      {project.git?.branches?.map((branch) => (
        <div 
          key={branch.name}
          className={`flex items-center space-x-3 p-2 rounded ${
            branch.name === project.git?.branch ? 'bg-blue-900/30' : 'hover:bg-gray-800'
          }`}
        >
          <GitBranch className={`w-4 h-4 ${
            branch.name === project.git?.branch ? 'text-blue-400' : 'text-gray-400'
          }`} />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${
                branch.name === project.git?.branch ? 'text-blue-400 font-medium' : 'text-white'
              }`}>
                {branch.name}
              </span>
              {branch.name === project.git?.branch && (
                <span className="text-xs text-blue-400 bg-blue-900/20 px-1 rounded">
                  current
                </span>
              )}
            </div>            {branch.lastCommit && typeof branch.lastCommit === 'object' && (
              <div className="text-xs text-gray-400">
                Last commit: {branch.lastCommit}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderStatus = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-white mb-2">Repository Status</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Branch:</span>
            <span className="text-blue-400">{project.git?.branch || 'main'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Commits:</span>
            <span className="text-white">{project.git?.commits?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Last Activity:</span>
            <span className="text-white">
              {project.git?.commits?.[0] ? formatDate(project.git.commits[0].date) : 'N/A'}
            </span>
          </div>
        </div>
      </div>      {project.git?.remotes && project.git.remotes.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-white mb-2">Remote</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Origin:</span>
              <span className="text-blue-400 truncate">{project.git.remotes[0].url}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-700">
        <div className="flex space-x-1 p-1">
          {[
            { id: 'commits', label: 'Commits', icon: GitCommit },
            { id: 'branches', label: 'Branches', icon: GitBranch },
            { id: 'status', label: 'Status', icon: GitMerge }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 text-sm rounded ${
                activeTab === tab.id
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'commits' && renderCommits()}
        {activeTab === 'branches' && renderBranches()}
        {activeTab === 'status' && renderStatus()}
      </div>
    </div>
  );
};
