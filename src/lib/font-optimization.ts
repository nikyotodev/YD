// Оптимизация загрузки шрифтов для производительности
import React from 'react';
// Preload критических шрифтов
export function preloadFonts(): void {
  if (typeof document === 'undefined') return;
  // Google Fonts уже загружаются через Next.js в layout.tsx
  // Дополнительный preload не нужен, так как Next.js оптимизирует это автоматически
}
// Font display optimization
export function optimizeFontDisplay(): void {
  if (typeof document === 'undefined') return;
  // Google Fonts уже оптимизированы через Next.js font optimization в layout.tsx
  // font-display: swap уже установлен в конфигурации шрифтов
}
// Font loading observer
const loadedFonts = new Set<string>();
const observers = new Map<string, Array<() => void>>();
function startObserving(fontFamily: string): void {
  if (typeof document === 'undefined') return;
  // Используем Font Loading API если доступен
  if ('fonts' in document) {
    document.fonts.load(`16px "${fontFamily}"`).then(() => {
      onFontLoaded(fontFamily);
    }).catch(() => {
      // Fallback если шрифт не загрузился
      setTimeout(() => onFontLoaded(fontFamily), 3000);
    });
  } else {
    // Fallback для старых браузеров
    setTimeout(() => onFontLoaded(fontFamily), 1000);
  }
}
function onFontLoaded(fontFamily: string): void {
  loadedFonts.add(fontFamily);
  const callbacks = observers.get(fontFamily) || [];
  for (const callback of callbacks) {
    callback();
  }
  observers.delete(fontFamily);
}
export function waitForFont(fontFamily: string): Promise<void> {
  if (loadedFonts.has(fontFamily)) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    if (!observers.has(fontFamily)) {
      observers.set(fontFamily, []);
      startObserving(fontFamily);
    }
    const fontObservers = observers.get(fontFamily);
    if (fontObservers) {
      fontObservers.push(resolve);
    }
  });
}
export function isFontLoaded(fontFamily: string): boolean {
  return loadedFonts.has(fontFamily);
}
// Adaptive font loading based on connection speed
interface NetworkConnection {
  effectiveType?: '4g' | '3g' | '2g' | 'slow-2g';
  downlink?: number;
}
interface NavigatorWithConnection extends Navigator {
  connection?: NetworkConnection;
}
export function getOptimalFontStrategy(): 'swap' | 'block' | 'fallback' {
  if (typeof navigator === 'undefined') return 'swap';
  const connection = (navigator as NavigatorWithConnection).connection;
  if (!connection) return 'swap';
  // Для медленных соединений используем fallback
  if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
    return 'fallback';
  }
  // Для быстрых соединений можем использовать block
  if (connection.effectiveType === '4g' && connection.downlink && connection.downlink > 10) {
    return 'block';
  }
  // По умолчанию swap
  return 'swap';
}
// Font subsetting utility
const CYRILLIC_RANGE = 'U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116';
const LATIN_RANGE = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
export function generateFontCSS(fontFamily: string, weight: number | string = 400): string {
  // Google Fonts через Next.js уже оптимизированы, дополнительные @font-face не нужны
  return '';
}
export function injectOptimizedFonts(): void {
  if (typeof document === 'undefined') return;
  // Google Fonts через Next.js уже оптимизированы и вставлены
  // Дополнительная инъекция стилей не требуется
}
// Critical CSS для шрифтов
export const CRITICAL_FONT_CSS = `
  /* Критические стили шрифтов для предотвращения FOUT */
  .font-sans {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  .font-mono {
    font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace;
  }
  /* Оптимизация для кириллицы */
  [lang="ru"] .font-sans,
  [lang="ru"] .font-mono {
    font-variant-ligatures: none;
    text-rendering: optimizeSpeed;
  }
`;
// Hook для отслеживания загрузки шрифтов
export function useFontLoading(fontFamily: string) {
  const [isLoaded, setIsLoaded] = React.useState(() =>
    FontLoadingObserver.isFontLoaded(fontFamily)
  );
  React.useEffect(() => {
    if (isLoaded) return;
    FontLoadingObserver.waitForFont(fontFamily).then(() => {
      setIsLoaded(true);
    });
  }, [fontFamily, isLoaded]);
  return isLoaded;
}
// Инициализация оптимизации шрифтов
export function initializeFontOptimization(): void {
  if (typeof window === 'undefined') return;
  // Preload критических шрифтов
  preloadFonts();
  // Inject критического CSS
  const style = document.createElement('style');
  style.textContent = CRITICAL_FONT_CSS;
  document.head.insertBefore(style, document.head.firstChild);
  // Оптимизация загрузки шрифтов
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectOptimizedFonts();
    });
  } else {
    injectOptimizedFonts();
  }
}
