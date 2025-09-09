import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
  onSnapshot,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import type {
  Collection,
  WordInCollection,
  CollectionProgress,
  LocalStorageData,
} from "@/types/collections";
import { collectionsManager, getStorageData, saveStorageData } from "./collections-storage";
import { createLogger } from "./logger";
const logger = createLogger("FirebaseCollectionsManager");
const SYNC_RETRY_DELAY = 3000; // 3 секунды
const MAX_SYNC_RETRIES = 5;
/**
 * Класс для real-time синхронизации коллекций между локальным хранилищем и Firestore
 */
export class FirebaseCollectionsManager {
  private collectionsListener: (() => void) | null = null;
  private wordsListener: (() => void) | null = null;
  private syncQueue: Array<() => Promise<void>> = [];
  private isSyncing = false;
  private syncRetryCount = 0;
  private lastServerUpdate: Date | null = null;
  constructor() {
    this.startSyncProcessor();
  }
  // Обработчик очереди синхронизации для коллекций
  private async startSyncProcessor(): Promise<void> {
    setInterval(async () => {
      if (this.isSyncing || this.syncQueue.length === 0) return;
      this.isSyncing = true;
      try {
        while (this.syncQueue.length > 0) {
          const syncAction = this.syncQueue.shift();
          if (syncAction) {
            await syncAction();
          }
        }
        this.syncRetryCount = 0;
      } catch (error) {
        logger.error("Ошибка при обработке очереди синхронизации коллекций:", error);
        this.syncRetryCount++;
        if (this.syncRetryCount >= MAX_SYNC_RETRIES) {
          logger.error("Превышено максимальное количество попыток синхронизации коллекций");
          this.syncQueue = [];
          this.syncRetryCount = 0;
        }
      } finally {
        this.isSyncing = false;
      }
    }, this.syncRetryCount > 0 ? SYNC_RETRY_DELAY : 1000);
  }
  // Добавление операции в очередь синхронизации
  private addToSyncQueue(syncAction: () => Promise<void>): void {
    this.syncQueue.push(syncAction);
  }
  // Установка real-time слушателей для коллекций
  setupRealtimeListeners(): void {
    const user = auth.currentUser;
    if (!user) return;
    this.setupCollectionsListener(user.uid);
    this.setupWordsListener(user.uid);
  }
  // Real-time слушатель для коллекций
  private setupCollectionsListener(userId: string): void {
    if (this.collectionsListener) {
      this.collectionsListener();
    }
    const collectionsQuery = query(
      collection(db, "collections"),
      where("userId", "==", userId),
      orderBy("updatedAt", "desc")
    );
    this.collectionsListener = onSnapshot(
      collectionsQuery,
      (snapshot) => {
        const serverCollections: Collection[] = [];
        for (const doc of snapshot.docs) {
          const data = doc.data() as Collection;
          serverCollections.push(this.deserializeCollectionDates(data));
        }
        this.mergeCollectionsWithLocal(serverCollections);
      },
      (error) => {
        logger.error("Ошибка real-time синхронизации коллекций:", error);
      }
    );
  }
  // Real-time слушатель для слов
  private setupWordsListener(userId: string): void {
    if (this.wordsListener) {
      this.wordsListener();
    }
    const wordsQuery = query(
      collection(db, "words"),
      where("userId", "==", userId),
      orderBy("addedAt", "desc")
    );
    this.wordsListener = onSnapshot(
      wordsQuery,
      (snapshot) => {
        const serverWords: WordInCollection[] = [];
        for (const doc of snapshot.docs) {
          const data = doc.data() as WordInCollection;
          serverWords.push(this.deserializeWordDates(data));
        }
        this.mergeWordsWithLocal(serverWords);
      },
      (error) => {
        logger.error("Ошибка real-time синхронизации слов:", error);
      }
    );
  }
  // Умное слияние коллекций с локальными данными
  private mergeCollectionsWithLocal(serverCollections: Collection[]): void {
    const localData = getStorageData();
    const mergedCollections = [...serverCollections];
    // Добавляем локальные коллекции, которых нет на сервере
    for (const localCollection of localData.collections) {
      const serverCollection = serverCollections.find(c => c.id === localCollection.id);
      if (!serverCollection) {
        mergedCollections.push(localCollection);
        // Добавляем в очередь для синхронизации с сервером
        this.addToSyncQueue(async () => {
          await this.saveCollectionToFirestore(localCollection);
        });
      }
    }
    // Сохраняем объединенные данные
    const updatedData: LocalStorageData = {
      ...localData,
      collections: mergedCollections,
    };
    saveStorageData(updatedData);
    logger.info(`Синхронизировано ${mergedCollections.length} коллекций`);
  }
  // Умное слияние слов с локальными данными
  private mergeWordsWithLocal(serverWords: WordInCollection[]): void {
    const localData = getStorageData();
    const mergedWords = [...serverWords];
    // Добавляем локальные слова, которых нет на сервере
    for (const localWord of localData.words) {
      const serverWord = serverWords.find(w => w.id === localWord.id);
      if (!serverWord) {
        mergedWords.push(localWord);
        // Добавляем в очередь для синхронизации с сервером
        this.addToSyncQueue(async () => {
          await this.saveCollectionWords(localWord.collectionId, [localWord]);
        });
      } else {
        // Слияние прогресса слова (берем лучший результат)
        const mergedWord = this.mergeWordProgress(localWord, serverWord);
        const wordIndex = mergedWords.findIndex(w => w.id === localWord.id);
        if (wordIndex !== -1) {
          mergedWords[wordIndex] = mergedWord;
        }
      }
    }
    // Сохраняем объединенные данные
    const updatedData: LocalStorageData = {
      ...localData,
      words: mergedWords,
    };
    saveStorageData(updatedData);
    logger.info(`Синхронизировано ${mergedWords.length} слов`);
  }
  // Слияние прогресса изучения слова
  private mergeWordProgress(local: WordInCollection, server: WordInCollection): WordInCollection {
    return {
      ...server,
      // Берем лучший уровень
      level: this.getBetterWordLevel(local.level, server.level),
      // Суммируем правильные и неправильные ответы
      correctCount: Math.max(local.correctCount, server.correctCount),
      incorrectCount: Math.max(local.incorrectCount, server.incorrectCount),
      // Берем более позднюю дату последнего повторения
      lastReviewed: local.lastReviewed && server.lastReviewed
        ? (local.lastReviewed > server.lastReviewed ? local.lastReviewed : server.lastReviewed)
        : (local.lastReviewed || server.lastReviewed),
      // Берем более раннюю дату следующего повторения
      nextReview: local.nextReview && server.nextReview
        ? (local.nextReview < server.nextReview ? local.nextReview : server.nextReview)
        : (local.nextReview || server.nextReview),
    };
  }
  // Определение лучшего уровня изучения слова
  private getBetterWordLevel(level1: string, level2: string): string {
    const levels = ["new", "learning", "familiar", "mastered"];
    const index1 = levels.indexOf(level1);
    const index2 = levels.indexOf(level2);
    return index1 > index2 ? level1 : level2;
  }
  // Десериализация дат для коллекции
  private deserializeCollectionDates(data: Record<string, unknown>): Collection {
    return {
      ...data,
      createdAt: data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : new Date(data.createdAt || Date.now()),
      updatedAt: data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate()
        : new Date(data.updatedAt || Date.now()),
      progress: {
        ...data.progress,
        lastStudied: data.progress.lastStudied
          ? (data.progress.lastStudied instanceof Timestamp
              ? data.progress.lastStudied.toDate()
              : new Date(data.progress.lastStudied))
          : undefined,
      },
    };
  }
  // Десериализация дат для слова
  private deserializeWordDates(data: Record<string, unknown>): WordInCollection {
    return {
      ...data,
      addedAt: data.addedAt instanceof Timestamp
        ? data.addedAt.toDate()
        : new Date(data.addedAt || Date.now()),
      lastReviewed: data.lastReviewed
        ? (data.lastReviewed instanceof Timestamp
            ? data.lastReviewed.toDate()
            : new Date(data.lastReviewed))
        : undefined,
      nextReview: data.nextReview
        ? (data.nextReview instanceof Timestamp
            ? data.nextReview.toDate()
            : new Date(data.nextReview))
        : undefined,
    };
  }
  // Остановка всех слушателей
  stopRealtimeListeners(): void {
    if (this.collectionsListener) {
      this.collectionsListener();
      this.collectionsListener = null;
    }
    if (this.wordsListener) {
      this.wordsListener();
      this.wordsListener = null;
    }
    // Очищаем очередь синхронизации
    this.syncQueue = [];
    this.isSyncing = false;
  }
  /**
   * Сохраняет коллекцию в Firestore
   */
  async saveCollectionToFirestore(collection: Collection): Promise<boolean> {
    try {
      const user = auth.currentUser;
      if (!user) return false;
      // Добавляем userId к данным коллекции
      const collectionData = {
        ...collection,
        userId: user.uid,
        createdAt: collection.createdAt,
        updatedAt: new Date(),
        progress: {
          ...collection.progress,
          lastStudied: collection.progress.lastStudied || null,
        },
      };
      // Сохраняем коллекцию в Firestore
      await setDoc(doc(db, "collections", collection.id), collectionData);
      return true;
    } catch (error) {
      console.error("Ошибка при сохранении коллекции в Firestore:", error);
      return false;
    }
  }
  /**
   * Сохраняет слова коллекции в Firestore
   */
  async saveCollectionWords(
    collectionId: string,
    words: WordInCollection[],
  ): Promise<boolean> {
    try {
      const user = auth.currentUser;
      if (!user) return false;
      const batch = writeBatch(db);
      // Добавляем все слова в пакетной операции
      for (const word of words) {
        const wordData = {
          ...word,
          userId: user.uid,
          collectionId,
          addedAt: word.addedAt,
          lastReviewed: word.lastReviewed || null,
          nextReview: word.nextReview || null,
        };
        batch.set(doc(db, "words", word.id), wordData);
      }
      // Выполняем пакетную операцию
      await batch.commit();
      return true;
    } catch (error) {
      console.error("Ошибка при сохранении слов в Firestore:", error);
      return false;
    }
  }
  /**
   * Загружает коллекции пользователя из Firestore
   */
  async loadUserCollections(): Promise<Collection[]> {
    try {
      const user = auth.currentUser;
      if (!user) return [];
      const collectionsQuery = query(
        collection(db, "collections"),
        where("userId", "==", user.uid),
      );
      const querySnapshot = await getDocs(collectionsQuery);
      const collections: Collection[] = [];
      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data() as Collection;
        // Преобразуем timestamps обратно в объекты Date
        const collection = {
          ...data,
          createdAt:
            data.createdAt instanceof Date
              ? data.createdAt
              : (data.createdAt as Timestamp)?.toDate?.() || new Date(),
          updatedAt:
            data.updatedAt instanceof Date
              ? data.updatedAt
              : (data.updatedAt as Timestamp)?.toDate?.() || new Date(),
          progress: {
            ...data.progress,
            lastStudied: data.progress.lastStudied
              ? data.progress.lastStudied instanceof Date
                ? data.progress.lastStudied
                : (data.progress.lastStudied as Timestamp)?.toDate?.() || new Date()
              : undefined,
          },
        };
        collections.push(collection);
      }
      return collections;
    } catch (error) {
      console.error("Ошибка при загрузке коллекций из Firestore:", error);
      return [];
    }
  }
  /**
   * Загружает слова коллекции из Firestore
   */
  async loadCollectionWords(collectionId: string): Promise<WordInCollection[]> {
    try {
      const user = auth.currentUser;
      if (!user) return [];
      const wordsQuery = query(
        collection(db, "words"),
        where("userId", "==", user.uid),
        where("collectionId", "==", collectionId),
      );
      const querySnapshot = await getDocs(wordsQuery);
      const words: WordInCollection[] = [];
      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data() as WordInCollection;
        // Преобразуем timestamps обратно в объекты Date
        const word = {
          ...data,
          addedAt:
            data.addedAt instanceof Date ? data.addedAt : (data.addedAt as Timestamp)?.toDate?.() || new Date(),
          lastReviewed: data.lastReviewed
            ? data.lastReviewed instanceof Date
              ? data.lastReviewed
              : (data.lastReviewed as Timestamp)?.toDate?.() || new Date()
            : undefined,
          nextReview: data.nextReview
            ? data.nextReview instanceof Date
              ? data.nextReview
              : (data.nextReview as Timestamp)?.toDate?.() || new Date()
            : undefined,
        };
        words.push(word);
      }
      return words;
    } catch (error) {
      console.error("Ошибка при загрузке слов из Firestore:", error);
      return [];
    }
  }
  /**
   * Удаляет коллекцию из Firestore
   */
  async deleteCollection(collectionId: string): Promise<boolean> {
    try {
      const user = auth.currentUser;
      if (!user) return false;
      // Удаляем все слова коллекции
      const wordsQuery = query(
        collection(db, "words"),
        where("userId", "==", user.uid),
        where("collectionId", "==", collectionId),
      );
      const querySnapshot = await getDocs(wordsQuery);
      const batch = writeBatch(db);
      for (const docSnapshot of querySnapshot.docs) {
        batch.delete(docSnapshot.ref);
      }
      // Удаляем саму коллекцию
      batch.delete(doc(db, "collections", collectionId));
      // Выполняем пакетную операцию
      await batch.commit();
      return true;
    } catch (error) {
      console.error("Ошибка при удалении коллекции из Firestore:", error);
      return false;
    }
  }
  /**
   * Синхронизирует локальные коллекции с Firestore
   */
  async syncCollectionsToFirestore(): Promise<boolean> {
    try {
      const user = auth.currentUser;
      if (!user) return false;
      // Получаем локальные коллекции
      const localData = getStorageData();
      // Сохраняем каждую коллекцию и ее слова
      for (const collection of localData.collections) {
        await this.saveCollectionToFirestore(collection);
        const words = localData.words.filter(
          (word) => word.collectionId === collection.id,
        );
        await this.saveCollectionWords(collection.id, words);
      }
      return true;
    } catch (error) {
      console.error("Ошибка при синхронизации коллекций с Firestore:", error);
      return false;
    }
  }
  /**
   * Синхронизирует коллекции из Firestore в локальное хранилище
   */
  async syncCollectionsFromFirestore(): Promise<boolean> {
    try {
      const user = auth.currentUser;
      if (!user) return false;
      // Загружаем коллекции из Firestore
      const collections = await this.loadUserCollections();
      // Загружаем слова для каждой коллекции
      let allWords: WordInCollection[] = [];
      for (const collection of collections) {
        const words = await this.loadCollectionWords(collection.id);
        allWords = [...allWords, ...words];
      }
      // Получаем текущие локальные данные
      const localData = getStorageData();
      // Обновляем локальные данные с данными из Firestore
      // При конфликтах приоритет отдается данным из Firestore
      const mergedData: LocalStorageData = {
        ...localData,
        collections: collections,
        words: allWords,
        version: localData.version,
      };
      // Сохраняем объединенные данные в локальное хранилище
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "talkify_collections_data",
          JSON.stringify(mergedData),
        );
      }
      return true;
    } catch (error) {
      console.error("Ошибка при синхронизации коллекций из Firestore:", error);
      return false;
    }
  }
}
// Глобальный экземпляр менеджера Firebase коллекций
export const firebaseCollectionsManager = new FirebaseCollectionsManager();
