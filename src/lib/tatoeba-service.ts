/**
 * Сервис для работы с Tatoeba API
 * Получает примеры предложений на немецком языке с переводами
 */
// Интерфейсы для нового API Tatoeba
interface TatoebaSentence {
  id: number;
  text: string;
  lang: string;
  translations?: TatoebaTranslation[][];
}
interface TatoebaTranslation {
  id: number;
  text: string;
  lang: string;
}
export interface ProcessedTatoebaExample {
  german: string;
  russian: string;
  id: number;
}
class TatoebaService {
  private readonly baseUrl = "https://api.tatoeba.org/unstable";
  private cache = new Map<
    string,
    { data: ProcessedTatoebaExample[]; timestamp: number }
  >();
  private readonly cacheTimeout = 60 * 60 * 1000; // 1 час
  /**
   * Поиск примеров с русскими переводами для немецкого слова
   */
  async searchExamples(
    germanWord: string,
    limit = 5,
  ): Promise<ProcessedTatoebaExample[]> {
    try {
      if (!germanWord?.trim()) {
        return [];
      }
      const cleanWord = germanWord.trim().toLowerCase();
      const cacheKey = `de-ru-${cleanWord}-${limit}`;
      // Проверяем кэш
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
      // Запрос к Tatoeba API с правильными параметрами
      const searchUrl = `${this.baseUrl}/sentences`;
      const params = new URLSearchParams({
        lang: "deu", // обязательный параметр - язык предложений
        q: cleanWord, // текст для поиска
        sort: "random", // обязательный параметр сортировки
        limit: limit.toString(),
      });
      const response = await fetch(`${searchUrl}?${params}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "YouDeutsch Dictionary Bot",
        },
      });
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        throw new Error(`Tatoeba API error: ${response.status}`);
      }
      const data = await response.json();
      const processed = this.processNewAPIResponse(data.data || []);
      // Кэшируем результат
      this.cache.set(cacheKey, {
        data: processed,
        timestamp: Date.now(),
      });
      return processed;
    } catch (error) {
      // В продакшене не логируем ошибки в консоль
      return []; // Возвращаем пустой массив в случае ошибки
    }
  }
  /**
   * Обработка результатов нового API для немецких предложений
   */
  private processNewAPIResponse(
    sentences: TatoebaSentence[],
  ): ProcessedTatoebaExample[] {
    const processed: ProcessedTatoebaExample[] = [];
    for (const sentence of sentences) {
      if (!sentence.text || sentence.lang !== "deu") {
        continue;
      }
      // Ищем русские переводы в новой структуре
      if (sentence.translations && Array.isArray(sentence.translations)) {
        for (const translationGroup of sentence.translations) {
          if (Array.isArray(translationGroup)) {
            for (const translation of translationGroup) {
              if (translation.lang === "rus" && translation.text?.trim()) {
                processed.push({
                  german: sentence.text.trim(),
                  russian: translation.text.trim(),
                  id: sentence.id,
                });
                // Берем только первый русский перевод
                break;
              }
            }
          }
          // Если нашли перевод, переходим к следующему предложению
          if (
            processed.length > 0 &&
            processed[processed.length - 1].id === sentence.id
          ) {
            break;
          }
        }
      }
    }
    return processed;
  }
  /**
   * Поиск обратных примеров (русский -> немецкий)
   */
  async searchReverseExamples(
    russianWord: string,
    limit = 5,
  ): Promise<ProcessedTatoebaExample[]> {
    try {
      if (!russianWord?.trim()) {
        return [];
      }
      const cleanWord = russianWord.trim().toLowerCase();
      const cacheKey = `ru-de-${cleanWord}-${limit}`;
      // Проверяем кэш
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
      // Запрос к Tatoeba API с правильными параметрами
      const searchUrl = `${this.baseUrl}/sentences`;
      const params = new URLSearchParams({
        lang: "rus", // обязательный параметр - язык предложений
        q: cleanWord, // текст для поиска
        sort: "random", // обязательный параметр сортировки
        limit: limit.toString(),
      });
      const response = await fetch(`${searchUrl}?${params}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "YouDeutsch Dictionary Bot",
        },
      });
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        throw new Error(`Tatoeba API error: ${response.status}`);
      }
      const data = await response.json();
      const processed = this.processNewAPIReverseResponse(data.data || []);
      // Кэшируем результат
      this.cache.set(cacheKey, {
        data: processed,
        timestamp: Date.now(),
      });
      return processed;
    } catch (error) {
      // В продакшене не логируем ошибки в консоль
      return [];
    }
  }
  /**
   * Обработка результатов нового API для русских предложений
   */
  private processNewAPIReverseResponse(
    sentences: TatoebaSentence[],
  ): ProcessedTatoebaExample[] {
    const processed: ProcessedTatoebaExample[] = [];
    for (const sentence of sentences) {
      if (!sentence.text || sentence.lang !== "rus") {
        continue;
      }
      // Ищем немецкие переводы в новой структуре
      if (sentence.translations && Array.isArray(sentence.translations)) {
        for (const translationGroup of sentence.translations) {
          if (Array.isArray(translationGroup)) {
            for (const translation of translationGroup) {
              if (translation.lang === "deu" && translation.text?.trim()) {
                processed.push({
                  german: translation.text.trim(),
                  russian: sentence.text.trim(),
                  id: sentence.id,
                });
                // Берем только первый немецкий перевод
                break;
              }
            }
          }
          // Если нашли перевод, переходим к следующему предложению
          if (
            processed.length > 0 &&
            processed[processed.length - 1].id === sentence.id
          ) {
            break;
          }
        }
      }
    }
    return processed;
  }
  /**
   * Очистка кэша
   */
  clearCache(): void {
    this.cache.clear();
  }
  /**
   * Получение статистики кэша
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}
// Экспортируем синглтон
export const tatoebaService = new TatoebaService();
export default tatoebaService;
