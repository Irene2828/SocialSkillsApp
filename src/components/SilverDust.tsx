import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, useWindowDimensions } from 'react-native';

const DUST_COUNT = 25;
const COLORS = ['#E5E7EB', '#D1D5DB', '#9CA3AF', '#F3F4F6']; // various silver shades

export const SilverDust: React.FC = () => {
  // useWindowDimensions() is reactive — updates on iPad orientation changes.
  // The old module-level Dimensions.get('window') was a static snapshot.
  const { width, height } = useWindowDimensions();

  // Use a state to hold our particles so they don't recreate on every render
  const [particles] = useState(() => {
    return Array.from({ length: DUST_COUNT }).map((_, i) => ({
      id: i,
      xFraction: Math.random(), // store as 0..1 fraction, multiply by width at render time
      size: Math.random() * 6 + 4, // 4px to 10px
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 1500,
      duration: Math.random() * 2000 + 3000, // 3s to 5s
      animValue: new Animated.Value(0),
      swayA: (Math.random() - 0.5) * 100,
      swayB: (Math.random() - 0.5) * 150,
    }));
  });

  useEffect(() => {
    const animations = particles.map(p =>
      Animated.sequence([
        Animated.delay(p.delay),
        Animated.timing(p.animValue, {
          toValue: 1,
          duration: p.duration,
          useNativeDriver: true,
        })
      ])
    );

    Animated.parallel(animations).start();
  }, [particles]);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map(p => {
        const translateY = p.animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, height + 50],
        });
        
        const opacity = p.animValue.interpolate({
          inputRange: [0, 0.1, 0.8, 1],
          outputRange: [0, 0.8, 0.8, 0],
        });

        // Add a slight sway — use pre-computed values from state to avoid
        // regenerating random numbers on every render
        const translateX = p.animValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, p.swayA, p.swayB],
        });

        return (
          <Animated.View
            key={p.id}
            style={[
              styles.particle,
              {
                left: p.xFraction * width,
                width: p.size,
                height: p.size,
                borderRadius: p.size / 2,
                backgroundColor: p.color,
                opacity,
                transform: [
                  { translateY },
                  { translateX }
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
    zIndex: 999, // Float over most things
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    top: 0,
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
});

