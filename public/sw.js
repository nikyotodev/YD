const CACHE_NAME = 'yourdeutsch-v1.0.0';
const STATIC_CACHE_NAME = 'yourdeutsch-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'yourdeutsch-dynamic-v1.0.0';

// Критически важные ресурсы для кэширования
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/logo-d-german-flag-improved2.svg',
  '/_next/static/css/',
  '/_next/static/js/',
];

// API endpoints для кэширования
const API_CACHE_PATTERNS = [
  /^https:\/\/raw\.githubusercontent\.com\/nikyotodev\/talkify-media\/main/,
  /^\/api\/dictionary\/languages/,
];

// Устанавливаем Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS.filter(asset => asset !== '/_next/static/css/' && asset !== '/_next/static/js/'));
    })
  );
  self.skipWaiting();
});

// Активируем и очищаем старые кэши
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Обрабатываем сетевые запросы
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Только GET запросы
  if (request.method !== 'GET') return;

  // Стратегия кэширования для разных типов ресурсов
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
  } else if (isAPIRequest(url)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME, 3000));
  } else if (isImageRequest(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
  } else {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE_NAME));
  }
});

// Проверяем типы ресурсов
function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff')
  );
}

function isAPIRequest(url) {
  return (
    url.pathname.startsWith('/api/') ||
    API_CACHE_PATTERNS.some(pattern => pattern.test(url.href))
  );
}

function isImageRequest(url) {
  return /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(url.pathname);
}

// Cache First стратегия
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Fallback для офлайн режима
    if (request.destination === 'document') {
      return cache.match('/');
    }
    throw error;
  }
}

// Network First стратегия с таймаутом
async function networkFirst(request, cacheName, timeout = 3000) {
  const cache = await caches.open(cacheName);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(request, {
      signal: controller.signal,
      headers: {
        ...request.headers,
        'Cache-Control': 'max-age=300'
      }
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Stale While Revalidate стратегия
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

// Чистка кэша при нехватке места
self.addEventListener('message', (event) => {
  try {
    if (event.data && event.data.type === 'CLEAN_CACHE') {
      cleanOldCache();
    }
  } catch (error) {
    // Игнорируем ошибки обработки сообщений
  }
});

async function cleanOldCache() {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const keys = await cache.keys();

  // Оставляем только последние 50 записей
  if (keys.length > 50) {
    const toDelete = keys.slice(0, keys.length - 50);
    await Promise.all(toDelete.map(key => cache.delete(key)));
  }
}
