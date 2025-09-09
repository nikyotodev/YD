import { type NextRequest, NextResponse } from "next/server";
import { yandexDictionaryService } from "@/lib/yandex-dictionary-service";
import type { LanguageDirection } from "@/types/dictionary";
import { YANDEX_DICTIONARY_ERRORS } from "@/types/dictionary";
// Rate limiting - простая реализация в памяти
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 60; // запросов в минуту
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 минута
function getRateLimitKey(request: NextRequest): string {
  // Получаем IP адрес
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";
  return `dictionary_${ip}`;
}
function checkRateLimit(key: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const record = requestCounts.get(key);
  if (!record || now > record.resetTime) {
    // Создаем новую запись или сбрасываем счетчик
    const newRecord = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
    requestCounts.set(key, newRecord);
    return {
      allowed: true,
      remaining: RATE_LIMIT - 1,
      resetTime: newRecord.resetTime,
    };
  }
  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }
  record.count++;
  return {
    allowed: true,
    remaining: RATE_LIMIT - record.count,
    resetTime: record.resetTime,
  };
}
// Валидация направления перевода
function isValidDirection(direction: string): direction is LanguageDirection {
  return ["auto", "ru-de", "de-ru", "ru-ru", "de-de"].includes(direction);
}
// Валидация UI языка
function isValidUI(ui: string): ui is "ru" | "de" | "en" {
  return ["ru", "de", "en"].includes(ui);
}
export async function GET(request: NextRequest) {
  try {
    // Проверяем rate limit
    const rateLimitKey = getRateLimitKey(request);
    const rateLimit = checkRateLimit(rateLimitKey);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Превышен лимит запросов",
          code: 429,
          resetTime: rateLimit.resetTime,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": Math.ceil(
              rateLimit.resetTime / 1000,
            ).toString(),
          },
        },
      );
    }
    // Получаем параметры запроса
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text");
    const direction = searchParams.get("direction");
    const ui = searchParams.get("ui") || "ru";
    const enableMorphology = searchParams.get("morphology") !== "false";
    const enableExamples = searchParams.get("examples") !== "false";
    const familyFilter = searchParams.get("family") === "true";
    // Валидация обязательных параметров
    if (!text) {
      return NextResponse.json(
        {
          error: 'Параметр "text" обязателен',
          code: 400,
        },
        { status: 400 },
      );
    }
    if (!direction) {
      return NextResponse.json(
        {
          error: 'Параметр "direction" обязателен',
          code: 400,
        },
        { status: 400 },
      );
    }
    // Валидация значений параметров
    if (!isValidDirection(direction)) {
      return NextResponse.json(
        {
          error:
            "Недопустимое направление перевода. Поддерживаются: auto, ru-de, de-ru, ru-ru, de-de",
          code: 400,
        },
        { status: 400 },
      );
    }
    if (!isValidUI(ui)) {
      return NextResponse.json(
        {
          error: "Недопустимый язык интерфейса. Поддерживаются: ru, de, en",
          code: 400,
        },
        { status: 400 },
      );
    }
    // Дополнительная валидация текста
    const trimmedText = text.trim();
    if (!trimmedText) {
      return NextResponse.json(
        {
          error: "Текст для поиска не может быть пустым",
          code: 400,
        },
        { status: 400 },
      );
    }
    if (trimmedText.length > 100) {
      return NextResponse.json(
        {
          error: "Максимальная длина текста для поиска: 100 символов",
          code: 400,
        },
        { status: 400 },
      );
    }
    // Проверяем, что текст содержит только допустимые символы
    const allowedCharsPattern = /^[a-zA-ZА-Яа-яёЁäöüßÄÖÜ\s\-.,!?]+$/;
    if (!allowedCharsPattern.test(trimmedText)) {
      return NextResponse.json(
        {
          error: "Текст содержит недопустимые символы",
          code: 400,
        },
        { status: 400 },
      );
    }
    // Выполняем поиск
    const result = await yandexDictionaryService.lookup(
      trimmedText,
      direction,
      {
        ui,
        enableMorphology,
        enableExamples,
        familyFilter,
      },
    );
    // Возвращаем результат с заголовками rate limit
    return NextResponse.json(result, {
      headers: {
        "X-RateLimit-Limit": RATE_LIMIT.toString(),
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        "X-RateLimit-Reset": Math.ceil(rateLimit.resetTime / 1000).toString(),
        "Cache-Control": "public, max-age=3600", // кэшируем на 1 час
      },
    });
  } catch (error) {
    // Обрабатываем ошибки сервиса
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      "message" in error
    ) {
      const dictionaryError = error as { code: number; message: string };
      // Определяем HTTP статус по коду ошибки
      let httpStatus = 500;
      if (dictionaryError.code === YANDEX_DICTIONARY_ERRORS.ERR_KEY_INVALID) {
        httpStatus = 401;
      } else if (
        dictionaryError.code === YANDEX_DICTIONARY_ERRORS.ERR_KEY_BLOCKED
      ) {
        httpStatus = 403;
      } else if (
        dictionaryError.code ===
        YANDEX_DICTIONARY_ERRORS.ERR_DAILY_REQ_LIMIT_EXCEEDED
      ) {
        httpStatus = 429;
      } else if (
        dictionaryError.code === YANDEX_DICTIONARY_ERRORS.ERR_TEXT_TOO_LONG
      ) {
        httpStatus = 400;
      } else if (
        dictionaryError.code === YANDEX_DICTIONARY_ERRORS.ERR_LANG_NOT_SUPPORTED
      ) {
        httpStatus = 400;
      }
      return NextResponse.json(
        {
          error: dictionaryError.message,
          code: dictionaryError.code,
        },
        { status: httpStatus },
      );
    }
    // Обрабатываем неизвестные ошибки
    const errorMessage =
      error instanceof Error ? error.message : "Внутренняя ошибка сервера";
    return NextResponse.json(
      {
        error: errorMessage,
        code: 500,
      },
      { status: 500 },
    );
  }
}
// Поддержка только GET запросов
export async function POST() {
  return NextResponse.json(
    {
      error: "Метод не поддерживается. Используйте GET",
      code: 405,
    },
    { status: 405 },
  );
}
export async function PUT() {
  return NextResponse.json(
    {
      error: "Метод не поддерживается. Используйте GET",
      code: 405,
    },
    { status: 405 },
  );
}
export async function DELETE() {
  return NextResponse.json(
    {
      error: "Метод не поддерживается. Используйте GET",
      code: 405,
    },
    { status: 405 },
  );
}
