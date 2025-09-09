"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Clock,
  Star,
  TrendingUp,
  Shield,
  Heart,
  Stethoscope
} from "lucide-react";
const systemFeatures = [
  {
    icon: Shield,
    title: "Двухуровневая система",
    description: "Обязательное (GKV) и частное (PKV) медицинское страхование",
    highlight: "90% населения",
    color: "text-primary"
  },
  {
    icon: Users,
    title: "Широкий доступ",
    description: "Качественная медицинская помощь доступна всем застрахованным",
    highlight: "100% покрытие",
    color: "text-accent"
  },
  {
    icon: Building2,
    title: "Развитая инфраструктура",
    description: "Более 1,900 больниц и 47,000 врачебных практик",
    highlight: "№3 в мире",
    color: "text-primary"
  },
  {
    icon: Clock,
    title: "Круглосуточная помощь",
    description: "Неотложная медицинская помощь доступна 24/7 по всей стране",
    highlight: "112 - экстренный номер",
    color: "text-accent"
  }
];
const systemStats = [
  {
    icon: Heart,
    number: "11.7%",
    label: "от ВВП тратится на здравоохранение",
    description: "Один из самых высоких показателей в мире"
  },
  {
    icon: Stethoscope,
    number: "4.3",
    label: "врача на 1000 человек",
    description: "Высокий уровень обеспеченности медперсоналом"
  },
  {
    icon: TrendingUp,
    number: "81.3",
    label: "года средняя продолжительность жизни",
    description: "Показатель качества системы здравоохранения"
  },
  {
    icon: Star,
    number: "8.0",
    label: "рейтинг здравоохранения из 10",
    description: "По оценке Всемирной организации здравоохранения"
  }
];
export function HealthcareSystem() {
  return (
    <section id="healthcare-system" className="py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float dark:bg-primary/10" />
        <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-float animation-delay-2000 dark:bg-accent/10" />
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
            <Badge variant="secondary" className="mb-4">
              <Heart className="h-4 w-4 mr-2" />
              Система здравоохранения
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Одна из лучших{" "}
            <span className="text-primary">медицинских систем</span> мира
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Немецкая система здравоохранения обеспечивает высококачественную медицинскую помощь
            всем жителям страны. Узнайте, как работает эта система и что она может предложить вам.
          </motion.p>
        </div>
        {/* Key features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {systemFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-2 hover:border-primary/20 transition-all duration-300 group hover:shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-muted/50 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {feature.highlight}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {/* Statistics section */}
        <div className="bg-muted/30 rounded-2xl p-8 md:p-12 dark:bg-muted/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Система в цифрах
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Статистика, демонстрирующая эффективность и качество немецкого здравоохранения
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {systemStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mb-4">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4">
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <div className="text-3xl md:text-4xl font-black mb-2 text-primary">
                    {stat.number}
                  </div>
                  <div className="font-semibold mb-2">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
