/**
 * Wiktionary API Service
 * Полноценная интеграция с Wiktionary для получения богатых лингвистических данных
 */
export interface WiktionaryEntry {
  title: string;
  language: string;
  definitions: WiktionaryDefinition[];
  etymology?: string;
  pronunciation?: WiktionaryPronunciation;
  grammaticalInfo?: GrammaticalInfo;
  inflection?: InflectionInfo;
  translations?: Translation[];
  synonyms?: string[];
  antonyms?: string[];
  examples?: ExampleSentence[];
}
export interface WiktionaryDefinition {
  partOfSpeech: string;
  senses: WiktionarySense[];
}
export interface WiktionarySense {
  definition: string;
  examples?: string[];
  synonyms?: string[];
  antonyms?: string[];
  context?: string; // формальный, разговорный, устаревший и т.д.
  level?: string; // A1, A2, B1, B2, C1, C2
}
export interface WiktionaryPronunciation {
  ipa?: string;
  audioFiles?: string[];
  rhymes?: string[];
  syllables?: string[];
}
export interface GrammaticalInfo {
  gender?: "masculine" | "feminine" | "neuter";
  article?: "der" | "die" | "das";
  plural?: string;
  comparative?: string;
  superlative?: string;
  auxiliaryVerb?: "haben" | "sein";
}
export interface InflectionInfo {
  verbConjugation?: VerbConjugation;
  nounDeclension?: NounDeclension;
  adjectiveDeclension?: AdjectiveDeclension;
}
export interface VerbConjugation {
  infinitive: string;
  present: PersonalForms;
  preterite: PersonalForms;
  perfect: string;
  imperative: {
    du: string;
    ihr: string;
    Sie: string;
  };
  participles: {
    present: string;
    past: string;
  };
}
export interface PersonalForms {
  ich: string;
  du: string;
  er_sie_es: string;
  wir: string;
  ihr: string;
  sie_Sie: string;
}
export interface NounDeclension {
  nominative: { singular: string; plural: string };
  accusative: { singular: string; plural: string };
  dative: { singular: string; plural: string };
  genitive: { singular: string; plural: string };
}
export interface AdjectiveDeclension {
  positive: string;
  comparative: string;
  superlative: string;
}
export interface Translation {
  language: string;
  text: string;
  gender?: string;
  notes?: string;
}
export interface ExampleSentence {
  text: string;
  translation?: string;
  source?: string;
  level?: string;
}
/**
 * Основной класс для работы с Wiktionary API
 */
