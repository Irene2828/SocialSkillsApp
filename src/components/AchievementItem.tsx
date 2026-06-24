import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export interface Achievement {
  id: string;
  title: string;
}

interface AchievementItemProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

export const AchievementItem: React.FC<AchievementItemProps> = ({ achievement, isUnlocked }) => {
  return (
    <Card style={[styles.card, !isUnlocked && styles.lockedCard]}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name={isUnlocked ? 'checkmark-circle' : 'lock-closed'} 
          size={24} 
          color={isUnlocked ? theme.colors.success : theme.colors.secondaryText} 
        />
      </View>
      <Text style={[styles.title, !isUnlocked && styles.lockedText]}>
        {achievement.title} {isUnlocked ? '' : '(locked)'}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  lockedCard: {
    backgroundColor: theme.colors.neutralGrey,
    opacity: 0.7,
  },
  iconContainer: {
    marginRight: theme.spacing.md,
  },
  title: {
    ...theme.typography.body,
    fontWeight: '600',
    flex: 1,
  },
  lockedText: {
    color: theme.colors.secondaryText,
  },
});
