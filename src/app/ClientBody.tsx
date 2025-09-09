"use client";
import type React from "react";
import { useEffect } from "react";
import { UserProvider } from "@/contexts/UserContext";
import { AppWrapper } from "@/components/AppWrapper";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useGlobalErrorHandler } from "@/hooks/useGlobalErrorHandler";
import { logger } from "@/lib/logger";
import { swManager, addResourceHints, preloadCriticalResources } from "@/lib/sw-utils";
import { initializeFontOptimization } from "@/lib/font-optimization";
interface ClientBodyProps {
  children: React.ReactNode;
}
export default function ClientBody({ children }: ClientBodyProps) {
  // Глобальный обработчик ошибок
  useGlobalErrorHandler({
    onError: (error) => {
      // Логируем ошибки только в development
      if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
        logger.error('Global error caught:', error);
      }
    },
  });
  // Инициализация производительности и Service Worker
  useEffect(() => {
    // Очистка класса body после гидратации
    document.body.className = "antialiased";
    // Добавляем resource hints для оптимизации загрузки
    addResourceHints();
    // Preload критических ресурсов
    preloadCriticalResources();
    // Инициализация оптимизации шрифтов
    initializeFontOptimization();
    // Регистрируем Service Worker для кэширования
    swManager.register({
      onSuccess: (registration) => {
        if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
          logger.info('Service Worker registered successfully');
        }
      },
      onUpdate: (registration) => {
        // Уведомляем пользователя об обновлении
        if (confirm('Доступна новая версия приложения. Обновить?')) {
          window.location.reload();
        }
      },
      onError: (error) => {
        if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
          logger.warn('Service Worker registration failed:', error);
        }
      }
    });
    // Очистка кэша при нехватке места
    const cleanupCache = () => {
      if (navigator.storage?.estimate) {
        navigator.storage.estimate().then(({ usage, quota }) => {
          if (quota && usage && usage / quota > 0.8) {
            swManager.cleanCache();
          }
        });
      }
    };
    // Проверяем использование хранилища каждые 5 минут
    const cleanupInterval = setInterval(cleanupCache, 5 * 60 * 1000);
    return () => {
      clearInterval(cleanupInterval);
    };
  }, []);
  return (
    <div className="antialiased">
      <ErrorBoundary level="critical">
        <UserProvider>
          <AppWrapper>{children}</AppWrapper>
        </UserProvider>
      </ErrorBoundary>
    </div>
  );
}
