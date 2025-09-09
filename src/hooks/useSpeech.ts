/**
 * Хук для работы с речевым синтезом
 */
import { useCallback, useState, useEffect } from "react";
import {
  speak,
  speakGerman,
  speakEnglish,
  speakRussian,
  speakByLanguageDirection,
  stopSpeaking,
  isSpeechSynthesisSupported,
  getAvailableVoices,
  type SpeechConfig,
} from "@/lib/speech-utils";
export interface UseSpeechReturn {
  speak: (text: string, lang?: string, config?: SpeechConfig) => Promise<void>;
  speakGerman: (text: string, config?: SpeechConfig) => Promise<void>;
  speakEnglish: (text: string, config?: SpeechConfig) => Promise<void>;
  speakRussian: (text: string, config?: SpeechConfig) => Promise<void>;
  speakByLanguageDirection: (
    originalWord: string,
    translatedWord: string,
    languageDirection: string,
    config?: SpeechConfig,
  ) => Promise<void>;
  stopSpeaking: () => void;
  isSupported: boolean;
  availableVoices: { name: string; lang: string }[];
  isLoadingVoices: boolean;
}
/**
 * Хук для речевого синтеза с мемоизированными функциями
 */
export function useSpeech(): UseSpeechReturn {
  const [availableVoices, setAvailableVoices] = useState<
    { name: string; lang: string }[]
  >([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(false);
  // Загрузка доступных голосов при инициализации
  useEffect(() => {
    const loadVoices = async () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        setIsLoadingVoices(true);
        try {
          const voices = await getAvailableVoices();
          setAvailableVoices(voices);
        } catch (error) {
          console.error("Ошибка при загрузке голосов:", error);
        } finally {
          setIsLoadingVoices(false);
        }
      }
    };
    loadVoices();
  }, []);
  const handleSpeak = useCallback(
    async (text: string, lang?: string, config?: SpeechConfig) => {
      await speak(text, lang, config);
    },
    [],
  );
  const handleSpeakGerman = useCallback(
    async (text: string, config?: SpeechConfig) => {
      await speakGerman(text, config);
    },
    [],
  );
  const handleSpeakEnglish = useCallback(
    async (text: string, config?: SpeechConfig) => {
      await speakEnglish(text, config);
    },
    [],
  );
  const handleSpeakRussian = useCallback(
    async (text: string, config?: SpeechConfig) => {
      await speakRussian(text, config);
    },
    [],
  );
  const handleSpeakByLanguageDirection = useCallback(
    async (
      originalWord: string,
      translatedWord: string,
      languageDirection: string,
      config?: SpeechConfig,
    ) => {
      await speakByLanguageDirection(
        originalWord,
        translatedWord,
        languageDirection,
        config,
      );
    },
    [],
  );
  const handleStopSpeaking = useCallback(() => {
    stopSpeaking();
  }, []);
  return {
    speak: handleSpeak,
    speakGerman: handleSpeakGerman,
    speakEnglish: handleSpeakEnglish,
    speakRussian: handleSpeakRussian,
    speakByLanguageDirection: handleSpeakByLanguageDirection,
    stopSpeaking: handleStopSpeaking,
    isSupported: isSpeechSynthesisSupported(),
    availableVoices,
    isLoadingVoices,
  };
}
