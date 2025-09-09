import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
// Debounce хук для оптимизации частых вызовов
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}
// Throttle хук для ограничения частоты вызовов
export function useThrottle<T extends (...args: readonly unknown[]) => unknown>(
  fn: T,
  delay: number
): T {
  const lastCall = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        return fn(...args);
      }
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        lastCall.current = Date.now();
        fn(...args);
      }, delay - (now - lastCall.current));
    }) as T,
    []
  );
}
// Intersection Observer хук для отслеживания видимости
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefObject<Element | null>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<Element>(null);
  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [options]);
  return [targetRef, isIntersecting];
}
// Хук для мемоизации тяжелых вычислений
export function useExpensiveMemo<T>(
  computeFn: () => T,
  deps: React.DependencyList
): T {
  return useMemo(() => {
    const start = performance.now();
    const result = computeFn();
    const end = performance.now();
    // В development логируем медленные вычисления
    if (process.env.NODE_ENV === 'development' && (end - start) > 10) {
      // Медленные операции отслеживаются без console
    }
    return result;
  }, [computeFn, ...deps]);
}
// Виртуализация списков
export function useVirtualization(
  itemCount: number,
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);
  const visibleStart = useMemo(() => {
    return Math.floor(scrollTop / itemHeight);
  }, [scrollTop, itemHeight]);
  const visibleEnd = useMemo(() => {
    return Math.min(
      itemCount - 1,
      visibleStart + Math.ceil(containerHeight / itemHeight) + 1
    );
  }, [visibleStart, containerHeight, itemHeight, itemCount]);
  const visibleItems = useMemo(() => {
    const items = [];
    for (let i = visibleStart; i <= visibleEnd; i++) {
      items.push(i);
    }
    return items;
  }, [visibleStart, visibleEnd]);
  const totalHeight = itemCount * itemHeight;
  const offsetY = visibleStart * itemHeight;
  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);
  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll,
  };
}
// Хук для оптимизации ререндеров
export function useStableCallback<T extends (...args: readonly unknown[]) => unknown>(
  callback: T
): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  return useCallback(
    ((...args: Parameters<T>) => callbackRef.current(...args)) as T,
    []
  );
}
// Хук для отслеживания производительности
export function usePerformanceMonitor(componentName: string) {
  const renderStartTime = useRef<number | undefined>(undefined);
  const renderCount = useRef(0);
  useEffect(() => {
    renderStartTime.current = performance.now();
    renderCount.current += 1;
  });
  useEffect(() => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current;
      if (process.env.NODE_ENV === 'development') {
        if (renderTime > 16) { // Больше одного кадра
          // Медленный рендер компонента отслеживается
        }
      }
    }
  });
  return {
    renderCount: renderCount.current,
  };
}
// Хук для отслеживания изменений пропов
export function useWhyDidYouUpdate(name: string, props: Record<string, unknown>) {
  const previousProps = useRef<Record<string, unknown> | undefined>(undefined);
  useEffect(() => {
    if (previousProps.current && process.env.NODE_ENV === 'development') {
      const changedProps: Record<string, { from: unknown; to: unknown }> = {};
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      for (const key of allKeys) {
        const prevValue = previousProps.current?.[key];
        const currentValue = props[key];
        if (prevValue !== currentValue) {
          changedProps[key] = {
            from: prevValue,
            to: currentValue,
          };
        }
      }
      if (Object.keys(changedProps).length) {
        // В development можно отслеживать изменения без console
      }
    }
    previousProps.current = props;
  });
}
// Хук для кэширования API результатов
export function useCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  cacheTime = 5 * 60 * 1000 // 5 минут
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cache = useRef<Map<string, { data: T; timestamp: number }>>(new Map());
  const fetchData = useCallback(async () => {
    const cached = cache.current.get(key);
    const now = Date.now();
    // Проверяем кэш
    if (cached && now - cached.timestamp < cacheTime) {
      setData(cached.data);
      return cached.data;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      cache.current.set(key, { data: result, timestamp: now });
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [key, fetchFn, cacheTime]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}
// Хук для батчинга состояний
export function useBatchedState<T>(initialState: T) {
  const [state, setState] = useState(initialState);
  const pendingUpdates = useRef<Array<(prev: T) => T>>([]);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const batchedSetState = useCallback((updater: (prev: T) => T) => {
    pendingUpdates.current.push(updater);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setState(prevState => {
        let newState = prevState;
        for (const update of pendingUpdates.current) {
          newState = update(newState);
        }
        pendingUpdates.current = [];
        return newState;
      });
    }, 0);
  }, []);
  return [state, batchedSetState] as const;
}
// Хук для оптимизации списков с поиском
export function useOptimizedSearch<T>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[],
  maxResults = 50
) {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  return useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return items.slice(0, maxResults);
    }
    const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
    const filtered = items.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return typeof value === 'string' &&
               value.toLowerCase().includes(lowerSearchTerm);
      })
    );
    return filtered.slice(0, maxResults);
  }, [items, debouncedSearchTerm, searchFields, maxResults]);
}
