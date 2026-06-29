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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { QuickStartButton } from '../components/QuickStartButton';
import { SimpleLockScreen } from '../components/SimpleLockScreen';

type QuizState = 'start' | 'selection' | 'in-progress' | 'completed';

export const NewQuizScreen = () => {
  const { addCoins, coinBalance } = useRewards();
  const { quizzesTakenToday, dailyLimit, recordQuizCompletion, childName } = useProgress();
  const navigation = useNavigation<any>();

  const [quizState, setQuizState] = useState<QuizState>('start');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
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
    const selected = shuffled.slice(0, 10);
    
    setSelectedCategory(null);
    setCurrentQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setIsProcessing(false);
    setQuizState('in-progress');
  };

  const handleStartQuiz = (category: Category) => {
    const categoryQuestions = allQuestions.filter(q => q.category === category);
    const shuffled = shuffleArray(categoryQuestions);
    const selected = shuffled.slice(0, 10);

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
      let coinsEarned = 0;
      if (finalScore >= 8) coinsEarned = 1;
      else if (finalScore >= 6) coinsEarned = 0.5;
      
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
            numberOfLines={1}
          >
            Social Quest
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
    if (quizzesTakenToday >= dailyLimit) {
      return <SimpleLockScreen />;
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Header title="Choose a Topic" />
        <View style={styles.bentoGrid}>
          {QUIZ_CATEGORIES.map(category => (
            <View key={category.id} style={styles.bentoItem}>
              <QuizCard 
                category={category} 
                onPressStart={() => handleStartQuiz(category.id)} 
              />
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderCoinJar = () => (
    <View style={styles.coinJarContainer}>
      <Text style={{ fontSize: 18 }}>🪙</Text>
      <Text style={styles.coinJarText}>{coinBalance}</Text>
    </View>
  );

  const renderInProgress = () => {
    if (currentQuestions.length === 0) return null;
    const currentQuestion = currentQuestions[currentIndex];

    return (
      <View style={styles.inProgressContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Header 
            title={`Question ${currentIndex + 1} of ${currentQuestions.length}`} 
            leftElement={
              <Pressable style={styles.backButton} onPress={handleBackToHome}>
                <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
              </Pressable>
            }
            rightElement={renderCoinJar()}
          />
          <ProgressBar 
            current={currentIndex + 1} 
            total={currentQuestions.length} 
          />
          <View style={styles.topicPillContainer}>
            <View style={styles.topicPill}>
              <Ionicons name="heart" size={16} color={theme.colors.primary} />
              <Text style={styles.topicPillText}>Topic: {selectedCategory}</Text>
            </View>
          </View>
          <QuestionView 
            question={currentQuestion} 
            onContinue={handleContinue} 
            disabled={isProcessing}
          />
        </ScrollView>
      </View>
    );
  };

  const renderCompleted = () => {
    const categoryName = QUIZ_CATEGORIES.find(c => c.id === selectedCategory)?.title || '';
    const total = currentQuestions.length;
    
    let message = "Good effort!";
    if (score === total) message = "Perfect! You're a Social Master!";
    else if (score >= total * 0.7) message = "Great job, Social Explorer!";
    else if (score >= total * 0.5) message = "You're learning fast!";

    let coinsEarned = 0;
    if (score >= 8) coinsEarned = 1;
    else if (score >= 6) coinsEarned = 0.5;

    return (
      <View style={styles.completedContainer}>
        <Card style={styles.completedCard}>
          <Animated.View style={{ opacity: completionFadeAnim, transform: [{ translateY: completionSlideAnim }], alignItems: 'center', width: '100%' }}>
            {coinsEarned > 0 && (
              <Text style={styles.coinsEarnedText}>+{coinsEarned} Coins!</Text>
            )}

            <Text style={styles.messageText}>{message}</Text>
            
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>{total} / {total}</Text>
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
    <ScreenWrapper>
      <View style={styles.content}>
        {quizState === 'start' && renderStart()}
        {quizState === 'selection' && renderSelection()}
        {(quizState === 'in-progress' || quizState === 'completed') && renderInProgress()}
        {quizState === 'completed' && renderCompleted()}
      </View>
    </ScreenWrapper>
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
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  startSubtitle: {
    ...theme.typography.body,
    fontSize: 18,
    color: theme.colors.secondaryText,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
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
    marginBottom: theme.spacing.lg,
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
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
  topicPillContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  topicPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  topicPillText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  }
});
