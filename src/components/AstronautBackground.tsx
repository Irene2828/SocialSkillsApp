import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const generateStars = (count: number) => {
  const stars = [];
  // Use a seeded or consistent approach, but Math.random is fine if it runs once per mount.
  // To avoid layout shifts on re-renders, we use useMemo.
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
    });
  }
  return stars;
};

export const AstronautBackground = () => {
  const stars = useMemo(() => generateStars(40), []);

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
            left: star.x,
            top: star.y,
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
