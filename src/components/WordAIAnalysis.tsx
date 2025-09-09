"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Sparkles,
  Loader2,
  X,
  Volume2,
  Copy,
  Check,
  Brain,
  BookOpen,
  Lightbulb,
  MessageSquare,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { useSpeech } from "@/hooks/useSpeech";
interface WordAIAnalysisProps {
  word: string;
  translation: string;
  partOfSpeech?: string;
  isOpen: boolean;
  onClose: () => void;
}
interface AIResponse {
  analysis: string;
  examples: Array<{
    german: string;
    russian: string;
    level: string;
  }>;
  tips: string[];
  etymology: string;
  grammar: string;
}
const MODEL = "deepseek/deepseek-chat-v3-0324:free";
export function WordAIAnalysis({
  word,
  translation,
  partOfSpeech,
  isOpen,
  onClose,
}: WordAIAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const { speak, isSupported } = useSpeech();
  useEffect(() => {
    if (isOpen && word) {
      analyzeWord();
    }
  }, [isOpen, word]);
  const analyzeWord = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      // Получаем API-ключ
      const OPENROUTER_API_KEY =
        process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
        "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";
      // Проверяем наличие API-ключа
      if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === "your-api-key-here") {
        throw new Error("API-ключ не настроен");
      }
      const prompt = `Проанализируй немецкое слово "${word}" (${translation}${partOfSpeech ? `, ${partOfSpeech}` : ""}).
Дай полный анализ в формате JSON:
{
  "analysis": "Подробное объяснение слова, его значений, когда и как используется",
  "examples": [
    {
      "german": "немецкий пример",
      "russian": "русский перевод",
      "level": "A1"
    }
  ],
  "tips": ["советы для запоминания", "мнемоники"],
  "etymology": "происхождение слова",
  "grammar": "грамматические особенности"
}
Отвечай ТОЛЬКО валидным JSON, без дополнительного текста.`;
      const apiResponse = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://talkify.app",
            "X-Title": "Talkify Dictionary AI",
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              {
                role: "system",
                content:
                  "Ты эксперт по немецкому языку. Отвечаешь ТОЛЬКО валидным JSON без дополнительного текста.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 1500,
          }),
        },
      );
      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error("API Error Details:", errorText);
        throw new Error(`API Error: ${apiResponse.status} - ${errorText}`);
      }
      const data = await apiResponse.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("Пустой ответ от API");
      }
      try {
        // Пытаемся найти JSON в ответе
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;
        const parsedResponse = JSON.parse(jsonString) as AIResponse;
        setResponse(parsedResponse);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Content that failed to parse:", content);
        throw new Error("Ошибка обработки ответа ИИ. Попробуйте еще раз.");
      }
    } catch (err) {
      console.error("AI Analysis Error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Неизвестная ошибка";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };
  const handleSpeak = (text: string) => {
    speak(text, "de");
  };
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="glass-card bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bot className="h-8 w-8 text-german-red dark:text-dark-theme-pink" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="h-4 w-4 text-german-gold dark:text-dark-theme-pink" />
                  </motion.div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground flex items-center">
                    ИИ-Анализ слова
                    <span className="ml-2 text-german-red dark:text-dark-theme-pink">
                      {word}
                    </span>
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Умный разбор с искусственным интеллектом
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-10 w-10 rounded-full hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {/* Content */}
            <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6 space-y-6">
              {loading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Brain className="h-12 w-12 text-german-red dark:text-dark-theme-pink" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-foreground">
                      ИИ анализирует слово...
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Подождите несколько секунд
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 0.6,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.2,
                        }}
                        className="w-2 h-2 bg-german-gold dark:bg-dark-theme-pink rounded-full"
                      />
                    ))}
                  </div>
                </div>
              )}
              {error && (
                <Card className="glass p-6 bg-red-50/10 border-red-200/30">
                  <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
                    <X className="h-5 w-5" />
                    <div>
                      <p className="font-semibold">Ошибка анализа</p>
                      <p className="text-sm opacity-80">{error}</p>
                    </div>
                  </div>
                  <Button
                    onClick={analyzeWord}
                    variant="outline"
                    size="sm"
                    className="mt-4"
                  >
                    Попробовать снова
                  </Button>
                </Card>
              )}
              {response && (
                <div className="space-y-6">
                  {/* Main Analysis */}
                  <Card className="glass p-6 bg-gradient-to-r from-german-red/5 to-german-gold/5 dark:from-dark-theme-purple/10 dark:to-dark-theme-pink/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-foreground flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2 text-german-red dark:text-dark-theme-pink" />
                        Анализ слова
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleCopy(response.analysis, "analysis")
                        }
                        className="h-8 w-8 p-0"
                      >
                        {copied === "analysis" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{response.analysis}</ReactMarkdown>
                    </div>
                  </Card>
                  {/* Examples */}
                  {response.examples && response.examples.length > 0 && (
                    <Card className="glass p-6">
                      <h3 className="text-xl font-bold text-foreground flex items-center mb-4">
                        <BookOpen className="h-5 w-5 mr-2 text-german-gold dark:text-dark-theme-pink" />
                        Примеры использования
                      </h3>
                      <div className="space-y-4">
                        {response.examples.map((example, index) => (
                          <motion.div
                            key={example.german}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass p-4 rounded-lg bg-white/5"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <p className="text-lg font-medium text-foreground">
                                    {example.german}
                                  </p>
                                  {isSupported && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleSpeak(example.german)
                                      }
                                      className="h-6 w-6 p-0"
                                    >
                                      <Volume2 className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                                <p className="text-muted-foreground">
                                  {example.russian}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className="text-xs bg-german-gold/10 text-german-gold border-german-gold/30"
                              >
                                {example.level}
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  )}
                  {/* Tips */}
                  {response.tips && response.tips.length > 0 && (
                    <Card className="glass p-6 bg-gradient-to-r from-german-gold/5 to-german-red/5">
                      <h3 className="text-xl font-bold text-foreground flex items-center mb-4">
                        <Lightbulb className="h-5 w-5 mr-2 text-german-gold dark:text-dark-theme-pink" />
                        Советы для запоминания
                      </h3>
                      <div className="space-y-3">
                        {response.tips.map((tip, index) => (
                          <motion.div
                            key={tip}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-3"
                          >
                            <Zap className="h-4 w-4 text-german-gold dark:text-dark-theme-pink mt-0.5 flex-shrink-0" />
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {tip}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  )}
                  {/* Grammar */}
                  {response.grammar && (
                    <Card className="glass p-6">
                      <h3 className="text-xl font-bold text-foreground flex items-center mb-4">
                        <BookOpen className="h-5 w-5 mr-2 text-german-red dark:text-dark-theme-pink" />
                        Грамматика
                      </h3>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{response.grammar}</ReactMarkdown>
                      </div>
                    </Card>
                  )}
                  {/* Etymology */}
                  {response.etymology && (
                    <Card className="glass p-6">
                      <h3 className="text-xl font-bold text-foreground flex items-center mb-4">
                        <Brain className="h-5 w-5 mr-2 text-german-gold dark:text-dark-theme-pink" />
                        Этимология
                      </h3>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{response.etymology}</ReactMarkdown>
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
