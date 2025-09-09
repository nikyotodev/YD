/**
 * Хук для управления темой приложения
 */
import { useState, useEffect, useCallback } from "react";
type Theme = "light" | "dark" | "auto";
interface UseThemeReturn {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
const STORAGE_KEY = "talkify-theme";
function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem(STORAGE_KEY) as Theme) || "light";
}
export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>("light");
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");
  // Определяем разрешенную тему
  const resolvedTheme = theme === "auto" ? systemTheme : theme;
  // Инициализация темы
  useEffect(() => {
    const stored = getStoredTheme();
    const system = getSystemTheme();
    setThemeState(stored);
    setSystemTheme(system);
  }, []);
  // Слушаем изменения системной темы
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  // Применяем тему к документу
  useEffect(() => {
    const root = document.documentElement;
    const isDark = resolvedTheme === "dark";
    if (isDark) {
      root.classList.add("dark");
      root.style.setProperty("--theme-background", "240 10% 4%");
      root.style.setProperty("--theme-foreground", "0 0% 95%");
    } else {
      root.classList.remove("dark");
      root.style.setProperty("--theme-background", "0 0% 100%");
      root.style.setProperty("--theme-foreground", "240 10% 4%");
    }
  }, [resolvedTheme]);
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  }, []);
  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);
  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };
}
