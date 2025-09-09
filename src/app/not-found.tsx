"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Home,
  Search,
  BookOpen,
  Brain,
  ArrowLeft,
  MapIcon,
  Compass,
  Star,
  Coffee
} from 'lucide-react';
interface Suggestion {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  popular?: boolean;
}
const suggestions: Suggestion[] = [
  {
    title: 'Главная страница',
    description: 'Вернуться на главную и начать изучение',
    href: '/',
    icon: Home,
    popular: true,
  },
  {
    title: 'Словарь',
    description: 'Найти переводы и значения слов',
    href: '/dictionary',
    icon: BookOpen,
  },
  {
    title: 'Уроки и экзамены',
    description: 'Goethe A1-C1 и другие материалы',
    href: '/lessons',
    icon: Brain,
    popular: true,
  },
  {
    title: 'Культура Германии',
    description: 'Праздники, традиции и литература',
    href: '/culture',
    icon: Coffee,
  },
  {
    title: 'ИИ-сценарии',
    description: 'Персональные диалоги с ИИ',
    href: '/lessons/ai-scenarios',
    icon: Star,
  },
  {
    title: 'Мои коллекции',
    description: 'Сохраненные слова и прогресс',
    href: '/collections',
    icon: MapIcon,
  },
];
const germanPhrases = [
  { german: 'Wo bin ich?', russian: 'Где я?' },
  { german: 'Ich habe mich verirrt', russian: 'Я заблудился' },
  { german: 'Können Sie mir helfen?', russian: 'Можете мне помочь?' },
  { german: 'Wo ist der Ausgang?', russian: 'Где выход?' },
  { german: 'Ich suche etwas', russian: 'Я что-то ищу' },
];
export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % germanPhrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/dictionary?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };
  const filteredSuggestions = suggestions.filter(
    suggestion =>
      suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suggestion.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Фоновые элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-200/20 dark:bg-yellow-400/10 rounded-full blur-xl" />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-red-200/20 dark:bg-red-400/10 rounded-full blur-xl" />
        <div className="absolute bottom-1/4 left-1/2 w-40 h-40 bg-blue-200/20 dark:bg-blue-400/10 rounded-full blur-xl" />
      </div>
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* 404 заголовок */}
          <div className="mb-8">
            <motion.h1
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-german-red via-german-yellow to-german-black dark:from-red-400 dark:via-yellow-400 dark:to-gray-300 mb-4"
            >
              404
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative h-16 mb-6"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhrase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <p className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    {germanPhrases[currentPhrase].german}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {germanPhrases[currentPhrase].russian}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Страница, которую вы ищете, не найдена. Но не волнуйтесь — мы поможем вам найти то, что нужно!
            </motion.p>
          </div>
          {/* Поиск */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-12"
          >
            <Card className="glass-card max-w-md mx-auto">
              <CardContent className="p-4">
                <form onSubmit={handleSearch} className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Поиск по словарю..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button type="submit" size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
          {/* Быстрые действия */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <Link href="/">
              <Button size="lg" className="group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Вернуться назад
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline">
                <Home className="w-4 h-4 mr-2" />
                На главную
              </Button>
            </Link>
          </motion.div>
          {/* Предложения */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center justify-center">
              <Compass className="w-6 h-6 mr-2" />
              Возможно, вас заинтересует
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(searchQuery ? filteredSuggestions : suggestions).map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <motion.div
                    key={suggestion.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                  >
                    <Link href={suggestion.href}>
                      <Card className="glass-card hover:glass-card-hover transition-all duration-300 group cursor-pointer h-full relative overflow-hidden">
                        {suggestion.popular && (
                          <div className="absolute top-2 right-2">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Популярно
                            </div>
                          </div>
                        )}
                        <CardHeader className="pb-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {suggestion.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground">
                            {suggestion.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            {searchQuery && filteredSuggestions.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <p className="text-muted-foreground">
                  По запросу "{searchQuery}" ничего не найдено
                </p>
              </motion.div>
            )}
          </motion.div>
          {/* Дополнительная информация */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-16 text-center"
          >
            <Card className="glass-card max-w-lg mx-auto">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Нужна помощь?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Если вы не можете найти то, что ищете, свяжитесь с нами
                </p>
                <Link href="mailto:support@yourdeutsch.com">
                  <Button variant="outline" size="sm">
                    Написать в поддержку
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
