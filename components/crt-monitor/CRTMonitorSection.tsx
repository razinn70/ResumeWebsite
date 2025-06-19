'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the CRT monitor to avoid SSR issues
const CRTMonitorDemo = dynamic(
  () => import('./CRTMonitorDemo'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading CRT Monitor...</p>
        </div>
      </div>
    )
  }
);

interface CRTMonitorSectionProps {
  title?: string;
  description?: string;
  showControls?: boolean;
  height?: string;
  className?: string;
}

const CRTMonitorSection: React.FC<CRTMonitorSectionProps> = ({
  title = "Authentic CRT Monitor Experience",
  description = "Experience photorealistic CRT monitor simulation with authentic physics, real phosphor persistence, magnetic field distortion, and environmental effects.",
  showControls = true,
  height = "800px",
  className = ""
}) => {
  return (
    <section className={`relative w-full ${className}`}>
      {/* Section Header */}
      <div className="text-center mb-8 px-4">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {description}
        </p>
      </div>
      
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="font-bold text-lg mb-2">Authentic Physics</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Real electron beam scanning, phosphor persistence, and magnetic field effects
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="font-bold text-lg mb-2">Multiple Models</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Commodore, IBM, Sony, Apple, and Dell CRT monitors from different eras
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="font-bold text-lg mb-2">Advanced Shaders</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Scanlines, convergence errors, chromatic aberration, and aging effects
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="font-bold text-lg mb-2">Interactive Controls</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Power, degauss, brightness, contrast, and quality settings
          </p>
        </div>
      </div>
      
      {/* CRT Monitor Demo */}
      <div 
        className="w-full bg-gray-900 rounded-lg overflow-hidden shadow-2xl"
        style={{ height }}
      >
        <Suspense fallback={
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Initializing CRT Monitor System...</p>
            </div>
          </div>
        }>
          <CRTMonitorDemo
            initialModel="commodore-1084"
            showControls={showControls}
            showEnvironment={true}
            autoRotate={false}
          />
        </Suspense>
      </div>
      
      {/* Technical Specifications */}
      <div className="mt-8 px-4">
        <h3 className="text-2xl font-bold text-center mb-6">Technical Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">CRT Physics Engine</h4>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
              <li>• Electron beam simulation</li>
              <li>• Phosphor persistence modeling</li>
              <li>• Magnetic field distortion</li>
              <li>• Temperature-based color shift</li>
              <li>• Aging and burn-in effects</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Visual Effects</h4>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
              <li>• Real-time scanlines</li>
              <li>• Interlacing simulation</li>
              <li>• RGB convergence errors</li>
              <li>• Chromatic aberration</li>
              <li>• Barrel distortion</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Environmental</h4>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
              <li>• Dust particle system</li>
              <li>• Realistic lighting</li>
              <li>• Screen reflections</li>
              <li>• Shadow casting</li>
              <li>• Room integration</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Performance Info */}
      <div className="mt-8 px-4 text-center">
        <div className="inline-block bg-blue-50 dark:bg-blue-900 px-6 py-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Performance:</strong> WebGL-accelerated rendering with adaptive quality and LOD system. 
            Optimized for 60fps on modern hardware with fallback support for older devices.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CRTMonitorSection;
