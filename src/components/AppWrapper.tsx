"use client";
import {
  AchievementNotification,
  useAchievementNotifications,
} from "@/components/AchievementNotification";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { SafeSuspense } from "@/components/SafeSuspense";
interface AppWrapperProps {
  children: React.ReactNode;
}
export function AppWrapper({ children }: AppWrapperProps) {
  const { queuedAchievements, clearAchievements } =
    useAchievementNotifications();
  return (
    <ErrorBoundary level="critical">
      <AuthModalProvider>
        <SafeSuspense level="page">
          {children}
        </SafeSuspense>
        {/* Global Achievement Notifications */}
        <AchievementNotification
          achievements={queuedAchievements}
          onClose={clearAchievements}
        />
      </AuthModalProvider>
    </ErrorBoundary>
  );
}
