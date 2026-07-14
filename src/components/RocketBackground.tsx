import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const generateStarFractions = (count: number) => {
  const stars = [];
  // Store positions as 0..1 fractions so they scale with any screen size,
  // including iPad orientation changes at runtime.
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      xFraction: Math.random(),
      yFraction: Math.random(),
      size: Math.random() * 2 + 0.8,
      opacity: Math.random() * 0.35 + 0.15,
    });
  }
  return stars;
};

export const RocketBackground = () => {
  // useWindowDimensions() is reactive — updates on iPad orientation changes.
  // The old module-level Dimensions.get('window') was a static snapshot.
  const { width, height } = useWindowDimensions();
  // Slightly denser star field for rocket
  const stars = useMemo(() => generateStarFractions(50), []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={['#061224', '#0B1B36', '#080C16']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 1, y: 0.8 }}
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
            backgroundColor: '#E2E8F0', // Slightly bluer/cooler white
            opacity: star.opacity,
          }}
        />
      ))}
    </View>
  );
};
