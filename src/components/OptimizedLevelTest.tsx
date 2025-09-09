"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  LEVEL_DESCRIPTIONS,
  levelSpecificTestService,
  type LevelSpecificQuestion,
  type LevelTestResult
} from "@/lib/level-specific-tests";
import type { GermanLevel } from "@/types/level-test";
import {
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  CheckCircle,
  Clock,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
  Zap,
  AlertCircle,
  TimerIcon,
  MessageSquare,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
// Типы
interface TestSession {
  level: GermanLevel;
  questions: LevelSpecificQuestion[];
  currentQuestionIndex: number;
  answers: Array<{
    questionId: string;
    selectedAnswer: number;
    timeSpent: number;
  }>;
  startTime: number;
  isCompleted: boolean;
}
interface OptimizedLevelTestProps {
  level: GermanLevel;
}
// Утилиты стилей
const getLevelStyles = (level: GermanLevel) => {
  return {
    gradient: "from-german-red/10 to-german-gold/10 dark:from-dark-theme-pink/10 dark:to-dark-theme-purple/10",
    border: "border-german-red/20 dark:border-dark-theme-pink/20",
    accent: "text-german-red dark:text-dark-theme-pink",
    secondary: "text-german-gold dark:text-dark-theme-purple"
  };
};
// Компонент прогресса с таймером
function TestProgress({
  current,
  total,
  timeRemaining,
  level
}: {
  current: number;
  total: number;
  timeRemaining: number;
  level: GermanLevel;
}) {
  const styles = getLevelStyles(level);
  const progressPercent = (current / total) * 100;
  const timePercent = (timeRemaining / (20 * 60)) * 100; // 20 минут
  return (
    <Card className={`glass border ${styles.border} mb-6`}>
      <CardContent className="py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className={`h-4 w-4 ${styles.accent}`} />
            <span className="text-sm font-medium">
              Вопрос {current} из {total}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TimerIcon className={`h-4 w-4 ${styles.secondary}`} />
            <span className="text-sm font-medium">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <Progress
            value={progressPercent}
            className="h-2"
          />
          <Progress
            value={timePercent}
            className="h-1 opacity-60"
          />
        </div>
      </CardContent>
    </Card>
  );
}
// Компонент вопроса
function QuestionCard({
  question,
  selectedAnswer,
  onAnswerSelect,
  level
}: {
  question: LevelSpecificQuestion;
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
  level: GermanLevel;
}) {
  const styles = getLevelStyles(level);
  return (
    <Card className={`glass border ${styles.border}`}>
      <CardHeader>
        <CardTitle className="text-xl leading-relaxed">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {question.options.map((option, index) => (
          <Button
            key={`option-${index}-${option.slice(0, 10)}`}
            variant={selectedAnswer === index ? "default" : "outline"}
            className={`w-full text-left justify-start p-4 h-auto min-h-[3rem] ${
              selectedAnswer === index
                ? "bg-gradient-to-r from-german-red to-german-gold dark:from-dark-theme-pink dark:to-dark-theme-purple text-white"
                : "border-german-red/20 dark:border-dark-theme-pink/20 hover:bg-german-red/5 dark:hover:bg-dark-theme-pink/5"
            }`}
            onClick={() => onAnswerSelect(index)}
          >
            <span className="flex items-center gap-3 w-full">
              <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                selectedAnswer === index
                  ? 'border-white bg-white/20'
                  : "border-german-red/40 dark:border-dark-theme-pink/40"
              }`}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1 text-left">{option}</span>
            </span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
// Компонент для детального разбора ответов
function QuestionReview({
  answers,
  level,
  onToggle,
  isVisible
}: {
  answers: LevelTestResult['answers'];
  level: GermanLevel;
  onToggle: () => void;
  isVisible: boolean;
}) {
  const styles = getLevelStyles(level);

  if (!isVisible) {
    return (
      <Card className={`glass border ${styles.border}`}>
        <CardContent className="py-6">
          <Button
            onClick={onToggle}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Eye className="h-4 w-4 mr-2" />
            Показать разбор ответов
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`glass border ${styles.border}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className={`h-5 w-5 ${styles.accent}`} />
            Детальный разбор ответов
          </CardTitle>
          <Button
            onClick={onToggle}
            variant="ghost"
            size="sm"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {answers.map((answer, index) => (
          <div
            key={answer.questionId}
            className={`p-4 rounded-lg border-2 ${
              answer.isCorrect
                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
                : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              {answer.isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Вопрос {index + 1}
                </div>
                <div className="font-medium mb-3">
                  {answer.question}
                </div>

                {!answer.isCorrect && (
                  <div className="space-y-2 mb-3">
                    <div className="text-sm">
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        Ваш ответ:
                      </span>
                      <span className="ml-1">
                        {answer.selectedAnswerText}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        Правильный ответ:
                      </span>
                      <span className="ml-1 font-medium">
                        {answer.correctAnswer}
                      </span>
                    </div>
                  </div>
                )}

                {answer.isCorrect && (
                  <div className="text-sm mb-3">
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Правильный ответ:
                    </span>
                    <span className="ml-1 font-medium">
                      {answer.correctAnswer}
                    </span>
                  </div>
                )}

                <div className="text-sm text-muted-foreground bg-white/50 dark:bg-black/20 p-3 rounded-md">
                  <span className="font-medium">Объяснение: </span>
                  {answer.explanation}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
// Компонент результатов
function TestResults({
  result,
  level,
  onRestart
}: {
  result: LevelTestResult;
  level: GermanLevel;
  onRestart: () => void;
}) {
  const styles = getLevelStyles(level);
  const isPass = result.score >= result.passThreshold;
  const [showReview, setShowReview] = useState(false);

  return (
    <div className="space-y-6">
      {/* Результат */}
      <Card className={`glass border-2 ${isPass ? 'border-green-500/30' : 'border-orange-500/30'}`}>
        <CardContent className="py-8 text-center">
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
            isPass
              ? 'bg-green-500/20'
              : 'bg-orange-500/20'
          }`}>
            {isPass ? (
              <Trophy className="h-10 w-10 text-green-600" />
            ) : (
              <Target className="h-10 w-10 text-orange-600" />
            )}
          </div>
          <h2 className="text-3xl font-bold mb-4">
            {isPass ? `Поздравляем! Уровень ${level}` : "Почти получилось!"}
          </h2>
          <div className="text-6xl font-bold mb-4">
            <span className={styles.accent}>{result.score}%</span>
          </div>
          <p className="text-lg text-muted-foreground mb-6">
            {isPass
              ? `Ваши знания соответствуют уровню ${level}!`
              : `Рекомендуем повторить материал уровня ${level}.`
            }
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${styles.accent}`}>{result.correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Правильных</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${styles.secondary}`}>{result.totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Всего</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${styles.accent}`}>{Math.round(result.timeSpent / 60000)}м</div>
              <div className="text-sm text-muted-foreground">Время</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${styles.secondary}`}>{result.passThreshold}%</div>
              <div className="text-sm text-muted-foreground">Проходной</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={onRestart}
              variant="outline"
              size="lg"
              className={`border-german-red/20 ${styles.accent} hover:bg-german-red/10 dark:border-dark-theme-pink/20 dark:hover:bg-dark-theme-pink/10`}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Пройти еще раз
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-german-red to-german-gold dark:from-dark-theme-pink dark:to-dark-theme-purple"
            >
              <Link href="/lessons">
                <BookOpen className="h-4 w-4 mr-2" />
                Перейти к урокам
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Разбор ошибок с ИИ */}
      {result.correctAnswers < result.totalQuestions && (
        <Card className={`glass border ${styles.border} bg-gradient-to-r ${styles.gradient}`}>
          <CardContent className="py-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <MessageSquare className={`h-6 w-6 ${styles.accent}`} />
                <h3 className="text-xl font-semibold">Хотите разобрать ошибки?</h3>
              </div>
              <p className="text-muted-foreground">
                Наш ИИ-помощник поможет понять, где именно были допущены ошибки,
                и даст персональные рекомендации для улучшения знаний.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-german-red to-german-gold dark:from-dark-theme-pink dark:to-dark-theme-purple hover:opacity-90"
              >
                <Link
                  href={`http://192.168.0.14:3000/chat/?topic=level-test-${level.toLowerCase()}-mistakes&score=${result.score}&correct=${result.correctAnswers}&total=${result.totalQuestions}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Разобрать ошибки с ИИ чатом
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Детальный разбор ответов */}
      <QuestionReview
        answers={result.answers}
        level={level}
        onToggle={() => setShowReview(!showReview)}
        isVisible={showReview}
      />

      {/* Рекомендации */}
      {((result.strengths && result.strengths.length > 0) || (result.weaknesses && result.weaknesses.length > 0)) && (
        <Card className={`glass border ${styles.border}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className={`h-5 w-5 ${styles.accent}`} />
              Анализ ваших знаний
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.strengths && result.strengths.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                  Ваши сильные стороны:
                </h4>
                <ul className="space-y-1">
                  {result.strengths.map((strength, index) => (
                    <li key={`strength-${index}-${strength}`} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.weaknesses && result.weaknesses.length > 0 && (
              <div>
                <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">
                  Области для улучшения:
                </h4>
                <ul className="space-y-1">
                  {result.weaknesses.map((weakness, index) => (
                    <li key={`weakness-${index}-${weakness}`} className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                      <span className="text-sm">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
// Основной компонент
export function OptimizedLevelTest({ level }: OptimizedLevelTestProps) {
  // Состояние
  const [session, setSession] = useState<TestSession | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [result, setResult] = useState<LevelTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(20 * 60); // 20 минут
  // Рефы
  const questionStartTime = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { title, description } = LEVEL_DESCRIPTIONS[level];
  const styles = getLevelStyles(level);
  // Cleanup
  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  // Функции теста
  const completeTest = useCallback(() => {
    if (!session) return;
    try {
      cleanup();
      const totalTimeSpent = Date.now() - session.startTime;
      const testResult = levelSpecificTestService.calculateResult(
        level,
        session.answers,
        totalTimeSpent
      );
      setResult(testResult);
      setSession(prev => prev ? { ...prev, isCompleted: true } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при завершении теста");
    }
  }, [session, level, cleanup]);
  const startTest = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const questions = await levelSpecificTestService.generateQuestions(level);
      const newSession: TestSession = {
        level,
        questions,
        currentQuestionIndex: 0,
        answers: [],
        startTime: Date.now(),
        isCompleted: false
      };
      setSession(newSession);
      setTimeRemaining(20 * 60);
      questionStartTime.current = Date.now();
      // Запуск таймера
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            completeTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при загрузке теста");
    } finally {
      setIsLoading(false);
    }
  }, [level, completeTest]);
  const handleAnswerSelect = useCallback((answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  }, []);
  const handleNextQuestion = useCallback(() => {
    if (!session || selectedAnswer === null) return;
    const currentQuestion = session.questions[session.currentQuestionIndex];
    const timeSpent = Date.now() - questionStartTime.current;
    const newAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      timeSpent
    };
    const updatedAnswers = [...session.answers, newAnswer];
    if (session.currentQuestionIndex + 1 >= session.questions.length) {
      // Тест завершен
      setSession(prev => prev ? { ...prev, answers: updatedAnswers } : null);
      setTimeout(completeTest, 100);
    } else {
      // Следующий вопрос
      setSession(prev => prev ? {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        answers: updatedAnswers
      } : null);
      setSelectedAnswer(null);
      questionStartTime.current = Date.now();
    }
  }, [session, selectedAnswer, completeTest]);
  const handleRestart = useCallback(() => {
    cleanup();
    setSession(null);
    setResult(null);
    setSelectedAnswer(null);
    setError(null);
    setTimeRemaining(20 * 60);
  }, [cleanup]);
  // Cleanup при размонтировании
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);
  // Обработка ошибок
  if (error) {
    return (
      <Card className="glass border border-red-500/30 max-w-2xl mx-auto">
        <CardContent className="py-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Произошла ошибка</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={handleRestart} variant="outline">
            Попробовать снова
          </Button>
        </CardContent>
      </Card>
    );
  }
  // Результаты
  if (result) {
    return <TestResults result={result} level={level} onRestart={handleRestart} />;
  }
  // Активный тест
  if (session && !session.isCompleted) {
    const currentQuestion = session.questions[session.currentQuestionIndex];
    const isLastQuestion = session.currentQuestionIndex + 1 >= session.questions.length;
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <TestProgress
          current={session.currentQuestionIndex + 1}
          total={session.questions.length}
          timeRemaining={timeRemaining}
          level={level}
        />
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          level={level}
        />
        <div className="flex justify-between items-center">
          <Badge className={`${styles.border} ${styles.accent} bg-transparent`}>
            {level} • Вопрос {session.currentQuestionIndex + 1}
          </Badge>
          <Button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            size="lg"
            className="bg-gradient-to-r from-german-red to-german-gold dark:from-dark-theme-pink dark:to-dark-theme-purple"
          >
            {isLastQuestion ? 'Завершить тест' : 'Следующий вопрос'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }
  // Стартовый экран
  return (
    <Card className={`glass border ${styles.border} max-w-3xl mx-auto`}>
      <CardHeader className="text-center pb-6">
        <div className={`mx-auto w-20 h-20 bg-gradient-to-br ${styles.gradient} rounded-full flex items-center justify-center mb-6`}>
          <Brain className={`h-10 w-10 ${styles.accent}`} />
        </div>
        <CardTitle className="text-3xl font-bold mb-4">
          Тест уровня <span className={styles.accent}>{level}</span>
        </CardTitle>
        <p className="text-lg text-muted-foreground">
          {description}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className={`flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r ${styles.gradient}`}>
            <Clock className={`h-5 w-5 ${styles.accent}`} />
            <div>
              <p className="font-medium">20 минут</p>
              <p className="text-sm text-muted-foreground">Время на тест</p>
            </div>
          </div>
          <div className={`flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r ${styles.gradient}`}>
            <Target className={`h-5 w-5 ${styles.secondary}`} />
            <div>
              <p className="font-medium">20 вопросов</p>
              <p className="text-sm text-muted-foreground">По уровню {level}</p>
            </div>
          </div>
        </div>
        <Separator />
        <div className="text-center">
          <Button
            onClick={startTest}
            disabled={isLoading}
            size="lg"
            className="bg-gradient-to-r from-german-red to-german-gold dark:from-dark-theme-pink dark:to-dark-theme-purple px-8 py-3 text-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Загрузка...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Начать тест {level}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
