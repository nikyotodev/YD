export interface KeyFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  gradient: string;
  iconBg: string;
  hoverColor: string;
  stats: string;
}
export interface GermanFact {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  color: string;
}
export interface BenefitCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
}
export interface RealLifeScenario {
  title: string;
  subtitle: string;
  translation: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}
export interface FunFact {
  fact: string;
  example: string;
  meaning: string;
}
export interface Testimonial {
  id: string;
  avatar: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}
export interface LearningApproach {
  icon: React.ReactNode;
  title: string;
  description: string;
}
export interface ChatMessage {
  type: "ai" | "user";
  content: string;
  isTyping?: boolean;
}
export interface DemoState {
  isExpanded: boolean;
  currentStep: number;
}
