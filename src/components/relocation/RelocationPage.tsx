"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RelocationHero } from "./RelocationHero";
import { RelocationBenefits } from "./RelocationBenefits";
import { RelocationProcess } from "./RelocationProcess";
import { LanguagePreparation } from "./LanguagePreparation";
import { RelocationResources } from "./RelocationResources";
import { RelocationFAQ } from "./RelocationFAQ";
import { RelocationCTA } from "./RelocationCTA";
import { Suspense } from "react";
// Компонент загрузки для страницы релокации
function RelocationLoading() {
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
export function RelocationPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-14 sm:pt-16">
        <Suspense fallback={<RelocationLoading />}>
          <RelocationHero />
          <RelocationBenefits />
          <RelocationProcess />
          <LanguagePreparation />
          <RelocationResources />
          <RelocationFAQ />
          <RelocationCTA />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
