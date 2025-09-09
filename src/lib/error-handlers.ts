interface ApiError {
  message: string;
  status?: number;
  code?: string;
  timestamp: string;
}
interface NetworkError extends ApiError {
  type: 'network';
  retryable: boolean;
}
interface ValidationError extends ApiError {
  type: 'validation';
  field?: string;
}
interface AuthError extends ApiError {
  type: 'auth';
  redirectTo?: string;
}
interface ServerError extends ApiError {
  type: 'server';
  retryable: boolean;
}
type AppError = NetworkError | ValidationError | AuthError | ServerError;
class ErrorHandlers {
  private static instance: ErrorHandlers;
  private retryDelays = [1000, 2000, 4000, 8000]; // Progressive backoff
  static getInstance(): ErrorHandlers {
    if (!ErrorHandlers.instance) {
      ErrorHandlers.instance = new ErrorHandlers();
    }
    return ErrorHandlers.instance;
  }
  /**
   * Определяет тип ошибки и создает соответствующий объект
   */
  categorizeError(error: unknown): AppError {
    const timestamp = new Date().toISOString();
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        type: 'network',
        message: 'Проблемы с подключением к интернету',
        retryable: true,
        timestamp,
      };
    }
    if (error instanceof Error) {
      const message = error.message;
      // Network errors
      if (message.includes('NetworkError') || message.includes('ERR_NETWORK')) {
        return {
          type: 'network',
          message: 'Нет подключения к интернету',
          retryable: true,
          timestamp,
        };
      }
      // Auth errors
      if (message.includes('auth') || message.includes('unauthorized')) {
        return {
          type: 'auth',
          message: 'Требуется авторизация',
          status: 401,
          redirectTo: '/auth',
          timestamp,
        };
      }
      // Validation errors
      if (message.includes('validation') || message.includes('invalid')) {
        return {
          type: 'validation',
          message: 'Некорректные данные',
          status: 400,
          timestamp,
        };
      }
      return {
        type: 'server',
        message: message || 'Внутренняя ошибка сервера',
        retryable: true,
        timestamp,
      };
    }
    return {
      type: 'server',
      message: 'Произошла неожиданная ошибка',
      retryable: false,
      timestamp,
    };
  }
  /**
   * Безопасное выполнение async операций с обработкой ошибок
   */
  async safeAsync<T>(
    operation: () => Promise<T>,
    fallback?: T,
    onError?: (error: AppError) => void
  ): Promise<{ data?: T; error?: AppError }> {
    try {
      const data = await operation();
      return { data };
    } catch (error) {
      const appError = this.categorizeError(error);
      onError?.(appError);
      if (fallback !== undefined) {
        return { data: fallback, error: appError };
      }
      return { error: appError };
    }
  }
  /**
   * Retry логика для операций
   */
  async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    onRetry?: (attempt: number, error: AppError) => void
  ): Promise<T> {
    let lastError: AppError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = this.categorizeError(error);
        if (attempt === maxRetries || !lastError.retryable) {
          throw lastError;
        }
        onRetry?.(attempt + 1, lastError);
        // Progressive backoff
        const delay = this.retryDelays[attempt] || this.retryDelays[this.retryDelays.length - 1];
        await this.sleep(delay);
      }
    }
    // Если все попытки исчерпаны, выбрасываем последнюю ошибку
    if (lastError) {
      throw lastError;
    }
    // Fallback если по какой-то причине нет ошибки
    throw new AppError('UNKNOWN_ERROR', 'Все попытки исчерпаны, но ошибка не зафиксирована');
  }
  /**
   * Обертка для fetch с обработкой ошибок
   */
  async safeFetch(
    url: string,
    options?: RequestInit,
    timeout = 10000
  ): Promise<{ data?: Response; error?: AppError }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!response) {
        return {
          error: {
            type: 'server',
            message: 'Не удалось получить ответ от сервера',
            status: 500,
          } as AppError
        };
      }
      if (!response.ok) {
        const error: AppError = {
          type: response.status === 401 ? 'auth' :
                response.status < 500 ? 'validation' : 'server',
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          retryable: response.status >= 500,
          timestamp: new Date().toISOString(),
        };
        return { error };
      }
      return { data: response };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          error: {
            type: 'network',
            message: 'Превышено время ожидания запроса',
            retryable: true,
            timestamp: new Date().toISOString(),
          }
        };
      }
      return { error: this.categorizeError(error) };
    }
  }
  /**
   * Wrapper для JSON API запросов
   */
  async apiRequest<T>(
    url: string,
    options?: RequestInit
  ): Promise<{ data?: T; error?: AppError }> {
    const { data: response, error } = await this.safeFetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    if (error) {
      return { error };
    }
    if (!response) {
      return {
        error: {
          type: 'server',
          message: 'Не удалось получить ответ от сервера',
          status: 500,
        } as AppError
      };
    }
    try {
      const data = await response.json();
      return { data };
    } catch (parseError) {
      return {
        error: {
          type: 'server',
          message: 'Ошибка обработки ответа сервера',
          retryable: false,
          timestamp: new Date().toISOString(),
        }
      };
    }
  }
  /**
   * Получение пользовательского сообщения об ошибке
   */
  getUserMessage(error: AppError): string {
    switch (error.type) {
      case 'network':
        return 'Проверьте подключение к интернету и попробуйте снова';
      case 'auth':
        return 'Необходимо войти в систему';
      case 'validation':
        return error.message || 'Проверьте введенные данные';
      case 'server':
        return error.retryable
          ? 'Временные проблемы с сервером. Попробуйте позже'
          : 'Произошла ошибка. Обратитесь в поддержку';
      default:
        return 'Произошла неожиданная ошибка';
    }
  }
  /**
   * Проверка, нужно ли показывать кнопку повтора
   */
  shouldShowRetry(error: AppError): boolean {
    return error.retryable === true;
  }
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
// React hook для использования в компонентах
export function useErrorHandler() {
  const errorHandlers = ErrorHandlers.getInstance();
  return {
    safeAsync: errorHandlers.safeAsync.bind(errorHandlers),
    withRetry: errorHandlers.withRetry.bind(errorHandlers),
    safeFetch: errorHandlers.safeFetch.bind(errorHandlers),
    apiRequest: errorHandlers.apiRequest.bind(errorHandlers),
    getUserMessage: errorHandlers.getUserMessage.bind(errorHandlers),
    shouldShowRetry: errorHandlers.shouldShowRetry.bind(errorHandlers),
    categorizeError: errorHandlers.categorizeError.bind(errorHandlers),
  };
}
// Экспорт для использования вне React
export const errorHandlers = ErrorHandlers.getInstance();
// Типы для экспорта
export type { AppError, NetworkError, ValidationError, AuthError, ServerError };
