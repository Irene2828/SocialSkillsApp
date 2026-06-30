import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const CUBE_COUNT = 30;
const CUBE_COLORS = ['#E5E7EB', '#D1D5DB', '#F3F4F6', '#FFFFFF'];

export const AnimatedCubesBackground: React.FC = () => {
  const [cubes] = useState(() => {
    return Array.from({ length: CUBE_COUNT }).map((_, i) => ({
      id: i,
      x: Math.random() * width,
      size: Math.random() * 12 + 6, // 6px to 18px cubes
      color: CUBE_COLORS[Math.floor(Math.random() * CUBE_COLORS.length)],
      duration: Math.random() * 10000 + 15000, // Very slow float: 15s to 25s
      rotationDir: Math.random() > 0.5 ? 1 : -1,
      randomOffset: Math.random(), // 0 to 1
      animValue: new Animated.Value(0),
    }));
  });

  useEffect(() => {
    const animations = cubes.map(c => {
      c.animValue.setValue(c.randomOffset);
      return Animated.sequence([
        Animated.timing(c.animValue, {
          toValue: 1,
          duration: c.duration * (1 - c.randomOffset),
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(c.animValue, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(c.animValue, {
              toValue: 1,
              duration: c.duration,
              useNativeDriver: true,
            })
          ])
        )
      ]);
    });
    Animated.parallel(animations).start();
  }, [cubes]);

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Soft gradient background */}
      <LinearGradient
        colors={['#F0F1F3', '#FFFFFF']}
        style={StyleSheet.absoluteFill}
      />

      {cubes.map(c => {
        const translateY = c.animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [height + 50, -100], // Float from bottom to top
        });
        
        const rotate = c.animValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${360 * c.rotationDir * 2}deg`], // Rotate 2 full times during the journey
        });
        
        const opacity = c.animValue.interpolate({
          inputRange: [0, 0.1, 0.9, 1],
          outputRange: [0, 0.6, 0.6, 0], // Fade in at bottom, fade out at top
        });

        return (
          <Animated.View
            key={c.id}
            style={[
              styles.cube,
              {
                left: c.x,
                width: c.size,
                height: c.size,
                backgroundColor: c.color,
                opacity,
                transform: [
                  { translateY },
                  { rotate }
                ]
              }
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1, 
    overflow: 'hidden',
  },
  cube: {
    position: 'absolute',
    top: 0,
    borderRadius: 2, // Slight rounding so they aren't painfully sharp
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
});
