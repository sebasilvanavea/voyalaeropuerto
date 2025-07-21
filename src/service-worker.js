// Performance-optimized Service Worker
const CACHE_NAME = 'voya-cache-v1';
const RUNTIME_CACHE = 'voya-runtime-v1';

// Recursos críticos para cachear inmediatamente
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/assets/logo1.png'
  // '/assets/fondo.jpg' // Comentado hasta que se agregue el archivo
];

// Estrategias de cache
const CACHE_STRATEGIES = {
  // Cache first para recursos estáticos
  CACHE_FIRST: 'cache-first',
  // Network first para API calls
  NETWORK_FIRST: 'network-first',
  // Stale while revalidate para imágenes
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Install event - Cache recursos críticos
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('✅ Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Cache installation failed:', error);
      })
  );
});

// Activate event - Clean old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - Handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Determine strategy based on request type
  let strategy = CACHE_STRATEGIES.NETWORK_FIRST;

  if (request.destination === 'image') {
    strategy = CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
  } else if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    url.pathname.includes('/assets/')
  ) {
    strategy = CACHE_STRATEGIES.CACHE_FIRST;
  }

  event.respondWith(handleRequest(request, strategy));
});

// Handle request with specified strategy
async function handleRequest(request, strategy) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);

  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetchAndCache(request, cache);

    case CACHE_STRATEGIES.NETWORK_FIRST:
      try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        if (cachedResponse) {
          console.log('📱 Serving from cache (offline):', request.url);
          return cachedResponse;
        }
        throw error;
      }

    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      // Return cached version immediately
      const response = cachedResponse || fetch(request);
      
      // Update cache in background
      if (!cachedResponse) {
        fetchAndCache(request, cache);
      } else {
        // Revalidate in background
        fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
        }).catch(() => {
          // Ignore network errors for background updates
        });
      }
      
      return response;

    default:
      return fetch(request);
  }
}

// Fetch and cache helper
async function fetchAndCache(request, cache) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Don't cache opaque responses
      if (networkResponse.type !== 'opaque') {
        cache.put(request, networkResponse.clone());
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Network request failed:', request.url, error);
    
    // Return offline fallback for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await cache.match('/index.html');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    throw error;
  }
}

// Background sync for form submissions (if supported)
if ('sync' in self.registration) {
  self.addEventListener('sync', (event) => {
    if (event.tag === 'form-submission') {
      event.waitUntil(handleFormSubmission());
    }
  });
}

async function handleFormSubmission() {
  // Handle offline form submissions
  console.log('📤 Processing offline form submissions');
}

// Push notifications (if supported)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'Nueva notificación',
    icon: '/assets/logo1.png',
    badge: '/assets/logo1.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Voya al Aeropuerto', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.openWindow(event.notification.data.url || '/')
  );
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_MARK') {
    console.log('📊 Performance mark:', event.data.name, event.data.time);
  }
});

console.log('🚀 Service Worker loaded and ready!');
