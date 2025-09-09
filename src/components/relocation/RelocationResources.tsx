"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ExternalLink,
  FileText,
  MapPin,
  Building,
  Briefcase,
  Home,
  Users,
  CreditCard,
  Shield,
  Plane,
  Car,
  School,
} from "lucide-react";
interface Resource {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  links: Array<{
    name: string;
    url: string;
    type: "official" | "community" | "commercial";
  }>;
  category: string;
}
const resources: Resource[] = [
  {
    icon: FileText,
    title: "Документы и визы",
    description: "Официальные сайты для оформления документов",
    category: "Документы",
    links: [
      { name: "Немецкое консульство", url: "https://germania.diplo.de/", type: "official" },
      { name: "Blue Card программа", url: "https://www.make-it-in-germany.com/", type: "official" },
      { name: "Сайт иммиграции", url: "https://www.germany-visa.org/", type: "commercial" },
    ],
  },
  {
    icon: Briefcase,
    title: "Поиск работы",
    description: "Лучшие сайты для поиска вакансий в Германии",
    category: "Работа",
    links: [
      { name: "StepStone", url: "https://www.stepstone.de/", type: "commercial" },
      { name: "Xing Jobs", url: "https://www.xing.com/jobs", type: "commercial" },
      { name: "Indeed Германия", url: "https://de.indeed.com/", type: "commercial" },
    ],
  },
  {
    icon: Home,
    title: "Поиск жилья",
    description: "Платформы для аренды квартир и домов",
    category: "Жильё",
    links: [
      { name: "ImmobilienScout24", url: "https://www.immobilienscout24.de/", type: "commercial" },
      { name: "WG-Gesucht", url: "https://www.wg-gesucht.de/", type: "community" },
      { name: "Studenten-WG", url: "https://www.studenten-wg.de/", type: "community" },
    ],
  },
  {
    icon: CreditCard,
    title: "Банки и финансы",
    description: "Банковские услуги для иммигрантов",
    category: "Финансы",
    links: [
      { name: "Deutsche Bank", url: "https://www.deutsche-bank.de/", type: "commercial" },
      { name: "N26 Bank", url: "https://n26.com/de", type: "commercial" },
      { name: "Sparkasse", url: "https://www.sparkasse.de/", type: "commercial" },
    ],
  },
  {
    icon: Users,
    title: "Сообщества",
    description: "Русскоязычные сообщества в Германии",
    category: "Сообщество",
    links: [
      { name: "Русские в Германии", url: "https://www.facebook.com/groups/russians.in.germany", type: "community" },
      { name: "Форум Винского", url: "https://forum.awd.ru/", type: "community" },
      { name: "Telegram чаты", url: "https://t.me/germany_visa_chat", type: "community" },
    ],
  },
  {
    icon: Car,
    title: "Транспорт",
    description: "Общественный транспорт и автомобили",
    category: "Транспорт",
    links: [
      { name: "Deutsche Bahn", url: "https://www.bahn.de/", type: "official" },
      { name: "BlaBlaCar", url: "https://www.blablacar.de/", type: "commercial" },
      { name: "MVG München", url: "https://www.mvg.de/", type: "official" },
    ],
  },
];
const quickTips = [
  {
    title: "Изучите немецкий до переезда",
    description: "Минимум B1 уровень значительно упростит адаптацию",
    icon: "🎓",
  },
  {
    title: "Подготовьте документы заранее",
    description: "Переводы и апостили могут занять несколько месяцев",
    icon: "📄",
  },
  {
    title: "Найдите работу дистанционно",
    description: "Большинство IT-компаний проводят собеседования онлайн",
    icon: "💻",
  },
  {
    title: "Изучите культуру",
    description: "Понимание немецкой культуры поможет в интеграции",
    icon: "🇩🇪",
  },
];
export function RelocationResources() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-german-red/5 to-german-gold/5 rounded-full blur-3xl animate-float dark:from-purple-500/10 dark:to-pink-500/10" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-german-gold/5 to-german-red/5 rounded-full blur-3xl animate-float animation-delay-2000 dark:from-pink-500/10 dark:to-purple-500/10" />
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
              <MapPin className="h-4 w-4 mr-2" />
              Полезные ресурсы для релокации
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black mb-6 gradient-text"
          >
            Всё необходимое в одном месте
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Проверенные ресурсы и сервисы, которые помогут вам на каждом этапе релокации.
            От визовых вопросов до поиска жилья и работы.
          </motion.p>
        </div>
        {/* Resources grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {resources.map((resource, index) => {
            const IconComponent = resource.icon;
            return (
              <motion.div
                key={`resource-${resource.title}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full glass hover:glass-hover transition-all duration-300 border-border/30 group-hover:border-german-red/30 dark:group-hover:border-purple-500/30">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-german-red/10 to-german-gold/10 flex items-center justify-center group-hover:from-german-red/20 group-hover:to-german-gold/20 transition-all duration-300 dark:from-purple-500/10 dark:to-pink-500/10 dark:group-hover:from-purple-500/20 dark:group-hover:to-pink-500/20">
                        <IconComponent className="h-6 w-6 text-german-red dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {resource.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs border-german-red/20 dark:border-purple-500/20"
                        >
                          {resource.category}
                        </Badge>
                      </div>
                    </div>
                    {/* Description */}
                    <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                      {resource.description}
                    </p>
                    {/* Links */}
                    <div className="space-y-2">
                      {resource.links.map((link, linkIndex) => (
                        <a
                          key={`${resource.title}-link-${linkIndex}`}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-german-red/5 transition-colors dark:hover:bg-purple-500/5 group/link"
                        >
                          <span className="text-sm font-medium text-foreground">
                            {link.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                link.type === 'official' ? 'border-green-500/30 text-green-600' :
                                link.type === 'community' ? 'border-blue-500/30 text-blue-600' :
                                'border-purple-500/30 text-purple-600'
                              }`}
                            >
                              {link.type === 'official' ? 'Официальный' :
                               link.type === 'community' ? 'Сообщество' :
                               'Коммерческий'}
                            </Badge>
                            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover/link:text-german-red transition-colors dark:group-hover/link:text-purple-400" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        {/* Quick tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-black mb-8 gradient-text">
            Быстрые советы для успешной релокации
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickTips.map((tip, index) => (
              <Card
                key={`tip-${tip.title}`}
                className="glass hover:glass-hover transition-all duration-300 border-border/30 hover:border-german-red/30 dark:hover:border-purple-500/30"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{tip.icon}</div>
                  <h4 className="font-bold mb-2 text-foreground">{tip.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tip.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
