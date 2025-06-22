import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientProviders } from '../components/client-providers'
import { GlobalErrorBoundary } from '../components/error-boundary/GlobalErrorBoundary'
import { portfolioData } from '../data/portfolio'

// Optimized font loading with fallbacks and display strategies
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  preload: true,
})

// System fonts with proper CSS variables
const serif = {
  variable: '--font-serif',
}

const mono = {
  variable: '--font-mono',
}

// Content Security Policy for security
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https:;
  font-src 'self' https://fonts.gstatic.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`

// Centralized metadata using portfolio data
const { personal } = portfolioData
const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] || 'https://rajinuddin.dev'

export const metadata: Metadata = {
  title: {
    default: `${personal.name} - ${personal.title}`,
    template: `%s | ${personal.name}`,
  },
  description: personal.bio,
  keywords: [
    personal.name,
    personal.title,
    'Computer Science Student',
    'Full-Stack Developer',
    'DevOps',
    'Software Engineer',
    'React',
    'TypeScript',
    'Next.js',
    'Node.js',
    'Python',
    'Portfolio'
  ],
  authors: [{ name: personal.name, url: siteUrl }],
  creator: personal.name,
  publisher: personal.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'x-default': '/',
    },
  },
  openGraph: {
    title: `${personal.name} - ${personal.title}`,
    description: personal.bio,
    url: siteUrl,
    siteName: `${personal.name} Portfolio`,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${personal.name} Portfolio`,
        type: 'image/jpeg',
      },
      {
        url: '/og-image-square.jpg',
        width: 1200,
        height: 1200,
        alt: `${personal.name} Portfolio`,
        type: 'image/jpeg',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${personal.name} - ${personal.title}`,
    description: personal.bio,
    creator: '@rajinuddin', // Update with actual Twitter handle
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },  verification: {
    google: process.env['GOOGLE_SITE_VERIFICATION'] || 'your-google-site-verification',
    yandex: process.env['YANDEX_VERIFICATION'] || undefined,
  },
  category: 'technology',
  classification: 'personal portfolio',
  referrer: 'origin-when-cross-origin',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${inter.variable} ${mono.variable} ${serif.variable}`}
    >
      <head>
        {/* Security headers */}
        <meta httpEquiv="Content-Security-Policy" content={cspHeader.replace(/\s{2,}/g, ' ').trim()} />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="origin-when-cross-origin" />
        
        {/* Performance hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
          {/* Icons and manifest */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Additional meta tags for better mobile experience */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />        <meta name="apple-mobile-web-app-title" content={personal.name} />
      </head>
      <body 
        className="bg-black text-terminal-amber font-terminal antialiased min-h-screen"
        suppressHydrationWarning
      >
        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-terminal-amber text-terminal-black px-4 py-2 rounded-md z-50 font-terminal"
        >
          Skip to main content
        </a>

        {/* No-script fallback */}
        <noscript>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This website works best with JavaScript enabled. Please enable JavaScript for the best experience.
                </p>
              </div>
            </div>
          </div>        </noscript>        <ClientProviders
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="portfolio-theme"
        >
          <GlobalErrorBoundary
            enableRetry={true}
            maxRetries={3}
            showErrorDetails={process.env.NODE_ENV === 'development'}
          >
            {children}
          </GlobalErrorBoundary>
          {/* Retro Theme Toggle */}
          <div suppressHydrationWarning>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  // Prevent flash of unstyled content
                  (function() {
                    const theme = localStorage.getItem('portfolio-retro-theme') || 'retro';
                    document.documentElement.classList.add(theme + '-mode');
                  })();
                `
              }}
            />
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}
