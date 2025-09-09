"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ACHIEVEMENT_DEFINITIONS, type AchievementType } from "@/types/user";
interface AchievementNotificationProps {
  achievements: AchievementType[];
  onClose: () => void;
}
export function AchievementNotification({
  achievements,
  onClose,
}: AchievementNotificationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (achievements.length > 0) {
      setIsVisible(true);
      setCurrentIndex(0);
    }
  }, [achievements]);
  useEffect(() => {
    if (!isVisible || achievements.length === 0) return;
    const timer = setTimeout(() => {
      if (currentIndex < achievements.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        handleClose();
      }
    }, 4000); // Показываем каждое достижение 4 секунды
    return () => clearTimeout(timer);
  }, [currentIndex, achievements.length, isVisible]);
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Ждём завершения анимации
  };
  if (achievements.length === 0 || !isVisible) return null;
  const currentAchievement = achievements[currentIndex];
  const definition = ACHIEVEMENT_DEFINITIONS[currentAchievement];
  return (
    <AnimatePresence>
      <div className="fixed top-20 right-4 z-50 max-w-sm">
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.6,
          }}
        >
          <Card className="glass-card bg-gradient-to-br from-german-gold/20 to-german-red/20 dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20 border-2 border-german-gold/30 dark:border-dark-theme-pink/30 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Header with sparkles effect */}
            <div className="relative p-4 bg-gradient-to-r from-german-gold/10 to-german-red/10 dark:from-dark-theme-purple/10 dark:to-dark-theme-pink/10">
              <div className="absolute inset-0 bg-gradient-to-r from-german-gold/5 to-german-red/5 dark:from-dark-theme-purple/5 dark:to-dark-theme-pink/5 animate-pulse" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-german-gold to-german-red dark:from-dark-theme-purple dark:to-dark-theme-pink flex items-center justify-center animate-bounce">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    {/* Sparkle effects */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-german-gold dark:bg-dark-theme-pink rounded-full animate-ping" />
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-german-red dark:bg-dark-theme-purple rounded-full animate-ping animation-delay-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold gradient-text">
                      Достижение!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentIndex + 1} из {achievements.length}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="glass text-muted-foreground hover:text-foreground hover:bg-white/80 dark:hover:bg-black/30"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {/* Achievement Content */}
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl animate-bounce">{definition.icon}</div>
                <div>
                  <h4 className="text-xl font-bold gradient-text mb-1">
                    {definition.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {definition.description}
                  </p>
                </div>
              </div>
              {/* XP Reward */}
              <div className="flex items-center justify-between glass rounded-lg p-3 bg-gradient-to-r from-german-gold/5 to-german-red/5 dark:from-dark-theme-purple/5 dark:to-dark-theme-pink/5">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-german-gold dark:text-dark-theme-pink" />
                  <span className="text-sm font-medium text-foreground">
                    Награда за достижение
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-lg font-bold text-german-gold dark:text-dark-theme-pink">
                    +{definition.xpReward}
                  </span>
                  <span className="text-sm text-muted-foreground">XP</span>
                </div>
              </div>
              {/* Progress indicator for multiple achievements */}
              {achievements.length > 1 && (
                <div className="mt-4">
                  <div className="flex space-x-1">
                    {achievements.map((achievement, index) => (
                      <div
                        key={`progress-${achievement}`}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          index <= currentIndex
                            ? "bg-german-gold dark:bg-dark-theme-pink"
                            : "bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Animated background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-4 right-4 w-2 h-2 bg-german-gold dark:bg-dark-theme-pink rounded-full animate-ping" />
              <div className="absolute bottom-8 left-6 w-1 h-1 bg-german-red dark:bg-dark-theme-purple rounded-full animate-ping animation-delay-1000" />
              <div className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-german-gold dark:bg-dark-theme-pink rounded-full animate-ping animation-delay-2000" />
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
// Hook для управления уведомлениями о достижениях
export function useAchievementNotifications() {
  const [queuedAchievements, setQueuedAchievements] = useState<
    AchievementType[]
  >([]);
  const showAchievements = (achievements: AchievementType[]) => {
    if (achievements.length > 0) {
      setQueuedAchievements((prev) => [...prev, ...achievements]);
    }
  };
  const clearAchievements = () => {
    setQueuedAchievements([]);
  };
  return {
    queuedAchievements,
    showAchievements,
    clearAchievements,
  };
}
