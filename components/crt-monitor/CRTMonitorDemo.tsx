import React, { Suspense, useRef, useState, useCallback } from 'react';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Vector3, Color } from 'three';
import dynamic from 'next/dynamic';

import CRTMonitor from './CRTMonitor';
import { CRTEnvironment } from './CRTEnvironment';
import { CRTModels } from './models/crt-models';
import { CRTMonitorRef } from './types';

// Dynamically import Canvas to ensure client-side rendering
const CRTCanvas = dynamic(() => import('./CRTCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      <div className="text-white">Loading 3D Scene...</div>
    </div>
  )
});

interface CRTMonitorDemoProps {
  initialModel?: string;
  showControls?: boolean;
  showEnvironment?: boolean;
  autoRotate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const CRTMonitorDemo: React.FC<CRTMonitorDemoProps> = ({
  initialModel = 'commodore-1084',
  showControls = true,
  showEnvironment = true,
  autoRotate = false,
  className = '',
  style = {}
}) => {
  const crtRef = useRef<CRTMonitorRef>(null);
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const [brightness, setBrightness] = useState(0.8);
  const [contrast, setContrast] = useState(0.9);
  const [showDust, setShowDust] = useState(true);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');
  
  const handlePowerToggle = useCallback(() => {
    if (crtRef.current) {
      if (isPoweredOn) {
        crtRef.current.powerOff();
      } else {
        crtRef.current.powerOn();
      }
      setIsPoweredOn(!isPoweredOn);
    }
  }, [isPoweredOn]);
  
  const handleDegauss = useCallback(() => {
    if (crtRef.current) {
      crtRef.current.degauss();
    }
  }, []);
  
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
  
  const handleModelChange = useCallback((modelId: string) => {
    setSelectedModel(modelId);
  }, []);
  
  const handleQualityChange = useCallback((newQuality: 'low' | 'medium' | 'high' | 'ultra') => {
    setQuality(newQuality);
  }, []);
  
  // Create a demo screen content
  const createDemoContent = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Terminal-style content
      ctx.fillStyle = '#00ff00';
      ctx.font = '16px monospace';
      ctx.textAlign = 'left';
      
      const lines = [
        'SYSTEM BOOT COMPLETE',
        '',
        'COMMODORE 64 BASIC V2',
        '64K RAM SYSTEM  38911 BASIC BYTES FREE',
        '',
        'READY.',
        '10 PRINT "HELLO RETRO WORLD!"',
        '20 FOR I=1 TO 10',
        '30 PRINT "LINE"; I',
        '40 NEXT I',
        '50 END',
        '',
        'RUN',
        'HELLO RETRO WORLD!',
        'LINE 1',
        'LINE 2',
        'LINE 3',
        'LINE 4',
        'LINE 5',
        '',
        'READY.',
        '_'
      ];
      
      lines.forEach((line, index) => {
        ctx.fillText(line, 20, 30 + index * 18);
      });
      
      // Add some scanline-like effects
      ctx.globalAlpha = 0.1;
      for (let y = 0; y < canvas.height; y += 2) {
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(0, y, canvas.width, 1);
      }
    }
    
