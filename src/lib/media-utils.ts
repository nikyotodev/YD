/**
 * Утилиты для работы с CDN медиа файлов
 */
const MEDIA_CDN_URL = process.env.NEXT_PUBLIC_MEDIA_CDN_URL || "";
/**
 * Получает полный URL для медиа файла через CDN
 * @param relativePath - относительный путь к файлу (например: "/test-a1/file.pdf")
 * @returns полный URL или локальный путь если CDN не настроен
 */
export function getMediaUrl(relativePath: string): string {
  // Убираем ведущий слеш если он есть
  const cleanPath = relativePath.startsWith("/")
    ? relativePath.slice(1)
    : relativePath;
  // Если CDN настроен, возвращаем URL CDN
  if (MEDIA_CDN_URL) {
    return `${MEDIA_CDN_URL}/${cleanPath}`;
  }
  // Иначе возвращаем локальный путь
  return relativePath;
}
/**
 * Получает URL для аудио файлов из test-a1
 */
export function getTestA1AudioUrl(filename: string): string {
  return getMediaUrl(`public/test-a1/${filename}`);
}
/**
 * Получает URL для PDF файлов из test-a1
 */
export function getTestA1PdfUrl(filename: string): string {
  return getMediaUrl(`public/test-a1/${filename}`);
}
/**
 * Получает URL для аудио файлов экзаменов Goethe
 */
export function getGoetheAudioUrl(level: string, category: string): string {
  // Особая обработка для A1 (используем папку test-a1)
  if (level === "A1") {
    return "https://raw.githubusercontent.com/nikyotodev/talkify-media/main/public/test-a1/a1_exam_deutsch.mp3";
  }
  // Особая обработка для C1 (папка называется "C1 All", но в файле может быть другое название)
  if (level === "C1" && category === "All") {
    const folderName = "C1 All";
    const filename = "C1 All.mp3";
    const encodedFolder = encodeURIComponent(folderName);
    const encodedFilename = encodeURIComponent(filename);
    return `https://raw.githubusercontent.com/nikyotodev/talkify-media/main/public/${encodedFolder}/${encodedFilename}`;
  }
  // Для остальных экзаменов
  const folderName = `${level} ${category}`;
  const filename = `${level} ${category}.mp3`;
  // Кодируем пробелы для URL
  const encodedFolder = encodeURIComponent(folderName);
  const encodedFilename = encodeURIComponent(filename);
  return `https://raw.githubusercontent.com/nikyotodev/talkify-media/main/public/${encodedFolder}/${encodedFilename}`;
}
/**
 * Получает URL для PDF файлов экзаменов Goethe
 */
export function getGoethePdfUrl(level: string, category: string): string {
  // Особая обработка для A1 (используем папку test-a1)
  if (level === "A1") {
    return "https://raw.githubusercontent.com/nikyotodev/talkify-media/main/public/test-a1/fit1_uebungssatz_01_compressed.pdf";
  }
  // Особая обработка для C1 (в GitHub есть опечатка в названии файла)
  if (level === "C1" && category === "All") {
    const folderName = "C1 All";
    const filename = "C1 ALl.pdf"; // Опечатка в GitHub - "ALl" вместо "All"
    const encodedFolder = encodeURIComponent(folderName);
    const encodedFilename = encodeURIComponent(filename);
    return `https://raw.githubusercontent.com/nikyotodev/talkify-media/main/public/${encodedFolder}/${encodedFilename}`;
  }
  // Для остальных экзаменов
  const folderName = `${level} ${category}`;
  const filename = `${level} ${category}.pdf`;
  // Кодируем пробелы для URL
  const encodedFolder = encodeURIComponent(folderName);
  const encodedFilename = encodeURIComponent(filename);
  return `https://raw.githubusercontent.com/nikyotodev/talkify-media/main/public/${encodedFolder}/${encodedFilename}`;
}
/**
 * Получает отформатированное название экзамена
 */
export function getExamTitle(level: string, category: string): string {
  const categoryMap: Record<string, string> = {
    Vzroslie: "Взрослые",
    Youngsters: "Молодежь",
    YoungSters: "Молодежь", // для B1
    All: "Все возрастные группы",
  };
  return `${level} - ${categoryMap[category] || category}`;
}
/**
 * Получает цвет для уровня экзамена
 */
export function getLevelColor(level: string): string {
  switch (level) {
    case "A1":
      return "bg-green-500 text-white";
    case "A2":
      return "bg-blue-500 text-white";
    case "B1":
      return "bg-orange-500 text-white";
    case "B2":
      return "bg-pink-500 text-white";
    case "C1":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}
