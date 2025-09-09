"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Brain,
  Clock,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
// Динамический импорт для оптимизации загрузки
const LevelTest = dynamic(
  () =>
    import("@/components/LevelTest").then((mod) => ({
      default: mod.LevelTest,
    })),
  {
    ssr: false,
    loading: () => <LevelTestSkeleton />,
  },
);
// Компонент загрузки
const LevelTestSkeleton = () => (
  <Card className="w-full max-w-2xl mx-auto glass border-border/50">
    <CardContent className="py-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-muted rounded-full mx-auto animate-pulse" />
        <div className="h-6 bg-muted rounded w-3/4 mx-auto animate-pulse" />
        <div className="h-4 bg-muted rounded w-1/2 mx-auto animate-pulse" />
      </div>
    </CardContent>
  </Card>
);
export function LevelTestSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Фоновые декорации */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-8 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-8 w-40 h-40 bg-gradient-to-br from-german-gold/10 to-german-red/10 rounded-full blur-3xl animate-float animation-delay-2000" />
      </div>
      <div className="container mx-auto px-4 relative">
        {/* Заголовок секции */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center mb-4 glass-nav animate-shimmer">
            <Sparkles className="h-4 w-4 mr-2 text-german-red dark:text-dark-theme-pink" />
            <span className="gradient-text font-medium text-sm md:text-base">
              Узнайте свой уровень за 5 минут
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black gradient-text mb-4">
            Быстрый тест уровня
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Наш умный алгоритм точно определит ваш уровень немецкого языка и
            даст персональные рекомендации для эффективного обучения
          </p>
          {/* Преимущества */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="glass p-4 rounded-lg text-center">
              <Clock className="h-6 w-6 text-german-gold mx-auto mb-2" />
              <p className="text-sm font-medium">5 минут</p>
              <p className="text-xs text-muted-foreground">Быстрый тест</p>
            </div>
            <div className="glass p-4 rounded-lg text-center">
              <Brain className="h-6 w-6 text-german-red dark:text-dark-theme-pink mx-auto mb-2" />
              <p className="text-sm font-medium">AI алгоритм</p>
              <p className="text-xs text-muted-foreground">Умная оценка</p>
            </div>
            <div className="glass p-4 rounded-lg text-center">
              <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Точность</p>
              <p className="text-xs text-muted-foreground">95% точности</p>
            </div>
            <div className="glass p-4 rounded-lg text-center">
              <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Рекомендации</p>
              <p className="text-xs text-muted-foreground">Персональный план</p>
            </div>
          </div>
        </div>
        {/* Компонент теста */}
        <Suspense fallback={<LevelTestSkeleton />}>
          <LevelTest />
        </Suspense>
        {/* Дополнительная информация */}
        <div className="text-center mt-12">
          <div className="glass-nav inline-flex items-center px-4 py-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            <span>Уже протестировали более 2,500 студентов</span>
          </div>
        </div>
      </div>
    </section>
  );
}
