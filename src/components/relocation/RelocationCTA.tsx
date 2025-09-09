"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  Users,
  GraduationCap,
  BookOpen,
  MessageCircle,
  Globe,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
const ctaFeatures = [
  {
    icon: Target,
    title: "Персональный план",
    description: "Индивидуальная программа обучения под ваши цели релокации",
  },
  {
    icon: Clock,
    title: "Быстрый результат",
    description: "Достигайте нужного уровня в 2-3 раза быстрее обычного",
  },
  {
    icon: Users,
    title: "Экспертная поддержка",
    description: "Сопровождение от преподавателей и консультантов по релокации",
  },
];
export function RelocationCTA() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-german-red/10 dark:bg-dark-theme-pink/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-german-red/10 dark:bg-dark-theme-pink/10 rounded-full blur-3xl animate-float animation-delay-2000" />
      </div>
      <div className="container mx-auto px-4 relative">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Card className="glass border-german-red/20 max-w-5xl mx-auto dark:border-dark-theme-pink/20">
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left side - Content */}
                <div className="text-left">
                  <Badge
                    variant="secondary"
                    className="bg-german-red/10 text-german-red border-german-red/20 px-4 py-2 text-sm font-medium mb-6 dark:bg-dark-theme-pink/10 dark:text-dark-theme-pink dark:border-dark-theme-pink/20"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Начните сегодня — живите в Германии завтра
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-black mb-6 gradient-text">
                    Ваш путь к новой жизни в Германии начинается здесь
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    Присоединяйтесь к тысячам студентов, которые уже осуществили свою мечту
                    о жизни в Германии. Персональная программа обучения, экспертная поддержка
                    и проверенная методика — всё для вашего успеха.
                  </p>
                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {ctaFeatures.map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-4 w-4 text-german-red dark:text-dark-theme-pink" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">
                              {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/level-test">
                      <Button
                        size="lg"
                        className="bg-german-red hover:bg-german-dark-red text-white font-semibold px-8 py-4 text-lg group"
                      >
                        <GraduationCap className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                        Определить свой уровень
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Link href="/lessons">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-german-red/30 text-german-red hover:bg-german-red/10 font-semibold px-8 py-4 text-lg dark:border-dark-theme-pink/30 dark:text-dark-theme-pink dark:hover:bg-dark-theme-pink/10"
                      >
                        <BookOpen className="h-5 w-5 mr-2" />
                        Начать изучение
                      </Button>
                    </Link>
                  </div>
                </div>
                {/* Right side - Visual */}
                <div className="relative">
                  <div className="relative rounded-2xl overflow-hidden">
                    <Image
                      src="https://ugc.same-assets.com/6jCTM2oKIg9cpYFxqQh2tzYRMf4__t7N.jpeg"
                      alt="Berlin cityscape at sunset"
                      width={500}
                      height={400}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-sm font-medium">Берлин, Германия</div>
                      <div className="text-xs opacity-80">Ваш новый дом ждёт вас</div>
                    </div>
                  </div>
                  {/* Floating stats */}
                  <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg dark:bg-gray-800/90">
                    <div className="text-2xl font-black text-german-red dark:text-dark-theme-pink">95%</div>
                    <div className="text-xs text-muted-foreground">успешных релокантов</div>
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg dark:bg-gray-800/90">
                    <div className="text-2xl font-black text-german-red dark:text-dark-theme-pink">6-12</div>
                    <div className="text-xs text-muted-foreground">месяцев до переезда</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Final call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-muted-foreground mb-6">
              Сделайте первый шаг к релокации в Германию уже сегодня.
              Тысячи людей уже изменили свою жизнь — присоединяйтесь к ним!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-german-red/30 text-german-red hover:bg-german-red/10 font-semibold px-8 py-4 dark:border-dark-theme-pink/30 dark:text-dark-theme-pink dark:hover:bg-dark-theme-pink/10"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Получить консультацию ИИ
                </Button>
              </Link>
              <a
                href="https://t.me/yourdeutsch"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-german-red/30 text-german-red hover:bg-german-red/10 font-semibold px-8 py-4 dark:border-dark-theme-pink/30 dark:text-dark-theme-pink dark:hover:bg-dark-theme-pink/10"
                >
                  <Globe className="h-5 w-5 mr-2" />
                  Присоединиться к сообществу
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
