"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe, BookOpen, FileText, Users, MessageCircle } from "lucide-react";
interface Resource {
  title: string;
  description: string;
  url: string;
  category: string;
  icon: React.ElementType;
  free: boolean;
}
const resources: Resource[] = [
  {
    title: "DAAD",
    description: "Официальная служба академических обменов Германии",
    url: "https://www.daad.de",
    category: "Официальное",
    icon: Globe,
    free: true
  },
  {
    title: "uni-assist",
    description: "Централизованная подача документов в немецкие вузы",
    url: "https://www.uni-assist.de",
    category: "Поступление",
    icon: FileText,
    free: false
  },
  {
    title: "Study in Germany",
    description: "Полный гид по обучению в Германии",
    url: "https://www.study-in-germany.de",
    category: "Информация",
    icon: BookOpen,
    free: true
  },
  {
    title: "Deutschland.de",
    description: "Официальный портал о жизни в Германии",
    url: "https://www.deutschland.de",
    category: "Жизнь",
    icon: Globe,
    free: true
  },
  {
    title: "DAAD Scholarships",
    description: "База стипендий для иностранных студентов",
    url: "https://www.daad.de/scholarships",
    category: "Стипендии",
    icon: Users,
    free: true
  },
  {
    title: "StudyCheck",
    description: "Отзывы студентов о немецких университетах",
    url: "https://www.studycheck.de",
    category: "Отзывы",
    icon: MessageCircle,
    free: true
  }
];
const categories = ["Все", "Официальное", "Поступление", "Информация", "Жизнь", "Стипендии", "Отзывы"];
export function EducationResources() {
  return (
    <section className="py-16 md:py-24 bg-background">
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
              <BookOpen className="h-4 w-4 mr-2" />
              Полезные ресурсы
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Проверенные источники информации
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Официальные сайты, платформы и сервисы, которые помогут вам
              на каждом этапе поступления и обучения в Германии.
            </p>
          </motion.div>
        </div>
        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => {
            const IconComponent = resource.icon;
            return (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full group hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-3 rounded-lg bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {resource.category}
                        </Badge>
                        {resource.free && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-xs">
                            Бесплатно
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-between h-full">
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {resource.description}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                      asChild
                    >
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        Перейти на сайт
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        {/* Additional Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="max-w-4xl mx-auto p-8 bg-muted/30 dark:bg-muted/20 border-primary/20 dark:border-primary/30">
            <h3 className="text-2xl font-bold mb-6 text-center">📚 Дополнительные советы</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-primary">🔗 Социальные сети</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Группы в Facebook для русскоязычных студентов</li>
                  <li>• Telegram-каналы об учебе в Германии</li>
                  <li>• LinkedIn для профессиональных контактов</li>
                  <li>• Reddit сообщества r/germany и r/studium</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-primary">📱 Мобильные приложения</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• DB Navigator для поездов</li>
                  <li>• Mensa для меню студенческих столовых</li>
                  <li>• WG-Gesucht для поиска жилья</li>
                  <li>• Duolingo для изучения немецкого</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-primary">📞 Консультации</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Офисы DAAD в вашей стране</li>
                  <li>• Консультации в Гёте-институтах</li>
                  <li>• Международные отделы университетов</li>
                  <li>• Агентства по образованию</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-primary">📖 Литература</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• "Studieren in Deutschland" (DAAD)</li>
                  <li>• Справочники по немецким вузам</li>
                  <li>• Гиды по немецкой культуре</li>
                  <li>• Учебники немецкого языка</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
