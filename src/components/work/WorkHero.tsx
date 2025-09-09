"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight, Sparkles, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
export function WorkHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background with German office/work image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop&crop=center"
          alt="Modern office building in Frankfurt Germany"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-german-red/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-german-red/20 rounded-full blur-3xl animate-float animation-delay-2000" />
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
              <Briefcase className="h-4 w-4 mr-2" />
              Карьера в Германии для русскоязычных
            </Badge>
          </motion.div>
          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-black mb-6 leading-tight"
          >
            Найдите работу мечты{" "}
            <span className="relative">
              <span className="relative z-10">в Германии</span>
              <div className="absolute bottom-2 left-0 w-full h-4 bg-german-red/70 transform -skew-x-12 z-0" />
            </span>
          </motion.h1>
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            Полное руководство по трудоустройству в Германии.
            Вакансии, визы, зарплаты — всё для успешной карьеры.
          </motion.p>
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          >
            {[
              { id: "vacancies", number: "2.1M", label: "Вакансий\nв Германии" },
              { id: "salary", number: "€5K", label: "Средняя зарплата\nIT-специалиста/месяц" },
              { id: "companies", number: "40%", label: "Компаний ищут\nIT-кадры" },
              { id: "level", number: "B1+", label: "Уровень немецкого\nдля большинства вакансий" },
            ].map((stat) => (
              <div
                key={stat.id}
                className="bg-black/30 backdrop-blur-md rounded-lg p-4 border border-white/30"
              >
                <div className="text-2xl md:text-3xl font-black mb-1 text-white">
                  {stat.number}
                </div>
                <div className="text-sm text-white/90 whitespace-pre-line">
                  {stat.label}
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
                className="bg-german-red hover:bg-german-dark-red text-white font-semibold px-8 py-4 text-lg group"
              >
                <Sparkles className="h-5 w-5 mr-2 group-hover:animate-spin" />
                Проверить уровень немецкого
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#salaries">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-semibold px-8 py-4 text-lg backdrop-blur-sm"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Зарплаты по профессиям
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
