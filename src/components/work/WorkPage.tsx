"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WorkHero } from "./WorkHero";
import { WorkBenefits } from "./WorkBenefits";
import { SalaryGuide } from "./SalaryGuide";
import { VisaRequirements } from "./VisaRequirements";
import { Suspense } from "react";
// Компонент загрузки для страницы работы
const LoadingSkeleton = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-pulse space-y-8 w-full max-w-6xl mx-auto px-4 py-8">
      <div className="h-64 bg-muted rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-muted rounded-lg" />
        <div className="h-32 bg-muted rounded-lg" />
        <div className="h-32 bg-muted rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-48 bg-muted rounded-lg" />
        <div className="h-48 bg-muted rounded-lg" />
      </div>
    </div>
  </div>
);
export function WorkPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-14 sm:pt-16">
        <Suspense fallback={<LoadingSkeleton />}>
          <WorkHero />
          <WorkBenefits />
          <SalaryGuide />
          <VisaRequirements />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
