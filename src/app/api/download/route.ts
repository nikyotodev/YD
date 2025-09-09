import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import archiver from "archiver";
import { createWriteStream } from "node:fs";
export async function GET() {
  try {
    const projectRoot = process.cwd();
    const zipPath = path.join(projectRoot, "talkify-german-learning.zip");
    // Удаляем старый архив если существует
    try {
      await fs.unlink(zipPath);
    } catch {
      // Файл не существует, это нормально
    }
    // Создаем архив с помощью archiver (быстрее чем zip команда)
    const output = createWriteStream(zipPath);
    const archive = archiver("zip", {
      zlib: { level: 1 }, // Быстрое сжатие
    });
    // Промис для ожидания завершения архивации
    const archivePromise = new Promise((resolve, reject) => {
      output.on("close", () => {
        resolve(true);
      });
      archive.on("error", (err: Error) => {
        reject(err);
      });
    });
    // Подключаем поток к файлу
    archive.pipe(output);
    // Добавляем все файлы и папки проекта
    const filesToInclude = [
      "src/**/*",
      "public/**/*",
      ".same/**/*",
      "package.json",
      "bun.lock",
      "next.config.js",
      "tailwind.config.ts",
      "tsconfig.json",
      "postcss.config.mjs",
      "components.json",
      "biome.json",
      "README.md",
      "next-env.d.ts",
      "netlify.toml",
      "eslint.config.mjs",
      ".gitignore",
      ".env.local",
    ];
    // Добавляем файлы с исключениями
    for (const pattern of filesToInclude) {
      if (pattern.includes("**/*")) {
        const dir = pattern.replace("/**/*", "");
        const dirPath = path.join(projectRoot, dir);
        try {
          await fs.access(dirPath);
          archive.directory(dirPath, dir);
        } catch {
          // Папка не найдена, пропускаем
        }
      } else {
        const filePath = path.join(projectRoot, pattern);
        try {
          await fs.access(filePath);
          archive.file(filePath, { name: pattern });
        } catch {
          // Файл не найден, пропускаем
        }
      }
    }
    // Финализируем архив
    await archive.finalize();
    // Ожидаем завершения
    await archivePromise;
    // Читаем созданный архив
    const zipBuffer = await fs.readFile(zipPath);
    // Очищаем временный файл
    await fs.unlink(zipPath);
    // Возвращаем архив
    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition":
          'attachment; filename="talkify-german-learning.zip"',
        "Content-Length": zipBuffer.length.toString(),
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Не удалось создать архив проекта: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 },
    );
  }
}
