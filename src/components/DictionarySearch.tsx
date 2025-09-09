"use client";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  Search,
  ArrowUpDown,
  Loader2,
  AlertCircle,
  Volume2,
  Lightbulb,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  languageDetector,
  type LanguageDetectionResult,
} from "@/lib/language-detector";
import { germanArticleDetector } from "@/lib/german-article-detector";
import type {
  ProcessedDictionaryResult,
  LanguageDirection,
  DictionarySearchHistory,
} from "@/types/dictionary";
interface DictionarySearchProps {
  onResultsChange?: (results: ProcessedDictionaryResult | null) => void;
  className?: string;
}
interface ApiResponse {
  error?: string;
  code?: number;
  [key: string]: unknown;
}
export default function DictionarySearch({
  onResultsChange,
  className,
}: DictionarySearchProps) {
  // Состояние поиска
  const [searchText, setSearchText] = useState("");
  const [direction, setDirection] = useState<LanguageDirection>("auto");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ProcessedDictionaryResult | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  // Состояние автоопределения языка
  const [languageDetection, setLanguageDetection] =
    useState<LanguageDetectionResult | null>(null);
  const [showLanguageHint, setShowLanguageHint] = useState(false);
  const [autoSwitchedDirection, setAutoSwitchedDirection] = useState(false);
  // История поиска (локальная)
  const [searchHistory, setSearchHistory] = useState<DictionarySearchHistory[]>(
    [],
  );
  // Дебаунс для поиска
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  // Реф для поля ввода
  const inputRef = useRef<HTMLInputElement>(null);
  // Инициализация детектора артиклей при загрузке компонента
  useEffect(() => {
    const initializeDetector = async () => {
      try {
        await germanArticleDetector.initialize();
      } catch (error) {
        // Ошибки инициализации не должны блокировать работу приложения
      }
    };
    initializeDetector();
  }, []);
  // Очистка дебаунса при размонтировании
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);
  // Обработка горячих клавиш
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K или Cmd+K для фокуса на поле поиска
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      // Escape для очистки поиска
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        handleSearchChange("");
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  // Автоопределение языка при изменении текста
  const currentDetection = useMemo(() => {
    if (!searchText.trim()) {
      return null;
    }
    return languageDetector.detectLanguage(searchText);
  }, [searchText]);
  // Обновление состояния определения языка
  useEffect(() => {
    setLanguageDetection(currentDetection);
    // Показываем подсказку только если уверенность достаточная и язык определен
    if (
      currentDetection &&
      currentDetection.confidence >= 50 &&
      currentDetection.language !== "unknown"
    ) {
      setShowLanguageHint(true);
      // Автоматическое переключение направления только в режиме auto
      if (direction === "auto" && currentDetection.suggestedDirection) {
        setDirection(currentDetection.suggestedDirection);
        setAutoSwitchedDirection(true);
      }
    } else {
      setShowLanguageHint(false);
      setAutoSwitchedDirection(false);
    }
  }, [currentDetection, direction]);
  // Переключение направления перевода
  const toggleDirection = useCallback(() => {
    setDirection((prev) => {
      switch (prev) {
        case "auto":
          return "ru-de";
        case "ru-de":
          return "de-ru";
        case "de-ru":
          return "auto";
        case "ru-ru":
          return "de-de";
        case "de-de":
          return "ru-ru";
        default:
          return "auto";
      }
    });
    setAutoSwitchedDirection(false);
  }, []);
  // Получение названия направления для UI
  const getDirectionLabel = useCallback((dir: LanguageDirection) => {
    switch (dir) {
      case "auto":
        return "Автоопределение";
      case "ru-de":
        return "Русский → Немецкий";
      case "de-ru":
        return "Немецкий → Русский";
      case "ru-ru":
        return "Русский → Русский";
      case "de-de":
        return "Немецкий → Немецкий";
      default:
        return "Неизвестно";
    }
  }, []);
  // Получение плейсхолдера - всегда на русском языке
  const getSmartPlaceholder = useCallback(() => {
    return "Введите слово для поиска...";
  }, []);
  // Валидация поискового запроса
  const validateSearchText = useCallback(
    (text: string): { isValid: boolean; error?: string } => {
      if (!text.trim()) {
        return { isValid: false, error: "Введите слово для поиска" };
      }
      if (text.length > 100) {
        return {
          isValid: false,
          error: "Максимальная длина запроса: 100 символов",
        };
      }
      const allowedCharsPattern = /^[a-zA-ZА-Яа-яёЁäöüßÄÖÜ\s\-.,!?]+$/;
      if (!allowedCharsPattern.test(text)) {
        return { isValid: false, error: "Недопустимые символы в запросе" };
      }
      return { isValid: true };
    },
    [],
  );
  // Выполнение поиска
  const performSearch = useCallback(
    async (text: string, searchDirection: LanguageDirection) => {
      const validation = validateSearchText(text);
      if (!validation.isValid) {
        setError(validation.error || "Некорректный запрос");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const searchParams = new URLSearchParams({
          text: text.trim(),
          direction: searchDirection,
          ui: "ru",
          morphology: "true",
          examples: "true",
          family: "false",
        });
        const response = await fetch(`/api/dictionary/lookup?${searchParams}`);

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}`;
          try {
            const errorData: ApiResponse = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch {
            // Если не удается распарсить JSON ошибки, используем статус
          }
          throw new Error(errorMessage);
        }

        const result: ProcessedDictionaryResult = await response.json();
        setResults(result);
        onResultsChange?.(result);
        // Добавляем в историю поиска
        const historyEntry: DictionarySearchHistory = {
          query: text.trim(),
          direction: searchDirection,
          timestamp: Date.now(),
          hasResults: result.hasResults,
        };
        setSearchHistory((prev) => {
          const filtered = prev.filter(
            (item) =>
              !(
                item.query === historyEntry.query &&
                item.direction === historyEntry.direction
              ),
          );
          return [historyEntry, ...filtered].slice(0, 10); // максимум 10 записей
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Ошибка при поиске";
        setError(errorMessage);
        setResults(null);
        onResultsChange?.(null);
      } finally {
        setIsLoading(false);
      }
    },
    [validateSearchText, onResultsChange],
  );
  // Обработка изменения текста поиска (без автопоиска)
  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchText(text);
      // Очищаем предыдущий таймер
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
        setDebounceTimeout(null);
      }
      // Очищаем ошибки при начале ввода
      if (error && text.trim()) {
        setError(null);
      }
      // Если текст пустой, очищаем результаты
      if (!text.trim()) {
        setResults(null);
        onResultsChange?.(null);
        setLanguageDetection(null);
        setShowLanguageHint(false);
        setAutoSwitchedDirection(false);
        return;
      }
    },
    [debounceTimeout, error, onResultsChange],
  );
  // Обработка нажатия Enter
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && searchText.trim()) {
        // Очищаем дебаунс и выполняем поиск немедленно
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
          setDebounceTimeout(null);
        }
        performSearch(searchText, direction);
      }
    },
    [searchText, direction, debounceTimeout, performSearch],
  );
  // Повторный поиск из истории
  const repeatSearch = useCallback(
    (historyItem: DictionarySearchHistory) => {
      setSearchText(historyItem.query);
      setDirection(historyItem.direction);
      setAutoSwitchedDirection(false);
      performSearch(historyItem.query, historyItem.direction);
    },
    [performSearch],
  );
  // Принятие предложения автоопределения
  const acceptLanguageSuggestion = useCallback(() => {
    if (languageDetection?.suggestedDirection) {
      setDirection(languageDetection.suggestedDirection);
      setAutoSwitchedDirection(true);
      setShowLanguageHint(false);
      if (searchText.trim()) {
        performSearch(searchText, languageDetection.suggestedDirection);
      }
    }
  }, [languageDetection, searchText, performSearch]);
  return (
    <div className={`space-y-4 ${className || ""}`}>
      {/* Поисковая форма */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            Умный поиск в словаре
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {/* Переключатель направления с индикатором автоопределения */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">
                {getDirectionLabel(direction)}
              </span>
              {autoSwitchedDirection && (
                <Badge
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  <Zap className="h-3 w-3" />
                  <span className="hidden sm:inline">Авто-переключение</span>
                  <span className="sm:hidden">Авто</span>
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDirection}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span className="hidden sm:inline">Изменить направление</span>
              <span className="sm:hidden">Переключить</span>
            </Button>
          </div>
          {/* Индикатор определения языка */}
          {showLanguageHint && languageDetection && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-german-gold dark:text-dark-theme-pink flex-shrink-0" />
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  {languageDetector.getDetectionDescription(languageDetection)}
                </span>
              </div>
              {languageDetection.suggestedDirection !== direction && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={acceptLanguageSuggestion}
                  className="text-xs h-7"
                >
                  Переключить
                </Button>
              )}
            </div>
          )}
          {/* Поле ввода с кнопкой поиска */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                type="text"
                placeholder={getSmartPlaceholder()}
                value={searchText}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10 text-base sm:text-sm h-12 sm:h-10"
                disabled={isLoading}
              />
              {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>
            <Button
              onClick={() => searchText.trim() && performSearch(searchText, direction)}
              disabled={isLoading || !searchText.trim()}
              className="h-12 sm:h-10 px-4 sm:px-6"
            >
              <Search className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Найти</span>
            </Button>
          </div>
          {/* Ошибки */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          {/* Горячие клавиши */}
          <div className="text-xs text-muted-foreground">
            💡 <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd>{" "}
            или кнопка "Найти" для поиска,
            <kbd className="px-1 py-0.5 bg-muted rounded text-xs ml-1">
              Ctrl+K
            </kbd>{" "}
            для фокуса,
            <kbd className="px-1 py-0.5 bg-muted rounded text-xs ml-1">Esc</kbd>{" "}
            для очистки
          </div>
        </CardContent>
      </Card>
      {/* История поиска */}
      {searchHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Недавние поиски</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {searchHistory.slice(0, 5).map((item, index) => (
                <Button
                  key={`${item.query}-${item.direction}-${index}`}
                  variant="outline"
                  size="sm"
                  onClick={() => repeatSearch(item)}
                  className="flex items-center gap-2"
                >
                  <span>{item.query}</span>
                  <Badge
                    variant={item.hasResults ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {item.direction}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
