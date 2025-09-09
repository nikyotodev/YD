"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collectionsManager } from "@/lib/collections-storage";
import type { WordInCollection, WordLevel } from "@/types/collections";
import { WORD_LEVEL_COLORS, WORD_LEVEL_NAMES } from "@/types/collections";
import {
  X,
  Volume2,
  RotateCcw,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Star,
  Brain,
  Target,
  TrendingUp,
  Zap,
  Clock,
  Book,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
interface StudyModalProps {
  collectionId: string;
  collectionName: string;
  words: WordInCollection[];
  isOpen: boolean;
  onClose: () => void;
  onProgressUpdate: () => void;
}
interface StudyCard {
  word: WordInCollection;
  isFlipped: boolean;
  isAnswered: boolean;
  isCorrect?: boolean;
}
export function StudyModal({
  collectionId,
  collectionName,
  words,
  isOpen,
  onClose,
  onProgressUpdate,
}: StudyModalProps) {
  const [studyWords, setStudyWords] = useState<StudyCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0,
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(new Date());
  // Инициализация слов для изучения
  useEffect(() => {
    if (isOpen && words.length > 0) {
      // Фильтруем слова для изучения (исключаем полностью освоенные)
      const wordsToStudy = words
        .filter((word) => word.level !== "mastered")
        .slice(0, 10) // Ограничиваем сессию 10 словами
        .map((word) => ({
          word,
          isFlipped: false,
          isAnswered: false,
        }));
      setStudyWords(wordsToStudy);
      setCurrentIndex(0);
      setSessionStats({ correct: 0, incorrect: 0, total: wordsToStudy.length });
      setIsCompleted(false);
    }
  }, [isOpen, words]);
  const currentCard = studyWords[currentIndex];
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };
  const flipCard = () => {
    if (!currentCard || currentCard.isAnswered) return;
    setStudyWords((prev) =>
      prev.map((card, index) =>
        index === currentIndex ? { ...card, isFlipped: !card.isFlipped } : card,
      ),
    );
  };
  const handleAnswer = (isCorrect: boolean) => {
    if (!currentCard || currentCard.isAnswered) return;
    // Обновляем карточку
    setStudyWords((prev) =>
      prev.map((card, index) =>
        index === currentIndex
          ? { ...card, isAnswered: true, isCorrect, isFlipped: true }
          : card,
      ),
    );
    // Определяем новый уровень слова
    let newLevel: WordLevel = currentCard.word.level;
    if (isCorrect) {
      switch (currentCard.word.level) {
        case "new":
          newLevel = "learning";
          break;
        case "learning":
          newLevel = "familiar";
          break;
        case "familiar":
          newLevel = "mastered";
          break;
      }
      setSessionStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      // При ошибке возвращаем на предыдущий уровень или оставляем на текущем
      switch (currentCard.word.level) {
        case "familiar":
          newLevel = "learning";
          break;
        case "mastered":
          newLevel = "familiar";
          break;
        // 'new' и 'learning' остаются на том же уровне
      }
      setSessionStats((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
    // Обновляем уровень в базе данных
    collectionsManager.updateWordLevel(
      collectionId,
      currentCard.word.id,
      newLevel,
      isCorrect,
    );
  };
  const nextCard = () => {
    if (currentIndex < studyWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Завершаем сессию
      completeSession();
    }
  };
  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  const completeSession = () => {
    setIsCompleted(true);
    onProgressUpdate();
    // Сохраняем статистику сессии
    const duration = Math.floor(
      (new Date().getTime() - startTime.getTime()) / 1000,
    );
    // Здесь можно добавить сохранение статистики сессии в collectionsManager
  };
  const restartSession = () => {
    setStudyWords((prev) =>
      prev.map((card) => ({
        ...card,
        isFlipped: false,
        isAnswered: false,
        isCorrect: undefined,
      })),
    );
    setCurrentIndex(0);
    setSessionStats((prev) => ({ ...prev, correct: 0, incorrect: 0 }));
    setIsCompleted(false);
  };
  const closeModal = () => {
    onClose();
    // Сбрасываем состояние после закрытия
    setTimeout(() => {
      setStudyWords([]);
      setCurrentIndex(0);
      setIsCompleted(false);
    }, 300);
  };
  if (!isOpen) return null;
  // Экран завершения сессии
  if (isCompleted) {
    const percentage =
      sessionStats.total > 0
        ? Math.round((sessionStats.correct / sessionStats.total) * 100)
        : 0;
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full text-center"
        >
          <div className="text-6xl mb-6">
            {percentage >= 80
              ? "🎉"
              : percentage >= 60
                ? "👍"
                : percentage >= 40
                  ? "😊"
                  : "💪"}
          </div>
          <h2 className="text-2xl font-bold text-white/90 mb-4">
            Сессия завершена!
          </h2>
          <div className="mb-6">
            <div className="text-4xl font-bold text-white/90 mb-2">
              {percentage}%
            </div>
            <div className="text-white/60 mb-4">Правильных ответов</div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-500/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">
                  {sessionStats.correct}
                </div>
                <div className="text-green-300 text-sm">Правильно</div>
              </div>
              <div className="bg-red-500/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-400">
                  {sessionStats.incorrect}
                </div>
                <div className="text-red-300 text-sm">Ошибок</div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={restartSession}
              className="flex-1 bg-german-red/20 hover:bg-german-red/30 border border-german-red/30 text-german-red"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Ещё раз
            </Button>
            <Button
              onClick={closeModal}
              className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white"
            >
              Закрыть
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }
  // Основной экран изучения
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white/[0.05] backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh]"
      >
        {/* Заголовок */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white/90">
                Изучение: {collectionName}
              </h2>
              <div className="text-white/60 text-sm">
                {currentIndex + 1} из {studyWords.length} слов
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Прогресс */}
              <div className="text-right">
                <div className="text-sm text-white/60">Правильно</div>
                <div className="text-lg font-bold text-green-400">
                  {sessionStats.correct}/
                  {currentIndex + (currentCard?.isAnswered ? 1 : 0)}
                </div>
              </div>
              <Button
                onClick={closeModal}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
          {/* Прогресс бар */}
          <div className="mt-4">
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-german-red to-german-gold rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + (currentCard?.isAnswered ? 1 : 0)) / studyWords.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
        {/* Карточка */}
        {currentCard && (
          <div className="p-8">
            <div
              className={`relative perspective-1000 h-80 cursor-pointer ${
                currentCard.isAnswered ? "pointer-events-none" : ""
              }`}
              onClick={flipCard}
            >
              <div
                className={`card-flip-container h-full ${currentCard.isFlipped ? "flipped" : ""}`}
              >
                {/* Передняя сторона */}
                <div className="card-face card-front h-full bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border border-gray-400/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                  <Badge
                    className={`mb-4 ${WORD_LEVEL_COLORS[currentCard.word.level]}`}
                  >
                    {WORD_LEVEL_NAMES[currentCard.word.level]}
                  </Badge>
                  <div className="text-4xl font-bold text-white/90 mb-4">
                    {currentCard.word.germanWord}
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(currentCard.word.germanWord);
                    }}
                    variant="ghost"
                    size="sm"
                    className="mb-6 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                  >
                    <Volume2 className="w-5 h-5 mr-2" />
                    Произнести
                  </Button>
                  <div className="text-white/60 text-sm">
                    Нажмите, чтобы увидеть перевод
                  </div>
                </div>
                {/* Задняя сторона */}
                <div className="card-face card-back h-full bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                  <div className="text-3xl font-bold text-white/90 mb-4">
                    {currentCard.word.germanWord}
                  </div>
                  <div className="text-2xl text-white/80 mb-6">
                    {currentCard.word.translation}
                  </div>
                  {currentCard.word.examples &&
                    currentCard.word.examples.length > 0 && (
                      <div className="bg-white/10 rounded-lg p-4 mb-6 max-w-md">
                        <div className="text-sm text-blue-300 mb-2">
                          Пример:
                        </div>
                        <div className="text-sm text-white/80 mb-1">
                          "{currentCard.word.examples[0].germanSentence}"
                        </div>
                        <div className="text-xs text-white/60 italic">
                          "{currentCard.word.examples[0].translation}"
                        </div>
                      </div>
                    )}
                  {!currentCard.isAnswered && (
                    <div className="text-white/60 text-sm">
                      Знали ли вы перевод этого слова?
                    </div>
                  )}
                  {currentCard.isAnswered && (
                    <div
                      className={`flex items-center gap-2 ${
                        currentCard.isCorrect
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {currentCard.isCorrect ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>Правильно!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5" />
                          <span>Повторите ещё раз</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Кнопки управления */}
            <div className="flex items-center justify-between mt-6">
              <Button
                onClick={prevCard}
                disabled={currentIndex === 0}
                variant="ghost"
                className="text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Назад
              </Button>
              {currentCard.isFlipped && !currentCard.isAnswered && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleAnswer(false)}
                    className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 px-6"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Не знал
                  </Button>
                  <Button
                    onClick={() => handleAnswer(true)}
                    className="bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-green-300 px-6"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Знал
                  </Button>
                </div>
              )}
              {currentCard.isAnswered && (
                <Button
                  onClick={nextCard}
                  className="bg-violet-500/20 hover:bg-violet-500/30 border border-violet-400/30 text-violet-300 px-6"
                >
                  {currentIndex === studyWords.length - 1
                    ? "Завершить"
                    : "Дальше"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
              {!currentCard.isFlipped && (
                <div className="text-transparent">Placeholder</div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
