import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'sans-serif']
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  fallback: ['monospace']
});
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://yourdeutsch.com' : 'http://localhost:3000'),
  title: "YourDeutsch - Your German, Your Way | Изучайте немецкий с ИИ",
  description:
    "YourDeutsch - персональная платформа изучения немецкого языка с ИИ-помощником. Экзамены Goethe A1-C1, умный словарь, интерактивные уроки. Your German, Your Way!",
  manifest: "/manifest.json",
  keywords: [
    "yourdeutsch",
    "deutsch lernen",
    "немецкий язык",
    "goethe экзамен",
    "german learning",
    "ИИ помощник",
  ],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/favicons/apple-touch-icon.svg", sizes: "180x180" }],
  },
  openGraph: {
    title: "YourDeutsch - Your German, Your Way",
    description:
      "Персональная платформа изучения немецкого языка с экзаменами Goethe A1-C1 и ИИ-помощником",
    type: "website",
    locale: "ru_RU",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "YourDeutsch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YourDeutsch - Your German, Your Way",
    description:
      "Изучайте немецкий язык с персональным ИИ-помощником и готовьтесь к Goethe",
    images: ["/og-image.png"],
  },
};
export const viewport: Viewport = {
  themeColor: "#3b82f6",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Resource hints для производительности */}
        <link rel="dns-prefetch" href="//raw.githubusercontent.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://dictionary.yandex.net" />
        {/* Иконки и манифест */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          href="/favicons/apple-touch-icon.svg"
          sizes="180x180"
        />
        <link rel="manifest" href="/manifest.json" />
        {/* Preload критических ресурсов */}
        <link rel="preload" href="/manifest.json" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/favicon.svg" as="image" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
