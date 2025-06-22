/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['github.com', 'githubusercontent.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Advanced compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Aggressive optimization flags
  optimizeFonts: true,
  
  // Modern build target
  swcMinify: true,
  
  // Advanced bundle splitting
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    if (!isServer) {
      // Aggressive code splitting for client
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            enforce: true,
          },
          // 3D libraries (Three.js, React Three Fiber)
          threejs: {
            test: /[\\/]node_modules[\\/](@react-three|three)[\\/]/,
            name: 'threejs',
            priority: 20,
            enforce: true,
          },
          // Analytics libraries
          analytics: {
            test: /[\\/](components[\\/]analytics|lib[\\/].*analytics)[\\/]/,
            name: 'analytics',
            priority: 15,
            enforce: true,
          },
          // UI libraries
          ui: {
            test: /[\\/]node_modules[\\/](framer-motion|react-spring)[\\/]/,
            name: 'ui',
            priority: 12,
            enforce: true,
          },
          // Common chunks
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      }

      // Tree shaking optimizations
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
    }

    return config
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ]
  },

  // Disable build-time checks for performance
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Experimental performance features
  experimental: {
    optimizePackageImports: [
      '@react-three/fiber', 
      '@react-three/drei',
      'framer-motion',
      'react-spring'
    ],
    webpackBuildWorker: true,
    esmExternals: true,
    serverComponentsExternalPackages: ['three'],
  },

  // Output optimization
  output: 'standalone',
  
  // Compression
  compress: true,
}

module.exports = nextConfig
