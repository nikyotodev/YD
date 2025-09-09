import { type NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
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
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_ERRORS_PER_WINDOW = 10;
const errorCounts = new Map<string, { count: number; resetTime: number }>();
function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return `error_report_${ip}`;
}
function isRateLimited(key: string): boolean {
  const now = Date.now();
  const record = errorCounts.get(key);
  if (!record || now > record.resetTime) {
    errorCounts.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  if (record.count >= MAX_ERRORS_PER_WINDOW) {
    return true;
  }
  record.count++;
  return false;
}
function sanitizeErrorReport(report: unknown): ErrorReport | null {
  try {
    // Проверяем что report это объект
    if (!report || typeof report !== 'object') {
      return null;
    }
    const reportObj = report as Record<string, unknown>;
    // Валидация обязательных полей
    if (!reportObj.errorId || !reportObj.message || !reportObj.timestamp) {
      return null;
    }
    // Ограничиваем размер сообщений
    const sanitized: ErrorReport = {
      errorId: String(reportObj.errorId).slice(0, 100),
      message: String(reportObj.message).slice(0, 1000),
      stack: reportObj.stack ? String(reportObj.stack).slice(0, 5000) : undefined,
      componentStack: reportObj.componentStack
        ? String(reportObj.componentStack).slice(0, 2000)
        : undefined,
      timestamp: String(reportObj.timestamp),
      userAgent: String(reportObj.userAgent || 'unknown').slice(0, 500),
      url: String(reportObj.url || 'unknown').slice(0, 1000),
      level: String(reportObj.level || 'component').slice(0, 20),
      userId: reportObj.userId ? String(reportObj.userId).slice(0, 100) : undefined,
    };
    return sanitized;
  } catch {
    return null;
  }
}
async function storeError(errorReport: ErrorReport): Promise<void> {
  try {
    // В продакшене здесь может быть интеграция с внешними сервисами:
    // - Sentry
    // - LogRocket
    // - Datadog
    // - Firebase Crashlytics
    // - Или собственная система логирования
    // Пока логируем в наш внутренний сервис
    logger.error('Client Error Report', {
      errorId: errorReport.errorId,
      message: errorReport.message,
      level: errorReport.level,
      url: errorReport.url,
      timestamp: errorReport.timestamp,
      // Не логируем полный stack trace в prod для безопасности
      hasStack: !!errorReport.stack,
      hasComponentStack: !!errorReport.componentStack,
    });
    // В development логируем подробности
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      logger.debug('Error Details (dev only)', {
        stack: errorReport.stack,
        componentStack: errorReport.componentStack,
      });
    }
  } catch (storageError) {
    logger.error('Failed to store error report', {
      originalErrorId: errorReport.errorId,
      storageError: storageError instanceof Error ? storageError.message : 'Unknown error'
    });
  }
}
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many error reports' },
        { status: 429 }
      );
    }
    // Парсим и валидируем данные
    const body = await request.json();
    const errorReport = sanitizeErrorReport(body);
    if (!errorReport) {
      return NextResponse.json(
        { error: 'Invalid error report format' },
        { status: 400 }
      );
    }
    // Сохраняем ошибку
    await storeError(errorReport);
    return NextResponse.json({
      success: true,
      errorId: errorReport.errorId
    });
  } catch (error) {
    // Даже при ошибке обработки ошибок, не падаем
    logger.error('Error in error reporting endpoint', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
// OPTIONS для CORS если нужно
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
