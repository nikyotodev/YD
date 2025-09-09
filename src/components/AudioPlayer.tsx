"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Loader2,
  Clock,
} from "lucide-react";
interface AudioPlayerProps {
  src: string;
  title?: string;
  timeLeft?: number;
  className?: string;
}
export function AudioPlayer({
  src,
  title,
  timeLeft,
  className = "",
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  // Форматирование времени
  const formatTime = useCallback((seconds: number) => {
    if (!seconds || Number.isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);
  // Инициализация аудио
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const handleCanPlay = () => {
      setIsLoading(false);
    };
    const handleWaiting = () => {
      setIsLoading(true);
    };
    const handlePlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    const handlePause = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handleError = (e: Event) => {
      console.error("Ошибка загрузки аудио:", e);
      setIsLoading(false);
      setIsPlaying(false);
    };
    // Добавляем обработчики
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    // Загружаем аудио
    audio.load();
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);
  // Управление воспроизведением
  const togglePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (isPlaying) {
        audio.pause();
      } else {
        setIsLoading(true);
        await audio.play();
      }
    } catch (error) {
      console.error("Ошибка воспроизведения:", error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [isPlaying]);
  // Перемотка
  const handleSkip = useCallback(
    (seconds: number) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      audio.currentTime = newTime;
    },
    [currentTime, duration],
  );
  // Переключение звука
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const newMuted = !isMuted;
    audio.muted = newMuted;
    setIsMuted(newMuted);
  }, [isMuted]);
  // Изменение позиции через прогресс-бар
  const handleProgressClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      const progressBar = progressBarRef.current;
      if (!audio || !progressBar || !duration) return;
      const rect = progressBar.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickPosition = clickX / rect.width;
      const newTime = clickPosition * duration;
      audio.currentTime = Math.max(0, Math.min(duration, newTime));
    },
    [duration],
  );
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  return (
    <div className={className}>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        playsInline
        aria-label="Audio player for German pronunciation"
      >
        <track kind="captions" srcLang="de" label="Произношение" />
      </audio>
      <Card className="glass border shadow-lg backdrop-blur-sm">
        <CardContent className="p-1.5">
          {/* Заголовок */}
          {title && (
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs sm:text-sm font-medium truncate hidden sm:block">
                {title}
              </h3>
              <h3 className="text-xs font-medium truncate block sm:hidden">
                A1 Экзамен
              </h3>
              {timeLeft !== undefined && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="h-2.5 w-2.5" />
                  <span
                    className={`font-mono text-xs ${timeLeft < 300 ? "text-red-500" : ""}`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>
              )}
            </div>
          )}
          {/* Контролы */}
          <div className="flex items-center justify-center gap-1 sm:gap-0.5">
            {/* Перемотка назад */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSkip(-10)}
              disabled={!duration || isLoading}
              className="h-8 w-8 sm:h-7 sm:w-7 rounded-full p-0"
              title="Назад 10 сек"
            >
              <RotateCcw className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            </Button>
            {/* Центр: Воспроизведение */}
            <Button
              variant="default"
              size="sm"
              onClick={togglePlayPause}
              disabled={isLoading}
              className="h-10 w-10 sm:h-8 sm:w-8 rounded-full p-0"
              title={isPlaying ? "Пауза" : "Воспроизвести"}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 sm:h-3.5 sm:w-3.5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              ) : (
                <Play className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              )}
            </Button>
            {/* Перемотка вперед */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSkip(10)}
              disabled={!duration || isLoading}
              className="h-8 w-8 sm:h-7 sm:w-7 rounded-full p-0"
              title="Вперед 10 сек"
            >
              <RotateCw className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            </Button>
          </div>
          {/* Прогресс-бар */}
          <div className="mt-1">
            <div
              ref={progressBarRef}
              className="relative h-1 bg-secondary rounded-full cursor-pointer group"
              onClick={handleProgressClick}
            >
              <div
                className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-150"
                style={{ width: `${progressPercentage}%` }}
              />
              <div
                className="absolute top-1/2 w-2 h-2 bg-primary rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                style={{ left: `calc(${progressPercentage}% - 4px)` }}
              />
            </div>
          </div>
          {/* Время и громкость */}
          <div className="flex items-center justify-between mt-1">
            <div className="text-xs text-muted-foreground font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              disabled={!duration}
              className="h-6 w-6 sm:h-5 sm:w-5 rounded-full p-0"
              title={isMuted ? "Включить звук" : "Выключить звук"}
            >
              {isMuted ? (
                <VolumeX className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      <style jsx>{`
        .glass {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(8px);
        }
        .dark .glass {
          background: rgba(0, 0, 0, 0.95);
        }
      `}</style>
    </div>
  );
}
