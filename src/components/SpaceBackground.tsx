import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 60;
const STAR_COLORS = ['#FFFFFF', '#E2E8F0', '#94A3B8', '#FDE047'];

export const SpaceBackground: React.FC = () => {
  const [stars] = useState(() => {
    return Array.from({ length: STAR_COUNT }).map((_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      duration: Math.random() * 3000 + 2000,
      randomOffset: Math.random(),
      animValue: new Animated.Value(0),
    }));
  });

  useEffect(() => {
    const animations = stars.map(s => {
      s.animValue.setValue(s.randomOffset);
      return Animated.loop(
        Animated.sequence([
          Animated.timing(s.animValue, {
            toValue: 1,
            duration: s.duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(s.animValue, {
            toValue: 0,
            duration: s.duration / 2,
            useNativeDriver: true,
          })
        ])
      );
    });
    Animated.parallel(animations).start();
  }, [stars]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        style={StyleSheet.absoluteFill}
      />
      {stars.map((s) => {
        const opacity = s.animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.1, 0.8],
        });

        return (
          <Animated.View
            key={s.id}
            style={[
              styles.star,
              {
                left: s.x,
                top: s.y,
                width: s.size,
                height: s.size,
                borderRadius: s.size / 2,
                backgroundColor: s.color,
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
  },
});
