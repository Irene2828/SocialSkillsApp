import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, StyleProp, TextStyle, Easing, useWindowDimensions } from 'react-native';

interface AnimatedExplodingWordProps {
  word: string;
  style?: StyleProp<TextStyle>;
}

// Seeded pseudo-random so it's always the same chaotic pattern
const seededRandom = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

export const AnimatedExplodingWord: React.FC<AnimatedExplodingWordProps> = ({ word, style }) => {
  const letters = word.split('');
  const { width } = useWindowDimensions();

  // Separate anim values for position/opacity and rotation
  const posAnims = useRef(letters.map(() => new Animated.Value(0))).current;
  const rotAnims = useRef(letters.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    posAnims.forEach(a => a.setValue(0));
    rotAnims.forEach(a => a.setValue(0));

    const anims = letters.map((_, index) => {
      const delay = index * 110; // slow stagger so each letter is distinct

      // Position: slow chaotic flight then snap to rest
      const posAnim = Animated.timing(posAnims[index], {
        toValue: 1,
        duration: 900,
        delay,
        easing: Easing.bezier(0.2, 0, 0.1, 1), // slow start, fast finish snap
        useNativeDriver: true,
      });

      // Rotation: long spin that rapidly decelerates into place
      const rotAnim = Animated.timing(rotAnims[index], {
        toValue: 1,
        duration: 900,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      });

      return Animated.parallel([posAnim, rotAnim]);
    });

    Animated.parallel(anims).start();
  }, [word]);

  return (
    <View style={styles.container}>
      {letters.map((letter, index) => {
        // Chaotic starting scatter — different for each letter using seeded random
        const r1 = seededRandom(index * 3);
        const r2 = seededRandom(index * 3 + 1);
        const r3 = seededRandom(index * 3 + 2);

        // Letters scatter from a wide area around the top-left
        // Mix of close and far letters for chaos
        const startX = -(r1 * 320 + 80);      // -80 to -400
        const startY = -(r2 * 280 + 60);      // -60 to -340

        // Spin amount: 1 to 3 full rotations, direction varies
        const spinDir = index % 2 === 0 ? 1 : -1;
        const spinDeg = spinDir * (360 + r3 * 720); // 360-1080 degrees of spin

        const translateX = posAnims[index].interpolate({
          inputRange: [0, 1],
          outputRange: [startX, 0],
        });

        const translateY = posAnims[index].interpolate({
          inputRange: [0, 1],
          outputRange: [startY, 0],
        });

        const rotate = rotAnims[index].interpolate({
          inputRange: [0, 1],
          outputRange: [`${spinDeg}deg`, '0deg'],
        });

        const opacity = posAnims[index].interpolate({
          inputRange: [0, 0.1, 0.85, 1],
          outputRange: [0, 1, 1, 1],
        });

        const scale = posAnims[index].interpolate({
          inputRange: [0, 0.6, 0.85, 1],
          outputRange: [0.3, 1.15, 0.95, 1], // slight overshoot then settle
        });

        return (
          <Animated.Text
            key={index}
            style={[
              style,
              {
                opacity,
                transform: [
                  { translateX },
                  { translateY },
                  { rotate },
                  { scale },
                ],
              },
            ]}
          >
            {letter}
          </Animated.Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
