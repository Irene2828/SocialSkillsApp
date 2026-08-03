import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

export const Card: React.FC<ViewProps> = ({ children, style, ...props }) => {
  const flattenedStyle = StyleSheet.flatten(style) || {};
  const { backgroundColor, ...otherStyles } = flattenedStyle;

  const combinedStyle = {
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
    ...otherStyles,
  };

  return (
    <LinearGradient
      colors={['rgba(224, 251, 252, 0.85)', 'rgba(224, 251, 252, 0.85)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={combinedStyle}
      {...props}
    >
      {children}
    </LinearGradient>
  );
};

