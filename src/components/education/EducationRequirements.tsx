"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Award,
  Languages,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock
} from "lucide-react";
interface Requirement {
  title: string;
  icon: React.ElementType;
  description: string;
  items: string[];
  important?: boolean;
}
const requirements: Requirement[] = [
  {
    title: "Документы",
    icon: FileText,
    description: "Обязательные документы для подачи заявления",
    items: [
      "Аттестат/диплом с апостилем",
      "Справка об оценках (Transcript)",
      "Переводы документов на немецкий",
      "Мотивационное письмо",
      "CV/резюме",
      "Фотографии"
    ]
  },
  {
    title: "Языковые требования",
    icon: Languages,
    description: "Необходимый уровень немецкого или английского языка",
    items: [
      "Немецкий: DSH-2, TestDaF 4x4",
      "Английский: IELTS 6.5+, TOEFL 90+",
      "Goethe C1/C2 сертификат",
      "Подготовительные курсы (Studienkolleg)",
      "Языковая виза для изучения языка"
    ],
    important: true
  },
  {
    title: "Академические требования",
    icon: Award,
    description: "Образование и оценки для поступления",
    items: [
      "12-13 лет школьного образования",
      "Средний балл от 4.0 (российская система)",
      "Профильные предметы по специальности",
      "Дополнительные экзамены (при необходимости)",
      "Портфолио (для творческих специальностей)"
    ]
  },
  {
    title: "Финансовые требования",
    icon: DollarSign,
    description: "Подтверждение финансовой состоятельности",
    items: [
      "Блокированный счет (11,208€ на год)",
      "Справка о доходах спонсора",
      "Стипендия или грант",
      "Справка из банка",
      "Договор поручительства"
    ]
  }
];
const timeline = [
  { month: "Январь-Март", task: "Подготовка документов", status: "start" },
  { month: "Апрель-Май", task: "Подача заявлений", status: "important" },
  { month: "Июнь-Июль", task: "Получение ответов", status: "waiting" },
  { month: "Август", task: "Оформление визы", status: "urgent" },
  { month: "Сентябрь", task: "Начало учебы", status: "success" }
];
const getStatusColor = (status: string) => {
  switch (status) {
    case "start": return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
    case "important": return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300";
    case "waiting": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
    case "urgent": return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
    case "success": return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
  }
};
export function EducationRequirements() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Требования для поступления
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-6 gradient-text">
              Что нужно для поступления
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Подробный список требований и документов для успешного поступления
              в немецкие университеты. Подготовьтесь заранее, чтобы не упустить сроки.
            </p>
          </motion.div>
        </div>
        {/* Requirements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {requirements.map((requirement, index) => {
            const IconComponent = requirement.icon;
            return (
              <motion.div
                key={requirement.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full group hover:shadow-xl transition-all duration-300 ${
                  requirement.important ? 'ring-2 ring-german-red/20 border-german-red/30' : ''
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-primary/10 dark:bg-primary/20">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      {requirement.important && (
                        <Badge className="bg-primary text-primary-foreground">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Важно
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold">
                      {requirement.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {requirement.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {requirement.items.map((item, itemIndex) => (
                        <motion.li
                          key={itemIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.2 + itemIndex * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-start gap-3 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-2xl font-bold">График поступления</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {timeline.map((phase, index) => (
                <motion.div
                  key={phase.month}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center relative"
                >
                  {/* Connector line */}
                  {index < timeline.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-border z-0" />
                  )}
                  <div className="relative z-10">
                    <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-2">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <Badge className={`${getStatusColor(phase.status)} mb-2`}>
                      {phase.month}
                    </Badge>
                    <p className="text-sm font-medium">{phase.task}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 border-primary/20">
            <h3 className="text-2xl font-bold mb-4">Нужна помощь с документами?</h3>
            <p className="text-muted-foreground mb-6">
              Наши консультанты помогут правильно подготовить документы
              и не упустить важные сроки подачи заявлений.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                Получить консультацию
              </Button>
              <Button variant="outline">
                Скачать чек-лист
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
