import React, { createContext, useState, useContext, useEffect } from 'react';
import { safeStorage } from '../utils/storage';

export type MoodType = 'botanical' | 'celestial' | 'astronaut' | 'rocket' | 'none';

interface MoodContextData {
  mood: MoodType;
  setMood: (mood: MoodType) => void;
}

const MoodContext = createContext<MoodContextData>({
  mood: 'none',
  setMood: () => {},
});

export const getMoodColors = (mood: MoodType) => {
  switch (mood) {
    case 'celestial': return { primary: '#B19CD9', bg: '#F3E8FF', isDark: false }; // Muted purple, soft purple bg
    case 'astronaut': return { primary: '#775B7B', bg: '#0B0F19', isDark: true }; // Deep violet, navy dark bg
    case 'rocket': return { primary: '#708090', bg: '#061224', isDark: true }; // Slate, indigo dark bg
    case 'none': return { primary: '#9CA3AF', bg: '#F9FAFB', isDark: false }; // Neutral gray, light gray bg
    case 'botanical':
    default:
      return { primary: '#8FBC8F', bg: '#F7FEE7', isDark: false }; // Muted green, soft green bg
  }
};

export const useMood = () => useContext(MoodContext);

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mood, setMoodState] = useState<MoodType>('none');

  useEffect(() => {
    const loadMood = async () => {
      const stored = await safeStorage.get<MoodType>('@app_mood', 'none');
      if (stored && stored !== 'botanical') {
        setMoodState(stored);
      } else {
        setMoodState('none');
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
