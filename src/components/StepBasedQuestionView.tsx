import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Modal, useWindowDimensions, Pressable } from 'react-native';
import { StepBasedQuestion } from '../data/types';
import { AnswerButton } from './AnswerButton';
import { Button } from './Button';
import { theme, FONTS } from '../theme';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

import { SilverDust } from './SilverDust';
import { useMood } from '../context/MoodContext';
import { WrongAnswerSpaceman } from './WrongAnswerSpaceman';
import { CorrectAnswerSpaceman } from './CorrectAnswerSpaceman';
import { useRewards } from '../context/RewardsContext';

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

const parseCompactProblemText = (problemText: string) => {
  const storyMatch = problemText.match(/Story:\s*([\s\S]*?)(?=\n\s*Facts:|$)/i);
  const factsMatch = problemText.match(/Facts:\s*([\s\S]*?)(?=\n\s*Question:|$)/i);
  const questionMatch = problemText.match(/Question:\s*([\s\S]*)$/i);

  if (!storyMatch || !factsMatch || !questionMatch) {
    return null;
  }

  const facts = factsMatch[1]
    .split('\n')
    .map(line => line.replace(/^\s*[-•]\s*/, '').trim())
    .filter(Boolean);

  if (!facts.length) {
    return null;
  }

  const story = storyMatch[1].trim();
  const storySentences = story.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(sentence => sentence.trim()).filter(Boolean) || [story];
  const detailStartIndex = storySentences.findIndex(sentence =>
    /\b(will use|needs to|prices?|costs?|packet|decides|choose|between|how much|how many)\b/i.test(sentence)
  );
  const introSentences = detailStartIndex > 0
    ? storySentences.slice(0, detailStartIndex)
    : storySentences.slice(0, Math.min(2, storySentences.length));
  const detailsSentences = detailStartIndex > 0
    ? storySentences.slice(detailStartIndex)
    : storySentences.slice(introSentences.length);

  return {
    story: introSentences.join(' ').trim() || story,
    details: detailsSentences.join(' ').trim(),
    facts,
    question: questionMatch[1].trim(),
  };
};

