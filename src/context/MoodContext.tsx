import React, { createContext, useState, useContext, useEffect } from 'react';
import { safeStorage } from '../utils/storage';

export type MoodType = 'botanical' | 'celestial' | 'astronaut' | 'rocket';

interface MoodContextData {
  mood: MoodType;
  setMood: (mood: MoodType) => void;
}

const MoodContext = createContext<MoodContextData>({
  mood: 'botanical',
  setMood: () => {},
});

export const getMoodColors = (mood: MoodType) => {
  switch (mood) {
    case 'celestial': return { primary: '#B19CD9', bg: '#F3E8FF' }; // Muted purple, soft purple bg
    case 'astronaut': return { primary: '#775B7B', bg: '#FDF4FF' }; // Deep violet, soft pinkish bg
    case 'rocket': return { primary: '#708090', bg: '#F1F5F9' }; // Slate, soft slate bg
    case 'botanical':
    default:
      return { primary: '#8FBC8F', bg: '#F7FEE7' }; // Muted green, soft green bg
  }
};

export const useMood = () => useContext(MoodContext);

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mood, setMoodState] = useState<MoodType>('botanical');

  useEffect(() => {
    const loadMood = async () => {
      const stored = await safeStorage.get<MoodType>('@app_mood', 'botanical');
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
