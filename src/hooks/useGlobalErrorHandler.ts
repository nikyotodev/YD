"use client";
import { useEffect, useCallback } from 'react';
import { useErrorHandler, type AppError } from '@/lib/error-handlers';
interface GlobalErrorHandlerOptions {
  enableGlobalErrorListener?: boolean;
  enableUnhandledRejectionListener?: boolean;
  onError?: (error: AppError) => void;
}
export function useGlobalErrorHandler(options: GlobalErrorHandlerOptions = {}) {
  const {
    enableGlobalErrorListener = true,
    enableUnhandledRejectionListener = true,
    onError,
  } = options;
  const { categorizeError } = useErrorHandler();
  const handleGlobalError = useCallback((event: ErrorEvent) => {
    const error = categorizeError(event.error || new Error(event.message));
    onError?.(error);
    // Предотвращаем дефолтное поведение только в development
    if (process.env.NODE_ENV === 'development') {
      return false;
    }
    // В production позволяем браузеру обработать ошибку
    return true;
  }, [categorizeError, onError]);
  const handleUnhandledRejection = useCallback((event: PromiseRejectionEvent) => {
    const error = categorizeError(event.reason);
    onError?.(error);
    // Предотвращаем дефолтные сообщения об ошибках в консоли в production
    if (process.env.NODE_ENV === 'production') {
      event.preventDefault();
    }
  }, [categorizeError, onError]);
  useEffect(() => {
    if (enableGlobalErrorListener) {
      window.addEventListener('error', handleGlobalError);
    }
    if (enableUnhandledRejectionListener) {
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
    }
    return () => {
      if (enableGlobalErrorListener) {
        window.removeEventListener('error', handleGlobalError);
      }
      if (enableUnhandledRejectionListener) {
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      }
    };
  }, [
    enableGlobalErrorListener,
    enableUnhandledRejectionListener,
    handleGlobalError,
    handleUnhandledRejection,
  ]);
  return {
    handleGlobalError,
    handleUnhandledRejection,
  };
}
