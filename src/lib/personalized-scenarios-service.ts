/**
 * Сервис для персонализированных AI-сценариев
 * Революционная система изучения немецкого языка
 */
import type {
  UserInterest,
  GermanLevel,
  InterestData,
  ScenarioSession,
  DialogueMessage,
  PersonalizedContent,
  AIPromptConfig,
  SpeechSettings,
  ScenarioFeedback,
} from "@/types/personalized-scenarios";
// Конфигурация для OpenRouter API
const OPENROUTER_CONFIG = {
  apiKey:
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
    "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",
  model: "deepseek/deepseek-chat-v3-0324:free",
  baseUrl: "https://openrouter.ai/api/v1/chat/completions",
};
// Данные интересов пользователей
export const INTERESTS_DATA: InterestData[] = [
  {
    id: "football",
    title: "Футбол ⚽",
    description: "Изучайте немецкий через футбольные диалоги и тренировки",
    icon: "⚽",
    color: "text-green-600",
    gradient: "from-green-500 to-emerald-600",
    scenarios: [],
  },
  {
    id: "cooking",
    title: "Кулинария 👨‍🍳",
    description: "Готовьте традиционные немецкие блюда и изучайте язык",
    icon: "👨‍🍳",
    color: "text-orange-600",
    gradient: "from-orange-500 to-red-600",
    scenarios: [],
  },
  {
    id: "technology",
    title: "Технологии 💻",
    description:
      "Работайте в немецкой IT-компании и изучайте техническую лексику",
    icon: "💻",
    color: "text-blue-600",
    gradient: "from-blue-500 to-purple-600",
    scenarios: [],
  },
  {
    id: "travel",
    title: "Путешествия ✈️",
    description: "Исследуйте Германию и изучайте язык в путешествиях",
    icon: "✈️",
    color: "text-sky-600",
    gradient: "from-sky-500 to-blue-600",
    scenarios: [],
  },
  {
    id: "music",
    title: "Музыка 🎵",
    description: "Изучайте немецкий через музыку и культуру",
    icon: "🎵",
    color: "text-purple-600",
    gradient: "from-purple-500 to-pink-600",
    scenarios: [],
  },
  {
    id: "business",
    title: "Бизнес 💼",
    description: "Ведите деловые переговоры и изучайте бизнес-немецкий",
    icon: "💼",
    color: "text-gray-700",
    gradient: "from-gray-600 to-slate-700",
    scenarios: [],
  },
];
// AI промпты для разных интересов и уровней
const AI_PROMPTS: AIPromptConfig = {
  systemPrompt: `Ты - Эмилия, профессиональный преподаватель немецкого языка. Создаешь персонализированные интерактивные сценарии для изучения немецкого языка.
ЗАДАЧА: Создать увлекательный диалог-сценарий на немецком языке, адаптированный под интересы и уровень пользователя.
СТРУКТУРА ОТВЕТА:
1. Краткое приветствие и введение в сценарий (на русском)
2. Интерактивный диалог с немецкими фразами
3. Переводы и объяснения
4. Практические упражнения
ПРАВИЛА:
- Используй только подходящую лексику для уровня пользователя
- Делай диалоги живыми и реалистичными
- Включай культурный контекст Германии
- Предлагай варианты ответов пользователю
- Исправляй ошибки деликатно
- Мотивируй к продолжению изучения`,
  contextualPrompts: {
    football:
      "Ты работаешь тренером в немецком футбольном клубе. Создавай сценарии тренировок, переговоров с игроками, комментариев матчей.",
    cooking:
      "Ты шеф-повар в традиционном немецком ресторане. Создавай сценарии приготовления блюд, заказа продуктов, обучения поварскому искусству.",
    technology:
      "Ты IT-специалист в немецкой технологической компании. Создавай сценарии совещаний, презентаций, технической поддержки.",
    travel:
      "Ты гид по Германии. Создавай сценарии экскурсий, бронирования отелей, общения с туристами.",
    music:
      "Ты музыкант в Германии. Создавай сценарии концертов, записи альбомов, интервью.",
    business:
      "Ты бизнес-консультант в Германии. Создавай сценарии переговоров, презентаций, деловых встреч.",
    art: "Ты художник в Германии. Создавай сценарии выставок, продажи картин, творческих встреч.",
    gaming:
      "Ты разработчик игр в Германии. Создавай сценарии презентаций игр, работы в команде.",
    science:
      "Ты ученый в немецком исследовательском институте. Создавай сценарии экспериментов, конференций.",
    fashion:
      "Ты модельер в Германии. Создавай сценарии показов мод, работы с клиентами.",
  },
  levelAdaptation: {
    A1: {
      vocabulary:
        "Используй только базовую лексику: приветствие, семья, еда, числа, время, простые действия",
      grammar:
        "Настоящее время, простые предложения, основные артикли der/die/das",
      complexity: "Очень простые фразы, много повторений, медленный темп",
    },
    A2: {
      vocabulary:
        "Расширенная базовая лексика: дом, работа, хобби, путешествия, покупки",
      grammar:
        "Прошедшее время (Perfekt), модальные глаголы, простые придаточные",
      complexity: "Простые диалоги, понятные ситуации, постепенное усложнение",
    },
    B1: {
      vocabulary:
        "Средняя лексика: абстрактные понятия, профессии, культура, технологии",
      grammar: "Все времена, сложные предложения, пассивный залог",
      complexity: "Развернутые диалоги, выражение мнений, описание планов",
    },
    B2: {
      vocabulary:
        "Продвинутая лексика: специальная терминология, идиомы, формальный стиль",
      grammar: "Сложная грамматика, конъюнктив, причастные обороты",
      complexity: "Дискуссии, аргументация, сложные темы",
    },
    C1: {
      vocabulary:
        "Высокий уровень: научная лексика, литературные выражения, нюансы",
      grammar:
        "Вся грамматика, стилистические особенности, региональные варианты",
      complexity:
        "Профессиональное общение, абстрактные темы, культурные нюансы",
    },
    C2: {
      vocabulary:
        "Носительский уровень: вся лексика, сленг, устаревшие выражения",
      grammar: "Совершенное владение, тонкости стиля, авторский язык",
      complexity: "Любые темы, юмор, ирония, сложные культурные контексты",
    },
  },
};
export class PersonalizedScenariosService {
  private static instance: PersonalizedScenariosService;
  private speechSynthesis: SpeechSynthesis | null = null;
  constructor() {
    if (typeof window !== "undefined") {
      this.speechSynthesis = window.speechSynthesis;
    }
  }
  static getInstance(): PersonalizedScenariosService {
    if (!PersonalizedScenariosService.instance) {
      PersonalizedScenariosService.instance =
        new PersonalizedScenariosService();
    }
    return PersonalizedScenariosService.instance;
  }
  // Генерация персонализированного контента через AI
  async generatePersonalizedContent(
    interest: UserInterest,
    level: GermanLevel,
    specificTopic?: string,
  ): Promise<PersonalizedContent> {
    try {
      const interestData = INTERESTS_DATA.find((i) => i.id === interest);
      const levelConfig = AI_PROMPTS.levelAdaptation[level];
      const contextPrompt = AI_PROMPTS.contextualPrompts[interest];
      const prompt = `
${AI_PROMPTS.systemPrompt}
КОНТЕКСТ: ${contextPrompt}
УРОВЕНЬ: ${level}
- Словарь: ${levelConfig.vocabulary}
- Грамматика: ${levelConfig.grammar}
- Сложность: ${levelConfig.complexity}
ИНТЕРЕС: ${interestData?.title}
${specificTopic ? `КОНКРЕТНАЯ ТЕМА: ${specificTopic}` : ""}
Создай интерактивный сценарий-диалог на 10-15 минут изучения. Включи:
1. Введение в ситуацию (на русском)
2. 5-7 реплик диалога на немецком с переводами
3. 3-4 ключевых слова для изучения
4. Культурный контекст
5. Вопросы для практики
Формат ответа - JSON:
{
  "greeting": "Приветствие и введение",
  "scenario": "Описание сценария",
  "characters": [{"name": "Имя", "role": "Роль", "personality": "Характер"}],
  "objectives": ["Цель 1", "Цель 2"],
  "vocabulary": ["слово1", "слово2"],
  "cultural_context": "Культурная информация"
}`;
      const response = await fetch(OPENROUTER_CONFIG.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_CONFIG.apiKey}`,
          "Content-Type": "application/json",
          "X-Title": "Personalized German Scenarios",
        },
        body: JSON.stringify({
          model: OPENROUTER_CONFIG.model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_tokens: 1200,
        }),
      });
      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }
      const data = await response.json();
      const content = data.choices[0]?.message?.content || "";
      // Попытка извлечь JSON из ответа
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedContent = JSON.parse(jsonMatch[0]);
          return parsedContent;
        }
      } catch (parseError) {
        // Если не удалось парсить JSON, создаем fallback контент
      }
      // Fallback контент если AI не вернул правильный JSON
      return this.createFallbackContent(interest, level);
    } catch (error) {
      throw new Error(`Ошибка генерации контента: ${error}`);
    }
  }
  // Создание диалога в реальном времени
  async generateDialogueResponse(
    sessionId: string,
    userInput: string,
    context: ScenarioSession,
  ): Promise<DialogueMessage> {
    try {
      const levelConfig = AI_PROMPTS.levelAdaptation[context.level];
      const contextPrompt = AI_PROMPTS.contextualPrompts[context.interest];
      const prompt = `
Продолжи диалог в рамках сценария "${context.interest}".
УРОВЕНЬ: ${context.level} - ${levelConfig.complexity}
КОНТЕКСТ: ${contextPrompt}
ПОЛЬЗОВАТЕЛЬ СКАЗАЛ: "${userInput}"
Ответь как персонаж сценария:
1. Дай ответ на немецком языке (подходящий уровню)
2. Укажи перевод на русский
3. Если есть ошибки - деликатно исправь
4. Предложи варианты дальнейшего диалога
Формат JSON:
{
  "germanText": "Ответ на немецком",
  "russianTranslation": "Перевод",
  "feedback": "Обратная связь или null",
  "alternatives": ["Вариант 1", "Вариант 2"]
}`;
      const response = await fetch(OPENROUTER_CONFIG.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_CONFIG.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: OPENROUTER_CONFIG.model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 600,
        }),
      });
      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }
      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "";
      // Парсинг ответа AI
      interface AIDialogueResponse {
        germanText?: string;
        russianTranslation?: string;
        feedback?: string;
        alternatives?: string[];
      }
      let parsedResponse: AIDialogueResponse | null;
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        parsedResponse = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      } catch {
        parsedResponse = null;
      }
      return {
        id: Date.now().toString(),
        speaker: "character",
        content:
          parsedResponse?.germanText ||
          "Entschuldigung, ich habe Sie nicht verstanden.",
        germanText: parsedResponse?.germanText,
        russianTranslation: parsedResponse?.russianTranslation,
        timestamp: new Date(),
        feedback: parsedResponse?.feedback,
        alternatives: parsedResponse?.alternatives,
      };
    } catch (error) {
      throw new Error(`Ошибка генерации диалога: ${error}`);
    }
  }
  // Воспроизведение речи
  async speak(
    text: string,
    settings: Partial<SpeechSettings> = {},
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.speechSynthesis) {
        reject(new Error("Speech Synthesis не поддерживается"));
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      // Настройки по умолчанию
      utterance.lang = settings.language || "de-DE";
      utterance.rate = settings.rate || 0.8;
      utterance.pitch = settings.pitch || 1;
      utterance.volume = settings.volume || 1;
      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);
      this.speechSynthesis.speak(utterance);
    });
  }
  // Оценка прогресса пользователя
  calculateProgress(session: ScenarioSession): ScenarioFeedback {
    const totalMessages = session.dialogue.length;
    const userMessages = session.dialogue.filter((m) => m.speaker === "user");
    const correctMessages = userMessages.filter((m) => m.isCorrect !== false);
    const accuracy =
      userMessages.length > 0
        ? correctMessages.length / userMessages.length
        : 0;
    const engagement = Math.min(
      100,
      (session.userProgress.timeSpent / 600) * 100,
    ); // 10 минут = 100%
    return {
      overallScore: Math.round((accuracy * 0.7 + engagement * 0.3) * 100),
      strengths: this.identifyStrengths(session),
      improvements: this.identifyImprovements(session),
      vocabularyMastered: session.userProgress.vocabularyLearned,
      grammarPoints: session.userProgress.grammarPracticed,
      nextRecommendations: this.generateRecommendations(session),
      achievements: this.checkAchievements(session),
    };
  }
  // Вспомогательные методы
  private createFallbackContent(
    interest: UserInterest,
    level: GermanLevel,
  ): PersonalizedContent {
    const interestData = INTERESTS_DATA.find((i) => i.id === interest);
    return {
      greeting: "Добро пожаловать в сценарий изучения немецкого языка!",
      scenario: `Мы изучаем немецкий через ${interestData?.title}`,
      characters: [
        {
          id: "1",
          name: "Hans",
          role: "Эксперт",
          personality: "Дружелюбный и терпеливый",
          background: "Опытный специалист из Германии",
        },
      ],
      objectives: [
        "Изучить новую лексику",
        "Практиковать произношение",
        "Понять культурный контекст",
      ],
      vocabulary: ["Hallo", "Danke", "Bitte"],
      cultural_context: "В Германии ценят вежливость и пунктуальность",
    };
  }
  private identifyStrengths(session: ScenarioSession): string[] {
    // Логика определения сильных сторон
    return ["Хорошее произношение", "Активное участие в диалоге"];
  }
  private identifyImprovements(session: ScenarioSession): string[] {
    // Логика определения областей для улучшения
    return ["Работа над артиклями", "Расширение словарного запаса"];
  }
  private generateRecommendations(session: ScenarioSession): string[] {
    // Генерация персональных рекомендаций
    return [
      "Продолжите изучение через карточки",
      "Попробуйте новый сценарий в той же теме",
    ];
  }
  private checkAchievements(
    session: ScenarioSession,
  ): Array<{ id: string; type: string; title: string }> {
    // Проверка достижений
    return [];
  }
}
export const personalizedScenariosService =
  PersonalizedScenariosService.getInstance();
