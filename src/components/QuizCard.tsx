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
  onDelete?: () => void;
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

export const QuizCard: React.FC<QuizCardProps> = ({ category, onPressStart, onDelete }) => {
  return (
    <ScalePressable onPress={onPressStart} style={styles.container}>
      <Card style={styles.card}>
        {category.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
        {onDelete && (
          <ScalePressable 
            style={styles.deleteButton} 
            onPress={(e: any) => {
              if (e && e.stopPropagation) e.stopPropagation();
              onDelete();
            }}
          >
            <Ionicons name="remove" size={16} color="#FFFFFF" />
          </ScalePressable>
        )}
        <View style={styles.iconContainer}>
          <Ionicons name={getCategoryIcon(category.id)} size={32} color="#4B5563" style={styles.icon} />
        </View>
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
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.errorSoft,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#84CC16', // Lime green
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  newBadgeText: {
    ...theme.typography.body,
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  iconContainer: {
    marginBottom: theme.spacing.md,
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(190, 242, 100, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  title: {
    ...theme.typography.body,
    fontWeight: '600',
    textAlign: 'center',
  },
});
