"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollablePDFViewer } from "@/components/ScrollablePDFViewer";
import { AudioPlayer } from "@/components/AudioPlayer";
import {
  getGoetheAudioUrl,
  getGoethePdfUrl,
  getLevelColor,
} from "@/lib/media-utils";
import type { ExamConfig } from "@/types/exams";
import {
  Play,
  RotateCcw,
  Clock,
  Headphones,
  Download,
  FileText,
  Award,
  Users,
} from "lucide-react";
interface GoetheExamProps {
  examConfig: ExamConfig;
}
export function GoetheExam({ examConfig }: GoetheExamProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(examConfig.duration * 60); // конвертируем минуты в секунды
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Форматирование времени
  const formatTime = useCallback((seconds: number) => {
    if (!seconds || Number.isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);
  // Таймер экзамена
  useEffect(() => {
    if (isStarted && timeLeft > 0 && !isCompleted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isStarted, timeLeft, isCompleted]);
  // Запуск экзамена
  const handleStart = useCallback(() => {
    setIsStarted(true);
  }, []);
  // Перезапуск теста
  const restartTest = useCallback(() => {
    setIsStarted(false);
    setTimeLeft(examConfig.duration * 60);
    setIsCompleted(false);
  }, [examConfig.duration]);
  // Получаем URL файлов
  const audioUrl = getGoetheAudioUrl(examConfig.level, examConfig.category);
  const pdfUrl = getGoethePdfUrl(examConfig.level, examConfig.category);
  // Стартовая страница
  if (!isStarted) {
    return (
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <Badge className={`mb-4 ${getLevelColor(examConfig.level)}`}>
              {examConfig.level} • Goethe-Institut • Официальный
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
              {examConfig.fullTitle}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {examConfig.description}
            </p>
          </div>
          <Card className="glass border-2 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Информация об экзамене</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div className="glass p-4 rounded-xl">
                    <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">
                      {examConfig.duration} минут
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Время на экзамен
                    </div>
                  </div>
                  <div className="glass p-4 rounded-xl">
                    <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">PDF + MP3</div>
                    <div className="text-sm text-muted-foreground">
                      Материалы
                    </div>
                  </div>
                  <div className="glass p-4 rounded-xl">
                    <Headphones className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">
                      {examConfig.audioDuration}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Длительность аудио
                    </div>
                  </div>
                  <div className="glass p-4 rounded-xl">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">
                      {examConfig.category === "All"
                        ? "Все группы"
                        : examConfig.category === "Vzroslie"
                          ? "Взрослые"
                          : "Молодежь"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Целевая группа
                    </div>
                  </div>
                </div>
                <div className="text-left space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Навыки:</h3>
                    <div className="flex flex-wrap gap-2">
                      {examConfig.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-sm"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      Особенности экзамена:
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      {examConfig.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-4 pt-4">
                  <Button asChild variant="outline">
                    <a href={pdfUrl} download>
                      <Download className="h-4 w-4 mr-2" />
                      Скачать PDF
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="text-center">
            <Button
              onClick={handleStart}
              size="lg"
              className="px-8 py-4 text-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Начать экзамен
            </Button>
          </div>
        </div>
      </div>
    );
  }
  // Страница завершения
  if (isCompleted) {
    return (
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge className={`mb-4 ${getLevelColor(examConfig.level)}`}>
              Экзамен завершен
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Время вышло!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Экзамен {examConfig.title} завершен. На реальном экзамене сейчас
              бы началась проверка ответов.
            </p>
          </div>
          <Card className="glass border-2 mb-8">
            <CardContent className="p-8 text-center">
              <div className="space-y-6">
                <div className="text-center">
                  <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    В реальном экзамене Goethe-Institut после завершения времени
                    экзаменаторы собирают листы ответов для проверки.
                  </p>
                </div>
                <div className="flex justify-center space-x-4">
                  <Button onClick={restartTest} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Пройти снова
                  </Button>
                  <Button asChild>
                    <a href="/lessons">Вернуться к урокам</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="pt-20 pb-4 min-h-screen bg-background">
      {/* Аудиоплеер */}
      <div className="fixed top-16 sm:top-20 left-2 right-2 sm:left-4 sm:right-4 z-50">
        <AudioPlayer
          src={audioUrl}
          title={examConfig.fullTitle}
          timeLeft={timeLeft}
        />
      </div>
      {/* PDF Viewer */}
      <div className="container mx-auto px-2 sm:px-4 mt-24 sm:mt-28">
        <ScrollablePDFViewer
          pdfUrl={pdfUrl}
          title={examConfig.fullTitle}
          maxWidth="100%"
          maxHeight="calc(100vh - 200px)"
          className="mb-4 sm:mb-8"
        />
      </div>
    </div>
  );
}
