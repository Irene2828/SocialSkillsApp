import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Modal, useWindowDimensions, Pressable, ScrollView } from 'react-native';
import { SocialQuestion, SocialPracticeQuiz } from '../data/types';
import { AnswerButton } from './AnswerButton';
import { Button } from './Button';
import { theme, FONTS } from '../theme';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SilverDust } from './SilverDust';
import { useMood } from '../context/MoodContext';
import { useRewards } from '../context/RewardsContext';

interface SocialPracticeQuestionViewProps {
  quiz: SocialPracticeQuiz;
  question: SocialQuestion;
  onContinue: (isCorrect: boolean) => void;
  disabled?: boolean;
}

export const SocialPracticeQuestionView: React.FC<SocialPracticeQuestionViewProps> = ({
  quiz,
  question,
  onContinue,
  disabled
}) => {
  const { mood } = useMood();
  const { isRewardsModeOn } = useRewards();
  const isRocket = mood === 'rocket';
  
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasFailed, setHasFailed] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(question.id);
  const { width } = useWindowDimensions();

  const glassTextShadow = isRocket ? {
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  } : {};

  if (question.id !== currentQuestionId) {
    setSelectedIndex(null);
    setHasFailed(false);
    setCurrentQuestionId(question.id);
  }
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

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
      if (!question.options[index].isAccepted) {
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
  const isCorrect = isAnswered && question.options[selectedIndex].isAccepted;

  const displayIsCorrectRef = useRef(isCorrect);
  if (isAnswered) {
    displayIsCorrectRef.current = isCorrect;
  }
  const displayIsCorrect = isAnswered ? isCorrect : displayIsCorrectRef.current;

  const questionIndex = quiz.questions.findIndex(q => q.id === question.id);
  const questionNum = questionIndex !== -1 ? questionIndex + 1 : 1;

  return (
    <View style={styles.container}>
      <View style={styles.unifiedCard}>
        <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          
          <View style={styles.problemSheet}>
            <View style={styles.storyCallout}>
              <Text style={styles.calloutLabel}>
                Situation
              </Text>
              <Text style={styles.storyCalloutText}>
                {quiz.situation.introduction}
              </Text>
            </View>

            <View style={{ marginTop: theme.spacing.md }}>
              <Text style={styles.calloutLabel}>
                Question {questionNum}
              </Text>
              <Text style={styles.problemQuestionText}>
                {question.prompt}
              </Text>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => {
              let state: 'default' | 'selected-correct' | 'selected-incorrect' | 'unselected-correct' = 'default';

              if (isAnswered) {
                if (isCorrect) {
                  state = index === selectedIndex ? 'selected-correct' : 'default';
                } else {
                  if (index === selectedIndex) {
                    state = 'selected-incorrect';
                  }
                }
              }

              return (
                <AnswerButton
                  key={index}
                  text={option.text}
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
          <Pressable style={[styles.modalOverlay, isRocket && { backgroundColor: 'rgba(224, 251, 252, 0.96)' }]} onPress={handleCloseModal}>
            {displayIsCorrect && isRewardsModeOn && <SilverDust />}
            <Pressable style={[styles.feedbackContainerBackground]} onPress={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); }}>
              <View style={styles.feedbackContainer}>
                
                <View style={styles.feedbackTitleContainer}>
                  <Text style={[styles.feedbackTitle, isRocket && { color: '#0C4A6E' }]}>
                    {displayIsCorrect ? "Good choice!" : "Let's think about this..."}
                  </Text>
                </View>
                
                {displayIsCorrect && isRewardsModeOn && !hasFailed && (
                  <View style={styles.coinRewardContainer}>
                    <FontAwesome5 name="coins" size={20} color="#0C4A6E" style={{ marginRight: 8 }} />
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[styles.coinRewardText, { fontFamily: FONTS.semiBold, fontSize: 20, color: '#0C4A6E' }]}>
                        +1 Coin Earned!
                      </Text>
                    </View>
                  </View>
                )}

                {selectedIndex !== null && (
                  <View style={[styles.dashedExplanationContainer, isRocket && { borderColor: 'rgba(255, 255, 255, 0.5)', backgroundColor: 'rgba(224, 251, 252, 0.85)' }]}>
                    <Text style={[styles.explanationText, isRocket && { color: '#0C4A6E' }]}>
                      {question.options[selectedIndex].feedback}
                    </Text>
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
    paddingHorizontal: 12,
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
  problemSheet: {
    width: '100%',
    backgroundColor: 'rgba(224, 251, 252, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  storyCallout: {
    marginBottom: theme.spacing.sm,
  },
  calloutLabel: {
    ...theme.typography.label,
    fontFamily: FONTS.semiBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.8,
    color: 'rgba(42, 30, 92, 0.72)',
    marginBottom: 3,
  },
  storyCalloutText: {
    ...theme.typography.body,
    fontFamily: FONTS.medium,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    letterSpacing: 0.18,
    color: '#0C4A6E',
  },
  problemQuestionText: {
    ...theme.typography.body,
    fontFamily: FONTS.medium,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    letterSpacing: 0.18,
    color: '#0C4A6E',
  },
  optionsContainer: {
    marginBottom: theme.spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(224, 251, 252, 0.96)',
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
    color: '#0C4A6E',
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
    color: '#0C4A6E',
    marginLeft: theme.spacing.xs,
  },
  dashedExplanationContainer: {
    width: '100%',
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: 'rgba(224, 251, 252, 0.85)',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.md,
  },
  explanationText: {
    ...theme.typography.body,
    fontSize: 18,
    textAlign: 'center',
    color: '#0C4A6E',
  },
  continueButton: {
    marginTop: theme.spacing.sm,
    width: '100%',
  }
});
