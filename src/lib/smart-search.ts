/**
 * Утилиты для умного поиска с поддержкой умлаутов и диакритических знаков
 */
// Карта замен для немецких умлаутов и других диакритических знаков
const DIACRITIC_MAP: Record<string, string> = {
  // Немецкие умлауты
  ä: "ae",
  ö: "oe",
  ü: "ue",
  Ä: "Ae",
  Ö: "Oe",
  Ü: "Ue",
  ß: "ss",
  // Французские диакритики
  à: "a",
  á: "a",
  â: "a",
  ã: "a",
  ā: "a",
  ă: "a",
  ą: "a",
  À: "A",
  Á: "A",
  Â: "A",
  Ã: "A",
  Ā: "A",
  Ă: "A",
  Ą: "A",
  è: "e",
  é: "e",
  ê: "e",
  ë: "e",
  ē: "e",
  ĕ: "e",
  ė: "e",
  ę: "e",
  ě: "e",
  È: "E",
  É: "E",
  Ê: "E",
  Ë: "E",
  Ē: "E",
  Ĕ: "E",
  Ė: "E",
  Ę: "E",
  Ě: "E",
  ì: "i",
  í: "i",
  î: "i",
  ï: "i",
  ĩ: "i",
  ī: "i",
  ĭ: "i",
  į: "i",
  Ì: "I",
  Í: "I",
  Î: "I",
  Ï: "I",
  Ĩ: "I",
  Ī: "I",
  Ĭ: "I",
  Į: "I",
  ò: "o",
  ó: "o",
  ô: "o",
  õ: "o",
  ō: "o",
  ŏ: "o",
  ő: "o",
  Ò: "O",
  Ó: "O",
  Ô: "O",
  Õ: "O",
  Ō: "O",
  Ŏ: "O",
  Ő: "O",
  ù: "u",
  ú: "u",
  û: "u",
  ũ: "u",
  ū: "u",
  ŭ: "u",
  ů: "u",
  ű: "u",
  ų: "u",
  Ù: "U",
  Ú: "U",
  Û: "U",
  Ũ: "U",
  Ū: "U",
  Ŭ: "U",
  Ů: "U",
  Ű: "U",
  Ų: "U",
  ç: "c",
  ć: "c",
  ĉ: "c",
  ċ: "c",
  č: "c",
  Ç: "C",
  Ć: "C",
  Ĉ: "C",
  Ċ: "C",
  Č: "C",
  ñ: "n",
  ń: "n",
  ņ: "n",
  ň: "n",
  Ñ: "N",
  Ń: "N",
  Ņ: "N",
  Ň: "N",
  ý: "y",
  ÿ: "y",
  ŷ: "y",
  Ý: "Y",
  Ÿ: "Y",
  Ŷ: "Y",
  // Скандинавские и славянские
  å: "a",
  æ: "ae",
  ø: "o",
  Å: "A",
  Æ: "AE",
  Ø: "O",
};
// Обратная карта для замен немецких умлаутов
const REVERSE_UMLAUT_MAP: Record<string, string[]> = {
  ae: ["ä", "ae"],
  oe: ["ö", "oe"],
  ue: ["ü", "ue"],
  Ae: ["Ä", "Ae"],
  Oe: ["Ö", "Oe"],
  Ue: ["Ü", "Ue"],
  ss: ["ß", "ss"],
};
/**
 * Нормализует строку, убирая диакритические знаки
 */
export function normalizeDiacritics(text: string): string {
  return text
    .split("")
    .map((char) => DIACRITIC_MAP[char] || char)
    .join("")
    .toLowerCase();
}
/**
 * Создает все возможные варианты поиска для слова с умлаутами
 */
