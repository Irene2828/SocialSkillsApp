import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const STAR_COUNT = 30;
const STAR_COLORS = [
  'rgba(255, 255, 255, 0.95)',
  'rgba(186, 230, 253, 0.9)', // light cyan-blue star
  'rgba(254, 240, 138, 0.95)', // pale yellow star
  'rgba(255, 255, 255, 0.8)',
];

export const AnimatedCloudsBackground: React.FC = () => {
  const { width, height } = useWindowDimensions();

  const [stars] = useState(() => {
    return Array.from({ length: STAR_COUNT }).map((_, i) => {
      const xFraction = Math.random(); 
      const yFraction = Math.random(); 
      
      return {
        id: i,
        xFraction,
        yFraction,
        size: Math.random() * 8 + 6, // 6px to 14px stars
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        twinkleDuration: Math.random() * 2000 + 1500, // Twinkle speed: 1.5s to 3.5s
        animValue: new Animated.Value(Math.random()), // Random initial opacity phase
      };
    });
  });

  useEffect(() => {
    const animations = stars.map(s => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(s.animValue, {
            toValue: 0.15,
            duration: s.twinkleDuration,
            useNativeDriver: true,
          }),
          Animated.timing(s.animValue, {
            toValue: 1.0,
            duration: s.twinkleDuration,
            useNativeDriver: true,
          })
        ])
      );
    });
    Animated.parallel(animations).start();
  }, [stars]);

  return (
    <View style={styles.container} pointerEvents="none">
      {stars.map(s => {
        return (
          <Animated.View
            key={s.id}
            style={[
              styles.star,
              {
                left: s.xFraction * width,
                top: s.yFraction * height,
                opacity: s.animValue,
              }
            ]}
          >
            <Ionicons name="star" size={s.size} color={s.color} />
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
  },
});