    return canvas;
  }, []);
  
  const screenContent = React.useMemo(() => createDemoContent(), [createDemoContent]);
  
  return (
    <div className={`w-full h-screen bg-gray-900 ${className}`} style={style}>
      {/* Control Panel */}
      {showControls && (
        <div className="absolute top-4 left-4 z-10 bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm">
          <h3 className="text-lg font-bold mb-4">CRT Monitor Controls</h3>
          
          {/* Model Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Monitor Model:</label>
            <select
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-sm"
            >
              {Object.values(CRTModels).map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.year})
                </option>
              ))}
            </select>
          </div>
          
          {/* Power Control */}
          <div className="mb-4">
            <button
              onClick={handlePowerToggle}
              className={`w-full p-2 rounded font-medium transition-colors ${
                isPoweredOn 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isPoweredOn ? 'Power Off' : 'Power On'}
            </button>
          </div>
          
          {/* Degauss Button */}
          <div className="mb-4">
            <button
              onClick={handleDegauss}
              disabled={!isPoweredOn}
              className={`w-full p-2 rounded font-medium transition-colors ${
                isPoweredOn
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              Degauss
            </button>
          </div>
          
          {/* Brightness Control */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Brightness: {Math.round(brightness * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={brightness}
              onChange={(e) => handleBrightnessChange(parseFloat(e.target.value))}
              disabled={!isPoweredOn}
              className="w-full"
            />
          </div>
          
          {/* Contrast Control */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Contrast: {Math.round(contrast * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={contrast}
              onChange={(e) => handleContrastChange(parseFloat(e.target.value))}
              disabled={!isPoweredOn}
              className="w-full"
            />
          </div>
          
          {/* Quality Setting */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Render Quality:</label>
            <select
              value={quality}
              onChange={(e) => handleQualityChange(e.target.value as any)}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="ultra">Ultra</option>
            </select>
          </div>
          
          {/* Environment Controls */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showDust}
                onChange={(e) => setShowDust(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Show Dust Particles</span>
            </label>
          </div>
        </div>
      )}
      
      {/* Performance Info */}
      <div className="absolute top-4 right-4 z-10 bg-black/80 text-white p-3 rounded-lg backdrop-blur-sm text-sm">
        <div>Model: {CRTModels[selectedModel]?.name}</div>
        <div>Resolution: {CRTModels[selectedModel]?.resolution.join('x')}</div>
        <div>Year: {CRTModels[selectedModel]?.year}</div>
        <div>Quality: {quality.toUpperCase()}</div>
        <div>Status: {isPoweredOn ? 'ON' : 'OFF'}</div>
      </div>
        {/* 3D Scene */}
      <CRTCanvas
        shadows
        camera={{ 
          position: [2, 1, 3], 
          fov: 50,
          near: 0.1,
          far: 100
        }}
        gl={{ 
          antialias: quality !== 'low',
          powerPreference: quality === 'ultra' ? 'high-performance' : 'default'
        }}
      >
        <Suspense fallback={null}>
          {showEnvironment ? (
            <CRTEnvironment
              dustEnabled={showDust}
              dustCount={quality === 'low' ? 100 : quality === 'medium' ? 200 : 400}
              roomSize={new Vector3(6, 4, 6)}
              airflow={new Vector3(0.02, 0.005, 0.01)}
              lighting={{
                ambientIntensity: 0.3,
                ambientColor: new Color(0x404050),
                directionalIntensity: 0.8,
                directionalColor: new Color(0xffffff),
                directionalPosition: new Vector3(4, 6, 4),
                roomLights: [
                  {
                    position: new Vector3(-2, 3, 2),
                    color: new Color(0xffffcc),
                    intensity: 0.4,
                    distance: 8
                  },
                  {
                    position: new Vector3(3, 2, -1),
                    color: new Color(0xffcccc),
                    intensity: 0.3,
                    distance: 6
                  }
                ]
              }}
              room={{
                size: new Vector3(6, 4, 6),
                wallColor: new Color(0xe8e8e8),
                floorColor: new Color(0xd0d0d0),
                ceilingColor: new Color(0xf5f5f5),
                showWalls: true
              }}
            >
              <CRTMonitor
                ref={crtRef}
                model={selectedModel}
                position={new Vector3(0, -0.5, 0)}
                rotation={new Vector3(0, 0, 0)}
                scale={new Vector3(1, 1, 1)}
                screenContent={screenContent}                autoPlay={isPoweredOn}
                quality={quality}
                events={{
                  onPowerToggle: (isOn: boolean) => setIsPoweredOn(isOn),
                  onControlChange: (control: string, value: number) => {
                    if (control === 'brightness') setBrightness(value);
                    if (control === 'contrast') setContrast(value);
                  }
                }}
              />
            </CRTEnvironment>
          ) : (
            <>
              <ambientLight intensity={0.4} />
              <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
              <CRTMonitor
                ref={crtRef}
                model={selectedModel}
                position={new Vector3(0, 0, 0)}
                rotation={new Vector3(0, 0, 0)}
                scale={new Vector3(1, 1, 1)}                screenContent={screenContent}
                autoPlay={isPoweredOn}
                quality={quality}
                events={{
                  onPowerToggle: (isOn: boolean) => setIsPoweredOn(isOn),
                  onControlChange: (control: string, value: number) => {
                    if (control === 'brightness') setBrightness(value);
                    if (control === 'contrast') setContrast(value);
                  }
                }}
              />
            </>
          )}
          
          {/* Contact shadows for realism */}
          <ContactShadows
            position={[0, -1, 0]}
            opacity={0.4}
            scale={10}
            blur={1.5}
            far={2}
          />
          
          {/* Environment map for reflections */}
          <Environment preset="apartment" />
          
          {/* Camera controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            minDistance={1}
            maxDistance={10}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
          />        </Suspense>
      </CRTCanvas>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/80 text-white p-3 rounded-lg backdrop-blur-sm text-sm max-w-md">
        <h4 className="font-bold mb-2">Instructions:</h4>
        <ul className="space-y-1 text-xs">
          <li>• Drag to rotate view</li>
          <li>• Scroll to zoom in/out</li>
          <li>• Use controls to adjust monitor settings</li>
          <li>• Try different monitor models</li>
          <li>• Degauss to reduce color distortion</li>
          <li>• Adjust quality for performance</li>
        </ul>
      </div>
    </div>
  );
};

export default CRTMonitorDemo;
