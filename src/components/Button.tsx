import React, { useState } from 'react';
import { Text, StyleSheet, PressableProps, View } from 'react-native';
import { ScalePressable } from './ScalePressable';
import { theme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useMood, getMoodColors } from '../context/MoodContext';

import { Ionicons } from '@expo/vector-icons';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: any;
  iconName?: any;
  iconSize?: number;
  iconColor?: string;
  iconStyle?: any;
}

export const Button: React.FC<ButtonProps> = ({ title, variant = 'primary', style, onPressIn, onPressOut, iconName, iconSize, iconColor, iconStyle, ...props }) => {
  const [isPressed, setIsPressed] = useState(false);
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  const isRocket = mood === 'rocket';

  let textStyle: any = styles.secondaryText;
  if (isPrimary || (isOutline && isPressed)) {
    textStyle = styles.primaryText;
  } else if (isOutline) {
    textStyle = [styles.outlineText, isRocket && { color: '#FFFFFF' }];
  }

  const content = (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={[styles.text, textStyle]} numberOfLines={1} adjustsFontSizeToFit>
        {title}
      </Text>
      {iconName && (
        <Ionicons 
          name={iconName} 
          size={iconSize || 18} 
          color={iconColor || theme.colors.text} 
          style={[{ marginLeft: 6 }, iconStyle]} 
        />
      )}
    </View>
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
        isOutline && [styles.outlineButton, isRocket && { borderColor: '#FFFFFF' }],
        isOutline && isPressed && [styles.outlineButtonPressed, { backgroundColor: theme.colors.primary }],
        style,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      {isPrimary && (
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      )}
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
    overflow: 'hidden',
  },
  primaryButtonContainer: {
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
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
    fontWeight: '500',
  },
  primaryText: {
    color: '#374151',
  },
  secondaryText: {
    color: '#374151',
  },
  outlineText: {
    color: '#374151',
  },
});
