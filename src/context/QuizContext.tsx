import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Question, QuizCategory, QuizFolder } from '../data/types';
import { safeStorage } from '../utils/storage';

interface QuizContextData {
  customCategories: QuizCategory[];
  customQuestions: Question[];
  folders: QuizFolder[];
  addCustomQuiz: (category: QuizCategory, questions: Question[]) => void;
  removeCustomQuiz: (categoryId: string) => void;
  renameCustomQuiz: (categoryId: string, newTitle: string) => void;
  moveQuizToFolder: (categoryId: string, folderId: string | undefined) => void;
  addFolder: (name: string, tab: 'general' | 'ai') => string;
  removeFolder: (folderId: string) => void;
}

const QuizContext = createContext<QuizContextData | undefined>(undefined);

const MOCK_AI_CATEGORY: QuizCategory = {
  id: 'c_listening_ai',
  title: 'Active Listening',
  description: 'Practice being a good listener!',
  icon: 'ear-outline',
  color: '#A78BFA',
  isCustom: true
};

const MOCK_AI_QUESTIONS: Question[] = [
  {
    id: 'q_ai_1',
    category: 'c_listening_ai',
    difficulty: 'Medium',
    scenario: 'Your friend is talking about their favorite movie. To show you are listening, you should...',
    options: [
      'Look away and think about your toys',
      'Look at them and say "Cool!" or "Wow!"',
      'Interrupt and talk about your favorite movie'
    ],
    correctAnswerIndex: 1,
    explanation: 'A good listener looks at the speaker and makes comments like "Cool!" to show they are interested.'
  },
  {
    id: 'q_ai_2',
    category: 'c_listening_ai',
    difficulty: 'Medium',
    scenario: 'Your friend is telling a story, but you are confused about what happened. What can you say?',
    options: [
      '"Can you repeat that?"',
      '"I don\'t care."',
      '"Stop talking."'
    ],
    correctAnswerIndex: 0,
    explanation: 'As a listener, it\'s great to ask for clarification if you don\'t understand something!'
  },
  {
    id: 'q_ai_3',
    category: 'c_listening_ai',
    difficulty: 'Medium',
    scenario: 'While someone is speaking, how can you use your body to show you are listening?',
    options: [
      'Cross your arms and sigh',
      'Turn your back to them',
      'Nod your head'
    ],
    correctAnswerIndex: 2,
    explanation: 'Nodding your head shows the speaker that you are listening and understand what is being said.'
  },
  {
    id: 'q_ai_4',
    category: 'c_listening_ai',
    difficulty: 'Medium',
    scenario: 'Your friend is telling you about their weekend, but you really want to talk about your new game. What should you do?',
    options: [
      'Wait for them to finish, because it is their turn to speak',
      'Just start talking about your game loudly',
      'Ask them questions about your game instead'
    ],
    correctAnswerIndex: 0,
    explanation: 'We don\'t interrupt! It is the speaker\'s turn. If we say nothing or interrupt, they might think we aren\'t interested.'
  },
  {
    id: 'q_ai_5',
    category: 'c_listening_ai',
    difficulty: 'Medium',
    scenario: 'How do you know when it is your turn to talk?',
    options: [
      'Whenever you feel like it',
      'When the speaker says "And that\'s all" or there is a pause',
      'You just guess'
    ],
    correctAnswerIndex: 1,
    explanation: 'The speaker will usually let you know they are finished, or there will be a stop in the talking (a pause).'
  }
];

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [customCategories, setCustomCategories] = useState<QuizCategory[]>([]);
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [folders, setFolders] = useState<QuizFolder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadCustomQuizzes = async () => {
      try {
        const storedCategories = await safeStorage.get<QuizCategory[]>('@custom_quiz_categories', []);
        const storedQuestions = await safeStorage.get<Question[]>('@custom_quiz_questions', []);
        const storedFolders = await safeStorage.get<QuizFolder[]>('@quiz_folders', []);
        
        // Merge with our hardcoded AI mock so it's always there for testing if needed
        // but normally it would just load stored
        setCustomCategories([...MOCK_AI_CATEGORY ? [MOCK_AI_CATEGORY] : [], ...storedCategories.filter(c => c.id !== 'c_listening_ai')]);
        setCustomQuestions([...MOCK_AI_QUESTIONS ? MOCK_AI_QUESTIONS : [], ...storedQuestions.filter(q => q.category !== 'c_listening_ai')]);
        setFolders(storedFolders);
      } catch (e) {
        console.error('Failed to load custom quizzes', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadCustomQuizzes();
  }, []);

  const addCustomQuiz = (category: QuizCategory, questions: Question[]) => {
    setCustomCategories(prev => {
      const newList = [...prev.filter(c => c.id !== category.id), category];
      safeStorage.set('@custom_quiz_categories', newList.filter(c => c.id !== 'c_listening_ai'));
      return newList;
    });
    setCustomQuestions(prev => {
      const newList = [...prev.filter(q => q.category !== category.id), ...questions];
      safeStorage.set('@custom_quiz_questions', newList.filter(q => q.category !== 'c_listening_ai'));
      return newList;
    });
  };

  const removeCustomQuiz = (categoryId: string) => {
    setCustomCategories(prev => {
      const newList = prev.filter(c => c.id !== categoryId);
      safeStorage.set('@custom_quiz_categories', newList.filter(c => c.id !== 'c_listening_ai'));
      return newList;
    });
    setCustomQuestions(prev => {
      const newList = prev.filter(q => q.category !== categoryId);
      safeStorage.set('@custom_quiz_questions', newList.filter(q => q.category !== 'c_listening_ai'));
      return newList;
    });
  };

  const renameCustomQuiz = (categoryId: string, newTitle: string) => {
    setCustomCategories(prev => {
      const newList = prev.map(c => c.id === categoryId ? { ...c, title: newTitle } : c);
      safeStorage.set('@custom_quiz_categories', newList.filter(c => c.id !== 'c_listening_ai'));
      return newList;
    });
  };

  const moveQuizToFolder = (categoryId: string, folderId: string | undefined) => {
    setCustomCategories(prev => {
      const newList = prev.map(c => c.id === categoryId ? { ...c, folderId } : c);
      safeStorage.set('@custom_quiz_categories', newList.filter(c => c.id !== 'c_listening_ai'));
      return newList;
    });
  };

  const addFolder = (name: string, tab: 'general' | 'ai') => {
    const newFolder: QuizFolder = { id: `folder_${Date.now()}`, name, tab };
    setFolders(prev => {
      const newList = [...prev, newFolder];
      safeStorage.set('@quiz_folders', newList);
      return newList;
    });
    return newFolder.id;
  };

  const removeFolder = (folderId: string) => {
    setFolders(prev => {
      const newList = prev.filter(f => f.id !== folderId);
      safeStorage.set('@quiz_folders', newList);
      return newList;
    });
    // Remove folderId from quizzes that were in this folder
    setCustomCategories(prev => {
      let changed = false;
      const newList = prev.map(c => {
        if (c.folderId === folderId) {
          changed = true;
          return { ...c, folderId: undefined };
        }
        return c;
      });
      if (changed) safeStorage.set('@custom_quiz_categories', newList.filter(c => c.id !== 'c_listening_ai'));
      return newList;
    });
  };

  if (!isLoaded) return null;

  return (
    <QuizContext.Provider value={{ customCategories, customQuestions, folders, addCustomQuiz, removeCustomQuiz, renameCustomQuiz, moveQuizToFolder, addFolder, removeFolder }}>
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
