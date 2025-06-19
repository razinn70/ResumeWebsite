'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Code,
  Package,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  Activity,
  GitBranch,
  Target,
  Award,
  Eye
} from 'lucide-react';
import { ProjectStructure, ProjectMetrics } from '../types';

interface ProjectInsightsProps {
  project: ProjectStructure;
  insights: ProjectMetrics | null;
}

interface InsightTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color?: string;
}> = ({ title, value, change, trend, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    gray: 'bg-gray-500'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} bg-opacity-20`}>
          <div className={`text-${color}-400`}>
            {icon}
          </div>
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
          }`}>
            {trend === 'up' && <TrendingUp className="w-4 h-4" />}
            {trend === 'down' && <TrendingDown className="w-4 h-4" />}
            <span>{change > 0 ? '+' : ''}{change}%</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
    </motion.div>
  );
};

const ProgressBar: React.FC<{
  label: string;
  value: number;
  max: number;
  color?: string;
}> = ({ label, value, max, color = 'blue' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-300">{label}</span>
        <span className="text-gray-400">{value.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-2 rounded-full bg-${color}-500`}
        />
      </div>
    </div>
  );
};

const OverviewTab: React.FC<{ project: ProjectStructure; metrics: ProjectMetrics }> = ({ project, metrics }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Files"
          value={metrics.totalFiles.toLocaleString()}
          icon={<Code className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Lines of Code"
          value={metrics.totalLines.toLocaleString()}
          icon={<BarChart3 className="w-5 h-5" />}
          color="green"
        />
        <MetricCard
          title="Dependencies"
          value={metrics.dependencies.total}
          change={-5}
          trend="down"
          icon={<Package className="w-5 h-5" />}
          color="purple"
        />
        <MetricCard
          title="Test Coverage"
          value={`${metrics.coverage.lines}%`}
          change={2}
          trend="up"
          icon={<Shield className="w-5 h-5" />}
          color="green"
        />
      </div>

      {/* Project Health */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Activity className="w-5 h-5 text-green-400" />
          <span>Project Health</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Quality Metrics</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Code Quality</span>
                <span className={`text-sm font-medium ${
                  metrics.quality.rating === 'A' ? 'text-green-400' :
                  metrics.quality.rating === 'B' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {metrics.quality.rating}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Bugs</span>
                <span className="text-sm text-red-400">{metrics.quality.bugs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Vulnerabilities</span>
                <span className="text-sm text-yellow-400">{metrics.quality.vulnerabilities}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Technical Debt</span>
                <span className="text-sm text-gray-300">{metrics.quality.technicalDebt}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Performance</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Bundle Size</span>
                <span className="text-sm text-gray-300">{(metrics.performance.bundleSize / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Build Time</span>
                <span className="text-sm text-gray-300">{Math.round(metrics.performance.buildTime / 1000)}s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Test Time</span>
                <span className="text-sm text-gray-300">{Math.round(metrics.performance.testTime / 1000)}s</span>
              </div>
              {metrics.performance.lighthouse && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Lighthouse Score</span>
                  <span className="text-sm text-green-400">{metrics.performance.lighthouse.performance}/100</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Package className="w-5 h-5 text-purple-400" />
          <span>Technology Stack</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {project.technologies.slice(0, 8).map((tech, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-700 rounded">              {tech.logo && (
                <div className="w-5 h-5 bg-gray-600 rounded flex items-center justify-center text-xs">
                  {tech.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-white">{tech.name}</div>
                <div className="text-xs text-gray-400">{tech.version}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CodeAnalysisTab: React.FC<{ metrics: ProjectMetrics }> = ({ metrics }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Language Distribution */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Language Distribution</h3>
        <div className="space-y-4">
          {metrics.languages.map((lang, index) => (
            <ProgressBar
              key={index}
              label={lang.language}
              value={lang.lines}
              max={metrics.totalLines}
              color={index % 2 === 0 ? 'blue' : 'green'}
            />
          ))}
        </div>
      </div>

      {/* Complexity Metrics */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Code Complexity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Cyclomatic Complexity"
            value={metrics.complexity.cyclomatic}
            icon={<BarChart3 className="w-5 h-5" />}
            color="blue"
          />
          <MetricCard
            title="Cognitive Complexity"
            value={metrics.complexity.cognitive}
            icon={<Target className="w-5 h-5" />}
            color="purple"
          />
          <MetricCard
            title="Maintainability Index"
            value={metrics.complexity.maintainability}
            icon={<Award className="w-5 h-5" />}
            color="green"
          />
          <MetricCard
            title="Code Smells"
            value={metrics.complexity.code_smells}
            icon={<AlertTriangle className="w-5 h-5" />}
            color="yellow"
          />
        </div>
      </div>

      {/* File Size Distribution */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">File Size Analysis</h3>
        <div className="space-y-4">
          {metrics.languages.map((lang, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full bg-${index % 2 === 0 ? 'blue' : 'green'}-500`} />
                <span className="text-sm font-medium text-white">{lang.language}</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-white">{lang.files} files</div>
                <div className="text-xs text-gray-400">{(lang.bytes / 1024).toFixed(1)} KB</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TestingTab: React.FC<{ metrics: ProjectMetrics }> = ({ metrics }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Coverage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Line Coverage"
          value={`${metrics.coverage.lines}%`}
          icon={<Shield className="w-5 h-5" />}
          color="green"
        />
        <MetricCard
          title="Function Coverage"
          value={`${metrics.coverage.functions}%`}
          icon={<Code className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Branch Coverage"
          value={`${metrics.coverage.branches}%`}
          icon={<GitBranch className="w-5 h-5" />}
          color="purple"
        />
        <MetricCard
          title="Statement Coverage"
          value={`${metrics.coverage.statements}%`}
          icon={<BarChart3 className="w-5 h-5" />}
          color="yellow"
        />
      </div>

      {/* Coverage Details */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Coverage Details</h3>
        <div className="space-y-4">
          <ProgressBar
            label="Lines Covered"
            value={metrics.coverage.lines}
            max={100}
            color="green"
          />
          <ProgressBar
            label="Functions Covered"
            value={metrics.coverage.functions}
            max={100}
            color="blue"
          />
          <ProgressBar
            label="Branches Covered"
            value={metrics.coverage.branches}
            max={100}
            color="purple"
          />
          <ProgressBar
            label="Statements Covered"
            value={metrics.coverage.statements}
            max={100}
            color="yellow"
          />
        </div>
      </div>

      {/* Uncovered Files */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Uncovered Files</h3>
        <div className="space-y-2">
          {metrics.coverage.uncoveredFiles.slice(0, 10).map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
              <span className="text-sm text-gray-300">{file}</span>
              <span className="text-xs text-red-400">0% coverage</span>
            </div>
          ))}
          {metrics.coverage.uncoveredFiles.length > 10 && (
            <div className="text-sm text-gray-400 text-center py-2">
              +{metrics.coverage.uncoveredFiles.length - 10} more files
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PerformanceTab: React.FC<{ metrics: ProjectMetrics }> = ({ metrics }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Bundle Size"
          value={`${(metrics.performance.bundleSize / 1024 / 1024).toFixed(2)} MB`}
          icon={<Package className="w-5 h-5" />}
          color="purple"
        />
        <MetricCard
          title="Build Time"
          value={`${Math.round(metrics.performance.buildTime / 1000)}s`}
          icon={<Clock className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Load Time"
          value={`${Math.round(metrics.performance.loadTime)}ms`}
          icon={<Zap className="w-5 h-5" />}
          color="green"
        />
        <MetricCard
          title="Test Time"
          value={`${Math.round(metrics.performance.testTime / 1000)}s`}
          icon={<Shield className="w-5 h-5" />}
          color="yellow"
        />
      </div>

      {/* Lighthouse Scores */}
      {metrics.performance.lighthouse && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Lighthouse Scores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard
              title="Performance"
              value={metrics.performance.lighthouse.performance}
              icon={<Zap className="w-5 h-5" />}
              color="green"
            />
            <MetricCard
              title="Accessibility"
              value={metrics.performance.lighthouse.accessibility}
              icon={<Eye className="w-5 h-5" />}
              color="blue"
            />
            <MetricCard
              title="Best Practices"
              value={metrics.performance.lighthouse.bestPractices}
              icon={<CheckCircle className="w-5 h-5" />}
              color="purple"
            />
            <MetricCard
              title="SEO"
              value={metrics.performance.lighthouse.seo}
              icon={<Target className="w-5 h-5" />}
              color="yellow"
            />
            <MetricCard
              title="PWA"
              value={metrics.performance.lighthouse.pwa}
              icon={<Award className="w-5 h-5" />}
              color="green"
            />
          </div>
        </div>
      )}

      {/* Bundle Analysis */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Bundle Analysis</h3>
        <div className="space-y-4">
          {Object.entries(metrics.performance.chunkSizes).map(([chunk, size]) => (
            <ProgressBar
              key={chunk}
              label={chunk}
              value={size}
              max={metrics.performance.bundleSize}
              color="blue"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const ProjectInsights: React.FC<ProjectInsightsProps> = ({ project, insights }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs: InsightTab[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'code', label: 'Code Analysis', icon: <Code className="w-4 h-4" /> },
    { id: 'testing', label: 'Testing', icon: <Shield className="w-4 h-4" /> },
    { id: 'performance', label: 'Performance', icon: <Zap className="w-4 h-4" /> }
  ];

  if (!insights) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No insights available</p>
          <p className="text-sm">Project metrics are being calculated...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab project={project} metrics={insights} />;
      case 'code':
        return <CodeAnalysisTab metrics={insights} />;
      case 'testing':
        return <TestingTab metrics={insights} />;
      case 'performance':
        return <PerformanceTab metrics={insights} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 bg-gray-800">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm transition-colors
              ${activeTab === tab.id 
                ? 'bg-gray-700 text-white border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }
            `}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};
