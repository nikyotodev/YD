"use client";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HousingHero } from "./HousingHero";
import { HousingPlatforms } from "./HousingPlatforms";
import { HousingCities } from "./HousingCities";
import { HousingFAQ } from "./HousingFAQ";
// Компонент загрузки для страницы поиска жилья
function HousingLoading() {
  return (
    <div className="min-h-screen">
      <div className="animate-pulse space-y-8 w-full max-w-6xl mx-auto px-4 py-8">
        <div className="h-64 bg-muted rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-32 bg-muted rounded-lg" />
        </div>
        <div className="h-48 bg-muted rounded-lg" />
      </div>
    </div>
  );
}
export function HousingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-14 sm:pt-16">
        <Suspense fallback={<HousingLoading />}>
          <HousingHero />
          <div id="platforms">
            <HousingPlatforms />
          </div>
          <div id="cities">
            <HousingCities />
          </div>
          <HousingFAQ />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
