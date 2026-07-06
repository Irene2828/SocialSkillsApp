import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const generateStars = (count: number) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      opacity: Math.random() * 0.35 + 0.15,
    });
  }
  return stars;
};

export const RocketBackground = () => {
  // Slightly denser star field for rocket
  const stars = useMemo(() => generateStars(50), []);

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
            left: star.x,
            top: star.y,
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
