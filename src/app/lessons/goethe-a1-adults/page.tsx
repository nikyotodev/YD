import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoetheExam } from "@/components/GoetheExam";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StructuredData } from "@/components/StructuredData";
import { getExamConfig } from "@/types/exams";
import { generateCourseStructuredData } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Экзамен Goethe A1 для взрослых онлайн | Подготовка и тест | YourDeutsch",
  description: "📝 Пройдите пробный экзамен Goethe-Zertifikat A1 для взрослых бесплатно онлайн. Официальный формат теста, автоматическая проверка, мгновенные результаты. Подготовьтесь к сертификации немецкого языка уровня A1 с YourDeutsch!",
  keywords: [
    "goethe a1 экзамен онлайн",
    "гёте а1 тест бесплатно",
    "пробный тест goethe a1 взрослые",
    "экзамен немецкого a1 2025",
    "goethe zertifikat a1 preparation",
    "немецкий язык сертификат а1",
    "бесплатный тест немецкого а1",
    "подготовка к goethe a1 онлайн",
    "deutsche prüfung a1",
    "german a1 exam online",
    "goethe institut a1 test"
  ],
  openGraph: {
    title: "Экзамен Goethe A1 для взрослых онлайн | YourDeutsch",
    description: "📝 Пройдите официальный пробный тест Goethe A1 бесплатно и получите детальную оценку знаний немецкого языка",
    type: "website",
    locale: "ru_RU",
    url: "https://yourdeutsch.com/lessons/goethe-a1-adults",
    siteName: "YourDeutsch",
    images: [
      {
        url: "https://yourdeutsch.com/og-goethe-a1.png",
        width: 1200,
        height: 630,
        alt: "Экзамен Goethe A1 для взрослых",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Экзамен Goethe A1 для взрослых | YourDeutsch",
    description: "📝 Бесплатный пробный тест Goethe A1 с автоматической проверкой",
    images: ["https://yourdeutsch.com/og-goethe-a1.png"],
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
  alternates: {
    canonical: "https://yourdeutsch.com/lessons/goethe-a1-adults",
  },
};

export default function GoetheA1AdultsPage() {
  const examConfig = getExamConfig("a1-adults");

  if (!examConfig) {
    return <div>Экзамен не найден</div>;
  }

  // Структурированные данные для курса
  const courseStructuredData = generateCourseStructuredData({
    name: 'Экзамен Goethe A1 для взрослых',
    description: 'Пробный экзамен Goethe-Zertifikat A1 для взрослых с автоматической проверкой и детальной обратной связью',
    level: 'A1',
    url: '/lessons/goethe-a1-adults',
    duration: 'P90D'
  });

  // Хлебные крошки
  const breadcrumbItems = [
    { name: 'Уроки', url: '/lessons' },
    { name: 'Goethe A1 для взрослых', url: '/lessons/goethe-a1-adults' }
  ];

  return (
    <>
      <StructuredData data={courseStructuredData} id="goethe-a1-course-structured-data" />
      <div className="min-h-screen">
        <Header />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-4">
            <Breadcrumbs items={breadcrumbItems} className="mb-6" />
          </div>
          <GoetheExam examConfig={examConfig} />
        </main>
        <Footer />
      </div>
    </>
  );
}
