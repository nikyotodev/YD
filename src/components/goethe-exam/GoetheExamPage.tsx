"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoetheExamHero } from "./GoetheExamHero";
import { GoetheExamLevels } from "./GoetheExamLevels";
import { GoetheExamFormat } from "./GoetheExamFormat";
import { GoetheExamPreparation } from "./GoetheExamPreparation";
import { GoetheExamTips } from "./GoetheExamTips";
import { GoetheExamFAQ } from "./GoetheExamFAQ";
import { GoetheExamCTA } from "./GoetheExamCTA";
import { Suspense } from "react";
// Компонент загрузки для страницы экзаменов Гёте
function GoetheExamLoading() {
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
export function GoetheExamPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-14 sm:pt-16">
        <Suspense fallback={<GoetheExamLoading />}>
          <GoetheExamHero />
          <GoetheExamLevels />
          <GoetheExamFormat />
          <GoetheExamPreparation />
          <GoetheExamTips />
          <GoetheExamFAQ />
          <GoetheExamCTA />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
