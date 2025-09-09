"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HealthcareHero } from "./HealthcareHero";
import { HealthcareSystem } from "./HealthcareSystem";
import { HealthcareInsurance } from "./HealthcareInsurance";
import { HealthcareDoctors } from "./HealthcareDoctors";
import { HealthcareEmergency } from "./HealthcareEmergency";
import { HealthcareFAQ } from "./HealthcareFAQ";
import { HealthcareCTA } from "./HealthcareCTA";
import { Suspense } from "react";
// Компонент загрузки для страницы здравоохранения
function HealthcareLoading() {
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
export function HealthcarePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-14 sm:pt-16">
        <Suspense fallback={<HealthcareLoading />}>
          <HealthcareHero />
          <HealthcareSystem />
          <HealthcareInsurance />
          <HealthcareDoctors />
          <HealthcareEmergency />
          <HealthcareFAQ />
          <HealthcareCTA />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
