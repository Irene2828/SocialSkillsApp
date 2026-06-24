import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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

type QuizState = 'selection' | 'in-progress' | 'completed';

export const NewQuizScreen = () => {
  const [quizState, setQuizState] = useState<QuizState>('selection');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

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

  const renderSelection = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {QUIZ_CATEGORIES.map(category => (
        <QuizCard 
          key={category.id} 
          category={category} 
          onPressStart={() => handleStartQuiz(category.id)} 
        />
      ))}
    </ScrollView>
  );

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

    return (
      <View style={styles.completedContainer}>
        <Card style={styles.completedCard}>
          <Text style={styles.completedTitle}>Quiz Complete!</Text>
          <Text style={styles.categoryText}>{categoryName}</Text>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{score} / {total}</Text>
          </View>
          
          <Text style={styles.messageText}>{message}</Text>
          
          <Button 
            title="Back to Home" 
            onPress={handleBackToHome} 
            style={styles.homeButton}
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
  homeButton: {
    width: '100%',
  },
});
