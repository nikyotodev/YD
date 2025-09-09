"use client";
import { Download, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";
import { memo, useMemo } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Кастомная иконка VK (так как Lucide не имеет VK иконки)
const VKIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.714-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.597v1.575c0 .424-.135.678-1.271.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.597-.491h1.744c.441 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.27.508.22 0 .407-.136.814-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.271.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .779.186.254.795.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z" />
  </svg>
);

export const Footer = memo(function Footer() {
  const footerNav = useMemo(
    () => [
      {
        title: "Платформа",
        links: [
          { name: "AI Чат", href: "/chat" },
          { name: "Словарь", href: "/dictionary" },
          { name: "Уроки", href: "/lessons" },
          { name: "Тест уровня", href: "/level-test" },
          { name: "Коллекции", href: "/collections" },
        ],
      },
      {
        title: "Германия",
        links: [
          { name: "Релокация", href: "/relocation" },
          { name: "Работа", href: "/work-in-germany" },
          { name: "Учеба", href: "/education-in-germany" },
          { name: "Жилье", href: "/housing" },
          { name: "Экзамены Goethe", href: "/goethe-exam-preparation" },
        ],
      },
    ],
    [],
  );

  const socialLinks = useMemo(
    () => [
      {
        icon: MessageCircle,
        href: "https://t.me/yourdeutsch",
        label: "Telegram",
        name: "Telegram",
      },
      {
        icon: VKIcon,
        href: "https://vk.com/yourdeutsch",
        label: "VKontakte",
        name: "VK",
      },
    ],
    [],
  );

  return (
    <footer className="relative overflow-hidden border-t border-border/30 glass">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-gradient-to-br from-german-red/5 to-german-gold/5 rounded-full blur-3xl animate-float dark:from-dark-theme-purple/10 dark:to-dark-theme-pink/10" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-br from-german-gold/5 to-german-red/5 rounded-full blur-3xl animate-float animation-delay-2000 dark:from-dark-theme-pink/10 dark:to-dark-theme-purple/10" />
      </div>

      <div className="relative container mx-auto px-3 sm:px-4">
        {/* Main Footer Content */}
        <div className="py-6 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            {/* Brand Section - расширяем на 2 колонки */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-4 group">
                <div className="h-6 w-6 sm:h-7 sm:w-7">
                  <img
                    src="/logo-d-german-flag-improved2.svg"
                    alt="YourDeutsch Logo"
                    className="h-full w-full transition-transform group-hover:scale-110"
                  />
                </div>
                <h3 className="text-lg font-black gradient-text">
                  YourDeutsch
                </h3>
              </Link>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-md">
                Революционная платформа для изучения немецкого языка с
                персональным AI-помощником и полным погружением в культуру.
              </p>

              {/* Contact - glass стиль */}
              <div className="glass glass-hover rounded-lg p-3 mb-4 w-fit">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-german-red dark:text-dark-theme-pink" />
                  <a
                    href="mailto:info@yourdeutsch.com"
                    className="text-muted-foreground hover:text-german-red dark:hover:text-dark-theme-pink transition-colors font-medium"
                  >
                    info@yourdeutsch.com
                  </a>
                </div>
              </div>

              {/* Social Links - в стиле Header */}
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass glass-hover p-2.5 rounded-lg text-muted-foreground hover:text-german-red dark:hover:text-dark-theme-pink transition-all hover:scale-105 border border-border/20"
                    aria-label={social.label}
                    title={social.name}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}

                {/* Download Button - улучшенный стиль */}
                <a
                  href="/api/download"
                  className="glass glass-hover px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-all flex items-center space-x-1.5 border border-border/20 hover:border-german-red/30 dark:hover:border-dark-theme-pink/30"
                  title="Скачать исходный код проекта"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline font-medium">Скачать</span>
                </a>
              </div>
            </div>

            {/* Navigation Links - только 2 секции */}
            {footerNav.map((section) => (
              <div key={section.title} className="glass glass-hover rounded-lg p-4 border border-border/20">
                <h4 className="font-semibold text-foreground mb-3 text-sm flex items-center">
                  <span className="w-2 h-2 bg-gradient-to-r from-german-red to-german-gold dark:from-dark-theme-purple dark:to-dark-theme-pink rounded-full mr-2" />
                  {section.title}
                </h4>
                <nav className="space-y-2">
                  {section.links.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block text-sm text-muted-foreground hover:text-german-red dark:hover:text-dark-theme-pink transition-all hover:translate-x-1 hover:font-medium"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar - компактный */}
        <div className="py-4 md:py-6 border-t border-border/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            <div className="glass glass-hover rounded-full px-4 py-2 border border-border/20">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-german-red to-german-gold dark:from-dark-theme-purple dark:to-dark-theme-pink rounded-full animate-pulse" />
                  <span className="font-semibold text-foreground">© 2025 YourDeutsch</span>
                </div>
                <span className="hidden sm:inline text-border/60">•</span>
                <span className="hidden sm:inline">Все права защищены</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <div className="glass glass-hover rounded-lg px-3 py-1.5 border border-border/20">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-german-red dark:text-dark-theme-pink">v2.0</span>
                  <span>•</span>
                  <Link
                    href="/privacy"
                    className="hover:text-german-red dark:hover:text-dark-theme-pink transition-colors font-medium"
                  >
                    Конфиденциальность
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});
