import type { Metadata } from 'next';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LessonsPage } from "@/components/LessonsPage";
import { StructuredData } from "@/components/StructuredData";
import { generateCourseStructuredData, generateFAQStructuredData } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Уроки немецкого языка онлайн | Подготовка к Goethe A1-C1 | YourDeutsch",
  description: "🎓 Интерактивные уроки немецкого языка для всех уровней: A1, A2, B1, B2, C1. Подготовка к экзаменам Goethe с ИИ-помощником, тесты на аудирование, персонализированные сценарии. Начните изучение бесплатно!",
  keywords: [
    "уроки немецкого языка",
    "goethe exam preparation",
    "подготовка к экзамену goethe",
    "немецкий язык онлайн уроки",
    "deutsch lernen lektionen",
    "german lessons online",
    "тесты по немецкому a1 a2 b1 b2 c1",
    "аудирование немецкий язык",
    "интерактивные уроки немецкого",
    "персонализированное обучение немецкому"
  ],
  openGraph: {
    title: "Уроки немецкого языка онлайн | Подготовка к Goethe A1-C1",
    description: "🎓 Интерактивные уроки немецкого для всех уровней с ИИ-помощником и подготовкой к экзаменам Goethe",
    type: "website",
    locale: "ru_RU",
    url: "https://yourdeutsch.com/lessons",
    siteName: "YourDeutsch",
    images: [
      {
        url: "https://yourdeutsch.com/og-lessons.png",
        width: 1200,
        height: 630,
        alt: "YourDeutsch - Уроки немецкого языка",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Уроки немецкого языка онлайн | YourDeutsch",
    description: "🎓 Интерактивные уроки и подготовка к экзаменам Goethe A1-C1",
    images: ["https://yourdeutsch.com/og-lessons.png"],
  },
  alternates: {
    canonical: "https://yourdeutsch.com/lessons",
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

export default function Lessons() {
  // Структурированные данные для курсов
  const coursesStructuredData = [
    generateCourseStructuredData({
      name: 'Подготовка к Goethe A1 для взрослых',
      description: 'Интерактивный курс подготовки к экзамену Goethe A1 с персональным ИИ-помощником',
      level: 'A1',
      url: '/lessons/goethe-a1-adults',
      duration: 'P60D'
    }),
    generateCourseStructuredData({
      name: 'Подготовка к Goethe B2 для взрослых',
      description: 'Продвинутый курс подготовки к экзамену Goethe B2 с практическими заданиями',
      level: 'B2',
      url: '/lessons/goethe-b2-adults',
      duration: 'P90D'
    }),
    generateCourseStructuredData({
      name: 'Персонализированные ИИ-сценарии',
      description: 'Индивидуальные диалоги и сценарии для практики немецкого языка с ИИ',
      level: 'A1-C1',
      url: '/lessons/ai-scenarios',
      duration: 'P30D'
    })
  ];

  // FAQ структурированные данные
  const faqStructuredData = generateFAQStructuredData([
    {
      question: 'Какие уровни доступны для изучения?',
      answer: 'Мы предлагаем курсы для всех уровней: A1, A2, B1, B2 и C1 согласно европейскому стандарту CEFR.'
    },
    {
      question: 'Можно ли подготовиться к экзамену Goethe?',
      answer: 'Да, у нас есть специализированные курсы подготовки к экзаменам Goethe для всех уровней с практическими заданиями и тестами.'
    },
    {
      question: 'Что такое персонализированные ИИ-сценарии?',
      answer: 'Это уникальные диалоги и ситуации, созданные искусственным интеллектом специально для вашего уровня и интересов.'
    },
    {
      question: 'Доступны ли уроки бесплатно?',
      answer: 'Да, базовые уроки и тесты доступны бесплатно. Создайте аккаунт для доступа к дополнительным функциям.'
    }
  ]);

  const combinedStructuredData = [...coursesStructuredData, faqStructuredData];

  return (
    <>
      <StructuredData data={combinedStructuredData} id="lessons-structured-data" />
      <div className="min-h-screen">
        <Header />
        <main>
          <LessonsPage />
        </main>
        <Footer />
      </div>
    </>
  );
}
