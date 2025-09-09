import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  useCallback,
} from "react";
import { userService } from "@/lib/user-service";
import { firebaseCollectionsManager } from "@/lib/firebase-collections";
import type { User, AchievementType } from "@/types/user";
interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSyncing: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (
    email: string,
  ) => Promise<{ success: boolean; error?: string }>;
  updateWordProgress: (wordsLearned: number) => Promise<AchievementType[]>;
  updateStreak: () => Promise<AchievementType[]>;
  addXP: (amount: number, reason?: string) => Promise<AchievementType[]>;
  syncUserCollections: () => Promise<boolean>;
  syncUserData: () => Promise<boolean>;
}
const UserContext = createContext<UserContextType | undefined>(undefined);
interface UserProviderProps {
  children: ReactNode;
}
export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  // Функция для сравнения и обновления пользователя
  const updateUserIfChanged = useCallback(() => {
    const updatedUser = userService.getCurrentUser();
    if (updatedUser) {
      setUser((currentUser) => {
        // Если ID не совпадает или первое получение пользователя
        if (!currentUser || updatedUser.id !== currentUser.id) {
          return updatedUser;
        }
        // Если данные не изменились, возвращаем существующий объект
        if (JSON.stringify(updatedUser) === JSON.stringify(currentUser)) {
          return currentUser;
        }
        // Если данные изменились, возвращаем обновленного пользователя
        return updatedUser;
      });
    } else {
      setUser((currentUser) => (currentUser ? null : null));
    }
  }, []);
  useEffect(() => {
    // Инициализация - проверяем текущего пользователя
    updateUserIfChanged();
    setIsLoading(false);
    // Настраиваем интервал для обновления пользователя
    const interval = setInterval(() => {
      updateUserIfChanged();
    }, 1000);
    // Добавляем колбэк для изменения состояния аутентификации
    const unsubscribe = userService.addAuthStateChangeCallback(() => {
      updateUserIfChanged();
      setIsLoading(false);
    });
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [updateUserIfChanged]); // Теперь зависит только от стабильной функции
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await userService.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        // После успешного входа устанавливаем real-time синхронизацию коллекций
        firebaseCollectionsManager.setupRealtimeListeners();
      }
      return { success: result.success, error: result.error };
    } finally {
      setIsLoading(false);
    }
  };
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const result = await userService.register(email, password, name);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return { success: result.success, error: result.error };
    } finally {
      setIsLoading(false);
    }
  };
  const logout = async () => {
    setIsLoading(true);
    try {
      // Перед выходом останавливаем real-time слушатели и синхронизируем коллекции с Firestore
      if (userService.isAuthenticated()) {
        firebaseCollectionsManager.stopRealtimeListeners();
        await firebaseCollectionsManager.syncCollectionsToFirestore();
      }
      await userService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  const resetPassword = async (email: string) => {
    return await userService.resetPassword(email);
  };
  const updateWordProgress = async (wordsLearned: number) => {
    const achievements = await userService.updateWordProgress(wordsLearned);
    updateUserIfChanged();
    return achievements;
  };
  const updateStreak = async () => {
    const achievements = await userService.updateStreak();
    updateUserIfChanged();
    return achievements;
  };
  const addXP = async (amount: number, reason?: string) => {
    const achievements = await userService.addXP(amount, reason);
    updateUserIfChanged();
    return achievements;
  };
  // Синхронизирует коллекции пользователя между локальным хранилищем и Firestore
  const syncUserCollections = useCallback(async () => {
    if (!userService.isAuthenticated()) return false;
    setIsSyncing(true);
    try {
      // Сначала синхронизируем локальные коллекции с Firestore
      const toFirestoreResult =
        await firebaseCollectionsManager.syncCollectionsToFirestore();
      // Затем обновляем локальные коллекции данными из Firestore
      const fromFirestoreResult =
        await firebaseCollectionsManager.syncCollectionsFromFirestore();
      return toFirestoreResult && fromFirestoreResult;
    } catch (error) {
      console.error("Ошибка синхронизации коллекций:", error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, []);
  // Синхронизирует все данные пользователя
  const syncUserData = useCallback(async () => {
    if (!userService.isAuthenticated()) return false;
    setIsSyncing(true);
    try {
      // Обновляем токен авторизации
      await userService.checkAndRefreshToken();
      // Проверяем статус верификации email
      await userService.checkEmailVerification();
      // Синхронизируем коллекции
      const collectionsResult = await syncUserCollections();
      // Обновляем пользовательский интерфейс с актуальными данными
      updateUserIfChanged();
      return collectionsResult;
    } catch (error) {
      console.error("Ошибка синхронизации данных пользователя:", error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [syncUserCollections, updateUserIfChanged]);
  // Настраиваем автоматическую синхронизацию при изменении пользователя
  useEffect(() => {
    if (user && userService.isAuthenticated()) {
      // Синхронизируем данные при первой загрузке
      syncUserData();
      // Настраиваем интервал для периодической синхронизации (каждые 10 минут)
      const syncInterval = setInterval(
        () => {
          syncUserData();
        },
        10 * 60 * 1000,
      );
      return () => {
        clearInterval(syncInterval);
      };
    }
  }, [user, syncUserData]); // Правильные зависимости
  const value: UserContextType = {
    user,
    isAuthenticated: userService.isAuthenticated(),
    isLoading,
    isSyncing,
    login,
    register,
    logout,
    resetPassword,
    updateWordProgress,
    updateStreak,
    addXP,
    syncUserCollections,
    syncUserData,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
// Хук для проверки авторизации
export function useAuth() {
  const { isAuthenticated, isLoading } = useUser();
  return { isAuthenticated, isLoading };
}
// Хук для получения данных геймификации
export function useGamification() {
  const { user } = useUser();
  return user?.gamification || null;
}
// Хук для получения целей пользователя
export function useGoals() {
  const { user } = useUser();
  return user?.goals || null;
}
