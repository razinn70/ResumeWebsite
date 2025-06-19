export interface FileSystemNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  path: string;
  size?: number;
  lastModified: Date;
  created: Date;
  children?: FileSystemNode[];
  content?: string;
  language?: string;
  extension?: string;
  isExpanded?: boolean;
  isSelected?: boolean;
  permissions: FilePermissions;
  gitStatus?: GitFileStatus;
  metadata?: FileMetadata;
}

export interface FilePermissions {
  read: boolean;
  write: boolean;
  execute: boolean;
  owner: string;
  group: string;
  mode: string; // e.g., "755", "644"
}

export interface GitFileStatus {
  status: 'modified' | 'added' | 'deleted' | 'renamed' | 'untracked' | 'staged' | 'clean';
  staged: boolean;
  conflicted: boolean;
  ahead: number;
  behind: number;
}

export interface FileMetadata {
  mimeType: string;
  encoding?: string;
  lineCount?: number;
  wordCount?: number;
  characterCount?: number;
  dependencies?: string[];
  imports?: string[];
  exports?: string[];
  functions?: FunctionMetadata[];
  classes?: ClassMetadata[];
  complexity?: number;
  testCoverage?: number;
}

export interface FunctionMetadata {
  name: string;
  line: number;
  parameters: string[];
  returnType?: string;
  complexity: number;
  documentation?: string;
}

export interface ClassMetadata {
  name: string;
  line: number;
  methods: FunctionMetadata[];
  properties: string[];
  extends?: string;
  implements?: string[];
}

export interface GitRepository {
  name: string;
  url: string;
  branch: string;
  branches: GitBranch[];
  commits: GitCommit[];
  remotes: GitRemote[];
  status: GitStatus;
  config: GitConfig;
}

export interface GitBranch {
  name: string;
  current: boolean;
  remote?: string;
  ahead: number;
  behind: number;
  lastCommit: string;
}

export interface GitCommit {
  hash: string;
  shortHash: string;
  message: string;
  author: GitAuthor;
  date: Date;
  files: GitFileChange[];
  stats: GitCommitStats;
  tags?: string[];
  parents: string[];
}

export interface GitAuthor {
  name: string;
  email: string;
  avatar?: string;
}

export interface GitFileChange {
  path: string;
  status: 'added' | 'modified' | 'deleted' | 'renamed';
  additions: number;
  deletions: number;
  binary: boolean;
  oldPath?: string;
}

export interface GitCommitStats {
  additions: number;
  deletions: number;
  files: number;
}

export interface GitRemote {
  name: string;
  url: string;
  type: 'fetch' | 'push';
}

export interface GitStatus {
  clean: boolean;
  staged: GitFileChange[];
  unstaged: GitFileChange[];
  untracked: string[];
  conflicted: string[];
  ahead: number;
  behind: number;
}

export interface GitConfig {
  user: {
    name: string;
    email: string;
  };
  remote: {
    origin: {
      url: string;
      fetch: string;
    };
  };
}

export interface ProjectStructure {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  technologies: Technology[];
  root: FileSystemNode;
  git: GitRepository;
  gitRepository: GitRepository; // Alias for compatibility
  packageJson?: PackageJson;
  readme?: string;
  license?: string;
  metrics: ProjectMetrics;  deployment?: DeploymentInfo;
}

export type Project = ProjectStructure;

export type ProjectType = 
  | 'react-app' 
  | 'next-js' 
  | 'node-api' 
  | 'vue-app' 
  | 'angular-app' 
  | 'python-app' 
  | 'rust-app' 
  | 'go-app' 
  | 'mobile-app' 
  | 'desktop-app' 
  | 'library' 
  | 'cli-tool' 
  | 'game' 
  | 'other';

export interface Technology {
  name: string;
  version: string;
  type: 'framework' | 'library' | 'tool' | 'language' | 'database' | 'service';
  logo?: string;
  documentation?: string;
}

export interface PackageJson {
  name: string;
  version: string;
  description: string;
  main?: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  peerDependencies?: Record<string, string>;
  keywords?: string[];
  author?: string | { name: string; email: string; url?: string };
  license: string;
  repository?: {
    type: string;
    url: string;
  };
  bugs?: {
    url: string;
  };
  homepage?: string;
  engines?: Record<string, string>;
}

export interface ProjectMetrics {
  totalFiles: number;
  totalLines: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;
  languages: LanguageStats[];
  complexity: ComplexityMetrics;
  dependencies: DependencyMetrics;
  performance: PerformanceMetrics;
  coverage: CoverageMetrics;
  quality: QualityMetrics;
}

export interface LanguageStats {
  language: string;
  files: number;
  lines: number;
  percentage: number;
  bytes: number;
}

