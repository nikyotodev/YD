export type GermanLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type QuestionType = "grammar" | "vocabulary" | "reading" | "listening";
export type QuestionDifficulty = 1 | 2 | 3 | 4 | 5;
export interface LevelTestQuestion {
  id: string;
  type: QuestionType;
  level: GermanLevel;
  difficulty: QuestionDifficulty;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  points: number;
}
export interface UserAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
  confidence: number;
}
export interface TestSession {
  id: string;
  userId?: string;
  startTime: Date;
  answers: UserAnswer[];
  currentQuestionIndex: number;
  estimatedLevel: GermanLevel | null;
  confidence: number;
  isCompleted: boolean;
}
export interface LevelTestResult {
  level: GermanLevel;
  confidence: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  strengths: QuestionType[];
  weaknesses: QuestionType[];
  recommendations: LevelRecommendation[];
  timeSpent: number;
}
export interface LevelRecommendation {
  type: "lesson" | "practice" | "course";
  title: string;
  description: string;
  url?: string;
  priority: "high" | "medium" | "low";
}
export interface AdaptiveTestConfig {
  maxQuestions: number;
  minQuestions: number;
  confidenceThreshold: number;
  timeLimit: number;
  questionTypes: QuestionType[];
}
