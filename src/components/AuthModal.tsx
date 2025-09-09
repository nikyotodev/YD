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
      }, 5000); // Проверяем каждые 5 секунд
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
          // Проверяем, верифицирован ли email
          if (user && !user.emailVerified) {
            setVerificationStatus({
              needsVerification: true,
              verificationEmailSent: false,
              verificationEmailSending: false,
              emailVerified: false,
            });
          } else {
            // Закрываем модальное окно через небольшую задержку, чтобы показать сообщение об успехе
            setTimeout(() => {
              onClose();
              resetForm();
            }, 1500);
          }
        } else {
          setError(result.error || "Ошибка входа");
        }
      } else {
        // Валидация для регистрации
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
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-md mx-auto"
        >
          <Card className="glass-card bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-4">
                <div className="glass p-2 bg-gradient-to-br from-german-red/20 to-german-gold/20 rounded-xl dark:from-dark-theme-purple/30 dark:to-dark-theme-pink/30">
                  <User className="h-5 w-5 text-german-red dark:text-dark-theme-pink" />
                </div>
                <h2 className="text-xl font-bold gradient-text">
                  {activeTab === "login"
                    ? "Войти в аккаунт"
                    : "Создать аккаунт"}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="glass text-muted-foreground hover:text-foreground hover:bg-white/80 dark:hover:bg-black/30"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6">
              {/* Tabs */}
              <div className="flex glass rounded-lg p-1 mb-6">
                <button
                  onClick={() => handleTabChange("login")}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                    activeTab === "login"
                      ? "bg-gradient-to-r from-german-red/20 to-german-gold/20 text-german-red dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20 dark:text-dark-theme-pink"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Вход
                </button>
                <button
                  onClick={() => handleTabChange("register")}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                    activeTab === "register"
                      ? "bg-gradient-to-r from-german-red/20 to-german-gold/20 text-german-red dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20 dark:text-dark-theme-pink"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Регистрация
                </button>
              </div>
              {/* Email Verification */}
              {verificationStatus.needsVerification && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 p-3 glass rounded-lg border ${
                    verificationStatus.emailVerified
                      ? "border-green-500/20 bg-green-500/10"
                      : "border-german-red/20 bg-german-red/10 dark:border-pink-500/20 dark:bg-pink-500/10"
                  }`}
                >
                  {verificationStatus.emailVerified ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <p className="text-sm text-green-400">
                        Email подтвержден! Спасибо за верификацию.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-german-red dark:text-pink-400" />
                        <p className="text-sm text-german-red dark:text-pink-400">
                          Для продолжения, пожалуйста, подтвердите ваш email.
                        </p>
                      </div>
                      <p className="text-xs text-german-red/80 dark:text-pink-400/80">
                        Мы отправили письмо на {formData.email}. Пожалуйста,
                        проверьте папку "Входящие" или "Спам".
                      </p>
                      <div className="pt-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleResendVerification}
                          disabled={verificationStatus.verificationEmailSending}
                          className="text-sm glass text-german-red hover:text-german-dark-red dark:text-pink-300 dark:hover:text-pink-400"
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
                    </div>
                  )}
                </motion.div>
              )}
              {/* Reset Password Success */}
              {resetEmailSent && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 glass rounded-lg border border-green-500/20 bg-green-500/10"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <p className="text-sm text-green-400">
                      Письмо для сброса пароля отправлено на {formData.email}
                    </p>
                  </div>
                </motion.div>
              )}
              {/* Success Message */}
              {successMessage && !resetEmailSent && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 glass rounded-lg border border-green-500/20 bg-green-500/10"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <p className="text-sm text-green-400">{successMessage}</p>
                  </div>
                </motion.div>
              )}
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 glass rounded-lg border border-red-500/20 bg-red-500/10"
                >
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                </motion.div>
              )}
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name field for registration */}
                {activeTab === "register" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Имя
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Ваше имя"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="pl-10 glass bg-white/5 border-white/20 focus:border-german-red/50 dark:focus:border-dark-theme-pink/50"
                        ref={nameInputRef}
                        required
                      />
                    </div>
                  </div>
                )}
                {/* Email field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="pl-10 glass bg-white/5 border-white/20 focus:border-german-red/50 dark:focus:border-dark-theme-pink/50"
                      ref={emailInputRef}
                      required
                    />
                  </div>
                </div>
                {/* Password field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Пароль
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="pl-10 pr-10 glass bg-white/5 border-white/20 focus:border-german-red/50 dark:focus:border-dark-theme-pink/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {/* Confirm Password field for registration */}
                {activeTab === "register" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Подтвердите пароль
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                        className="pl-10 pr-10 glass bg-white/5 border-white/20 focus:border-german-red/50 dark:focus:border-dark-theme-pink/50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
                {/* Forgot Password link for login */}
                {activeTab === "login" && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      className="text-sm text-german-red dark:text-dark-theme-pink hover:text-german-dark-red dark:hover:text-dark-theme-purple transition-colors"
                      disabled={isLoading}
                    >
                      Забыли пароль?
                    </button>
                  </div>
                )}
                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full glass bg-gradient-to-r from-german-red/20 to-german-gold/20 hover:bg-white/80 dark:hover:bg-black/30 text-german-red dark:text-dark-theme-pink border border-german-red/30 dark:border-dark-theme-pink/30"
                  disabled={isLoading || verificationStatus.needsVerification}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {activeTab === "login" ? "Вход..." : "Регистрация..."}
                    </>
                  ) : activeTab === "login" ? (
                    "Войти"
                  ) : (
                    "Создать аккаунт"
                  )}
                </Button>
              </form>
              {/* Additional Info */}
              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  {activeTab === "login"
                    ? "Нет аккаунта? "
                    : "Уже есть аккаунт? "}
                  <button
                    onClick={() =>
                      handleTabChange(
                        activeTab === "login" ? "register" : "login",
                      )
                    }
                    className="text-german-red dark:text-dark-theme-pink hover:text-german-dark-red dark:hover:text-dark-theme-purple transition-colors font-medium"
                  >
                    {activeTab === "login" ? "Зарегистрируйтесь" : "Войдите"}
                  </button>
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
