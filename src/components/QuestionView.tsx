import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform, Modal, Image, useWindowDimensions, Pressable } from 'react-native';
import { Question } from '../data/types';
import { Card } from './Card';
import { AnswerButton } from './AnswerButton';
import { Button } from './Button';
import { theme, FONTS } from '../theme';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SilverDust } from './SilverDust';

interface QuestionViewProps {
  question: Question;
  onContinue: (isCorrect: boolean) => void;
  disabled?: boolean;
  topicName?: string;
  showCoinReward?: boolean;
  showExplanation?: boolean;
  partLabel?: string;
}

export const QuestionView: React.FC<QuestionViewProps> = ({ question, onContinue, disabled, topicName, showCoinReward = true, showExplanation = true, partLabel }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasFailed, setHasFailed] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(question.id);
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;

  if (question.id !== currentQuestionId) {
    setSelectedIndex(null);
    setHasFailed(false);
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

  const handleSelect = (index: number) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
      if (index !== question.correctAnswerIndex) {
        setHasFailed(true);
      }
    }
  };

  const handleCloseModal = () => {
    if (displayIsCorrect) {
      setSelectedIndex(null);
      setHasFailed(false);
      onContinue(!hasFailed);
    } else {
      setSelectedIndex(null);
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

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.cardWrapper}>
          <Card style={styles.scenarioCard}>
            {partLabel && (
              <Text style={styles.partLabelText}>{partLabel}</Text>
            )}
            <Text style={[styles.scenarioText, isSmallScreen && { fontSize: 25 }]}>{question.scenario}</Text>
          {question.prompt && (
            <Text style={[styles.promptText, isSmallScreen && { fontSize: 25 }]}>{question.prompt}</Text>
          )}
          </Card>
        </View>

        <View style={styles.optionsContainer}>
        {question.options.map((option, index) => {
          let state: 'default' | 'selected-correct' | 'selected-incorrect' | 'unselected-correct' = 'default';

          if (isAnswered) {
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
              disabled={isAnswered}
            />
          );
        })}
      </View>
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
                  {displayIsCorrect 
                    ? (showCoinReward ? 'Correct!' : "That's correct!") 
                    : "Not quite, try again!"}
                </Text>
              </View>
              
              {displayIsCorrect && showCoinReward && (
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

              {displayIsCorrect ? (
                <>
                  {showExplanation && (
                    <View style={styles.dashedExplanationContainer}>
                      <Text style={styles.explanationText}>{question.explanation}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
    padding: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.white,
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
    fontWeight: '400',
    lineHeight: 38,
    textAlign: 'left',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
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
  optionsContainer: {
    marginBottom: theme.spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Standardized white overlay
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

});