export function generateSearchVariants(searchTerm: string): string[] {
  const variants = new Set<string>();
  const normalizedTerm = searchTerm.toLowerCase().trim();
  // Добавляем оригинальный термин
  variants.add(normalizedTerm);
  // Добавляем нормализованную версию
  const normalized = normalizeDiacritics(normalizedTerm);
  variants.add(normalized);
  // Генерируем варианты с заменой ae/oe/ue на умлауты
  const currentVariant = normalized;
  // Заменяем ae на ä
  if (currentVariant.includes("ae")) {
    const withUmlaut = currentVariant.replace(/ae/g, "ä");
    variants.add(withUmlaut);
    // Также пробуем частичные замены
    const aePositions = findAllOccurrences(currentVariant, "ae");
    for (let i = 0; i < aePositions.length; i++) {
      const partialReplacement = replaceAtPosition(
        currentVariant,
        aePositions[i],
        "ae",
        "ä",
      );
      variants.add(partialReplacement);
    }
  }
  // Заменяем oe на ö
  if (currentVariant.includes("oe")) {
    const withUmlaut = currentVariant.replace(/oe/g, "ö");
    variants.add(withUmlaut);
    const oePositions = findAllOccurrences(currentVariant, "oe");
    for (let i = 0; i < oePositions.length; i++) {
      const partialReplacement = replaceAtPosition(
        currentVariant,
        oePositions[i],
        "oe",
        "ö",
      );
      variants.add(partialReplacement);
    }
  }
  // НОВОЕ: Заменяем au на äu (для слов типа verkaufer -> verkäufer)
  // Но только в определенных контекстах, чтобы избежать неправильных замен
  if (currentVariant.includes("au")) {
    // Проверяем, что это не корень слова kaufen, laufen, и т.д.
    const auVariantsToTry = [];
    // Для слов на -kaufer, -läufer и подобных - заменяем
    if (
      currentVariant.includes("kaufer") ||
      currentVariant.includes("laufer")
    ) {
      auVariantsToTry.push(currentVariant.replace(/au/g, "äu"));
    }
    // Для других случаев тоже пробуем, но осторожно
    else if (
      currentVariant.includes("au") &&
      !currentVariant.endsWith("kaufen") &&
      !currentVariant.endsWith("laufen")
    ) {
      auVariantsToTry.push(currentVariant.replace(/au/g, "äu"));
    }
    for (const variant of auVariantsToTry) {
      variants.add(variant);
    }
  }
  // Заменяем ue на ü
  if (currentVariant.includes("ue")) {
    const withUmlaut = currentVariant.replace(/ue/g, "ü");
    variants.add(withUmlaut);
    const uePositions = findAllOccurrences(currentVariant, "ue");
    for (let i = 0; i < uePositions.length; i++) {
      const partialReplacement = replaceAtPosition(
        currentVariant,
        uePositions[i],
        "ue",
        "ü",
      );
      variants.add(partialReplacement);
    }
  }
  // Заменяем ss на ß
  if (currentVariant.includes("ss")) {
    const withEszett = currentVariant.replace(/ss/g, "ß");
    variants.add(withEszett);
  }
  // Комбинированные замены (все сразу)
  let combinedVariant = currentVariant
    .replace(/ae/g, "ä")
    .replace(/oe/g, "ö")
    .replace(/ue/g, "ü")
    .replace(/ss/g, "ß");
  // Добавляем замену au -> äu только для подходящих слов
  if (
    currentVariant.includes("kaufer") ||
    currentVariant.includes("laufer") ||
    (currentVariant.includes("au") &&
      !currentVariant.endsWith("kaufen") &&
      !currentVariant.endsWith("laufen"))
  ) {
    combinedVariant = combinedVariant.replace(/au/g, "äu");
  }
  if (combinedVariant !== currentVariant) {
    variants.add(combinedVariant);
  }
  // Удаляем пустые и слишком короткие варианты
  return Array.from(variants).filter((variant) => variant.length > 0);
}
/**
 * Находит все вхождения подстроки в строке
 */
function findAllOccurrences(str: string, searchStr: string): number[] {
  const positions: number[] = [];
  let position = str.indexOf(searchStr);
  while (position !== -1) {
    positions.push(position);
    position = str.indexOf(searchStr, position + 1);
  }
  return positions;
}
/**
 * Заменяет подстроку в определенной позиции
 */
