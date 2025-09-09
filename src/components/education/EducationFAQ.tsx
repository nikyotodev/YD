"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
interface FAQItem {
  question: string;
  answer: string;
}
const faqItems: FAQItem[] = [
  {
    question: "Нужно ли знать немецкий язык для поступления?",
    answer: "Зависит от программы. Для большинства программ на немецком языке требуется уровень B2-C1. Некоторые международные программы ведутся на английском языке. Также можно поступить в Studienkolleg для изучения языка."
  },
  {
    question: "Сколько стоит образование в Германии?",
    answer: "Государственные университеты практически бесплатны (семестровый взнос 150-350€). Частные университеты стоят 20,000-40,000€ в год. Основные расходы - это проживание (800-1500€/месяц)."
  },
  {
    question: "Можно ли работать во время учебы?",
    answer: "Да, студенты могут работать 20 часов в неделю или 120 полных дней в году. Это позволяет зарабатывать 400-800€ в месяц и покрывать часть расходов на жизнь."
  },
  {
    question: "Какие документы нужны для поступления?",
    answer: "Аттестат/диплом с апостилем, справка об оценках, переводы на немецкий, языковые сертификаты, мотивационное письмо, CV, справка о блокированном счете (11,208€)."
  },
  {
    question: "Как получить студенческую визу?",
    answer: "Подайте документы в немецкое консульство после получения Zulassung (приглашения) от университета. Процесс занимает 4-8 недель. Нужен блокированный счет и медицинская страховка."
  },
  {
    question: "Признается ли российский/белорусский аттестат?",
    answer: "Да, но обычно требуется 1 год обучения в российском/белорусском вузе или прохождение Studienkolleg в Германии для получения Hochschulzugangsberechtigung."
  },
  {
    question: "Где искать жилье для студентов?",
    answer: "Студенческие общежития (200-400€), WG-Gesucht.de для комнат в квартирах (300-600€), частные квартиры через ImmobilienScout24. Подавайтесь заранее!"
  },
  {
    question: "Можно ли остаться работать после окончания?",
    answer: "Да! После окончания выпускники получают 18-месячную визу для поиска работы. При трудоустройстве можно получить Blue Card EU или рабочую визу для долгосрочного пребывания."
  }
];
export function EducationFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };
  return (
    <section className="py-16 md:py-24 bg-muted/30">
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
              <HelpCircle className="h-4 w-4 mr-2" />
              Частые вопросы
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-6 gradient-text">
              Ответы на популярные вопросы
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Собрали самые частые вопросы о поступлении и обучении в Германии.
              Если не нашли ответ, обратитесь к нашим консультантам.
            </p>
          </motion.div>
        </div>
        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold pr-4 group-hover:text-primary">
                      {item.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openItems.includes(index) ? (
                        <ChevronUp className="h-5 w-5 text-primary" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>
                {openItems.includes(index) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="pt-0 pb-6 px-6">
                      <div className="border-t border-border pt-4">
                        <p className="text-muted-foreground leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="max-w-2xl mx-auto p-8 bg-muted/30 dark:bg-muted/20 border-primary/20 dark:border-primary/30">
            <h3 className="text-2xl font-bold mb-4">Остались вопросы?</h3>
            <p className="text-muted-foreground mb-6">
              Наши эксперты готовы помочь с любыми вопросами о поступлении
              и обучении в немецких университетах.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-md transition-colors">
                Задать вопрос эксперту
              </button>
              <button className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-6 py-3 rounded-md transition-colors">
                Скачать гид по поступлению
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
