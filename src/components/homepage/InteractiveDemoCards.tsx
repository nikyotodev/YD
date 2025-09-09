"use client";
import { useState, useCallback, memo, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle,
  BookOpen,
  Headphones,
  Play,
  ArrowRight,
  CheckCircle2,
  Mic,
  Volume2,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
interface DemoCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  demoType: "chat" | "pronunciation";
  gradient: string;
}
// Мемоизированный компонент демо чата
const ChatDemo = memo(
  ({
    demoStep,
    setDemoStep,
  }: {
    demoStep: number;
    setDemoStep: (step: number | ((s: number) => number)) => void;
  }) => {
    const messages = useMemo(
      () => [
        {
          id: "msg-1",
          type: "ai",
          text: "Привет! Как дела с изучением немецкого?",
        },
        {
          id: "msg-2",
          type: "user",
          text: "Нормально! Помогите разобраться с произношением",
        },
        {
          id: "msg-3",
          type: "ai",
          text: "Конечно! Давайте начнем с базовых звуков 🎯",
        },
      ],
      [],
    );
    return (
      <div className="space-y-3">
        {messages.slice(0, demoStep + 1).map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs rounded-lg p-3 text-sm ${
                msg.type === "ai"
                  ? "bg-muted text-foreground"
                  : "bg-german-red/20 text-foreground dark:bg-dark-theme-purple/20"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {demoStep < messages.length - 1 && (
          <Button
            size="sm"
            onClick={() => setDemoStep((s) => s + 1)}
            className="w-full"
          >
            Продолжить диалог
          </Button>
        )}
      </div>
    );
  },
);
ChatDemo.displayName = "ChatDemo";
// Мемоизированный компонент демо произношения
const PronunciationDemo = memo(
  ({
    demoStep,
    setDemoStep,
  }: {
    demoStep: number;
    setDemoStep: (step: number | ((s: number) => number)) => void;
  }) => {
    const pronunciationWords = useMemo(
      () => [
        { word: "Brot", phonetic: "[broːt]", meaning: "хлеб" },
        { word: "Schule", phonetic: "[ˈʃuːlə]", meaning: "школа" },
      ],
      [],
    );
    const current = pronunciationWords[demoStep] || pronunciationWords[0];
    return (
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 p-6 rounded-xl border border-white/10">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            {current.word}
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            {current.phonetic}
          </div>
          <div className="text-base text-foreground mb-4">
            {current.meaning}
          </div>
          <div className="flex gap-2 justify-center">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Volume2 className="h-4 w-4" />
              Слушать
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Mic className="h-4 w-4" />
              Записать
            </Button>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => setDemoStep((s) => (s + 1) % 2)}
          className="w-full"
        >
          Следующее слово
        </Button>
      </div>
    );
  },
);
PronunciationDemo.displayName = "PronunciationDemo";
export const InteractiveDemoCards = memo(function InteractiveDemoCards() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [demoStep, setDemoStep] = useState(0);
  const demoCards: DemoCard[] = useMemo(
    () => [
      {
        id: "chat",
        title: "AI Разговор",
        description: "Попробуйте общение с ИИ-учителем",
        icon: <MessageCircle className="h-6 w-6" />,
        demoType: "chat",
        gradient: "from-german-red/10 to-german-gold/10",
      },
      {
        id: "pronunciation",
        title: "Произношение",
        description: "Тренируйте немецкое произношение",
        icon: <Headphones className="h-6 w-6" />,
        demoType: "pronunciation",
        gradient: "from-green-500/10 to-emerald-500/10",
      },
    ],
    [],
  );
  const startDemo = useCallback((demoId: string) => {
    setActiveDemo(demoId);
    setDemoStep(0);
  }, []);
  const resetDemo = useCallback(() => {
    setActiveDemo(null);
    setDemoStep(0);
  }, []);
  const renderDemoContent = useCallback(() => {
    switch (activeDemo) {
      case "chat":
        return <ChatDemo demoStep={demoStep} setDemoStep={setDemoStep} />;
      case "pronunciation":
        return (
          <PronunciationDemo demoStep={demoStep} setDemoStep={setDemoStep} />
        );
      default:
        return null;
    }
  }, [activeDemo, demoStep]);
  const activeCard = useMemo(
    () => demoCards.find((c) => c.id === activeDemo),
    [demoCards, activeDemo],
  );
  return (
    <div className="mb-16 md:mb-24">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-4xl font-black gradient-text mb-4">
          Попробуйте прямо сейчас
        </h2>
        <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
          Никакой регистрации — просто выберите демо и начните изучать немецкий
        </p>
      </div>
      {!activeDemo ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto px-4">
          {demoCards.map((card) => (
            <Card
              key={card.id}
              className="glass-card group cursor-pointer transition-all hover:scale-[1.02] border border-white/10 h-full"
              onClick={() => startDemo(card.id)}
            >
              <CardContent className="p-6 h-full flex flex-col">
                <div
                  className={`glass p-4 bg-gradient-to-br ${card.gradient} rounded-2xl w-fit mb-4 group-hover:scale-110 transition-all`}
                >
                  <div className="text-foreground">{card.icon}</div>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:gradient-text transition-all">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-grow">
                  {card.description}
                </p>
                <Button size="sm" className="w-full group mt-auto">
                  <Play className="h-4 w-4 mr-2" />
                  Попробовать
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto px-4">
          <Card className="glass-card border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">{activeCard?.title}</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={resetDemo}
                  className="h-8 w-8 p-0"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              {renderDemoContent()}
              <div className="mt-6 pt-4 border-t border-border/50">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-3">
                    Понравилось? Получите полный доступ
                  </p>
                  <Link href="/lessons">
                    <Button size="sm" className="w-full">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Начать бесплатно
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
});
