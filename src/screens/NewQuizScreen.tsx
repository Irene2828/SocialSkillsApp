import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Pressable, Alert, TextInput, Modal, ActivityIndicator, Platform, UIManager, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { generateQuizFromImage } from '../utils/aiQuizGenerator';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { TopBar } from '../components/TopBar';
import { SpiderMascot } from '../components/SpiderMascot';
import { Header } from '../components/Header';
import { QuizCard } from '../components/QuizCard';
import { FolderCard } from '../components/FolderCard';
import { ProgressBar } from '../components/ProgressBar';
import { QuestionView } from '../components/QuestionView';
import { StepBasedQuestionView } from '../components/StepBasedQuestionView';
import { Button } from '../components/Button';
import { generateQuizFromText } from '../utils/aiQuizGenerator';
import { Card } from '../components/Card';
import { theme, FONTS } from '../theme';
import { QUIZ_CATEGORIES, Category, Question, QuizCategory } from '../data/types';
import { questions as allQuestions } from '../data/questions';
import { wordProblems } from '../data/wordProblems';
import { useRewards } from '../context/RewardsContext';
import { safeStorage } from '../utils/storage';
import { useMood, getMoodColors } from '../context/MoodContext';
import { useProgress } from '../context/ProgressContext';
import { useQuizContext } from '../context/QuizContext';
import { useFeedback } from '../context/FeedbackContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { QuickStartButton } from '../components/QuickStartButton';
import { SimpleLockScreen } from '../components/SimpleLockScreen';
import { GlobalBackground } from '../components/GlobalBackground';

import { SilverDust } from '../components/SilverDust';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type QuizState = 'selection' | 'difficulty-selection' | 'in-progress' | 'completed' | 'word-problems-list';
type QuizLevel = {
  label: string;
  difficulty: string;
  questionCount: number;
};

const QUIZ_LEVELS: QuizLevel[] = [
  { label: 'Easy', difficulty: 'Easy', questionCount: 5 },
  { label: 'Medium', difficulty: 'Medium', questionCount: 5 },
  { label: 'Hard', difficulty: 'Hard', questionCount: 5 },
];

