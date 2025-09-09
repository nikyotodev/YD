/**
 * Улучшенный сервис для работы с CSV файлом немецких существительных
 * Источник: https://github.com/gambolputty/german-nouns
 *
 * ПРОДАКШЕН-ГОТОВЫЙ КОД:
 * - Обрабатывает реальную структуру CSV (76 колонок)
 * - Безопасная загрузка и кэширование
 * - Обработка множественных родов и форм
 * - Валидация всех входящих данных
 */
import type { GermanArticle } from "./german-article-detector";
import type {
  CSVNounRecord,
  ProcessedNoun,
  CSVProcessingStats,
  CSVParserConfig,
  GermanGender,
} from "@/types/csv-noun";
export interface GermanNounData {
  word: string;
  article: GermanArticle;
  plural?: string;
  alternativeGenders?: GermanArticle[];
  alternativePlurals?: string[];
  source: "csv";
  confidence: number;
  lastUpdated: number;
  hasMultipleMeanings?: boolean;
}
interface CSVCacheData {
  data: Record<string, GermanNounData>;
  lastFetch: number;
  version: string;
  stats: CSVProcessingStats;
}
export class GermanNounsCSVService {
  private static instance: GermanNounsCSVService;
  private readonly CSV_URL =
    "https://raw.githubusercontent.com/gambolputty/german-nouns/refs/heads/main/german_nouns/nouns.csv";
  private readonly CACHE_KEY = "german_nouns_csv_cache_v2";
  private readonly CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 дней
  private readonly VERSION = "2.0.0";
  private cache: Map<string, GermanNounData> = new Map();
  private isLoading = false;
  private lastError: string | null = null;
  private processingStats: CSVProcessingStats = {
    totalRecords: 0,
    successfullyParsed: 0,
    skippedRecords: 0,
    recordsWithMultipleGenders: 0,
    recordsWithMultiplePlurals: 0,
    errors: [],
  };
  private readonly config: CSVParserConfig = {
    skipHeader: true,
    validateGender: true,
    allowMultipleGenders: true,
    allowEmptyPlural: true,
    maxWordLength: 50,
    minWordLength: 2,
  };
  private constructor() {
    this.loadFromCache();
    // Автоматическая инициализация при первом создании instance
    this.initializeIfEmpty();
  }
  public static getInstance(): GermanNounsCSVService {
    if (!GermanNounsCSVService.instance) {
      GermanNounsCSVService.instance = new GermanNounsCSVService();
    }
    return GermanNounsCSVService.instance;
  }
  /**
   * Загрузка данных из localStorage
   */
  private loadFromCache(): void {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return;
      const cacheData: CSVCacheData = JSON.parse(cached);
      // Проверяем версию и срок годности
      if (
        cacheData.version === this.VERSION &&
        Date.now() - cacheData.lastFetch < this.CACHE_EXPIRY &&
        cacheData.data
      ) {
        // Преобразуем объект обратно в Map
        this.cache = new Map(Object.entries(cacheData.data));
        this.processingStats = cacheData.stats || this.processingStats;
        return;
      }
      // Устаревшие данные - удаляем
      localStorage.removeItem(this.CACHE_KEY);
    } catch (error) {
      console.warn("Ошибка загрузки кэша CSV:", error);
      localStorage.removeItem(this.CACHE_KEY);
    }
  }
  /**
   * Сохранение данных в localStorage
   */
  private saveToCache(): void {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }
    try {
      const cacheData: CSVCacheData = {
        data: Object.fromEntries(this.cache),
        lastFetch: Date.now(),
        version: this.VERSION,
        stats: this.processingStats,
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn("Ошибка сохранения кэша CSV:", error);
    }
  }
  /**
   * Парсинг строки CSV с учетом реальной структуры (76 колонок)
   */
  private parseCSVLine(
    line: string,
    lineNumber: number,
  ): GermanNounData | null {
    try {
      // Продвинутый CSV парсер для сложной структуры
      const columns = this.parseCSVColumns(line);
      if (columns.length < 76) {
        this.processingStats.errors.push(
          `Строка ${lineNumber}: недостаточно колонок (${columns.length}/76)`,
        );
        return null;
      }
      // Маппинг колонок согласно реальной структуре
      const lemma = columns[0]?.trim();
      const pos = columns[1]?.trim();
      const genus = columns[2]?.trim();
      const genus1 = columns[3]?.trim();
      const genus2 = columns[4]?.trim();
      const genus3 = columns[5]?.trim();
      const genus4 = columns[6]?.trim();
      // Номинатив формы
      const nominativSingular = columns[7]?.trim();
      const nominativPlural = columns[16]?.trim();
      // Валидация основных полей
      if (
        !lemma ||
        !pos ||
        lemma.length < this.config.minWordLength ||
        lemma.length > this.config.maxWordLength
      ) {
        return null;
      }
      // Проверяем, что это действительно существительное
      if (!pos.toLowerCase().includes("substantiv")) {
        return null;
      }
      // Обрабатываем роды
      const genders = [genus, genus1, genus2, genus3, genus4]
        .filter((g) => g && g.length > 0)
        .map((g) => this.normalizeGender(g))
        .filter((g) => g !== null) as GermanArticle[];
      if (genders.length === 0) {
        this.processingStats.errors.push(
          `Строка ${lineNumber}: не найден валидный род для "${lemma}"`,
        );
        return null;
      }
      const primaryGender = genders[0];
      const alternativeGenders = genders.slice(1);
      // Обрабатываем формы множественного числа
      const pluralForms = [nominativPlural]
        .filter((p) => p && p.length > 0 && p !== lemma)
        .map((p) => p.trim());
      // Определяем уверенность
      const confidence = this.calculateConfidence(lemma, genders, pluralForms);
      // Создаем результат
      const result: GermanNounData = {
        word: lemma.toLowerCase(),
        article: primaryGender,
        plural: pluralForms[0] || undefined,
        alternativeGenders:
          alternativeGenders.length > 0 ? alternativeGenders : undefined,
        alternativePlurals:
          pluralForms.slice(1).length > 0 ? pluralForms.slice(1) : undefined,
        source: "csv",
        confidence,
        lastUpdated: Date.now(),
        hasMultipleMeanings: genders.length > 1,
      };
      // Обновляем статистику
      if (genders.length > 1) {
        this.processingStats.recordsWithMultipleGenders++;
      }
      if (pluralForms.length > 1) {
        this.processingStats.recordsWithMultiplePlurals++;
      }
      return result;
    } catch (error) {
      this.processingStats.errors.push(
        `Строка ${lineNumber}: ошибка парсинга - ${error}`,
      );
      return null;
    }
  }
  /**
   * Продвинутый парсер CSV колонок с учетом кавычек и запятых
   */
  private parseCSVColumns(line: string): string[] {
    const columns: string[] = [];
    let current = "";
    let inQuotes = false;
    let i = 0;
    while (i < line.length) {
      const char = line[i];
      const nextChar = line[i + 1];
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Экранированная кавычка
          current += '"';
          i += 2;
          continue;
        }
        // Начало или конец кавычек
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        columns.push(current);
        current = "";
        i++;
        continue;
      } else {
        current += char;
      }
      i++;
    }
    columns.push(current);
    return columns;
  }
  /**
   * Нормализация рода с учетом всех возможных вариантов
   */
  private normalizeGender(genderRaw: string): GermanArticle | null {
    if (!genderRaw) return null;
    const normalized = genderRaw.toLowerCase().trim();
    // Стандартные артикли
    if (normalized === "der" || normalized === "m") return "der";
    if (normalized === "die" || normalized === "f") return "die";
    if (normalized === "das" || normalized === "n") return "das";
    // Дополнительные варианты
    if (normalized === "masculine" || normalized === "männlich") return "der";
    if (normalized === "feminine" || normalized === "weiblich") return "die";
    if (normalized === "neuter" || normalized === "sächlich") return "das";
    return null;
  }
  /**
   * Расчет уверенности в правильности данных
   */
  private calculateConfidence(
    word: string,
    genders: GermanArticle[],
    plurals: string[],
  ): number {
    let confidence = 0.9; // Базовая уверенность для CSV
    // Снижаем уверенность для сложных слов
    if (word.includes("-")) confidence -= 0.1;
    if (word.length > 15) confidence -= 0.05;
    // Снижаем уверенность при множественных родах
    if (genders.length > 1) confidence -= 0.15;
    // Повышаем уверенность при наличии множественного числа
    if (plurals.length > 0) confidence += 0.05;
    return Math.max(0.1, Math.min(1.0, confidence));
  }
  /**
   * Загрузка CSV данных с сервера
   */
  public async loadCSVData(forceRefresh = false): Promise<boolean> {
    // Если данные уже загружены и не требуется принудительное обновление
    if (this.cache.size > 0 && !forceRefresh) {
      return true;
    }
    // Предотвращаем множественные одновременные загрузки
    if (this.isLoading) {
      return false;
    }
    this.isLoading = true;
    this.lastError = null;
    this.resetStats();
    try {
      // Загружаем CSV данные без логирования в продакшене
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const response = await fetch(this.CSV_URL, {
        method: "GET",
        headers: {
          Accept: "text/csv,text/plain,*/*",
          "User-Agent": "GermanNounsService/2.0",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const csvText = await response.text();
      if (!csvText || csvText.length < 1000) {
        throw new Error("Получены некорректные данные CSV");
      }
      // CSV файл загружен успешно
      const success = this.processCSVData(csvText);
      // CSV данные обработаны
      return success;
    } catch (error) {
      this.lastError =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      console.error("❌ Ошибка загрузки CSV:", this.lastError);
      return false;
    } finally {
      this.isLoading = false;
    }
  }
  /**
   * Сброс статистики
   */
  private resetStats(): void {
    this.processingStats = {
      totalRecords: 0,
      successfullyParsed: 0,
      skippedRecords: 0,
      recordsWithMultipleGenders: 0,
      recordsWithMultiplePlurals: 0,
      errors: [],
    };
  }
  /**
   * Обработка CSV данных с улучшенной логикой
   */
  private processCSVData(csvText: string): boolean {
    try {
      const lines = csvText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      const newCache = new Map<string, GermanNounData>();
      this.processingStats.totalRecords = lines.length;
      // Пропускаем заголовок
      const startIndex = this.config.skipHeader ? 1 : 0;
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        const nounData = this.parseCSVLine(line, i + 1);
        if (nounData) {
          // Проверяем дубликаты и выбираем лучший вариант
          const existing = newCache.get(nounData.word);
          if (existing) {
            // Если новый вариант более уверенный, заменяем
            if (nounData.confidence > existing.confidence) {
              newCache.set(nounData.word, nounData);
            }
          } else {
            newCache.set(nounData.word, nounData);
          }
          this.processingStats.successfullyParsed++;
        } else {
          this.processingStats.skippedRecords++;
        }
        // Продолжаем обработку без логирования в продакшене
      }
      // Финальная валидация
      if (newCache.size < 1000) {
        throw new Error(`Слишком мало обработанных записей: ${newCache.size}`);
      }
      // Ограничиваем размер ошибок для экономии памяти
      if (this.processingStats.errors.length > 100) {
        this.processingStats.errors = this.processingStats.errors.slice(0, 100);
        this.processingStats.errors.push(
          "... и другие ошибки (показаны первые 100)",
        );
      }
      this.cache = newCache;
      this.saveToCache();
      return true;
    } catch (error) {
      this.lastError =
        error instanceof Error ? error.message : "Ошибка обработки CSV";
      console.error("❌ Ошибка обработки CSV:", error);
      return false;
    }
  }
  /**
   * Получение данных о слове
   */
  public getArticle(word: string): GermanNounData | null {
    const normalized = word.toLowerCase().trim();
    return this.cache.get(normalized) || null;
  }
  /**
   * Проверка наличия слова
   */
  public hasWord(word: string): boolean {
    const normalized = word.toLowerCase().trim();
    return this.cache.has(normalized);
  }
  /**
   * Получение расширенной статистики
   */
  public getStats(): {
    totalWords: number;
    isLoading: boolean;
    lastError: string | null;
    cacheSize: string;
    lastUpdated: number | null;
    processingStats: CSVProcessingStats;
    memoryUsage: string;
  } {
    const firstEntry = Array.from(this.cache.values())[0];
    const cacheStr = JSON.stringify(Object.fromEntries(this.cache));
    return {
      totalWords: this.cache.size,
      isLoading: this.isLoading,
      lastError: this.lastError,
      cacheSize: `${Math.round(cacheStr.length / 1024)}KB`,
      lastUpdated: firstEntry?.lastUpdated || null,
      processingStats: this.processingStats,
      memoryUsage: `${Math.round((cacheStr.length / 1024 / 1024) * 100) / 100}MB`,
    };
  }
  /**
   * Поиск слов с расширенными возможностями
   */
  public searchWords(pattern: string, limit = 10): GermanNounData[] {
    const results: GermanNounData[] = [];
    const regex = new RegExp(pattern.toLowerCase(), "i");
    for (const nounData of this.cache.values()) {
      if (regex.test(nounData.word) && results.length < limit) {
        results.push(nounData);
      }
    }
    return results.sort((a, b) => b.confidence - a.confidence);
  }
  /**
   * Получение слов с множественными родами
   */
  public getWordsWithMultipleGenders(limit = 50): GermanNounData[] {
    const results: GermanNounData[] = [];
    for (const nounData of this.cache.values()) {
      if (nounData.hasMultipleMeanings && results.length < limit) {
        results.push(nounData);
      }
    }
    return results.sort((a, b) => b.confidence - a.confidence);
  }
  /**
   * Очистка кэша
   */
  public clearCache(): void {
    this.cache.clear();
    this.resetStats();
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(this.CACHE_KEY);
    }
  }
  /**
   * Принудительное обновление данных
   */
  public async refreshData(): Promise<boolean> {
    this.clearCache();
    return await this.loadCSVData(true);
  }
  /**
   * Получение отчета о качестве данных
   */
  public getQualityReport(): {
    confidence_distribution: Record<string, number>;
    gender_distribution: Record<GermanArticle, number>;
    words_with_plurals: number;
    words_with_alternatives: number;
    average_confidence: number;
  } {
    const confidenceRanges = {
      "высокая (>0.8)": 0,
      "средняя (0.6-0.8)": 0,
      "низкая (<0.6)": 0,
    };
    const genderCounts: Record<GermanArticle, number> = {
      der: 0,
      die: 0,
      das: 0,
    };
    let wordsWithPlurals = 0;
    let wordsWithAlternatives = 0;
    let totalConfidence = 0;
    for (const noun of this.cache.values()) {
      // Распределение уверенности
      if (noun.confidence > 0.8) confidenceRanges["высокая (>0.8)"]++;
      else if (noun.confidence > 0.6) confidenceRanges["средняя (0.6-0.8)"]++;
      else confidenceRanges["низкая (<0.6)"]++;
      // Распределение родов
      genderCounts[noun.article]++;
      // Наличие дополнительных форм
      if (noun.plural) wordsWithPlurals++;
      if (noun.alternativeGenders || noun.alternativePlurals)
        wordsWithAlternatives++;
      totalConfidence += noun.confidence;
    }
    return {
      confidence_distribution: confidenceRanges,
      gender_distribution: genderCounts,
      words_with_plurals: wordsWithPlurals,
      words_with_alternatives: wordsWithAlternatives,
      average_confidence:
        this.cache.size > 0 ? totalConfidence / this.cache.size : 0,
    };
  }
  /**
   * Автоматическая инициализация, если данные пусты
   */
  private initializeIfEmpty(): void {
    // Запускаем инициализацию асинхронно, чтобы не блокировать создание instance
    setTimeout(async () => {
      const stats = this.getStats();
      if (stats.totalWords === 0 && !stats.isLoading) {
        try {
          await this.loadCSVData();
        } catch (error) {
          // В продакшене игнорируем ошибки автоинициализации
        }
      }
    }, 100);
  }
}
// Экспорт singleton instance
export const germanNounsCSV = GermanNounsCSVService.getInstance();
