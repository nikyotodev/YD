"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { AuthModal } from "@/components/AuthModal";
interface AuthModalContextType {
  isAuthModalOpen: boolean;
  openAuthModal: (initialTab?: "login" | "register") => void;
  openModal: (initialTab?: "login" | "register") => void; // Alias для совместимости
  closeAuthModal: () => void;
}
const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined,
);
interface AuthModalProviderProps {
  children: ReactNode;
}
export function AuthModalProvider({ children }: AuthModalProviderProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const openAuthModal = useCallback(
    (initialTab: "login" | "register" = "login") => {
      setActiveTab(initialTab);
      setIsAuthModalOpen(true);
    },
    [],
  );
  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);
  const value: AuthModalContextType = {
    isAuthModalOpen,
    openAuthModal,
    openModal: openAuthModal, // Alias для совместимости
    closeAuthModal,
  };
  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialTab={activeTab}
      />
    </AuthModalContext.Provider>
  );
}
export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
