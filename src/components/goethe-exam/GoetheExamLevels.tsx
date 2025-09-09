"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Clock,
  Euro,
  Users,
  ArrowRight,
  Star,
  Zap,
  Crown
} from "lucide-react";
import Link from "next/link";
interface ExamLevel {
  level: string;
  title: string;
  description: string;
  timeRequired: string;
  difficulty: "Начальный" | "Средний" | "Продвинутый";
  price: string;
  skills: string[];
  useCase: string;
  icon: "star" | "zap" | "crown";
  examTime: string;
  passingScore: string;
}
const examLevels: ExamLevel[] = [
  {
    level: "A1",
    title: "Goethe-Zertifikat A1",
    description: "Базовые знания немецкого языка. Умение понимать и использовать простейшие фразы.",
    timeRequired: "80-200 часов",
    difficulty: "Начальный",
    price: "€130-180",
    skills: ["Простые фразы", "Базовая лексика", "Элементарное общение", "Повседневные ситуации"],
    useCase: "Первые шаги в немецком, туризм, базовое общение",
    icon: "star",
    examTime: "65 минут",
    passingScore: "60%"
  },
  {
    level: "A2",
    title: "Goethe-Zertifikat A2",
    description: "Элементарное владение языком. Понимание частых выражений в знакомых областях.",
    timeRequired: "200-350 часов",
    difficulty: "Начальный",
    price: "€150-200",
    skills: ["Простые тексты", "Базовая грамматика", "Повседневные темы", "Краткие диалоги"],
    useCase: "Виза жены/мужа, базовое трудоустройство, интеграционные курсы",
    icon: "star",
    examTime: "90 минут",
    passingScore: "60%"
  },
  {
    level: "B1",
    title: "Goethe-Zertifikat B1",
    description: "Самостоятельное владение языком. Понимание основных моментов в знакомых темах.",
    timeRequired: "350-650 часов",
    difficulty: "Средний",
    price: "€180-250",
    skills: ["Связные тексты", "Выражение мнения", "Планы и мечты", "Аргументация"],
    useCase: "Получение гражданства, работа в Германии, учёба в Studienkolleg",
    icon: "zap",
    examTime: "185 минут",
    passingScore: "60%"
  },
  {
    level: "B2",
    title: "Goethe-Zertifikat B2",
    description: "Продвинутое владение языком. Понимание сложных текстов абстрактной тематики.",
    timeRequired: "650-800 часов",
    difficulty: "Средний",
    price: "€200-280",
    skills: ["Сложные тексты", "Спонтанное общение", "Детальные высказывания", "Дискуссии"],
    useCase: "Поступление в немецкий университет, квалифицированная работа, FSJ",
    icon: "zap",
    examTime: "190 минут",
    passingScore: "60%"
  },
  {
    level: "C1",
    title: "Goethe-Zertifikat C1",
    description: "Профессиональное владение языком. Понимание сложных и объёмных текстов.",
    timeRequired: "800-1000 часов",
    difficulty: "Продвинутый",
    price: "€220-320",
    skills: ["Сложная аргументация", "Академический язык", "Профессиональное общение", "Стилистические нюансы"],
    useCase: "Работа в немецких компаниях, медицина, инженерия, научная деятельность",
    icon: "crown",
    examTime: "190 минут",
    passingScore: "60%"
  },
  {
    level: "C2",
    title: "Goethe-Zertifikat C2",
    description: "Владение языком на уровне носителя. Понимание практически всего услышанного и прочитанного.",
    timeRequired: "1000+ часов",
    difficulty: "Продвинутый",
    price: "€250-380",
    skills: ["Свободное владение", "Нюансы и подтексты", "Литературные тексты", "Научный стиль"],
    useCase: "Преподавание немецкого языка, научные исследования, переводческая деятельность",
    icon: "crown",
    examTime: "200 минут",
    passingScore: "60%"
  }
];
const getIcon = (iconType: "star" | "zap" | "crown") => {
  switch (iconType) {
    case "star": return Star;
    case "zap": return Zap;
    case "crown": return Crown;
  }
};
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Начальный": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Средний": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Продвинутый": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};
export function GoetheExamLevels() {
  return (
    <section id="exam-levels" className="py-20 bg-gradient-to-b from-background to-muted/30">
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
              <GraduationCap className="h-4 w-4 mr-2" />
              Экзамены Гёте • A1-C2
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black mb-6 gradient-text">
              Выберите свой уровень экзамена
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Каждый уровень экзамена Гёте соответствует определённым навыкам и открывает новые возможности.
              Выберите подходящий уровень и узнайте всё о требованиях и подготовке.
            </p>
          </motion.div>
        </div>
        {/* Exam Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examLevels.map((exam, index) => {
            const IconComponent = getIcon(exam.icon);
            return (
              <motion.div
                key={exam.level}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group border-2 hover:border-german-red/30 dark:hover:border-dark-theme-pink/30">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted/50">
                          <IconComponent className="h-6 w-6 text-german-red dark:text-dark-theme-pink" />
                        </div>
                        <div>
                          <Badge
                            className={`text-xs font-semibold ${getDifficultyColor(exam.difficulty)}`}
                          >
                            {exam.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-3xl font-black text-german-red dark:text-dark-theme-pink">
                        {exam.level}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-german-red dark:group-hover:text-dark-theme-pink transition-colors">
                      {exam.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {exam.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Exam Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{exam.examTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{exam.passingScore}</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{exam.timeRequired}</span>
                      </div>
                    </div>
                    {/* Skills */}
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-foreground">Основные навыки:</h4>
                      <div className="flex flex-wrap gap-1">
                        {exam.skills.map((skill, skillIndex) => (
                          <Badge
                            key={skillIndex}
                            variant="secondary"
                            className="text-xs bg-muted/50 text-foreground"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {/* Use Case */}
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-foreground">Для чего нужен:</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {exam.useCase}
                      </p>
                    </div>
                    {/* CTA Button */}
                    <div className="pt-4">
                      <Link href={`/lessons/goethe-${exam.level.toLowerCase()}-adults`}>
                        <Button
                          className="w-full group bg-muted/30 text-german-red border border-german-red/30 hover:bg-german-red hover:text-white dark:bg-muted/30 dark:text-dark-theme-pink dark:border-dark-theme-pink/30 dark:hover:bg-dark-theme-pink dark:hover:text-black"
                          variant="outline"
                        >
                          Подготовиться к {exam.level}
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-muted/30 rounded-2xl p-8 border border-muted">
            <h3 className="text-2xl font-bold mb-4">
              Не знаете, какой уровень выбрать?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Пройдите наш бесплатный тест на определение уровня немецкого языка и получите персональные рекомендации по подготовке к экзамену.
            </p>
            <Link href="/level-test">
              <Button size="lg" className="bg-german-red hover:bg-german-dark-red text-white">
                <GraduationCap className="h-5 w-5 mr-2" />
                Пройти тест уровня
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
