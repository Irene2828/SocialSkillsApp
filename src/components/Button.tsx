import React, { useState } from 'react';
import { Text, StyleSheet, PressableProps, View, useWindowDimensions } from 'react-native';
import { ScalePressable } from './ScalePressable';
import { theme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: any;
  iconName?: any;
  iconSize?: number;
  iconColor?: string;
  iconStyle?: any;
  textStyle?: any;
}

export const Button: React.FC<ButtonProps> = ({ title, variant = 'primary', style, onPressIn, onPressOut, iconName, iconSize, iconColor, iconStyle, textStyle, ...props }) => {
  const [isPressed, setIsPressed] = useState(false);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';

  let resolvedTextStyle: any = styles.secondaryText;
  if (isPrimary || (isOutline && isPressed)) {
    resolvedTextStyle = styles.primaryText;
  } else if (isOutline) {
    resolvedTextStyle = styles.outlineText;
  }
  const resolvedIconColor = iconColor || (isPrimary || (isOutline && isPressed) ? '#0F1A2C' : theme.colors.text);

  const content = (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={[styles.text, resolvedTextStyle, textStyle, { flexShrink: 1 }]} numberOfLines={1} adjustsFontSizeToFit>
        {title}
      </Text>
      {iconName && (
        <Ionicons 
          name={iconName} 
          size={iconSize || 20} 
          color={resolvedIconColor}
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
        isOutline && styles.outlineButton,
        isOutline && isPressed && [styles.outlineButtonPressed, { backgroundColor: theme.colors.primary }],
        isTablet && (isPrimary || isSecondary) && { maxWidth: 360, alignSelf: 'center' },
        style,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      {isPrimary && (
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0)']}
          style={[StyleSheet.absoluteFill, { borderRadius: theme.borderRadius.full }]}
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
    borderColor: 'rgba(255, 255, 255, 0.14)',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0,
    shadowRadius: 28,
    elevation: 0,
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
    backgroundColor: 'rgba(56, 189, 248, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.28)',
    borderRadius: theme.borderRadius.full,
    minHeight: theme.layout.minTouchTarget,
  },
  outlineButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.20)',
    borderRadius: theme.borderRadius.full,
    minHeight: theme.layout.minTouchTarget,
  },
  outlineButtonPressed: {
    backgroundColor: theme.colors.primary,
  },
  text: {
    ...theme.typography.button,
    fontWeight: '500',
  },
  primaryText: {
    color: '#0F1A2C',
  },
  secondaryText: {
    color: theme.colors.text,
  },
  outlineText: {
    color: theme.colors.text,
  },
});
