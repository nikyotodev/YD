"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  MessageCircle,
  Users,
  Trophy,
  Sparkles,
  Play,
  Headphones,
} from "lucide-react";
import Link from "next/link";
import { QuickLevelTestCard } from "./QuickLevelTestCard";
interface MainFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
  gradient: string;
  comingSoon?: boolean;
}
export function MainFeaturesSection() {
  const mainFeatures: MainFeature[] = [
    {
      id: "lessons",
      title: "Интерактивные уроки",
      description:
        "Структурированная программа от A1 до C2 с персональным AI-помощником",
      icon: <BookOpen className="h-6 w-6" />,
      href: "/lessons",
      badge: "Популярно",
      gradient: "from-german-red/10 to-german-gold/10",
    },
    {
      id: "chat",
      title: "AI-преподаватель",
      description:
        "Общайтесь с умным ботом, который адаптируется под ваш уровень",
      icon: <MessageCircle className="h-6 w-6" />,
      href: "/chat",
      badge: "Новинка",
      gradient: "from-blue-500/10 to-indigo-500/10",
    },
    {
      id: "pronunciation",
      title: "Произношение",
      description: "Тренируйте немецкое произношение с помощью AI-анализа речи",
      icon: <Headphones className="h-6 w-6" />,
      href: "/pronunciation",
      badge: "Скоро",
      gradient: "from-green-500/10 to-emerald-500/10",
      comingSoon: true,
    },
    {
      id: "exams",
      title: "Подготовка к экзаменам",
      description:
        "Готовьтесь к Goethe, TestDaF и другим официальным экзаменам",
      icon: <Trophy className="h-6 w-6" />,
      href: "/goethe-tests",
      gradient: "from-amber-500/10 to-orange-500/10 dark:from-purple-600/10 dark:to-pink-500/10",
    },
    {
      id: "culture",
      title: "Культура Германии",
      description:
        "Изучайте историю, традиции и современную жизнь немецкоязычных стран",
      icon: <Users className="h-6 w-6" />,
      href: "/culture",
      gradient: "from-rose-500/10 to-red-500/10",
    },
  ];
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center mb-4 glass-nav animate-shimmer">
            <Sparkles className="h-4 w-4 mr-2 text-german-red dark:text-dark-theme-pink" />
            <span className="gradient-text font-medium text-sm md:text-base">
              Все инструменты в одном месте
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black gradient-text mb-4">
            Выберите свой путь обучения
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
            От базовых уроков до подготовки к экзаменам — найдите подходящий
            формат
          </p>
        </div>
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto mb-8">
          {mainFeatures.map((feature) => (
            <Card
              key={feature.id}
              className="glass-card group cursor-pointer transition-all hover:scale-[1.02] border border-white/10 h-full"
            >
              <CardContent className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`glass p-3 bg-gradient-to-br ${feature.gradient} rounded-2xl group-hover:scale-110 transition-all`}
                  >
                    <div className="text-foreground">{feature.icon}</div>
                  </div>
                  {feature.badge && (
                    <Badge
                      variant={
                        feature.badge === "Популярно"
                          ? "default"
                          : feature.comingSoon
                            ? "secondary"
                            : "destructive"
                      }
                      className="glass text-xs"
                    >
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                {/* Content */}
                <h3 className="text-lg font-bold mb-2 group-hover:gradient-text transition-all">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-grow">
                  {feature.description}
                </p>
                {/* CTA */}
                <Link href={feature.href} className="mt-auto">
                  <Button
                    size="sm"
                    className="w-full group"
                    variant={feature.comingSoon ? "outline" : "default"}
                    disabled={feature.comingSoon}
                  >
                    {feature.comingSoon ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Скоро
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Начать
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Quick level test card - more prominent placement */}
        <div className="max-w-md mx-auto">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">
              Не знаете, с чего начать?
            </p>
          </div>
          <QuickLevelTestCard />
        </div>
      </div>
    </section>
  );
}
