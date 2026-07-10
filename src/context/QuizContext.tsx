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
  moveFolderToFolder: (childFolderId: string, parentFolderId: string | undefined) => void;
  addFolder: (name: string, tab: 'general' | 'ai', parentId?: string) => string;
  removeFolder: (folderId: string) => void;
  renameFolder: (folderId: string, newName: string) => void;
}

const QuizContext = createContext<QuizContextData | undefined>(undefined);

const MOCK_AI_CATEGORY: QuizCategory = {
  id: 'c_listening_ai',
  title: 'Active Listening',
  description: 'Practice being a good listener!',
  icon: 'ear-outline',
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
    explanation: 'A good listener looks at the speaker and makes comments like "Cool!" to show they are interested.',
    whyOptions: [
      'It helps them feel heard and shows we care',
      'Because they will stop talking sooner',
      'Because it is a strict rule'
    ],
    correctWhyIndex: 0,
    whyConfirmation: 'Showing your friend that you are listening helps build a strong and happy friendship.'
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
    explanation: 'As a listener, it\'s great to ask for clarification if you don\'t understand something!',
    whyOptions: [
      'To be polite and understand their story better',
      'Because we want to copy them',
      'To show we are not interested'
    ],
    correctWhyIndex: 0,
    whyConfirmation: 'Asking for repetition is a polite way to show you care about what they are saying.'
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
    explanation: 'Nodding your head shows the speaker that you are listening and understand what is being said.',
    whyOptions: [
      'Because nodding is the rule',
      'It signals to the speaker that we are paying attention',
      'So we look like we are awake'
    ],
    correctWhyIndex: 1,
    whyConfirmation: 'Nodding is a simple body language cue that helps others feel supported.'
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
    explanation: 'We don\'t interrupt! It is the speaker\'s turn. If we say nothing or interrupt, they might think we aren\'t interested.',
    whyOptions: [
      'Because our game is not important',
      'So they will let us talk when they finish',
      'It shows respect for their turn to speak'
    ],
    correctWhyIndex: 2,
    whyConfirmation: 'Waiting for others to finish is a great way to show mutual respect.'
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
    explanation: 'The speaker will usually let you know they are finished, or there will be a stop in the talking (a pause).',
    whyOptions: [
      'So we do not interrupt them',
      'Because we are tired of talking',
      'Because the teacher said so'
    ],
    correctWhyIndex: 0,
    whyConfirmation: 'Waiting for pauses ensures that we do not cut others off in conversation.'
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

  const moveFolderToFolder = (childFolderId: string, parentFolderId: string | undefined) => {
    setFolders(prev => {
      // Prevent circular nesting (e.g. moving a parent into its own child)
      if (parentFolderId) {
        let currentParent = prev.find(f => f.id === parentFolderId);
        while (currentParent) {
          if (currentParent.id === childFolderId) {
            console.warn("Circular folder dependency prevented!");
            return prev; // Do not allow circular nesting
          }
          currentParent = prev.find(f => f.id === currentParent?.parentId);
        }
      }

      const newList = prev.map(f => f.id === childFolderId ? { ...f, parentId: parentFolderId } : f);
      safeStorage.set('@quiz_folders', newList);
      return newList;
    });
  };

  const addFolder = (name: string, tab: 'general' | 'ai', parentId?: string) => {
    const newFolder: QuizFolder = { id: `folder_${Date.now()}`, name, tab, parentId };
    setFolders(prev => {
      const newList = [...prev, newFolder];
      safeStorage.set('@quiz_folders', newList);
      return newList;
    });
    return newFolder.id;
  };

  const renameFolder = (folderId: string, newName: string) => {
    setFolders(prev => {
      const newList = prev.map(f => f.id === folderId ? { ...f, name: newName } : f);
      safeStorage.set('@quiz_folders', newList);
      return newList;
    });
  };

  const removeFolder = (folderId: string) => {
    const categoriesToDelete = customCategories.filter(c => c.folderId === folderId).map(c => c.id);

    setFolders(prev => {
      // Remove the folder, and for any children, reset their parentId so they move to root
      const newList = prev
        .filter(f => f.id !== folderId)
        .map(f => f.parentId === folderId ? { ...f, parentId: undefined } : f);
      safeStorage.set('@quiz_folders', newList);
      return newList;
    });
    
    if (categoriesToDelete.length > 0) {
      setCustomCategories(prev => {
        const newList = prev.filter(c => c.folderId !== folderId);
        safeStorage.set('@custom_quiz_categories', newList.filter(c => c.id !== 'c_listening_ai'));
        return newList;
      });
      setCustomQuestions(prev => {
        const newList = prev.filter(q => !categoriesToDelete.includes(q.category));
        safeStorage.set('@custom_quiz_questions', newList.filter(q => q.category !== 'c_listening_ai'));
        return newList;
      });
    }
  };

  if (!isLoaded) return null;

  return (
    <QuizContext.Provider value={{ customCategories, customQuestions, folders, addCustomQuiz, removeCustomQuiz, renameCustomQuiz, moveQuizToFolder, moveFolderToFolder, addFolder, removeFolder, renameFolder }}>
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
