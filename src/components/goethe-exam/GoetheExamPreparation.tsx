"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  BookOpen,
  Target,
  CheckCircle,
  ArrowRight,
  Clock,
  Zap,
  Trophy,
  Users,
  Download
} from "lucide-react";
import Link from "next/link";
interface PreparationPhase {
  phase: number;
  title: string;
  duration: string;
  description: string;
  goals: string[];
  activities: string[];
  resources: string[];
  icon: typeof BookOpen;
  color: string;
}
const preparationPhases: PreparationPhase[] = [
  {
    phase: 1,
    title: "Диагностика и планирование",
    duration: "1-2 недели",
    description: "Определение текущего уровня и составление индивидуального плана подготовки",
    goals: [
      "Определить текущий уровень языка",
      "Выявить слабые места",
      "Составить план подготовки",
      "Выбрать ресурсы и материалы"
    ],
    activities: [
      "Пройти пробный тест",
      "Оценить навыки по 4 модулям",
      "Составить расписание занятий",
      "Подобрать учебные материалы"
    ],
    resources: [
      "Тест на определение уровня YourDeutsch",
      "Пробные экзамены Goethe-Institut",
      "Планнер для изучения языка",
      "Список рекомендованных учебников"
    ],
    icon: Target,
    color: "blue"
  },
  {
    phase: 2,
    title: "Систематическое изучение",
    duration: "2-6 месяцев",
    description: "Интенсивное изучение материала с фокусом на все четыре языковых навыка",
    goals: [
      "Укрепить грамматическую базу",
      "Расширить словарный запас",
      "Развить навыки чтения и аудирования",
      "Практиковать письмо и говорение"
    ],
    activities: [
      "Ежедневные занятия по 1-2 часа",
      "Еженедельные практические тесты",
      "Разговорная практика с партнёрами",
      "Ведение словаря и грамматических заметок"
    ],
    resources: [
      "Курсы YourDeutsch по уровням",
      "Учебники Aspekte/Menschen/Netzwerk",
      "Приложения Babbel/Busuu",
      "Подкасты Deutsche Welle/ARD"
    ],
    icon: BookOpen,
    color: "green"
  },
  {
    phase: 3,
    title: "Интенсивная подготовка",
    duration: "4-8 недель",
    description: "Целенаправленная подготовка к экзамену с упором на формат и стратегии",
    goals: [
      "Изучить формат экзамена детально",
      "Отработать стратегии для каждого модуля",
      "Решить максимум пробных тестов",
      "Довести навыки до автоматизма"
    ],
    activities: [
      "Ежедневные пробные тесты",
      "Разбор ошибок и слабых мест",
      "Практика в условиях экзамена",
      "Работа с экзаменационными материалами"
    ],
    resources: [
      "Официальные тесты Goethe-Institut",
      "Сборники Fit fürs Goethe-Zertifikat",
      "Онлайн-платформы для тестирования",
      "Индивидуальные занятия с преподавателем"
    ],
    icon: Zap,
    color: "orange"
  },
  {
    phase: 4,
    title: "Финальная подготовка",
    duration: "1-2 недели",
    description: "Последние штрихи, повторение и психологическая подготовка к экзамену",
    goals: [
      "Повторить сложные темы",
      "Настроиться психологически",
      "Подготовить документы",
      "Отработать тайминг"
    ],
    activities: [
      "Лёгкое повторение материала",
      "Релаксация и медитация",
      "Симуляция экзамена",
      "Подготовка к дню экзамена"
    ],
    resources: [
      "Чек-лист подготовки к экзамену",
      "Техники управления стрессом",
      "Информация о дне экзамена",
      "Мотивационные материалы"
    ],
    icon: Trophy,
    color: "purple"
  }
];
const studyTips = [
  {
    icon: Calendar,
    title: "Регулярность",
    description: "Занимайтесь каждый день минимум 30-60 минут"
  },
  {
    icon: Target,
    title: "Цели",
    description: "Ставьте конкретные достижимые цели на каждую неделю"
  },
  {
    icon: Users,
    title: "Практика",
    description: "Найдите языкового партнёра для разговорной практики"
  },
  {
    icon: CheckCircle,
    title: "Контроль",
    description: "Регулярно проверяйте свой прогресс тестами"
  }
];
const getPhaseColor = (color: string) => {
  const colors = {
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    orange: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
  };
  return colors[color as keyof typeof colors] || colors.blue;
};
export function GoetheExamPreparation() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              План подготовки
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black mb-6 gradient-text">
              Пошаговая подготовка к экзамену
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Структурированный план подготовки поможет вам эффективно использовать время и
              достичь нужного уровня для успешной сдачи экзамена Гёте.
            </p>
          </motion.div>
        </div>
        {/* Preparation Phases */}
        <div className="space-y-8 mb-16">
          {preparationPhases.map((phase, index) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all group border-2 hover:border-german-red/30 dark:hover:border-dark-theme-pink/30">
                <div className={`h-2 ${phase.color === 'blue' ? 'bg-blue-500' :
                  phase.color === 'green' ? 'bg-green-500' :
                  phase.color === 'orange' ? 'bg-orange-500' :
                  'bg-purple-500'}`} />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-muted/50">
                        <phase.icon className="h-8 w-8 text-german-red dark:text-dark-theme-pink" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={`font-bold ${getPhaseColor(phase.color)}`}>
                            Этап {phase.phase}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {phase.duration}
                          </Badge>
                        </div>
                        <CardTitle className="text-2xl group-hover:text-german-red dark:group-hover:text-dark-theme-pink transition-colors">
                          {phase.title}
                        </CardTitle>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    {phase.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Goals */}
                    <div>
                      <h4 className="font-semibold mb-3 text-sm text-foreground flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Цели этапа:
                      </h4>
                      <ul className="space-y-2">
                        {phase.goals.map((goal, goalIndex) => (
                          <li key={goalIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Activities */}
                    <div>
                      <h4 className="font-semibold mb-3 text-sm text-foreground flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Основные активности:
                      </h4>
                      <ul className="space-y-2">
                        {phase.activities.map((activity, activityIndex) => (
                          <li key={activityIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-german-red dark:bg-dark-theme-pink mt-2 flex-shrink-0" />
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Resources */}
                    <div>
                      <h4 className="font-semibold mb-3 text-sm text-foreground flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Рекомендуемые ресурсы:
                      </h4>
                      <div className="space-y-2">
                        {phase.resources.map((resource, resourceIndex) => (
                          <Badge
                            key={resourceIndex}
                            variant="secondary"
                            className="text-xs bg-muted/50 text-foreground block text-left justify-start p-2 h-auto"
                          >
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {/* Study Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-muted/30 rounded-2xl p-8 border border-muted">
            <h3 className="text-2xl font-bold text-center mb-8">
              Секреты эффективной подготовки
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {studyTips.map((tip, index) => (
                <div key={index} className="text-center group">
                  <div className="p-4 rounded-full bg-white dark:bg-gray-800 shadow-lg mb-4 mx-auto w-fit group-hover:scale-110 transition-transform">
                    <tip.icon className="h-8 w-8 text-german-red dark:text-dark-theme-pink" />
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">{tip.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-muted/30 rounded-2xl p-8 border border-muted">
            <h3 className="text-2xl font-bold mb-4">
              Готовы начать подготовку?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Используйте наши курсы и ресурсы для структурированной подготовки к экзамену Гёте.
              Начните с определения своего уровня и следуйте нашему проверенному плану.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/level-test">
                <Button size="lg" className="bg-german-red hover:bg-german-dark-red text-white">
                  <Target className="h-5 w-5 mr-2" />
                  Определить уровень
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/lessons">
                <Button size="lg" variant="outline">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Начать обучение
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
