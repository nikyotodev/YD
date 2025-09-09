import { type NextRequest, NextResponse } from "next/server";
import {
  germanNLPService,
  type GermanWordData,
  type HomonymData,
} from "@/lib/german-nlp-service";
interface GermanWord {
  id: string;
  german: string;
  russian: string;
  pronunciation: string;
  category: string;
  difficulty: number;
  example_german: string;
  example_russian: string;
  gender?: "der" | "die" | "das";
  plural?: string;
  partOfSpeech: string;
  confidence?: number;
  sources?: string[];
  homonyms?: HomonymData[]; // Добавляем поддержку омонимов
}
interface WiktionaryResponse {
  query?: {
    pages?: {
      [key: string]: {
        title: string;
        extract?: string;
        revisions?: Array<{
          slots: {
            main: {
              "*": string;
            };
          };
        }>;
      };
    };
  };
}
// Кэш для 1.6М слов из GitHub
let germanWordsCache: string[] | null = null;
// Расширенный словарь для перевода найденных слов
const translationDictionary: Record<string, string> = {
  lieben: "любить",
  liebe: "любовь",
  liebst: "любишь",
  liebt: "любит",
  geliebt: "любимый",
  liebende: "любящие",
  liebenden: "любящих",
  liebender: "любящий",
  liebenswert: "милый, достойный любви",
  liebenswürdig: "любезный",
  verliebt: "влюблённый",
  verlieben: "влюбляться",
  liebling: "любимец, дорогой",
  liebevoll: "любящий, нежный",
  lieblos: "нелюбящий, холодный",
  lieblich: "прелестный, милый",
  ungeliebt: "нелюбимый",
  haus: "дом",
  hause: "дома",
  häuser: "дома (мн.ч.)",
  hausfrau: "домохозяйка",
  hausmann: "домохозяин",
  haustier: "домашнее животное",
  wasser: "вода",
  brot: "хлеб",
  milch: "молоко",
  käse: "сыр",
  katze: "кошка",
  kater: "кот (самец)",
  hund: "собака",
  vogel: "птица",
  sonne: "солнце",
  mond: "луна",
  stern: "звезда",
  himmel: "небо",
  erde: "земля",
  baum: "дерево",
  blume: "цветок",
  gras: "трава",
  auto: "машина",
  zug: "поезд",
  flugzeug: "самолёт",
  schiff: "корабль",
  fahrrad: "велосипед",
  rot: "красный",
  blau: "синий",
  grün: "зелёный",
  gelb: "жёлтый",
  schwarz: "чёрный",
  weiß: "белый",
  groß: "большой",
  klein: "маленький",
  gut: "хороший",
  schlecht: "плохой",
  neu: "новый",
  alt: "старый",
  jung: "молодой",
  schön: "красивый",
  hässlich: "уродливый",
  freund: "друг",
  familie: "семья",
  mutter: "мать",
  vater: "отец",
  kind: "ребёнок",
  bruder: "брат",
  schwester: "сестра",
  opa: "дедушка",
  oma: "бабушка",
  sprechen: "говорить",
  arbeiten: "работать",
  leben: "жить",
  lernen: "учиться",
  essen: "есть",
  trinken: "пить",
  schlafen: "спать",
  gehen: "идти",
  kommen: "приходить",
  sehen: "видеть",
  hören: "слышать",
  fühlen: "чувствовать",
  denken: "думать",
  wissen: "знать",
  können: "мочь, уметь",
  wollen: "хотеть",
  sollen: "должен",
  müssen: "быть вынужденным",
  dürfen: "сметь, иметь право",
  werden: "становиться",
  sein: "быть",
  haben: "иметь",
  machen: "делать",
  geben: "давать",
  nehmen: "брать",
  finden: "находить",
  sagen: "говорить, сказать",
  fragen: "спрашивать",
  antworten: "отвечать",
  verstehen: "понимать",
  erklären: "объяснять",
  zeigen: "показывать",
  helfen: "помогать",
  kaufen: "покупать",
  verkaufen: "продавать",
  bezahlen: "платить",
  kosten: "стоить",
  fahren: "ехать",
  fliegen: "летать",
  laufen: "бегать",
  schwimmen: "плавать",
  spielen: "играть",
  lesen: "читать",
  schreiben: "писать",
  rechnen: "считать",
  singen: "петь",
  tanzen: "танцевать",
  kochen: "готовить",
  putzen: "убирать",
  waschen: "мыть",
  aufstehen: "вставать",
  "sich anziehen": "одеваться",
};
// Функция для загрузки 1.6М немецких слов из GitHub
async function loadGermanWordsFromGitHub(): Promise<string[]> {
  if (germanWordsCache) {
    return germanWordsCache;
  }
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/Jonny-exe/German-Words-Library/master/German-words-1600000-words.json",
      {
        headers: {
          "User-Agent": "TalkifyApp/1.0 (Educational purposes)",
        },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const words: string[] = await response.json();
    germanWordsCache = words;
    return words;
  } catch (error) {
    console.error("❌ Ошибка при загрузке слов из GitHub:", error);
    return [];
  }
}
// Добавляем типы для возвращаемых данных
interface TranslationResult {
  word: string;
  russian: string;
  source: string;
  category: string;
  success: boolean;
}
interface WiktionaryResult {
  word: string;
  content?: Record<string, unknown>;
  success: boolean;
  error?: string;
  examples?: string[];
}
// Функция для получения перевода слова
async function getTranslation(word: string): Promise<TranslationResult | null> {
  const cleanWord = word
    .replace(/^(der|die|das)\\s+/, "")
    .trim()
    .toLowerCase();
  // Ищем точное совпадение
  if (translationDictionary[cleanWord]) {
    return {
      word: cleanWord,
      russian: translationDictionary[cleanWord],
      source: "dictionary",
      category: "Словарь",
      success: true,
    };
  }
  // Ищем частичное совпадение по корню слова
  for (const [key, value] of Object.entries(translationDictionary)) {
    if (cleanWord.includes(key) && key.length >= 3) {
      return {
        word: cleanWord,
        russian: `${value} (связано с "${key}")`,
        source: "dictionary-partial",
        category: "Словарь",
        success: true,
      };
    }
  }
  return null;
}
// Функция для получения данных из немецкого Wiktionary
async function fetchFromWiktionary(word: string): Promise<WiktionaryResult> {
  try {
    const cleanWord = word.replace(/^(der|die|das)\\s+/, "").trim();
    const response = await fetch(
      `https://de.wiktionary.org/w/api.php?action=query&format=json&prop=revisions&titles=${encodeURIComponent(cleanWord)}&rvslots=*&rvprop=content&formatversion=2&origin=*`,
      {
        headers: {
          "User-Agent": "TalkifyApp/1.0 (Educational purposes)",
        },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: WiktionaryResponse = await response.json();
    if (data.query?.pages && Object.keys(data.query.pages).length > 0) {
      const pageId = Object.keys(data.query.pages)[0];
      const page = data.query.pages[pageId];
      if (page.revisions && page.revisions.length > 0) {
        const content = page.revisions[0].slots.main["*"];
        const parsedData = parseWikitext(content, cleanWord);
        return {
          word: cleanWord,
          content: parsedData,
          success: true,
        };
      }
    }
    return {
      word: cleanWord,
      success: false,
      error: "No data found in Wiktionary",
    };
  } catch (error) {
    console.error("Wiktionary API error:", error);
    const cleanWord = word.replace(/^(der|die|das)\s+/, "").trim();
    return {
      word: cleanWord,
      success: false,
      error: "Wiktionary API error",
    };
  }
}
// Функция для парсинга Wikitext и извлечения полезной информации
function parseWikitext(wikitext: string, word: string): Partial<GermanWord> {
  const result: Partial<GermanWord> = {
    german: word,
    category: "Разное",
    difficulty: 2,
    partOfSpeech: "unknown",
  };
  // Проверяем, что wikitext не undefined и не null
  if (!wikitext || typeof wikitext !== "string") {
    console.warn(
      "parseWikitext: получен некорректный wikitext для слова:",
      word,
    );
    return result;
  }
  // Извлекаем род (der, die, das)
  const genderMatch = wikitext.match(/\{\{Substantiv\|([^}]+)\}\}/);
  if (genderMatch) {
    const genderInfo = genderMatch[1];
    if (genderInfo.includes("m")) result.gender = "der";
    else if (genderInfo.includes("f")) result.gender = "die";
    else if (genderInfo.includes("n")) result.gender = "das";
  }
  try {
    // Извлекаем произношение IPA
    const ipaMatch = wikitext.match(/\{\{IPA\}\}\s*([^,\n]+)/);
    if (ipaMatch) {
      result.pronunciation = `[${ipaMatch[1].trim()}]`;
    } else {
      result.pronunciation = `[${word}]`;
    }
    // Определяем часть речи
    if (wikitext.includes("{{Substantiv")) result.partOfSpeech = "noun";
    else if (wikitext.includes("{{Verb")) result.partOfSpeech = "verb";
    else if (wikitext.includes("{{Adjektiv")) result.partOfSpeech = "adjective";
    else if (wikitext.includes("{{Adverb")) result.partOfSpeech = "adverb";
    // Извлекаем определение
    const bedeutungMatch = wikitext.match(
      /\{\{Bedeutungen\}\}[\s\S]*?\[(\d+)\]\s*([^\n]+)/,
    );
    if (bedeutungMatch) {
      result.russian = bedeutungMatch[2]
        .replace(/\[\[([^\]]+)\]\]/g, "$1")
        .trim();
    }
    // Извлекаем примеры
    const beispielMatch = wikitext.match(
      /\{\{Beispiele\}\}[\s\S]*?\[(\d+)\]\s*([^\n]+)/,
    );
    if (beispielMatch) {
      result.example_german = beispielMatch[2]
        .replace(/\[\[([^\]]+)\]\]/g, "$1")
        .trim();
    }
  } catch (error) {
    console.error("Ошибка при парсинге wikitext для слова:", word, error);
  }
  return result;
}
// Улучшенная функция для создания GermanWord с использованием нового NLP сервиса
async function createGermanWordFromSearch(
  word: string,
  russian: string,
  source: string,
  category = "Разное",
): Promise<Omit<GermanWord, "id">> {
  try {
    // Анализируем слово через NLP сервис
    // Используем новый NLP сервис для анализа слова
    const nlpData = await germanNLPService.getWordData(word);
    // NLP анализ завершен
    // Формируем финальное слово с артиклем
    const wordWithArticle = nlpData.article
      ? `${nlpData.article} ${nlpData.word}`
      : nlpData.word;
    // Выбираем лучший пример из NLP сервиса или создаём базовый
    const germanExample =
      nlpData.examples.length > 0
        ? nlpData.examples[0]
        : `Beispiel mit "${nlpData.word}".`;
    const russianExample =
      nlpData.examples.length > 1
        ? nlpData.examples[1].replace(
            /Ich habe .+ gesehen\./,
            `Я видел ${russian}.`,
          )
        : `Пример с "${russian}".`;
    // Улучшаем русский перевод если есть омонимы
    let finalRussianTranslation = russian;
    if (nlpData.homonyms && nlpData.homonyms.length > 1) {
      const homonymMeanings = nlpData.homonyms.map((h) => h.meaning).join(", ");
      finalRussianTranslation = `${russian} (возможны значения: ${homonymMeanings})`;
    }
    const result: Omit<GermanWord, "id"> = {
      german: wordWithArticle,
      russian: finalRussianTranslation,
      pronunciation: generatePronunciation(nlpData.word),
      category: mapCategoryFromNLP(nlpData.partOfSpeech, category),
      difficulty: calculateDifficulty(nlpData.word, nlpData.confidence),
      example_german: germanExample,
      example_russian: russianExample,
      gender: nlpData.article || undefined,
      plural: nlpData.plural || "",
      partOfSpeech: nlpData.partOfSpeech,
      confidence: nlpData.confidence,
      sources: nlpData.sources,
      homonyms: nlpData.homonyms, // Передаём информацию об омонимах
    };
    // Слово успешно создано
    return result;
  } catch (error) {
    // Используем fallback при ошибке NLP
    // Fallback к старой логике
    return createFallbackGermanWord(word, russian, source, category);
  }
}
// Fallback функция (старая логика)
function createFallbackGermanWord(
  word: string,
  russian: string,
  source: string,
  category = "Разное",
): Omit<GermanWord, "id"> {
  // Определяем род из слова
  let gender: "der" | "die" | "das" | undefined;
  if (word.startsWith("der ")) gender = "der";
  else if (word.startsWith("die ")) gender = "die";
  else if (word.startsWith("das ")) gender = "das";
  const cleanWord = word.replace(/^(der|die|das)\s+/, "").trim();
  return {
    german: word,
    russian: russian,
    pronunciation: generatePronunciation(cleanWord),
    category: category,
    difficulty: 2,
    example_german: `Beispiel mit "${cleanWord}".`,
    example_russian: `Пример с "${russian}".`,
    gender: gender,
    plural: "",
    partOfSpeech: gender ? "noun" : "unknown",
    confidence: 0.3, // Низкая уверенность для fallback
    sources: ["fallback"],
  };
}
// Вспомогательные функции
function generatePronunciation(word: string): string {
  // Простая генерация произношения
  return `[${word}]`;
}
function mapCategoryFromNLP(
  partOfSpeech: string,
  fallbackCategory: string,
): string {
  const categoryMap: Record<string, string> = {
    noun: "Существительные",
    verb: "Глаголы",
    adjective: "Прилагательные",
    adverb: "Наречия",
  };
  return categoryMap[partOfSpeech] || fallbackCategory;
}
function calculateDifficulty(word: string, confidence: number): number {
  // Базовая сложность
  let difficulty = 2;
  // Длинные слова сложнее
  if (word.length > 10) difficulty = 3;
  if (word.length > 15) difficulty = 4;
  // Низкая уверенность в артикле = выше сложность
  if (confidence < 0.5) difficulty = Math.min(difficulty + 1, 5);
  return difficulty;
}
// Расширенная база популярных немецких слов (обновлена с новыми примерами)
const popularGermanWords: Omit<GermanWord, "id">[] = [
  {
    german: "das Haus",
    russian: "дом",
    pronunciation: "[das haʊs]",
    category: "Места",
    difficulty: 1,
    example_german: "Das Haus ist sehr schön und groß.",
    example_russian: "Дом очень красивый и большой.",
    gender: "das",
    plural: "die Häuser",
    partOfSpeech: "noun",
    confidence: 1.0,
    sources: ["reliable_db"],
  },
  {
    german: "die Liebe",
    russian: "любовь",
    pronunciation: "[diː ˈliːbə]",
    category: "Эмоции",
    difficulty: 2,
    example_german: "Die Liebe ist das Wichtigste im Leben.",
    example_russian: "Любовь - это самое важное в жизни.",
    gender: "die",
    plural: "",
    partOfSpeech: "noun",
    confidence: 1.0,
    sources: ["reliable_db"],
  },
  {
    german: "der Kater",
    russian: "кот (самец)",
    pronunciation: "[deːɐ̯ ˈkaːtɐ]",
    category: "Животные",
    difficulty: 1,
    example_german: "Der Kater sitzt auf dem Sofa.",
    example_russian: "Кот сидит на диване.",
    gender: "der",
    plural: "die Kater",
    partOfSpeech: "noun",
    confidence: 1.0,
    sources: ["reliable_db"],
  },
  {
    german: "die Katze",
    russian: "кошка",
    pronunciation: "[diː ˈkatsə]",
    category: "Животные",
    difficulty: 1,
    example_german: "Die Katze spielt mit dem Ball.",
    example_russian: "Кошка играет с мячиком.",
    gender: "die",
    plural: "die Katzen",
    partOfSpeech: "noun",
    confidence: 1.0,
    sources: ["reliable_db"],
  },
  {
    german: "lieben",
    russian: "любить",
    pronunciation: "[ˈliːbən]",
    category: "Глаголы",
    difficulty: 1,
    example_german: "Ich liebe dich von ganzem Herzen.",
    example_russian: "Я люблю тебя всем сердцем.",
    partOfSpeech: "verb",
    confidence: 1.0,
    sources: ["reliable_db"],
  },
  {
    german: "sprechen",
    russian: "говорить",
    pronunciation: "[ˈʃpʁɛçn̩]",
    category: "Глаголы",
    difficulty: 1,
    example_german: "Ich kann Deutsch sprechen.",
    example_russian: "Я могу говорить по-немецки.",
    partOfSpeech: "verb",
    confidence: 1.0,
    sources: ["reliable_db"],
  },
  {
    german: "schön",
    russian: "красивый",
    pronunciation: "[ʃøːn]",
    category: "Прилагательные",
    difficulty: 1,
    example_german: "Das Wetter ist heute schön.",
    example_russian: "Погода сегодня красивая.",
    partOfSpeech: "adjective",
    confidence: 1.0,
    sources: ["reliable_db"],
  },
];
// Функция для поиска слов в множественных источниках (обновлена)
async function searchInMultipleSources(
  searchTerm: string,
  category: string,
  difficulty: string,
  limit: number,
) {
  const results: Omit<GermanWord, "id">[] = [];
  // Выполняем улучшенный поиск
  // 1. Поиск в локальной базе популярных слов
  const localResults = popularGermanWords.filter((word) => {
    const matchesSearch =
      !searchTerm ||
      word.german.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.russian.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !category || category === "all" || word.category === category;
    const matchesDifficulty =
      !difficulty ||
      difficulty === "all" ||
      word.difficulty.toString() === difficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });
  results.push(...localResults);
  // Поиск в локальной базе завершен
  // 2. Если есть конкретный поисковый запрос, ищем в других источниках
  if (searchTerm && results.length < 10) {
    // Поиск в GitHub библиотеке 1.6М слов
    try {
      const githubWords = await loadGermanWordsFromGitHub();
      if (githubWords.length > 0) {
        const matchingWords = githubWords
          .filter((word) =>
            word.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .slice(0, Math.min(20, limit)); // Ограничиваем количество
        // Найдены слова в GitHub библиотеке
        for (const word of matchingWords) {
          // Попробуем найти перевод в нашем словаре
          const translation = await getTranslation(word);
          if (translation?.success) {
            const germanWord = await createGermanWordFromSearch(
              word,
              translation.russian,
              translation.source,
              translation.category,
            );
            results.push(germanWord);
          } else {
            // Добавляем без перевода, используя NLP для артикля
            const germanWord = await createGermanWordFromSearch(
              word,
              "Изучайте новые слова!",
              "github+nlp",
              "Общее",
            );
            results.push(germanWord);
          }
          if (results.length >= limit) break;
        }
      }
    } catch (error) {
      // Ошибка при поиске в GitHub библиотеке
    }
    // 3. Прямой поиск в словаре переводов с NLP анализом
    if (results.length < 5) {
      const translation = await getTranslation(searchTerm);
      if (translation?.success) {
        const germanWord = await createGermanWordFromSearch(
          translation.word,
          translation.russian,
          translation.source,
          translation.category,
        );
        results.push(germanWord);
      }
    }
    // 4. Fallback: поиск в Wiktionary с NLP анализом
    if (results.length < 3) {
      const wiktionaryResult = await fetchFromWiktionary(searchTerm);
      if (wiktionaryResult?.content) {
        const russianTranslation =
          (typeof wiktionaryResult.content === 'object' && wiktionaryResult.content?.russian) || "Перевод не найден";
        const germanWord = await createGermanWordFromSearch(
          searchTerm,
          typeof russianTranslation === 'string' ? russianTranslation : "Перевод не найден",
          "wiktionary",
          "Викисловарь",
        );
        results.push(germanWord);
      }
    }
  }
  // Поиск завершен
  // Сортируем по уверенности (если есть)
  return results
    .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
    .slice(0, limit);
}
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";
  const difficulty = searchParams.get("difficulty") || "all";
  const limit = Number.parseInt(searchParams.get("limit") || "50");
  try {
    // Выполняем API поиск
    // Ищем слова в множественных источниках с улучшенным NLP анализом
    const filteredWords = await searchInMultipleSources(
      search,
      category,
      difficulty,
      limit,
    );
    // Добавляем ID к каждому слову
    const wordsWithId: GermanWord[] = filteredWords.map((word, index) => ({
      ...word,
      id: `word_${Date.now()}_${index}`,
    }));
    // Получаем все уникальные категории
    const allCategories = Array.from(
      new Set(popularGermanWords.map((w) => w.category)),
    );
    const categories = ["all", ...allCategories.sort()];
    // Поиск успешно завершен
    // Статистика по источникам для отладки
    const sourcesStats = wordsWithId.reduce(
      (acc, word) => {
        if (word.sources) {
          for (const source of word.sources) {
            acc[source] = (acc[source] || 0) + 1;
          }
        }
        return acc;
      },
      {} as Record<string, number>,
    );
    // Статистика по омонимам
    const homonymsStats = {
      totalWords: wordsWithId.length,
      wordsWithHomonyms: wordsWithId.filter(
        (w) => w.homonyms && w.homonyms.length > 0,
      ).length,
      totalHomonyms: wordsWithId.reduce(
        (sum, w) => sum + (w.homonyms?.length || 0),
        0,
      ),
    };
    // Статистика обработана
    return NextResponse.json({
      words: wordsWithId,
      categories,
      total: filteredWords.length,
      success: true,
      source: "multiple-sources-with-advanced-nlp",
      nlp_stats: sourcesStats,
      homonyms_stats: homonymsStats,
    });
  } catch (error) {
    // API Error
    return NextResponse.json(
      { error: "Failed to fetch words", success: false },
      { status: 500 },
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const { word } = await request.json();
    if (!word) {
      return NextResponse.json(
        { error: "Word parameter is required", success: false },
        { status: 400 },
      );
    }
    // Ищем в множественных источниках с NLP анализом
    const results = await searchInMultipleSources(word, "all", "all", 1);
    if (results.length > 0) {
      const foundWord = {
        ...results[0],
        id: `search_${Date.now()}`,
        success: true,
      };
      // Выводим подробную информацию об омонимах, если они есть
      let logMessage = `✅ Найдено слово: ${foundWord.german} - ${foundWord.russian} (confidence: ${foundWord.confidence})`;
      if (foundWord.homonyms && foundWord.homonyms.length > 0) {
        const homonymsList = foundWord.homonyms
          .map((h) => `${h.article} - ${h.meaning}`)
          .join(", ");
        logMessage += ` | Омонимы: ${homonymsList}`;
      }
      return NextResponse.json(foundWord);
    }
    return NextResponse.json(
      { error: "Word not found", success: false },
      { status: 404 },
    );
  } catch (error) {
    console.error("❌ Search API Error:", error);
    return NextResponse.json(
      { error: "Failed to search word", success: false },
      { status: 500 },
    );
  }
}
// Добавляем новый endpoint для получения информации об омонимах
export async function PUT(request: NextRequest) {
  try {
    const { word } = await request.json();
    if (!word) {
      return NextResponse.json(
        { error: "Word parameter is required", success: false },
        { status: 400 },
      );
    }
    // Получаем информацию об омонимах
    const homonyms = germanNLPService.getHomonymsInfo(word);
    if (homonyms.length > 0) {
      return NextResponse.json({
        word,
        homonyms,
        success: true,
        count: homonyms.length,
      });
    }
    return NextResponse.json({
      word,
      homonyms: [],
      success: true,
      count: 0,
    });
  } catch (error) {
    console.error("❌ Homonyms API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch homonyms", success: false },
      { status: 500 },
    );
  }
}
