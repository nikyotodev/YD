"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import DictionarySearch from "@/components/DictionarySearch";
import DictionaryResults from "@/components/DictionaryResults";
import {
  BookOpen,
  Users,
  TrendingUp,
  Clock,
  Settings,
  Zap,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/UserContext";
import { useAuthModal } from "@/contexts/AuthModalContext";
import type { ProcessedDictionaryResult } from "@/types/dictionary";
import { germanNounsCSV } from "@/lib/german-nouns-csv-service";
import { DictionaryStructuredData } from '@/components/DictionaryStructuredData';

export default function DictionaryPageClient() {
  const [searchResults, setSearchResults] =
    useState<ProcessedDictionaryResult | null>(null);
  const [searchCount, setSearchCount] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { user, isAuthenticated } = useUser();
  const { openModal } = useAuthModal();

  // Загрузка CSV базы данных артиклей при инициализации
  useEffect(() => {
    const initializeCSVDatabase = async () => {
      const stats = germanNounsCSV.getStats();
      if (stats.totalWords === 0 && !stats.isLoading) {
        try {
          await germanNounsCSV.loadCSVData();
        } catch (error) {
          // Игнорируем ошибки загрузки, работаем без CSV
        }
      }
    };
    initializeCSVDatabase();
  }, []);

  // Загрузка статистики пользователя при входе
  useEffect(() => {
    if (isAuthenticated && user) {
      // Здесь можно загрузить персональную статистику
      const savedSearches = localStorage.getItem(
        `dictionary_searches_${user.uid}`,
      );
      if (savedSearches) {
        try {
          const searches = JSON.parse(savedSearches);
          setRecentSearches(searches.slice(0, 5));
        } catch (error) {
          // Игнорируем ошибки парсинга
        }
      }
    }
  }, [isAuthenticated, user]);

  // Обработка новых результатов поиска
  const handleResultsChange = (results: ProcessedDictionaryResult | null) => {
    setSearchResults(results);
    if (results?.hasResults) {
      setSearchCount((prev) => prev + 1);
      // Сохраняем последние поиски
      const newSearch = results.word;
      setRecentSearches((prev) => {
        const updated = [
          newSearch,
          ...prev.filter((s) => s !== newSearch),
        ].slice(0, 5);
        // Сохраняем в localStorage для авторизованных пользователей
        if (isAuthenticated && user) {
          localStorage.setItem(
            `dictionary_searches_${user.uid}`,
            JSON.stringify(updated),
          );
        }
        return updated;
      });
    }
  };

  // Функция для открытия профиля пользователя
  const handleOpenProfile = () => {
    if (isAuthenticated) {
      window.location.href = "/profile";
    } else {
      openModal();
    }
  };

  // Функция для открытия коллекций
  const handleOpenCollections = () => {
    if (isAuthenticated) {
      window.location.href = "/collections";
    } else {
      openModal();
    }
  };

  return (
    <>
      <DictionaryStructuredData />
      <div className="min-h-screen">
        <Header />
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-16">
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-german-red/10 to-german-gold/10 rounded-full blur-3xl animate-float dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20" />
            <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-gradient-to-br from-german-gold/10 to-german-red/10 rounded-full blur-3xl animate-float animation-delay-2000 dark:from-dark-theme-pink/20 dark:to-dark-theme-purple/20" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-german-red/5 to-german-gold/5 rounded-full blur-3xl animate-pulse dark:from-dark-theme-purple/10 dark:to-dark-theme-pink/10" />
          </div>
          <div className="relative glass min-h-screen">
            <div className="container mx-auto px-4 py-16">
              <div className="max-w-6xl mx-auto space-y-12">
                {/* Hero Title с персонализацией */}
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center space-x-3 glass px-6 py-3 rounded-full border border-white/20">
                    <BookOpen className="h-5 w-5 text-german-red dark:text-dark-theme-pink" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {isAuthenticated
                        ? `Добро пожаловать, ${user?.displayName || "пользователь"}!`
                        : "Профессиональный словарь"}
                    </span>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black gradient-text text-center leading-tight">
                    Умный Немецко-русский Словарь
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    Революционный словарь с автоматическим определением языка,
                    переводами от Yandex Dictionary API и полной интеграцией с
                    вашими коллекциями слов
                  </p>
                  {/* Персональная статистика */}
                  {isAuthenticated && (
                    <div className="flex justify-center gap-4 text-sm">
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <TrendingUp className="h-3 w-3" />
                        Поисков: {searchCount}
                      </Badge>
                      {recentSearches.length > 0 && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Clock className="h-3 w-3" />
                          Последний: {recentSearches[0]}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                {/* Быстрые действия для авторизованных пользователей */}
                {isAuthenticated && (
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={handleOpenProfile}
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Мой профиль
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleOpenCollections}
                      className="flex items-center gap-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      Мои коллекции
                    </Button>
                  </div>
                )}
                {/* Search Component */}
                <div className="max-w-4xl mx-auto">
                  <DictionarySearch onResultsChange={handleResultsChange} />
                </div>
                {/* Results */}
                {searchResults && (
                  <div className="max-w-4xl mx-auto">
                    <DictionaryResults results={searchResults} />
                  </div>
                )}
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  <div className="glass glass-hover p-6 rounded-xl border border-white/20 text-center group">
                    <div className="w-16 h-16 mx-auto mb-4 glass rounded-2xl flex items-center justify-center bg-gradient-to-br from-german-red/20 to-german-gold/20 dark:from-dark-theme-purple/30 dark:to-dark-theme-pink/30 group-hover:scale-110 transition-transform">
                      <Zap className="h-8 w-8 text-german-red dark:text-dark-theme-pink" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-3">
                      Автоопределение языка
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Система автоматически определяет язык ввода и предлагает
                      правильное направление перевода
                    </p>
                  </div>
                  <div className="glass glass-hover p-6 rounded-xl border border-white/20 text-center group">
                    <div className="w-16 h-16 mx-auto mb-4 glass rounded-2xl flex items-center justify-center bg-gradient-to-br from-german-red/20 to-german-gold/20 dark:from-dark-theme-purple/30 dark:to-dark-theme-pink/30 group-hover:scale-110 transition-transform">
                      <Target className="h-8 w-8 text-german-red dark:text-dark-theme-pink" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-3">
                      Определение артиклей
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      AI-powered определение der/die/das с детальным объяснением
                      правил и высокой точностью
                    </p>
                  </div>
                  <div className="glass glass-hover p-6 rounded-xl border border-white/20 text-center group">
                    <div className="w-16 h-16 mx-auto mb-4 glass rounded-2xl flex items-center justify-center bg-gradient-to-br from-german-red/20 to-german-gold/20 dark:from-dark-theme-purple/30 dark:to-dark-theme-pink/30 group-hover:scale-110 transition-transform">
                      <Users className="h-8 w-8 text-german-red dark:text-dark-theme-pink" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-3">
                      Умные коллекции
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Сохраняйте слова в персональные коллекции с синхронизацией
                      прогресса и умными рекомендациями
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
