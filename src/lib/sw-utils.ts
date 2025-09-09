// Service Worker утилиты для кэширования и производительности
export interface ServiceWorkerConfig {
  scope?: string;
  updateViaCache?: 'imports' | 'all' | 'none';
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}
class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private isSupported = false;
  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'serviceWorker' in navigator;
  }
  async register(config: ServiceWorkerConfig = {}): Promise<ServiceWorkerRegistration | null> {
    if (!this.isSupported) {
      return null;
    }
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: config.scope || '/',
        updateViaCache: config.updateViaCache || 'none',
      });
      this.registration = registration;
      // Обработчики событий
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              config.onUpdate?.(registration);
            }
          });
        }
      });
      if (registration.active) {
        config.onSuccess?.(registration);
      }
      return registration;
    } catch (error) {
      config.onError?.(error as Error);
      return null;
    }
  }
  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }
    try {
      return await this.registration.unregister();
    } catch (error) {
      return false;
    }
  }
  async update(): Promise<void> {
    if (this.registration) {
      await this.registration.update();
    }
  }
  // Проверка доступности Service Worker
  isServiceWorkerSupported(): boolean {
    return this.isSupported;
  }
  // Отправка сообщения Service Worker
  async postMessage(message: unknown): Promise<void> {
    try {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(message);
      }
    } catch (error) {
      // Игнорируем ошибки связанные с закрытием портов
    }
  }
  // Очистка кэша
  async cleanCache(): Promise<void> {
    await this.postMessage({ type: 'CLEAN_CACHE' });
  }
  // Получение информации о кэше
  async getCacheInfo(): Promise<{ name: string; size: number }[]> {
    if (!('caches' in window)) {
      return [];
    }
    try {
      const cacheNames = await caches.keys();
      const cacheInfo = await Promise.all(
        cacheNames.map(async (name) => {
          const cache = await caches.open(name);
          const keys = await cache.keys();
          return { name, size: keys.length };
        })
      );
      return cacheInfo;
    } catch (error) {
      return [];
    }
  }
}
// Singleton экземпляр
export const swManager = new ServiceWorkerManager();
// Preload критических ресурсов
export function preloadCriticalResources(): void {
  if (typeof window === 'undefined') return;
  const criticalResources = [
    { href: '/manifest.json', as: 'fetch', crossorigin: 'anonymous' },
    { href: '/favicon.svg', as: 'image' },
  ];
  for (const { href, as, crossorigin } of criticalResources) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (crossorigin) link.crossOrigin = crossorigin;
    document.head.appendChild(link);
  }
}
// Prefetch следующих страниц
export function prefetchRoutes(routes: string[]): void {
  if (typeof window === 'undefined') return;
  for (const route of routes) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  }
}
// Типы для Network Information API
interface NetworkConnection {
  effectiveType?: string;
  downlink?: number;
  saveData?: boolean;
}
interface NavigatorWithConnection extends Navigator {
  connection?: NetworkConnection;
  mozConnection?: NetworkConnection;
  webkitConnection?: NetworkConnection;
}
// Проверка сетевого соединения
export function getNetworkInfo(): {
  effectiveType?: string;
  downlink?: number;
  saveData?: boolean
} {
  if (typeof window === 'undefined') return {};
  const nav = navigator as NavigatorWithConnection;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  if (!connection) return {};
  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    saveData: connection.saveData,
  };
}
// Adaptive loading на основе сетевого соединения
export function shouldLoadOptimized(): boolean {
  const networkInfo = getNetworkInfo();
  // Загружаем оптимизированные ресурсы для медленных соединений
  return (
    networkInfo.saveData === true ||
    networkInfo.effectiveType === 'slow-2g' ||
    networkInfo.effectiveType === '2g' ||
    (networkInfo.downlink && networkInfo.downlink < 1.5)
  );
}
// Resource hints для оптимизации загрузки
export function addResourceHints(): void {
  if (typeof document === 'undefined') return;
  const hints = [
    { rel: 'dns-prefetch', href: '//raw.githubusercontent.com' },
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://dictionary.yandex.net' },
  ];
  for (const { rel, href } of hints) {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    document.head.appendChild(link);
  }
}
