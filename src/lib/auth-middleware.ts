import { NextRequest, NextResponse } from "next/server";
import { auth } from "./firebase-admin";
/**
 * Промежуточное ПО для проверки авторизации через Firebase JWT токен
 * Используется для защиты API-маршрутов
 *
 * @param req Запрос Next.js
 * @returns NextResponse или error response
 */
export async function authMiddleware(req: NextRequest) {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Отсутствует токен авторизации" },
        { status: 401 },
      );
    }
    // Извлекаем токен
    const token = authHeader.split("Bearer ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Неверный формат токена" },
        { status: 401 },
      );
    }
    try {
      // Проверяем токен через Firebase Admin SDK
      const decodedToken = await auth.verifyIdToken(token);
      // Добавляем uid пользователя в заголовки для использования в обработчике
      const headers = new Headers(req.headers);
      headers.set("x-user-id", decodedToken.uid);
      // Создаем новый запрос с обновленными заголовками
      const newRequest = new NextRequest(req.url, {
        method: req.method,
        headers: headers,
        body: req.body,
      });
      return newRequest;
    } catch (tokenError) {
      console.error("Ошибка проверки токена:", tokenError);
      return NextResponse.json(
        { error: "Недействительный токен авторизации" },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("Ошибка в промежуточном ПО авторизации:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
/**
 * Получает ID пользователя из заголовка запроса
 *
 * @param req Запрос Next.js
 * @returns ID пользователя или null
 */
export function getUserIdFromRequest(req: NextRequest): string | null {
  const userId = req.headers.get("x-user-id");
  return userId;
}
/**
 * Проверяет, авторизован ли пользователь
 * Для использования в API-маршрутах
 *
 * @param req Запрос Next.js
 * @returns Объект с флагом авторизации и ID пользователя
 */
export async function isAuthenticated(
  req: NextRequest,
): Promise<{ authenticated: boolean; userId: string | null }> {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { authenticated: false, userId: null };
    }
    // Извлекаем токен
    const token = authHeader.split("Bearer ")[1];
    if (!token) {
      return { authenticated: false, userId: null };
    }
    try {
      // Проверяем токен через Firebase Admin SDK
      const decodedToken = await auth.verifyIdToken(token);
      return { authenticated: true, userId: decodedToken.uid };
    } catch (tokenError) {
      console.error("Ошибка проверки токена:", tokenError);
      return { authenticated: false, userId: null };
    }
  } catch (error) {
    console.error("Ошибка при проверке авторизации:", error);
    return { authenticated: false, userId: null };
  }
}
/**
 * Проверяет авторизацию пользователя и возвращает декодированный токен
 *
 * @param req Запрос Next.js
 * @returns Декодированный токен или null
 */
export async function verifyAuth(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    const token = authHeader.split("Bearer ")[1];
    if (!token) {
      return null;
    }
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Ошибка проверки авторизации:", error);
    return null;
  }
}
