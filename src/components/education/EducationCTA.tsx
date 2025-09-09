"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, MessageCircle, Calendar } from "lucide-react";
import Link from "next/link";
export function EducationCTA() {
  return (
    <section className="py-16 md:py-24 bg-background text-foreground relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl animate-float animation-delay-2000" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
              Начните свой путь к{" "}
              <span className="relative">
                <span className="relative z-10">европейскому образованию</span>
                <div className="absolute bottom-2 left-0 w-full h-4 bg-white/30 transform -skew-x-12 z-0" />
              </span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Получите бесплатную консультацию и узнайте, как поступить
              в немецкий университет уже в следующем году.
            </p>
          </motion.div>
          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link href="/level-test">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 py-4 text-lg group"
              >
                <Sparkles className="h-5 w-5 mr-2 group-hover:animate-spin" />
                Проверить уровень языка
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-4 text-lg"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Записаться на консультацию
            </Button>
          </motion.div>
          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            {[
              {
                icon: Users,
                title: "Персональный план",
                description: "Индивидуальная стратегия поступления"
              },
              {
                icon: MessageCircle,
                title: "Поддержка 24/7",
                description: "Помощь на всех этапах поступления"
              },
              {
                icon: Sparkles,
                title: "AI-помощник",
                description: "Умный ассистент для изучения языка"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-muted/30 dark:bg-muted/20 rounded-lg p-6 border border-border"
                >
                  <IconComponent className="h-8 w-8 mb-4 mx-auto text-primary" />
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              );
            })}
          </motion.div>
          {/* Success Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="border-t border-border pt-12"
          >
            <p className="text-lg mb-6 text-muted-foreground">
              Присоединяйтесь к тысячам студентов, которые уже учатся в Германии
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "2,500+", label: "Студентов помогли" },
                { number: "87%", label: "Успешных поступлений" },
                { number: "95%", label: "Довольных клиентов" },
                { number: "24/7", label: "Поддержка" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-black mb-1 text-foreground">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
