/**
 * Сервис для автоматического определения языка текста
 * Поддерживает русский и немецкий языки
 */
export interface LanguageDetectionResult {
  language: "ru" | "de" | "unknown";
  confidence: number;
  suggestedDirection: "ru-de" | "de-ru" | null;
}
interface LanguagePattern {
  pattern: RegExp;
  weight: number;
  description: string;
}
class LanguageDetector {
  // Паттерны для русского языка
  private readonly russianPatterns: LanguagePattern[] = [
    // Кириллические буквы
    { pattern: /[а-яё]/gi, weight: 10, description: "Кириллические символы" },
    // Типичные русские окончания
    {
      pattern: /(?:ый|ая|ое|ые|ого|ой|ые|ых|ому|ему|ими|ами)$/gi,
      weight: 8,
      description: "Русские окончания",
    },
    // Русские предлоги и союзы
    {
      pattern:
        /\b(?:в|на|за|под|над|при|про|для|без|через|между|среди|или|но|да|а|то|что|как|если|когда)\b/gi,
      weight: 6,
      description: "Русские служебные слова",
    },
    // Типичные русские буквосочетания
    {
      pattern: /(?:щ|ъ|ь|ё|ю|я|ща|ща|жи|ши|чи|щи)/gi,
      weight: 5,
      description: "Русские буквосочетания",
    },
    // Русские частицы
    {
      pattern: /\b(?:не|ни|же|ли|бы|то|ка|де|мол|дескать)\b/gi,
      weight: 4,
      description: "Русские частицы",
    },
  ];
  // Паттерны для немецкого языка
  private readonly germanPatterns: LanguagePattern[] = [
    // Немецкие умлауты и эсцет
    {
      pattern: /[äöüßÄÖÜ]/g,
      weight: 15,
      description: "Немецкие умлауты и эсцет",
    },
    // Типичные немецкие окончания
    {
      pattern: /(?:ung|heit|keit|schaft|lich|isch|bar|los|voll|weise)$/gi,
      weight: 8,
      description: "Немецкие суффиксы",
    },
    // Немецкие артикли и предлоги
    {
      pattern:
        /\b(?:der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|und|oder|aber|mit|von|zu|in|an|auf|für|bei|nach|über|unter|durch|gegen|ohne|um|bis|seit|während|wegen)\b/gi,
      weight: 7,
      description: "Немецкие служебные слова",
    },
    // Популярные немецкие слова (высокий вес для точного определения)
    {
      pattern:
        /\b(?:bitte|danke|hallo|guten|morgen|abend|tag|nacht|ja|nein|gut|schlecht|schön|groß|klein|neu|alt|hier|dort|heute|gestern|morgen|später|früher|jetzt|immer|nie|oft|manchmal|sehr|auch|noch|schon|gerne|lieber|besser|mehr|weniger|viel|wenig|alle|alles|nichts|etwas)\b/gi,
      weight: 12,
      description: "Популярные немецкие слова",
    },
    // Характерные немецкие буквосочетания
    {
      pattern: /(?:sch|tsch|pf|tz|ck|ch|st|sp|qu)/gi,
      weight: 4,
      description: "Немецкие буквосочетания",
    },
    // Немецкие местоимения
    {
      pattern:
        /\b(?:ich|du|er|sie|es|wir|ihr|mich|dich|sich|mir|dir|ihm|ihr|uns|euch|ihnen)\b/gi,
      weight: 6,
      description: "Немецкие местоимения",
    },
    // Характерные немецкие слова
    {
      pattern:
        /\b(?:ist|sind|war|waren|haben|hat|hatte|hatten|werden|wird|wurde|wurden|kann|könnte|muss|soll|will|möchte)\b/gi,
      weight: 5,
      description: "Немецкие глаголы",
    },
  ];
  // Словарь специальных случаев для коротких приветствий и частых слов
  private readonly specialCases = new Map<string, LanguageDetectionResult>([
    // Универсальные приветствия (считаем немецкими для корректного поиска)
    ["hallo", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["hi", { language: "de", confidence: 85, suggestedDirection: "de-ru" }],
    ["moin", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["servus", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["tschüss", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["tschau", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["ciao", { language: "de", confidence: 80, suggestedDirection: "de-ru" }],
    // Вежливые выражения
    ["bitte", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["danke", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    // Базовые числа
    ["null", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["eins", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["zwei", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["drei", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["vier", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["fünf", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["sechs", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["sieben", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["acht", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["neun", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["zehn", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    // Основные цвета
    ["rot", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["blau", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["grün", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["gelb", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["schwarz", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["weiß", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    // Дни недели (частые)
    ["montag", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["dienstag", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["mittwoch", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["donnerstag", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["freitag", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["samstag", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["sonntag", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    // Время
    ["heute", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["gestern", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["morgen", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    ["jetzt", { language: "de", confidence: 95, suggestedDirection: "de-ru" }],
    // Русские приветствия
    ["привет", { language: "ru", confidence: 95, suggestedDirection: "ru-de" }],
    ["здравствуйте", { language: "ru", confidence: 95, suggestedDirection: "ru-de" }],
    ["пока", { language: "ru", confidence: 95, suggestedDirection: "ru-de" }],
    ["спасибо", { language: "ru", confidence: 95, suggestedDirection: "ru-de" }],
    ["пожалуйста", { language: "ru", confidence: 95, suggestedDirection: "ru-de" }],
  ]);
  /**
   * Определяет язык текста
   */
  detectLanguage(text: string): LanguageDetectionResult {
    if (!text || !text.trim()) {
      return {
        language: "unknown",
        confidence: 0,
        suggestedDirection: null,
      };
    }
    const cleanText = text.trim().toLowerCase();
    // Проверяем специальные случаи для коротких слов и приветствий
    if (this.specialCases.has(cleanText)) {
      const specialCase = this.specialCases.get(cleanText);
      if (specialCase) return specialCase;
    }
    // Подсчет очков для каждого языка
    const russianScore = this.calculateScore(cleanText, this.russianPatterns);
    const germanScore = this.calculateScore(cleanText, this.germanPatterns);
    // Определение языка на основе очков
    const totalScore = russianScore + germanScore;
    if (totalScore === 0) {
      // Если нет специфических паттернов, пробуем определить по алфавиту
      return this.detectByCharacterSet(cleanText);
    }
    const russianConfidence = (russianScore / totalScore) * 100;
    const germanConfidence = (germanScore / totalScore) * 100;
    // Минимальный порог уверенности для определения языка
    const minimumConfidence = 60;
    if (russianConfidence >= minimumConfidence) {
      return {
        language: "ru",
        confidence: Math.round(russianConfidence),
        suggestedDirection: "ru-de",
      };
    }
    if (germanConfidence >= minimumConfidence) {
      return {
        language: "de",
        confidence: Math.round(germanConfidence),
        suggestedDirection: "de-ru",
      };
    }
    // Если уверенность низкая, возвращаем наиболее вероятный вариант
    if (russianScore > germanScore) {
      return {
        language: "ru",
        confidence: Math.round(russianConfidence),
        suggestedDirection: "ru-de",
      };
    }
    if (germanScore > russianScore) {
      return {
        language: "de",
        confidence: Math.round(germanConfidence),
        suggestedDirection: "de-ru",
      };
    }
    return {
      language: "unknown",
      confidence: 0,
      suggestedDirection: null,
    };
  }
  /**
   * Вычисляет очки для языка на основе паттернов
   */
  private calculateScore(text: string, patterns: LanguagePattern[]): number {
    let score = 0;
    for (const pattern of patterns) {
      const matches = text.match(pattern.pattern);
      if (matches) {
        // Учитываем количество совпадений и вес паттерна
        score += matches.length * pattern.weight;
      }
    }
    return score;
  }
  /**
   * Определение языка по набору символов (fallback метод)
   */
  private detectByCharacterSet(text: string): LanguageDetectionResult {
    const cyrillicCount = (text.match(/[а-яё]/gi) || []).length;
    const latinCount = (text.match(/[a-z]/gi) || []).length;
    const germanSpecialCount = (text.match(/[äöüß]/gi) || []).length;
    const totalChars = cyrillicCount + latinCount + germanSpecialCount;
    if (totalChars === 0) {
      return {
        language: "unknown",
        confidence: 0,
        suggestedDirection: null,
      };
    }
    const cyrillicRatio = cyrillicCount / totalChars;
    const germanSpecialRatio = germanSpecialCount / totalChars;
    // Если есть кириллица
    if (cyrillicRatio > 0.3) {
      return {
        language: "ru",
        confidence: Math.round(cyrillicRatio * 100),
        suggestedDirection: "ru-de",
      };
    }
    // Если есть немецкие специальные символы
    if (germanSpecialRatio > 0.1) {
      return {
        language: "de",
        confidence: Math.round(germanSpecialRatio * 100 + 50), // Бонус за специфичные символы
        suggestedDirection: "de-ru",
      };
    }
    // Если только латиница, предполагаем немецкий (могут быть слова без умлаутов)
    if (latinCount > 0) {
      return {
        language: "de",
        confidence: 40, // Низкая уверенность
        suggestedDirection: "de-ru",
      };
    }
    return {
      language: "unknown",
      confidence: 0,
      suggestedDirection: null,
    };
  }
  /**
   * Получает описание результата определения языка
   */
  getDetectionDescription(result: LanguageDetectionResult): string {
    switch (result.language) {
      case "ru":
        return "Переключить на русско-немецкий словарь?";
      case "de":
        return "Переключить на немецко-русский словарь?";
      case "unknown":
        return "Не удалось определить язык";
      default:
        return "Неизвестный результат";
    }
  }
  /**
   * Проверяет, нужно ли автоматически переключить направление перевода
   */
  shouldAutoSwitchDirection(
    currentDirection: "auto" | "ru-de" | "de-ru",
    detectionResult: LanguageDetectionResult,
  ): boolean {
    if (
      !detectionResult.suggestedDirection ||
      detectionResult.confidence < 50
    ) {
      return false;
    }
    // В режиме auto всегда переключаем на определенное направление
    if (currentDirection === "auto") {
      return true;
    }
    return currentDirection !== detectionResult.suggestedDirection;
  }
}
// Экспортируем единственный экземпляр
export const languageDetector = new LanguageDetector();
