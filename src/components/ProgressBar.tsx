import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface ProgressBarProps {
  current: number;
  total: number;
  rightElement?: React.ReactNode;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, rightElement }) => {
  const progressPercentage = (current / total) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.text}>
          Question {current} / {total}
        </Text>
        {rightElement && (
          <View style={styles.rightElementContainer}>
            {rightElement}
          </View>
        )}
      </View>
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  text: {
    ...theme.typography.body,
    fontSize: 18,
    color: theme.colors.text,
    textAlign: 'center',
  },
  rightElementContainer: {
    position: 'absolute',
    right: 0,
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
