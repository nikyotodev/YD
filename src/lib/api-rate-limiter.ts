/**
 * API Rate Limiter - Production-ready rate limiting for API endpoints
 * Ограничение частоты запросов для защиты от злоупотреблений
 */
import { type NextRequest, NextResponse } from "next/server";
// Интерфейсы для rate limiting
interface RateLimitConfig {
  requests: number; // Количество запросов
  window: number; // Временное окно в миллисекундах
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}
interface ClientInfo {
  requests: number;
  resetTime: number;
  isBlocked: boolean;
}
interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter: number;
}
// Хранилище для подсчета запросов (в продакшене используйте Redis)
const clientStore = new Map<string, ClientInfo>();
// Стандартные конфигурации
const DEFAULT_CONFIGS = {
  strict: { requests: 10, window: 60 * 1000 }, // 10 запросов в минуту
  moderate: { requests: 30, window: 60 * 1000 }, // 30 запросов в минуту
  relaxed: { requests: 100, window: 60 * 1000 }, // 100 запросов в минуту
  dictionary: { requests: 60, window: 60 * 1000 }, // 60 запросов в минуту для словаря
} as const;
/**
 * Основная функция rate limiting middleware
 */
export function withRateLimit(
  config: RateLimitConfig = DEFAULT_CONFIGS.moderate,
) {
  return function rateLimitMiddleware(
    handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
  ) {
    return async (req: NextRequest): Promise<NextResponse> => {
      try {
        // Получаем идентификатор клиента
        const clientId = getClientIdentifier(req);
        // Проверяем rate limit
        const limitResult = checkRateLimit(clientId, config);
        if (!limitResult.allowed) {
          return createRateLimitResponse(limitResult);
        }
        // Выполняем оригинальный handler
        const response = await handler(req);
        // Добавляем заголовки rate limit в ответ
        addRateLimitHeaders(response, limitResult);
        return response;
      } catch (error) {
        // В случае ошибки rate limiter не блокируем запрос
        // Rate limiter error - fallback to allowing request
        return handler(req);
      }
    };
  };
}
/**
 * Проверка лимита запросов для клиента
 */
function checkRateLimit(clientId: string, config: RateLimitConfig) {
  const now = Date.now();
  let clientInfo = clientStore.get(clientId);
  // Если клиента нет или окно истекло - создаем новую запись
  if (!clientInfo || now >= clientInfo.resetTime) {
    clientInfo = {
      requests: 0,
      resetTime: now + config.window,
      isBlocked: false,
    };
  }
  // Увеличиваем счетчик запросов
  clientInfo.requests++;
  // Проверяем лимит
  const allowed = clientInfo.requests <= config.requests;
  if (!allowed) {
    clientInfo.isBlocked = true;
  }
  // Сохраняем обновленную информацию
  clientStore.set(clientId, clientInfo);
  return {
    allowed,
    requests: clientInfo.requests,
    limit: config.requests,
    remaining: Math.max(0, config.requests - clientInfo.requests),
    resetTime: clientInfo.resetTime,
    retryAfter: Math.ceil((clientInfo.resetTime - now) / 1000),
  };
}
/**
 * Получение идентификатора клиента
 */
function getClientIdentifier(req: NextRequest): string {
  // Пытаемся получить реальный IP
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const clientIp = req.headers.get("x-client-ip");
  // Используем первый доступный IP
  const ip =
    forwarded?.split(",")[0] || realIp || clientIp || "unknown";
  // Для разработки можем добавить user agent для различения
  const userAgent = req.headers.get("user-agent") || "";
  const hash = simpleHash(userAgent);
  return `${ip}:${hash}`;
}
/**
 * Создание ответа при превышении лимита
 */
function createRateLimitResponse(limitResult: RateLimitResult): NextResponse {
  const response = NextResponse.json(
    {
      error: "Too Many Requests",
      message: "Превышен лимит запросов. Попробуйте позже.",
      code: "RATE_LIMIT_EXCEEDED",
      retryAfter: limitResult.retryAfter,
    },
    { status: 429 },
  );
  addRateLimitHeaders(response, limitResult);
  return response;
}
/**
 * Добавление заголовков rate limit в ответ
 */
function addRateLimitHeaders(
  response: NextResponse,
  limitResult: RateLimitResult,
) {
  response.headers.set("X-RateLimit-Limit", limitResult.limit.toString());
  response.headers.set(
    "X-RateLimit-Remaining",
    limitResult.remaining.toString(),
  );
  response.headers.set(
    "X-RateLimit-Reset",
    Math.ceil(limitResult.resetTime / 1000).toString(),
  );
  if (!limitResult.allowed) {
    response.headers.set("Retry-After", limitResult.retryAfter.toString());
  }
}
/**
 * Простая hash функция для создания идентификатора
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36).slice(0, 8);
}
/**
 * Очистка старых записей (можно вызывать периодически)
 */
export function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [clientId, clientInfo] of clientStore.entries()) {
    if (now >= clientInfo.resetTime) {
      clientStore.delete(clientId);
    }
  }
}
/**
 * Получение статистики rate limiting
 */
export function getRateLimitStats() {
  const now = Date.now();
  let activeClients = 0;
  let blockedClients = 0;
  for (const clientInfo of clientStore.values()) {
    if (now < clientInfo.resetTime) {
      activeClients++;
      if (clientInfo.isBlocked) {
        blockedClients++;
      }
    }
  }
  return {
    activeClients,
    blockedClients,
    totalTracked: clientStore.size,
  };
}
// Экспорт предустановленных конфигураций
export const rateLimitConfigs = DEFAULT_CONFIGS;
// Автоматическая очистка каждые 10 минут
if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpiredEntries, 10 * 60 * 1000);
}
