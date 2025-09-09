"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Headphones,
  PenTool,
  MessageSquare,
  Clock,
  FileText,
  Volume2,
  Users,
  AlertCircle
} from "lucide-react";
interface ExamModule {
  skill: string;
  icon: typeof BookOpen;
  duration: string;
  tasks: number;
  points: number;
  percentage: number;
  description: string;
  details: string[];
  tips: string[];
}
const examModules: ExamModule[] = [
  {
    skill: "Чтение (Lesen)",
    icon: BookOpen,
    duration: "65 минут",
    tasks: 4,
    points: 25,
    percentage: 25,
    description: "Понимание письменных текстов различных жанров и стилей",
    details: [
      "Задание 1: Краткие тексты и объявления",
      "Задание 2: Газетные статьи и отрывки",
      "Задание 3: Длинные тексты с детальным пониманием",
      "Задание 4: Выражение мнения к прочитанному"
    ],
    tips: [
      "Читайте ежедневно немецкие новости",
      "Практикуйте skimming и scanning",
      "Изучайте различные типы текстов",
      "Увеличивайте скорость чтения"
    ]
  },
  {
    skill: "Аудирование (Hören)",
    icon: Headphones,
    duration: "40 минут",
    tasks: 4,
    points: 25,
    percentage: 25,
    description: "Понимание устной речи в различных ситуациях",
    details: [
      "Задание 1: Короткие сообщения и объявления",
      "Задание 2: Интервью и дискуссии",
      "Задание 3: Радиопередачи и подкасты",
      "Задание 4: Лекции и презентации"
    ],
    tips: [
      "Слушайте немецкие подкасты ежедневно",
      "Смотрите фильмы с субтитрами",
      "Практикуйте с носителями языка",
      "Развивайте понимание различных акцентов"
    ]
  },
  {
    skill: "Письмо (Schreiben)",
    icon: PenTool,
    duration: "75 минут",
    tasks: 2,
    points: 25,
    percentage: 25,
    description: "Создание письменных текстов различных типов",
    details: [
      "Задание 1: Формальное письмо (жалоба, запрос)",
      "Задание 2: Эссе с аргументацией по теме",
      "Оценка: содержание, структура, язык",
      "Объём: 150-200 слов каждое задание"
    ],
    tips: [
      "Изучите структуру формальных писем",
      "Практикуйте аргументированные эссе",
      "Расширяйте академическую лексику",
      "Следите за грамматикой и пунктуацией"
    ]
  },
  {
    skill: "Говорение (Sprechen)",
    icon: MessageSquare,
    duration: "15 минут",
    tasks: 3,
    points: 25,
    percentage: 25,
    description: "Устное общение в различных коммуникативных ситуациях",
    details: [
      "Задание 1: Планирование совместной деятельности",
      "Задание 2: Презентация на заданную тему",
      "Задание 3: Дискуссия и обсуждение проблем",
      "Оценка: выполнение задания, язык, произношение"
    ],
    tips: [
      "Практикуйте спонтанную речь",
      "Учите фразы для дискуссий",
      "Работайте над произношением",
      "Развивайте навыки аргументации"
    ]
  }
];
const examFeatures = [
  {
    icon: Clock,
    title: "Модульная структура",
    description: "С уровня B1 можно сдавать модули отдельно"
  },
  {
    icon: FileText,
    title: "Международное признание",
    description: "Сертификат признаётся во всём мире"
  },
  {
    icon: Users,
    title: "Стандартизированная оценка",
    description: "Единые критерии оценки по всему миру"
  },
  {
    icon: Volume2,
    title: "Цифровой формат",
    description: "Многие центры предлагают компьютерные версии"
  }
];
export function GoetheExamFormat() {
  return (
    <section className="py-20 bg-muted/30">
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
              <FileText className="h-4 w-4 mr-2" />
              Структура экзамена
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black mb-6 gradient-text">
              Формат экзамена Гёте
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Экзамен Гёте состоит из четырёх модулей, каждый из которых проверяет определённые языковые навыки.
              Понимание структуры поможет вам лучше подготовиться и успешно сдать экзамен.
            </p>
          </motion.div>
        </div>
        {/* Exam Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {examModules.map((module, index) => (
            <motion.div
              key={module.skill}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all group border-2 hover:border-german-red/30 dark:hover:border-dark-theme-pink/30">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <module.icon className="h-6 w-6 text-german-red dark:text-dark-theme-pink" />
                      </div>
                      <div>
                        <CardTitle className="text-xl group-hover:text-german-red dark:group-hover:text-dark-theme-pink transition-colors">
                          {module.skill}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {module.duration}
                          </span>
                          <span>{module.tasks} заданий</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-german-red dark:text-dark-theme-pink">
                        {module.points}
                      </div>
                      <div className="text-xs text-muted-foreground">баллов</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Вес в экзамене</span>
                      <span className="text-sm font-bold">{module.percentage}%</span>
                    </div>
                    <Progress value={module.percentage} className="h-2" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {module.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Task Details */}
                  <div>
                    <h4 className="font-semibold mb-3 text-sm text-foreground flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Структура заданий:
                    </h4>
                    <ul className="space-y-2">
                      {module.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-german-red dark:bg-dark-theme-pink mt-2 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Tips */}
                  <div>
                    <h4 className="font-semibold mb-3 text-sm text-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Советы по подготовке:
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {module.tips.map((tip, tipIndex) => (
                        <Badge
                          key={tipIndex}
                          variant="secondary"
                          className="text-xs bg-muted/50 text-foreground justify-start text-left p-2 h-auto"
                        >
                          {tip}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {/* Exam Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-muted/30 rounded-2xl p-8 border border-muted">
            <h3 className="text-2xl font-bold text-center mb-8">
              Особенности экзамена Гёте
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {examFeatures.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="p-4 rounded-full bg-white dark:bg-gray-800 shadow-lg mb-4 mx-auto w-fit group-hover:scale-110 transition-transform">
                    <feature.icon className="h-8 w-8 text-german-red dark:text-dark-theme-pink" />
                  </div>
                  <h4 className="font-semibold mb-2 text-sm text-foreground">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
            {/* Important Note */}
            <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                    Важно знать:
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 leading-relaxed">
                    Для успешной сдачи экзамена необходимо набрать минимум 60% от максимального количества баллов в каждом модуле.
                    Модули B1-C2 можно сдавать отдельно в течение года.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
