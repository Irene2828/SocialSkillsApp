import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Modal, useWindowDimensions, Pressable } from 'react-native';
import { StepBasedQuestion } from '../data/types';
import { Card } from './Card';
import { AnswerButton } from './AnswerButton';
import { Button } from './Button';
import { theme, FONTS } from '../theme';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SilverDust } from './SilverDust';
import { useMood } from '../context/MoodContext';

interface StepBasedQuestionViewProps {
  question: StepBasedQuestion;
  onContinue: (isCorrect: boolean) => void;
  disabled?: boolean;
  onStepChange?: (currentIndex: number, totalSteps: number) => void;
}

interface CompletedStep {
  stepIndex: number;
  selectedOption: number;
  correctOption: number;
}

export const StepBasedQuestionView: React.FC<StepBasedQuestionViewProps> = ({ question, onContinue, disabled, onStepChange }) => {
  const { mood } = useMood();
  const isRocket = mood === 'rocket';
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasFailed, setHasFailed] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<CompletedStep[]>([]);
  
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;

  const glassTextShadow = isRocket ? {
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  } : {};
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;
  const stepFadeAnim = useRef(new Animated.Value(0)).current;

  const currentStep = currentStepIndex < question.steps.length ? question.steps[currentStepIndex] : null;
  const isFinalStep = currentStepIndex === question.steps.length - 1;

  const [currentQuestionId, setCurrentQuestionId] = useState(question.id);

  if (question.id !== currentQuestionId) {
    setCurrentStepIndex(0);
    setSelectedIndex(null);
    setHasFailed(false);
    setCompletedSteps([]);
    setCurrentQuestionId(question.id);
  }

  // Reset state and trigger animation when question changes
  useEffect(() => {
    animateIn();
  }, [question.id]);

  useEffect(() => {
    onStepChange?.(currentStepIndex, question.steps.length);
    // Animate new step in
    stepFadeAnim.setValue(0);
    Animated.timing(stepFadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
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

  const handleCloseModal = () => {
    if (displayIsCorrect) {
      if (isFinalStep) {
        // Final step done — complete the question
        setSelectedIndex(null);
        setHasFailed(false);
        onContinue(true);
      } else {
        // Not final — lock this step as completed and reveal next step below
        setCompletedSteps(prev => [...prev, {
          stepIndex: currentStepIndex,
          selectedOption: selectedIndex!,
          correctOption: currentStep!.correctIndex,
        }]);
        setCurrentStepIndex(prev => prev + 1);
        setSelectedIndex(null);
      }
    } else {
      setSelectedIndex(null);
    }
  };

  const isIdChanged = question.id !== currentQuestionId;
  const isAnswered = selectedIndex !== null && !isIdChanged;
  const isCorrect = currentStep && isAnswered ? selectedIndex === currentStep.correctIndex : false;

  const displayIsCorrectRef = useRef(isCorrect);
  if (isAnswered) {
    displayIsCorrectRef.current = isCorrect;
  }
  const displayIsCorrect = isAnswered ? isCorrect : displayIsCorrectRef.current;

  return (
    <View style={styles.container}>
      <Card style={[styles.unifiedCard, isRocket && { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
        {/* Persistent Problem Text Card */}
        <View style={styles.mainCard}>
          <Text style={[styles.situationalLabel, isRocket && { color: 'rgba(255, 255, 255, 0.7)' }, glassTextShadow]}>Situational problem:</Text>
          <Text style={[styles.problemText, isSmallScreen && { fontSize: 22 }, isRocket && { color: '#FFFFFF' }, glassTextShadow]}>{question.problemText}</Text>
          <Text style={[{ fontFamily: 'InstrumentSans_400Regular', fontSize: 16, color: '#6B7280', marginTop: -8, marginBottom: 12 }, isRocket && { color: 'rgba(255, 255, 255, 0.7)' }, glassTextShadow]}>
            (don't answer yet, follow the steps below to solve the problem)
          </Text>
        </View>

      {/* ===== Completed Steps (stacked, read-only) ===== */}
      {completedSteps.map((cs) => {
        const step = question.steps[cs.stepIndex];
        return (
          <View key={`completed-${cs.stepIndex}`} style={styles.completedStepContainer}>
            {/* Completed step prompt */}
            <View style={styles.completedPromptCard}>
              <Text style={[styles.promptText, { opacity: 0.8 }, isRocket && { color: '#FFFFFF' }, glassTextShadow]}>
                {step.prompt}
              </Text>
            </View>

            {/* Show only the correct answer (locked) */}
            <View style={styles.completedAnswerContainer}>
              {step.options.map((option: string, index: number) => {
                const state: 'default' | 'selected-correct' = index === cs.correctOption ? 'selected-correct' : 'default';
                return (
                  <AnswerButton
                    key={`completed-${cs.stepIndex}-${index}`}
                    text={option}
                    onPress={() => {}}
                    state={state}
                    disabled={true}
                  />
                );
              })}
            </View>
          </View>
        );
      })}

      {/* ===== Current Active Step ===== */}
      {currentStep && (
        <Animated.View style={[styles.animatedContainer, { opacity: stepFadeAnim }]}>
          {/* Current step prompt */}
          <View style={styles.activePromptCard}>
            <Text style={[styles.promptText, isSmallScreen && { fontSize: 20 }, isRocket && { color: '#FFFFFF' }, glassTextShadow]}>
              {currentStep.prompt}
            </Text>
          </View>

          {/* Current step options */}
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
        </Animated.View>
      )}
      </Card>

      {/* ===== Feedback Modal ===== */}
      <Modal
        visible={isAnswered}
        transparent={true}
        animationType="fade"
      >
        <Pressable style={[styles.modalOverlay, isRocket && { backgroundColor: 'rgba(6, 18, 36, 0.85)' }]} onPress={handleCloseModal}>
          {displayIsCorrect && isFinalStep && <SilverDust />}
          <Pressable style={[
            styles.feedbackContainerBackground,
            isRocket && {
              backgroundColor: 'rgba(255, 255, 255, 0.35)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              borderWidth: 1.5,
            }
          ]} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
            <View style={styles.feedbackContainer}>
              
              <View style={styles.feedbackTitleContainer}>
                <Text style={[styles.feedbackTitle, isRocket && { color: '#FFFFFF' }, isRocket && glassTextShadow]}>
                  {displayIsCorrect 
                    ? "That's Correct!" 
                    : "Not quite, try again!"}
                </Text>
              </View>

              {displayIsCorrect && isFinalStep && (
                <View style={styles.coinRewardContainer}>
                  <FontAwesome5 
                    name="coins" 
                    size={24} 
                    color="#4B5563" 
                  />
                  <Text style={[styles.coinRewardText, isRocket && { color: '#FFFFFF' }, isRocket && glassTextShadow]}>+1 Coin Earned!</Text>
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
  unifiedCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  animatedContainer: {
    width: '100%',
  },
  mainCard: {
    paddingVertical: 12,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.stroke,
    marginBottom: 0,
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
  promptText: {
    ...theme.typography.heading,
    fontFamily: FONTS.regular,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 34,
    textAlign: 'left',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },

  // Completed step styling
  completedStepContainer: {
    width: '100%',
    opacity: 0.7,
  },
  completedPromptCard: {
    paddingHorizontal: 0,
    paddingVertical: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  completedAnswerContainer: {
    marginBottom: theme.spacing.sm,
  },

  // Active step styling
  activePromptCard: {
    paddingHorizontal: 0,
    paddingVertical: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },

  // Step section dividers
  stepSectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  stepSectionDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  stepSectionLabel: {
    ...theme.typography.caption,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.secondaryText,
    paddingHorizontal: theme.spacing.md,
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
    borderColor: '#BAE6FD',
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: '#F0F9FF',
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
