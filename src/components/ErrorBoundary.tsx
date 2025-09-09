"use client";
import type React from "react";
import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home, Bug, MessageCircle } from "lucide-react";
import Link from "next/link";
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string | null;
}
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  level?: 'page' | 'component' | 'critical';
}
interface ErrorReport {
  errorId: string;
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  level: string;
  userId?: string;
}
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
      errorId: ErrorBoundary.generateErrorId(),
    };
  }
  private static generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorId = ErrorBoundary.generateErrorId();
    this.setState({
      error,
      errorInfo,
      errorId,
    });
    // Вызываем колбэк если есть
    this.props.onError?.(error, errorInfo);
    // Отправляем ошибки в систему мониторинга только критичные
    if (process.env.NODE_ENV === "production" && this.props.level === "critical") {
      this.reportError(error, errorInfo, errorId);
    }
  }
  private reportError = async (error: Error, errorInfo: React.ErrorInfo, errorId: string) => {
    try {
      const errorReport: ErrorReport = {
        errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack || undefined,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        level: this.props.level || 'component',
      };
      // Отправляем в API логирования с таймаутом
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      await fetch("/api/error-reporting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(errorReport),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (reportingError) {
      // Игнорируем ошибки отправки логов в продакшене
      // В development показываем в консоли
      if (process.env.NODE_ENV === "development") {
        console.warn("Failed to report error:", reportingError);
      }
    }
  };
  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };
  private getErrorMessage(): string {
    if (!this.state.error) return "Произошла неожиданная ошибка";
    const message = this.state.error.message;
    // Переводим частые ошибки на понятный язык
    if (message.includes("ChunkLoadError")) {
      return "Ошибка загрузки ресурсов. Попробуйте обновить страницу.";
    }
    if (message.includes("Network")) {
      return "Проблемы с подключением к интернету. Проверьте соединение.";
    }
    if (message.includes("Firebase")) {
      return "Временные проблемы с сервисом. Мы уже работаем над исправлением.";
    }
    return "Произошла неожиданная ошибка. Мы уже получили уведомление.";
  }
  render() {
    if (this.state.hasError) {
      // Используем кастомный fallback если есть
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-md glass-card border border-red-200 dark:border-red-800">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl font-bold text-red-800 dark:text-red-200">
                Что-то пошло не так
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {this.getErrorMessage()}
                </p>
                {this.state.errorId && (
                  <p className="text-xs text-muted-foreground mt-2 font-mono">
                    ID ошибки: {this.state.errorId}
                  </p>
                )}
              </div>
              {/* Детали ошибки в dev режиме */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="bg-red-50 dark:bg-red-900/10 p-3 rounded-lg text-xs">
                  <summary className="cursor-pointer font-medium text-red-700 dark:text-red-300 mb-2">
                    <Bug className="w-4 h-4 inline mr-1" />
                    Детали ошибки (dev)
                  </summary>
                  <div className="space-y-2 text-red-600 dark:text-red-400">
                    <div>
                      <strong>Сообщение:</strong> {this.state.error.message}
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <strong>Stack trace:</strong>
                        <pre className="mt-1 overflow-auto max-h-32 text-xs bg-red-100 dark:bg-red-900/20 p-2 rounded">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleRetry}
                  className="flex-1 group"
                  variant="default"
                >
                  <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                  Попробовать снова
                </Button>
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    На главную
                  </Button>
                </Link>
              </div>
              {/* Контакты поддержки */}
              <div className="text-center pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  Проблема не решилась?{" "}
                  <Link
                    href="mailto:support@yourdeutsch.com"
                    className="text-german-red dark:text-dark-theme-pink hover:underline inline-flex items-center"
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Свяжитесь с поддержкой
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}
// HOC для оборачивания компонентов
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">,
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}
// Компонент для inline ошибок (не критичных)
interface InlineErrorProps {
  error: string | null;
  onRetry?: () => void;
  className?: string;
  showRetry?: boolean;
  type?: 'warning' | 'error' | 'info';
}
export function InlineError({
  error,
  onRetry,
  className = "",
  showRetry = true,
  type = 'error',
}: InlineErrorProps) {
  if (!error) return null;
  const colorClasses = {
    error: "border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
    warning: "border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
    info: "border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
  };
  return (
    <div
      className={`glass-card border p-4 ${colorClasses[type]} ${className}`}
    >
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed">
            {error}
          </p>
          {showRetry && onRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRetry}
              className="mt-2"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Повторить
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
export default ErrorBoundary;
