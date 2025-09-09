"use client";
import { useState, useEffect, memo, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle,
  ArrowRight,
  Star,
  Book,
  Clock,
  Zap,
  CheckCircle2,
  User,
  Play,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
interface ChatMessage {
  id: number;
  type: "ai" | "user";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}
export const PersonalAITeacher = memo(function PersonalAITeacher() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const conversationFlow: Omit<ChatMessage, "id" | "timestamp">[] = useMemo(
    () => [
      {
        type: "ai",
        content:
          "Привет! Я Эмилия, твой персональный преподаватель немецкого языка. Как дела с изучением? Чем могу помочь? 👋",
      },
      {
        type: "user",
        content:
          "Привет! Я изучаю немецкий уже 2 месяца, но у меня проблемы с артиклями.",
      },
      {
        type: "ai",
        content:
          "Понимаю! Артикли - это действительно сложная тема. Но есть хорошие новости! 🎯 Существуют закономерности. Например, слова с окончанием -ung почти всегда женского рода: die Zeitung, die Wohnung.",
      },
      {
        type: "user",
        content:
          "Интересно! А есть ли такие правила для мужского и среднего рода?",
      },
      {
        type: "ai",
        content:
          "Конечно есть! 📚 Мужской род: слова на -er (der Lehrer), -ismus (der Tourismus). Средний род: -chen (das Mädchen), -um (das Museum). Хочешь потренироваться на примерах?",
      },
      {
        type: "user",
        content:
          "Да, было бы здорово! Можете дать мне несколько примеров для тренировки?",
      },
      {
        type: "ai",
        content:
          "Отлично! 🌟 Попробуй определить артикли: 1) ___ Freiheit (свобода) 2) ___ Mädchen (девочка) 3) ___ Lehrer (учитель). Подсказка: вспомни правила окончаний!",
      },
    ],
    [],
  );
  const teacherStats = useMemo(
    () => [
      {
        id: "rating",
        icon: <Star className="h-5 w-5" />,
        title: "4.9/5",
        subtitle: "Рейтинг студентов",
      },
      {
        id: "lessons",
        icon: <Book className="h-5 w-5" />,
        title: "12,547",
        subtitle: "Проведенных уроков",
      },
      {
        id: "response-time",
        icon: <Clock className="h-5 w-5" />,
        title: "< 2 сек",
        subtitle: "Время ответа",
      },
    ],
    [],
  );
  const benefits = useMemo(
    () => [
      {
        id: "individual-approach",
        icon: <CheckCircle2 className="h-5 w-5" />,
        title: "Индивидуальный подход",
        description: "Адаптируется под ваш темп и стиль обучения",
      },
      {
        id: "instant-feedback",
        icon: <Zap className="h-5 w-5" />,
        title: "Мгновенная обратная связь",
        description: "Исправляет ошибки и объясняет правила сразу",
      },
      {
        id: "available-24-7",
        icon: <Clock className="h-5 w-5" />,
        title: "Доступен 24/7",
        description: "Учитесь в удобное для вас время",
      },
      {
        id: "infinite-patience",
        icon: <Star className="h-5 w-5" />,
        title: "Бесконечное терпение",
        description: "Повторит объяснение столько раз, сколько нужно",
      },
    ],
    [],
  );
  useEffect(() => {
    if (isPlaying && currentMessageIndex < conversationFlow.length) {
      const timer = setTimeout(
        () => {
          const newMessage: ChatMessage = {
            id: currentMessageIndex,
            ...conversationFlow[currentMessageIndex],
            timestamp: new Date(),
            isTyping: false,
          };
          setMessages((prev) => [...prev, newMessage]);
          setCurrentMessageIndex((prev) => prev + 1);
        },
        currentMessageIndex === 0 ? 500 : 2000,
      );
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentMessageIndex, conversationFlow]);
  const startDemo = useCallback(() => {
    setIsPlaying(true);
    setMessages([]);
    setCurrentMessageIndex(0);
  }, []);
  const resetDemo = useCallback(() => {
    setIsPlaying(false);
    setMessages([]);
    setCurrentMessageIndex(0);
  }, []);
  return (
    <div className="max-w-4xl mx-auto mb-16 md:mb-24 px-4">
      <Card className="glass-card bg-gradient-to-br from-white/5 to-white/10 border border-white/20">
        <CardContent className="p-6 md:p-8">
          {/* Заголовок */}
          <div className="text-center mb-6 md:mb-8 pb-6 border-b border-border/50">
            <div className="flex items-center justify-center mb-4">
              <div className="glass p-3 bg-gradient-to-br from-german-red/20 to-german-gold/20 rounded-full mr-3 dark:from-purple-600/30 dark:to-pink-500/30">
                <MessageCircle className="h-6 w-6 text-german-red dark:text-dark-theme-pink" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl md:text-3xl font-bold gradient-text">
                  Эмилия
                </h3>
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse dark:bg-green-400 inline-block" />
                  Ваш персональный AI-учитель
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-base md:text-lg">
              Адаптивное обучение • Индивидуальный подход • 24/7 поддержка
            </p>
          </div>
          {/* Информация об учителе */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:mb-8">
            {teacherStats.map((stat) => (
              <div
                key={stat.id}
                className="glass-card bg-gradient-to-br from-german-red/5 to-german-gold/5 dark:from-purple-600/10 dark:to-pink-500/10 text-center p-4"
              >
                <div className="flex justify-center mb-2">
                  <div className="text-german-red dark:text-dark-theme-pink">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-lg font-bold text-foreground">
                  {stat.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.subtitle}
                </div>
              </div>
            ))}
          </div>
          {/* Диалог */}
          <div className="mb-6 md:mb-8">
            {messages.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <div className="glass-card bg-gradient-to-br from-german-red/5 to-german-gold/5 dark:from-purple-600/10 dark:to-pink-500/10 p-6 md:p-8 max-w-md mx-auto">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-german-red/20 to-german-gold/20 dark:from-purple-600/30 dark:to-pink-500/30 flex items-center justify-center">
                      <MessageCircle className="h-8 w-8 text-german-red dark:text-dark-theme-pink" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold mb-2">
                    Готова начать урок?
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Посмотрите, как проходит типичный диалог с AI-учителем
                  </p>
                  <Button onClick={startDemo} className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Начать демо-урок
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 min-h-[300px] max-h-[400px] overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.type === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === "ai"
                          ? "glass bg-gradient-to-br from-german-red/15 to-german-gold/15 dark:from-purple-600/20 dark:to-pink-500/20"
                          : "glass bg-gradient-to-br from-blue-500/15 to-indigo-500/15"
                      }`}
                    >
                      {message.type === "ai" ? (
                        <MessageCircle className="w-5 h-5 text-german-red dark:text-dark-theme-pink" />
                      ) : (
                        <User className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div
                      className={`max-w-sm md:max-w-md rounded-2xl p-4 ${
                        message.type === "ai"
                          ? "glass bg-muted/50 text-foreground"
                          : "glass bg-gradient-to-r from-german-red/15 to-german-gold/15 border-german-red/20 text-foreground dark:from-purple-600/20 dark:to-pink-500/20 dark:border-pink-500/30"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
                {isPlaying && currentMessageIndex < conversationFlow.length && (
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full glass bg-gradient-to-br from-german-red/15 to-german-gold/15 dark:from-purple-600/20 dark:to-pink-500/20 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-german-red dark:text-dark-theme-pink" />
                    </div>
                    <div className="glass bg-muted/50 rounded-2xl p-4 max-w-sm md:max-w-md">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce animation-delay-100" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce animation-delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Кнопки управления */}
          {messages.length > 0 && (
            <div className="flex gap-3 mb-6 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={resetDemo}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Сначала
              </Button>
              {currentMessageIndex >= conversationFlow.length && (
                <Button
                  size="sm"
                  onClick={startDemo}
                  className="flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Повторить
                </Button>
              )}
            </div>
          )}
          {/* Преимущества персонального AI-учителя */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 md:mb-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="flex items-start space-x-3 p-4 glass-card bg-gradient-to-br from-german-red/5 to-german-gold/5 dark:from-purple-600/10 dark:to-pink-500/10"
              >
                <div className="text-german-red dark:text-dark-theme-pink flex-shrink-0 mt-1">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1 text-sm">
                    {benefit.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* Call to Action */}
          <div className="text-center pt-6 border-t border-border/50">
            <Link href="/chat">
              <Button
                variant="german"
                size="lg"
                className="group px-6 md:px-8 py-3"
              >
                <MessageCircle className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                Начать изучение с Эмилией
                <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-3 max-w-md mx-auto">
              Задавайте вопросы, изучайте грамматику и практикуйте немецкий в
              реальном времени
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
