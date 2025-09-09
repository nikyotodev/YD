"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Volume2,
  Check,
  ArrowRight,
  RotateCcw,
  Star,
  CheckCircle,
  XCircle,
  Lightbulb,
  Target,
} from "lucide-react";
interface Exercise {
  id: string;
  type:
    | "translation"
    | "multiple_choice"
    | "fill_blank"
    | "listening"
    | "pronunciation";
  question: string;
  correctAnswer: string;
  options?: string[];
  explanation?: string;
  audioText?: string;
  germanSentence?: string;
  blankWord?: string;
}
interface Lesson {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
}
interface LessonModalProps {
  lesson: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (lessonId: string) => void;
}
export function LessonModal({
  lesson,
  isOpen,
  onClose,
  onComplete,
}: LessonModalProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setCurrentExerciseIndex(0);
      setUserAnswer("");
      setSelectedOption("");
      setShowResult(false);
      setIsCorrect(false);
      setCorrectAnswers(0);
      setShowExplanation(false);
      setLessonCompleted(false);
    }
  }, [isOpen]);
  if (!isOpen || !lesson) return null;
  const currentExercise = lesson.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === lesson.exercises.length - 1;
  const progress = ((currentExerciseIndex + 1) / lesson.exercises.length) * 100;
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };
  const checkAnswer = () => {
    if (showResult) return;
    let answer = "";
    if (currentExercise.type === "multiple_choice") {
      answer = selectedOption;
    } else {
      answer = userAnswer.trim().toLowerCase();
    }
    const correct = answer === currentExercise.correctAnswer.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      setCorrectAnswers((prev) => prev + 1);
    }
    // Показываем объяснение через 1 секунду
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
  };
  const nextExercise = () => {
    if (isLastExercise) {
      // Урок завершен
      setLessonCompleted(true);
      onComplete(lesson.id);
    } else {
      setCurrentExerciseIndex((prev) => prev + 1);
      setUserAnswer("");
      setSelectedOption("");
      setShowResult(false);
      setIsCorrect(false);
      setShowExplanation(false);
    }
  };
  const restartLesson = () => {
    setCurrentExerciseIndex(0);
    setUserAnswer("");
    setSelectedOption("");
    setShowResult(false);
    setIsCorrect(false);
    setCorrectAnswers(0);
    setShowExplanation(false);
    setLessonCompleted(false);
  };
  const renderExercise = () => {
    switch (currentExercise.type) {
      case "translation":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4 text-gray-100">
                Переведите на немецкий:
              </h3>
              <p className="text-lg text-gray-300 mb-6">
                {currentExercise.question}
              </p>
            </div>
            <div className="space-y-4">
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Введите перевод..."
                className="glass bg-gray-500/10 border-gray-400/20 text-gray-200 placeholder-gray-400 text-center text-lg"
                disabled={showResult}
                onKeyPress={(e) =>
                  e.key === "Enter" && !showResult && checkAnswer()
                }
              />
            </div>
          </div>
        );
      case "multiple_choice":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4 text-gray-100">
                Выберите правильный ответ:
              </h3>
              <p className="text-lg text-gray-300 mb-6">
                {currentExercise.question}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {currentExercise.options?.map((option, index) => (
                <button
                  key={option}
                  onClick={() => !showResult && setSelectedOption(option)}
                  disabled={showResult}
                  className={`glass p-4 rounded-xl text-left transition-all ${
                    selectedOption === option
                      ? showResult
                        ? option === currentExercise.correctAnswer
                          ? "bg-green-500/20 border-green-400/30 text-green-300"
                          : "bg-red-500/20 border-red-400/30 text-red-300"
                        : "bg-blue-500/20 border-blue-400/30 text-blue-300"
                      : showResult && option === currentExercise.correctAnswer
                        ? "bg-green-500/20 border-green-400/30 text-green-300"
                        : "hover:bg-gray-500/10 border-gray-400/20 text-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && option === currentExercise.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    )}
                    {showResult &&
                      selectedOption === option &&
                      option !== currentExercise.correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case "fill_blank":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4 text-gray-100">
                Заполните пропуск:
              </h3>
              <div className="text-lg text-gray-300 mb-6">
                {currentExercise.germanSentence
                  ?.split("___")
                  .map((part, index) => (
                    <span key={`part-${index}-${part.slice(0, 10)}`}>
                      {part}
                      {index <
                        (currentExercise.germanSentence?.split("___").length ||
                          0) -
                          1 && (
                        <Input
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="___"
                          className="inline-block w-32 mx-2 glass bg-gray-500/10 border-gray-400/20 text-gray-200 text-center"
                          disabled={showResult}
                          onKeyPress={(e) =>
                            e.key === "Enter" && !showResult && checkAnswer()
                          }
                        />
                      )}
                    </span>
                  ))}
              </div>
              <p className="text-sm text-gray-400">
                {currentExercise.question}
              </p>
            </div>
          </div>
        );
      case "listening":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4 text-gray-100">
                Прослушайте и переведите:
              </h3>
              <div className="glass-card max-w-md mx-auto mb-6">
                <Button
                  onClick={() =>
                    currentExercise.audioText &&
                    speak(currentExercise.audioText)
                  }
                  className="glass glass-hover bg-gradient-to-r from-german-red/20 to-german-gold/20 border-german-red/30 text-white font-medium"
                >
                  <Volume2 className="h-5 w-5 mr-2" />
                  Прослушать
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Введите перевод того, что услышали..."
                className="glass bg-gray-500/10 border-gray-400/20 text-gray-200 placeholder-gray-400 text-center"
                disabled={showResult}
                onKeyPress={(e) =>
                  e.key === "Enter" && !showResult && checkAnswer()
                }
              />
            </div>
          </div>
        );
      default:
        return <div>Неизвестный тип упражнения</div>;
    }
  };
  if (lessonCompleted) {
    const score = Math.round((correctAnswers / lesson.exercises.length) * 100);
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full text-center">
          <div className="mb-6">
            <div className="glass p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl w-fit mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold gradient-text mb-2">
              Урок завершен!
            </h2>
            <p className="text-gray-300">{lesson.title}</p>
          </div>
          <div className="space-y-4 mb-6">
            <div className="glass p-4 rounded-xl">
              <div className="text-3xl font-black mb-2">
                <span
                  className={
                    score >= 80
                      ? "text-green-400"
                      : score >= 60
                        ? "text-german-gold dark:text-pink-400"
                        : "text-red-400"
                  }
                >
                  {score}%
                </span>
              </div>
              <div className="text-gray-400">
                Правильных ответов: {correctAnswers}/{lesson.exercises.length}
              </div>
            </div>
            <div className="flex justify-center space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={`star-${i}-${score}`}
                  className={`h-6 w-6 ${i < Math.floor(score / 20) ? "text-german-gold dark:text-pink-400 fill-current" : "text-gray-500"}`}
                />
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              {score >= 90 && "Отличная работа! Вы прекрасно справились!"}
              {score >= 70 &&
                score < 90 &&
                "Хорошо! Продолжайте в том же духе!"}
              {score >= 50 &&
                score < 70 &&
                "Неплохо! Еще немного практики и будет отлично!"}
              {score < 50 && "Не расстраивайтесь! Попробуйте еще раз."}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={restartLesson}
              variant="outline"
              className="flex-1 glass border-gray-400/20 text-gray-300 hover:text-white"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Повторить
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 glass glass-hover bg-gradient-to-r from-german-red/20 to-german-gold/20 border-german-red/30 text-white font-medium"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Готово
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold gradient-text">{lesson.title}</h1>
            <div className="flex items-center space-x-3 mt-2">
              <Badge className="text-xs bg-blue-500/20 text-blue-300 border-blue-400/30">
                {lesson.level}
              </Badge>
              <span className="text-sm text-gray-400">
                Упражнение {currentExerciseIndex + 1} из{" "}
                {lesson.exercises.length}
              </span>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="glass glass-hover text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        {/* Прогресс */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Прогресс урока</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="glass bg-gray-500/20 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-german-red to-german-gold transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        {/* Упражнение */}
        <div className="mb-8">{renderExercise()}</div>
        {/* Результат */}
        {showResult && (
          <div
            className={`glass p-4 rounded-xl mb-6 ${isCorrect ? "bg-green-500/10 border-green-400/30" : "bg-red-500/10 border-red-400/30"}`}
          >
            <div className="flex items-center mb-3">
              {isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400 mr-2" />
              )}
              <span
                className={`font-medium ${isCorrect ? "text-green-300" : "text-red-300"}`}
              >
                {isCorrect ? "Правильно!" : "Неправильно"}
              </span>
            </div>
            {!isCorrect && (
              <p className="text-gray-300 mb-2">
                Правильный ответ:{" "}
                <span className="font-medium text-green-300">
                  {currentExercise.correctAnswer}
                </span>
              </p>
            )}
            {showExplanation && currentExercise.explanation && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-start">
                  <Lightbulb className="h-4 w-4 text-german-gold dark:text-pink-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {currentExercise.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Кнопки */}
        <div className="flex justify-between">
          <Button
            onClick={() =>
              currentExercise.audioText &&
              speak(currentExercise.audioText || currentExercise.correctAnswer)
            }
            variant="outline"
            className="glass border-gray-400/20 text-gray-300 hover:text-white"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Произнести
          </Button>
          <div className="flex space-x-3">
            {!showResult ? (
              <Button
                onClick={checkAnswer}
                disabled={
                  (currentExercise.type === "multiple_choice" &&
                    !selectedOption) ||
                  (currentExercise.type !== "multiple_choice" &&
                    !userAnswer.trim())
                }
                className="glass glass-hover bg-gradient-to-r from-german-red/20 to-german-gold/20 border-german-red/30 text-white font-medium"
              >
                <Target className="h-4 w-4 mr-2" />
                Проверить
              </Button>
            ) : (
              <Button
                onClick={nextExercise}
                className="glass glass-hover bg-gradient-to-r from-german-red/20 to-german-gold/20 border-german-red/30 text-white font-medium"
              >
                {isLastExercise ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Завершить урок
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Следующее упражнение
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
