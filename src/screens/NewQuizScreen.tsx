import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Pressable, Alert, TextInput, Modal, ActivityIndicator, Platform, UIManager } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { generateQuizFromImage } from '../utils/aiQuizGenerator';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';
import { QuizCard } from '../components/QuizCard';
import { ProgressBar } from '../components/ProgressBar';
import { QuestionView } from '../components/QuestionView';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme, FONTS } from '../theme';
import { QUIZ_CATEGORIES, Category, Question, QuizCategory } from '../data/types';
import { questions as allQuestions } from '../data/questions';
import { useRewards } from '../context/RewardsContext';
import { useProgress } from '../context/ProgressContext';
import { useQuizContext } from '../context/QuizContext';
import { useFeedback } from '../context/FeedbackContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { QuickStartButton } from '../components/QuickStartButton';
import { SimpleLockScreen } from '../components/SimpleLockScreen';
import { AnimatedCubesBackground } from '../components/AnimatedCubesBackground';
import { SilverDust } from '../components/SilverDust';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type QuizState = 'selection' | 'in-progress' | 'completed';
type QuizLevel = {
  label: string;
  difficulty: string;
  questionCount: number;
};

const QUIZ_LEVELS: QuizLevel[] = [
  { label: 'Easy', difficulty: 'Easy', questionCount: 5 },
  { label: 'Medium', difficulty: 'Medium', questionCount: 10 },
  { label: 'Advanced', difficulty: 'Challenge', questionCount: 20 },
];