export const StepBasedQuestionView: React.FC<StepBasedQuestionViewProps> = ({ question, onContinue, disabled, onStepChange }) => {
  const { mood } = useMood();
  const { isRewardsModeOn } = useRewards();
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
  const compactProblem = parseCompactProblemText(question.problemText);

  return (
    <View style={styles.container}>
      <View style={styles.unifiedCard}>
        {/* Persistent Problem Text Card */}
        <View style={styles.mainCard}>
          {compactProblem ? (
            <View style={styles.problemSheet}>
              <View style={styles.storyCallout}>
                <Text style={[styles.calloutLabel, isRocket && glassTextShadow]}>
                  Story
                </Text>
                <Text style={[styles.storyCalloutText, isRocket && glassTextShadow]}>
                  {compactProblem.story}
                </Text>
              </View>

              <Text style={[styles.problemSheetLabel, isRocket && glassTextShadow]}>
                Details
              </Text>
              <View style={styles.factGrid}>
                {compactProblem.facts.map((fact, index) => (
                  <View key={`${fact}-${index}`} style={styles.factChip}>
                    <Text style={[styles.factText, isRocket && glassTextShadow]}>
                      {`\u2022 ${fact}`}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.problemQuestionStrip}>
                <Ionicons name="flag-outline" size={16} color={theme.colors.secondaryText} />
                <Text style={[styles.problemQuestionText, isRocket && glassTextShadow]}>
                  {compactProblem.question}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={[styles.problemText, isSmallScreen && { fontSize: 22 }, isRocket && glassTextShadow]}>{question.problemText}</Text>
          )}
          <Text style={[styles.followStepsHint, isRocket && glassTextShadow]}>
            (don't answer yet, follow the steps below to solve the problem)
          </Text>
          <View style={styles.problemToStepsDivider} />
        </View>

      {/* ===== Completed Steps (stacked, read-only) ===== */}
      {completedSteps.map((cs) => {
        const step = question.steps[cs.stepIndex];
        return (
          <View key={`completed-${cs.stepIndex}`} style={styles.completedStepContainer}>
            {/* Completed step prompt */}
            <View style={styles.completedPromptCard}>
              <Text style={[styles.promptText, { opacity: 0.8 }, isRocket && { color: '#FFFFFF' }, isRocket && glassTextShadow]}>
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
              <Text style={[styles.promptText, isSmallScreen && { fontSize: 20 }, isRocket && glassTextShadow]}>
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
      </View>

      {/* ===== Feedback Modal ===== */}
      <Modal
        visible={isAnswered}
        transparent={true}
        animationType="fade"
      >
        <Pressable style={[styles.modalOverlay, isRocket && { backgroundColor: 'rgba(6, 18, 36, 0.95)' }]} onPress={handleCloseModal}>
          {displayIsCorrect && isFinalStep && isRewardsModeOn && <SilverDust />}
          <Pressable style={[
            styles.feedbackContainerBackground
          ]} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
            <View style={styles.feedbackContainer}>
              {/* {!displayIsCorrect && <WrongAnswerSpaceman />} */}
              {/* {displayIsCorrect && <CorrectAnswerSpaceman />} */}
              <View style={styles.feedbackTitleContainer}>
                <Text style={[styles.feedbackTitle, isRocket && { color: '#FFFFFF' }, isRocket && glassTextShadow]}>
                  {displayIsCorrect 
                    ? "That's Correct!" 
                    : "Not quite, try again!"}
                </Text>
              </View>

              {displayIsCorrect && isFinalStep && !hasFailed && isRewardsModeOn && (
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
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  animatedContainer: {
    width: '100%',
  },
  mainCard: {
    paddingVertical: 12,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    marginBottom: 0,
  },
  situationalLabel: {
    ...theme.typography.body,
    fontFamily: FONTS.regular,
    fontWeight: '400',
    letterSpacing: 0,
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
  problemSheet: {
    width: '100%',
    marginBottom: theme.spacing.sm,
  },
  problemSheetLabel: {
    ...theme.typography.label,
    fontFamily: FONTS.medium,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0,
    color: theme.colors.secondaryText,
    marginBottom: 4,
  },
  problemSheetStory: {
    ...theme.typography.body,
    fontFamily: FONTS.regular,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  storyCallout: {
    backgroundColor: 'rgba(56, 189, 248, 0.34)',
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.30)',
    borderRadius: 12,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 8,
    marginBottom: theme.spacing.md,
  },
  calloutLabel: {
    ...theme.typography.label,
    fontFamily: FONTS.semiBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0,
    color: 'rgba(255, 255, 255, 0.72)',
    marginBottom: 3,
  },
  storyCalloutText: {
    ...theme.typography.body,
    fontFamily: FONTS.medium,
    fontSize: 13,
    lineHeight: 18,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.32)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  factGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginBottom: theme.spacing.md,
  },
  factChip: {
    width: '50%',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  factText: {
    ...theme.typography.caption,
    fontFamily: FONTS.regular,
    fontSize: 11,
    lineHeight: 15,
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: 0,
  },
  problemQuestionStrip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.34)',
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.30)',
    borderRadius: 12,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 8,
    marginTop: theme.spacing.sm,
  },
  problemQuestionText: {
    ...theme.typography.body,
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: 13,
    lineHeight: 18,
    color: '#FFFFFF',
    marginLeft: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.32)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  followStepsHint: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 17,
    color: theme.colors.secondaryText,
    marginTop: 0,
    marginBottom: 8,
  },
  problemToStepsDivider: {
    width: 94,
    height: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(147, 197, 253, 0.55)',
    alignSelf: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  promptText: {
    ...theme.typography.heading,
    fontFamily: FONTS.regular,
    fontSize: 24,
    fontWeight: '600',
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
    marginBottom: 120,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 8, 18, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  feedbackContainerBackground: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderWidth: 0,
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
    fontWeight: '600',
    fontSize: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: theme.colors.text,
  },
  dashedExplanationContainer: {
    width: '100%',
    padding: theme.spacing.lg,
    borderWidth: 1,
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
    fontWeight: '600',
    fontSize: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  continueButton: {
    marginTop: theme.spacing.sm,
    width: '100%',
  }
});
