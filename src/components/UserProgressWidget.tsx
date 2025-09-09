"use client";
import { motion } from "framer-motion";
import { Trophy, Flame, Target, TrendingUp, Star, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useUser, useGamification, useGoals } from "@/contexts/UserContext";
import { ACHIEVEMENT_DEFINITIONS } from "@/types/user";
interface UserProgressWidgetProps {
  className?: string;
  compact?: boolean;
}
export function UserProgressWidget({
  className = "",
  compact = false,
}: UserProgressWidgetProps) {
  const { user, isAuthenticated } = useUser();
  const gamification = useGamification();
  const goals = useGoals();
  if (!isAuthenticated || !user || !gamification || !goals) {
    return null;
  }
  const xpPercentage =
    gamification.xpToNextLevel > 0
      ? (gamification.currentLevelXP /
          (gamification.currentLevelXP + gamification.xpToNextLevel)) *
        100
      : 100;
  const dailyProgress = Math.min(
    (goals.daily.progress.words / goals.daily.targetWords) * 100,
    100,
  );
  const recentAchievements = user.achievements
    .sort(
      (a, b) =>
        new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime(),
    )
    .slice(0, 3);
  if (compact) {
    return (
      <Card
        className={`glass-card bg-gradient-to-br from-white/5 to-white/10 border-2 border-white/20 p-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-german-red/20 to-german-gold/20 dark:from-dark-theme-purple/30 dark:to-dark-theme-pink/30 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-german-red dark:text-dark-theme-pink" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-foreground">
                  Ур. {gamification.level}
                </span>
                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-german-red to-german-gold dark:from-dark-theme-purple dark:to-dark-theme-pink rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {gamification.currentLevelXP} /{" "}
                {gamification.currentLevelXP + gamification.xpToNextLevel} XP
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Flame className="w-4 h-4 text-purple-500 dark:text-pink-500" />
              <span className="text-sm font-medium text-foreground">
                {gamification.streak.current}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-foreground">
                {Math.round(dailyProgress)}%
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }
  return (
    <Card
      className={`glass-card bg-gradient-to-br from-white/5 to-white/10 border-2 border-white/20 ${className}`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Trophy className="w-5 h-5 text-german-red dark:text-dark-theme-pink" />
            Ваш прогресс
          </h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Award className="w-4 h-4" />
            <span>{gamification.rank}</span>
          </div>
        </div>
        {/* Level Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Уровень {gamification.level}
            </span>
            <span className="text-sm text-muted-foreground">
              {gamification.currentLevelXP} /{" "}
              {gamification.currentLevelXP + gamification.xpToNextLevel} XP
            </span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-german-red to-german-gold dark:from-dark-theme-purple dark:to-dark-theme-pink rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpPercentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            До следующего уровня: {gamification.xpToNextLevel} XP
          </div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Streak */}
          <div className="glass rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Flame className="w-4 h-4 text-purple-500 dark:text-pink-500" />
              <span className="text-sm font-medium text-foreground">Стрик</span>
            </div>
            <div className="text-xl font-bold text-foreground">
              {gamification.streak.current}
            </div>
            <div className="text-xs text-muted-foreground">
              Лучший: {gamification.streak.longest}
            </div>
          </div>
          {/* Daily Goal */}
          <div className="glass rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-foreground">
                Цель дня
              </span>
            </div>
            <div className="text-xl font-bold text-foreground">
              {Math.round(dailyProgress)}%
            </div>
            <div className="text-xs text-muted-foreground">
              {goals.daily.progress.words} / {goals.daily.targetWords} слов
            </div>
          </div>
          {/* Total Words */}
          <div className="glass rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-foreground">
                Изучено
              </span>
            </div>
            <div className="text-xl font-bold text-foreground">
              {gamification.totalWordsLearned}
            </div>
            <div className="text-xs text-muted-foreground">всего слов</div>
          </div>
          {/* Total XP */}
          <div className="glass rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Star className="w-4 h-4 text-purple-500 dark:text-pink-500" />
              <span className="text-sm font-medium text-foreground">Опыт</span>
            </div>
            <div className="text-xl font-bold text-foreground">
              {gamification.totalXP.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">XP</div>
          </div>
        </div>
        {/* Recent Achievements */}
        {recentAchievements.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Последние достижения
            </h4>
            <div className="space-y-2">
              {recentAchievements.map((achievement) => {
                const definition = ACHIEVEMENT_DEFINITIONS[achievement.type];
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-3 glass rounded-lg p-2"
                  >
                    <div className="text-lg">{definition.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">
                        {definition.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(achievement.unlockedAt).toLocaleDateString(
                          "ru-RU",
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-purple-500 dark:text-pink-500 font-medium">
                      +{definition.xpReward} XP
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
