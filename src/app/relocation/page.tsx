import type { Metadata } from "next";
import { RelocationPage } from "@/components/relocation/RelocationPage";
export const metadata: Metadata = {
  title: "Немецкий для релокации | YourDeutsch - Переезд в Германию",
  description:
    "Полное руководство по релокации в Германию: языковая подготовка, документы, поиск работы, жилье. Изучайте немецкий с YourDeutsch для успешного переезда.",
  keywords: [
    "релокация в германию",
    "переезд в германию",
    "немецкий для релокации",
    "работа в германии",
    "виза в германию",
    "изучение немецкого языка",
    "эмиграция в германию",
    "жизнь в германии",
    "языковая подготовка",
    "goethe экзамен для визы",
  ],
  openGraph: {
    title: "Немецкий для релокации | YourDeutsch",
    description:
      "Полное руководство по релокации в Германию с языковой подготовкой. Изучайте немецкий для успешного переезда.",
    type: "article",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Немецкий для релокации | YourDeutsch",
    description:
      "Полное руководство по релокации в Германию с языковой подготовкой.",
  },
  alternates: {
    canonical: "/relocation",
  },
};
export default function RelocationPageRoute() {
  return <RelocationPage />;
}
