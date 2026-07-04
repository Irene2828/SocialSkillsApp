import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const LEAF_COUNT = 20;

export const NatureBackground: React.FC = () => {
  const [leaves] = useState(() => {
    return Array.from({ length: LEAF_COUNT }).map((_, i) => ({
      id: i,
      x: Math.random() * width,
      size: Math.random() * 10 + 8,
      duration: Math.random() * 8000 + 12000,
      randomOffset: Math.random(),
      rotationDir: Math.random() > 0.5 ? 1 : -1,
      animValue: new Animated.Value(0),
    }));
  });

  useEffect(() => {
    const animations = leaves.map(l => {
      l.animValue.setValue(l.randomOffset);
      return Animated.sequence([
        Animated.timing(l.animValue, {
          toValue: 1,
          duration: l.duration * (1 - l.randomOffset),
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(l.animValue, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(l.animValue, {
              toValue: 1,
              duration: l.duration,
              useNativeDriver: true,
            })
          ])
        )
      ]);
    });
    Animated.parallel(animations).start();
  }, [leaves]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={['#ECFDF5', '#D1FAE5', '#A7F3D0']}
        style={StyleSheet.absoluteFill}
      />
      {leaves.map((l) => {
        const translateY = l.animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, height + 20],
        });
        const translateX = l.animValue.interpolate({
          inputRange: [0, 0.25, 0.5, 0.75, 1],
          outputRange: [0, 20 * l.rotationDir, 0, -20 * l.rotationDir, 0],
        });
        const rotate = l.animValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${360 * l.rotationDir}deg`],
        });

        return (
          <Animated.View
            key={l.id}
            style={[
              styles.leaf,
              {
                left: l.x,
                width: l.size,
                height: l.size * 1.5,
                transform: [{ translateY }, { translateX }, { rotate }],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  leaf: {
    position: 'absolute',
    backgroundColor: '#6EE7B7',
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    opacity: 0.4,
  },
});
