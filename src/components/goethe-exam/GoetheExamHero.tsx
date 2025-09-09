"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Target,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  Users,
  Clock,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
export function GoetheExamHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background with exam preparation image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/80 z-10" />
        <Image
          src="https://ugc.same-assets.com/fnt-cTOeUX62vGw1WIxnd598QJpWUo3D.jpeg"
          alt="Подготовка к экзаменам Гёте с учебными материалами и книгами"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-german-red/30 to-german-gold/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-german-gold/30 to-german-red/30 rounded-full blur-3xl animate-float animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full blur-3xl animate-float animation-delay-4000" />
      </div>
      <div className="relative z-30 container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <Badge
              variant="secondary"
              className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium"
            >
              <Target className="h-4 w-4 mr-2" />
              Подготовка к экзаменам Гёте • Гарантия сдачи
            </Badge>
          </motion.div>
          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-black mb-6 leading-tight text-white"
          >
            Сдай экзамен Гёте с первого раза
          </motion.h1>
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            Полный гайд по подготовке к экзаменам Гёте всех уровней A1-C2.
            Структура, стратегии, советы и ресурсы от экспертов для гарантированного успеха.
          </motion.p>
          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          >
            {[
              {
                icon: BookOpen,
                title: "Все уровни",
                subtitle: "A1 → C2",
                description: "Подготовка ко всем уровням экзаменов"
              },
              {
                icon: Users,
                title: "10,000+",
                subtitle: "Сдавших",
                description: "Студентов успешно прошли экзамены"
              },
              {
                icon: Clock,
                title: "4 навыка",
                subtitle: "Комплексно",
                description: "Чтение, письмо, говорение, аудирование"
              },
              {
                icon: TrendingUp,
                title: "95%",
                subtitle: "Успех",
                description: "Процент успешной сдачи наших студентов"
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-black/30 backdrop-blur-md rounded-lg p-4 border border-white/30 hover:bg-black/40 transition-all group"
              >
                <benefit.icon className="h-8 w-8 mb-3 text-german-gold mx-auto group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-black mb-1 text-white">
                  {benefit.title}
                </div>
                <div className="text-sm font-semibold text-german-gold mb-1">
                  {benefit.subtitle}
                </div>
                <div className="text-xs text-white/80">
                  {benefit.description}
                </div>
              </div>
            ))}
          </motion.div>
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/level-test">
              <Button
                size="lg"
                className="bg-gradient-to-r from-german-red to-german-gold hover:from-german-dark-red hover:to-german-light-gold text-white font-semibold px-8 py-4 text-lg group shadow-2xl"
              >
                <Sparkles className="h-5 w-5 mr-2 group-hover:animate-spin" />
                Определить свой уровень
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#exam-levels">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-semibold px-8 py-4 text-lg backdrop-blur-sm"
              >
                <Award className="h-5 w-5 mr-2" />
                Выбрать экзамен
              </Button>
            </Link>
          </motion.div>
          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-12 flex flex-wrap justify-center items-center gap-6 text-white/70 text-sm"
          >
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Официальные стандарты Goethe-Institut</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Актуальная информация 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Экспертные рекомендации</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
