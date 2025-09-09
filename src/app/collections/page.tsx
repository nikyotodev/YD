"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CollectionCard } from "@/components/CollectionCard";
import { CreateCollectionModal } from "@/components/CreateCollectionModal";
import { Card } from "@/components/ui/card";
import { collectionsManager } from "@/lib/collections-storage";
import { firebaseCollectionsManager } from "@/lib/firebase-collections";
import type { Collection } from "@/types/collections";
import {
  PlusIcon,
  BookOpen,
  TrendingUp,
  Target,
  User,
  LogIn,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import { AuthModal } from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userStats, setUserStats] = useState(collectionsManager.getUserStats());
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, syncUserCollections } = useUser();
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Если пользователь авторизован, синхронизируем коллекции
      if (isAuthenticated) {
        await syncUserCollections();
      }
      loadCollections();
      setIsLoading(false);
    };
    loadData();
  }, [isAuthenticated, syncUserCollections]);
  const loadCollections = () => {
    setCollections(collectionsManager.getCollections());
    setUserStats(collectionsManager.getUserStats());
  };
  const handleCreateCollection = async (
    name: string,
    description: string,
    emoji: string,
    color: string,
  ) => {
    // Если пользователь не авторизован, предлагаем авторизоваться
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    const collection = collectionsManager.createCollection(
      name,
      description,
      emoji,
      color,
    );
    // Если пользователь авторизован, сохраняем коллекцию в Firestore
    if (isAuthenticated) {
      await firebaseCollectionsManager.saveCollectionToFirestore(collection);
    }
    loadCollections();
    setShowCreateModal(false);
  };
  const handleDeleteCollection = async (id: string) => {
    if (
      confirm(
        "Вы уверены, что хотите удалить эту коллекцию? Все слова в ней будут потеряны.",
      )
    ) {
      // Локальное удаление коллекции
      collectionsManager.deleteCollection(id);
      // Если пользователь авторизован, удаляем коллекцию из Firestore
      if (isAuthenticated) {
        await firebaseCollectionsManager.deleteCollection(id);
      }
      loadCollections();
    }
  };
  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };
  const handleCreateButtonClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowCreateModal(true);
    }
  };
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
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="glass-nav inline-flex items-center mb-8 animate-shimmer">
              <BookOpen className="h-4 w-4 mr-2 text-german-red dark:text-dark-theme-pink" />
              <span className="gradient-text font-medium">
                Personal Collection Manager
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 gradient-text">
              Мои коллекции слов
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Создавайте коллекции, добавляйте слова из словаря и отслеживайте
              свой прогресс изучения немецкого языка
            </p>
            {!isAuthenticated && (
              <div className="mt-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 max-w-xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <User className="h-5 w-5 text-german-red dark:text-red-400" />
                  <h3 className="text-german-dark-red dark:text-red-300 font-medium">
                    Требуется авторизация
                  </h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-red-200 mb-4">
                  Для создания коллекций и сохранения слов необходимо войти в
                  аккаунт или зарегистрироваться
                </p>
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-german-red hover:bg-german-dark-red text-white dark:bg-violet-500 dark:hover:bg-violet-600"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Войти в аккаунт
                </Button>
              </div>
            )}
          </div>
          <div className="mb-12">
            {/* Статистика */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <Card className="glass-card bg-gradient-to-br from-white/5 to-white/10 border-2 border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-german-red/20 to-german-gold/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-german-red dark:text-dark-theme-pink" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {userStats.totalCollections}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Коллекций
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="glass-card bg-gradient-to-br from-white/5 to-white/10 border-2 border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-german-gold/20 to-german-red/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-german-gold dark:text-dark-theme-pink" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {userStats.totalWordsLearned}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Слов освоено
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="glass-card bg-gradient-to-br from-white/5 to-white/10 border-2 border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-german-red/20 to-german-gold/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-german-red dark:text-dark-theme-pink" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {userStats.currentStreak}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Дней подряд
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
          {/* Кнопка создания коллекции */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <button
              onClick={handleCreateButtonClick}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-german-red to-german-gold hover:from-german-red/90 hover:to-german-gold/90 dark:from-dark-theme-purple dark:to-dark-theme-pink text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:scale-105"
            >
              <PlusIcon className="w-5 h-5" />
              Создать коллекцию
            </button>
          </motion.div>
          {/* Список коллекций */}
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin w-12 h-12 border-4 border-t-german-red border-r-transparent border-b-german-gold border-l-transparent rounded-full" />
              </div>
            ) : collections.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-16"
              >
                <Card className="glass-card text-center bg-gradient-to-br from-white/5 to-white/10">
                  <div className="p-8">
                    <div className="glass p-6 rounded-full w-fit mx-auto mb-6 bg-gradient-to-br from-german-red/10 to-german-gold/10 dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20">
                      <BookOpen className="h-12 w-12 text-german-red dark:text-dark-theme-pink" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 gradient-text">
                      У вас пока нет коллекций
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed max-w-md mx-auto">
                      {isAuthenticated
                        ? "Создайте свою первую коллекцию слов, чтобы начать изучение немецкого языка"
                        : "Войдите в аккаунт, чтобы создавать коллекции и сохранять слова для изучения немецкого языка"}
                    </p>
                    <button
                      onClick={
                        isAuthenticated
                          ? () => setShowCreateModal(true)
                          : () => setShowAuthModal(true)
                      }
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-german-red to-german-gold hover:from-german-red/90 hover:to-german-gold/90 dark:from-dark-theme-purple dark:to-dark-theme-pink text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
                    >
                      {isAuthenticated ? (
                        <>
                          <PlusIcon className="w-4 h-4" />
                          Создать первую коллекцию
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4" />
                          Войти в аккаунт
                        </>
                      )}
                    </button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {collections.map((collection, index) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    onDelete={handleDeleteCollection}
                    index={index}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
      {/* Модальное окно создания коллекции */}
      <CreateCollectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCollection}
      />
      {/* Модальное окно авторизации */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthModalClose}
        initialTab="login"
      />
    </div>
  );
}
