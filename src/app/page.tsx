import type { Metadata } from 'next';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewDemoHero } from "@/components/NewDemoHero";
import { Suspense } from "react";
import { StructuredData } from "@/components/StructuredData";
import {
  generateWebsiteStructuredData,
  generateEducationalOrganizationStructuredData
} from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "YourDeutsch - Изучайте немецкий язык с ИИ | Goethe A1-C1",
  description: "🇩🇪 Бесплатная платформа для изучения немецкого языка с персональным ИИ-помощником. Подготовка к экзаменам Goethe A1-C1, умный словарь, интерактивные уроки. Начните изучать немецкий сегодня!",
  keywords: [
    "изучение немецкого языка",
    "немецкий язык онлайн",
    "deutsch lernen",
    "goethe экзамен подготовка",
    "немецкий с нуля",
    "ии помощник немецкий",
    "german learning online",
    "deutsche sprache lernen",
    "yourdeutsch",
    "экзамены goethe a1 a2 b1 b2 c1"
  ],
  openGraph: {
    title: "YourDeutsch - Изучайте немецкий язык с ИИ",
    description: "🇩🇪 Бесплатная платформа для изучения немецкого языка с персональным ИИ-помощником. Подготовка к экзаменам Goethe A1-C1",
    type: "website",
    locale: "ru_RU",
    url: "https://yourdeutsch.com",
    siteName: "YourDeutsch",
    images: [
      {
        url: "https://yourdeutsch.com/og-homepage.png",
        width: 1200,
        height: 630,
        alt: "YourDeutsch - Изучение немецкого языка с ИИ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YourDeutsch - Изучайте немецкий язык с ИИ",
    description: "🇩🇪 Бесплатная платформа для изучения немецкого с персональным ИИ-помощником",
    images: ["https://yourdeutsch.com/og-homepage.png"],
  },
  alternates: {
    canonical: "https://yourdeutsch.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Компонент загрузки для главной страницы
function HomeLoading() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-14 sm:pt-16">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse space-y-4 w-full max-w-4xl mx-auto px-4">
            <div className="h-12 bg-muted rounded-lg w-3/4 mx-auto" />
            <div className="h-6 bg-muted rounded w-1/2 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="h-32 bg-muted rounded-lg" />
              <div className="h-32 bg-muted rounded-lg" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function Home() {
  const websiteStructuredData = generateWebsiteStructuredData();
  const organizationStructuredData = generateEducationalOrganizationStructuredData();

  const combinedStructuredData = [
    websiteStructuredData,
    organizationStructuredData
  ];

  return (
    <>
      <StructuredData data={combinedStructuredData} id="homepage-structured-data" />
      <div className="min-h-screen">
        <Header />
        <main className="pt-14 sm:pt-16">
          <Suspense fallback={<HomeLoading />}>
            <NewDemoHero />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}
