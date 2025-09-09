/**
 * Типы для системы персонализированных AI-сценариев
 * Революционный подход к изучению немецкого языка
 */
export type UserInterest =
  | "football"
  | "cooking"
  | "technology"
  | "travel"
  | "music"
  | "business"
  | "art"
  | "gaming"
  | "science"
  | "fashion";
export type GermanLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type ScenarioType =
  | "dialogue"
  | "roleplay"
  | "story"
  | "interview"
  | "presentation"
  | "problem_solving";
export interface InterestData {
  id: UserInterest;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  scenarios: ScenarioTemplate[];
}
export interface ScenarioTemplate {
  id: string;
  title: string;
  description: string;
  type: ScenarioType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime: number; // в минутах
  characters: Character[];
  objectives: string[];
  vocabulary: string[];
  grammar: string[];
}
export interface Character {
  id: string;
  name: string;
  role: string;
  personality: string;
  background: string;
  avatar?: string;
}
export interface ScenarioSession {
  id: string;
  userId: string;
  scenarioId: string;
  interest: UserInterest;
  level: GermanLevel;
  startTime: Date;
  currentStep: number;
  totalSteps: number;
  dialogue: DialogueMessage[];
  userProgress: UserProgress;
  isCompleted: boolean;
  score?: number;
}
export interface DialogueMessage {
  id: string;
  speaker: "ai" | "user" | "character";
  characterId?: string;
  content: string;
  germanText?: string;
  russianTranslation?: string;
  audioUrl?: string;
  timestamp: Date;
  isCorrect?: boolean;
  feedback?: string;
  alternatives?: string[];
}
export interface UserProgress {
  vocabularyLearned: string[];
  grammarPracticed: string[];
  mistakesMade: string[];
  timeSpent: number;
  confidence: number;
  engagement: number;
}
export interface AIPromptConfig {
  systemPrompt: string;
  contextualPrompts: {
    [key in UserInterest]: string;
  };
  levelAdaptation: {
    [key in GermanLevel]: {
      vocabulary: string;
      grammar: string;
      complexity: string;
    };
  };
}
export interface SpeechSettings {
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
  language: "de-DE" | "ru-RU";
}
export interface ScenarioFeedback {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  vocabularyMastered: string[];
  grammarPoints: string[];
  nextRecommendations: string[];
  achievements: Achievement[];
}
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: "common" | "rare" | "epic" | "legendary";
}
export interface PersonalizedContent {
  greeting: string;
  scenario: string;
  characters: Character[];
  objectives: string[];
  vocabulary: string[];
  cultural_context: string;
}
