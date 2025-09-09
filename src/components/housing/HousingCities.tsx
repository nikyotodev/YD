"use client";
import { memo, useState, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Train,
  Euro,
  TrendingUp,
  Users,
  Home,
  ChevronRight,
  Coffee
} from "lucide-react";
import Image from "next/image";
const HousingCities = memo(function HousingCities() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const cities = useMemo(() => [
    {
      name: "Берлин",
      state: "Берлин",
      population: "3,7 млн",
      avgRent: "12-18€/м²",
      image: "https://images.unsplash.com/photo-1587330979470-3016b6702d89?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Столица Германии с богатой культурной жизнью и множеством возможностей",
      highlight: "Культурная столица",
      pros: ["Культурная столица", "Много стартапов", "Относительно доступное жилье", "Международная атмосфера"],
      jobMarket: "IT, медиа, государственный сектор",
      transport: "Отличный общественный транспорт",
      color: "from-blue-500 to-purple-600"
    },
    {
      name: "Мюнхен",
      state: "Бавария",
      population: "1,5 млн",
      avgRent: "18-28€/м²",
      image: "https://images.unsplash.com/photo-1595867818082-083862f3d630?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Экономический центр с высоким качеством жизни и близостью к Альпам",
      highlight: "Высокие зарплаты",
      pros: ["Высокие зарплаты", "Качество жизни", "Близость к Альпам", "Стабильная экономика"],
      jobMarket: "IT, автомобили, финансы",
      transport: "Развитая система MVG",
      color: "from-green-500 to-blue-500"
    },
    {
      name: "Гамбург",
      state: "Гамбург",
      population: "1,9 млн",
      avgRent: "12-18€/м²",
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Портовый город с морской атмосферой и развитой медиаиндустрией",
      highlight: "Морской порт",
      pros: ["Морская атмосфера", "Медиаиндустрия", "Культурная жизнь", "Относительно доступно"],
      jobMarket: "Логистика, медиа, торговля",
      transport: "Система HVV с паромами",
      color: "from-teal-500 to-green-500"
    },
    {
      name: "Кёльн",
      state: "Северный Рейн-Вестфалия",
      population: "1,1 млн",
      avgRent: "11-16€/м²",
      image: "https://images.unsplash.com/photo-1549057446-7bdf70251b9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Медиастолица Германии с богатой историей и современной индустрией",
      highlight: "Медиастолица",
      pros: ["Медиаиндустрия", "Историческое наследие", "Доступные цены", "Центральное расположение"],
      jobMarket: "Медиа, реклама, искусство",
      transport: "Развитая трамвайная сеть",
      color: "from-orange-500 to-red-500"
    }
  ], []);
  const handleCitySelect = useCallback((cityName: string) => {
    setSelectedCity(selectedCity === cityName ? null : cityName);
  }, [selectedCity]);
  return (
    <section className="py-16 lg:py-24">
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
              <MapPin className="h-4 w-4 mr-2" />
              Популярные города
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black mb-6 leading-tight"
          >
            Лучшие города{" "}
            <span className="relative">
              <span className="relative z-10">для жизни</span>
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
            Выберите город, который подходит именно вам. Сравните цены на жилье,
            зарплаты и качество жизни в главных городах Германии.
          </motion.p>
        </div>
        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {cities.map((city, index) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm cursor-pointer"
                onClick={() => handleCitySelect(city.name)}
              >
                {/* Image Header */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={city.image}
                    alt={`${city.name} cityscape`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* City Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
                      >
                        {city.highlight}
                      </Badge>
                      <div className="text-white text-sm font-medium">
                        {city.population}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{city.name}</h3>
                    <p className="text-sm text-white/90">{city.state}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  {/* Price and Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gradient-to-br from-german-red/10 to-german-gold/10 dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Euro className="h-4 w-4 text-german-red dark:text-dark-theme-pink mr-1" />
                        <span className="text-sm font-medium text-muted-foreground">Аренда</span>
                      </div>
                      <div className="text-lg font-bold">{city.avgRent}</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-german-red/10 to-german-gold/10 dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Briefcase className="h-4 w-4 text-german-red dark:text-dark-theme-pink mr-1" />
                        <span className="text-sm font-medium text-muted-foreground">Работа</span>
                      </div>
                      <div className="text-sm font-bold">{city.jobMarket.split(',')[0]}</div>
                    </div>
                  </div>
                  {/* Description */}
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {city.description}
                  </p>
                  {/* Pros */}
                  <div className="space-y-2 mb-4">
                    {city.pros.slice(0, 3).map((pro, proIndex) => (
                      <div key={proIndex} className="flex items-center space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                        <span className="text-muted-foreground">{pro}</span>
                      </div>
                    ))}
                  </div>
                  {/* Expand Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group/btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCitySelect(city.name);
                    }}
                  >
                    <span>{selectedCity === city.name ? 'Скрыть детали' : 'Подробнее'}</span>
                    <ChevronRight className={`h-4 w-4 ml-2 transition-transform ${
                      selectedCity === city.name ? 'rotate-90' : 'group-hover/btn:translate-x-1'
                    }`} />
                  </Button>
                  {/* Expanded Content */}
                  {selectedCity === city.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-border"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <Train className="h-4 w-4 text-german-red dark:text-dark-theme-pink mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-medium">Транспорт: </span>
                            <span className="text-sm text-muted-foreground">{city.transport}</span>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Briefcase className="h-4 w-4 text-german-red dark:text-dark-theme-pink mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-medium">Работа: </span>
                            <span className="text-sm text-muted-foreground">{city.jobMarket}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
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
            <h3 className="text-2xl font-bold mb-4">Не можете определиться?</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Рассмотрите временное жилье в WG (Wohngemeinschaft) или краткосрочную аренду.
              Это поможет изучить город и найти идеальный район перед долгосрочным переездом.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge variant="outline" className="text-sm px-3 py-1">
                <Coffee className="h-3 w-3 mr-1" />
                Попробуйте пожить 1-3 месяца
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                <Home className="h-3 w-3 mr-1" />
                Затем выберите постоянное жилье
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
export { HousingCities };
