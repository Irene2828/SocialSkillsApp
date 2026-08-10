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
      iconColor = '#0C4A6E';
      break;
    case 'selected-incorrect':
      buttonStyle = styles.incorrectButton;
      textStyle = styles.incorrectText;
      iconName = 'close-circle-outline';
      iconColor = theme.colors.danger; // nice rose/red color
      break;
    default:
      break;
  }

  const glassButton = {
    backgroundColor: 'rgba(255, 255, 255, 0.93)',
    borderColor: state === 'selected-correct' || state === 'unselected-correct'
      ? '#BEF264'
      : state === 'selected-incorrect'
        ? '#EF8B8B'
        : 'rgba(255, 255, 255, 0.45)',
    borderWidth: state !== 'default' ? 2 : 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  };

  const glassText = {
    color: '#0C4A6E', // highly readable dark blue
  };

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
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  text: {
    ...theme.typography.body,
    flex: 1,
    paddingLeft: theme.spacing.md,
    fontFamily: FONTS.regular,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.15,
    fontWeight: '400',
  },
  defaultButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  defaultText: {
    color: '#F8FAFC',
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
    borderColor: 'rgba(12, 74, 110, 0.5)',
    backgroundColor: 'transparent',
  },
});
