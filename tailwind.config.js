/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        terminal: ['"VT323"', '"Press Start 2P"', '"Courier Prime"', 'monospace'],
        pixel: ['"Press Start 2P"', '"VT323"', 'monospace'],
        retro: ['"IBM 3270"', '"VT323"', '"Courier New"', 'monospace'],
      },colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Terminal/CRT theme colors
        terminal: {
          amber: '#FFB000',
          orange: '#FF8C00',
          green: '#00FF41',
          black: '#0A0A0A',
          cream: '#FDF6E3',
          shadow: '#1A1A1A',
          glow: '#FFD700',
        },
        crt: {
          bg: '#0D1B2A',
          amber: '#FFB000',
          orange: '#D2691E',
          green: '#32CD32',
          red: '#FF6B6B',
          white: '#E8E8E8',
          black: '#000000',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: 'inherit',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            '[class~="lead"]': {
              color: 'inherit',
            },
            strong: {
              color: 'inherit',
            },
            'h1, h2, h3, h4': {
              color: 'inherit',
            },
            code: {
              color: 'inherit',
            },
            'blockquote p:first-of-type::before': false,
            'blockquote p:last-of-type::after': false,
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        // Terminal animations
        'typewriter': 'typewriter 2s steps(20) infinite',
        'blink': 'blink 1s step-end infinite',
        'crt-flicker': 'crtFlicker 0.15s linear infinite',
        'scanlines': 'scanlines 2s linear infinite',
        'terminal-glow': 'terminalGlow 2s ease-in-out infinite alternate',
        'boot-sequence': 'bootSequence 3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        // Terminal keyframes
        typewriter: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        crtFlicker: {
          '0%, 98%': { opacity: '1' },
          '99%': { opacity: '0.98' },
          '100%': { opacity: '1' },
        },
        scanlines: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        terminalGlow: {
          '0%': { textShadow: '0 0 5px currentColor, 0 0 10px currentColor' },
          '100%': { textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' },
        },
        bootSequence: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { opacity: '0.5', transform: 'scale(1.02)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
