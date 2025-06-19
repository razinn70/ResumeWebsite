'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Skill, SkillCategory, SkillTreeData } from '../types/skills'
import skillsData from '../data/skills.json'

// Custom Skill Node Component for ReactFlow
import { Handle, Position, NodeProps } from 'reactflow'

interface SkillNodeData {
  skill: Skill;
  category: SkillCategory;
  onSelect: (skill: Skill) => void;
  onHover: (skill: Skill | null) => void;
  isSelected: boolean;
}

const CustomSkillNode = ({ data, selected }: NodeProps<SkillNodeData>) => {
  const { skill, category, onSelect, onHover, isSelected } = data;
  const progressPercentage = (skill.xp / skill.maxXp) * 100;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mastered': return 'from-terminal-amber to-yellow-400';
      case 'learning': return 'from-terminal-green to-green-400';
      case 'planned': return 'from-gray-500 to-gray-400';
      default: return 'from-terminal-amber to-yellow-400';
    }
  };

  const getGlowColor = (status: string) => {
    switch (status) {
      case 'mastered': return 'shadow-terminal-amber/50';
      case 'learning': return 'shadow-terminal-green/50';
      case 'planned': return 'shadow-gray-500/30';
      default: return 'shadow-terminal-amber/50';
    }
  };

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: Math.random() * 0.5,
        type: 'spring',
        stiffness: 200,
        damping: 15
      }}
      whileHover={{ scale: 1.1 }}
      onClick={() => onSelect(skill)}
      onMouseEnter={() => onHover(skill)}
      onMouseLeave={() => onHover(null)}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      
      {/* Node Circle */}
      <div 
        className={`relative w-16 h-16 rounded-full border-2 border-current bg-gradient-to-br ${getStatusColor(skill.status)} ${getGlowColor(skill.status)} shadow-lg transition-all duration-300 cursor-pointer`}
        style={{ color: category.color }}
      >
        {/* Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.3"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${progressPercentage * 1.76} 176`}
            className="transition-all duration-500"
          />
        </svg>
        
        {/* Level Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-black font-bold text-sm font-mono">
            {skill.level}
          </span>
        </div>
        
        {/* Selection Ring */}
        {(isSelected || selected) && (
          <motion.div
            className="absolute -inset-2 rounded-full border-2 border-terminal-amber"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              boxShadow: '0 0 20px rgba(255, 176, 0, 0.6)'
            }}
          />
        )}
      </div>
      
      {/* Skill Name */}
      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs font-mono text-terminal-amber bg-black/80 px-2 py-1 rounded border border-terminal-amber/30">
          {skill.name}
        </span>
      </div>
      
      {/* Hover Glow Effect */}
      <div 
        className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${getGlowColor(skill.status)}`}
        style={{
          boxShadow: `0 0 30px ${category.color}40`
        }}
      />
    </motion.div>
  );
};

// Node types for ReactFlow
const nodeTypes = {
  skillNode: CustomSkillNode,
};

interface SkillTooltipProps {
  skill: Skill;
  position: { x: number; y: number };
}

const SkillTooltip = ({ skill, position }: SkillTooltipProps) => {
  const progressBars = '█'.repeat(Math.floor(skill.level)) + 
                      '▓'.repeat(Math.floor((skill.xp / skill.maxXp) * 10) - skill.level) + 
                      '░'.repeat(10 - Math.floor((skill.xp / skill.maxXp) * 10));

  return (
    <motion.div
      className="absolute z-50 bg-black/95 border border-terminal-amber/50 rounded-lg p-4 min-w-64 backdrop-blur-sm"
      style={{
        left: position.x + 80,
        top: position.y - 50,
      }}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-terminal-amber font-mono">
        <div className="text-lg font-bold mb-2">{skill.name}</div>
        <div className="text-sm mb-2 text-terminal-cream">{skill.description}</div>
        
        <div className="space-y-1 text-xs">
          <div>Level: <span className="text-terminal-green">{skill.level}/5</span></div>
          <div>XP: <span className="text-terminal-green">{skill.xp}/{skill.maxXp}</span></div>
          <div>Progress: <span className="font-mono text-terminal-amber">{progressBars}</span></div>
          <div>Learned via: <span className="text-terminal-green">{skill.learnedVia}</span></div>
          <div>Status: <span className={`${
            skill.status === 'mastered' ? 'text-terminal-amber' :
            skill.status === 'learning' ? 'text-terminal-green' : 'text-gray-400'
          }`}>{skill.status.toUpperCase()}</span></div>
        </div>
      </div>
    </motion.div>
  );
};

export function SkillTree() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'inventory'>('tree');
  const [showTerminal, setShowTerminal] = useState(true);
  
  const data = skillsData.skillTree as SkillTreeData;

  // Get all skills flattened
  const allSkills = useMemo(() => {
    return data.categories.flatMap(category => 
      category.skills.map(skill => ({ ...skill, category }))
    );
  }, [data]);

  // Create nodes for ReactFlow
  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [];
    
    data.categories.forEach((category) => {
      category.skills.forEach((skill) => {
        nodes.push({
          id: skill.id,
          type: 'skillNode',
          position: skill.position,
          data: {
            skill,
            category,
            onSelect: setSelectedSkill,
            onHover: setHoveredSkill,
            isSelected: selectedSkill?.id === skill.id,
          },
        });
      });
    });
    
    return nodes;
  }, [data.categories, selectedSkill]);

  // Create edges for ReactFlow
  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    
    allSkills.forEach(skillWithCategory => {
      const skill = skillWithCategory;
      skill.linkedTo.forEach(linkedId => {
        const linkedSkill = allSkills.find(s => s.id === linkedId);
        if (linkedSkill) {
          edges.push({
            id: `${linkedId}-${skill.id}`,
            source: linkedId,
            target: skill.id,
            type: 'smoothstep',
            style: {
              stroke: skill.status === 'mastered' ? '#FFB000' : 
                     skill.status === 'learning' ? '#00FF41' : '#666',
              strokeWidth: 2,
              strokeDasharray: skill.status === 'learning' ? '5,5' : undefined,
            },
            animated: skill.status === 'learning',
          });
        }
      });
    });
    
    return edges;
  }, [allSkills]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when selection changes
  useEffect(() => {
    setNodes(currentNodes =>
      currentNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          isSelected: selectedSkill?.id === node.id,
        },
      }))
    );  }, [selectedSkill, setNodes]);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Terminal Header */}
          <AnimatePresence>
            {showTerminal && (
              <motion.div
                className="mb-8 bg-terminal-black/90 border border-terminal-amber/30 rounded-lg backdrop-blur-sm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center justify-between p-4 border-b border-terminal-amber/20">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-terminal-amber font-mono text-sm">skill-tree.exe</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setViewMode(viewMode === 'tree' ? 'inventory' : 'tree')}
                      className="px-3 py-1 text-xs bg-terminal-amber/20 text-terminal-amber rounded border border-terminal-amber/30 hover:bg-terminal-amber/30 transition-colors font-mono"
                    >
                      {viewMode === 'tree' ? 'INVENTORY' : 'TREE'} MODE
                    </button>
                    <button
                      onClick={() => setShowTerminal(false)}
                      className="text-terminal-amber hover:text-terminal-orange transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                <div className="p-4 font-mono text-sm">
                  {data.terminalOutput.map((line, index) => (
                    <motion.div
                      key={index}
                      className={`${line.startsWith('>') ? 'text-terminal-green' : 
                                line.includes('📂') ? 'text-terminal-amber' : 
                                'text-terminal-cream'}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {line}
                    </motion.div>
                  ))}
                  
                  <motion.div
                    className="flex items-center mt-4 text-terminal-green"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                  >
                    <span>$ </span>
                    <motion.span
                      className="ml-1"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ▊
                    </motion.span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              {!showTerminal && (
                <button
                  onClick={() => setShowTerminal(true)}
                  className="px-4 py-2 bg-terminal-amber/20 text-terminal-amber rounded border border-terminal-amber/30 hover:bg-terminal-amber/30 transition-colors font-mono text-sm"
                >
                  SHOW TERMINAL
                </button>
              )}
              <div className="text-terminal-amber font-mono text-sm">
                Interactive Skill Tree | Drag to Pan | Scroll to Zoom
              </div>
            </div>
            
            <div className="text-terminal-cream font-mono text-sm">
              Skills: {allSkills.length} | Mastered: {allSkills.filter(s => s.status === 'mastered').length}
            </div>
          </div>

          {/* Skill Tree Container */}
          <div className="relative bg-terminal-black/50 border border-terminal-amber/30 rounded-lg overflow-hidden backdrop-blur-sm" style={{ height: '600px' }}>
            {viewMode === 'tree' ? (
              <ReactFlowProvider>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  nodeTypes={nodeTypes}
                  connectionMode={ConnectionMode.Loose}
                  fitView
                  attributionPosition="bottom-left"
                  className="bg-transparent"
                  proOptions={{ hideAttribution: true }}
                >
                  <Background 
                    color="#FFB000" 
                    size={1} 
                    style={{ opacity: 0.1 }}
                  />                  <Controls 
                    className="bg-terminal-black/80 border border-terminal-amber/30 rounded [&>button]:bg-terminal-black/80 [&>button]:border-terminal-amber/30 [&>button]:text-terminal-amber"
                  />
                </ReactFlow>
              </ReactFlowProvider>
            ) : (
              /* Inventory Mode */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 h-full overflow-y-auto">
                {allSkills.map((skillWithCategory) => (
                  <motion.div
                    key={skillWithCategory.id}
                    className="bg-terminal-black/70 border border-terminal-amber/30 rounded-lg p-4 hover:border-terminal-amber/60 transition-all cursor-pointer"
                    whileHover={{ scale: 1.05, y: -5 }}
                    onClick={() => setSelectedSkill(skillWithCategory)}
                  >
                    <div className="text-terminal-amber font-mono font-bold mb-2">
                      {skillWithCategory.name}
                    </div>
                    <div className="text-xs text-terminal-cream mb-2">
                      Level {skillWithCategory.level}/5
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-terminal-amber to-terminal-orange h-2 rounded-full transition-all"
                        style={{ width: `${(skillWithCategory.xp / skillWithCategory.maxXp) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-terminal-green">
                      {skillWithCategory.status.toUpperCase()}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Tooltip */}
          <AnimatePresence>            {hoveredSkill && viewMode === 'tree' && (
              <SkillTooltip
                skill={hoveredSkill}
                position={hoveredSkill.position}
              />
            )}
          </AnimatePresence>

          {/* Selected Skill Details */}
          <AnimatePresence>
            {selectedSkill && (
              <motion.div
                className="mt-6 bg-terminal-black/70 border border-terminal-amber/30 rounded-lg p-6 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-mono font-bold text-terminal-amber mb-2">
                      {selectedSkill.name}
                    </h3>
                    <p className="text-terminal-cream mb-4">{selectedSkill.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="text-terminal-amber hover:text-terminal-orange transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-sm">
                  <div>
                    <div className="text-terminal-green">Level</div>
                    <div className="text-terminal-amber">{selectedSkill.level}/5</div>
                  </div>
                  <div>
                    <div className="text-terminal-green">Experience</div>
                    <div className="text-terminal-amber">{selectedSkill.xp}/{selectedSkill.maxXp}</div>
                  </div>
                  <div>
                    <div className="text-terminal-green">Status</div>
                    <div className={`${
                      selectedSkill.status === 'mastered' ? 'text-terminal-amber' :
                      selectedSkill.status === 'learning' ? 'text-terminal-green' : 'text-gray-400'
                    }`}>
                      {selectedSkill.status.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="text-terminal-green">Source</div>
                    <div className="text-terminal-amber">{selectedSkill.learnedVia}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
