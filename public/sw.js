// Enhanced Service Worker for Portfolio Site
// Provides aggressive caching, offline support, and performance optimization

const CACHE_NAME = 'portfolio-v1.0.0'
const STATIC_CACHE = 'static-v1.0.0'
const DYNAMIC_CACHE = 'dynamic-v1.0.0'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/favicon.svg',
  '/site.webmanifest',
  // Add more static assets as needed
]

// Assets that should be cached on first access
const DYNAMIC_CACHE_PATTERNS = [
  /\/_next\/static\/.*/,
  /\/api\/.*/,
  /\.js$/,
  /\.css$/,
  /\.woff2?$/,
  /\.png$/,
  /\.jpg$/,
  /\.svg$/
]

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[ServiceWorker] Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('[ServiceWorker] Installed successfully')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('[ServiceWorker] Installation failed:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('[ServiceWorker] Activated successfully')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') return
  
  // Skip analytics and tracking requests
  if (url.hostname.includes('analytics') || 
      url.hostname.includes('gtag') || 
      url.hostname.includes('google-analytics')) {
    return
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('[ServiceWorker] Serving from cache:', request.url)
          return cachedResponse
        }
        
        // Otherwise, fetch from network
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache if not a successful response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse
            }
            
            // Check if we should cache this resource
            const shouldCache = DYNAMIC_CACHE_PATTERNS.some(pattern => 
              pattern.test(request.url)
            )
            
            if (shouldCache) {
              // Clone the response for caching
              const responseToCache = networkResponse.clone()
              
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  console.log('[ServiceWorker] Caching dynamic asset:', request.url)
                  cache.put(request, responseToCache)
                })
                .catch((error) => {
                  console.warn('[ServiceWorker] Failed to cache:', request.url, error)
                })
            }
            
            return networkResponse
          })
          .catch((error) => {
            console.error('[ServiceWorker] Fetch failed:', request.url, error)
            
            // Return offline fallback for navigation requests
            if (request.destination === 'document') {
              return caches.match('/')
            }
            
            // Return cached version or throw error
            return caches.match(request) || Promise.reject(error)
          })
      })
  )
})

// Background sync for analytics data
self.addEventListener('sync', (event) => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(
      // Sync analytics data when back online
      syncAnalyticsData()
    )
  }
})

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/favicon.svg',
      badge: '/favicon.svg'
    }
    
    event.waitUntil(
      self.registration.showNotification('Portfolio Update', options)
    )
  }
})

// Helper functions
async function syncAnalyticsData() {
  try {
    // Implement analytics sync logic here
    console.log('[ServiceWorker] Syncing analytics data...')
  } catch (error) {
    console.error('[ServiceWorker] Analytics sync failed:', error)
  }
}

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_MARK') {
    console.log('[ServiceWorker] Performance mark:', event.data.name, event.data.value)
  }
})
