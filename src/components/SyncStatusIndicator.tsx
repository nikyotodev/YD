"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wifi,
  WifiOff,
  Cloud,
  CloudOff,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
interface SyncStatusIndicatorProps {
  className?: string;
  compact?: boolean;
}
type SyncStatus =
  | "online"
  | "offline"
  | "syncing"
  | "synced"
  | "error"
  | "checking";
export function SyncStatusIndicator({
  className = "",
  compact = false
}: SyncStatusIndicatorProps) {
  const { isSyncing, isAuthenticated } = useUser();
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("checking");
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  // Отслеживание состояния сети
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus("online");
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus("offline");
    };
    // Проверяем начальное состояние
    setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  // Обновление статуса синхронизации
  useEffect(() => {
    if (!isAuthenticated) {
      setSyncStatus("offline");
      return;
    }
    if (!isOnline) {
      setSyncStatus("offline");
      return;
    }
    if (isSyncing) {
      setSyncStatus("syncing");
    } else {
      setSyncStatus("synced");
      setLastSyncTime(new Date());
    }
  }, [isSyncing, isOnline, isAuthenticated]);
  const getStatusConfig = (status: SyncStatus) => {
    switch (status) {
      case "online":
        return {
          icon: Wifi,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          label: "Онлайн",
          description: "Подключение активно"
        };
      case "offline":
        return {
          icon: WifiOff,
          color: "text-red-500",
          bgColor: "bg-red-500/10",
          label: "Оффлайн",
          description: "Нет подключения к интернету"
        };
      case "syncing":
        return {
          icon: RefreshCw,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
          label: "Синхронизация",
          description: "Синхронизация данных с сервером",
          animate: "spin"
        };
      case "synced":
        return {
          icon: CheckCircle2,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          label: "Синхронизировано",
          description: lastSyncTime
            ? `Последняя синхронизация: ${lastSyncTime.toLocaleTimeString("ru-RU")}`
            : "Данные актуальны"
        };
      case "error":
        return {
          icon: AlertCircle,
          color: "text-red-500",
          bgColor: "bg-red-500/10",
          label: "Ошибка",
          description: "Ошибка синхронизации"
        };
      default:
        return {
          icon: Loader2,
          color: "text-gray-500",
          bgColor: "bg-gray-500/10",
          label: "Проверка",
          description: "Проверка состояния",
          animate: "spin"
        };
    }
  };
  const config = getStatusConfig(syncStatus);
  const Icon = config.icon;
  if (compact) {
    return (
      <motion.div
        className={`flex items-center space-x-2 ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`p-1.5 rounded-full ${config.bgColor}`}>
          <Icon
            className={`w-3 h-3 ${config.color} ${config.animate === "spin" ? "animate-spin" : ""}`}
          />
        </div>
        <span className={`text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
      </motion.div>
    );
  }
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={syncStatus}
        className={`glass-card bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-lg p-3 ${className}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${config.bgColor}`}>
            <Icon
              className={`w-4 h-4 ${config.color} ${config.animate === "spin" ? "animate-spin" : ""}`}
            />
          </div>
          <div className="flex-1">
            <div className={`text-sm font-medium ${config.color}`}>
              {config.label}
            </div>
            <div className="text-xs text-muted-foreground">
              {config.description}
            </div>
          </div>
          {/* Индикатор состояния подключения */}
          <div className="flex items-center space-x-1">
            {isAuthenticated ? (
              <Cloud className="w-3 h-3 text-blue-500" />
            ) : (
              <CloudOff className="w-3 h-3 text-gray-400" />
            )}
          </div>
        </div>
        {/* Индикатор прогресса для синхронизации */}
        {syncStatus === "syncing" && (
          <motion.div
            className="mt-2 h-1 bg-blue-500/20 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear"
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
