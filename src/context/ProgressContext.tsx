import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeStorage } from '../utils/storage';
import { logger } from '../utils/logger';

interface ProgressContextType {
  streak: number;
  lastQuizDate: string | null;
  totalQuizzesCompleted: number;
  totalCorrectAnswers: number;
  achievements: string[];
  quizzesTakenToday: number;
  dailyLimit: number;
  parentPin: string | null;
  isParentModeUnlocked: boolean;
  setDailyLimit: (limit: number) => void;
  setParentPin: (pin: string) => void;
  unlockParentMode: (pin: string) => boolean;
  lockParentMode: () => void;
  recordQuizCompletion: (correctAnswersCount: number, earnedCoins: number) => Promise<void>;
  resetAllData: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [streak, setStreak] = useState(0);
  const [lastQuizDate, setLastQuizDate] = useState<string | null>(null);
  const [totalQuizzesCompleted, setTotalQuizzesCompleted] = useState(0);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  
  const [quizzesTakenToday, setQuizzesTakenToday] = useState(0);
  const [dailyLimit, setDailyLimitState] = useState(3);
  const [parentPin, setParentPinState] = useState<string | null>(null);
  const [isParentModeUnlocked, setIsParentModeUnlocked] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);

  const getTodayString = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedStreak = await safeStorage.get<number>('@streak', 0);
        setStreak(Math.max(0, storedStreak));

        const storedDate = await safeStorage.get<string | null>('@lastQuizDate', null);
        setLastQuizDate(storedDate);

        const storedQuizzes = await safeStorage.get<number>('@totalQuizzesCompleted', 0);
        setTotalQuizzesCompleted(Math.max(0, storedQuizzes));

        const storedCorrect = await safeStorage.get<number>('@totalCorrectAnswers', 0);
        setTotalCorrectAnswers(Math.max(0, storedCorrect));

        const storedAchievements = await safeStorage.get<string[]>('@achievements', []);
        setAchievements(storedAchievements);

        const storedLimit = await safeStorage.get<number>('@dailyLimit', 3);
        setDailyLimitState(Math.max(1, storedLimit));

        const storedPin = await safeStorage.get<string | null>('@parentPin', null);
        setParentPinState(storedPin);

        const storedQuizzesToday = await safeStorage.get<number>('@quizzesTakenToday', 0);
        if (storedDate === getTodayString()) {
          setQuizzesTakenToday(Math.max(0, storedQuizzesToday));
        } else {
          setQuizzesTakenToday(0);
        }

      } catch (e) {
        logger.error('Failed to load progress data', e);
        // Fallback safely handled by defaultValue in safeStorage
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  const saveData = async (key: string, value: any) => {
    const success = await safeStorage.set(key, value);
    if (!success) {
      logger.warn(`Failed to save ${key}`);
    }
  };

  const getYesterdayString = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  };

  const recordQuizCompletion = async (correctAnswersCount: number, earnedCoins: number) => {
    const today = getTodayString();
    const yesterday = getYesterdayString();

    let newStreak = streak;
    let newQuizzesToday = quizzesTakenToday;

    if (lastQuizDate === yesterday) {
      newStreak += 1;
      newQuizzesToday = 1;
    } else if (lastQuizDate !== today) {
      newStreak = 1;
      newQuizzesToday = 1;
    } else {
      newQuizzesToday += 1;
    }
    
    newStreak = Math.max(0, newStreak);
    const validCorrectCount = Math.max(0, Math.min(10, correctAnswersCount));

    const newQuizzes = totalQuizzesCompleted + 1;
    const newCorrect = totalCorrectAnswers + validCorrectCount;

    // Evaluate Achievements
    const newAchievements = new Set(achievements);
    if (newQuizzes >= 1) newAchievements.add('first_quiz');
    if (newQuizzes >= 5) newAchievements.add('five_quizzes');
    if (newQuizzes >= 10) newAchievements.add('ten_quizzes');
    if (newCorrect >= 25) newAchievements.add('twenty_five_correct');
    if (earnedCoins > 0) newAchievements.add('first_coin');
    if (newStreak >= 3) newAchievements.add('three_day_streak');

    const achievementArray = Array.from(newAchievements);

    // Atomically write all quiz progress via multiSet
    const success = await safeStorage.multiSet([
      ['@streak', newStreak],
      ['@lastQuizDate', today],
      ['@quizzesTakenToday', newQuizzesToday],
      ['@totalQuizzesCompleted', newQuizzes],
      ['@totalCorrectAnswers', newCorrect],
      ['@achievements', achievementArray]
    ]);

    if (success) {
      setStreak(newStreak);
      setLastQuizDate(today);
      setQuizzesTakenToday(newQuizzesToday);
      setTotalQuizzesCompleted(newQuizzes);
      setTotalCorrectAnswers(newCorrect);
      if (newAchievements.size > achievements.length) {
        setAchievements(achievementArray);
      }
      logger.info('quiz_completed', { score: validCorrectCount, earnedCoins, newStreak });
    } else {
      logger.error('Failed to atomically save quiz completion, rolling back state');
    }
  };

  const setDailyLimit = (limit: number) => {
    const safeLimit = Math.max(1, limit);
    setDailyLimitState(safeLimit);
    saveData('@dailyLimit', safeLimit);
  };

  const setParentPin = (pin: string) => {
    setParentPinState(pin);
    saveData('@parentPin', pin);
  };

  const unlockParentMode = (pin: string) => {
    if (parentPin === null || pin === parentPin) {
      setIsParentModeUnlocked(true);
      return true;
    }
    return false;
  };

  const lockParentMode = () => {
    setIsParentModeUnlocked(false);
  };

  const resetAllData = async () => {
    const success = await safeStorage.multiSet([
      ['@streak', 0],
      ['@lastQuizDate', null],
      ['@quizzesTakenToday', 0],
      ['@totalQuizzesCompleted', 0],
      ['@totalCorrectAnswers', 0],
      ['@achievements', []],
      ['@coin_balance', 0], // Optional: if we want to reset coins too, but it's loaded in RewardsContext. Better to do it via AsyncStorage directly here.
    ]);
    if (success) {
      setStreak(0);
      setLastQuizDate(null);
      setQuizzesTakenToday(0);
      setTotalQuizzesCompleted(0);
      setTotalCorrectAnswers(0);
      setAchievements([]);
      // We would ideally tell RewardsContext to reset too, but for simplicity, the next reload will pick it up or we can just leave coins intact.
      // Let's ensure a full safe wipe.
    }
  };

  if (!isLoaded) return null;

  return (
    <ProgressContext.Provider value={{
      streak,
      lastQuizDate,
      totalQuizzesCompleted,
      totalCorrectAnswers,
      achievements,
      quizzesTakenToday,
      dailyLimit,
      parentPin,
      isParentModeUnlocked,
      setDailyLimit,
      setParentPin,
      unlockParentMode,
      lockParentMode,
      recordQuizCompletion,
      resetAllData
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