export const NewQuizScreen = () => {
  const { addCoins, coinBalance } = useRewards();
  const { quizzesTakenToday, dailyLimit, recordQuizCompletion, childName } = useProgress();
  const { customCategories, customQuestions, removeCustomQuiz, addCustomQuiz, renameCustomQuiz } = useQuizContext();
  const allCategories = useMemo(() => [...QUIZ_CATEGORIES, ...customCategories], [customCategories]);
  const { showModal, showToast } = useFeedback();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [quizState, setQuizState] = useState<QuizState>('selection');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'ai'>('general');

  const [showDeletePin, setShowDeletePin] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [deletePin, setDeletePin] = useState('');
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
  
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState('Understanding the concept...');

  useEffect(() => {
    if (aiGenerating) {
      const texts = [
        'Understanding the concept...',
        'Creating original questions...',
        'Building your quiz...'
      ];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setLoadingText(texts[i]);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [aiGenerating]);

  const handleGenerate = async (base64Data: string) => {
    setLoadingText('Understanding the concept...');
    setAiGenerating(true);
    try {
      const dataUri = `data:image/jpeg;base64,${base64Data}`;
      const quiz = await generateQuizFromImage(dataUri);
      
      const newCategoryId = `custom_ai_${Date.now()}`;
      const newCategory = {
        id: newCategoryId,
        title: quiz.concept,
        description: 'AI Generated Quiz',
        icon: 'sparkles',
        color: '#A78BFA',
        isCustom: true
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
      
      addCustomQuiz(newCategory, questionsWithCategory);
      setAiGenerating(false);
      showToast({ message: 'AI Quiz generated and added to your library!' });
    } catch (error: any) {
      setAiGenerating(false);
      showModal({ title: 'Error', message: error.message || 'Failed to generate quiz.', type: 'error' });
    }
  };

  const pickImage = async () => {
    setShowAiMenu(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showModal({ title: 'Permission Denied', message: 'Sorry, we need camera roll permissions to make this work!', type: 'error' });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]?.base64) {
      handleGenerate(result.assets[0].base64);
    }
  };

  const takePhoto = async () => {
    setShowAiMenu(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showModal({ title: 'Permission Denied', message: 'Sorry, we need camera permissions to make this work!', type: 'error' });
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]?.base64) {
      handleGenerate(result.assets[0].base64);
    }
  };

  const handleDeletePinChange = (text: string) => {
    const newPin = text.replace(/[^0-9]/g, '');
    setDeletePin(newPin);

    if (newPin.length === 4) {
      if (newPin === '1111') {
        if (quizToDelete) {
          removeCustomQuiz(quizToDelete);
          showToast({ message: 'Quiz deleted' });
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
      // Clear param so it doesn't get stuck
      navigation.setParams({ tab: undefined });
    }
  }, [route.params?.tab]);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleStartQuickQuiz = () => {
    const shuffled = shuffleArray(allQuestions);
    const selected = shuffled.slice(0, 5);
    
    setSelectedCategory(null);
    setCurrentQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setIsProcessing(false);
    setQuizState('in-progress');
  };

  const handleStartQuiz = (category: Category, questionCount: number) => {
    let categoryQuestions = allQuestions.filter((q: any) => q.category === category);
    if (categoryQuestions.length === 0) {
      categoryQuestions = customQuestions.filter((q: any) => q.category === category);
    }
    const selected = buildQuestionSet(categoryQuestions, questionCount);

    setSelectedCategory(category);
    setCurrentQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setIsProcessing(false);
    setQuizState('in-progress');
  };

  const handleSelectQuizCategory = (category: Category) => {
    handleStartQuiz(category, 5);
  };

  const handleContinue = async (isCorrect: boolean) => {
    if (isProcessing) return;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

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
  };

  // (renderStart moved to HomeScreen)

  const renderSelection = () => {
    // Temporarily disable daily limit for testing
    // if (quizzesTakenToday >= dailyLimit) {
    //   return <SimpleLockScreen />;
    // }

    const displayCategories = activeTab === 'general' ? QUIZ_CATEGORIES : customCategories;

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Header title="Select a Quiz" style={{ marginBottom: theme.spacing.sm, marginTop: 4 }} />
        
        <View style={styles.tabContainer}>
          <Pressable 
            style={[styles.tab, activeTab === 'general' && styles.activeTab]} 
            onPress={() => setActiveTab('general')}
          >
            <Text style={[styles.tabText, activeTab === 'general' && styles.activeTabText]}>General Quizes</Text>
          </Pressable>
          <Pressable 
            style={[styles.tab, activeTab === 'ai' && styles.activeTab]} 
            onPress={() => setActiveTab('ai')}
          >
            <Text style={[styles.tabText, activeTab === 'ai' && styles.activeTabText]}>Custom</Text>
          </Pressable>
        </View>

        {displayCategories.length === 0 ? (
          <View style={styles.emptyAiContainer}>
            <Text style={styles.emptyAiText}>No AI quizes yet.</Text>
            <Text style={styles.emptyAiSub}>Create your first one from a photo or concept!</Text>
            <View style={styles.createAiButtonContainer}>
              <Button
                title="Create AI Quiz"
                style={styles.createAiButton}
                onPress={() => setShowAiMenu(true)}
              />
            </View>
          </View>
        ) : (
          <>
            <View style={styles.bentoGrid}>
              {displayCategories.map((category: any) => {
                return (
                  <View 
                    key={category.id} 
                    style={styles.bentoItem}
                  >
                    <QuizCard 
                      category={category} 
                      isFeatured={false}
                      onPressStart={() => handleSelectQuizCategory(category.id)} 
                      onRename={() => handleOpenRename(category)}
                      onDelete={category.isCustom ? () => {
                        setQuizToDelete(category.id);
                        setShowDeletePin(true);
                      } : undefined}
                    />
                  </View>
                );
              })}
            </View>
            {activeTab === 'ai' && (
              <View style={styles.createAiButtonContainer}>
                <Button
                  title="Add New Quiz"
                  style={styles.createAiButton}
                  onPress={() => setShowAiMenu(true)}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
    );
  };

  const renderCoinJar = () => {
    const categoryName = allCategories.find((c: any) => c.id === selectedCategory)?.title || selectedCategory;
    return (
      <View style={styles.coinJarContainer}>
        <FontAwesome5 
          name="coins" 
          size={20} 
          color={theme.colors.primary} 
          style={{
            textShadowColor: '#9CA3AF',
            textShadowOffset: { width: -0.5, height: 0.5 },
            textShadowRadius: 1
          }}
        />
        <Text style={styles.coinJarText}>{coinBalance}</Text>
      </View>
    );
  };

  const renderInProgress = () => {
    if (currentQuestions.length === 0) return null;
    const currentQuestion = currentQuestions[currentIndex];

    const categoryName = allCategories.find((c: any) => c.id === selectedCategory)?.title || selectedCategory;

    return (
      <View style={styles.inProgressContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, zIndex: 2, paddingHorizontal: 16 }}>
            <Pressable style={styles.backButton} onPress={handleBackToHome}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
              <Text style={{ marginLeft: 4, ...theme.typography.button, color: theme.colors.text }}>Back</Text>
            </Pressable>
            <View style={[styles.screenFolderTab, { position: 'relative', top: 0, right: 0, left: 'auto' }]}>
              <Text style={styles.screenFolderTabText} numberOfLines={1}>Topic: {categoryName}</Text>
            </View>
          </View>
          
          <Text style={[styles.questionCaption, { marginTop: 8, marginBottom: 8 }]}>Question {currentIndex + 1} of {currentQuestions.length}</Text>
          <ProgressBar 
            current={currentIndex + 1} 
            total={currentQuestions.length} 
          />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, marginTop: -16, marginBottom: 8 }}>
            {renderCoinJar()}
          </View>
          <QuestionView 
            key={currentQuestion.id}
            question={currentQuestion} 
            onContinue={handleContinue} 
            disabled={isProcessing}
            topicName={selectedCategory || undefined}
          />
        </ScrollView>
      </View>
    );
  };

  const renderCompleted = () => {
    const categoryName = allCategories.find((c: any) => c.id === selectedCategory)?.title || '';
    const total = currentQuestions.length;
    
    let message = "Good effort!";
    if (score === total) message = "Awesome!";
    else if (score >= total * 0.7) message = "Great job, Social Explorer!";
    else if (score >= total * 0.5) message = "You're learning fast!";

    let coinsEarned = total;

    const handleRedeemNow = () => {
      handleBackToHome();
      navigation.navigate('MyRewards');
    };

    return (
      <Pressable style={styles.completedContainer} onPress={handleBackToHome}>
        <SilverDust />
        <Pressable style={styles.completedCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
          <Animated.View style={{ opacity: completionFadeAnim, transform: [{ translateY: completionSlideAnim }], alignItems: 'center', width: '100%' }}>
            <View style={styles.titleContainer}>
              <Text style={styles.completedTitle}>{message}</Text>
              {message === "Awesome!" && <View style={styles.brushUnderline} />}
            </View>

            <View style={styles.completedCoinRow}>
              <FontAwesome5 
                name="coins" 
                size={24} 
                color={theme.colors.primary} 
                style={{
                  textShadowColor: '#9CA3AF',
                  textShadowOffset: { width: -0.5, height: 0.5 },
                  textShadowRadius: 1
                }}
              />
              <Text style={styles.completedCoinText}>+{coinsEarned} Coins Earned!</Text>
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
      <AnimatedCubesBackground />
      <ScreenWrapper transparent>
        <View style={styles.content}>
          {quizState === 'selection' && renderSelection()}
          {quizState === 'in-progress' && renderInProgress()}
          {quizState === 'completed' && renderCompleted()}
        </View>
      </ScreenWrapper>

      {/* AI Quiz creation menu modal */}
      <Modal visible={showAiMenu} transparent animationType="fade">
        <Pressable style={{ flex: 1 }} onPress={() => setShowAiMenu(false)}>
          <View style={[styles.modalOverlay, { padding: 0 }]}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
              <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl, minHeight: '100%' }} onPress={() => setShowAiMenu(false)}>
                <Pressable style={styles.uploadCard} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <Text style={styles.levelTitle}>Create AI Quiz</Text>
              <Text style={[styles.questionCaption, { marginBottom: theme.spacing.lg, paddingHorizontal: 16 }]}>
                Upload a page or take a photo, and AI will create original quiz questions based on the concept.
              </Text>
              
              <View style={styles.iconContainer}>
                <Ionicons name="camera-outline" size={64} color={theme.colors.primary} />
              </View>
              
              <Button 
                title="Take Photo" 
                onPress={takePhoto} 
                style={styles.uploadButton}
              />
              
              <Button 
                title="Upload from Gallery" 
                onPress={pickImage} 
                variant="secondary"
                style={styles.uploadButton}
              />
              <Text style={styles.supportedText}>Supported: JPG, PNG, HEIC</Text>
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
            <Ionicons name="sparkles-outline" size={64} color={theme.colors.primary} />
            <Text style={[styles.levelTitle, { marginTop: 16, marginBottom: 8 }]}>Generating Quiz...</Text>
            <Text style={[styles.questionCaption, { marginBottom: 24 }]}>{loadingText}</Text>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </Card>
        </View>
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

    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  // Start styles moved to HomeScreen
  scrollContent: {
    paddingBottom: theme.spacing.xl,
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
    width: '47%',
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    zIndex: 10,
  },
  completedCard: {
    width: '100%',
    maxWidth: 500,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    padding: theme.spacing.xl,
    paddingTop: 48,
  },
  completedTitle: {
    ...theme.typography.heading,
    fontSize: 24,
    textAlign: 'center',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  completedCoinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  completedCoinText: {
    ...theme.typography.subheading,
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
    marginBottom: 48, // Doubled from original theme.spacing.lg
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
    marginTop: theme.spacing.lg,
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
    paddingVertical: 6,
    borderWidth: 0,
    zIndex: -1, // Drop it behind the coin jar if needed, or 0
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
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.soft,
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
    paddingTop: 48,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    zIndex: 1000,
    backgroundColor: theme.colors.white,
  },
  pinContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 16,
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
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    bottom: -2,
    left: '2%',
    right: '2%',
    height: 8,
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
});
