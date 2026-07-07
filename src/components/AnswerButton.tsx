import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { theme } from '../theme';
import { ScalePressable } from './ScalePressable';
import { Ionicons } from '@expo/vector-icons';
import { useMood } from '../context/MoodContext';

interface AnswerButtonProps {
  text: string;
  onPress: () => void;
  state: 'default' | 'selected-correct' | 'selected-incorrect' | 'unselected-correct';
  disabled?: boolean;
}

export const AnswerButton: React.FC<AnswerButtonProps> = ({ text, onPress, state, disabled }) => {
  const { mood } = useMood();
  const isRocket = mood === 'rocket';

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

  // Glass style overrides for Rocket theme (default state only)
  const glassButton = isRocket && state === 'default' ? {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    shadowOpacity: 0.08,
  } : {};

  const glassText = isRocket && state === 'default' ? {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  } : {};

  return (
    <ScalePressable
      style={[styles.button, buttonStyle, glassButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle, glassText]}>{text}</Text>
      {state === 'default' ? (
        <View style={[styles.checkboxCircle, isRocket && { borderColor: 'rgba(255, 255, 255, 0.6)' }]} />
      ) : (
        <Ionicons name={iconName} size={24} color={iconColor} />
      )}
    </ScalePressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: theme.layout.minTouchTarget,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    ...theme.shadows.soft,
  },
  text: {
    ...theme.typography.body,
    flex: 1,
    paddingRight: theme.spacing.md,
    fontWeight: '400',
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
  checkboxCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: 'transparent',
  },
});
