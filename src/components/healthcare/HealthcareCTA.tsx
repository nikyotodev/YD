"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Shield, MessageCircle, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
export function HealthcareCTA() {
  return (
    <section className="py-20 bg-muted/30 dark:bg-muted/20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float animation-delay-2000" />
      </div>
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <Heart className="h-8 w-8 text-primary mr-3" />
              <span className="text-lg font-semibold text-primary">
                Ваше здоровье — наш приоритет
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Готовы к жизни{" "}
              <span className="text-primary">в Германии?</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Теперь вы знаете основы немецкой системы здравоохранения.
              Получите персональную консультацию и узнайте больше о жизни в Германии.
            </p>
            {/* Benefits list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-sm">Полная информация о страховании</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-sm">Помощь в поиске врачей</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-sm">Поддержка на русском языке</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-sm">Сообщество экспатов</span>
              </div>
            </div>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold group"
              >
                <Link href="/relocation">
                  Узнать о релокации
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-3 text-lg font-semibold"
              >
                <Link href="/chat">
                  Задать вопрос AI
                </Link>
              </Button>
            </div>
          </motion.div>
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://ugc.same-assets.com/vH8SpjsBnQbPCp3_oJ1uUYJJSEaIg6r8.webp"
                alt="German healthcare system overview"
                width={600}
                height={400}
                className="object-cover w-full h-[400px]"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              {/* Statistics overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="grid grid-cols-3 gap-4 text-white text-center">
                    <div>
                      <div className="text-2xl font-bold">11.7%</div>
                      <div className="text-xs opacity-90">от ВВП</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">81.3</div>
                      <div className="text-xs opacity-90">года жизни</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">100%</div>
                      <div className="text-xs opacity-90">покрытие</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-pulse animation-delay-1000" />
          </motion.div>
        </div>
        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="max-w-3xl mx-auto bg-card rounded-2xl p-8 border-2 border-primary/20 shadow-lg">
            <h3 className="text-2xl font-bold mb-4">
              🎯 Начните свой путь в Германии уже сегодня
            </h3>
            <p className="text-muted-foreground mb-6">
              Присоединяйтесь к тысячам людей, которые успешно адаптировались в Германии
              с нашей помощью. Изучайте язык, узнавайте о культуре и готовьтесь к новой жизни.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-primary hover:bg-primary/90"
              >
                <Link href="/lessons">
                  Изучать немецкий язык
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Link href="/culture">
                  Узнать о культуре
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
