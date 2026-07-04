import React, { useState } from 'react';
import { Text, StyleSheet, PressableProps, View } from 'react-native';
import { ScalePressable } from './ScalePressable';
import { theme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useMood, getMoodColors } from '../context/MoodContext';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: any;
}

export const Button: React.FC<ButtonProps> = ({ title, variant = 'primary', style, onPressIn, onPressOut, ...props }) => {
  const [isPressed, setIsPressed] = useState(false);
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';

  let textStyle = styles.secondaryText;
  if (isPrimary || (isOutline && isPressed)) {
    textStyle = styles.primaryText;
  } else if (isOutline) {
    textStyle = styles.outlineText;
  }

  const content = (
    <Text style={[styles.text, textStyle]} numberOfLines={1} adjustsFontSizeToFit>
      {title}
    </Text>
  );

  const handlePressIn = (e: any) => {
    setIsPressed(true);
    if (onPressIn) onPressIn(e);
  };

  const handlePressOut = (e: any) => {
    setIsPressed(false);
    if (onPressOut) onPressOut(e);
  };

  return (
    <ScalePressable
      style={[
        styles.button,
        isPrimary && [styles.primaryButtonContainer, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }],
        isSecondary && styles.secondaryButton,
        isOutline && styles.outlineButton,
        isOutline && isPressed && [styles.outlineButtonPressed, { backgroundColor: theme.colors.primary }],
        style,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      {content}
    </ScalePressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: theme.layout.minTouchTarget,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonContainer: {
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  primaryGradient: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.errorSoft,
    borderWidth: 0,
    borderRadius: theme.borderRadius.full,
  },
  outlineButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.text,
    borderRadius: theme.borderRadius.full,
  },
  outlineButtonPressed: {
    backgroundColor: theme.colors.primary,
  },
  text: {
    ...theme.typography.button,
  },
  primaryText: {
    color: theme.colors.text,
  },
  secondaryText: {
    color: theme.colors.text,
  },
  outlineText: {
    color: theme.colors.text,
  },
});
