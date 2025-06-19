'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import type { CanvasProps } from '@react-three/fiber';

// Client-only wrapper for React Three Fiber Canvas
const CRTCanvas: React.FC<CanvasProps> = (props) => {
  return <Canvas {...props} />;
};

export default CRTCanvas;
