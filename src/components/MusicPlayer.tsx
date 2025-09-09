"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Heart,
  Download,
  Share,
  MoreHorizontal,
} from "lucide-react";
interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  audioUrl?: string;
  imageUrl?: string;
}
interface MusicPlayerProps {
  songs: Song[];
  currentSongId: string | null;
  onSongChange: (songId: string | null) => void;
  className?: string;
}
export function MusicPlayer({
  songs,
  currentSongId,
  onSongChange,
  className = "",
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const currentSong = songs.find((song) => song.id === currentSongId);
  const currentIndex = songs.findIndex((song) => song.id === currentSongId);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    // Используем демо-аудио для примера (в реальном проекте здесь были бы настоящие треки)
    audio.src =
      currentSong.audioUrl ||
      "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav";
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong, isRepeat]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };
  const handleNext = () => {
    if (!songs.length) return;
    let nextIndex = currentIndex + 1;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * songs.length);
    } else if (nextIndex >= songs.length) {
      nextIndex = 0;
    }
    onSongChange(songs[nextIndex].id);
    setIsPlaying(true);
  };
  const handlePrevious = () => {
    if (!songs.length) return;
    let prevIndex = currentIndex - 1;
    if (isShuffle) {
      prevIndex = Math.floor(Math.random() * songs.length);
    } else if (prevIndex < 0) {
      prevIndex = songs.length - 1;
    }
    onSongChange(songs[prevIndex].id);
    setIsPlaying(true);
  };
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar || !duration) return;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };
  const formatTime = (time: number) => {
    if (Number.isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  const progress = duration ? (currentTime / duration) * 100 : 0;
  if (!currentSong) {
    return (
      <div
        className={`glass-card bg-gradient-to-r from-german-red/10 to-german-gold/10 border border-white/20 ${className}`}
      >
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">
            Выберите песню для воспроизведения
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <audio ref={audioRef} preload="metadata">
        <track kind="captions" label="Audio captions" />
      </audio>
      <div
        className={`glass-card bg-gradient-to-r from-german-red/10 to-german-gold/10 border border-white/20 ${className}`}
      >
        <div className="flex items-center space-x-4">
          {/* Song Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="w-16 h-16 bg-gradient-to-br from-german-red/20 to-german-gold/20 rounded-xl flex items-center justify-center">
              <Play className="h-6 w-6 text-german-red" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-foreground truncate">
                {currentSong.title}
              </h4>
              <p className="text-sm text-muted-foreground truncate">
                {currentSong.artist}
              </p>
            </div>
          </div>
          {/* Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsShuffle(!isShuffle)}
              className={`glass glass-hover ${isShuffle ? "text-german-red" : "text-muted-foreground"}`}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              className="glass glass-hover"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              onClick={togglePlayPause}
              className="glass glass-hover bg-german-red/20 hover:bg-german-red/30 w-10 h-10"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              className="glass glass-hover"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRepeat(!isRepeat)}
              className={`glass glass-hover ${isRepeat ? "text-german-red" : "text-muted-foreground"}`}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
          {/* Additional Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={`glass glass-hover ${isLiked ? "text-red-400" : "text-muted-foreground"}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className="glass glass-hover"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <div className="w-20 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-german-red transition-all"
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="mt-4 space-y-2">
          <div
            ref={progressRef}
            className="w-full h-2 bg-white/20 rounded-full cursor-pointer overflow-hidden"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-gradient-to-r from-german-red to-german-gold transition-all rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
