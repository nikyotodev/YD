/**
 * Конфигурация и валидация переменных окружения
 */
// Структура переменных окружения
interface EnvConfig {
  // Общие настройки
  NODE_ENV: "development" | "production" | "test";
  // Флаги функций
  ENABLE_CACHING: boolean;
  LOGGING_LEVEL: "debug" | "info" | "warn" | "error";
}
// Валидация переменных окружения
function validateEnv(): EnvConfig {
  // Базовые значения по умолчанию
  const defaults = {
    NODE_ENV: process.env.NODE_ENV || "development",
    ENABLE_CACHING: true,
    LOGGING_LEVEL: "info",
  } as Partial<EnvConfig>;
  // Собираем финальную конфигурацию
  const config: EnvConfig = {
    // Общие настройки
    NODE_ENV: (process.env.NODE_ENV || defaults.NODE_ENV) as
      | "development"
      | "production"
      | "test",
    // Флаги функций (преобразуем строки в булевы значения)
    ENABLE_CACHING: process.env.ENABLE_CACHING
      ? process.env.ENABLE_CACHING === "true"
      : (defaults.ENABLE_CACHING as boolean),
    LOGGING_LEVEL: (process.env.LOGGING_LEVEL || defaults.LOGGING_LEVEL) as
      | "debug"
      | "info"
      | "warn"
      | "error",
  };
  return config;
}
// Экспортируем валидированную конфигурацию
export const env = validateEnv();
// Функция для логирования конфигурации (используется при запуске)
export function logConfig() {
  console.info("📋 Загружена конфигурация:", env);
}
