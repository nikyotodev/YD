import type { Metadata } from "next";
import { HousingPage } from "@/components/housing/HousingPage";
export const metadata: Metadata = {
  title: "Поиск жилья в Германии | Полное руководство 2025 | YourDeutsch",
  description: "Полное руководство по поиску квартиры в Германии ✓ Лучшие платформы ✓ Необходимые документы ✓ Города и районы ✓ Пошаговый процесс ✓ Советы экспертов",
  keywords: [
    "поиск квартиры германия",
    "аренда жилья германия",
    "immobilienscout24",
    "wg-gesucht",
    "жилье в берлине",
    "квартира мюнхен",
    "schufa справка",
    "документы для аренды",
    "kaution залог",
    "мигранты германия",
    "переезд в германию",
    "жизнь в германии",
    "недвижимость германия",
    "аренда для иностранцев"
  ],
  openGraph: {
    title: "Поиск жилья в Германии | Полное руководство 2025",
    description: "Полное руководство по поиску квартиры в Германии. Лучшие платформы, документы, процесс поиска и советы экспертов.",
    type: "article",
    locale: "ru_RU",
    siteName: "YourDeutsch",
    images: [
      {
        url: "/logo-d-german-flag-improved2.svg",
        width: 1200,
        height: 630,
        alt: "Поиск жилья в Германии - YourDeutsch"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Поиск жилья в Германии | Полное руководство 2025",
    description: "Полное руководство по поиску квартиры в Германии. Лучшие платформы, документы, процесс поиска и советы экспертов.",
    images: ["/logo-d-german-flag-improved2.svg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  alternates: {
    canonical: "/housing"
  },
  other: {
    "article:author": "YourDeutsch Team",
    "article:section": "Housing",
    "article:tag": "Germany, Housing, Rental, Immigration, Expats"
  }
};
export default function Housing() {
  return <HousingPage />;
}
