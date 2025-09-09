"use client";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  HelpCircle,
  ChevronDown,
  Clock,
  Euro,
  FileText,
  MapPin,
  Award,
  Users,
  Calendar,
  AlertCircle
} from "lucide-react";
import { useState } from "react";
interface FAQItem {
  question: string;
  answer: string;
  category: "general" | "preparation" | "exam-day" | "results";
  icon: typeof Clock;
}
const faqItems: FAQItem[] = [
  {
    question: "Как долго действителен сертификат Гёте?",
    answer: "Сертификаты Goethe-Zertifikat не имеют срока действия и действительны пожизненно. Однако некоторые учебные заведения и работодатели могут требовать сертификат не старше 2-3 лет для подтверждения актуального уровня языка.",
    category: "general",
    icon: Award
  },
  {
    question: "Сколько стоит экзамен Гёте в разных странах?",
    answer: "Стоимость варьируется по странам: в России €150-320, в Германии €150-350, в других странах СНГ €130-300. Цена зависит от уровня экзамена - чем выше уровень, тем дороже. Модульные экзамены можно сдавать по частям.",
    category: "general",
    icon: Euro
  },
  {
    question: "Можно ли сдавать модули экзамена отдельно?",
    answer: "Да, начиная с уровня B1 экзамены имеют модульную структуру. Вы можете сдавать каждый модуль (чтение, письмо, говорение, аудирование) отдельно в течение одного календарного года. Это удобно, если вы не сдали какой-то модуль с первого раза.",
    category: "general",
    icon: FileText
  },
  {
    question: "Сколько времени нужно для подготовки к экзамену?",
    answer: "Время подготовки зависит от вашего текущего уровня и целевого уровня: A1 — 80-200 часов, A2 — 200-350 часов, B1 — 350-650 часов, B2 — 650-800 часов, C1 — 800-1000 часов, C2 — 1000+ часов. При интенсивных занятиях 2-3 часа в день подготовка может занять 2-6 месяцев.",
    category: "preparation",
    icon: Clock
  },
  {
    question: "Какие учебники лучше всего использовать для подготовки?",
    answer: "Рекомендуемые учебники: серия 'Fit fürs Goethe-Zertifikat' (целенаправленная подготовка к экзамену), 'Menschen', 'Aspekte', 'Netzwerk' (общее изучение языка). Также используйте официальные пробные тесты Goethe-Institut и онлайн-ресурсы Deutsche Welle.",
    category: "preparation",
    icon: FileText
  },
  {
    question: "Как часто проводятся экзамены?",
    answer: "В большинстве городов экзамены проводятся 1-2 раза в месяц. В крупных центрах (Москва, Санкт-Петербург, Берлин) — еще чаще. Регистрация обычно закрывается за 3-4 недели до экзамена. Рекомендуем записываться заранее, особенно на популярные уровни B1-B2.",
    category: "exam-day",
    icon: Calendar
  },
  {
    question: "Что нужно принести в день экзамена?",
    answer: "Обязательно: действующий паспорт (или ID), подтверждение регистрации, ручки (синие или чёрные). Рекомендуется: бутылка воды, лёгкий перекус для перерыва, часы (если в аудитории нет часов). Запрещено: телефоны, электронные устройства, словари.",
    category: "exam-day",
    icon: MapPin
  },
  {
    question: "Что делать, если я заболел в день экзамена?",
    answer: "Сразу свяжитесь с экзаменационным центром и предоставьте медицинскую справку. В большинстве случаев вам разрешат перенести экзамен на следующую дату без дополнительной оплаты или вернут деньги. Уведомить нужно до начала экзамена.",
    category: "exam-day",
    icon: AlertCircle
  },
  {
    question: "Когда приходят результаты экзамена?",
    answer: "Предварительные результаты обычно доступны через 2-3 недели после экзамена в личном кабинете на сайте Goethe-Institut. Оригинал сертификата высылается почтой или выдаётся в центре через 4-6 недель. Электронная версия доступна сразу после получения результатов.",
    category: "results",
    icon: Award
  },
  {
    question: "Что делать, если я не сдал экзамен?",
    answer: "Вы можете пересдать экзамен полностью или только несданные модули (для B1-C2). Ограничений на количество попыток нет. Проанализируйте ошибки, дополнительно подготовьтесь и записывайтесь на следующую дату. Многие сдают с 2-3 попытки — это нормально.",
    category: "results",
    icon: Users
  },
  {
    question: "Признаётся ли сертификат Гёте для визы и университетов?",
    answer: "Да, сертификаты Goethe-Institut признаются во всём мире. B1 подходит для получения немецкого гражданства, B2 — для поступления в большинство немецких университетов, C1 — для работы врачом в Германии. Всегда уточняйте требования конкретной организации.",
    category: "general",
    icon: Award
  },
  {
    question: "В чём разница между Goethe, telc и TestDaF?",
    answer: "Goethe-Zertifikat — самый престижный, признается везде, но дороже. TELC — дешевле, практичный, хорош для визы и работы. TestDaF — только для университетов, формат сложнее. Для большинства целей Goethe — лучший выбор из-за универсального признания.",
    category: "general",
    icon: FileText
  }
];
const categories = [
  { id: "general", name: "Общие вопросы", icon: HelpCircle },
  { id: "preparation", name: "Подготовка", icon: FileText },
  { id: "exam-day", name: "День экзамена", icon: Clock },
  { id: "results", name: "Результаты", icon: Award }
];
export function GoetheExamFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("general");
  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };
  const filteredFAQ = faqItems.filter(item => item.category === activeCategory);
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">
              <HelpCircle className="h-4 w-4 mr-2" />
              Часто задаваемые вопросы
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black mb-6 gradient-text">
              Ответы на популярные вопросы
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Собрали самые частые вопросы о экзаменах Гёте и дали на них исчерпывающие ответы.
              Если не нашли ответ на свой вопрос — свяжитесь с нами.
            </p>
          </motion.div>
        </div>
        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-german-red to-german-gold text-white shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <category.icon className="h-4 w-4" />
              {category.name}
            </button>
          ))}
        </motion.div>
        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFAQ.map((item, index) => (
            <motion.div
              key={`${activeCategory}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all group border-2 hover:border-german-red/30 dark:hover:border-dark-theme-pink/30">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full text-left"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-german-red/10 to-german-gold/10 dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20 flex-shrink-0">
                          <item.icon className="h-5 w-5 text-german-red dark:text-dark-theme-pink" />
                        </div>
                        <h3 className="text-lg font-semibold group-hover:text-german-red dark:group-hover:text-dark-theme-pink transition-colors">
                          {item.question}
                        </h3>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ml-4 ${
                          openItems.includes(index) ? "transform rotate-180" : ""
                        }`}
                      />
                    </div>
                    {openItems.includes(index) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-border"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-9 flex-shrink-0" /> {/* Spacer for alignment */}
                          <p className="text-muted-foreground leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </button>
              </Card>
            </motion.div>
          ))}
        </div>
        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-german-red/5 to-german-gold/5 dark:from-dark-theme-purple/10 dark:to-dark-theme-pink/10 rounded-2xl p-8 border border-german-red/20 dark:border-dark-theme-pink/20">
            <h3 className="text-2xl font-bold mb-4">
              Не нашли ответ на свой вопрос?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Наши эксперты готовы помочь вам с любыми вопросами о подготовке и сдаче экзаменов Гёте.
              Свяжитесь с нами для персональной консультации.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@yourdeutsch.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-german-red to-german-gold hover:from-german-dark-red hover:to-german-light-gold text-white font-semibold rounded-lg transition-all"
              >
                <HelpCircle className="h-5 w-5 mr-2" />
                Задать вопрос эксперту
              </a>
              <a
                href="/chat"
                className="inline-flex items-center justify-center px-6 py-3 border border-german-red/30 text-german-red dark:text-dark-theme-pink dark:border-dark-theme-pink/30 font-semibold rounded-lg hover:bg-german-red/5 dark:hover:bg-dark-theme-pink/5 transition-all"
              >
                <Users className="h-5 w-5 mr-2" />
                AI Консультант
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
