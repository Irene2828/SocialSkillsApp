import React from 'react';
import { Text, StyleSheet, PressableProps, View } from 'react-native';
import { ScalePressable } from './ScalePressable';
import { theme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary';
  style?: any;
}

export const Button: React.FC<ButtonProps> = ({ title, variant = 'primary', style, ...props }) => {
  const isPrimary = variant === 'primary';

  const content = (
    <Text style={[styles.text, isPrimary ? styles.primaryText : styles.secondaryText]}>
      {title}
    </Text>
  );

  return (
    <ScalePressable
      style={[
        styles.button,
        isPrimary && styles.primaryButtonContainer,
        !isPrimary && styles.secondaryButton,
        style,
      ]}
      {...props}
    >
      {isPrimary ? (
        <LinearGradient
          colors={['#A78BFA', '#4C1D95']} // Whitish purple glow fading to deep dark purple
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryGradient}
        >
          {content}
        </LinearGradient>
      ) : (
        content
      )}
    </ScalePressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: theme.layout.minTouchTarget,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonContainer: {
    borderRadius: theme.borderRadius.full,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 4,
    backgroundColor: '#4C1D95',
  },
  primaryGradient: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  text: {
    ...theme.typography.button,
  },
  primaryText: {
    color: theme.colors.white,
  },
  secondaryText: {
    color: theme.colors.text,
  },
});
