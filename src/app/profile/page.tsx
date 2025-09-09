"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { UserProgressWidget } from "@/components/UserProgressWidget";
import { collectionsManager } from "@/lib/collections-storage";
import { useUser, useAuth } from "@/contexts/UserContext";
import type { Collection, UserStats } from "@/types/collections";
import {
  User,
  BookOpen,
  TrendingUp,
  Target,
  Calendar,
  Award,
  Clock,
  Download,
  Upload,
  Settings,
  BarChart3,
  Flame,
  Brain,
  LogIn,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
export default function ProfilePage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [userStats, setUserStats] = useState<UserStats>();
  const { user, isAuthenticated, isLoading } = useUser();
  useEffect(() => {
    setCollections(collectionsManager.getCollections());
    setUserStats(collectionsManager.getUserStats());
  }, []);
  const handleExportData = () => {
    const data = collectionsManager.exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `talkify-collections-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result as string;
            const success = collectionsManager.importData(data);
            if (success) {
              alert("Данные успешно импортированы!");
              setCollections(collectionsManager.getCollections());
              setUserStats(collectionsManager.getUserStats());
            } else {
              alert("Ошибка при импорте данных");
            }
          } catch (error) {
            alert("Неверный формат файла");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };
  const totalWordsInCollections = collections.reduce(
    (sum, collection) => sum + collection.wordsCount,
    0,
  );
  // Показываем экран загрузки
  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 relative overflow-hidden">
        <Header />
        <main className="relative container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-german-red border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  // Показываем экран для неавторизованных пользователей
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen pt-16 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-german-red/10 to-german-gold/10 rounded-full blur-3xl animate-float dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20" />
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-german-gold/10 to-german-red/10 rounded-full blur-3xl animate-float animation-delay-2000 dark:from-dark-theme-pink/20 dark:to-dark-theme-purple/20" />
        </div>
        <Header />
        <main className="relative container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-german-red/20 to-german-gold/20 dark:from-dark-theme-purple/30 dark:to-dark-theme-pink/30 mx-auto mb-6 flex items-center justify-center">
              <LogIn className="w-12 h-12 text-german-red dark:text-dark-theme-pink" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-4 gradient-text">
              Войдите в аккаунт
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Создайте аккаунт или войдите, чтобы отслеживать свой прогресс,
              ставить цели и получать достижения в изучении немецкого языка.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen pt-16 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-german-red/10 to-german-gold/10 rounded-full blur-3xl animate-float dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-german-gold/10 to-german-red/10 rounded-full blur-3xl animate-float animation-delay-2000 dark:from-dark-theme-pink/20 dark:to-dark-theme-purple/20" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-german-red/5 to-german-gold/5 rounded-full blur-3xl animate-glow dark:from-dark-theme-purple/10 dark:to-dark-theme-pink/10" />
      </div>
      <Header />
      <main className="relative container mx-auto px-4 py-8 space-y-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="glass-nav inline-flex items-center mb-8 animate-shimmer">
              <User className="h-4 w-4 mr-2 text-german-red dark:text-dark-theme-pink" />
              <span className="gradient-text font-medium">
                Personal Learning Dashboard
              </span>
            </div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-german-red to-german-gold dark:from-dark-theme-purple dark:to-dark-theme-pink mx-auto mb-4 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 gradient-text">
              Мой профиль
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Отслеживайте свой прогресс в изучении немецкого языка
            </p>
          </div>
          {/* User Progress Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <UserProgressWidget />
          </motion.div>
          {/* Основная статистика */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            <Card className="glass-card bg-gradient-to-br from-white/5 to-white/10 border-2 border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-german-red/20 to-german-gold/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-german-red dark:text-dark-theme-pink" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {user?.gamification?.totalCollections || collections.length}
                  </div>
                  <div className="text-muted-foreground text-sm">Коллекций</div>
                </div>
              </div>
            </Card>
            <Card className="glass-card bg-gradient-to-br from-white/5 to-white/10 border-2 border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-german-gold/20 to-german-red/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-german-gold dark:text-dark-theme-pink" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {totalWordsInCollections}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Слов в коллекциях
                  </div>
                </div>
              </div>
            </Card>
            <Card className="glass-card bg-gradient-to-br from-white/5 to-white/10 border-2 border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-german-red/20 to-german-gold/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-german-red dark:text-dark-theme-pink" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {user?.gamification?.totalWordsLearned || 0}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Слов освоено
                  </div>
                </div>
              </div>
            </Card>
            <Card className="glass-card bg-gradient-to-br from-white/5 to-white/10 border-2 border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-german-gold/20 to-german-red/20 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-german-gold dark:text-dark-theme-pink" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {user?.gamification?.streak?.current || 0}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Дней подряд
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          {/* Секции */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Коллекции */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card bg-gradient-to-br from-white/5 to-white/10 border-2 border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Мои коллекции
                  </h2>
                  <Link
                    href="/collections"
                    className="text-german-red dark:text-dark-theme-pink hover:text-german-dark-red dark:hover:text-dark-theme-purple text-sm font-medium transition-colors"
                  >
                    Все коллекции →
                  </Link>
                </div>
                {collections.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">
                      У вас пока нет коллекций
                    </p>
                    <Link
                      href="/collections"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-german-red/20 to-german-gold/20 hover:from-german-red/30 hover:to-german-gold/30 dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20 text-german-red dark:text-dark-theme-pink rounded-lg text-sm transition-colors"
                    >
                      Создать первую коллекцию
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {collections.slice(0, 3).map((collection) => (
                      <Link
                        key={collection.id}
                        href={`/collections/${collection.id}`}
                        className="flex items-center gap-3 p-3 glass hover:bg-white/[0.05] rounded-lg transition-colors border border-white/10"
                      >
                        <div className="text-2xl">
                          {collection.emoji || "📚"}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            {collection.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {collection.wordsCount} слов •{" "}
                            {collection.progress.percentage}% освоено
                          </div>
                        </div>
                        <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-german-red to-german-gold dark:from-dark-theme-purple dark:to-dark-theme-pink rounded-full transition-all duration-500"
                            style={{
                              width: `${collection.progress.percentage}%`,
                            }}
                          />
                        </div>
                      </Link>
                    ))}
                    {collections.length > 3 && (
                      <div className="text-center pt-2">
                        <Link
                          href="/collections"
                          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                        >
                          и ещё {collections.length - 3} коллекций...
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>
            {/* Настройки и действия */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-card bg-gradient-to-br from-white/5 to-white/10 border-2 border-white/20">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-6">
                  <Settings className="w-5 h-5" />
                  Управление данными
                </h2>
                <div className="space-y-4">
                  <button
                    onClick={handleExportData}
                    className="w-full flex items-center gap-3 p-4 glass hover:bg-white/[0.05] rounded-lg transition-colors border border-white/10"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-german-gold/20 to-german-red/20 flex items-center justify-center">
                      <Download className="w-5 h-5 text-german-gold dark:text-dark-theme-pink" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-foreground">
                        Экспорт данных
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Сохранить все коллекции в файл
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={handleImportData}
                    className="w-full flex items-center gap-3 p-4 glass hover:bg-white/[0.05] rounded-lg transition-colors border border-white/10"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-german-red/20 to-german-gold/20 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-german-red dark:text-dark-theme-pink" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-foreground">
                        Импорт данных
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Восстановить коллекции из файла
                      </div>
                    </div>
                  </button>
                </div>
                {/* Цели */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2 mb-4">
                    <Target className="w-4 h-4" />
                    Цели обучения
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 glass rounded-lg">
                      <span className="text-muted-foreground text-sm">
                        Ежедневная цель
                      </span>
                      <span className="text-foreground font-medium">
                        {user?.goals?.daily?.targetWords || 10} слов
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 glass rounded-lg">
                      <span className="text-muted-foreground text-sm">
                        Недельная цель
                      </span>
                      <span className="text-foreground font-medium">
                        {user?.goals?.weekly?.targetWords || 50} слов
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
