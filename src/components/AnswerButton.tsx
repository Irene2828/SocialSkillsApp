import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { theme, FONTS } from '../theme';
import { ScalePressable } from './ScalePressable';
import { Ionicons } from '@expo/vector-icons';

interface AnswerButtonProps {
  text: string;
  onPress: () => void;
  state: 'default' | 'selected-correct' | 'selected-incorrect' | 'unselected-correct';
  disabled?: boolean;
}

export const AnswerButton: React.FC<AnswerButtonProps> = ({ text, onPress, state, disabled }) => {
  let buttonStyle = styles.defaultButton;
  let textStyle = styles.defaultText;
  let iconName: keyof typeof Ionicons.glyphMap = 'radio-button-off';
  let iconColor = theme.colors.border;

  switch (state) {
    case 'selected-correct':
    case 'unselected-correct':
      buttonStyle = styles.correctButton;
      textStyle = styles.correctText;
      iconName = 'checkmark-circle-outline';
      iconColor = theme.colors.success;
      break;
    case 'selected-incorrect':
      buttonStyle = styles.incorrectButton;
      textStyle = styles.incorrectText;
      iconName = 'close-circle-outline';
      iconColor = theme.colors.error;
      break;
    default:
      break;
  }

  const glassButton = state === 'default' ? {
    backgroundColor: 'rgba(224, 251, 252, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  } : {};

  const glassText = state === 'default' ? {
    color: '#0C4A6E',
  } : {};

  return (
    <ScalePressable
      style={[styles.button, buttonStyle, glassButton]}
      onPress={onPress}
      disabled={disabled}
    >
      {state === 'default' ? (
        <View style={styles.checkboxCircle} />
      ) : (
        <Ionicons name={iconName} size={24} color={iconColor} />
      )}
      <Text style={[styles.text, textStyle, glassText]}>{text}</Text>
    </ScalePressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    minHeight: theme.layout.minTouchTarget,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(224, 251, 252, 0.85)',
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  text: {
    ...theme.typography.body,
    flex: 1,
    paddingLeft: theme.spacing.md,
    fontFamily: FONTS.regular,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.15,
    fontWeight: '400',
  },
  defaultButton: {
    backgroundColor: 'rgba(224, 251, 252, 0.85)',
  },
  defaultText: {
    color: '#0C4A6E',
  },
  correctButton: {
    backgroundColor: 'transparent',
  },
  correctText: {
    color: theme.colors.secondaryText,
    fontWeight: '400',
  },
  incorrectButton: {
    backgroundColor: 'transparent',
  },
  incorrectText: {
    color: theme.colors.secondaryText,
  },
  checkboxCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(42, 30, 92, 0.45)',
    backgroundColor: 'transparent',
  },
});
