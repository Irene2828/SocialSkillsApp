import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform, Modal, Image, useWindowDimensions, Pressable, ScrollView } from 'react-native';
import { Question } from '../data/types';
import { Card } from './Card';
import { AnswerButton } from './AnswerButton';
import { Button } from './Button';
import { theme, FONTS } from '../theme';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SilverDust } from './SilverDust';
import { useMood } from '../context/MoodContext';
import { WrongAnswerSpaceman } from './WrongAnswerSpaceman';
import { CorrectAnswerSpaceman } from './CorrectAnswerSpaceman';

interface QuestionViewProps {
  question: Question;
  onContinue: (isCorrect: boolean) => void;
  disabled?: boolean;
  topicName?: string;
  showCoinReward?: boolean;
  showExplanation?: boolean;
  partLabel?: string;
  /** The Part 2 (why) question to show inline below Part 1 */
  whyQuestion?: Question | null;
  /** Whether Part 2 should be visible (Part 1 was completed) */
  showPart2?: boolean;
  /** Called when Part 1 is answered correctly and has a Part 2 */
  onPart1Complete?: () => void;
  /** Ref to parent ScrollView for auto-scrolling to Part 2 */
  scrollViewRef?: React.RefObject<ScrollView | null>;
}

export const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  onContinue,
  disabled,
  topicName,
  showCoinReward = true,
  showExplanation = true,
  partLabel,
  whyQuestion,
  showPart2 = false,
  onPart1Complete,
  scrollViewRef,
}) => {
  const { mood } = useMood();
  const isRocket = mood === 'rocket';
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasFailed, setHasFailed] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(question.id);
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;

  // Part 2 state
  const [part2SelectedIndex, setPart2SelectedIndex] = useState<number | null>(null);
  const [part2Y, setPart2Y] = useState<number | null>(null);
  const [part2HasFailed, setPart2HasFailed] = useState(false);
  const part2FadeAnim = useRef(new Animated.Value(0)).current;

  const glassTextShadow = isRocket ? {
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  } : {};

  if (question.id !== currentQuestionId) {
    setSelectedIndex(null);
    setHasFailed(false);
    setPart2SelectedIndex(null);
    setPart2HasFailed(false);
    setCurrentQuestionId(question.id);
  }
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  // Reset state and trigger animation when question changes
  useEffect(() => {
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
  }, [question.id]);

  // Animate Part 2 in when showPart2 becomes true
  useEffect(() => {
    if (showPart2) {
      part2FadeAnim.setValue(0);
      Animated.timing(part2FadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [showPart2]);

  // Auto-scroll to eye-level when Part 2 layout is known
  useEffect(() => {
    if (showPart2 && part2Y !== null) {
      setTimeout(() => {
        scrollViewRef?.current?.scrollTo?.({ y: part2Y - 80, animated: true });
      }, 50);
    }
  }, [showPart2, part2Y]);

  const handleSelect = (index: number) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
      if (index !== question.correctAnswerIndex) {
        setHasFailed(true);
      }
    }
  };

  const handlePart2Select = (index: number) => {
    if (whyQuestion && part2SelectedIndex === null) {
      setPart2SelectedIndex(index);
      if (index !== whyQuestion.correctAnswerIndex) {
        setPart2HasFailed(true);
      }
    }
  };

  const handleCloseModal = () => {
    if (displayIsCorrect) {
      // If this question has a Part 2 and we're on Part 1
      if (whyQuestion && !showPart2 && onPart1Complete) {
        setSelectedIndex(null); // Reset modal state but keep Part 1 locked via showPart2
        onPart1Complete();
        return;
      }
      setSelectedIndex(null);
      setHasFailed(false);
      onContinue(!hasFailed);
    } else {
      setSelectedIndex(null);
    }
  };

  const handleClosePart2Modal = () => {
    if (whyQuestion && part2DisplayIsCorrect) {
      setPart2SelectedIndex(null);
      setPart2HasFailed(false);
      onContinue(!part2HasFailed);
    } else {
      setPart2SelectedIndex(null);
    }
  };

  const isIdChanged = question.id !== currentQuestionId;
  const isAnswered = selectedIndex !== null && !isIdChanged;
  const isCorrect = isAnswered && selectedIndex === question.correctAnswerIndex;

  const displayIsCorrectRef = useRef(isCorrect);
  if (isAnswered) {
    displayIsCorrectRef.current = isCorrect;
  }
  const displayIsCorrect = isAnswered ? isCorrect : displayIsCorrectRef.current;

  // Part 2 answered state
  const part2IsAnswered = part2SelectedIndex !== null && !isIdChanged;
  const part2IsCorrect = whyQuestion && part2IsAnswered ? part2SelectedIndex === whyQuestion.correctAnswerIndex : false;

  const part2DisplayIsCorrectRef = useRef(part2IsCorrect);
  if (part2IsAnswered) {
    part2DisplayIsCorrectRef.current = part2IsCorrect;
  }
  const part2DisplayIsCorrect = part2IsAnswered ? part2IsCorrect : part2DisplayIsCorrectRef.current;

  // Should Part 1 answers show as locked (completed)?
  const part1Locked = showPart2;

  // For Part 1 modal: if has why data, suppress coin reward (it comes on Part 2)
  const part1ShowCoin = !whyQuestion;

  return (
    <View style={styles.container}>
      <Card style={[styles.unifiedCard, isRocket && { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
        {/* ===== PART 1 ===== */}
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.cardWrapper}>
          <View style={styles.scenarioCard}>
            {whyQuestion && null}
            <Text style={[styles.scenarioText, isSmallScreen && { fontSize: 25 }, isRocket && { color: '#FFFFFF' }, glassTextShadow]}>{question.scenario}</Text>
          {question.prompt && (
            <Text style={[styles.promptText, isSmallScreen && { fontSize: 25 }, isRocket && { color: '#FFFFFF' }, glassTextShadow]}>{question.prompt}</Text>
          )}
          </View>
        </View>

        <View style={styles.optionsContainer}>
        {question.options.map((option, index) => {
          let state: 'default' | 'selected-correct' | 'selected-incorrect' | 'unselected-correct' = 'default';

          if (part1Locked) {
            // Part 1 is completed — show correct answer locked
            state = index === question.correctAnswerIndex ? 'selected-correct' : 'default';
          } else if (isAnswered) {
            if (isCorrect) {
              state = index === question.correctAnswerIndex ? 'selected-correct' : 'default';
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
              disabled={isAnswered || part1Locked}
            />
          );
        })}
      </View>
    </Animated.View>

      {/* ===== PART 1 MODAL (only when Part 2 is NOT yet showing) ===== */}
      {!showPart2 && (
        <Modal
          visible={isAnswered}
          transparent={true}
          animationType="fade"
        >
          <Pressable style={[styles.modalOverlay, isRocket && { backgroundColor: 'rgba(6, 18, 36, 0.95)' }]} onPress={handleCloseModal}>
            {displayIsCorrect && part1ShowCoin && <SilverDust />}
            <Pressable style={[
              styles.feedbackContainerBackground
            ]} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <View style={styles.feedbackContainer}>
                
                {!displayIsCorrect && <WrongAnswerSpaceman />}
                {displayIsCorrect && <CorrectAnswerSpaceman />}

                <View style={styles.feedbackTitleContainer}>
                  <Text style={[styles.feedbackTitle, isRocket && { color: '#FFFFFF' }, isRocket && glassTextShadow]}>
                    {displayIsCorrect 
                      ? (whyQuestion ? "That's correct!" : (showCoinReward ? 'Correct!' : "That's correct!"))
                      : "Not quite, try again!"}
                  </Text>
                </View>
                
                {displayIsCorrect && part1ShowCoin && showCoinReward && (
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
                  <>
                    {showExplanation && part1ShowCoin && (
                      <View style={[styles.dashedExplanationContainer, isRocket && { borderColor: 'rgba(255, 255, 255, 0.3)', backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
                        <Text style={[styles.explanationText, isRocket && { color: '#FFFFFF' }, isRocket && glassTextShadow]}>{question.explanation}</Text>
                      </View>
                    )}
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], width: '100%' }}>
                      <Button
                        title="Continue"
                        onPress={handleCloseModal}
                        style={styles.continueButton}
                        disabled={disabled}
                      />
                    </Animated.View>
                  </>
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
      )}

      {/* ===== PART 2 (inline, appears below Part 1 when showPart2 is true) ===== */}
      {showPart2 && whyQuestion && (
        <Animated.View 
          onLayout={(e) => setPart2Y(e.nativeEvent.layout.y)}
          style={[styles.animatedContainer, { opacity: part2FadeAnim, marginTop: theme.spacing.md }]}
        >

          <View style={styles.cardWrapper}>
            <View style={styles.scenarioCard}>

              <Text style={[styles.scenarioText, isSmallScreen && { fontSize: 25 }, isRocket && { color: '#FFFFFF' }, glassTextShadow]}>{whyQuestion.scenario}</Text>
              {whyQuestion.prompt && (
                <Text style={[styles.promptText, isSmallScreen && { fontSize: 25 }, isRocket && { color: '#FFFFFF' }, glassTextShadow]}>{whyQuestion.prompt}</Text>
              )}
            </View>
          </View>

          <View style={styles.optionsContainer}>
            {whyQuestion.options.map((option, index) => {
              let state: 'default' | 'selected-correct' | 'selected-incorrect' | 'unselected-correct' = 'default';

              if (part2IsAnswered) {
                if (part2IsCorrect) {
                  state = index === whyQuestion.correctAnswerIndex ? 'selected-correct' : 'default';
                } else {
                  if (index === part2SelectedIndex) {
                    state = 'selected-incorrect';
                  }
                }
              }

              return (
                <AnswerButton
                  key={`part2-${index}`}
                  text={option}
                  onPress={() => handlePart2Select(index)}
                  state={state}
                  disabled={part2IsAnswered}
                />
              );
            })}
          </View>

          {/* Part 2 Modal */}
          <Modal
            visible={part2IsAnswered}
            transparent={true}
            animationType="fade"
          >
            <Pressable style={[styles.modalOverlay, isRocket && { backgroundColor: 'rgba(6, 18, 36, 0.95)' }]} onPress={handleClosePart2Modal}>
              {part2DisplayIsCorrect && <SilverDust />}
              <Pressable style={[
                styles.feedbackContainerBackground
              ]} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
                <View style={styles.feedbackContainer}>
                  {!part2DisplayIsCorrect && <WrongAnswerSpaceman />}
                  {part2DisplayIsCorrect && <CorrectAnswerSpaceman />}
                  <View style={styles.feedbackTitleContainer}>
                    <Text style={[styles.feedbackTitle, isRocket && { color: '#FFFFFF' }, isRocket && glassTextShadow]}>
                      {part2DisplayIsCorrect 
                        ? 'Correct!'
                        : "Not quite, try again!"}
                    </Text>
                  </View>

                  {part2DisplayIsCorrect && (
                    <View style={styles.coinRewardContainer}>
                      <FontAwesome5 
                        name="coins" 
                        size={24} 
                        color="#4B5563" 
                      />
                      <Text style={[styles.coinRewardText, isRocket && { color: '#FFFFFF' }, isRocket && glassTextShadow]}>+1 Coin Earned!</Text>
                    </View>
                  )}

                  {part2DisplayIsCorrect && (
                    <View style={[styles.dashedExplanationContainer, isRocket && { borderColor: 'rgba(255, 255, 255, 0.3)', backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
                      <Text style={[styles.explanationText, isRocket && { color: '#FFFFFF' }, isRocket && glassTextShadow]}>{whyQuestion.explanation}</Text>
                    </View>
                  )}

                  {part2DisplayIsCorrect ? (
                    <Animated.View style={{ width: '100%' }}>
                      <Button
                        title="Continue"
                        onPress={handleClosePart2Modal}
                        style={styles.continueButton}
                        disabled={disabled}
                      />
                    </Animated.View>
                  ) : (
                    <Button
                      title="Try Again"
                      onPress={() => setPart2SelectedIndex(null)}
                      style={styles.continueButton}
                    />
                  )}
                </View>
              </Pressable>
            </Pressable>
          </Modal>
        </Animated.View>
      )}
      </Card>
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
  },
  cardWrapper: {
    position: 'relative',
    marginTop: 0,
  },
  folderTab: {
    position: 'absolute',
    top: -30,
    right: 20,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    borderBottomWidth: 0,
    zIndex: -1, // Keep it visually attached behind the rounded edge if needed, or zIndex 1
  },
  folderTabText: {
    ...theme.typography.body,
    fontWeight: '800',
    fontSize: 14,
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  animatedContainer: {
    width: '100%',
  },
  scenarioCard: {
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  partLabelText: {
    ...theme.typography.caption,
    fontSize: 16,
    color: theme.colors.secondaryText,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontWeight: '600',
  },
  scenarioText: {
    ...theme.typography.heading,
    fontFamily: FONTS.regular,
    fontSize: 27,
    fontWeight: '400',
    lineHeight: 38,
    textAlign: 'left',
    color: '#111827',
  },
  promptText: {
    ...theme.typography.heading,
    fontFamily: FONTS.regular,
    fontSize: 27,
    fontWeight: '700',
    lineHeight: 38,
    textAlign: 'center',
    color: theme.colors.text,
    marginTop: theme.spacing.xl,
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
  optionsContainer: {
    marginBottom: theme.spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Standardized white overlay 90%
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
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: 0.5,
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
  },
  part2Divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  part2DividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  part2DividerText: {
    ...theme.typography.caption,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.secondaryText,
    paddingHorizontal: theme.spacing.md,
  },
});
