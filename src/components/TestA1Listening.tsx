"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollablePDFViewer } from "@/components/ScrollablePDFViewer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { getTestA1AudioUrl, getTestA1PdfUrl } from "@/lib/media-utils";
import {
  Play,
  RotateCcw,
  Clock,
  Headphones,
  Download,
  FileText,
} from "lucide-react";
export function TestA1Listening() {
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes
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
    setTimeLeft(20 * 60);
    setIsCompleted(false);
  }, []);
  // Стартовая страница
  if (!isStarted) {
    return (
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
              A1 • Аудирование • Goethe-Institut
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
              Экзамен Goethe A1 - Аудирование
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Оригинальный экзамен Goethe-Institut Start Deutsch 1 с
              интерактивным аудиоплеером
            </p>
          </div>
          <Card className="glass border-2 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Headphones className="h-5 w-5" />
                <span>Инструкции к экзамену</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="glass p-4 rounded-xl">
                    <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">20 минут</div>
                    <div className="text-sm text-muted-foreground">
                      Время на экзамен
                    </div>
                  </div>
                  <div className="glass p-4 rounded-xl">
                    <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">PDF + MP3</div>
                    <div className="text-sm text-muted-foreground">
                      Задания и аудио
                    </div>
                  </div>
                  <div className="glass p-4 rounded-xl">
                    <Headphones className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">12:22 мин</div>
                    <div className="text-sm text-muted-foreground">
                      Длительность аудио
                    </div>
                  </div>
                </div>
                <div className="text-left space-y-3">
                  <h3 className="font-semibold">Особенности экзамена:</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Полный PDF экзамена отображается на экране</li>
                    <li>Интерактивный аудиоплеер с возможностью перемотки</li>
                    <li>Можно увеличивать/уменьшать масштаб PDF</li>
                    <li>Навигация по страницам документа</li>
                    <li>Таймер отсчитывает время экзамена</li>
                  </ul>
                </div>
                <div className="flex items-center justify-center space-x-4 pt-4">
                  <Button asChild variant="outline">
                    <a
                      href={getTestA1PdfUrl(
                        "fit1_uebungssatz_01_compressed.pdf",
                      )}
                      download
                    >
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
            <Badge className="mb-4 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
              Экзамен завершен
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Время вышло!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Экзамен A1 - Аудирование завершен. На реальном экзамене сейчас бы
              началась проверка ответов.
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
      {/* Новый надежный аудиоплеер */}
      <div className="fixed top-16 sm:top-20 left-2 right-2 sm:left-4 sm:right-4 z-50">
        <AudioPlayer
          src={getTestA1AudioUrl("a1_exam_deutsch.mp3")}
          title="Экзамен Goethe A1 - Аудирование"
          timeLeft={timeLeft}
        />
      </div>
      {/* PDF Viewer */}
      <div className="container mx-auto px-2 sm:px-4 mt-24 sm:mt-28">
        <ScrollablePDFViewer
          pdfUrl={getTestA1PdfUrl("fit1_uebungssatz_01_compressed.pdf")}
          title="Экзамен Goethe A1 - Аудирование"
          maxWidth="100%"
          maxHeight="calc(100vh - 200px)"
          className="mb-4 sm:mb-8"
        />
      </div>
    </div>
  );
}
