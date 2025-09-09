import type { Metadata } from "next";
import { AuthPage } from "@/components/AuthPage";
export const metadata: Metadata = {
  title: "Авторизация | YourDeutsch",
  description:
    "Войдите в аккаунт или зарегистрируйтесь на платформе YourDeutsch для изучения немецкого языка с ИИ-помощником.",
};
export default function Auth() {
  return <AuthPage />;
}
