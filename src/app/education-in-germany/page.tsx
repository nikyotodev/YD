import type { Metadata } from "next";
import { EducationPage } from "@/components/education/EducationPage";
export const metadata: Metadata = {
  title: "Учеба в Германии | Поступление в немецкие университеты | YourDeutsch",
  description: "Полный гид по поступлению в немецкие университеты. Требования, стоимость, программы обучения, стипендии. Получите бесплатное образование в Германии.",
  keywords: [
    "учеба в Германии",
    "немецкие университеты",
    "поступление в Германию",
    "образование в Германии",
    "студенческая виза Германия",
    "стипендии Германия",
    "DAAD",
    "бесплатное образование",
    "магистратура в Германии",
    "бакалавриат в Германии"
  ],
  openGraph: {
    title: "Учеба в Германии - Поступление в университеты",
    description: "Узнайте как поступить в немецкий университет. Требования, документы, стоимость, программы обучения. Бесплатные консультации.",
    type: "website",
    locale: "ru_RU",
    siteName: "YourDeutsch",
  },
  twitter: {
    card: "summary_large_image",
    title: "Учеба в Германии - Поступление в университеты",
    description: "Полный гид по поступлению в немецкие университеты. Бесплатное образование в Европе.",
  },
  alternates: {
    canonical: "/education-in-germany",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};
export default function EducationInGermanyPage() {
  return <EducationPage />;
}
