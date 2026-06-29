import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Question, QuizCategory } from '../data/types';

interface QuizContextData {
  customCategories: QuizCategory[];
  customQuestions: Question[];
  addCustomQuiz: (category: QuizCategory, questions: Question[]) => void;
  removeCustomQuiz: (categoryId: string) => void;
}

const QuizContext = createContext<QuizContextData | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [customCategories, setCustomCategories] = useState<QuizCategory[]>([]);
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);

  const addCustomQuiz = (category: QuizCategory, questions: Question[]) => {
    // Remove if it already exists with same ID to overwrite
    setCustomCategories(prev => [...prev.filter(c => c.id !== category.id), category]);
    setCustomQuestions(prev => [...prev.filter(q => q.category !== category.id), ...questions]);
  };

  const removeCustomQuiz = (categoryId: string) => {
    setCustomCategories(prev => prev.filter(c => c.id !== categoryId));
    setCustomQuestions(prev => prev.filter(q => q.category !== categoryId));
  };

  return (
    <QuizContext.Provider value={{ customCategories, customQuestions, addCustomQuiz, removeCustomQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
};
