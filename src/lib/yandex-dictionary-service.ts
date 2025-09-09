/**
 * Сервис для работы с Yandex Dictionary API
 * Безопасная обработка всех запросов с кэшированием и rate limiting
 */
import type {
  YandexDictionaryLookupResponse,
  YandexDictionaryLanguagesResponse,
  ProcessedDictionaryResult,
  ProcessedDefinition,
  ProcessedTranslation,
  ProcessedExample,
  DictionaryApiError,
  DictionaryCacheEntry,
  LanguageDirection,
  YandexDictionaryErrorCode,
} from "@/types/dictionary";
import { YANDEX_DICTIONARY_ERRORS, DICTIONARY_FLAGS } from "@/types/dictionary";
import { germanArticleDetector } from "@/lib/german-article-detector";
class YandexDictionaryService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly cache = new Map<string, DictionaryCacheEntry>();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 часа
  private readonly REQUEST_TIMEOUT = 10000; // 10 секунд
  // Fallback словарь для случаев когда API не работает или возвращает плохие результаты
  private readonly fallbackTranslations = new Map<string, {
    translations: { text: string; partOfSpeech?: string }[];
    transcription?: string;
    isReliable: boolean;
  }>([
    // Приветствия и базовые фразы
    ["hallo", {
      translations: [
        { text: "привет", partOfSpeech: "interj" },
        { text: "здравствуйте", partOfSpeech: "interj" }
      ],
      transcription: "ˈhalo",
      isReliable: true
    }],
    ["hi", {
      translations: [{ text: "привет", partOfSpeech: "interj" }],
      transcription: "haɪ",
      isReliable: true
    }],
    ["danke", {
      translations: [
        { text: "спасибо", partOfSpeech: "interj" },
        { text: "благодарю", partOfSpeech: "interj" }
      ],
      transcription: "ˈdaŋkə",
      isReliable: true
    }],
    ["bitte", {
      translations: [
        { text: "пожалуйста", partOfSpeech: "interj" },
        { text: "прошу", partOfSpeech: "interj" }
      ],
      transcription: "ˈbɪtə",
      isReliable: true
    }],
    ["tschüss", {
      translations: [
        { text: "пока", partOfSpeech: "interj" },
        { text: "до свидания", partOfSpeech: "interj" }
      ],
      transcription: "tʃʏs",
      isReliable: true
    }],
    ["ja", {
      translations: [{ text: "да", partOfSpeech: "part" }],
      transcription: "jaː",
      isReliable: true
    }],
    ["nein", {
      translations: [{ text: "нет", partOfSpeech: "part" }],
      transcription: "naɪn",
      isReliable: true
    }],
    // ЧИСЛА (0-20 и круглые числа)
    ["null", {
      translations: [{ text: "ноль", partOfSpeech: "num" }],
      transcription: "nʊl",
      isReliable: true
    }],
    ["eins", {
      translations: [{ text: "один", partOfSpeech: "num" }],
      transcription: "aɪns",
      isReliable: true
    }],
    ["zwei", {
      translations: [{ text: "два", partOfSpeech: "num" }],
      transcription: "tsvaɪ",
      isReliable: true
    }],
    ["drei", {
      translations: [{ text: "три", partOfSpeech: "num" }],
      transcription: "draɪ",
      isReliable: true
    }],
    ["vier", {
      translations: [{ text: "четыре", partOfSpeech: "num" }],
      transcription: "fiːɐ̯",
      isReliable: true
    }],
    ["fünf", {
      translations: [{ text: "пять", partOfSpeech: "num" }],
      transcription: "fʏnf",
      isReliable: true
    }],
    ["sechs", {
      translations: [{ text: "шесть", partOfSpeech: "num" }],
      transcription: "zɛks",
      isReliable: true
    }],
    ["sieben", {
      translations: [{ text: "семь", partOfSpeech: "num" }],
      transcription: "ˈziːbən",
      isReliable: true
    }],
    ["acht", {
      translations: [{ text: "восемь", partOfSpeech: "num" }],
      transcription: "axt",
      isReliable: true
    }],
    ["neun", {
      translations: [{ text: "девять", partOfSpeech: "num" }],
      transcription: "nɔʏn",
      isReliable: true
    }],
    ["zehn", {
      translations: [{ text: "десять", partOfSpeech: "num" }],
      transcription: "tseːn",
      isReliable: true
    }],
    ["elf", {
      translations: [{ text: "одиннадцать", partOfSpeech: "num" }],
      transcription: "ɛlf",
      isReliable: true
    }],
    ["zwölf", {
      translations: [{ text: "двенадцать", partOfSpeech: "num" }],
      transcription: "tsvœlf",
      isReliable: true
    }],
    ["zwanzig", {
      translations: [{ text: "двадцать", partOfSpeech: "num" }],
      transcription: "ˈtsvantsɪç",
      isReliable: true
    }],
    ["hundert", {
      translations: [{ text: "сто", partOfSpeech: "num" }],
      transcription: "ˈhʊndɐt",
      isReliable: true
    }],
    ["tausend", {
      translations: [{ text: "тысяча", partOfSpeech: "num" }],
      transcription: "ˈtaʊzənt",
      isReliable: true
    }],
    // ЦВЕТА
    ["rot", {
      translations: [{ text: "красный", partOfSpeech: "adj" }],
      transcription: "roːt",
      isReliable: true
    }],
    ["blau", {
      translations: [{ text: "синий", partOfSpeech: "adj" }],
      transcription: "blaʊ",
      isReliable: true
    }],
    ["grün", {
      translations: [{ text: "зелёный", partOfSpeech: "adj" }],
      transcription: "ɡryːn",
      isReliable: true
    }],
    ["gelb", {
      translations: [{ text: "жёлтый", partOfSpeech: "adj" }],
      transcription: "ɡɛlp",
      isReliable: true
    }],
    ["schwarz", {
      translations: [{ text: "чёрный", partOfSpeech: "adj" }],
      transcription: "ʃvaʁts",
      isReliable: true
    }],
    ["weiß", {
      translations: [{ text: "белый", partOfSpeech: "adj" }],
      transcription: "vaɪs",
      isReliable: true
    }],
    ["grau", {
      translations: [{ text: "серый", partOfSpeech: "adj" }],
      transcription: "ɡʁaʊ",
      isReliable: true
    }],
    ["braun", {
      translations: [{ text: "коричневый", partOfSpeech: "adj" }],
      transcription: "bʁaʊn",
      isReliable: true
    }],
    ["orange", {
      translations: [{ text: "оранжевый", partOfSpeech: "adj" }],
      transcription: "oˈʁaːnʒə",
      isReliable: true
    }],
    ["rosa", {
      translations: [{ text: "розовый", partOfSpeech: "adj" }],
      transcription: "ˈroːza",
      isReliable: true
    }],
    ["violett", {
      translations: [{ text: "фиолетовый", partOfSpeech: "adj" }],
      transcription: "vioˈlɛt",
      isReliable: true
    }],
    // ДНИ НЕДЕЛИ
    ["montag", {
      translations: [{ text: "понедельник", partOfSpeech: "n" }],
      transcription: "ˈmoːntaːk",
      isReliable: true
    }],
    ["dienstag", {
      translations: [{ text: "вторник", partOfSpeech: "n" }],
      transcription: "ˈdiːnstaːk",
      isReliable: true
    }],
    ["mittwoch", {
      translations: [{ text: "среда", partOfSpeech: "n" }],
      transcription: "ˈmɪtvɔx",
      isReliable: true
    }],
    ["donnerstag", {
      translations: [{ text: "четверг", partOfSpeech: "n" }],
      transcription: "ˈdɔnɐstaːk",
      isReliable: true
    }],
    ["freitag", {
      translations: [{ text: "пятница", partOfSpeech: "n" }],
      transcription: "ˈfʁaɪtaːk",
      isReliable: true
    }],
    ["samstag", {
      translations: [{ text: "суббота", partOfSpeech: "n" }],
      transcription: "ˈzamstaːk",
      isReliable: true
    }],
    ["sonnabend", {
      translations: [{ text: "суббота", partOfSpeech: "n" }],
      transcription: "ˈzɔnaːbənt",
      isReliable: true
    }],
    ["sonntag", {
      translations: [{ text: "воскресенье", partOfSpeech: "n" }],
      transcription: "ˈzɔntaːk",
      isReliable: true
    }],
    // МЕСЯЦЫ
    ["januar", {
      translations: [{ text: "январь", partOfSpeech: "n" }],
      transcription: "ˈjaːnuaːɐ̯",
      isReliable: true
    }],
    ["februar", {
      translations: [{ text: "февраль", partOfSpeech: "n" }],
      transcription: "ˈfeːbʁuaːɐ̯",
      isReliable: true
    }],
    ["märz", {
      translations: [{ text: "март", partOfSpeech: "n" }],
      transcription: "mɛʁts",
      isReliable: true
    }],
    ["april", {
      translations: [{ text: "апрель", partOfSpeech: "n" }],
      transcription: "aˈpʁɪl",
      isReliable: true
    }],
    ["mai", {
      translations: [{ text: "май", partOfSpeech: "n" }],
      transcription: "maɪ",
      isReliable: true
    }],
    ["juni", {
      translations: [{ text: "июнь", partOfSpeech: "n" }],
      transcription: "ˈjuːni",
      isReliable: true
    }],
    ["juli", {
      translations: [{ text: "июль", partOfSpeech: "n" }],
      transcription: "ˈjuːli",
      isReliable: true
    }],
    ["august", {
      translations: [{ text: "август", partOfSpeech: "n" }],
      transcription: "aʊˈɡʊst",
      isReliable: true
    }],
    ["september", {
      translations: [{ text: "сентябрь", partOfSpeech: "n" }],
      transcription: "zɛpˈtɛmbɐ",
      isReliable: true
    }],
    ["oktober", {
      translations: [{ text: "октябрь", partOfSpeech: "n" }],
      transcription: "ɔkˈtoːbɐ",
      isReliable: true
    }],
    ["november", {
      translations: [{ text: "ноябрь", partOfSpeech: "n" }],
      transcription: "noˈvɛmbɐ",
      isReliable: true
    }],
    ["dezember", {
      translations: [{ text: "декабрь", partOfSpeech: "n" }],
      transcription: "deˈtsɛmbɐ",
      isReliable: true
    }],
    // ВРЕМЯ И ДАТЫ
    ["heute", {
      translations: [{ text: "сегодня", partOfSpeech: "adv" }],
      transcription: "ˈhɔɪtə",
      isReliable: true
    }],
    ["gestern", {
      translations: [{ text: "вчера", partOfSpeech: "adv" }],
      transcription: "ˈɡɛstɐn",
      isReliable: true
    }],
    ["morgen", {
      translations: [
        { text: "завтра", partOfSpeech: "adv" },
        { text: "утро", partOfSpeech: "n" }
      ],
      transcription: "ˈmɔʁɡən",
      isReliable: true
    }],
    ["jetzt", {
      translations: [{ text: "сейчас", partOfSpeech: "adv" }],
      transcription: "jɛtst",
      isReliable: true
    }],
    ["früh", {
      translations: [{ text: "рано", partOfSpeech: "adv" }],
      transcription: "fʁyː",
      isReliable: true
    }],
    ["spät", {
      translations: [{ text: "поздно", partOfSpeech: "adv" }],
      transcription: "ʃpɛːt",
      isReliable: true
    }],
    // СЕМЬЯ
    ["mutter", {
      translations: [{ text: "мать", partOfSpeech: "n" }],
      transcription: "ˈmʊtɐ",
      isReliable: true
    }],
    ["vater", {
      translations: [{ text: "отец", partOfSpeech: "n" }],
      transcription: "ˈfaːtɐ",
      isReliable: true
    }],
    ["sohn", {
      translations: [{ text: "сын", partOfSpeech: "n" }],
      transcription: "zoːn",
      isReliable: true
    }],
    ["tochter", {
      translations: [{ text: "дочь", partOfSpeech: "n" }],
      transcription: "ˈtɔxtɐ",
      isReliable: true
    }],
    ["bruder", {
      translations: [{ text: "брат", partOfSpeech: "n" }],
      transcription: "ˈbʁuːdɐ",
      isReliable: true
    }],
    ["schwester", {
      translations: [{ text: "сестра", partOfSpeech: "n" }],
      transcription: "ˈʃvɛstɐ",
      isReliable: true
    }],
    // ПРОСТЫЕ ПРИЛАГАТЕЛЬНЫЕ
    ["gut", {
      translations: [
        { text: "хороший", partOfSpeech: "adj" },
        { text: "хорошо", partOfSpeech: "adv" }
      ],
      transcription: "ɡuːt",
      isReliable: true
    }],
    ["schlecht", {
      translations: [
        { text: "плохой", partOfSpeech: "adj" },
        { text: "плохо", partOfSpeech: "adv" }
      ],
      transcription: "ʃlɛçt",
      isReliable: true
    }],
    ["groß", {
      translations: [{ text: "большой", partOfSpeech: "adj" }],
      transcription: "ɡʁoːs",
      isReliable: true
    }],
    ["klein", {
      translations: [{ text: "маленький", partOfSpeech: "adj" }],
      transcription: "klaɪn",
      isReliable: true
    }],
    ["neu", {
      translations: [{ text: "новый", partOfSpeech: "adj" }],
      transcription: "nɔɪ",
      isReliable: true
    }],
    ["alt", {
      translations: [{ text: "старый", partOfSpeech: "adj" }],
      transcription: "alt",
      isReliable: true
    }],
    ["schön", {
      translations: [{ text: "красивый", partOfSpeech: "adj" }],
      transcription: "ʃøːn",
      isReliable: true
    }],
    // ПРОСТЫЕ ГЛАГОЛЫ
    ["gehen", {
      translations: [{ text: "идти", partOfSpeech: "v" }],
      transcription: "ˈɡeːən",
      isReliable: true
    }],
    ["kommen", {
      translations: [{ text: "приходить", partOfSpeech: "v" }],
      transcription: "ˈkɔmən",
      isReliable: true
    }],
    ["machen", {
      translations: [{ text: "делать", partOfSpeech: "v" }],
      transcription: "ˈmaxən",
      isReliable: true
    }],
    ["sein", {
      translations: [{ text: "быть", partOfSpeech: "v" }],
      transcription: "zaɪn",
      isReliable: true
    }],
    ["haben", {
      translations: [{ text: "иметь", partOfSpeech: "v" }],
      transcription: "ˈhaːbən",
      isReliable: true
    }],
  ]);
  constructor() {
    const baseUrl = process.env.YANDEX_DICTIONARY_BASE_URL;
    const apiKey = process.env.YANDEX_DICTIONARY_API_KEY;
    if (!baseUrl) {
      throw new Error("YANDEX_DICTIONARY_BASE_URL не настроен");
    }
    if (!apiKey) {
      throw new Error("YANDEX_DICTIONARY_API_KEY не настроен");
    }
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }
  /**
   * Проверка доступных языков
   */
  async getSupportedLanguages(): Promise<string[]> {
    const cacheKey = "supported_languages";
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached.data as string[];
    }
    try {
      const url = new URL(`${this.baseUrl}/getLangs`);
      url.searchParams.set("key", this.apiKey);
      const response =
        await this.makeRequest<YandexDictionaryLanguagesResponse>(
          url.toString(),
        );
      // Кэшируем список языков на долгое время
      this.setCache(cacheKey, {
        data: response,
        timestamp: Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });
      return response;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }
  /**
   * Поиск переводов слова
   */
  async lookup(
    text: string,
    direction: LanguageDirection,
    options: {
      ui?: "ru" | "de" | "en";
      enableMorphology?: boolean;
      enableExamples?: boolean;
      familyFilter?: boolean;
    } = {},
  ): Promise<ProcessedDictionaryResult> {
    // Валидация входных данных
    if (!text?.trim()) {
      throw new Error("Текст для поиска не может быть пустым");
    }
    if (text.length > 100) {
      throw new Error("Максимальная длина текста для поиска: 100 символов");
    }
    const normalizedText = text.trim().toLowerCase();
    const cacheKey = `lookup_${normalizedText}_${direction}_${JSON.stringify(options)}`;
    // Проверяем кэш
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached.data as ProcessedDictionaryResult;
    }
    // Проверяем fallback словарь для надежных переводов
    if (this.fallbackTranslations.has(normalizedText)) {
      const fallback = this.fallbackTranslations.get(normalizedText);
      if (fallback?.isReliable) {
        const fallbackResult = this.createFallbackResult(text, direction, fallback);
        // Кэшируем fallback результат
        this.setCache(cacheKey, {
          data: fallbackResult,
          timestamp: Date.now(),
          expiresAt: Date.now() + this.CACHE_DURATION,
        });
        return fallbackResult;
      }
    }
    try {
      // Формируем флаги
      let flags = 0;
      if (options.enableMorphology !== false) flags |= DICTIONARY_FLAGS.MORPHO;
      if (options.familyFilter) flags |= DICTIONARY_FLAGS.FAMILY;
      flags |= DICTIONARY_FLAGS.SHORT_POS; // всегда используем короткие названия частей речи
      // Формируем URL
      const url = new URL(`${this.baseUrl}/lookup`);
      url.searchParams.set("key", this.apiKey);
      url.searchParams.set("lang", direction);
      url.searchParams.set("text", text);
      url.searchParams.set("ui", options.ui || "ru");
      url.searchParams.set("flags", flags.toString());
      const response = await this.makeRequest<YandexDictionaryLookupResponse>(
        url.toString(),
      );
      // Обрабатываем результат
      const processedResult = this.processLookupResponse(
        text,
        direction,
        response,
      );
      // Добавляем определение артикля ТОЛЬКО для немецких СУЩЕСТВИТЕЛЬНЫХ
      if (direction === "de-ru" || direction === "de-de") {
        const articleResult = germanArticleDetector.detectArticle(text);
        // ВАЖНО: добавляем артикль только если слово является существительным И артикль определен
        if (articleResult?.isNoun && articleResult.article) {
          processedResult.germanArticle = articleResult;
          // Артикль успешно определен для существительного
        } else {
          // Слово не является существительным или артикль не определен
        }
      }
      // Кэшируем результат
      this.setCache(cacheKey, {
        data: processedResult,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.CACHE_DURATION,
      });
      return processedResult;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }
  /**
   * Выполнение HTTP запроса с обработкой ошибок
   */
  private async makeRequest<T>(url: string): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.REQUEST_TIMEOUT,
    );
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "YourDeutsch/1.0",
        },
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`,
        );
      }
      const data = await response.json();
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Запрос превысил время ожидания");
        }
        throw error;
      }
      throw new Error("Неизвестная ошибка при выполнении запроса");
    }
  }
  /**
   * Обработка ответа lookup в удобный формат
   */
  private processLookupResponse(
    originalWord: string,
    direction: LanguageDirection,
    response: YandexDictionaryLookupResponse,
  ): ProcessedDictionaryResult {
    const definitions: ProcessedDefinition[] = [];
    if (response.def && response.def.length > 0) {
      for (const def of response.def) {
        const translations: ProcessedTranslation[] = [];
        if (def.tr && def.tr.length > 0) {
          for (const tr of def.tr) {
            const synonyms = tr.syn?.map((syn) => syn.text) || [];
            const meanings = tr.mean?.map((mean) => mean.text) || [];
            const examples: ProcessedExample[] =
              tr.ex?.map((ex) => ({
                original: ex.text,
                translation: ex.tr?.[0]?.text,
              })) || [];
            translations.push({
              text: tr.text,
              partOfSpeech: tr.pos,
              gender: tr.gen,
              synonyms,
              meanings,
              examples,
            });
          }
        }
        definitions.push({
          word: def.text,
          partOfSpeech: def.pos,
          transcription: def.ts,
          translations,
        });
      }
    }
    return {
      word: originalWord,
      direction,
      definitions,
      hasResults: definitions.length > 0,
    };
  }
  /**
   * Создание результата из fallback словаря
   */
  private createFallbackResult(
    originalWord: string,
    direction: LanguageDirection,
    fallback: {
      translations: { text: string; partOfSpeech?: string }[];
      transcription?: string;
      isReliable: boolean;
    }
  ): ProcessedDictionaryResult {
    const translations: ProcessedTranslation[] = fallback.translations.map(tr => ({
      text: tr.text,
      partOfSpeech: tr.partOfSpeech,
      gender: undefined,
      synonyms: [],
      meanings: [],
      examples: [],
    }));
    const definitions: ProcessedDefinition[] = [{
      word: originalWord,
      partOfSpeech: fallback.translations[0]?.partOfSpeech,
      transcription: fallback.transcription,
      translations,
    }];
    return {
      word: originalWord,
      direction,
      definitions,
      hasResults: true,
    };
  }
  /**
   * Обработка ошибок API
   */
  private handleApiError(error: unknown): DictionaryApiError {
    if (error instanceof Error) {
      // Определяем тип ошибки по сообщению
      if (error.message.includes("401")) {
        return {
          code: YANDEX_DICTIONARY_ERRORS.ERR_KEY_INVALID,
          message: "Недействительный API ключ",
        };
      }
      if (error.message.includes("402")) {
        return {
          code: YANDEX_DICTIONARY_ERRORS.ERR_KEY_BLOCKED,
          message: "API ключ заблокирован",
        };
      }
      if (error.message.includes("403")) {
        return {
          code: YANDEX_DICTIONARY_ERRORS.ERR_DAILY_REQ_LIMIT_EXCEEDED,
          message: "Превышен лимит запросов в день",
        };
      }
      if (error.message.includes("413")) {
        return {
          code: YANDEX_DICTIONARY_ERRORS.ERR_TEXT_TOO_LONG,
          message: "Слишком длинный текст для поиска",
        };
      }
      if (error.message.includes("501")) {
        return {
          code: YANDEX_DICTIONARY_ERRORS.ERR_LANG_NOT_SUPPORTED,
          message: "Направление перевода не поддерживается",
        };
      }
      return {
        code: 500,
        message: error.message,
      };
    }
    return {
      code: 500,
      message: "Неизвестная ошибка сервиса словаря",
    };
  }
  /**
   * Получение данных из кэша
   */
  private getFromCache(key: string): DictionaryCacheEntry | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached;
    }
    // Удаляем устаревший кэш
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }
  /**
   * Сохранение данных в кэш
   */
  private setCache(key: string, entry: DictionaryCacheEntry): void {
    this.cache.set(key, entry);
    // Очистка кэша от устаревших записей (максимум 1000 записей)
    if (this.cache.size > 1000) {
      const now = Date.now();
      const keysToDelete: string[] = [];
      for (const [cacheKey, cacheEntry] of this.cache.entries()) {
        if (cacheEntry.expiresAt <= now) {
          keysToDelete.push(cacheKey);
        }
      }
      // Удаляем устаревшие записи
      for (const keyToDelete of keysToDelete) {
        this.cache.delete(keyToDelete);
      }
      // Если всё ещё слишком много записей, удаляем старые
      if (this.cache.size > 1000) {
        const entries = Array.from(this.cache.entries());
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        const toDelete = entries.slice(0, entries.length - 800);
        for (const [keyToDelete] of toDelete) {
          this.cache.delete(keyToDelete);
        }
      }
    }
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
  getCacheStats(): { size: number; totalHits: number } {
    return {
      size: this.cache.size,
      totalHits: Array.from(this.cache.values()).length,
    };
  }
}
// Экспорт единственного экземпляра
export const yandexDictionaryService = new YandexDictionaryService();
