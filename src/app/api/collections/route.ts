import { type NextRequest, NextResponse } from "next/server";
import { auth, db } from "@/lib/firebase-admin";
import { isAuthenticated, getUserIdFromRequest } from "@/lib/auth-middleware";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import type { Collection } from "@/types/collections";
// GET /api/collections - получение всех коллекций пользователя
export async function GET(req: NextRequest) {
  try {
    // Проверяем авторизацию
    const { authenticated, userId } = await isAuthenticated(req);
    if (!authenticated || !userId) {
      return NextResponse.json(
        {
          error: "Требуется авторизация",
          message: "Для доступа к коллекциям необходимо войти в аккаунт",
          code: "auth_required",
        },
        { status: 401 },
      );
    }
    // Получаем коллекции из Firestore
    const collectionsRef = db.collection("collections");
    const snapshot = await collectionsRef.where("userId", "==", userId).get();
    const collections: Collection[] = [];
    // Заменяем forEach на for...of для улучшения производительности
    for (const doc of snapshot.docs) {
      collections.push({
        id: doc.id,
        ...doc.data(),
      } as Collection);
    }
    return NextResponse.json({ collections });
  } catch (error) {
    console.error("Ошибка при получении коллекций:", error);
    return NextResponse.json(
      { error: "Ошибка при получении коллекций" },
      { status: 500 },
    );
  }
}
// POST /api/collections - создание новой коллекции
export async function POST(req: NextRequest) {
  try {
    // Проверяем авторизацию
    const { authenticated, userId } = await isAuthenticated(req);
    if (!authenticated || !userId) {
      return NextResponse.json(
        {
          error: "Требуется авторизация",
          message: "Для создания коллекций необходимо войти в аккаунт",
          code: "auth_required",
        },
        { status: 401 },
      );
    }
    // Получаем данные из запроса
    const data = await req.json();
    // Валидация данных
    if (!data.name) {
      return NextResponse.json(
        { error: "Имя коллекции обязательно" },
        { status: 400 },
      );
    }
    // Создаем новую коллекцию
    const collectionId = data.id || `collection_${Date.now()}`;
    const now = new Date();
    const collectionData = {
      id: collectionId,
      userId,
      name: data.name,
      description: data.description || "",
      emoji: data.emoji || "📚",
      color: data.color || "blue",
      createdAt: now,
      updatedAt: now,
      wordsCount: 0,
      progress: {
        total: 0,
        new: 0,
        learning: 0,
        familiar: 0,
        mastered: 0,
        percentage: 0,
        streakDays: 0,
      },
    };
    // Сохраняем в Firestore
    await db.collection("collections").doc(collectionId).set(collectionData);
    return NextResponse.json({
      success: true,
      collection: collectionData,
    });
  } catch (error) {
    console.error("Ошибка при создании коллекции:", error);
    return NextResponse.json(
      { error: "Ошибка при создании коллекции" },
      { status: 500 },
    );
  }
}
// DELETE /api/collections?id={collectionId} - удаление коллекции
export async function DELETE(req: NextRequest) {
  try {
    // Проверяем авторизацию
    const { authenticated, userId } = await isAuthenticated(req);
    if (!authenticated || !userId) {
      return NextResponse.json(
        {
          error: "Требуется авторизация",
          message: "Для удаления коллекций необходимо войти в аккаунт",
          code: "auth_required",
        },
        { status: 401 },
      );
    }
    // Получаем ID коллекции из запроса
    const { searchParams } = new URL(req.url);
    const collectionId = searchParams.get("id");
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
    // Удаляем слова коллекции
    const wordsRef = db.collection("words");
    const wordsSnapshot = await wordsRef
      .where("collectionId", "==", collectionId)
      .get();
    // Используем пакетную операцию для удаления всех слов
    const batch = db.batch();
    // Заменяем forEach на for...of для улучшения производительности
    for (const doc of wordsSnapshot.docs) {
      batch.delete(doc.ref);
    }
    // Удаляем саму коллекцию
    batch.delete(collectionRef);
    // Выполняем пакетную операцию
    await batch.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка при удалении коллекции:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении коллекции" },
      { status: 500 },
    );
  }
}
