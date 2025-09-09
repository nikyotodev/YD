"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  FileText,
  GraduationCap,
  Globe,
  CheckCircle,
  Clock,
  Euro,
  User,
  Building,
  ArrowRight,
  Briefcase,
  Code,
  Search,
} from "lucide-react";
import Link from "next/link";
interface VisaType {
  id: string;
  type: string;
  title: string;
  description: string;
  requirements: string[];
  processingTime: string;
  cost: string;
  difficulty: "Легко" | "Средне" | "Сложно";
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}
const visaTypes: VisaType[] = [
  {
    id: "eu-blue-card",
    type: "eu-blue-card",
    title: "EU Blue Card",
    description: "Для высококвалифицированных специалистов с высшим образованием",
    requirements: [
      "Высшее образование (признанное в ЕС)",
      "Предложение о работе с зарплатой от €45,552/год",
      "Для IT: зарплата от €41,041/год (снижено в 2023)",
      "Подтверждение квалификации",
    ],
    processingTime: "1-3 месяца",
    cost: "€140",
    difficulty: "Средне",
    icon: GraduationCap,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "work-visa-18a",
    type: "work-visa-18a",
    title: "Рабочая виза §18a",
    description: "Общая рабочая виза для трудоустройства по специальности",
    requirements: [
      "Высшее образование или квалификация",
      "Конкретное предложение о работе",
      "Согласие Агентства по трудоустройству",
      "Подтверждение языковых навыков",
    ],
    processingTime: "2-4 месяца",
    cost: "€75",
    difficulty: "Средне",
    icon: Briefcase,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "it-specialist-visa",
    type: "it-specialist-visa",
    title: "IT Specialist Visa §19c",
    description: "Специальная виза для IT-специалистов с практическим опытом",
    requirements: [
      "3+ года опыта в IT",
      "Зарплата от €41,041/год (Fachkräfte)",
      "Навыки программирования или IT-знания",
      "Предложение о работе в IT-сфере",
    ],
    processingTime: "1-2 месяца",
    cost: "€75",
    difficulty: "Легко",
    icon: Code,
    color: "from-purple-500 to-violet-500",
  },
  {
    id: "job-search-visa",
    type: "job-search-visa",
    title: "Виза для поиска работы §20",
    description: "Разрешение на въезд для поиска работы в Германии",
    requirements: [
      "Высшее образование",
      "Финансовые гарантии (€1,027/месяц)",
      "Медицинская страховка",
      "Немецкий язык B1 или английский B2",
    ],
    processingTime: "1-2 месяца",
    cost: "€75",
    difficulty: "Легко",
    icon: Search,
    color: "from-orange-500 to-red-500",
  },
];
const languageRequirements = [
  {
    level: "A1-A2",
    professions: ["Строители", "Повара", "Уборщики", "Водители"],
    description: "Базовый уровень для простых профессий",
  },
  {
    level: "B1-B2",
    professions: ["IT-специалисты", "Инженеры", "Дизайнеры", "Маркетологи"],
    description: "Средний уровень для большинства специальностей",
  },
  {
    level: "C1-C2",
    professions: ["Врачи", "Юристы", "Учителя", "Госслужащие"],
    description: "Высокий уровень для регулируемых профессий",
  },
];
function VisaCard({ visa, index }: { visa: VisaType; index: number }) {
  const IconComponent = visa.icon;
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Легко": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "Средне": return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "Сложно": return "bg-red-500/10 text-red-700 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 bg-background/80 backdrop-blur-sm h-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${visa.color} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{visa.title}</h3>
                <Badge className={getDifficultyColor(visa.difficulty)}>
                  {visa.difficulty}
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
            {visa.description}
          </p>
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Срок рассмотрения:</span>
              </div>
              <span className="font-semibold">{visa.processingTime}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Стоимость:</span>
              </div>
              <span className="font-semibold text-german-red">{visa.cost}</span>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground mb-3">Основные требования:</h4>
            {visa.requirements.map((requirement, idx) => (
              <div key={`${visa.type}-req-${idx}`} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{requirement}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
export function VisaRequirements() {
  return (
    <section id="visa" className="py-20 bg-background">
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
              <FileText className="h-4 w-4 mr-2" />
              Рабочие визы в Германию
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-5xl font-black mb-6"
          >
            Как получить{" "}
            <span className="relative">
              <span className="relative z-10">рабочую визу?</span>
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
            Полный гид по типам рабочих виз, требованиям и процедуре получения.
            Выберите подходящий вариант для вашей ситуации.
          </motion.p>
        </div>
        {/* Visa Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {visaTypes.map((visa, index) => (
            <VisaCard key={visa.id} visa={visa} index={index} />
          ))}
        </div>
        {/* Language Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-muted/30 rounded-2xl p-8 mb-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-3">Требования к языку по профессиям</h3>
            <p className="text-muted-foreground">
              Уровень немецкого языка зависит от специальности и типа работы
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {languageRequirements.map((req, index) => (
              <motion.div
                key={req.level}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background/80 backdrop-blur-sm rounded-lg p-6 border border-border/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="h-6 w-6 text-german-red" />
                  <Badge
                    variant="outline"
                    className="border-german-red/20 text-german-red font-bold"
                  >
                    {req.level}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{req.description}</p>
                <div className="space-y-2">
                  {req.professions.map((profession, idx) => (
                    <div key={`${req.level}-prof-${idx}`} className="flex items-center gap-2">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{profession}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center bg-gradient-to-r from-german-red/10 to-german-gold/10 rounded-2xl p-8 border border-german-red/20"
        >
          <h3 className="text-2xl font-bold mb-4">Готовы начать процесс?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Проверьте свой уровень немецкого языка и узнайте, какие вакансии
            подходят именно вам. Первый шаг к карьере в Германии!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/level-test">
              <Button
                size="lg"
                className="bg-gradient-to-r from-german-red to-german-gold hover:from-german-dark-red hover:to-german-light-gold text-white font-semibold px-8 py-4"
              >
                Тест уровня немецкого
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/dictionary">
              <Button
                size="lg"
                variant="outline"
                className="border-german-red/20 text-german-red hover:bg-german-red/10 font-semibold px-8 py-4"
              >
                Изучать немецкий
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
