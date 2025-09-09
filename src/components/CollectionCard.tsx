import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { MoreHorizontal, Trash2, Edit, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Collection } from "@/types/collections";
import { useUser } from "@/contexts/UserContext";
import { firebaseCollectionsManager } from "@/lib/firebase-collections";
interface CollectionCardProps {
  collection: Collection;
  onDelete: (id: string) => void;
  index: number;
}
export function CollectionCard({
  collection,
  onDelete,
  index,
}: CollectionCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { isAuthenticated } = useUser();
  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Если пользователь авторизован, также удаляем коллекцию из Firestore
    if (isAuthenticated) {
      await firebaseCollectionsManager.deleteCollection(collection.id);
    }
    onDelete(collection.id);
    setShowMenu(false);
  };
  // Выбор цвета фона в зависимости от значения collection.color
  const getBackgroundClass = () => {
    switch (collection.color) {
      case "violet":
        return "bg-gradient-to-br from-violet-100 to-violet-50 dark:from-violet-500/20 dark:to-violet-600/10";
      case "blue":
        return "bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-500/20 dark:to-blue-600/10";
      case "green":
        return "bg-gradient-to-br from-green-100 to-green-50 dark:from-green-500/20 dark:to-green-600/10";
      case "orange":
        return "bg-gradient-to-br from-orange-100 to-red-50 dark:from-purple-600/20 dark:to-pink-500/10";
      case "pink":
        return "bg-gradient-to-br from-red-100 to-red-50 dark:from-german-red/20 dark:to-german-dark-red/10";
      case "red":
        return "bg-gradient-to-br from-red-100 to-red-50 dark:from-red-500/20 dark:to-red-600/10";
      case "yellow":
        return "bg-gradient-to-br from-yellow-100 to-orange-50 dark:from-purple-600/20 dark:to-pink-500/10";
      case "indigo":
        return "bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-500/20 dark:to-indigo-600/10";
      default:
        return "bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-500/20 dark:to-gray-600/10";
    }
  };
  // Выбор цвета текста
  const getTextClass = () => {
    switch (collection.color) {
      case "violet":
        return "text-violet-600 dark:text-violet-400";
      case "blue":
        return "text-blue-600 dark:text-blue-400";
      case "green":
        return "text-green-600 dark:text-green-400";
      case "orange":
        return "text-german-dark-red dark:text-purple-400";
      case "pink":
        return "text-german-dark-red dark:text-pink-400";
      case "red":
        return "text-red-600 dark:text-red-400";
      case "yellow":
        return "text-german-dark-red dark:text-pink-400";
      case "indigo":
        return "text-indigo-600 dark:text-indigo-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 + 0.3 }}
    >
      <Link href={`/collections/${collection.id}`}>
        <Card
          className={`glass-card relative group transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden ${getBackgroundClass()} border-white/10 dark:border-white/10`}
        >
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg bg-white/10 backdrop-blur-lg text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-10 bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-lg shadow-xl p-1 w-40 z-50">
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col"
                >
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-500/20 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Удалить
                  </button>
                </motion.div>
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div
                className={`text-4xl ${collection.emoji ? "" : "bg-gray-100 dark:bg-white/10 w-12 h-12 flex items-center justify-center rounded-full"}`}
              >
                {collection.emoji || "📚"}
              </div>
              <div>
                <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-1 line-clamp-1">
                  {collection.name}
                </h3>
                <div className="text-xs text-gray-500 dark:text-white/60">
                  {new Date(collection.updatedAt).toLocaleDateString("ru-RU")}
                </div>
              </div>
            </div>
            {collection.description && (
              <p className="text-sm text-gray-600 dark:text-white/70 mb-4 line-clamp-2">
                {collection.description}
              </p>
            )}
            <div className="mt-4 mb-2">
              <div className="flex justify-between text-xs text-gray-500 dark:text-white/60 mb-1">
                <span>Прогресс</span>
                <span className={getTextClass()}>
                  {collection.progress.percentage}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    collection.color === "violet"
                      ? "bg-violet-500"
                      : collection.color === "blue"
                        ? "bg-blue-500"
                        : collection.color === "green"
                          ? "bg-green-500"
                          : collection.color === "orange"
                            ? "bg-german-gold dark:bg-purple-500"
                            : collection.color === "pink"
                              ? "bg-german-red"
                              : collection.color === "red"
                                ? "bg-red-500"
                                : collection.color === "yellow"
                                  ? "bg-german-light-gold dark:bg-pink-500"
                                  : collection.color === "indigo"
                                    ? "bg-indigo-500"
                                    : "bg-gray-500"
                  }`}
                  style={{ width: `${collection.progress.percentage}%` }}
                />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-white/10 flex justify-between items-center">
              <div className="text-xs text-gray-500 dark:text-white/60">
                <span className="font-medium text-gray-700 dark:text-white/90">
                  {collection.wordsCount}
                </span>{" "}
                слов
              </div>
              <div className="flex gap-2">
                <div className="px-2 py-1 rounded-md bg-gray-100 dark:bg-white/10 text-xs text-gray-600 dark:text-white/80">
                  {collection.progress.new} новых
                </div>
                <div className="px-2 py-1 rounded-md bg-gray-100 dark:bg-white/10 text-xs text-gray-600 dark:text-white/80">
                  {collection.progress.mastered} изучено
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
