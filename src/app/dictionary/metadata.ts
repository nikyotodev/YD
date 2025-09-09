import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo-utils';

export const dictionaryMetadata: Metadata = generateMetadata({
  title: "Умный Немецко-русский Словарь с ИИ | YourDeutsch",
  description: "📚 Профессиональный немецко-русский словарь с автоматическим определением языка, переводом от Yandex API и ИИ-помощником. Определение артиклей der/die/das, сохранение слов в коллекции. Бесплатно!",
  keywords: [
    "немецко русский словарь",
    "deutsch russisch wörterbuch",
    "german russian dictionary",
    "немецкий словарь онлайн",
    "перевод с немецкого",
    "deutsche artikel der die das",
    "немецкие артикли",
    "yandex словарь",
    "ии перевод немецкий",
    "немецкий переводчик"
  ],
  canonical: "/dictionary",
  ogImage: "/og-dictionary.png"
});
