import { type NextRequest, NextResponse } from "next/server";
import { auth, db } from "@/lib/firebase-admin";
import { isAuthenticated } from "@/lib/auth-middleware";
import type { WordInCollection } from "@/types/collections";
// GET /api/collections/words?collectionId={collectionId} - получение слов из коллекции
export async function GET(req: NextRequest) {
  try {
    // Проверяем авторизацию
    const { authenticated, userId } = await isAuthenticated(req);
    if (!authenticated || !userId) {
      return NextResponse.json(
        {
          error: "Требуется авторизация",
          message:
            "Для доступа к словам в коллекциях необходимо войти в аккаунт",
          code: "auth_required",
        },
        { status: 401 },
      );
    }
    // Получаем ID коллекции из запроса
    const { searchParams } = new URL(req.url);
    const collectionId = searchParams.get("collectionId");
    if (!collectionId) {
      return NextResponse.json(
        { error: "ID коллекции не указан" },
        { status: 400 },
      );
    }
    // Проверяем, что коллекция принадлежит пользователю
    const collectionRef = db.collection("collections").doc(collectionId);
    const collection = await collectionRef.get();
    if (!collection.exists) {
      return NextResponse.json(
        { error: "Коллекция не найдена" },
        { status: 404 },
      );
    }
    if (collection.data()?.userId !== userId) {
      return NextResponse.json(
        { error: "У вас нет доступа к этой коллекции" },
        { status: 403 },
      );
    }
    // Получаем слова из коллекции
    const wordsRef = db.collection("words");
    const snapshot = await wordsRef
      .where("collectionId", "==", collectionId)
      .get();
    const words: WordInCollection[] = [];
    // Заменяем forEach на for...of для улучшения производительности
    for (const doc of snapshot.docs) {
      words.push({
        id: doc.id,
        ...doc.data(),
      } as WordInCollection);
    }
    return NextResponse.json({ words });
  } catch (error) {
    console.error("Ошибка при получении слов:", error);
    return NextResponse.json(
      { error: "Ошибка при получении слов" },
      { status: 500 },
    );
  }
}
// POST /api/collections/words - добавление слова в коллекцию
export async function POST(req: NextRequest) {
  try {
    // Проверяем авторизацию
    const { authenticated, userId } = await isAuthenticated(req);
    if (!authenticated || !userId) {
      return NextResponse.json(
        {
          error: "Требуется авторизация",
          message: "Для добавления слов в коллекции необходимо войти в аккаунт",
          code: "auth_required",
        },
        { status: 401 },
      );
    }
    // Получаем данные из запроса
    const data = await req.json();
    // Валидация данных
    if (!data.collectionId || !data.germanWord || !data.translation) {
      return NextResponse.json(
        { error: "ID коллекции, немецкое слово и перевод обязательны" },
        { status: 400 },
      );
    }
    // Проверяем, что коллекция принадлежит пользователю
    const collectionRef = db.collection("collections").doc(data.collectionId);
    const collection = await collectionRef.get();
    if (!collection.exists) {
      return NextResponse.json(
        { error: "Коллекция не найдена" },
        { status: 404 },
      );
    }
    if (collection.data()?.userId !== userId) {
      return NextResponse.json(
        { error: "У вас нет доступа к этой коллекции" },
        { status: 403 },
      );
    }
    // Проверяем, нет ли уже такого слова в коллекции
    const wordsRef = db.collection("words");
    const wordSnapshot = await wordsRef
      .where("collectionId", "==", data.collectionId)
      .where("germanWord", "==", data.germanWord)
      .limit(1)
      .get();
    if (!wordSnapshot.empty) {
      return NextResponse.json(
        { error: "Это слово уже существует в коллекции" },
        { status: 409 },
      );
    }
    // Создаем новое слово
    const wordId = data.id || `word_${Date.now()}`;
    const now = new Date();
    const wordData = {
      id: wordId,
      userId,
      collectionId: data.collectionId,
      germanWord: data.germanWord,
      translation: data.translation,
      level: "new",
      correctCount: 0,
      incorrectCount: 0,
      addedAt: now,
      examples: data.examples || [],
      lastReviewed: null,
      nextReview: null,
    };
    // Сохраняем в Firestore
    await db.collection("words").doc(wordId).set(wordData);
    // Обновляем статистику коллекции
    const collectionData = collection.data();
    // Добавляем проверку на undefined
    if (!collectionData) {
      return NextResponse.json(
        { error: "Данные коллекции не найдены" },
        { status: 500 },
      );
    }
    collectionData.wordsCount++;
    collectionData.progress.total++;
    collectionData.progress.new++;
    collectionData.updatedAt = now;
    // Пересчитываем процент прогресса
    if (collectionData.progress.total > 0) {
      collectionData.progress.percentage = Math.round(
        (collectionData.progress.mastered / collectionData.progress.total) *
          100,
      );
    }
    await collectionRef.update(collectionData);
    return NextResponse.json({
      success: true,
      word: wordData,
    });
  } catch (error) {
    console.error("Ошибка при добавлении слова:", error);
    return NextResponse.json(
      { error: "Ошибка при добавлении слова" },
      { status: 500 },
    );
  }
}
// DELETE /api/collections/words?id={wordId} - удаление слова из коллекции
export async function DELETE(req: NextRequest) {
  try {
    // Проверяем авторизацию
    const { authenticated, userId } = await isAuthenticated(req);
    if (!authenticated || !userId) {
      return NextResponse.json(
        {
          error: "Требуется авторизация",
          message: "Для удаления слов из коллекций необходимо войти в аккаунт",
          code: "auth_required",
        },
        { status: 401 },
      );
    }
    // Получаем ID слова из запроса
    const { searchParams } = new URL(req.url);
    const wordId = searchParams.get("id");
    if (!wordId) {
      return NextResponse.json(
        { error: "ID слова не указан" },
        { status: 400 },
      );
    }
    // Получаем слово
    const wordRef = db.collection("words").doc(wordId);
    const word = await wordRef.get();
    if (!word.exists) {
      return NextResponse.json({ error: "Слово не найдено" }, { status: 404 });
    }
    const wordData = word.data();
    // Проверяем наличие данных слова
    if (!wordData) {
      return NextResponse.json(
        { error: "Данные слова не найдены" },
        { status: 500 },
      );
    }
    // Проверяем, что слово принадлежит пользователю
    if (wordData.userId !== userId) {
      return NextResponse.json(
        { error: "У вас нет доступа к этому слову" },
        { status: 403 },
      );
    }
    // Получаем коллекцию для обновления статистики
    const collectionRef = db
      .collection("collections")
      .doc(wordData.collectionId);
    const collection = await collectionRef.get();
    if (!collection.exists) {
      // Удаляем слово, даже если коллекция не найдена
      await wordRef.delete();
      return NextResponse.json({ success: true });
    }
    // Обновляем статистику коллекции
    const collectionData = collection.data();
    // Проверяем наличие данных коллекции
    if (!collectionData) {
      // Удаляем слово даже если данные коллекции не найдены
      await wordRef.delete();
      return NextResponse.json({ success: true });
    }
    collectionData.wordsCount = Math.max(0, collectionData.wordsCount - 1);
    collectionData.progress.total = Math.max(
      0,
      collectionData.progress.total - 1,
    );
    // Уменьшаем счетчик соответствующего уровня
    if (wordData.level === "new") {
      collectionData.progress.new = Math.max(
        0,
        collectionData.progress.new - 1,
      );
    } else if (wordData.level === "learning") {
      collectionData.progress.learning = Math.max(
        0,
        collectionData.progress.learning - 1,
      );
    } else if (wordData.level === "familiar") {
      collectionData.progress.familiar = Math.max(
        0,
        collectionData.progress.familiar - 1,
      );
    } else if (wordData.level === "mastered") {
      collectionData.progress.mastered = Math.max(
        0,
        collectionData.progress.mastered - 1,
      );
    }
    collectionData.updatedAt = new Date();
    // Пересчитываем процент прогресса
    if (collectionData.progress.total > 0) {
      collectionData.progress.percentage = Math.round(
        (collectionData.progress.mastered / collectionData.progress.total) *
          100,
      );
    } else {
      collectionData.progress.percentage = 0;
    }
    // Выполняем пакетные операции
    const batch = db.batch();
    batch.delete(wordRef);
    batch.update(collectionRef, collectionData);
    await batch.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка при удалении слова:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении слова" },
      { status: 500 },
    );
  }
}