function replaceAtPosition(
  str: string,
  position: number,
  searchStr: string,
  replaceStr: string,
): string {
  return (
    str.substring(0, position) +
    replaceStr +
    str.substring(position + searchStr.length)
  );
}
/**
 * Проверяет, соответствует ли слово поисковому запросу с учетом умлаутов
 */
export function matchesSearchTerm(word: string, searchTerm: string): boolean {
  const searchVariants = generateSearchVariants(searchTerm);
  const wordNormalized = normalizeDiacritics(word.toLowerCase());
  const wordOriginal = word.toLowerCase();
  return searchVariants.some((variant) => {
    // Проверяем точное совпадение
    if (wordOriginal === variant || wordNormalized === variant) {
      return true;
    }
    // Проверяем частичное совпадение (начало слова)
    if (
      wordOriginal.startsWith(variant) ||
      wordNormalized.startsWith(variant)
    ) {
      return true;
    }
    // Проверяем вхождение (для более мягкого поиска)
    if (wordOriginal.includes(variant) || wordNormalized.includes(variant)) {
      return true;
    }
    return false;
  });
}
/**
 * Предлагает исправления для поискового запроса
 */
export function suggestCorrections(searchTerm: string): string[] {
  const suggestions = new Set<string>();
  const variants = generateSearchVariants(searchTerm);
  // Добавляем все варианты как предложения
  for (const variant of variants) {
    if (variant !== searchTerm.toLowerCase()) {
      suggestions.add(variant);
    }
  }
  // Специальные предложения для распространенных ошибок
  const commonMistakes: Record<string, string[]> = {
    hande: ["hände", "hand"],
    schon: ["schön", "schon"],
    uber: ["über"],
    fur: ["für"],
    grun: ["grün"],
    tür: ["tuer", "tur"],
    müde: ["muede", "mude"],
    köln: ["koeln", "koln"],
    verkaufer: ["verkäufer"],
    laufer: ["läufer"],
    kaufer: ["käufer"],
    rauber: ["räuber"],
    sauber: ["säuber"],
  };
  const normalizedSearch = searchTerm.toLowerCase();
  if (commonMistakes[normalizedSearch]) {
    for (const suggestion of commonMistakes[normalizedSearch]) {
      suggestions.add(suggestion);
    }
  }
  return Array.from(suggestions).slice(0, 5); // Ограничиваем количество предложений
}
/**
 * Умная сортировка результатов поиска по релевантности
 */
export function sortByRelevance<T extends { original: string }>(
  results: T[],
  searchTerm: string,
): T[] {
  const searchVariants = generateSearchVariants(searchTerm);
  return results.sort((a, b) => {
    const scoreA = calculateRelevanceScore(a.original, searchVariants);
    const scoreB = calculateRelevanceScore(b.original, searchVariants);
    return scoreB - scoreA; // Сортируем по убыванию релевантности
  });
}
/**
 * Вычисляет оценку релевантности для слова
 */
function calculateRelevanceScore(
  word: string,
  searchVariants: string[],
): number {
  const wordLower = word.toLowerCase();
  const wordNormalized = normalizeDiacritics(wordLower);
  let maxScore = 0;
  for (const variant of searchVariants) {
    let score = 0;
    // Точное совпадение - максимальный балл
    if (wordLower === variant || wordNormalized === variant) {
      score = 100;
    }
    // Начинается с искомого слова - высокий балл
    else if (
      wordLower.startsWith(variant) ||
      wordNormalized.startsWith(variant)
    ) {
      score = 80;
    }
    // Содержит искомое слово - средний балл
    else if (wordLower.includes(variant) || wordNormalized.includes(variant)) {
      score = 60;
    }
    // Бонус за длину совпадения
    if (score > 0) {
      const lengthRatio = variant.length / Math.max(wordLower.length, 1);
      score += lengthRatio * 20;
    }
    maxScore = Math.max(maxScore, score);
  }
  return maxScore;
}
