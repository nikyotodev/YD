"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ChefHat,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle,
  Circle,
  BookOpen,
  Users,
  Clock,
  Utensils,
  Star,
  Flame,
  AlertCircle,
} from "lucide-react";
interface Ingredient {
  german: string;
  russian: string;
  amount: string;
  pronunciation: string;
}
interface CookingStep {
  german: string;
  russian: string;
  time: string;
  temperature?: string;
  tips?: string;
}
interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  difficulty: string;
  cookTime: string;
  servings: number;
  ingredients: Ingredient[];
  steps: CookingStep[];
  vocabulary: Array<{ word: string; translation: string; type: string }>;
}
interface RecipeViewerProps {
  recipe: Recipe;
  onClose?: () => void;
  className?: string;
}
export function RecipeViewer({
  recipe,
  onClose,
  className = "",
}: RecipeViewerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [stepTimer, setStepTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showIngredients, setShowIngredients] = useState(true);
  const [showTranslations, setShowTranslations] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (isTimerRunning && stepTimer > 0) {
      timerRef.current = setTimeout(() => {
        setStepTimer(stepTimer - 1);
      }, 1000);
    } else if (stepTimer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Уведомление о завершении
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Таймер завершен!", {
          body: `Шаг "${recipe.steps[currentStep]?.russian}" завершен`,
        });
      }
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [stepTimer, isTimerRunning, currentStep, recipe.steps]);
  const speakText = (text: string, language: "de" | "ru" = "de") => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "de" ? "de-DE" : "ru-RU";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };
  const parseTimeToSeconds = (timeString: string) => {
    const match = timeString.match(/(\d+)\s*(мин|час|секунд)/i);
    if (!match) return 0;
    const value = Number.parseInt(match[1]);
    const unit = match[2].toLowerCase();
    switch (unit) {
      case "секунд":
        return value;
      case "мин":
        return value * 60;
      case "час":
        return value * 3600;
      default:
        return 0;
    }
  };
  const startStepTimer = (step: CookingStep) => {
    const seconds = parseTimeToSeconds(step.time);
    if (seconds > 0) {
      setStepTimer(seconds);
      setIsTimerRunning(true);
    }
  };
  const toggleTimer = () => {
    if (stepTimer > 0) {
      setIsTimerRunning(!isTimerRunning);
    }
  };
  const resetTimer = (step: CookingStep) => {
    setIsTimerRunning(false);
    const seconds = parseTimeToSeconds(step.time);
    setStepTimer(seconds);
  };
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const toggleStepCompletion = (stepIndex: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepIndex)) {
      newCompleted.delete(stepIndex);
    } else {
      newCompleted.add(stepIndex);
    }
    setCompletedSteps(newCompleted);
  };
  const getCurrentStepProgress = () => {
    return Math.round((completedSteps.size / recipe.steps.length) * 100);
  };
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "легко":
        return "bg-green-500/20 text-green-300";
      case "средне":
        return "bg-yellow-500/20 text-yellow-300";
      case "сложно":
        return "bg-red-500/20 text-red-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };
  const requestNotificationPermission = useCallback(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="glass-card bg-gradient-to-r from-german-red/10 to-german-gold/10 dark:from-purple-600/10 dark:to-pink-600/10 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold gradient-text mb-1">
              {recipe.title}
            </h2>
            <p className="text-muted-foreground">{recipe.subtitle}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={getDifficultyColor(recipe.difficulty)}>
              {recipe.difficulty}
            </Badge>
            <Badge className="glass-nav">
              <Users className="h-3 w-3 mr-1" />
              {recipe.servings}
            </Badge>
            <Badge className="glass-nav">
              <Clock className="h-3 w-3 mr-1" />
              {recipe.cookTime}
            </Badge>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Прогресс приготовления
            </span>
            <span className="text-foreground font-semibold">
              {getCurrentStepProgress()}%
            </span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-german-red to-german-gold dark:from-purple-500 dark:to-pink-500 transition-all duration-500"
              style={{ width: `${getCurrentStepProgress()}%` }}
            />
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ingredients Panel */}
        <Card className="lg:col-span-1 glass-card bg-gradient-to-br from-white/5 to-white/10 border border-white/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground flex items-center">
                <Utensils className="h-5 w-5 mr-2" />
                Ингредиенты
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTranslations(!showTranslations)}
                className={`glass glass-hover ${showTranslations ? "text-german-red dark:text-pink-400" : "text-muted-foreground"}`}
              >
                <BookOpen className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={ingredient.german} className="glass-nav p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-foreground text-sm">
                      {ingredient.german}
                    </div>
                    <Badge className="text-xs bg-german-red/20 dark:bg-pink-500/20">
                      {ingredient.amount}
                    </Badge>
                  </div>
                  {showTranslations && (
                    <>
                      <div className="text-xs text-muted-foreground mb-1">
                        {ingredient.russian}
                      </div>
                      <div className="text-xs text-muted-foreground/70 font-mono">
                        {ingredient.pronunciation}
                      </div>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakText(ingredient.german, "de")}
                    className="mt-2 p-1 h-auto text-german-red hover:text-german-dark-red dark:text-pink-400 dark:hover:text-pink-300"
                  >
                    <Volume2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
        {/* Cooking Steps */}
        <Card className="lg:col-span-2 glass-card bg-gradient-to-br from-white/5 to-white/10 border border-white/20">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground flex items-center">
                <ChefHat className="h-5 w-5 mr-2" />
                Приготовление
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Шаг {currentStep + 1} из {recipe.steps.length}
                </span>
              </div>
            </div>
            {/* Current Step Timer */}
            {recipe.steps[currentStep] && (
              <div className="glass bg-gradient-to-r from-german-red/10 to-german-gold/10 dark:from-purple-600/10 dark:to-pink-600/10 rounded-xl p-6 border border-german-red/20 dark:border-pink-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-foreground">
                    Шаг {currentStep + 1}
                  </h4>
                  {stepTimer > 0 && (
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl font-bold text-german-red dark:text-pink-400">
                        {formatTime(stepTimer)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleTimer}
                        className="glass glass-hover"
                      >
                        {isTimerRunning ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => resetTimer(recipe.steps[currentStep])}
                        className="glass glass-hover"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStepCompletion(currentStep)}
                      className="glass glass-hover p-1 h-auto"
                    >
                      {completedSteps.has(currentStep) ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <div className="text-foreground font-medium text-lg mb-2">
                        {recipe.steps[currentStep].german}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            speakText(recipe.steps[currentStep].german, "de")
                          }
                          className="ml-2 p-1 h-auto"
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                      </div>
                      {showTranslations && (
                        <div className="text-muted-foreground mb-2">
                          {recipe.steps[currentStep].russian}
                        </div>
                      )}
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-german-red/20 text-german-red dark:bg-pink-500/20 dark:text-pink-300">
                          <Timer className="h-3 w-3 mr-1" />
                          {recipe.steps[currentStep].time}
                        </Badge>
                        {recipe.steps[currentStep].temperature && (
                          <Badge className="bg-red-500/20 text-red-300">
                            <Flame className="h-3 w-3 mr-1" />
                            {recipe.steps[currentStep].temperature}
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            startStepTimer(recipe.steps[currentStep])
                          }
                          className="glass glass-hover text-xs"
                        >
                          Запустить таймер
                        </Button>
                      </div>
                      {recipe.steps[currentStep].tips && (
                        <div className="mt-3 glass bg-white/5 rounded-lg p-3">
                          <div className="flex items-center mb-1">
                            <AlertCircle className="h-4 w-4 text-yellow-400 mr-2" />
                            <span className="text-sm font-medium text-foreground">
                              Совет:
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {recipe.steps[currentStep].tips}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Step Navigation */}
                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="glass glass-hover"
                  >
                    Предыдущий шаг
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentStep(
                        Math.min(recipe.steps.length - 1, currentStep + 1),
                      )
                    }
                    disabled={currentStep === recipe.steps.length - 1}
                    className="glass glass-hover"
                  >
                    Следующий шаг
                  </Button>
                </div>
              </div>
            )}
            {/* All Steps Overview */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recipe.steps.map((step, index) => (
                <div
                  key={`step-${step.german.slice(0, 20)}-${index}`}
                  className={`
                    glass-nav p-3 rounded-lg cursor-pointer transition-all duration-200
                    ${index === currentStep ? "ring-2 ring-german-red/50 bg-german-red/10 dark:ring-pink-400/50 dark:bg-pink-500/10" : ""}
                    ${completedSteps.has(index) ? "bg-green-500/10" : ""}
                  `}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStepCompletion(index);
                      }}
                      className="p-1 h-auto"
                    >
                      {completedSteps.has(index) ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <div className="glass-nav w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {step.german}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {step.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      {/* Vocabulary */}
      {recipe.vocabulary.length > 0 && (
        <Card className="glass-card bg-gradient-to-br from-white/5 to-white/10 border border-white/20">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Кулинарный словарь ({recipe.vocabulary.length} слов)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recipe.vocabulary.map((word, index) => (
                <div key={word.word} className="glass-nav p-3 rounded-lg">
                  <div className="font-semibold text-foreground text-sm mb-1">
                    {word.word}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {word.translation}
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="text-xs bg-german-red/20 text-german-red border-german-red/30">{word.type}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => speakText(word.word, "de")}
                      className="p-1 h-auto"
                    >
                      <Volume2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
