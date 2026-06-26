import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
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

      {isAnswered && (
        <View style={styles.feedbackContainer}>
          <View style={styles.feedbackTitleContainer}>
            <Ionicons 
              name={isCorrect ? "checkmark-circle" : "ellipse"} 
              size={24} 
              color={isCorrect ? theme.colors.success : theme.colors.secondaryText} 
              style={styles.feedbackIcon}
            />
            <Text style={[styles.feedbackTitle, isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect]}>
              {isCorrect ? 'Correct' : "Not quite, try again!"}
            </Text>
          </View>
          
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
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scenarioCard: {
    marginBottom: theme.spacing.lg,
    backgroundColor: 'rgba(76, 29, 149, 0.1)',
  },
  scenarioText: {
    ...theme.typography.heading,
    fontSize: 22,
    lineHeight: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: theme.spacing.lg,
  },
  feedbackContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.soft,
  },
  feedbackTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  feedbackIcon: {
    marginRight: theme.spacing.xs,
  },
  feedbackTitle: {
    ...theme.typography.heading,
    fontSize: 20,
  },
  feedbackCorrect: {
    color: theme.colors.success,
  },
  feedbackIncorrect: {
    color: theme.colors.secondaryText,
  },
  explanationText: {
    ...theme.typography.body,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    color: theme.colors.secondaryText,
  },
  continueButton: {
    marginTop: theme.spacing.sm,
  },
});
