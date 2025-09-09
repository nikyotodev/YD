"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Target,
  BookOpen,
  Users,
  Trophy,
  Star,
  Zap,
  Clock,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
const benefits = [
  {
    icon: Target,
    title: "Персональный план",
    description: "Индивидуальная программа подготовки под ваш уровень и цели"
  },
  {
    icon: Users,
    title: "Поддержка экспертов",
    description: "Помощь опытных преподавателей на всех этапах подготовки"
  },
  {
    icon: Trophy,
    title: "Гарантия результата",
    description: "95% наших студентов сдают экзамен с первого раза"
  },
  {
    icon: Clock,
    title: "Экономия времени",
    description: "Эффективная методика сокращает время подготовки на 40%"
  }
];
const actionItems = [
  {
    icon: Target,
    title: "Определите уровень",
    description: "Пройдите бесплатный тест",
    href: "/level-test",
    primary: true
  },
  {
    icon: BookOpen,
    title: "Начните обучение",
    description: "Выберите свой курс",
    href: "/lessons",
    primary: false
  },
  {
    icon: Users,
    title: "Получите консультацию",
    description: "Поговорите с AI помощником",
    href: "/chat",
    primary: false
  }
];
const testimonials = [
  {
    name: "Анна К.",
    level: "B2",
    text: "Сдала B2 с первого раза благодаря структурированной подготовке!",
    rating: 5
  },
  {
    name: "Михаил С.",
    level: "C1",
    text: "Отличные советы и материалы. C1 больше не казался невозможным.",
    rating: 5
  },
  {
    name: "Елена В.",
    level: "B1",
    text: "Получила гражданство! B1 сдала легко после курса YourDeutsch.",
    rating: 5
  }
];
export function GoetheExamCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-german-red/5 via-german-gold/5 to-german-red/5 dark:from-dark-theme-purple/10 dark:via-dark-theme-pink/10 dark:to-dark-theme-purple/10">
      <div className="container mx-auto px-4">
        {/* Main CTA */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 border-german-red/30 text-german-red dark:border-dark-theme-pink/30 dark:text-dark-theme-pink">
              <Zap className="h-4 w-4 mr-2" />
              Начните подготовку сегодня
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black mb-6 gradient-text">
              Ваш путь к успеху на экзамене Гёте
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Присоединяйтесь к тысячам студентов, которые уже достигли своих целей с YourDeutsch.
              Начните подготовку сегодня и сдайте экзамен Гёте с уверенностью!
            </p>
            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="p-4 rounded-full bg-gradient-to-br from-german-red/10 to-german-gold/10 dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20 shadow-lg mb-4 mx-auto w-fit group-hover:scale-110 transition-transform">
                    <benefit.icon className="h-8 w-8 text-german-red dark:text-dark-theme-pink" />
                  </div>
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        {/* Action Items */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {actionItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all group border-2 hover:border-german-red/30 dark:hover:border-dark-theme-pink/30">
                <div className="p-4 rounded-full bg-gradient-to-br from-german-red/10 to-german-gold/10 dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20 shadow-lg mb-6 mx-auto w-fit group-hover:scale-110 transition-transform">
                  <item.icon className="h-10 w-10 text-german-red dark:text-dark-theme-pink" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-german-red dark:group-hover:text-dark-theme-pink transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {item.description}
                </p>
                <Link href={item.href}>
                  <Button
                    size="lg"
                    className={
                      item.primary
                        ? "w-full bg-gradient-to-r from-german-red to-german-gold hover:from-german-dark-red hover:to-german-light-gold text-white"
                        : "w-full bg-gradient-to-r from-german-red/10 to-german-gold/10 text-german-red border border-german-red/30 hover:from-german-red hover:to-german-gold hover:text-white dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20 dark:text-dark-theme-pink dark:border-dark-theme-pink/30 dark:hover:from-dark-theme-purple dark:hover:to-dark-theme-pink"
                    }
                    variant={item.primary ? "default" : "outline"}
                  >
                    Начать
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </motion.div>
        {/* Social Proof - Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-german-red/20 dark:border-dark-theme-pink/20"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">
              Что говорят наши студенты
            </h3>
            <p className="text-muted-foreground">
              Реальные отзывы от тех, кто уже сдал экзамены Гёте
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="text-center p-6 bg-muted/30 rounded-lg">
                <div className="flex justify-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-semibold">{testimonial.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {testimonial.level}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-german-red to-german-gold dark:from-dark-theme-purple dark:to-dark-theme-pink rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Готовы изменить свою жизнь?
            </h3>
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
              Не откладывайте на завтра то, что можете начать сегодня.
              Каждый день промедления — это день без прогресса к вашей цели.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/level-test">
                <Button
                  size="lg"
                  className="bg-white text-german-red hover:bg-gray-100 font-bold px-8 py-4 text-lg shadow-xl"
                >
                  <Target className="h-5 w-5 mr-2" />
                  Начать подготовку бесплатно
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>Без обязательств • Результат гарантирован</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
