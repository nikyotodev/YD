import { type NextRequest, NextResponse } from "next/server";
import {
  wiktionaryService,
  type WiktionaryEntry,
} from "@/lib/wiktionary-service";
import { germanArticleDetector } from "@/lib/german-article-detector";
import { createLogger } from "@/lib/logger";
import { withRateLimit } from "@/lib/api-rate-limiter";
// Создаем логгер для этого маршрута
const logger = createLogger("WiktionaryRoute");
// Интерфейс для обогащенного слова, совместимого с существующим UI
interface EnrichedDictionaryWord {
  id: string;
  original: string;
  translation: string;
  pronunciation: string;
  partOfSpeech: string;
  synonyms: string[];
  meanings: string[];
  examples: Array<{
    original: string;
    translation: string;
  }>;
  language: string;
  article?: string;
  gender?: string;
  difficulty?: string;
  plural?: string;
  etymology?: string;
  wiktionaryAudio?: string[];
  richDefinitions?: Array<{
    partOfSpeech: string;
    senses: Array<{
      definition: string;
      examples?: string[];
      context?: string;
      level?: string;
    }>;
  }>;
  conjugation?: {
    present?: {
      ich?: string;
      du?: string;
      er_sie_es?: string;
      wir?: string;
      ihr?: string;
      sie_Sie?: string;
    };
    preterite?: {
      ich?: string;
      du?: string;
      er_sie_es?: string;
      wir?: string;
      ihr?: string;
      sie_Sie?: string;
    };
    perfect?: string;
    imperative?: {
      du?: string;
      ihr?: string;
      Sie?: string;
    };
  };
  detailedExamples?: Array<{
    sentence: string;
    translation: string;
    level?: string;
  }>;
}
interface WiktionarySearchResult {
  success: boolean;
  word: string;
  language: string;
  results: EnrichedDictionaryWord[];
  total: number;
  sources: string[];
  attribution: string;
  attributionUrl: string;
}
/**
 * Определение языка ввода
 */
function detectInputLanguage(text: string): "de" | "ru" | "en" {
  const cyrillic = /[а-яё]/i;
  const germanSpecific = /[äöüß]/i;
  if (cyrillic.test(text)) {
    return "ru";
  }
  if (germanSpecific.test(text)) {
    return "de";
  }
  // По умолчанию считаем немецким (основной язык изучения)
  return "de";
}
/**
 * Конвертация Wiktionary данных в формат, совместимый с UI
 */
