export interface Collection {
  id: string;
  name: string;
  description?: string;
  emoji?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  wordsCount: number;
  progress: CollectionProgress;
  color?: string; // Цвет темы коллекции
}
export interface WordInCollection {
  id: string;
  collectionId: string;
  germanWord: string;
  translation: string;
  level: WordLevel;
  lastReviewed?: Date;
  nextReview?: Date;
  correctCount: number;
  incorrectCount: number;
  addedAt: Date;
  examples?: WordExample[];
  notes?: string;
  difficulty?: "easy" | "medium" | "hard";
}
export interface WordExample {
  germanSentence: string;
  translation: string;
  level?: string;
}
export interface CollectionProgress {
  total: number;
  new: number;
  learning: number;
  familiar: number;
  mastered: number;
  percentage: number;
  streakDays: number;
  lastStudied?: Date;
}
export type WordLevel = "new" | "learning" | "familiar" | "mastered";
export interface StudySession {
  id: string;
  collectionId: string;
  startedAt: Date;
  completedAt?: Date;
  wordsStudied: number;
  correctAnswers: number;
  totalAnswers: number;
  duration: number; // в секундах
}
export interface UserStats {
  totalWordsLearned: number;
  totalCollections: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: Date;
  dailyGoal: number;
  weeklyGoal: number;
}
// Для локального хранения
export interface LocalStorageData {
  collections: Collection[];
  words: WordInCollection[];
  sessions: StudySession[];
  userStats: UserStats;
  version: string;
}
// Константы для системы интервального повторения (SRS)
export const SRS_INTERVALS = {
  new: 1, // день
  learning: 3, // дня
  familiar: 7, // дней
  mastered: 30, // дней
} as const;
export const WORD_LEVEL_COLORS = {
  new: "bg-blue-500/20 text-blue-300",
  learning: "bg-yellow-500/20 text-yellow-300",
  familiar: "bg-green-500/20 text-green-300",
  mastered: "bg-purple-500/20 text-purple-300",
} as const;
export const WORD_LEVEL_NAMES = {
  new: "Новое",
  learning: "Изучаю",
  familiar: "Знакомо",
  mastered: "Освоено",
} as const;
