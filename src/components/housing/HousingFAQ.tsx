"use client";
import { memo, useState, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, HelpCircle } from "lucide-react";
interface FAQItem {
  question: string;
  answer: string;
  category: string;
}
const HousingFAQ = memo(function HousingFAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const toggleItem = useCallback((index: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);
  const faqItems: FAQItem[] = useMemo(() => [
    {
      category: "Документы",
      question: "Какие документы нужны для аренды квартиры в Германии?",
      answer: "Основные документы: паспорт или ID, справка о доходах за последние 3 месяца, справка Schufa (кредитная история), справка о регистрации (Meldebescheinigung). Дополнительно могут потребоваться: справка от предыдущего арендодателя, автобиография, банковские выписки."
    },
    {
      category: "Документы",
      question: "Что такое Schufa и как её получить?",
      answer: "Schufa — это справка о кредитной истории в Германии. Получить можно онлайн на сайте schufa.de или в отделении банка. Стоимость около 30€, действительна 3 месяца. Бесплатную версию можно заказать раз в год."
    },
    {
      category: "Поиск",
      question: "Сколько времени занимает поиск квартиры?",
      answer: "В среднем от 2 до 8 недель, в зависимости от города и требований. В Мюнхене и Франкфурте может занять до 3-6 месяцев, в Берлине 1-3 месяца, в небольших городах 2-4 недели."
    },
    {
      category: "Поиск",
      question: "Как быстро нужно отвечать на объявления?",
      answer: "Как можно быстрее! В популярных городах рекомендуется отвечать в течение 2-3 часов после публикации объявления. Многие арендодатели рассматривают заявки в порядке поступления."
    },
    {
      category: "Стоимость",
      question: "Что включает в себя Kaltmiete и Warmmiete?",
      answer: "Kaltmiete — это базовая арендная плата без коммунальных услуг. Warmmiete включает отопление, воду, уборку общих зон. Обычно разница составляет 100-300€ в зависимости от размера квартиры и региона."
    },
    {
      category: "Стоимость",
      question: "Сколько составляет залог (Kaution)?",
      answer: "Обычно 1-3 месячные арендные платы (Kaltmiete). По закону не может превышать 3 месячные платы. Залог должен храниться на отдельном счете и возвращается при выезде за вычетом возможных повреждений."
    },
    {
      category: "Стоимость",
      question: "Нужно ли платить комиссию агентству?",
      answer: "Зависит от типа объявления. Если объявление размещает агентство, комиссия обычно составляет 1-2 месячные аренды + НДС. Если объявление от частного лица, комиссии нет. С 2015 года действует принцип 'кто заказывает, тот и платит'."
    },
    {
      category: "Процесс",
      question: "Как проходит осмотр квартиры?",
      answer: "Осмотры могут быть индивидуальными или групповыми. Приходите точно вовремя, принесите все документы, задавайте вопросы о коммунальных услугах, соседях, ремонте. Будьте готовы принять решение сразу."
    },
    {
      category: "Процесс",
      question: "Что делать, если мне отказывают?",
      answer: "Не расстраивайтесь — конкуренция высокая. Проанализируйте причины: возможно, стоит улучшить документы, расширить географию поиска, рассмотреть временные варианты или комнаты в WG."
    },
    {
      category: "Права",
      question: "Какие права у арендатора в Германии?",
      answer: "Арендаторы имеют сильную защиту: арендодатель не может выселить без серьезных причин, повышения аренды ограничены (обычно не более 20% за 3 года), право на мелкий ремонт за счет арендодателя."
    },
    {
      category: "Права",
      question: "Можно ли расторгнуть договор досрочно?",
      answer: "Да, с уведомлением за 3 месяца (в крупных городах). Некоторые договоры содержат пункт о поиске замещающего арендатора. При срочных договорах досрочное расторжение сложнее."
    },
    {
      category: "Особенности",
      question: "Что такое WG и подходит ли это мне?",
      answer: "WG (Wohngemeinschaft) — это совместная аренда квартиры несколькими людьми. Каждый арендует комнату, общие зоны используются совместно. Подходит студентам, молодым специалистам, как временный вариант."
    },
    {
      category: "Особенности",
      question: "Нужно ли делать ремонт при въезде?",
      answer: "Зависит от договора. 'Unrenoviert' — без ремонта, 'renoviert' — с ремонтом, 'teilrenoviert' — частично. В некоторых случаях арендатор обязан сделать косметический ремонт при выезде."
    },
    {
      category: "Советы",
      question: "Как избежать мошенничества?",
      answer: "Никогда не переводите деньги до подписания договора и получения ключей. Проверяйте документы арендодателя, встречайтесь лично, избегайте слишком выгодных предложений. Будьте осторожны с объявлениями на eBay Kleinanzeigen."
    },
    {
      category: "Советы",
      question: "Что важно учесть при выборе района?",
      answer: "Близость к работе/учебе, транспортная доступность, безопасность, инфраструктура (магазины, врачи), уровень шума, перспективы развития района, наличие зеленых зон."
    }
  ], []);
  const categories = useMemo(() => {
    const cats = Array.from(new Set(faqItems.map(item => item.category)));
    return cats;
  }, [faqItems]);
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full text-sm font-medium text-german-red dark:text-dark-theme-pink border border-german-red/20 dark:border-dark-theme-pink/20 mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>Часто задаваемые вопросы</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Ответы на популярные вопросы
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Собрали самые частые вопросы о поиске жилья в Германии и дали подробные ответы
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index} className="glass overflow-hidden">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full p-6 text-left hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-xs font-medium text-german-red dark:text-dark-theme-pink bg-german-red/10 dark:bg-dark-theme-pink/10 px-2 py-1 rounded">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground pr-8">
                          {item.question}
                        </h3>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground transition-transform ${
                          openItems.has(index) ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>
                  {openItems.has(index) && (
                    <div className="px-6 pb-6">
                      <div className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Summary stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div key={category} className="text-center">
                <div className="glass p-4 rounded-lg">
                  <div className="text-2xl font-bold text-german-red dark:text-dark-theme-pink mb-1">
                    {faqItems.filter(item => item.category === category).length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
export { HousingFAQ };
