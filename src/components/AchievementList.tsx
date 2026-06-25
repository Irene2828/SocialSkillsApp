import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AchievementItem, Achievement } from './AchievementItem';
import { theme } from '../theme';

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_quiz', title: 'First Quiz Completed' },
  { id: 'five_quizzes', title: '5 Quizzes Completed' },
  { id: 'ten_quizzes', title: '10 Quizzes Completed' },
  { id: 'twenty_five_correct', title: '25 Correct Answers Total' },
  { id: 'first_coin', title: 'First Coin Earned' },
  { id: 'three_day_streak', title: '3-Day Explorer' },
];

interface AchievementListProps {
  unlockedIds: string[];
}

export const AchievementList: React.FC<AchievementListProps> = ({ unlockedIds }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Achievements</Text>
      {ALL_ACHIEVEMENTS.map(ach => (
        <AchievementItem 
          key={ach.id} 
          achievement={ach} 
          isUnlocked={unlockedIds.includes(ach.id)} 
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.md,
  },
  headerTitle: {
    ...theme.typography.heading,
    fontSize: 22,
    marginBottom: theme.spacing.md,
  },
});
