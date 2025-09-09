"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
const faqData = [
  {
    question: "Обязательно ли медицинское страхование в Германии?",
    answer: "Да, медицинское страхование обязательно для всех жителей Германии. Вы должны застраховаться в течение 3 месяцев после переезда. Можно выбрать государственное (GKV) или частное (PKV) страхование."
  },
  {
    question: "Сколько стоит медицинское страхование?",
    answer: "Государственное страхование (GKV) стоит 14,6% + дополнительный взнос ~1,3% от зарплаты, разделённый пополам с работодателем. Частное страхование (PKV) стоит от 300 до 800€ в месяц в зависимости от возраста и состояния здоровья."
  },
  {
    question: "Как найти семейного врача (Hausarzt)?",
    answer: "Используйте онлайн-платформы (Doctolib, Jameda), звоните по номеру 116 117 или обращайтесь напрямую в медицинские практики. Семейный врач - ваша первая точка контакта в системе здравоохранения."
  },
  {
    question: "Что делать в экстренной ситуации?",
    answer: "При угрозе жизни звоните 112 (скорая, пожарная, полиция). При болезни в нерабочее время врачей звоните 116 117. В приёмный покой (Notaufnahme) обращайтесь только при серьёзных проблемах."
  },
  {
    question: "Нужно ли направление к врачу-специалисту?",
    answer: "Да, в большинстве случаев нужно направление (Überweisung) от семейного врача. Исключения: гинекология, офтальмология, стоматология - к ним можно обращаться напрямую."
  },
  {
    question: "Что покрывает базовое медицинское страхование?",
    answer: "Базовые медицинские услуги, большинство лекарств по рецепту, стационарное лечение, экстренная помощь, профилактические осмотры. Стоматология покрывается частично, за некоторые услуги нужны доплаты."
  },
  {
    question: "Как получить больничный лист?",
    answer: "При болезни идите к врачу, он выдаст справку о нетрудоспособности (Arbeitsunfähigkeitsbescheinigung). Один экземпляр отдайте работодателю в течение 3 дней, другой - страховой компании."
  },
  {
    question: "Можно ли сменить страховую компанию?",
    answer: "Да, в государственном страховании (GKV) можно сменить компанию через 18 месяцев членства с уведомлением за 2 месяца. В частном страховании (PKV) смена сложнее и дороже."
  },
  {
    question: "Что такое Zuzahlung (доплата)?",
    answer: "Это ваша доплата за некоторые медицинские услуги: 5-10€ за лекарства, 10€ за день в больнице, 10€ за физиотерапию. Максимум 2% от годового дохода (1% для хронически больных)."
  },
  {
    question: "Работает ли европейская страховая карта в Германии?",
    answer: "Да, EHIC (Европейская карта медицинского страхования) работает для экстренной помощи. Однако для постоянного проживания необходимо оформить немецкое страхование."
  }
];
export function HealthcareFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float dark:bg-primary/10" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float animation-delay-2000 dark:bg-accent/10" />
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
              <HelpCircle className="h-4 w-4 mr-2" />
              Часто задаваемые вопросы
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Ответы на{" "}
            <span className="text-primary">популярные вопросы</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Самые важные вопросы о немецкой системе здравоохранения
            и подробные ответы на них.
          </motion.p>
        </div>
        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <Card className="border-2 hover:border-primary/20 transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full p-6 text-left hover:bg-muted/50 transition-colors duration-300 flex items-center justify-between group"
                  >
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-300 pr-4">
                      {item.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openItems.includes(index) ? (
                        <ChevronUp className="h-5 w-5 text-primary" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                      )}
                    </div>
                  </button>
                  {openItems.includes(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-border"
                    >
                      <div className="p-6 pt-4 bg-muted/30 dark:bg-muted/20">
                        <p className="text-muted-foreground leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {/* Additional help section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-muted/30 rounded-2xl p-8 md:p-12 dark:bg-muted/20"
        >
          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-2xl font-bold mb-4">
            Не нашли ответ на свой вопрос?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Обратитесь к нам за персональной консультацией по вопросам
            здравоохранения в Германии. Наши эксперты помогут разобраться
            в любой ситуации.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-300"
            >
              Задать вопрос
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors duration-300"
            >
              Записаться на консультацию
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
