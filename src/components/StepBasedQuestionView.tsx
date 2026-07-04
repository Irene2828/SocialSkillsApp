import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Modal, useWindowDimensions, Pressable } from 'react-native';
import { StepBasedQuestion } from '../data/types';
import { Card } from './Card';
import { AnswerButton } from './AnswerButton';
import { Button } from './Button';
import { theme, FONTS } from '../theme';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SilverDust } from './SilverDust';

interface StepBasedQuestionViewProps {
  question: StepBasedQuestion;
  onContinue: (isCorrect: boolean) => void;
  disabled?: boolean;
}

export const StepBasedQuestionView: React.FC<StepBasedQuestionViewProps> = ({ question, onContinue, disabled }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasFailed, setHasFailed] = useState(false);
  
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  const currentStep = currentStepIndex < question.steps.length ? question.steps[currentStepIndex] : null;
  const isCompletionState = currentStepIndex === question.steps.length;

  // Reset state and trigger animation when question changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setSelectedIndex(null);
    setHasFailed(false);
    animateIn();
  }, [question.id]);

  useEffect(() => {
    animateIn();
  }, [currentStepIndex]);

  const animateIn = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(10);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleSelect = (index: number) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
      if (currentStep && index !== currentStep.correctIndex) {
        setHasFailed(true);
      }
    }
  };

  const handleContinueStep = () => {
    setCurrentStepIndex(prev => prev + 1);
    setSelectedIndex(null);
  };

  const handleCloseModal = () => {
    if (displayIsCorrect) {
      handleContinueStep();
    } else {
      setSelectedIndex(null);
    }
  };

  const isAnswered = selectedIndex !== null;
  const isCorrect = currentStep ? selectedIndex === currentStep.correctIndex : false;

  const displayIsCorrectRef = useRef(isCorrect);
  if (isAnswered) {
    displayIsCorrectRef.current = isCorrect;
  }
  const displayIsCorrect = isAnswered ? isCorrect : displayIsCorrectRef.current;

  return (
    <View style={styles.container}>
      <Card style={styles.mainCard}>
        {/* Persistent Problem Text */}
        <Text style={styles.sectionLabel}>Problem:</Text>
        <Text style={[styles.problemText, isSmallScreen && { fontSize: 22 }]}>{question.problemText}</Text>
        
        {/* Subtle Step Indicator (Dots) - Only show if > 1 step */}
        {question.steps.length > 1 && (
          <View style={styles.dotsContainer}>
            {question.steps.map((_: any, index: number) => (
              <View 
                key={index} 
                style={[
                  styles.dot, 
                  index === currentStepIndex ? styles.activeDot : 
                  index < currentStepIndex ? styles.completedDot : styles.inactiveDot
                ]} 
              />
            ))}
          </View>
        )}

        <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {isCompletionState ? (
            <View style={styles.completionStateContainer}>
              <View style={styles.coinRewardContainer}>
                <FontAwesome5 
                  name="coins" 
                  size={32} 
                  color={theme.colors.primary} 
                  style={{
                    textShadowColor: '#9CA3AF',
                    textShadowOffset: { width: -0.5, height: 0.5 },
                    textShadowRadius: 1
                  }}
                />
                <Text style={styles.completionCoinText}>+1 Coin Earned!</Text>
              </View>
              
              <Text style={styles.finalAnswerText}>Answer: {question.finalAnswer}</Text>
              
              <Button
                title="Next Problem"
                onPress={() => onContinue(!hasFailed)}
                style={styles.nextProblemButton}
                disabled={disabled}
              />
            </View>
          ) : currentStep ? (
            <>
              <Text style={styles.sectionLabel}>Step {currentStepIndex + 1}:</Text>
              <View style={styles.promptContainer}>
                <Text style={[styles.promptText, isSmallScreen && { fontSize: 20 }]}>{currentStep.prompt}</Text>
              </View>

              <View style={styles.optionsContainer}>
                {currentStep.options.map((option: string, index: number) => {
                  let state: 'default' | 'selected-correct' | 'selected-incorrect' | 'unselected-correct' = 'default';

                  if (isAnswered) {
                    if (isCorrect) {
                      state = index === currentStep.correctIndex ? 'selected-correct' : 'default';
                    } else {
                      if (index === selectedIndex) {
                        state = 'selected-incorrect';
                      }
                    }
                  }

                  return (
                    <AnswerButton
                      key={index}
                      text={option}
                      onPress={() => handleSelect(index)}
                      state={state}
                      disabled={isAnswered}
                    />
                  );
                })}
              </View>
            </>
          ) : null}
        </Animated.View>
      </Card>

      <Modal
        visible={isAnswered}
        transparent={true}
        animationType="fade"
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseModal}>
          {displayIsCorrect && <SilverDust />}
          <Pressable style={styles.feedbackContainerBackground} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
            <View style={styles.feedbackContainer}>
              
              <View style={styles.feedbackTitleContainer}>
                <Text style={styles.feedbackTitle}>
                  {displayIsCorrect ? 'Correct!' : "Not quite, try again!"}
                </Text>
              </View>
              
              {displayIsCorrect && currentStep && (
                <Text style={styles.explanationText}>{currentStep.explanation}</Text>
              )}

              {displayIsCorrect ? (
                <Button
                  title="Continue"
                  onPress={handleContinueStep}
                  style={styles.continueButton}
                  disabled={disabled}
                />
              ) : (
                <Button
                  title="Try Again"
                  onPress={() => setSelectedIndex(null)}
                  style={styles.continueButton}
                />
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: theme.spacing.md,
  },
  mainCard: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
  },
  sectionLabel: {
    ...theme.typography.label,
    marginBottom: theme.spacing.xs,
  },
  problemText: {
    ...theme.typography.heading,
    fontFamily: FONTS.regular,
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 34,
    textAlign: 'left',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.xs,
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  completedDot: {
    backgroundColor: theme.colors.primary,
    opacity: 0.5,
  },
  inactiveDot: {
    backgroundColor: theme.colors.stroke,
  },
  animatedContainer: {
    width: '100%',
  },
  promptContainer: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xs,
  },
  promptText: {
    ...theme.typography.heading,
    fontFamily: FONTS.regular,
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 34,
    textAlign: 'left',
    color: theme.colors.text,
  },
  optionsContainer: {
    marginBottom: theme.spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  feedbackContainerBackground: {
    width: '100%',
    maxWidth: 500,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.white,
  },
  feedbackContainer: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  feedbackTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  feedbackTitle: {
    ...theme.typography.body,
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: 0.5,
    textAlign: 'center',
    color: theme.colors.text,
  },
  explanationText: {
    ...theme.typography.heading,
    fontFamily: FONTS.regular,
    fontSize: 19,
    fontWeight: '400',
    lineHeight: 26,
    letterSpacing: 0.2,
    textAlign: 'center',
    color: '#111827',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.colors.stroke,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  finalAnswerText: {
    ...theme.typography.heading,
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  coinRewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  coinRewardText: {
    ...theme.typography.body,
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: 0.5,
    textAlign: 'center',
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  continueButton: {
    marginTop: theme.spacing.sm,
    width: '100%',
  },
  completionStateContainer: {
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionCoinText: {
    ...theme.typography.heading,
    fontSize: 24,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  nextProblemButton: {
    marginTop: theme.spacing.xl,
    width: '100%',
  }
});
