/**
 * Сервис для NLP анализа немецких слов
 * Интегрируется с обновленным CSV сервисом
 *
 * ПРОДАКШЕН-ГОТОВЫЙ КОД:
 * - Определение артиклей и грамматических свойств
 * - Поддержка омонимов
 * - Интеграция с CSV базой данных
 * - Безопасная обработка ошибок
 */
import {
  germanNounsCSV,
  type GermanNounData,
} from "./german-nouns-csv-service";
import {
  germanArticleDetector,
  type GermanArticle,
} from "./german-article-detector";
interface ArticleDetectionResult {
  article: GermanArticle | null;
  confidence: number;
  rule: string;
  reason?: string;
  category?: string;
  isNoun: boolean;
}
interface ArticleDetectionData {
  rule?: string;
  reason?: string;
  category?: string;
  isNoun?: boolean;
}
export interface GermanWordData {
  word: string;
  article: GermanArticle | null;
  plural?: string;
  partOfSpeech: string;
  confidence: number;
  sources: string[];
  examples: string[];
  homonyms: HomonymData[];
}
export interface HomonymData {
  article: GermanArticle;
  meaning: string;
  source: string;
  confidence: number;
}
class GermanNLPService {
  private static instance: GermanNLPService;
  private constructor() {}
  public static getInstance(): GermanNLPService {
    if (!GermanNLPService.instance) {
      GermanNLPService.instance = new GermanNLPService();
    }
    return GermanNLPService.instance;
  }
  /**
   * Основной метод для получения данных о немецком слове
   */
  public async getWordData(word: string): Promise<GermanWordData> {
    try {
      const cleanWord = this.cleanWord(word);
      // Загружаем CSV данные если необходимо
      await germanNounsCSV.loadCSVData();
      // Получаем данные из разных источников
      const csvData = germanNounsCSV.getArticle(cleanWord);
      const detectorResult = germanArticleDetector.detectArticle(cleanWord);
      // Определяем лучший результат
      const bestResult = this.selectBestResult(
        csvData,
        detectorResult,
        cleanWord,
      );
      // Собираем омонимы
      const homonyms = this.collectHomonyms(cleanWord, csvData);
      // Генерируем примеры
      const examples = this.generateExamples(cleanWord, bestResult.article);
      return {
        word: cleanWord,
        article: bestResult.article,
        plural: bestResult.plural,
        partOfSpeech: this.determinePartOfSpeech(cleanWord, bestResult.article),
        confidence: bestResult.confidence,
        sources: bestResult.sources,
        examples,
        homonyms,
      };
    } catch (error) {
      console.error("Ошибка в GermanNLPService:", error);
      // Fallback результат
      return {
        word: this.cleanWord(word),
        article: null,
        partOfSpeech: "unknown",
        confidence: 0.1,
        sources: ["fallback"],
        examples: [],
        homonyms: [],
      };
    }
  }
  /**
   * Получение информации об омонимах
   */
  public getHomonymsInfo(word: string): HomonymData[] {
    try {
      const cleanWord = this.cleanWord(word);
      const csvData = germanNounsCSV.getArticle(cleanWord);
      return this.collectHomonyms(cleanWord, csvData);
    } catch (error) {
      console.error("Ошибка получения омонимов:", error);
      return [];
    }
  }
  /**
   * Очистка слова от артиклей и лишних символов
   */
  private cleanWord(word: string): string {
    return word
      .replace(/^(der|die|das)\s+/i, "")
      .trim()
      .toLowerCase();
  }
  /**
   * Выбор лучшего результата из доступных источников
   */
  private selectBestResult(
    csvData: GermanNounData | null,
    detectorResult: {
      article: GermanArticle | null;
      confidence: number;
      data?: ArticleDetectionData;
      rule?: string;
    },
    word: string,
  ): {
    article: GermanArticle | null;
    plural?: string;
    confidence: number;
    sources: string[];
  } {
    // Приоритет: CSV данные > детектор артиклей
    if (csvData) {
      return {
        article: csvData.article,
        plural: csvData.plural,
        confidence: csvData.confidence,
        sources: [
          "csv",
          ...(csvData.alternativeGenders ? ["csv-alternatives"] : []),
        ],
      };
    }
    if (detectorResult?.article) {
      return {
        article: detectorResult.article,
        confidence: (detectorResult.confidence || 50) / 100,
        sources: ["detector", detectorResult.rule || "rule-based"],
      };
    }
    return {
      article: null,
      confidence: 0.1,
      sources: ["unknown"],
    };
  }
  /**
   * Сбор информации об омонимах
   */
  private collectHomonyms(
    word: string,
    csvData: GermanNounData | null,
  ): HomonymData[] {
    const homonyms: HomonymData[] = [];
    if (csvData?.alternativeGenders) {
      csvData.alternativeGenders.forEach((gender, index) => {
        homonyms.push({
          article: gender,
          meaning: `Альтернативное значение ${index + 1}`,
          source: "csv",
          confidence: Math.max(0.1, csvData.confidence - 0.1 * (index + 1)),
        });
      });
    }
    return homonyms;
  }
  /**
   * Определение части речи
   */
  private determinePartOfSpeech(
    word: string,
    article: GermanArticle | null,
  ): string {
    if (article) {
      return "noun"; // Если есть артикль, скорее всего существительное
    }
    // Простые эвристики для других частей речи
    if (word.endsWith("en")) return "verb";
    if (word.endsWith("ig") || word.endsWith("lich")) return "adjective";
    if (word.endsWith("weise")) return "adverb";
    return "unknown";
  }
  /**
   * Генерация примеров использования
   */
  private generateExamples(
    word: string,
    article: GermanArticle | null,
  ): string[] {
    const examples: string[] = [];
    if (article) {
      // Примеры для существительных
      examples.push(
        `${article} ${word.charAt(0).toUpperCase() + word.slice(1)} ist sehr wichtig.`,
      );
      examples.push(
        `Ich sehe ${article === "der" ? "den" : article === "die" ? "die" : "das"} ${word.charAt(0).toUpperCase() + word.slice(1)}.`,
      );
    } else {
      // Общие примеры
      examples.push(`Das Wort "${word}" ist interessant.`);
    }
    return examples;
  }
  /**
   * Получение статистики сервиса
   */
  public getServiceStats(): {
    csvWordsLoaded: number;
    csvLastUpdate: number | null;
    detectorRulesCount: number;
    memoryUsage: string;
  } {
    const csvStats = germanNounsCSV.getStats();
    // Детектор не имеет метода getStats, используем статическое значение
    const detectorRulesCount = 0; // Статистика детектора недоступна
    return {
      csvWordsLoaded: csvStats.totalWords,
      csvLastUpdate: csvStats.lastUpdated,
      detectorRulesCount,
      memoryUsage: csvStats.memoryUsage,
    };
  }
  /**
   * Диагностика для отладки
   */
  public diagnoseWord(word: string): {
    cleanWord: string;
    csvFound: boolean;
    detectorResult: {
      article: GermanArticle | null;
      confidence: number;
      data?: ArticleDetectionData;
    };
    finalConfidence: number;
    sources: string[];
  } {
    const cleanWord = this.cleanWord(word);
    const csvData = germanNounsCSV.getArticle(cleanWord);
    const detectorResult = germanArticleDetector.detectArticle(cleanWord);
    const bestResult = this.selectBestResult(
      csvData,
      detectorResult,
      cleanWord,
    );
    return {
      cleanWord,
      csvFound: !!csvData,
      detectorResult,
      finalConfidence: bestResult.confidence,
      sources: bestResult.sources,
    };
  }
  /**
   * Поиск похожих слов
   */
  public findSimilarWords(
    word: string,
    limit = 5,
  ): Array<{
    word: string;
    article: GermanArticle;
    similarity: number;
  }> {
    try {
      const cleanWord = this.cleanWord(word);
      const results = germanNounsCSV.searchWords(cleanWord, limit * 2);
      return results
        .map((result) => ({
          word: result.word,
          article: result.article,
          similarity: this.calculateSimilarity(cleanWord, result.word),
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
    } catch (error) {
      console.error("Ошибка поиска похожих слов:", error);
      return [];
    }
  }
  /**
   * Простой расчет похожести слов
   */
  private calculateSimilarity(word1: string, word2: string): number {
    if (word1 === word2) return 1.0;
    // Простая метрика на основе общих символов
    const commonChars = word1
      .split("")
      .filter((char) => word2.includes(char)).length;
    const maxLength = Math.max(word1.length, word2.length);
    return commonChars / maxLength;
  }
  /**
   * Валидация немецкого слова
   */
  public isValidGermanWord(word: string): boolean {
    const cleanWord = this.cleanWord(word);
    // Базовые проверки
    if (!cleanWord || cleanWord.length < 2 || cleanWord.length > 50) {
      return false;
    }
    // Проверяем, что содержит только допустимые символы
    const germanPattern = /^[a-zäöüß\-]+$/i;
    if (!germanPattern.test(cleanWord)) {
      return false;
    }
    return true;
  }
  /**
   * Получение качественной оценки базы данных
   */
  public getQualityAssessment(): {
    overallQuality: "excellent" | "good" | "fair" | "poor";
    csvCoverage: number;
    averageConfidence: number;
    recommendations: string[];
  } {
    const csvStats = germanNounsCSV.getStats();
    const qualityReport = germanNounsCSV.getQualityReport();
    const recommendations: string[] = [];
    let overallQuality: "excellent" | "good" | "fair" | "poor" = "excellent";
    // Анализ покрытия
    const csvCoverage = csvStats.totalWords;
    if (csvCoverage < 5000) {
      overallQuality = "poor";
      recommendations.push("Необходимо загрузить больше данных из CSV");
    } else if (csvCoverage < 15000) {
      overallQuality = "fair";
      recommendations.push("Рекомендуется обновить CSV данные");
    } else if (csvCoverage < 25000) {
      overallQuality = "good";
    }
    // Анализ качества
    if (qualityReport.average_confidence < 0.7) {
      if (overallQuality === "excellent") overallQuality = "good";
      recommendations.push("Низкая средняя уверенность в данных");
    }
    return {
      overallQuality,
      csvCoverage,
      averageConfidence: qualityReport.average_confidence,
      recommendations,
    };
  }
}
// Экспорт singleton instance
export const germanNLPService = GermanNLPService.getInstance();
