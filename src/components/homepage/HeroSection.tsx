"use client";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { SparklesText } from "@/components/ui/sparkles-text";
import { Sparkles, Play, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
export function HeroSection() {
  return (
    <div className="text-center mb-8 md:mb-16">
      {/* Badge */}
      <div className="glass-nav inline-flex items-center mb-4 md:mb-8 animate-shimmer">
        <Sparkles className="h-4 w-4 mr-2 text-german-red dark:text-dark-theme-pink" />
        <span className="gradient-text font-medium text-sm md:text-base">
          Powered by AI
        </span>
      </div>
      {/* Main Title - Оптимизировано для мобильных */}
      <div className="mb-6 md:mb-8">
        <SparklesText
          text="Изучение немецкого языка"
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight gradient-text mb-2 md:mb-4"
          sparklesCount={25}
          colors={{
            first: "#DC2626", // german-red
            second: "#F59E0B", // german-gold
          }}
        />
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-700 dark:text-gray-300">
          с помощью искусственного интеллекта
        </p>
      </div>
      {/* Description - Улучшена читаемость на мобильных */}
      <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
        YourDeutsch - это революционная платформа для эффективного изучения
        немецкого языка с персональным AI-помощником, интерактивными уроками и
        полным погружением в культуру.
      </p>
      {/* CTA Buttons - Новые градиентные кнопки в немецком стиле */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 md:mb-12 px-4">
        {/* Главная CTA кнопка - Градиентная в цветах Германии */}
        <Link href="/lessons" className="w-full sm:w-auto">
          <GradientButton
            variant="default"
            className="w-full sm:w-auto h-12 text-lg px-8 font-bold"
          >
            <Play className="h-5 w-5 mr-2 fill-current" />
            Начать бесплатно
            <ArrowRight className="h-4 w-4 ml-2" />
          </GradientButton>
        </Link>
        {/* Вторичная кнопка AI-чат - Специальный градиент для AI-помощника */}
        <Link href="/chat" className="w-full sm:w-auto">
          <GradientButton
            variant="ai-assistant"
            className="w-full sm:w-auto h-12 text-lg px-8 font-semibold"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            AI-помощник
            <div className="ml-2 flex space-x-0.5">
              <div className="w-1 h-1 bg-white/80 rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-white/80 rounded-full animate-pulse animation-delay-150" />
              <div className="w-1 h-1 bg-white/80 rounded-full animate-pulse animation-delay-300" />
            </div>
          </GradientButton>
        </Link>
      </div>
      {/* Urgency элемент для конверсии */}
      <div className="glass-nav inline-flex items-center text-sm text-gray-600 dark:text-gray-400 px-4 py-2">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
        <span>Присоединились 847 студентов за последние 7 дней</span>
      </div>
    </div>
  );
}
