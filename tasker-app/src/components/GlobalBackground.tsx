import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface GlobalBackgroundProps {
  showClouds?: boolean;
  dimmed?: boolean;
}

export const GlobalBackground: React.FC<GlobalBackgroundProps> = () => {
  return <View style={styles.container} pointerEvents="none" />;
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.colors.background,
  },
});
