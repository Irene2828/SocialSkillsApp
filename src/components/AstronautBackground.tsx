import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const generateStarFractions = (count: number) => {
  const stars = [];
  // Store positions as 0..1 fractions so they scale with any screen size.
  // This also correctly handles iPad orientation changes at runtime.
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      xFraction: Math.random(),
      yFraction: Math.random(),
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
    });
  }
  return stars;
};

export const AstronautBackground = () => {
  // useWindowDimensions() is reactive — updates on iPad orientation changes.
  // The old module-level Dimensions.get('window') was a static snapshot.
  const { width, height } = useWindowDimensions();
  const stars = useMemo(() => generateStarFractions(40), []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={['#0B0F19', '#1A112A', '#0A0A0E']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      {stars.map(star => (
        <View
          key={star.id}
          style={{
            position: 'absolute',
            left: star.xFraction * width,
            top: star.yFraction * height,
            width: star.size,
            height: star.size,
            borderRadius: star.size / 2,
            backgroundColor: '#FFFFFF',
            opacity: star.opacity,
          }}
        />
      ))}
    </View>
  );
};
