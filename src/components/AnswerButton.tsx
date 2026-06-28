import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { ScalePressable } from './ScalePressable';

interface AnswerButtonProps {
  text: string;
  onPress: () => void;
  state: 'default' | 'selected-correct' | 'selected-incorrect' | 'unselected-correct';
  disabled?: boolean;
}

export const AnswerButton: React.FC<AnswerButtonProps> = ({ text, onPress, state, disabled }) => {
  let buttonStyle = styles.defaultButton;
  let textStyle = styles.defaultText;

  switch (state) {
    case 'selected-correct':
    case 'unselected-correct':
      buttonStyle = styles.correctButton;
      textStyle = styles.correctText;
      break;
    case 'selected-incorrect':
      buttonStyle = styles.incorrectButton;
      textStyle = styles.incorrectText;
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
    </ScalePressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: theme.layout.minTouchTarget,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1.5,
    justifyContent: 'center',
  },
  text: {
    ...theme.typography.body,
    textAlign: 'center',
  },
  defaultButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: theme.colors.primary,
  },
  defaultText: {
    color: theme.colors.text,
  },
  correctButton: {
    backgroundColor: theme.colors.successSoft,
    borderColor: theme.colors.success,
  },
  correctText: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  incorrectButton: {
    backgroundColor: theme.colors.neutralGrey,
    borderColor: theme.colors.neutralGrey,
  },
  incorrectText: {
    color: theme.colors.secondaryText,
    fontWeight: '600',
  },
});
