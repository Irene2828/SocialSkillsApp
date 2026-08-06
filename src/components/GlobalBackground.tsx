import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AnimatedCloudsBackground } from './AnimatedCloudsBackground';

interface GlobalBackgroundProps {
  showClouds?: boolean;
  dimmed?: boolean;
}

export const GlobalBackground: React.FC<GlobalBackgroundProps> = ({ showClouds = false, dimmed = true }) => {
  return (
    <View style={styles.container} pointerEvents="none">
      {showClouds && <AnimatedCloudsBackground />}
      {dimmed && <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(15, 23, 42, 0.45)' }]} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    minHeight: '100%',
  },
});
