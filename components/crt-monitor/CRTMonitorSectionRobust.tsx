/**
 * ROBUST CRT MONITOR SECTION - PRODUCTION READY
 * Features comprehensive error handling and graceful fallbacks
 */
'use client';

import React, { Suspense, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';

// Dynamically import the robust CRT monitor
const CRTMonitorRobust = dynamic(
  () => import('./CRTMonitorRobust'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-green-400">Initializing CRT Monitor...</p>
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

// Error fallback component
function CRTErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="w-full h-96 bg-gray-900 border border-red-500/50 rounded-lg flex items-center justify-center p-8">
      <div className="text-center text-white max-w-md">
        <div className="text-6xl mb-4">📺</div>
        <h3 className="text-xl font-bold mb-2 text-red-400">CRT Monitor Error</h3>
        <p className="text-gray-300 mb-4 text-sm">
          The CRT monitor simulation failed to load. This might be due to WebGL issues or browser compatibility.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={resetError}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
          >
            Retry
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors"
          >
            Reload Page
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-blue-400">Error Details</summary>
            <pre className="bg-black/50 p-2 rounded text-xs mt-2 overflow-auto max-h-32">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

const CRTMonitorSection: React.FC<CRTMonitorSectionProps> = ({
  title = "Authentic CRT Monitor Experience",
  description = "Experience a photorealistic CRT monitor simulation with authentic physics and retro aesthetics.",
  showControls = true,
  height = "600px",
  className = ""
}) => {
  const [crtPowered, setCrtPowered] = useState(true);
  const [brightness, setBrightness] = useState(0.8);
  const [contrast, setContrast] = useState(0.9);
  const [currentModel, setCurrentModel] = useState('commodore-1084');
  const [errorCount, setErrorCount] = useState(0);
  const [hasError, setHasError] = useState(false);
  const crtRef = useRef<any>(null);

  // Error handler
  const handleCRTError = useCallback((error: Error) => {
    console.error('CRT Monitor Error:', error);
    setErrorCount(prev => prev + 1);
    
    if (errorCount > 3) {
      console.warn('Too many CRT errors, disabling advanced features');
      setHasError(true);
    }
  }, [errorCount]);

  // Reset error state
  const resetError = useCallback(() => {
    setHasError(false);
    setErrorCount(0);
  }, []);

  // Control handlers
  const handlePowerToggle = useCallback(() => {
    if (crtRef.current) {
      if (crtPowered) {
        crtRef.current.powerOff();
      } else {
        crtRef.current.powerOn();
      }
      setCrtPowered(!crtPowered);
    }
  }, [crtPowered]);

  const handleBrightnessChange = useCallback((value: number) => {
    setBrightness(value);
    if (crtRef.current) {
      crtRef.current.setBrightness(value);
    }
  }, []);

  const handleContrastChange = useCallback((value: number) => {
    setContrast(value);
    if (crtRef.current) {
      crtRef.current.setContrast(value);
    }
  }, []);

  // If too many errors, show fallback
  if (hasError) {
    return (
      <section className={`relative w-full ${className}`}>
        <div className="text-center mb-8 px-4">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {description}
          </p>
        </div>
        <CRTErrorFallback error={new Error('Multiple CRT errors')} resetError={resetError} />
      </section>
    );
  }

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
          <h3 className="font-bold text-lg mb-2">Retro Authenticity</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Authentic CRT monitor simulation with period-accurate design and behavior
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="font-bold text-lg mb-2">Multiple Models</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Commodore, IBM, and other classic CRT monitors from the 80s and 90s
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="font-bold text-lg mb-2">Visual Effects</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Scanlines, screen glow, and authentic phosphor persistence effects
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="font-bold text-lg mb-2">Interactive Controls</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Power, brightness, contrast, and model selection controls
          </p>
        </div>
      </div>

      {/* Controls Panel */}
      {showControls && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6 mx-4">
          <h3 className="text-white font-bold mb-4">CRT Controls</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <button
                onClick={handlePowerToggle}
                className={`w-full px-4 py-2 rounded font-medium transition-colors ${
                  crtPowered 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {crtPowered ? '🔌 Power On' : '⚫ Power Off'}
              </button>
            </div>
            
            <div>
              <label className="block text-white text-sm mb-2">Brightness: {Math.round(brightness * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={brightness}
                onChange={(e) => handleBrightnessChange(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-white text-sm mb-2">Contrast: {Math.round(contrast * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={contrast}
                onChange={(e) => handleContrastChange(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-white text-sm mb-2">Model</label>
              <select
                value={currentModel}
                onChange={(e) => setCurrentModel(e.target.value)}
                className="w-full bg-gray-700 text-white p-2 rounded"
              >
                <option value="commodore-1084">Commodore 1084</option>
                <option value="ibm-5151">IBM 5151</option>
                <option value="apple-monitor">Apple Monitor</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* CRT Monitor Demo */}
      <div 
        className="w-full bg-gray-900 rounded-lg overflow-hidden shadow-2xl mx-4"
        style={{ height }}
      >
        <Suspense fallback={
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
              <p className="text-green-400">Loading CRT Monitor System...</p>
            </div>
          </div>
        }>
          <Canvas
            gl={{ 
              antialias: true, 
              alpha: false,
              powerPreference: 'high-performance',
              failIfMajorPerformanceCaveat: false
            }}
            dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
            performance={{ min: 0.5 }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener('webglcontextlost', (event) => {
                event.preventDefault();
                console.warn('WebGL context lost, attempting recovery...');
                handleCRTError(new Error('WebGL context lost'));
              });
            }}
          >
            <PerspectiveCamera makeDefault position={[0, 0, 3]} />
            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              enableRotate={true}
              maxDistance={5}
              minDistance={1}
            />
            
            <ambientLight intensity={0.2} />
            <pointLight position={[2, 2, 2]} intensity={0.8} />
            <pointLight position={[-2, -2, 2]} intensity={0.4} color="#0088ff" />
            
            <Environment preset="warehouse" />
            
            <CRTMonitorRobust
              ref={crtRef}
              model={currentModel}
              screenContent="RETRO COMPUTING EXPERIENCE"
              autoPlay={crtPowered}
              quality="high"
              onError={handleCRTError}
            />
          </Canvas>
        </Suspense>
      </div>
      
      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 mx-4 p-4 bg-black/20 rounded text-sm text-gray-400">
          <p>Debug: Power={crtPowered ? 'On' : 'Off'}, Brightness={brightness}, Contrast={contrast}, Errors={errorCount}</p>
        </div>
      )}
    </section>
  );
};

export default CRTMonitorSection;
