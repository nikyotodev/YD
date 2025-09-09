import * as admin from "firebase-admin";
import { createLogger } from "./logger";
// Создаем логгер для Firebase Admin
const logger = createLogger("firebase-admin");
// Проверяем, инициализирован ли уже Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // Учетные данные Firebase приложения
    const serviceAccount = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        : undefined,
    };
    // Инициализируем Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    logger.info("Firebase Admin SDK инициализирован");
  } catch (error) {
    logger.error("Ошибка инициализации Firebase Admin SDK:", error);
  }
}
// Экспортируем сервисы Firebase Admin SDK
export const db = admin.firestore();
export const auth = admin.auth();
export default admin;
