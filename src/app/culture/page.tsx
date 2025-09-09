"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Utensils,
  Calendar,
  BookOpen,
  Users,
  PlayCircle,
  ChefHat,
  PartyPopper,
  Library,
  ArrowRight,
  Sparkles,
  Landmark,
  Building,
  GraduationCap,
  PaintBucket,
  MapPin,
  Castle,
  Heart,
  TreePine,
  Mountain,
  Coffee,
  PenTool,
  Globe,
  Film,
  Award,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import Head from "next/head";
// SEO данные для страницы
const SEO_TITLE =
  "Немецкая культура | YourDeutsch - Изучение немецкого языка через культуру";
const SEO_DESCRIPTION =
  "Погрузитесь в мир немецкой культуры, кухни, литературы и традиций. Изучайте немецкий язык через культурный контекст с YourDeutsch.";
const SEO_KEYWORDS =
  "немецкая культура, изучение немецкого языка, немецкая кухня, немецкая литература, традиции Германии";
export default function CulturePage() {
  // Категории культуры
  const cultureCategories = [
    {
      id: "food",
      title: "Кулинария",
      subtitle: "Больше чем сосиски",
      description:
        "Откройте для себя богатство немецкой кухни через аутентичные рецепты. Изучайте кулинарную лексику, названия ингредиентов и традиции застолья Германии, Австрии и Швейцарии.",
      icon: <Utensils className="h-8 w-8" />,
      gradient: "from-orange-500/20 to-red-500/20 dark:from-purple-500/20 dark:to-pink-500/20",
      iconColor: "text-orange-400 dark:text-pink-400",
      href: "/culture/food",
      stats: "100+ рецептов",
      features: [
        "Пошаговые рецепты",
        "Кулинарный словарь",
        "Региональные блюда",
        "Видео готовки",
      ],
      preview: "Готовим Sauerbraten и изучаем глаголы готовки",
    },
    {
      id: "holidays",
      title: "Праздники и традиции",
      subtitle: "Круглый год веселье",
      description:
        "Погрузитесь в красочный мир немецких праздников и традиций. От величественного Октоберфеста до уютных Рождественских ярмарок — изучайте язык через живые культурные события и обычаи.",
      icon: <Calendar className="h-8 w-8" />,
      gradient: "from-pink-500/20 to-rose-500/20",
      iconColor: "text-pink-400",
      href: "/culture/holidays",
      stats: "25+ праздников",
      features: [
        "История праздников",
        "Традиционная лексика",
        "Культурные особенности",
        "Интерактивный календарь",
      ],
      preview: "Изучаем Weihnachtsmarkt и рождественскую лексику",
    },
    {
      id: "literature",
      title: "Литература и философия",
      subtitle: "Страна мыслителей",
      description:
        "Встречайтесь с величайшими умами немецкоязычного мира в адаптированных текстах. От Гёте и Шиллера до Кафки и современных авторов — с подробными комментариями и языковой поддержкой.",
      icon: <BookOpen className="h-8 w-8" />,
      gradient: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-400",
      href: "/culture/literature",
      stats: "200+ текстов",
      features: [
        "Адаптированные тексты",
        "Литературный анализ",
        "Исторический контекст",
        "Словарь эпохи",
      ],
      preview: 'Читаем отрывок из "Фауста" с современными пояснениями',
    },
  ];
  // Культурные факты
  const culturalFacts = [
    {
      id: "cultural-fact-speakers",
      icon: <Library className="h-6 w-6" />,
      title: "103 млн",
      subtitle: "носителей немецкого",
      description: "Германия, Австрия, Швейцария и другие",
      color: "text-blue-500",
    },
    {
      id: "cultural-fact-states",
      icon: <Users className="h-6 w-6" />,
      title: "16 земель",
      subtitle: "уникальных культур",
      description: "Каждая с своими традициями и диалектами",
      color: "text-green-500",
    },
    {
      id: "cultural-fact-history",
      icon: <MapPin className="h-6 w-6" />,
      title: "2000+ лет",
      subtitle: "культурной истории",
      description: "От германских племен до современности",
      color: "text-purple-500",
    },
    {
      id: "cultural-fact-unesco",
      icon: <Sparkles className="h-6 w-6" />,
      title: "51 объект",
      subtitle: "культурного наследия",
      description: "Включены в список ЮНЕСКО",
      color: "text-yellow-500",
    },
  ];
  // Культурные регионы
  const culturalRegions = [
    {
      id: "region-bavaria",
      name: "Бавария",
      description: "Пивные фестивали, альпийские пейзажи и уникальный диалект",
      icon: <Beer className="h-6 w-6" />,
      color: "bg-blue-500/20",
    },
    {
      id: "region-berlin",
      name: "Берлин",
      description: "Современное искусство, история и мультикультурализм",
      icon: <Building className="h-6 w-6" />,
      color: "bg-red-500/20",
    },
    {
      id: "region-rheinland",
      name: "Рейнская область",
      description: "Виноделие, карнавалы и средневековые замки",
      icon: <Castle className="h-6 w-6" />,
      color: "bg-green-500/20",
    },
    {
      id: "region-schwarzwald",
      name: "Шварцвальд",
      description: "Сказочные леса, часы с кукушкой и торты",
      icon: <TreePine className="h-6 w-6" />,
      color: "bg-emerald-500/20",
    },
  ];
  // Знаменитые немцы
  const famousGermans = [
    {
      id: "famous-goethe",
      name: "Иоганн Вольфганг фон Гёте",
      achievement: "Величайший немецкий писатель и мыслитель",
      field: "Литература",
      icon: <PenTool className="h-5 w-5" />,
    },
    {
      id: "famous-einstein",
      name: "Альберт Эйнштейн",
      achievement: "Физик-теоретик, создатель теории относительности",
      field: "Наука",
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      id: "famous-beethoven",
      name: "Людвиг ван Бетховен",
      achievement: "Композитор, ключевая фигура западной классической музыки",
      field: "Музыка",
      icon: <Music className="h-5 w-5" />,
    },
    {
      id: "famous-dietrich",
      name: "Марлен Дитрих",
      achievement: "Актриса и певица, икона кино XX века",
      field: "Искусство",
      icon: <Film className="h-5 w-5" />,
    },
  ];
  // Интересные аспекты культуры
  const culturalHighlights = [
    {
      id: "highlight-education",
      title: "Дуальная система образования",
      description:
        "Уникальная система профессиональной подготовки, сочетающая теорию и практику",
      icon: <GraduationCap className="h-6 w-6" />,
      color: "bg-blue-500/10",
    },
    {
      id: "highlight-bauhaus",
      title: "Баухаус",
      description:
        "Влиятельное художественное движение, изменившее современный дизайн и архитектуру",
      icon: <Palette className="h-6 w-6" />,
      color: "bg-red-500/10",
    },
    {
      id: "highlight-coffee",
      title: "Кафекультур",
      description:
        "Особая культура кофеен, важная часть социальной жизни немцев",
      icon: <Coffee className="h-6 w-6" />,
      color: "bg-yellow-500/10",
    },
    {
      id: "highlight-idealism",
      title: "Немецкий идеализм",
      description:
        "Философская традиция, повлиявшая на мировую мысль (Кант, Гегель, Фихте)",
      icon: <Landmark className="h-6 w-6" />,
      color: "bg-green-500/10",
    },
  ];
  return (
    <>
      {/* SEO метаданные */}
      <Head>
        <title>{SEO_TITLE}</title>
        <meta name="description" content={SEO_DESCRIPTION} />
        <meta name="keywords" content={SEO_KEYWORDS} />
        <meta property="og:title" content={SEO_TITLE} />
        <meta property="og:description" content={SEO_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SEO_TITLE} />
        <meta name="twitter:description" content={SEO_DESCRIPTION} />
      </Head>
      <div className="min-h-screen">
        <Header />
        <main className="pt-16">
          {/* Героическая секция - удаляем декоративные элементы */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="glass-nav inline-flex items-center mb-8"
                >
                  <MapPin className="h-4 w-4 mr-2 text-german-red dark:text-dark-theme-pink" />
                  <span className="gradient-text font-medium">
                    Kulturelle Reise
                  </span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-5xl md:text-6xl font-black gradient-text mb-6"
                >
                  Немецкая культура
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
                >
                  Изучайте немецкий язык через погружение в богатую культуру
                  немецкоязычных стран. От кулинарных традиций и литературы до
                  праздников и обычаев — откройте для себя душу немецкого
                  народа.
                </motion.p>
                {/* Культурные факты */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
                  {culturalFacts.map((fact, index) => (
                    <motion.div
                      key={fact.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="glass-card text-center group cursor-pointer"
                    >
                      <div className="flex items-center justify-center mb-3">
                        <div className="glass p-3 rounded-full bg-gradient-to-br from-german-red/10 to-german-gold/10 dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20">
                          <div
                            className={`${fact.color} dark:text-dark-theme-pink`}
                          >
                            {fact.icon}
                          </div>
                        </div>
                      </div>
                      <div className="text-2xl font-black gradient-text mb-1 group-hover:scale-110 transition-transform">
                        {fact.title}
                      </div>
                      <div className="text-sm font-semibold text-foreground mb-2">
                        {fact.subtitle}
                      </div>
                      <div className="text-xs text-muted-foreground leading-tight">
                        {fact.description}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          {/* Введение в немецкую культуру */}
          <section className="py-16 bg-gradient-to-r from-german-red/5 to-german-gold/5 dark:from-dark-theme-purple/10 dark:to-dark-theme-pink/10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-8 text-center">
                  Многогранная немецкая культура
                </h2>
                <div className="glass-card bg-white/5 p-8 mb-8">
                  <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                    Немецкая культура — это не просто сухие факты и даты, а
                    живое наследие, формировавшееся на протяжении веков. Она
                    отражает дух немецкого народа: точность и основательность,
                    стремление к порядку и одновременно творческую глубину.
                  </p>
                  <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                    От величественных соборов Кёльна до современных галерей
                    Берлина, от философских трудов Канта до технологических
                    инноваций сегодняшнего дня — немецкий культурный ландшафт
                    богат и разнообразен.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Изучая культуру, вы не просто запоминаете слова и
                    грамматику, а погружаетесь в контекст языка, понимаете образ
                    мышления его носителей и открываете новые грани для общения
                    и понимания.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card bg-white/5 p-6 border border-white/10">
                    <Globe className="h-8 w-8 text-blue-400 mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Культурное влияние
                    </h3>
                    <p className="text-muted-foreground">
                      Немецкая культура оказала огромное влияние на мировую
                      цивилизацию — от классической музыки и философии до науки
                      и технологий. Знакомство с ней открывает двери к пониманию
                      европейской истории и искусства.
                    </p>
                  </div>
                  <div className="glass-card bg-white/5 p-6 border border-white/10">
                    <GraduationCap className="h-8 w-8 text-green-400 mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Язык через культуру
                    </h3>
                    <p className="text-muted-foreground">
                      Изучение языка через культурный контекст помогает лучше
                      запоминать слова и выражения, понимать идиомы и культурные
                      отсылки, делая ваш немецкий более естественным и живым.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Культурные регионы */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black gradient-text mb-4">
                  Культурные регионы Германии
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Германия — это мозаика уникальных регионов, каждый со своими
                  традициями, диалектами и культурными особенностями
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
                {culturalRegions.map((region, index) => (
                  <motion.div
                    key={region.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="glass-card p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div
                      className={`rounded-full w-12 h-12 ${region.color} flex items-center justify-center mb-4`}
                    >
                      {region.icon}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {region.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {region.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          {/* Знаменитые немцы */}
          <section className="py-16 bg-gradient-to-r from-german-gold/5 to-german-red/5 dark:from-dark-theme-pink/10 dark:to-dark-theme-purple/10">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black gradient-text mb-4">
                  Выдающиеся личности
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Немецкоязычные страны подарили миру множество гениев,
                  изменивших ход истории и культуры
                </p>
              </div>
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {famousGermans.map((person, index) => (
                    <div
                      key={person.id}
                      className="glass-card p-6 border border-white/10"
                    >
                      <div className="flex items-start">
                        <div className="glass p-3 rounded-full bg-gradient-to-br from-german-red/10 to-german-gold/10 mr-4">
                          {person.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground mb-1">
                            {person.name}
                          </h3>
                          <div className="glass-nav inline-block text-xs mb-2 px-2 py-1">
                            {person.field}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {person.achievement}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          {/* Интересные аспекты */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black gradient-text mb-4">
                  Уникальные аспекты немецкой культуры
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Познакомьтесь с необычными культурными феноменами,
                  сформировавшими немецкую идентичность
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
                {culturalHighlights.map((highlight, index) => (
                  <div key={highlight.id} className="glass-card p-6">
                    <div
                      className={`rounded-full w-12 h-12 ${highlight.color} flex items-center justify-center mb-4`}
                    >
                      {highlight.icon}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {highlight.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {highlight.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* Категории культуры - улучшаем карточки для лучшей читаемости */}
          <section className="py-16 bg-gradient-to-br from-german-red/5 to-german-gold/5 dark:from-dark-theme-purple/10 dark:to-dark-theme-pink/10">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black gradient-text mb-4">
                  Изучайте культуру интерактивно
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Каждый раздел содержит реальный контент с уроками, словарями и
                  интерактивными элементами. Погружайтесь в немецкий язык через
                  аутентичные культурные материалы.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {cultureCategories.map((category, index) => (
                  <Link key={category.id} href={category.href}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="relative h-full overflow-hidden rounded-xl hover:shadow-xl transition-all duration-500"
                    >
                      {/* Фоновый градиент */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-30 dark:opacity-70`}
                      />
                      {/* Содержимое карточки */}
                      <div className="relative z-10 p-6 h-full flex flex-col">
                        {/* Верхняя часть */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="p-4 rounded-2xl shadow-inner group-hover:scale-110 transition-transform bg-white/20 dark:bg-white/10 backdrop-blur-sm">
                              <div className={category.iconColor}>
                                {category.icon}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-800 dark:text-white drop-shadow-sm">
                                {category.title}
                              </h3>
                              <p className="text-sm font-semibold text-gray-700 dark:text-white/80">
                                {category.subtitle}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-white/20 dark:bg-white/20 text-gray-800 dark:text-white backdrop-blur-sm text-xs font-bold border-none">
                            {category.stats}
                          </Badge>
                        </div>
                        {/* Описание */}
                        <div className="bg-white/40 dark:bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
                          <p className="text-gray-700 dark:text-white/90 leading-relaxed text-sm">
                            {category.description}
                          </p>
                        </div>
                        {/* Превью */}
                        <div className="bg-white/30 dark:bg-black/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-gray-200/50 dark:border-white/10">
                          <div className="flex items-center mb-2">
                            <PlayCircle className="h-4 w-4 text-gray-600 dark:text-white/70 mr-2" />
                            <span className="text-sm font-medium text-gray-800 dark:text-white">
                              Превью урока:
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-white/70 italic">
                            "{category.preview}"
                          </p>
                        </div>
                        {/* Особенности */}
                        <div className="mb-6 mt-auto">
                          <div className="flex flex-wrap gap-2">
                            {category.features.map((feature, featureIndex) => (
                              <div
                                key={`${category.id}-feature-${featureIndex}`}
                                className="bg-white/40 dark:bg-white/20 backdrop-blur-sm text-gray-700 dark:text-white px-3 py-1 rounded-full text-xs"
                              >
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Действие */}
                        <div className="flex items-center justify-between mt-auto">
                          <Button
                            variant="outline"
                            className="bg-white/40 hover:bg-white/60 dark:bg-white/20 dark:hover:bg-white/30 text-gray-800 dark:text-white border-gray-300/50 dark:border-white/30 backdrop-blur-sm transition-all"
                          >
                            Исследовать
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                          <div className="text-xs text-gray-700 dark:text-white/70 backdrop-blur-sm bg-white/30 dark:bg-black/10 px-2 py-1 rounded-full">
                            Бесплатно
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
          {/* Цитата */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto glass-card bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 border border-white/10">
                <div className="text-center">
                  <Sparkles className="h-8 w-8 text-yellow-400 mb-6 mx-auto" />
                  <p className="text-2xl md:text-3xl italic text-foreground mb-6 leading-relaxed">
                    "Wer fremde Sprachen nicht kennt, weiß nichts von seiner
                    eigenen."
                  </p>
                  <p className="text-xl text-muted-foreground mb-8">
                    "Кто не знает иностранных языков, тот ничего не знает о
                    своём собственном."
                  </p>
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-1 bg-gradient-to-r from-german-red to-german-gold dark:from-dark-theme-purple dark:to-dark-theme-pink rounded-full" />
                    <p className="mx-4 text-lg font-medium gradient-text">
                      Иоганн Вольфганг фон Гёте
                    </p>
                    <div className="w-12 h-1 bg-gradient-to-r from-german-gold to-german-red dark:from-dark-theme-pink dark:to-dark-theme-purple rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* CTA секция */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="glass-card max-w-4xl mx-auto text-center bg-white/5 dark:bg-white/5 border border-white/20 dark:border-white/20">
                <div className="flex items-center justify-center mb-6">
                  <MapPin className="h-8 w-8 text-german-red dark:text-dark-theme-pink mr-3" />
                  <Sparkles className="h-6 w-6 text-german-gold animate-pulse" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                  Начните культурное путешествие
                </h3>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  Погрузитесь в немецкую культуру и изучайте язык естественным
                  путем через аутентичный контент и реальные культурные
                  материалы.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/culture/food">
                    <Button variant="german" size="lg" className="group">
                      <Utensils className="h-5 w-5 mr-2" />
                      Начать с кулинарии
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/lessons">
                    <Button
                      variant="outline"
                      size="lg"
                      className="glass glass-hover border-border"
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      Обычные уроки
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
// Компонент иконки пива (добавлен, так как его нет в списке импортированных иконок)
function Beer({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17 11h1a3 3 0 0 1 0 6h-1" />
      <path d="M9 12v6" />
      <path d="M13 12v6" />
      <path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z" />
      <path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
    </svg>
  );
}
// Компонент иконки музыки (добавлен, так как его нет в списке импортированных иконок)
function Music({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}
