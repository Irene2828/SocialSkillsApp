import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform, Modal, Image } from 'react-native';
import { Question } from '../data/types';
import { Card } from './Card';
import { AnswerButton } from './AnswerButton';
import { Button } from './Button';
import { theme } from '../theme';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

interface QuestionViewProps {
  question: Question;
  onContinue: (isCorrect: boolean) => void;
  disabled?: boolean;
  topicName?: string;
}

export const QuestionView: React.FC<QuestionViewProps> = ({ question, onContinue, disabled, topicName }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasFailed, setHasFailed] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  // Reset state and trigger animation when question changes
  useEffect(() => {
    setSelectedIndex(null);
    setHasFailed(false);
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

  const isAnswered = selectedIndex !== null;
  const isCorrect = selectedIndex === question.correctAnswerIndex;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.cardWrapper}>
          <Card style={styles.scenarioCard}>
            <Text style={styles.scenarioText}>{question.scenario}</Text>
          {question.prompt && (
            <Text style={styles.promptText}>{question.prompt}</Text>
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
        <View style={styles.modalOverlay}>
          <View style={styles.feedbackContainerBackground}>
            <View style={styles.feedbackContainer}>
              <View style={styles.feedbackTitleContainer}>
                <Text style={styles.feedbackTitle}>
                  {isCorrect ? 'Correct!' : "Not quite, try again!"}
                </Text>
              </View>
              
              {isCorrect && (
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
                  <Text style={styles.coinRewardText}>+1 Coin!</Text>
                </View>
              )}

              {isCorrect && (
                <Text style={styles.explanationText}>{question.explanation}</Text>
              )}

              {isCorrect ? (
                <Button
                  title="Continue"
                  onPress={() => onContinue(!hasFailed)}
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
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardWrapper: {
    position: 'relative',
    marginTop: theme.spacing.lg,
  },
  folderTab: {
    position: 'absolute',
    top: -30,
    right: 20,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    borderBottomWidth: 0,
    zIndex: -1, // Keep it visually attached behind the rounded edge if needed, or zIndex 1
  },
  folderTabText: {
    ...theme.typography.body,
    fontWeight: '600',
    fontSize: 14,
    color: theme.colors.text,
  },
  animatedContainer: {
    flex: 1,
  },
  scenarioCard: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
  },
  scenarioText: {
    ...theme.typography.heading,
    fontFamily: theme.typography.fontFamily,
    fontSize: 27,
    fontWeight: '400',
    fontStyle: 'italic',
    lineHeight: 38,
    textAlign: 'left',
    color: '#111827',
  },
  promptText: {
    ...theme.typography.heading,
    fontFamily: theme.typography.fontFamily,
    fontSize: 27,
    fontWeight: '400',
    fontStyle: 'italic',
    lineHeight: 38,
    textAlign: 'left',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  optionsContainer: {
    marginBottom: theme.spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(229, 231, 235, 0.85)', // Silver-grey glass effect
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  feedbackContainerBackground: {
    width: '85%',
    maxWidth: 400,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: theme.colors.stroke,
    backgroundColor: theme.colors.white,
    ...theme.shadows.glow,
  },
  feedbackContainer: {
    padding: theme.spacing.xl,
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
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: '#374151',
  },
  explanationText: {
    ...theme.typography.body,
    fontSize: 17,
    fontStyle: 'italic',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    color: theme.colors.secondaryText,
  },
  coinRewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  coinRewardText: {
    ...theme.typography.heading,
    color: theme.colors.text,
    fontSize: 20,
    marginLeft: theme.spacing.xs,
  },
  continueButton: {
    marginTop: theme.spacing.sm,
    width: '100%',
  },
});
