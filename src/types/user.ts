export interface User {
  id: string;
  uid?: string; // Firebase UID для совместимости
  email: string;
  name: string;
  displayName?: string; // Firebase displayName для совместимости
  avatar?: string;
  createdAt: Date;
  lastActiveAt: Date;
  emailVerified: boolean;
  preferences: UserPreferences;
  gamification: UserGamification;
  goals: UserGoals;
  achievements: Achievement[];
}
export interface UserPreferences {
  language: "ru" | "de" | "en";
  theme: "light" | "dark" | "system";
  pronunciationSpeed: number;
  dailyReminderEnabled: boolean;
  reminderTime: string; // HH:MM format
  weeklyGoalReminders: boolean;
}
export interface UserGamification {
  level: number;
  totalXP: number;
  currentLevelXP: number;
  xpToNextLevel: number;
  streak: StreakData;
  badges: Badge[];
  totalStudyTime: number; // в минутах
  totalWordsLearned: number;
  totalCollections: number;
  rank: UserRank;
}
export interface StreakData {
  current: number;
  longest: number;
  lastStudyDate?: Date;
  freezeUsed: number; // количество использованных заморозок стрика
  freezeAvailable: number; // доступные заморозки
}
export interface UserGoals {
  daily: DailyGoal;
  weekly: WeeklyGoal;
  monthly: MonthlyGoal;
  custom: CustomGoal[];
}
export interface DailyGoal {
  targetWords: number;
  targetMinutes: number;
  completed: boolean;
  progress: {
    words: number;
    minutes: number;
  };
  lastResetDate: Date;
}
export interface WeeklyGoal {
  targetWords: number;
  targetDays: number; // количество дней изучения в неделю
  completed: boolean;
  progress: {
    words: number;
    daysStudied: number;
  };
  lastResetDate: Date;
}
export interface MonthlyGoal {
  targetWords: number;
  targetCollections: number;
  completed: boolean;
  progress: {
    words: number;
    collections: number;
  };
  lastResetDate: Date;
}
export interface CustomGoal {
  id: string;
  title: string;
  description: string;
  type: "words" | "collections" | "study_time" | "streak";
  target: number;
  current: number;
  completed: boolean;
  deadline?: Date;
  reward?: GoalReward;
  createdAt: Date;
}
export interface GoalReward {
  type: "xp" | "badge" | "freeze";
  value: number | string;
  claimed: boolean;
}
export interface Achievement {
  id: string;
  type: AchievementType;
  unlockedAt: Date;
  progress?: number;
  maxProgress?: number;
}
export type AchievementType =
  // Изучение слов
  | "first_word" // Первое изученное слово
  | "words_10"
  | "words_50"
  | "words_100"
  | "words_500"
  | "words_1000"
  // Коллекции
  | "first_collection" // Первая коллекция
  | "collections_5"
  | "collections_10"
  | "collections_25"
  // Стрики
  | "streak_3"
  | "streak_7"
  | "streak_14"
  | "streak_30"
  | "streak_100"
  // Уровни
  | "level_5"
  | "level_10"
  | "level_25"
  | "level_50"
  // Специальные
  | "early_bird" // Изучение утром (до 9:00)
  | "night_owl" // Изучение поздно (после 22:00)
  | "speed_learner" // 20+ слов за одну сессию
  | "perfectionist" // 100% правильных ответов в сессии из 10+ слов
  | "polyglot" // Использование разных языков интерфейса
  | "goal_master" // Выполнение 10 целей подряд
  | "time_master"; // 60+ минут изучения за день
export interface Badge {
  id: string;
  type: BadgeType;
  earnedAt: Date;
  level?: number; // для badges с уровнями
}
export type BadgeType =
  | "newcomer" // Новичок
  | "dedicated" // Преданный (streak 7)
  | "unstoppable" // Неудержимый (streak 30)
  | "scholar" // Учёный (100 слов)
  | "master" // Мастер (500 слов)
  | "genius" // Гений (1000 слов)
  | "collector" // Коллекционер (10 коллекций)
  | "speed_demon" // Скоростной демон
  | "perfectionist" // Перфекционист
  | "early_bird" // Ранняя пташка
  | "night_owl"; // Сова
export type UserRank =
  | "novice" // Новичок (0-99 XP)
  | "apprentice" // Ученик (100-499 XP)
  | "student" // Студент (500-1499 XP)
  | "scholar" // Учёный (1500-3999 XP)
  | "expert" // Эксперт (4000-9999 XP)
  | "master" // Мастер (10000-24999 XP)
  | "grandmaster"; // Гроссмейстер (25000+ XP)
export interface StudySession {
  id: string;
  userId: string;
  startedAt: Date;
  endedAt?: Date;
  wordsStudied: number;
  correctAnswers: number;
  totalAnswers: number;
  xpEarned: number;
  collectionId?: string;
  achievements: AchievementType[];
}
// Система XP
export const XP_REWARDS = {
  WORD_CORRECT: 10,
  WORD_PERFECT: 15, // без ошибок с первого раза
  DAILY_GOAL: 50,
  WEEKLY_GOAL: 200,
  MONTHLY_GOAL: 500,
  STREAK_BONUS: 5, // за каждый день стрика
  FIRST_SESSION_TODAY: 25,
  COLLECTION_COMPLETE: 100,
  ACHIEVEMENT_UNLOCK: 30,
} as const;
// Требования XP для уровней
export const LEVEL_REQUIREMENTS = {
  1: 0,
  2: 100,
  3: 250,
  4: 450,
  5: 700,
  6: 1000,
  7: 1350,
  8: 1750,
  9: 2200,
  10: 2700,
  // Далее формула: предыдущий + (level * 100)
} as const;
// Определения достижений
export const ACHIEVEMENT_DEFINITIONS: Record<
  AchievementType,
  {
    title: string;
    description: string;
    icon: string;
    xpReward: number;
    requirement: number;
  }
