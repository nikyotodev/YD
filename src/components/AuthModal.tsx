"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  Send,
  Shield,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { userService } from "@/lib/user-service";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
}

export function AuthModal({
  isOpen,
  onClose,
  initialTab = "login",
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<{
    needsVerification: boolean;
    verificationEmailSent: boolean;
    verificationEmailSending: boolean;
    emailVerified: boolean;
  }>({
    needsVerification: false,
    verificationEmailSent: false,
    verificationEmailSending: false,
    emailVerified: false,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { login, register, resetPassword, user } = useUser();

  // Автофокус на поля ввода
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (activeTab === "register" && nameInputRef.current) {
          nameInputRef.current.focus();
        } else if (emailInputRef.current) {
          emailInputRef.current.focus();
        }
      }, 300);
    }
  }, [isOpen, activeTab]);

  // Проверка статуса верификации
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (
      verificationStatus.needsVerification &&
      !verificationStatus.emailVerified
    ) {
      intervalId = setInterval(async () => {
        const verified = await userService.checkEmailVerification();
        if (verified) {
          setVerificationStatus((prev) => ({ ...prev, emailVerified: true }));
          setSuccessMessage(
            "Email успешно подтвержден! Теперь вы можете использовать все функции платформы.",
          );
          clearInterval(intervalId);
        }
      }, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [verificationStatus.needsVerification, verificationStatus.emailVerified]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (activeTab === "login") {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          setSuccessMessage("Вход выполнен успешно!");
          if (user && !user.emailVerified) {
            setVerificationStatus({
              needsVerification: true,
              verificationEmailSent: false,
              verificationEmailSending: false,
              emailVerified: false,
            });
          } else {
            setTimeout(() => {
              onClose();
              resetForm();
            }, 1500);
          }
        } else {
          setError(result.error || "Ошибка входа");
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError("Пароли не совпадают");
          setIsLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError("Пароль должен содержать минимум 6 символов");
          setIsLoading(false);
          return;
        }
        if (!formData.name.trim()) {
          setError("Введите ваше имя");
          setIsLoading(false);
          return;
        }

        const result = await register(
          formData.email,
          formData.password,
          formData.name.trim(),
        );
        if (result.success) {
          setSuccessMessage(
            "Регистрация успешна! Мы отправили письмо для подтверждения вашего email.",
          );
          setVerificationStatus({
            needsVerification: true,
            verificationEmailSent: true,
            verificationEmailSending: false,
            emailVerified: false,
          });
        } else {
          setError(result.error || "Ошибка регистрации");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!formData.email) {
      setError("Введите email для сброса пароля");
      return;
    }
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const result = await resetPassword(formData.email);
      if (result.success) {
        setResetEmailSent(true);
        setSuccessMessage("Письмо для сброса пароля отправлено на ваш email");
      } else {
        setError(result.error || "Ошибка сброса пароля");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setVerificationStatus((prev) => ({
      ...prev,
      verificationEmailSending: true,
    }));
    setError("");
    setSuccessMessage("");

    try {
      const result = await userService.resendVerificationEmail();
      if (result.success) {
        setVerificationStatus((prev) => ({
          ...prev,
          verificationEmailSent: true,
          verificationEmailSending: false,
        }));
        setSuccessMessage(
          "Письмо с подтверждением повторно отправлено на ваш email",
        );
      } else {
        setError(result.error || "Ошибка отправки письма");
        setVerificationStatus((prev) => ({
          ...prev,
          verificationEmailSending: false,
        }));
      }
    } catch (error) {
      setError("Произошла ошибка при отправке письма");
      setVerificationStatus((prev) => ({
        ...prev,
        verificationEmailSending: false,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
    setSuccessMessage("");
    setResetEmailSent(false);
    setVerificationStatus({
      needsVerification: false,
      verificationEmailSent: false,
      verificationEmailSending: false,
      emailVerified: false,
    });
  };

  const handleTabChange = (tab: "login" | "register") => {
    setActiveTab(tab);
    setError("");
    setSuccessMessage("");
    setResetEmailSent(false);
    setVerificationStatus({
      needsVerification: false,
      verificationEmailSent: false,
      verificationEmailSending: false,
      emailVerified: false,
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Улучшенный блюр-оверлей */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-xl"
          onClick={onClose}
        />

        {/* Модальное окно с улучшенными анимациями */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.4
          }}
          className="relative w-full max-w-lg mx-auto"
        >
          {/* Градиентная рамка */}
          <div className="relative p-1 rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-purple-500/20 dark:via-pink-500/10 dark:to-purple-500/5">
            <Card className="relative bg-white/10 dark:bg-black/20 backdrop-blur-2xl border-0 rounded-[calc(1.5rem-4px)] shadow-2xl overflow-hidden">
              {/* Декоративные элементы */}
              <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-red-500/20 to-yellow-500/20 dark:from-purple-500/20 dark:to-pink-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-tr from-yellow-500/15 to-red-500/15 dark:from-pink-500/15 dark:to-purple-500/15 rounded-full blur-3xl" />
              </div>

              {/* Заголовок */}
              <div className="relative p-8 pb-6">
                <div className="flex items-center justify-between mb-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500/20 to-yellow-500/20 dark:from-purple-500/20 dark:to-pink-500/20 backdrop-blur-xl border border-white/20">
                      {activeTab === "login" ? (
                        <Shield className="h-6 w-6 text-red-600 dark:text-purple-400" />
                      ) : (
                        <UserCheck className="h-6 w-6 text-red-600 dark:text-purple-400" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-red-600 dark:from-white dark:to-purple-300 bg-clip-text text-transparent">
                        {activeTab === "login" ? "Добро пожаловать" : "Создать аккаунт"}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {activeTab === "login"
                          ? "Войдите в свой аккаунт"
                          : "Начните изучение немецкого"
                        }
                      </p>
                    </div>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-200 backdrop-blur-sm border border-white/10"
                  >
                    <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </motion.button>
                </div>

                {/* Вкладки с улучшенным дизайном */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative p-1 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20"
                >
                  <div className="relative flex">
                    <motion.div
                      className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-red-500/20 to-yellow-500/20 dark:from-purple-500/20 dark:to-pink-500/20 rounded-xl backdrop-blur-xl border border-white/30"
                      initial={false}
                      animate={{
                        x: activeTab === "login" ? 0 : "100%",
                        width: "50%",
                      }}
                      transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    />
                    <button
                      onClick={() => handleTabChange("login")}
                      className={`relative flex-1 py-3 px-6 text-sm font-semibold rounded-xl transition-all duration-200 ${
                        activeTab === "login"
                          ? "text-red-700 dark:text-purple-200"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      Вход
                    </button>
                    <button
                      onClick={() => handleTabChange("register")}
                      className={`relative flex-1 py-3 px-6 text-sm font-semibold rounded-xl transition-all duration-200 ${
                        activeTab === "register"
                          ? "text-red-700 dark:text-purple-200"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      Регистрация
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Контент */}
              <div className="relative px-8 pb-8">
                {/* Уведомления */}
                <AnimatePresence mode="wait">
                  {verificationStatus.needsVerification && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`p-4 rounded-2xl backdrop-blur-xl border ${
                        verificationStatus.emailVerified
                          ? "bg-green-500/10 border-green-500/20"
                          : "bg-orange-500/10 border-orange-500/20"
                      }`}>
                        {verificationStatus.emailVerified ? (
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <p className="text-sm text-green-300">
                              Email подтвержден! Добро пожаловать на платформу.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <AlertCircle className="w-5 h-5 text-orange-400" />
                              <p className="text-sm text-orange-300">
                                Подтвердите ваш email для доступа ко всем функциям
                              </p>
                            </div>
                            <p className="text-xs text-orange-300/80 ml-8">
                              Письмо отправлено на {formData.email}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleResendVerification}
                              disabled={verificationStatus.verificationEmailSending}
                              className="ml-8 text-orange-300 hover:text-orange-200 h-8 px-3"
                            >
                              {verificationStatus.verificationEmailSending ? (
                                <>
                                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                  Отправка...
                                </>
                              ) : (
                                <>
                                  <Send className="w-3 h-3 mr-2" />
                                  Отправить повторно
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {successMessage && !verificationStatus.needsVerification && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 backdrop-blur-xl">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <p className="text-sm text-green-300">{successMessage}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl">
                        <div className="flex items-center space-x-3">
                          <AlertCircle className="w-5 h-5 text-red-400" />
                          <p className="text-sm text-red-300">{error}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Форма */}
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Поле имени для регистрации */}
                  {activeTab === "register" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Имя
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Ваше имя"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="pl-12 h-12 bg-white/10 dark:bg-white/5 border border-white/20 rounded-xl backdrop-blur-xl text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:border-red-500/50 dark:focus:border-purple-500/50 focus:ring-0"
                          ref={nameInputRef}
                          required
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Email поле */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="pl-12 h-12 bg-white/10 dark:bg-white/5 border border-white/20 rounded-xl backdrop-blur-xl text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:border-red-500/50 dark:focus:border-purple-500/50 focus:ring-0"
                        ref={emailInputRef}
                        required
                      />
                    </div>
                  </div>

                  {/* Поле пароля */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Пароль
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="pl-12 pr-12 h-12 bg-white/10 dark:bg-white/5 border border-white/20 rounded-xl backdrop-blur-xl text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:border-red-500/50 dark:focus:border-purple-500/50 focus:ring-0"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Подтверждение пароля для регистрации */}
                  {activeTab === "register" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Подтвердите пароль
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="pl-12 pr-12 h-12 bg-white/10 dark:bg-white/5 border border-white/20 rounded-xl backdrop-blur-xl text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:border-red-500/50 dark:focus:border-purple-500/50 focus:ring-0"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Забыли пароль для входа */}
                  {activeTab === "login" && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={handleResetPassword}
                        className="text-sm text-red-600 dark:text-purple-400 hover:text-red-700 dark:hover:text-purple-300 transition-colors font-medium"
                        disabled={isLoading}
                      >
                        Забыли пароль?
                      </button>
                    </div>
                  )}

                  {/* Кнопка отправки */}
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 dark:from-purple-600 dark:to-pink-600 hover:from-red-700 hover:to-red-600 dark:hover:from-purple-700 dark:hover:to-pink-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={isLoading || verificationStatus.needsVerification}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        {activeTab === "login" ? "Вход..." : "Регистрация..."}
                      </>
                    ) : activeTab === "login" ? (
                      "Войти в аккаунт"
                    ) : (
                      "Создать аккаунт"
                    )}
                  </Button>
                </motion.form>

                {/* Дополнительная информация */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 text-center"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activeTab === "login"
                      ? "Нет аккаунта? "
                      : "Уже есть аккаунт? "}
                    <button
                      onClick={() =>
                        handleTabChange(
                          activeTab === "login" ? "register" : "login",
                        )
                      }
                      className="text-red-600 dark:text-purple-400 hover:text-red-700 dark:hover:text-purple-300 transition-colors font-semibold"
                    >
                      {activeTab === "login" ? "Зарегистрируйтесь" : "Войдите"}
                    </button>
                  </p>
                </motion.div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
