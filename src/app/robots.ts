import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/auth/",
          "/profile/",
          "/collections/*/private",
          "/*?*", // Исключаем параметры запроса из индексации
        ],
        crawlDelay: 1,
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/dictionary",
          "/lessons",
          "/goethe-exam-preparation",
          "/work-in-germany",
          "/relocation",
          "/education-in-germany",
          "/housing",
          "/healthcare",
          "/culture",
        ],
        disallow: [
          "/api/",
          "/auth/",
          "/profile/",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/auth/", "/profile/"],
        crawlDelay: 2,
      },
    ],
    sitemap: "https://yourdeutsch.com/sitemap.xml",
    host: "https://yourdeutsch.com",
  };
}
