import type { Metadata } from "next";
import { WorkPage } from "@/components/work/WorkPage";
import { StructuredData } from "@/components/StructuredData";
import { generateFAQStructuredData } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Работа в Германии 2025 | Вакансии, Зарплаты, Визы | IT, Инженерия | YourDeutsch",
  description: "💼 Полный гид по работе в Германии 2025: актуальные вакансии IT, инженерии, медицины. Зарплаты от 45,000€ до 120,000€, рабочие визы, Blue Card. Изучайте немецкий для успешной карьеры с YourDeutsch!",
  keywords: [
    "работа в германии 2025",
    "вакансии германия русским",
    "зарплаты в германии 2025",
    "рабочая виза германия",
    "работа для русских в германии",
    "IT работа германия",
    "программист германия зарплата",
    "инженер германия работа",
    "поиск работы германия",
    "карьера в германии",
    "трудоустройство германия",
    "blue card германия 2025",
    "немецкий для работы",
    "уровень немецкого для работы в германии",
    "deutschland job vacancies",
    "german work visa",
    "germany IT jobs",
    "arbeitsplätze deutschland"
  ],
  openGraph: {
    title: "Работа в Германии 2025 | Вакансии, Зарплаты, Визы",
    description: "💼 Найдите работу мечты в Германии! Актуальные вакансии IT и инженерии, зарплаты до 120,000€, Blue Card и рабочие визы. Полный гид по трудоустройству.",
    type: "article",
    locale: "ru_RU",
    url: "https://yourdeutsch.com/work-in-germany",
    siteName: "YourDeutsch",
    images: [
      {
        url: "https://yourdeutsch.com/og-work-germany.png",
        width: 1200,
        height: 630,
        alt: "Работа в Германии - Вакансии и Зарплаты",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Работа в Германии 2025 | YourDeutsch",
    description: "💼 Найдите работу мечты в Германии! Актуальные зарплаты, Blue Card, требования к языку",
    images: ["https://yourdeutsch.com/og-work-germany.png"],
  },
  alternates: {
    canonical: "https://yourdeutsch.com/work-in-germany",
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

export default function WorkInGermanyRoute() {
  // Структурированные данные для FAQ о работе в Германии
  const workFAQStructuredData = generateFAQStructuredData([
    {
      question: 'Какая средняя зарплата IT-специалиста в Германии?',
      answer: 'Средняя зарплата IT-специалиста в Германии варьируется от 50,000€ до 120,000€ в год в зависимости от опыта, специализации и города. Программисты получают 60,000-85,000€, DevOps инженеры 70,000-100,000€.'
    },
    {
      question: 'Нужно ли знать немецкий язык для работы в IT в Германии?',
      answer: 'Для многих IT-позиций в крупных международных компаниях достаточно английского языка. Однако знание немецкого языка значительно расширяет возможности трудоустройства и повышает зарплату.'
    },
    {
      question: 'Что такое Blue Card и как её получить?',
      answer: 'EU Blue Card - это разрешение на работу для высококвалифицированных специалистов. Требования: высшее образование, предложение о работе с зарплатой от 43,800€ в год (для IT - от 40,770€).'
    },
    {
      question: 'Какие документы нужны для трудоустройства в Германии?',
      answer: 'Основные документы: диплом о высшем образовании с апостилем, переведённый на немецкий, резюме, сертификаты о знании языка, справка о несудимости.'
    },
    {
      question: 'Сколько времени занимает поиск работы в Германии?',
      answer: 'В среднем поиск работы занимает 3-6 месяцев для IT-специалистов с хорошим английским. Знание немецкого языка может сократить этот период до 1-3 месяцев.'
    }
  ]);

  // Структурированные данные для статьи
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Работа в Германии 2025: Полный гид по трудоустройству',
    description: 'Актуальная информация о работе в Германии: вакансии, зарплаты, визы, требования к языку',
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
      '@id': 'https://yourdeutsch.com/work-in-germany'
    },
    image: {
      '@type': 'ImageObject',
      url: 'https://yourdeutsch.com/og-work-germany.png',
      width: 1200,
      height: 630
    }
  };

  const combinedStructuredData = [workFAQStructuredData, articleStructuredData];

  return (
    <>
      <StructuredData data={combinedStructuredData} id="work-germany-structured-data" />
      <WorkPage />
    </>
  );
}