export interface ComplexityMetrics {
  cyclomatic: number;
  cognitive: number;
  maintainability: number;
  technical_debt: number; // in hours
  code_smells: number;
}

export interface DependencyMetrics {
  total: number;
  direct: number;
  dev: number;
  outdated: number;
  vulnerable: number;
  size: number; // in bytes
  gzipSize: number; // in bytes
}

export interface PerformanceMetrics {
  bundleSize: number;
  chunkSizes: Record<string, number>;
  loadTime: number;
  buildTime: number;
  testTime: number;
  lighthouse?: LighthouseMetrics;
}

export interface LighthouseMetrics {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
}

export interface CoverageMetrics {
  lines: number;
  functions: number;
  branches: number;
  statements: number;
  files: number;
  uncoveredFiles: string[];
}

export interface QualityMetrics {
  bugs: number;
  vulnerabilities: number;
  codeSmells: number;
  duplicatedLines: number;
  rating: 'A' | 'B' | 'C' | 'D' | 'E';
  technicalDebt: string; // e.g., "2h 30min"
}

export interface DeploymentInfo {
  platform: string;
  url: string;
  status: 'deployed' | 'building' | 'failed' | 'pending';
  lastDeploy: Date;
  deployments: Deployment[];
  environment: Record<string, string>;
}

export interface Deployment {
  id: string;
  commit: string;
  message: string;
  status: 'success' | 'failed' | 'pending' | 'cancelled';
  date: Date;
  duration: number; // in seconds
  url?: string;
  logs: DeploymentLog[];
}

export interface DeploymentLog {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  source?: string;
}

// Explorer UI Types
export type ExplorerTab = 'files' | 'git' | 'search' | 'insights' | 'terminal';

export interface ExplorerState {
  selectedNode: string | null;
  expandedNodes: Set<string>;
  searchQuery: string;
  searchResults: FileSystemNode[];
  currentProject: string | null;
  viewMode: 'tree' | 'list' | 'grid';
  sortBy: 'name' | 'date' | 'size' | 'type';
  sortOrder: 'asc' | 'desc';
  showHidden: boolean;
  filter: FileFilter;
}

export interface FileFilter {
  extensions: string[];
  types: ('file' | 'directory')[];
  modifiedAfter?: Date;
  modifiedBefore?: Date;
  sizeMin?: number;
  sizeMax?: number;
  gitStatus?: GitFileStatus['status'][];
}

export interface CodeViewerState {
  content: string;
  language: string;
  lineNumbers: boolean;
  wordWrap: boolean;
  theme: 'light' | 'dark' | 'high-contrast';
  fontSize: number;
  tabSize: number;
  highlightedLines: number[];
  foldedRegions: CodeRegion[];
  searchMatches: SearchMatch[];
}

export interface CodeRegion {
  start: number;
  end: number;
  type: 'function' | 'class' | 'import' | 'comment';
  folded: boolean;
}

export interface SearchMatch {
  line: number;
  column: number;
  length: number;
  text: string;
}

export interface TerminalState {
  commands: TerminalCommand[];
  currentDirectory: string;
  environment: Record<string, string>;
  history: string[];
  historyIndex: number;
  isRunning: boolean;
  processes: TerminalProcess[];
}

export interface TerminalCommand {
  id: string;
  command: string;
  args: string[];
  output: TerminalOutput[];
  exitCode: number;
  duration: number;
  timestamp: Date;
  workingDirectory: string;
}

export interface TerminalOutput {
  type: 'stdout' | 'stderr' | 'info' | 'error' | 'success';
  content: string;
  timestamp: Date;
}

export interface TerminalProcess {
  pid: number;
  command: string;
  status: 'running' | 'stopped' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  cpu: number;
  memory: number;
}

// Event Types
export interface FileExplorerEvents {
  onFileSelect: (node: FileSystemNode) => void;
  onFileOpen: (node: FileSystemNode) => void;
  onFileDelete: (node: FileSystemNode) => void;
  onFileRename: (node: FileSystemNode, newName: string) => void;
  onFileCreate: (parent: FileSystemNode, name: string, type: 'file' | 'directory') => void;
  onDirectoryExpand: (node: FileSystemNode) => void;
  onDirectoryCollapse: (node: FileSystemNode) => void;
  onSearch: (query: string) => void;
  onFilter: (filter: FileFilter) => void;
  onSort: (sortBy: ExplorerState['sortBy'], order: ExplorerState['sortOrder']) => void;
  onProjectChange: (projectId: string) => void;
}

export interface GitEvents {
  onCommit: (message: string, files: string[]) => void;
  onBranchSwitch: (branch: string) => void;
  onBranchCreate: (name: string, from?: string) => void;
  onMerge: (branch: string) => void;
  onPull: (remote: string, branch: string) => void;
  onPush: (remote: string, branch: string) => void;
  onStash: (message?: string) => void;
  onStashPop: (stashId: string) => void;
  onReset: (commit: string, mode: 'soft' | 'mixed' | 'hard') => void;
  onRevert: (commit: string) => void;
  onTag: (name: string, commit: string, message?: string) => void;
}

