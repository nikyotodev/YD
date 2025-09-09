"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OptimizedLevelTest } from "@/components/OptimizedLevelTest";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LEVEL_DESCRIPTIONS } from "@/lib/level-specific-tests";
import type { GermanLevel } from "@/types/level-test";
import { Brain, Target, Clock, Award, ArrowRight, CheckCircle2, Users, BookOpen } from "lucide-react";
import { useState } from "react";
const LEVELS: GermanLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
// Утилита для получения стилей уровня в German theme
const getLevelStyles = (level: GermanLevel) => {
  switch (level) {
    case "A1":
    case "A2":
      return {
        gradient: "from-german-red/10 to-german-gold/10 dark:from-dark-theme-pink/10 dark:to-dark-theme-purple/10",
        border: "border-german-red/20 dark:border-dark-theme-pink/20",
        badge: "bg-german-red/10 text-german-red dark:bg-dark-theme-pink/10 dark:text-dark-theme-pink",
        dot: "bg-german-red dark:bg-dark-theme-pink"
      };
    case "B1":
    case "B2":
      return {
        gradient: "from-german-gold/10 to-german-red/10 dark:from-dark-theme-purple/10 dark:to-dark-theme-pink/10",
        border: "border-german-gold/20 dark:border-dark-theme-purple/20",
        badge: "bg-german-gold/10 text-german-dark-red dark:bg-dark-theme-purple/10 dark:text-dark-theme-purple",
        dot: "bg-german-gold dark:bg-dark-theme-purple"
      };
    case "C1":
    case "C2":
      return {
        gradient: "from-german-red/15 to-german-gold/15 dark:from-dark-theme-pink/15 dark:to-dark-theme-purple/15",
        border: "border-german-red/30 dark:border-dark-theme-pink/30",
        badge: "bg-german-red/15 text-german-dark-red dark:bg-dark-theme-pink/15 dark:text-dark-theme-pink",
        dot: "bg-gradient-to-r from-german-red to-german-gold dark:from-dark-theme-pink dark:to-dark-theme-purple"
      };
  }
};
// Компонент карточки уровня
function LevelCard({ level, onSelect }: { level: GermanLevel; onSelect: (level: GermanLevel) => void }) {
  const { title, description, passThreshold } = LEVEL_DESCRIPTIONS[level];
  const styles = getLevelStyles(level);
  const getLevelTitle = (level: GermanLevel) => {
    switch (level) {
      case "A1": return "Начальный уровень";
      case "A2": return "Элементарный уровень";
      case "B1": return "Средний уровень";
      case "B2": return "Продвинутый уровень";
      case "C1": return "Высокий уровень";
      case "C2": return "Профессиональный уровень";
    }
  };
  return (
    <Card
      className={`glass border-2 bg-gradient-to-br ${styles.gradient} ${styles.border} hover:scale-105 transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-german-red/10 dark:hover:shadow-dark-theme-pink/10`}
      onClick={() => onSelect(level)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <Badge className={styles.badge}>
            {level}
          </Badge>
          <div className={`w-3 h-3 rounded-full ${styles.dot}`} />
        </div>
        <CardTitle className="text-xl font-bold text-foreground">
          {getLevelTitle(level)}
        </CardTitle>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description.replace(`Ответьте на 20 вопросов и узнайте, соответствуют ли Ваши знания уровню ${level}.`, "")}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center text-muted-foreground">
              <Target className="h-4 w-4 mr-2 text-german-red dark:text-dark-theme-pink" />
              Вопросов
            </span>
            <span className="font-medium">20</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-2 text-german-gold dark:text-dark-theme-purple" />
              Время
            </span>
            <span className="font-medium">20 мин</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center text-muted-foreground">
              <Award className="h-4 w-4 mr-2 text-german-red dark:text-dark-theme-pink" />
              Проходной балл
            </span>
            <span className="font-medium">{passThreshold}%</span>
          </div>
        </div>
        <Button
          variant="german"
          size="lg"
          className="w-full group-hover:scale-105 transition-transform bg-gradient-to-r from-german-red to-german-gold dark:from-dark-theme-pink dark:to-dark-theme-purple hover:opacity-90"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(level);
          }}
        >
          Начать тест {level}
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}
export default function LevelTestPage() {
  const [selectedLevel, setSelectedLevel] = useState<GermanLevel | null>(null);
  if (selectedLevel) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-14 sm:pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => setSelectedLevel(null)}
                className="mb-4 border-german-red/20 text-german-red hover:bg-german-red/10 dark:border-dark-theme-pink/20 dark:text-dark-theme-pink dark:hover:bg-dark-theme-pink/10"
              >
                ← Назад к выбору уровня
              </Button>
            </div>
            <OptimizedLevelTest level={selectedLevel} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-german-red/5 to-german-gold/5 rounded-full blur-3xl animate-float dark:from-dark-theme-purple/10 dark:to-dark-theme-pink/10" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-german-gold/5 to-german-red/5 rounded-full blur-3xl animate-float animation-delay-2000 dark:from-dark-theme-pink/10 dark:to-dark-theme-purple/10" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-german-red/3 to-german-gold/3 rounded-full blur-3xl animate-glow dark:from-dark-theme-purple/5 dark:to-dark-theme-pink/5" />
      </div>
      <div className="relative pt-14 sm:pt-16">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-german-red/20 to-german-gold/20 dark:from-dark-theme-pink/20 dark:to-dark-theme-purple/20 rounded-full flex items-center justify-center mb-8 animate-glow">
              <Brain className="h-10 w-10 text-german-red dark:text-dark-theme-pink" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-german-red via-german-gold to-german-red dark:from-dark-theme-pink dark:via-dark-theme-purple dark:to-dark-theme-pink bg-clip-text text-transparent">
                Тесты по уровням
              </span>
              <br />
              <span className="text-foreground">немецкого языка</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Выберите уровень и проверьте свои знания. Каждый тест содержит 20 вопросов
              и покажет детальный анализ ваших результатов по стандартам CEFR.
            </p>
          </div>
          {/* Levels Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
            {LEVELS.map((level) => (
              <LevelCard key={level} level={level} onSelect={setSelectedLevel} />
            ))}
          </div>
          {/* Benefits Section */}
          <div className="mt-20">
            <Card className="glass max-w-5xl mx-auto border-german-red/10 dark:border-dark-theme-pink/10">
              <CardContent className="py-12">
                <h2 className="text-3xl font-bold text-center mb-12">
                  <span className="bg-gradient-to-r from-german-red to-german-gold dark:from-dark-theme-pink dark:to-dark-theme-purple bg-clip-text text-transparent">
                    Что вы получите?
                  </span>
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-german-red/20 to-german-gold/20 dark:from-dark-theme-pink/20 dark:to-dark-theme-purple/20 rounded-full flex items-center justify-center">
                      <Target className="h-8 w-8 text-german-red dark:text-dark-theme-pink" />
                    </div>
                    <h3 className="text-xl font-semibold">Точная оценка</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Проверьте соответствие ваших знаний конкретному уровню по международным стандартам
                    </p>
                  </div>
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-german-gold/20 to-german-red/20 dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20 rounded-full flex items-center justify-center">
                      <Brain className="h-8 w-8 text-german-gold dark:text-dark-theme-purple" />
                    </div>
                    <h3 className="text-xl font-semibold">Детальный анализ</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Разбор каждого вопроса с правильными ответами и подробными объяснениями
                    </p>
                  </div>
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-german-red/20 to-german-gold/20 dark:from-dark-theme-pink/20 dark:to-dark-theme-purple/20 rounded-full flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-german-red dark:text-dark-theme-pink" />
                    </div>
                    <h3 className="text-xl font-semibold">Персональные рекомендации</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Советы по изучению и ссылки на материалы для улучшения ваших навыков
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Stats Section */}
          <div className="mt-16">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="glass text-center border-german-red/10 dark:border-dark-theme-pink/10">
                <CardContent className="py-8">
                  <div className="text-3xl font-bold text-german-red dark:text-dark-theme-pink mb-2">20+</div>
                  <p className="text-muted-foreground">Вопросов в каждом тесте</p>
                </CardContent>
              </Card>
              <Card className="glass text-center border-german-gold/10 dark:border-dark-theme-purple/10">
                <CardContent className="py-8">
                  <div className="text-3xl font-bold text-german-gold dark:text-dark-theme-purple mb-2">6</div>
                  <p className="text-muted-foreground">Уровней CEFR</p>
                </CardContent>
              </Card>
              <Card className="glass text-center border-german-red/10 dark:border-dark-theme-pink/10">
                <CardContent className="py-8">
                  <div className="text-3xl font-bold text-german-red dark:text-dark-theme-pink mb-2">100%</div>
                  <p className="text-muted-foreground">Бесплатно навсегда</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
