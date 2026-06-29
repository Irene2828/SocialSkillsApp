import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { theme } from '../theme';
import { QuizCategory } from '../data/types';
import { Ionicons } from '@expo/vector-icons';
import { ScalePressable } from './ScalePressable';

interface QuizCardProps {
  category: QuizCategory;
  onPressStart: () => void;
}

const getCategoryIcon = (id: string): any => {
  switch (id) {
    case 'Friendship': return 'people-outline';
    case 'Manners': return 'school-outline';
    case 'Feelings': return 'heart-outline';
    case 'Playground': return 'basketball-outline';
    case 'Safety': return 'shield-checkmark-outline';
    default: return 'book-outline';
  }
};

export const QuizCard: React.FC<QuizCardProps> = ({ category, onPressStart }) => {
  return (
    <ScalePressable onPress={onPressStart} style={styles.container}>
      <Card style={styles.card}>
        <Ionicons name={getCategoryIcon(category.id)} size={32} color="#65A30D" style={styles.icon} />
        <Text style={styles.title} numberOfLines={2}>{category.title}</Text>
      </Card>
    </ScalePressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: theme.spacing.xs,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    minHeight: 140,
  },
  icon: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.body,
    fontWeight: '600',
    textAlign: 'center',
  },
});
