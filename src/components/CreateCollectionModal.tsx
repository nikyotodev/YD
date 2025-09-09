"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Palette, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { AuthModal } from "@/components/AuthModal";
interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    name: string,
    description: string,
    emoji: string,
    color: string,
  ) => void;
}
const EMOJI_OPTIONS = [
  "📚",
  "🇩🇪",
  "📖",
  "✏️",
  "🎓",
  "💡",
  "🌟",
  "🎯",
  "🚀",
  "💪",
  "🧠",
  "🔥",
  "📝",
  "🎪",
  "🎨",
  "🎭",
  "🎮",
  "🎵",
];
const COLOR_OPTIONS = [
  { name: "Фиолетовый", value: "violet", class: "bg-violet-500" },
  { name: "Синий", value: "blue", class: "bg-blue-500" },
  { name: "Зеленый", value: "green", class: "bg-green-500" },
  { name: "Золотой", value: "orange", class: "bg-german-gold dark:bg-purple-500" },
  { name: "Красный", value: "pink", class: "bg-german-red" },
  { name: "Красный", value: "red", class: "bg-red-500" },
  { name: "Светло-золотой", value: "yellow", class: "bg-german-light-gold dark:bg-pink-500" },
  { name: "Индиго", value: "indigo", class: "bg-indigo-500" },
];
export function CreateCollectionModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateCollectionModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("📚");
  const [selectedColor, setSelectedColor] = useState("violet");
  const [activeTab, setActiveTab] = useState<"emoji" | "color">("emoji");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useUser();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    onSubmit(name.trim(), description.trim(), selectedEmoji, selectedColor);
    // Сброс формы
    setName("");
    setDescription("");
    setSelectedEmoji("📚");
    setSelectedColor("violet");
    setActiveTab("emoji");
  };
  const handleClose = () => {
    onClose();
    // Сброс формы при закрытии
    setName("");
    setDescription("");
    setSelectedEmoji("📚");
    setSelectedColor("violet");
    setActiveTab("emoji");
  };
  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <>
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md mx-auto"
          >
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl text-gray-900 dark:text-white">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-german-gold/20 dark:bg-purple-900/50 rounded-xl">
                    <BookOpen className="h-5 w-5 text-german-red dark:text-purple-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Создать коллекцию
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-6">
                {!isAuthenticated ? (
                  // Unauthenticated user screen
                  <div className="text-center py-8">
                    <div className="glass p-4 bg-gradient-to-br from-german-gold/20 to-german-red/20 rounded-xl w-fit mx-auto mb-4 dark:from-dark-theme-purple/30 dark:to-dark-theme-pink/30">
                      <User className="h-8 w-8 text-german-gold dark:text-dark-theme-pink" />
                    </div>
                    <h3 className="text-xl font-bold gradient-text mb-3">
                      Требуется авторизация
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Для создания коллекций необходимо войти в аккаунт или
                      зарегистрироваться
                    </p>
                    <Button
                      onClick={() => setShowAuthModal(true)}
                      className="glass bg-gradient-to-r from-german-red/20 to-german-gold/20 hover:bg-white/80 dark:hover:bg-black/30 text-german-red dark:text-dark-theme-pink border border-german-red/30 dark:border-dark-theme-pink/30"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Войти в аккаунт
                    </Button>
                  </div>
                ) : (
                  // Collection creation form
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Название коллекции
                      </label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Например: Основы немецкого"
                        className="glass bg-white/5 border-white/20 focus:border-german-red/50 dark:focus:border-dark-theme-pink/50 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        required
                        maxLength={50}
                      />
                    </div>
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Описание (необязательно)
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Краткое описание коллекции"
                        rows={3}
                        className="w-full glass bg-white/5 border-white/20 focus:border-german-red/50 dark:focus:border-dark-theme-pink/50 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-german-red/50 dark:focus:ring-dark-theme-pink/50 transition-all resize-none"
                        maxLength={200}
                      />
                    </div>
                    {/* Icon and color */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Оформление
                      </label>
                      {/* Tabs */}
                      <div className="flex glass rounded-lg p-1 mb-4">
                        <button
                          type="button"
                          onClick={() => setActiveTab("emoji")}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === "emoji"
                              ? "bg-gradient-to-r from-german-red/20 to-german-gold/20 text-german-red dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20 dark:text-dark-theme-pink"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          }`}
                        >
                          <span className="text-lg">{selectedEmoji}</span>
                          Эмодзи
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab("color")}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === "color"
                              ? "bg-gradient-to-r from-german-red/20 to-german-gold/20 text-german-red dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20 dark:text-dark-theme-pink"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          }`}
                        >
                          <Palette className="w-4 h-4" />
                          Цвет
                        </button>
                      </div>
                      {/* Emoji selection */}
                      {activeTab === "emoji" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-6 gap-2"
                        >
                          {EMOJI_OPTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => setSelectedEmoji(emoji)}
                              className={`p-3 text-2xl rounded-lg glass transition-all hover:bg-white/80 dark:hover:bg-black/30 ${
                                selectedEmoji === emoji
                                  ? "bg-gradient-to-r from-german-red/20 to-german-gold/20 border-2 border-german-red/30 dark:border-dark-theme-pink/30"
                                  : "bg-white/5 border border-white/20"
                              }`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </motion.div>
                      )}
                      {/* Color selection */}
                      {activeTab === "color" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-4 gap-3"
                        >
                          {COLOR_OPTIONS.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              onClick={() => setSelectedColor(color.value)}
                              className={`p-3 rounded-lg glass transition-all hover:scale-105 hover:bg-white/80 dark:hover:bg-black/30 ${
                                selectedColor === color.value
                                  ? "border-2 border-german-red/50 dark:border-dark-theme-pink/50 scale-105"
                                  : "border border-white/20"
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-full ${color.class} mx-auto`}
                              />
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                                {color.name}
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClose}
                        className="flex-1 glass text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-black/30"
                      >
                        Отмена
                      </Button>
                      <Button
                        type="submit"
                        disabled={!name.trim()}
                        className="flex-1 glass bg-gradient-to-r from-german-red/20 to-german-gold/20 hover:bg-white/80 dark:hover:bg-black/30 text-german-red dark:text-dark-theme-pink border border-german-red/30 dark:border-dark-theme-pink/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Создать
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={handleAuthModalClose}
          initialTab="login"
        />
      </>
    </AnimatePresence>
  );
}
