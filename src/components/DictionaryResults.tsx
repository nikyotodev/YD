"use client";
import { useState, useEffect } from "react";
import { Volume2, Copy, Check, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddToCollectionButton } from "@/components/AddToCollectionButton";
import {
  tatoebaService,
  type ProcessedTatoebaExample,
} from "@/lib/tatoeba-service";
import type { ProcessedDictionaryResult } from "@/types/dictionary";
interface DictionaryResultsProps {
  results: ProcessedDictionaryResult;
  onAddToCollection?: (word: string, translation: string) => void;
  className?: string;
}
export default function DictionaryResults({
  results,
  className,
}: DictionaryResultsProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [tatoebaExamples, setTatoebaExamples] = useState<
    ProcessedTatoebaExample[]
  >([]);
  const [loadingExamples, setLoadingExamples] = useState(false);
  // Загружаем примеры из Tatoeba API
  useEffect(() => {
    const loadExamples = async () => {
      if (!results.hasResults || !results.word) {
        return;
      }
      setLoadingExamples(true);
      try {
        // Определяем направление поиска
        const isGermanToRussian = results.direction.startsWith("de");
        let examples: ProcessedTatoebaExample[] = [];
        if (isGermanToRussian) {
          // Поиск примеров для немецкого слова
          const searchWord = results.germanArticle
            ? results.word // убираем артикль для поиска
            : results.word;
          examples = await tatoebaService.searchExamples(searchWord, 3);
        } else {
          // Поиск обратных примеров для русского слова
          examples = await tatoebaService.searchReverseExamples(
            results.word,
            3,
          );
        }
        setTatoebaExamples(examples);
      } catch (error) {
        // В случае ошибки просто не показываем примеры
        setTatoebaExamples([]);
      } finally {
        setLoadingExamples(false);
      }
    };
    loadExamples();
  }, [
    results.word,
    results.direction,
    results.hasResults,
    results.germanArticle,
  ]);
  // Копирование в буфер обмена
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch {
      // Fallback для старых браузеров
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };
  // Воспроизведение произношения
  const playPronunciation = (text: string, lang: string) => {
    if ("speechSynthesis" in window) {
      setPlayingAudio(text);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "de" ? "de-DE" : "ru-RU";
      utterance.rate = 0.8;
      utterance.onend = () => setPlayingAudio(null);
      utterance.onerror = () => setPlayingAudio(null);
      speechSynthesis.speak(utterance);
    }
  };
  // Получение цвета артикля
  const getArticleColor = (article: string) => {
    switch (article) {
      case "der":
        return "bg-blue-500 text-white";
      case "die":
        return "bg-red-500 text-white";
      case "das":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  if (!results.hasResults) {
    return (
      <Card className={`border-0 shadow-lg ${className || ""}`}>
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            Ничего не найдено
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Попробуйте другое слово или проверьте правописание
          </p>
        </CardContent>
      </Card>
    );
  }
  const primaryDefinition = results.definitions[0];
  const primaryTranslation = primaryDefinition?.translations[0];
  if (!primaryDefinition || !primaryTranslation) {
    return null;
  }
  // Формируем полное слово с артиклем
  const fullGermanWord = results.germanArticle
    ? `${results.germanArticle.article} ${results.word}`
    : results.word;
  const mainTranslation = primaryTranslation.text;
  return (
    <div className={`space-y-4 ${className || ""}`}>
      {/* Основная карточка слова */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardContent className="p-8">
          {/* Заголовок с артиклем и словом */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {results.germanArticle && (
                <div
                  className={`px-4 py-2 rounded-xl font-bold text-lg ${getArticleColor(results.germanArticle.article)} shadow-md`}
                >
                  {results.germanArticle.article}
                </div>
              )}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {results.word}
                </h2>
                {primaryDefinition.transcription && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    [{primaryDefinition.transcription}]
                  </p>
                )}
              </div>
            </div>
            {/* Кнопки действий */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(fullGermanWord)}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {copiedText === fullGermanWord ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  playPronunciation(
                    results.word,
                    results.direction.startsWith("de") ? "de" : "ru",
                  )
                }
                disabled={playingAudio === results.word}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Volume2
                  className={`h-4 w-4 ${playingAudio === results.word ? "animate-pulse text-german-red dark:text-dark-theme-purple" : ""}`}
                />
              </Button>
              <AddToCollectionButton
                germanWord={fullGermanWord}
                translation={mainTranslation}
                examples={tatoebaExamples.map((ex) => ({
                  germanSentence: ex.german,
                  sentence: ex.german,
                  translation: ex.russian,
                  level: "A1",
                }))}
                variant="default"
              />
            </div>
          </div>
          {/* Перевод */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {mainTranslation}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(mainTranslation)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {copiedText === mainTranslation ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    playPronunciation(
                      mainTranslation,
                      results.direction.endsWith("ru") ? "ru" : "de",
                    )
                  }
                  disabled={playingAudio === mainTranslation}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Volume2
                    className={`h-4 w-4 ${playingAudio === mainTranslation ? "animate-pulse text-german-red dark:text-dark-theme-purple" : ""}`}
                  />
                </Button>
              </div>
            </div>
            {/* Альтернативные переводы */}
            {primaryDefinition.translations.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {primaryDefinition.translations
                  .slice(1, 4)
                  .map((translation) => (
                    <Badge
                      key={`translation-${translation.text}-${translation.partOfSpeech || "default"}`}
                      variant="secondary"
                      className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => copyToClipboard(translation.text)}
                    >
                      {translation.text}
                    </Badge>
                  ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Примеры из Tatoeba */}
      {(tatoebaExamples.length > 0 || loadingExamples) && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-german-gold dark:text-dark-theme-pink" />
              Примеры использования
            </h3>
            {loadingExamples ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {tatoebaExamples.map((example) => (
                  <div
                    key={example.id}
                    className="group p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-white flex-1">
                        {example.german}
                      </p>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(example.german)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            playPronunciation(example.german, "de")
                          }
                          className="h-6 w-6 p-0"
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-start justify-between">
                      <p className="text-gray-600 dark:text-gray-300 flex-1">
                        {example.russian}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(example.russian)}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {tatoebaExamples.length === 0 && !loadingExamples && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    Примеры не найдены
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
