"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Briefcase,
  Home,
  CheckCircle,
  ArrowRight,
  Clock,
  Users,
  GraduationCap,
  Plane,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
interface ProcessStep {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  duration: string;
  details: string[];
  ctaText?: string;
  ctaLink?: string;
}
const processSteps: ProcessStep[] = [
  {
    number: "01",
    icon: BookOpen,
    title: "Изучение немецкого",
    description: "Достижение необходимого уровня языка для визы и работы",
    duration: "3-12 месяцев",
    details: [
      "A1-A2 для воссоединения семьи",
      "B1-B2 для рабочих виз",
      "C1 для академических программ",
      "Подготовка к экзаменам Goethe",
    ],
    ctaText: "Определить уровень",
    ctaLink: "/level-test",
  },
  {
    number: "02",
    icon: FileText,
    title: "Подготовка документов",
    description: "Сбор и переводы всех необходимых документов",
    duration: "1-3 месяца",
    details: [
      "Переводы дипломов и справок",
      "Медицинские справки",
      "Справки о несудимости",
      "Финансовые гарантии",
    ],
  },
  {
    number: "03",
    icon: Briefcase,
    title: "Поиск работы/учёбы",
    description: "Получение приглашения от работодателя или вуза",
    duration: "2-6 месяцев",
    details: [
      "Подача заявок на вакансии",
      "Подготовка к собеседованиям",
      "Получение контракта",
      "Регистрация в Blue Card программе",
    ],
  },
  {
    number: "04",
    icon: FileText,
    title: "Оформление визы",
    description: "Подача документов в консульство и получение визы",
    duration: "1-3 месяца",
    details: [
      "Запись в консульство",
      "Подача документов",
      "Интервью (при необходимости)",
      "Получение визы",
    ],
  },
  {
    number: "05",
    icon: Plane,
    title: "Переезд в Германию",
    description: "Организация переезда и первые шаги в новой стране",
    duration: "1-2 недели",
    details: [
      "Покупка билетов",
      "Организация переезда вещей",
      "Временное жильё",
      "Регистрация по месту жительства",
    ],
  },
  {
    number: "06",
    icon: Home,
    title: "Интеграция",
    description: "Обустройство жизни и интеграция в немецкое общество",
    duration: "3-6 месяцев",
    details: [
      "Поиск постоянного жилья",
      "Открытие банковского счёта",
      "Получение страховки",
      "Интеграционные курсы",
    ],
  },
];
export function RelocationProcess() {
  return (
    <section id="process" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-german-red/5 to-german-gold/5 rounded-full blur-3xl animate-float dark:from-purple-500/10 dark:to-pink-500/10" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-german-gold/5 to-german-red/5 rounded-full blur-3xl animate-float animation-delay-2000 dark:from-pink-500/10 dark:to-purple-500/10" />
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
              <ArrowRight className="h-4 w-4 mr-2" />
              Пошаговый план релокации
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black mb-6 gradient-text"
          >
            6 шагов к жизни в Германии
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Проверенный алгоритм релокации, которым воспользовались тысячи людей.
            От изучения языка до полной интеграции в немецкое общество.
          </motion.p>
        </div>
        {/* Process timeline */}
        <div className="space-y-8">
          {processSteps.map((step, index) => {
            const IconComponent = step.icon;
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Step content */}
                <div className="flex-1 max-w-2xl">
                  <Card className="glass hover:glass-hover transition-all duration-300 border-border/30 hover:border-german-red/30 dark:hover:border-purple-500/30">
                    <CardContent className="p-8">
                      {/* Step number and duration */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-german-red to-german-gold flex items-center justify-center text-white font-black text-lg dark:from-purple-500 dark:to-pink-500">
                            {step.number}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground">
                              {step.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className="mt-1 border-german-red/20 text-xs dark:border-purple-500/20"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              {step.duration}
                            </Badge>
                          </div>
                        </div>
                        <IconComponent className="h-8 w-8 text-german-red dark:text-purple-400" />
                      </div>
                      {/* Description */}
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {step.description}
                      </p>
                      {/* Details */}
                      <div className="space-y-2 mb-6">
                        {step.details.map((detail, detailIndex) => (
                          <div key={`${step.number}-detail-${detailIndex}`} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {detail}
                            </span>
                          </div>
                        ))}
                      </div>
                      {/* CTA Button */}
                      {step.ctaText && step.ctaLink && (
                        <Link href={step.ctaLink}>
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto border-german-red/30 text-german-red hover:bg-german-red/10 dark:border-purple-500/30 dark:text-purple-400 dark:hover:bg-purple-500/10"
                          >
                            {step.ctaText}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                </div>
                {/* Timeline connector */}
                <div className="hidden lg:flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-german-red/20 to-german-gold/20 flex items-center justify-center dark:from-purple-500/20 dark:to-pink-500/20">
                    <ArrowRight className="h-8 w-8 text-german-red dark:text-purple-400" />
                  </div>
                </div>
                {/* Visual element with relevant photo */}
                <div className="flex-1 max-w-2xl lg:block hidden">
                  <div className="w-full h-64 rounded-lg overflow-hidden relative">
                    {index === 0 && (
                      <Image
                        src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                        alt="Изучение немецкого языка"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                    {index === 1 && (
                      <Image
                        src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                        alt="Подготовка документов"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                    {index === 2 && (
                      <Image
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                        alt="Поиск работы и собеседования"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                    {index === 3 && (
                      <Image
                        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2026&q=80"
                        alt="Оформление визы в консульстве"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                    {index === 4 && (
                      <Image
                        src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2035&q=80"
                        alt="Переезд в Германию"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                    {index === 5 && (
                      <Image
                        src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80"
                        alt="Интеграция в немецкое общество"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                    {/* Overlay with icon */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 flex items-center justify-center">
                      <IconComponent className="h-16 w-16 text-white/80" />
                    </div>
                  </div>
                </div>
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
          className="mt-16 text-center"
        >
          <Card className="glass border-german-red/20 dark:border-purple-500/20">
            <CardContent className="p-8">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-black mb-4 gradient-text">
                  Готовы начать свой путь?
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Первый и самый важный шаг — изучение немецкого языка.
                  Определите свой текущий уровень и начните подготовку уже сегодня.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/level-test">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-german-red to-german-gold hover:from-german-dark-red hover:to-german-light-gold text-white font-semibold px-8 py-4 dark:from-purple-500 dark:to-pink-500"
                    >
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Пройти тест уровня
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
                      Начать изучение
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
