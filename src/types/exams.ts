/**
 * Типы для системы экзаменов Goethe-Institut
 */
export type ExamLevel = "A1" | "A2" | "B1" | "B2" | "C1";
export type ExamCategory = "Vzroslie" | "Youngsters" | "YoungSters" | "All";
export interface ExamConfig {
  id: string;
  level: ExamLevel;
  category: ExamCategory;
  title: string;
  fullTitle: string;
  description: string;
  duration: number; // в минутах
  audioDuration: string;
  skills: string[]; // Аудирование, Чтение, Письмо, Говорение
  features: string[];
  audioFile: string;
  pdfFile: string;
  isAvailable: boolean;
}
export interface ExamModule {
  name: string;
  description: string;
  timeLimit: number;
  tasks: number;
}
// Конфигурация всех доступных экзаменов
export const EXAM_CONFIGS: ExamConfig[] = [
  {
    id: "a1-adults",
    level: "A1",
    category: "All", // Используем 'All' так как в GitHub нет отдельной папки для A1 Adults
    title: "Start Deutsch 1 (Взрослые)",
    fullTitle: "Goethe-Zertifikat A1: Start Deutsch 1 для взрослых",
    description:
      "Экзамен для начинающих взрослых, подтверждающий базовые знания немецкого языка",
    duration: 20,
    audioDuration: "12:22",
    skills: ["Аудирование"],
    features: [
      "Полный PDF экзамена на экране",
      "Интерактивный аудиоплеер с перемоткой",
      "Таймер экзамена и навигация по PDF",
      "Оригинальные материалы Goethe-Institut",
    ],
    audioFile: "a1_exam_deutsch.mp3",
    pdfFile: "fit1_uebungssatz_01_compressed.pdf",
    isAvailable: true,
  },
  {
    id: "a2-adults",
    level: "A2",
    category: "Vzroslie",
    title: "Goethe-Zertifikat A2 (Взрослые)",
    fullTitle: "Goethe-Zertifikat A2 для взрослых",
    description:
      "Экзамен A2 для взрослых учащихся с базовыми знаниями немецкого языка",
    duration: 25,
    audioDuration: "15:30",
    skills: ["Аудирование", "Чтение"],
    features: [
      "Материалы для взрослых учащихся",
      "Интерактивный PDF-просмотр",
      "Профессиональный аудиоплеер",
      "Реалистичная экзаменационная среда",
    ],
    audioFile: "A2 Vzroslie.mp3",
    pdfFile: "A2 Vzroslie.pdf",
    isAvailable: true,
  },
  {
    id: "a2-youngsters",
    level: "A2",
    category: "Youngsters",
    title: "Goethe-Zertifikat A2 (Молодежь)",
    fullTitle: "Goethe-Zertifikat A2 для молодежи",
    description: "Экзамен A2 для молодых учащихся с адаптированными заданиями",
    duration: 25,
    audioDuration: "14:45",
    skills: ["Аудирование", "Чтение"],
    features: [
      "Материалы для молодых учащихся",
      "Современные темы и ситуации",
      "Интерактивный интерфейс",
      "Красивый дизайн в стиле сайта",
    ],
    audioFile: "A2 Youngsters.mp3",
    pdfFile: "A2 Youngsters.pdf",
    isAvailable: true,
  },
  {
    id: "b1-adults",
    level: "B1",
    category: "Vzroslie",
    title: "Goethe-Zertifikat B1 (Взрослые)",
    fullTitle: "Goethe-Zertifikat B1 для взрослых",
    description: "Экзамен B1 для взрослых учащихся среднего уровня",
    duration: 30,
    audioDuration: "18:20",
    skills: ["Аудирование", "Чтение", "Письмо"],
    features: [
      "Материалы для взрослых учащихся",
      "Комплексные задания среднего уровня",
      "Профессиональная подача материала",
      "Полная симуляция экзамена",
    ],
    audioFile: "B1 Vzroslie.mp3",
    pdfFile: "B1 Vzroslie.pdf",
    isAvailable: true,
  },
  {
    id: "b1-youngsters",
    level: "B1",
    category: "YoungSters",
    title: "Goethe-Zertifikat B1 (Молодежь)",
    fullTitle: "Goethe-Zertifikat B1 для молодежи",
    description: "Экзамен B1 для молодых учащихся среднего уровня",
    duration: 30,
    audioDuration: "17:50",
    skills: ["Аудирование", "Чтение", "Письмо"],
    features: [
      "Материалы для молодых учащихся",
      "Актуальные темы и контексты",
      "Современный подход к обучению",
      "Интерактивная экзаменационная среда",
    ],
    audioFile: "B1 YoungSters.mp3",
    pdfFile: "B1 YoungSters.pdf",
    isAvailable: true,
  },
  {
    id: "b2-adults",
    level: "B2",
    category: "Vzroslie",
    title: "Goethe-Zertifikat B2 (Взрослые)",
    fullTitle: "Goethe-Zertifikat B2 для взрослых",
    description: "Экзамен B2 для взрослых учащихся продвинутого уровня",
    duration: 35,
    audioDuration: "22:15",
    skills: ["Аудирование", "Чтение", "Письмо", "Говорение"],
    features: [
      "Материалы для взрослых учащихся",
      "Сложные аутентичные тексты",
      "Профессиональная оценка навыков",
      "Полный спектр языковых модулей",
    ],
    audioFile: "B2 Vzroslie.mp3",
    pdfFile: "B2 Vzroslie.pdf",
    isAvailable: true,
  },
  {
    id: "b2-youngsters",
    level: "B2",
    category: "Youngsters",
    title: "Goethe-Zertifikat B2 (Молодежь)",
    fullTitle: "Goethe-Zertifikat B2 для молодежи",
    description: "Экзамен B2 для молодых учащихся продвинутого уровня",
    duration: 35,
    audioDuration: "21:40",
    skills: ["Аудирование", "Чтение", "Письмо", "Говорение"],
    features: [
      "Материалы для молодых учащихся",
      "Современные темы и медиа",
      "Интерактивная подача материала",
      "Комплексная оценка навыков",
    ],
    audioFile: "B2 Youngsters.mp3",
    pdfFile: "B2 Youngsters.pdf",
    isAvailable: true,
  },
  {
    id: "c1-all",
    level: "C1",
    category: "All",
    title: "Goethe-Zertifikat C1",
    fullTitle: "Goethe-Zertifikat C1 для всех возрастных групп",
    description: "Экзамен C1 высокого уровня для всех возрастных групп",
    duration: 40,
    audioDuration: "25:30",
    skills: ["Аудирование", "Чтение", "Письмо", "Говорение"],
    features: [
      "Единый экзамен для всех возрастов",
      "Высокий уровень сложности",
      "Аутентичные материалы",
      "Профессиональная сертификация",
    ],
    audioFile: "C1 All.mp3",
    pdfFile: "C1 All.pdf",
    isAvailable: true,
  },
];
/**
 * Получает конфигурацию экзамена по ID
 */
export function getExamConfig(examId: string): ExamConfig | undefined {
  return EXAM_CONFIGS.find((config) => config.id === examId);
}
/**
 * Получает все экзамены определенного уровня
 */
export function getExamsByLevel(level: ExamLevel): ExamConfig[] {
  return EXAM_CONFIGS.filter((config) => config.level === level);
}
/**
 * Получает отформатированное название категории
 */
export function getCategoryName(category: ExamCategory): string {
  const categoryMap: Record<ExamCategory, string> = {
    Vzroslie: "Взрослые",
    Youngsters: "Молодежь",
    YoungSters: "Молодежь",
    All: "Все возрастные группы",
  };
  return categoryMap[category];
}
