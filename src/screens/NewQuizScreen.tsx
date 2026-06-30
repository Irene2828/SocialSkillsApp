import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Pressable } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';
import { QuizCard } from '../components/QuizCard';
import { ProgressBar } from '../components/ProgressBar';
import { QuestionView } from '../components/QuestionView';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../theme';
import { QUIZ_CATEGORIES, Category, Question } from '../data/types';
import { questions as allQuestions } from '../data/questions';
import { useRewards } from '../context/RewardsContext';
import { useProgress } from '../context/ProgressContext';
import { useQuizContext } from '../context/QuizContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

import { QuickStartButton } from '../components/QuickStartButton';
import { SimpleLockScreen } from '../components/SimpleLockScreen';
import { AnimatedCubesBackground } from '../components/AnimatedCubesBackground';
import { SilverDust } from '../components/SilverDust';

type QuizState = 'start' | 'selection' | 'in-progress' | 'completed';

export const NewQuizScreen = () => {
  const { addCoins, coinBalance } = useRewards();
  const { quizzesTakenToday, dailyLimit, recordQuizCompletion, childName } = useProgress();
  const { customCategories, customQuestions } = useQuizContext();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const allCategories = [...QUIZ_CATEGORIES, ...customCategories];

  const [quizState, setQuizState] = useState<QuizState>('start');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'ai'>('general');

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

  const handleStartQuiz = (category: Category) => {
    let categoryQuestions = allQuestions.filter(q => q.category === category);
    if (categoryQuestions.length === 0) {
      categoryQuestions = customQuestions.filter(q => q.category === category);
    }
    const shuffled = shuffleArray(categoryQuestions);
    const selected = shuffled.slice(0, 5);

    setSelectedCategory(category);
    setCurrentQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setIsProcessing(false);
    setQuizState('in-progress');
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
      let coinsEarned = 5;
      
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

  const renderStart = () => {
    return (
      <View style={styles.startContainer}>
        <View style={styles.startContent}>
          <Text 
            style={styles.startTitle}
            adjustsFontSizeToFit
            numberOfLines={2}
          >
            Social Explorer
          </Text>
          <Text style={styles.startSubtitle}>Ready to practice?</Text>
        </View>
        <Button 
          title="Start Quiz" 
          onPress={() => setQuizState('selection')} 
          style={styles.actionButton}
        />
      </View>
    );
  };

  const renderSelection = () => {
    // Temporarily disable daily limit for testing
    // if (quizzesTakenToday >= dailyLimit) {
    //   return <SimpleLockScreen />;
    // }

    const displayCategories = activeTab === 'general' ? QUIZ_CATEGORIES : customCategories;

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Header title="Choose a Topic" />
        
        <View style={styles.tabContainer}>
          <Pressable 
            style={[styles.tab, activeTab === 'general' && styles.activeTab]} 
            onPress={() => setActiveTab('general')}
          >
            <Text style={[styles.tabText, activeTab === 'general' && styles.activeTabText]}>General</Text>
          </Pressable>
          <Pressable 
            style={[styles.tab, activeTab === 'ai' && styles.activeTab]} 
            onPress={() => setActiveTab('ai')}
          >
            <Text style={[styles.tabText, activeTab === 'ai' && styles.activeTabText]}>Generated with AI</Text>
          </Pressable>
        </View>

        {displayCategories.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40, color: theme.colors.secondaryText }}>
            No AI quizzes yet. Go to the Create Quiz tab!
          </Text>
        ) : (
          <View style={styles.bentoGrid}>
            {displayCategories.map(category => (
              <View key={category.id} style={styles.bentoItem}>
                <QuizCard 
                  category={category} 
                  onPressStart={() => handleStartQuiz(category.id)} 
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  const renderCoinJar = () => {
    const categoryName = allCategories.find(c => c.id === selectedCategory)?.title || selectedCategory;
    return (
    <View style={{ position: 'relative' }}>
      <View style={styles.screenFolderTab}>
        <Text style={styles.screenFolderTabText} numberOfLines={1}>Topic: {categoryName}</Text>
      </View>
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
    </View>
    );
  };

  const renderInProgress = () => {
    if (currentQuestions.length === 0) return null;
    const currentQuestion = currentQuestions[currentIndex];

    return (
      <View style={styles.inProgressContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Header 
            style={{ marginTop: 24 }} // Make room for the tag above it
            title={`Question ${currentIndex + 1} of ${currentQuestions.length}`} 
            leftElement={
              <Pressable style={styles.backButton} onPress={handleBackToHome}>
                <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
              </Pressable>
            }
            rightElement={renderCoinJar()}
          />
          <ProgressBar 
            current={currentIndex + 1} 
            total={currentQuestions.length} 
          />
          <QuestionView 
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
    const categoryName = allCategories.find(c => c.id === selectedCategory)?.title || '';
    const total = currentQuestions.length;
    
    let message = "Good effort!";
    if (score === total) message = "Awesome!";
    else if (score >= total * 0.7) message = "Great job, Social Explorer!";
    else if (score >= total * 0.5) message = "You're learning fast!";

    let coinsEarned = 5;

    return (
      <View style={styles.completedContainer}>
        <SilverDust />
        <Card style={styles.completedCard}>
          <Animated.View style={{ opacity: completionFadeAnim, transform: [{ translateY: completionSlideAnim }], alignItems: 'center', width: '100%' }}>
            
            <Text style={[styles.messageText, { marginBottom: 48 }]}>{message}</Text>

            <Text style={{ ...theme.typography.heading, fontSize: 16, color: theme.colors.text, marginBottom: 12 }}>
              + {coinsEarned} points earned for this quiz!
            </Text>

            <View style={{ ...styles.coinJarContainer, backgroundColor: theme.colors.errorSoft, borderWidth: 0, marginBottom: 48, paddingHorizontal: 16, paddingVertical: 8 }}>
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
              <Text style={{ ...styles.coinJarText, fontSize: 18 }}>{coinBalance}</Text>
            </View>
          </Animated.View>

          <Button 
            title="Take Another Quiz" 
            onPress={handleBackToHome} 
            style={[styles.actionButton, styles.primaryButton]}
          />
          <Button 
            title="Redeem Points" 
            onPress={() => {
              handleBackToHome();
              navigation.navigate('MyRewards');
            }} 
            variant="secondary"
            style={[styles.actionButton, { borderWidth: 0 }]}
          />
        </Card>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <AnimatedCubesBackground />
      <ScreenWrapper transparent>
        <View style={styles.content}>
          {quizState === 'start' && renderStart()}
          {quizState === 'selection' && renderSelection()}
          {quizState === 'in-progress' && renderInProgress()}
          {quizState === 'completed' && renderCompleted()}
        </View>
      </ScreenWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  startContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  startTitle: {
    ...theme.typography.heading,
    fontSize: 42,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  startSubtitle: {
    ...theme.typography.body,
    fontSize: 18,
    color: theme.colors.secondaryText,
  },
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
    marginHorizontal: -theme.spacing.xs,
  },
  bentoItem: {
    width: '50%',
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
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    zIndex: 10,
  },
  completedCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  completedTitle: {
    ...theme.typography.heading,
    fontSize: 28,
    marginBottom: theme.spacing.sm,
  },
  categoryText: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.xl,
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
  primaryButton: {
    // Gradient logic goes here if implemented, for now solid is fine per v2 design system
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
    paddingTop: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    borderBottomWidth: 0,
    zIndex: -1, // Drop it behind the coin jar if needed, or 0
  },
  screenFolderTabText: {
    ...theme.typography.body,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  coinJarText: {
    ...theme.typography.body,
    fontWeight: '700',
    color: theme.colors.text, // Text in coin jar is dark in the design
    marginLeft: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.soft,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.full,
    padding: 4,
    ...theme.shadows.soft,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
  },
  activeTab: {
    backgroundColor: '#F3F4F6', // Matches footer color
  },
  tabText: {
    ...theme.typography.button,
    color: theme.colors.secondaryText,
  },
  activeTabText: {
    color: theme.colors.text,
  }
});
