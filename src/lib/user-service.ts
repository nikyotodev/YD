import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  EmailAuthProvider,
  reauthenticateWithCredential,
  getIdToken,
  getIdTokenResult,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  increment,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { firebaseCollectionsManager } from "./firebase-collections";
import { createLogger } from "./logger";
import type {
  User,
  UserGamification,
  UserGoals,
  StudySession,
  AchievementType,
  Badge,
  UserRank,
  LocalUserData,
} from "@/types/user";
import {
  XP_REWARDS,
  LEVEL_REQUIREMENTS,
  ACHIEVEMENT_DEFINITIONS,
} from "@/types/user";
const USER_STORAGE_KEY = "yourdeutsch_user_data";
const USER_VERSION = "1.0.0";
const SYNC_RETRY_DELAY = 5000; // 5 секунд
const MAX_SYNC_RETRIES = 3;
const logger = createLogger("UserService");
// Получение ранга по XP
function calculateRank(totalXP: number): UserRank {
  if (totalXP >= 25000) return "grandmaster";
  if (totalXP >= 10000) return "master";
  if (totalXP >= 4000) return "expert";
  if (totalXP >= 1500) return "scholar";
  if (totalXP >= 500) return "student";
  if (totalXP >= 100) return "apprentice";
  return "novice";
}
// Вычисление уровня и XP
function calculateLevel(totalXP: number): {
  level: number;
  currentLevelXP: number;
  xpToNextLevel: number;
} {
  let level = 1;
  let currentLevelXP = totalXP;
  // Находим текущий уровень
  for (const [lvl, requirement] of Object.entries(LEVEL_REQUIREMENTS)) {
    if (totalXP >= requirement) {
      level = Number.parseInt(lvl);
    } else {
      break;
    }
  }
  // Вычисляем XP для текущего уровня
  const currentLevelRequirement =
    LEVEL_REQUIREMENTS[level as keyof typeof LEVEL_REQUIREMENTS] || 0;
  currentLevelXP = totalXP - currentLevelRequirement;
  // Вычисляем XP до следующего уровня
  let nextLevelRequirement: number;
  if (level >= 10) {
    // Формула для уровней выше 10: предыдущий + (level * 100)
    nextLevelRequirement = currentLevelRequirement + (level + 1) * 100;
  } else {
    const nextLevel = (level + 1) as keyof typeof LEVEL_REQUIREMENTS;
    nextLevelRequirement =
      LEVEL_REQUIREMENTS[nextLevel] || currentLevelRequirement + 1000;
  }
  const xpToNextLevel = nextLevelRequirement - totalXP;
  return { level, currentLevelXP, xpToNextLevel };
}
// Создание пользователя по умолчанию
function createDefaultUser(firebaseUser: FirebaseUser): User {
  const now = new Date();
  const user: User = {
    id: firebaseUser.uid,
    email: firebaseUser.email || "",
    name:
      firebaseUser.displayName ||
      firebaseUser.email?.split("@")[0] ||
      "Пользователь",
    createdAt: now,
    lastActiveAt: now,
    emailVerified: firebaseUser.emailVerified,
    preferences: {
      language: "ru",
      theme: "system",
      pronunciationSpeed: 0.8,
      dailyReminderEnabled: true,
      reminderTime: "19:00",
      weeklyGoalReminders: true,
    },
    gamification: {
      level: 1,
      totalXP: 0,
      currentLevelXP: 0,
      xpToNextLevel: 100,
      streak: {
        current: 0,
        longest: 0,
        freezeUsed: 0,
        freezeAvailable: 2,
      },
      badges: [],
      totalStudyTime: 0,
      totalWordsLearned: 0,
      totalCollections: 0,
      rank: "novice",
    },
    goals: {
      daily: {
        targetWords: 10,
        targetMinutes: 15,
        completed: false,
        progress: { words: 0, minutes: 0 },
        lastResetDate: now,
      },
      weekly: {
        targetWords: 50,
        targetDays: 5,
        completed: false,
        progress: { words: 0, daysStudied: 0 },
        lastResetDate: now,
      },
      monthly: {
        targetWords: 200,
        targetCollections: 3,
        completed: false,
        progress: { words: 0, collections: 0 },
        lastResetDate: now,
      },
      custom: [],
    },
    achievements: [],
  };
  // Добавляем avatar только если он существует (избегаем undefined в Firebase)
  if (firebaseUser.photoURL) {
    user.avatar = firebaseUser.photoURL;
  }
  return user;
}
export class UserService {
  private currentUser: User | null = null;
  private authUnsubscribe: (() => void) | null = null;
  private userDocUnsubscribe: (() => void) | null = null;
  private idToken: string | null = null;
  private tokenExpiryTime: number | null = null;
  private tokenRefreshInterval: NodeJS.Timeout | null = null;
  private emailVerificationInterval: NodeJS.Timeout | null = null;
  private authStateChangeCallbacks: (() => void)[] = [];
  private syncQueue: Array<() => Promise<void>> = [];
  private isSyncing = false;
  private syncRetryCount = 0;
  private lastServerUpdate: Date | null = null;
  constructor() {
    this.initializeAuth();
    this.startSyncProcessor();
  }
  // Обработчик очереди синхронизации
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
        logger.error("Ошибка при обработке очереди синхронизации:", error);
        this.syncRetryCount++;
        // Если превышено количество попыток, очищаем очередь
        if (this.syncRetryCount >= MAX_SYNC_RETRIES) {
          logger.error("Превышено максимальное количество попыток синхронизации");
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
  // Подготавливает данные пользователя для сохранения в Firestore, исключая undefined значения
  private prepareUserDataForFirestore(user: User): Partial<User> {
    const firestoreData: Partial<User> = {};
    for (const [key, value] of Object.entries(user)) {
      if (value !== undefined) {
        // @ts-ignore - необходимо для динамического присвоения ключей
        firestoreData[key as keyof User] = value;
      }
    }
    return firestoreData;
  }
  // Установка real-time слушателя для пользователя
  private setupUserDocListener(userId: string): void {
    // Отписываемся от предыдущего слушателя
    if (this.userDocUnsubscribe) {
      this.userDocUnsubscribe();
    }
    this.userDocUnsubscribe = onSnapshot(
      doc(db, "users", userId),
      (docSnapshot) => {
        if (!docSnapshot.exists()) return;
        const serverData = docSnapshot.data() as User;
        const serverUpdateTime = serverData.lastActiveAt instanceof Timestamp
          ? serverData.lastActiveAt.toDate()
          : new Date(serverData.lastActiveAt || Date.now());
        // Проверяем, нужно ли обновлять локальные данные
        if (!this.lastServerUpdate || serverUpdateTime > this.lastServerUpdate) {
          this.mergeServerDataWithLocal(serverData);
          this.lastServerUpdate = serverUpdateTime;
          this.saveToLocalStorage();
          this.notifyAuthStateChangeCallbacks();
        }
      },
      (error) => {
        logger.error("Ошибка real-time синхронизации пользователя:", error);
      }
    );
  }
  // Умное слияние данных с сервера с локальными данными
  private mergeServerDataWithLocal(serverData: User): void {
    if (!this.currentUser) {
      this.currentUser = this.deserializeUserDates(serverData);
      return;
    }
    const localUser = this.currentUser;
    const serverUser = this.deserializeUserDates(serverData);
    // Приоритет отдается более свежим данным
    const mergedUser: User = {
      ...serverUser, // Базовые данные с сервера
      // Локальные изменения имеют приоритет, если они свежее
      gamification: this.mergeGamificationData(localUser.gamification, serverUser.gamification),
      goals: this.mergeGoalsData(localUser.goals, serverUser.goals),
      achievements: this.mergeAchievements(localUser.achievements, serverUser.achievements),
      preferences: {
        ...serverUser.preferences,
        // Локальные настройки имеют приоритет
        ...localUser.preferences,
      },
    };
    this.currentUser = mergedUser;
  }
  // Слияние данных геймификации
  private mergeGamificationData(local: UserGamification, server: UserGamification): UserGamification {
    return {
      ...server,
      // Берем максимальные значения для прогресса
      totalXP: Math.max(local.totalXP, server.totalXP),
      totalWordsLearned: Math.max(local.totalWordsLearned, server.totalWordsLearned),
      totalCollections: Math.max(local.totalCollections, server.totalCollections),
      totalStudyTime: Math.max(local.totalStudyTime, server.totalStudyTime),
      streak: {
        current: Math.max(local.streak.current, server.streak.current),
        longest: Math.max(local.streak.longest, server.streak.longest),
        lastStudyDate: local.streak.lastStudyDate && server.streak.lastStudyDate
          ? (local.streak.lastStudyDate > server.streak.lastStudyDate ? local.streak.lastStudyDate : server.streak.lastStudyDate)
          : (local.streak.lastStudyDate || server.streak.lastStudyDate),
        freezeUsed: Math.max(local.streak.freezeUsed, server.streak.freezeUsed),
        freezeAvailable: Math.max(local.streak.freezeAvailable, server.streak.freezeAvailable),
      },
      // Пересчитываем уровень на основе суммарного XP
      ...calculateLevel(Math.max(local.totalXP, server.totalXP)),
      rank: calculateRank(Math.max(local.totalXP, server.totalXP)),
    };
  }
  // Слияние данных целей
  private mergeGoalsData(local: UserGoals, server: UserGoals): UserGoals {
    return {
      daily: {
        ...server.daily,
        progress: {
          words: Math.max(local.daily.progress.words, server.daily.progress.words),
          minutes: Math.max(local.daily.progress.minutes, server.daily.progress.minutes),
        },
        completed: local.daily.completed || server.daily.completed,
      },
      weekly: {
        ...server.weekly,
        progress: {
          words: Math.max(local.weekly.progress.words, server.weekly.progress.words),
          daysStudied: Math.max(local.weekly.progress.daysStudied, server.weekly.progress.daysStudied),
        },
        completed: local.weekly.completed || server.weekly.completed,
      },
      monthly: {
        ...server.monthly,
        progress: {
          words: Math.max(local.monthly.progress.words, server.monthly.progress.words),
          collections: Math.max(local.monthly.progress.collections, server.monthly.progress.collections),
        },
        completed: local.monthly.completed || server.monthly.completed,
      },
      custom: [...local.custom, ...server.custom].filter(
        (goal, index, arr) => arr.findIndex(g => g.id === goal.id) === index
      ),
    };
  }
  // Слияние достижений
  private mergeAchievements(local: Achievement[], server: Achievement[]): Achievement[] {
    const merged = [...local, ...server];
    return merged.filter((achievement, index, arr) =>
      arr.findIndex(a => a.type === achievement.type) === index
    );
  }
  // Десериализация дат для пользователя
  private deserializeUserDates(userData: Record<string, unknown>): User {
    return {
      ...userData,
      createdAt: userData.createdAt instanceof Timestamp
        ? userData.createdAt.toDate()
        : new Date(userData.createdAt || Date.now()),
      lastActiveAt: userData.lastActiveAt instanceof Timestamp
        ? userData.lastActiveAt.toDate()
        : new Date(userData.lastActiveAt || Date.now()),
      gamification: {
        ...userData.gamification,
        streak: {
          ...userData.gamification.streak,
          lastStudyDate: userData.gamification.streak.lastStudyDate
            ? (userData.gamification.streak.lastStudyDate instanceof Timestamp
                ? userData.gamification.streak.lastStudyDate.toDate()
                : new Date(userData.gamification.streak.lastStudyDate))
            : undefined,
        },
      },
      goals: {
        daily: {
          ...userData.goals.daily,
          lastResetDate: userData.goals.daily.lastResetDate instanceof Timestamp
            ? userData.goals.daily.lastResetDate.toDate()
            : new Date(userData.goals.daily.lastResetDate || Date.now()),
        },
        weekly: {
          ...userData.goals.weekly,
          lastResetDate: userData.goals.weekly.lastResetDate instanceof Timestamp
            ? userData.goals.weekly.lastResetDate.toDate()
            : new Date(userData.goals.weekly.lastResetDate || Date.now()),
        },
        monthly: {
          ...userData.goals.monthly,
          lastResetDate: userData.goals.monthly.lastResetDate instanceof Timestamp
            ? userData.goals.monthly.lastResetDate.toDate()
            : new Date(userData.goals.monthly.lastResetDate || Date.now()),
        },
        custom: (userData.goals as Record<string, unknown>).custom.map((goal: Record<string, unknown>) => ({
          ...goal,
          createdAt: goal.createdAt instanceof Timestamp
            ? goal.createdAt.toDate()
            : new Date(goal.createdAt || Date.now()),
          deadline: goal.deadline
            ? (goal.deadline instanceof Timestamp
                ? goal.deadline.toDate()
                : new Date(goal.deadline))
            : undefined,
        })),
      },
      achievements: (userData.achievements as Record<string, unknown>[]).map((achievement: Record<string, unknown>) => ({
        ...achievement,
        unlockedAt: achievement.unlockedAt instanceof Timestamp
          ? achievement.unlockedAt.toDate()
          : new Date(achievement.unlockedAt || Date.now()),
      })),
    };
  }
  // Инициализация слушателя авторизации
  private initializeAuth() {
    // Проверяем что мы на клиенте и auth инициализирован
    if (typeof window === 'undefined' || !auth) {
      return;
    }
    this.authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Получаем токен идентификации
        await this.refreshIdToken(firebaseUser);
        // Загружаем данные пользователя
        await this.loadUser(firebaseUser);
        // Запускаем интервал для обновления токена
        this.startTokenRefreshInterval();
        // Запускаем интервал для проверки верификации email
        if (!firebaseUser.emailVerified) {
          this.startEmailVerificationCheck();
        }
        // Синхронизируем коллекции из Firestore в локальное хранилище
        await firebaseCollectionsManager.syncCollectionsFromFirestore();
        // Устанавливаем real-time слушатель для пользователя
        this.setupUserDocListener(firebaseUser.uid);
      } else {
        this.currentUser = null;
        this.idToken = null;
        this.tokenExpiryTime = null;
        this.clearLocalStorage();
        this.stopTokenRefreshInterval();
        this.stopEmailVerificationCheck();
      }
      // Вызываем все колбэки изменения состояния аутентификации
      this.notifyAuthStateChangeCallbacks();
    });
  }
  // Обновление токена
  private async refreshIdToken(firebaseUser: FirebaseUser): Promise<void> {
    try {
      const token = await getIdToken(firebaseUser, true);
      const tokenResult = await getIdTokenResult(firebaseUser);
      this.idToken = token;
      // Устанавливаем время истечения токена (за 5 минут до фактического истечения)
      const expirationTime = new Date(tokenResult.expirationTime).getTime();
      this.tokenExpiryTime = expirationTime - 5 * 60 * 1000; // 5 минут запаса
    } catch (error) {
      logger.error("Ошибка при обновлении токена:", error);
    }
  }
  // Запуск интервала обновления токена
  private startTokenRefreshInterval(): void {
    // Сначала очищаем существующий интервал
    this.stopTokenRefreshInterval();
    // Создаем новый интервал, который проверяет необходимость обновления токена каждую минуту
    this.tokenRefreshInterval = setInterval(async () => {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        this.stopTokenRefreshInterval();
        return;
      }
      const now = Date.now();
      if (!this.tokenExpiryTime || now >= this.tokenExpiryTime) {
        await this.refreshIdToken(firebaseUser);
      }
    }, 60 * 1000); // Каждую минуту
  }
  // Остановка интервала обновления токена
  private stopTokenRefreshInterval(): void {
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
      this.tokenRefreshInterval = null;
    }
  }
  // Запуск интервала проверки верификации email
  private startEmailVerificationCheck(): void {
    // Сначала очищаем существующий интервал
    this.stopEmailVerificationCheck();
    // Создаем новый интервал, который проверяет статус верификации email каждые 5 минут
    this.emailVerificationInterval = setInterval(
      async () => {
        await this.checkEmailVerification();
      },
      5 * 60 * 1000,
    ); // Каждые 5 минут
  }
  // Остановка интервала проверки верификации email
  private stopEmailVerificationCheck(): void {
    if (this.emailVerificationInterval) {
      clearInterval(this.emailVerificationInterval);
      this.emailVerificationInterval = null;
    }
  }
  // Добавление колбэка изменения состояния аутентификации
  addAuthStateChangeCallback(callback: () => void): () => void {
    this.authStateChangeCallbacks.push(callback);
    return () => {
      this.authStateChangeCallbacks = this.authStateChangeCallbacks.filter(
        (cb) => cb !== callback,
      );
    };
  }
  // Уведомление о изменении состояния аутентификации
  private notifyAuthStateChangeCallbacks(): void {
    for (const callback of this.authStateChangeCallbacks) {
      try {
        callback();
      } catch (error) {
        logger.error(
          "Ошибка в колбэке изменения состояния аутентификации:",
          error,
        );
      }
    }
  }
  // Получение текущего ID токена
  getIdToken(): string | null {
    return this.idToken;
  }
  // Проверка, истек ли токен
  isTokenExpired(): boolean {
    return !this.tokenExpiryTime || Date.now() >= this.tokenExpiryTime;
  }
  // Проверка и обновление токена авторизации
  async checkAndRefreshToken(): Promise<boolean> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return false;
    if (this.isTokenExpired()) {
      try {
        await this.refreshIdToken(firebaseUser);
        return true;
      } catch (error) {
        logger.error("Ошибка при обновлении токена:", error);
        return false;
      }
    }
    return true;
  }
  // Регистрация нового пользователя
  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    // Валидация входящих данных
    if (!email?.trim()) {
      return { success: false, error: "Email обязателен" };
    }
    if (!password?.trim() || password.length < 6) {
      return {
        success: false,
        error: "Пароль должен содержать минимум 6 символов",
      };
    }
    if (!name?.trim() || name.length < 2) {
      return {
        success: false,
        error: "Имя должно содержать минимум 2 символа",
      };
    }
    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return { success: false, error: "Неверный формат email" };
    }
    try {
      // Нормализуем данные
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedName = name.trim();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        password,
      );
      const firebaseUser = userCredential.user;
      // Обновляем профиль с именем
      await updateProfile(firebaseUser, { displayName: normalizedName });
      // Отправляем письмо для верификации email
      await sendEmailVerification(firebaseUser);
      // Создаем пользователя в Firestore
      const user = createDefaultUser(firebaseUser);
      user.name = normalizedName;
      // Подготавливаем данные для сохранения, исключая undefined значения
      const userDataForFirestore = this.prepareUserDataForFirestore(user);
      await setDoc(doc(db, "users", firebaseUser.uid), {
        ...userDataForFirestore,
        createdAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
      });
      // Получаем токен идентификации
      await this.refreshIdToken(firebaseUser);
      this.currentUser = user;
      this.saveToLocalStorage();
      // Запускаем интервал для проверки верификации email
      this.startEmailVerificationCheck();
      return { success: true, user };
    } catch (error) {
      logger.error("Ошибка регистрации:", error);
      const firebaseError = error as { code?: string };
      return {
        success: false,
        error: this.getErrorMessage(firebaseError.code || "unknown-error"),
      };
    }
  }
  // Вход пользователя
  async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await this.loadUser(userCredential.user);
      if (!this.currentUser) {
        return { success: false, error: "Пользователь не найден после входа" };
      }
      return { success: true, user: this.currentUser };
    } catch (error) {
      logger.error("Ошибка входа:", error);
      const firebaseError = error as { code?: string };
      return {
        success: false,
        error: this.getErrorMessage(firebaseError.code || "unknown-error"),
      };
    }
  }
  // Повторная отправка письма для верификации email
  async resendVerificationEmail(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        return { success: false, error: "Пользователь не авторизован" };
      }
      await sendEmailVerification(firebaseUser);
      return { success: true };
    } catch (error) {
      logger.error("Ошибка отправки письма верификации:", error);
      const firebaseError = error as { code?: string };
      return {
        success: false,
        error: this.getErrorMessage(firebaseError.code || "unknown-error"),
      };
    }
  }
  // Проверка статуса верификации email
  async checkEmailVerification(): Promise<boolean> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return false;
      // Перезагружаем пользователя, чтобы получить актуальный статус
      await firebaseUser.reload();
      if (firebaseUser.emailVerified) {
        // Обновляем пользователя в нашем сервисе
        if (this.currentUser) {
          this.currentUser.emailVerified = true;
          await this.updateUserInFirestore();
          this.saveToLocalStorage();
          // Останавливаем проверку верификации email
          this.stopEmailVerificationCheck();
        }
        return true;
      }
      return false;
    } catch (error) {
      logger.error("Ошибка проверки верификации email:", error);
      return false;
    }
  }
  // Выход пользователя
  async logout(): Promise<void> {
    try {
      // Перед выходом, сохраняем коллекции в Firestore
      if (this.isAuthenticated()) {
        await firebaseCollectionsManager.syncCollectionsToFirestore();
      }
      await signOut(auth);
      this.currentUser = null;
      this.idToken = null;
      this.tokenExpiryTime = null;
      this.clearLocalStorage();
      this.stopTokenRefreshInterval();
      this.stopEmailVerificationCheck();
    } catch (error) {
      logger.error("Ошибка выхода:", error);
    }
  }
  // Сброс пароля
  async resetPassword(
    email: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      logger.error("Ошибка сброса пароля:", error);
      const firebaseError = error as { code?: string };
      return {
        success: false,
        error: this.getErrorMessage(firebaseError.code || "unknown-error"),
      };
    }
  }
  // Загрузка пользователя из Firestore
  private async loadUser(firebaseUser: FirebaseUser): Promise<void> {
    try {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        this.currentUser = {
          ...userData,
          emailVerified: firebaseUser.emailVerified, // Всегда используем актуальные данные из Firebase Auth
          createdAt: userData.createdAt?.toDate() || new Date(),
          lastActiveAt: userData.lastActiveAt?.toDate() || new Date(),
        } as User;
      } else {
        // Создаем нового пользователя, если его нет в Firestore
        this.currentUser = createDefaultUser(firebaseUser);
        // Подготавливаем данные для сохранения, исключая undefined значения
        const userDataForFirestore = this.prepareUserDataForFirestore(
          this.currentUser,
        );
        await setDoc(doc(db, "users", firebaseUser.uid), {
          ...userDataForFirestore,
          createdAt: serverTimestamp(),
          lastActiveAt: serverTimestamp(),
        });
      }
      // Обновляем последнюю активность
      await this.updateLastActive();
      this.saveToLocalStorage();
    } catch (error) {
      logger.error("Ошибка загрузки пользователя:", error);
      this.currentUser = createDefaultUser(firebaseUser);
      this.saveToLocalStorage();
    }
  }
  // Получение текущего пользователя
  getCurrentUser(): User | null {
    return this.currentUser;
  }
  // Проверка авторизации
  isAuthenticated(): boolean {
    return this.currentUser !== null && auth.currentUser !== null;
  }
  // Проверка верификации email
  isEmailVerified(): boolean {
    return this.currentUser?.emailVerified || false;
  }
  // Добавление XP и проверка достижений
  async addXP(amount: number, reason?: string): Promise<AchievementType[]> {
    if (!this.currentUser) return [];
    const newAchievements: AchievementType[] = [];
    const oldLevel = this.currentUser.gamification.level;
    // Обновляем XP
    this.currentUser.gamification.totalXP += amount;
    // Пересчитываем уровень
    const { level, currentLevelXP, xpToNextLevel } = calculateLevel(
      this.currentUser.gamification.totalXP,
    );
    this.currentUser.gamification.level = level;
    this.currentUser.gamification.currentLevelXP = currentLevelXP;
    this.currentUser.gamification.xpToNextLevel = xpToNextLevel;
    this.currentUser.gamification.rank = calculateRank(
      this.currentUser.gamification.totalXP,
    );
    // Проверяем достижения за уровень
    if (level > oldLevel) {
      if (level === 5) newAchievements.push("level_5");
      if (level === 10) newAchievements.push("level_10");
      if (level === 25) newAchievements.push("level_25");
      if (level === 50) newAchievements.push("level_50");
    }
    // Сохраняем локально сразу
    this.saveToLocalStorage();
    // Добавляем в очередь синхронизации
    this.addToSyncQueue(async () => {
      await this.updateUserInFirestore();
    });
    return newAchievements;
  }
  // Обновление прогресса изучения слов
  async updateWordProgress(wordsLearned: number): Promise<AchievementType[]> {
    if (!this.currentUser) return [];
    const newAchievements: AchievementType[] = [];
    const oldTotal = this.currentUser.gamification.totalWordsLearned;
    this.currentUser.gamification.totalWordsLearned += wordsLearned;
    // Обновляем цели
    this.currentUser.goals.daily.progress.words += wordsLearned;
    this.currentUser.goals.weekly.progress.words += wordsLearned;
    this.currentUser.goals.monthly.progress.words += wordsLearned;
    // Проверяем выполнение целей
    await this.checkGoalCompletion();
    // Проверяем достижения
    const total = this.currentUser.gamification.totalWordsLearned;
    if (oldTotal < 1 && total >= 1) newAchievements.push("first_word");
    if (oldTotal < 10 && total >= 10) newAchievements.push("words_10");
    if (oldTotal < 50 && total >= 50) newAchievements.push("words_50");
    if (oldTotal < 100 && total >= 100) newAchievements.push("words_100");
    if (oldTotal < 500 && total >= 500) newAchievements.push("words_500");
    if (oldTotal < 1000 && total >= 1000) newAchievements.push("words_1000");
    // Добавляем XP за изученные слова
    const xpEarned = wordsLearned * XP_REWARDS.WORD_CORRECT;
    const levelAchievements = await this.addXP(xpEarned, "words_learned");
    newAchievements.push(...levelAchievements);
    // Сохраняем достижения
    await this.unlockAchievements(newAchievements);
    return newAchievements;
  }
  // Обновление стрика
  async updateStreak(): Promise<AchievementType[]> {
    if (!this.currentUser) return [];
    const newAchievements: AchievementType[] = [];
    const today = new Date().toDateString();
    const lastStudyDate =
      this.currentUser.gamification.streak.lastStudyDate?.toDateString();
    if (lastStudyDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastStudyDate === yesterday.toDateString()) {
        // Продолжаем стрик
        this.currentUser.gamification.streak.current++;
      } else if (!lastStudyDate) {
        // Первый день
        this.currentUser.gamification.streak.current = 1;
      } else {
        // Стрик сломан
        this.currentUser.gamification.streak.current = 1;
      }
      // Обновляем самый длинный стрик
      if (
        this.currentUser.gamification.streak.current >
        this.currentUser.gamification.streak.longest
      ) {
        this.currentUser.gamification.streak.longest =
          this.currentUser.gamification.streak.current;
      }
      // Обновляем дату последнего изучения
      this.currentUser.gamification.streak.lastStudyDate = new Date();
      // Проверяем достижения за стрик
      const streak = this.currentUser.gamification.streak.current;
      if (streak === 3) newAchievements.push("streak_3");
      if (streak === 7) newAchievements.push("streak_7");
      if (streak === 14) newAchievements.push("streak_14");
      if (streak === 30) newAchievements.push("streak_30");
      if (streak === 100) newAchievements.push("streak_100");
      // Добавляем XP за стрик
      const xpEarned = XP_REWARDS.STREAK_BONUS * streak;
      const levelAchievements = await this.addXP(xpEarned, "streak_bonus");
      newAchievements.push(...levelAchievements);
      await this.unlockAchievements(newAchievements);
    }
    return newAchievements;
  }
  // Разблокировка достижений
  private async unlockAchievements(
    achievementTypes: AchievementType[],
  ): Promise<void> {
    if (!this.currentUser || achievementTypes.length === 0) return;
    for (const type of achievementTypes) {
      // Проверяем, нет ли уже этого достижения
      const hasAchievement = this.currentUser.achievements.some(
        (a) => a.type === type,
      );
      if (hasAchievement) continue;
      // Добавляем достижение
      this.currentUser.achievements.push({
        id: `${type}_${Date.now()}`,
        type,
        unlockedAt: new Date(),
      });
      // Добавляем XP за достижение
      const definition = ACHIEVEMENT_DEFINITIONS[type];
      if (definition) {
        await this.addXP(definition.xpReward, `achievement_${type}`);
      }
    }
    await this.updateUserInFirestore();
  }
  // Проверка выполнения целей
  private async checkGoalCompletion(): Promise<void> {
    if (!this.currentUser) return;
    const { daily, weekly, monthly } = this.currentUser.goals;
    // Ежедневная цель
    if (
      !daily.completed &&
      daily.progress.words >= daily.targetWords &&
      daily.progress.minutes >= daily.targetMinutes
    ) {
      daily.completed = true;
      await this.addXP(XP_REWARDS.DAILY_GOAL, "daily_goal");
    }
    // Недельная цель
    if (
      !weekly.completed &&
      weekly.progress.words >= weekly.targetWords &&
      weekly.progress.daysStudied >= weekly.targetDays
    ) {
      weekly.completed = true;
      await this.addXP(XP_REWARDS.WEEKLY_GOAL, "weekly_goal");
    }
    // Месячная цель
    if (
      !monthly.completed &&
      monthly.progress.words >= monthly.targetWords &&
      monthly.progress.collections >= monthly.targetCollections
    ) {
      monthly.completed = true;
      await this.addXP(XP_REWARDS.MONTHLY_GOAL, "monthly_goal");
    }
  }
  // Обновление последней активности
  private async updateLastActive(): Promise<void> {
    if (!this.currentUser) return;
    this.currentUser.lastActiveAt = new Date();
    try {
      await updateDoc(doc(db, "users", this.currentUser.id), {
        lastActiveAt: serverTimestamp(),
      });
    } catch (error) {
      logger.error("Ошибка обновления последней активности:", error);
    }
  }
  // Обновление пользователя в Firestore
  private async updateUserInFirestore(): Promise<void> {
    if (!this.currentUser) return;
    try {
      // Подготавливаем данные для сохранения, исключая undefined значения
      const userDataForFirestore = this.prepareUserDataForFirestore(this.currentUser);
      // Обновляем время последней активности сервера
      this.lastServerUpdate = new Date();
      await updateDoc(doc(db, "users", this.currentUser.id), {
        ...userDataForFirestore,
        lastActiveAt: serverTimestamp(),
      });
      logger.info("Данные пользователя успешно синхронизированы с Firestore");
    } catch (error) {
      logger.error("Ошибка обновления пользователя:", error);
      // Если это ошибка сети, повторим попытку позже
      if (error instanceof Error && error.message.includes('network')) {
        throw error; // Это приведет к повторной попытке синхронизации
      }
    }
  }
  // Сохранение в локальное хранилище
  private saveToLocalStorage(): void {
    if (typeof window === "undefined" || !this.currentUser) return;
    try {
      const data: LocalUserData = {
        user: this.currentUser,
        isAuthenticated: true,
        version: USER_VERSION,
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      logger.error("Ошибка сохранения в localStorage:", error);
    }
  }
  // Очистка локального хранилища
  private clearLocalStorage(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      logger.error("Ошибка очистки localStorage:", error);
    }
  }
  // Получение сообщения об ошибке
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case "auth/user-not-found":
        return "Пользователь с таким email не найден";
      case "auth/wrong-password":
        return "Неверный пароль";
      case "auth/email-already-in-use":
        return "Пользователь с таким email уже существует";
      case "auth/weak-password":
        return "Пароль слишком простой";
      case "auth/invalid-email":
        return "Неверный формат email";
      case "auth/too-many-requests":
        return "Слишком много попыток. Попробуйте позже";
      case "auth/requires-recent-login":
        return "Требуется повторная авторизация. Пожалуйста, войдите снова";
      case "auth/network-request-failed":
        return "Ошибка сети. Проверьте подключение к интернету";
      default:
        return "Произошла ошибка. Попробуйте ещё раз";
    }
  }
  // Очистка ресурсов
  destroy(): void {
    if (this.authUnsubscribe) {
      this.authUnsubscribe();
      this.authUnsubscribe = null;
    }
    if (this.userDocUnsubscribe) {
      this.userDocUnsubscribe();
      this.userDocUnsubscribe = null;
    }
    this.stopTokenRefreshInterval();
    this.stopEmailVerificationCheck();
    // Очищаем очередь синхронизации
    this.syncQueue = [];
    this.isSyncing = false;
  }
}
// Глобальный экземпляр сервиса
export const userService = new UserService();
