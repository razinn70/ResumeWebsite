import React from 'react';
import { Html } from '@react-three/drei';

interface CategoryHeader3DProps {
  category: string;
  position: [number, number, number];
  color?: string;
}

export const CategoryHeader3D: React.FC<CategoryHeader3DProps> = ({ 
  category, 
  position, 
  color = '#ffffff' 
}) => {
  return (
    <group position={position}>
      <Html
        center
        distanceFactor={10}
        style={{
          color,
          fontSize: '16px',
          fontWeight: 'bold',
          textAlign: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {category}
      </Html>
    </group>
  );
};
