/**
 * Типы для работы с CSV файлом немецких существительных
 * Источник: https://github.com/gambolputty/german-nouns
 */
export type GermanGender = "der" | "die" | "das";
/**
 * Интерфейс для одной записи из CSV файла немецких существительных
 */
export interface CSVNounRecord {
  // Основные данные
  lemma: string; // основная форма слова
  pos: string; // часть речи
  genus: string; // основной род
  genus1?: string; // альтернативный род 1
  genus2?: string; // альтернативный род 2
  genus3?: string; // альтернативный род 3
  genus4?: string; // альтернативный род 4
  // Номинатив
  nominativSingular: string;
  nominativSingular1?: string;
  nominativSingular2?: string;
  nominativSingular3?: string;
  nominativSingular4?: string;
  nominativPlural: string;
  nominativPlural1?: string;
  nominativPlural2?: string;
  nominativPlural3?: string;
  nominativPlural4?: string;
  // Генитив
  genitivSingular: string;
  genitivSingular1?: string;
  genitivSingular2?: string;
  genitivSingular3?: string;
  genitivSingular4?: string;
  genitivPlural: string;
  genitivPlural1?: string;
  genitivPlural2?: string;
  genitivPlural3?: string;
  genitivPlural4?: string;
  // Датив
  dativSingular: string;
  dativSingular1?: string;
  dativSingular2?: string;
  dativSingular3?: string;
  dativSingular4?: string;
  dativPlural: string;
  dativPlural1?: string;
  dativPlural2?: string;
  dativPlural3?: string;
  dativPlural4?: string;
  // Аккузатив
  akkusativSingular: string;
  akkusativSingular1?: string;
  akkusativSingular2?: string;
  akkusativSingular3?: string;
  akkusativSingular4?: string;
  akkusativPlural: string;
  akkusativPlural1?: string;
  akkusativPlural2?: string;
  akkusativPlural3?: string;
  akkusativPlural4?: string;
}
/**
 * Упрощенный интерфейс для использования в приложении
 */
export interface ProcessedNoun {
  word: string; // основная форма
  article: GermanGender; // основной артикль
  plural?: string; // основная форма множественного числа
  alternativeGenders?: GermanGender[]; // альтернативные рода
  alternativePlurals?: string[]; // альтернативные формы множественного числа
  source: "csv";
  confidence: number; // уверенность в правильности артикля
  isCompound?: boolean; // сложное слово
  hasMultipleMeanings?: boolean; // имеет несколько значений с разными родами
}
/**
 * Статистика обработки CSV
 */
export interface CSVProcessingStats {
  totalRecords: number;
  successfullyParsed: number;
  skippedRecords: number;
  recordsWithMultipleGenders: number;
  recordsWithMultiplePlurals: number;
  errors: string[];
}
/**
 * Конфигурация для парсера CSV
 */
export interface CSVParserConfig {
  skipHeader: boolean;
  validateGender: boolean;
  allowMultipleGenders: boolean;
  allowEmptyPlural: boolean;
  maxWordLength: number;
  minWordLength: number;
}
