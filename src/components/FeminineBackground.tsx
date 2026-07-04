import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const SPARKLE_COUNT = 30;

export const FeminineBackground: React.FC = () => {
  const [sparkles] = useState(() => {
    return Array.from({ length: SPARKLE_COUNT }).map((_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 6 + 4,
      duration: Math.random() * 2000 + 1500,
      randomOffset: Math.random(),
      animValue: new Animated.Value(0),
    }));
  });

  useEffect(() => {
    const animations = sparkles.map(s => {
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
  }, [sparkles]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={['#FDF2F8', '#FCE7F3', '#FBCFE8']}
        style={StyleSheet.absoluteFill}
      />
      {sparkles.map((s) => {
        const opacity = s.animValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.1, 0.9, 0.1],
        });
        const scale = s.animValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.5, 1.2, 0.5],
        });

        return (
          <Animated.View
            key={s.id}
            style={[
              styles.sparkle,
              {
                left: s.x,
                top: s.y,
                width: s.size,
                height: s.size,
                borderRadius: s.size / 2,
                opacity,
                transform: [{ scale }],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  sparkle: {
    position: 'absolute',
    backgroundColor: '#F472B6', // subtle pink
  },
});
