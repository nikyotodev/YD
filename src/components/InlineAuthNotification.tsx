"use client";
import { motion } from "framer-motion";
import { User, LogIn, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
interface InlineAuthNotificationProps {
  className?: string;
  onClose?: () => void;
  title?: string;
  description?: string;
}
export function InlineAuthNotification({
  className = "",
  onClose,
  title = "Требуется авторизация",
  description = "Чтобы добавлять слова в коллекции, необходимо войти в аккаунт",
}: InlineAuthNotificationProps) {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/auth");
    onClose?.();
  };
  const handleRegister = () => {
    router.push("/auth/register");
    onClose?.();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.3 }}
        className={`max-w-sm w-full ${className}`}
      >
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                <User className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {description}
                </p>
              </div>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          {/* Actions */}
          <div className="p-6">
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleLogin}
                variant="german"
                className="w-full"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Войти
              </Button>
              <Button
                onClick={handleRegister}
                variant="ghost"
                className="w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
              >
                Регистрация
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
