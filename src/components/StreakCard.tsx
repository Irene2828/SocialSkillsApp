import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface StreakCardProps {
  streak: number;
}

export const StreakCard: React.FC<StreakCardProps> = ({ streak }) => {
  let message = "Let's build a habit!";
  if (streak === 1) message = "Great start!";
  else if (streak > 1 && streak < 5) message = "Keep it going!";
  else if (streak >= 5) message = "You're building a habit!";
  else if (streak >= 14) message = "Habit master!";

  return (
    <Card style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name="flame" size={32} color={theme.colors.accent} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.streakText}>Streak: {streak} days</Text>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.successSoft,
    borderColor: theme.colors.success,
    borderWidth: 1,
  },
  iconContainer: {
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  textContainer: {
    flex: 1,
  },
  streakText: {
    ...theme.typography.heading,
    fontSize: 20,
    color: theme.colors.text,
  },
  messageText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
});
