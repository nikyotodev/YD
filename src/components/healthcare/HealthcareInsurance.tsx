"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Shield,
  Euro,
  Check,
  Users,
  Crown,
  Calculator,
  FileText,
  CreditCard
} from "lucide-react";
const insuranceTypes = [
  {
    type: "GKV",
    title: "Государственное страхование",
    subtitle: "Gesetzliche Krankenversicherung",
    description: "Обязательное медицинское страхование для большинства жителей Германии",
    coverage: "90% населения",
    monthlyRate: "14.6% + 1.3%",
    features: [
      "Базовое медицинское обслуживание",
      "Стоматологическая помощь (частично)",
      "Лекарства по рецепту",
      "Экстренная помощь",
      "Профилактические осмотры",
      "Страхование по уходу (Pflegeversicherung)"
    ],
    pros: [
      "Фиксированная ставка взноса",
      "Семейное страхование без доплат",
      "Широкая сеть врачей",
      "Стабильные условия"
    ],
    cons: [
      "Ограниченный выбор врачей",
      "Очереди на некоторые процедуры",
      "Доплаты за некоторые услуги"
    ],
    color: "primary",
    recommended: true
  },
  {
    type: "PKV",
    title: "Частное страхование",
    subtitle: "Private Krankenversicherung",
    description: "Альтернатива для высокооплачиваемых работников и самозанятых",
    coverage: "10% населения",
    monthlyRate: "300-800€",
    features: [
      "Расширенное медицинское обслуживание",
      "Полная стоматологическая помощь",
      "Лечение у врачей-специалистов",
      "Одноместные палаты в больницах",
      "Альтернативная медицина",
      "Быстрая запись к врачам"
    ],
    pros: [
      "Премиальное обслуживание",
      "Быстрый доступ к врачам",
      "Более широкий спектр услуг",
      "Индивидуальные тарифы"
    ],
    cons: [
      "Высокая стоимость с возрастом",
      "Нет семейного страхования",
      "Сложно вернуться в GKV"
    ],
    color: "accent",
    recommended: false
  }
];
const insuranceSteps = [
  {
    step: 1,
    title: "Определите тип страхования",
    description: "Выберите между государственным (GKV) и частным (PKV) страхованием",
    icon: FileText
  },
  {
    step: 2,
    title: "Выберите страховую компанию",
    description: "Сравните предложения различных страховщиков и их условия",
    icon: Shield
  },
  {
    step: 3,
    title: "Подайте заявление",
    description: "Заполните анкету и предоставьте необходимые документы",
    icon: Users
  },
  {
    step: 4,
    title: "Получите страховую карту",
    description: "После одобрения получите карту страхования и начните пользоваться услугами",
    icon: CreditCard
  }
];
export function HealthcareInsurance() {
  return (
    <section id="healthcare-insurance" className="py-20 bg-muted/30 dark:bg-muted/20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float dark:bg-primary/10" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float animation-delay-2000 dark:bg-accent/10" />
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
              <Shield className="h-4 w-4 mr-2" />
              Медицинское страхование
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Выберите подходящее{" "}
            <span className="text-primary">медицинское страхование</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            В Германии существует два типа медицинского страхования. Изучите их особенности,
            чтобы сделать правильный выбор для вашей ситуации.
          </motion.p>
        </div>
        {/* Insurance types comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {insuranceTypes.map((insurance, index) => (
            <motion.div
              key={insurance.type}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className={`h-full border-2 transition-all duration-300 group relative ${
                insurance.recommended
                  ? 'border-primary/30 hover:border-primary/50 bg-primary/5'
                  : 'hover:border-accent/30 bg-card'
              }`}>
                {insurance.recommended && (
                  <div className="absolute -top-3 left-6">
                    <Badge className="bg-primary text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Рекомендуется
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className={`inline-flex p-4 rounded-full mb-4 ${
                      insurance.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                    }`}>
                      <Shield className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{insurance.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{insurance.subtitle}</p>
                    <p className="text-muted-foreground mb-4">{insurance.description}</p>
                    <div className="flex justify-center items-center gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{insurance.coverage}</div>
                        <div className="text-xs text-muted-foreground">Покрытие</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{insurance.monthlyRate}</div>
                        <div className="text-xs text-muted-foreground">Ежемесячно</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {/* Features */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                        Что включено
                      </h4>
                      <ul className="space-y-2">
                        {insurance.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <Check className="h-4 w-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Pros and Cons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-green-600 mb-2">Преимущества</h5>
                        <ul className="space-y-1">
                          {insurance.pros.map((pro, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground">• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-orange-600 mb-2">Недостатки</h5>
                        <ul className="space-y-1">
                          {insurance.cons.map((con, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground">• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {/* How to get insurance */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Как оформить медицинское страхование
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Пошаговый процесс получения медицинского страхования в Германии
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insuranceSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h4 className="font-semibold mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center bg-card rounded-2xl p-8 border"
        >
          <Calculator className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-bold mb-4">
            Нужна помощь с выбором страхования?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Наши эксперты помогут вам выбрать оптимальный вариант медицинского страхования
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Получить консультацию
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
