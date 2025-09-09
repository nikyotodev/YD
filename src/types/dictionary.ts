/**
 * Типы данных для Yandex Dictionary API
 * Основано на официальной документации API
 */
// Коды ошибок Yandex Dictionary API
export const YANDEX_DICTIONARY_ERRORS = {
  ERR_OK: 200,
  ERR_KEY_INVALID: 401,
  ERR_KEY_BLOCKED: 402,
  ERR_DAILY_REQ_LIMIT_EXCEEDED: 403,
  ERR_TEXT_TOO_LONG: 413,
  ERR_LANG_NOT_SUPPORTED: 501,
} as const;
export type YandexDictionaryErrorCode =
  (typeof YANDEX_DICTIONARY_ERRORS)[keyof typeof YANDEX_DICTIONARY_ERRORS];
// Направления перевода
export type LanguageDirection = "auto" | "ru-de" | "de-ru" | "ru-ru" | "de-de";
// Основные интерфейсы API ответов
// Пример использования слова
export interface DictionaryExample {
  text: string;
  tr?: DictionaryTranslation[];
}
// Значение слова
export interface DictionaryMeaning {
  text: string;
}
// Синоним
export interface DictionarySynonym {
  text: string;
  pos?: string;
  gen?: string;
}
// Перевод
export interface DictionaryTranslation {
  text: string;
  pos?: string;
  gen?: string;
  syn?: DictionarySynonym[];
  mean?: DictionaryMeaning[];
  ex?: DictionaryExample[];
}
// Определение слова
export interface DictionaryDefinition {
  text: string;
  pos?: string;
  ts?: string; // транскрипция
  tr?: DictionaryTranslation[];
}
// Полный результат поиска
export interface DictionaryResult {
  head: Record<string, unknown>;
  def: DictionaryDefinition[];
}
// Ответ API для lookup
export interface YandexDictionaryLookupResponse {
  def: DictionaryDefinition[];
}
// Ответ API для getLangs
export type YandexDictionaryLanguagesResponse = string[];
// Параметры запроса lookup
export interface DictionaryLookupParams {
  key: string;
  lang: LanguageDirection;
  text: string;
  ui?: "ru" | "de" | "en";
  flags?: number;
}
// Флаги для поиска
export const DICTIONARY_FLAGS = {
  FAMILY: 0x0001, // семейный фильтр
  SHORT_POS: 0x0002, // краткие названия частей речи
  MORPHO: 0x0004, // поиск по форме слова + переводы
  POS_FILTER: 0x0008, // фильтр по частям речи
} as const;
// Обработанный результат для фронтенда
export interface ProcessedDictionaryResult {
  word: string;
  direction: LanguageDirection;
  definitions: ProcessedDefinition[];
  hasResults: boolean;
  germanArticle?: {
    article: "der" | "die" | "das";
    confidence: number;
    rule: string;
  };
}
export interface ProcessedDefinition {
  word: string;
  partOfSpeech?: string;
  transcription?: string;
  translations: ProcessedTranslation[];
}
export interface ProcessedTranslation {
  text: string;
  partOfSpeech?: string;
  gender?: string;
  synonyms: string[];
  meanings: string[];
  examples: ProcessedExample[];
}
export interface ProcessedExample {
  original: string;
  translation?: string;
}
// Ошибки API
export interface DictionaryApiError {
  code: YandexDictionaryErrorCode;
  message: string;
}
// Кэш для запросов
export interface DictionaryCacheEntry {
  data: ProcessedDictionaryResult;
  timestamp: number;
  expiresAt: number;
}
// История поиска
export interface DictionarySearchHistory {
  query: string;
  direction: LanguageDirection;
  timestamp: number;
  hasResults: boolean;
}
// Настройки словаря
export interface DictionarySettings {
  defaultDirection: LanguageDirection;
  ui: "ru" | "de" | "en";
  enableMorphology: boolean;
  enableExamples: boolean;
  familyFilter: boolean;
}
