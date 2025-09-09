"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Euro,
  Shield,
  GraduationCap,
  Building,
  Plane,
  Heart,
  Users,
  MapPin,
  Award,
  Globe,
  HomeIcon,
  Briefcase,
} from "lucide-react";
import Image from "next/image";
interface Benefit {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  highlight?: string;
}
const benefits: Benefit[] = [
  {
    icon: Euro,
    title: "Высокие зарплаты",
    description: "Минимальная зарплата €12/час, средняя €3,500/месяц",
    highlight: "€42,000+/год",
  },
  {
    icon: Shield,
    title: "Социальная защита",
    description: "Бесплатная медицина, пенсия, пособия по безработице",
    highlight: "100% покрытие",
  },
  {
    icon: GraduationCap,
    title: "Образование",
    description: "Бесплатное высшее образование в лучших университетах Европы",
    highlight: "0€ за обучение",
  },
  {
    icon: Building,
    title: "Качество жизни",
    description: "Экология, инфраструктура, стабильность — всё на высшем уровне",
    highlight: "7-е место в мире",
  },
  {
    icon: Plane,
    title: "Европейский паспорт",
    description: "Через 8 лет получите гражданство и право жить в любой стране ЕС",
    highlight: "27 стран ЕС",
  },
  {
    icon: Heart,
    title: "Семейные ценности",
    description: "Поддержка семей с детьми, декретный отпуск до 3 лет",
    highlight: "€250/месяц на ребёнка",
  },
  {
    icon: Users,
    title: "Русское сообщество",
    description: "Более 1 млн русскоязычных жителей, развитая инфраструктура",
    highlight: "1M+ людей",
  },
  {
    icon: MapPin,
    title: "География",
    description: "В центре Европы, легко путешествовать по всему континенту",
    highlight: "9 соседних стран",
  },
];
export function RelocationBenefits() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-gradient-to-br from-german-red/5 to-german-gold/5 rounded-full blur-3xl animate-float dark:from-purple-500/10 dark:to-pink-500/10" />
        <div className="absolute bottom-10 right-1/4 w-32 h-32 bg-gradient-to-br from-german-gold/5 to-german-red/5 rounded-full blur-3xl animate-float animation-delay-2000 dark:from-pink-500/10 dark:to-purple-500/10" />
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
              <Award className="h-4 w-4 mr-2" />
              Преимущества жизни в Германии
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black mb-6 gradient-text"
          >
            Почему выбирают Германию?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Германия — одна из самых привлекательных стран для релокации.
            Высокий уровень жизни, стабильная экономика и открытое отношение к иммигрантам.
          </motion.p>
        </div>
        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full glass hover:glass-hover transition-all duration-300 border-border/30 group-hover:border-german-red/30 dark:group-hover:border-purple-500/30">
                  <CardContent className="p-6 text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-german-red/10 to-german-gold/10 flex items-center justify-center group-hover:from-german-red/20 group-hover:to-german-gold/20 transition-all duration-300 dark:from-purple-500/10 dark:to-pink-500/10 dark:group-hover:from-purple-500/20 dark:group-hover:to-pink-500/20">
                      <IconComponent className="h-8 w-8 text-german-red dark:text-purple-400" />
                    </div>
                    {/* Highlight */}
                    {benefit.highlight && (
                      <Badge
                        variant="secondary"
                        className="mb-3 bg-german-gold/10 text-german-red border-german-gold/20 dark:bg-pink-500/10 dark:text-pink-300 dark:border-pink-500/20"
                      >
                        {benefit.highlight}
                      </Badge>
                    )}
                    {/* Title */}
                    <h3 className="text-lg font-bold mb-3 text-foreground">
                      {benefit.title}
                    </h3>
                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        {/* Bottom CTA section with images */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          {/* Left side - Images */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src="https://ugc.same-assets.com/BobxZyKgoKgo0yIGILOYctJuO0-DacG3.jpeg"
                  alt="Hamburg Germany cityscape"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="relative h-32 rounded-lg overflow-hidden">
                <Image
                  src="https://ugc.same-assets.com/D3RLI9VNg4iiTEdR3Z3FfnoAXCdiYHts.jpeg"
                  alt="Dresden Germany street life"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="relative h-32 rounded-lg overflow-hidden">
                <Image
                  src="https://ugc.same-assets.com/roZUqrTng-700X00XCKDnF4OC9q1cQ3a.jpeg"
                  alt="Berlin cityscape view"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src="https://ugc.same-assets.com/ipJLsev5a-HQtM99lwfigB3rsDhGFefC.jpeg"
                  alt="Munich residential area"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>
          {/* Right side - Text */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-black gradient-text">
              Жизнь в Германии: реальность превосходит ожидания
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Более миллиона русскоязычных жителей уже называют Германию домом.
              Присоединяйтесь к ним и откройте новые возможности для себя и своей семьи.
            </p>
            <div className="flex flex-wrap gap-2">
              {["🏠 Доступное жилье", "🚗 Отличные дороги", "🌳 Чистая экология", "👨‍👩‍👧‍👦 Семейные льготы"].map((item, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-german-red/20 text-foreground dark:border-purple-500/20"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
