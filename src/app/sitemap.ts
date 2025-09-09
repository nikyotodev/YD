import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://yourdeutsch.com";

  // Основные страницы с высоким приоритетом
  const mainPages = [
    { route: "", priority: 1.0, changeFreq: "daily" as const },
    { route: "/dictionary", priority: 0.9, changeFreq: "daily" as const },
    { route: "/lessons", priority: 0.9, changeFreq: "weekly" as const },
    { route: "/level-test", priority: 0.8, changeFreq: "weekly" as const },
  ];

  // Информационные страницы
  const infoPages = [
    { route: "/work-in-germany", priority: 0.8, changeFreq: "monthly" as const },
    { route: "/relocation", priority: 0.8, changeFreq: "monthly" as const },
    { route: "/education-in-germany", priority: 0.8, changeFreq: "monthly" as const },
    { route: "/goethe-exam-preparation", priority: 0.9, changeFreq: "weekly" as const },
    { route: "/housing", priority: 0.7, changeFreq: "monthly" as const },
    { route: "/healthcare", priority: 0.7, changeFreq: "monthly" as const },
  ];

  // Страницы культуры
  const culturePages = [
    { route: "/culture", priority: 0.6, changeFreq: "monthly" as const },
    { route: "/culture/holidays", priority: 0.6, changeFreq: "monthly" as const },
    { route: "/culture/literature", priority: 0.5, changeFreq: "monthly" as const },
  ];

  // Страницы уроков Goethe
  const goethePages = [
    { route: "/lessons/goethe-a1-adults", priority: 0.8, changeFreq: "weekly" as const },
    { route: "/lessons/goethe-a2-adults", priority: 0.8, changeFreq: "weekly" as const },
    { route: "/lessons/goethe-a2-youngsters", priority: 0.7, changeFreq: "weekly" as const },
    { route: "/lessons/goethe-b1-adults", priority: 0.8, changeFreq: "weekly" as const },
    { route: "/lessons/goethe-b1-youngsters", priority: 0.7, changeFreq: "weekly" as const },
    { route: "/lessons/goethe-b2-adults", priority: 0.8, changeFreq: "weekly" as const },
    { route: "/lessons/goethe-b2-youngsters", priority: 0.7, changeFreq: "weekly" as const },
    { route: "/lessons/goethe-c1", priority: 0.8, changeFreq: "weekly" as const },
    { route: "/lessons/ai-scenarios", priority: 0.7, changeFreq: "weekly" as const },
    { route: "/lessons/test-a1-listening", priority: 0.7, changeFreq: "weekly" as const },
  ];

  // Пользовательские страницы
  const userPages = [
    { route: "/collections", priority: 0.6, changeFreq: "weekly" as const },
    { route: "/chat", priority: 0.6, changeFreq: "daily" as const },
    { route: "/profile", priority: 0.4, changeFreq: "weekly" as const },
    { route: "/auth", priority: 0.3, changeFreq: "yearly" as const },
    { route: "/auth/register", priority: 0.3, changeFreq: "yearly" as const },
  ];

  // Объединяем все страницы
  const allPages = [
    ...mainPages,
    ...infoPages,
    ...culturePages,
    ...goethePages,
    ...userPages
  ];

  return allPages.map(({ route, priority, changeFreq }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority: priority,
  }));
}
