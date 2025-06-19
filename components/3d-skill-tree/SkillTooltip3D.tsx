import React from 'react';
import { Html } from '@react-three/drei';

interface SkillTooltip3DProps {
  skill: {
    id: string;
    label: string;
    description?: string;
    level: number;
    category: string;
  };
  position: [number, number, number];
  visible: boolean;
}

export const SkillTooltip3D: React.FC<SkillTooltip3DProps> = ({ 
  skill, 
  position, 
  visible 
}) => {
  if (!visible) return null;

  return (
    <group position={position}>
      <Html
        center
        distanceFactor={8}
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          maxWidth: '200px',
          pointerEvents: 'none',
          userSelect: 'none',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {skill.label}
          </div>
          <div style={{ fontSize: '10px', opacity: 0.8 }}>
            {skill.category} • Level {skill.level}
          </div>
          {skill.description && (
            <div style={{ marginTop: '4px', fontSize: '10px' }}>
              {skill.description}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};
