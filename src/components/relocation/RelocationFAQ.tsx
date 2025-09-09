"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronRight, HelpCircle } from "lucide-react";
interface FAQItem {
  question: string;
  answer: string;
  category: string;
}
const faqItems: FAQItem[] = [
  {
    category: "Языковые требования",
    question: "Какой уровень немецкого нужен для релокации?",
    answer: "Зависит от типа визы: A1-A2 для воссоединения семьи, B1-B2 для рабочих виз и Blue Card, C1-C2 для академических программ. Для большинства IT-специальностей достаточно B1-B2 уровня.",
  },
  {
    category: "Документы",
    question: "Сколько времени занимает подготовка документов?",
    answer: "Обычно 2-4 месяца. Включает переводы дипломов, медицинские справки, справки о несудимости и финансовые гарантии. Некоторые документы требуют апостилирования.",
  },
  {
    category: "Виза",
    question: "Что такое Blue Card и кто может её получить?",
    answer: "Blue Card — специальная виза для высококвалифицированных специалистов. Требования: высшее образование, контракт с зарплатой от €56,800/год (€44,304 для дефицитных профессий), знание немецкого B1+.",
  },
  {
    category: "Работа",
    question: "Можно ли найти работу в Германии без знания немецкого?",
    answer: "Да, особенно в IT-сфере. Многие международные компании используют английский как рабочий язык. Однако знание немецкого значительно расширит ваши возможности.",
  },
  {
    category: "Жильё",
    question: "Сколько стоит аренда жилья в Германии?",
    answer: "Зависит от города: Мюнхен €1,200-1,800/месяц за 1-комнатную, Берлин €800-1,200, небольшие города €400-700. Дополнительно: коммунальные услуги (€200-300), депозит (2-3 месячные арендные платы).",
  },
  {
    category: "Семья",
    question: "Можно ли перевезти семью?",
    answer: "Да, держатели рабочих виз и Blue Card могут привезти супруга и детей до 18 лет. Супруг получает разрешение на работу. Для детей школьного возраста обязательно посещение школы.",
  },
  {
    category: "Финансы",
    question: "Сколько денег нужно для переезда?",
    answer: "Минимум €10,000-15,000 на первое время: авиабилеты, депозит за жильё, первые месяцы проживания, документы. Для семьи из 3 человек рекомендуется €20,000-25,000.",
  },
  {
    category: "Налоги",
    question: "Какие налоги платят резиденты Германии?",
    answer: "Подоходный налог 14-45%, социальные взносы ~20% (медицина, пенсия, безработица). Общая налоговая нагрузка 35-50% в зависимости от дохода. Семьи с детьми получают льготы.",
  },
  {
    category: "Образование",
    question: "Признаются ли российские дипломы в Германии?",
    answer: "Большинство дипломов признаются после процедуры признания (Anerkennung). Процесс занимает 2-4 месяца, стоит €100-600. Некоторые профессии требуют дополнительного обучения.",
  },
  {
    category: "Интеграция",
    question: "Обязательно ли проходить интеграционные курсы?",
    answer: "Да, для большинства типов виз. Курсы включают изучение языка (до B1) и культуры Германии. Длительность 600-960 часов, стоимость €1.95/час для большинства участников.",
  },
];
export function RelocationFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };
  const categories = Array.from(new Set(faqItems.map(item => item.category)));
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-german-red/5 to-german-gold/5 rounded-full blur-3xl animate-float dark:from-purple-500/10 dark:to-pink-500/10" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-german-gold/5 to-german-red/5 rounded-full blur-3xl animate-float animation-delay-2000 dark:from-pink-500/10 dark:to-purple-500/10" />
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
              <HelpCircle className="h-4 w-4 mr-2" />
              Часто задаваемые вопросы
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black mb-6 gradient-text"
          >
            Ответы на важные вопросы
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Собрали самые популярные вопросы о релокации в Германию.
            Если не нашли ответ на свой вопрос — обращайтесь в наш чат поддержки.
          </motion.p>
        </div>
        {/* FAQ Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category, index) => (
            <Badge
              key={`category-${category}`}
              variant="outline"
              className="border-german-red/20 text-foreground hover:bg-german-red/5 transition-colors cursor-pointer dark:border-purple-500/20 dark:hover:bg-purple-500/5"
            >
              {category}
            </Badge>
          ))}
        </motion.div>
        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openItems.includes(index);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="glass hover:glass-hover transition-all duration-300 border-border/30 group-hover:border-german-red/30 overflow-hidden dark:group-hover:border-purple-500/30">
                  <CardContent className="p-0">
                    {/* Question */}
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-german-red/5 transition-colors dark:hover:bg-purple-500/5"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge
                            variant="secondary"
                            className="bg-german-gold/10 text-german-red border-german-gold/20 text-xs dark:bg-pink-500/10 dark:text-pink-300 dark:border-pink-500/20"
                          >
                            {item.category}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {item.question}
                        </h3>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </motion.div>
                    </button>
                    {/* Answer */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: isOpen ? "auto" : 0,
                        opacity: isOpen ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <div className="pt-4 border-t border-border/30">
                          <p className="text-muted-foreground leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="glass border-german-red/20 dark:border-purple-500/20">
            <CardContent className="p-8">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-black mb-4 gradient-text">
                  Остались вопросы?
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Наша команда экспертов по релокации готова помочь вам на каждом этапе переезда.
                  Присоединяйтесь к сообществу или задайте вопрос в чате поддержки.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://t.me/yourdeutsch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-german-red to-german-gold hover:from-german-dark-red hover:to-german-light-gold text-white font-semibold rounded-lg transition-all duration-300 dark:from-purple-500 dark:to-pink-500"
                  >
                    💬 Telegram сообщество
                  </a>
                  <a
                    href="/chat"
                    className="inline-flex items-center justify-center px-8 py-4 border border-german-red/30 text-german-red hover:bg-german-red/10 font-semibold rounded-lg transition-all duration-300 dark:border-purple-500/30 dark:text-purple-400 dark:hover:bg-purple-500/10"
                  >
                    🤖 AI Консультант
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
