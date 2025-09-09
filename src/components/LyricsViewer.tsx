"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  Volume2,
  Eye,
  EyeOff,
  PlayCircle,
  Headphones,
  Star,
  Bookmark,
  Languages,
  Mic,
} from "lucide-react";
interface LyricsLine {
  german: string;
  russian: string;
  pronunciation: string;
  timestamp?: number;
}
interface Vocabulary {
  word: string;
  translation: string;
  type: string;
  difficulty?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
}
interface LyricsViewerProps {
  title: string;
  artist: string;
  lyrics: LyricsLine[];
  vocabulary: Vocabulary[];
  currentTime?: number;
  onWordClick?: (word: string) => void;
  className?: string;
}
export function LyricsViewer({
  title,
  artist,
  lyrics,
  vocabulary,
  currentTime = 0,
  onWordClick,
  className = "",
}: LyricsViewerProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [showPronunciation, setShowPronunciation] = useState(false);
  const [highlightedWords, setHighlightedWords] = useState<Set<string>>(
    new Set(),
  );
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const toggleWordHighlight = (word: string) => {
    const newHighlighted = new Set(highlightedWords);
    if (newHighlighted.has(word)) {
      newHighlighted.delete(word);
    } else {
      newHighlighted.add(word);
    }
    setHighlightedWords(newHighlighted);
  };
  const speakText = (text: string, language: "de" | "ru" = "de") => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "de" ? "de-DE" : "ru-RU";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };
  const renderGermanText = (text: string, lineIndex: number) => {
    return text.split(" ").map((word, wordIndex) => {
      const cleanWord = word.replace(/[,.!?;:]/, "").toLowerCase();
      const vocabularyItem = vocabulary.find(
        (v) => v.word.toLowerCase() === cleanWord,
      );
      const isHighlighted = highlightedWords.has(cleanWord);
      return (
        <span
          key={`${lineIndex}-${word}`}
          className={`
            cursor-pointer transition-all duration-200 hover:bg-white/10 px-1 py-0.5 rounded
            ${vocabularyItem ? "border-b border-dotted border-german-red/50" : ""}
            ${isHighlighted ? "bg-german-gold/20 text-german-gold" : ""}
          `}
          onClick={() => {
            if (vocabularyItem) {
              toggleWordHighlight(cleanWord);
              onWordClick?.(cleanWord);
            }
          }}
          title={
            vocabularyItem
              ? `${vocabularyItem.translation} (${vocabularyItem.type})`
              : undefined
          }
        >
          {word}{" "}
        </span>
      );
    });
  };
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "A1":
        return "bg-green-500/20 text-green-300";
      case "A2":
        return "bg-blue-500/20 text-blue-300";
      case "B1":
        return "bg-german-gold/20 text-german-gold dark:bg-purple-500/20 dark:text-purple-300";
      case "B2":
        return "bg-german-red/20 text-german-red dark:bg-pink-500/20 dark:text-pink-300";
      case "C1":
        return "bg-red-500/20 text-red-300";
      case "C2":
        return "bg-german-black/20 text-german-black";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="glass-card bg-gradient-to-r from-german-red/10 to-german-gold/10 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold gradient-text mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{artist}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => speakText(`${title} by ${artist}`)}
              className="glass glass-hover"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <Badge className="glass-nav">{lyrics.length} строк</Badge>
          </div>
        </div>
        {/* Controls */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTranslation(!showTranslation)}
            className={`glass glass-hover ${showTranslation ? "text-german-red" : "text-muted-foreground"}`}
          >
            <Languages className="h-4 w-4 mr-2" />
            {showTranslation ? "Скрыть перевод" : "Показать перевод"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPronunciation(!showPronunciation)}
            className={`glass glass-hover ${showPronunciation ? "text-german-red" : "text-muted-foreground"}`}
          >
            <Mic className="h-4 w-4 mr-2" />
            {showPronunciation
              ? "Скрыть произношение"
              : "Показать произношение"}
          </Button>
        </div>
      </div>
      {/* Lyrics */}
      <Card className="glass-card bg-gradient-to-br from-white/5 to-white/10 border border-white/20">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-foreground flex items-center">
              <Headphones className="h-5 w-5 mr-2" />
              Текст песни
            </h4>
            <Button
              variant="ghost"
              size="sm"
              className="glass glass-hover"
              onClick={() => setHighlightedWords(new Set())}
            >
              Очистить выделение
            </Button>
          </div>
          <div className="space-y-6">
            {lyrics.map((line, index) => (
              <div
                key={`line-${index}-${line.german.slice(0, 20)}`}
                className={`
                  space-y-2 p-4 rounded-xl transition-all duration-200 cursor-pointer
                  ${selectedLine === index ? "bg-white/10 border border-white/20" : "hover:bg-white/5"}
                `}
                onClick={() =>
                  setSelectedLine(selectedLine === index ? null : index)
                }
              >
                {/* German text */}
                <div className="text-foreground font-medium text-lg leading-relaxed">
                  {renderGermanText(line.german, index)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(line.german, "de");
                    }}
                    className="ml-2 glass glass-hover p-1 h-auto"
                  >
                    <Volume2 className="h-3 w-3" />
                  </Button>
                </div>
                {/* Russian translation */}
                {showTranslation && (
                  <div className="text-muted-foreground flex items-center space-x-2">
                    <span className="flex-1">{line.russian}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(line.russian, "ru");
                      }}
                      className="glass glass-hover p-1 h-auto"
                    >
                      <Volume2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {/* Pronunciation */}
                {showPronunciation && (
                  <div className="text-xs text-muted-foreground/70 font-mono bg-white/5 p-2 rounded">
                    {line.pronunciation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
      {/* Vocabulary Panel */}
      {vocabulary.length > 0 && (
        <Card className="glass-card bg-gradient-to-br from-white/5 to-white/10 border border-white/20">
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-foreground flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Словарь ({vocabulary.length} слов)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {vocabulary.map((word, index) => {
                const isHighlighted = highlightedWords.has(
                  word.word.toLowerCase(),
                );
                return (
                  <div
                    key={`vocab-${word.word}-${index}`}
                    className={`
                      glass-nav p-3 cursor-pointer transition-all duration-200
                      ${isHighlighted ? "bg-german-red/20 border-german-red/50" : "hover:bg-white/10"}
                    `}
                    onClick={() => toggleWordHighlight(word.word.toLowerCase())}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-foreground">
                        {word.word}
                      </div>
                      {word.difficulty && (
                        <Badge
                          className={`text-xs ${getDifficultyColor(word.difficulty)}`}
                        >
                          {word.difficulty}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {word.translation}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <Badge className="text-xs bg-german-red/20 text-german-red border-german-red/30">{word.type}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(word.word, "de");
                        }}
                        className="p-1 h-auto"
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            {highlightedWords.size > 0 && (
              <div className="glass bg-white/5 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <Star className="h-4 w-4 text-yellow-400 mr-2" />
                  <span className="text-sm font-medium text-foreground">
                    Выделенные слова ({highlightedWords.size})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from(highlightedWords).map((word, index) => {
                    const vocabularyItem = vocabulary.find(
                      (v) => v.word.toLowerCase() === word,
                    );
                    return (
                      <Badge
                        key={`highlighted-${word}`}
                        className="bg-german-red/20 text-german-red cursor-pointer hover:bg-german-red/30"
                        onClick={() => toggleWordHighlight(word)}
                      >
                        {vocabularyItem?.word || word}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
