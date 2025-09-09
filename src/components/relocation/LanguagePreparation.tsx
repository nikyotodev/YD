"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Award,
  BookOpen,
  Users,
  Clock,
  Target,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Brain,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
interface LanguageLevel {
  level: string;
  name: string;
  description: string;
  duration: string;
  requirements: string[];
  visaTypes: string[];
  color: string;
}
const languageLevels: LanguageLevel[] = [
  {
    level: "A1-A2",
    name: "Базовый уровень",
    description: "Основы немецкого для повседневного общения",
    duration: "3-6 месяцев",
    requirements: [
      "Понимание простых фраз",
      "Умение представиться",
      "Базовая грамматика",
      "Словарный запас 1000+ слов",
    ],
    visaTypes: ["Воссоединение семьи", "Au Pair"],
    color: "green",
  },
  {
    level: "B1-B2",
    name: "Средний уровень",
    description: "Уверенное владение для работы и учёбы",
    duration: "6-12 месяцев",
    requirements: [
      "Понимание сложных текстов",
      "Свободное общение с носителями",
      "Выражение мнения по темам",
      "Словарный запас 3000+ слов",
    ],
    visaTypes: ["Blue Card", "Рабочая виза", "Учебная виза"],
    color: "blue",
  },
  {
    level: "C1-C2",
    name: "Продвинутый уровень",
    description: "Академический и профессиональный немецкий",
    duration: "12-24 месяца",
    requirements: [
      "Понимание сложных текстов",
      "Спонтанная речь без подготовки",
      "Академическое письмо",
      "Словарный запас 5000+ слов",
    ],
    visaTypes: ["Докторантура", "Исследовательская виза"],
    color: "purple",
  },
];
const preparationFeatures = [
  {
    icon: Brain,
    title: "ИИ-персонализация",
    description: "Алгоритмы подстраивают программу под ваш темп обучения",
  },
  {
    icon: Target,
    title: "Фокус на релокации",
    description: "Изучение именно тех тем, которые нужны для переезда",
  },
  {
    icon: MessageCircle,
    title: "Практика с носителями",
    description: "Разговорные клубы и индивидуальные занятия",
  },
  {
    icon: Award,
    title: "Подготовка к Goethe",
    description: "Специальные курсы для сдачи официальных экзаменов",
  },
];
export function LanguagePreparation() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-german-red/5 to-german-gold/5 rounded-full blur-3xl animate-float dark:from-purple-500/10 dark:to-pink-500/10" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-german-gold/5 to-german-red/5 rounded-full blur-3xl animate-float animation-delay-2000 dark:from-pink-500/10 dark:to-purple-500/10" />
      </div>
      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <Badge
              variant="secondary"
              className="bg-german-red/10 text-german-red border-german-red/20 px-4 py-2 text-sm font-medium dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Языковая подготовка для релокации
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black mb-6 gradient-text"
          >
            Немецкий — ваш ключ к Германии
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Знание немецкого языка — обязательное требование для большинства виз.
            Подготовьтесь эффективно с YourDeutsch и сдайте экзамены с первого раза.
          </motion.p>
        </div>
        {/* Language levels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {languageLevels.map((level, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="h-full glass hover:glass-hover transition-all duration-300 border-border/30 group-hover:border-german-red/30 dark:group-hover:border-purple-500/30">
                <CardContent className="p-6">
                  {/* Level header */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-german-red/10 to-german-gold/10 flex items-center justify-center group-hover:from-german-red/20 group-hover:to-german-gold/20 transition-all duration-300 dark:from-purple-500/10 dark:to-pink-500/10 dark:group-hover:from-purple-500/20 dark:group-hover:to-pink-500/20">
                      <span className="text-2xl font-black text-german-red dark:text-purple-400">
                        {level.level.split('-')[0]}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">
                      {level.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {level.description}
                    </p>
                    <Badge
                      variant="outline"
                      className="border-german-red/20 text-xs dark:border-purple-500/20"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {level.duration}
                    </Badge>
                  </div>
                  {/* Requirements */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-foreground">Требования:</h4>
                    <div className="space-y-2">
                      {level.requirements.map((req, reqIndex) => (
                        <div key={reqIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">
                            {req}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Visa types */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-foreground">Подходит для:</h4>
                    <div className="flex flex-wrap gap-2">
                      {level.visaTypes.map((visa, visaIndex) => (
                        <Badge
                          key={visaIndex}
                          variant="secondary"
                          className="bg-german-gold/10 text-german-red border-german-gold/20 text-xs dark:bg-pink-500/10 dark:text-pink-300 dark:border-pink-500/20"
                        >
                          {visa}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {/* CTA */}
                  <Link href="/lessons">
                    <Button
                      className="w-full bg-gradient-to-r from-german-red to-german-gold hover:from-german-dark-red hover:to-german-light-gold text-white font-semibold dark:from-purple-500 dark:to-pink-500"
                    >
                      Начать изучение {level.level}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {/* Preparation features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {preparationFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className="glass hover:glass-hover transition-all duration-300 border-border/30 hover:border-german-red/30 dark:hover:border-purple-500/30"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-german-red/10 to-german-gold/10 flex items-center justify-center dark:from-purple-500/10 dark:to-pink-500/10">
                    <IconComponent className="h-6 w-6 text-german-red dark:text-purple-400" />
                  </div>
                  <h3 className="font-bold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>
        {/* Success stories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="glass border-german-red/20 dark:border-purple-500/20">
            <CardContent className="p-8">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-6 w-6 fill-german-gold text-german-gold dark:fill-pink-500 dark:text-pink-500" />
                  ))}
                </div>
                <h3 className="text-2xl font-black mb-4 gradient-text">
                  Более 10,000 студентов уже переехали в Германию
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  {[
                    { number: "95%", label: "Сдают экзамены\nс первого раза" },
                    { number: "8 мес.", label: "Средний срок\nподготовки" },
                    { number: "B2+", label: "Средний уровень\nпо завершении" },
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-black mb-2 gradient-text">
                        {stat.number}
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-pre-line">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/level-test">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-german-red to-german-gold hover:from-german-dark-red hover:to-german-light-gold text-white font-semibold px-8 py-4 dark:from-purple-500 dark:to-pink-500"
                    >
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Проверить уровень сейчас
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/lessons">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-german-red/30 text-german-red hover:bg-german-red/10 font-semibold px-8 py-4 dark:border-purple-500/30 dark:text-purple-400 dark:hover:bg-purple-500/10"
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      Смотреть курсы
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
