"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Euro, Home, Utensils, Car, Heart, Calculator } from "lucide-react";
interface CostItem {
  title: string;
  icon: React.ElementType;
  amount: string;
  period: string;
  description: string;
  breakdown?: string[];
}
const costs: CostItem[] = [
  {
    title: "Обучение",
    icon: Calculator,
    amount: "0-350€",
    period: "семестр",
    description: "Государственные университеты практически бесплатны",
    breakdown: ["Государственные: 150-350€", "Частные: 20,000-40,000€", "Семестровый взнос", "Студенческий билет"]
  },
  {
    title: "Жилье",
    icon: Home,
    amount: "300-700€",
    period: "месяц",
    description: "Стоимость зависит от города и типа жилья",
    breakdown: ["Общежитие: 200-400€", "WG (комната): 300-600€", "Квартира: 500-1000€", "Коммунальные услуги"]
  },
  {
    title: "Питание",
    icon: Utensils,
    amount: "200-300€",
    period: "месяц",
    description: "Готовка дома значительно экономит бюджет",
    breakdown: ["Продукты: 150-250€", "Столовая: 3-6€", "Ресторан: 10-25€", "Кафе: 2-4€"]
  },
  {
    title: "Транспорт",
    icon: Car,
    amount: "50-100€",
    period: "месяц",
    description: "Студенческие скидки на общественный транспорт",
    breakdown: ["Студенческий билет", "Велосипед: 100-300€", "Семестр-тикет включен", "Междугородние поездки"]
  },
  {
    title: "Медицина",
    icon: Heart,
    amount: "80-120€",
    period: "месяц",
    description: "Обязательная медицинская страховка",
    breakdown: ["Студенческая страховка", "До 30 лет льготы", "Визиты к врачу", "Лекарства по рецепту"]
  },
  {
    title: "Прочие расходы",
    icon: Euro,
    amount: "100-200€",
    period: "месяц",
    description: "Одежда, развлечения, учебные материалы",
    breakdown: ["Книги: 50-100€", "Одежда: 50-100€", "Развлечения: 50-150€", "Телефон: 10-30€"]
  }
];
export function EducationCosts() {
  const totalMinCost = 880; // минимальная стоимость в месяц
  const totalMaxCost = 1470; // максимальная стоимость в месяц
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
              <Euro className="h-4 w-4 mr-2" />
              Стоимость обучения и жизни
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Планируйте бюджет заранее
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Детальный расчет всех расходов на обучение и жизнь в Германии.
              Сравните с другими европейскими странами и убедитесь в доступности образования.
            </p>
          </motion.div>
        </div>
        {/* Total Cost Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-primary to-secondary dark:from-primary/80 dark:to-secondary/80 text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Общий бюджет на месяц</h3>
              <div className="flex justify-center items-center gap-8 mb-4">
                <div>
                  <div className="text-3xl font-black">{totalMinCost}€</div>
                  <div className="text-white/90">минимум</div>
                </div>
                <div className="text-2xl font-bold">-</div>
                <div>
                  <div className="text-3xl font-black">{totalMaxCost}€</div>
                  <div className="text-white/90">комфортно</div>
                </div>
              </div>
              <p className="text-white/90">
                ~{(totalMinCost * 12).toLocaleString()}€ - {(totalMaxCost * 12).toLocaleString()}€ в год
              </p>
            </div>
          </Card>
        </motion.div>
        {/* Costs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {costs.map((cost, index) => {
            const IconComponent = cost.icon;
            return (
              <motion.div
                key={cost.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full group hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 rounded-lg bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold">{cost.title}</CardTitle>
                        <Badge variant="outline" className="text-xs mt-1">
                          {cost.period}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-black text-primary mb-1">
                        {cost.amount}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {cost.description}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {cost.breakdown && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Детализация:</h4>
                        <ul className="space-y-1">
                          {cost.breakdown.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              className="text-xs text-muted-foreground flex items-center"
                            >
                              <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        {/* Financial Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 border-primary/20">
            <h3 className="text-2xl font-bold mb-6 text-center">💡 Советы по экономии</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">🏠 Жилье</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Подавайтесь в общежития заранее</li>
                  <li>• Рассмотрите WG (совместное жилье)</li>
                  <li>• Выбирайте города с низкой арендой</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🍽️ Питание</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Готовьте дома и покупайте в Aldi/Lidl</li>
                  <li>• Пользуйтесь студенческими столовыми</li>
                  <li>• Покупайте продукты со скидками</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🚌 Транспорт</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Семестр-тикет часто включен в взнос</li>
                  <li>• Купите подержанный велосипед</li>
                  <li>• Используйте BlaBlaCar для поездок</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">💰 Доходы</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Работайте 20 часов в неделю (студенческая виза)</li>
                  <li>• Подавайтесь на стипендии DAAD</li>
                  <li>• Рассмотрите работу в университете</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
