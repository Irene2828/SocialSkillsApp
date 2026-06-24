import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

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
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: theme.layout.minTouchTarget,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    justifyContent: 'center',
  },
  text: {
    ...theme.typography.body,
    textAlign: 'center',
  },
  defaultButton: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
  },
  defaultText: {
    color: theme.colors.text,
  },
  correctButton: {
    backgroundColor: '#E8F5E9',
    borderColor: theme.colors.success,
  },
  correctText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  incorrectButton: {
    backgroundColor: '#FFEBEE',
    borderColor: '#EF5350',
  },
  incorrectText: {
    color: '#C62828',
    fontWeight: '600',
  },
});
