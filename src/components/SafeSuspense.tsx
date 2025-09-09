"use client";
import { Suspense, lazy, useEffect, useState, type ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}
export function LoadingSpinner({
  size = 'md',
  text = 'Загрузка...',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {text && (
        <span className="text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  );
}
interface ComponentLoadingProps {
  className?: string;
  text?: string;
  minimal?: boolean;
}
export function ComponentLoading({
  className = '',
  text = 'Загрузка компонента...',
  minimal = false
}: ComponentLoadingProps) {
  if (minimal) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <LoadingSpinner size="sm" text={text} />
      </div>
    );
  }
  return (
    <Card className={`glass-card border-dashed ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">{text}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Подождите немного...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
interface PageLoadingProps {
  text?: string;
  className?: string;
}
export function PageLoading({
  text = 'Загрузка страницы...',
  className = ''
}: PageLoadingProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${className}`}>
      <Card className="w-full max-w-md glass-card">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-primary/20" />
              <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary animate-spin" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{text}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Готовим всё необходимое для вас
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
interface LoadingTimeoutProps {
  onTimeout: () => void;
  timeoutMs?: number;
  children: ReactNode;
}
function LoadingTimeout({
  onTimeout,
  timeoutMs = 15000,
  children
}: LoadingTimeoutProps) {
  const [hasTimedOut, setHasTimedOut] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setHasTimedOut(true);
      onTimeout();
    }, timeoutMs);
    return () => clearTimeout(timeout);
  }, [onTimeout, timeoutMs]);
  if (hasTimedOut) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md glass-card border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Загрузка занимает больше времени
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Возможно, медленное соединение или проблемы с сервером
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return <>{children}</>;
}
interface SafeSuspenseProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  level?: 'page' | 'component' | 'critical';
  timeoutMs?: number;
  onError?: (error: Error) => void;
  onTimeout?: () => void;
}
export function SafeSuspense({
  children,
  fallback,
  errorFallback,
  level = 'component',
  timeoutMs = 15000,
  onError,
  onTimeout = () => {},
}: SafeSuspenseProps) {
  const defaultFallback = level === 'page'
    ? <PageLoading />
    : <ComponentLoading minimal={level === 'component'} />;
  const defaultErrorFallback = level === 'page' ? undefined : (
    <div className="p-4 text-center">
      <p className="text-sm text-muted-foreground">
        Компонент временно недоступен
      </p>
    </div>
  );
  return (
    <ErrorBoundary
      level={level}
      onError={onError}
      fallback={errorFallback || defaultErrorFallback}
    >
      <Suspense
        fallback={
          <LoadingTimeout onTimeout={onTimeout} timeoutMs={timeoutMs}>
            {fallback || defaultFallback}
          </LoadingTimeout>
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
// Hook для создания безопасных lazy компонентов
export function useSafeLazy<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  retryCount = 3
) {
  return lazy(() => {
    let retries = 0;
    const loadComponent = async (): Promise<{ default: T }> => {
      try {
        return await componentImport();
      } catch (error) {
        if (retries < retryCount) {
          retries++;
          // Добавляем небольшую задержку перед повтором
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
          return loadComponent();
        }
        throw error;
      }
    };
    return loadComponent();
  });
}
// Экспорт для удобства
export { Suspense };
