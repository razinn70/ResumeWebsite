'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Skill, SkillCategory, SkillTreeData } from '../types/skills'
import skillsData from '../data/skills.json'

// Custom Skill Node Component
interface SkillNodeProps {
  skill: Skill;
  category: SkillCategory;
  isSelected: boolean;
  onSelect: (skill: Skill) => void;
  scale: number;
  onHover: (skill: Skill | null) => void;
}

const SkillNode = ({ skill, category, isSelected, onSelect, scale, onHover }: SkillNodeProps) => {
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
      className="absolute cursor-pointer group"
      style={{
        left: skill.position.x * scale,
        top: skill.position.y * scale,
        transform: 'translate(-50%, -50%)'
      }}
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
      {/* Node Circle */}
      <div 
        className={`relative w-16 h-16 rounded-full border-2 border-current bg-gradient-to-br ${getStatusColor(skill.status)} ${getGlowColor(skill.status)} shadow-lg transition-all duration-300`}
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
        {isSelected && (
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

interface SkillConnectionProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  status: 'mastered' | 'learning' | 'planned';
  isActive: boolean;
  scale: number;
}

const SkillConnection = ({ from, to, status, isActive, scale }: SkillConnectionProps) => {
  const getStrokeStyle = (status: string) => {
    switch (status) {
      case 'mastered': return { stroke: '#FFB000', strokeWidth: 2 };
      case 'learning': return { stroke: '#00FF41', strokeWidth: 2, strokeDasharray: '5,5' };
      case 'planned': return { stroke: '#666', strokeWidth: 1, strokeDasharray: '3,3' };
      default: return { stroke: '#FFB000', strokeWidth: 2 };
    }
  };

  const style = getStrokeStyle(status);

  return (
    <motion.line
      x1={from.x * scale}
      y1={from.y * scale}
      x2={to.x * scale}
      y2={to.y * scale}
      {...style}
      opacity={isActive ? 1 : 0.5}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="transition-opacity duration-300"
      style={{
        filter: isActive ? `drop-shadow(0 0 8px ${style.stroke})` : 'none'
      }}
    />
  );
};

interface SkillTooltipProps {
  skill: Skill;
  position: { x: number; y: number };
  scale: number;
}

const SkillTooltip = ({ skill, position, scale }: SkillTooltipProps) => {
  const progressBars = '█'.repeat(Math.floor(skill.level)) + 
                      '▓'.repeat(Math.floor((skill.xp / skill.maxXp) * 10) - skill.level) + 
                      '░'.repeat(10 - Math.floor((skill.xp / skill.maxXp) * 10));

  return (
    <motion.div
      className="absolute z-50 bg-black/95 border border-terminal-amber/50 rounded-lg p-4 min-w-64 backdrop-blur-sm"
      style={{
        left: position.x * scale + 80,
        top: position.y * scale - 50,
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
  const [scale, setScale] = useState(0.8);

  const [showTerminal, setShowTerminal] = useState(true);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const data = skillsData.skillTree as SkillTreeData;

  // Get all skills flattened
  const allSkills = useMemo(() => {
    return data.categories.flatMap(category => 
      category.skills.map(skill => ({ ...skill, category }))
    );
  }, [data]);

  // Get connections between skills
  const connections = useMemo(() => {
    const conns: Array<{
      from: { x: number; y: number };
      to: { x: number; y: number };
      status: 'mastered' | 'learning' | 'planned';
      isActive: boolean;
    }> = [];

    allSkills.forEach(skillWithCategory => {
      const skill = skillWithCategory;
      skill.linkedTo.forEach(linkedId => {
        const linkedSkill = allSkills.find(s => s.id === linkedId);
        if (linkedSkill) {
          conns.push({
            from: linkedSkill.position,
            to: skill.position,
            status: skill.status as 'mastered' | 'learning' | 'planned',
            isActive: hoveredSkill?.id === skill.id || hoveredSkill?.id === linkedId || selectedSkill?.id === skill.id
          });
        }
      });
    });

    return conns;
  }, [allSkills, hoveredSkill, selectedSkill]);

  // Handle zoom and pan
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setScale(prev => Math.max(0.3, Math.min(2, prev + (e.deltaY > 0 ? -0.1 : 0.1))));
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target === containerRef.current) {
        setIsDragging(true);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPanOffset(prev => ({
          x: prev.x + e.movementX,
          y: prev.y + e.movementY
        }));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedSkill(null);
        setHoveredSkill(null);
      }
      
      // Navigate between skills with arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const currentIndex = selectedSkill ? allSkills.findIndex(s => s.id === selectedSkill.id) : -1;
        let newIndex = currentIndex;
        
        switch (e.key) {
          case 'ArrowUp':
          case 'ArrowLeft':
            newIndex = currentIndex > 0 ? currentIndex - 1 : allSkills.length - 1;
            break;
          case 'ArrowDown':
          case 'ArrowRight':
            newIndex = currentIndex < allSkills.length - 1 ? currentIndex + 1 : 0;
            break;
        }
        
        if (newIndex >= 0 && newIndex < allSkills.length) {
          setSelectedSkill(allSkills[newIndex]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);  }, [selectedSkill, allSkills]);

  // Enhanced terminal commands
  const handleTerminalCommand = (command: string) => {
    const cmd = command.toLowerCase().trim();
    switch (cmd) {
      case 'help':
        console.log('Available commands:', terminalCommands.map(c => `${c.cmd} - ${c.desc}`).join('\n'));
        break;
      case 'skill --export tree':
        console.log('🚀 Exporting skill tree as PDF...');
        // Mock download functionality
        setTimeout(() => console.log('✅ skill-tree.pdf downloaded!'), 1000);
        break;      case 'unlock devops':
        const devopsSkill = allSkills.find(s => s.category.id === 'devops');
        if (devopsSkill) setSelectedSkill(devopsSkill);
        break;
      case 'reset view':
        setScale(0.8);
        setPanOffset({ x: 0, y: 0 });
        setSelectedSkill(null);
        setHoveredSkill(null);
        console.log('🔄 View reset to default');
        break;
      case 'stats':
        const mastered = allSkills.filter(s => s.status === 'mastered').length;
        const learning = allSkills.filter(s => s.status === 'learning').length;
        const totalXP = allSkills.reduce((sum, s) => sum + s.xp, 0);
        console.log(`📊 Stats: ${mastered} mastered | ${learning} learning | ${totalXP} total XP`);
        break;
      default:
        if (cmd.startsWith('inspect ')) {
          const skillName = cmd.replace('inspect ', '');
          const skill = allSkills.find(s => s.name.toLowerCase().includes(skillName));
          if (skill) {
            setSelectedSkill(skill);
            console.log(`🔍 Inspecting ${skill.name}`);
          } else {
            console.log(`❌ Skill "${skillName}" not found`);
          }
        } else {
          console.log(`❌ Unknown command: ${command}. Type 'help' for available commands.`);
        }
    }
  };
  const terminalCommands = useMemo(() => [
    { cmd: 'help', desc: 'Show available commands' },
    { cmd: 'inspect <skill>', desc: 'Inspect a specific skill' },
    { cmd: 'unlock devops', desc: 'Navigate to DevOps section' },
    { cmd: 'skill --export tree', desc: 'Export skill tree (mock)' },
    { cmd: 'reset view', desc: 'Reset zoom and pan' },
    { cmd: 'stats', desc: 'Show skill statistics' },
  ], []);

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
                  </div>                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleTerminalCommand('reset view')}
                      className="px-3 py-1 text-xs bg-terminal-green/20 text-terminal-green rounded border border-terminal-green/30 hover:bg-terminal-green/30 transition-colors font-mono"
                    >
                      RESET VIEW
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
                    className="flex items-center mt-4 text-terminal-green text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                  >
                    <span className="text-terminal-amber">Shortcuts:</span>
                    <span className="ml-2">ESC=clear | TAB=toggle mode | ↑↓←→=navigate | Ctrl+Scroll=zoom</span>
                  </motion.div>

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
                Zoom: {Math.round(scale * 100)}% | Drag to Pan | Ctrl+Scroll to Zoom
              </div>
            </div>
            
            <div className="text-terminal-cream font-mono text-sm">
              Skills: {allSkills.length} | Mastered: {allSkills.filter(s => s.status === 'mastered').length}
            </div>
          </div>

          {/* Skill Tree Container */}
          <div 
            ref={containerRef}            className={`relative bg-terminal-black/50 border border-terminal-amber/30 rounded-lg overflow-hidden backdrop-blur-sm ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ height: '600px' }}
          >
            <div 
              className="relative w-full h-full"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px)`
              }}
            >
              {/* SVG for connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: 'translate(50%, 50%)' }}>
                {connections.map((conn, index) => (
                  <SkillConnection
                    key={index}
                    from={conn.from}
                    to={conn.to}
                    status={conn.status}
                    isActive={conn.isActive}
                    scale={scale}
                  />
                ))}
              </svg>

              {/* Category Headers */}
              <div style={{ transform: 'translate(50%, 50%)' }}>
                {data.categories.map((category) => (
                  <motion.div
                    key={category.id}
                    className="absolute font-mono text-lg font-bold"
                    style={{
                      left: category.position.x * scale,
                      top: category.position.y * scale - 40,
                      color: category.color,
                      transform: 'translate(-50%, -50%)'
                    }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {category.icon} {category.name}
                  </motion.div>
                ))}

                {/* Skill Nodes */}
                {allSkills.map((skillWithCategory) => (
                  <SkillNode
                    key={skillWithCategory.id}
                    skill={skillWithCategory}
                    category={skillWithCategory.category}
                    isSelected={selectedSkill?.id === skillWithCategory.id}
                    onSelect={setSelectedSkill}
                    scale={scale}
                    onHover={setHoveredSkill}
                  />
                ))}
              </div>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredSkill && (
                  <SkillTooltip
                    skill={hoveredSkill}
                    position={hoveredSkill.position}
                    scale={scale}
                  />
                )}              </AnimatePresence>
            </div>
          </div>

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

      {/* Grid Background Effect */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 176, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 176, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`
        }}
      />

      {/* Scanning Line Effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-terminal-amber to-transparent opacity-30"
        animate={{ y: [0, 600, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
    </section>
  );
}
