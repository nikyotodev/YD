"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Play,
  Volume2,
  Mic,
  MicOff,
  Star,
  Trophy,
  Target,
  ArrowRight,
  RefreshCw,
  Sparkles,
  MessageCircle,
  BookOpen,
  ChevronRight,
  CheckCircle,
  Clock,
  User,
  Heart,
  Zap,
  Award,
  Users,
  Loader2,
} from "lucide-react";
import type {
  UserInterest,
  GermanLevel,
  ScenarioSession,
  DialogueMessage,
  PersonalizedContent,
} from "@/types/personalized-scenarios";
import {
  INTERESTS_DATA,
  personalizedScenariosService,
} from "@/lib/personalized-scenarios-service";
import { AvatarService } from "@/lib/avatar-service";
import Image from "next/image";

interface PersonalizedScenarioLessonProps {
  initialInterest?: UserInterest;
  initialLevel?: GermanLevel;
  onComplete?: (session: ScenarioSession) => void;
}

export function PersonalizedScenarioLesson({
  initialInterest,
  initialLevel = "A2",
  onComplete,
}: PersonalizedScenarioLessonProps) {
  // Состояния компонента
  const [currentStep, setCurrentStep] = useState<
    "selection" | "loading" | "scenario" | "completed"
  >("selection");
  const [selectedInterest, setSelectedInterest] = useState<UserInterest | null>(
    initialInterest || null,
  );
  const [selectedLevel, setSelectedLevel] = useState<GermanLevel>(initialLevel);
  const [scenarioContent, setScenarioContent] =
    useState<PersonalizedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Состояния диалога
  const [currentSession, setCurrentSession] = useState<ScenarioSession | null>(
    null,
  );
  const [dialogue, setDialogue] = useState<DialogueMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Аватарка для AI-собеседника (мемоизированная)
  const aiAvatar = useMemo(() => {
    if (currentSession) {
      return AvatarService.getAvatarWithFallback(currentSession.id);
    }
    return null;
  }, [currentSession?.id]);

  // Ссылки
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Уровни немецкого
  const levels: { value: GermanLevel; label: string; color: string }[] = [
    { value: "A1", label: "A1 - Начинающий", color: "bg-green-500" },
    { value: "A2", label: "A2 - Элементарный", color: "bg-emerald-500" },
    { value: "B1", label: "B1 - Средний", color: "bg-blue-500" },
    { value: "B2", label: "B2 - Продвинутый", color: "bg-german-black" },
    { value: "C1", label: "C1 - Высокий", color: "bg-german-red" },
    { value: "C2", label: "C2 - Профессиональный", color: "bg-german-gold" },
  ];

  // Прокрутка к последнему сообщению
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [dialogue, scrollToBottom]);

  // Оптимизированный старт сценария
  const startScenario = async () => {
    if (!selectedInterest) return;

    setIsLoading(true);
    setError(null);
    setCurrentStep("loading");

    try {
      // Параллельная генерация контента и создание сессии
      const contentPromise = personalizedScenariosService.generatePersonalizedContent(
        selectedInterest,
        selectedLevel,
      );

      const sessionId = `${selectedInterest}-${selectedLevel}-${Date.now()}`;

      // Создаем сессию немедленно
      const session: ScenarioSession = {
        id: sessionId,
        userId: "current-user",
        scenarioId: sessionId,
        interest: selectedInterest,
        level: selectedLevel,
        startTime: new Date(),
        currentStep: 0,
        totalSteps: 10,
        dialogue: [],
        userProgress: {
          vocabularyLearned: [],
          grammarPracticed: [],
          mistakesMade: [],
          timeSpent: 0,
          confidence: 0,
          engagement: 0,
        },
        isCompleted: false,
      };

      setCurrentSession(session);

      // Ждем генерацию контента
      const content = await contentPromise;
      setScenarioContent(content);

      // Добавляем приветственное сообщение с аватаркой
      const welcomeMessage: DialogueMessage = {
        id: "welcome",
        speaker: "ai",
        content: content.greeting,
        timestamp: new Date(),
      };

      setDialogue([welcomeMessage]);
      setCurrentStep("scenario");
    } catch (err) {
      setError("Не удалось загрузить сценарий. Попробуйте еще раз.");
      setCurrentStep("selection");
    } finally {
      setIsLoading(false);
    }
  };

  // Отправка сообщения пользователя
  const sendMessage = async () => {
    if (!userInput.trim() || !currentSession || isGeneratingResponse) return;

    const userMessage: DialogueMessage = {
      id: Date.now().toString(),
      speaker: "user",
      content: userInput.trim(),
      timestamp: new Date(),
    };

    setDialogue((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsGeneratingResponse(true);

    try {
      const aiResponse =
        await personalizedScenariosService.generateDialogueResponse(
          currentSession.id,
          userInput.trim(),
          currentSession,
        );

      setDialogue((prev) => [...prev, aiResponse]);

      // Обновляем прогресс
      setCurrentSession((prev) =>
        prev
          ? {
              ...prev,
              currentStep: prev.currentStep + 1,
              userProgress: {
                ...prev.userProgress,
                timeSpent: prev.userProgress.timeSpent + 1,
              },
            }
          : null,
      );
    } catch (err) {
      const errorMessage: DialogueMessage = {
        id: Date.now().toString(),
        speaker: "ai",
        content: "Извините, произошла ошибка. Попробуйте еще раз.",
        timestamp: new Date(),
      };
      setDialogue((prev) => [...prev, errorMessage]);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  // Воспроизведение речи
  const playAudio = async (text: string) => {
    try {
      await personalizedScenariosService.speak(text);
    } catch (error) {
      // Обработка ошибки
    }
  };

  // Обработка Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Рендер экрана выбора интересов
  const renderInterestSelection = () => (
    <div className="space-y-8">
      {/* Заголовок с улучшенной анимацией */}
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-4"
        >
          <div className="inline-flex items-center space-x-2 glass bg-gradient-to-r from-german-red/10 to-german-gold/10 px-6 py-3 rounded-full">
            <Sparkles className="h-5 w-5 text-german-red dark:text-pink-500" />
            <span className="text-sm font-medium text-german-red dark:text-pink-500">
              AI-персонализация
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black gradient-text">
            Персональные сценарии
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Выберите то, что вас интересует, и изучайте немецкий через
            увлекательные диалоги с реальными собеседниками!
          </p>
        </motion.div>
      </div>

      {/* Выбор уровня с улучшенным дизайном */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Ваш уровень немецкого:</h3>
          <p className="text-muted-foreground">
            Выберите уровень для персонализации диалогов
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {levels.map((level, index) => (
            <motion.button
              key={level.value}
              onClick={() => setSelectedLevel(level.value)}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 glass-hover ${
                selectedLevel === level.value
                  ? `${level.color} text-white shadow-lg scale-105`
                  : "glass text-muted-foreground hover:text-foreground hover:border-german-red/50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
            >
              {level.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Выбор интересов с улучшенными карточками */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Выберите тему для диалога:</h3>
          <p className="text-muted-foreground">
            Каждая тема предлагает уникального собеседника
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INTERESTS_DATA.map((interest, index) => (
            <motion.div
              key={interest.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.1 * index,
                duration: 0.5,
                ease: "easeOut"
              }}
              whileHover={{ y: -5 }}
            >
              <Card
                className={`group cursor-pointer transition-all duration-500 border-2 hover-lift ${
                  selectedInterest === interest.id
                    ? "border-german-red bg-gradient-to-br from-german-red/10 to-german-gold/10 shadow-2xl scale-105"
                    : "border-border hover:border-german-red/50 glass"
                }`}
                onClick={() => setSelectedInterest(interest.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                      {interest.icon}
                    </div>
                    {selectedInterest === interest.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-german-red text-white rounded-full p-1"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </motion.div>
                    )}
                  </div>
                  <CardTitle className="text-lg group-hover:text-german-red dark:group-hover:text-pink-500 transition-colors duration-300">
                    {interest.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {interest.description}
                  </p>
                  <div className="flex items-center text-xs text-german-red dark:text-pink-500">
                    <Users className="h-3 w-3 mr-1" />
                    <span>Реальный собеседник</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Кнопка старта с градиентом */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-center"
      >
        <Button
          onClick={startScenario}
          disabled={!selectedInterest}
          size="lg"
          className="px-12 py-6 text-lg font-semibold gradient-button text-white shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl"
        >
          <Play className="h-6 w-6 mr-3" />
          Начать сценарий
          <ChevronRight className="h-6 w-6 ml-3" />
        </Button>
      </motion.div>
    </div>
  );

  // Рендер экрана загрузки с улучшенной анимацией
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center space-y-8 py-20">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="h-20 w-20 glass rounded-full flex items-center justify-center bg-gradient-to-r from-german-red/20 to-german-gold/40"
        >
          <Sparkles className="h-10 w-10 text-german-red dark:text-pink-500" />
        </motion.div>
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-german-red dark:border-t-pink-500"
          animate={{ rotate: -360 }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </motion.div>
      <div className="text-center space-y-4">
        <motion.h3
          className="text-2xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Подбираем собеседника...
        </motion.h3>
        <motion.p
          className="text-muted-foreground text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Создаем персональный сценарий на основе ваших интересов
        </motion.p>
        <motion.div
          className="flex items-center justify-center space-x-2 text-sm text-german-red dark:text-pink-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Анализируем уровень и предпочтения...</span>
        </motion.div>
      </div>
    </div>
  );

  // Рендер сценария с реальными аватарками
  const renderScenario = () => (
    <div className="space-y-6">
      {/* Заголовок сценария с аватаркой собеседника */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 rounded-2xl space-y-4 bg-gradient-to-r from-card/50 to-card"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Аватарка AI-собеседника */}
            {aiAvatar && (
              <div className="relative">
                <div className="h-16 w-16 rounded-full overflow-hidden ring-4 ring-german-red/20 dark:ring-pink-500/20">
                  <Image
                    src={aiAvatar.url}
                    alt={aiAvatar.alt}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white dark:border-gray-900" />
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-xl font-bold">{scenarioContent?.scenario}</h2>
                {aiAvatar && (
                  <Badge variant="outline" className="text-xs">
                    с {aiAvatar.name}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Badge variant="outline">{selectedLevel}</Badge>
                <span>•</span>
                <Clock className="h-4 w-4" />
                <span>15-20 мин</span>
                <span>•</span>
                <Users className="h-4 w-4" />
                <span>Реальный диалог</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Очищаем кэш аватарки при смене сценария
              if (currentSession) {
                AvatarService.clearSessionCache(currentSession.id);
              }
              setCurrentStep("selection");
            }}
            className="glass"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Изменить
          </Button>
        </div>

        {/* Цели урока */}
        {scenarioContent?.objectives && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center">
              <Target className="h-4 w-4 mr-2 text-german-red dark:text-pink-500" />
              Цели урока:
            </h4>
            <div className="flex flex-wrap gap-2">
              {scenarioContent.objectives.map((objective, index) => (
                <Badge key={objective} variant="secondary" className="text-xs">
                  {objective}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Диалог с реальными аватарками */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border bg-gradient-to-r from-card/50 to-card">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center">
              <MessageCircle className="h-4 w-4 mr-2 text-german-red dark:text-pink-500" />
              Диалог {aiAvatar && `с ${aiAvatar.name}`}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>
                Шаг {currentSession?.currentStep || 0}/
                {currentSession?.totalSteps || 10}
              </span>
            </div>
          </div>
        </div>

        {/* Сообщения с улучшенными аватарками */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {dialogue.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.speaker === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start space-x-3 max-w-[80%] ${
                    message.speaker === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {/* Аватарка с реальным изображением для AI */}
                  <div className="flex-shrink-0">
                    {message.speaker === "user" ? (
                      <div className="w-8 h-8 rounded-full glass flex items-center justify-center bg-gradient-to-r from-german-red/20 to-german-gold/40">
                        <User className="w-4 h-4 text-german-red dark:text-pink-500" />
                      </div>
                    ) : (
                      aiAvatar && (
                        <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-german-red/20 dark:ring-pink-500/20">
                          <Image
                            src={aiAvatar.url}
                            alt={aiAvatar.alt}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                      )
                    )}
                  </div>

                  <div className="group relative">
                    <div
                      className={`glass rounded-2xl p-3 ${
                        message.speaker === "user"
                          ? "bg-gradient-to-r from-german-red/10 to-german-gold/20"
                          : "bg-card"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>
                      {/* Перевод для немецких фраз */}
                      {message.germanText && message.russianTranslation && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <p className="text-xs text-muted-foreground italic">
                            {message.russianTranslation}
                          </p>
                        </div>
                      )}
                      {/* Обратная связь */}
                      {message.feedback && (
                        <div className="mt-2 p-2 glass rounded-lg bg-green-500/10">
                          <p className="text-xs text-green-600">
                            {message.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                    {/* Кнопка озвучивания */}
                    {message.germanText && (
                      <button
                        onClick={() => message.germanText && playAudio(message.germanText)}
                        className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity glass-hover p-2 rounded-lg text-muted-foreground hover:text-foreground"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Индикатор печатания с аватаркой */}
          {isGeneratingResponse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3">
                {aiAvatar && (
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-german-red/20 dark:ring-pink-500/20">
                    <Image
                      src={aiAvatar.url}
                      alt={aiAvatar.alt}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="glass bg-card rounded-2xl p-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3].map((dot) => (
                        <motion.div
                          key={dot}
                          className="w-2 h-2 bg-german-red dark:bg-pink-500 rounded-full"
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1.2, 0.8],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: dot * 0.2,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {aiAvatar?.name} печатает...
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Поле ввода */}
        <div className="p-4 border-t border-border bg-gradient-to-r from-card/50 to-card">
          <div className="flex space-x-3">
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Напишите ваш ответ на немецком языке..."
                className="min-h-[60px] resize-none"
                disabled={isGeneratingResponse}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                onClick={sendMessage}
                disabled={!userInput.trim() || isGeneratingResponse}
                size="sm"
                className="px-4 py-2 gradient-button-variant"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="px-4 py-2"
                onClick={() => {
                  // Здесь можно добавить функцию записи голоса
                }}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Прогресс и статистика с улучшенным дизайном */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="glass glass-hover">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-german-red dark:text-pink-500" />
              <span className="text-sm font-medium">Прогресс</span>
            </div>
            <div className="text-2xl font-bold">
              {Math.round(
                ((currentSession?.currentStep || 0) /
                  (currentSession?.totalSteps || 10)) *
                  100,
              )}
              %
            </div>
          </CardContent>
        </Card>
        <Card className="glass glass-hover">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Слова изучено</span>
            </div>
            <div className="text-2xl font-bold">
              {scenarioContent?.vocabulary?.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="glass glass-hover">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Мотивация</span>
            </div>
            <div className="text-2xl font-bold">98%</div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  // Главный рендер
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Ошибки */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 glass bg-red-500/10 border border-red-500/20 rounded-lg text-red-600"
          >
            {error}
          </motion.div>
        )}

        {/* Контент по шагам */}
        <AnimatePresence mode="wait">
          {currentStep === "selection" && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {renderInterestSelection()}
            </motion.div>
          )}
          {currentStep === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              {renderLoading()}
            </motion.div>
          )}
          {currentStep === "scenario" && (
            <motion.div
              key="scenario"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderScenario()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
