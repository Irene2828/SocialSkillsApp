import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../theme';

export const Card: React.FC<ViewProps> = ({ children, style, ...props }) => {
  const flattenedStyle = StyleSheet.flatten(style) || {};

  const glassStyle = {
    backgroundColor: 'rgba(224, 251, 252, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  };

  const combinedStyle = {
    ...glassStyle,
    ...flattenedStyle,
  };

  return (
    <View style={[styles.card, combinedStyle]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(224, 251, 252, 0.85)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
});
