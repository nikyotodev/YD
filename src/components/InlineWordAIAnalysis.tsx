"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Sparkles,
  Loader2,
  Volume2,
  Copy,
  Check,
  Brain,
  BookOpen,
  Lightbulb,
  MessageSquare,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { useSpeech } from "@/hooks/useSpeech";
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
interface InlineWordAIAnalysisProps {
  word: string;
  translation: string;
  partOfSpeech?: string;
}
const MODEL = "deepseek/deepseek-chat-v3-0324:free";
export function InlineWordAIAnalysis({
  word,
  translation,
  partOfSpeech,
}: InlineWordAIAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { speak, isSupported } = useSpeech();
  const analyzeWord = async () => {
    if (response && !error) {
      setIsExpanded(!isExpanded);
      return;
    }
    setLoading(true);
    setError(null);
    setResponse(null);
    setIsExpanded(true);
    try {
      const OPENROUTER_API_KEY =
        process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
        "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";
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
        throw new Error(`API Error: ${apiResponse.status} - ${errorText}`);
      }
      const data = await apiResponse.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("Пустой ответ от API");
      }
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;
        const parsedResponse = JSON.parse(jsonString) as AIResponse;
        setResponse(parsedResponse);
      } catch (parseError) {
        throw new Error("Ошибка обработки ответа ИИ. Попробуйте еще раз.");
      }
    } catch (err) {
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
  return (
    <div className="mt-4">
      {/* AI Analysis Button */}
      <Button
        onClick={analyzeWord}
        variant="outline"
        size="sm"
        className="w-full glass border-german-red/30 hover:border-german-red hover:bg-german-red/10 dark:border-dark-theme-pink/30 dark:hover:border-dark-theme-pink dark:hover:bg-dark-theme-pink/10"
        disabled={loading}
      >
        <div className="flex items-center justify-center space-x-2">
          <div className="relative">
            <Bot className="h-4 w-4 text-german-red dark:text-dark-theme-pink" />
            <Sparkles className="h-2 w-2 absolute -top-0.5 -right-0.5 text-german-gold dark:text-dark-theme-pink opacity-60" />
          </div>
          <span>
            {loading
              ? "ИИ анализирует..."
              : response
                ? "ИИ-анализ готов"
                : "ИИ-анализ слова"}
          </span>
          {response &&
            !loading &&
            (isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            ))}
        </div>
      </Button>
      {/* AI Analysis Content */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 space-y-4"
        >
          {loading && (
            <Card className="glass p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <Brain className="h-8 w-8 text-german-red dark:text-dark-theme-pink" />
                </motion.div>
                <div className="text-center">
                  <p className="font-medium text-foreground">
                    ИИ анализирует слово...
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Подождите несколько секунд
                  </p>
                </div>
              </div>
            </Card>
          )}
          {error && (
            <Card className="glass p-4 bg-red-50/10 border-red-200/30">
              <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
                <Brain className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Ошибка анализа</p>
                  <p className="text-sm opacity-80">{error}</p>
                </div>
              </div>
              <Button
                onClick={analyzeWord}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                Попробовать снова
              </Button>
            </Card>
          )}
          {response && (
            <div className="space-y-4">
              {/* Main Analysis */}
              <Card className="glass p-4 bg-gradient-to-r from-german-red/5 to-german-gold/5 dark:from-dark-theme-purple/10 dark:to-dark-theme-pink/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-german-red dark:text-dark-theme-pink" />
                    Анализ слова
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(response.analysis, "analysis")}
                    className="h-6 w-6 p-0"
                  >
                    {copied === "analysis" ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{response.analysis}</ReactMarkdown>
                </div>
              </Card>
              {/* Examples */}
              {response.examples && response.examples.length > 0 && (
                <Card className="glass p-4">
                  <h4 className="font-semibold text-foreground flex items-center mb-3">
                    <BookOpen className="h-4 w-4 mr-2 text-german-gold dark:text-dark-theme-pink" />
                    Примеры использования
                  </h4>
                  <div className="space-y-3">
                    {response.examples.map((example) => (
                      <div
                        key={example.german}
                        className="glass p-3 rounded-lg bg-white/5"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-medium text-foreground">
                                {example.german}
                              </p>
                              {isSupported && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSpeak(example.german)}
                                  className="h-5 w-5 p-0"
                                >
                                  <Volume2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
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
                      </div>
                    ))}
                  </div>
                </Card>
              )}
              {/* Tips */}
              {response.tips && response.tips.length > 0 && (
                <Card className="glass p-4 bg-gradient-to-r from-german-gold/5 to-german-red/5">
                  <h4 className="font-semibold text-foreground flex items-center mb-3">
                    <Lightbulb className="h-4 w-4 mr-2 text-german-gold dark:text-dark-theme-pink" />
                    Советы для запоминания
                  </h4>
                  <div className="space-y-2">
                    {response.tips.map((tip) => (
                      <div key={tip} className="flex items-start space-x-2">
                        <Zap className="h-3 w-3 text-german-gold dark:text-dark-theme-pink mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{tip}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
              {/* Grammar */}
              {response.grammar && (
                <Card className="glass p-4">
                  <h4 className="font-semibold text-foreground flex items-center mb-3">
                    <BookOpen className="h-4 w-4 mr-2 text-german-red dark:text-dark-theme-pink" />
                    Грамматика
                  </h4>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{response.grammar}</ReactMarkdown>
                  </div>
                </Card>
              )}
              {/* Etymology */}
              {response.etymology && (
                <Card className="glass p-4">
                  <h4 className="font-semibold text-foreground flex items-center mb-3">
                    <Brain className="h-4 w-4 mr-2 text-german-gold dark:text-dark-theme-pink" />
                    Этимология
                  </h4>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{response.etymology}</ReactMarkdown>
                  </div>
                </Card>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
