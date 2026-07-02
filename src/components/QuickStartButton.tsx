import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { ScalePressable } from './ScalePressable';
import { LinearGradient } from 'expo-linear-gradient';

interface QuickStartButtonProps {
  onPress: () => void;
}

export const QuickStartButton: React.FC<QuickStartButtonProps> = ({ onPress }) => {
  return (
    <ScalePressable style={styles.buttonContainer} onPress={onPress}>
      <LinearGradient
        colors={[theme.colors.primarySoft, theme.colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Ionicons name="play-circle-outline" size={32} color={theme.colors.text} style={styles.icon} />
        <Text style={styles.text}>Start Quick Quiz</Text>
      </LinearGradient>
    </ScalePressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.lg,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 4,
    backgroundColor: theme.colors.primary,
  },
  gradient: {
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  text: {
    ...theme.typography.heading,
    fontSize: 22,
    color: theme.colors.text,
  },
});
