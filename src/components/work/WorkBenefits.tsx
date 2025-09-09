"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Euro,
  Clock,
  Shield,
  Calendar,
  Briefcase,
  TrendingUp,
  Users,
  Heart,
  Award,
  Globe,
  Building,
  Coffee,
} from "lucide-react";
import Image from "next/image";
interface WorkBenefit {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  highlight?: string;
}
const workBenefits: WorkBenefit[] = [
  {
    id: "high-salary",
    icon: Euro,
    title: "Высокие зарплаты",
    description: "IT: €45-95K/год, инженеры: €48-78K/год, средний класс: €42-62K/год",
    highlight: "В 2-3 раза выше РФ",
  },
  {
    id: "work-life-balance",
    icon: Clock,
    title: "Work-life balance",
    description: "35-40 часов/неделю, 25-30 дней отпуска, гибкий график",
    highlight: "Больше времени на жизнь",
  },
  {
    id: "social-protection",
    icon: Shield,
    title: "Социальная защита",
    description: "Медстраховка, пенсия, пособие по безработице, больничные",
    highlight: "100% гарантии",
  },
  {
    id: "vacation-weekends",
    icon: Calendar,
    title: "Отпуск и выходные",
    description: "Минимум 24 дня отпуска + праздники + больничные без ограничений",
    highlight: "40+ свободных дней",
  },
  {
    id: "career-growth",
    icon: Briefcase,
    title: "Карьерный рост",
    description: "Прозрачная система развития, обучение за счет компании",
    highlight: "Инвестиции в сотрудников",
  },
  {
    id: "stability",
    icon: TrendingUp,
    title: "Стабильность",
    description: "Сильная экономика, низкая безработица, защита от увольнений",
    highlight: "4-я экономика мира",
  },
  {
    id: "inclusivity",
    icon: Users,
    title: "Инклюзивность",
    description: "Равные права, защита от дискриминации, поддержка diversity",
    highlight: "Уважение к каждому",
  },
  {
    id: "modern-offices",
    icon: Building,
    title: "Современные офисы",
    description: "Комфортная рабочая среда, новые технологии, удаленная работа",
    highlight: "Европейские стандарты",
  },
];
function WorkBenefitCard({ benefit, index }: { benefit: WorkBenefit; index: number }) {
  const IconComponent = benefit.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 bg-background/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-german-red/10 to-german-gold/10 border border-german-red/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <IconComponent className="h-6 w-6 text-german-red" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-german-red transition-colors">
                  {benefit.title}
                </h3>
                {benefit.highlight && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-german-gold/10 text-german-red border-german-red/20"
                  >
                    {benefit.highlight}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
export function WorkBenefits() {
  return (
    <section id="benefits" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <Badge
              variant="secondary"
              className="bg-german-red/10 text-german-red border-german-red/20 px-4 py-2"
            >
              <Coffee className="h-4 w-4 mr-2" />
              Условия работы в Германии
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-5xl font-black mb-6"
          >
            Почему работать в Германии —{" "}
            <span className="relative">
              <span className="relative z-10">это круто?</span>
              <div className="absolute bottom-1 left-0 w-full h-3 bg-gradient-to-r from-german-red/30 to-german-gold/30 transform -skew-x-12 z-0" />
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Германия предлагает лучший баланс высоких зарплат, социальной защиты
            и качества жизни. Узнайте, что ждёт вас в немецких компаниях.
          </motion.p>
        </div>
        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-16">
          {workBenefits.map((benefit, index) => (
            <WorkBenefitCard
              key={benefit.id}
              benefit={benefit}
              index={index}
            />
          ))}
        </div>
        {/* Work culture image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl overflow-hidden"
        >
          <div className="aspect-[16/9] relative">
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=900&fit=crop&crop=center"
              alt="Modern German office workspace with employees"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white/90 dark:bg-background/90 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-2">Современная рабочая культура</h3>
              <p className="text-muted-foreground">
                Открытые офисы, команды мечты и технологии будущего —
                так выглядит работа в немецких компаниях сегодня.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
