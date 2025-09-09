"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StudyModal } from "@/components/StudyModal";
import { collectionsManager } from "@/lib/collections-storage";
import type {
  Collection,
  WordInCollection,
  WordLevel,
} from "@/types/collections";
import { WORD_LEVEL_COLORS, WORD_LEVEL_NAMES } from "@/types/collections";
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  Trash2,
  RotateCcw,
  Search,
  Filter,
  Edit3,
  Star,
  Clock,
  Brain,
  TrendingUp,
  Target,
  Play,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const collectionId = params.id as string;
  const [collection, setCollection] = useState<Collection | null>(null);
  const [words, setWords] = useState<WordInCollection[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<WordLevel | "all">("all");
  const [sortBy, setSortBy] = useState<"added" | "level" | "alphabetical">(
    "added",
  );
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (collectionId) {
      loadCollection();
    }
  }, [collectionId]);
  const loadCollection = () => {
    const col = collectionsManager.getCollection(collectionId);
    if (!col) {
      router.push("/collections");
      return;
    }
    setCollection(col);
    setWords(collectionsManager.getWordsInCollection(collectionId));
  };
  const handleDeleteWord = (wordId: string) => {
    if (confirm("Удалить это слово из коллекции?")) {
      collectionsManager.removeWordFromCollection(collectionId, wordId);
      loadCollection();
    }
  };
  const handleUpdateWordLevel = (wordId: string, newLevel: WordLevel) => {
    collectionsManager.updateWordLevel(collectionId, wordId, newLevel);
    loadCollection();
  };
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };
  const filteredWords = words
    .filter((word: WordInCollection) => {
      const matchesSearch =
        !searchTerm ||
        word.germanWord.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.translation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = levelFilter === "all" || word.level === levelFilter;
      return matchesSearch && matchesLevel;
    })
    .sort((a: WordInCollection, b: WordInCollection) => {
      switch (sortBy) {
        case "alphabetical":
          return a.germanWord.localeCompare(b.germanWord);
        case "level": {
          const levelOrder: Record<WordLevel, number> = { new: 0, learning: 1, familiar: 2, mastered: 3 };
          return levelOrder[a.level] - levelOrder[b.level];
        }
        default:
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      }
    });
  const startStudySession = () => {
    const wordsToStudy = words.filter((w: WordInCollection) => w.level !== "mastered");
    if (wordsToStudy.length === 0) {
      alert("Все слова в коллекции уже освоены!");
      return;
    }
    setIsStudyMode(true);
  };
  if (!collection) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600 dark:text-white/60">Загрузка коллекции...</div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen pt-16 relative overflow-hidden">
      {/* Фоновые эффекты */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-german-red/10 to-german-gold/10 rounded-full blur-3xl animate-float dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-german-gold/10 to-german-red/10 rounded-full blur-3xl animate-float animation-delay-2000 dark:from-dark-theme-pink/20 dark:to-dark-theme-purple/20" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-german-red/5 to-german-gold/5 rounded-full blur-3xl animate-glow dark:from-dark-theme-purple/10 dark:to-dark-theme-pink/10" />
      </div>
      <Header />
      <main className="relative container mx-auto px-4 py-8 space-y-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Заголовок коллекции */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <Link href="/collections">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад к коллекциям
                </Button>
              </Link>
            </div>
            <div className="glass-card bg-gradient-to-br from-white/80 to-white/60 dark:from-white/5 dark:to-white/10 border-2 border-gray-200/50 dark:border-white/20 rounded-3xl p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="text-6xl">{collection.emoji || "📚"}</div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white/90 mb-2">
                      {collection.name}
                    </h1>
                    {collection.description && (
                      <p className="text-gray-700 dark:text-white/60 text-lg mb-4">
                        {collection.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-white/50">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {collection.wordsCount} слов
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {collection.progress.percentage}% освоено
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Создано{" "}
                        {new Date(collection.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={startStudySession}
                    className="bg-gradient-to-r from-german-red/80 to-german-gold/80 hover:from-german-red hover:to-german-gold border border-german-red/50 text-white font-medium px-6 shadow-lg dark:from-violet-500/20 dark:to-blue-500/20 dark:hover:from-violet-500/30 dark:hover:to-blue-500/30 dark:border-violet-400/30 dark:text-white"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Изучать
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {/* Прогресс бар */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-700 dark:text-white/60">
                    Прогресс изучения
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white/80">
                    {collection.progress.mastered} из{" "}
                    {collection.progress.total} слов
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-german-red to-german-gold dark:from-violet-500 dark:to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${collection.progress.percentage}%` }}
                  />
                </div>
              </div>
              {/* Статистика по уровням */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-100 dark:bg-gray-500/10 border border-gray-200 dark:border-gray-400/20 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-gray-700 dark:text-gray-300">
                    {collection.progress.new}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Новые</div>
                </div>
                <div className="bg-orange-100 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-400/20 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-orange-700 dark:text-orange-300">
                    {collection.progress.learning}
                  </div>
                  <div className="text-xs text-orange-600 dark:text-orange-400">Изучаю</div>
                </div>
                <div className="bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-400/20 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-german-red dark:text-red-300">
                    {collection.progress.familiar}
                  </div>
                  <div className="text-xs text-german-dark-red dark:text-red-400">Знакомо</div>
                </div>
                <div className="bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-400/20 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-german-gold dark:text-amber-300">
                    {collection.progress.mastered}
                  </div>
                  <div className="text-xs text-amber-600 dark:text-amber-400">Освоено</div>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Фильтры и поиск */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card bg-gradient-to-br from-white/80 to-white/60 dark:from-white/5 dark:to-white/10 border-2 border-gray-200/50 dark:border-white/20 rounded-2xl p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Поиск */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-white/40" />
                <Input
                  placeholder="Поиск слов..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 dark:bg-white/5 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/40"
                />
              </div>
              {/* Фильтр по уровню */}
              <select
                value={levelFilter}
                onChange={(e) =>
                  setLevelFilter(e.target.value as WordLevel | "all")
                }
                className="bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 text-gray-900 dark:text-white rounded-lg px-3 py-2"
              >
                <option value="all" className="bg-white dark:bg-gray-800">
                  Все уровни
                </option>
                <option value="new" className="bg-white dark:bg-gray-800">
                  Новые
                </option>
                <option value="learning" className="bg-white dark:bg-gray-800">
                  Изучаю
                </option>
                <option value="familiar" className="bg-white dark:bg-gray-800">
                  Знакомо
                </option>
                <option value="mastered" className="bg-white dark:bg-gray-800">
                  Освоено
                </option>
              </select>
              {/* Сортировка */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 text-gray-900 dark:text-white rounded-lg px-3 py-2"
              >
                <option value="added" className="bg-white dark:bg-gray-800">
                  По дате добавления
                </option>
                <option value="alphabetical" className="bg-white dark:bg-gray-800">
                  По алфавиту
                </option>
                <option value="level" className="bg-white dark:bg-gray-800">
                  По уровню
                </option>
              </select>
              {/* Массовые действия */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 flex-1"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить слова
                </Button>
              </div>
            </div>
          </motion.div>
          {/* Список слов */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {filteredWords.length === 0 ? (
              <div className="text-center py-16">
                <div className="glass-card bg-gradient-to-br from-white/80 to-white/60 dark:from-white/5 dark:to-white/10 border-2 border-gray-200/50 dark:border-white/20 rounded-2xl p-8 max-w-md mx-auto">
                  <BookOpen className="w-16 h-16 text-gray-400 dark:text-white/20 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white/60 mb-2">
                    {searchTerm || levelFilter !== "all"
                      ? "Слова не найдены"
                      : "Коллекция пуста"}
                  </h3>
                  <p className="text-gray-600 dark:text-white/40 mb-4">
                    {searchTerm || levelFilter !== "all"
                      ? "Попробуйте изменить критерии поиска"
                      : "Добавьте слова из словаря в эту коллекцию"}
                  </p>
                  {!searchTerm && levelFilter === "all" && (
                    <Link href="/dictionary">
                      <Button className="bg-german-red hover:bg-german-dark-red text-white shadow-lg dark:bg-violet-500/20 dark:hover:bg-violet-500/30 dark:border-violet-400/30 dark:text-violet-300">
                        Перейти к словарю
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredWords.map((word, index) => (
                    <motion.div
                      key={word.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-card bg-gradient-to-br from-white/90 to-white/70 dark:from-white/5 dark:to-white/10 border-2 border-gray-200/50 dark:border-white/20 rounded-2xl p-6 hover:bg-white dark:hover:bg-white/10 transition-colors group shadow-sm hover:shadow-md"
                    >
                      {/* Заголовок карточки */}
                      <div className="flex items-start justify-between mb-4">
                        <Badge
                          className={`text-xs font-medium ${WORD_LEVEL_COLORS[word.level]}`}
                        >
                          {WORD_LEVEL_NAMES[word.level]}
                        </Badge>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speak(word.germanWord)}
                            className="h-8 w-8 p-0 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteWord(word.id)}
                            className="h-8 w-8 p-0 text-red-400/60 hover:text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {/* Основное содержимое */}
                      <div className="text-center mb-4">
                        <div className="text-xl font-bold text-gray-900 dark:text-white/90 mb-2">
                          {word.germanWord}
                        </div>
                        <div className="text-lg text-gray-700 dark:text-white/70 mb-3">
                          {word.translation}
                        </div>
                        {word.examples && word.examples.length > 0 && (
                          <div className="text-xs text-gray-600 dark:text-white/50 bg-gray-100 dark:bg-white/5 rounded-lg p-2">
                            "{word.examples[0].germanSentence}"
                          </div>
                        )}
                      </div>
                      {/* Статистика */}
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-white/50 mb-4">
                        <span>Правильно: {word.correctCount}</span>
                        <span>Ошибок: {word.incorrectCount}</span>
                        <span>
                          Добавлено:{" "}
                          {new Date(word.addedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {/* Кнопки уровня */}
                      <div className="flex items-center gap-1">
                        {(
                          [
                            "new",
                            "learning",
                            "familiar",
                            "mastered",
                          ] as WordLevel[]
                        ).map((level) => (
                          <Button
                            key={level}
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleUpdateWordLevel(word.id, level)
                            }
                            className={`flex-1 h-8 text-xs transition-all ${
                              word.level === level
                                ? WORD_LEVEL_COLORS[level]
                                : "text-gray-500 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5"
                            }`}
                          >
                            {level === "new" && <Star className="w-3 h-3" />}
                            {level === "learning" && (
                              <Brain className="w-3 h-3" />
                            )}
                            {level === "familiar" && (
                              <Target className="w-3 h-3" />
                            )}
                            {level === "mastered" && (
                              <TrendingUp className="w-3 h-3" />
                            )}
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
      {/* Модальное окно изучения */}
      <StudyModal
        collectionId={collectionId}
        collectionName={collection.name}
        words={words}
        isOpen={isStudyMode}
        onClose={() => setIsStudyMode(false)}
        onProgressUpdate={loadCollection}
      />
    </div>
  );
}
