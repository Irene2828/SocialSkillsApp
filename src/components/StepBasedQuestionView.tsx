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
  const isFinalStep = currentStepIndex === question.steps.length - 1;

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
      if (isFinalStep) {
        onContinue(true);
      } else {
        handleContinueStep();
      }
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
        <Text style={styles.situationalLabel}>Situational problem:</Text>
        <Text style={[styles.problemText, isSmallScreen && { fontSize: 22 }]}>{question.problemText}</Text>
        <Text style={styles.microcopy}>(Don't answer yet, follow steps below first)</Text>
      </Card>
        
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
          <Card style={styles.mainCard}>
            {currentStep ? (
              <View style={styles.promptContainer}>
                <Text style={[styles.promptText, isSmallScreen && { fontSize: 20 }, { fontStyle: 'italic' }]}>{currentStep.prompt}</Text>
              </View>
            ) : null}
          </Card>
        
          {/* Options outside the Card */}
          {currentStep && (
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
        )}
        </Animated.View>

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

              {displayIsCorrect && isFinalStep && (
                <View style={styles.coinRewardContainer}>
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
                  <Text style={styles.coinRewardText}>+1 Coin Earned!</Text>
                </View>
              )}

              {displayIsCorrect && currentStep && (
                <View style={styles.dashedExplanationContainer}>
                  <Text style={styles.explanationText}>{currentStep.explanation}</Text>
                </View>
              )}

              {displayIsCorrect ? (
                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], width: '100%' }}>
                  <Button
                    title="Continue"
                    onPress={handleCloseModal}
                    style={styles.continueButton}
                    disabled={disabled}
                  />
                </Animated.View>
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
  },
  animatedContainer: {
    width: '100%',
  },
  mainCard: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    marginBottom: theme.spacing.lg,
  },
  situationalLabel: {
    ...theme.typography.body,
    fontFamily: FONTS.regular,
    fontWeight: '400',
    letterSpacing: 0.5,
    color: theme.colors.secondaryText,
    marginBottom: 8,
    textAlign: 'left',
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
    marginBottom: theme.spacing.md,
  },
  microcopy: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
    fontSize: 14,
    textAlign: 'left',
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
  dashedExplanationContainer: {
    width: '100%',
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.md,
  },
  explanationText: {
    ...theme.typography.body,
    fontSize: 18,
    textAlign: 'center',
    color: theme.colors.text,
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
  }
});
