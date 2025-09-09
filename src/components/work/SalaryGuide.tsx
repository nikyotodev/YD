"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Code,
  Stethoscope,
  Wrench,
  Calculator,
  Palette,
  Briefcase,
  Building,
  MapPin,
  Euro,
} from "lucide-react";
interface SalaryData {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  profession: string;
  category: string;
  salaryRange: string;
  averageSalary: string;
  demandLevel: "Высокий" | "Средний" | "Умеренный";
  germanLevel: string;
  color: string;
}
const salaryData: SalaryData[] = [
  {
    id: "it-developer",
    icon: Code,
    profession: "IT-разработчик",
    category: "Технологии",
    salaryRange: "€45-95K",
    averageSalary: "€65K",
    demandLevel: "Высокий",
    germanLevel: "B1-B2",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "engineer",
    icon: Wrench,
    profession: "Инженер",
    category: "Техника",
    salaryRange: "€48-78K",
    averageSalary: "€58K",
    demandLevel: "Высокий",
    germanLevel: "B2-C1",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "medical-worker",
    icon: Stethoscope,
    profession: "Медработник",
    category: "Медицина",
    salaryRange: "€42-68K",
    averageSalary: "€52K",
    demandLevel: "Высокий",
    germanLevel: "C1-C2",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "financier",
    icon: Calculator,
    profession: "Финансист",
    category: "Финансы",
    salaryRange: "€45-75K",
    averageSalary: "€58K",
    demandLevel: "Средний",
    germanLevel: "B2-C1",
    color: "from-purple-500 to-violet-500",
  },
  {
    id: "architect",
    icon: Building,
    profession: "Архитектор",
    category: "Строительство",
    salaryRange: "€42-62K",
    averageSalary: "€50K",
    demandLevel: "Средний",
    germanLevel: "B2-C1",
    color: "from-gray-500 to-slate-500",
  },
  {
    id: "designer",
    icon: Palette,
    profession: "Дизайнер",
    category: "Креатив",
    salaryRange: "€35-55K",
    averageSalary: "€43K",
    demandLevel: "Умеренный",
    germanLevel: "B1-B2",
    color: "from-pink-500 to-rose-500",
  },
];
const cities = [
  { name: "Мюнхен", salaryMultiplier: "125%", cost: "Высокая" },
  { name: "Франкфурт", salaryMultiplier: "120%", cost: "Высокая" },
  { name: "Гамбург", salaryMultiplier: "115%", cost: "Средняя" },
  { name: "Берлин", salaryMultiplier: "110%", cost: "Средняя" },
  { name: "Дюссельдорф", salaryMultiplier: "118%", cost: "Высокая" },
  { name: "Штутгарт", salaryMultiplier: "122%", cost: "Высокая" },
];
function SalaryCard({ salary, index }: { salary: SalaryData; index: number }) {
  const IconComponent = salary.icon;
  const getDemandColor = (level: string) => {
    switch (level) {
      case "Высокий": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "Средний": return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "Умеренный": return "bg-orange-500/10 text-orange-700 border-orange-500/20";
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
      <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 bg-background/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${salary.color} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{salary.profession}</h3>
                <p className="text-sm text-muted-foreground">{salary.category}</p>
              </div>
            </div>
            <Badge className={getDemandColor(salary.demandLevel)}>
              {salary.demandLevel} спрос
            </Badge>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Диапазон зарплат:</span>
              <span className="font-semibold text-foreground">{salary.salaryRange}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Средняя зарплата:</span>
              <span className="font-bold text-german-red text-lg">{salary.averageSalary}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Уровень немецкого:</span>
              <Badge variant="outline" className="border-german-gold/20 text-german-red">
                {salary.germanLevel}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
export function SalaryGuide() {
  return (
    <section id="salaries" className="py-20 bg-muted/30">
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
              <Euro className="h-4 w-4 mr-2" />
              Зарплаты в Германии 2024
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-5xl font-black mb-6"
          >
            Сколько можно{" "}
            <span className="relative">
              <span className="relative z-10">зарабатывать?</span>
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
            Актуальная информация о зарплатах в разных сферах, требованиях к языку
            и спросе на рынке труда Германии.
          </motion.p>
        </div>
        {/* Salary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {salaryData.map((salary, index) => (
            <SalaryCard key={salary.id} salary={salary} index={index} />
          ))}
        </div>
        {/* City Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-3">Зарплаты по городам</h3>
            <p className="text-muted-foreground">
              Коэффициенты к базовой зарплате и стоимость жизни в крупных городах
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((city, index) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/30"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-german-red" />
                  <div>
                    <p className="font-semibold">{city.name}</p>
                    <p className="text-sm text-muted-foreground">Стоимость: {city.cost}</p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-german-gold/10 text-german-red border-german-red/20"
                >
                  {city.salaryMultiplier}
                </Badge>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/30">
            <p className="text-sm text-muted-foreground text-center">
              💡 <strong>Совет:</strong> Учитывайте не только зарплату, но и стоимость жизни.
              Берлин может предложить лучший баланс доходов и расходов.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
