/**
 * Система логирования для приложения
 * Заменяет прямое использование console.log/error/warn
 */
import { env } from "../config/env";
type LogLevel = "debug" | "info" | "warn" | "error";
interface LoggerOptions {
  module: string;
  minLevel?: LogLevel;
}
class Logger {
  private module: string;
  private minLevel: LogLevel;
  private readonly levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };
  constructor(options: LoggerOptions) {
    this.module = options.module;
    this.minLevel = options.minLevel || env.LOGGING_LEVEL;
  }
  /**
   * Проверяет, должно ли сообщение быть выведено, исходя из уровня логирования
   */
  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.minLevel];
  }
  /**
   * Форматирует сообщение для лога
   */
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] [${this.module}] ${message}`;
  }
  /**
   * Логирует сообщение для отладки (наиболее подробный уровень)
   */
  debug(message: string, ...args: unknown[]): void {
    if (!this.shouldLog("debug")) return;
    const formattedMessage = this.formatMessage("debug", message);
    console.debug(formattedMessage, ...args);
  }
  /**
   * Логирует информационное сообщение
   */
  info(message: string, ...args: unknown[]): void {
    if (!this.shouldLog("info")) return;
    const formattedMessage = this.formatMessage("info", message);
    console.info(formattedMessage, ...args);
  }
  /**
   * Логирует предупреждение
   */
  warn(message: string, ...args: unknown[]): void {
    if (!this.shouldLog("warn")) return;
    const formattedMessage = this.formatMessage("warn", message);
    console.warn(formattedMessage, ...args);
  }
  /**
   * Логирует ошибку
   */
  error(message: string | Error, ...args: unknown[]): void {
    if (!this.shouldLog("error")) return;
    const errorMessage =
      message instanceof Error
        ? `${message.message}\n${message.stack}`
        : message;
    const formattedMessage = this.formatMessage("error", errorMessage);
    console.error(formattedMessage, ...args);
  }
  /**
   * Создает дочерний логгер с тем же контекстом
   */
  child(submodule: string): Logger {
    return new Logger({
      module: `${this.module}:${submodule}`,
      minLevel: this.minLevel,
    });
  }
}
/**
 * Создает новый экземпляр логгера
 */
export function createLogger(module: string): Logger {
  return new Logger({ module });
}
/**
 * Дефолтный логгер для приложения
 */
export const logger = createLogger('app');
