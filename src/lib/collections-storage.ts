import type {
  Collection,
  WordInCollection,
  StudySession,
  UserStats,
  LocalStorageData,
  CollectionProgress,
  WordLevel,
  WordExample,
} from "@/types/collections";
import { SRS_INTERVALS } from "@/types/collections";
const STORAGE_KEY = "talkify_collections_data";
const STORAGE_VERSION = "1.0.0";
// Получение данных из локального хранилища
export function getStorageData(): LocalStorageData {
  if (typeof window === "undefined") {
    return getDefaultData();
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return getDefaultData();
    }
    const parsed = JSON.parse(data) as LocalStorageData;
    // Проверяем версию и мигрируем при необходимости
    if (parsed.version !== STORAGE_VERSION) {
      return migrateData(parsed);
    }
    // Конвертируем строки дат обратно в Date объекты
    return deserializeDates(parsed);
  } catch (error) {
    console.error("Ошибка при загрузке данных из localStorage:", error);
    return getDefaultData();
  }
}
// Сохранение данных в локальное хранилище
export function saveStorageData(data: LocalStorageData): void {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error("Ошибка при сохранении данных в localStorage:", error);
  }
}
// Данные по умолчанию
function getDefaultData(): LocalStorageData {
  return {
    collections: [],
    words: [],
    sessions: [],
    userStats: {
      totalWordsLearned: 0,
      totalCollections: 0,
      currentStreak: 0,
      longestStreak: 0,
      dailyGoal: 10,
      weeklyGoal: 50,
    },
    version: STORAGE_VERSION,
  };
}
// Миграция данных между версиями
function migrateData(
  oldData: Partial<LocalStorageData> & { version?: string },
): LocalStorageData {
  // Миграция данных: обновление с предыдущей версии на текущую
  // Пока просто возвращаем данные по умолчанию
  // В будущем здесь будет логика миграции
  return getDefaultData();
}
// Десериализация дат
function deserializeDates(
  data: LocalStorageData & {
    collections: Array<
      Omit<Collection, "createdAt" | "updatedAt" | "progress"> & {
        createdAt: string | Date;
        updatedAt: string | Date;
        progress: Omit<CollectionProgress, "lastStudied"> & {
          lastStudied?: string | Date;
        };
      }
    >;
    words: Array<
      Omit<WordInCollection, "addedAt" | "lastReviewed" | "nextReview"> & {
        addedAt: string | Date;
        lastReviewed?: string | Date;
        nextReview?: string | Date;
      }
    >;
    sessions: Array<
      Omit<StudySession, "startedAt" | "completedAt"> & {
        startedAt: string | Date;
        completedAt?: string | Date;
      }
    >;
    userStats: Omit<UserStats, "lastActiveDate"> & {
      lastActiveDate?: string | Date;
    };
  },
): LocalStorageData {
  return {
    ...data,
    collections: data.collections.map((collection) => ({
      ...collection,
      createdAt: new Date(collection.createdAt),
      updatedAt: new Date(collection.updatedAt),
      progress: {
        ...collection.progress,
        lastStudied: collection.progress.lastStudied
          ? new Date(collection.progress.lastStudied)
          : undefined,
      },
    })),
    words: data.words.map((word) => ({
      ...word,
      addedAt: new Date(word.addedAt),
      lastReviewed: word.lastReviewed ? new Date(word.lastReviewed) : undefined,
      nextReview: word.nextReview ? new Date(word.nextReview) : undefined,
    })),
    sessions: data.sessions.map((session) => ({
      ...session,
      startedAt: new Date(session.startedAt),
      completedAt: session.completedAt
        ? new Date(session.completedAt)
        : undefined,
    })),
    userStats: {
      ...data.userStats,
      lastActiveDate: data.userStats.lastActiveDate
        ? new Date(data.userStats.lastActiveDate)
        : undefined,
    },
  };
}
// Утилиты для работы с коллекциями
export class CollectionsManager {
  private data: LocalStorageData;
  constructor() {
    this.data = getStorageData();
  }
  // Получить все коллекции
  getCollections(): Collection[] {
    return this.data.collections;
  }
  // Получить коллекцию по ID
  getCollection(id: string): Collection | null {
    return this.data.collections.find((c) => c.id === id) || null;
  }
  // Создать новую коллекцию
  createCollection(
    name: string,
    description?: string,
    emoji?: string,
    color?: string,
  ): Collection {
    const id = generateId();
    const now = new Date();
    const collection: Collection = {
      id,
      name,
      description,
      emoji,
      color,
      createdAt: now,
      updatedAt: now,
      wordsCount: 0,
      progress: {
        total: 0,
        new: 0,
        learning: 0,
        familiar: 0,
        mastered: 0,
        percentage: 0,
        streakDays: 0,
      },
    };
    this.data.collections.push(collection);
    this.data.userStats.totalCollections++;
    this.save();
    return collection;
  }
  // Обновить коллекцию
  updateCollection(
    id: string,
    updates: Partial<Collection>,
  ): Collection | null {
    const index = this.data.collections.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.data.collections[index] = {
      ...this.data.collections[index],
      ...updates,
      updatedAt: new Date(),
    };
    this.save();
    return this.data.collections[index];
  }
  // Удалить коллекцию
  deleteCollection(id: string): boolean {
    const index = this.data.collections.findIndex((c) => c.id === id);
    if (index === -1) return false;
    // Удаляем все слова из коллекции
    this.data.words = this.data.words.filter((w) => w.collectionId !== id);
    // Удаляем коллекцию
    this.data.collections.splice(index, 1);
    this.data.userStats.totalCollections--;
    this.save();
    return true;
  }
  // Получить слова коллекции
  getCollectionWords(collectionId: string): WordInCollection[] {
    return this.data.words.filter((w) => w.collectionId === collectionId);
  }
  // Псевдоним для getCollectionWords для обратной совместимости
  getWordsInCollection(collectionId: string): WordInCollection[] {
    return this.getCollectionWords(collectionId);
  }
  // Добавить слово в коллекцию
  addWordToCollection(
    collectionId: string,
    germanWord: string,
    translation: string,
    examples?: WordExample[],
  ): boolean {
    const collection = this.getCollection(collectionId);
    if (!collection) return false;
    // Проверяем, нет ли уже такого слова в коллекции
    const existingWord = this.data.words.find(
      (w) =>
        w.collectionId === collectionId &&
        w.germanWord.toLowerCase() === germanWord.toLowerCase(),
    );
    if (existingWord) return true; // Слово уже существует, считаем это успехом
    const word: WordInCollection = {
      id: generateId(),
      collectionId,
      germanWord,
      translation,
      level: "new",
      correctCount: 0,
      incorrectCount: 0,
      addedAt: new Date(),
      examples: examples?.map((ex) => ({
        germanSentence: ex.germanSentence || "",
        translation: ex.translation || "",
        level: ex.level || "",
      })),
    };
    this.data.words.push(word);
    // Обновляем статистику коллекции
    this.updateCollectionProgress(collectionId);
    this.save();
    return true;
  }
  // Обновить уровень слова
  updateWordLevel(
    collectionId: string,
    wordId: string,
    newLevel: WordLevel,
    isCorrect = true,
  ): boolean {
    const word = this.data.words.find(
      (w) => w.id === wordId && w.collectionId === collectionId,
    );
    if (!word) return false;
    const oldLevel = word.level;
    word.level = newLevel;
    word.lastReviewed = new Date();
    if (isCorrect) {
      word.correctCount++;
    } else {
      word.incorrectCount++;
    }
    // Вычисляем следующую дату повторения
    const interval = SRS_INTERVALS[newLevel];
    word.nextReview = new Date(Date.now() + interval * 24 * 60 * 60 * 1000);
    // Обновляем статистику
    this.updateCollectionProgress(word.collectionId);
    // Если слово перешло в освоенное впервые, увеличиваем счетчик
    if (oldLevel !== "mastered" && newLevel === "mastered") {
      this.data.userStats.totalWordsLearned++;
    }
    this.save();
    return true;
  }
  // Удалить слово из коллекции
  removeWordFromCollection(collectionId: string, wordId: string): boolean {
    const index = this.data.words.findIndex(
      (w) => w.id === wordId && w.collectionId === collectionId,
    );
    if (index === -1) return false;
    const word = this.data.words[index];
    this.data.words.splice(index, 1);
    // Обновляем статистику коллекции
    this.updateCollectionProgress(word.collectionId);
    this.save();
    return true;
  }
  // Обновить прогресс коллекции
  private updateCollectionProgress(collectionId: string): void {
    const collection = this.getCollection(collectionId);
    if (!collection) return;
    const words = this.getCollectionWords(collectionId);
    const progress: CollectionProgress = {
      total: words.length,
      new: words.filter((w) => w.level === "new").length,
      learning: words.filter((w) => w.level === "learning").length,
      familiar: words.filter((w) => w.level === "familiar").length,
      mastered: words.filter((w) => w.level === "mastered").length,
      percentage:
        words.length > 0
          ? Math.round(
              (words.filter((w) => w.level === "mastered").length /
                words.length) *
                100,
            )
          : 0,
      streakDays: collection.progress.streakDays,
      lastStudied: collection.progress.lastStudied,
    };
    collection.progress = progress;
    collection.wordsCount = words.length;
    collection.updatedAt = new Date();
  }
  // Получить слова для повторения
  getWordsForReview(collectionId?: string): WordInCollection[] {
    const now = new Date();
    const words = this.data.words.filter((word) => {
      if (collectionId && word.collectionId !== collectionId) return false;
      // Новые слова всегда доступны для изучения
      if (word.level === "new") return true;
      // Слова с назначенной датой повторения
      if (word.nextReview && word.nextReview <= now) return true;
      return false;
    });
    // Сортируем: сначала просроченные, потом новые
    return words.sort((a, b) => {
      if (a.nextReview && b.nextReview) {
        return a.nextReview.getTime() - b.nextReview.getTime();
      }
      if (a.level === "new" && b.level !== "new") return 1;
      if (a.level !== "new" && b.level === "new") return -1;
      return 0;
    });
  }
  // Получить статистику пользователя
  getUserStats(): UserStats {
    return this.data.userStats;
  }
  // Экспорт данных
  exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }
  // Импорт данных
  importData(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData) as LocalStorageData;
      // Валидация данных
      if (!imported.collections || !imported.words || !imported.userStats) {
        throw new Error("Неверный формат данных");
      }
      this.data = deserializeDates(imported);
      this.save();
      return true;
    } catch (error) {
      console.error("Ошибка при импорте данных:", error);
      return false;
    }
  }
  // Сохранить данные
  private save(): void {
    saveStorageData(this.data);
  }
}
// Генерация уникального ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
// Глобальный экземпляр менеджера
export const collectionsManager = new CollectionsManager();