> = {
  first_word: {
    title: "Первые шаги",
    description: "Изучите ваше первое слово",
    icon: "🌱",
    xpReward: 50,
    requirement: 1,
  },
  words_10: {
    title: "Начинающий",
    description: "Изучите 10 слов",
    icon: "📚",
    xpReward: 100,
    requirement: 10,
  },
  words_50: {
    title: "Активный ученик",
    description: "Изучите 50 слов",
    icon: "🎓",
    xpReward: 200,
    requirement: 50,
  },
  words_100: {
    title: "Столетник",
    description: "Изучите 100 слов",
    icon: "💯",
    xpReward: 300,
    requirement: 100,
  },
  words_500: {
    title: "Полиглот",
    description: "Изучите 500 слов",
    icon: "🌟",
    xpReward: 500,
    requirement: 500,
  },
  words_1000: {
    title: "Мастер слов",
    description: "Изучите 1000 слов",
    icon: "👑",
    xpReward: 1000,
    requirement: 1000,
  },
  first_collection: {
    title: "Коллекционер",
    description: "Создайте первую коллекцию",
    icon: "📝",
    xpReward: 50,
    requirement: 1,
  },
  collections_5: {
    title: "Организатор",
    description: "Создайте 5 коллекций",
    icon: "📁",
    xpReward: 150,
    requirement: 5,
  },
  collections_10: {
    title: "Архивариус",
    description: "Создайте 10 коллекций",
    icon: "🗂️",
    xpReward: 300,
    requirement: 10,
  },
  collections_25: {
    title: "Великий собиратель",
    description: "Создайте 25 коллекций",
    icon: "🏛️",
    xpReward: 500,
    requirement: 25,
  },
  streak_3: {
    title: "Настойчивый",
    description: "Изучайте 3 дня подряд",
    icon: "🔥",
    xpReward: 100,
    requirement: 3,
  },
  streak_7: {
    title: "Преданный",
    description: "Изучайте неделю подряд",
    icon: "🔥",
    xpReward: 200,
    requirement: 7,
  },
  streak_14: {
    title: "Железная воля",
    description: "Изучайте 2 недели подряд",
    icon: "💪",
    xpReward: 350,
    requirement: 14,
  },
  streak_30: {
    title: "Неудержимый",
    description: "Изучайте месяц подряд",
    icon: "🚀",
    xpReward: 500,
    requirement: 30,
  },
  streak_100: {
    title: "Легенда",
    description: "Изучайте 100 дней подряд",
    icon: "👑",
    xpReward: 1000,
    requirement: 100,
  },
  level_5: {
    title: "Начинающий исследователь",
    description: "Достигните 5 уровня",
    icon: "⭐",
    xpReward: 200,
    requirement: 5,
  },
  level_10: {
    title: "Опытный ученик",
    description: "Достигните 10 уровня",
    icon: "⭐",
    xpReward: 400,
    requirement: 10,
  },
  level_25: {
    title: "Эксперт",
    description: "Достигните 25 уровня",
    icon: "⭐",
    xpReward: 750,
    requirement: 25,
  },
  level_50: {
    title: "Гроссмейстер",
    description: "Достигните 50 уровня",
    icon: "👑",
    xpReward: 1500,
    requirement: 50,
  },
  early_bird: {
    title: "Ранняя пташка",
    description: "Изучайте немецкий утром (до 9:00)",
    icon: "🌅",
    xpReward: 100,
    requirement: 1,
  },
  night_owl: {
    title: "Полуночник",
    description: "Изучайте немецкий поздно (после 22:00)",
    icon: "🦉",
    xpReward: 100,
    requirement: 1,
  },
  speed_learner: {
    title: "Скоростной ученик",
    description: "Изучите 20+ слов за одну сессию",
    icon: "⚡",
    xpReward: 150,
    requirement: 20,
  },
  perfectionist: {
    title: "Перфекционист",
    description: "100% правильных ответов в сессии из 10+ слов",
    icon: "💎",
    xpReward: 200,
    requirement: 10,
  },
  polyglot: {
    title: "Космополит",
    description: "Используйте разные языки интерфейса",
    icon: "🌍",
    xpReward: 150,
    requirement: 1,
  },
  goal_master: {
    title: "Мастер целей",
    description: "Выполните 10 целей подряд",
    icon: "🎯",
    xpReward: 300,
    requirement: 10,
  },
  time_master: {
    title: "Мастер времени",
    description: "Изучайте 60+ минут за день",
    icon: "⏰",
    xpReward: 200,
    requirement: 60,
  },
};
// Для локального хранения
export interface LocalUserData {
  user: User | null;
  isAuthenticated: boolean;
  version: string;
}
