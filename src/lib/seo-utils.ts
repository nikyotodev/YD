import type { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
  robots?: string;
  structuredData?: Record<string, unknown>;
}

const DEFAULT_OG_IMAGE = '/og-default.png';
const BASE_URL = 'https://yourdeutsch.com';

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonical,
    ogImage = DEFAULT_OG_IMAGE,
    alternates,
    robots = 'index, follow'
  } = config;

  const fullTitle = title.includes('YourDeutsch')
    ? title
    : `${title} | YourDeutsch`;

  const canonicalUrl = canonical
    ? `${BASE_URL}${canonical}`
    : undefined;

  return {
    title: fullTitle,
    description,
    keywords: [
      ...keywords,
      'немецкий язык',
      'deutsche sprache',
      'german learning',
      'yourdeutsch',
      'goethe exam'
    ],
    robots,
    alternates: {
      canonical: canonicalUrl,
      ...alternates
    },
    openGraph: {
      title: fullTitle,
      description,
      type: 'website',
      locale: 'ru_RU',
      url: canonicalUrl,
      siteName: 'YourDeutsch',
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`],
    },
  };
}

export function generateStructuredData(type: string, data: Record<string, unknown>) {
  const baseStructure = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  };

  return baseStructure;
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return generateStructuredData('BreadcrumbList', {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`
    }))
  });
}

export function generateWebsiteStructuredData() {
  return generateStructuredData('WebSite', {
    name: 'YourDeutsch',
    alternateName: 'YD - Изучение немецкого языка',
    url: BASE_URL,
    description: 'Персональная платформа изучения немецкого языка с ИИ-помощником и подготовкой к экзаменам Goethe',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/dictionary?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'YourDeutsch',
      url: BASE_URL,
      logo: `${BASE_URL}/logo-d-german-flag-improved2.svg`
    }
  });
}

export function generateEducationalOrganizationStructuredData() {
  return generateStructuredData('EducationalOrganization', {
    name: 'YourDeutsch',
    url: BASE_URL,
    description: 'Онлайн платформа для изучения немецкого языка с ИИ-помощником',
    educationalLevel: 'A1, A2, B1, B2, C1',
    educationalCredentialAwarded: 'Подготовка к экзаменам Goethe',
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      name: 'Goethe Certificate',
      description: 'Подготовка к международным экзаменам по немецкому языку'
    },
    offers: {
      '@type': 'Offer',
      category: 'Образование',
      description: 'Бесплатное изучение немецкого языка онлайн',
      price: '0',
      priceCurrency: 'RUB'
    }
  });
}

export function generateCourseStructuredData(courseData: {
  name: string;
  description: string;
  level: string;
  url: string;
  duration?: string;
}) {
  return generateStructuredData('Course', {
    name: courseData.name,
    description: courseData.description,
    url: `${BASE_URL}${courseData.url}`,
    courseCode: courseData.level,
    educationalLevel: courseData.level,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'YourDeutsch',
      url: BASE_URL
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      duration: courseData.duration || 'P30D',
      instructor: {
        '@type': 'Person',
        name: 'ИИ-помощник YourDeutsch',
        description: 'Персональный помощник для изучения немецкого языка'
      }
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock'
    }
  });
}

export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return generateStructuredData('FAQPage', {
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  });
}
