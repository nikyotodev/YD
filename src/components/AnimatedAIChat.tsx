"use client";
import { useEffect, useRef, useCallback, useTransition } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Languages,
  BookOpen,
  GraduationCap,
  CircleUserRound,
  ArrowUpIcon,
  PlusIcon,
  SendIcon,
  XIcon,
  LoaderIcon,
  Sparkles,
  Command,
  Bot,
  User,
  Volume2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import * as React from "react";
interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}
const OPENROUTER_API_KEY =
  "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";
const MODEL = "deepseek/deepseek-chat-v3-0324:free";
interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}
function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }
      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY),
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight],
  );
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);
  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);
  return { textareaRef, adjustHeight };
}
interface CommandSuggestion {
  icon: React.ReactNode;
  label: string;
  description: string;
  prefix: string;
}
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  showRing?: boolean;
}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    return (
      <div className={cn("relative", containerClassName)}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            showRing
              ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              : "",
            className,
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {showRing && isFocused && (
          <motion.span
            className="absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-0 ring-german-red/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
        {props.onChange && (
          <div
            className="absolute bottom-2 right-2 opacity-0 w-2 h-2 bg-german-red rounded-full"
            style={{
              animation: "none",
            }}
            id="textarea-ripple"
          />
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";
export function AnimatedAIChat() {
  const [value, setValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [recentCommand, setRecentCommand] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });
  const [inputFocused, setInputFocused] = useState(false);
  const commandPaletteRef = useRef<HTMLDivElement>(null);
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Привет! Я Эмилия, твой AI-преподаватель немецкого 🇩🇪\n\nЗадавай любые вопросы про немецкий язык — переводы, грамматику, произношение. Отвечаю быстро и понятно! 😊",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const commandSuggestions: CommandSuggestion[] = [
    {
      icon: <Languages className="w-4 h-4" />,
      label: "Как сказать...",
      description: "Перевести фразу с русского на немецкий",
      prefix: "/translate",
    },
    {
      icon: <BookOpen className="w-4 h-4" />,
      label: "Грамматика",
      description: "Объяснить правило простыми словами",
      prefix: "/grammar",
    },
    {
      icon: <GraduationCap className="w-4 h-4" />,
      label: "Персональный урок",
      description: "Создать урок под ваш уровень",
      prefix: "/lesson",
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      label: "Практика",
      description: "Тренироваться вместе с Эмилия",
      prefix: "/practice",
    },
  ];
  useEffect(() => {
    if (value.startsWith("/") && !value.includes(" ")) {
      setShowCommandPalette(true);
      const matchingSuggestionIndex = commandSuggestions.findIndex((cmd) =>
        cmd.prefix.startsWith(value),
      );
      if (matchingSuggestionIndex >= 0) {
        setActiveSuggestion(matchingSuggestionIndex);
      } else {
        setActiveSuggestion(-1);
      }
    } else {
      setShowCommandPalette(false);
    }
  }, [value]);
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      // Прокручиваем только контейнер с сообщениями, а не всю страницу
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);
  useEffect(() => {
    if (showChat) {
      // Небольшая задержка, чтобы DOM успел обновиться
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [showChat, scrollToBottom]);
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };
  const sendMessageToAI = async () => {
    if (!value.trim() || isTyping) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: value,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setShowChat(true);
    setValue("");
    adjustHeight(true);
    setIsTyping(true);
    // Прокручиваем к новому сообщению пользователя
    setTimeout(() => {
      scrollToBottom();
    }, 50);
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "X-Title": "Talkify",
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              {
                role: "system",
                content: `Вы — Эмилия, дружелюбный преподаватель немецкого языка. Отвечайте на русском языке.
                            СТРУКТУРА:
                            1. Приветствие с emoji 😊
                            2. Прямой ответ на вопрос
                            3. Практический пример
                            4. Мотивирующий совет
                            ФОРМАТИРОВАНИЕ:
                            - **Только ключевые слова** жирным (умеренно!)
                            - *Переводы* курсивом (важные!)
                            - Пустые строки между блоками
                            - НЕ выделяйте каждое слово
                            ПРАВИЛА:
                            - Структурированные, полные ответы
                            - Практические примеры всегда
                            - Объяснять "почему", не только "что"
                            - Поощрять практику и мотивацию
                            Будьте как опытный друг-учитель!`,
              },
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
              {
                role: "user",
                content: value,
              },
            ],
            temperature: 0.8,
            max_tokens: 800,
          }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }
      const data = await response.json();
      const aiResponse =
        data.choices[0]?.message?.content ||
        "Извините, произошла ошибка. Попробуйте ещё раз.";
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      // Прокручиваем к ответу ИИ
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "**Извините!** 😔\n\nУ меня временные технические проблемы. Проверьте подключение к интернету и попробуйте ещё раз.\n\n*Я обязательно отвечу, как только всё восстановится!*",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      // Прокручиваем к сообщению об ошибке
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } finally {
      setIsTyping(false);
    }
  };
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const commandButton = document.querySelector("[data-command-button]");
      if (
        commandPaletteRef.current &&
        !commandPaletteRef.current.contains(target) &&
        !commandButton?.contains(target)
      ) {
        setShowCommandPalette(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev < commandSuggestions.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev > 0 ? prev - 1 : commandSuggestions.length - 1,
        );
      } else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        if (activeSuggestion >= 0) {
          const selectedCommand = commandSuggestions[activeSuggestion];
          setValue(`${selectedCommand.prefix} `);
          setShowCommandPalette(false);
          setRecentCommand(selectedCommand.label);
          setTimeout(() => setRecentCommand(null), 3500);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setShowCommandPalette(false);
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        sendMessageToAI();
      }
    }
  };
  const handleSendMessage = () => {
    if (value.trim()) {
      sendMessageToAI();
    }
  };
  const selectCommandSuggestion = (index: number) => {
    const selectedCommand = commandSuggestions[index];
    setValue(`${selectedCommand.prefix} `);
    setShowCommandPalette(false);
    setRecentCommand(selectedCommand.label);
    setTimeout(() => setRecentCommand(null), 2000);
  };
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col w-full bg-transparent text-foreground relative overflow-hidden">
      {/* Light theme decorative background elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-german-red/5 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-german-gold/5 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-german-black/3 rounded-full mix-blend-normal filter blur-[96px] animate-pulse delay-1000" />
      </div>
      {showChat ? (
        // Полноэкранный режим чата
        <div className="flex flex-col h-full w-full relative z-10">
          {/* Заголовок чата */}
          <motion.div
            className="p-6 border-b border-border glass"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="glass p-3 bg-gradient-to-br from-german-red/20 to-german-gold/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-german-red" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold gradient-text">
                    Преподаватель Эмилия
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                    <span>Готова к уроку</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="glass-hover p-2 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
          {/* История сообщений */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-6 pt-8"
          >
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full glass flex items-center justify-center ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-german-red/20 to-german-gold/20"
                          : "bg-gradient-to-br from-german-red/15 to-german-gold/15"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-4 h-4 text-german-red" />
                      ) : (
                        <Bot className="w-4 h-4 text-german-red" />
                      )}
                    </div>
                    <div className="relative group">
                      <div
                        className={`glass rounded-2xl p-4 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-german-red/10 to-german-gold/10 text-foreground"
                            : "bg-card text-card-foreground"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <div className="prose prose-slate prose-sm max-w-none">
                            <ReactMarkdown
                              components={{
                                p: ({ children }) => (
                                  <p className="mb-3 last:mb-0 text-card-foreground leading-relaxed">
                                    {children}
                                  </p>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-bold text-foreground">
                                    {children}
                                  </strong>
                                ),
                                em: ({ children }) => (
                                  <em className="italic text-muted-foreground">
                                    {children}
                                  </em>
                                ),
                                code: ({ children }) => (
                                  <code className="glass text-german-red px-2 py-1 rounded text-xs font-medium">
                                    {children}
                                  </code>
                                ),
                                ul: ({ children }) => (
                                  <ul className="list-disc list-inside mb-3 text-card-foreground space-y-1">
                                    {children}
                                  </ul>
                                ),
                                li: ({ children }) => (
                                  <li className="leading-relaxed">
                                    {children}
                                  </li>
                                ),
                                br: () => <br className="mb-2" />,
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                        )}
                      </div>
                      {message.role === "assistant" && (
                        <button
                          onClick={() => speak(message.content)}
                          className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity glass-hover p-2 rounded-lg text-muted-foreground hover:text-foreground"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {/* Индикатор печатания */}
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full glass bg-gradient-to-br from-german-red/15 to-german-gold/15 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-german-red" />
                    </div>
                    <div className="glass bg-card rounded-2xl p-4">
                      <div className="flex items-center space-x-3">
                        <LoaderIcon className="w-4 h-4 animate-spin text-german-red" />
                        <span className="text-sm text-muted-foreground">
                          Эмилия печатает ответ...
                        </span>
                        <TypingDots />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          {/* Поле ввода для чата */}
          <div className="p-6 border-t border-border glass">
            <div className="max-w-4xl mx-auto">
              <motion.div
                className="relative glass-card-no-padding"
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
              >
                <div className="p-4">
                  <Textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      adjustHeight();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Продолжаем урок! Задайте любой вопрос о немецком языке..."
                    containerClassName="w-full"
                    className={cn(
                      "w-full px-4 py-3",
                      "resize-none",
                      "bg-transparent",
                      "border-none",
                      "text-foreground text-sm",
                      "focus:outline-none",
                      "placeholder:text-muted-foreground",
                      "min-h-[60px]",
                    )}
                    style={{
                      overflow: "hidden",
                    }}
                    showRing={false}
                    disabled={isTyping}
                  />
                </div>
                <div className="p-4 border-t border-border flex items-center justify-end gap-4">
                  <motion.button
                    type="button"
                    onClick={handleSendMessage}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isTyping || !value.trim()}
                    className={cn(
                      "px-6 py-2 rounded-lg text-sm font-medium transition-all",
                      "flex items-center gap-2",
                      value.trim() && !isTyping
                        ? "bg-gradient-to-r from-german-red to-german-gold text-white shadow-lg shadow-german-red/20"
                        : "glass text-muted-foreground",
                    )}
                  >
                    {isTyping ? (
                      <LoaderIcon className="w-4 h-4 animate-spin" />
                    ) : (
                      <SendIcon className="w-4 h-4" />
                    )}
                    <span>Отправить</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      ) : (
        // Начальный экран чата
        <div className="flex items-center justify-center h-full p-6 pt-20">
          <div className="w-full max-w-2xl mx-auto relative">
            <motion.div
              className="relative z-10 space-y-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="text-center space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-block"
                >
                  <h1 className="text-3xl font-medium tracking-tight gradient-text pb-1">
                    Эмилия — ваш личный преподаватель немецкого
                  </h1>
                  <motion.div
                    className="h-px bg-gradient-to-r from-transparent via-border to-transparent"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </motion.div>
                <motion.p
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Готова помочь с изучением немецкого языка! Спрашивайте на
                  русском 🇷🇺 ➡️ 🇩🇪
                </motion.p>
              </div>
              <motion.div
                className="relative glass-card shadow-2xl"
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <AnimatePresence>
                  {showCommandPalette && (
                    <motion.div
                      ref={commandPaletteRef}
                      className="absolute left-4 right-4 bottom-full mb-2 glass bg-card rounded-lg z-50 shadow-lg overflow-hidden"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="py-1">
                        {commandSuggestions.map((suggestion, index) => (
                          <motion.div
                            key={suggestion.prefix}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 text-xs transition-colors cursor-pointer",
                              activeSuggestion === index
                                ? "glass-hover text-foreground"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                            onClick={() => selectCommandSuggestion(index)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.03 }}
                          >
                            <div className="w-5 h-5 flex items-center justify-center text-german-red">
                              {suggestion.icon}
                            </div>
                            <div className="font-medium">
                              {suggestion.label}
                            </div>
                            <div className="text-muted-foreground text-xs ml-1">
                              {suggestion.prefix}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="p-4">
                  <Textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      adjustHeight();
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder="Например: 'Расскажи о немецких артиклях' или 'Как сказать Привет на немецком?'"
                    containerClassName="w-full"
                    className={cn(
                      "w-full px-4 py-3",
                      "resize-none",
                      "bg-transparent",
                      "border-none",
                      "text-foreground text-sm",
                      "focus:outline-none",
                      "placeholder:text-muted-foreground/60",
                      "min-h-[60px]",
                    )}
                    style={{
                      overflow: "hidden",
                    }}
                    showRing={false}
                  />
                </div>
                <div className="p-4 border-t border-border flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <motion.button
                      type="button"
                      data-command-button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCommandPalette((prev) => !prev);
                      }}
                      whileTap={{ scale: 0.94 }}
                      className={cn(
                        "p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors relative group",
                        showCommandPalette && "glass-hover text-foreground",
                      )}
                    >
                      <Command className="w-4 h-4" />
                      <motion.span
                        className="absolute inset-0 glass rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        layoutId="button-highlight"
                      />
                    </motion.button>
                  </div>
                  <motion.button
                    type="button"
                    onClick={handleSendMessage}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isTyping || !value.trim()}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      "flex items-center gap-2",
                      value.trim()
                        ? "bg-gradient-to-r from-german-red to-german-gold text-white shadow-lg shadow-german-red/20"
                        : "glass text-muted-foreground",
                    )}
                  >
                    {isTyping ? (
                      <LoaderIcon className="w-4 h-4 animate-[spin_2s_linear_infinite]" />
                    ) : (
                      <SendIcon className="w-4 h-4" />
                    )}
                    <span>Отправить</span>
                  </motion.button>
                </div>
              </motion.div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {commandSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion.prefix}
                    onClick={() => selectCommandSuggestion(index)}
                    className="glass-hover flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-all relative group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {suggestion.icon}
                    <span>{suggestion.label}</span>
                    <motion.div
                      className="absolute inset-0 border border-border rounded-lg"
                      initial={false}
                      animate={{
                        opacity: [0, 1],
                        scale: [0.98, 1],
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
      {inputFocused && (
        <motion.div
          className="absolute w-[50rem] h-[50rem] rounded-full pointer-events-none z-0 opacity-[0.02] bg-gradient-to-r from-german-red via-german-gold to-german-black blur-[96px]"
          animate={{
            x: mousePosition.x - 400,
            y: mousePosition.y - 400,
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 150,
            mass: 0.5,
          }}
        />
      )}
    </div>
  );
}
function TypingDots() {
  return (
    <div className="flex items-center ml-1">
      {[1, 2, 3].map((dot) => (
        <motion.div
          key={dot}
          className="w-1.5 h-1.5 bg-german-red rounded-full mx-0.5"
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.9, 0.3],
            scale: [0.85, 1.1, 0.85],
          }}
          transition={{
            duration: 1.2,
            repeat: Number.POSITIVE_INFINITY,
            delay: dot * 0.15,
            ease: "easeInOut",
          }}
          style={{
            boxShadow: "0 0 4px rgba(220, 38, 38, 0.3)",
          }}
        />
      ))}
    </div>
  );
}
