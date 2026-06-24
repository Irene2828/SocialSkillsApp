import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Button } from './Button';
import { theme } from '../theme';
import { QuizCategory } from '../data/types';

interface QuizCardProps {
  category: QuizCategory;
  onPressStart: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ category, onPressStart }) => {
  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.title}>{category.title}</Text>
        <Text style={styles.description}>{category.description}</Text>
      </View>
      <Button title="Start Quiz" onPress={onPressStart} />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
  },
  content: {
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.heading,
    fontSize: 20,
    marginBottom: theme.spacing.xs,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.secondaryText,
  },
});
