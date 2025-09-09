/**
 * Утилиты для работы с речевым синтезом
 */
export interface SpeechConfig {
  rate?: number;
  volume?: number;
  pitch?: number;
  voice?: SpeechSynthesisVoice | null;
}
// Кэш доступных голосов
let voicesCache: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;
/**
 * Получить доступные голоса для синтеза речи
 */
export const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return resolve([]);
    }
    // Если голоса уже загружены и кэшированы, вернуть их
    if (voicesLoaded && voicesCache.length > 0) {
      return resolve(voicesCache);
    }
    // Функция, которая будет вызвана, когда голоса будут загружены
    const handleVoicesChanged = () => {
      voicesCache = window.speechSynthesis.getVoices();
      voicesLoaded = true;
      resolve(voicesCache);
    };
    // В Chrome голоса могут быть не загружены сразу
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      voicesCache = voices;
      voicesLoaded = true;
      resolve(voices);
    } else {
      // Ждем, когда голоса будут загружены
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    }
  });
};
/**
 * Получить оптимальный голос для указанного языка
 */
export const getBestVoiceForLanguage = async (
  lang: string,
): Promise<SpeechSynthesisVoice | null> => {
  const voices = await getVoices();
  // Сначала ищем голос, который точно соответствует языку и локали
  const exactMatch = voices.find(
    (voice) =>
      voice.lang.toLowerCase() === lang.toLowerCase() && voice.localService,
  );
  if (exactMatch) return exactMatch;
  // Затем ищем голос, который соответствует языку и локали (любой)
  const localeMatch = voices.find(
    (voice) => voice.lang.toLowerCase() === lang.toLowerCase(),
  );
  if (localeMatch) return localeMatch;
  // Затем ищем голос, который начинается с кода языка (например, 'de' для 'de-DE', 'de-AT', etc.)
  const langCode = lang.split("-")[0].toLowerCase();
  const langMatch = voices.find((voice) =>
    voice.lang.toLowerCase().startsWith(langCode),
  );
  if (langMatch) return langMatch;
  // Если для немецкого не нашли, проверим другие диалекты немецкого
  if (lang === "de-DE") {
    const germanDialects = voices.find(
      (voice) =>
        voice.lang.toLowerCase() === "de-at" ||
        voice.lang.toLowerCase() === "de-ch" ||
        voice.lang.toLowerCase().startsWith("de"),
    );
    if (germanDialects) return germanDialects;
  }
  // Если ничего не нашли, вернем null
  return null;
};
/**
 * Произнести текст с поддержкой различных языков
 */
export const speak = async (
  text: string,
  lang?: string,
  config: SpeechConfig = {},
): Promise<void> => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Speech synthesis не поддерживается в этом браузере");
    return;
  }
  // Добавляем небольшую паузу перед словом, чтобы предотвратить "съедание" первых букв
  // Используем невидимый пробел в начале текста
  const textWithLeadingSpace = `\u200B ${text}`;
  const utterance = new SpeechSynthesisUtterance(textWithLeadingSpace);
  // Если голос указан в конфигурации, используем его
  if (config.voice) {
    utterance.voice = config.voice;
  }
  // Иначе, если язык указан, пытаемся найти лучший голос для этого языка
  else if (lang) {
    utterance.lang = lang;
    const bestVoice = await getBestVoiceForLanguage(lang);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }
  }
  // Настройка параметров речи
  utterance.rate = config.rate !== undefined ? config.rate : 0.9; // Немного медленнее для лучшего понимания
  utterance.volume = config.volume !== undefined ? config.volume : 1;
  utterance.pitch = config.pitch !== undefined ? config.pitch : 1;
  // Мягко останавливаем предыдущую речь перед началом новой
  window.speechSynthesis.cancel();
  // Небольшая задержка перед началом речи, чтобы аудиодвижок успел инициализироваться
  await new Promise((resolve) => setTimeout(resolve, 50));
  // Начинаем говорить
  window.speechSynthesis.speak(utterance);
};
/**
 * Произнести текст на немецком языке с улучшенными параметрами
 */
export const speakGerman = async (
  text: string,
  inputConfig: SpeechConfig = {},
): Promise<void> => {
  // Если голос не указан в конфигурации, найдем оптимальный немецкий голос
  let updatedConfig = { ...inputConfig };
  if (!updatedConfig.voice) {
    const bestGermanVoice = await getBestVoiceForLanguage("de-DE");
    updatedConfig = {
      ...updatedConfig,
      voice: bestGermanVoice,
      // Оптимальные параметры для немецкого языка
      rate: updatedConfig.rate !== undefined ? updatedConfig.rate : 0.9,
      pitch: updatedConfig.pitch !== undefined ? updatedConfig.pitch : 1.05, // Немного выше для более естественного звучания
    };
  }
  await speak(text, "de-DE", updatedConfig);
};
/**
 * Произнести текст на английском языке
 */
export const speakEnglish = async (
  text: string,
  inputConfig: SpeechConfig = {},
): Promise<void> => {
  let updatedConfig = { ...inputConfig };
  if (!updatedConfig.voice) {
    const bestEnglishVoice = await getBestVoiceForLanguage("en-US");
    updatedConfig = { ...updatedConfig, voice: bestEnglishVoice };
  }
  await speak(text, "en-US", updatedConfig);
};
/**
 * Произнести текст на русском языке
 */
export const speakRussian = async (
  text: string,
  inputConfig: SpeechConfig = {},
): Promise<void> => {
  let updatedConfig = { ...inputConfig };
  if (!updatedConfig.voice) {
    const bestRussianVoice = await getBestVoiceForLanguage("ru-RU");
    updatedConfig = { ...updatedConfig, voice: bestRussianVoice };
  }
  await speak(text, "ru-RU", updatedConfig);
};
/**
 * Произнести текст в зависимости от направления перевода
 */
export const speakByLanguageDirection = async (
  originalWord: string,
  translatedWord: string,
  languageDirection: string,
  config: SpeechConfig = {},
): Promise<void> => {
  switch (languageDirection) {
    case "de-ru":
      await speakGerman(originalWord, config);
      break;
    case "ru-de":
      await speakRussian(originalWord, config);
      break;
    case "en-ru":
      await speakEnglish(originalWord, config);
      break;
    case "ru-en":
      await speakRussian(originalWord, config);
      break;
    default:
      await speak(originalWord, undefined, config);
  }
};
/**
 * Остановить воспроизведение речи
 */
export const stopSpeaking = (): void => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};
/**
 * Проверить поддержку речевого синтеза
 */
export const isSpeechSynthesisSupported = (): boolean => {
  return typeof window !== "undefined" && "speechSynthesis" in window;
};
/**
 * Получить список доступных голосов для отладки
 */
export const getAvailableVoices = async (): Promise<
  { name: string; lang: string }[]
> => {
  const voices = await getVoices();
  return voices.map((voice) => ({
    name: voice.name,
    lang: voice.lang,
  }));
};
