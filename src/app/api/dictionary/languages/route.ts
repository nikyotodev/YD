import { type NextRequest, NextResponse } from "next/server";
import { yandexDictionaryService } from "@/lib/yandex-dictionary-service";
// Простое кэширование для этого роута
let cachedLanguages: string[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 часа
export async function GET(request: NextRequest) {
  try {
    // Проверяем кэш
    const now = Date.now();
    if (cachedLanguages && now - cacheTimestamp < CACHE_DURATION) {
      return NextResponse.json(
        {
          languages: cachedLanguages,
          cached: true,
          cacheAge: Math.floor((now - cacheTimestamp) / 1000),
        },
        {
          headers: {
            "Cache-Control": "public, max-age=86400", // кэшируем на 24 часа
            "X-Cache": "HIT",
          },
        },
      );
    }
    // Получаем свежие данные
    const languages = await yandexDictionaryService.getSupportedLanguages();
    // Обновляем кэш
    cachedLanguages = languages;
    cacheTimestamp = now;
    // Фильтруем только нужные нам направления для фронтенда
    const supportedDirections = languages.filter((lang) =>
      ["ru-de", "de-ru", "ru-ru", "de-de"].includes(lang),
    );
    return NextResponse.json(
      {
        languages: supportedDirections,
        allLanguages: languages, // полный список для отладки
        cached: false,
        timestamp: now,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=86400",
          "X-Cache": "MISS",
        },
      },
    );
  } catch (error) {
    // Если есть кэшированные данные и произошла ошибка, возвращаем их
    if (cachedLanguages) {
      return NextResponse.json(
        {
          languages: cachedLanguages,
          cached: true,
          fallback: true,
          error: "Использованы кэшированные данные из-за ошибки API",
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, max-age=3600", // короткий кэш при ошибке
            "X-Cache": "STALE",
          },
        },
      );
    }
    // Обрабатываем ошибки сервиса
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      "message" in error
    ) {
      const dictionaryError = error as { code: number; message: string };
      return NextResponse.json(
        {
          error: dictionaryError.message,
          code: dictionaryError.code,
        },
        {
          status:
            dictionaryError.code === 401 || dictionaryError.code === 403
              ? dictionaryError.code
              : 500,
        },
      );
    }
    // Возвращаем fallback данные при неизвестной ошибке
    const fallbackLanguages = ["ru-de", "de-ru", "ru-ru", "de-de"];
    return NextResponse.json(
      {
        languages: fallbackLanguages,
        cached: false,
        fallback: true,
        error:
          error instanceof Error ? error.message : "Ошибка получения языков",
        note: "Используется резервный список языков",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=300", // короткий кэш для fallback
        },
      },
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
