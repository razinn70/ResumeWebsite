'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface CRTPortraitProps {
  src: string
  alt: string
  className?: string
}

export function CRTPortrait({ src, alt, className = "" }: CRTPortraitProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [scanlineOffset, setScanlineOffset] = useState(0)

  useEffect(() => {
    // Animate scanlines
    const interval = setInterval(() => {
      setScanlineOffset(prev => (prev + 1) % 100)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* CRT Monitor Frame */}
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl">
        {/* Screen Bezel */}
        <div className="relative bg-black p-4 rounded-lg overflow-hidden">
          {/* Portrait Image */}
          <div className="relative">
            <motion.img
              src={src}
              alt={alt}
              className={`
                w-full h-auto pixel-dither rounded-lg
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                transition-opacity duration-500
              `}
              onLoad={() => setImageLoaded(true)}
              initial={{ filter: 'brightness(0.3) contrast(1.5) sepia(1) hue-rotate(25deg)' }}
              animate={{ filter: 'brightness(0.8) contrast(1.2) sepia(0.3) hue-rotate(25deg)' }}
              transition={{ duration: 2 }}
            />
            
            {/* CRT Scanlines Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  repeating-linear-gradient(
                    0deg,
                    transparent 0px,
                    transparent 2px,
                    rgba(255, 176, 0, 0.03) 2px,
                    rgba(255, 176, 0, 0.03) 4px
                  )
                `,
                transform: `translateY(${scanlineOffset}px)`
              }}
            />
            
            {/* Phosphor Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-terminal-amber/10 to-transparent pointer-events-none" />
            
            {/* Screen Reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
        
        {/* Monitor Details */}
        <div className="mt-4 flex justify-between items-center text-gray-400 text-xs">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>PWR</span>
          </div>
          <div className="text-center">
            <div className="text-terminal-amber font-mono">TERMINAL-9000</div>
          </div>
          <div className="flex space-x-1">
            <button className="w-3 h-3 bg-gray-600 rounded-full hover:bg-gray-500 transition-colors"></button>
            <button className="w-3 h-3 bg-gray-600 rounded-full hover:bg-gray-500 transition-colors"></button>
          </div>
        </div>
      </div>
      
      {/* Base/Stand */}
      <motion.div 
        className="mx-auto mt-2 w-20 h-6 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-lg"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      />
    </motion.div>
  )
}

export default CRTPortrait
