"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, BookmarkPlus } from "lucide-react";
import { AddToCollectionModal } from "@/components/AddToCollectionModal";
import { InlineAuthNotification } from "@/components/InlineAuthNotification";
import { useUser } from "@/contexts/UserContext";
interface AddToCollectionButtonProps {
  germanWord: string;
  translation: string;
  examples?: Array<{
    germanSentence?: string;
    sentence?: string;
    translation: string;
    level?: string;
  }>;
  variant?: "default" | "compact";
  className?: string;
}
export function AddToCollectionButton({
  germanWord,
  translation,
  examples = [],
  variant = "default",
  className = "",
}: AddToCollectionButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAuthNotification, setShowAuthNotification] = useState(false);
  const [addedToCollection, setAddedToCollection] = useState(false);
  const { isAuthenticated } = useUser();
  const handleOpenModal = () => {
    if (isAuthenticated) {
      setIsModalOpen(true);
    } else {
      setShowAuthNotification(true);
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleCloseAuthNotification = () => {
    setShowAuthNotification(false);
  };
  const handleSuccess = () => {
    setAddedToCollection(true);
    // Сбрасываем индикатор через 3 секунды
    setTimeout(() => {
      setAddedToCollection(false);
    }, 3000);
  };
  // Закрытие уведомления при нажатии ESC
  useEffect(() => {
    if (!showAuthNotification) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowAuthNotification(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showAuthNotification]);
  return (
    <div className="relative">
      <motion.button
        onClick={handleOpenModal}
        whileTap={{ scale: 0.95 }}
        disabled={addedToCollection}
        className={`inline-flex items-center gap-2 px-3 py-2 transition-all text-sm font-medium rounded-lg ${
          addedToCollection
            ? "bg-green-500/20 text-green-300 border border-green-500/30 cursor-default"
            : "bg-gradient-to-r from-german-red/20 to-german-gold/20 hover:bg-gradient-to-r hover:from-german-red/10 hover:to-german-gold/10 text-german-red hover:text-german-red dark:text-german-gold dark:hover:text-german-gold border border-german-red/30 dark:border-german-gold/30 cursor-pointer"
        } ${className}`}
      >
        {addedToCollection ? (
          <>
            <Check className="w-4 h-4" />
            {variant === "compact" ? "Сохранено" : "Добавлено"}
          </>
        ) : (
          <>
            <BookmarkPlus className="w-4 h-4" />
            {variant === "compact" ? "Сохранить" : "В коллекцию"}
          </>
        )}
      </motion.button>
      <AnimatePresence>
        {showAuthNotification && (
          <InlineAuthNotification onClose={handleCloseAuthNotification} />
        )}
      </AnimatePresence>
      <AddToCollectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        germanWord={germanWord}
        translation={translation}
        examples={examples}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
