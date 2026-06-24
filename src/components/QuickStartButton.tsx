import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface QuickStartButtonProps {
  onPress: () => void;
}

export const QuickStartButton: React.FC<QuickStartButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name="play-circle" size={32} color={theme.colors.white} style={styles.icon} />
      <Text style={styles.text}>Start Quick Quiz</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  text: {
    ...theme.typography.heading,
    fontSize: 22,
    color: theme.colors.white,
  },
});
