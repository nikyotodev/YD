import type { Metadata } from "next";
import { AuthPage } from "@/components/AuthPage";
export const metadata: Metadata = {
  title: "Регистрация | YourDeutsch",
  description:
    "Создайте аккаунт на платформе YourDeutsch для изучения немецкого языка с ИИ-помощником и персональными уроками.",
};
export default function Register() {
  return <AuthPage initialTab="register" />;
}
