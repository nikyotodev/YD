import type {
  AdaptiveTestConfig,
  GermanLevel,
  LevelRecommendation,
  LevelTestQuestion,
  LevelTestResult,
  QuestionType,
  TestSession,
  UserAnswer,
} from "@/types/level-test";
// Базовая конфигурация теста
const DEFAULT_CONFIG: AdaptiveTestConfig = {
  maxQuestions: 12,
  minQuestions: 6,
  confidenceThreshold: 0.8,
  timeLimit: 5 * 60 * 1000, // 5 минут
  questionTypes: ["grammar", "vocabulary", "reading"],
};
// Маппинг уровней к числовым значениям для расчетов
const LEVEL_WEIGHTS: Record<GermanLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};
const WEIGHT_TO_LEVEL: Record<number, GermanLevel> = {
  1: "A1",
  2: "A2",
  3: "B1",
  4: "B2",
  5: "C1",
  6: "C2",
};
class LevelTestService {
  private testQuestions: LevelTestQuestion[];
  private config: AdaptiveTestConfig;
  constructor(config: Partial<AdaptiveTestConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.testQuestions = this.generateTestQuestions();
  }
  // Создание новой сессии тестирования
  createTestSession(userId?: string): TestSession {
    return {
      id: this.generateSessionId(),
      userId,
      startTime: new Date(),
      answers: [],
      currentQuestionIndex: 0,
      estimatedLevel: null,
      confidence: 0,
      isCompleted: false,
    };
  }
  // Получение следующего вопроса на основе адаптивного алгоритма
  getNextQuestion(session: TestSession): LevelTestQuestion | null {
    try {
      if (
        session.isCompleted ||
        session.answers.length >= this.config.maxQuestions
      ) {
        return null;
      }
      const estimatedLevel = this.calculateCurrentLevel(session);
      const usedQuestionIds = new Set(session.answers.map((a) => a.questionId));
      // Выбираем вопросы подходящего уровня сложности
      const candidates = this.testQuestions.filter(
        (q) =>
          !usedQuestionIds.has(q.id) &&
          this.isQuestionAppropriate(q, estimatedLevel, session),
      );
      if (candidates.length === 0) {
        return this.getFallbackQuestion(usedQuestionIds);
      }
      // Сортируем по приоритету (сложность близкая к предполагаемому уровню)
      candidates.sort((a, b) => {
        const aDistance = Math.abs(
          LEVEL_WEIGHTS[a.level] - LEVEL_WEIGHTS[estimatedLevel],
        );
        const bDistance = Math.abs(
          LEVEL_WEIGHTS[b.level] - LEVEL_WEIGHTS[estimatedLevel],
        );
        return aDistance - bDistance;
      });
      return candidates[0];
    } catch (error) {
      throw new Error(`Ошибка при получении следующего вопроса: ${error}`);
    }
  }
  // Обработка ответа пользователя
  processAnswer(
    session: TestSession,
    questionId: string,
    selectedAnswer: number,
    timeSpent: number,
  ): TestSession {
    try {
      const question = this.testQuestions.find((q) => q.id === questionId);
      if (!question) {
        throw new Error(`Вопрос с ID ${questionId} не найден`);
      }
      const isCorrect = selectedAnswer === question.correctAnswer;
      const confidence = this.calculateAnswerConfidence(timeSpent, isCorrect);
      const userAnswer: UserAnswer = {
        questionId,
        selectedAnswer,
        isCorrect,
        timeSpent,
        confidence,
      };
      const updatedSession: TestSession = {
        ...session,
        answers: [...session.answers, userAnswer],
        currentQuestionIndex: session.currentQuestionIndex + 1,
      };
      // Обновляем оценку уровня и уверенности
      updatedSession.estimatedLevel =
        this.calculateCurrentLevel(updatedSession);
      updatedSession.confidence =
        this.calculateSessionConfidence(updatedSession);
      // Проверяем условия завершения теста
      updatedSession.isCompleted = this.shouldCompleteTest(updatedSession);
      return updatedSession;
    } catch (error) {
      throw new Error(`Ошибка при обработке ответа: ${error}`);
    }
  }
  // Расчет финального результата
  calculateFinalResult(session: TestSession): LevelTestResult {
    try {
      if (!session.isCompleted) {
        throw new Error("Тест не завершен");
      }
      const level = session.estimatedLevel || "A1";
      const score = this.calculateScore(session);
      const correctAnswers = session.answers.filter((a) => a.isCorrect).length;
      const timeSpent = Date.now() - session.startTime.getTime();
      const { strengths, weaknesses } = this.analyzePerformance(session);
      const recommendations = this.generateRecommendations(level, weaknesses);
      return {
        level,
        confidence: session.confidence,
        score,
        totalQuestions: session.answers.length,
        correctAnswers,
        strengths,
        weaknesses,
        recommendations,
        timeSpent,
      };
    } catch (error) {
      throw new Error(`Ошибка при расчете результата: ${error}`);
    }
  }
  // Приватные методы
  private generateSessionId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  private calculateCurrentLevel(session: TestSession): GermanLevel {
    if (session.answers.length === 0) return "A2"; // Начальная оценка
    let totalWeight = 0;
    let weightedSum = 0;
    for (const answer of session.answers) {
      const question = this.testQuestions.find(
        (q) => q.id === answer.questionId,
      );
      if (question) {
        const weight = answer.isCorrect ? 1 : -0.5;
        totalWeight += Math.abs(weight);
        weightedSum += LEVEL_WEIGHTS[question.level] * weight;
      }
    }
    if (totalWeight === 0) return "A2";
    const averageLevel = Math.max(
      1,
      Math.min(6, Math.round(weightedSum / totalWeight)),
    );
    return WEIGHT_TO_LEVEL[averageLevel] || "A2";
  }
  private isQuestionAppropriate(
    question: LevelTestQuestion,
    estimatedLevel: GermanLevel,
    session: TestSession,
  ): boolean {
    const levelDifference = Math.abs(
      LEVEL_WEIGHTS[question.level] - LEVEL_WEIGHTS[estimatedLevel],
    );
    // Разрешаем вопросы в пределах +/- 1 уровня
    return levelDifference <= 1;
  }
  private getFallbackQuestion(
    usedQuestionIds: Set<string>,
  ): LevelTestQuestion | null {
    const unusedQuestions = this.testQuestions.filter(
      (q) => !usedQuestionIds.has(q.id),
    );
    return unusedQuestions.length > 0 ? unusedQuestions[0] : null;
  }
  private calculateAnswerConfidence(
    timeSpent: number,
    isCorrect: boolean,
  ): number {
    const normalTime = 30000; // 30 секунд - нормальное время на вопрос
    const timeRatio = Math.min(timeSpent / normalTime, 2);
    let confidence = isCorrect ? 0.8 : 0.2;
    // Корректируем на основе времени
    if (isCorrect && timeSpent < normalTime * 0.5) {
      confidence = Math.min(0.95, confidence + 0.15); // Быстрый правильный ответ
    } else if (isCorrect && timeSpent > normalTime * 1.5) {
      confidence = Math.max(0.5, confidence - 0.2); // Медленный правильный ответ
    }
    return confidence;
  }
  private calculateSessionConfidence(session: TestSession): number {
    if (session.answers.length === 0) return 0;
    const confidenceSum = session.answers.reduce(
      (sum, answer) => sum + answer.confidence,
      0,
    );
    return confidenceSum / session.answers.length;
  }
  private shouldCompleteTest(session: TestSession): boolean {
    // Минимальное количество вопросов
    if (session.answers.length < this.config.minQuestions) return false;
    // Максимальное количество вопросов
    if (session.answers.length >= this.config.maxQuestions) return true;
    // Высокая уверенность в результате
    if (
      session.confidence >= this.config.confidenceThreshold &&
      session.answers.length >= this.config.minQuestions
    ) {
      return true;
    }
    return false;
  }
  private calculateScore(session: TestSession): number {
    const totalPoints = session.answers.reduce((sum, answer) => {
      const question = this.testQuestions.find(
        (q) => q.id === answer.questionId,
      );
      return sum + (question ? question.points : 0);
    }, 0);
    const earnedPoints = session.answers.reduce((sum, answer) => {
      if (!answer.isCorrect) return sum;
      const question = this.testQuestions.find(
        (q) => q.id === answer.questionId,
      );
      return sum + (question ? question.points : 0);
    }, 0);
    return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  }
  private analyzePerformance(session: TestSession): {
    strengths: QuestionType[];
    weaknesses: QuestionType[];
  } {
    const typePerformance: Record<
      QuestionType,
      { correct: number; total: number }
    > = {
      grammar: { correct: 0, total: 0 },
      vocabulary: { correct: 0, total: 0 },
      reading: { correct: 0, total: 0 },
      listening: { correct: 0, total: 0 },
    };
    for (const answer of session.answers) {
      const question = this.testQuestions.find(
        (q) => q.id === answer.questionId,
      );
      if (question) {
        typePerformance[question.type].total++;
        if (answer.isCorrect) {
          typePerformance[question.type].correct++;
        }
      }
    }
    const strengths: QuestionType[] = [];
    const weaknesses: QuestionType[] = [];
    for (const [type, performance] of Object.entries(typePerformance)) {
      if (performance.total === 0) continue;
      const accuracy = performance.correct / performance.total;
      if (accuracy >= 0.8) {
        strengths.push(type as QuestionType);
      } else if (accuracy < 0.5) {
        weaknesses.push(type as QuestionType);
      }
    }
    return { strengths, weaknesses };
  }
  private generateRecommendations(
    level: GermanLevel,
    weaknesses: QuestionType[],
  ): LevelRecommendation[] {
    const recommendations: LevelRecommendation[] = [];
    // Рекомендации на основе слабых сторон
    for (const weakness of weaknesses) {
      switch (weakness) {
        case "grammar":
          recommendations.push({
            type: "lesson",
            title: `Грамматика уровня ${level}`,
            description: "Укрепите знания грамматических конструкций",
            url: `/lessons/grammar-${level.toLowerCase()}`,
            priority: "high",
          });
          break;
        case "vocabulary":
          recommendations.push({
            type: "practice",
            title: "Расширение словарного запаса",
            description: "Изучите новые слова в коллекциях",
            url: "/collections",
            priority: "high",
          });
          break;
        case "reading":
          recommendations.push({
            type: "lesson",
            title: "Тексты для чтения",
            description: "Практикуйте понимание текстов",
            url: "/culture/literature",
            priority: "medium",
          });
          break;
      }
    }
    // Общие рекомендации по уровню
    recommendations.push({
      type: "course",
      title: `Персональный план изучения (${level})`,
      description: "Получите индивидуальный план обучения с AI-помощником",
      url: "/lessons",
      priority: "high",
    });
    return recommendations;
  }
  private generateTestQuestions(): LevelTestQuestion[] {
    // База вопросов для тестирования на русском языке с более простыми формулировками
    return [
      // A1 уровень - Базовые знания
      {
        id: "a1_1",
        type: "vocabulary",
        level: "A1",
        difficulty: 1,
        question: "Как сказать «привет» по-немецки?",
        options: ["Tschüss", "Hallo", "Danke", "Bitte"],
        correctAnswer: 1,
        explanation: "Hallo - универсальное приветствие в немецком языке",
        points: 1,
      },
      {
        id: "a1_2",
        type: "vocabulary",
        level: "A1",
        difficulty: 1,
        question: "Что означает немецкое слово «Danke»?",
        options: ["Пока", "Спасибо", "Привет", "Пожалуйста"],
        correctAnswer: 1,
        explanation: "Danke означает «спасибо»",
        points: 1,
      },
      {
        id: "a1_3",
        type: "grammar",
        level: "A1",
        difficulty: 1,
        question: "Выберите правильную форму глагола: Ich ___ aus Russland.",
        options: ["bin", "bist", "sind", "ist"],
        correctAnswer: 0,
        explanation: "С местоимением «ich» используется форма «bin»",
        points: 1,
      },
      {
        id: "a1_4",
        type: "vocabulary",
        level: "A1",
        difficulty: 1,
        question: "Как по-немецки будет «спасибо большое»?",
        options: ["Danke schön", "Bitte schön", "Auf Wiedersehen", "Guten Tag"],
        correctAnswer: 0,
        explanation: "Danke schön означает «спасибо большое»",
        points: 1,
      },
      // A2 уровень - Элементарные знания
      {
        id: "a2_0",
        type: "reading",
        level: "A2",
        difficulty: 2,
        question:
          "Текст: 'Ich heiße Maria und wohne in Berlin. Ich arbeite als Lehrerin.' Где работает Maria?",
        options: ["в школе", "в больнице", "в магазине", "в банке"],
        correctAnswer: 0,
        explanation: "Lehrerin = учительница, учительницы работают в школе",
        points: 2,
      },
      {
        id: "a2_1",
        type: "grammar",
        level: "A2",
        difficulty: 2,
        question:
          "Выберите правильную форму прошедшего времени: Gestern ___ ich ins Kino gegangen.",
        options: ["habe", "bin", "hatte", "war"],
        correctAnswer: 1,
        explanation: "Глагол «gehen» образует перфект с помощью «sein»",
        points: 2,
      },
      {
        id: "a2_2",
        type: "vocabulary",
        level: "A2",
        difficulty: 2,
        question: "Что означает слово «verschieden»?",
        options: ["одинаковый", "разный", "красивый", "сложный"],
        correctAnswer: 1,
        explanation: "verschieden = разный, различный",
        points: 2,
      },
      {
        id: "a2_3",
        type: "grammar",
        level: "A2",
        difficulty: 2,
        question: "Какой артикль у слова «Haus» (дом)?",
        options: ["der", "die", "das", "den"],
        correctAnswer: 2,
        explanation: "Das Haus - средний род",
        points: 2,
      },
      {
        id: "a2_4",
        type: "vocabulary",
        level: "A2",
        difficulty: 2,
        question: "Как сказать «я иду в магазин» по-немецки?",
        options: [
          "Ich gehe zum Geschäft",
          "Ich bin Geschäft",
          "Ich habe Geschäft",
          "Ich will Geschäft",
        ],
        correctAnswer: 0,
        explanation: "Ich gehe zum Geschäft - правильная конструкция",
        points: 2,
      },
      // B1 уровень - Средний уровень
      {
        id: "b1_0",
        type: "reading",
        level: "B1",
        difficulty: 3,
        question:
          "Текст: 'Umweltschutz ist heute wichtiger denn je. Viele Menschen trennen ihren Müll und fahren weniger Auto.' Что делают люди для защиты окружающей среды?",
        options: [
          "покупают больше",
          "сортируют мусор",
          "строят дома",
          "едят мясо",
        ],
        correctAnswer: 1,
        explanation:
          "В тексте говорится 'trennen ihren Müll' = сортируют мусор",
        points: 3,
      },
      {
        id: "b1_1",
        type: "grammar",
        level: "B1",
        difficulty: 3,
        question:
          "Выберите правильный вариант: Obwohl es regnet, ___ wir spazieren.",
        options: ["gehen", "gingen", "gegangen", "gehend"],
        correctAnswer: 0,
        explanation: "После «obwohl» (хотя) используется настоящее время",
        points: 3,
      },
      {
        id: "b1_2",
        type: "vocabulary",
        level: "B1",
        difficulty: 3,
        question: "Что означает «die Umwelt»?",
        options: ["погода", "окружающая среда", "мир", "вселенная"],
        correctAnswer: 1,
        explanation: "die Umwelt = окружающая среда",
        points: 3,
      },
      {
        id: "b1_3",
        type: "grammar",
        level: "B1",
        difficulty: 3,
        question:
          "Какая форма правильная: Der Mann, ___ ich gestern gesehen habe...",
        options: ["der", "den", "dem", "des"],
        correctAnswer: 1,
        explanation:
          "В относительном придаточном предложении - аккузатив «den»",
        points: 3,
      },
      {
        id: "b1_4",
        type: "vocabulary",
        level: "B1",
        difficulty: 3,
        question: "Что означает выражение «sich Sorgen machen»?",
        options: ["радоваться", "беспокоиться", "торопиться", "отдыхать"],
        correctAnswer: 1,
        explanation: "sich Sorgen machen = беспокоиться, волноваться",
        points: 3,
      },
      // B2 уровень - Продвинутый уровень
      {
        id: "b2_1",
        type: "grammar",
        level: "B2",
        difficulty: 4,
        question:
          "Выберите правильную форму конъюнктива: Hätte ich mehr Zeit gehabt, ___ ich den Bericht fertiggestellt.",
        options: ["hätte", "wäre", "würde haben", "hatte"],
        correctAnswer: 0,
        explanation: "Конъюнктив II в условных предложениях прошедшего времени",
        points: 4,
      },
      {
        id: "b2_2",
        type: "vocabulary",
        level: "B2",
        difficulty: 4,
        question: "Какое слово подходит: «Die Verhandlungen verliefen ___»",
        options: ["erfolgreich", "erfolgsreich", "erfolgende", "erfolgen"],
        correctAnswer: 0,
        explanation: "erfolgreich = успешно (прилагательное)",
        points: 4,
      },
      {
        id: "b2_3",
        type: "grammar",
        level: "B2",
        difficulty: 4,
        question:
          "Как правильно выразить предположение: «Он, вероятно, уже пришел»?",
        options: [
          "Er ist wahrscheinlich schon gekommen",
          "Er kommt wahrscheinlich schon",
          "Er war wahrscheinlich schon gekommen",
          "Er würde wahrscheinlich schon kommen",
        ],
        correctAnswer: 0,
        explanation:
          "Для выражения предположения о завершившемся действии используется перфект",
        points: 4,
      },
      {
        id: "b2_4",
        type: "vocabulary",
        level: "B2",
        difficulty: 4,
        question: "Что означает «sich durchsetzen»?",
        options: ["сесть", "пройти через", "добиться своего", "установить"],
        correctAnswer: 2,
        explanation: "sich durchsetzen = добиться своего, утвердиться",
        points: 4,
      },
      // C1 уровень - Высокий уровень
      {
        id: "c1_0",
        type: "reading",
        level: "C1",
        difficulty: 5,
        question:
          "Текст: 'Die Digitalisierung bringt sowohl Chancen als auch Herausforderungen mit sich. Während sie neue Arbeitsplätze schafft, macht sie andere überflüssig.' Какая основная идея текста?",
        options: [
          "только преимущества",
          "двойственность процесса",
          "только проблемы",
          "неопределенность",
        ],
        correctAnswer: 1,
        explanation:
          "'sowohl...als auch' показывает двойственную природу процесса - и плюсы, и минусы",
        points: 5,
      },
      {
        id: "c1_1",
        type: "grammar",
        level: "C1",
        difficulty: 5,
        question:
          "Выберите правильный предлог: Die Angelegenheit, ___ sich niemand kümmern wollte...",
        options: ["um die", "für die", "über die", "zu der"],
        correctAnswer: 0,
        explanation: "sich kümmern um + Akkusativ",
        points: 5,
      },
      {
        id: "c1_2",
        type: "vocabulary",
        level: "C1",
        difficulty: 5,
        question: "Что означает «unumstößlich»?",
        options: ["изменчивый", "непоколебимый", "временный", "сомнительный"],
        correctAnswer: 1,
        explanation: "unumstößlich = непоколебимый, неопровержимый",
        points: 5,
      },
      {
        id: "c1_3",
        type: "vocabulary",
        level: "C1",
        difficulty: 5,
        question: "Какое слово НЕ является синонимом к «gründlich»?",
        options: ["sorgfältig", "ausführlich", "oberflächlich", "eingehend"],
        correctAnswer: 2,
        explanation:
          "oberflächlich (поверхностно) является антонимом к gründlich (основательно)",
        points: 5,
      },
      // C2 уровень - Профессиональный уровень
      {
        id: "c2_1",
        type: "grammar",
        level: "C2",
        difficulty: 5,
        question:
          "Выберите стилистически подходящий вариант: Wären die Umstände andere gewesen, so ___ das Ergebnis völlig anders ausgefallen.",
        options: ["wäre", "hätte", "würde", "könnte"],
        correctAnswer: 0,
        explanation:
          "Ирреальное условное предложение прошедшего времени с «wäre»",
        points: 6,
      },
      {
        id: "c2_2",
        type: "vocabulary",
        level: "C2",
        difficulty: 5,
        question: "Какой синоним к «unwiderruflich»?",
        options: ["endgültig", "möglich", "zweifelhaft", "vorläufig"],
        correctAnswer: 0,
        explanation: "unwiderruflich = endgültig (окончательно, бесповоротно)",
        points: 6,
      },
    ];
  }
}
export const levelTestService = new LevelTestService();
