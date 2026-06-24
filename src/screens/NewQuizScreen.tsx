import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
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
import { StreakCard } from '../components/StreakCard';
import { QuickStartButton } from '../components/QuickStartButton';
import { SimpleLockScreen } from '../components/SimpleLockScreen';

type QuizState = 'selection' | 'in-progress' | 'completed';

export const NewQuizScreen = () => {
  const { addCoins, coinBalance } = useRewards();
  const { streak, recordQuizCompletion, quizzesTakenToday, dailyLimit } = useProgress();
  const navigation = useNavigation<any>();

  const [quizState, setQuizState] = useState<QuizState>('selection');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

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

  const handleStartQuickQuiz = () => {
    // Shuffle all questions regardless of category
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    
    setSelectedCategory(null);
    setCurrentQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setQuizState('in-progress');
  };

  const handleStartQuiz = (category: Category) => {
    // Filter questions by category
    const categoryQuestions = allQuestions.filter(q => q.category === category);
    
    // Shuffle and pick 10 questions (or all if less than 10)
    const shuffled = [...categoryQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);

    setSelectedCategory(category);
    setCurrentQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setQuizState('in-progress');
  };

  const handleContinue = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Calculate final score since React state might not be updated yet
      const finalScore = isCorrect ? score + 1 : score;
      let coinsEarned = 0;
      if (finalScore >= 8) coinsEarned = 1;
      else if (finalScore >= 6) coinsEarned = 0.5;
      
      if (coinsEarned > 0) {
        addCoins(coinsEarned);
      }
      recordQuizCompletion(finalScore, coinsEarned);
      setQuizState('completed');
    }
  };

  const handleBackToHome = () => {
    setQuizState('selection');
    setSelectedCategory(null);
    setCurrentQuestions([]);
    setCurrentIndex(0);
    setScore(0);
  };

  const renderSelection = () => {
    if (quizzesTakenToday >= dailyLimit) {
      return <SimpleLockScreen />;
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.topSection}>
          <View style={styles.greetingRow}>
            <Text style={styles.greetingText}>Ready for today's challenge?</Text>
            <View style={styles.coinBadge}>
              <Text style={styles.coinBadgeText}>{coinBalance} 🪙</Text>
            </View>
          </View>
          <StreakCard streak={streak} />
        </View>

        <QuickStartButton onPress={handleStartQuickQuiz} />

        <Text style={styles.sectionTitle}>Or choose a topic:</Text>
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

  const renderInProgress = () => {
    if (currentQuestions.length === 0) return null;
    const currentQuestion = currentQuestions[currentIndex];

    return (
      <View style={styles.inProgressContainer}>
        <ProgressBar current={currentIndex + 1} total={currentQuestions.length} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <QuestionView 
            question={currentQuestion} 
            onContinue={handleContinue} 
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

    let streakMessage = "Great start!";
    if (streak >= 14) streakMessage = "Habit master!";
    else if (streak >= 7) streakMessage = "Amazing consistency!";
    else if (streak >= 3) streakMessage = "You're on fire 🔥";

    let coinsEarned = 0;
    if (score >= 8) coinsEarned = 1;
    else if (score >= 6) coinsEarned = 0.5;

    return (
      <View style={styles.completedContainer}>
        <Card style={styles.completedCard}>
          <Text style={styles.completedTitle}>Quiz Complete!</Text>
          <Text style={styles.categoryText}>{categoryName}</Text>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{score} / {total}</Text>
          </View>
          
          <Animated.View style={{ opacity: completionFadeAnim, transform: [{ translateY: completionSlideAnim }], alignItems: 'center', width: '100%' }}>
            {coinsEarned > 0 && (
              <Text style={styles.coinsEarnedText}>+{coinsEarned} Coins!</Text>
            )}

            <Text style={styles.streakProgressText}>{streakMessage}</Text>
            <Text style={styles.messageText}>{message}</Text>
          </Animated.View>

          <Button 
            title="Take Another Quiz" 
            onPress={handleBackToHome} 
            style={[styles.actionButton, styles.primaryButton]}
          />
          <Button 
            title="Go to Rewards" 
            onPress={() => {
              handleBackToHome();
              navigation.navigate('MyRewards');
            }} 
            variant="secondary"
            style={styles.actionButton}
          />
        </Card>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <Header title={quizState === 'selection' ? "New Quiz" : selectedCategory || "Quiz"} />
      <View style={styles.content}>
        {quizState === 'selection' && renderSelection()}
        {quizState === 'in-progress' && renderInProgress()}
        {quizState === 'completed' && renderCompleted()}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  topSection: {
    marginBottom: theme.spacing.md,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  greetingText: {
    ...theme.typography.heading,
    fontSize: 20,
    flex: 1,
  },
  coinBadge: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    borderColor: theme.colors.accent,
    borderWidth: 1,
  },
  coinBadgeText: {
    ...theme.typography.heading,
    fontSize: 16,
    color: theme.colors.accent,
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
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.md,
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
    marginBottom: theme.spacing.lg,
  },
  scoreContainer: {
    backgroundColor: theme.colors.primary,
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  scoreText: {
    ...theme.typography.heading,
    color: theme.colors.white,
    fontSize: 32,
  },
  messageText: {
    ...theme.typography.heading,
    fontSize: 22,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  coinsEarnedText: {
    ...theme.typography.heading,
    color: theme.colors.accent,
    fontSize: 24,
    marginBottom: theme.spacing.md,
  },
  streakProgressText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.success,
    marginBottom: theme.spacing.sm,
  },
  actionButton: {
    width: '100%',
    marginBottom: theme.spacing.sm,
  },
  primaryButton: {
    // Gradient logic goes here if implemented, for now solid is fine per v2 design system
  },
});
