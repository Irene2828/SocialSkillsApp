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
    backgroundColor: 'rgba(255, 255, 255, 0.055)',
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    shadowOpacity: 0,
    elevation: 0,
  } : {};

  const glassText = state === 'default' ? {
    color: theme.colors.text,
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
    backgroundColor: 'rgba(255, 255, 255, 0.055)',
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  text: {
    ...theme.typography.body,
    flex: 1,
    paddingLeft: theme.spacing.md,
    fontFamily: FONTS.medium,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500',
  },
  defaultButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.055)',
  },
  defaultText: {
    color: theme.colors.text,
  },
  correctButton: {
    backgroundColor: 'transparent',
  },
  correctText: {
    color: theme.colors.text,
    fontWeight: '600',
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
    borderColor: 'rgba(255, 255, 255, 0.48)',
    backgroundColor: 'transparent',
  },
});
