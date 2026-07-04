import React, { createContext, useState, useContext, useEffect } from 'react';
import { safeStorage } from '../utils/storage';

export type MoodType = 'default' | 'space' | 'nature' | 'feminine';

interface MoodContextData {
  mood: MoodType;
  setMood: (mood: MoodType) => void;
}

const MoodContext = createContext<MoodContextData>({
  mood: 'default',
  setMood: () => {},
});

export const useMood = () => useContext(MoodContext);

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mood, setMoodState] = useState<MoodType>('default');

  useEffect(() => {
    const loadMood = async () => {
      const stored = await safeStorage.get<MoodType>('@app_mood', 'default');
      if (stored) {
        setMoodState(stored);
      }
    };
    loadMood();
  }, []);

  const setMood = async (newMood: MoodType) => {
    setMoodState(newMood);
    await safeStorage.set('@app_mood', newMood);
  };

  return (
    <MoodContext.Provider value={{ mood, setMood }}>
      {children}
    </MoodContext.Provider>
  );
};
