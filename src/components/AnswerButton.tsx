import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { theme } from '../theme';
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
      iconName = 'checkmark-circle';
      iconColor = theme.colors.success;
      break;
    case 'selected-incorrect':
      buttonStyle = styles.incorrectButton;
      textStyle = styles.incorrectText;
      iconName = 'close-circle';
      iconColor = theme.colors.error;
      break;
    default:
      break;
  }

  return (
    <ScalePressable
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle]}>{text}</Text>
      <Ionicons name={iconName} size={24} color={iconColor} />
    </ScalePressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: theme.layout.minTouchTarget,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    ...theme.shadows.soft,
  },
  text: {
    ...theme.typography.body,
    flex: 1,
    paddingRight: theme.spacing.md,
    fontWeight: '500',
  },
  defaultButton: {
    backgroundColor: theme.colors.white,
  },
  defaultText: {
    color: '#111827',
  },
  correctButton: {
    backgroundColor: theme.colors.successSoft,
  },
  correctText: {
    color: theme.colors.text,
  },
  incorrectButton: {
    backgroundColor: theme.colors.errorSoft,
  },
  incorrectText: {
    color: theme.colors.secondaryText,
  },
});
