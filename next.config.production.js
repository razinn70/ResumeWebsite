const nextConfig = {
  images: {
    domains: ['github.com', 'githubusercontent.com'],
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
        ],
      },
    ]
  },
  // Completely disable linting during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during build  
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimize for production
  swcMinify: true,
  // Handle experimental features
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three'],
  },
}

module.exports = nextConfig
