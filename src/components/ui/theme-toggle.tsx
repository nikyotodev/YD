"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
interface ThemeToggleProps {
  className?: string;
}
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <button
      className={cn(
        "flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300 glass glass-hover",
        isDark
          ? "bg-background/50 border border-border shadow-lg"
          : "bg-background/80 border border-border shadow-md",
        className,
      )}
      onClick={toggleTheme}
      aria-label={`Переключить тему. Текущая: ${isDark ? "тёмная" : "светлая"}`}
    >
      <div className="flex justify-between items-center w-full">
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-all duration-300 shadow-sm",
            isDark
              ? "transform translate-x-0 bg-dark-theme-pink/20 border border-dark-theme-pink/30"
              : "transform translate-x-8 bg-german-red/20 border border-german-red/30",
          )}
        >
          {isDark ? (
            <Moon
              className="w-3.5 h-3.5 text-dark-theme-pink"
              strokeWidth={1.5}
            />
          ) : (
            <Sun className="w-3.5 h-3.5 text-german-red" strokeWidth={1.5} />
          )}
        </div>
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-all duration-300",
            isDark
              ? "bg-transparent opacity-50"
              : "transform -translate-x-8 bg-transparent opacity-50",
          )}
        >
          {isDark ? (
            <Sun
              className="w-3.5 h-3.5 text-muted-foreground"
              strokeWidth={1.5}
            />
          ) : (
            <Moon
              className="w-3.5 h-3.5 text-muted-foreground"
              strokeWidth={1.5}
            />
          )}
        </div>
      </div>
    </button>
  );
}
