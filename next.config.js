/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment detection
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Image optimization with CDN support
  images: {
    domains: ['github.com', 'githubusercontent.com', 'cdn.jsdelivr.net'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 60,
    unoptimized: false,
  },
  
  // Advanced compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
    reactRemoveProperties: process.env.NODE_ENV === 'production',
    styledComponents: true,
  },

  // Progressive Web App settings
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
  },

  // Advanced bundle optimization
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Security: Prevent client-side access to server modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Advanced code splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Framework chunks
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // 3D libraries - separate chunk for better caching
          threejs: {
            test: /[\\/]node_modules[\\/](@react-three|three)[\\/]/,
            name: 'threejs',
            priority: 30,
            chunks: 'all',
            enforce: true,
          },
          // Animation libraries
          animations: {
            test: /[\\/]node_modules[\\/](framer-motion|react-spring|gsap)[\\/]/,
            name: 'animations',
            priority: 25,
            chunks: 'all',
            enforce: true,
          },
          // UI libraries
          ui: {
            test: /[\\/]node_modules[\\/](lucide-react|clsx|tailwind-merge)[\\/]/,
            name: 'ui',
            priority: 20,
            chunks: 'all',
            enforce: true,
          },
          // Analytics and tracking
          analytics: {
            test: /[\\/](components[\\/]analytics|lib[\\/].*analytics)[\\/]/,
            name: 'analytics',
            priority: 15,
            chunks: 'all',
            enforce: true,
          },
          // Common vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
            enforce: true,
          },
          // Application commons
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            chunks: 'all',
            reuseExistingChunk: true,
          },
        },
      };

      // Tree shaking optimizations
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      config.optimization.innerGraph = true;
    }

    // Source map optimization for production debugging
    if (!dev && !isServer) {
      config.devtool = 'source-map';
    }

    // Bundle analyzer in development
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }

    return config;
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' blob: data: https:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://vitals.vercel-insights.com https://vercel.live ws: wss:",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join('; ')
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      '@react-three/fiber', 
      '@react-three/drei',
      'framer-motion',
      'three',
      'lucide-react'
    ],
    webpackBuildWorker: true,
    esmExternals: true,
    serverComponentsExternalPackages: ['three'],
    optimizeCss: true,
    gzipSize: true,
  },

  // Server-side optimizations
  serverExternalPackages: ['three', '@react-three/fiber', '@react-three/drei'],

  // Output configuration
  output: 'standalone',
  
  // Compression
  compress: true,

  // Development optimizations
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // Build optimization
  eslint: {
    ignoreDuringBuilds: false, // Keep enabled for production quality
  },
  typescript: {
    ignoreBuildErrors: false, // Keep enabled for production quality
  },

  // PoweredByHeader removal for security
  poweredByHeader: false,

  // Redirects and rewrites for better SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Rewrites for API routes
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/health-check',
      },
    ];
  },
};

module.exports = nextConfig;
