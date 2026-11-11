import React, { useState } from 'react';
import { Text, StyleSheet, PressableProps, View, useWindowDimensions } from 'react-native';
import { ScalePressable } from './ScalePressable';
import { theme } from '../theme';
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
  const resolvedIconColor = iconColor || (isPrimary || (isOutline && isPressed) ? theme.colors.background : theme.colors.text);

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
        isPrimary && styles.primaryButtonContainer,
        isSecondary && styles.secondaryButton,
        isOutline && styles.outlineButton,
        isOutline && isPressed && styles.outlineButtonPressed,
        isTablet && (isPrimary || isSecondary) && { maxWidth: 360, alignSelf: 'center' },
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
    ...theme.shadows.soft,
  },
  primaryButtonContainer: {
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  secondaryButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.neutralGrey,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    borderRadius: theme.borderRadius.full,
    minHeight: theme.layout.minTouchTarget,
  },
  outlineButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.stroke,
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
    color: theme.colors.background,
  },
  secondaryText: {
    color: theme.colors.text,
  },
  outlineText: {
    color: theme.colors.text,
  },
});
