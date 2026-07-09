import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../theme';
import { useMood } from '../context/MoodContext';

export const Card: React.FC<ViewProps> = ({ children, style, ...props }) => {
  const { mood } = useMood();
  const isRocket = mood === 'rocket';

  const flattenedStyle = StyleSheet.flatten(style) || {};

  const glassStyle = isRocket ? {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 0.1,
  } : {};

  const combinedStyle = isRocket ? {
    ...flattenedStyle,
    ...glassStyle,
  } : style;

  return (
    <View style={[styles.card, combinedStyle]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    borderWidth: 2,
    borderColor: theme.colors.stroke,
    ...theme.shadows.soft,
  },
});
