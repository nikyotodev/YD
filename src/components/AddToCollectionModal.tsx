"use client";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  BookmarkPlus,
  Check,
  Folder,
  FolderPlus,
  User,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { collectionsManager } from "@/lib/collections-storage";
import type { Collection } from "@/types/collections";
import { useUser } from "@/contexts/UserContext";
interface AddToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  germanWord: string;
  translation: string;
  examples?: Array<{
    germanSentence?: string;
    sentence?: string;
    translation: string;
    level?: string;
  }>;
  onSuccess?: () => void;
}
export function AddToCollectionModal({
  isOpen,
  onClose,
  germanWord,
  translation,
  examples = [],
  onSuccess,
}: AddToCollectionModalProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionEmoji, setNewCollectionEmoji] = useState("📚");
  const [isCreating, setIsCreating] = useState(false);
  const [addedToCollection, setAddedToCollection] = useState<string | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useUser();
  // Загружаем коллекции при открытии модального окна
  const loadCollections = useCallback(() => {
    const userCollections = collectionsManager.getCollections();
    setCollections(userCollections);
  }, []);
  // Сброс состояния при открытии
  const handleOpen = useCallback(() => {
    if (isOpen) {
      loadCollections();
      setShowCreateForm(false);
      setNewCollectionName("");
      setNewCollectionEmoji("📚");
      setIsCreating(false);
      setAddedToCollection(null);
    }
  }, [isOpen, loadCollections]);
  // Проверяем, что компонент смонтирован на клиенте
  useEffect(() => {
    setMounted(true);
  }, []);
  // Отслеживаем изменение isOpen
  useEffect(() => {
    handleOpen();
  }, [handleOpen]);
  // Обрабатываем ESC-клавишу и блокируем скролл
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    // Блокируем скролл
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);
    return () => {
      // Восстанавливаем скролл
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);
  const handleAddToCollection = async (collectionId: string) => {
    if (!isAuthenticated) return;
    // Приводим examples к типу WordExample
    const formattedExamples = examples?.map(ex => ({
      germanSentence: ex.germanSentence || ex.sentence || "",
      translation: ex.translation,
      level: ex.level
    })).filter(ex => ex.germanSentence) || [];
    const success = collectionsManager.addWordToCollection(
      collectionId,
      germanWord,
      translation,
      formattedExamples,
    );
    if (success) {
      setAddedToCollection(collectionId);
      onSuccess?.();
      // Закрываем модальное окно через небольшую задержку
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };
  const handleCreateCollection = async () => {
    if (!isAuthenticated) return;
    if (!newCollectionName.trim()) return;
    setIsCreating(true);
    try {
      const newCollection = collectionsManager.createCollection(
        newCollectionName.trim(),
        "",
        newCollectionEmoji,
        "violet",
      );
      // Добавляем слово в новую коллекцию
      await handleAddToCollection(newCollection.id);
    } catch (error) {
      console.error("Ошибка при создании коллекции:", error);
    } finally {
      setIsCreating(false);
    }
  };
  const popularEmojis = [
    "📚",
    "🎓",
    "🗂️",
    "📖",
    "📝",
    "🎯",
    "⭐",
    "💡",
    "🚀",
    "🎪",
  ];
  if (!isOpen || !mounted) return null;
  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md max-h-[90vh] mx-auto"
        >
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-german-red/10 dark:bg-dark-theme-purple/20 rounded-xl">
                  <BookmarkPlus className="h-5 w-5 text-german-red dark:text-dark-theme-purple" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Добавить в коллекцию
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span className="text-german-red dark:text-dark-theme-purple font-medium">
                      {germanWord}
                    </span>
                    {" → "}
                    <span className="text-german-gold dark:text-dark-theme-pink font-medium">
                      {translation}
                    </span>
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {!isAuthenticated ? (
                // Unauthenticated user screen
                <div className="text-center py-8">
                  <div className="p-4 bg-german-gold/20 dark:bg-purple-900/50 rounded-xl w-fit mx-auto mb-4">
                    <User className="h-8 w-8 text-german-red dark:text-pink-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Требуется авторизация
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Чтобы добавлять слова в коллекции, необходимо войти в аккаунт
                  </p>
                  <Button
                    variant="german"
                    onClick={onClose}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Войти в аккаунт
                  </Button>
                </div>
              ) : addedToCollection ? (
                // Success screen
                <div className="text-center py-8">
                  <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-xl w-fit mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Слово добавлено!
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Слово успешно сохранено в вашу коллекцию
                  </p>
                </div>
              ) : showCreateForm ? (
                // Create collection form
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCreateForm(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      ← Назад
                    </Button>
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">
                      Новая коллекция
                    </h4>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Название коллекции
                    </label>
                    <Input
                      placeholder="Например: Повседневные слова"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-german-red dark:focus:border-dark-theme-purple"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newCollectionName.trim()) {
                          handleCreateCollection();
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Эмодзи
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {popularEmojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setNewCollectionEmoji(emoji)}
                          className={`w-10 h-10 rounded-lg text-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            newCollectionEmoji === emoji
                              ? "bg-german-red/10 dark:bg-dark-theme-purple/20 border-2 border-german-red dark:border-dark-theme-purple"
                              : "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="ghost"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Отмена
                    </Button>
                    <Button
                      variant="german"
                      onClick={handleCreateCollection}
                      disabled={!newCollectionName.trim() || isCreating}
                      className="flex-1"
                    >
                      {isCreating ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2 animate-spin" />
                      ) : (
                        <FolderPlus className="h-4 w-4 mr-2" />
                      )}
                      Создать и добавить
                    </Button>
                  </div>
                </div>
              ) : (
                // Collection selection
                <div className="space-y-4">
                  {collections.length > 0 ? (
                    <>
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Выберите коллекцию:
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {collections.map((collection) => (
                          <button
                            key={collection.id}
                            onClick={() => handleAddToCollection(collection.id)}
                            className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all text-left"
                          >
                            <span className="text-xl">
                              {collection.emoji || "📚"}
                            </span>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {collection.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {collection.wordsCount} слов
                              </div>
                            </div>
                            <BookmarkPlus className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl w-fit mx-auto mb-3">
                        <Folder className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                      </div>
                      <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                        У вас пока нет коллекций
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Создайте первую коллекцию для сохранения слов
                      </p>
                    </div>
                  )}
                  {/* Create new collection button */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <Button
                      variant="german-gold"
                      onClick={() => setShowCreateForm(true)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Создать новую коллекцию
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
  return createPortal(modalContent, document.body);
}
