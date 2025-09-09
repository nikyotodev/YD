"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EducationHero } from "./EducationHero";
import { EducationUniversities } from "./EducationUniversities";
import { EducationPrograms } from "./EducationPrograms";
import { EducationRequirements } from "./EducationRequirements";
import { EducationCosts } from "./EducationCosts";
import { EducationResources } from "./EducationResources";
import { EducationFAQ } from "./EducationFAQ";
import { EducationCTA } from "./EducationCTA";
import { Suspense } from "react";
// Компонент загрузки для страницы образования
function EducationLoading() {
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
export function EducationPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-14 sm:pt-16">
        <Suspense fallback={<EducationLoading />}>
          <EducationHero />
          <EducationUniversities />
          <EducationPrograms />
          <EducationRequirements />
          <EducationCosts />
          <EducationResources />
          <EducationFAQ />
          <EducationCTA />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
