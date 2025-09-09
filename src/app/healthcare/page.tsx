import type { Metadata } from "next";
import { HealthcarePage } from "@/components/healthcare/HealthcarePage";
export const metadata: Metadata = {
  title: "Здравоохранение в Германии | Медицинское страхование и врачи | YourDeutsch",
  description: "Полный гид по немецкой системе здравоохранения: медицинское страхование GKV и PKV, поиск врачей, экстренная помощь, FAQ. Практические советы для жизни в Германии.",
  keywords: [
    "здравоохранение Германии",
    "медицинское страхование Германия",
    "GKV PKV страхование",
    "врачи в Германии",
    "экстренная помощь Германия",
    "Hausarzt семейный врач",
    "больницы Германии",
    "медицина в Германии",
    "страховка Германия",
    "жизнь в Германии здоровье"
  ],
  openGraph: {
    title: "Здравоохранение в Германии - Полный гид по медицинской системе",
    description: "Всё о немецком здравоохранении: страхование, врачи, экстренная помощь. Практические советы для жизни в Германии.",
    images: [
      {
        url: "https://ugc.same-assets.com/RMXDNG23kH9v82FhlVLRFqT9ef6hyi36.jpeg",
        width: 1200,
        height: 630,
        alt: "Немецкая система здравоохранения"
      }
    ],
    type: "website",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Здравоохранение в Германии - Полный гид",
    description: "Всё о немецком здравоохранении: страхование, врачи, экстренная помощь для жизни в Германии.",
    images: ["https://ugc.same-assets.com/RMXDNG23kH9v82FhlVLRFqT9ef6hyi36.jpeg"],
  },
  alternates: {
    canonical: "https://yourdeutsch.com/healthcare"
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
};
export default function Healthcare() {
  return <HealthcarePage />;
}
