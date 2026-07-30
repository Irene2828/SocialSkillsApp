import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../theme';

export const Card: React.FC<ViewProps> = ({ children, style, ...props }) => {
  const flattenedStyle = StyleSheet.flatten(style) || {};

  const glassStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.055)',
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    shadowOpacity: 0,
    elevation: 0,
  };

  const combinedStyle = {
    ...flattenedStyle,
    ...glassStyle,
  };

  return (
    <View style={[styles.card, combinedStyle]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.055)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    shadowOpacity: 0,
    elevation: 0,
  },
});
