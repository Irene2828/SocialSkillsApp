import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progressPercentage = (current / total) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Question {current} / {total}
      </Text>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${progressPercentage}%` }]} />
      </View>
      <Text style={styles.percentageText}>{Math.round(progressPercentage)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
  },
  text: {
    ...theme.typography.body,
    fontSize: 18,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  percentageText: {
    ...theme.typography.caption,
    textAlign: 'left',
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.md,
  },
  barBackground: {
    height: 8,
    backgroundColor: '#D1C6DE',
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#9E85BA',
    borderRadius: theme.borderRadius.full,
  },
});