export class WiktionaryService {
  private readonly baseUrl = "https://en.wiktionary.org/w/api.php";
  private readonly deWiktionaryUrl = "https://de.wiktionary.org/w/api.php";
  private readonly ruWiktionaryUrl = "https://ru.wiktionary.org/w/api.php";
  private cache = new Map<string, WiktionaryEntry>();
  private readonly userAgent =
    "TalkifyApp/1.0 (https://talkify.app; educational purpose)";
  /**
   * Поиск слова в Wiktionary
   */
  async searchWord(
    word: string,
    language: "en" | "de" | "ru" = "en",
  ): Promise<WiktionaryEntry | null> {
    const cacheKey = `${language}:${word.toLowerCase()}`;
    // Проверяем кеш
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }
    try {
      const baseUrl = this.getBaseUrl(language);
      const pageContent = await this.getPageContent(word, baseUrl);
      if (!pageContent) {
        return null;
      }
      const entry = await this.parseWikitext(pageContent, word, language);
      // Кешируем результат
      if (entry) {
        this.cache.set(cacheKey, entry);
      }
      return entry;
    } catch (error) {
      console.error("Ошибка поиска в Wiktionary:", error);
      return null;
    }
  }
  /**
   * Получение содержимого страницы из Wiktionary
   */
  private async getPageContent(
    title: string,
    baseUrl: string,
  ): Promise<string | null> {
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      titles: title,
      prop: "revisions",
      rvprop: "content",
      rvlimit: "1",
      origin: "*",
    });
    const url = `${baseUrl}?${params}`;
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": this.userAgent,
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      const pages = data.query?.pages || {};
      const pageId = Object.keys(pages)[0];
      if (pageId === "-1") {
        return null; // Страница не найдена
      }
      const page = pages[pageId];
      const content = page?.revisions?.[0]?.["*"];
      return content || null;
    } catch (error) {
      console.error("Ошибка загрузки страницы Wiktionary:", error);
      return null;
    }
  }
  /**
   * Получение аудиофайлов произношения
   */
  private async getPronunciationAudio(
    word: string,
    language: string,
  ): Promise<string[]> {
    const baseUrl = this.getBaseUrl(language as "en" | "de" | "ru");
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      titles: `File:${language}-${word}.ogg`,
      prop: "imageinfo",
      iiprop: "url",
      origin: "*",
    });
    try {
      const response = await fetch(`${baseUrl}?${params}`, {
        headers: { "User-Agent": this.userAgent },
      });
      const data = await response.json();
      const pages = data.query?.pages || {};
      const audioFiles: string[] = [];
      for (const page of Object.values(pages) as WikiPage[]) {
        if (page.imageinfo?.[0]?.url) {
          audioFiles.push(page.imageinfo[0].url);
        }
      }
      return audioFiles;
    } catch (error) {
      console.error("Ошибка загрузки аудио:", error);
      return [];
    }
  }
  /**
   * Парсинг викитекста и извлечение структурированных данных
   */
  private async parseWikitext(
    wikitext: string,
    word: string,
    language: string,
  ): Promise<WiktionaryEntry | null> {
    if (!wikitext || typeof wikitext !== "string") {
      return null;
    }
    const entry: WiktionaryEntry = {
      title: word,
      language,
      definitions: [],
      pronunciation: {},
      grammaticalInfo: {},
      examples: [],
    };
    try {
      // Извлечение этимологии
      entry.etymology = this.extractEtymology(wikitext);
      // Извлечение произношения
      entry.pronunciation = await this.extractPronunciation(
        wikitext,
        word,
        language,
      );
      // Извлечение определений по частям речи
      entry.definitions = this.extractDefinitions(wikitext);
      // Извлечение грамматической информации
      entry.grammaticalInfo = this.extractGrammaticalInfo(wikitext, word);
      // Извлечение спряжений/склонений
      entry.inflection = this.extractInflection(wikitext);
      // Извлечение переводов
      entry.translations = this.extractTranslations(wikitext);
      // Извлечение синонимов и антонимов
      const synonymsAntonyms = this.extractSynonymsAntonyms(wikitext);
      entry.synonyms = synonymsAntonyms.synonyms;
      entry.antonyms = synonymsAntonyms.antonyms;
      // Извлечение примеров
      entry.examples = this.extractExamples(wikitext);
      if (entry.definitions.length > 0) {
        return entry;
      }
      return null;
    } catch (error) {
      console.error("Ошибка парсинга викитекста:", error);
      return null;
    }
  }
  /**
   * Извлечение этимологии
   */
  private extractEtymology(wikitext: string): string | undefined {
    const etymologyMatch = wikitext.match(/==Etymology==\s*\n(.*?)(?=\n==|$)/s);
    if (etymologyMatch) {
      let etymology = etymologyMatch[1];
      // Дополнительная очистка для этимологии
      etymology = etymology
        .replace(/\{\{Wortart\|[^}]+\}\}/g, "") // Убираем шаблоны частей речи
        .replace(/\{\{[^}]+\}\}/g, "") // Убираем все остальные шаблоны
        .replace(/<ref[^>]*>.*?<\/ref>/gi, "") // Убираем референсы
        .replace(/<ref[^>]*\/>/gi, "") // Убираем пустые референсы
        .replace(/<[^>]+>/g, "") // Убираем все HTML теги
        .replace(/\s*;\s*/g, ". ") // Заменяем точки с запятой на точки
        .replace(/\s+/g, " ") // Убираем множественные пробелы
        .trim();
      return etymology ? this.cleanWikitext(etymology) : undefined;
    }
    return undefined;
  }
  /**
   * Извлечение информации о произношении
   */
  private async extractPronunciation(
    wikitext: string,
    word: string,
    language: string,
  ): Promise<WiktionaryPronunciation> {
    const pronunciation: WiktionaryPronunciation = {};
    // IPA
    const ipaMatch = wikitext.match(/\{\{IPA\|([^}]+)\}\}/);
    if (ipaMatch) {
      pronunciation.ipa = ipaMatch[1].replace(/\|.*/, "").trim();
    }
    // Аудиофайлы
    pronunciation.audioFiles = await this.getPronunciationAudio(word, language);
    // Рифмы
    const rhymeMatch = wikitext.match(/\{\{rhymes\|([^}]+)\}\}/);
    if (rhymeMatch) {
      pronunciation.rhymes = [rhymeMatch[1].trim()];
    }
    return pronunciation;
  }
  /**
   * Извлечение определений по частям речи
   */
  private extractDefinitions(wikitext: string): WiktionaryDefinition[] {
    const definitions: WiktionaryDefinition[] = [];
    // Поддержка разных уровней заголовков для разных языковых версий Wiktionary
    const sections = wikitext.split(/(?=\n===?=?[^=].*?===?=?)/g);
    for (const section of sections) {
      // Поиск заголовков уровня 3 (===) и 4 (====)
      const posMatch = section.match(/===?=?([^=]+)===?=?/);
      if (!posMatch) {
        continue;
      }
      let partOfSpeech = posMatch[1].trim();
      // Очистка заголовков частей речи от шаблонов
      partOfSpeech = partOfSpeech
        .replace(/\{\{Wortart\|([^|]+)\|[^}]+\}\}/g, "$1") // {{Wortart|Kontraktion|Deutsch}} -> Kontraktion
        .replace(/\{\{Sprache\|[^}]+\}\}/g, "") // Убираем {{Sprache|Deutsch}}
        .replace(/\{\{[^}]+\}\}/g, "") // Убираем остальные шаблоны
        .replace(/\([^)]*\)/g, "") // Убираем скобки
        .trim();
      const senses = this.extractSenses(section);
      if (senses.length > 0) {
        definitions.push({ partOfSpeech, senses });
      }
    }
    return definitions;
  }
  /**
   * Извлечение значений (смыслов) слова
   */
  private extractSenses(sectionText: string): WiktionarySense[] {
    const senses: WiktionarySense[] = [];
    const lines = sectionText.split("\n");
    for (const line of lines) {
      // Поддержка английского формата (#), немецкого формата [1], [2] и формата с двоеточием :[1]
      if (
        line.match(/^#+\s/) ||
        line.match(/^\s*\[\d+\]\s/) ||
        line.match(/^\s*:\[\d+\]\s/)
      ) {
        let definition = line
          .replace(/^#+\s/, "") // Убираем # в начале
          .replace(/^\s*\[\d+\]\s/, "") // Убираем [1], [2] в начале
          .replace(/^\s*:\[\d+\]\s/, ""); // Убираем :[1], :[2] в начале
        // Дополнительная очистка определений
        definition = definition
          .replace(/\{\{Wortart\|[^}]+\}\}/g, "") // Убираем шаблоны частей речи
          .replace(/\{\{[mf]+\}\}/g, "") // Убираем маркеры рода
          .replace(/\{\{[^}]+\}\}/g, "") // Убираем все шаблоны
          .replace(/<[^>]+>/g, "") // Убираем HTML теги
          .replace(/\[\[([^\]]+)\]\]/g, "$1") // Убираем внутренние ссылки
          .trim();
        definition = this.cleanWikitext(definition).trim();
        if (definition && definition.length > 3) {
          senses.push({
            definition,
            examples: this.extractExamplesFromLine(line),
            context: this.extractContext(line),
          });
        }
      }
    }
    return senses;
  }
  /**
   * Извлечение грамматической информации
   */
  private extractGrammaticalInfo(
    wikitext: string,
    word: string,
  ): GrammaticalInfo {
    const info: GrammaticalInfo = {};
    // Род существительного - множество вариантов поиска
    let gender = null;
    // Паттерн 1: {{g|n}} или {{m|m}}
    let genderMatch = wikitext.match(/\{\{[gm]\|([mfn])\}\}/);
    if (genderMatch) {
      gender = genderMatch[1];
    }
    // Паттерн 2: {{de-noun|n|...}} - род в первом параметре
    if (!gender) {
      genderMatch = wikitext.match(/\{\{de-noun\|([mfn])\|/);
      if (genderMatch) {
        gender = genderMatch[1];
      }
    }
    // Паттерн 3: {{Wortart|Substantiv|Deutsch}} с {{Genus|n}}
    if (!gender) {
      genderMatch = wikitext.match(/\{\{Genus\|([mfn])\}\}/);
      if (genderMatch) {
        gender = genderMatch[1];
      }
    }
    // Паттерн 4: das/der/die в начале определения
    if (!gender) {
      genderMatch = wikitext.match(/^.*?(das|der|die)\s+\w/m);
      if (genderMatch) {
        const article = genderMatch[1];
        gender = article === "der" ? "m" : article === "die" ? "f" : "n";
      }
    }
    // Если род не найден в викитексте, используем экспертную систему
    if (!gender) {
      try {
        // Импортируем детектор артиклей динамически
        const { germanArticleDetector } = require("./german-article-detector");
        const detection = germanArticleDetector.detectArticle(word);
        if (detection) {
          // Используем результат только если уверенность высокая
          if (detection.confidence >= 70) {
            info.article = detection.article;
            info.gender = germanArticleDetector.getGender(detection.article);
          }
        }
      } catch (error) {
        console.error("Ошибка при определении артикля:", error);
      }
    } else {
      // Используем результат из викитекста
      info.gender =
        gender === "m" ? "masculine" : gender === "f" ? "feminine" : "neuter";
      info.article = gender === "m" ? "der" : gender === "f" ? "die" : "das";
    }
    // Множественное число
    const pluralMatch = wikitext.match(/\{\{de-noun\|[^|]*\|([^}]+)\}\}/);
    if (pluralMatch) {
      info.plural = pluralMatch[1].trim();
    }
    // Сравнительная и превосходная степени
    const adjMatch = wikitext.match(/\{\{de-adj\|([^|]*)\|([^}]*)\}\}/);
    if (adjMatch) {
      info.comparative = adjMatch[1] || undefined;
      info.superlative = adjMatch[2] || undefined;
    }
    return info;
  }
  /**
   * Извлечение склонений и спряжений
   */
  private extractInflection(wikitext: string): InflectionInfo | undefined {
    const inflection: InflectionInfo = {};
    // Спряжения глаголов
    if (wikitext.includes("{{de-conj")) {
      inflection.verbConjugation = this.extractVerbConjugation(wikitext);
    }
    // Склонения существительных
    if (wikitext.includes("{{de-decl")) {
      inflection.nounDeclension = this.extractNounDeclension(wikitext);
    }
    return Object.keys(inflection).length > 0 ? inflection : undefined;
  }
  /**
   * Извлечение спряжений глаголов
   */
  private extractVerbConjugation(
    wikitext: string,
  ): VerbConjugation | undefined {
    // Упрощенная версия - в реальности нужен более сложный парсер
    const conjMatch = wikitext.match(/\{\{de-conj([^}]+)\}\}/);
    if (!conjMatch) return undefined;
    // Здесь должна быть логика парсинга шаблона спряжения
    // Возвращаем базовую структуру
    return {
      infinitive: "",
      present: {
        ich: "",
        du: "",
        er_sie_es: "",
        wir: "",
        ihr: "",
        sie_Sie: "",
      },
      preterite: {
        ich: "",
        du: "",
        er_sie_es: "",
        wir: "",
        ihr: "",
        sie_Sie: "",
      },
      perfect: "",
      imperative: { du: "", ihr: "", Sie: "" },
      participles: { present: "", past: "" },
    };
  }
  /**
   * Извлечение склонений существительных
   */
  private extractNounDeclension(wikitext: string): NounDeclension | undefined {
    // Упрощенная версия
    return {
      nominative: { singular: "", plural: "" },
      accusative: { singular: "", plural: "" },
      dative: { singular: "", plural: "" },
      genitive: { singular: "", plural: "" },
    };
  }
  /**
   * Извлечение переводов
   */
  private extractTranslations(wikitext: string): Translation[] {
    const translations: Translation[] = [];
    const transSection = wikitext.match(
      /====Translations====\s*\n(.*?)(?=\n====|$)/s,
    );
    if (transSection) {
      const lines = transSection[1].split("\n");
      for (const line of lines) {
        const match = line.match(/\*\s*([^:]+):\s*(.+)/);
        if (match) {
          const language = match[1].trim();
          const text = this.cleanWikitext(match[2]).trim();
          translations.push({ language, text });
        }
      }
    }
    return translations;
  }
  /**
   * Извлечение синонимов и антонимов
   */
  private extractSynonymsAntonyms(wikitext: string): {
    synonyms: string[];
    antonyms: string[];
  } {
    const synonyms: string[] = [];
    const antonyms: string[] = [];
    // Синонимы - поддержка разных языков
    let synSection = wikitext.match(
      /====\s*(Synonyms?|Синонимы)\s*====\s*\n(.*?)(?=\n====|$)/s,
    );
    if (!synSection) {
      // Немецкие заголовки
      synSection = wikitext.match(
        /===\s*(Synonyme?)\s*===\s*\n(.*?)(?=\n===|$)/s,
      );
    }
    if (synSection) {
      const content = synSection[2] || synSection[1];
      // Ищем слова в двойных квадратных скобках [[слово]]
      const matches = content.match(/\[\[([^\]|]+)(\|[^\]]+)?\]\]/g);
      if (matches) {
        synonyms.push(
          ...matches
            .map((m) => {
              const match = m.match(/\[\[([^\]|]+)/);
              return match ? match[1] : "";
            })
            .filter((s) => s.length > 0),
        );
      }
      // Также ищем простые слова через запятую (после очистки шаблонов)
      const cleanContent = this.cleanWikitext(content);
      if (cleanContent && cleanContent.length > 0) {
        const simpleWords = cleanContent
          .split(/[,;]\s*/)
          .filter(
            (word) =>
              word.trim().length > 0 &&
              !word.includes("{{") &&
              !word.includes("|") &&
              word.length < 50,
          );
        synonyms.push(...simpleWords.map((w) => w.trim()));
      }
    }
    // Антонимы - аналогично
    let antSection = wikitext.match(
      /====\s*(Antonyms?|Антонимы)\s*====\s*\n(.*?)(?=\n====|$)/s,
    );
    if (!antSection) {
      antSection = wikitext.match(
        /===\s*(Antonyme?)\s*===\s*\n(.*?)(?=\n===|$)/s,
      );
    }
    if (antSection) {
      const content = antSection[2] || antSection[1];
      const matches = content.match(/\[\[([^\]|]+)(\|[^\]]+)?\]\]/g);
      if (matches) {
        antonyms.push(
          ...matches
            .map((m) => {
              const match = m.match(/\[\[([^\]|]+)/);
              return match ? match[1] : "";
            })
            .filter((s) => s.length > 0),
        );
      }
    }
    return {
      synonyms: [...new Set(synonyms)], // Убираем дубликаты
      antonyms: [...new Set(antonyms)],
    };
  }
  /**
   * Извлечение примеров предложений
   */
  private extractExamples(wikitext: string): ExampleSentence[] {
    const examples: ExampleSentence[] = [];
    const exampleMatches = wikitext.match(
      /\{\{ux\|[^|]+\|([^|]+)\|([^}]*)\}\}/g,
    );
    if (exampleMatches) {
      for (const match of exampleMatches) {
        const parts = match.match(/\{\{ux\|[^|]+\|([^|]+)\|([^}]*)\}\}/);
        if (parts) {
          examples.push({
            text: parts[1].trim(),
            translation: parts[2]?.trim() || undefined,
          });
        }
      }
    }
    return examples;
  }
  /**
   * Вспомогательные методы
   */
  private getBaseUrl(language: "en" | "de" | "ru"): string {
    switch (language) {
      case "de":
        return this.deWiktionaryUrl;
      case "ru":
        return this.ruWiktionaryUrl;
      default:
        return this.baseUrl;
    }
  }
  private cleanWikitext(text: string): string {
    return text
      .replace(/\[\[([^\]|]+)(\|[^\]]+)?\]\]/g, "$1") // Убираем ссылки, оставляем текст
      .replace(/\{\{[^|}]+\|([^}]*)\}\}/g, "$1") // Убираем шаблоны, но сохраняем содержимое после |
      .replace(/\{\{Beispiele\}\}/g, "") // Убираем заголовки примеров
      .replace(/\{\{Unterbegriffe\}\}/g, "") // Убираем заголовки подтем
      .replace(/\{\{Oberbegriffe\}\}/g, "") // Убираем заголовки общих понятий
      .replace(/\{\{Synonyme\}\}/g, "") // Убираем заголовки синонимов
      .replace(/\{\{[^}]+\}\}/g, "") // Убираем оставшиеся шаблоны
      .replace(/'''([^']+)'''/g, "$1") // Убираем жирный
      .replace(/''([^']+)''/g, "$1") // Убираем курсив
      .replace(/<!--.*?-->/g, "") // Убираем комментарии
      .replace(/<ref[^>]*>.*?<\/ref>/g, "") // Убираем референсы
      .replace(/<ref[^>]*\/>/g, "") // Убираем пустые референсы
      .replace(/<sup[^>]*>.*?<\/sup>/g, "") // Убираем верхние индексы
      .replace(/<sub[^>]*>.*?<\/sub>/g, "") // Убираем нижние индексы
      .replace(/<small[^>]*>.*?<\/small>/g, "") // Убираем маленький текст
      .replace(/\|перевод=.*?\}\}/g, "") // Убираем остатки переводов
      .replace(/\}\}/g, "") // Убираем оставшиеся закрывающие скобки
      .replace(/\n+/g, " ") // Заменяем переносы строк
      .replace(/\s+/g, " ") // Убираем множественные пробелы
      .trim();
  }
  private extractExamplesFromLine(line: string): string[] {
    const examples: string[] = [];
    const exampleMatches = line.match(/\{\{ux\|[^|]+\|([^}]+)\}\}/g);
    if (exampleMatches) {
      for (const match of exampleMatches) {
        const content = match.match(/\{\{ux\|[^|]+\|([^}]+)\}\}/);
        if (content) {
          examples.push(this.cleanWikitext(content[1]));
        }
      }
    }
    return examples;
  }
  private extractContext(line: string): string | undefined {
    const contextMatch = line.match(
      /\{\{(formal|informal|archaic|obsolete|slang|colloquial)\}\}/,
    );
    return contextMatch ? contextMatch[1] : undefined;
  }
}
// Define interface for page object
interface WikiPage {
  imageinfo?: Array<{
    url?: string;
  }>;
}
// Экспорт экземпляра сервиса
export const wiktionaryService = new WiktionaryService();