export interface TerminalEvents {
  onCommand: (command: string) => void;
  onProcessStart: (process: TerminalProcess) => void;
  onProcessEnd: (process: TerminalProcess) => void;
  onDirectoryChange: (path: string) => void;
  onEnvironmentChange: (env: Record<string, string>) => void;
}

// Component Props
export interface FileExplorerProps {
  projects: ProjectStructure[];
  initialProject?: string;
  height?: string;
  width?: string;
  theme?: 'light' | 'dark' | 'auto';
  showTerminal?: boolean;
  showGitPanel?: boolean;
  showMetrics?: boolean;
  readOnly?: boolean;
  events?: Partial<FileExplorerEvents>;
  className?: string;
  style?: React.CSSProperties;
}

export interface FileTreeProps {
  root: FileSystemNode;
  selectedNode: string | null;
  expandedNodes: Set<string>;
  onNodeSelect: (node: FileSystemNode) => void;
  onNodeExpand: (node: FileSystemNode) => void;
  onNodeCollapse: (node: FileSystemNode) => void;
  filter: FileFilter;
  searchQuery: string;
  showHidden: boolean;
}

export interface CodeViewerProps {
  node: FileSystemNode;
  state: CodeViewerState;
  onStateChange: (state: CodeViewerState) => void;
  readOnly?: boolean;
  showMinimap?: boolean;
  showBreadcrumbs?: boolean;
}

export interface GitPanelProps {
  repository: GitRepository;
  events?: Partial<GitEvents>;
  readOnly?: boolean;
}

export interface TerminalProps {
  state: TerminalState;
  events?: Partial<TerminalEvents>;
  project: ProjectStructure;
  height?: string;
}

export interface MetricsPanelProps {
  metrics: ProjectMetrics;
  project: ProjectStructure;
  showCharts?: boolean;
  refreshInterval?: number;
}

// Utility Types
export type FileIcon = {
  name: string;
  color: string;
  component: React.ComponentType<{ size?: number; className?: string }>;
};

export type LanguageDefinition = {
  id: string;
  name: string;
  extensions: string[];
  mimeTypes: string[];
  keywords: string[];
  operators: string[];
  builtins: string[];
  icon: FileIcon;
};

export type ThemeDefinition = {
  name: string;
  colors: {
    background: string;
    foreground: string;
    selection: string;
    lineHighlight: string;
    cursor: string;
    comment: string;
    keyword: string;
    string: string;
    number: string;
    operator: string;
    function: string;
    variable: string;
    type: string;
  };
};

export type CommandDefinition = {
  name: string;
  description: string;
  usage: string;
  options: CommandOption[];
  examples: string[];
  handler: (args: string[], context: TerminalContext) => Promise<TerminalOutput[]>;
};

export interface CommandOption {
  name: string;
  shortName?: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  required?: boolean;
  default?: any;
}

export interface TerminalContext {
  currentDirectory: string;
  environment: Record<string, string>;
  project: ProjectStructure;
  fileSystem: FileSystemNode;
  git: GitRepository;
  history: string[];
}

// Search and Filter Types
export interface SearchOptions {
  caseSensitive: boolean;
  wholeWord: boolean;
  regex: boolean;
  includeContent: boolean;
  fileTypes: string[];
  excludePatterns: string[];
  maxResults: number;
}

export interface SearchResult {
  node: FileSystemNode;
  matches: SearchMatch[];
  score: number;
  context: string[];
}

export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  filter: FileFilter;
  icon: string;
}

// Performance and Analytics
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  threshold?: {
    warning: number;
    critical: number;
  };
}

export interface UsageAnalytics {
  fileAccess: Record<string, number>;
  commandUsage: Record<string, number>;
  searchQueries: string[];
  timeSpent: Record<string, number>;
  errorRate: number;
  performance: PerformanceMetric[];
}

// Mobile and Responsive Types
export interface TouchGesture {
  type: 'tap' | 'double-tap' | 'long-press' | 'swipe' | 'pinch';
  target: string;
  data?: any;
}

export interface ResponsiveBreakpoint {
  name: string;
  minWidth: number;
  columns: number;
  spacing: number;
  fontSize: number;
  iconSize: number;
}

// Error Handling
export interface FileExplorerError {
  code: string;
  message: string;
  stack?: string;
  context?: any;
  timestamp: Date;
  recoverable: boolean;
}

export type ErrorBoundaryState = {
  hasError: boolean;
  error?: FileExplorerError;
  errorInfo?: any;
};
