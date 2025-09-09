"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Code,
  Stethoscope,
  Calculator,
  Briefcase,
  Palette,
  Zap,
  Clock,
  GraduationCap
} from "lucide-react";
interface Program {
  title: string;
  icon: React.ElementType;
  duration: string;
  degree: string;
  description: string;
  topics: string[];
  careerPaths: string[];
  popularity: "high" | "medium" | "low";
}
const programs: Program[] = [
  {
    title: "Информатика и IT",
    icon: Code,
    duration: "3-4 года",
    degree: "Bachelor/Master",
    description: "Программирование, алгоритмы, искусственный интеллект и кибербезопасность",
    topics: ["Python/Java", "Machine Learning", "DevOps", "Blockchain"],
    careerPaths: ["Software Engineer", "Data Scientist", "DevOps Engineer"],
    popularity: "high"
  },
  {
    title: "Медицина",
    icon: Stethoscope,
    duration: "6 лет",
    degree: "Staatsexamen",
    description: "Подготовка врачей с практикой в немецких клиниках",
    topics: ["Анатомия", "Физиология", "Клиническая практика", "Диагностика"],
    careerPaths: ["Врач общей практики", "Специалист", "Исследователь"],
    popularity: "high"
  },
  {
    title: "Инженерия",
    icon: Calculator,
    duration: "3-4 года",
    degree: "Bachelor/Master",
    description: "Машиностроение, автомобильная промышленность, энергетика",
    topics: ["CAD/CAM", "Автоматизация", "Робототехника", "Материаловедение"],
    careerPaths: ["Инженер-конструктор", "Project Manager", "R&D Engineer"],
    popularity: "high"
  },
  {
    title: "Бизнес и экономика",
    icon: Briefcase,
    duration: "3-4 года",
    degree: "Bachelor/Master",
    description: "Международный бизнес, финансы, маркетинг и управление",
    topics: ["Финансы", "Маркетинг", "Логистика", "Международная торговля"],
    careerPaths: ["Business Analyst", "Product Manager", "Consultant"],
    popularity: "medium"
  },
  {
    title: "Дизайн и искусство",
    icon: Palette,
    duration: "3-4 года",
    degree: "Bachelor/Master",
    description: "Графический дизайн, промышленный дизайн, изобразительное искусство",
    topics: ["UI/UX", "3D моделирование", "Branding", "Digital Art"],
    careerPaths: ["UX/UI Designer", "Art Director", "Creative Director"],
    popularity: "medium"
  },
  {
    title: "Возобновляемая энергетика",
    icon: Zap,
    duration: "3-4 года",
    degree: "Bachelor/Master",
    description: "Солнечная и ветровая энергия, устойчивые технологии",
    topics: ["Солнечные панели", "Ветрогенераторы", "Smart Grid", "Экология"],
    careerPaths: ["Energy Engineer", "Sustainability Consultant", "Project Developer"],
    popularity: "low"
  }
];
const getPopularityColor = (popularity: string) => {
  switch (popularity) {
    case "high": return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
    case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
    case "low": return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
  }
};
const getPopularityText = (popularity: string) => {
  switch (popularity) {
    case "high": return "Очень популярно";
    case "medium": return "Популярно";
    case "low": return "Перспективно";
    default: return "";
  }
};
export function EducationPrograms() {
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
              <GraduationCap className="h-4 w-4 mr-2" />
              Программы обучения
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Выберите свою специальность
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Немецкие университеты предлагают широкий спектр программ от технических
              до гуманитарных направлений. Найдите программу, которая откроет
              путь к успешной карьере.
            </p>
          </motion.div>
        </div>
        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => {
            const IconComponent = program.icon;
            return (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full group hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <Badge className={getPopularityColor(program.popularity)}>
                        {getPopularityText(program.popularity)}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {program.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {program.duration}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {program.degree}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {program.description}
                    </p>
                    {/* Key Topics */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Ключевые темы:</h4>
                      <div className="flex flex-wrap gap-1">
                        {program.topics.map((topic) => (
                          <Badge
                            key={topic}
                            variant="secondary"
                            className="text-xs"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {/* Career Paths */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Карьерные пути:</h4>
                      <ul className="space-y-1">
                        {program.careerPaths.map((path) => (
                          <li
                            key={path}
                            className="text-xs text-muted-foreground flex items-center"
                          >
                            <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                            {path}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-primary to-secondary dark:from-primary/80 dark:to-secondary/80 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Не знаете, какую программу выбрать?
            </h3>
            <p className="mb-6 text-white/90">
              Наш AI-помощник поможет подобрать программу обучения
              исходя из ваших интересов и карьерных целей.
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="bg-white dark:bg-background text-primary dark:text-foreground hover:bg-white/90 dark:hover:bg-background/90 font-semibold"
            >
              Получить рекомендации
            </Button>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
