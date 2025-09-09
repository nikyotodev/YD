"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Users,
  Award,
  Globe,
  Star,
  BookOpen
} from "lucide-react";
import Image from "next/image";
interface University {
  name: string;
  location: string;
  ranking: string;
  students: string;
  international: string;
  programs: string[];
  image: string;
  highlight: string;
}
const universities: University[] = [
  {
    name: "Мюнхенский университет",
    location: "Мюнхен, Бавария",
    ranking: "#1 в Германии",
    students: "50,000+",
    international: "20%",
    programs: ["Медицина", "Инженерия", "Бизнес", "Философия"],
    image: "https://ugc.same-assets.com/_E13zn5dg6Ko_X2YaGTUc2XzBzHdwgIY.jpeg",
    highlight: "Старейший университет"
  },
  {
    name: "Технический университет Мюнхена",
    location: "Мюнхен, Бавария",
    ranking: "#2 в Германии",
    students: "45,000+",
    international: "35%",
    programs: ["IT", "Инженерия", "Математика", "Физика"],
    image: "https://ugc.same-assets.com/kMlluvLXYOzx7X_QwJb7Qbz0WpC_TXxm.jpeg",
    highlight: "Лидер в технологиях"
  },
  {
    name: "Гейдельбергский университет",
    location: "Гейдельберг, Баден-Вюртемберг",
    ranking: "#3 в Германии",
    students: "30,000+",
    international: "25%",
    programs: ["Науки", "Медицина", "Право", "Филология"],
    image: "https://ugc.same-assets.com/XlKGT7t5yndSKg7weC4kUavhGgpO7uqH.jpeg",
    highlight: "Исследовательский центр"
  }
];
export function EducationUniversities() {
  return (
    <section id="universities" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge
              variant="outline"
              className="mb-4 px-4 py-2"
            >
              <Award className="h-4 w-4 mr-2" />
              Топ университеты Германии
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Лучшие университеты Европы
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Германия предлагает более 400 высших учебных заведений с отличной репутацией
              и международным признанием. Выберите университет для своей карьеры.
            </p>
          </motion.div>
        </div>
        {/* Universities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {universities.map((university, index) => (
            <motion.div
              key={university.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* University Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={university.image}
                    alt={university.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground">
                      {university.highlight}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 dark:bg-black/90 text-black dark:text-white">
                      <Star className="h-3 w-3 mr-1" />
                      {university.ranking}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  {/* University Name & Location */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">{university.name}</h3>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{university.location}</span>
                    </div>
                  </div>
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Users className="h-5 w-5 mx-auto mb-1 text-german-red" />
                      <div className="text-sm font-semibold">{university.students}</div>
                      <div className="text-xs text-muted-foreground">студентов</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Globe className="h-5 w-5 mx-auto mb-1 text-german-red" />
                      <div className="text-sm font-semibold">{university.international}</div>
                      <div className="text-xs text-muted-foreground">иностранцев</div>
                    </div>
                  </div>
                  {/* Programs */}
                  <div>
                    <div className="flex items-center mb-2">
                      <BookOpen className="h-4 w-4 mr-2 text-german-red" />
                      <span className="text-sm font-medium">Популярные программы:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {university.programs.map((program) => (
                        <Badge
                          key={program}
                          variant="outline"
                          className="text-xs"
                        >
                          {program}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="max-w-4xl mx-auto p-8 bg-muted/30 dark:bg-muted/20 border-primary/20 dark:border-primary/30">
            <h3 className="text-2xl font-bold mb-4">Почему выбирают немецкие университеты?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-lg font-semibold mb-2">🏆 Качество образования</div>
                <p className="text-sm text-muted-foreground">
                  Дипломы признаются во всём мире, высокие стандарты преподавания
                </p>
              </div>
              <div>
                <div className="text-lg font-semibold mb-2">💰 Доступная стоимость</div>
                <p className="text-sm text-muted-foreground">
                  Бесплатное образование в государственных университетах
                </p>
              </div>
              <div>
                <div className="text-lg font-semibold mb-2">🚀 Карьерные возможности</div>
                <p className="text-sm text-muted-foreground">
                  Стажировки в крупных компаниях, рабочая виза после окончания
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
