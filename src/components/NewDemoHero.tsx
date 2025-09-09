"use client";
import { memo } from "react";
import { HeroSection } from "./homepage/HeroSection";
import { GermanFactsGrid } from "./homepage/GermanFactsGrid";
import { MainFeaturesSection } from "./homepage/MainFeaturesSection";
import { InteractiveDemoCards } from "./homepage/InteractiveDemoCards";
import { PersonalAITeacher } from "./homepage/PersonalAITeacher";
import { TestimonialsSection } from "./homepage/TestimonialsSection";
function NewDemoHeroComponent() {
  return (
    <section className="min-h-screen pt-8 md:pt-16 relative overflow-hidden">
      {/* Background decorations - Оптимизированы для мобильных */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 md:top-20 left-5 md:left-10 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-german-red/10 to-german-gold/10 rounded-full blur-3xl animate-float dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20" />
        <div className="absolute bottom-10 md:bottom-20 right-5 md:right-10 w-32 md:w-48 h-32 md:h-48 bg-gradient-to-br from-german-gold/10 to-german-red/10 rounded-full blur-3xl animate-float animation-delay-2000 dark:from-dark-theme-pink/20 dark:to-dark-theme-purple/20" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 md:w-64 h-48 md:h-64 bg-gradient-to-br from-german-red/5 to-german-gold/5 rounded-full blur-3xl animate-glow dark:from-dark-theme-purple/10 dark:to-dark-theme-pink/10" />
      </div>
      <div className="relative container mx-auto px-4 py-8 md:py-16">
        {/* Hero Content */}
        <HeroSection />
        {/* German Facts */}
        <GermanFactsGrid />
        {/* Main Features - новая секция */}
        <MainFeaturesSection />
        {/* Interactive Demo Cards */}
        <InteractiveDemoCards />
        {/* Personal AI Teacher */}
        <PersonalAITeacher />
        {/* Testimonials */}
        <TestimonialsSection />
      </div>
    </section>
  );
}
export const NewDemoHero = memo(NewDemoHeroComponent);