function convertWiktionaryToWord(
  entry: WiktionaryEntry,
): EnrichedDictionaryWord {
  // Определяем артикль для немецких существительных
  let displayOriginal = entry.title;
  if (
    entry.language === "de" &&
    entry.definitions.some(
      (def) =>
        def.partOfSpeech?.toLowerCase().includes("substantiv") ||
        def.partOfSpeech?.toLowerCase().includes("noun"),
    )
  ) {
    // Используем нашу экспертную систему для определения артикля
    try {
      const detection = germanArticleDetector.detectArticle(entry.title);
      // Проверяем, что детектор вернул результат (не null для прилагательных и т.д.)
      if (detection && detection.confidence >= 70) {
        logger.info(
          `Определяем артикль для "${entry.title}": ${detection.article} (${detection.confidence}% - ${detection.rule})`,
        );
        displayOriginal = `${detection.article} ${entry.title}`;
      } else if (!detection) {
        logger.info(`Слово "${entry.title}" не нуждается в артикле`);
      }
    } catch (error) {
      logger.error(
        "Ошибка при определении артикля в convertWiktionaryToWord:",
        error,
      );
    }
  }
  const word: EnrichedDictionaryWord = {
    id: `wiktionary_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    original: displayOriginal,
    translation: "", // Будет заполнено из переводов
    pronunciation: entry.pronunciation?.ipa
      ? `[${entry.pronunciation.ipa}]`
      : "",
    partOfSpeech: entry.definitions[0]?.partOfSpeech || "unknown",
    synonyms: entry.synonyms || [],
    meanings: [],
    examples: [],
    language: entry.language,
    etymology: entry.etymology,
    wiktionaryAudio: entry.pronunciation?.audioFiles || [],
    richDefinitions: entry.definitions.map((def) => ({
      partOfSpeech: def.partOfSpeech,
      senses: def.senses,
    })),
  };
  // Базовый словарь для часто используемых немецких слов
  const basicGermanTranslations: Record<string, string> = {
    zum: "к",
    zur: "к",
    vom: "от",
    der: "артикль (мужской род)",
    die: "артикль (женский род)",
    das: "артикль (средний род)",
    ein: "один, артикль",
    eine: "одна, артикль",
    auf: "на",
    in: "в",
    mit: "с",
    zu: "к, в",
    an: "на, у",
    bei: "у, при",
    nach: "после, в",
    vor: "перед",
    über: "над, через",
    unter: "под",
    zwischen: "между",
  };
  // Проверяем базовый словарь сначала
  if (
    entry.language === "de" &&
    basicGermanTranslations[entry.title.toLowerCase()]
  ) {
    word.translation = basicGermanTranslations[entry.title.toLowerCase()];
  }
  // Извлечение основного перевода из переводов
  else if (entry.translations && entry.translations.length > 0) {
    const targetLang = entry.language === "de" ? "Russian" : "German";
    const translation = entry.translations.find((t) =>
      t.language.toLowerCase().includes(targetLang.toLowerCase()),
    );
    word.translation = translation?.text || entry.translations[0].text;
  }
  // Извлечение значений из определений
  word.meanings = entry.definitions.flatMap((def) =>
    def.senses.slice(0, 3).map((sense) => sense.definition),
  );
  // Извлечение примеров
  if (entry.examples) {
    word.examples = entry.examples.slice(0, 5).map((ex) => ({
      original: ex.text,
      translation: ex.translation || "",
    }));
  }
  // Извлечение детальных примеров из определений
  const detailedExamples: Array<{
    sentence: string;
    translation: string;
    level?: string;
  }> = [];
  for (const def of entry.definitions) {
    for (const sense of def.senses) {
      if (sense.examples) {
        for (const example of sense.examples) {
          detailedExamples.push({
            sentence: example,
            translation: "", // Wiktionary часто не имеет переводов примеров
            level: sense.level,
          });
        }
      }
    }
  }
  word.detailedExamples = detailedExamples.slice(0, 5);
  // Грамматическая информация
  if (entry.grammaticalInfo) {
    word.article = entry.grammaticalInfo.article;
    word.gender = entry.grammaticalInfo.gender;
    word.plural = entry.grammaticalInfo.plural;
  }
  // Спряжения
  if (entry.inflection?.verbConjugation) {
    const conj = entry.inflection.verbConjugation;
    word.conjugation = {
      present: conj.present,
      preterite: conj.preterite,
      perfect: conj.perfect,
      imperative: conj.imperative,
    };
  }
  // Определение сложности на основе длины слова и контекста
  word.difficulty = determineDifficulty(entry.title, entry.definitions);
  return word;
}
/**
 * Интерфейс для определения из Wiktionary
 */
interface WiktionaryDefinition {
  partOfSpeech?: string;
  definition?: string;
  senses?: Array<{
    definition?: string;
    context?: string;
    examples?: string[];
  }>;
  examples?: string[];
}
/**
 * Определение уровня сложности слова
 */
function determineDifficulty(
  word: string,
  definitions: WiktionaryDefinition[],
): string {
  // Базовые слова (A1)
  const basicWords = [
    "der",
    "die",
    "das",
    "und",
    "ich",
    "du",
    "er",
    "sie",
    "es",
    "wir",
    "ihr",
    "Sie",
    "sein",
    "haben",
    "werden",
    "können",
    "müssen",
    "gut",
    "schlecht",
    "groß",
    "klein",
    "Haus",
    "Auto",
    "Mann",
    "Frau",
    "Kind",
    "Wasser",
    "Brot",
  ];
  if (basicWords.includes(word)) {
    return "A1";
  }
  // Проверка на специализированные или формальные контексты
  const hasSpecializedContext = definitions.some((def) =>
    def.senses?.some(
      (sense) =>
        sense.context &&
        ["formal", "technical", "archaic"].includes(sense.context),
    ),
  );
  if (hasSpecializedContext) {
    return "C1";
  }
  // Определение по длине слова
  if (word.length <= 4) return "A1";
  if (word.length <= 6) return "A2";
  if (word.length <= 8) return "B1";
  if (word.length <= 12) return "B2";
  return "C1";
}
/**
 * Основная функция поиска с fallback стратегией
 */
async function searchWithFallback(
  word: string,
): Promise<EnrichedDictionaryWord[]> {
  const inputLang = detectInputLanguage(word);
  const results: EnrichedDictionaryWord[] = [];
  logger.info(`Поиск "${word}" в Wiktionary (язык: ${inputLang})`);
  try {
    let entry = null;
    // Для немецких слов: ищем сначала в немецкой, затем в русской Викисловарь
    if (inputLang === "de") {
      entry = await wiktionaryService.searchWord(word, "de");
      if (!entry) {
        logger.info("Fallback: поиск в русской Wiktionary");
        entry = await wiktionaryService.searchWord(word, "ru");
      }
      if (!entry) {
        logger.info("Fallback: поиск в немецкой Wiktionary");
        entry = await wiktionaryService.searchWord(word, "de");
      }
    }
    // Для русских слов: ищем сначала в русской, затем в немецкой Викисловарь
    else if (inputLang === "ru") {
      entry = await wiktionaryService.searchWord(word, "ru");
      if (!entry) {
        logger.info("Fallback: поиск в немецкой Wiktionary");
        entry = await wiktionaryService.searchWord(word, "de");
      }
    }
    // Для других языков - используем определенный язык
    else {
      entry = await wiktionaryService.searchWord(word, inputLang);
    }
    // Английская Викисловарь - отключена для немецко-русского словаря
    // Убираем английские определения полностью из немецкого словаря
    // Эта функциональность временно отключена
    /*
    if (!entry && inputLang !== 'en') {
      logger.info("Last resort: поиск в английской Wiktionary (только для переводов)")
      const enEntry = await wiktionaryService.searchWord(word, 'en')
      // Берем только перевод, не определения на английском
      if (enEntry?.translations && enEntry.translations.length > 0) {
        // Создаем упрощенную запись только с переводом
        entry = {
          word,
          definitions: [],
          translations: enEntry.translations,
          language: inputLang,
          from: 'en-wiktionary'
        }
      }
    }
    */
    if (entry) {
      const convertedWord = convertWiktionaryToWord(entry);
      results.push(convertedWord);
      logger.info(`Найдено в Wiktionary: ${entry.title}`);
    } else {
      logger.info(`Не найдено в Wiktionary: ${word}`);
    }
  } catch (error) {
    logger.error("Ошибка поиска в Wiktionary:", error);
  }
  return results;
}
/**
 * GET - поиск слов в Wiktionary с ограничением скорости
 */
export const GET = withRateLimit({ requests: 25, window: 60 * 1000 })(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const word = searchParams.get("word") || "";
    const includeEtymology = searchParams.get("etymology") === "true";
    const includeAudio = searchParams.get("audio") === "true";
    if (!word) {
      return NextResponse.json(
        { error: "Параметр word обязателен", success: false },
        { status: 400 },
      );
    }
    try {
      logger.info(`API запрос Wiktionary: поиск "${word}"`);
      const results = await searchWithFallback(word.trim());
      // Если включена этимология, обогащаем результаты
      if (includeEtymology && results.length > 0) {
        logger.info(`Добавляем этимологию для "${word}"`);
        // Этимология уже включена в convertWiktionaryToWord
      }
      // Если включено аудио, обогащаем результаты
      if (includeAudio && results.length > 0) {
        logger.info(`Добавляем аудио для "${word}"`);
        // Аудио уже включено в convertWiktionaryToWord
      }
      const response: WiktionarySearchResult = {
        success: true,
        word,
        language: detectInputLanguage(word),
        results,
        total: results.length,
        sources: ["Wiktionary"],
        attribution: "Данные предоставлены проектом Викисловарь",
        attributionUrl: "https://wiktionary.org/",
      };
      logger.info(
        `Wiktionary API ответ: найдено ${results.length} результатов`,
      );
      return NextResponse.json(response);
    } catch (error) {
      logger.error("Wiktionary API Error:", error);
      return NextResponse.json(
        {
          error: "Ошибка при поиске в Викисловаре",
          success: false,
          attribution: "Данные предоставлены проектом Викисловарь",
          attributionUrl: "https://wiktionary.org/",
        },
        { status: 500 },
      );
    }
  },
);
/**
 * POST - получение детальной информации о слове с ограничением скорости
 */
export const POST = withRateLimit({ requests: 10, window: 60 * 1000 })(
  async (request: NextRequest) => {
    try {
      const {
        word,
        language,
        includeInflections = false,
      } = await request.json();
      if (!word) {
        return NextResponse.json(
          { error: "Параметр word обязателен", success: false },
          { status: 400 },
        );
      }
      logger.info(`Wiktionary POST: детальный поиск "${word}" (${language})`);
      const targetLang = language || detectInputLanguage(word);
      const entry = await wiktionaryService.searchWord(word, targetLang);
      if (!entry) {
        return NextResponse.json(
          { error: "Слово не найдено", success: false },
          { status: 404 },
        );
      }
      const result = convertWiktionaryToWord(entry);
      // Если запрошены склонения/спряжения, добавляем их
      if (includeInflections && entry.inflection) {
        result.conjugation = entry.inflection.verbConjugation
          ? {
              present: entry.inflection.verbConjugation.present,
              preterite: entry.inflection.verbConjugation.preterite,
              perfect: entry.inflection.verbConjugation.perfect,
              imperative: entry.inflection.verbConjugation.imperative,
            }
          : undefined;
      }
      return NextResponse.json({
        success: true,
        word,
        result,
        attribution: "Данные предоставлены проектом Викисловарь",
        attributionUrl: "https://wiktionary.org/",
      });
    } catch (error) {
      logger.error("Wiktionary POST API Error:", error);
      return NextResponse.json(
        {
          error: "Ошибка обработки запроса",
          success: false,
          attribution: "Данные предоставлены проектом Викисловарь",
          attributionUrl: "https://wiktionary.org/",
        },
        { status: 500 },
      );
    }
  },
);
