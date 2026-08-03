import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CLOUD_COUNT = 15;
const CLOUD_COLORS = [
  'rgba(255, 255, 255, 0.55)',
  'rgba(224, 242, 254, 0.45)', // very light blue-white
  'rgba(240, 249, 255, 0.5)',  // sky white
  'rgba(186, 230, 253, 0.35)', // soft pastel blue-grey cloud
  'rgba(255, 255, 255, 0.4)',
];

export const AnimatedCloudsBackground: React.FC = () => {
  const { width, height } = useWindowDimensions();

  const [clouds] = useState(() => {
    return Array.from({ length: CLOUD_COUNT }).map((_, i) => {
      // Space vertically across the screen
      const yFraction = Math.random(); 
      
      return {
        id: i,
        yFraction,
        size: Math.random() * 20 + 24, // 24px to 44px clouds
        color: CLOUD_COLORS[Math.floor(Math.random() * CLOUD_COLORS.length)],
        duration: Math.random() * 20000 + 25000, // Gentle drift: 25s to 45s
        randomOffset: Math.random(), // 0 to 1 start offset
        animValue: new Animated.Value(0),
      };
    });
  });

  useEffect(() => {
    const animations = clouds.map(c => {
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
  }, [clouds]);

  return (
    <View style={styles.container} pointerEvents="none">
      {clouds.map(c => {
        // Drift horizontally from right to left (offscreen to offscreen)
        const translateX = c.animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [width + 60, -60],
        });

        // Soft vertical sway for a natural floating effect
        const translateY = c.animValue.interpolate({
          inputRange: [0, 0.25, 0.5, 0.75, 1],
          outputRange: [0, -8, 0, 8, 0],
        });
        
        const opacity = c.animValue.interpolate({
          inputRange: [0, 0.1, 0.9, 1],
          outputRange: [0, 0.8, 0.8, 0], // Fade in/out at screen bounds
        });

        return (
          <Animated.View
            key={c.id}
            style={[
              styles.cloud,
              {
                top: c.yFraction * height,
                opacity,
                transform: [
                  { translateX },
                  { translateY }
                ]
              }
            ]}
          >
            <Ionicons name="cloud" size={c.size} color={c.color} />
          </Animated.View>
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
    overflow: 'hidden',
  },
  cloud: {
    position: 'absolute',
  },
});
