import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../components/theme-provider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

// We'll use system serif fonts
const serif = {
  variable: '--font-serif',
}

export const metadata: Metadata = {
  title: 'Alex Johnson - Computer Science Student & Full-Stack Developer',
  description: 'Passionate computer science student with expertise in full-stack development, DevOps, and open source contributions. Currently pursuing BS in Computer Science with focus on software engineering and cloud technologies.',
  keywords: [
    'Alex Johnson',
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
  authors: [{ name: 'Alex Johnson' }],
  creator: 'Alex Johnson',
  publisher: 'Alex Johnson',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://alexjohnson.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Alex Johnson - Computer Science Student & Full-Stack Developer',
    description: 'Passionate computer science student with expertise in full-stack development, DevOps, and open source contributions.',
    url: 'https://alexjohnson.dev',
    siteName: 'Alex Johnson Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Alex Johnson Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alex Johnson - Computer Science Student & Full-Stack Developer',
    description: 'Passionate computer science student with expertise in full-stack development, DevOps, and open source contributions.',
    creator: '@alexjohnson',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body 
        className={`${inter.variable} ${serif.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
