'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Only register in production
    if (process.env.NODE_ENV !== 'production') {
      console.log('Service Worker registration skipped in development')
      return
    }
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            console.log('New service worker available')
            
            // Optionally notify user about update
            if (registration.installing) {              registration.installing.addEventListener('statechange', (e) => {
                const target = e.target as ServiceWorker
                if (target?.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('New content available; refresh to update')
                    // Could show a notification here
                  }
                }
              })
            }
          })
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
      
      // Listen for messages from SW
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Message from SW:', event.data)
      })
      
      // Performance monitoring
      if ('performance' in window) {        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming
              // Send performance data to service worker
              navigator.serviceWorker.ready.then((registration) => {
                registration.active?.postMessage({
                  type: 'PERFORMANCE_MARK',
                  name: 'page-load-time',
                  value: navEntry.loadEventEnd - navEntry.loadEventStart
                })
              })
            }
          }
        })
        
        observer.observe({ entryTypes: ['navigation'] })
      }
    }
  }, [])

  return null // This component doesn't render anything
}
