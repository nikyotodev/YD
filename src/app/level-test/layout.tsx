import type { Metadata } from 'next';
import { StructuredData } from '@/components/StructuredData';
export const metadata: Metadata = {
  title: 'Тест уровня немецкого языка онлайн | Определите свой уровень A1-C2',
  description: 'Бесплатный тест для определения уровня немецкого языка. Проверьте свои знания по стандартам CEFR: A1, A2, B1, B2, C1, C2. Получите детальный анализ и персональные рекомендации.',
  keywords: 'тест немецкого языка, уровень немецкого, A1 A2 B1 B2 C1 C2, CEFR, онлайн тест, определить уровень',
  openGraph: {
    title: 'Тест уровня немецкого языка онлайн | YourDeutsch',
    description: 'Узнайте свой уровень немецкого языка за 20 минут. Адаптивный тест с мгновенными результатами и рекомендациями.',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'YourDeutsch',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Тест уровня немецкого языка онлайн',
    description: 'Определите свой уровень немецкого языка по стандартам CEFR',
  },
  alternates: {
    canonical: '/level-test',
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
export default function LevelTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalTest",
    "name": "Тест уровня немецкого языка",
    "description": "Определение уровня владения немецким языком по стандартам CEFR",
    "provider": {
      "@type": "Organization",
      "name": "YourDeutsch",
      "url": "https://yourdeutsch.com"
    },
    "educationalLevel": ["A1", "A2", "B1", "B2", "C1", "C2"],
    "teaches": {
      "@type": "Language",
      "name": "German"
    },
    "timeRequired": "PT20M",
    "typicalAgeRange": "16-99",
    "inLanguage": "ru",
    "isAccessibleForFree": true
  };
  return (
    <>
      <StructuredData data={structuredData} />
      {children}
    </>
  );
}
