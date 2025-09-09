"use client";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Settings, Trophy, LogIn, Home, BookOpen, MapPin, Bot, Book } from "lucide-react";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useUser } from "@/contexts/UserContext";
import Image from "next/image";
interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  submenu?: Array<{ name: string; href: string }>;
}
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useUser();
  const { openAuthModal } = useAuthModal();
  // Закрытие меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);
  const navItems = useMemo(
    () => [
      { name: "Главная", href: "/", icon: Home },
      {
        name: "Учить",
        href: "/lessons",
        icon: BookOpen,
        submenu: [
          { name: "Уроки", href: "/lessons" },
          { name: "Коллекции слов", href: "/collections" },
          { name: "Тест уровня", href: "/level-test" },
          { name: "Экзамены Goethe", href: "/lessons#goethe-exams" },
        ],
      },
      {
        name: "Германия",
        href: "/relocation",
        icon: MapPin,
        submenu: [
          { name: "Релокация", href: "/relocation" },
          { name: "Работа", href: "/work-in-germany" },
          { name: "Учеба", href: "/education-in-germany" },
          { name: "Жилье", href: "/housing" },
          { name: "Здравоохранение", href: "/healthcare" },
          { name: "Культура и праздники", href: "/culture" },
          { name: "Литература", href: "/culture/literature" },
          { name: "Подготовка к Гёте", href: "/goethe-exam-preparation" },
        ],
      },
      { name: "Словарь", href: "/dictionary", icon: Book },
      { name: "AI", href: "/chat", icon: Bot },
      { name: "Профиль", href: "/profile", icon: User },
    ],
    [],
  );
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    setShowUserMenu(false);
  }, [logout]);
  return (
    <header className="fixed top-0 left-0 right-0 glass border-b border-gray-200/20 dark:border-white/10 z-50">
      <div className="container mx-auto px-3 sm:px-4 h-12 sm:h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Link href="/" className="flex items-center space-x-1 sm:space-x-2">
            <div className="h-5 w-5 sm:h-7 sm:w-7">
              <img
                src="/logo-d-german-flag-improved2.svg"
                alt="YourDeutsch Logo"
                className="h-full w-full"
              />
            </div>
            <h1 className="text-base sm:text-lg font-black gradient-text">
              YourDeutsch
            </h1>
          </Link>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <div key={item.name} className="relative group">
              <Link
                href={item.href}
                className="glass-nav text-muted-foreground hover:text-german-red transition-all font-semibold hover:scale-105 px-3 py-2 text-sm dark:text-gray-300 dark:hover:text-dark-theme-pink flex items-center gap-2 rounded-lg hover:bg-german-red/5 dark:hover:bg-dark-theme-pink/10"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.name}
                {item.submenu && (
                  <svg
                    className="w-3 h-3 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </Link>
              {/* Dropdown Menu */}
              {item.submenu && (
                <div className="absolute top-full left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50">
                  <div className="glass bg-gradient-to-br from-white/95 to-white/90 border border-german-red/20 rounded-lg shadow-xl dark:from-gray-900/95 dark:to-gray-800/90 dark:border-dark-theme-pink/20">
                    <div className="p-2">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2.5 text-sm text-foreground hover:bg-german-red/10 hover:text-german-red dark:hover:bg-dark-theme-pink/10 dark:hover:text-dark-theme-pink rounded-md transition-all font-medium border-l-2 border-transparent hover:border-l-german-red dark:hover:border-l-dark-theme-pink"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
        {/* Theme Toggle & Auth Section */}
        <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
          <ThemeToggle />
          {isAuthenticated && user ? (
            /* User Menu */
            <div className="relative group" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 glass glass-hover px-2 py-1.5 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-german-red/20 to-german-gold/20 dark:from-dark-theme-purple/30 dark:to-dark-theme-pink/30 flex items-center justify-center">
                    <User className="w-4 h-4 text-german-red dark:text-dark-theme-pink" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium text-foreground">
                      {user.name}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-muted-foreground">
                        Ур. {user.gamification.level}
                      </span>
                      <Trophy className="w-3 h-3 text-german-gold dark:text-dark-theme-pink" />
                    </div>
                  </div>
                </div>
              </button>
              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 glass bg-gradient-to-br from-white/95 to-white/90 border border-german-red/20 rounded-lg shadow-xl z-50 dark:from-gray-900/95 dark:to-gray-800/90 dark:border-dark-theme-pink/20">
                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm text-foreground hover:bg-german-red/10 hover:text-german-red dark:hover:bg-dark-theme-pink/10 dark:hover:text-dark-theme-pink rounded-md transition-all font-medium border-l-2 border-transparent hover:border-l-german-red dark:hover:border-l-dark-theme-pink"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Профиль и настройки</span>
                    </Link>
                    <Link
                      href="/collections"
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm text-foreground hover:bg-german-red/10 hover:text-german-red dark:hover:bg-dark-theme-pink/10 dark:hover:text-dark-theme-pink rounded-md transition-all font-medium border-l-2 border-transparent hover:border-l-german-red dark:hover:border-l-dark-theme-pink"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Мои коллекции</span>
                    </Link>
                    <hr className="my-3 border-german-red/20 dark:border-dark-theme-pink/20" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 hover:text-red-600 rounded-md transition-all font-medium border-l-2 border-transparent hover:border-l-red-500"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Выйти</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Auth Buttons */
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="glass glass-hover text-muted-foreground hover:text-german-red dark:hover:text-dark-theme-pink"
                onClick={() => openAuthModal("login")}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Войти
              </Button>
              <Button
                variant="german"
                size="sm"
                onClick={() => openAuthModal("register")}
              >
                Регистрация
              </Button>
            </div>
          )}
        </div>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden glass glass-hover text-muted-foreground hover:text-german-red dark:text-gray-300 dark:hover:text-dark-theme-pink"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-border shadow-lg">
          <nav className="container mx-auto px-3 py-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="block text-gray-900 dark:text-gray-300 hover:text-german-red transition-all font-semibold rounded-lg px-4 py-3 dark:hover:text-dark-theme-pink text-base hover:bg-german-red/10 dark:hover:bg-dark-theme-pink/10 border-l-4 border-transparent hover:border-l-german-red dark:hover:border-l-dark-theme-pink bg-white/80 dark:bg-gray-800/80 mb-1"
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
                {/* Mobile Submenu */}
                {item.submenu && (
                  <div className="ml-6 mt-2 space-y-1 border-l-2 border-german-red/20 dark:border-dark-theme-pink/20 pl-4">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block text-sm text-gray-700 dark:text-gray-400 hover:text-german-red dark:hover:text-dark-theme-pink transition-all px-3 py-2 rounded-md font-medium hover:bg-german-red/5 dark:hover:bg-dark-theme-pink/5 bg-gray-50/80 dark:bg-gray-700/50"
                        onClick={closeMenu}
                      >
                        • {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30 flex-wrap gap-3">
              <ThemeToggle />
              {isAuthenticated && user ? (
                <div className="flex flex-col space-y-2 ml-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{user.name}</span>
                    <span>•</span>
                    <span>Ур. {user.gamification.level}</span>
                    <Trophy className="w-3 h-3 text-german-gold dark:text-dark-theme-pink" />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center space-x-2 glass bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-500 border border-red-500/30 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Выйти</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 ml-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      openAuthModal("login");
                      closeMenu();
                    }}
                    className="w-full glass glass-hover text-muted-foreground"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Войти
                  </Button>
                  <Button
                    variant="german"
                    size="sm"
                    onClick={() => {
                      openAuthModal("register");
                      closeMenu();
                    }}
                    className="w-full"
                  >
                    Регистрация
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}

    </header>
  );
}
