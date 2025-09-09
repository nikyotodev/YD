import type { Metadata } from "next";
import { GoetheExamPage } from "@/components/goethe-exam/GoetheExamPage";
import { StructuredData } from "@/components/StructuredData";
import { generateFAQStructuredData, generateCourseStructuredData } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Подготовка к экзаменам Goethe A1-C2 2025 | Гарантия сдачи | YourDeutsch",
  description: "🎯 Полный гайд по подготовке к экзаменам Goethe всех уровней (A1-C2) 2025. Структура экзамена, практические тесты, советы экспертов. 95% успешной сдачи с YourDeutsch! Начните подготовку бесплатно.",
  keywords: [
    "экзамен goethe 2025",
    "подготовка к goethe зертификат",
    "goethe zertifikat a1 a2 b1 b2 c1 c2",
    "экзамен по немецкому языку",
    "сертификат немецкого языка",
    "структура экзамена goethe",
    "как сдать goethe экзамен",
    "подготовка к немецкому экзамену",
    "goethe institut экзамены",
    "немецкий сертификат онлайн",
    "языковой экзамен германия",
    "тест по немецкому goethe",
    "модульный экзамен goethe",
    "listening reading writing speaking",
    "подготовка к тесту немецкий",
    "deutsche sprachprüfung",
    "german language certificate",
    "goethe exam preparation online"
  ],
  openGraph: {
    title: "Подготовка к экзаменам Goethe A1-C2 2025 | Гарантия сдачи",
    description: "🎯 Полный гайд по подготовке к экзаменам Goethe всех уровней. Практические тесты, советы экспертов. 95% успешной сдачи с YourDeutsch!",
    type: "article",
    locale: "ru_RU",
    url: "https://yourdeutsch.com/goethe-exam-preparation",
    siteName: "YourDeutsch",
    images: [
      {
        url: "https://yourdeutsch.com/og-goethe-exam.png",
        width: 1200,
        height: 630,
        alt: "Подготовка к экзаменам Goethe с YourDeutsch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Подготовка к экзаменам Goethe A1-C2 2025 | YourDeutsch",
    description: "🎯 Полный гайд по подготовке к экзаменам Goethe. 95% успешной сдачи!",
    images: ["https://yourdeutsch.com/og-goethe-exam.png"],
  },
  alternates: {
    canonical: "https://yourdeutsch.com/goethe-exam-preparation",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "article:author": "YourDeutsch Team",
    "article:section": "Education",
    "article:tag": "Goethe Exam, German Language, Test Preparation",
    "article:published_time": "2025-01-01T00:00:00Z",
    "article:modified_time": new Date().toISOString(),
  },
};

export default function GoetheExamPreparationPage() {
  // FAQ структурированные данные для экзамена Goethe
  const goetheFAQStructuredData = generateFAQStructuredData([
    {
      question: 'Сколько времени нужно для подготовки к экзамену Goethe?',
      answer: 'Время подготовки зависит от вашего текущего уровня и целевого уровня экзамена. В среднем: A1 - 2-3 месяца, A2 - 3-4 месяца, B1 - 4-6 месяцев, B2 - 6-8 месяцев, C1 - 8-12 месяцев интенсивной подготовки.'
    },
    {
      question: 'Какие части включает экзамен Goethe?',
      answer: 'Экзамен Goethe состоит из 4 модулей: Чтение (Lesen), Аудирование (Hören), Письмо (Schreiben) и Говорение (Sprechen). Каждый модуль можно сдавать отдельно или все вместе.'
    },
    {
      question: 'Можно ли пересдать отдельные части экзамена Goethe?',
      answer: 'Да, экзамен Goethe имеет модульную структуру. Вы можете пересдать только те части, по которым не набрали проходной балл (60%), в течение одного года.'
    },
    {
      question: 'Сколько стоит экзамен Goethe в России?',
      answer: 'Стоимость экзамена Goethe в России: A1 - около 6,000₽, A2 - 7,000₽, B1 - 8,000₽, B2 - 9,000₽, C1 - 10,000₽, C2 - 11,000₽. Цены могут варьироваться в зависимости от региона.'
    },
    {
      question: 'Действителен ли сертификат Goethe для получения визы?',
      answer: 'Да, сертификат Goethe признается во всех немецкоязычных странах для получения виз, поступления в университеты и трудоустройства. Это официальный международный сертификат.'
    }
  ]);

  // Структурированные данные для курсов подготовки
  const goetheCoursesStructuredData = [
    generateCourseStructuredData({
      name: 'Интенсивная подготовка к Goethe A1',
      description: 'Комплексная подготовка к экзамену Goethe A1 с практическими тестами и персональным сопровождением',
      level: 'A1',
      url: '/lessons/goethe-a1-adults',
      duration: 'P90D'
    }),
    generateCourseStructuredData({
      name: 'Подготовка к Goethe B2',
      description: 'Продвинутый курс подготовки к экзамену Goethe B2 с фокусом на все 4 навыка',
      level: 'B2',
      url: '/lessons/goethe-b2-adults',
      duration: 'P180D'
    }),
    generateCourseStructuredData({
      name: 'Подготовка к Goethe C1',
      description: 'Профессиональная подготовка к экзамену Goethe C1 для продвинутых студентов',
      level: 'C1',
      url: '/lessons/goethe-c1',
      duration: 'P270D'
    })
  ];

  // Структурированные данные для образовательной статьи
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'EducationalPage',
    name: 'Подготовка к экзаменам Goethe A1-C2',
    description: 'Полное руководство по подготовке к экзаменам Goethe всех уровней',
    educationalLevel: 'A1, A2, B1, B2, C1, C2',
    educationalUse: 'Exam Preparation',
    learningResourceType: 'Guide',
    inLanguage: 'ru',
    about: {
      '@type': 'EducationalOccupationalCredential',
      name: 'Goethe Certificate',
      description: 'Международный сертификат немецкого языка'
    },
    author: {
      '@type': 'Organization',
      name: 'YourDeutsch'
    },
    publisher: {
      '@type': 'Organization',
      name: 'YourDeutsch',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yourdeutsch.com/logo-d-german-flag-improved2.svg'
      }
    },
    datePublished: '2025-01-01',
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://yourdeutsch.com/goethe-exam-preparation'
    }
  };

  const combinedStructuredData = [
    goetheFAQStructuredData,
    articleStructuredData,
    ...goetheCoursesStructuredData
  ];

  return (
    <>
      <StructuredData data={combinedStructuredData} id="goethe-exam-structured-data" />
      <GoetheExamPage />
    </>
  );
}
