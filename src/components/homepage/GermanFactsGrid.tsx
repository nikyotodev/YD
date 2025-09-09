"use client";
import { memo, useMemo } from "react";
import { Globe, MapPin, GraduationCap, Trophy } from "lucide-react";
import type { GermanFact } from "@/types/homepage";
export const GermanFactsGrid = memo(function GermanFactsGrid() {
  const germanFacts: GermanFact[] = useMemo(
    () => [
      {
        id: "speakers",
        icon: <Globe className="h-6 w-6" />,
        title: "103 млн",
        subtitle: "носителей языка",
        description: "Немецкий - самый распространённый родной язык в ЕС",
        color: "text-german-red dark:text-dark-theme-pink",
      },
      {
        id: "countries",
        icon: <MapPin className="h-6 w-6" />,
        title: "6 стран",
        subtitle: "официальный язык",
        description:
          "Германия, Австрия, Швейцария, Люксембург, Бельгия, Италия",
        color: "text-german-gold dark:text-dark-theme-pink",
      },
      {
        id: "science",
        icon: <GraduationCap className="h-6 w-6" />,
        title: "2-й язык",
        subtitle: "в науке",
        description: "После английского - самый важный научный язык",
        color: "text-german-red dark:text-dark-theme-pink",
      },
      {
        id: "economy",
        icon: <Trophy className="h-6 w-6" />,
        title: "4-я экономика",
        subtitle: "мира",
        description: "Знание немецкого открывает карьерные возможности",
        color: "text-german-gold dark:text-dark-theme-pink",
      },
    ],
    [],
  );
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16 max-w-5xl mx-auto px-4">
      {germanFacts.map((fact) => (
        <div
          key={fact.id}
          className="glass-card text-center group cursor-pointer hover:scale-[1.02] transition-all duration-300"
        >
          <div className="flex items-center justify-center mb-3">
            <div className="glass p-2 md:p-3 bg-gradient-to-br from-german-red/10 to-german-gold/10 rounded-full dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20">
              <div className={`${fact.color} dark:text-dark-theme-pink`}>
                {fact.icon}
              </div>
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black gradient-text mb-1 group-hover:scale-110 transition-transform">
            {fact.title}
          </div>
          <div className="text-xs md:text-sm font-semibold text-foreground mb-2">
            {fact.subtitle}
          </div>
          <div className="text-xs text-muted-foreground leading-tight px-2">
            {fact.description}
          </div>
        </div>
      ))}
    </div>
  );
});
