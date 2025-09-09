"use client";
import { memo, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ExternalLink, Star, TrendingUp, Globe, Home, Search, Users, MapPin } from "lucide-react";
import Image from "next/image";
const HousingPlatforms = memo(function HousingPlatforms() {
  const platforms = useMemo(() => [
    {
      name: "ImmobilienScout24",
      description: "Крупнейшая платформа недвижимости в Германии с более чем 2 млн объявлений",
      url: "https://www.immobilienscout24.de",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      rating: 4.8,
      type: "Аренда и покупка",
      popularity: "Самая популярная",
      icon: Home,
      highlight: "2M+ объявлений",
      pros: [
        "Огромная база объектов",
        "Удобные фильтры поиска",
        "Мобильное приложение",
        "Push-уведомления"
      ]
    },
    {
      name: "WG-Gesucht",
      description: "Специализированная платформа для поиска комнат в WG и временного жилья",
      url: "https://www.wg-gesucht.de",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      rating: 4.5,
      type: "WG и комнаты",
      popularity: "Для студентов",
      icon: Users,
      highlight: "Лучше для WG",
      pros: [
        "Много предложений WG",
        "Подходит для студентов",
        "Временное жилье",
        "Прямой контакт"
      ]
    },
    {
      name: "Immowelt",
      description: "Вторая по величине платформа недвижимости с качественными объявлениями",
      url: "https://www.immowelt.de",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      rating: 4.6,
      type: "Аренда и покупка",
      popularity: "Альтернатива",
      icon: Search,
      highlight: "Качество",
      pros: [
        "Качественные объявления",
        "Хорошие фотографии",
        "Меньше конкуренции",
        "Удобный интерфейс"
      ]
    },
    {
      name: "eBay Kleinanzeigen",
      description: "Популярная доска объявлений с разнообразными предложениями от частных лиц",
      url: "https://www.kleinanzeigen.de",
      image: "https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      rating: 4.2,
      type: "Все типы",
      popularity: "Частные объявления",
      icon: Globe,
      highlight: "Без комиссии",
      pros: [
        "Частные объявления",
        "Прямой контакт",
        "Без комиссии агентству",
        "Быстрые ответы"
      ]
    }
  ], []);
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-background via-muted/30 to-background">
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
              variant="secondary"
              className="mb-4 px-4 py-2 text-sm font-medium"
            >
              <Search className="h-4 w-4 mr-2" />
              Лучшие платформы для поиска
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black mb-6 leading-tight"
          >
            Где искать{" "}
            <span className="relative">
              <span className="relative z-10">жильё</span>
              <div className="absolute bottom-1 left-0 w-full h-3 bg-german-red/30 transform -skew-x-12 z-0" />
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Обзор топовых платформ для поиска аренды и покупки недвижимости в Германии.
            Каждая имеет свои особенности и преимущества.
          </motion.p>
        </div>
        {/* Platforms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                {/* Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={platform.image}
                    alt={`${platform.name} platform`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  {/* Platform Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
                      >
                        {platform.popularity}
                      </Badge>
                      <div className="flex items-center space-x-1 text-white">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{platform.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white">{platform.name}</h3>
                    <p className="text-sm text-white/90">{platform.type}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  {/* Highlight */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-german-red/20 to-german-gold/20 dark:from-dark-theme-purple/30 dark:to-dark-theme-pink/30 rounded-lg flex items-center justify-center">
                        <platform.icon className="w-4 h-4 text-german-red dark:text-dark-theme-pink" />
                      </div>
                      <Badge variant="outline" className="font-medium">
                        {platform.highlight}
                      </Badge>
                    </div>
                  </div>
                  {/* Description */}
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {platform.description}
                  </p>
                  {/* Pros */}
                  <div className="space-y-2 mb-6">
                    {platform.pros.map((pro, proIndex) => (
                      <div key={proIndex} className="flex items-center space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                        <span className="text-muted-foreground">{pro}</span>
                      </div>
                    ))}
                  </div>
                  {/* CTA Button */}
                  <Button
                    asChild
                    className="w-full group/btn bg-german-red hover:bg-german-dark-red text-white"
                  >
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2"
                    >
                      <span>Перейти на сайт</span>
                      <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-german-red/10 via-german-gold/10 to-german-red/10 dark:from-dark-theme-purple/20 dark:via-dark-theme-pink/20 dark:to-dark-theme-purple/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Совет эксперта</h3>
            <p className="text-muted-foreground leading-relaxed">
              Используйте несколько платформ одновременно и настройте уведомления.
              Скорость ответа на объявления в Германии критически важна — отвечайте в течение 2-3 часов!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
export { HousingPlatforms };