export const NewQuizScreen = () => {
  const { addCoins, coinBalance } = useRewards();
  const { quizzesTakenToday, dailyLimit, recordQuizCompletion, childName, quizOffsets, setQuizOffset } = useProgress();
  const { customCategories, customQuestions, removeCustomQuiz, addCustomQuiz, renameCustomQuiz } = useQuizContext();
  const { showModal, showToast } = useFeedback();
  const navigation = useNavigation<any>();
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const isDark = moodColors.isDark;
  const isRocket = mood === 'rocket';
  const baseTextColor = isDark ? '#FFFFFF' : theme.colors.text;
  const subTextColor = isDark ? 'rgba(255,255,255,0.7)' : theme.colors.secondaryText;
  const route = useRoute<any>();
  const quizScrollRef = useRef<ScrollView>(null);

  const [quizState, setQuizState] = useState<QuizState>('selection');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'ai'>('general');

  const IQ_CATEGORIES: QuizCategory[] = [
    { id: 'iq_word_problems', title: 'Word Problems', description: 'Story-style math', icon: 'text-outline', isCustom: false },
  ];

  const allCategories = useMemo(() => [
    ...QUIZ_CATEGORIES, 
    ...IQ_CATEGORIES,
    { id: 'custom_quiz', title: 'Custom Quiz', description: 'All AI-generated questions', icon: 'color-wand-outline', isCustom: true },
    { id: 'new_folder_1', title: 'New Folder', description: '0 quizzes', icon: 'folder-outline', isCustom: false },
    { id: 'new_folder_2', title: 'New Quiz', description: '0 quizzes', icon: 'folder-outline', isCustom: false }
  ], []);

  const { folders, addFolder, removeFolder, renameFolder, moveQuizToFolder, moveFolderToFolder } = useQuizContext();
  const [folderHistory, setFolderHistory] = useState<string[]>([]);
  const activeFolderId = folderHistory.length > 0 ? folderHistory[folderHistory.length - 1] : null;
  const [folderRects, setFolderRects] = useState<Record<string, any>>({});
  const [isDraggingSomething, setIsDraggingSomething] = useState(false);

  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showGenerateMenu, setShowGenerateMenu] = useState(false);
  const [actionMenuCategory, setActionMenuCategory] = useState<any>(null);
  const [showMoveFolderMenu, setShowMoveFolderMenu] = useState(false);

  const [showAiMenu, setShowAiMenu] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);

  const handleOpenActionMenu = (category: any) => {
    setActionMenuCategory(category);
    setShowActionMenu(true);
  };
  const [aiPromptText, setAiPromptText] = useState('');
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const [showDeletePin, setShowDeletePin] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [deletePin, setDeletePin] = useState('');
  const [deletedCategories, setDeletedCategories] = useState<Set<string>>(new Set());
  const [deletedFolders, setDeletedFolders] = useState<Set<string>>(new Set());
  const [hiddenCategories, setHiddenCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadHidden = async () => {
      const stored = await safeStorage.get<string[]>('@hidden_categories', []);
      setHiddenCategories(stored);
    };
    loadHidden();
  }, []);

  const [aiPromptSituation, setAiPromptSituation] = useState('');
  const [aiPromptAge, setAiPromptAge] = useState('');
  const [aiPromptContext, setAiPromptContext] = useState('');
  const [generatedQuizzes, setGeneratedQuizzes] = useState<any[] | null>(null);
  const [showFolderSelection, setShowFolderSelection] = useState(false);
  const [showPhotoConfirmation, setShowPhotoConfirmation] = useState(false);
  const [suggestedFolderName, setSuggestedFolderName] = useState('');
  const [selectedExistingFolderId, setSelectedExistingFolderId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<QuizLevel>(QUIZ_LEVELS[1]);

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [quizToRenameId, setQuizToRenameId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');

  const handleOpenRename = (category: any) => {
    setQuizToRenameId(category.id);
    setRenameTitle(category.title);
    setShowRenameModal(true);
  };

  const handleSaveRename = () => {
    if (quizToRenameId && renameTitle.trim()) {
      renameCustomQuiz(quizToRenameId, renameTitle.trim());
      showToast({ message: 'Quiz renamed!' });
    }
    setShowRenameModal(false);
    setQuizToRenameId(null);
    setRenameTitle('');
  };

  const shakeAnim = React.useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };
  
  const [aiGenerating, setAiGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState('Understanding the concept...');

  const bentoGridRef = useRef<View>(null);
  const bentoGridPosRef = useRef({ pageX: 0, pageY: 0 });
  const [hoveredFolderId, setHoveredFolderId] = useState<string | null>(null);

  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [pendingDragQuizId, setPendingDragQuizId] = useState<string | null>(null);

  const [actionMenuFolder, setActionMenuFolder] = useState<any>(null);
  const [showFolderActionMenu, setShowFolderActionMenu] = useState(false);
  const [showMoveFolderMenu2, setShowMoveFolderMenu2] = useState(false);

  const [showRenameFolderModal, setShowRenameFolderModal] = useState(false);
  const [renameFolderName, setRenameFolderName] = useState('');

  const handleSaveFolderRename = () => {
    if (actionMenuFolder?.id && renameFolderName.trim()) {
      renameFolder(actionMenuFolder.id, renameFolderName.trim());
      showToast({ message: 'Folder renamed!' });
    }
    setShowRenameFolderModal(false);
    setActionMenuFolder(null);
    setRenameFolderName('');
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const folderId = addFolder(newFolderName.trim(), activeTab);
      setNewFolderName('');
      setShowFolderModal(false);
      
      if (pendingDragQuizId) {
        moveQuizToFolder(pendingDragQuizId, folderId);
        showToast({ message: 'Folder created and quiz moved!' });
        setPendingDragQuizId(null);
      } else if (generatedQuizzes) {
        handleSaveToFolder(folderId);
      }
    }
  };

  const handleDragEnd = (quizId: string) => {
    if (hoveredFolderId === 'new-folder') {
      setPendingDragQuizId(quizId);
      setShowFolderModal(true);
      return;
    }

    if (hoveredFolderId) {
      moveQuizToFolder(quizId, hoveredFolderId);
      showToast({ message: 'Moved to folder' });
    }
    setHoveredFolderId(null);
  };

  const handleFolderDragEnd = (draggedFolderId: string) => {
    if (hoveredFolderId && hoveredFolderId !== draggedFolderId && hoveredFolderId !== 'new-folder') {
      moveFolderToFolder(draggedFolderId, hoveredFolderId);
      showToast({ message: 'Folder moved!' });
    }
    setHoveredFolderId(null);
  };

  useEffect(() => {
    if (aiGenerating) {
      const texts = [
        'Understanding the concept...',
        'Creating original questions...',
        'Building your quiz...'
      ];
      setLoadingText(texts[0]);
      
      const timeout1 = setTimeout(() => setLoadingText(texts[1]), 5000);
      const timeout2 = setTimeout(() => setLoadingText(texts[2]), 10000);
      
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }
  }, [aiGenerating]);

  const handleGenerateFromImage = async (base64Image: string) => {
    setShowPhotoMenu(false);
    setLoadingText('Analyzing the image...');
    setAiGenerating(true);
    
    try {
      const topicType = activeTab === 'general' ? 'social' : 'math';
      const responseData = await generateQuizFromImage(base64Image, 7, topicType);
      
      const newQuizzes = responseData.quizzes.map((quiz: any, quizIndex: number) => {
        const prefix = activeTab === 'general' ? 'custom_ai' : 'math_ai';
        const newCategoryId = `${prefix}_${Date.now()}_${quizIndex}`;
        const newCategory = {
          id: newCategoryId,
          title: quiz.concept,
          description: 'AI Generated Quiz',
          icon: 'color-wand',
          color: '#A78BFA',
          isCustom: true,
          folderId: activeFolderId || undefined
        };
        
        const questionsWithCategory = quiz.questions.map((q: any, index: number) => ({
          id: `${newCategoryId}-q${index}`,
          category: newCategoryId,
          difficulty: 'Medium',
          scenario: q.question,
          options: q.options,
          correctAnswerIndex: q.correctIndex,
          explanation: q.explanation || 'Great job!'
        }));
        
        return { category: newCategory, questions: questionsWithCategory };
      });
      
      setGeneratedQuizzes(newQuizzes);
      if (responseData.folderName) {
        setSuggestedFolderName(responseData.folderName);
      } else {
        setSuggestedFolderName('New Folder');
      }
      setSelectedExistingFolderId(null);
      setAiGenerating(false);
      setShowPhotoConfirmation(true);
    } catch (error) {
      console.error('Failed to generate quiz from image:', error);
      setAiGenerating(false);
      Alert.alert('Error', 'Failed to generate quiz. Please try again.');
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImageBase64(result.assets[0].base64!);
      setSelectedImageUri(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to grant camera permissions to use this feature.");
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImageBase64(result.assets[0].base64!);
      setSelectedImageUri(result.assets[0].uri);
    }
  };

  const handleGenerateFromSelectedImage = () => {
    if (selectedImageBase64) {
      const dataUri = `data:image/jpeg;base64,${selectedImageBase64}`;
      handleGenerateFromImage(dataUri);
    }
  };

  const handleGenerateFromText = async () => {
    if (!aiPromptSituation.trim() || !aiPromptAge) return;
    
    const assembledPrompt = `Create a quiz for a ${aiPromptAge} year old about ${aiPromptSituation.trim()}.${aiPromptContext.trim() ? ' ' + aiPromptContext.trim() : ''}`;
    
    setShowAiMenu(false);
    setLoadingText('Understanding the concept...');
    setAiGenerating(true);
    
    try {
      const topicType = 'social';
      const responseData = await generateQuizFromText(assembledPrompt, 7, topicType);
      
      const newQuizzes = responseData.quizzes.map((quiz: any, quizIndex: number) => {
        const prefix = activeTab === 'general' ? 'custom_ai' : 'math_ai';
        const newCategoryId = `${prefix}_${Date.now()}_${quizIndex}`;
        const newCategory = {
          id: newCategoryId,
          title: quiz.concept,
          description: 'AI Generated Quiz',
          icon: 'color-wand',
          color: '#A78BFA',
          isCustom: true,
          folderId: activeFolderId || undefined // default, will be overridden if they choose
        };
        
        const questionsWithCategory = quiz.questions.map((q: any, index: number) => ({
          id: `${newCategoryId}-q${index}`,
          category: newCategoryId,
          difficulty: 'Medium',
          scenario: q.question,
          options: q.options,
          correctAnswerIndex: q.correctIndex,
          explanation: q.explanation || 'Great job!',
          whyOptions: q.whyOptions,
          correctWhyIndex: q.correctWhyIndex,
          whyConfirmation: q.whyConfirmation,
        }));
        
        return { category: newCategory, questions: questionsWithCategory };
      });
      
      setGeneratedQuizzes(newQuizzes);
      setAiGenerating(false);
      setShowFolderSelection(true);
      
    } catch (error: any) {
      setAiGenerating(false);
      showModal({ title: 'Error', message: error.message || 'Failed to generate quiz.', type: 'error' });
    }
  };

  const handleSaveToFolder = (targetFolderId: string | undefined) => {
    if (generatedQuizzes) {
      generatedQuizzes.forEach((quizSet) => {
        const categoryToSave = { ...quizSet.category, folderId: targetFolderId };
        addCustomQuiz(categoryToSave, quizSet.questions);
      });
      setGeneratedQuizzes(null);
      setShowFolderSelection(false);
      setAiPromptText('');
      showToast({ message: 'AI Quizzes generated and saved!' });
    }
  };

  const handleConfirmPhotoQuizzes = () => {
    if (generatedQuizzes) {
      let targetFolderId = selectedExistingFolderId;
      
      if (!targetFolderId) {
        const folderName = suggestedFolderName.trim() || 'New Folder';
        targetFolderId = addFolder(folderName, activeTab);
      }
      
      generatedQuizzes.forEach((quizSet) => {
        const categoryToSave = { ...quizSet.category, folderId: targetFolderId };
        addCustomQuiz(categoryToSave, quizSet.questions);
      });
      
      setGeneratedQuizzes(null);
      setShowPhotoConfirmation(false);
      setSuggestedFolderName('');
      setSelectedExistingFolderId(null);
      showToast({ message: 'AI Quizzes added successfully!' });
    }
  };

  const cancelPhotoConfirmation = () => {
    setGeneratedQuizzes(null);
    setShowPhotoConfirmation(false);
    setSuggestedFolderName('');
    setSelectedExistingFolderId(null);
  };

  const cancelFolderSelection = () => {
    setGeneratedQuizzes(null);
    setShowFolderSelection(false);
    setAiPromptText('');
  };

  const handleDeletePinChange = (text: string) => {
    const newPin = text.replace(/[^0-9]/g, '');
    setDeletePin(newPin);

    if (newPin.length === 4) {
      if (newPin === '1111') {
        if (quizToDelete) {
          const isBuiltIn = [...QUIZ_CATEGORIES, ...IQ_CATEGORIES, { id: 'new_folder_1' }, { id: 'new_folder_2' }].some(c => c.id === quizToDelete);
          if (isBuiltIn) {
            const newHidden = [...hiddenCategories, quizToDelete];
            setHiddenCategories(newHidden);
            safeStorage.set('@hidden_categories', newHidden);
            showToast({ message: 'Quiz hidden' });
          } else {
            removeCustomQuiz(quizToDelete);
            showToast({ message: 'Quiz deleted' });
          }
        }
        setShowDeletePin(false);
        setDeletePin('');
        setQuizToDelete(null);
      } else {
        triggerShake();
        setDeletePin('');
      }
    }
  };

  useEffect(() => {
    if (route.params?.tab === 'ai') {
      setActiveTab('ai');
      setQuizState('selection');
      navigation.setParams({ tab: undefined });
    }
  }, [route.params?.tab]);
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWhyPhase, setIsWhyPhase] = useState(false);
  const [currentWordProblemStep, setCurrentWordProblemStep] = useState(0);
  const [totalWordProblemSteps, setTotalWordProblemSteps] = useState(0);

  const completionFadeAnim = useRef(new Animated.Value(0)).current;
  const completionSlideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (quizState === 'completed') {
      Animated.parallel([
        Animated.timing(completionFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(completionSlideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      completionFadeAnim.setValue(0);
      completionSlideAnim.setValue(20);
    }
  }, [quizState]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const buildQuestionSet = (questions: Question[], questionCount: number): Question[] => {
    if (questions.length === 0) return [];

    const selected: Question[] = [];
    while (selected.length < questionCount) {
      const round = shuffleArray(questions);
      const remaining = questionCount - selected.length;
      selected.push(...round.slice(0, remaining));
    }

    return selected.map((question, index) => ({
      ...question,
      id: `${question.id}-${index}`,
    }));
  };

  const injectFallbackWhy = (question: Question): Question => {
    if (question.whyOptions && question.whyOptions.length > 0) {
      return question;
    }
    if (question.category.toString().startsWith('iq_') || question.category === 'iq_word_problems') {
      return question;
    }
    return {
      ...question,
      whyOptions: [
        'It helps others feel heard and shows we care',
        'Because they will stop talking sooner',
        'Because it is a strict rule'
      ],
      correctWhyIndex: 0,
      whyConfirmation: 'Doing the kind and respectful thing helps everyone get along and feel happy.'
    };
  };

  const handleStartQuickQuiz = () => {
    const socialSkillsPool = allQuestions.filter(q => !q.category.toString().startsWith('iq_'));
    const shuffled = shuffleArray(socialSkillsPool);
    const selected = shuffled.slice(0, 5).map(q => injectFallbackWhy(q));
    
    setSelectedCategory(null);
    setCurrentQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setIsProcessing(false);
    setIsWhyPhase(false);
    setQuizState('in-progress');
  };

  const handleStartQuiz = async (categoryId: string) => {
    let pool: any[] = [];
    if (categoryId === 'general_quiz') {
      pool = allQuestions.filter(q => !q.category.toString().startsWith('iq_'));
    } else if (categoryId === 'custom_quiz') {
      pool = customQuestions;
    } else if (categoryId === 'iq_word_problems') {
      pool = wordProblems;
    } else {
      // Individual AI-generated quiz category — pull its questions from customQuestions
      pool = customQuestions.filter(q => q.category === categoryId);
    }

    if (pool.length === 0) {
      showToast({ message: 'No questions available for this category!' });
      return;
    }

    const currentOffset = quizOffsets[categoryId] || 0;
    const limit = categoryId === 'iq_word_problems' ? 1 : Math.min(5, pool.length);
    let selected: any[] = [];

    // Slice questions, wrapping around if necessary
    for (let i = 0; i < limit; i++) {
      const idx = (currentOffset + i) % pool.length;
      selected.push(injectFallbackWhy({
        ...pool[idx],
        id: `${pool[idx].id}-${currentOffset}-${i}`,
      }));
    }

    const newOffset = (currentOffset + limit) % pool.length;
    await setQuizOffset(categoryId, newOffset);

    setSelectedCategory(categoryId as any);
    setCurrentQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setIsProcessing(false);
    setIsWhyPhase(false);
    setQuizState('in-progress');
  };

  const handleSelectQuizCategory = (categoryId: string) => {
    handleStartQuiz(categoryId);
  };

  const handleContinue = async (isCorrect: boolean) => {
    if (isProcessing) return;

    // handleContinue is now only called when the full question is done
    // (Part 2 complete for why-questions, or single-part complete).
    // The Part 1→Part 2 transition is handled by QuestionView internally.

    // Award score: 1 point per scenario completed
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Reset why phase for next question
    setIsWhyPhase(false);

    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsProcessing(true);
      const finalScore = isCorrect ? score + 1 : score;
      let coinsEarned = currentQuestions.length;
      
      if (coinsEarned > 0) {
        addCoins(coinsEarned);
      }
      await recordQuizCompletion(finalScore, coinsEarned);
      setQuizState('completed');
      setIsProcessing(false);
    }
  };

  const handleBackToHome = () => {
    setQuizState('selection');
    setSelectedCategory(null);
    setCurrentQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setIsWhyPhase(false);
  };

  const navigateIntoFolder = (folderId: string) => {
    setFolderHistory(prev => [...prev, folderId]);
  };
  const navigateBackFromFolder = () => {
    setFolderHistory(prev => prev.slice(0, -1));
  };

  const renderSelection = () => {
    // If we're inside a folder, render the folder contents view
    if (activeFolderId) {
      const currentFolder = folders.find(f => f.id === activeFolderId);
      const quizzesInFolder = customCategories.filter(c => c.folderId === activeFolderId);
      const subFolders = folders.filter(f => f.parentId === activeFolderId);

      return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <TopBar title={currentFolder?.name || 'Folder'} />
          
          <View style={[styles.tabContainer, isDark && { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)', shadowOpacity: 0 }]}>
            <Pressable 
              onPress={navigateBackFromFolder} 
              style={[styles.tab, { flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: theme.spacing.md }]}
            >
              <Ionicons name="chevron-back" size={20} color={isDark ? '#FFFFFF' : '#374151'} style={{ marginRight: 4 }} />
              <Text style={[styles.tabText, { color: isDark ? '#FFFFFF' : '#374151', fontWeight: '600' }]}>Back</Text>
            </Pressable>
          </View>

          {quizzesInFolder.length === 0 && subFolders.length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: theme.spacing.xxl }}>
              <Ionicons name="folder-open-outline" size={48} color={theme.colors.stroke} />
              <Text style={{ ...theme.typography.body, color: theme.colors.secondaryText, marginTop: theme.spacing.md }}>This folder is empty</Text>
            </View>
          )}

          <View ref={bentoGridRef} style={styles.bentoGrid}>
            {/* Sub-folders */}
            {subFolders.map(folder => {
              const count = customCategories.filter(c => c.folderId === folder.id).length;
              return (
                <View key={folder.id} style={[styles.bentoItem, { width: '47%' }]}>
                  <FolderCard 
                    name={folder.name}
                    onPress={() => navigateIntoFolder(folder.id)}
                    onEdit={() => {
                      setActionMenuFolder(folder);
                      setShowFolderActionMenu(true);
                    }}
                  />
                </View>
              );
            })}

            {/* Quiz cards inside the folder */}
            {quizzesInFolder.map(quiz => (
              <View key={quiz.id} style={[styles.bentoItem, { width: '47%' }]}>
                <QuizCard 
                  category={{ ...quiz, description: `${customQuestions.filter(q => q.category === quiz.id).length} questions` }} 
                  isFeatured={false}
                  onPressStart={() => handleStartQuiz(quiz.id)} 
                  onOptionsPress={() => handleOpenActionMenu(quiz)}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      );
    }

    // Root library view (no folder open)
    const tabFilter = activeTab === 'general' ? 'general' : 'ai';
    let builtInCategories = activeTab === 'general' 
      ? allCategories.filter(c => c.id === 'general_quiz' || (c.id === 'custom_quiz' && customQuestions.length > 0))
      : allCategories.filter(c => c.id === 'iq_word_problems');
    builtInCategories = builtInCategories.filter(c => !hiddenCategories.includes(c.id));

    // Folders for the current tab (root level only)
    const tabFolders = folders.filter(f => f.tab === tabFilter && !f.parentId);

    // AI-generated quizzes NOT inside any folder
    const prefix = activeTab === 'general' ? 'custom_ai' : 'math_ai';
    const looseCategoryCards = customCategories.filter(
      c => c.id.startsWith(prefix) && !c.folderId
    );

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TopBar title="Library" />
        
        <View style={[styles.tabContainer, isDark && { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)', shadowOpacity: 0 }]}>
          <Pressable 
            style={[styles.tab, activeTab === 'general' && { backgroundColor: 'rgba(186, 230, 253, 0.4)', borderColor: '#BAE6FD', borderWidth: 1 }]} 
            onPress={() => setActiveTab('general')}
          >
            <Text style={[styles.tabText, { color: subTextColor }, activeTab === 'general' && { color: '#374151', fontWeight: '600' }]}>Social Skills</Text>
          </Pressable>
          <Pressable 
            style={[styles.tab, activeTab === 'ai' && { backgroundColor: 'rgba(186, 230, 253, 0.4)', borderColor: '#BAE6FD', borderWidth: 1 }]} 
            onPress={() => setActiveTab('ai')}
          >
            <Text style={[styles.tabText, { color: subTextColor }, activeTab === 'ai' && { color: '#374151', fontWeight: '600' }]}>Math Skills</Text>
          </Pressable>
        </View>

        <View ref={bentoGridRef} style={styles.bentoGrid}>
          {/* Built-in categories */}
          {builtInCategories.map((category: any) => (
            <View key={category.id} style={[styles.bentoItem, { width: '47%' }]}>
              <QuizCard 
                category={category} 
                isFeatured={false}
                onPressStart={() => handleSelectQuizCategory(category.id)} 
                onOptionsPress={() => handleOpenActionMenu(category)}
              />
            </View>
          ))}

          {/* Folders */}
          {tabFolders.map(folder => {
            const quizCount = customCategories.filter(c => c.folderId === folder.id).length;
            return (
              <View key={folder.id} style={[styles.bentoItem, { width: '47%' }]}>
                <FolderCard 
                  name={folder.name}
                  onPress={() => navigateIntoFolder(folder.id)}
                  onEdit={() => {
                    setActionMenuFolder(folder);
                    setShowFolderActionMenu(true);
                  }}
                  isDragTarget={hoveredFolderId === folder.id}
                />
              </View>
            );
          })}

          {/* Loose AI quizzes (not in any folder) */}
          {looseCategoryCards.map(quiz => (
            <View key={quiz.id} style={[styles.bentoItem, { width: '47%' }]}>
              <QuizCard 
                category={{ ...quiz, description: `${customQuestions.filter(q => q.category === quiz.id).length} questions` }} 
                isFeatured={false}
                onPressStart={() => handleStartQuiz(quiz.id)} 
                onOptionsPress={() => handleOpenActionMenu(quiz)}
              />
            </View>
          ))}
          
          {/* Add Folder placeholder */}
          <View style={[styles.bentoItem, { width: '47%' }]}>
            <Pressable onPress={() => setShowFolderModal(true)}>
              <Card style={{ 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: theme.spacing.md,
                height: 160,
                borderStyle: 'dashed',
                borderWidth: 2,
                borderColor: theme.colors.stroke,
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                opacity: 0.8
              }}>
                <View style={{ marginTop: 12, marginBottom: 4, width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons name="add" size={32} color={isRocket ? '#FFFFFF' : '#7DD3FC'} />
                </View>
                <View style={{ alignItems: 'center', width: '100%', minHeight: 56, justifyContent: 'flex-start' }}>
                  <Text style={{ ...theme.typography.body, fontWeight: '600', textAlign: 'center', color: theme.colors.secondaryText }}>Add Folder</Text>
                </View>
              </Card>
            </Pressable>
          </View>
        </View>

        <View style={styles.createAiButtonContainer}>
          <Button
            title="Generate New Quiz"
            iconName="color-wand-outline"
            iconSize={18}
            style={[styles.createAiButton, { marginBottom: 12, backgroundColor: theme.colors.primary }]}
            onPress={() => setShowGenerateMenu(true)}
          />
        </View>
      </ScrollView>
    );
  };

  const renderCoinJar = () => {
    const gradientColors = [
      '#38BDF8', '#0EA5E9', '#0284C7', '#0369A1', '#075985',
      '#0C4A6E', '#1E3A8A', '#1E40AF', '#1D4ED8', '#2563EB',
      '#3B82F6', '#60A5FA', '#93C5FD'
    ];
    return (
      <View style={[
        styles.coinJarContainer,
        isRocket && {
          backgroundColor: 'rgba(255, 255, 255, 0.35)',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          borderWidth: 1.5,
        }
      ]}>
        <FontAwesome5 
          name="coins" 
          size={20} 
          color={isRocket ? '#FFFFFF' : gradientColors[0]} 
        />
        <View style={{ flexDirection: 'row', marginLeft: 4 }}>
          {score.toString().split('').map((char, index) => (
            <Text 
              key={`score-${index}`} 
              style={[
                styles.coinJarText, 
                { marginLeft: 0 },
                { color: isRocket ? '#FFFFFF' : gradientColors[Math.min(2 + index, gradientColors.length - 1)] }
              ]}
            >
              {char}
            </Text>
          ))}
        </View>
      </View>
    );
  };


  const getDisplayQuestion = (): Question => {
    const baseQuestion = currentQuestions[currentIndex] as Question;
    const hasWhyData = baseQuestion && baseQuestion.whyOptions && baseQuestion.whyOptions.length > 0;

    if (!hasWhyData) return baseQuestion;

    if (isWhyPhase) {
      const correctAnswer = baseQuestion.options[baseQuestion.correctAnswerIndex];
      const questionText = (baseQuestion.prompt || baseQuestion.scenario).toLowerCase();
      const isSaying = correctAnswer.includes('"') || questionText.includes('say') || questionText.includes('tell');
      const actionText = isSaying ? "thing to say" : "thing to do";

      return {
        ...baseQuestion,
        id: `${baseQuestion.id}-why`,
        scenario: `Now tell me: why is this the right ${actionText}?`,
        prompt: undefined,
        options: baseQuestion.whyOptions!,
        correctAnswerIndex: baseQuestion.correctWhyIndex!,
        explanation: baseQuestion.whyConfirmation!,
      };
    }

    return baseQuestion;
  };

  const renderInProgress = () => {
    if (currentQuestions.length === 0) return null;
    const baseQuestion = currentQuestions[currentIndex] as Question;
    const hasWhyData = baseQuestion.whyOptions && baseQuestion.whyOptions.length > 0;

    let categoryName = allCategories.find((c: any) => c.id === selectedCategory)?.title || selectedCategory;
    const customCat = customCategories.find(c => c.id === selectedCategory);
    if (customCat) {
      categoryName = customCat.title;
    }

    return (
      <View style={styles.inProgressContainer}>
        {/* Sticky header — stays pinned at top */}
        <View style={{ paddingBottom: theme.spacing.sm, zIndex: 10 }}>
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm, zIndex: 2 }}>
            <Pressable 
              onPress={handleBackToHome}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, marginLeft: -4 }}
            >
              <Ionicons name="chevron-back" size={24} color={baseTextColor} />
              <Text style={{ ...theme.typography.body, color: isRocket ? 'rgba(255,255,255,0.7)' : theme.colors.secondaryText, marginLeft: 2 }}>Back</Text>
            </Pressable>
            <View style={[styles.screenFolderTab, { position: 'relative', top: 0, right: 0, left: 'auto', overflow: 'hidden' }]}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0)']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              />
              <Text style={[styles.screenFolderTabText, { color: baseTextColor }]} numberOfLines={1}>Topic: {categoryName}</Text>
            </View>
          </View>

        </View>

        {/* Scrollable question content */}
        <ScrollView ref={quizScrollRef} style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingTop: theme.spacing.sm }]}>
          {selectedCategory === 'iq_word_problems' ? (
            <StepBasedQuestionView
              question={baseQuestion as any}
              onContinue={handleContinue}
              disabled={isProcessing}
              onStepChange={(idx, total) => {
                setCurrentWordProblemStep(idx);
                setTotalWordProblemSteps(total);
              }}
            />
          ) : (() => {
            // Build the Part 2 (why) question inline if applicable
            const whyQ = hasWhyData ? (() => {
              const correctAnswer = baseQuestion.options[baseQuestion.correctAnswerIndex];
              const questionText = (baseQuestion.prompt || baseQuestion.scenario).toLowerCase();
              const isSaying = correctAnswer.includes('"') || questionText.includes('say') || questionText.includes('tell');
              const actionText = isSaying ? "thing to say" : "thing to do";
              return {
                ...baseQuestion,
                id: `${baseQuestion.id}-why`,
                scenario: baseQuestion.whyQuestion || `Now tell me: why is this the right ${actionText}?`,
                prompt: undefined,
                options: baseQuestion.whyOptions!,
                correctAnswerIndex: baseQuestion.correctWhyIndex!,
                explanation: baseQuestion.whyConfirmation!,
              } as Question;
            })() : null;

            return (
              <QuestionView
                question={baseQuestion}
                onContinue={handleContinue}
                disabled={isProcessing}
                topicName={allCategories.find(c => c.id === selectedCategory)?.title}
                showCoinReward={!hasWhyData}
                showExplanation={!hasWhyData}
                whyQuestion={whyQ}
                showPart2={isWhyPhase}
                onPart1Complete={() => setIsWhyPhase(true)}
                scrollViewRef={quizScrollRef}
              />
            );
          })()}
        </ScrollView>

        {/* Bottom bar with progress and coins */}
        <View style={{ paddingTop: theme.spacing.md, paddingBottom: 110 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
            <View style={{ flex: 1, marginBottom: 0 }}>
              <View style={{ marginBottom: -4, paddingHorizontal: 0 }}>
                <View style={{ height: 10, backgroundColor: theme.colors.white, borderRadius: theme.borderRadius.full, overflow: 'hidden', borderWidth: 1, borderStyle: 'dashed', borderColor: theme.colors.stroke }}>
                  {selectedCategory === 'iq_word_problems' ? (
                    <LinearGradient
                      colors={['#38BDF8', '#0EA5E9', '#0284C7', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={{ height: '100%', width: `${((currentWordProblemStep + 1) / totalWordProblemSteps) * 100}%`, borderRadius: theme.borderRadius.full, borderWidth: 1, borderColor: theme.colors.stroke }} 
                    />
                  ) : (
                    <LinearGradient
                      colors={['#38BDF8', '#0EA5E9', '#0284C7', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={{ height: '100%', width: `${((currentIndex + 1) / currentQuestions.length) * 100}%`, borderRadius: theme.borderRadius.full, borderWidth: 1, borderColor: theme.colors.stroke }} 
                    />
                  )}
                </View>
              </View>
            </View>
            {renderCoinJar()}
          </View>

          {/* Caption below progress bar */}
          {selectedCategory === 'iq_word_problems' ? (
            <Text style={[styles.questionCaption, { marginTop: -8, marginBottom: 0, color: subTextColor }]}>
              <Text style={{ fontWeight: '600', color: theme.colors.text }}>Step {currentWordProblemStep + 1}</Text> of {totalWordProblemSteps}
            </Text>
          ) : (
            <Text style={[styles.questionCaption, { marginTop: -8, marginBottom: 0, color: subTextColor }]}>
              <Text style={{ fontWeight: '600', color: theme.colors.text }}>Question {currentIndex + 1}</Text> of {currentQuestions.length}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderCompleted = () => {
    const categoryName = allCategories.find((c: any) => c.id === selectedCategory)?.title || '';
    const total = currentQuestions.length;
    
    let message = "Awesome!";

    let coinsEarned = total;

    const handleRedeemNow = () => {
      handleBackToHome();
      navigation.navigate('MyRewards');
    };

    const gradientColors = [
      '#38BDF8', '#0EA5E9', '#0284C7', '#0369A1', '#075985',
      '#0C4A6E', '#1E3A8A', '#1E40AF', '#1D4ED8', '#2563EB',
      '#3B82F6', '#60A5FA', '#93C5FD'
    ];
    return (
      <Pressable style={styles.completedContainer} onPress={handleBackToHome}>
        <SilverDust />
        <Pressable style={styles.completedCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
          <Animated.View style={{ opacity: completionFadeAnim, transform: [{ translateY: completionSlideAnim }], alignItems: 'center', width: '100%' }}>
            <View style={[styles.titleContainer, { position: 'relative' }]}>

              <Text style={styles.completedTitle}>{message}</Text>
              {message === "Awesome!" && <View style={styles.brushUnderline} />}
            </View>

            <View style={styles.completedCoinRow}>
              <FontAwesome5 
                name="coins" 
                size={24} 
                color={gradientColors[0]} 
              />
              <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                <Text style={{ ...styles.completedCoinText, marginRight: 0, color: gradientColors[0] }}>+</Text>
                {coinsEarned.toString().split('').map((char, index) => (
                  <Text 
                    key={`earn-${index}`} 
                    style={[
                      styles.completedCoinText, 
                      { marginLeft: 0 },
                      { color: gradientColors[Math.min(1 + index, gradientColors.length - 1)] }
                    ]}
                  >
                    {char}
                  </Text>
                ))}
                <Text style={{ ...styles.completedCoinText, marginLeft: 6, color: gradientColors[Math.min(3, gradientColors.length - 1)] }}>Coins Earned!</Text>
              </View>
            </View>

            <Button
              title="Redeem Now"
              onPress={handleRedeemNow}
              style={styles.completedButton}
            />

            <Pressable style={styles.linkButton} onPress={handleBackToHome}>
              <Text style={styles.linkButtonText}>One More Quiz</Text>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <GlobalBackground />
      
      <ScreenWrapper transparent>
        <View style={styles.content}>
          {quizState === 'selection' && renderSelection()}
          {quizState === 'in-progress' && renderInProgress()}
          {quizState === 'completed' && renderCompleted()}
        </View>
      </ScreenWrapper>


      {/* AI Photo Menu Modal */}
      <Modal visible={showPhotoMenu} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => setShowPhotoMenu(false)}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.uploadCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <Text style={styles.levelTitle}>Create a Quiz from a Screenshot</Text>
              <Text style={[styles.questionCaption, { marginBottom: theme.spacing.lg, paddingHorizontal: theme.spacing.md }]}>
                Turn a screenshot into an interactive social or math quiz automatically.
              </Text>
              
              {!selectedImageUri ? (
                <View style={{ width: '100%', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
                  <Pressable style={styles.photoOutlineButton} onPress={handleTakePhoto}>
                    <Ionicons name="camera-outline" size={24} color={theme.colors.secondaryText} style={{ marginRight: theme.spacing.sm }} />
                    <Text style={styles.photoOutlineText}>Take Photo</Text>
                  </Pressable>
                  
                  <Pressable style={styles.photoOutlineButton} onPress={handlePickImage}>
                    <Ionicons name="images-outline" size={24} color={theme.colors.secondaryText} style={{ marginRight: theme.spacing.sm }} />
                    <Text style={styles.photoOutlineText}>Upload from Gallery</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={{ width: '100%', alignItems: 'center', marginBottom: theme.spacing.lg }}>
                  <Image source={{ uri: selectedImageUri }} style={{ width: 120, height: 120, borderRadius: theme.borderRadius.sm, marginBottom: theme.spacing.md }} />
                  <Pressable style={styles.linkButton} onPress={() => { setSelectedImageUri(null); setSelectedImageBase64(null); }}>
                    <Text style={styles.linkButtonText}>Choose different photo</Text>
                  </Pressable>
                </View>
              )}
              
              <Button 
                title="Generate Quiz" 
                iconName="color-wand-outline"
                iconSize={18} 
                onPress={handleGenerateFromSelectedImage} 
                style={styles.uploadButton}
                disabled={!selectedImageBase64}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* AI Quiz creation menu modal */}
      <Modal visible={showAiMenu} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => setShowAiMenu(false)}>
          <View style={[styles.modalOverlay, { padding: 0 }]}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
              <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl, minHeight: '100%' }} onPress={() => setShowAiMenu(false)}>
                <Pressable style={styles.uploadCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <Text style={styles.levelTitle}>Create a Quiz from a Prompt</Text>
              
              <Text style={styles.inputLabel}>What situation or skill should this quiz cover? *</Text>
              <TextInput
                style={[styles.input, { marginBottom: theme.spacing.md }]}
                placeholder="e.g. sharing toys at recess..."
                placeholderTextColor={theme.colors.secondaryText}
                value={aiPromptSituation}
                onChangeText={setAiPromptSituation}
              />
              
              <Text style={styles.inputLabel}>How old is your child? *</Text>
              <View style={[styles.levelChipsContainer, { marginBottom: theme.spacing.md, paddingHorizontal: 0 }]}>
                {['4-5', '6-7', '8-9', '10+'].map(age => (
                  <Pressable
                    key={age}
                    style={[styles.levelChip, aiPromptAge === age && styles.levelChipSelected]}
                    onPress={() => setAiPromptAge(age)}
                  >
                    <Text style={[styles.levelChipText, aiPromptAge === age && styles.levelChipTextSelected]}>{age}</Text>
                  </Pressable>
                ))}
              </View>
              
              <Text style={styles.inputLabel}>Anything specific to keep in mind? (optional)</Text>
              <TextInput
                style={[styles.input, { minHeight: 80, textAlignVertical: 'top', marginBottom: theme.spacing.xl }]}
                placeholder="e.g. gets frustrated easily..."
                placeholderTextColor={theme.colors.secondaryText}
                value={aiPromptContext}
                onChangeText={setAiPromptContext}
                multiline
                numberOfLines={3}
              />
              
              <Button 
                title="Generate Quiz" 
                iconName="color-wand-outline"
                iconSize={18} 
                onPress={handleGenerateFromText} 
                style={styles.uploadButton}
                disabled={!aiPromptSituation.trim() || !aiPromptAge}
              />
              </Pressable>
              </Pressable>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* AI Quiz generating loader modal */}
      <Modal visible={aiGenerating} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Card style={[styles.levelCard, { alignItems: 'center', paddingVertical: 40 }]}>
            <Ionicons name="color-wand-outline" size={64} color={theme.colors.primary} />
            <Text style={[styles.levelTitle, { marginTop: theme.spacing.md, marginBottom: 8 }]}>Generating Quiz...</Text>
            <Text style={[styles.questionCaption, { marginBottom: theme.spacing.lg }]}>{loadingText}</Text>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </Card>
        </View>
      </Modal>



    {/* Photo Generation Confirmation Modal */}
      <Modal visible={showPhotoConfirmation} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={cancelPhotoConfirmation}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.uploadCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <Text style={styles.levelTitle}>Confirm Quizzes</Text>
              <Text style={[styles.questionCaption, { marginBottom: theme.spacing.lg }]}>
                {generatedQuizzes ? `Generated ${generatedQuizzes.length} quizzes. Where would you like to save them?` : 'Where would you like to save these generated quizzes?'}
              </Text>
              
              <Text style={[styles.modalOptionText, { marginBottom: theme.spacing.xs, fontSize: 14, color: theme.colors.secondaryText }]}>
                Suggested New Folder Name
              </Text>
              <TextInput
                style={[styles.modalInput, { marginBottom: theme.spacing.lg }]}
                value={suggestedFolderName}
                onChangeText={(text) => {
                  setSuggestedFolderName(text);
                  setSelectedExistingFolderId(null);
                }}
                placeholder="Enter folder name"
              />
              
              <Text style={[styles.modalOptionText, { marginBottom: theme.spacing.xs, fontSize: 14, color: theme.colors.secondaryText }]}>
                Or select an existing folder:
              </Text>
              
              <ScrollView style={{ width: '100%', maxHeight: 200, marginBottom: theme.spacing.lg }}>
                {folders.filter(f => f.tab === (activeTab === 'general' ? 'general' : 'ai')).length === 0 && (
                  <Text style={{ textAlign: 'center', color: theme.colors.secondaryText, fontStyle: 'italic', marginBottom: theme.spacing.md }}>No folders yet. We'll create a new one for you.</Text>
                )}
                {folders.filter(f => f.tab === (activeTab === 'general' ? 'general' : 'ai')).map(folder => (
                  <Pressable 
                    key={folder.id} 
                    style={[
                      styles.modalOptionCard, 
                      { marginBottom: 8 },
                      selectedExistingFolderId === folder.id && { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.primary, borderWidth: 2 }
                    ]}
                    onPress={() => setSelectedExistingFolderId(folder.id)}
                  >
                    <Ionicons name="folder-outline" size={24} color={selectedExistingFolderId === folder.id ? theme.colors.primary : theme.colors.secondaryText} style={{ marginRight: 12 }} />
                    <Text style={[styles.modalOptionText, selectedExistingFolderId === folder.id && { color: theme.colors.primary, fontWeight: '600' }]}>{folder.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              
              <Button 
                title="Add Quizzes" 
                variant="primary"
                onPress={handleConfirmPhotoQuizzes} 
                style={{ width: '100%', marginBottom: theme.spacing.md }}
              />
              <Button 
                title="Cancel" 
                variant="secondary"
                onPress={cancelPhotoConfirmation} 
                style={{ width: '100%' }}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Folder Selection Modal after AI Generation */}
      <Modal visible={showFolderSelection} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={cancelFolderSelection}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.uploadCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <Text style={styles.levelTitle}>Select a Folder</Text>
              <Text style={[styles.questionCaption, { marginBottom: theme.spacing.lg }]}>
                Where would you like to save these generated quizzes?
              </Text>
              
              <ScrollView style={{ width: '100%', maxHeight: 300 }}>
                {folders.map(folder => (
                  <Pressable 
                    key={folder.id} 
                    style={[styles.modalOptionCard, { marginBottom: 8 }]}
                    onPress={() => handleSaveToFolder(folder.id)}
                  >
                    <Ionicons name="folder-outline" size={24} color={theme.colors.secondaryText} style={{ marginRight: 12 }} />
                    <Text style={styles.modalOptionText}>{folder.name}</Text>
                  </Pressable>
                ))}
                <Pressable 
                  style={[styles.modalOptionCard, { marginBottom: 8 }]}
                  onPress={() => {
                    setShowFolderSelection(false);
                    setShowFolderModal(true);
                  }}
                >
                  <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} style={{ marginRight: 12 }} />
                  <Text style={[styles.modalOptionText, { color: theme.colors.primary, fontWeight: '600' }]}>Create New Folder</Text>
                </Pressable>
                <Pressable 
                  style={[styles.modalOptionCard, { marginBottom: 8 }]}
                  onPress={() => handleSaveToFolder(undefined)}
                >
                  <Ionicons name="home-outline" size={24} color={theme.colors.secondaryText} style={{ marginRight: 12 }} />
                  <Text style={styles.modalOptionText}>Main Library (No Folder)</Text>
                </Pressable>
              </ScrollView>
              
              <Button 
                title="Cancel" 
                variant="secondary"
                onPress={cancelFolderSelection} 
                style={{ width: '100%', marginTop: theme.spacing.md }}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Generate Menu Modal */}
      <Modal visible={showGenerateMenu} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => setShowGenerateMenu(false)}>
          <View style={[styles.modalOverlay, { justifyContent: 'flex-end', padding: 0 }]}>
            <Pressable style={[styles.uploadCard, { width: '100%', maxWidth: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, paddingBottom: 40 }]} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <Text style={[styles.levelTitle, { marginBottom: theme.spacing.xl }]}>Generate New Quiz</Text>
              
              <View style={{ width: '100%', gap: theme.spacing.sm }}>
                <Pressable 
                  style={styles.modalOptionCard}
                  onPress={() => {
                    setShowGenerateMenu(false);
                    setSelectedImageBase64(null);
                    setSelectedImageUri(null);
                    setShowPhotoMenu(true);
                  }}
                >
                  <Ionicons name="camera-outline" size={24} color={theme.colors.secondaryText} style={{ marginRight: 12 }} />
                  <Text style={styles.modalOptionText}>Generate from Screenshot</Text>
                </Pressable>

                <Pressable 
                  style={styles.modalOptionCard}
                  onPress={() => {
                    setShowGenerateMenu(false);
                    setShowAiMenu(true);
                  }}
                >
                  <Ionicons name="color-wand-outline" size={24} color={theme.colors.secondaryText} style={{ marginRight: 12 }} />
                  <Text style={styles.modalOptionText}>Generate from Prompt</Text>
                </Pressable>
                
                <Pressable 
                  style={[styles.modalOptionCard, { justifyContent: 'center', marginTop: 12 }]}
                  onPress={() => setShowGenerateMenu(false)}
                >
                  <Text style={[styles.modalOptionText, { color: theme.colors.danger, textAlign: 'center' }]}>Cancel</Text>
                </Pressable>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Action Menu Modal */}
      <Modal visible={showActionMenu} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => setShowActionMenu(false)}>
          <View style={[styles.modalOverlay, { justifyContent: 'flex-end', padding: 0 }]}>
            <Pressable style={[styles.uploadCard, { width: '100%', maxWidth: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, paddingBottom: 40 }]} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <Text style={[styles.levelTitle, { marginBottom: theme.spacing.xl }]}>{actionMenuCategory?.title || 'Options'}</Text>
              
              <View style={{ width: '100%', gap: theme.spacing.sm }}>
                <Pressable 
                  style={[styles.modalOptionCard, !actionMenuCategory?.isCustom && { opacity: 0.5 }]}
                  disabled={!actionMenuCategory?.isCustom}
                  onPress={() => {
                    setShowActionMenu(false);
                    handleOpenRename(actionMenuCategory);
                  }}
                >
                  <Ionicons name="pencil-outline" size={24} color={theme.colors.secondaryText} style={{ marginRight: 12 }} />
                  <Text style={styles.modalOptionText}>Rename</Text>
                </Pressable>

                <Pressable 
                  style={styles.modalOptionCard}
                  onPress={() => {
                    setShowActionMenu(false);
                    setShowMoveFolderMenu(true);
                  }}
                >
                  <Ionicons name="folder-outline" size={24} color={theme.colors.secondaryText} style={{ marginRight: 12 }} />
                  <Text style={styles.modalOptionText}>Move to Folder</Text>
                </Pressable>

                {actionMenuCategory?.folderId && (
                  <Pressable 
                    style={styles.modalOptionCard}
                    onPress={() => {
                      moveQuizToFolder(actionMenuCategory.id, undefined);
                      showToast({ message: 'Removed from folder' });
                      setShowActionMenu(false);
                    }}
                  >
                    <Ionicons name="log-out-outline" size={24} color={theme.colors.secondaryText} style={{ marginRight: 12 }} />
                    <Text style={styles.modalOptionText}>Remove from Folder</Text>
                  </Pressable>
                )}

                <Pressable 
                  style={styles.modalOptionCard}
                  onPress={() => {
                    setShowActionMenu(false);
                    setQuizToDelete(actionMenuCategory.id);
                    setShowDeletePin(true);
                  }}
                >
                  <Ionicons name="trash-outline" size={24} color={theme.colors.secondaryText} style={{ marginRight: 12 }} />
                  <Text style={styles.modalOptionText}>Delete</Text>
                </Pressable>
              </View>
              
              <Button 
                title="Cancel" 
                variant="secondary"
                onPress={() => setShowActionMenu(false)} 
                style={{ width: '100%', marginTop: theme.spacing.xl }}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Folder Action Menu Modal */}
      <Modal visible={showFolderActionMenu} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => setShowFolderActionMenu(false)}>
          <View style={[styles.modalOverlay, { justifyContent: 'flex-end', padding: 0 }]}>
            <Pressable style={[styles.uploadCard, { width: '100%', maxWidth: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, paddingBottom: 40 }]} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <Text style={[styles.levelTitle, { marginBottom: theme.spacing.xl }]}>{actionMenuFolder?.name || 'Folder Options'}</Text>
              
              <View style={{ width: '100%', gap: theme.spacing.sm }}>
                <Pressable 
                  style={[styles.modalOptionCard, { marginBottom: 8 }]}
                  onPress={() => {
                    setShowFolderActionMenu(false);
                    setRenameFolderName(actionMenuFolder?.name || '');
                    setShowRenameFolderModal(true);
                  }}
                >
                  <Ionicons name="pencil-outline" size={24} color={theme.colors.secondaryText} style={{ marginRight: 12 }} />
                  <Text style={styles.modalOptionText}>Rename</Text>
                </Pressable>
                
                <Pressable 
                  style={[styles.modalOptionCard, { marginBottom: 8 }]}
                  onPress={() => {
                    setShowFolderActionMenu(false);
                    setShowMoveFolderMenu2(true);
                  }}
                >
                  <Ionicons name="folder-outline" size={24} color={theme.colors.secondaryText} style={{ marginRight: 12 }} />
                  <Text style={styles.modalOptionText}>Move to Folder</Text>
                </Pressable>

                <Pressable 
                  style={styles.modalOptionCard}
                  onPress={() => {
                    setShowFolderActionMenu(false);
                    removeFolder(actionMenuFolder?.id);
                  }}
                >
                  <Ionicons name="trash-outline" size={24} color={theme.colors.secondaryText} style={{ marginRight: 12 }} />
                  <Text style={styles.modalOptionText}>Delete</Text>
                </Pressable>
              </View>
              
              <Button 
                title="Cancel" 
                variant="secondary"
                onPress={() => setShowFolderActionMenu(false)} 
                style={{ width: '100%', marginTop: theme.spacing.xl }}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Move to Folder Selection Modal */}
      <Modal visible={showMoveFolderMenu} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => setShowMoveFolderMenu(false)}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.pinCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <Text style={styles.levelTitle}>Select a Folder</Text>
              
              <ScrollView style={{ width: '100%', maxHeight: 300, marginTop: theme.spacing.md }}>
                {folders.filter(f => f.tab === activeTab).length === 0 && (
                  <Text style={{ textAlign: 'center', color: theme.colors.secondaryText, marginBottom: theme.spacing.md, fontStyle: 'italic' }}>
                    No folders created yet.
                  </Text>
                )}
                {folders.filter(f => f.tab === activeTab).map(folder => (
                  <Pressable 
                    key={folder.id} 
                    style={[styles.modalOptionCard, { marginBottom: 8 }]}
                    onPress={() => {
                      moveQuizToFolder(actionMenuCategory.id, folder.id);
                      showToast({ message: 'Moved to folder' });
                      setShowMoveFolderMenu(false);
                    }}
                  >
                    <Ionicons name="folder-outline" size={24} color={theme.colors.secondaryText} style={{ marginRight: 12 }} />
                    <Text style={styles.modalOptionText}>{folder.name}</Text>
                  </Pressable>
                ))}
                
                <Pressable 
                  style={[styles.modalOptionCard, { marginBottom: 8, justifyContent: 'center' }]}
                  onPress={() => {
                    setShowMoveFolderMenu(false);
                    setShowFolderModal(true);
                    setPendingDragQuizId(actionMenuCategory?.id);
                  }}
                >
                  <Ionicons name="add-circle-outline" size={24} color={theme.colors.secondaryText} style={{ marginRight: 8 }} />
                  <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>Create New Folder</Text>
                </Pressable>
              </ScrollView>
              
              <Button 
                title="Cancel" 
                variant="secondary"
                onPress={() => setShowMoveFolderMenu(false)} 
                style={{ width: '100%', marginTop: theme.spacing.md }}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Move Folder to Folder Selection Modal */}
      <Modal visible={showMoveFolderMenu2} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => setShowMoveFolderMenu2(false)}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.pinCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <Text style={styles.levelTitle}>Move Folder To...</Text>
              
              <ScrollView style={{ width: '100%', maxHeight: 300, marginTop: theme.spacing.md }}>
                {folders.filter(f => f.tab === activeTab && f.id !== actionMenuFolder?.id && !f.parentId).length === 0 && (
                  <Text style={{ textAlign: 'center', color: theme.colors.secondaryText, marginBottom: theme.spacing.md, fontStyle: 'italic' }}>
                    No other folders available.
                  </Text>
                )}
                {/* Option to move back to Root Level */}
                {actionMenuFolder?.parentId && (
                  <Pressable 
                    style={[styles.modalOptionCard, { marginBottom: 8 }]}
                    onPress={() => {
                      moveFolderToFolder(actionMenuFolder.id, undefined);
                      showToast({ message: 'Moved to main library' });
                      setShowMoveFolderMenu2(false);
                    }}
                  >
                    <Ionicons name="home-outline" size={24} color={theme.colors.secondaryText} style={{ marginRight: 12 }} />
                    <Text style={styles.modalOptionText}>Main Library (Root)</Text>
                  </Pressable>
                )}
                
                {folders.filter(f => f.tab === activeTab && f.id !== actionMenuFolder?.id && !f.parentId).map(folder => (
                  <Pressable 
                    key={folder.id} 
                    style={[styles.modalOptionCard, { marginBottom: 8 }]}
                    onPress={() => {
                      moveFolderToFolder(actionMenuFolder.id, folder.id);
                      showToast({ message: 'Moved to folder' });
                      setShowMoveFolderMenu2(false);
                    }}
                  >
                    <Ionicons name="folder-outline" size={24} color={theme.colors.secondaryText} style={{ marginRight: 12 }} />
                    <Text style={styles.modalOptionText}>{folder.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              
              <Button 
                title="Cancel" 
                variant="secondary"
                onPress={() => setShowMoveFolderMenu2(false)} 
                style={{ width: '100%', marginTop: theme.spacing.md }}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={showDeletePin} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => {
          setShowDeletePin(false);
          setDeletePin('');
          setQuizToDelete(null);
        }}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.pinCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <Animated.View style={[styles.pinContainer, { transform: [{ translateX: shakeAnim }] }]}>
                <Text style={styles.pinTitle}>Enter Parent PIN to Delete</Text>
                <TextInput
                  style={styles.pinInput}
                  value={deletePin}
                  onChangeText={handleDeletePinChange}
                  keyboardType="number-pad"
                  maxLength={4}
                  autoFocus
                  placeholder="****"
                  autoComplete="off"
                  autoCorrect={false}
                  importantForAutofill="no"
                  textContentType="oneTimeCode"
                />
              </Animated.View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Rename Quiz Modal */}
      <Modal visible={showRenameModal} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => {
          setShowRenameModal(false);
        }}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.pinCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <Text style={styles.pinTitle}>Rename Quiz</Text>
              <TextInput
                style={[styles.editInput, { marginBottom: theme.spacing.lg }]}
                value={renameTitle}
                onChangeText={setRenameTitle}
                placeholder="Quiz Name"
                maxLength={40}
              />
              <Button
                title="Save"
                onPress={handleSaveRename}
                style={{ width: '100%', marginBottom: theme.spacing.md }}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* New Folder Modal */}
      <Modal
        visible={showFolderModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Folder</Text>
            <TextInput
              style={styles.input}
              value={newFolderName}
              onChangeText={setNewFolderName}
              placeholder="Folder Name"
              autoFocus
            />
            <Button
              title="Create"
              onPress={handleCreateFolder}
              style={{ width: '100%', marginTop: theme.spacing.md }}
            />
            <Pressable style={styles.linkButton} onPress={() => { 
              setShowFolderModal(false); 
              setPendingDragQuizId(null); 
              if (generatedQuizzes) setShowFolderSelection(true); 
            }}>
              <Text style={styles.linkButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Rename Folder Modal */}
      <Modal visible={showRenameFolderModal} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => setShowRenameFolderModal(false)}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.pinCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <Text style={styles.pinTitle}>Rename Folder</Text>
              
              <TextInput
                style={[styles.input, { width: '100%', marginBottom: theme.spacing.lg }]}
                value={renameFolderName}
                onChangeText={setRenameFolderName}
                placeholder="Folder Name"
                maxLength={40}
              />
              <Button
                title="Save"
                onPress={handleSaveFolderRename}
                style={{ width: '100%', marginBottom: theme.spacing.md }}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  // Start styles moved to HomeScreen
  scrollContent: {
    paddingBottom: 140,
  },
  quickStartButton: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  bentoItem: {
    width: '100%',
  },
  emptyAiContainer: {
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
  },
  emptyAiText: {
    ...theme.typography.subheading,
    textAlign: 'center',
    color: theme.colors.text,
  },
  emptyAiSub: {
    ...theme.typography.body,
    textAlign: 'center',
    color: theme.colors.secondaryText,
    marginTop: theme.spacing.sm,
  },
  pinSubtitle: {
    ...theme.typography.body,
    fontStyle: 'italic',
    fontSize: 17,
    textAlign: 'center',
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.lg,
  },
  inProgressContainer: {
    flex: 1,
  },
  completedContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xl,
  },
  completedCard: {
    width: '100%',
    maxWidth: 500,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
  },
  completedTitle: {
    ...theme.typography.heading,
    fontSize: 24,
    textAlign: 'center',
    color: theme.colors.text,
    marginBottom: 0,
  },
  completedCoinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  completedCoinText: {
    ...theme.typography.body,
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: 0.5,
    textAlign: 'center',
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  completedButton: {
    marginTop: theme.spacing.md,
    width: '100%',
  },
  scoreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xxl, // Doubled from original theme.spacing.lg
  },
  scoreText: {
    ...theme.typography.heading,
    color: theme.colors.primary,
    fontSize: 48,
  },
  messageText: {
    ...theme.typography.heading,
    fontSize: 22,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.3,
  },
  coinsEarnedText: {
    ...theme.typography.heading,
    color: theme.colors.accent,
    fontSize: 24,
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    width: '100%',
    marginBottom: theme.spacing.sm,
  },
  createAiButton: {
    width: '100%',
  },
  createAiButtonContainer: {
    width: '100%',
    marginTop: 24,
    paddingHorizontal: theme.spacing.xl,
  },
  primaryButton: {
    // Gradient logic goes here if implemented, for now solid is fine per v2 design system
  },
  questionCaption: {
    ...theme.typography.body,
    fontFamily: FONTS.regular,
    fontWeight: '400',
    letterSpacing: 0.5,
    textAlign: 'center',
    color: theme.colors.secondaryText,
    marginTop: 4,
    marginBottom: 8,
  },

  coinJarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
  },
  screenFolderTab: {
    position: 'absolute',
    top: -65, // Increased space
    right: 0,
    minWidth: 120, // Prevent wrapping
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: theme.spacing.xs,
    borderWidth: 0,
    zIndex: -1, // Drop it behind the coin jar if needed, or 0
    borderRadius: 0,
  },
  screenFolderTabText: {
    ...theme.typography.body,
    fontFamily: FONTS.regular,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.1,
    color: theme.colors.text,
  },
  coinJarText: {
    ...theme.typography.body,
    fontWeight: '700',
    color: theme.colors.text, // Text in coin jar is dark in the design
    marginLeft: 4,
  },
  backButton: {
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  pinCard: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
    borderRadius: 0,
    overflow: 'hidden',
    zIndex: 1000,
    backgroundColor: theme.colors.white,
  },
  pinContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  pinTitle: {
    ...theme.typography.body,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    color: theme.colors.text,
  },
  pinInput: {
    width: 120,
    height: 60,
    borderWidth: 2,
    borderColor: theme.colors.stroke,
    borderRadius: theme.borderRadius.sm,
    textAlign: 'center',
    ...theme.typography.heading,
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  levelCard: {
    width: '100%',
    maxWidth: 500,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.white,
  },
  levelTitle: {
    ...theme.typography.subheading,
    marginBottom: theme.spacing.md,
  },
  photoIconContainer: {
    marginBottom: theme.spacing.md,
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.stroke,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.md,
    ...theme.shadows.soft,
  },
  uploadButton: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  supportedText: {
    ...theme.typography.caption,
    marginTop: theme.spacing.xs,
    color: theme.colors.secondaryText,
    textAlign: 'center',
  },
  uploadCard: {
    width: '100%',
    maxWidth: 500,
    padding: theme.spacing.xl,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.neutralGrey,
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.md,
  },
  levelQuestionCount: {
    ...theme.typography.button,
    fontSize: 14,
    color: theme.colors.text,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing.xs,
    ...theme.shadows.soft,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
    opacity: 0.8,
  },
  tabText: {
    ...theme.typography.button,
    color: theme.colors.secondaryText,
  },
  activeTabText: {
    color: theme.colors.text,
  },
  levelChipsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 8,
    gap: 8,
  },
  levelChip: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    ...theme.shadows.soft,
  },
  levelChipSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#F7FEE7', // Super light brand green
  },
  levelChipText: {
    ...theme.typography.button,
    color: theme.colors.secondaryText,
    fontSize: 14,
  },
  levelChipTextSelected: {
    color: theme.colors.text,
  },
  toastWrapper: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10000,
  },
  receivedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.soft,
  },
  receivedText: {
    ...theme.typography.button,
    fontSize: 14,
    color: theme.colors.text,
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 10,
    padding: theme.spacing.xs,
  },
  linkButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkButtonText: {
    ...theme.typography.button,
    color: theme.colors.secondaryText,
  },
  titleContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
  },
  brushUnderline: {
    position: 'absolute',
    bottom: -4,
    left: '2%',
    right: '2%',
    height: 5.5,
    backgroundColor: '#BEF264',
    borderRadius: 4,
    transform: [{ rotate: '-1.5deg' }],
    zIndex: -1,
  },
  editInput: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
  },
  photoOutlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    borderColor: theme.colors.neutralGrey,
    borderStyle: 'dashed',
    width: '100%',
  },
  photoOutlineText: {
    ...theme.typography.button,
    color: theme.colors.text,
  },
  modalTitle: {
    ...theme.typography.heading,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  inputLabel: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    alignSelf: 'flex-start',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  modalButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    ...theme.typography.button,
    color: theme.colors.secondaryText,
  },
  deleteButton: {
    backgroundColor: theme.colors.primary,
  },
  deleteButtonText: {
    ...theme.typography.button,
    color: theme.colors.white,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
    width: '100%',
    backgroundColor: theme.colors.white,
  },
  modalContent: {
    width: '100%',
    backgroundColor: theme.colors.white,
    borderRadius: 0,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.soft,
  },
  addFolderCard: {
    width: '100%',
    height: 140,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0,
    borderColor: theme.colors.stroke,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.soft,
  },
  addFolderIconContainer: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: '#F7FEE7',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  addFolderText: {
    ...theme.typography.button,
    textAlign: 'center',
    color: theme.colors.secondaryText,
  },
  modalOptionCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
  },
  modalOptionText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  modalInput: {
    width: '100%',
    padding: theme.spacing.md,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    ...theme.typography.body,
    color: theme.colors.text,
  },
});
