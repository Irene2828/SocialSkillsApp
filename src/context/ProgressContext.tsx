import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  recordQuizCompletion: (correctAnswersCount: number, earnedCoins: number) => void;
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
        const storedStreak = await AsyncStorage.getItem('@streak');
        if (storedStreak !== null) setStreak(parseInt(storedStreak, 10));

        const storedDate = await AsyncStorage.getItem('@lastQuizDate');
        if (storedDate !== null) setLastQuizDate(storedDate);

        const storedQuizzes = await AsyncStorage.getItem('@totalQuizzesCompleted');
        if (storedQuizzes !== null) setTotalQuizzesCompleted(parseInt(storedQuizzes, 10));

        const storedCorrect = await AsyncStorage.getItem('@totalCorrectAnswers');
        if (storedCorrect !== null) setTotalCorrectAnswers(parseInt(storedCorrect, 10));

        const storedAchievements = await AsyncStorage.getItem('@achievements');
        if (storedAchievements !== null) setAchievements(JSON.parse(storedAchievements));

        const storedLimit = await AsyncStorage.getItem('@dailyLimit');
        if (storedLimit !== null) setDailyLimitState(parseInt(storedLimit, 10));

        const storedPin = await AsyncStorage.getItem('@parentPin');
        if (storedPin !== null) setParentPinState(storedPin);

        const storedQuizzesToday = await AsyncStorage.getItem('@quizzesTakenToday');
        if (storedDate === getTodayString() && storedQuizzesToday !== null) {
          setQuizzesTakenToday(parseInt(storedQuizzesToday, 10));
        } else {
          setQuizzesTakenToday(0);
        }

      } catch (e) {
        console.error('Failed to load progress data', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  const saveData = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error(`Failed to save ${key}`, e);
    }
  };

  const getYesterdayString = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  };

  const recordQuizCompletion = (correctAnswersCount: number, earnedCoins: number) => {
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

    const newQuizzes = totalQuizzesCompleted + 1;
    const newCorrect = totalCorrectAnswers + correctAnswersCount;

    setStreak(newStreak);
    setLastQuizDate(today);
    setQuizzesTakenToday(newQuizzesToday);
    setTotalQuizzesCompleted(newQuizzes);
    setTotalCorrectAnswers(newCorrect);

    saveData('@streak', newStreak.toString());
    saveData('@lastQuizDate', today);
    saveData('@quizzesTakenToday', newQuizzesToday.toString());
    saveData('@totalQuizzesCompleted', newQuizzes.toString());
    saveData('@totalCorrectAnswers', newCorrect.toString());

    // Evaluate Achievements
    const newAchievements = new Set(achievements);
    if (newQuizzes >= 1) newAchievements.add('first_quiz');
    if (newQuizzes >= 5) newAchievements.add('five_quizzes');
    if (newQuizzes >= 10) newAchievements.add('ten_quizzes');
    if (newCorrect >= 25) newAchievements.add('twenty_five_correct');
    if (earnedCoins > 0) newAchievements.add('first_coin');
    if (newStreak >= 3) newAchievements.add('three_day_streak');

    if (newAchievements.size > achievements.length) {
      const achievementArray = Array.from(newAchievements);
      setAchievements(achievementArray);
      saveData('@achievements', JSON.stringify(achievementArray));
    }
  };

  const setDailyLimit = (limit: number) => {
    setDailyLimitState(limit);
    saveData('@dailyLimit', limit.toString());
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
      recordQuizCompletion
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
