import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform, Modal, ImageBackground } from 'react-native';
import { Question } from '../data/types';
import { Card } from './Card';
import { AnswerButton } from './AnswerButton';
import { Button } from './Button';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface QuestionViewProps {
  question: Question;
  onContinue: (isCorrect: boolean) => void;
  disabled?: boolean;
}

export const QuestionView: React.FC<QuestionViewProps> = ({ question, onContinue, disabled }) => {
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
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Card style={styles.scenarioCard}>
        <Text style={styles.scenarioText}>{question.scenario}</Text>
      </Card>

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

      <Modal
        visible={isAnswered}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <ImageBackground 
            source={require('../../assets/scandi_bg_pattern.png')} 
            style={styles.feedbackContainerBackground}
            imageStyle={{ borderRadius: theme.borderRadius.lg }}
            resizeMode="cover"
          >
            <View style={styles.feedbackContainer}>
              <View style={styles.feedbackTitleContainer}>
                <Text style={styles.feedbackTitle}>
                  {isCorrect ? 'Correct!' : "Not quite, try again!"}
                </Text>
              </View>
              
              {isCorrect && (
                <Text style={styles.explanationText}>{question.explanation}</Text>
              )}

              {isCorrect && (
                <View style={styles.coinRewardContainer}>
                  <Ionicons name="cash" size={24} color={theme.colors.success} />
                  <Text style={styles.coinRewardText}>+1 Coin!</Text>
                </View>
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
          </ImageBackground>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scenarioCard: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: '#374151',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    elevation: 0,
    shadowOpacity: 0,
  },
  scenarioText: {
    ...theme.typography.heading,
    fontFamily: Platform.select({
      ios: 'Chalkboard SE',
      android: 'casual',
      default: 'Comic Sans MS',
    }),
    fontSize: 26, // Slightly larger for comic fonts
    lineHeight: 34,
    letterSpacing: 0.5,
    textAlign: 'center',
    fontWeight: '700',
    color: '#211C27',
  },
  optionsContainer: {
    marginBottom: theme.spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  feedbackContainerBackground: {
    width: '100%',
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.glow,
  },
  feedbackContainer: {
    width: '100%',
    padding: theme.spacing.xl,
    backgroundColor: 'transparent',
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
    color: theme.colors.success,
    fontSize: 20,
    marginLeft: theme.spacing.xs,
  },
  continueButton: {
    marginTop: theme.spacing.sm,
  },
});
