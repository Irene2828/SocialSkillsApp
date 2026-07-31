import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../theme';

export const Card: React.FC<ViewProps> = ({ children, style, ...props }) => {
  const flattenedStyle = StyleSheet.flatten(style) || {};

  const glassStyle = {
    backgroundColor: 'rgba(8, 28, 54, 0.65)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    shadowOpacity: 0,
    elevation: 0,
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
    backgroundColor: 'rgba(8, 28, 54, 0.65)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowOpacity: 0,
    elevation: 0,
  },
});
