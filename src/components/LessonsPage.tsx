"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Play,
  Clock,
  Users,
  Star,
  Trophy,
  Award,
  CheckCircle2,
  FileText,
  GraduationCap,
  Headphones,
} from "lucide-react";
import Link from "next/link";
import { EXAM_CONFIGS, getCategoryName } from "@/types/exams";
import { getLevelColor } from "@/lib/media-utils";
interface Lesson {
  id: string;
  title: string;
  description: string;
  level: "A1" | "A2" | "B1" | "B2";
  duration: string;
  students: number;
  rating: number;
  topics: string[];
  isCompleted?: boolean;
  isLocked?: boolean;
}
const lessons: Lesson[] = [
  {
    id: "1",
    title: "Знакомство и приветствие",
    description:
      "Изучите основы немецкого языка: как поздороваться, представиться и завести простой разговор",
    level: "A1",
    duration: "45 мин",
    students: 1250,
    rating: 4.8,
    topics: ["Приветствие", "Представление", "Личная информация"],
    isCompleted: true,
  },
  {
    id: "2",
    title: "Семья и друзья",
    description:
      "Научитесь рассказывать о своей семье, друзьях и близких людях",
    level: "A1",
    duration: "50 мин",
    students: 980,
    rating: 4.9,
    topics: ["Семья", "Родственники", "Описание людей"],
    isCompleted: false,
  },
  {
    id: "3",
    title: "В магазине и покупки",
    description: "Освойте полезные фразы для шопинга и общения с продавцами",
    level: "A1",
    duration: "55 мин",
    students: 765,
    rating: 4.7,
    topics: ["Покупки", "Цены", "Одежда", "Еда"],
    isCompleted: false,
    isLocked: true,
  },
  {
    id: "4",
    title: "Время и распорядок дня",
    description: "Изучите, как говорить время и рассказывать о своем дне",
    level: "A2",
    duration: "60 мин",
    students: 542,
    rating: 4.6,
    topics: ["Время", "Расписание", "Повседневные дела"],
    isCompleted: false,
    isLocked: true,
  },
];
// Убираем дублированную функцию - теперь используем из types/exams
export function LessonsPage() {
  const [selectedTab, setSelectedTab] = useState<"lessons" | "tests">(
    "lessons",
  );
  // Обработка URL параметров и якорных ссылок
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      // Проверяем URL параметр tab
      if (urlParams.get("tab") === "tests") {
        setSelectedTab("tests");
      }
      // Проверяем якорные ссылки для обратной совместимости
      else if (hash === "#goethe-exams" || hash === "#tests") {
        setSelectedTab("tests");
      }
    }
  }, []);
  return (
    <div className="pt-20 pb-16">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 glass bg-primary/5 px-4 py-2 rounded-full mb-6">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">
                Интерактивное обучение
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 gradient-text">
              Уроки немецкого языка
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Структурированные уроки и официальный экзамен Goethe-Institut для
              эффективного изучения немецкого языка
            </p>
            {/* Tab Navigation */}
            <div className="inline-flex glass rounded-full p-1 mb-12">
              <button
                onClick={() => setSelectedTab("lessons")}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  selectedTab === "lessons"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Уроки</span>
                </div>
              </button>
              <button
                onClick={() => setSelectedTab("tests")}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  selectedTab === "tests"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4" />
                  <span>Экзамены Goethe</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {selectedTab === "lessons" ? (
            <div>
              {/* Новая революционная фича */}
              <div className="mb-12">
                <div className="glass p-6 rounded-2xl relative overflow-hidden">
                  {/* Фоновые элементы */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-german-gold/20 to-transparent rounded-full blur-xl" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 glass rounded-full flex items-center justify-center bg-gradient-to-r from-primary/20 to-german-gold/20">
                          <span className="text-2xl">🤖</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold gradient-text">
                            AI-Персонализированные Сценарии
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Революционный подход к изучению немецкого
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-primary to-german-gold text-white border-0">
                        ✨ НОВИНКА
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      Изучайте немецкий через <strong>живые диалоги</strong>,
                      адаптированные под ваши интересы! Футбол, кулинария, IT,
                      путешествия - выберите то, что вам нравится, и погрузитесь
                      в увлекательное обучение.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>∞ Сценариев</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>6 Интересов</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-german-gold text-german-gold dark:fill-pink-400 dark:text-pink-400" />
                          <span>5.0</span>
                        </div>
                      </div>
                      <Link href="/lessons/ai-scenarios">
                        <Button className="glass-hover bg-gradient-to-r from-primary to-german-gold text-white border-0 shadow-lg">
                          <Play className="h-4 w-4 mr-2" />
                          Попробовать AI-сценарии
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="glass p-6 rounded-2xl text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold">3,500+</div>
                  <div className="text-sm text-muted-foreground">Студентов</div>
                </div>
                <div className="glass p-6 rounded-2xl text-center">
                  <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm text-muted-foreground">Уроков</div>
                </div>
                <div className="glass p-6 rounded-2xl text-center">
                  <Star className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold">4.8</div>
                  <div className="text-sm text-muted-foreground">Рейтинг</div>
                </div>
                <div className="glass p-6 rounded-2xl text-center">
                  <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold">95%</div>
                  <div className="text-sm text-muted-foreground">
                    Успешность
                  </div>
                </div>
              </div>
              {/* Lessons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {lessons.map((lesson) => (
                  <Card
                    key={lesson.id}
                    className="group glass glass-hover border-2 relative overflow-hidden"
                  >
                    {lesson.isLocked && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge variant="secondary" className="bg-muted">
                          Скоро
                        </Badge>
                      </div>
                    )}
                    {lesson.isCompleted && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-emerald-500 rounded-full p-1">
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={getLevelColor(lesson.level)}>
                          {lesson.level}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                        {lesson.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {lesson.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Topics */}
                      <div className="flex flex-wrap gap-2">
                        {lesson.topics.map((topic, index) => (
                          <Badge
                            key={topic}
                            variant="outline"
                            className="text-xs"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{lesson.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>
                              {lesson.students
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{lesson.rating}</span>
                        </div>
                      </div>
                      {/* Action Button */}
                      <Button
                        className="w-full"
                        variant={lesson.isCompleted ? "outline" : "default"}
                        disabled={lesson.isLocked}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {lesson.isCompleted
                          ? "Повторить урок"
                          : lesson.isLocked
                            ? "Недоступно"
                            : "Начать урок"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div id="goethe-exams">
              {/* Test Description */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  Экзамены Goethe-Institut
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Полные официальные экзамены всех уровней с оригинальными
                  материалами, интерактивным PDF-просмотром и профессиональным
                  дизайном
                </p>
              </div>
              {/* Exam Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="glass p-6 rounded-2xl text-center">
                  <GraduationCap className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold">
                    {EXAM_CONFIGS.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Экзаменов</div>
                </div>
                <div className="glass p-6 rounded-2xl text-center">
                  <Trophy className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-sm text-muted-foreground">Уровней</div>
                </div>
                <div className="glass p-6 rounded-2xl text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm text-muted-foreground">
                    Возрастные группы
                  </div>
                </div>
                <div className="glass p-6 rounded-2xl text-center">
                  <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-muted-foreground">
                    Официальные
                  </div>
                </div>
              </div>
              {/* Exams Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {EXAM_CONFIGS.map((exam) => {
                  const examRoute =
                    exam.level === "A1" && exam.category === "All"
                      ? "/lessons/test-a1-listening"
                      : exam.level === "C1" && exam.category === "All"
                        ? "/lessons/goethe-c1"
                        : `/lessons/goethe-${exam.level.toLowerCase()}-${exam.category === "Vzroslie" ? "adults" : "youngsters"}`;
                  return (
                    <Card
                      key={exam.id}
                      className="group glass glass-hover border-2 relative overflow-hidden"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className={`px-2 py-1 rounded text-xs font-bold ${getLevelColor(exam.level)}`}
                          >
                            {exam.level}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {getCategoryName(exam.category)}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                          {exam.title}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed">
                          {exam.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Skills */}
                        <div className="flex flex-wrap gap-1">
                          {exam.skills.map((skill, index) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        {/* Stats - Красивое отображение времени */}
                        <div className="glass p-3 rounded-lg space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-primary" />
                              <span className="font-medium">
                                Время экзамена:
                              </span>
                            </div>
                            <span className="font-bold text-foreground">
                              {exam.duration} мин
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <Headphones className="h-4 w-4 text-primary" />
                              <span className="font-medium">Аудио:</span>
                            </div>
                            <span className="font-bold text-foreground">
                              {exam.audioDuration}
                            </span>
                          </div>
                        </div>
                        {/* Action Button */}
                        <Link href={examRoute}>
                          <Button className="w-full">
                            <Play className="h-4 w-4 mr-2" />
                            Начать экзамен
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
