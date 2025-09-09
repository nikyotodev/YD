'use client';

import { StructuredData } from './StructuredData';

export function DictionaryStructuredData() {
  const dictionaryStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'YourDeutsch Dictionary',
    description: 'Профессиональный немецко-русский словарь с автоматическим определением языка и ИИ-помощником',
    url: 'https://yourdeutsch.com/dictionary',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock'
    },
    featureList: [
      'Автоматическое определение языка',
      'Перевод через Yandex Dictionary API',
      'ИИ-определение артиклей der/die/das',
      'Сохранение слов в персональные коллекции',
      'Синхронизация между устройствами'
    ],
    inLanguage: ['ru', 'de'],
    availableLanguage: ['Russian', 'German'],
    creator: {
      '@type': 'Organization',
      name: 'YourDeutsch',
      url: 'https://yourdeutsch.com'
    }
  };

  const softwareApplicationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'YourDeutsch Smart Dictionary',
    applicationCategory: 'Language Learning',
    applicationSubCategory: 'Dictionary',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'RUB'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '150'
    }
  };

  const combinedData = [dictionaryStructuredData, softwareApplicationStructuredData];

  return <StructuredData data={combinedData} id="dictionary-structured-data" />;
}
